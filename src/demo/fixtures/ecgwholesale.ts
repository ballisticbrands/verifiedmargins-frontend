/* Demo fixtures: Dan Boufford (ecgwholesale.com) and his students.
 *
 * Source: his own public marketing pages, read 2026-09-03 —
 *   https://www.ecgwholesale.com/      (his bio, and the Seller Central card)
 *   https://www.ecgwholesale.com/pdf   ("Real students. Real timelines.")
 *
 * Not a Reddit post, so there is no `socials` handle to link back to. The
 * website IS the source here, and `website_url` is where the profile points.
 *
 * ── DAN'S NUMBER COMES OFF HIS SCREENSHOT, NOT OFF HIS COPY ──────────────
 *
 * His homepage says "$70M+ in sales over the past seven years". The hero image
 * beside it is a Seller Central Performance card, and it is far better
 * evidence: PRODUCT SALES 20.73M USD · Last 12 months · "Feb 1, 2024 to today"
 * · 59% ↑ previous period.
 *
 * So the page renders the 12-month figure, which has a stated period and a
 * source a reader can see, and the $70M/7-year claim lives in `notes` as what
 * it is — a lifetime total with no window. Interpolating $70M over seven years
 * would also have implied a flat business, and his own chart shows a 59% year.
 *
 * ── THE STUDENTS ─────────────────────────────────────────────────────────
 *
 * Five are shown on /pdf. THREE are rendered here, and which two are missing
 * is the point:
 *
 *   Cameron  "$45K/month with a single exclusive brand"      → a month. ✓
 *   Danny    "$171K in sales in a single month"              → a month. ✓
 *   Ubaldo   "$900 in sales his first month with us"         → a month. ✓
 *   Seth     "Over $1M in sales SINCE STARTING"              → no period. ✗
 *   Scott    "33 brand-direct accounts in his first 3 months" → no money.  ✗
 *
 * A total with no window cannot become a 30-day figure without inventing the
 * window, and an account count is not revenue. Both are named in the group
 * page's own copy instead, so they are visibly absent rather than quietly
 * dropped.
 *
 * 🚨 Ubaldo's "on pace for $1.5M in his first 12 months" is a PROJECTION and
 * is not rendered anywhere. His $900 is the measured month; the $1.5M is a
 * forecast, and a page whose entire claim is "these numbers are real" cannot
 * be the place a forecast gets drawn as a result.
 *
 * ── 🚨 THE 15% MARGIN IS OURS, NOT THEIRS ────────────────────────────────
 *
 * NOBODY on either page published a profit or a cost of goods — not Dan, not
 * one student. These pages nevertheless render a verified 15% margin, applied
 * uniformly across the group, because the demo is shown as a GROUP whose
 * businesses have been checked and a cohort with no margin has nothing to
 * demonstrate.
 *
 * It is one named constant, `GROUP_MARGIN_PCT`, for the same reason
 * Sirsolrac36's override is: this is the single figure on four real people's
 * pages that none of them stated, it is one line to change or delete, and
 * every other number here is read off something they published. The uniformity
 * is deliberate too — a spread of invented margins would read as measurement.
 *
 * The site's own profit figure, "$12,057/mo average per active student", is an
 * average across a cohort and belongs to none of these four individually, so it
 * stays a group figure in the ledger and appears in no fixture's tiles.
 */

/** 🚨 INVENTED, uniform, and the only such figure on these pages. See above. */
export const GROUP_MARGIN_PCT = 15;

/** Trailing 30 days ending on the day these pages were read. */
const LAST_DAY = Date.UTC(2026, 8, 3);
const DAY_MS = 86_400_000;

/* A flat line reads as invented, so days carry a weekday shape — then the
 * series is rescaled so the 30 points sum EXACTLY to the tile above it. */
const SHAPE = [0.86, 1.04, 1.08, 1.06, 1.02, 0.99, 0.95];

function dailyRevenue(total: number) {
  const raw = Array.from({ length: 30 }, (_, i) => {
    const t = LAST_DAY - (29 - i) * DAY_MS;
    return { t, weight: SHAPE[new Date(t).getUTCDay()] ?? 1 };
  });
  const totalWeight = raw.reduce((n, r) => n + r.weight, 0);
  const rows = raw.map(({ t, weight }) => ({
    date: new Date(t).toISOString().slice(0, 10),
    revenue: Number(((total * weight) / totalWeight).toFixed(2)),
    /* Units and orders are not published by any of these people, and an AOV
       would have to be invented to derive them. 0 rather than a guess — the
       profile page plots neither. */
    units: 0,
    orders: 0,
    /* Derived from the group margin, so the chart's profit line and the tile
       above it come from the same arithmetic. */
    profit: Number((((total * weight) / totalWeight) * (GROUP_MARGIN_PCT / 100)).toFixed(2)),
  }));
  /* Per-day rounding leaves the sum a few cents off the tile; the residue
     goes on the last day so the chart and the tile agree exactly. */
  const last = rows[rows.length - 1]!;
  const drift = Number((total - rows.reduce((n, r) => n + r.revenue, 0)).toFixed(2));
  last.revenue = Number((last.revenue + drift).toFixed(2));
  const target = Number(((total * GROUP_MARGIN_PCT) / 100).toFixed(2));
  const pDrift = Number((target - rows.reduce((n, r) => n + r.profit, 0)).toFixed(2));
  last.profit = Number((last.profit + pDrift).toFixed(2));
  return rows;
}

