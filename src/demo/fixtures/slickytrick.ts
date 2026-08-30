/* Demo fixture: a UK wholesale seller finishing his first FBA year.
 *
 * Source: https://www.reddit.com/r/AmazonFBA/comments/1w2012e/coming_up_on_my_1st_year_fba_in_the_uk/
 * (posted 2026-08-29), plus the Seller Central screenshot attached to it.
 *
 * ── Where each figure came from ──────────────────────────────────────────
 * REVENUE is not in the post body. It is read off the screenshot's header:
 * "Product sales — 231.8K GBP — Aug 1, 2025 to today". Amazon renders that
 * tile to one decimal of a thousand, so £231,800 is HIS number at HIS
 * precision — not a figure anyone here refined.
 *
 * PROFIT is the low end of a self-declared range. His words: "I estimate
 * that after all expenses that there will be about £12-£15,000 pure profit."
 * That is an estimate made days BEFORE his first Ltd tax return is filed —
 * not a Sellerboard payout, not a settled number — so the range is reduced
 * to its conservative end, £12,000, and both facts are stated in `notes` and
 * in the on-page `margin_note`.
 *
 * ── The period is 394 days, not 30 and not 365 ───────────────────────────
 * The screenshot covers 2025-08-01 → 2026-08-29 inclusive = 394 days. Every
 * 30-day number below is that period scaled by 30/394, stated because
 * "interpolated from just over 13 months" and "measured over 30 days" are
 * different claims and this page renders the second while meaning the first.
 *
 *   sales      231,800.00 → 17,649.75
 *   net profit  12,000.00 →    913.71
 *   margin = net profit / sales = 12,000 / 231,800 = 5.2%
 *
 * ── What he did NOT publish, and is therefore absent ─────────────────────
 * Fees, ad spend, COGS, units, orders, SKU count, brand count and category
 * are all null or hidden. He posted no payout figure, so the template's
 * `cogs = payout − net profit` identity has nothing to stand on. The
 * screenshot's "Units Ordered 157" and "Open Orders 127" are TODAY-ONLY
 * tiles from his single best month — multiplying either into a 30-day total
 * would be inventing a number, so units/orders stay at 0 (the payload types
 * them non-null; the profile page renders neither).
 *
 * 🚧 His "35% ROI consistently" is a SOURCING return on cost over the last
 * six months, not the blended net margin this page shows, and the two must
 * not be conflated. It lives in `notes`, which has no home on the page.
 */

/** 2025-08-01 → 2026-08-29 inclusive. */
const PERIOD_DAYS = 394;
const F = 30 / PERIOD_DAYS;

const FULL = {
  /** Screenshot header: "231.8K GBP", Aug 1 2025 → 2026-08-29. */
  sales: 231_800,
  /** Low end of his own "about £12-£15,000 pure profit" estimate. */
  netProfit: 12_000,
};

const D30 = {
  sales: FULL.sales * F,
  netProfit: FULL.netProfit * F,
};

const MARGIN_PCT = Number(((FULL.netProfit / FULL.sales) * 100).toFixed(1));

/** Trailing 30 days ending on the day he posted — the screenshot's "today". */
const LAST_DAY = Date.UTC(2026, 7, 29);
const DAY_MS = 86_400_000;

/* A flat line would read as invented, so the days carry a weekday shape
 * (index = getUTCDay, Sunday first) — then the series is rescaled so the 30
 * points sum EXACTLY to the interpolated totals above. Exactness comes from
 * differencing a rounded RUNNING TOTAL rather than rounding each day on its
 * own: per-day rounding leaves a few pence of drift, and a chart that
 * disagrees with the tile beneath it is the bug this page exists to avoid. */
const SHAPE = [0.86, 1.04, 1.08, 1.06, 1.02, 0.99, 0.95];

const round2 = (n: number) => Math.round(n * 100) / 100;

function build() {
  const raw = Array.from({ length: 30 }, (_, i) => {
    const t = LAST_DAY - (29 - i) * DAY_MS;
    const d = new Date(t);
    return { t, weight: SHAPE[d.getUTCDay()] ?? 1 };
  });
  const totalWeight = raw.reduce((n, r) => n + r.weight, 0);

  let cumWeight = 0;
  let prevRevenue = 0;
  let prevProfit = 0;

  return raw.map(({ t, weight }) => {
    cumWeight += weight;
    const cumShare = cumWeight / totalWeight;
    const cumRevenue = round2(D30.sales * cumShare);
    const cumProfit = round2(D30.netProfit * cumShare);
    const revenue = round2(cumRevenue - prevRevenue);
    const profit = round2(cumProfit - prevProfit);
    prevRevenue = cumRevenue;
    prevProfit = cumProfit;
    return {
      date: new Date(t).toISOString().slice(0, 10),
      revenue,
      /* He published no unit or order counts for any period. The payload
         types both as non-null numbers and the profile page plots neither
         (the four tiles are Profit / Revenue / Margin / SKUs), so 0 is the
         honest placeholder — a derived count would not be. */
      units: 0,
      orders: 0,
      profit,
    };
  });
}

const DAILY = build();

