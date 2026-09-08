/* PUBLISHED SOURCED DOSSIERS — /brand/<slug>.
 *
 * The real, indexable counterpart to src/demo/registry.ts. A dossier here is
 * not a demo: no banner, no noindex, in the sitemap, and findable in search by
 * the business it is about.
 *
 * ── What publishing one commits us to ────────────────────────────────────
 * Everything that made these pages defensible as demos has to hold in public,
 * and the page is the same component either way (see the mode note in
 * src/pages/DemoSourced.tsx). Concretely, before adding a slug here:
 *
 *   1. Every figure carries a marker — a number, a ≈, or a *. No exceptions.
 *   2. The badge is `estimated`. Nobody at these businesses has spoken to us,
 *      so no page here may ever wear a verified tier.
 *   3. Anything marked * is something a reader cannot check. One row of it on
 *      a demo is a placeholder; on a published page about a named business it
 *      is the weakest thing on the page, and it should be replaced with a real
 *      quote or removed.
 *
 * ── Two lists, one URL each ──────────────────────────────────────────────
 * Adding a slug here is not enough on its own. scripts/build-dossiers.mjs
 * writes the static page (title, description, canonical, og:image) and the
 * sitemap picks it up from the directory walk. There is deliberately NO entry
 * in site.mjs's PUBLIC_PAGES: postbuild-spa-routes.mjs would copy the generic
 * shell over the per-page head that script just wrote.
 */
import type { Dossier } from "@/demo/dossier";
import { spitehouse } from "./spitehouse";

export const DOSSIERS: Record<string, Dossier> = {
  spitehouse,
};

/** Case-insensitive, like the demo registry: a URL gets typed, and a page that
 *  404s on the wrong shift key is a page you cannot hand to anyone. */
export function findDossier(slug: string): Dossier | undefined {
  const want = slug.toLowerCase();
  const key = Object.keys(DOSSIERS).find((k) => k.toLowerCase() === want);
  return key ? DOSSIERS[key] : undefined;
}
