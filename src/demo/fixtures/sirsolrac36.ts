/* Demo fixture: a single-business seller who published REVENUE ONLY.
 *
 * Source: https://www.reddit.com/r/AmazonFBA/comments/1w18owz/ (2026-08-29),
 * "Motivational post went from $83k to $741k in one year", plus the Seller
 * Central "Sales Snapshot" screenshot attached to that post.
 *
 * 🚨 THIS PROFILE HAS NO MARGIN, AND THAT IS THE POINT.
 * He posted sales, units and order items. He posted NO profit figure and NO
 * COGS. A margin therefore cannot be computed and must not be shown:
 *
 *   - `verification.tier` is "verified_revenue", not "verified_margin"
 *   - `visibility.margin` is false
 *   - every `margin_pct` is null, `profit` is null, `margin_series` is null
 *
 * The one number that looks like a cost is his "almost 20% of my revenue" on
 * PPC. It is NOT used to derive profit anywhere here. Ad spend is a single
 * cost line — revenue minus ads is not profit, it is revenue minus ads — and
 * rendering it as a margin would be inventing his margin for him on a page
 * whose entire pitch is that we did not invent anything. It lives in `notes`
 * as his statement, in his words.
 *
 * The shared page degrades correctly on its own: with every daily `profit`
 * null the dashboard drops the Profit plot, with `margin_series` null it
 * drops the Margin plot, and both tiles render "—". Nothing here has to fake
 * a blank.
 *
 * ── THE PERIOD ──────────────────────────────────────────────────────────
 * The screenshot's own date selector reads "Year to date - 8/27/2026", so the
 * $741,056.10 covers 2026-01-01 → 2026-08-27 = 239 days. NOT 365, and not 30.
 * Every 30-day number below is that period scaled by 30/239, stated in `notes`
 * because "interpolated from an 8-month YTD" and "measured over 30 days" are
 * different claims and this page renders the second while meaning the first.
 *
 *   ordered product sales  741,056.10 → 93,019.59
 *   units ordered               5,007 →      628
 *   total order items           4,979 →      625
 *   profit                          — →        — (never published)
 *   margin                          — →        — (never published)
 *
 * ── ONE DISCREPANCY, RECORDED RATHER THAN SMOOTHED ──────────────────────
 * His title says "$83k to $741k". His own screenshot's comparison row puts the
 * prior year at $224,869.03 for the same YTD window (3.3x, not 8.9x). Only the
 * $741,056.10 is rendered on this page; the $83k is not, because the evidence
 * he attached contradicts it and we have no way to reconcile the two. See
 * `notes`.
 */

/** 2026-01-01 → 2026-08-27 inclusive. */
const PERIOD_DAYS = 239;
const F = 30 / PERIOD_DAYS;

/* Read off his Seller Central "Sales Snapshot", verbatim. Nothing derived.
 * There is deliberately no `profit`, `cogs`, `adSpend` or `payout` key here —
 * a null would invite something later to fill it in. */
const FULL = {
  /** "Ordered product sales", year to date 8/27/2026. */
  sales: 741_056.1,
  /** "Units ordered". */
  units: 5_007,
  /** "Total order items" — Amazon's line-item count, used as `orders`. */
  orders: 4_979,
  /** The comparison row's prior-year figure for the same YTD window. */
  priorYearSales: 224_869.03,
};

const D30 = {
  sales: Number((FULL.sales * F).toFixed(2)),
  units: Math.round(FULL.units * F),
  orders: Math.round(FULL.orders * F),
};

/** Trailing 30 days ending on the screenshot's own through-date. */
const LAST_DAY = Date.UTC(2026, 7, 27);
const DAY_MS = 86_400_000;

/* A flat line would read as invented, so the days carry a weekday shape —
 * then every series is rescaled so the 30 points sum EXACTLY to the totals
 * above. A chart that disagrees with the tile beneath it is the bug this whole
 * page exists to avoid. */
const SHAPE = [0.88, 1.05, 1.07, 1.05, 1.02, 1.0, 0.93];

/** Largest-remainder apportionment: hands out `total` across `shares` as whole
 *  numbers that sum to `total` EXACTLY, spreading the rounding residue over
 *  the days with the largest fractions. Dumping the residue on one day instead
 *  (the obvious shortcut) leaves that day visibly off the trend line. */
function allocate(total: number, shares: number[]): number[] {
  const exact = shares.map((s) => total * s);
  const floors = exact.map((v) => Math.floor(v));
  const short = total - floors.reduce((a, b) => a + b, 0);
  const byFrac = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < short; k++) floors[byFrac[k % byFrac.length].i]++;
  return floors;
}

function build() {
  const days = Array.from({ length: 30 }, (_, i) => {
    const t = LAST_DAY - (29 - i) * DAY_MS;
    return { t, weight: SHAPE[new Date(t).getUTCDay()] ?? 1 };
  });
  const totalWeight = days.reduce((n, d) => n + d.weight, 0);
  const shares = days.map((d) => d.weight / totalWeight);

  const revenue = shares.map((s) => Number((D30.sales * s).toFixed(2)));
  /* Two-decimal rounding leaves a cent or two on the table; park it on the
     biggest day so the 30 points add up to the tile to the cent. */
  const drift = Number((D30.sales - revenue.reduce((a, b) => a + b, 0)).toFixed(2));
  const biggest = shares.indexOf(Math.max(...shares));
  revenue[biggest] = Number((revenue[biggest] + drift).toFixed(2));

  const units = allocate(D30.units, shares);
  const orders = allocate(D30.orders, shares);

  return days.map((d, i) => ({
    date: new Date(d.t).toISOString().slice(0, 10),
    revenue: revenue[i],
    units: units[i],
    orders: orders[i],
    /* He published no profit. Null on every row is what tells the shared
       dashboard not to offer a Profit plot at all. */
    profit: null,
  }));
}

