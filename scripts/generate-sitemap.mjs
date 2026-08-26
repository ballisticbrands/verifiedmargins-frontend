/* Post-build step 3: emit dist/sitemap.xml from the routes that were actually
 * built.
 *
 * ── Why generated, never hand-written ────────────────────────────────────
 * A static public/sitemap.xml goes stale the moment someone adds a route. This
 * derives the URL list from dist/ — every directory holding an index.html — so
 * the sitemap and the prerender cannot drift apart.
 *
 * ── Conventions ──────────────────────────────────────────────────────────
 * • URLs carry a trailing slash, matching the <link rel="canonical"> that
 *   postbuild-spa-routes.mjs writes. A sitemap URL that disagrees with the
 *   page's own canonical is a wasted crawl.
 * • lastmod is the build date — these are pages redeployed on every content
 *   change, so build date is the honest signal.
 * • Nothing here invents URLs: if it isn't in dist/, it isn't in the sitemap.
 *
 * ── 🔜 Published seller profiles ──────────────────────────────────────────
 * VerifiedMargins' whole point is that a published profile is publicly
 * reachable — by search engines AND by AI assistants. Profiles are dynamic and
 * live behind the backend, so they cannot come from a dist/ walk. When the
 * profile backend lands, add a SECOND sitemap generated from the profile list
 * (e.g. dist/sitemap-profiles.xml) and reference both from a sitemap index; do
 * NOT try to bolt profiles onto this file's directory walk. public/llms.txt
 * needs the matching pointer at the same time.
 */
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE, APP_ROUTES } from '../src/data/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('generate-sitemap: dist/ not found — run vite build first');
  process.exit(1);
}

/* Identical walk to prerender.mjs's builtRoutes(): every dist directory that
 * contains an index.html is a real, statically served route. */
function builtRoutes() {
  const out = [];
  const walk = (dir, prefix = '') => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(dir, e.name), `${prefix}/${e.name}`);
      else if (e.name === 'index.html') out.push(prefix === '' ? '/' : prefix + '/');
    }
  };
  walk(dist);
  return out;
}

/* Routes that exist but must not be submitted for indexing. The product lives
 * on app.verifiedmargins.com, but keep the guard so a future in-repo route
 * can't leak an auth surface into the sitemap. */
/* Never advertise what robots.txt forbids — the two are generated from the
 * same APP_ROUTES list so they cannot drift. */
const EXCLUDE = APP_ROUTES.map((r) => new RegExp(`^${r}(/|$)`));

function priority(route) {
  if (route === '/') return '1.0';
  if (route === '/privacy/' || route === '/tos/' || route === '/support/') return '0.3';
  return '0.8';
}

const routes = builtRoutes()
  .filter(r => !EXCLUDE.some(re => re.test(r)))
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const lastmod = new Date().toISOString().slice(0, 10);
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(r =>
    `  <url><loc>${SITE}${r}</loc><lastmod>${lastmod}</lastmod>` +
    `<priority>${priority(r)}</priority></url>`),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(dist, 'sitemap.xml'), xml);

/* An empty sitemap in Search Console is worse than none. This LP is small by
 * design, so the floor is the routes we know exist rather than the sibling
 * repos' 5. Raise it as real pages are added. */
if (routes.length < 1) {
  console.error(`generate-sitemap: only ${routes.length} route(s) found — failing the build.`);
  process.exit(1);
}

console.log(`generate-sitemap: wrote dist/sitemap.xml with ${routes.length} URLs`);
