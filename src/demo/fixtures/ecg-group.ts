/* Demo fixture: the ECG Wholesale GROUP board — /demo/g/ecgwholesale.
 *
 * 🚧 A GROUP IS A FEATURE THE PRODUCT DOES NOT HAVE. Every other demo renders
 * a real page against fixture data; this one renders a page that does not
 * exist yet, which is why it lives behind /demo/g/ and why the component
 * beside it is demo-only. What it argues: a coach, an agency or a mastermind
 * has one page where their people are listed with figures somebody checked,
 * instead of screenshots on a sales page.
 *
 * The rows are read out of the ECG profile fixtures, the same way the demo
 * leaderboard reads the demo profiles — so a row cannot disagree with the
 * page it links to. See ./leaderboard.ts for why that property matters more
 * than the code it costs.
 *
 * ── RANKED BY PROFIT, like the real board ────────────────────────────────
 *
 * It ranked by revenue while these profiles carried no margin. Every business
 * in the group now has a verified 15% margin (GROUP_MARGIN_PCT — 🚨 ours, not
 * theirs; see ./ecgwholesale.ts), so profit is computable and this board ranks
 * on it like every other. The order is identical either way while the rate is
 * uniform, which is exactly why the rate being uniform is worth stating.
 */

import { danBoufford, ecgCameron, ecgDanny, ecgUbaldo } from "./ecgwholesale";

/** The group, in the order they are introduced on ecgwholesale.com/pdf.
 *  The owner first — the board sorts, this is only the source list.
 *  `role` labels a member on the board; only the admin has one. */
const MEMBERS = [
  { build: danBoufford, role: "Admin" },
  { build: ecgCameron, role: null },
  { build: ecgDanny, role: null },
  { build: ecgUbaldo, role: null },
];

/** The slice of a profile payload a board row needs. Same narrow read the
 *  demo leaderboard does; see its ProfilePayload for why it is asserted
 *  rather than trusted. */
interface Member {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  metrics: {
    display: { currency: string };
    last_30d: { revenue: number; profit: number; margin_pct: number };
    businesses: Array<{ label: string; markets: string[]; seller_type: string | null }>;
  };
}

export function ecgGroup(mode: "founder" | "business", _currency: string) {
  const rows = MEMBERS.map((m) => ({ ...m, p: m.build(12, "USD") as unknown as Member })).sort(
    (a, b) => b.p.metrics.last_30d.profit - a.p.metrics.last_30d.profit,
  );

  /* Both tabs, because the page renders both and a "By business" tab showing
     founder rows unchanged reads as a broken page rather than as a demo.
     Every member here runs exactly one business, so the two axes carry the
     same figures under different identities — which is what a business board
     IS for a group of single-business sellers, not a shortcut. */
  const byBusiness = mode === "business";

  return {
    mode,
    window_days: 30,
    entries: rows.map(({ p: m, role }, i) => ({
      rank: i + 1,
      username: m.username,
      display_name: m.display_name,
      avatar_url: m.avatar_url,
      /* A founder row names no business — the founder IS the aggregate. A
         business row names it, and carries no count, matching the real
         payload on both axes. */
      business: byBusiness
        ? {
            name: null,
            label: m.metrics.businesses[0]?.label ?? "Amazon FBA",
            markets: m.metrics.businesses[0]?.markets ?? ["US"],
            seller_type: m.metrics.businesses[0]?.seller_type ?? null,
            slug: null,
          }
        : null,
      business_count: byBusiness ? null : m.metrics.businesses.length,
      margin_pct: m.metrics.last_30d.margin_pct,
      profit: m.metrics.last_30d.profit,
      /* No prior window exists for any of these people — their sources give
         one figure each — so there is no change to report and none is shown.
         A hashed number here would be the only invented movement on a page
         whose whole argument is that the figures are checked. */
      profit_change_pct: null,
      rank_delta: null,
      revenue: m.metrics.last_30d.revenue,
      currency: m.metrics.display.currency,
      /* Every business in the group is verified at the group rate. */
      verification: { tier: "verified_margin", label: "Verified margins" },
      /* Board-only, and only the admin has one. */
      role,
    })),
    /* 🚨 The two students who are NOT on this board, named rather than
       silently dropped. Their absence is a fact about what they published,
       not a judgement about them, and a group page that quietly shows 4 of 6
       is doing the thing this product exists to stop. */
    note:
      "Two more students on ecgwholesale.com/pdf are not ranked here: Seth published a total (“over $1M since starting”) with no period, and Scott published account counts rather than sales.",
  };
}
