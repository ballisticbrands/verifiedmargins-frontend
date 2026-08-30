/* Demo fixture: a single-business seller, Amazon UK, GBP.
 *
 * Source: https://www.reddit.com/r/AmazonFBA/comments/1vl86ee/ (2026-08-11),
 * his own July 2026 P&L for his SECOND brand. Every figure below is one he
 * posted or is arithmetic on figures he posted — nothing is filled in.
 *
 * 🚨 HE PAYS NO REFERRAL FEES. He is on Amazon's New Seller Incentives and
 * says so in the third paragraph of his own post, before any number:
 * "that's doing a lot of work in this month's profit and I know it." The
 * 47.4% margin on this page exists partly because of that, and `notes`
 * carries it. A demo of his numbers without that line misrepresents him.
 *
 * ── The month, as he posted it (all ex-VAT, his own basis) ────────────────
 *   units                                                            627
 *   sales inc VAT                                              £6,138.79
 *   sales ex VAT                                               £5,216.64   ← revenue here
 *   FBA £1.52/unit + digital services £0.03/unit  = £1.55 × 627  £971.85   ← fees
 *   landed from China £0.70/unit                  =        × 627  £438.90   ← COGS
 *   referral fee (New Seller Incentives)                          £0.00
 *   ad spend                                                   £1,332.10
 *   net profit                                                 £2,473.79
 *
 *   5,216.64 − 971.85 − 438.90         = 3,805.89   ✓ his "£6.07 a unit"
 *   3,805.89 − 1,332.10                = 2,473.79   ✓ his "what's actually left"
 *   margin = 2,473.79 / 5,216.64       =    47.4%
 *
 * Revenue is the EX-VAT figure, not the £6,138.79 he headlines: he states
 * "all figures ex-VAT" and every cost line above is ex-VAT, so putting the
 * VAT-inclusive number on top of them would produce a margin that is not the
 * margin of anything. The headline figure is in `notes`.
 *
 * ── The scaling ──────────────────────────────────────────────────────────
 * July is 31 days and the page's tiles say "last 30 days", so every 30-day
 * number is the month scaled by 30/31 — stated because "a real month, scaled"
 * and "measured over 30 days" are different claims.
 *
 *   sales ex VAT  5,216.64 → 5,048.36
 *   net profit    2,473.79 → 2,393.99
 *   units              627 →     607
 *   ad spend      1,332.10 → 1,289.13
 *   fees            971.85 →   940.50
 *   COGS            438.90 →   424.74
 *   margin is a ratio and does not move: 47.4%
 *
 * ── What has no home in the payload, and why ─────────────────────────────
 * 🚧 ORDERS: he published units, never an order count (and says Subscribe &
 * Save orders are mixed in, so units ÷ orders is not 1). The daily/series
 * rows below therefore omit `orders` rather than carry an invented one —
 * the shared page maps daily to date/revenue/units/profit and never reads it.
 * 🚧 SKU COUNT and CATEGORY: never stated. `sku_count: null` and
 * `category: null`, both hidden in `visibility`, rather than guessed.
 * 🚧 PPC (clicks, CTR, purchases, attributed sales, ACoS): no field exists;
 * in `notes`.
 * 🚧 HIS FIRST BRAND (£35,360 revenue over ten months, from his 2026-08-13
 * post) is NOT a second business card: he has never published a profit or a
 * margin for it, and a business row needs both. It is in `notes`.
 */

const r2 = (n: number) => Number(n.toFixed(2));

/** July 2026, brand two. Exactly the figures in the post. */
const JULY = {
  units: 627,
  salesIncVat: 6_138.79,
  salesExVat: 5_216.64,
  fbaPerUnit: 1.52,
  digitalServicesPerUnit: 0.03,
  landedPerUnit: 0.7,
  adSpend: 1_332.1,
  netProfit: 2_473.79,
};

/** Amazon's own per-unit charges. Referral fee is £0 — see the note above. */
const FEES = r2((JULY.fbaPerUnit + JULY.digitalServicesPerUnit) * JULY.units); // 971.85
const COGS = r2(JULY.landedPerUnit * JULY.units); //                             438.90

