/** Public identity of the site. One place, so the client route, the build-time
 *  prerender and the sitemap can never disagree about a URL's shape. */
export const SITE = "https://verifiedmargins.com";
/** Build-time ONLY — scripts/build-profiles.mjs prerenders published profiles
 *  from it. The browser bundle's API base is `config.apiUrl` in
 *  src/lib/config.ts, which is a DIFFERENT constant and deliberately still
 *  points at api.getdragonbot.com (see the 🚨 there before changing it).
 *
 *  api.verifiedmargins.com is a second Caddy site block on the same backend
 *  as api.getdragonbot.com — one deployment, one token issuer. It only
 *  answers once `A api.verifiedmargins.com -> 52.206.150.194` resolves and
 *  Let's Encrypt has issued; build-profiles.mjs never fails the build, it
 *  warns and emits nothing, so pointing here early costs every profile its
 *  static page rather than the deploy. */
export const API_BASE = "https://api.verifiedmargins.com";
export const BRAND_NAME = "VerifiedMargins";

/** A published profile's public URL path.
 *  Trailing slash: GitHub Pages serves these as directories, so the unslashed
 *  form 301s. Canonical, og:url and the sitemap all use this shape. */
export function profilePath(username: string): string {
  return `/${username}/`;
}

/** ONE business's public URL path — the share target for a single brand's
 *  numbers, rather than the seller's whole portfolio. Trailing slash for the
 *  same reason as `profilePath`: scripts/build-businesses.mjs writes these as
 *  directories, so the unslashed form 301s.
 *  🚨 Twin of the same function in site.mjs. */
export function businessPath(slug: string): string {
  return `/business/${slug}/`;
}
