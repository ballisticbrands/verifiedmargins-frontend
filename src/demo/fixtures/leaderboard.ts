/* Demo fixture: the leaderboard, on both of its axes.
 *
 * Payload shape is what `GET /v1/public/leaderboard?by=…&currency=…` returns
 * — the `Board` / `Entry` interfaces at the top of src/pages/Leaderboard.tsx.
 * 🚨 There is no leaderboard client in @ballisticbrands/frontend-shared to
 * check against: the page calls `apiFetch` directly and declares the response
 * type locally. Those two declarations ARE the contract, so an invented field
 * here does not fail a build — it renders as `undefined` or `NaN` and reads
 * like a bug in the page. Keep this file and that interface in step.
 *
 * ── Why the board is built rather than typed out ─────────────────────────
 * The two axes are not two lists. "By business" is one row per business; "by
 * founder" is that same set rolled up per seller. Typed out twice they would
 * disagree the first time a number was edited — a founder whose margin is not
 * the revenue-weighted margin of their own businesses is exactly the kind of
 * arithmetic this product exists to make uncheatable, so the demo must not
 * show it. Both boards are derived from SELLERS below.
 *
 * Deterministic on purpose — no Math.random. A board that reshuffles between
 * two screenshots cannot be reviewed, and cannot be compared with the shot
 * that was sent to someone last week.
 *
 * 🚧 `label` is a PLATFORM, not a brand name ("Amazon FBA"), the same
 * constraint the profile card documents in ../README.md. So sibling rows read
 * alike and `markets` is what tells them apart — which is the real page's
 * behaviour, not a shortcut taken here.
 */

type Tier = "verified_margin" | "verified_revenue";

interface Business {
  label: string;
  markets: string[];
  seller_type: string | null;
  /** Trailing 12 months, USD. `null` = revenue published as private. */
  revenue: number | null;
  margin_pct: number;
  tier: Tier;
}

interface Seller {
  username: string;
  /** `null` on purpose for the handle-only sellers — the page falls back to
   *  the handle, and a board where every row has a tidy display name is not
   *  what a real one looks like. */
  display_name: string | null;
  businesses: Business[];
}

const TIER_LABEL: Record<Tier, string> = {
  verified_margin: "Verified margin",
  verified_revenue: "Verified revenue",
};

/* Margins 15–50%, revenue across four orders of magnitude ($49k → $41M),
 * because a board where everyone is the same size is the one thing this page
 * is arguing against. A wholesaler at 17% above a garage private-label brand
 * at 45% would be the ranking every OTHER seller leaderboard shows; here the
 * small high-margin operators win, which is the whole point. */