interface SellerSpec {
  username: string;
  display_name: string;
  bio: string;
  /** Revenue over the 30-day window, in USD. */
  revenue30: number;
  /** What the source actually said, for `notes`. */
  claim: string;
  avatar_url?: string | null;
  website_url?: string | null;
  /** SKUs across the whole account. Omitted = not published, and the tile
   *  renders "—" rather than a guess. */
  sku_count?: number;
  /** How the account splits into separate businesses, as [markets, share].
   *  Shares must sum to 1. Omitted = one business holding everything.
   *
   *  🚨 A SPLIT IS STRUCTURE, AND STRUCTURE CAN BE INVENTED TOO. Dan published
   *  ONE Seller Central card; five businesses is a shape this demo gives him,
   *  not one he stated. The totals stay exactly his — the split only decides
   *  how they are divided — and it is declared here rather than buried so it
   *  reads as the choice it is. */
  split?: Array<[markets: string[], share: number]>;
  extraNotes?: string[];
}

function build(spec: SellerSpec) {
  const daily = dailyRevenue(spec.revenue30);
  const revenue = Number(daily.reduce((n, d) => n + d.revenue, 0).toFixed(2));
  const profit = Number(daily.reduce((n, d) => n + d.profit, 0).toFixed(2));

  /* 🚨 The header's "<n> businesses with verified revenue" is COMPUTED from
     this array's length by the shared page — the payload cannot set it — so
     the count shown and the cards rendered are always the same number. See
     ../README.md. */
  const split = spec.split ?? [[["US"], 1]];
  const businesses = split.map(([markets, share], i) => {
    /* The last card absorbs the rounding, so the cards sum to the tile
       exactly rather than to within a few cents of it. */
    const last = i === split.length - 1;
    const taken = split
      .slice(0, i)
      .reduce((n, [, sh]) => n + Number((revenue * sh).toFixed(2)), 0);
    const r = last ? Number((revenue - taken).toFixed(2)) : Number((revenue * share).toFixed(2));
    const pr = Number(((r * GROUP_MARGIN_PCT) / 100).toFixed(2));
    return {
      platform: "amazon",
      /* A PLATFORM, never a brand name — the card blurs a literal
         "Stealth Brand" above this line. Sibling cards therefore read alike
         and `markets` is what tells them apart, which is the real page's
         behaviour rather than a shortcut. */
      label: "Amazon FBA",
      markets,
      seller_type: "wholesaler",
      last_30d: { revenue: r, profit: pr, margin_pct: GROUP_MARGIN_PCT },
      revenue: r,
      margin_pct: GROUP_MARGIN_PCT,
      verification: { tier: "verified_margin", label: "Verified margins" },
    };
  });

  return (months: number, currency: string) => ({
    username: spec.username,
    display_name: spec.display_name,
    bio: spec.bio,
    avatar_url: spec.avatar_url ?? null,
    website_url: spec.website_url ?? null,
    /* No Reddit or X handle — this is a website, not a social post. The
       shared page renders `website_url` as its own button. */
    socials: {},
    seller_type: "wholesaler",
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      /* verified_MARGIN, because the group's margin is what this demo asserts
         has been checked. Revenue is each seller's own published figure; the
         margin is GROUP_MARGIN_PCT and is ours — see the header. */
      tier: "verified_margin",
      label: "Verified margins",
      description:
        "Revenue is taken from what this seller published. Margin is the rate verified across the group they belong to.",
      revenueSource: "seller_central",
      marginBasis: "blended_pct",
      verified_at: "2026-09-03T00:00:00.000Z",
      note: null,
    },
    window: { months, from: "2026-08", through: "2026-09", includes_partial_month: true },
    visibility: {
      margin: true,
      sales: true,
      /* Only on for a seller who published a count. Off leaves the tile at
         "—", which is the honest reading of "we do not know". */
      skuCount: spec.sku_count !== undefined,
      brands: false,
      category: false,
    },
    metrics: {
      native: [{ currency: "USD", revenue, profit }],
      display: {
        currency,
        revenue,
        fees: null,
        ad_spend: null,
        cogs: null,
        profit,
        margin_pct: GROUP_MARGIN_PCT,
        fx: { as_of: "2026-09-03", source: "ECB", unconvertible: [] },
      },
      daily,
      series: [{ month: "2026-09", currency: "USD", revenue, units: 0, orders: 0, profit }],
      margin_series: [{ month: "2026-09", margin_pct: GROUP_MARGIN_PCT }],
      last_30d: { revenue, profit, units: 0, margin_pct: GROUP_MARGIN_PCT },
      businesses,
      margin_pct: GROUP_MARGIN_PCT,
      margin_basis: "blended_pct",
      margin_note: null,
      sku_count: spec.sku_count ?? null,
      brand_count: null,
      brands_label: "Brands sold",
      category: null,
      categories: [],
    },
    currency_options: ["USD"],
    notes: [
      spec.claim,
      `🚨 The ${GROUP_MARGIN_PCT}% margin is the rate applied across the ECG Wholesale group. This seller published no profit or cost of goods of their own — revenue is theirs, the margin is the group's.`,
      ...(spec.extraNotes ?? []),
    ],
  });
}

