/* Demo fixture: a first private-label launch, five months in.
 *
 * Source: https://www.reddit.com/r/AmazonFBA/comments/1vyuh81/ (2026-08-26),
 * "5 months ago, I launched a brand new Amazon private label." The post body
 * states $95,988 sales / 3,383 orders / $15,115 net profit; the Sellerboard
 * card he attached to it carries the same period to the cent, plus units,
 * refunds, ad cost and payout, and is where the extra figures below come from:
 *
 *   Custom range 1 April – 26 August 2026
 *   Sales $95,988.02 · Orders/Units 3,383 / 3,491 · Refunds 142
 *   Adv. cost -$23,238.55 · Est. payout $37,340.44 · Net profit $15,115.19
 *
 * That range is 2026-04-01 → 2026-08-26 = 148 days, not 30. Every 30-day
 * number here is that period scaled by 30/148 — stated because "interpolated
 * from five months" and "measured over 30 days" are different claims, and
 * this page renders the second while meaning the first.
 *
 *   sales      95,988.02 → 19,457.03
 *   orders         3,383 →        686
 *   units          3,491 →        708
 *   refunds          142 →         29
 *   ad spend  −23,238.55 →  −4,710.52
 *   net profit 15,115.19 →   3,063.89
 *   payout     37,340.44 →   7,569.01
 *   COGS = payout − net profit = 37,340.44 − 15,115.19 = 22,225.25 → 4,505.12
 *   margin = net profit / sales = 15,115.19 / 95,988.02 = 15.746…% → 15.7%
 *
 * `fees` follows the template's convention, payout − sales = −58,647.58 (so it
 * carries Amazon's fees, refunds and the ad cost together; ad spend is also
 * broken out on its own line).
 *
 * 🚧 Not published anywhere in the post, so NOT rendered: SKU count, brand
 * count, category. `sku_count: null` renders the SKUs tile as "—", and the
 * three matching `visibility` flags are off. Nothing here is guessed.
 *
 * 🚧 Refunds (142) and est. payout have NO home in the public payload — there
 * is no field for either in PublicProfile — so they are surfaced in `notes`
 * rather than dropped silently.
 *
 * 🚧 The SAME account posted a second, much larger set of figures a day
 * earlier (1vxr3ec: 2023 $2.06M, 2024 $13.47M, 2025 $24.83M, 2026 YTD
 * $14.72M) in the first person PLURAL — "our results" — and his bio says he
 * cofounds an agency. Those are a different scale and arguably a different
 * entity, so they are NOT merged into this profile; they are recorded in
 * `notes` so whoever sends this link knows the other claim exists.
 */

const F = 30 / 148;

const FULL = {
  sales: 95_988.02,
  refunds: 142,
  orders: 3_383,
  units: 3_491,
  adSpend: -23_238.55,
  netProfit: 15_115.19,
  payout: 37_340.44,
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

/* The tile figures, rounded once, here — so the daily series can be balanced
   against the SAME numbers the tiles print rather than against unrounded ones
   that differ from them by a cent. */
const TILE = {
  revenue: Number(D30.sales.toFixed(2)),
  profit: Number(D30.netProfit.toFixed(2)),
  units: Math.round(D30.units),
  orders: Math.round(D30.orders),
};

/** Trailing 30 days ending on the last day of the supplied period. */
const LAST_DAY = Date.UTC(2026, 7, 26);
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
  const rows = raw.map(({ t, weight }) => {
    const share = weight / totalWeight;
    return {
      date: new Date(t).toISOString().slice(0, 10),
      revenue: Number((TILE.revenue * share).toFixed(2)),
      units: Math.round(TILE.units * share),
      orders: Math.round(TILE.orders * share),
      profit: Number((TILE.profit * share).toFixed(2)),
    };
  });
  /* Per-day rounding leaves a few cents / a unit or two on the table, which
     would print a chart that adds up to slightly less than the tile above it.
     The last day absorbs the residual, so the sums match to the cent. */
  const last = rows[rows.length - 1];
  const sum = (k: "revenue" | "units" | "orders" | "profit") =>
    rows.reduce((n, r) => n + r[k], 0);
  last.revenue = Number((last.revenue + (TILE.revenue - sum("revenue"))).toFixed(2));
  last.profit = Number((last.profit + (TILE.profit - sum("profit"))).toFixed(2));
  last.units += TILE.units - sum("units");
  last.orders += TILE.orders - sum("orders");
  return rows;
}

const DAILY = build();

export function muchExperience4197(months: number, currency: string) {
  return {
    username: "Much-Experience-4197",
    display_name: "Ahad",
    /* His own Reddit bio, verbatim. A demo whose whole pitch is "this page is
       already yours" cannot carry a placeholder where the bio goes. */
    bio: "Cofounder at Passionate Network an Amazon service provider agency.",
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/Much-Experience-4197/" },
    seller_type: "private_label",
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      tier: "verified_margin",
      label: "Verified margins",
      description:
        "Sales, fees and ad spend come from Amazon; margin is computed against cost of goods.",
      revenueSource: "spapi",
      marginBasis: "per_sku",
      verified_at: "2026-08-26T00:00:00.000Z",
      note: null,
    },
    window: {
      months,
      from: "2026-04",
      through: "2026-08",
      includes_partial_month: true,
    },
    /* SKU count, brands and category are off because he never published them.
       An empty tile is honest; a plausible one is not. */
    visibility: { margin: true, sales: true, skuCount: false, brands: false, category: false },
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
        fx: { as_of: "2026-08-26", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day, already in the display
         currency (single-currency seller, so no conversion to do). */
      daily: DAILY,
      /* Monthly is the fallback path only; kept minimal and consistent. */
      series: [
        {
          month: "2026-08",
          currency: "USD",
          revenue: TILE.revenue,
          units: TILE.units,
          orders: TILE.orders,
          profit: TILE.profit,
        },
      ],
      margin_series: [{ month: "2026-08", margin_pct: MARGIN_PCT }],
      last_30d: {
        revenue: TILE.revenue,
        profit: TILE.profit,
        units: TILE.units,
        margin_pct: MARGIN_PCT,
      },
      businesses: [
        {
          platform: "amazon",
          label: "Amazon FBA",
          markets: ["US"],
          seller_type: "private_label",
          last_30d: {
            revenue: TILE.revenue,
            profit: TILE.profit,
            margin_pct: MARGIN_PCT,
          },
          revenue: FULL.sales,
          margin_pct: MARGIN_PCT,
          verification: { tier: "verified_margin", label: "Verified margins" },
        },
      ],
      margin_pct: MARGIN_PCT,
      margin_basis: "per_sku",
      margin_note: null,
      /* Never stated. null prints the SKUs tile as "—". */
      sku_count: null,
      brand_count: null,
      brands_label: "Brands sold",
      category: null,
      categories: [],
    },
    currency_options: ["USD", "EUR", "GBP", "CAD"],
    notes: [
      "Figures interpolated from the seller's own Sellerboard range 2026-04-01 → 2026-08-26 (148 days), scaled by 30/148.",
      `Estimated payout $${D30.payout.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and ${Math.round(D30.refunds)} refunds over the same 30 days (142 over the full period). Neither has a field on a public profile yet.`,
      "SKU count, brand count and category were not published in the post, so they are left blank rather than estimated.",
      "Separate, unreconciled claim by the same account: a post one day earlier (2026-08-25) gives “our results” as 2023 $2.06M, 2024 $13.47M, 2025 $24.83M, 2026 YTD $14.72M. Those are a different scale, stated in the first person plural, and are NOT included in the figures above.",
    ],
  };
}
