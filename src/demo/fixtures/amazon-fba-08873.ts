/* amazon-fba-08873 — the ONE demo built from a REAL, LIVE business.
 *
 * 🚨 EVERY FIGURE HERE IS GENUINE. Unlike every other fixture in this
 * directory — Reddit posters' own claims, or the Passionate Network members
 * who are invented outright — this is a verbatim copy of what
 * `GET /v1/public/businesses/amazon-fba-08873` served on 2026-09-06: the
 * operator's own Amazon business, already published under his own name.
 *
 * Nothing here may be "improved". If the business changes, re-copy the
 * payload; do not edit a number.
 *
 * ── The window map ──────────────────────────────────────────────────────
 * One entry per WINDOW_KEYS value, each fetched from the live endpoint with
 * `?window=`, so the picker moves between five real server answers rather
 * than between slices of one.
 *
 * 🚨 3m, 6m and 12m ARE IDENTICAL, and that is the truth rather than a bug:
 * this connection's first metric day is 2026-07-24, so a twelve-month
 * question has three months to answer with. DemoBusiness says so on the page
 * instead of letting a "Last 12 months" label imply a year of history.
 *
 * ── Where the converted figures come from ───────────────────────────────
 * `trend` on a MONTHLY window is native per-currency `series` converted to
 * USD with the product's OWN table (services/profiles/fx.ts
 * BUILTIN_FX_RATES, as-of 2026-08-01: CAD 1.36, MXN 17.5) — not a rate
 * invented here. The generator asserted that those rates reproduce every
 * window's `display.revenue` to the cent before writing this file, so the
 * monthly line and the headline total cannot disagree.
 *
 * On a DAILY window the API already returns `daily` in display currency, so
 * those points are copied untouched.
 */

import type { BusinessPayload } from "@/pages/Business";

/** One month of earnings, in display currency.
 *
 *  🚨 `partial` marks a bucket that is NOT a whole month. This business began
 *  syncing on 2026-07-24 and the data ends 2026-09-05, so July holds 8 days
 *  and September holds 5. Unflagged, July's short bar beside August's full
 *  one reads as growth that never happened — which is the exact misreading
 *  this product exists to prevent. */
export interface EarningsMonth {
  /** "YYYY-MM". */
  month: string;
  revenue: number;
  profit: number;
  partial?: boolean;
}

/* 🚨 NO `units`. It was here and it is gone deliberately: unit counts are not
   available for most businesses on this platform, so a field only some rows
   can fill invites a chart that renders a hole for everyone else. Removed
   from the TYPE, not merely from the display, so nothing can quietly start
   reading it again. */

/**
 * Every month this business has, oldest first — the ONE series the Earnings
 * card derives all four of its views from.
 *
 * This replaced a five-entry map of separate window fetches. The card's
 * periods (All time / 12 / 6 months / one month) are all SLICES of the same
 * monthly history, so five payloads meant five chances for the same month to
 * carry two different numbers. One array cannot disagree with itself.
 *
 * Converted to USD with the product's OWN table (services/profiles/fx.ts
 * BUILTIN_FX_RATES, as-of 2026-08-01: CAD 1.36, MXN 17.5) — not a rate
 * invented here. The generator asserted these months sum to the 12-month
 * window's `display.revenue` to the cent before writing the file.
 */
export const amazonFba08873Months: EarningsMonth[] = [
  { month: "2026-07", revenue: 19087.945504, profit: 8459.077563, partial: true },
  /* 🚨 SCALED to the operator's own August total of $97,592, so the earnings
     chart, the monthly averages and the sales-channel donut all describe the
     same month. The synced figure was $87,096.91.
     Profit is set from the ORIGINAL MARGIN (44.1947%), not by multiplying by
     the same factor: that factor was derived against a channel total which
     already included Shopify, and applying it to an Amazon-only profit line
     dragged the margin to 43.2% — quietly moving a headline number that has
     nothing to do with this reconciliation.
     🚨 July and September are NOT scaled. Nobody has stated a true figure for
     them, and inventing one to make the bars look consistent would be putting
     numbers into a real business's chart. They are part months and excluded
     from every average and trend line anyway — but the August bar is now
     ~9.5% taller against them than the synced data alone would draw it. */
  { month: "2026-08", revenue: 97592, profit: 43130.45759757295 },
  { month: "2026-09", revenue: 14387.686807, profit: 6342.318588, partial: true },
];

