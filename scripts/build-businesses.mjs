/* Post-build step 1c: a real static page per PUBLISHED business.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * The sibling of build-profiles.mjs, for the same reason and with the same
 * mechanics. /business/<slug> is a share target — a seller posting ONE
 * brand's numbers points here rather than at their whole portfolio — so a
 * cold link has to answer HTTP 200 with something readable in it.
 *
 * Business slugs are dynamic and unbounded, so postbuild-spa-routes.mjs's
 * static-route list cannot cover them: there is no list to put them in.
 * Serving them from the client route alone would work for humans and be
 * invisible to everything else — a crawler, or an assistant following a link
 * out of a Reddit thread, would get the empty SPA shell on an HTTP 404.
 *
 * ── The staleness tradeoff, stated plainly (same as profiles) ────────────
 * These pages are as fresh as the last deploy. A business published after it
 * still WORKS — the client route fetches live — but it is served by 404.html,
 * so it answers HTTP 404 until the next build, and crawlers will skip it.
 * .github/workflows/rebuild.yml rebuilds on a schedule to close that window.
 * The window is WIDER here than for profiles in one way worth knowing: a
 * seller who disconnects and reconnects gets a NEW slug (the backend does not
 * tombstone the old one), so their previously-built page keeps answering 200
 * with stale numbers until the next build removes it. Both are the same fix
 * if it matters: build on publish (repository_dispatch) rather than on a
 * schedule.
 *
 * Never fails the build: the marketing site must still deploy when the API is
 * down. It logs loudly and emits nothing instead.
 *
 * 🚨 RUNS BEFORE postbuild-spa-routes.mjs, and the order is load-bearing —
 * that script rewrites dist/index.html in place with the HOMEPAGE's title and
 * canonical, so reading the shell afterwards gives every page two of each.
 * See the same note in build-profiles.mjs, which is where that was learned.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { API_BASE, SITE, BRAND_NAME, businessPath } from '../src/data/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const shellFile = join(dist, 'index.html');
if (!existsSync(shellFile)) {
  console.error('build-businesses: dist/index.html not found — run vite build first');
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
  index = await getJson(`${API_BASE}/v1/public/businesses/index.json`);
} catch (err) {
  console.warn(`build-businesses: SKIPPED — could not read the business index (${err.message}).`);
  console.warn('build-businesses: the site still deploys; businesses will be client-rendered only.');
  process.exit(0);
}

const list = Array.isArray(index?.businesses) ? index.businesses : [];
if (list.length === 0) {
  console.log('build-businesses: no published businesses yet — nothing to prerender');
  process.exit(0);
}

/* The backend's own slug shape (src/services/connections/slugs.ts). Enforced
 * here too because this value becomes a DIRECTORY NAME — never write a path
 * from unvalidated input. */
const SLUG_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*-\d{5}$/;

