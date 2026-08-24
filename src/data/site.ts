/** Public identity of the site. One place, so the client route, the build-time
 *  prerender and the sitemap can never disagree about a URL's shape. */
export const SITE = "https://verifiedmargins.com";
export const API_BASE = "https://api.getdragonbot.com";
export const BRAND_NAME = "VerifiedMargins";

/** A published profile's public URL path.
 *  Trailing slash: GitHub Pages serves these as directories, so the unslashed
 *  form 301s. Canonical, og:url and the sitemap all use this shape. */
export function profilePath(username: string): string {
  return `/${username}/`;
}