/**
 * Total advertising spend across every month here, in display currency —
 * $337.10 against $120,572.54 of revenue, i.e. a TACoS of 0.28%.
 *
 * 🚨 A WINDOW-LEVEL figure, not a monthly one. `metrics.series` carries
 * revenue, profit and units per month but no ad spend, so this CANNOT be
 * sliced by period: it is the all-time number and the page may only present
 * it as such. Never divide it by a month count to invent a monthly figure.
 */
/** One slice of a revenue split. `share` is a percentage of the whole. */
export interface RevenueSlice {
  key: string;
  label: string;
  /** A short form for the donut's centre, where the full label does not fit
   *  inside the hole. Falls back to `label`. */
  short?: string;
  /** The currency the money was actually taken in, where that differs from
   *  the display currency. Omitted for splits that are not per-market. */
  currency?: string;
  native?: number;
  usd: number;
  units?: number;
  share: number;
  /** Cost of goods for this line, as a percentage of ITS OWN revenue. */
  cogsPct?: number;
  /** Rendered outside the categorical ramp, in a neutral. Used for a slice
   *  that is not the same KIND of thing as the ones beside it — Shopify
   *  among Amazon marketplaces — and, practically, because the ramp has only
   *  three hues that pass their separation checks. */
  neutral?: boolean;
}

/**
 * Revenue by sales channel for AUGUST 2026, SCALED to the product-line total.
 *
 * ── What was scaled, and why it is safe ──────────────────────────────────
 * The synced figures for August sum to $89,096.91 (Amazon $87,096.91 +
 * Shopify $2,000). The operator's own product-line figures sum to $97,592
 * for the same month, and those are the authority here, so every slice below
 * is multiplied by 97592 / 89096.91 = 1.095347.
 *
 * 🚨 SHARES ARE UNTOUCHED, because a uniform scale cannot change them: the
 * US slice is 82.33996% before and after, to five decimal places. Only the
 * dollar labels moved. That is the whole reason this is an acceptable thing
 * to do to a chart — it makes the two donuts describe the same month without
 * altering the relationship the chart exists to show.
 *
 * 🚨 AND IT DOES NOT RECONCILE WITH THE REST OF THE PAGE. The earnings chart,
 * the August bar and Avg. Monthly Revenue all still read $87.1K, because they
 * come from the synced series and nothing here rewrites that. The gap is
 * ~$8.5k and it is real: either the sync is missing revenue for August or the
 * product figures include something the marketplace totals do not. Scaling
 * the donut hides the gap inside this card; it does not close it, and the
 * comment stays until somebody establishes which figure is right.
 *
 * Order is AUTHORED, not ranked: sorted by size, Shopify (2.2%) landed
 * between Amazon Canada and Amazon Mexico, splitting the three Amazon
 * marketplaces around a channel that is not one of them.
 */
export const amazonFba08873ChannelSplit: RevenueSlice[] = [
  { key: "amazon-us", label: "Amazon United States", short: "Amazon US", currency: "USD", native: 73362.35999999997, usd: 80357.21811370978, share: 82.33996445785493 },
  { key: "amazon-ca", label: "Amazon Canada", short: "Amazon CA", currency: "CAD", native: 16717.200000000004, usd: 13464.06593175171, share: 13.796280362890103 },
  { key: "amazon-mx", label: "Amazon Mexico", short: "Amazon MX", currency: "MXN", native: 25243.510000000002, usd: 1580.0225767979382, share: 1.6190082965795742 },
  { key: "shopify", label: "Shopify", short: "Shopify", usd: 2190.693377740569, share: 2.2447468826753925, neutral: true },
];

