/* Demo fixture: a UK retail/online-arbitrage seller, one month in — AT A LOSS.
 *
 * Source: https://www.reddit.com/r/AmazonFBA/comments/1vozjjt/ (2026-08-15),
 * "Sellerboard/Tracking profits". The post BODY contains no figures at all —
 * it is a question ("are Amazon fees really that high that I made on loss")
 * attached to one photo of his Sellerboard dashboard card. Every number on
 * this page is transcribed from that photo.
 *
 * ── READ OFF THE SCREENSHOT (i.redd.it/68l0ac66pijh1.jpeg) ────────────────
 * The card is Sellerboard's "Last month" tile, and it reads, verbatim:
 *
 *   Last month · 1-31 July 2026
 *   Sales             £1,451.70
 *   Orders / Units        62 / 65
 *   Refunds                     1
 *   Adv. cost             £0.00
 *   Est. payout       £1,012.23
 *   Net profit          -£29.42
 *
 * Every one of those seven lines was legible at full resolution and none of
 * them is a guess. Currency is £ on the card itself, so GBP — not inferred
 * from the way he writes.
 *
 * ── DERIVED, not read ─────────────────────────────────────────────────────
 *   fees   = payout − sales      = 1,012.23 − 1,451.70 = −439.47
 *   COGS   = payout − net profit = 1,012.23 − (−29.42) =  1,041.65
 *   margin = net profit / sales  = −29.42 / 1,451.70   = −2.0266% → −2.0%
 *
 * The identity closes to the penny: 1,451.70 − 439.47 − 1,041.65 = −29.42.
 * `fees` follows the template's convention (payout − sales), so it carries
 * Amazon's fees and the single refund together; ad cost was zero, so nothing
 * of it is hidden in there.
 *
 * ── SCALING: 31 days → 30 ─────────────────────────────────────────────────
 * His period is a whole calendar month, 1–31 July 2026 = 31 days, and these
 * tiles say "last 30 days". Everything is scaled by 30/31 and it is said out
 * loud in `notes`, because "one calendar month" and "measured over 30 days"
 * are different claims even when they are a day apart:
 *
 *   sales      1,451.70 → 1,404.87
 *   orders           62 →       60   (exactly)
 *   units            65 →       63
 *   refunds           1 →        1
 *   ad spend       0.00 →     0.00
 *   net profit   −29.42 →   −28.47
 *   payout     1,012.23 →   979.58
 *   COGS       1,041.65 → 1,008.05
 *   fees        −439.47 →  −425.29
 *
 * ── 🚨 THIS PAGE RENDERS A LOSS, ON PURPOSE ───────────────────────────────
 * −£28.47 profit on £1,404.87 of sales, a −2.0% margin. He is asking Reddit
 * whether his numbers are as bad as they look; the answer is yes, and a demo
 * that quietly rounded him up to a thin profit would be worthless to him and
 * a lie about the one thing this product claims to do. Nothing here is
 * brightened.
 *
 * ── NOT PUBLISHED, so NOT rendered ────────────────────────────────────────
 *   SKU count, brand count, category → null, with the matching `visibility`
 *   flags off. He never stated any of them. An empty tile is honest.
 *   His "£2-5 profit per item" and "15%+ ROI" are his BUYING criteria, not
 *   results, and are recorded in `notes` rather than turned into a figure.
 */

/** 1–31 July 2026 is 31 days; the page's window is 30. */
const F = 30 / 31;

/** Exactly what the Sellerboard card shows for 1–31 July 2026. */
const FULL = {
  sales: 1_451.7,
  orders: 62,
  units: 65,
  refunds: 1,
  adSpend: 0,
  payout: 1_012.23,
  netProfit: -29.42,
};
const COGS_FULL = FULL.payout - FULL.netProfit;
const FEES_FULL = FULL.payout - FULL.sales;

const D30 = {
  sales: FULL.sales * F,
  orders: FULL.orders * F,
  units: FULL.units * F,
  refunds: FULL.refunds * F,
  adSpend: FULL.adSpend * F,
  payout: FULL.payout * F,
  netProfit: FULL.netProfit * F,
  cogs: COGS_FULL * F,
  fees: FEES_FULL * F,
};

/** Negative, and left that way. */
const MARGIN_PCT = Number(((FULL.netProfit / FULL.sales) * 100).toFixed(1));

/* The tile figures, rounded once, here — so the daily series can be balanced
   against the SAME numbers the tiles print rather than against unrounded ones
   that differ from them by a penny. */
const TILE = {
  revenue: Number(D30.sales.toFixed(2)),
  profit: Number(D30.netProfit.toFixed(2)),
  units: Math.round(D30.units),
  orders: Math.round(D30.orders),
};

/** Trailing 30 days ending on the last day of his period. */
const LAST_DAY = Date.UTC(2026, 6, 31);
const DAY_MS = 86_400_000;

/* A flat line would read as invented, so the days carry a weekday shape —
 * then every series is rescaled so the 30 points sum EXACTLY to the totals
 * above. A chart that disagrees with the tile beneath it is the bug this
 * whole page exists to avoid. Profit is negative, so each day is a small
 * loss; the shape is applied to both and the signs take care of themselves. */
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
  /* Per-day rounding leaves a few pence / a unit or two on the table, which
     would print a chart that adds up to slightly less than the tile above it.
     The last day absorbs the residual, so the sums match to the penny. */
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

