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
 * /settings, /sign-in, /verify-email and /forgot-password while robots.txt
 * blocked them — a sitemap listing URLs robots forbids is a Search Console
 * error, not a cosmetic mismatch.
 *
 * Keep in sync with the <Route> list in src/App.tsx. Anything NOT here is a
 * seller's handle. */
export const APP_ROUTES = [
  '/sign-up',
  '/sign-in',
  '/dashboard',
  '/settings',
  '/verify-email',
  '/forgot-password',
];