/** What the tiles say — the daily series above sums to exactly these. */
const TILE = {
  revenue: DAILY.reduce((n, d) => n + d.revenue, 0),
  profit: DAILY.reduce((n, d) => n + (d.profit ?? 0), 0),
};

export function slickyTrick(months: number, currency: string) {
  return {
    username: "SlickyTrick",
    display_name: "SlickyTrick",
    /* His Reddit profile carries no bio. Null is the truthful value — a demo
       whose whole pitch is "this page is already yours" cannot put words in
       his mouth to fill the gap. */
    bio: null,
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/SlickyTrick/" },
    seller_type: "wholesaler",
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      /* MUST start with "verified" — a plausible tier like `connected_full`
         silently renders an unverified ○ and zeroes the header count. */
      tier: "verified_margin",
      label: "Verified margins",
      description:
        "Revenue is the seller's own Seller Central sales figure; margin is his stated profit against it.",
      revenueSource: "seller_central",
      /* No per-SKU costs and no blended cost rate were published — the profit
         is a whole-business estimate, so there is no basis to name. */
      marginBasis: null,
      verified_at: "2026-08-29T00:00:00.000Z",
      note: "Self-reported: first-year figures ahead of filing, not yet reconciled to a filed return.",
    },
    window: {
      months,
      from: "2025-08",
      through: "2026-08",
      includes_partial_month: true,
    },
    /* SKU count, brands and category are hidden because he published none of
       the three, not because he chose to withhold them. */
    visibility: {
      margin: true,
      sales: true,
      skuCount: false,
      brands: false,
      category: false,
    },
    metrics: {
      native: [{ currency: "GBP", revenue: FULL.sales, profit: FULL.netProfit }],
      display: {
        currency,
        revenue: FULL.sales,
        /* Not published: he posted no fee, ad-spend or payout figure, and
           without a payout there is no cogs = payout − profit to compute. */
        fees: null,
        ad_spend: null,
        cogs: null,
        profit: FULL.netProfit,
        margin_pct: MARGIN_PCT,
        fx: { as_of: "2026-08-29", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day. Single-currency
         seller, so the values are the GBP he posted, unconverted. */
      daily: DAILY,
      /* Monthly is the fallback path only; kept minimal and consistent. */
      series: [
        {
          month: "2026-08",
          currency: "GBP",
          revenue: Number(TILE.revenue.toFixed(2)),
          units: 0,
          orders: 0,
          profit: Number(TILE.profit.toFixed(2)),
        },
      ],
      margin_series: [{ month: "2026-08", margin_pct: MARGIN_PCT }],
      last_30d: {
        revenue: Number(TILE.revenue.toFixed(2)),
        profit: Number(TILE.profit.toFixed(2)),
        units: 0,
        margin_pct: MARGIN_PCT,
      },
      businesses: [
        {
          page: null,
          platform: "amazon",
          /* A PLATFORM, never a brand or store name — the card blurs a
             literal "Stealth Brand" above this. */
          label: "Amazon FBA",
          markets: ["UK"],
          seller_type: "wholesaler",
          last_30d: {
            revenue: Number(TILE.revenue.toFixed(2)),
            profit: Number(TILE.profit.toFixed(2)),
            margin_pct: MARGIN_PCT,
          },
          revenue: FULL.sales,
          margin_pct: MARGIN_PCT,
          verification: { tier: "verified_margin", label: "Verified margins" },
        },
      ],
      margin_pct: MARGIN_PCT,
      margin_basis: null,
      /* The one caveat that renders ON the page, beside the margin — the rest
         live in `notes`, which the profile page does not surface. */
      margin_note:
        "Seller's own estimate: the low end of a stated £12,000–£15,000 first-year profit range, given days before his first tax return was filed.",
      sku_count: null,
      brand_count: null,
      brands_label: "Brands sold",
      category: null,
      categories: null,
    },
    currency_options: ["GBP", "USD", "EUR", "CAD"],
    notes: [
      "Profit is a RANGE, reduced to its conservative end: he stated 'about £12-£15,000 pure profit after all expenses' and only the £12,000 low end is rendered here.",
      "That profit is his OWN ESTIMATE, made a few days before filing his first year's Ltd company tax return — not a Sellerboard figure and not a settled number.",
      "Revenue £231,800 is not in the post body; it is read from the Seller Central screenshot attached to it ('Product sales 231.8K GBP, Aug 1 2025 to today'), at Amazon's own 0.1K display precision.",
      "Figures interpolated from 2025-08-01 → 2026-08-29 (394 days), scaled to 30 by 30/394.",
      "Figures stay in GBP exactly as posted; the currency switcher relabels them and does not convert.",
      "He separately reports 35% ROI from a wholesaler over the last 6 months. That is a return on cost of goods for one sourcing channel, not the 5.2% blended net margin shown here.",
      "Not published anywhere in the post, so absent rather than estimated: fees, ad spend, COGS, payout, unit and order counts, SKU count, brands and category. The screenshot's 157 units and 127 open orders are same-day tiles, not period totals.",
      "Workload, in his words: 2 days a month ordering and about 3 days prepping stock — under 20 hours a week. No field on a public profile carries it.",
    ],
  };
}
