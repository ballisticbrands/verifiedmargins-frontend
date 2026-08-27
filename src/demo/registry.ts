/* Demo pages: /demo/<slug>.
 *
 * A demo renders a REAL app page against fixture data, so it can never drift
 * from what production looks like — the layout is not reimplemented here, it
 * is the same component the public profile uses. See ./README.md to add one.
 *
 * 🚧 Demos may show features that do not exist yet. They are noindex and
 * Disallow'd (site.mjs DEMO_PAGES → APP_ROUTES), and must stay that way.
 */

import { afrasiab } from "./fixtures/afrasiab";
import { pureZookeepergame } from "./fixtures/pure-zookeepergame";

/** Builds the payload GET /v1/public/profiles/:username would return. */
export type DemoBuilder = (months: number, currency: string) => unknown;

export interface Demo {
  /** Which app page to render the fixture through. */
  kind: "profile";
  build: DemoBuilder;
  /* Everything below is PER DEMO on purpose. These started scoped to
     `.vm-demo`, which meant the first demo's pill, its rewritten
     business-count and its consultation button all appeared on the second
     one the moment it existed. A demo shows features the product lacks;
     which features is a property of that demo, not of demos. */

  /** Renders a pill beside the name, e.g. "✓ Verified margins". */
  pill?: string;
  /** Replaces the header's computed "<n> businesses with verified revenue".
   *  The shared page derives that from the array length and the payload
   *  cannot set it — see README. */
  countLabel?: string;
  /** Adds a booking CTA beside the social buttons. */
  consultation?: { price: string; minutes: number; name: string };
}

/** Case-insensitive: a handle carries its case ("Pure_Zookeepergame_2") but a
 *  URL gets typed, and a demo that 404s on the wrong shift key is a demo you
 *  cannot hand to anyone. */
export function findDemo(slug: string): Demo | undefined {
  const want = slug.toLowerCase();
  const key = Object.keys(DEMOS).find((k) => k.toLowerCase() === want);
  return key ? DEMOS[key] : undefined;
}

export const DEMOS: Record<string, Demo> = {
  afrasiab: {
    kind: "profile",
    build: afrasiab,
    pill: "✓ Verified margins",
    countLabel: "142 businesses with verified profits",
    consultation: { price: "$200", minutes: 45, name: "Afrasiab Khan" },
  },
  Pure_Zookeepergame_2: {
    kind: "profile",
    build: pureZookeepergame,
    pill: "✓ Verified margins",
    /* The display name, not the handle — it is what the page shows, and a
       booking dialog that addresses you by a different name than the profile
       above it reads as a different person. */
    consultation: { price: "$150", minutes: 45, name: "boringfixesguy" },
  },
};