const SELLERS: Seller[] = [
  {
    username: "paramint",
    display_name: "Paramint Designs",
    businesses: [
      { label: "Amazon FBA", markets: ["US", "CA"], seller_type: "private_label",
        revenue: 1_840_000, margin_pct: 33.1, tier: "verified_margin" },
      /* Revenue verified, margin self-computed — the mixed case, and the
         reason a founder row takes the WEAKEST tier of its businesses. */
      { label: "Amazon FBA", markets: ["DE", "FR"], seller_type: "private_label",
        revenue: 402_000, margin_pct: 29.1, tier: "verified_revenue" },
    ],
  },
  {
    username: "saltwaterco",
    display_name: "Saltwater Supply Co.",
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "private_label",
        revenue: 4_120_000, margin_pct: 27.6, tier: "verified_margin" },
    ],
  },
  {
    username: "brandtgoods",
    display_name: "Owen Brandt",
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "private_label",
        revenue: 96_400, margin_pct: 48.3, tier: "verified_margin" },
    ],
  },
  {
    username: "nordicgrip",
    display_name: "Nordic Grip",
    businesses: [
      { label: "Amazon FBA", markets: ["DE", "SE", "NL"], seller_type: "private_label",
        revenue: 1_265_000, margin_pct: 38.4, tier: "verified_margin" },
    ],
  },
  {
    username: "wholesale_wes",
    display_name: "Wes Okafor",
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "wholesaler",
        revenue: 11_400_000, margin_pct: 16.8, tier: "verified_margin" },
    ],
  },
  {
    username: "tinygaragefba",
    display_name: null,
    businesses: [
      { label: "Amazon FBM", markets: ["US"], seller_type: "private_label",
        revenue: 48_900, margin_pct: 44.9, tier: "verified_margin" },
    ],
  },
  {
    username: "mkarolyi",
    display_name: "Márton Károlyi",
    businesses: [
      { label: "Amazon FBA", markets: ["DE", "IT", "ES"], seller_type: "private_label",
        revenue: 730_000, margin_pct: 35.2, tier: "verified_margin" },
    ],
  },
  {
    username: "cedarandpine",
    display_name: "Cedar & Pine",
    businesses: [
      { label: "Amazon FBA", markets: ["US", "CA"], seller_type: "private_label",
        revenue: 2_380_000, margin_pct: 31.4, tier: "verified_margin" },
      { label: "Amazon FBM", markets: ["US"], seller_type: "private_label",
        revenue: 214_000, margin_pct: 40.2, tier: "verified_margin" },
    ],
  },
  {
    username: "dropship_dom",
    display_name: "Dom Whitlock",
    businesses: [
      { label: "Amazon FBM", markets: ["US"], seller_type: "dropshipper",
        revenue: 305_000, margin_pct: 15.7, tier: "verified_margin" },
    ],
  },
  {
    username: "sunbeltbrands",
    display_name: "Sunbelt Brands",
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "wholesaler",
        revenue: 6_750_000, margin_pct: 19.2, tier: "verified_margin" },
      { label: "Amazon FBA", markets: ["MX"], seller_type: "wholesaler",
        revenue: 418_000, margin_pct: 23.6, tier: "verified_revenue" },
    ],
  },
  {
    /* Margin public, revenue private. The combination the product's premise
       rests on, and the one the money formatter has to render as "—" rather
       than as $0 — a zero here would be a lie about a real business. */
    username: "quietmargins",
    display_name: null,
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "private_label",
        revenue: null, margin_pct: 42.7, tier: "verified_margin" },
    ],
  },
  {
    username: "pallet_to_prime",
    display_name: null,
    businesses: [
      { label: "Amazon FBA", markets: ["UK", "IE"], seller_type: "private_label",
        revenue: 512_000, margin_pct: 36.8, tier: "verified_margin" },
    ],
  },
  {
    username: "theropegroup",
    display_name: "The Rope Group",
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "private_label",
        revenue: 18_600_000, margin_pct: 22.5, tier: "verified_margin" },
    ],
  },
  {
    username: "basecamp_outdoors",
    display_name: "Basecamp Outdoors",
    businesses: [
      { label: "Amazon FBA", markets: ["US", "CA"], seller_type: "private_label",
        revenue: 3_450_000, margin_pct: 26.4, tier: "verified_margin" },
      { label: "Amazon FBA", markets: ["UK"], seller_type: "private_label",
        revenue: 690_000, margin_pct: 30.8, tier: "verified_margin" },
    ],
  },
  {
    username: "two_owls",
    display_name: "Two Owls Studio",
    businesses: [
      { label: "Amazon FBM", markets: ["US"], seller_type: "private_label",
        revenue: 152_000, margin_pct: 46.1, tier: "verified_margin" },
    ],
  },
  {
    username: "maruyama_k",
    display_name: "Kenji Maruyama",
    businesses: [
      { label: "Amazon FBA", markets: ["JP"], seller_type: "private_label",
        revenue: 2_940_000, margin_pct: 24.8, tier: "verified_margin" },
    ],
  },
  {
    /* The biggest seller on the board sits near the BOTTOM of it. If this row
       ever climbs, the page has started ranking by size. */
    username: "atlasgearworks",
    display_name: "Atlas Gearworks",
    businesses: [
      { label: "Amazon FBA", markets: ["US"], seller_type: "private_label",
        revenue: 41_200_000, margin_pct: 18.4, tier: "verified_margin" },
      { label: "Amazon FBA", markets: ["UK", "DE"], seller_type: "private_label",
        revenue: 7_900_000, margin_pct: 20.9, tier: "verified_margin" },
    ],
  },
  {
    username: "handmade_hal",
    display_name: "Hal Ferry",
    businesses: [
      { label: "Amazon FBM", markets: ["US"], seller_type: "private_label",
        revenue: null, margin_pct: 39.5, tier: "verified_margin" },
    ],
  },
];

/* The backend converts on the way out, so the demo does too — otherwise the
 * currency preference would be a control with no visible effect on this page
 * and a broken conversion path would screenshot clean. Rates match the
 * backend's builtin table (services/profiles/fx.ts). An unlisted code falls
 * back to USD rather than inventing a rate: "no rate for X" is a real state
 * this product reports honestly elsewhere. */
const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.36, AUD: 1.52, JPY: 150,
};

/** Weakest tier wins: a founder is only as verified as their softest number. */
function rollUpTier(businesses: Business[]): Tier {
  return businesses.some((b) => b.tier === "verified_revenue")
    ? "verified_revenue"
    : "verified_margin";
}

/** Revenue-weighted, because a straight mean would let a $49k side project
 *  drag a $41M portfolio's margin around. A seller with any private-revenue
 *  business has no weights, so those fall back to the plain mean — and they
 *  are single-business sellers here, where the two agree. */
function rollUpMargin(businesses: Business[]): number {
  const weighted = businesses.every((b) => b.revenue !== null);
  if (!weighted) {
    const mean = businesses.reduce((n, b) => n + b.margin_pct, 0) / businesses.length;
    return Number(mean.toFixed(1));
  }
  const revenue = businesses.reduce((n, b) => n + (b.revenue ?? 0), 0);
  const profit = businesses.reduce((n, b) => n + (b.revenue ?? 0) * (b.margin_pct / 100), 0);
  return Number(((profit / revenue) * 100).toFixed(1));
}