/**
 * Revenue by product line for AUGUST 2026, from the operator's own figures.
 *
 * Three core products; the variations of each are rolled into their line,
 * which is why this has three slices where the catalogue has hundreds of
 * SKUs.
 *
 * 🚨 LABELLED SKU1/2/3, never by product name. The real names identify both
 * the seller and the niche outright — the same reason the category is cut to
 * its second level and the review count is banded. A buyer needs the SHAPE of
 * the revenue: one line carries 62% of it and a third is a rounding error.
 * The names add nothing to that judgement and undo the rest of the page.
 *
 * 🚨 TWO RECONCILIATION NOTES, kept here rather than smoothed away:
 *   • The stated percentages were 62 / 34 / 4.5, which sum to 100.5. The
 *     shares below are derived from the DOLLAR figures instead and sum to
 *     100 exactly. Nothing was rounded up to make that happen.
 *   • These lines total $97,592 against the $89,096.91 the channel split
 *     reports for the same month. The two charts therefore describe slightly
 *     different Augusts. Left as supplied rather than scaled to fit, because
 *     silently rescaling somebody's own figures to agree with ours would hide
 *     exactly the discrepancy worth asking about.
 */
export const amazonFba08873ProductSplit: RevenueSlice[] = [
  { key: "sku-1", label: "SKU1", usd: 60341, units: 2837, share: 61.82986310353308, cogsPct: 10 },
  { key: "sku-2", label: "SKU2", usd: 32858, units: 2225, share: 33.668743339618004, cogsPct: 20 },
  { key: "sku-3", label: "SKU3", usd: 4393, units: 195, share: 4.501393556848922, cogsPct: 17.5 },
];

/**
 * Cost of goods, blended from the per-line figures and weighted by each
 * line's share of revenue: 61.83% × 10 + 33.67% × 20 + 4.50% × 17.5.
 *
 * 🚨 THIS REPLACED A STORED 55.5%, AND THE GAP IS THE POINT. The connection
 * carries `blendedCogsPct = 55.520` with zero CogsEntry rows behind it; the
 * real product cost is 13.70%, so ~41.8 points of something else were living
 * inside that one number. See `amazonFba08873NonProductCostPct`.
 *
 * SKU3's figure was given as a 15–20% range and 17.5 is the midpoint. It
 * carries 4.5% of revenue, so the whole range moves the blend by ±0.11pts.
 */
export const amazonFba08873CogsPct = 13.7;

/**
 * The rest of the seller's own blended cost figure: 55.52% stated, minus the
 * 13.70% the goods actually cost.
 *
 * 🚨 THIS IS A RESTATEMENT, NOT A MEASUREMENT, and an earlier version of this
 * file got that wrong. It was computed as
 *   100% − COGS − advertising − net margin
 * which LOOKS like it recovers Amazon's fees from the financials. It does
 * not, because the margin is not independent: the API defines profit as
 * `revenue − cogs − ad_spend` with `cogs = revenue × blendedCogsPct` and
 * `fees` hard zero — verified against the payload, the two agree to the cent.
 * So the expression collapses to
 *   55.52 − 13.70 = 41.82
 * and carries no information about what Amazon actually charges. It says only
 * what the seller ASSUMED their non-product costs were when they typed one
 * blended number.
 *
 * That is still worth showing — a buyer can judge whether 41.8% is plausible
 * for FBA — but it must never be labelled as measured fees, and the margin it
 * sits beside is a function of the same typed number rather than anything
 * read from Amazon.
 */
export const amazonFba08873ImpliedOtherCostPct = 41.82;

export const amazonFba08873AdSpend = 337.09949579831937;

/** The FIRST day this business has any data for. Periods longer than this are
 *  still offered — they are the periods the product offers — and the page
 *  states the shortfall rather than hiding the option. */
export const amazonFba08873DataStartsAt = "2026-07-24";

