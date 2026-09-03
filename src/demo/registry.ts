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
  /**
   * "Ask <name>" — a priced menu of QUESTIONS, rendered as its own section
   * under the profile.
   *
   * A different product from `consultation`, not a cheaper one: a call buys
   * somebody's calendar, an answer buys their judgement on one thing. Priced
   * per question for the same reason. A demo may carry either; carrying both
   * would ask a reader to choose between two things that sound alike.
   */
  ask?: {
    name: string;
    /** The section's heading, and the dialog's. Defaults to "Ask <name>".
     *  One field for both on purpose: a dialog titled differently from the
     *  section it opened from reads as a different feature. */
    heading?: string;
    /**
     * 🚨 INVENTED SOCIAL PROOF, shown beside the heading — a star rating out of
     * 5 and a count of consultations delivered.
     *
     * Nobody in this demo set has ever sold a consultation through us, because
     * the feature does not exist. These are the same class of figure as
     * GROUP_MARGIN_PCT: made up, about a real person, and therefore declared
     * where somebody will see them rather than buried in a fixture. The page's
     * "Illustrative figures" banner is what makes them defensible, and the
     * ledger records them.
     */
    rating?: number;
    consultations?: number;
    items: Array<{
      q: string;
      price: string;
      /** A second line under the name — terms, or what is included. */
      note?: string;
      /** The dialog's button. Defaults to "Send question — <price>", which is
       *  wrong for anything that is not a one-off question. */
      cta?: string;
      /** The dialog's confirmation, for the same reason. */
      sentHeading?: string;
      sentLine?: string;
    }>;
  };
  /** A link to the GROUP this seller belongs to, rendered as a button ABOVE
   *  the consultation CTA. The admin's own profile carries it too — a group
   *  page is where a reader goes to see the cohort, not a member list only
   *  members get. */
  group?: { to: string; label: string };
  /** A tag under the header's business-count line, naming the group. Distinct
   *  from `tags`, which sit beside the NAME: this is an affiliation, not a
   *  claim about the seller's own figures, and putting it in the same row as
   *  "✓ Verified margins" would read as one. */
  groupTag?: string;
}

export interface LeaderboardDemo extends DemoMeta {
  kind: "leaderboard";
  build: LeaderboardBuilder;
}

/**
 * 🚧 A GROUP — a coach, agency or mastermind and their people on one ranked
 * page. The product has NO groups; this is the kind README.md reserves for a
 * feature that does not exist yet, and it lives at /demo/g/<slug> rather
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
    /* "Paid answers", not "Paid consultation" — he sells questions, and a tag
       naming a product he does not offer is the same kind of small lie the
       tone rule in README.md exists to stop. */
    tags: [
      { label: "✓ Verified margins", tone: "verified" },
      { label: "Paid answers", tone: "offer" },
      { label: "Free resources", tone: "offer" },
    ],
    /* Every question is one HE could answer from what he actually did: RA/OA
       from ~$10K on a credit card in Apr/May 2025, wholesale added about six
       months in, $50K/month on Amazon.ca, US market not started, run from home.
       A menu of questions he has no standing to answer would be the profile
       overselling him, which on this site is the whole failure mode. */
    ask: {
      name: "TomNomYYZ",
      heading: "Consult with TomNomYYZ",
      /* 🚨 Invented — see the field's comment. He has sold nothing through us. */
      rating: 4.7,
      consultations: 53,
      /* Three products, not six questions. The middle one is the cheap way in,
         the first is the considered piece of work, and the third is the only
         recurring thing on the page — so the prices climb with how much of his
         time each actually costs him. */
      items: [
        {
          q: "Product deep dive",
          /* The question it answers, in his prospect's words. "Deep dive" is
             the product name; this is what somebody is actually buying. */
          note: "Is this product worth pursuing?",
          price: "$20",
        },
        { q: "One time question", price: "$10" },
        {
          q: "Ongoing mentorship",
          price: "$100/mo",
          note: "Priority DMs, cancel anytime",
          cta: "Start mentorship — $100/mo",
          sentHeading: "You're in",
          sentLine:
            "Your DMs go to the top of his list from now on. Cancel whenever — access runs to the end of the month you have paid for.",
        },
      ],
    },
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
    /* No "Free resources": he sells a course, and a tag implying a free pack
       is a claim about him we would be making up. Consultation stays. */
    tags: [
      { label: "✓ Verified margins", tone: "verified" },
      { label: "Paid consultation", tone: "offer" },
    ],
    groupTag: "g/ecgwholesale",
    group: { to: "/demo/g/ecgwholesale", label: "ECG Wholesale group" },
    consultation: { price: "$200", minutes: 45, name: "Dan Boufford" },
  },
  "ecg-danny": {
    kind: "profile",
    build: ecgDanny,
    label: "Danny — ECG student",
    blurb: "$171K in one month after switching to brand-direct.",
    /* Students sell nothing here — no consultation, no resources pack. The
       only tag is the verification, which is the one thing this page asserts
       about them. */
    tags: [{ label: "✓ Verified margins", tone: "verified" }],
    groupTag: "g/ecgwholesale",
    group: { to: "/demo/g/ecgwholesale", label: "ECG Wholesale group" },
  },
  "ecg-cameron": {
    kind: "profile",
    build: ecgCameron,
    label: "Cameron — ECG student",
    blurb: "$45K a month from a single exclusive brand, starting from nothing.",
    /* Students sell nothing here — no consultation, no resources pack. The
       only tag is the verification, which is the one thing this page asserts
       about them. */
    tags: [{ label: "✓ Verified margins", tone: "verified" }],
    groupTag: "g/ecgwholesale",
    group: { to: "/demo/g/ecgwholesale", label: "ECG Wholesale group" },
  },
  "ecg-ubaldo": {
    kind: "profile",
    build: ecgUbaldo,
    label: "Ubaldo — ECG student",
    blurb: "$900 in his first month. The small end of a cohort, shown at its real size.",
    /* Students sell nothing here — no consultation, no resources pack. The
       only tag is the verification, which is the one thing this page asserts
       about them. */
    tags: [{ label: "✓ Verified margins", tone: "verified" }],
    groupTag: "g/ecgwholesale",
    group: { to: "/demo/g/ecgwholesale", label: "ECG Wholesale group" },
  },

  /* 🚧 The GROUP demo — a feature the product does not have. Keyed under
     `group/` so it can never collide with a seller's handle. */
  "g/ecgwholesale": {
    kind: "group",
    build: ecgGroup,
    label: "ECG Wholesale — group board",
    blurb:
      "A coach and his students on one ranked page. The group feature, which the product does not have yet.",
    name: "ECG Wholesale",
    description:
      "Dan Boufford and the students of ecgwholesale.com. Revenue is each member's own published figure; margin is the 15% rate verified across the group. Ranked by profit over the last 30 days.",
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