const DAILY = build();

export function sirsolrac36(months: number, currency: string) {
  return {
    username: "Sirsolrac36",
    display_name: "Sirsolrac36",
    /* His Reddit profile carries NO bio. Null is the honest render — the
       initial-letter fallback and a bare handle are fine, and writing him a
       bio would be the exact failure this demo format is built to avoid. */
    bio: null,
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/Sirsolrac36/" },
    /* Never stated. He sells appliances in one category and outsources
       listings and PPC, which is suggestive of private label — but suggestive
       is not published, and the business card reads fine without it. */
    seller_type: null,
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      /* MUST start with "verified" or the green ✓ silently becomes an
         unverified ○ and the header count drops to zero. "verified_revenue",
         not "verified_margin": the sales are evidenced by his Seller Central
         screenshot, the margin is not evidenced by anything. */
      tier: "verified_revenue",
      label: "Verified revenue",
      description:
        "Sales, units and order counts come from Amazon. Margin is not verified — no profit or cost-of-goods figures were published.",
      revenueSource: "spapi",
      /* No basis, because there is no margin. */
      marginBasis: null,
      verified_at: "2026-08-27T00:00:00.000Z",
      note: "Revenue only. This profile shows no profit or margin.",
    },
    window: {
      months,
      from: "2026-01",
      through: "2026-08",
      includes_partial_month: true,
    },
    /* margin: false is the load-bearing one. skuCount and brands are off
       because he published neither — hidden, not zeroed. */
    visibility: {
      margin: false,
      sales: true,
      skuCount: false,
      brands: false,
      category: true,
    },
    metrics: {
      native: [
        {
          currency: "USD",
          revenue: FULL.sales,
          units: FULL.units,
          orders: FULL.orders,
          fees: null,
          ad_spend: null,
          cogs: null,
          profit: null,
          margin_pct: null,
          cogs_complete: false,
        },
      ],
      display: {
        currency,
        revenue: FULL.sales,
        /* Every cost line is null because every cost line is unpublished.
           `ad_spend` in particular is left null on purpose: "almost 20% of my
           revenue" is a ratio he estimated in prose, not a figure he posted,
           and turning it into $148,211.22 on the page would be us stating a
           number he never did. It is in `notes` instead. */
        fees: null,
        ad_spend: null,
        cogs: null,
        profit: null,
        margin_pct: null,
        fx: { as_of: "2026-08-27", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day, already in the display
         currency (single-currency seller, so no conversion to do). */
      daily: DAILY,
      /* Monthly is the fallback path only; kept minimal and consistent. */
      series: [
        {
          month: "2026-08",
          currency: "USD",
          revenue: D30.sales,
          units: D30.units,
          orders: D30.orders,
          profit: null,
        },
      ],
      /* Null, not a row of nulls: the dashboard adds a Margin plot on the mere
         presence of this array, and an empty margin plot on a profile with no
         margin is the misleading render this fixture is built to avoid. */
      margin_series: null,
      last_30d: {
        revenue: D30.sales,
        profit: null,
        units: D30.units,
        margin_pct: null,
      },
      businesses: [
        {
          page: null,
          platform: "amazon",
          /* A PLATFORM, never a brand name — the card blurs a "Stealth Brand"
             placeholder above this line. */
          label: "Amazon FBA",
          markets: ["US"],
          seller_type: null,
          last_30d: {
            revenue: D30.sales,
            profit: null,
            margin_pct: null,
          },
          revenue: FULL.sales,
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
      category: "Home & Kitchen",
      categories: [{ name: "Home & Kitchen", revenue: FULL.sales }],
    },
    currency_options: ["USD", "EUR", "GBP", "CAD"],
    notes: [
      "Revenue only. He published no profit and no cost of goods, so no margin is shown or claimed anywhere on this page.",
      'His words on ad spend: "Did spend alot on PPC Though, almost 20% of my revenue." That is his own estimate as a share of revenue, not a figure he posted, and it is not used to derive profit — one cost line is not a margin.',
      'He also states the operating work was not his: "PPC Listings, and Amazon central account was outsoucred." The numbers are his; the execution behind them was a third party. His Sales Snapshot image carries an "AmazonsExperts.com" watermark, consistent with that.',
      `Figures interpolated from his Seller Central "Year to date - 8/27/2026" snapshot covering 2026-01-01 → 2026-08-27 (${PERIOD_DAYS} days), scaled to 30 by ${PERIOD_DAYS}ths. Ordered product sales $${FULL.sales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, ${FULL.units.toLocaleString()} units ordered, ${FULL.orders.toLocaleString()} total order items.`,
      `His post's headline says "$83k to $741k in one year", but the comparison row of the screenshot he attached puts the prior year at $${FULL.priorYearSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} over the same year-to-date window — a 3.3x increase, not the ~8.9x the title implies. Only the $741,056.10 is rendered here; the $83k is not, because his own evidence contradicts it.`,
      'Orders are Amazon\'s "total order items" line, the only order-like count in the snapshot. Marketplace shown as US, inferred from the USD figures in his screenshot rather than stated by him.',
      "He reports three years in the business before this year's growth.",
    ],
  };
}
