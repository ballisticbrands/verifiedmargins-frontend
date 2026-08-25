/* Build-time twin of site.ts.
 *
 * The prerender and sitemap scripts are plain .mjs run by node, so they cannot
 * import the .ts module the app uses. Kept deliberately tiny and asserted
 * against its twin by scripts/check-site-constants.mjs, so the two cannot
 * drift into disagreeing about the site's own URL. */
export const SITE = 'https://verifiedmargins.com';
/* Build-time ONLY — this file's reader is scripts/build-profiles.mjs. The
 * browser bundle's API base is `config.apiUrl` (src/lib/config.ts), a
 * different constant that deliberately still points at api.getdragonbot.com.
 * 🚨 Must match site.ts — scripts/check-site-constants.mjs runs first in
 * `npm run build` and fails a one-sided edit. */
export const API_BASE = 'https://api.verifiedmargins.com';
export const BRAND_NAME = 'VerifiedMargins';

/* The authenticated app's routes.
 *
 * 🚨 ONE list, read by scripts/postbuild-spa-routes.mjs (which writes their
 * static stubs and the robots.txt Disallow lines) AND by
 * scripts/generate-sitemap.mjs (which must exclude them). They were separate
 * lists for one build and immediately disagreed: the sitemap advertised
 * /settings, /sign-in, /verify-email and /login while robots.txt
 * blocked them — a sitemap listing URLs robots forbids is a Search Console
 * error, not a cosmetic mismatch.
 *
 * Keep in sync with the <Route> list in src/App.tsx. Anything NOT here is a
 * seller's handle. */
/* PUBLIC, indexable pages that are still React routes.
 *
 * 🚨 Deliberately NOT in APP_ROUTES. Both lists get a static stub so GitHub
 * Pages answers 200 instead of falling through to 404.html — but APP_ROUTES
 * also becomes a `Disallow:` line in robots.txt and is excluded from the
 * sitemap, which is right for authenticated shells and wrong for these. A
 * privacy policy nobody can crawl is a privacy policy that fails the audit it
 * exists to pass, and generate-sitemap.mjs already scores /privacy/ at 0.3,
 * so it expects to find them.
 *
 * Anything here must also be in RESERVED_USERNAMES on the backend
 * (src/services/profiles/usernames.ts) — otherwise a seller could register the
 * handle and shadow the page via the /:username catch-all. */
export const PUBLIC_PAGES = [
  '/privacy',
  /* Also the about URL on our Reddit / X / LinkedIn OAuth app records, so it
   * has to answer 200 to a reviewer's fetch, not bounce through 404.html. */
  '/about',
  /* The footer's "Terms" link on every page, and the terms URL the X / Reddit /
   * LinkedIn app registrations ask for alongside the privacy one.
   * generate-sitemap.mjs has always priced /tos/ at 0.3 — it expected this. */
  '/tos',
];

export const APP_ROUTES = [
  /* The one auth page. /sign-up and /sign-in are TOMBSTONES that redirect
   * to it — they stay in this list precisely because they must keep
   * answering 200: the LP, emails already sitting in inboxes and any live
   * ad creative point at them, and a 404 on an ad's destination fails
   * Google Ads' destination check. */
  '/login',
  '/sign-up',
  '/sign-in',
  /* Where every emailed sign-in link lands. Missing here it would have
   * been served by the 404.html bounce — a human would still get signed
   * in, on an HTTP 404. */
  '/magic',
  '/dashboard',
  /* The nav's "Profile" link. A resolver route, not a page — it reads the
   * signed-in user's profiles and redirects to their own /:username page (or
   * to /settings when there is nothing publishable yet). Needs a 200-answering
   * stub like every other app route, and a Disallow: there is nothing here to
   * index and it requires auth to do anything at all.
   * 🚨 Must stay in the backend's RESERVED_USERNAMES
   * (src/services/profiles/usernames.ts) — it already is — or a seller could
   * register "profile" and shadow it. */
  '/profile',
  '/settings',
  '/verify-email',
  /* No /forgot-password: this brand has no passwords, and the route is
   * gone from App.tsx. */
];
