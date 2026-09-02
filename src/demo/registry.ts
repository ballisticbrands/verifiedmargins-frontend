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
import { jayeshchauhanreddit } from "./fixtures/jayeshchauhanreddit";
import { muchExperience4197 } from "./fixtures/much-experience-4197";
import { sirsolrac36 } from "./fixtures/sirsolrac36";
import { slickyTrick } from "./fixtures/slickytrick";
import { thickValuable4753 } from "./fixtures/thick-valuable-4753";
import { tomNomYyz } from "./fixtures/tomnomyyz";
import { pureZookeepergame } from "./fixtures/pure-zookeepergame";
import { leaderboard } from "./fixtures/leaderboard";
import { ecgGroup } from "./fixtures/ecg-group";
import {
  danBoufford,
  ecgCameron,
  ecgDanny,
  ecgUbaldo,
} from "./fixtures/ecgwholesale";

/**
 * `kind` picks WHICH page renders the fixture, and each kind's fixture answers
 * a different endpoint with different arguments — so the two are one choice,
 * not two. Modelling them as a union rather than as one struct with a `kind`
 * flag is what stops a leaderboard demo from being handed a `consultation`
 * button it has nowhere to put, or a profile builder from being called with a
 * leaderboard's axis. src/pages/Demo.tsx switches on it.
 */
export type Demo = ProfileDemo | LeaderboardDemo | GroupDemo;

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

/**
 * 🚧 A GROUP — a coach, agency or mastermind and their people on one ranked
 * page. The product has NO groups; this is the kind README.md reserves for a
 * feature that does not exist yet, and it lives at /demo/group/<slug> rather
 * than /demo/<slug> so a group can never collide with a seller's handle.
 */
export interface GroupDemo extends DemoMeta {
  kind: "group";
  /** Answers the leaderboard endpoint with just this group's members. */
  build: LeaderboardBuilder;
  /** Shown as the board's heading — the group's name, not the owner's. */
  name: string;
  /** One or two sentences on who these people are. */
  description: string;
  /** The owner's photo, beside the description. Served locally, never
   *  hotlinked — see the note on afrasiab's. */
  avatar_url?: string | null;
  /** Where the group comes from, linked under the description. */
  link?: string;
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
  /* ── Built from public Reddit posts, one per person ────────────────────
     Every figure is the poster's own, with their own caveats; see each
     fixture's header comment for the arithmetic and src/demo/README.md for
     the contracts. Ledgered in Dragon-marketing/skills/VM-demo-profile/
     verifiedmargins-demo-profiles.csv. */
  jayeshchauhanreddit: {
    kind: "profile",
    build: jayeshchauhanreddit,
    label: "Jayesh Chauhan — UK private label",
    blurb:
      "A real July P&L at a 47% margin — and the no-referral-fee caveat he flagged himself.",
    tags: STANDARD_TAGS,
    consultation: { price: "$150", minutes: 45, name: "Jayesh Chauhan" },
  },
  "Much-Experience-4197": {
    kind: "profile",
    build: muchExperience4197,
    label: "Ahad — first launch, 5 months",
    blurb:
      "A first private-label launch five months in: small numbers, verified margin, a real Sellerboard screenshot behind them.",
    tags: STANDARD_TAGS,
    consultation: { price: "$150", minutes: 45, name: "Ahad" },
  },
  Sirsolrac36: {
    kind: "profile",
    build: sirsolrac36,
    label: "Sirsolrac36 — revenue only",
    blurb:
      "He published revenue and never profit. The revenue-only shape, with margin honestly withheld.",
    /* 🚨 NOT StandardTags. He has no verified margin — he has no margin at
       all — and "✓ Verified margins" in the verification green over a page
       whose margin tile reads "—" is this site claiming something it can
       plainly see is not there. The tone rule in README.md, applied. */
    tags: [{ label: "✓ Verified revenue", tone: "verified" }, ...STANDARD_TAGS.slice(1)],
    consultation: { price: "$150", minutes: 45, name: "Sirsolrac36" },
  },
  SlickyTrick: {
    kind: "profile",
    build: slickyTrick,
    label: "SlickyTrick — UK wholesale, year one",
    blurb:
      "£231.8k of first-year revenue, a self-estimated £12k profit, and the thin 5.2% margin behind it.",
    tags: STANDARD_TAGS,
    consultation: { price: "$150", minutes: 45, name: "SlickyTrick" },
  },
  "Thick-Valuable-4753": {
    kind: "profile",
    build: thickValuable4753,
    label: "Chicken Boy — one month in, at a loss",
    blurb:
      "£1.4k of arbitrage sales and a −2% margin, from his own Sellerboard card. Rendered as the loss it is.",
    tags: STANDARD_TAGS,
    consultation: { price: "$150", minutes: 45, name: "Chicken Boy" },
  },
  TomNomYYZ: {
    kind: "profile",
    build: tomNomYyz,
    label: "TomNomYYZ — first $50K month",
    blurb:
      "A Canada-only arbitrage-to-wholesale seller's first $50K month, at the conservative end of the margin range he claimed.",
    tags: STANDARD_TAGS,
    consultation: { price: "$150", minutes: 45, name: "TomNomYYZ" },
  },

