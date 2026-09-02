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
 * ── NOBODY HERE PUBLISHED A PROFIT ───────────────────────────────────────
 *
 * Not Dan, not one student. Every profile is therefore `verified_revenue`
 * with `visibility.margin: false` — the Sirsolrac36 shape. The site's one
 * profit figure, "$12,057/mo average per active student", is an average across
 * a cohort and belongs to none of these four people individually, so it is on
 * the group page as a group figure and in no fixture's tiles.
 */

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
    /* NULL, not 0. No profit was published, and a zero would render as
       "measured, and it was nothing". The shared page checks for null to
       decide whether to offer the Profit plot at all. */
    profit: null,
  }));
  /* Per-day rounding leaves the sum a few cents off the tile; the residue
     goes on the last day so the chart and the tile agree exactly. */
  const drift = Number((total - rows.reduce((n, r) => n + r.revenue, 0)).toFixed(2));
  rows[rows.length - 1]!.revenue = Number((rows[rows.length - 1]!.revenue + drift).toFixed(2));
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
  extraNotes?: string[];
}

function build(spec: SellerSpec) {
  const daily = dailyRevenue(spec.revenue30);
  const revenue = Number(daily.reduce((n, d) => n + d.revenue, 0).toFixed(2));

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
      /* 🚨 verified_REVENUE. Revenue has a source and a period; margin has
         neither, for any of these four. A verified_margin tier here would put
         a green ✓ over a margin tile reading "—". */
      tier: "verified_revenue",
      label: "Verified revenue",
      description:
        "Revenue is taken from what this seller published. No cost of goods was published, so margin is not verified and is not shown.",
      revenueSource: "seller_central",
      marginBasis: null,
      verified_at: "2026-09-03T00:00:00.000Z",
      note: null,
    },
    window: { months, from: "2026-08", through: "2026-09", includes_partial_month: true },
    /* margin OFF — there is no profit figure to protect or to show. */
    visibility: { margin: false, sales: true, skuCount: false, brands: false, category: false },
    metrics: {
      native: [{ currency: "USD", revenue, profit: null }],
      display: {
        currency,
        revenue,
        fees: null,
        ad_spend: null,
        cogs: null,
        profit: null,
        margin_pct: null,
        fx: { as_of: "2026-09-03", source: "ECB", unconvertible: [] },
      },
      daily,
      series: [{ month: "2026-09", currency: "USD", revenue, units: 0, orders: 0, profit: null }],
      /* NULL, not an array of nulls: the shared page adds a Margin plot on the
         array's mere presence, and an empty margin chart is worse than none. */
      margin_series: null,
      last_30d: { revenue, profit: null, units: 0, margin_pct: null },
      businesses: [
        {
          platform: "amazon",
          /* A PLATFORM, never a brand name — the card blurs a literal
             "Stealth Brand" above this line. */
          label: "Amazon FBA",
          markets: ["US"],
          seller_type: "wholesaler",
          last_30d: { revenue, profit: null, margin_pct: null },
          revenue,
          margin_pct: null,
          verification: { tier: "verified_revenue", label: "Verified revenue" },
        },
      ],
      margin_pct: null,
      margin_basis: null,
      margin_note: null,
      sku_count: null,
      brand_count: null,
      brands_label: "Brands sold",
      category: null,
      categories: [],
    },
    currency_options: ["USD"],
    notes: [
      spec.claim,
      "Revenue only: no profit, cost of goods or ad spend was published, so margin is not shown rather than estimated.",
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
  claim:
    "Figures interpolated from the Seller Central card on ecgwholesale.com: PRODUCT SALES 20.73M USD, “Last 12 months” (Feb 1, 2024 to the date shown), 59% up on the previous period. Scaled to 30 days by 30/365.",
  extraNotes: [
    "His site separately claims “$70M+ in sales over the past seven years”. That is a lifetime total with no window and is not what this page renders — the 12-month card is, because it states its period and shows its source.",
    "The 59% year-on-year growth his card reports is not visible here: this page shows one 30-day window, and the daily shape within it is illustrative.",
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