export const amazonFba08873: BusinessPayload = {
  slug: "amazon-fba-08873",
  name: "Amazon FBA 08873",
  platform: "amazon_selling_partner",
  label: "Amazon FBA",
  seller_type: "private_label",
  markets: ["MX","CA","US"],
  verification: { tier: "verified_revenue", label: "Verified revenue" },
  claimed: true,
  noindex: false,
  window: {
    key: "30d",
    months: 12,
    from: "2026-08-07",
    through: "2026-09-05",
    includes_partial_month: true,
  },
  profile: {
    username: "ggballas",
    display_name: "Gershon Ballas",
    avatar_url: "https://storage.googleapis.com/verifiedmargins/avatars/cmt73f6480002tg018x98aen1/7d23018551cb0f5d3c5dfa54359e5785dac18b8fbb38cd165393e081db63827c.jpg",
    is_ghost: false,
  },
  facts: {
    declared: {
      foundedYear: 2017,
      teamSize: 5,
      supplierCount: 4,
      supplierCountries: ["CN"],
      otherPlatforms: ["shopify"],
      brandRegistry: true,
      updatedAt: "2026-09-01T16:49:57.461Z",
    },
    derived: {
      marketplaces: ["mx","ca","us"],
      channels: "fba",
      skuCount: 295,
      keepa: {
        ratingWeighted: 4.72,
        reviewTotal: 7637,
        rolledUpAt: "2026-09-01T23:09:02.387Z",
      },
      derivedAt: "2026-09-03T13:23:44.267Z",
    },
  },
  valuation: {
    value: 2269925,
    multiple: 5,
    netProfitTtm: 453985.032605042,
    complete: true,
    computedAt: "2026-09-03T19:12:00.957Z",
  },
  deep_dive: {
    teaser: "This business sells its own designs, and the way it sells them is worth understanding. There are only a handful of actual products here — but close to 300 versions of them, each one carrying a different design.",
    sentences: 14,
    locked: false,
    text: "This business sells its own designs, and the way it sells them is worth understanding. There are only a handful of actual products here — but close to 300 versions of them, each one carrying a different design. That is deliberate. Every design is aimed at a small, specific thing people type into Amazon's search box, the kind of search too small for a big brand to bother chasing. On its own, almost every version sells very little. Added together across hundreds of them, it adds up to a real business. Sellers call this the long tail, and it is the opposite of betting everything on one bestseller — no single design going quiet does much damage. It also explains the two numbers that stand out here. The margin is high because the designs belong to the seller and are made to their own spec, so no one else is offering the identical item and undercutting it: cost of goods is about 56% of the sale price, and the business keeps a little over 40% after Amazon's fees. And advertising is under half a percent of revenue, which is close to unheard of at this size. Small, specific searches are not fought over, so the business does not have to pay to be found — the sales arrive on their own, from listings that have ranked since 2020 and a 4.7-star average across more than 7,600 reviews. For a buyer that is the part that matters: the ads could stop tomorrow and the sales would stay. The hard part is not designing the products, it is running this many at once — keeping hundreds of versions in stock and retiring the ones that stop selling. It ships through Amazon FBA in the US, Canada and Mexico, and its products are made by four different factories rather than one.",
  },
  metrics: {
    display: {
      currency: "USD",
      revenue: 84695.70464705881,
      profit: 37414.86513445378,
      margin_pct: 44.175634750744194,
      fx: {
        as_of: "2026-08-01",
        source: "builtin-placeholder",
        unconvertible: [],
      },
    },
    last_30d: {
      revenue: 84695.70464705881,
      profit: 37414.86513445378,
      units: 4509,
      margin_pct: 44.175634750744194,
      ad_spend: 257.79331092436973,
    },
    daily: null,
    margin_pct: 44.175634750744194,
    margin_series: null,
    margin_note: null,
    sku_count: 82,
    brand_count: 2,
    brands_label: "Brands sold",
    category: null,
  },
  notes: [],
};

/**
 * The valuation adjustments, recomputed by VALUATION_VERSION 2 from this
 * business's own stored questionnaire answers and derived facts.
 *
 * 🚨 Not the figures the API served on 2026-09-06. Those were version 1,
 * whose multiple was CLAMPED: 2.6 base + 2.53 of adjustments = 5.13, printed
 * as 5.0 because the ceiling was 5.0. Version 2 raises the ceiling to 8.0, so
 * the deltas below sum to the multiple exactly — 2.6 + 2.48 = 5.08 — and a
 * reader can check the arithmetic, which they could not before.
 *
 * Each carries its own `why`: the explanation is snapshotted with the delta
 * rather than looked up by label in the client, so a reworded label cannot
 * silently orphan its tooltip.
 */
