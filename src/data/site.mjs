/* Build-time twin of site.ts.
 *
 * The prerender and sitemap scripts are plain .mjs run by node, so they cannot
 * import the .ts module the app uses. Kept deliberately tiny and asserted
 * against its twin by scripts/check-site-constants.mjs, so the two cannot
 * drift into disagreeing about the site's own URL. */
export const SITE = 'https://verifiedmargins.com';
export const API_BASE = 'https://api.getdragonbot.com';
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
  '/settings',
  '/verify-email',
  /* No /forgot-password: this brand has no passwords, and the route is
   * gone from App.tsx. */
];