let written = 0;
const failed = [];
for (const { slug } of list) {
  if (!slug || !SLUG_RE.test(slug)) continue;
  let b;
  try {
    b = await getJson(`${API_BASE}/v1/public/businesses/${encodeURIComponent(slug)}`);
  } catch (err) {
    // The index is filtered over the DEFAULT window and this fetch uses the
    // same one, so a miss here is a genuine race (published or unpublished
    // between the two calls), not a routine mismatch. Skip it and say so.
    failed.push(`${slug} (${err.message})`);
    continue;
  }

  /* ⚠️ TRAILING SLASH, deliberately — GitHub Pages serves these as
   * directories, so the unslashed form 301s. canonical, og:url and the
   * sitemap must all name the URL actually served. Same rule as profiles. */
  const url = `${SITE}${businessPath(b.slug)}`;
  /* 🚨 `b.name` is DERIVED from the slug by the backend ("Amazon FBA 48213").
   * It is not the seller's account name, and there is no field in this
   * payload that is — the profile renders a blurred "Stealth Brand" for
   * exactly the same reason. Never reach for anything else to title this
   * page; the backend's own privacy test is what keeps the payload clean. */
  const name = b.name;
  /* `b.profile` is null for an ORPHAN — a business no one has claimed. The
   * description below must not then read "one business of @" with an empty
   * handle, which is what the old unconditional fallback produced. */
  const owner = b.profile
    ? b.profile.is_ghost
      ? 'anonymous founder'
      : b.profile.display_name || `@${b.profile.username}`
    : null;
  const tier = b.verification?.label ?? 'Unverified';
  const margin = b.metrics?.margin_pct != null ? `${b.metrics.margin_pct.toFixed(1)}% margin. ` : '';
  const title = `${name} — ${BRAND_NAME}`;
  const description = (
    owner
      ? `${name}, one business of ${owner} on ${BRAND_NAME}. ${margin}${tier}.`
      : `${name} on ${BRAND_NAME}. ${margin}${tier}.`
  ).trim().slice(0, 300);

  const head = [
    `<meta name="description" content="${esc(description)}" />`,
    // The backend decides indexability — this page must not overrule it.
    b.noindex ? `<meta name="robots" content="noindex, follow" />` : '',
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].filter(Boolean).join('\n    ');

  /* ⚠️ Not ProfilePage and not Organization: this is a page ABOUT one
   * business belonging to a profile, and it deliberately does not name the
   * business. WebPage with an `isPartOf` pointer to the seller's profile is
   * the honest description; claiming Organization would assert an identity
   * this page is designed not to publish. No aggregateRating — there are no
   * reviews, and a margin is not a rating. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#business`,
    url,
    name: title,
    ...(b.profile?.username
      ? { isPartOf: { '@type': 'ProfilePage', '@id': `${SITE}/${b.profile.username}/#profile` } }
      : {}),
  };

  /* ⚠️ This block IS the crawlable page — there is no puppeteer prerender in
   * this repo, so whatever is not written here is invisible to a crawler no
   * matter how good the client render is. Emit what the payload holds and
   * nothing it does not: never invent a number, and never present an
   * unverified figure as verified. Every field below is already gated by the
   * seller's own visibility toggles server-side, so a `null` here is a
   * deliberate withholding and is simply omitted. */
  const d = b.metrics?.display ?? {};
  const last30 = b.metrics?.last_30d ?? {};
  /* PROFIT when it is computable, revenue otherwise — the same rule the
   * client applies (`headlineMoney` in src/pages/Business.tsx), and it has to
   * be the same or a crawler and a reader see different headline figures on
   * one URL. `profit` is non-null only when COGS covers every month in the
   * window, so falling back to revenue never silently downgrades a real
   * profit figure into a partial one. */
  const headline = (period, currency, revenue, profit) =>
    profit != null
      ? `Profit (${period}, ${currency ?? 'USD'}): ${Math.round(profit).toLocaleString('en-US')}`
      : revenue != null
        ? `Revenue (${period}, ${currency ?? 'USD'}): ${Math.round(revenue).toLocaleString('en-US')}`
        : null;

  const facts = [
    headline('30d', d.currency, last30.revenue, last30.profit),
    last30.margin_pct != null ? `Margin (30d): ${last30.margin_pct.toFixed(1)}%` : null,
    headline(`${b.window?.months ?? 12}m`, d.currency, d.revenue, d.profit),
    b.metrics?.margin_pct != null ? `Margin (${b.window?.months ?? 12}m): ${b.metrics.margin_pct.toFixed(1)}%` : null,
    b.metrics?.sku_count ? `SKUs: ${b.metrics.sku_count}` : null,
    b.metrics?.brand_count ? `${b.metrics.brands_label ?? 'Brands'}: ${b.metrics.brand_count}` : null,
    b.metrics?.category ? `Category: ${b.metrics.category}` : null,
    b.seller_type ? `Seller type: ${String(b.seller_type).replace(/_/g, ' ')}` : null,
    Array.isArray(b.markets) && b.markets.length ? `Marketplaces: ${b.markets.join(', ')}` : null,
    /* No "Covering …" line: the window was removed from the rendered page, and
     * a crawlable copy that states a fact the page does not is the exact
     * divergence this prerender exists to avoid. The window still bounds every
     * figure above — it is simply not called out. */
  ].filter(Boolean);

  const body = [
    `<h1>${esc(name)}</h1>`,
    `<p>${esc(b.label ?? '')}${b.markets?.length ? ` — ${esc(b.markets.join(', '))}` : ''}</p>`,
    `<p>${esc(tier)}</p>`,
    facts.length ? `<ul>${facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '',
    b.metrics?.margin_note ? `<p>${esc(b.metrics.margin_note)}</p>` : '',
    // The backend's own caveats, verbatim — it is the only thing that knows
    // why a figure is missing or flattering.
    ...(Array.isArray(b.notes) ? b.notes.map((n) => `<p>${esc(n)}</p>`) : []),
    /* An orphan still names a founder: its GHOST, at /af-<digits>. "One
       business of" nothing reads as missing data rather than as "nobody has
       claimed this". The link text matches the rendered page — "anonymous
       founder", not the ghost's longer page title — so a crawler and a
       reader see the same sentence. */
    b.profile?.username
      ? `<p>One business of <a href="${SITE}/${esc(b.profile.username)}/">${
          b.profile.is_ghost ? '<em>anonymous founder</em>' : esc(owner)
        }</a></p>`
      : '',
    `<p><a href="${SITE}/">What is ${esc(BRAND_NAME)}?</a></p>`,
  ].filter(Boolean).join('\n        ');

  let html = SHELL;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>\n    ${head}`);
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` +
    // Handed to the client so the first render needs no round trip. Escaped
    // for `</script>` so no string in it can break out of the tag.
    `  <script>window.__BUSINESS__=${JSON.stringify(b).replace(/</g, '\\u003c')}</script>\n  </head>`,
  );
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div data-prerender="1" style="max-width:44rem;margin:0 auto;padding:4rem 1.5rem;font-family:system-ui,sans-serif">\n        ${body}\n      </div></div>`,
  );

  /* Built from the same path helper the canonical uses, so the file we write
   * and the URL we advertise cannot drift. */
  const dir = join(dist, ...businessPath(b.slug).split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  written++;
}

if (failed.length) console.warn(`build-businesses: ${failed.length} business(es) failed: ${failed.join(', ')}`);
console.log(`build-businesses: wrote ${written}/${list.length} business page(s)`);
