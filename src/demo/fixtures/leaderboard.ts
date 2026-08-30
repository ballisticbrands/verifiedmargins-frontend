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
 * ── The board IS the demo profiles ───────────────────────────────────────
 * Every row is read out of a demo profile's own payload, by calling the same
 * builder `/demo/<slug>` calls. Nothing is typed out twice, so a row cannot
 * disagree with the page it links to — and a figure corrected in a fixture
 * moves the board with it, in the same commit, without anybody remembering to.
 *
 * That matters more here than anywhere else in the demo set: this board and
 * those profiles get shown to the SAME person, often one click apart, and a
 * leaderboard whose number changes when you click through is a worse
 * advertisement for a verification product than having no leaderboard at all.
 *
 * The two axes are still not two lists. "By business" is one row per business;
 * "by founder" is that same set rolled up per seller by the functions below —
 * a founder whose margin is not the revenue-weighted margin of their own
 * businesses is exactly the arithmetic this product exists to make uncheatable.
 *
 * Deterministic on purpose — no Math.random. A board that reshuffles between
 * two screenshots cannot be reviewed, and cannot be compared with the shot
 * that was sent to someone last week.
 *
 * 🚧 `label` is a PLATFORM, not a brand name ("Amazon FBA"), the same
 * constraint the profile card documents in ../README.md. So sibling rows read
 * alike and `markets` is what tells them apart — which is the real page's
 * behaviour, not a shortcut taken here. The afrasiab demo is the one exception
 * and it predates this file: its twelve businesses carry brand names, which is
 * why the business board reads "Hearthway Home" beside eleven "Amazon FBA"s.
 * Fix it there, not with a special case here.
 */

import { afrasiab } from "./afrasiab";
import { jayeshchauhanreddit } from "./jayeshchauhanreddit";
import { muchExperience4197 } from "./much-experience-4197";
import { pureZookeepergame } from "./pure-zookeepergame";
import { sirsolrac36 } from "./sirsolrac36";
import { slickyTrick } from "./slickytrick";
import { thickValuable4753 } from "./thick-valuable-4753";
import { tomNomYyz } from "./tomnomyyz";

type Tier = "verified_margin" | "verified_revenue";

interface Business {
  label: string;
  markets: string[];
  seller_type: string | null;
  /** Last 30 days, in `currency`. `null` = revenue published as private. */
  revenue: number | null;
  /** `null` when its owner published no profit — see MARGIN_OVERRIDE. */
  margin_pct: number | null;
  currency: string;
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
  verified_margin: "Verified margins",
  verified_revenue: "Verified revenue",
};

/* ── Reading a profile payload ────────────────────────────────────────────
 * `ProfileBuilder` returns `unknown` by design (the payload travels through
 * the fetch seam as JSON, so the renderer type-checks it the way it checks the
 * server's). The board needs a handful of fields off it, so this is the one
 * place that names them — narrow, and asserted at module load rather than
 * trusted, because a fixture that stops carrying `last_30d` should fail loudly
 * here instead of rendering a board full of NaN. */
interface ProfilePayload {
  username: string;
  display_name: string | null;
  metrics: {
    display: { currency: string };
    last_30d: { revenue: number; profit: number | null; margin_pct: number | null };
    businesses: Array<{
      label: string;
      markets: string[];
      seller_type: string | null;
      last_30d: { revenue: number; profit: number | null; margin_pct: number | null };
      verification: { tier: string };
    }>;
  };
}

/** 🚨 The ONE figure on this board its subject did not publish.
 *
 * Sirsolrac36 posted revenue and never profit, so his own page shows the
 * margin as "—" and says why. A board ranked on profit cannot place him at
 * all without one, so the demo gives him 13%.
 *
 * Deliberately a named constant rather than a number buried in a fixture: it
 * is the single place this board asserts something nobody verified, it is one
 * line to delete, and the mismatch with his profile page is then a decision
 * somebody made rather than an accident. Everything else here is read from
 * what its subject actually posted. */
const MARGIN_OVERRIDE: Record<string, number> = { Sirsolrac36: 13 };

/** Every demo profile, in registry order. Adding a profile demo to this list
 *  is what puts it on the board — see ../registry.ts. */
const PROFILES = [
  afrasiab,
  pureZookeepergame,
  jayeshchauhanreddit,
  muchExperience4197,
  sirsolrac36,
  slickyTrick,
  thickValuable4753,
  tomNomYyz,
];

function toSeller(build: (months: number, currency: string) => unknown): Seller {
  /* 12 and "USD" are the profile page's own defaults. Every non-USD demo PINS
     its display currency and ignores this argument — their figures are GBP or
     CAD as posted and nothing converts them — which is why each row carries
     the currency the payload came back with rather than the one asked for. */
  const p = build(12, "USD") as ProfilePayload;
  const m = p.metrics;
  if (!m?.last_30d || !Array.isArray(m.businesses)) {
    throw new Error(`leaderboard fixture: ${p?.username} has no last_30d/businesses`);
  }
  const override = MARGIN_OVERRIDE[p.username];
  return {
    username: p.username,
    display_name: p.display_name,
    businesses: m.businesses.map((b) => ({
      label: b.label,
      markets: b.markets,
      seller_type: b.seller_type,
      revenue: b.last_30d.revenue,
      margin_pct: override ?? b.last_30d.margin_pct,
      currency: m.display.currency,
      /* The profile's own tier, not a re-derivation — the two must agree, and
         the profile is where the claim is made. An overridden margin makes a
         row rankable but does NOT promote it to verified_margin: nobody
         verified a margin its subject never published. */
      tier: b.verification.tier === "verified_margin" ? "verified_margin" : "verified_revenue",
    })),
  };
}

