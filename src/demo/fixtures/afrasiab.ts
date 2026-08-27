/* Demo fixture: an agency owner managing many businesses.
 *
 * Shape mirrors GET /v1/public/profiles/:username exactly (see PublicProfile
 * in @ballisticbrands/frontend-shared/dist/lib/profiles.d.ts). Deliberately a
 * plain object rather than a typed one: it travels through the fetch seam as
 * JSON, so the renderer type-checks it the same way it checks the server's. */

const SERIES: Array<[string, number, number]> = [
  // month, revenue, profit
  ["2025-09", 28_000_000, 11_592_000],
  ["2025-10", 29_200_000, 12_205_600],
  ["2025-11", 33_500_000, 14_405_000],
  ["2025-12", 38_000_000, 16_606_000],
  ["2026-01", 30_500_000, 12_505_000],
  ["2026-02", 31_800_000, 13_101_600],
  ["2026-03", 33_000_000, 13_794_000],
  ["2026-04", 34_600_000, 14_601_200],
  ["2026-05", 35_900_000, 15_185_700],
  ["2026-06", 37_200_000, 15_810_000],
  ["2026-07", 38_600_000, 16_405_000],
  ["2026-08", 40_000_000, 17_000_000],
];

/** ~$34 AOV, ~1.35 units per order — keeps units/orders believable against
 *  revenue instead of round numbers that read as invented. */
const orders = (revenue: number) => Math.round(revenue / 34);
const units = (revenue: number) => Math.round((revenue / 34) * 1.35);

/* ⚠️ The header line "<n> businesses with verified revenue" is COMPUTED by the
 * shared page from this array's length — the payload cannot set it. So the
 * count shown and the cards rendered are the same number, and "117 businesses"
 * would mean 117 cards (an 11,000px page, measured). These twelve sum to the
 * $40M month instead, so the page stays coherent and reviewable.
 *
 * To show a count larger than the list, the shared package needs an optional
 * `businesses_total` falling back to `businesses.length` — a real need for real
 * agencies too, not demo scaffolding. See the note in ../README.md. */
const BUSINESSES: Array<[string, string[], number, number, number]> = [
  // label, markets, last-30d revenue, last-30d profit, margin %
  ["Hearthway Home",        ["US", "CA"],       7_400_000, 3_189_400, 43.1],
  ["Nordvale Outdoors",     ["US", "CA", "MX"], 6_200_000, 2_765_200, 44.6],
  ["Peakform Nutrition",    ["US"],             5_100_000, 2_029_800, 39.8],
  ["Lumen & Co.",           ["US", "UK", "DE"], 4_300_000, 1_986_600, 46.2],
  ["Torqline Tools",        ["US"],             3_600_000, 1_382_400, 38.4],
  ["Verdant Pet",           ["US", "CA"],       3_000_000, 1_317_000, 43.9],
  ["Cobalt Kitchen",        ["US", "UK"],       2_600_000, 1_071_200, 41.2],
  ["Sablewood Baby",        ["US"],             2_200_000, 1_005_400, 45.7],
  ["Ridgeline Auto",        ["US", "CA"],       1_900_000,   714_400, 37.6],
  ["Marisol Beauty",        ["US", "MX"],       1_500_000,   724_500, 48.3],
  ["Alderway Provisions",   ["US", "DE"],       1_200_000,   486_000, 40.5],
  ["Brightwater Outfitters",["US", "UK"],       1_000_000,   420_000, 42.0],
];

export function afrasiab(months: number, currency: string) {
  const series = SERIES.slice(-months);
  const revenue = series.reduce((n, [, r]) => n + r, 0);
  const profit = series.reduce((n, [, , p]) => n + p, 0);

  return {
    username: "afrasiab",
    display_name: "Afrasiab Khan",
    bio:
      "$480M Sales in A Year Alone - Founder @ extremebranding.co.uk - Branding & Scaling Amazon Brands to New Heights with a Blend of SEO and Smart PPC strategies",
    /* Served locally: the LinkedIn CDN URL this came from carries an expiry
     token (e=…) and blocks hotlinking, so linking it directly would 404 on
     someone else's machine and again once the token lapsed. */
    avatar_url: "/demo/afrasiab.jpg",
    website_url: null,
    socials: {
      reddit: "http://reddit.com/u/Smart-Presence",
      linkedin: "https://www.linkedin.com/in/afrasiab-khan-220641173/",
    },
    seller_type: null,
    type: "service_provider",
    claimed: true,
    noindex: true,
    verification: {
      tier: "connected_full",
      label: "Managing 117 verified businesses",
      description:
        "Revenue and profit are aggregated across every business this agency manages with a connected Amazon account.",
      revenueSource: "spapi",
      marginBasis: "per_sku",
      verified_at: "2026-08-01T00:00:00.000Z",
      note: null,
    },
    window: {
      months,
      from: series[0][0],
      through: series[series.length - 1][0],
      includes_partial_month: false,
    },
    visibility: { margin: true, sales: true, skuCount: true, brands: true, category: true },
    metrics: {
      native: [{ currency: "USD", revenue, profit }],
      display: {
        currency,
        revenue,
        fees: -Math.round(revenue * 0.148),
        ad_spend: -Math.round(revenue * 0.071),
        cogs: -Math.round(revenue * 0.356),
        profit,
        margin_pct: Number(((profit / revenue) * 100).toFixed(1)),
        fx: { as_of: "2026-08-27", source: "ECB", unconvertible: [] },
      },
      series: series.map(([month, r, p]) => ({
        month,
        currency: "USD",
        revenue: r,
        units: units(r),
        orders: orders(r),
        profit: p,
      })),
      margin_series: series.map(([month, r, p]) => ({
        month,
        margin_pct: Number(((p / r) * 100).toFixed(1)),
      })),
      last_30d: {
        revenue: 40_000_000,
        profit: 17_000_000,
        units: units(40_000_000),
        margin_pct: 42.5,
      },
      businesses: BUSINESSES.map(([label, markets, r, p, m]) => ({
        platform: "amazon",
        label,
        markets,
        seller_type: "private_label",
        last_30d: { revenue: r, profit: p, margin_pct: m },
        revenue: r * 12,
        margin_pct: m,
        /* 🚨 The shared page gates the green ✓ badge AND the header's
         *    "<n> businesses with verified revenue" count on
         *    tier.startsWith("verified") — "connected_full" silently renders
         *    as an unverified ○. The tier strings are the contract. */
        verification: { tier: "verified_margin", label: "Verified margin" },
      })),
      margin_pct: Number(((profit / revenue) * 100).toFixed(1)),
      margin_basis: "per_sku",
      margin_note: null,
      sku_count: 14_820,
      brand_count: 117,
      brands_label: "Businesses managed",
      category: "Home & Kitchen",
      categories: [
        { name: "Home & Kitchen", revenue: Math.round(revenue * 0.31) },
        { name: "Sports & Outdoors", revenue: Math.round(revenue * 0.22) },
        { name: "Health & Household", revenue: Math.round(revenue * 0.18) },
        { name: "Tools & Home Improvement", revenue: Math.round(revenue * 0.14) },
        { name: "Beauty & Personal Care", revenue: Math.round(revenue * 0.15) },
      ],
    },
    currency_options: ["USD", "EUR", "GBP", "CAD"],
    notes: [],
  };
}
