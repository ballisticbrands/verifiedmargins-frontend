/* Post-build step 1b: a real static page per PUBLISHED profile.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Published profiles are the product's public surface — the thing search
 * engines and AI assistants are supposed to be able to read. They are also
 * dynamic, so they cannot come from src/data/site.js like the static pages do.
 *
 * Serving them from the client route alone would work for humans and be
 * invisible to everything else: a crawler would get the empty SPA shell. That
 * is exactly the defect Phase 3b of the funnel playbook exists to prevent, and
 * on this product it would defeat the entire premise — see public/llms.txt,
 * which promises these pages are readable.
 *
 * So: fetch the index, fetch each profile, write a route stub carrying real
 * title/description/OG/JSON-LD plus the payload. scripts/prerender.mjs then
 * bakes React's actual rendered output into each one, and
 * generate-sitemap.mjs picks them up from dist/ automatically.
 *
 * ── The staleness tradeoff, stated plainly ───────────────────────────────
 * These pages are as fresh as the last deploy. A profile published after it
 * still WORKS — the client route fetches live — but it is served by 404.html,
 * so it answers HTTP 404 until the next build, and crawlers will skip it.
 * .github/workflows/rebuild.yml rebuilds on a schedule to close that window.
 * If profiles ever become high-volume this should move to on-publish
 * (repository_dispatch from the backend) or to a real server.
 *
 * Never fails the build: the marketing site must still deploy when the API is
 * down. It logs loudly and emits nothing instead.
 *
 * 🚨 RUNS BEFORE postbuild-spa-routes.mjs, and the order is load-bearing. That
 * script rewrites dist/index.html in place with the HOMEPAGE's title,
 * description and canonical. Reading the shell afterwards gave every profile
 * page two <meta description> tags and two <link rel="canonical"> — one its
 * own, one the homepage's. Duplicate canonicals are worse than none: the
 * crawler either ignores both or believes the wrong one, which would have
 * pointed every profile at the homepage.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { API_BASE, SITE, BRAND_NAME } from '../src/data/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const shellFile = join(dist, 'index.html');
if (!existsSync(shellFile)) {
  console.error('build-profiles: dist/index.html not found — run vite build first');
  process.exit(1);
}
const SHELL = readFileSync(shellFile, 'utf8');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function getJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

let index;
try {
  index = await getJson(`${API_BASE}/v1/public/profiles/index.json`);
} catch (err) {
  console.warn(`build-profiles: SKIPPED — could not read the profile index (${err.message}).`);
  console.warn('build-profiles: the site still deploys; profiles will be client-rendered only.');
  process.exit(0);
}

const list = Array.isArray(index?.profiles) ? index.profiles : [];
if (list.length === 0) {
  console.log('build-profiles: no published profiles yet — nothing to prerender');
  process.exit(0);
}

let written = 0;
const failed = [];
for (const { username } of list) {
  if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) continue; // never write a path from unvalidated input
  let p;
  try {
    p = await getJson(`${API_BASE}/v1/public/profiles/${encodeURIComponent(username)}`);
  } catch (err) {
    failed.push(`${username} (${err.message})`);
    continue;
  }

  const name = p.display_name || p.username;
  /* ⚠️ TRAILING SLASH, deliberately. GitHub Pages serves these as directories,
   * so /ggballas answers 301 → /ggballas/. The sitemap (generate-sitemap.mjs)
   * also emits the slashed form. A canonical pointing at a URL that redirects
   * to the real page is a wasted signal and risks being ignored outright —
   * canonical, og:url and sitemap must all name the URL actually served. */
  const url = `${SITE}/${p.username}/`;
  const tier = p.verification?.label ?? 'Unverified';
  const margin =
    p.metrics?.display?.margin_pct != null ? `${p.metrics.display.margin_pct.toFixed(1)}% margin. ` : '';
  const title = `${name} — ${BRAND_NAME}`;
  const description =
    `${name} on ${BRAND_NAME}. ${margin}${tier}: ${p.verification?.description ?? ''}`.trim().slice(0, 300);

  const head = [
    `<meta name="description" content="${esc(description)}" />`,
    // The backend decides indexability (unclaimed profiles set noindex) — this
    // page must not overrule it.
    p.noindex ? `<meta name="robots" content="noindex, follow" />` : '',
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].filter(Boolean).join('\n    ');

  /* ⚠️ ProfilePage, not Organization or Product: this describes a person or
   * business's profile page, and claiming otherwise is the kind of schema
   * mismatch that earns a manual action. Deliberately NO aggregateRating —
   * there are no reviews, and a margin is not a rating. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: title,
    mainEntity: {
      '@type': p.type === 'seller' ? 'Organization' : 'Person',
      name,
      identifier: p.username,
      ...(p.website_url ? { url: p.website_url } : {}),
    },
  };

  /* Everything the payload actually holds.
   *
   * ⚠️ This block IS the crawlable page. This repo has no puppeteer prerender
   * step (the app mounts with createRoot, and a baked React tree would be
   * cleared and re-rendered on mount — the CLS defect Phase 3c documents), so
   * whatever is not written here is invisible to a crawler no matter how good
   * the client render is. Emit what the profile knows, and nothing it does
   * not: never invent a number, and never present an unverified figure as
   * verified — the tier line above is the whole product. */
  const d = p.metrics?.display ?? {};
  const facts = [
    d.margin_pct != null ? `Margin: ${d.margin_pct.toFixed(1)}%` : null,
    d.revenue != null ? `Revenue (${d.currency}): ${Math.round(d.revenue).toLocaleString('en-US')}` : null,
    p.metrics?.sku_count ? `SKUs: ${p.metrics.sku_count}` : null,
    p.metrics?.brand_count ? `${p.metrics.brands_label ?? 'Brands'}: ${p.metrics.brand_count}` : null,
    p.metrics?.category ? `Category: ${p.metrics.category}` : null,
    p.seller_type ? `Seller type: ${String(p.seller_type).replace(/_/g, ' ')}` : null,
    p.window ? `Covering ${p.window.from} to ${p.window.through}` : null,
  ].filter(Boolean);

  const body = [
    `<h1>${esc(name)}</h1>`,
    `<p>/${esc(p.username)}</p>`,
    `<p>${esc(tier)} — ${esc(p.verification?.description ?? '')}</p>`,
    p.bio ? `<p>${esc(p.bio)}</p>` : '',
    facts.length ? `<ul>${facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '',
    p.metrics?.margin_note ? `<p>${esc(p.metrics.margin_note)}</p>` : '',
    p.website_url ? `<p><a href="${esc(p.website_url)}" rel="nofollow noopener">Website</a></p>` : '',
    `<p><a href="${SITE}/">What is ${esc(BRAND_NAME)}?</a></p>`,
  ].filter(Boolean).join('\n        ');

  let html = SHELL;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>\n    ${head}`);
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` +
    // Handed to the client so the first render needs no round trip. Escaped
    // for `</script>` so a bio containing one cannot break out of the tag.
    `  <script>window.__PROFILE__=${JSON.stringify(p).replace(/</g, '\\u003c')}</script>\n  </head>`,
  );
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div data-prerender="1" style="max-width:44rem;margin:0 auto;padding:4rem 1.5rem;font-family:system-ui,sans-serif">\n        ${body}\n      </div></div>`,
  );

  const dir = join(dist, p.username);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  written++;
}

if (failed.length) console.warn(`build-profiles: ${failed.length} profile(s) failed: ${failed.join(', ')}`);
console.log(`build-profiles: wrote ${written}/${list.length} profile page(s)`);
