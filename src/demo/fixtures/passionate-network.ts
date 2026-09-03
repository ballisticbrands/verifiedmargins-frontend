/* Demo fixtures: the Passionate Network group — Ahad and the businesses he
 * manages.  /demo/g/passionatenetwork
 *
 * 🚨 THE MEMBERS ARE ANONYMOUS, AND THAT IS THE HONEST FORM HERE.
 *
 * The ECG group could name its members because Dan publishes them: five
 * students, with first names and figures, on his own /pdf page. Ahad publishes
 * no client list at all — his Reddit bio says he cofounded an Amazon service
 * provider agency and nothing more. Inventing four plausible sellers with
 * plausible names to fill his board would be fabricating people, on a site
 * whose entire product is that the figures are real.
 *
 * So his members are rendered the way the BACKEND already renders a business
 * whose owner has not claimed it: "Anonymous founder <digits>", the ghost
 * founder shape (see sellerconnect services/profiles/ghost-founders.ts). That
 * is not a workaround — it is what an agency's board would genuinely look like
 * before its clients sign up, which is the case this demo is arguing about.
 *
 * Every figure below is invented, and all of them sit BELOW Ahad's own
 * $19,457 / 30 days, because he is the one managing them.
 */

import { muchExperience4197 } from "./much-experience-4197";

/** Trailing 30 days, ending the day his page was built from. */
const LAST_DAY = Date.UTC(2026, 7, 26);
const DAY_MS = 86_400_000;
const SHAPE = [0.86, 1.04, 1.08, 1.06, 1.02, 0.99, 0.95];

/** 🚨 Invented, every one — see the header. Ordered as they rank. */
const MEMBERS: Array<{ digits: string; revenue30: number; margin: number; markets: string[] }> = [
  { digits: "04812", revenue30: 12_400, margin: 14.2, markets: ["US"] },
  { digits: "27193", revenue30: 7_850, margin: 18.6, markets: ["US", "CA"] },
  { digits: "61207", revenue30: 4_300, margin: 11.9, markets: ["US"] },
  { digits: "83540", revenue30: 2_150, margin: 22.4, markets: ["US", "UK"] },
];

function daily(total: number, marginPct: number) {
  const raw = Array.from({ length: 30 }, (_, i) => {
    const t = LAST_DAY - (29 - i) * DAY_MS;
    return { t, weight: SHAPE[new Date(t).getUTCDay()] ?? 1 };
  });
  const totalWeight = raw.reduce((n, r) => n + r.weight, 0);
  const rows = raw.map(({ t, weight }) => {
    const revenue = Number(((total * weight) / totalWeight).toFixed(2));
    return {
      date: new Date(t).toISOString().slice(0, 10),
      revenue,
      units: 0,
      orders: 0,
      profit: Number(((revenue * marginPct) / 100).toFixed(2)),
    };
  });
  /* The last day absorbs the rounding so the chart sums to the tile exactly. */
  const last = rows[rows.length - 1]!;
  last.revenue = Number(
    (last.revenue + (total - rows.reduce((n, r) => n + r.revenue, 0))).toFixed(2),
  );
  const target = Number(((total * marginPct) / 100).toFixed(2));
  last.profit = Number((last.profit + (target - rows.reduce((n, r) => n + r.profit, 0))).toFixed(2));
  return rows;
}