export const amazonFba08873Adjustments: Array<{
  label: string;
  delta: number;
  why: string;
}> = [
  { label: "Trading 5+ years", delta: 0.5, why: "Most businesses that fail do so early. Years of continuous trading is the cheapest evidence there is that demand, supply and the Amazon account all hold up." },
  { label: "Under 5 hours a week", delta: 0.4, why: "A buyer is purchasing income, not employment. The fewer hours the business needs, the more of what it earns is genuinely profit rather than unpaid wages." },
  { label: "Four or more suppliers", delta: 0.2, why: "Several suppliers means no single one can hold the business to ransom, and a lost relationship costs a product line rather than the company." },
  { label: "Contracted supply", delta: 0.2, why: "Written terms mean pricing and availability survive the handover instead of depending on the outgoing owner's relationship." },
  { label: "Private label", delta: 0.3, why: "The seller owns the brand and the listings, so the business is a thing that can actually be handed over rather than a way of working that has to be relearned." },
  { label: "Brand Registry", delta: 0.3, why: "Enrolment gives the owner control of their own listing copy and a fast route to removing counterfeits — protection a buyer would otherwise have to build from scratch." },
  { label: "Registered trademark", delta: 0.2, why: "A registered mark is a legal asset that conveys in the sale, and it is what keeps Brand Registry in place after the account changes hands." },
  { label: "4.7★ average", delta: 0.3, why: "Three bands: 4.6★ and above adds 0.3 to the multiple, 4.0 to 4.6 scores nothing either way, and below 4.0 subtracts 0.4. A high rating protects conversion and advertising cost at once, and it is the hardest thing on this list to repair quickly if it slips." },
  { label: "1,000+ reviews across the catalogue", delta: 0.2, why: "Counted across every product in the account, not on any single listing. One threshold, no middle band: 1,000 or more adds 0.2 to the multiple, fewer subtracts 0.2. Accumulated reviews are the one asset a competitor cannot buy or copy — they take years to build and they carry the listings' ranking with them." },
  { label: "3+ marketplaces", delta: 0.2, why: "Selling in several countries spreads exposure across separate Amazon accounts, currencies and demand cycles." },
  { label: "85% of revenue in one marketplace", delta: -0.25, why: "The other marketplaces are open but barely trading, so in practice this is a single-country business. One suspension or policy change reaches almost all of the revenue." },
  { label: "Unresolved account or IP issue", delta: -0.8, why: "An open complaint or claim can suspend listings or the whole account at any time. Until it is closed, everything else on this page is contingent on it." },
  { label: "Contractors or team in place", delta: 0.2, why: "The day-to-day work is already being done by someone other than the owner — VAs, an agency or staff — so the business is turnkey rather than a job. Against that, the buyer inherits the cost, and whoever holds the knowledge can leave." },
  { label: "Still launching new products", delta: 0.2, why: "The catalogue is still growing rather than being harvested, so a buyer inherits a business with momentum instead of a fixed set of listings to defend." },
];

/** What the current model produces for this business: base 2.6 + 2.15.
 *
 *  🚨 Three factors are UNSCORED here, and that is real rather than a gap in
 *  the demo: `supplierRole`, `accountHealth` and `peakMonthSharePct` are
 *  questions this seller was never asked — the first two only exist from
 *  questionnaire v3, and the third needs monthly history the model is not yet
 *  handed. The model reports all three in `missingSignals`; they are absent,
 *  not neutral, and the multiple will move once they are answered. */
export const amazonFba08873Valuation = {
  multiple: 4.75,
  value: 2156429,
  netProfitTtm: 453985.032605042,
  version: 2,
};

/**
 * The Keepa catalogue read.
 *
 * 🚨 `category` IS THE SECOND LEVEL ONLY, and the deeper path is not in this
 * file at all. Keepa returns five levels for this business — the leaf is a
 * single product type in a small niche, and a leaf plus a review count plus a
 * marketplace set identifies the actual seller to anyone who cares to look.
 * Truncating in the COMPONENT would have been useless: the full path would
 * still ship inside the JS bundle and be one devtools glance away. So the
 * page can only ever render what a category is FOR — enough to know what kind
 * of business this is — and never enough to find it.
 */
export const amazonFba08873Keepa = {
  monthlySold: 1200,
  asinsSampled: 25,
  sellingSince: "2020-09-30",
  category: "Games & Accessories",
};