/** Money for the notes. The minus sign goes OUTSIDE the £, the way the
 *  Sellerboard card he posted writes it ("-£29.42"), rather than "£-29.42". */
const gbp = (n: number) =>
  `${n < 0 ? "−" : ""}£${Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function thickValuable4753(months: number, currency: string) {
  return {
    username: "Thick-Valuable-4753",
    display_name: "Chicken Boy",
    /* 🚨 His Reddit profile carries NO bio (the scrape returned null), so this
       is null. Writing a plausible one — "UK arbitrage seller, one month in" —
       would be putting words in his mouth on a page that tells him it is
       already his. */
    bio: null,
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/Thick-Valuable-4753/" },
    /* He sources retail/online arbitrage leads through SellerAmp. RA/OA is not
       one of the three values the product has (private_label | wholesaler |
       dropshipper); `wholesaler` renders as "Wholesale" and is the closest of
       them. The RA/OA truth is spelled out in `notes`. */
    seller_type: "wholesaler",
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      /* 🚨 Must start with "verified" — the green ✓ badge and the header's
         "<n> businesses with verified revenue" count are both gated on
         tier.startsWith("verified"). He entered per-unit COGS in Sellerboard
         himself, so margin is per-SKU rather than a blended rate. */
      tier: "verified_margin",
      label: "Verified margins",
      description:
        "Sales, fees and ad spend come from Amazon; margin is computed against cost of goods.",
      revenueSource: "spapi",
      marginBasis: "per_sku",
      verified_at: "2026-07-31T00:00:00.000Z",
      note: null,
    },
    window: {
      months,
      from: "2026-07",
      through: "2026-07",
      /* 1–31 July is a complete calendar month. */
      includes_partial_month: false,
    },
    /* Off for everything he never published. Revenue and margin are what the
       Sellerboard card actually shows, so they are what is shown. */
    visibility: { margin: true, sales: true, skuCount: false, brands: false, category: false },
    metrics: {
      native: [{ currency: "GBP", revenue: FULL.sales, profit: FULL.netProfit }],
      display: {
        currency,
        revenue: FULL.sales,
        fees: Number(FEES_FULL.toFixed(2)),
        /* £0.00 on the card — he runs no PPC at all. Zero, not null: he
           published the figure and it is a real, informative zero. */
        ad_spend: FULL.adSpend,
        cogs: Number(COGS_FULL.toFixed(2)),
        profit: FULL.netProfit,
        margin_pct: MARGIN_PCT,
        fx: { as_of: "2026-07-31", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day, already in the display
         currency (single-currency seller, so no conversion to do). */
      daily: DAILY,
      /* Monthly is the fallback path only; kept minimal and consistent. */
      series: [
        {
          month: "2026-07",
          currency: "GBP",
          revenue: TILE.revenue,
          units: TILE.units,
          orders: TILE.orders,
          profit: TILE.profit,
        },
      ],
      margin_series: [{ month: "2026-07", margin_pct: MARGIN_PCT }],
      last_30d: {
        revenue: TILE.revenue,
        profit: TILE.profit,
        units: TILE.units,
        margin_pct: MARGIN_PCT,
      },
      businesses: [
        {
          page: null,
          platform: "amazon",
          /* A PLATFORM, never a brand name — the card blurs a literal
             "Stealth Brand" above this line. */
          label: "Amazon FBA",
          markets: ["UK"],
          seller_type: "wholesaler",
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
      categories: null,
    },
    currency_options: ["GBP", "USD", "EUR", "CAD"],
    notes: [
      `This month is a LOSS and is shown as one: ${gbp(TILE.profit)} net profit on ${gbp(TILE.revenue)} of sales, a ${MARGIN_PCT.toFixed(1)}% margin. That is what his own Sellerboard card says, unadjusted.`,
      "Every figure comes from the Sellerboard screenshot attached to his post — sales £1,451.70, orders/units 62/65, refunds 1, adv. cost £0.00, est. payout £1,012.23, net profit −£29.42, for 1–31 July 2026. His post body states no numbers at all.",
      "Fees (payout − sales = −£439.47) and cost of goods (payout − net profit = £1,041.65) are derived from those figures, not read off the card. They reconcile exactly: 1,451.70 − 439.47 − 1,041.65 = −29.42.",
      "His period is a calendar month of 31 days and these tiles describe 30, so every number above is scaled by 30/31.",
      "Advertising cost was £0.00 for the month — he runs no PPC — so the loss is Amazon's fees plus cost of goods, with nothing hidden in ad spend.",
      `Estimated payout ${gbp(Number(D30.payout.toFixed(2)))} and ${Math.round(D30.refunds)} refund over the same 30 days (1 over the full month). Neither has a field on a public profile yet.`,
      'Sourcing is retail/online arbitrage — he buys leads with SellerAmp. The product offers only private_label, wholesaler and dropshipper, so `seller_type` shows "Wholesale", the closest of the three; RA/OA is what he actually does.',
      'His own buying rule, quoted from the post and NOT a measured result: "at least 15% or more ROI, most of them making between £2-5 profit per item."',
      "He was just over a month into selling on Amazon when he posted (2026-08-15), and says he had entered all of his COGS per unit in Sellerboard before taking this screenshot.",
      "SKU count, brand count and category were never published, so those fields are left blank rather than estimated.",
      "Currency is GBP: the card itself prints £, and the market is Amazon UK.",
    ],
  };
}
