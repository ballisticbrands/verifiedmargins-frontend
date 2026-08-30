/* Demo pages: /demo/<slug>.
 *
 * A demo renders a REAL app page against fixture data, so it can never drift
 * from what production looks like — the layout is not reimplemented here, it
 * is the same component the app uses. See ./README.md to add one.
 *
 * 🚧 Demos may show features that do not exist yet. They are noindex and
 * Disallow'd (site.mjs DEMO_PAGES → APP_ROUTES), and must stay that way.
 */

import { afrasiab } from "./fixtures/afrasiab";
import { pureZookeepergame } from "./fixtures/pure-zookeepergame";
import { leaderboard } from "./fixtures/leaderboard";

/**
 * `kind` picks WHICH page renders the fixture, and each kind's fixture answers
 * a different endpoint with different arguments — so the two are one choice,
 * not two. Modelling them as a union rather than as one struct with a `kind`
 * flag is what stops a leaderboard demo from being handed a `consultation`
 * button it has nowhere to put, or a profile builder from being called with a
 * leaderboard's axis. src/pages/Demo.tsx switches on it.
 */
export type Demo = ProfileDemo | LeaderboardDemo;

/** A tag beside the name.
 *
 * `tone` is NOT decoration. `verified` is the green ✓ treatment the product
 * uses to mean "we checked this against Amazon"; `offer` is the same pill
 * geometry in a neutral colour, for things the seller merely OFFERS — a paid
 * consultation, free resources. Rendering an offer in the verification colour
 * would be this product claiming it verified something it did not. */
export interface DemoTag {
  label: string;
  tone?: "verified" | "offer";
}

/** Tags every demo profile carries. Verification first — it is the claim the
 *  page is built on; the offers follow. Spread into a demo's own `tags` so a
 *  demo can still add one of its own without editing this. */
export const STANDARD_TAGS: DemoTag[] = [
  { label: "✓ Verified margins", tone: "verified" },
  { label: "Paid consultation", tone: "offer" },
  { label: "Free resources", tone: "offer" },
];

/** What /demo (the index) shows for an entry. Optional everywhere: an
 *  unlabelled demo lists under its slug rather than not listing at all — a
 *  demo missing from the index is a demo nobody remembers exists. */
export interface DemoMeta {
  /** Human name for the index card. Defaults to the slug. */
  label?: string;
  /** One line: what this demo is FOR, i.e. why you would send it to someone. */
  blurb?: string;
}

/** Builds the payload GET /v1/public/profiles/:username would return. */
export type ProfileBuilder = (months: number, currency: string) => unknown;

/** Builds the payload GET /v1/public/leaderboard?by=…&currency=… returns. */
export type LeaderboardBuilder = (
  mode: "founder" | "business",
  currency: string,
) => unknown;

export interface ProfileDemo extends DemoMeta {
  kind: "profile";
  build: ProfileBuilder;
  /* Everything below is PER DEMO on purpose. These started scoped to
     `.vm-demo`, which meant the first demo's pill, its rewritten
     business-count and its consultation button all appeared on the second
     one the moment it existed. A demo shows features the product lacks;
     which features is a property of that demo, not of demos. */

  /** Pills beside the name, in order. See STANDARD_TAGS.
   *
   *  🚨 Rendered as REAL elements portalled into the header's <h1>, not as a
   *  ::after on it. It was a ::after, whose `content` can only ever be one
   *  string — so a second tag was not a bigger value, it was a different
   *  mechanism. */
  tags?: DemoTag[];
  /** Replaces the header's computed "<n> businesses with verified revenue".
   *  The shared page derives that from the array length and the payload
   *  cannot set it — see README. */
  countLabel?: string;
  /** Adds a booking CTA beside the social buttons. */
  consultation?: { price: string; minutes: number; name: string };
}

export interface LeaderboardDemo extends DemoMeta {
  kind: "leaderboard";
  build: LeaderboardBuilder;
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
    label: "Afrasiab Khan — agency",
    blurb: "An agency owner rolling up many connected businesses. The multi-business shape of the profile page.",
    tags: STANDARD_TAGS,
    countLabel: "142 businesses with verified profits",
    consultation: { price: "$200", minutes: 45, name: "Afrasiab Khan" },
  },
  Pure_Zookeepergame_2: {
    kind: "profile",
    build: pureZookeepergame,
    label: "boringfixesguy — single seller",
    blurb: "Built from their own r/AmazonFBA post. The outreach shape: one seller, their real handle, bio and figures.",
    tags: STANDARD_TAGS,
    /* The display name, not the handle — it is what the page shows, and a
       booking dialog that addresses you by a different name than the profile
       above it reads as a different person. */
    consultation: { price: "$150", minutes: 45, name: "boringfixesguy" },
  },
  /* The front door with a populated board. `/leaderboard` against an empty or
     three-row production database shows the layout but not the argument; this
     shows what the page is FOR, and is the one link worth sending someone who
     has never seen the product. */
  leaderboard: {
    kind: "leaderboard",
    build: leaderboard,
    label: "Leaderboard",
    blurb: "The front door with a populated board. The one link worth sending someone who has never seen the product.",
  },
};
