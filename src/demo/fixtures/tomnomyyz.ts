/* Demo fixture: a Canadian RA/OA + wholesale seller, first year.
 *
 * Source: https://www.reddit.com/r/AmazonFBA/comments/1vtt6ah/ (2026-08-20)
 * "Just crossed $50k monthly sales and it has been a little over a year."
 *
 * ── The arithmetic, such as it is ─────────────────────────────────────────
 * Unlike the zookeeper fixture there is almost NOTHING to interpolate here.
 * He published a MONTHLY figure, and the page's window is 30 days, so the
 * scaling factor is 1 — his number lands on the tiles unchanged:
 *
 *   revenue (30d)  = 50,000          "just crossed $50k monthly sales"
 *   margin         = 10.0%           the LOW end of his stated "10-15%"
 *   profit  (30d)  = 50,000 × 0.10 = 5,000.00
 *
 * 🚨 THE MARGIN IS A RANGE AND WE TAKE THE BOTTOM OF IT. He wrote "about a
 * 10-15% margin". 12.5% would be the midpoint and 15% would be the flattering
 * read; both would be this page inventing a number he did not publish. A demo
 * whose entire pitch is "these are YOUR figures" cannot round someone's claim
 * upward, so the conservative end is the only defensible choice — and it is
 * said out loud in `notes` so he can see which end we used.
 *
 * ── What he did NOT publish, and is therefore not on this page ────────────
 *   fees, ad spend, COGS  → null. He gave one blended margin and no cost
 *                           breakdown. `revenue − profit` is fees + ads +
 *                           COGS lumped together, NOT cogs, so writing it
 *                           into the cogs field would be a fabrication with
 *                           a plausible shape.
 *   units, orders         → omitted entirely. A wholesale/RA seller's unit
 *                           count cannot be derived from revenue without
 *                           inventing an AOV, and there is no AOV in the post.
 *   SKUs, brands, category→ null / hidden via `visibility`. Never stated.
 *
 * ── The one thing he was ambiguous about ──────────────────────────────────
 * "$50k" — he never says USD or CAD, and he sells only on Amazon.ca. See
 * `notes`; the ambiguity belongs on the page, not buried in a silent choice
 * of currency code here.
 */

/** No interpolation: his figure is already a ~30-day (monthly) number. */
const F = 1;

/** Exactly what he published — nothing derived, nothing rounded up. */
const CLAIMED = {
  /** "Just crossed $50k monthly sales", i.e. gross revenue for one month. */
  monthlyGrossRevenue: 50_000,
  /** "about a 10-15% margin" — the LOW end, deliberately. */
  marginPctLow: 10,
  marginPctHigh: 15,
};

const MARGIN_PCT = CLAIMED.marginPctLow;

const D30 = {
  revenue: CLAIMED.monthlyGrossRevenue * F,
  profit: CLAIMED.monthlyGrossRevenue * F * (MARGIN_PCT / 100),
};

/** The 30 days ending on the day he posted. */
const LAST_DAY = Date.UTC(2026, 7, 20);
const DAY_MS = 86_400_000;

/* A flat line would read as invented, so the days carry a weekday shape —
 * then both series are rescaled so the 30 points sum EXACTLY to the tiles
 * above. A chart that disagrees with the tile beneath it is the bug this
 * whole page exists to avoid. */
const SHAPE = [0.86, 1.04, 1.08, 1.06, 1.02, 0.99, 0.95];

/** Rounds a total across `shares` to 2dp and pushes the rounding residual
 *  into the last day, so the printed points sum to the printed tile to the
 *  cent rather than to within a few cents of it. */
function spread(total: number, shares: number[]): number[] {
  const out = shares.map((s) => Number((total * s).toFixed(2)));
  const drift = Number((total - out.reduce((n, v) => n + v, 0)).toFixed(2));
  out[out.length - 1] = Number((out[out.length - 1] + drift).toFixed(2));
  return out;
}

function build() {
  const days = Array.from({ length: 30 }, (_, i) => {
    const t = LAST_DAY - (29 - i) * DAY_MS;
    return { t, weight: SHAPE[new Date(t).getUTCDay()] ?? 1 };
  });
  const totalWeight = days.reduce((n, d) => n + d.weight, 0);
  const shares = days.map((d) => d.weight / totalWeight);
  const revenue = spread(D30.revenue, shares);
  const profit = spread(D30.profit, shares);
  return days.map(({ t }, i) => ({
    date: new Date(t).toISOString().slice(0, 10),
    /* No `units` / `orders` key at all. He stated neither, and there is no
       AOV in the post to derive them from — an invented unit count is the
       exact failure this fixture is written to avoid. The chart plots
       profit, revenue and margin only. */
    revenue: revenue[i],
    profit: profit[i],
  }));
}

const DAILY = build();

