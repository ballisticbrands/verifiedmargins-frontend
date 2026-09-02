import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AMAZON_MARK_SRC, ApiError, apiFetch, useBrand,
  verificationBadgeState,
  VERIFICATION_GLYPH,
  VERIFICATION_TIP,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { useCurrency } from "@/currency";

/**
 * The leaderboard, at /leaderboard.
 *
 * 🚨 IT RANKS BY PROFIT OVER 30 DAYS, AND NEVER BY REVENUE. A revenue table is
 * a size ranking, and every other seller leaderboard already measures size.
 * Margin ranked it until 2026-08-30, on the reasoning that margin is the
 * number nobody can check; the revenue half of that survives, but a margin
 * ranking puts a 60%-margin hobby above a business earning twenty times as
 * much. Revenue stays as the context that makes a profit figure readable.
 *
 * WHICH TAB IS IN THE URL (`?by=business`), so a board someone is looking at
 * is a board they can send. See the `useSearchParams` block below.
 *
 * The backend only ever returns businesses whose figures were PUBLISHED and
 * VERIFIED (src/services/profiles/leaderboard.ts). A profile that publishes
 * neither figure is absent rather than listed with a blank, and the response
 * says how many chose that, so a short board reads as "people are private"
 * rather than as "this product is empty". A verified business whose costs are
 * not on file is listed but unranked — it has not placed, which is not the
 * same as placing last.
 */

type Mode = "founder" | "business";

interface Entry {
  /** Null for a verified business with no costs on file: it has not placed,
   *  which is a different thing from placing last. */
  rank: number | null;
  /** Null for an ORPHAN — a business with no founder behind it. */
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  business: {
    /** "Amazon FBA 08873" — derived from the slug, the same string the
     *  business page puts in its own <h1>. Null when it has no slug. */
    name: string | null;
    label: string;
    markets: string[];
    seller_type: string | null;
    slug: string | null;
  } | null;
  /** How many businesses a founder's figures are the total OF. Null on the
   *  business board, where every row IS one business. */
  business_count: number | null;
  margin_pct: number | null;
  revenue: number | null;
  currency: string;
  verification: { tier: string; label: string };
  /** The ranking figure: profit over the last 30 days. */
  profit: number | null;
  /** Change in profit vs the previous 30 days, as a percentage. */
  profit_change_pct: number | null;
  /** 🚧 GROUP BOARDS ONLY (/demo/g/*): what this member is to the group —
   *  "Admin" and nothing else today. Absent on the real board, where a row is
   *  a seller and there is no group to hold a role in. */
  role?: string | null;
  /** Positions gained (+) or lost (−) since the previous 30 days. Null for an
   *  entry that did not place then — a newcomer has not moved. */
  rank_delta: number | null;
}

interface Board {
  mode: Mode;
  window_days: number;
  entries: Entry[];
  note: string | null;
}

/** A board row's badge: the shared ladder, plus the board's own sizing hook. */
function BoardBadge({ verification }: { verification: { tier: string; label: string } }) {
  const state = verificationBadgeState(verification.tier);
  return (
    <span
      data-badge=""
      data-state={state}
      data-board-badge=""
      data-tip={VERIFICATION_TIP[state]}
    >
      {VERIFICATION_GLYPH[state]} {verification.label}
    </span>
  );
}

const SELLER_TYPE_LABEL: Record<string, string> = {
  private_label: "Private label",
  wholesaler: "Wholesale",
  dropshipper: "Dropshipping",
};

function money(n: number | null, currency: string): string {
  if (n === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: Math.abs(n) >= 1000 ? 1 : 0,
    }).format(n);
  } catch {
    return `${Math.round(n).toLocaleString()} ${currency}`;
  }
}