const SELLERS: Seller[] = PROFILES.map(toSeller);

/** Units of each currency per 1 USD. Used ONLY to order rows against each
 *  other — see `usd()`. Nothing on this board is displayed converted.
 *  Rates match the backend's builtin table (services/profiles/fx.ts). */
const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.36, AUD: 1.52, JPY: 150,
};

/** A row's figure in USD, for ordering only.
 *
 * 🚨 A board carrying £, CA$ and $ rows cannot be ranked on the raw numbers —
 * CA$5,000 placed above £2,394 would be a ranking by exchange rate. Each row
 * is still DISPLAYED in the currency its owner posted in, which is what makes
 * it match the profile page it links to; only the sort normalises. */
function usd(amount: number, currency: string): number {
  return amount / (RATES[currency] ?? 1);
}

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
function rollUpMargin(businesses: Business[]): number | null {
  const known = businesses.filter((b) => b.margin_pct !== null);
  /* No business published a margin → the founder has none either. Not 0: a
     zero would rank them as measured-and-terrible rather than unranked. */
  if (known.length === 0) return null;
  const weighted =
    known.length === businesses.length && known.every((b) => b.revenue !== null);
  if (!weighted) {
    const mean = known.reduce((n, b) => n + (b.margin_pct ?? 0), 0) / known.length;
    return Number(mean.toFixed(1));
  }
  const revenue = known.reduce((n, b) => n + (b.revenue ?? 0), 0);
  const profit = known.reduce((n, b) => n + (b.revenue ?? 0) * ((b.margin_pct ?? 0) / 100), 0);
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
  margin_pct: number | null;
  revenue: number | null;
  currency: string;
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
    /* Single-currency sellers throughout, so a roll-up inherits the one
       currency its businesses are in. */
    currency: s.businesses[0]?.currency ?? "USD",
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
      currency: b.currency,
      tier: b.tier,
    })),
  );
}

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

/** Profit from the two figures a row actually carries. `null` when either is
 *  missing — the profit is not unknown-but-small, it is unknowable, and a 0
 *  would rank them last as though it had been measured. */
function profitOf(r: { revenue: number | null; margin_pct: number | null }): number | null {
  if (r.revenue === null || r.margin_pct === null) return null;
  return (r.revenue * r.margin_pct) / 100;
}

/** Builds the payload GET /v1/public/leaderboard?by=…&currency=… returns. */
export function leaderboard(mode: "founder" | "business", _currency: string) {
  const rows = (mode === "business" ? businessRows() : founderRows())
    /* PROFIT, descending — this fixture feeds the gamified variant, which
       ranks by profit rather than margin. A row with no computable profit
       sorts last: it is genuinely unrankable, and inventing a position for it
       would be the one dishonesty this page cannot afford.
       Normalised to USD first, so a mixed-currency board is not ranked by
       exchange rate. Ties broken by revenue so the order is total. */
    .sort((a, b) => {
      const pa = profitOf(a);
      const pb = profitOf(b);
      return (
        (pb === null ? -1 : usd(pb, b.currency)) - (pa === null ? -1 : usd(pa, a.currency)) ||
        usd(b.revenue ?? 0, b.currency) - usd(a.revenue ?? 0, a.currency)
      );
    });

  return {
    mode,
    window_days: 30,
    entries: rows.map((r, i) => ({
      // The real board gives an unrankable entry `rank: null` and sorts it to
      // the bottom; the fixture already sorts them last, so mirroring the null
      // keeps the demo rendering the same shape the production payload does.
      rank: profitOf(r) === null ? null : i + 1,
      username: r.username,
      display_name: r.display_name,
      avatar_url: null,
      business: r.business ? { ...r.business, slug: null } : null,
      /* Founder rows only, matching the real payload — and here it is the real
         count off their own profile rather than a hash: these founders have
         pages you can click through to and count the cards on. */
      business_count: r.business
        ? null
        : (SELLERS.find((s) => s.username === r.username)?.businesses.length ?? 1),
      margin_pct: r.margin_pct,
      revenue: r.revenue,
      /* Each row in the currency its owner posted in, so the figure matches
         the profile page it links to. */
      currency: r.currency,
      verification: { tier: r.tier, label: TIER_LABEL[r.tier] },
      profit: profitOf(r) === null ? null : Math.round(profitOf(r)!),
      /* Change over the previous 30 days. INVENTED, and the only figure here
         that is: no demo profile carries a prior period to compare against.
         Skewed positive but not uniformly — a board where everyone is up reads
         as fake, and a real one has a bottom half that is flat or falling. */
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
    note:
      mode === "business"
        ? "31 more businesses keep their figures private and are not ranked."
        : "24 more founders keep their figures private and are not ranked.",
  };
}