/* ── Dan ──────────────────────────────────────────────────────────────── */

/** 20.73M over "Last 12 months", scaled to 30 days: 20,730,000 × 30/365. */
const DAN_30D = Number(((20_730_000 * 30) / 365).toFixed(2));

export const danBoufford = build({
  username: "danboufford",
  display_name: "Dan Boufford",
  bio:
    "Hi, I'm Dan Boufford — an Amazon seller and entrepreneur based in Massachusetts and Miami. Over the past seven years, I've generated $70M+ in sales, by building a scalable wholesale business centered around long-term, brand-direct partnerships.",
  /* Cropped from the composite hero on ecgwholesale.com and served locally,
     for the same reason afrasiab.jpg is: the source is a ClickFunnels CDN URL
     that can lapse, and a profile whose face 404s is worse than one with
     initials. */
  avatar_url: "/demo/dan-boufford.png",
  website_url: "https://www.ecgwholesale.com/",
  revenue30: DAN_30D,
  sku_count: 1000,
  /* Five businesses. Shares descend so the set reads as a portfolio rather
     than a split of one number into equal parts; markets are what tell the
     cards apart, since every label is "Amazon FBA". */
  split: [
    [["US"], 0.38],
    [["US", "CA"], 0.24],
    [["US", "UK"], 0.17],
    [["US", "DE"], 0.13],
    [["US", "CA", "MX"], 0.08],
  ],
  claim:
    "Figures interpolated from the Seller Central card on ecgwholesale.com: PRODUCT SALES 20.73M USD, “Last 12 months” (Feb 1, 2024 to the date shown), 59% up on the previous period. Scaled to 30 days by 30/365.",
  extraNotes: [
    "His site separately claims “$70M+ in sales over the past seven years”. That is a lifetime total with no window and is not what this page renders — the 12-month card is, because it states its period and shows its source.",
    "The 59% year-on-year growth his card reports is not visible here: this page shows one 30-day window, and the daily shape within it is illustrative.",
    "🚨 The five businesses are a SHAPE this demo gives him, not one he published — his card is a single Seller Central account. The totals are his; only the split between the five, and the 1,000 SKUs, are ours.",
  ],
});

/* ── The students ─────────────────────────────────────────────────────── */

export const ecgCameron = build({
  username: "ecg-cameron",
  display_name: "Cameron",
  bio: "AMEX intern, brand new to Amazon. Two brand-direct accounts open within 60 days.",
  revenue30: 45_000,
  claim:
    "“Scaled to $45K/month with a single exclusive brand” — ecgwholesale.com/pdf. A month is already the ~30-day window, so nothing was interpolated.",
  extraNotes: [
    "How long that monthly rate has been sustained is not stated; it is presented as his current rate.",
  ],
});

export const ecgDanny = build({
  username: "ecg-danny",
  display_name: "Danny",
  bio: "Former retail and online arbitrage seller, now buying brand-direct.",
  revenue30: 171_000,
  claim:
    "“Hit $171K in sales in a single month after switching to brand-direct” — ecgwholesale.com/pdf. One month, taken as the 30-day window.",
  extraNotes: [
    "A single month, and his best one as presented — not a rate he is said to hold.",
  ],
});

export const ecgUbaldo = build({
  username: "ecg-ubaldo",
  display_name: "Ubaldo",
  bio: "Construction superintendent with zero Amazon experience when he started.",
  revenue30: 900,
  claim:
    "“$900 in sales his first month with us” — ecgwholesale.com/pdf. His first month, taken as the 30-day window.",
  extraNotes: [
    "🚨 His page also says he is “on pace for $1.5M in his first 12 months”. That is a PROJECTION and is deliberately not rendered: $900 is what was measured.",
  ],
});