  /* ── ecgwholesale.com — a coach and his students ───────────────────────
     Not from Reddit: built from his own marketing pages. Nobody in this set
     published a profit, so every one is verified_revenue with the margin
     withheld, and the group board ranks on revenue. See the fixtures. */
  danboufford: {
    kind: "profile",
    build: danBoufford,
    label: "Dan Boufford — ECG Wholesale",
    blurb:
      "$1.7M a month off his own Seller Central card, with the margin honestly withheld. The owner of the group demo.",
    tags: [{ label: "✓ Verified revenue", tone: "verified" }, ...STANDARD_TAGS.slice(1)],
    consultation: { price: "$150", minutes: 45, name: "Dan Boufford" },
  },
  "ecg-danny": {
    kind: "profile",
    build: ecgDanny,
    label: "Danny — ECG student",
    blurb: "$171K in one month after switching to brand-direct.",
    tags: [{ label: "✓ Verified revenue", tone: "verified" }, ...STANDARD_TAGS.slice(1)],
    consultation: { price: "$150", minutes: 45, name: "Danny" },
  },
  "ecg-cameron": {
    kind: "profile",
    build: ecgCameron,
    label: "Cameron — ECG student",
    blurb: "$45K a month from a single exclusive brand, starting from nothing.",
    tags: [{ label: "✓ Verified revenue", tone: "verified" }, ...STANDARD_TAGS.slice(1)],
    consultation: { price: "$150", minutes: 45, name: "Cameron" },
  },
  "ecg-ubaldo": {
    kind: "profile",
    build: ecgUbaldo,
    label: "Ubaldo — ECG student",
    blurb: "$900 in his first month. The small end of a cohort, shown at its real size.",
    tags: [{ label: "✓ Verified revenue", tone: "verified" }, ...STANDARD_TAGS.slice(1)],
    consultation: { price: "$150", minutes: 45, name: "Ubaldo" },
  },

  /* 🚧 The GROUP demo — a feature the product does not have. Keyed under
     `group/` so it can never collide with a seller's handle. */
  "group/ecgwholesale": {
    kind: "group",
    build: ecgGroup,
    label: "ECG Wholesale — group board",
    blurb:
      "A coach and his students on one ranked page. The group feature, which the product does not have yet.",
    name: "ECG Wholesale",
    description:
      "Dan Boufford and the students of ecgwholesale.com, with every figure checked against what they published. Ranked by revenue over the last 30 days — the one number every member here made public.",
    avatar_url: "/demo/dan-boufford.png",
    link: "https://www.ecgwholesale.com/",
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
