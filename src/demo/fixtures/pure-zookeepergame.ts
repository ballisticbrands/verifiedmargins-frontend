/* Demo fixture: a single-business seller.
 *
 * The figures supplied cover 2025-08-01 → 2026-08-23, which is 388 days, not
 * a year. Every 30-day number here is that period scaled by 30/388 — stated
 * because "interpolated from 13 months" and "measured over 30 days" are very
 * different claims, and this page renders the second while meaning the first.
 *
 *   sales      765,478.78 → 59,186.50
 *   orders         69,142 →      5,346
 *   units          73,353 →      5,672
 *   ad spend   −31,416.64 →  −2,429.12
 *   net profit 345,641.32 →  26,724.84
 *   payout     425,290.57 →  32,883.29
 *   COGS = payout − net profit = 79,649.25 → 6,158.45
 *   margin = net profit / sales = 45.15%
 *
 * 🚧 Refunds (959 over the period, ~74 in 30 days) has NO home in the public
 * payload — there is no refunds field anywhere in PublicProfile. It is
 * surfaced in `notes` rather than dropped silently.
 */

const F = 30 / 388;

const FULL = {
  sales: 765_478.78,
  refunds: 959,
  orders: 69_142,
  units: 73_353,
  adSpend: -31_416.64,
  netProfit: 345_641.32,
  payout: 425_290.57,
};
const COGS_FULL = FULL.payout - FULL.netProfit;

const D30 = {
  sales: FULL.sales * F,
  refunds: FULL.refunds * F,
  orders: FULL.orders * F,
  units: FULL.units * F,
  adSpend: FULL.adSpend * F,
  netProfit: FULL.netProfit * F,
  payout: FULL.payout * F,
  cogs: COGS_FULL * F,
};

const MARGIN_PCT = Number(((FULL.netProfit / FULL.sales) * 100).toFixed(1));

/** Trailing 30 days ending on the last day of the supplied period. */
const LAST_DAY = Date.UTC(2026, 7, 23);
const DAY_MS = 86_400_000;

/* A flat line would read as invented, so the days carry a weekday shape —
 * then every series is rescaled so the 30 points sum EXACTLY to the
 * interpolated totals above. A chart that disagrees with the tile beneath it
 * is the bug this whole page exists to avoid. */
const SHAPE = [0.86, 1.04, 1.08, 1.06, 1.02, 0.99, 0.95];

function build() {
  const raw = Array.from({ length: 30 }, (_, i) => {
    const t = LAST_DAY - (29 - i) * DAY_MS;
    const d = new Date(t);
    return { t, weight: SHAPE[d.getUTCDay()] ?? 1 };
  });
  const totalWeight = raw.reduce((n, r) => n + r.weight, 0);
  return raw.map(({ t, weight }) => {
    const share = weight / totalWeight;
    const revenue = D30.sales * share;
    return {
      date: new Date(t).toISOString().slice(0, 10),
      revenue: Number(revenue.toFixed(2)),
      units: Math.round(D30.units * share),
      orders: Math.round(D30.orders * share),
      profit: Number((D30.netProfit * share).toFixed(2)),
    };
  });
}

const DAILY = build();

export function pureZookeepergame(months: number, currency: string) {
  return {
    username: "Pure_Zookeepergame_2",
    display_name: null,
    bio: "This is the bio of Pure_Zookeepergame_2",
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/Pure_Zookeepergame_2/" },
    seller_type: "private_label",
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      tier: "verified_margin",
      label: "Verified margin",
      description:
        "Sales, fees and ad spend come from Amazon; margin is computed against cost of goods.",
      revenueSource: "spapi",
      marginBasis: "per_sku",
      verified_at: "2026-08-23T00:00:00.000Z",
      note: null,
    },
    window: {
      months,
      from: "2025-08",
      through: "2026-08",
      includes_partial_month: true,
    },
    visibility: { margin: true, sales: true, skuCount: true, brands: true, category: true },
    metrics: {
      native: [{ currency: "USD", revenue: FULL.sales, profit: FULL.netProfit }],
      display: {
        currency,
        revenue: FULL.sales,
        fees: Number((FULL.payout - FULL.sales).toFixed(2)),
        ad_spend: FULL.adSpend,
        cogs: Number(COGS_FULL.toFixed(2)),
        profit: FULL.netProfit,
        margin_pct: MARGIN_PCT,
        fx: { as_of: "2026-08-23", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day, already in the display
         currency (single-currency seller, so no conversion to do). */
      daily: DAILY,
      /* Monthly is the fallback path only; kept minimal and consistent. */
      series: [
        {
          month: "2026-08",
          currency: "USD",
          revenue: Number(D30.sales.toFixed(2)),
          units: Math.round(D30.units),
          orders: Math.round(D30.orders),
          profit: Number(D30.netProfit.toFixed(2)),
        },
      ],
      margin_series: [{ month: "2026-08", margin_pct: MARGIN_PCT }],
      last_30d: {
        revenue: Number(D30.sales.toFixed(2)),
        profit: Number(D30.netProfit.toFixed(2)),
        units: Math.round(D30.units),
        margin_pct: MARGIN_PCT,
      },
      businesses: [
        {
          platform: "amazon",
          label: "Amazon FBA",
          markets: ["US"],
          seller_type: "private_label",
          last_30d: {
            revenue: Number(D30.sales.toFixed(2)),
            profit: Number(D30.netProfit.toFixed(2)),
            margin_pct: MARGIN_PCT,
          },
          revenue: FULL.sales,
          margin_pct: MARGIN_PCT,
          verification: { tier: "verified_margin", label: "Verified margin" },
        },
      ],
      margin_pct: MARGIN_PCT,
      margin_basis: "per_sku",
      margin_note: null,
      sku_count: 34,
      brand_count: 1,
      brands_label: "Brands sold",
      category: "Home & Kitchen",
      categories: [{ name: "Home & Kitchen", revenue: FULL.sales }],
    },
    currency_options: ["USD", "EUR", "GBP", "CAD"],
    notes: [
      `Estimated payout $${D30.payout.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and ${Math.round(D30.refunds)} refunds over the same 30 days. Neither has a field on a public profile yet.`,
      "Figures interpolated from 2025-08-01 → 2026-08-23 (388 days), scaled to 30.",
    ],
  };
}