function member(m: (typeof MEMBERS)[number]) {
  return (months: number, currency: string) => {
    const rows = daily(m.revenue30, m.margin);
    const revenue = Number(rows.reduce((n, d) => n + d.revenue, 0).toFixed(2));
    const profit = Number(rows.reduce((n, d) => n + d.profit, 0).toFixed(2));
    return {
      username: `af-${m.digits}`,
      /* The same name the backend gives an unclaimed business's founder. No
         persona: a plausible human name over figures nobody verified with a
         person is the thing this site exists not to do. */
      display_name: `Anonymous founder ${m.digits}`,
      bio: null,
      avatar_url: null,
      website_url: null,
      socials: {},
      seller_type: "private_label",
      type: "seller",
      claimed: false,
      noindex: true,
      verification: {
        tier: "verified_margin",
        label: "Verified margins",
        description:
          "Revenue and margin come from the connected account Passionate Network manages for this business.",
        revenueSource: "spapi",
        marginBasis: "blended_pct",
        verified_at: "2026-08-26T00:00:00.000Z",
        note: null,
      },
      window: { months, from: "2026-07", through: "2026-08", includes_partial_month: true },
      visibility: { margin: true, sales: true, skuCount: false, brands: false, category: false },
      metrics: {
        native: [{ currency: "USD", revenue, profit }],
        display: {
          currency,
          revenue,
          fees: null,
          ad_spend: null,
          cogs: null,
          profit,
          margin_pct: m.margin,
          fx: { as_of: "2026-08-26", source: "ECB", unconvertible: [] },
        },
        daily: rows,
        series: [{ month: "2026-08", currency: "USD", revenue, units: 0, orders: 0, profit }],
        margin_series: [{ month: "2026-08", margin_pct: m.margin }],
        last_30d: { revenue, profit, units: 0, margin_pct: m.margin },
        businesses: [
          {
            platform: "amazon",
            label: "Amazon FBA",
            markets: m.markets,
            seller_type: "private_label",
            last_30d: { revenue, profit, margin_pct: m.margin },
            revenue,
            margin_pct: m.margin,
            verification: { tier: "verified_margin", label: "Verified margins" },
          },
        ],
        margin_pct: m.margin,
        margin_basis: "blended_pct",
        margin_note: null,
        sku_count: null,
        brand_count: null,
        brands_label: "Brands sold",
        category: null,
        categories: [],
      },
      currency_options: ["USD"],
      notes: [
        "🚨 Every figure on this page is invented. It stands in for a business Passionate Network manages whose owner has not claimed their profile — the anonymous shape a real unclaimed business takes.",
        "Named the way the backend names an ownerless business's founder, rather than with a persona: see ghost-founders.ts.",
      ],
    };
  };
}

export const pnMember1 = member(MEMBERS[0]!);
export const pnMember2 = member(MEMBERS[1]!);
export const pnMember3 = member(MEMBERS[2]!);
export const pnMember4 = member(MEMBERS[3]!);

/* ── The board ────────────────────────────────────────────────────────── */

interface Row {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  metrics: {
    display: { currency: string };
    last_30d: { revenue: number; profit: number; margin_pct: number };
    businesses: Array<{ label: string; markets: string[]; seller_type: string | null }>;
  };
}

const BOARD = [
  { build: muchExperience4197, role: "Admin" },
  { build: pnMember1, role: null },
  { build: pnMember2, role: null },
  { build: pnMember3, role: null },
  { build: pnMember4, role: null },
];

export function passionateNetworkGroup(mode: "founder" | "business", _currency: string) {
  const byBusiness = mode === "business";
  const rows = BOARD.map((m) => ({ ...m, p: m.build(12, "USD") as unknown as Row })).sort(
    (a, b) => b.p.metrics.last_30d.profit - a.p.metrics.last_30d.profit,
  );

  return {
    mode,
    window_days: 30,
    entries: rows.map(({ p, role }, i) => ({
      rank: i + 1,
      username: p.username,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
      business: byBusiness
        ? {
            name: null,
            label: p.metrics.businesses[0]?.label ?? "Amazon FBA",
            markets: p.metrics.businesses[0]?.markets ?? ["US"],
            seller_type: p.metrics.businesses[0]?.seller_type ?? null,
            slug: null,
          }
        : null,
      business_count: byBusiness ? null : p.metrics.businesses.length,
      margin_pct: p.metrics.last_30d.margin_pct,
      profit: p.metrics.last_30d.profit,
      /* No prior window exists for any of these, so no movement is claimed. */
      profit_change_pct: null,
      rank_delta: null,
      revenue: p.metrics.last_30d.revenue,
      currency: p.metrics.display.currency,
      verification: { tier: "verified_margin", label: "Verified margins" },
      role,
    })),
    note: "Four managed businesses are shown anonymously: their owners have not claimed their profiles, so the board names the business rather than a person.",
  };
}