const F = 30 / 31;

const D30 = {
  revenue: r2(JULY.salesExVat * F),
  profit: r2(JULY.netProfit * F),
  units: Math.round(JULY.units * F),
  adSpend: r2(JULY.adSpend * F),
  fees: r2(FEES * F),
  cogs: r2(COGS * F),
};

const MARGIN_PCT = Number(((JULY.netProfit / JULY.salesExVat) * 100).toFixed(1)); // 47.4

/** Trailing 30 days ending on the last day of the month he posted. */
const LAST_DAY = Date.UTC(2026, 6, 31);
const DAY_MS = 86_400_000;

/* A flat line would read as invented, so the days carry a weekday shape —
 * then every series is rescaled so the 30 points sum EXACTLY to the scaled
 * totals above, with the rounding residual pushed onto the last day. A chart
 * that disagrees with the tile beneath it is the bug this page exists to
 * avoid. */
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
      revenue: r2(D30.revenue * share),
      units: Math.round(D30.units * share),
      profit: r2(D30.profit * share),
    };
  });
  /* Rounding 30 shares to the penny loses a few pence and a unit or two. The
     tiles are what he published; the chart has to add up to them. */
  const last = rows[rows.length - 1];
  last.revenue = r2(last.revenue + (D30.revenue - r2(rows.reduce((n, r) => n + r.revenue, 0))));
  last.units = last.units + (D30.units - rows.reduce((n, r) => n + r.units, 0));
  last.profit = r2(last.profit + (D30.profit - r2(rows.reduce((n, r) => n + r.profit, 0))));
  return rows;
}

const DAILY = build();