export function tomNomYyz(months: number, currency: string) {
  return {
    username: "TomNomYYZ",
    display_name: "TomNomYYZ",
    /* 🚨 His Reddit profile carries NO bio (the scrape returned null), so this
       is null. Writing a plausible one — "Canadian FBA seller, RA/OA and
       wholesale" — would be putting words in his mouth on a page that tells
       him it is already his. */
    bio: null,
    avatar_url: null,
    website_url: null,
    socials: { reddit: "https://www.reddit.com/user/TomNomYYZ/" },
    /* He does RA/OA *and* wholesale. `wholesaler` is the closest of the three
       values the product has (private_label | wholesaler | dropshipper) and
       renders as "Wholesale"; the RA/OA half is spelled out in `notes`. */
    seller_type: "wholesaler",
    type: "seller",
    claimed: true,
    noindex: true,
    verification: {
      /* 🚨 Must start with "verified" — the green ✓ badge and the header's
         "<n> businesses with verified revenue" count are both gated on
         tier.startsWith("verified"). Profit IS derivable here (revenue ×
         his own low-end margin), so this is verified_margin rather than
         the revenue-only tier. */
      tier: "verified_margin",
      label: "Verified margins",
      description:
        "Revenue comes from Amazon; margin is a single blended rate across the whole account rather than computed per SKU.",
      revenueSource: "spapi",
      marginBasis: "blended_pct",
      verified_at: "2026-08-20T00:00:00.000Z",
      note: null,
    },
    window: {
      months,
      from: "2026-07",
      through: "2026-08",
      includes_partial_month: true,
    },
    /* Off for everything he never published. Revenue and margin are the two
       things he actually stated, so they are the two things shown. */
    visibility: { margin: true, sales: true, skuCount: false, brands: false, category: false },
    metrics: {
      native: [{ currency: "CAD", revenue: D30.revenue, profit: D30.profit }],
      display: {
        currency,
        revenue: D30.revenue,
        /* All three null on purpose — see the header comment. */
        fees: null,
        ad_spend: null,
        cogs: null,
        profit: D30.profit,
        margin_pct: MARGIN_PCT,
        fx: { as_of: "2026-08-20", source: "ECB", unconvertible: [] },
      },
      /* What the chart plots — 30 points, one per day. */
      daily: DAILY,
      /* Monthly is the fallback path only; his claim is a single month, so
         this is that one month and nothing else. */
      series: [
        {
          month: "2026-08",
          currency: "CAD",
          revenue: D30.revenue,
          profit: D30.profit,
        },
      ],
      margin_series: [{ month: "2026-08", margin_pct: MARGIN_PCT }],
      last_30d: {
        revenue: D30.revenue,
        profit: D30.profit,
        margin_pct: MARGIN_PCT,
      },
      businesses: [
        {
          page: null,
          platform: "amazon",
          /* A PLATFORM, never a brand name — the card blurs a literal
             "Stealth Brand" above this line. */
          label: "Amazon FBA",
          /* Canada only: "I haven't started the US market yet". */
          markets: ["CA"],
          seller_type: "wholesaler",
          last_30d: {
            revenue: D30.revenue,
            profit: D30.profit,
            margin_pct: MARGIN_PCT,
          },
          revenue: D30.revenue,
          margin_pct: MARGIN_PCT,
          verification: { tier: "verified_margin", label: "Verified margins" },
        },
      ],
      margin_pct: MARGIN_PCT,
      margin_basis: "blended_pct",
      margin_note: null,
      sku_count: null,
      brand_count: null,
      brands_label: "Brands sold",
      category: null,
      categories: null,
    },
    currency_options: ["CAD", "USD", "EUR", "GBP"],
    notes: [
      `He stated a range — "about a 10-15% margin". This page uses the CONSERVATIVE end, ${MARGIN_PCT}%, so profit is $${D30.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} rather than the $${(CLAIMED.monthlyGrossRevenue * (CLAIMED.marginPctHigh / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} the top of his range would give.`,
      "$50,000 is his own monthly GROSS revenue figure, taken as-is: a month is already the ~30-day window these tiles describe, so unlike most of these demos nothing has been interpolated or scaled.",
      "He wrote \"$50k\" without saying USD or CAD, and he sells only on Amazon.ca — his native figures are recorded here as CAD. He has not started the US market.",
      "No fee, ad-spend, COGS, unit or order figure appears in his post, so those fields are empty rather than estimated. Revenue minus profit is fees + advertising + cost of goods combined, not cost of goods.",
      "Margin plots as a flat line because he published one blended rate for the month, not a daily or per-SKU series.",
      "Mixed sourcing: retail/online arbitrage from April-May 2025, adding wholesale after about six months while still doing RA/OA. `seller_type` shows \"Wholesale\", the closest of the three the product offers.",
      "Started with roughly $10,000 of credit-card capital and runs the operation out of his home. Neither figure has a field on a public profile.",
    ],
  };
}
