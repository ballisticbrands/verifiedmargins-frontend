import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, apiFetch, useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { useCurrency } from "@/currency";

/**
 * The leaderboard — and the site's front door (`/` lands here).
 *
 * 🚨 IT RANKS BY MARGIN, NOT REVENUE. A revenue table is a size ranking, and
 * every other seller leaderboard already measures size. The whole reason this
 * product exists is that margin is the number nobody can check — so margin is
 * what it ranks, with revenue as context beside it.
 *
 * The backend only ever returns sellers who PUBLISHED the number being ranked
 * (src/services/profiles/leaderboard.ts). A profile that keeps margin private
 * is absent rather than listed with a blank, and the response says how many
 * chose that, so a short board reads as "people are private" rather than as
 * "this product is empty".
 */

type Mode = "founder" | "business";

interface Entry {
  rank: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  business: { label: string; markets: string[]; seller_type: string | null } | null;
  margin_pct: number;
  revenue: number | null;
  currency: string;
  verification: { tier: string; label: string };
  /* Present only on the profit variant. Optional rather than required so the
     real board's payload — which has none of them — still satisfies this
     interface, and so a missing one renders as absent instead of NaN. */
  profit?: number | null;
  /** Change in profit vs the previous 30 days, as a percentage. */
  profit_change_pct?: number | null;
  /** Positions gained (+) or lost (−) over the last 30 days. 0 = held. */
  rank_delta?: number | null;
}

interface Board {
  mode: Mode;
  window_months: number;
  entries: Entry[];
  note: string | null;
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
function Movement({ delta }: { delta: number }) {
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return (
    <span data-board-move="" data-dir={dir} aria-label={
      delta === 0 ? "Position held" : `${Math.abs(delta)} places ${delta > 0 ? "up" : "down"}`
    }>
      {delta === 0 ? "—" : `${delta > 0 ? "▲" : "▼"}${Math.abs(delta)}`}
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
  variant = "margin",
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
   * `margin` — the real board. Ranks by margin, shows revenue as context.
   *
   * `profit` — a gamified alternative currently only rendered by
   * /demo/leaderboard: ranks by profit, drops the margin column, and adds
   * 30-day movement. A prop rather than a forked page, so the demo cannot
   * drift from the real one; and a variant rather than a rewrite, because
   * ranking by profit contradicts the header note above — profit is a size
   * measure, which is what every other seller leaderboard already is. Worth
   * deciding deliberately before this becomes the default.
   */
  variant?: "margin" | "profit";
} = {}) {
  const brand = useBrand();
  const { currency } = useCurrency();
  const [mode, setMode] = useState<Mode>("founder");
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
          {variant === "profit" ? (
            <>
              Ranked by profit over the last {board?.window_months ?? 12} months, with the
              change over the last 30 days. Only sellers who chose to publish appear here.
            </>
          ) : (
            <>
              Ranked by margin over the last {board?.window_months ?? 12} months — not by size.
              Only sellers who chose to publish their margin appear here.
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
            No margins to rank yet. <Link to="/verify">Verify your business</Link> to be
            the first.
          </p>
        ) : null}

        {board && board.entries.length > 0 ? (
          <ol data-board="" data-variant={variant}>
            {board.entries.map((e) => (
              <li key={`${e.username}-${e.business?.label ?? ""}-${e.business?.markets.join(",") ?? ""}`}>
                <span data-board-rank="">{e.rank}</span>
                {variant === "profit" ? <Movement delta={e.rank_delta ?? 0} /> : null}
                <span className="vm-avatar" aria-hidden="true">
                  {e.avatar_url ? <img src={e.avatar_url} alt="" /> : initials(e.display_name ?? e.username)}
                </span>
                <span data-board-who="">
                  <Link to={`/${e.username}`} data-board-name="">
                    {e.display_name ?? e.username}
                  </Link>
                  <span data-board-sub="">
                    <span className="vm-handle">@{e.username}</span>
                    {e.business ? (
                      <>
                        {" · "}
                        {e.business.label}
                        {e.business.seller_type
                          ? ` · ${SELLER_TYPE_LABEL[e.business.seller_type] ?? e.business.seller_type}`
                          : ""}
                        {e.business.markets.length > 0 ? ` · ${e.business.markets.join(" · ")}` : ""}
                      </>
                    ) : null}
                  </span>
                </span>
                <span data-board-figures="">
                  {variant === "profit" ? (
                    <>
                      {/* Profit leads; margin is deliberately absent on this
                          variant. Revenue stays as the size context that makes
                          a profit figure readable. */}
                      <b data-metric="">{money(e.profit ?? null, e.currency)}</b>
                      <Change pct={e.profit_change_pct ?? null} />
                      <span data-board-revenue="">{money(e.revenue, e.currency)}</span>
                    </>
                  ) : (
                    <>
                      <b data-metric="">{e.margin_pct.toFixed(1)}%</b>
                      <span data-board-revenue="">{money(e.revenue, e.currency)}</span>
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