function rollUpRevenue(businesses: Business[]): number | null {
  return businesses.some((b) => b.revenue === null)
    ? null
    : businesses.reduce((n, b) => n + (b.revenue ?? 0), 0);
}

interface Row {
  username: string;
  display_name: string | null;
  business: { label: string; markets: string[]; seller_type: string | null } | null;
  margin_pct: number;
  revenue: number | null;
  tier: Tier;
}

function founderRows(): Row[] {
  return SELLERS.map((s) => ({
    username: s.username,
    display_name: s.display_name,
    /* No business on a founder row: the founder IS the aggregate, and naming
       one of their businesses beside a rolled-up figure would attribute the
       whole portfolio's margin to it. */
    business: null,
    margin_pct: rollUpMargin(s.businesses),
    revenue: rollUpRevenue(s.businesses),
    tier: rollUpTier(s.businesses),
  }));
}

function businessRows(): Row[] {
  return SELLERS.flatMap((s) =>
    s.businesses.map((b) => ({
      username: s.username,
      display_name: s.display_name,
      business: { label: b.label, markets: b.markets, seller_type: b.seller_type },
      margin_pct: b.margin_pct,
      revenue: b.revenue,
      tier: b.tier,
    })),
  );
}

/** Builds the payload GET /v1/public/leaderboard?by=…&currency=… returns. */
/** Deterministic pseudo-random in [0,1) from a string.
 *
 *  Movement has to be arbitrary-looking but STABLE: a board that reshuffles
 *  its arrows between two screenshots cannot be reviewed, and Math.random
 *  would do exactly that. */
function hashUnit(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10_000) / 10_000;
}

/** Profit from the two figures a row actually carries. `null` when revenue is
 *  private — the profit is not unknown-but-small, it is unknowable, and a 0
 *  would rank them last as though it were measured. */
function profitOf(r: { revenue: number | null; margin_pct: number }): number | null {
  return r.revenue === null ? null : (r.revenue * r.margin_pct) / 100;
}

export function leaderboard(mode: "founder" | "business", currency: string) {
  const rate = RATES[currency];
  const code = rate ? currency : "USD";
  const rows = (mode === "business" ? businessRows() : founderRows())
    /* PROFIT, descending — this fixture feeds the gamified variant, which
       ranks by profit rather than margin. A row that publishes margin but
       keeps revenue private has no computable profit and sorts last: it is
       genuinely unrankable here, and inventing a position for it would be the
       one dishonesty this page cannot afford.
       Ties broken by revenue so the order is total. */
    .sort(
      (a, b) =>
        (profitOf(b) ?? -1) - (profitOf(a) ?? -1) || (b.revenue ?? 0) - (a.revenue ?? 0),
    );

  return {
    mode,
    window_months: 12,
    entries: rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      display_name: r.display_name,
      avatar_url: null,
      business: r.business,
      margin_pct: r.margin_pct,
      revenue: r.revenue === null ? null : Math.round(r.revenue * (rate ?? 1)),
      currency: code,
      verification: { tier: r.tier, label: TIER_LABEL[r.tier] },
      profit: profitOf(r) === null ? null : Math.round(profitOf(r)! * (rate ?? 1)),
      /* Change over the previous 30 days. Skewed positive but not uniformly —
         a board where everyone is up reads as fake, and a real one has a
         bottom half that is flat or falling. */
      /* Null when profit is — a change in an unknowable number is not a
         smaller unknown, it is meaningless, and rendering "+6.2%" beside a
         "—" invites the reader to believe one of the two. */
      profit_change_pct:
        profitOf(r) === null
          ? null
          : Number(
              (hashUnit(`${r.username}|${r.business?.markets.join("") ?? ""}|chg`) * 46 - 15).toFixed(
                1,
              ),
            ),
      /* Positions moved in the same window. Roughly a third hold, which is
         what makes the movers read as movement rather than noise. */
      rank_delta: (() => {
        const u = hashUnit(`${r.username}|${r.business?.markets.join("") ?? ""}|mov`);
        if (u < 0.34) return 0;
        const size = 1 + Math.floor(u * 5) % 4;
        return u < 0.67 ? size : -size;
      })(),
    })),
    /* The board only ever lists sellers who PUBLISHED the ranked number, so a
       short board has to read as "people are private", not as "this product
       is empty". The count is what makes that difference visible. */
    /* Says PROFIT, because that is what this variant ranks. Two rows here
       publish a margin but not a revenue, so their profit is unknowable and
       they sort last showing "—" — they are listed rather than hidden, which
       is the honest shape: present, unrankable, and visibly so. */
    note:
      mode === "business"
        ? "31 more businesses keep their figures private and are not ranked."
        : "24 more founders keep their figures private and are not ranked.",
  };
}
