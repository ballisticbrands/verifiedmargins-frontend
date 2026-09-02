/* Demo fixture: the ECG Wholesale GROUP board — /demo/group/ecgwholesale.
 *
 * 🚧 A GROUP IS A FEATURE THE PRODUCT DOES NOT HAVE. Every other demo renders
 * a real page against fixture data; this one renders a page that does not
 * exist yet, which is why it lives behind /demo/group/ and why the component
 * beside it is demo-only. What it argues: a coach, an agency or a mastermind
 * has one page where their people are listed with figures somebody checked,
 * instead of screenshots on a sales page.
 *
 * The rows are read out of the ECG profile fixtures, the same way the demo
 * leaderboard reads the demo profiles — so a row cannot disagree with the
 * page it links to. See ./leaderboard.ts for why that property matters more
 * than the code it costs.
 *
 * ── RANKED BY REVENUE, and that is not the usual board ───────────────────
 *
 * The real leaderboard ranks by PROFIT, deliberately: margin ranks a hobby
 * above a business, and revenue ranks size rather than skill. But nobody in
 * this group published a profit — not Dan, not one student — so a profit
 * ranking here would be five rows of "—" in rank order of nothing. Revenue is
 * the only figure every member actually published, so it is what this board
 * ranks, and the page says so in as many words.
 */

import { danBoufford, ecgCameron, ecgDanny, ecgUbaldo } from "./ecgwholesale";

/** The group, in the order they are introduced on ecgwholesale.com/pdf.
 *  The owner first — the board sorts, this is only the source list. */
const MEMBERS = [danBoufford, ecgCameron, ecgDanny, ecgUbaldo];

/** The slice of a profile payload a board row needs. Same narrow read the
 *  demo leaderboard does; see its ProfilePayload for why it is asserted
 *  rather than trusted. */
interface Member {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  metrics: {
    display: { currency: string };
    last_30d: { revenue: number };
    businesses: Array<{ label: string; markets: string[]; seller_type: string | null }>;
  };
}

export function ecgGroup(mode: "founder" | "business", _currency: string) {
  const rows = MEMBERS.map((build) => build(12, "USD") as unknown as Member).sort(
    (a, b) => b.metrics.last_30d.revenue - a.metrics.last_30d.revenue,
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
    entries: rows.map((m, i) => ({
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
      /* NULL for everyone, because nobody in this group published a profit or
         a cost of goods. The board renders "—", which is the honest answer and
         is also why this page ranks on revenue instead. */
      margin_pct: null,
      profit: null,
      profit_change_pct: null,
      rank_delta: null,
      revenue: m.metrics.last_30d.revenue,
      currency: m.metrics.display.currency,
      verification: { tier: "verified_revenue", label: "Verified revenue" },
    })),
    /* 🚨 The two students who are NOT on this board, named rather than
       silently dropped. Their absence is a fact about what they published,
       not a judgement about them, and a group page that quietly shows 4 of 6
       is doing the thing this product exists to stop. */
    note:
      "Two more students on ecgwholesale.com/pdf are not ranked here: Seth published a total (“over $1M since starting”) with no period, and Scott published account counts rather than sales.",
  };
}
