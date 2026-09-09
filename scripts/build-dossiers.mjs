/* Post-build step 1d: a real static page per PUBLISHED SOURCED DOSSIER.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * The sibling of build-businesses.mjs, and the same reason: /brand/<slug> is a
 * share target, so a cold link has to answer HTTP 200 with something readable
 * in it rather than the empty SPA shell on a 404.
 *
 * It differs from that script in one way that matters: a business page is
 * built from the LIVE API, so it can only be as fresh as the last deploy. A
 * dossier is built from a fixture in this repo, so the static page and the
 * client render come from the same source and cannot disagree. There is no
 * staleness window here at all.
 *
 * ── Why these routes are NOT in site.mjs's PUBLIC_PAGES ──────────────────
 * 🚨 postbuild-spa-routes.mjs copies dist/index.html over every route in that
 * list. It would overwrite the per-page head this script just wrote —
 * silently, leaving a page that renders correctly and shares as the generic
 * site card. Same reason business pages are absent from it.
 *
 * generate-sitemap.mjs walks dist for directories containing an index.html, so
 * these pages enter the sitemap on their own once written. That is the whole
 * point: unlike a demo, a dossier is meant to be found.
 *
 * 🚨 RUNS BEFORE postbuild-spa-routes.mjs, and the order is load-bearing —
 * that script rewrites dist/index.html in place with the HOMEPAGE's title and
 * canonical, so reading the shell afterwards gives every page two of each.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE, BRAND_NAME } from '../src/data/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const shellPath = join(dist, 'index.html');

if (!existsSync(shellPath)) {
  console.error('build-dossiers: dist/index.html not found — run vite build first');
  process.exit(1);
}
const SHELL = readFileSync(shellPath, 'utf8');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* One entry per published dossier.
 *
 * Duplicated from src/dossiers/registry.ts on purpose: this is a plain .mjs
 * build script and that is a TypeScript module importing "@/…" path aliases,
 * so it cannot be required from here without a bundler. The fields below are
 * the ones the SOCIAL CARD needs, which is a much smaller set than the page's
 * — a name, a one-liner, and the figure worth putting in a preview.
 *
 * ⚠️ Keep in sync with the fixture. check-site-constants.mjs is where a
 * cross-check belongs if this list ever grows past a couple of entries. */
const DOSSIERS = [
  {
    slug: 'maryruth',
    brand: "MaryRuth's",
    what: 'liquid vitamins, gummies and liposomals',
    profit: '$7.70M / mo',
    revenue: '$16.4M / mo',
    margin: '47%',
    logo: '/demo/maryruth-logo.png',
  },
  {
    slug: 'spitehouse',
    brand: 'Spite House Games',
    what: 'grown-up gag card games',
    /* The three figures on the card, and the reason it is worth a card at all:
       a preview that says "Spite House Games" and nothing else is a preview
       nobody clicks. Profit and margin are MODELLED — the page says so with a
       ≈ on every one of them, and the description below says it in words so a
       reader who never clicks is not misled by the image. */
    profit: '$25,197 / mo',
    revenue: '$89,988 / mo',
    margin: '28%',
    logo: '/demo/spitehouse-logo.png',
  },
];

let written = 0;
for (const d of DOSSIERS) {
  /* ⚠️ TRAILING SLASH, deliberately — GitHub Pages serves these as
   * directories, so the unslashed form 301s. canonical, og:url and the
   * sitemap must all name the URL actually served. */
  const url = `${SITE}/brand/${d.slug}/`;
  const title = `${d.brand} — ${d.what} — ${BRAND_NAME}`;
  const description =
    `${d.brand}: ${d.revenue} revenue and an estimated ${d.profit} profit at ${d.margin}, ` +
    `modelled from public data. Every figure on the page names its source. ` +
    `Estimated — nobody at this business has spoken to us.`;
  const ogImage = `${SITE}/og/${d.slug}.png`;

  const head = [
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(`${d.brand} — ${d.profit} estimated profit`)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    /* 🚨 A per-dossier image, and therefore `summary_large_image` rather than
     * the `summary` business pages use. A 1200x630 card with the brand's own
     * logo and its profit figure in it is the whole point of the exercise —
     * and og:image MUST be absolute, because a relative one resolves against
     * the crawler's own host and silently yields no image at all. */
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${d.brand} — ${d.profit} estimated profit on ${BRAND_NAME}`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
  ].join('\n    ');

  /* WebPage, not Organization: this page is ABOUT a business we do not
   * represent and which has not spoken to us. No aggregateRating — there are
   * no reviews of this business here, and a margin is not a rating. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#dossier`,
    url,
    name: title,
    description,
    isPartOf: { '@type': 'WebSite', url: `${SITE}/`, name: BRAND_NAME },
  };

  /* A prerendered body, so a crawler that runs no JavaScript still gets the
   * figures and the caveat — same trick as build-businesses.mjs. */
  const body = [
    `<h1>${esc(d.brand)}</h1>`,
    `<p>${esc(d.what)} · estimated ${esc(d.revenue)} revenue, ${esc(d.profit)} profit at ${esc(d.margin)}</p>`,
    `<p><strong>Estimated.</strong> Nobody at this business has spoken to us. Every figure on this page names where it came from.</p>`,
    `<p><a href="${SITE}/leaderboard/">See the ${esc(BRAND_NAME)} leaderboard</a></p>`,
  ].join('\n        ');

  let html = SHELL;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>\n    ${head}`);
  /* 🚨 The shell carries the site-wide og:image (the 512px logo). Left in
   * place it wins or loses by crawler-dependent ordering, and the card becomes
   * a coin flip — so drop the shell's copy and let the per-page tags above be
   * the only ones. */
  html = html.replace(
    /\s*<meta property="og:image(?::(?:width|height))?" content="[^"]*logo-512[^"]*"[^>]*\/>/g,
    '',
  );
  html = html.replace(
    /\s*<meta property="og:image:(?:width|height)" content="512"[^>]*\/>/g,
    '',
  );
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
  );
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div data-prerender="1" style="max-width:44rem;margin:0 auto;padding:4rem 1.5rem;font-family:system-ui,sans-serif">\n        ${body}\n      </div></div>`,
  );

  const dir = join(dist, 'brand', d.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  written++;
}

console.log(`build-dossiers: wrote ${written}/${DOSSIERS.length} dossier page(s)`);