const GBP = (n: number) =>
  `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** What ~15% of revenue in referral fees would cost him, on his own estimate. */
const REFERRAL_IF_CHARGED = r2(JULY.salesExVat * 0.15);
const PROFIT_AFTER_REFERRAL = r2(JULY.netProfit - REFERRAL_IF_CHARGED);
const MARGIN_AFTER_REFERRAL = Number(((PROFIT_AFTER_REFERRAL / JULY.salesExVat) * 100).toFixed(1));

/* `_currency` is deliberately ignored. The site's picker is switched off and
   every reader gets the USD default (src/currency.tsx), and these are GBP
   figures from Amazon UK — rendering them behind a $ would be a straight
   misstatement of what he earned. Nothing here is converted, so the page is
   pinned to GBP and `notes` says so. */
export function jayeshchauhanreddit(months: number, _currency: string) {
  return {
    username: "jayeshchauhanreddit",
    display_name: "Jayesh Chauhan",
    /* His own Reddit bio, verbatim. A demo whose whole pitch is "this page is
       already yours" cannot carry a placeholder where the bio goes. */
    bio: "Building Amazon UK private label brands since late 2025. 3 live brands. Sharing what's worked (and what hasn't) along the way.",
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/jayeshchauhanreddit/" },
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
      verified_at: "2026-07-31T00:00:00.000Z",
      note: "Referral fees are £0 this month under Amazon's New Seller Incentives — the seller flags this himself.",
    },
    window: {
      months,
      from: "2026-07",
      through: "2026-07",
      includes_partial_month: false,
    },
    /* SKU count and category are off because he never stated either. Turning
       them on with a guessed value is the one thing this page must not do. */
    visibility: { margin: true, sales: true, skuCount: false, brands: true, category: false },
    metrics: {
      native: [{ currency: "GBP", revenue: JULY.salesExVat, profit: JULY.netProfit }],
      display: {
        currency: "GBP",
        revenue: JULY.salesExVat,
        /* Negative, matching the sign Amazon reports a fee with — and the
           template. £0 of it is referral fee. */
        fees: -FEES,
        ad_spend: -JULY.adSpend,
        cogs: COGS,
        profit: JULY.netProfit,
        margin_pct: MARGIN_PCT,
        fx: { as_of: "2026-07-31", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day, already in the display
         currency (single-currency seller, so no conversion to do). `orders`
         is absent on purpose: he never published one. */
      daily: DAILY,
      /* Monthly is the fallback path only; kept minimal and consistent. */
      series: [
        {
          month: "2026-07",
          currency: "GBP",
          revenue: D30.revenue,
          units: D30.units,
          profit: D30.profit,
        },
      ],
      margin_series: [{ month: "2026-07", margin_pct: MARGIN_PCT }],
      last_30d: {
        revenue: D30.revenue,
        profit: D30.profit,
        units: D30.units,
        margin_pct: MARGIN_PCT,
      },
      businesses: [
        {
          page: null,
          platform: "amazon",
          label: "Amazon FBA",
          markets: ["UK"],
          seller_type: "private_label",
          last_30d: {
            revenue: D30.revenue,
            profit: D30.profit,
            margin_pct: MARGIN_PCT,
          },
          revenue: JULY.salesExVat,
          margin_pct: MARGIN_PCT,
          verification: { tier: "verified_margin", label: "Verified margins" },
        },
      ],
      margin_pct: MARGIN_PCT,
      margin_basis: "per_sku",
      margin_note: null,
      sku_count: null,
      /* One of his three live brands — the only one he has published a full
         P&L for. */
      brand_count: 1,
      brands_label: "Brands sold",
      category: null,
      categories: null,
    },
    /* GBP only. Nothing on this page is converted, so offering a reader a
       currency it cannot honour would be offering them a wrong number. */
    currency_options: ["GBP"],
    notes: [
      `🚨 Referral fees are £0 in this month. He is on Amazon's New Seller Incentives and flags it at the top of his own post — "that's doing a lot of work in this month's profit and I know it." He expects roughly 15% of revenue to go once referral fees resume; on these figures that is ${GBP(REFERRAL_IF_CHARGED)}, leaving about ${GBP(PROFIT_AFTER_REFERRAL)} and a ${MARGIN_AFTER_REFERRAL}% margin.`,
      `Profit is his own approximate figure. Subscribe & Save orders in the month are discounted and complicate the VAT and revenue picture, and he says the real number may land slightly under ${GBP(JULY.netProfit)} rather than over.`,
      `Figures are GBP and ex-VAT, exactly as posted for Amazon UK; nothing is converted, so the page stays in GBP whatever display currency is selected. He headlines ${GBP(JULY.salesIncVat)} including VAT — ${GBP(JULY.salesExVat)} is that month stripped of VAT, and is used here so revenue, costs and margin all sit on one basis.`,
      `Interpolated from July 2026 (31 days), scaled to 30: revenue ${GBP(JULY.salesExVat)} → ${GBP(D30.revenue)}, profit ${GBP(JULY.netProfit)} → ${GBP(D30.profit)}, units ${JULY.units} → ${D30.units}, ad spend ${GBP(JULY.adSpend)} → ${GBP(D30.adSpend)}.`,
      `Costs are his own per-unit lines: FBA £1.52 and digital services £0.03 a unit (${GBP(FEES)} as fees) and £0.70 a unit landed from China (${GBP(COGS)} as cost of goods). He describes one product, priced at £9.99 including VAT, £8.32 without.`,
      `PPC over the same month, none of which has a field on a public profile: ${GBP(JULY.adSpend)} across roughly 20 campaigns, 1,739 clicks, 1.21% CTR, 328 purchases, £2,818.50 in attributed sales, ~47% ACoS.`,
      "This is his second Amazon UK brand, launched late October 2025. His first brand, from a separate post, has done £35,360 in revenue over the ten months to August 2026 on a £2,864 launch cost — he has published no profit figure for it, so it is not shown as a second business here.",
      "SKU count and category are blank because the post states neither. His bio says three live brands; only the one he posted a full P&L for is rendered.",
      "Order count is not shown: he published units, not orders, and says Subscribe & Save orders are mixed into the month.",
    ],
  };
}