function initials(name: string): string {
  const parts = name.replace(/^[@/]/, "").split(/[\s_-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2);
  return (parts[0]![0]! + parts[1]![0]!).slice(0, 2);
}

/** Positions gained or lost over the last 30 days.
 *
 * A held position renders a dash rather than "0": zero is a quantity and this
 * is the absence of one. Colour is never the only carrier — the arrow and the
 * number say it too, so it survives a red/green colour deficiency. */
function Movement({ delta }: { delta: number | null }) {
  // A newcomer (null) and a held position (0) both render a dash but mean
  // different things, so only the held one says "held" to a screen reader.
  // Colour is never the only carrier — the arrow and the number say it too,
  // so it survives a red/green colour deficiency.
  const dir = delta === null ? "new" : delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return (
    <span
      data-board-move=""
      data-dir={dir}
      aria-label={
        delta === null
          ? "New this period"
          : delta === 0
            ? "Position held"
            : `${Math.abs(delta)} places ${delta > 0 ? "up" : "down"}`
      }
    >
      {delta === null || delta === 0 ? "—" : `${delta > 0 ? "▲" : "▼"}${Math.abs(delta)}`}
    </span>
  );
}

/** Profit change vs the previous 30 days. */
function Change({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const dir = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return (
    <span data-board-change="" data-dir={dir}>
      {pct > 0 ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
}

export function Leaderboard({
  banner,
  variant = "profit",
  profileHref = (username) => `/${username}`,
}: {
  /* A note rendered above the board, inside the content column. The only
   * caller is the /demo/leaderboard page (src/pages/DemoLeaderboard.tsx),
   * which has to mark its figures as illustrative and cannot wrap this
   * component to do it — the Shell below is ours, so anything outside it
   * lands beside the nav rail. A prop, rather than a fork of this page,
   * because a forked demo drifts from the real one the first time either
   * changes. Undefined everywhere else, which renders nothing. */
  banner?: React.ReactNode;
  /**
   * `profit` — THE BOARD. Ranks by 30-day profit, shows the change and the
   * movement, and keeps revenue as context. The default since 2026-08-30.
   *
   * `margin` — the previous board, ranking by margin with no movement. Kept
   * because it is three conditionals rather than a fork, and because the
   * choice between ranking efficiency and ranking size is one worth being
   * able to reverse without a rewrite. Nothing renders it today.
   *
   * `revenue` — size, which the other two exist to avoid ranking. It is here
   * for one case and should stay there: a GROUP whose members published
   * revenue and nothing else (/demo/g/*). Ranking them on profit would be
   * a column of "—" in the rank order of nothing, and ranking on margin the
   * same. A board has to rank on a number its rows actually carry.
   */
  variant?: "margin" | "profit" | "revenue";
  /**
   * Where a row's name links to, given its handle. Defaults to the real
   * public profile at `/<handle>`.
   *
   * 🎭 The /demo board overrides it to `/demo/<handle>`. Its rows ARE the demo
   * profiles — same figures, read out of the same fixtures — but those handles
   * belong to people who have not signed up, so `/<handle>` resolves to the
   * public profile of a seller who does not exist and the board dead-ends on a
   * "not found". A prop rather than a path check inside the row, because this
   * page is also mounted at the real /leaderboard and must keep sending people
   * to real profiles from there.
   */
  profileHref?: (username: string) => string;
} = {}) {
  const brand = useBrand();
  const { currency } = useCurrency();
  /* THE TAB LIVES IN THE URL, so a board someone is looking at is a board
     they can send. `?by=business` is the same parameter the API takes, so the
     page URL and the request it makes say the same word.

     An unrecognised value falls back to "founder" rather than being passed
     through — `?by=nonsense` would otherwise reach the API, which 400s on it,
     and a shared link with a typo would render an error instead of a board.

     The default deletes the parameter instead of writing `?by=founder`, so
     the plain /leaderboard URL stays canonical for the default view rather
     than there being two URLs for one page.

     `replace`, not push: a tab is not a navigation. Pushing would stack a
     history entry per click, so Back would walk a visitor through their own
     tab presses instead of leaving the page. */
  const [params, setParams] = useSearchParams();
  const mode: Mode = params.get("by") === "business" ? "business" : "founder";
  const setMode = useCallback(
    (next: Mode) => {
      const p = new URLSearchParams(params);
      if (next === "founder") p.delete("by");
      else p.set("by", next);
      setParams(p, { replace: true });
    },
    [params, setParams],
  );
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Leaderboard — ${brand.displayName}`;
  }, [brand.displayName]);

  const load = useCallback(async () => {
    setBoard(null);
    setError(null);
    try {
      // auth: false — this is a public page and must render identically for
      // a signed-out visitor and a crawler.
      // The reader's currency from the top bar. A board that ranks by margin
      // but prints revenue in a currency the reader doesn't think in is half
      // unreadable, and the endpoint converts for free.
      setBoard(
        await apiFetch<Board>(`/v1/public/leaderboard?by=${mode}&currency=${currency}`, {
          auth: false,
        }),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    }
  }, [mode, currency]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Shell width="profile">
      {banner}
      <div className="vm-form vm-profile">
        <h1>Leaderboard</h1>
        <p>
          {variant === "revenue" ? (
            <>
              Ranked by revenue over the last 30 days — the only figure every
              member here published. Margin is shown where it was.
            </>
          ) : variant === "profit" ? (
            <>Ranked by profit over the last 30 days.</>
          ) : (
            <>
              Ranked by margin over the last 30 days — not by size. Only sellers who
              chose to publish their margin appear here.
            </>
          )}
        </p>

        <div data-tabs="" role="tablist" aria-label="Leaderboard view">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "founder"}
            data-active={mode === "founder" ? "" : undefined}
            onClick={() => setMode("founder")}
          >
            By founder
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "business"}
            data-active={mode === "business" ? "" : undefined}
            onClick={() => setMode("business")}
          >
            By business
          </button>
        </div>

        {error ? <p role="alert">Could not load the leaderboard: {error}</p> : null}
        {!board && !error ? <p>Loading…</p> : null}

        {board && board.entries.length === 0 ? (
          <p>
            Nothing to rank yet. <Link to="/verify">Verify your business</Link> to be
            the first.
          </p>
        ) : null}

        {board && board.entries.length > 0 ? (
          <ol data-board="" data-variant={variant}>
            {board.entries.map((e) => (
              <li
                key={`${e.username ?? "orphan"}-${e.business?.slug ?? e.business?.label ?? ""}`}
                data-unranked={e.rank === null ? "" : undefined}
              >
                {/* An entry with no rank shows a dash, not a number. It is a
                    verified business we are listing, and it has not placed —
                    which is not the same as placing last. */}
                <span data-board-rank="">{e.rank ?? "—"}</span>
                {variant === "profit" ? <Movement delta={e.rank_delta} /> : null}
                {/* A BUSINESS ROW SHOWS THE BUSINESS, not the person behind
                    it: the platform mark, exactly as the business's own page
                    and its card on a profile do. A founder row still shows the
                    founder's face. Using the founder's photo on a business row
                    made four rows of one seller's estate look like four
                    photographs of the same man. */}
                {e.business ? (
                  <span className="vm-avatar" data-board-mark="" aria-hidden="true">
                    <img src={AMAZON_MARK_SRC} alt="" width={26} height={26} />
                  </span>
                ) : (
                  <span className="vm-avatar" aria-hidden="true">
                    {e.avatar_url ? (
                      <img src={e.avatar_url} alt="" />
                    ) : (
                      initials(e.display_name ?? e.username ?? "?")
                    )}
                  </span>
                )}
                <span data-board-who="">
                  {/* The name and its badge on ONE line. The badge sat out at
                      the right edge, beside the figures, which read as another
                      metric — it is not one. It qualifies the NAME: what was
                      checked about this seller. Next to the thing it is about
                      is where it says that.

                      🚨 An ORPHAN has no founder and therefore no profile to
                      link to. It links to its own business page instead, and
                      when it has neither it is plain text — never a link to
                      "/" or to "/null". */}
                  <span data-board-nameline="">
                    {e.business ? (
                      // A BUSINESS NAMES ITSELF and links to its own page.
                      // The founder is named on the line below — putting the
                      // person's name here made four rows of one seller's
                      // estate read as four entries for the same seller.
                      e.business.slug ? (
                        <Link to={`/business/${e.business.slug}`} data-board-name="">
                          {e.business.name ?? e.business.label}
                        </Link>
                      ) : (
                        <span data-board-name="">{e.business.name ?? e.business.label}</span>
                      )
                    ) : e.username ? (
                      <Link to={profileHref(e.username)} data-board-name="">
                        {e.display_name ?? e.username}
                      </Link>
                    ) : (
                      <span data-board-name="">—</span>
                    )}
                    {/* The shared helpers rather than the shared COMPONENT:
                        a board badge carries `data-board-badge` for its own
                        sizing, and the component takes no pass-through attrs.
                        The ladder itself — state, glyph, tooltip — still has
                        exactly one definition, in the package. */}
                    <BoardBadge verification={e.verification} />
                    {/* 🚧 Group boards only. Deliberately NOT in the
                        verification colour — a role is who someone is to the
                        group, not a claim about their numbers, and the green
                        on this page means "we checked it". */}
                    {e.role ? <span data-board-role="">{e.role}</span> : null}
                  </span>
                  <span data-board-sub="">
                    {/* "By @handle" — the founder, under the business that is
                        named above. The handle is a LINK to their profile: the
                        row's own link goes to the business now, so without
                        this there is no way from a business row to the person
                        running it. On a FOUNDER row the name above is already
                        their link, so the handle stays plain text — "By" would
                        be naming them twice. */}
                    {e.username ? (
                      e.business ? (
                        <>
                          By{" "}
                          <Link to={profileHref(e.username)} data-board-byline="">
                            @{e.username}
                          </Link>
                        </>
                      ) : (
                        <span className="vm-handle">@{e.username}</span>
                      )
                    ) : null}
                    {/* What the figure beside it is the total OF. A founder's
                        profit is an aggregate, and an aggregate with no
                        denominator invites reading it as one business's. */}
                    {e.business_count !== null ? (
                      <>
                        {e.username ? " · " : ""}
                        {e.business_count}{" "}
                        {e.business_count === 1 ? "business" : "businesses"}
                      </>
                    ) : null}
                    {e.business ? (
                      <>
                        {e.username ? " · " : ""}
                        {e.business.label}
                        {e.business.seller_type
                          ? ` · ${SELLER_TYPE_LABEL[e.business.seller_type] ?? e.business.seller_type}`
                          : ""}
                        {e.business.markets.length > 0 ? ` · ${e.business.markets.join(" · ")}` : ""}
                      </>
                    ) : null}
                  </span>
                </span>
                {/* 🚨 EVERY FIGURE NAMES ITSELF, and the LABEL COMES FIRST so
                    the numbers hold the right edge. Two stacked currency
                    amounts with nothing between them are indistinguishable — a
                    reader could take the larger one for the profit, which is
                    the exact opposite of what the board ranks on. With the
                    label leading, the figures form a single right-aligned
                    column a reader can compare down the page instead of one
                    that steps in and out as the words beside it change length.
                    The label is what makes the pair readable, so it is not
                    decoration and is not dropped on a narrow screen. */}
                <span data-board-figures="">
                  {variant === "revenue" ? (
                    <>
                      {/* Revenue leads, and margin follows as the context that
                          stops a big number reading as a good one. Both render
                          "—" honestly when the figure was never published. */}
                      <span data-board-figure="">
                        <small data-board-unit="">Revenue</small>
                        <b data-metric="">{money(e.revenue, e.currency)}</b>
                      </span>
                      <span data-board-figure="">
                        <small data-board-unit="">Margin</small>
                        <span data-board-revenue="">
                          {e.margin_pct === null ? "—" : `${e.margin_pct.toFixed(1)}%`}
                        </span>
                      </span>
                    </>
                  ) : variant === "profit" ? (
                    <>
                      {/* Profit leads; revenue stays as the size context that
                          makes a profit figure readable. */}
                      <span data-board-figure="">
                        <small data-board-unit="">Profit</small>
                        <b data-metric="">{money(e.profit, e.currency)}</b>
                      </span>
                      <Change pct={e.profit_change_pct} />
                      <span data-board-figure="">
                        <small data-board-unit="">Revenue</small>
                        <span data-board-revenue="">{money(e.revenue, e.currency)}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span data-board-figure="">
                        <small data-board-unit="">Margin</small>
                        <b data-metric="">
                          {e.margin_pct === null ? "—" : `${e.margin_pct.toFixed(1)}%`}
                        </b>
                      </span>
                      <span data-board-figure="">
                        <small data-board-unit="">Revenue</small>
                        <span data-board-revenue="">{money(e.revenue, e.currency)}</span>
                      </span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {board?.note ? (
          <p>
            <small>{board.note}</small>
          </p>
        ) : null}
      </div>
    </Shell>
  );
}
