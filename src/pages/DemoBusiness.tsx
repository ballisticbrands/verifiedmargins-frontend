import { useRef, useState } from "react";
import type { ReactElement } from "react";
import { Shell } from "./Shell";
import { DemoBanner, useDemoMeta } from "@/demo/harness";
import type { BusinessDemo } from "@/demo/registry";
import type { BusinessPayload } from "./Business";
import {
  amazonFba08873AdSpend,
  amazonFba08873CogsPct,
  amazonFba08873ImpliedOtherCostPct,
  amazonFba08873ChannelSplit,
  amazonFba08873ProductSplit,
  type RevenueSlice,
  amazonFba08873Adjustments,
  amazonFba08873DataStartsAt,
  amazonFba08873Keepa,
  amazonFba08873Months,
  type EarningsMonth,
  amazonFba08873Valuation,
} from "@/demo/fixtures/amazon-fba-08873";
/* This redesign's own sheet, not a section of globals.css — a proposal keeps
   its styles beside the component so the two graduate, or get deleted, as one
   thing. Ownership, not load cost: the build emits one CSS bundle. See the
   header in DemoBusiness.css. */
import "./DemoBusiness.css";

/**
 * 🚧 A REDESIGN of /business/<slug>, shown at /demo/<slug>.
 *
 * ── Why this one demo reimplements a layout ──────────────────────────────
 * Every other demo in this repo mounts the REAL page and answers its fetch,
 * precisely so a demo can never drift from production (src/demo/README.md).
 * This one cannot: the whole point of it is to look DIFFERENT from the page
 * we ship, so there is nothing to drift from. README reserves exactly this
 * case — "a further kind is a case in Demo.tsx and a component beside it".
 *
 * The cost is real and worth naming: when Business.tsx changes, this does not
 * follow. That is acceptable only while this is a PROPOSAL. The moment it is
 * accepted, the sections below move into Business.tsx and this file is
 * deleted — it must never become a second business page we maintain.
 *
 * ── It takes a payload; it does not fetch ────────────────────────────────
 * `useDemoFetch` exists because the real pages fetch and take no data prop.
 * This component is new, so it can simply take the payload — which also means
 * the sections below are already shaped to consume the production response,
 * and graduating them is a swap of the source, not a rewrite.
 *
 * ── Provenance is the one rule inherited whole ───────────────────────────
 * 🚨 `facts.derived` was read from Amazon; `facts.declared` was typed by the
 * seller. This page renders them in separate blocks under separate legends,
 * and NOTHING declared may wear --verified green — on a verification product,
 * green on an unverified claim is the site vouching for something it never
 * saw. See the `tone` note in src/demo/registry.ts.
 */
export function DemoBusiness({ demo }: { demo: BusinessDemo }) {
  const b = demo.build();
  useDemoMeta(`${b.name} — VerifiedMargins`);

  const d = b.facts?.declared ?? {};
  const dv = b.facts?.derived ?? {};
  const m = b.metrics;
  const cur = m.display?.currency ?? "USD";

  return (
    <Shell width="profile">
      <div className="vm-form vm-bizx">
        <DemoBanner />

        <BizHeader b={b} derived={dv} platforms={d.otherPlatforms ?? []} />

        {/* ── THE SUMMARY, and only the summary ───────────────────────────
            The headline indicators a buyer scans first: what it is worth,
            what it earns in a month, and the handful of metrics that
            characterise it. 🚨 The EARNINGS CHART IS NOT HERE. It used to be
            fused to these figures, which made the summary a control panel —
            the averages moved when a period button was pressed, so a number
            near the top of the page meant something different depending on
            the state of a widget below it. Split, the summary is one fixed
            set of facts and the chart is one interactive exhibit, and
            neither can quietly restate the other. */}
        <AtAGlance b={b} currency={cur} derived={dv} declared={d} />

        <ValuationPanel b={b} currency={cur} />

        {/* Concentration — who and where the money depends on. Deliberately
            NOT inside the valuation: the valuation says how much diversity is
            worth in multiple terms, this says what the diversity actually IS,
            and a reader should be able to disagree with the first by looking
            at the second. */}
        <RevenueSplits currency={cur} />

        {/* ── STATED BY THE SELLER ────────────────────────────────────── */}
        <div data-bizx-provenance="declared">
          <ProvenanceLegend
            tone="declared"
            title="Stated by the seller"
            when={d.updatedAt}
            note="Not verified. Rendered as stated."
          />
          <DeclaredGrid declared={d} />
        </div>

        {/* Its own section, far enough down that the summary is read first —
            and the anchor the summary's "View earnings" link points at. */}
        <EarningsCard currency={cur} />

        <DeepDivePanel b={b} />
      </div>
    </Shell>
  );
}

/* ─── Header ──────────────────────────────────────────────────────────── */

function BizHeader({
  b,
  derived,
  platforms,
}: {
  b: BusinessPayload;
  derived: NonNullable<BusinessPayload["facts"]>["derived"];
  platforms: string[];
}) {
  const verified = b.verification.tier.startsWith("verified");
  const markets = [...b.markets].sort();
  return (
    <header data-bizx-head="">
      <div data-bizx-head-main="">
        <h1>{b.name}</h1>
        <div data-bizx-chips="">
          {/* 🚨 The ONLY green on this page above the fold. The tier really is
              verified_revenue, and the badge is the one claim the site makes
              in its own voice. */}
          <span data-bizx-chip="" data-tone={verified ? "verified" : "neutral"}>
            <CheckMark />
            {b.verification.label}
          </span>
          {b.seller_type ? (
            <span data-bizx-chip="" data-tone="neutral">
              {SELLER_TYPE_LABEL[b.seller_type] ?? b.seller_type}
            </span>
          ) : null}
        </div>

        {b.profile ? (
          <a data-bizx-founder="" href={`/${b.profile.username}`}>
            {b.profile.avatar_url ? (
              <img src={b.profile.avatar_url} alt="" width={40} height={40} />
            ) : (
              <span data-bizx-avatar-fallback="" aria-hidden="true">
                {(b.profile.display_name ?? b.profile.username).slice(0, 1)}
              </span>
            )}
            <span>
              <small>Founder</small>
              <strong>{b.profile.display_name ?? b.profile.username}</strong>
              <small>@{b.profile.username}</small>
            </span>
          </a>
        ) : null}
      </div>

      {/* ── WHERE IT SELLS, top right, ahead of every figure ──────────────
          Both halves of the answer, because they are different questions a
          reader asks in the same breath: which PLATFORMS the business runs
          on, and which country MARKETPLACES it reaches. They sit above the
          valuation deliberately — "$2.3M" means something different for a
          one-country Amazon business than for a three-country one that also
          runs its own storefront, and a reader should have that before the
          number rather than four sections later. */}
      <div data-bizx-head-side="">
        <ul data-bizx-platform-marks="">
          <li data-platform="amazon">
            <AmazonMark />
            {b.label}
          </li>
          {platforms.map((pf) => (
            <li key={pf} data-platform={pf}>
              <PlatformMark id={pf} />
              {PLATFORM_LABEL[pf] ?? pf}
            </li>
          ))}
        </ul>

        <ul data-bizx-market-flags="">
          {markets.map((code) => {
            const mk = MARKETPLACE[code];
            const Flag = mk?.flag;
            return (
              <li key={code}>
                <span data-bizx-flag="">{Flag ? <Flag /> : null}</span>
                {mk?.name ?? code}
              </li>
            );
          })}
        </ul>

        {/* 🚨 THE LINE THAT MAKES THE SHOPIFY MARK SAFE. Every figure on this
            page — earnings, margin, valuation — is the Amazon business alone;
            the Shopify channel is seller-declared and contributes none of it.
            Showing the two marks side by side without saying so would let a
            reader price a storefront we have never seen. */}
        <p data-bizx-head-note="">
          {derived.channels ? `${CHANNEL_LABEL[derived.channels] ?? derived.channels}. ` : ""}
          {platforms.length
            ? "Off-Amazon channels are seller-stated. "
            : ""}
          Every figure below is the Amazon business only.
        </p>
      </div>
    </header>
  );
}

const SELLER_TYPE_LABEL: Record<string, string> = {
  private_label: "Private label",
  wholesaler: "Wholesale",
  dropshipper: "Dropshipping",
};

/* ─── Earnings ────────────────────────────────────────────────────────── */

/**
 * The Earnings card, in the shape Empire Flippers uses on a listing.
 *
 * ── Why grouped bars and not the nested pair this had before ─────────────
 * Profit drawn INSIDE revenue makes the pale remainder read as cost, which is
 * elegant and answers the wrong question. A buyer comparing listings is
 * reading two magnitudes against one scale and against each OTHER over time;
 * nesting makes profit's own trajectory hard to trace, because its baseline
 * moves with revenue. Side by side on one axis, both series are readable and
 * the dashed fits say which way each is going.
 *
 * ── One axis, always ─────────────────────────────────────────────────────
 * 🚨 Revenue and profit share a scale and must keep sharing it. A second
 * y-axis would let profit's line be drawn as tall as revenue's and make a 44%
 * margin look like a 100% one — the single most misleading thing a chart of
 * this shape can do.
 *
 * ── Periods are SLICES, never separate fetches ───────────────────────────
 * All time / 12 months / 6 months / one month all read `amazonFba08873Months`.
 * The month dropdown is the "1 Month" control from the reference: picking a
 * month makes it the active period, exactly as picking a preset does.
 */

type Period =
  | { kind: "all" }
  | { kind: "months"; count: 6 | 12 }
  | { kind: "month"; month: string };

const ALL_MONTHS = amazonFba08873Months;

function slice(p: Period): EarningsMonth[] {
  if (p.kind === "all") return ALL_MONTHS;
  if (p.kind === "months") return ALL_MONTHS.slice(-p.count);
  return ALL_MONTHS.filter((m) => m.month === p.month);
}

function EarningsCard({ currency }: { currency: string }) {
  const [period, setPeriod] = useState<Period>({ kind: "all" });
  const [asTable, setAsTable] = useState(false);
  const rows = slice(period);

  /* The preset asked for vs the months that exist. A 12-month button on a
     business with three months of history is not hidden — it is offered and
     then answered honestly, because the shortfall IS information about the
     listing. */
  const want = period.kind === "months" ? period.count : 0;
  const short = want > 0 && rows.length < want;

  return (
    <section data-bizx-earnings="" id="earnings">
      <div data-bizx-earnings-head="">
        <h2>Earnings</h2>
        <div data-bizx-series-legend="">
          <span data-series="revenue" /> Gross revenue
          <span data-series="profit" /> Net profit
        </div>
      </div>

      {/* 🚨 NOTHING BUT THE EXHIBIT. No totals, no averages, no margin — the
          summary at the top of the page owns those, on a fixed basis, and a
          second copy that moved with this card's period buttons is exactly
          how the same page came to state two different "average months". A
          reader who wants a figure for a period reads it off the chart or
          the table; the summary stays still. */}

      {asTable ? (
        <EarningsTable rows={rows} currency={currency} />
      ) : (
        <EarningsChart rows={rows} currency={currency} />
      )}

      {short ? (
        <p data-bizx-shortfall="" role="note">
          This business began syncing on {fmtDate(amazonFba08873DataStartsAt)}{" "}
          2026. A {want}-month view therefore shows every month there is —{" "}
          {rows.length} — not {want}.
        </p>
      ) : null}

      <div data-bizx-periods="">
        {/* ── PERIOD controls: which slice of the history is on screen ──── */}
        <div data-bizx-period-group="" role="group" aria-label="Period">
          {/* The "1 Month" control: a select, so one specific month is a
              period of its own rather than a preset nobody can name. The
              chevron sits behind a hairline divider — the reference's
              treatment, and it is what makes this read as a control that
              OPENS rather than a button that fires. */}
          <label
            data-bizx-period-select=""
            data-on={period.kind === "month" ? "" : undefined}
          >
            <span className="vm-visually-hidden">Show a single month</span>
            <select
              value={period.kind === "month" ? period.month : ""}
              onChange={(e) =>
                setPeriod(
                  e.target.value
                    ? { kind: "month", month: e.target.value }
                    : { kind: "all" },
                )
              }
            >
              <option value="">1 Month</option>
              {[...ALL_MONTHS].reverse().map((m) => (
                <option key={m.month} value={m.month}>
                  {fmtMonth(m.month, true)}
                  {m.partial ? " (part)" : ""}
                </option>
              ))}
            </select>
            <span data-bizx-select-chevron="" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="13" height="13">
                <path
                  d="M4 6.5L8 10.5L12 6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>

        <button
          type="button"
          data-on={period.kind === "months" && period.count === 6 ? "" : undefined}
          onClick={() => setPeriod({ kind: "months", count: 6 })}
        >
          6 Months
        </button>
        <button
          type="button"
          data-on={period.kind === "months" && period.count === 12 ? "" : undefined}
          onClick={() => setPeriod({ kind: "months", count: 12 })}
        >
          12 Months
        </button>
          <button
            type="button"
            data-on={period.kind === "all" ? "" : undefined}
            onClick={() => setPeriod({ kind: "all" })}
          >
            All Time
          </button>
        </div>

        {/* ── VIEW control: how that slice is DRAWN. ──────────────────────
            Deliberately a different kind of button, because it does a
            different kind of thing. The four above are one exclusive choice
            of period; this one toggles the representation and is orthogonal
            to all of them — sharing their pill treatment invited the reading
            that "Table" was a fifth period, and that picking it would drop
            whichever period you had chosen.

            🚨 It is also NOT optional. The lighter series sits at 2.49:1 on
            white, under the 3:1 the palette validator wants, and the
            documented relief is a table view. Removing this makes the
            chart's colour choice indefensible. */}
        <button
          type="button"
          data-bizx-view-toggle=""
          aria-pressed={asTable}
          onClick={() => setAsTable((v) => !v)}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            {asTable ? (
              <path
                d="M2.5 13.5V7m3.5 6.5v-9m3.5 9V9.5m3.5 4v-11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 3.75h12M2 8h12M2 12.25h12M6 3.75v8.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            )}
          </svg>
          {asTable ? "Chart" : "Table"}
        </button>
      </div>
    </section>
  );
}

/* ─── The chart ───────────────────────────────────────────────────────── */

const PLOT = { w: 1000, h: 300, top: 12, right: 8, bottom: 44, left: 62 };

/**
 * Least-squares fit over WHOLE months, returned as endpoints plus the indices
 * they span.
 *
 * 🚨 Part months are excluded from the fit, and that is not fussiness. This
 * business's history is an 8-day July, a whole August and a 5-day September;
 * fitting all three put the revenue line at ~$42K, floating above two of the
 * three bars it was supposedly describing, and sloping downward because the
 * series ENDED mid-month. That is a manufactured decline. A trend needs
 * comparable buckets, so it gets comparable buckets — and where fewer than
 * two exist there is no line, because a direction nobody can support is worse
 * than no direction at all.
 */
function trendLine(
  rows: EarningsMonth[],
  pick: (m: EarningsMonth) => number,
): { from: number; to: number; y0: number; y1: number } | null {
  const idx = rows.map((_, i) => i).filter((i) => !rows[i].partial);
  if (idx.length < 2) return null;
  const values = idx.map((i) => pick(rows[i]));
  const [y0, y1] = fit(values)!;
  return { from: idx[0], to: idx[idx.length - 1], y0, y1 };
}

function fit(values: number[]): [number, number] | null {
  const n = values.length;
  if (n < 2) return null;
  const mx = (n - 1) / 2;
  const my = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  values.forEach((y, i) => {
    num += (i - mx) * (y - my);
    den += (i - mx) ** 2;
  });
  const slope = den === 0 ? 0 : num / den;
  return [my + slope * (0 - mx), my + slope * (n - 1 - mx)];
}

/** A round-numbered ceiling and a step, so gridlines land on $5,000 rather
 *  than on $4,873. */
function scale(max: number): { top: number; ticks: number[] } {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const raw = max / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-6; v += step) ticks.push(v);
  return { top, ticks };
}

function EarningsChart({ rows, currency }: { rows: EarningsMonth[]; currency: string }) {
  const [hover, setHover] = useState<number | null>(null);
  if (rows.length === 0) return null;

  const { top, ticks } = scale(Math.max(...rows.map((m) => m.revenue)));
  const iw = PLOT.w - PLOT.left - PLOT.right;
  const ih = PLOT.h - PLOT.top - PLOT.bottom;
  const y = (v: number) => PLOT.top + ih - (v / top) * ih;
  const band = iw / rows.length;
  /* A 2px surface gap between the two fills, per the mark spec — they are
     adjacent bars of different series, not one block. */
  const barW = Math.min(64, (band - 2) / 2 - 3);
  const centre = (i: number) => PLOT.left + band * i + band / 2;

  const revTrend = trendLine(rows, (m) => m.revenue);
  const proTrend = trendLine(rows, (m) => m.profit);
  /* Said out loud rather than left as a silently missing line. */
  const wholeMonths = rows.filter((m) => !m.partial).length;
  const tilt = rows.length > 12;

  return (
    <figure data-bizx-chart="">
      <svg
        viewBox={`0 0 ${PLOT.w} ${PLOT.h}`}
        role="img"
        aria-label={`Gross revenue and net profit by month, ${rows.length} months`}
      >
        <defs>
          {/* The texture channel: a part month is HATCHED, not just faded.
              Opacity alone vanishes in forced-colors and in print, and reads
              as "less important" rather than as "not the same kind of bucket".

              🚨 The stripes are the CARD colour laid OVER a solid bar, not the
              series colour laid on nothing. A pattern that painted the stripe
              itself resolved `currentColor` in the pattern's own context
              rather than the referencing rect's, so both series hatched black
              and lost their identity — the one thing the texture must not
              cost. Striping with the surface keeps the hue underneath. */}
          <pattern id="bizx-part" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="none" />
            <rect width="3.2" height="7" fill="var(--card)" opacity="0.72" />
          </pattern>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PLOT.left}
              x2={PLOT.w - PLOT.right}
              y1={y(t)}
              y2={y(t)}
              data-bizx-grid=""
            />
            <text x={PLOT.left - 10} y={y(t) + 4} data-bizx-ytick="">
              {compact(t, currency)}
            </text>
          </g>
        ))}

        {rows.map((m, i) => {
          const c = centre(i);
          return (
            <g
              key={m.month}
              data-bizx-group=""
              data-hover={hover === i ? "" : undefined}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* A full-height hit target: the bars themselves are thin, and
                  a tooltip you have to hit a 40px column to see is a tooltip
                  most readers never find. */}
              <rect
                x={PLOT.left + band * i}
                y={PLOT.top}
                width={band}
                height={ih}
                data-bizx-hit=""
              />
              <rect
                x={c - barW - 1}
                y={y(m.revenue)}
                width={barW}
                height={Math.max(1, ih - (y(m.revenue) - PLOT.top))}
                rx="3"
                data-series="revenue"
              />
              <rect
                x={c + 1}
                y={y(m.profit)}
                width={barW}
                height={Math.max(1, ih - (y(m.profit) - PLOT.top))}
                rx="3"
                data-series="profit"
              />
              {m.partial ? (
                <>
                  <rect
                    x={c - barW - 1}
                    y={y(m.revenue)}
                    width={barW}
                    height={Math.max(1, ih - (y(m.revenue) - PLOT.top))}
                    rx="3"
                    data-bizx-hatch="revenue"
                    fill="url(#bizx-part)"
                  />
                  <rect
                    x={c + 1}
                    y={y(m.profit)}
                    width={barW}
                    height={Math.max(1, ih - (y(m.profit) - PLOT.top))}
                    rx="3"
                    data-bizx-hatch="profit"
                    fill="url(#bizx-part)"
                  />
                </>
              ) : null}
              <text
                x={c}
                y={PLOT.h - PLOT.bottom + 20}
                data-bizx-xtick=""
                transform={tilt ? `rotate(-40 ${c} ${PLOT.h - PLOT.bottom + 20})` : undefined}
                data-tilt={tilt ? "" : undefined}
              >
                {fmtMonth(m.month)}
                {m.partial ? "*" : ""}
              </text>
            </g>
          );
        })}

        {revTrend ? (
          <line
            x1={centre(revTrend.from)}
            x2={centre(revTrend.to)}
            y1={y(revTrend.y0)}
            y2={y(revTrend.y1)}
            data-bizx-trendline="revenue"
          />
        ) : null}
        {proTrend ? (
          <line
            x1={centre(proTrend.from)}
            x2={centre(proTrend.to)}
            y1={y(proTrend.y0)}
            y2={y(proTrend.y1)}
            data-bizx-trendline="profit"
          />
        ) : null}
      </svg>

      {hover !== null && rows[hover] ? (
        <div
          data-bizx-tip=""
          style={{ left: `${((centre(hover) / PLOT.w) * 100).toFixed(2)}%` }}
        >
          <strong>
            {fmtMonth(rows[hover].month, true)}
            {rows[hover].partial ? " · part month" : ""}
          </strong>
          <span>
            <i data-series="revenue" /> {money(rows[hover].revenue, currency)} revenue
          </span>
          <span>
            <i data-series="profit" /> {money(rows[hover].profit, currency)} profit
          </span>
        </div>
      ) : null}

      {rows.some((m) => m.partial) ? (
        <figcaption data-bizx-chart-note="">
          * Hatched bars are part months, not short ones — this business began
          syncing on the 24th of July and the data ends on the 5th of
          September. Only the whole month between them is comparable
          {wholeMonths < 2
            ? ", and a trend line needs two comparable months, so there is none to draw yet"
            : ", and the trend lines are fitted across whole months only"}
          .
        </figcaption>
      ) : null}
    </figure>
  );
}

/** The table view. Present because the palette validator WARNed the lighter
 *  series at 2.49:1 on white, and a table is the documented relief — it is
 *  also simply the right way to read exact figures. */
function EarningsTable({ rows, currency }: { rows: EarningsMonth[]; currency: string }) {
  return (
    <div data-bizx-table-wrap="">
      <table data-bizx-table="">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Gross revenue</th>
            <th scope="col">Net profit</th>
            <th scope="col">Margin</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.month}>
              <th scope="row">
                {fmtMonth(m.month, true)}
                {m.partial ? <span data-bizx-part-tag=""> part month</span> : null}
              </th>
              <td>{money(m.revenue, currency)}</td>
              <td>{money(m.profit, currency)}</td>
              <td>{pct(m.revenue ? (m.profit / m.revenue) * 100 : null)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The blended cost basis this business's margin rests on.
 *
 *  🚨 12.72%, NOT the 55.52% stored on the connection. The stored figure was
 *  a single box the seller had to put every cost into, because the pipeline
 *  records no Amazon fees at all. Now that the per-line product costs are
 *  known — 10% / 20% / 17.5% weighted by revenue share — the two are
 *  separated: this is what the goods cost, and OTHER_COST_PCT is the rest of
 *  the seller's blended figure — an assumption of theirs, not a measurement
 *  of ours. */
const COGS_PCT = amazonFba08873CogsPct;
const OTHER_COST_PCT = amazonFba08873ImpliedOtherCostPct;

/**
 * The summary block: what this business is worth, what it earns in a month,
 * and the metrics that characterise it.
 *
 * ── Fixed basis, deliberately ────────────────────────────────────────────
 * 🚨 Every figure here is computed over ALL available history and does not
 * respond to the Earnings card's period buttons. That is the whole point of
 * splitting the two. While the averages lived inside that card they moved
 * when a period changed, so "Avg. Monthly Revenue" near the top of the page
 * silently meant a different thing depending on a control further down — and
 * a reader who scrolled past the buttons had no way to know which. A summary
 * that moves is not a summary.
 *
 * ── Averaged over WHOLE months only ──────────────────────────────────────
 * Dividing this business's total by three gives $40.2K a month, when the one
 * complete month it has did $87.1K — the 8-day July and 5-day September drag
 * the mean to roughly half the real figure. An "average month" that no month
 * resembles is not a summary, it is an understatement, and on a page a buyer
 * prices a business from, that is the expensive direction to be wrong in. The
 * divisor is named on the stat so nobody has to guess.
 */
function AtAGlance({
  b,
  currency,
  derived,
  declared,
}: {
  b: BusinessPayload;
  currency: string;
  derived: NonNullable<BusinessPayload["facts"]>["derived"];
  declared: NonNullable<BusinessPayload["facts"]>["declared"];
}) {
  const whole = ALL_MONTHS.filter((m) => !m.partial);
  const avg = (pick: (m: EarningsMonth) => number) =>
    whole.length ? whole.reduce((a, m) => a + pick(m), 0) / whole.length : null;

  /* Margin and TACoS are RATIOS, so they take every month including the part
     ones: shortening a month scales both halves of the fraction equally. Only
     the per-month rates need whole months. */
  const totals = ALL_MONTHS.reduce(
    (a, m) => ({ revenue: a.revenue + m.revenue, profit: a.profit + m.profit }),
    { revenue: 0, profit: 0 },
  );
  const margin = totals.revenue ? (totals.profit / totals.revenue) * 100 : null;
  const tacos = totals.revenue ? (amazonFba08873AdSpend / totals.revenue) * 100 : null;

  const basis =
    whole.length === 0
      ? "No whole month yet"
      : whole.length <= 2
        ? `From ${whole.map((m) => fmtMonth(m.month, true)).join(" and ")}`
        : `Averaged over ${whole.length} whole months`;

  /* 🚨 Same recomputed v2 figures the adjustments panel uses. `b.valuation`
     is the version-1 snapshot whose multiple was clamped at 5.0; reading it
     here would print a headline multiple that the factor list further down
     no longer sums to, which is precisely the disagreement the version bump
     exists to prevent. */
  const v = { ...b.valuation, ...amazonFba08873Valuation };
  const k = derived.keepa;
  const { category, sellingSince } = amazonFba08873Keepa;

  return (
    <section data-bizx-glance="">
      {v?.value && v.complete ? (
        <div data-bizx-headline="">
          <Headline label="Indicative valuation" value={money(v.value, currency)} big />
          <Headline label="Multiple" value={`${v.multiple}×`} />
          <Headline
            label="On"
            value={`${money(v.netProfitTtm ?? null, currency)} net profit`}
            /* 🚨 Named for what it is. The reference card says "Pricing
               Period: 12 Months", which would be a straight untruth here:
               this figure is an ANNUALISED RUN RATE off roughly six weeks of
               trading, not twelve months of it. */
            sub="Annualised run rate, not a trailing year"
          />
        </div>
      ) : null}

      <div data-bizx-averages="">
        <AverageStat
          label="Avg. Monthly Revenue"
          value={avg((m) => m.revenue) === null ? "—" : money(avg((m) => m.revenue), currency)}
          series={whole.map((m) => m.revenue)}
          tone="revenue"
          basis={basis}
        />
        <AverageStat
          label="Avg. Monthly Profit"
          value={avg((m) => m.profit) === null ? "—" : money(avg((m) => m.profit), currency)}
          series={whole.map((m) => m.profit)}
          tone="profit"
          basis={basis}
        />
        {/* 🚨 Never --verified green. This business is verified_revenue, not
            verified_margin: Amazon confirms what came in, the cost side is a
            blended percentage the seller typed (Connection.cogsBasis =
            "blended_pct", zero CogsEntry rows on file). Green would be the
            site vouching for a number nobody checked. */}
        <AverageStat
          label="Profit Margin"
          value={pct(margin)}
          badge="User-supplied"
          basis={`After ${COGS_PCT}% product cost and ${OTHER_COST_PCT}% other costs`}
          link={{ href: "#earnings", label: "View earnings" }}
        />
      </div>

      <div data-bizx-metrics="">
        <h2>Additional metrics</h2>
        <dl>
          {/* Banded, not exact — see the disclosure-tier block below. */}
          {derived.skuCount != null ? (
            <Metric label="SKUs" value={skuTier(derived.skuCount)} info={INFO.skus} />
          ) : null}
          {k?.ratingWeighted != null ? (
            <Metric
              label="Avg. product rating"
              value={ratingTier(k.ratingWeighted)}
              info={INFO.rating}
            />
          ) : null}
          {k?.reviewTotal != null ? (
            <Metric label="Reviews" value={reviewTier(k.reviewTotal)} info={INFO.reviews} />
          ) : null}
          {/* 🚨 ONE level, and the second one — "Games & Accessories", never
              the leaf below it. Keepa's full path narrows to a single product
              type, which together with a review count and a marketplace set
              is enough to name the seller. The deeper levels are not withheld
              by this component: they are not in the fixture at all, so they
              never reach the bundle. */}
          {category ? (
            <Metric label="Category" value={category} text info={INFO.category} />
          ) : null}
          {sellingSince ? (
            <Metric
              label="Listed since"
              value={sellingSince.slice(0, 4)}
              info={INFO.listedSince}
            />
          ) : null}
          {/* Brand Registry reads as a plain fact here, which is what it is.
              🚨 It was briefly a Yes/No toggle. On a page where a visitor can
              change nothing, a control-shaped thing is a promise the page
              cannot keep — it invited a click, and a reader who clicked and
              saw nothing happen had been told the page was broken. */}
          {declared.brandRegistry != null ? (
            <Metric
              label="Brand Registry"
              value={declared.brandRegistry ? "Yes" : "No"}
              text
              badge="User-supplied"
              info={INFO.brandRegistry}
            />
          ) : null}
          {tacos !== null ? (
            <Metric label="TACoS" value={`${tacos.toFixed(2)}%`} info={INFO.tacos} />
          ) : null}
          {/* The DECLARED figures in a row of read ones carry the flag rather
              than relying on a reader to remember which is which. */}
          <Metric
            label="COGS %"
            value={`${COGS_PCT}%`}
            badge="User-supplied"
            info={INFO.cogs}
          />
          {/* 🚨 The other half of the old 55.5%. Shown rather than left
              implicit: without it a reader subtracts 12.7% from revenue,
              expects an 87% margin, finds 44% and concludes one of the two is
              wrong. Flagged as derived, because it is a residual. */}
          {/* 🚨 NOT "Amazon fees". Labelling it that asserted a composition
              nobody measured — see the fixture note. It is the remainder of
              the seller's own blended cost figure once the real product cost
              is taken out, and the badge says so. */}
          <Metric
            label="Other costs, implied"
            value={`${OTHER_COST_PCT}%`}
            badge="Seller's estimate"
            info={INFO.otherCosts}
          />
        </dl>
        {/* The row-level note. Per-metric detail now lives in the ⓘ beside
            each label, so this says only the thing that is true of the row as
            a whole. */}
        <p data-bizx-block-foot="">
          Read from Amazon and Keepa except where flagged. Catalogue size,
          rating and review counts are published as bands rather than exact
          figures — see the note on each.
        </p>
      </div>
    </section>
  );
}

function Headline({
  label,
  value,
  sub,
  big,
}: {
  label: string;
  value: string;
  sub?: string;
  big?: boolean;
}) {
  return (
    <div data-bizx-headline-item="" data-big={big ? "" : undefined}>
      <span data-bizx-headline-label="">{label}</span>
      <strong data-bizx-headline-value="">{value}</strong>
      {sub ? <span data-bizx-headline-sub="">{sub}</span> : null}
    </div>
  );
}

function Metric({
  label,
  value,
  badge,
  text,
  info,
}: {
  label: string;
  value: string;
  badge?: string;
  /** This value is WORDS, not a quantity. The mono face is spent on figures
   *  only (BRANDING.md §4) — a category name set in it reads as a code, and
   *  ran to two lines here where the proportional face fits on one. */
  text?: boolean;
  /** Paragraphs for the ⓘ beside the label. */
  info?: string[];
}) {
  return (
    <div data-bizx-metric="" data-text={text ? "" : undefined}>
      <dt>
        {label}
        {info ? <InfoTip label={label} paragraphs={info} /> : null}
        {badge ? <em data-bizx-unverified="">{badge}</em> : null}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

/**
 * The ⓘ beside a metric label.
 *
 * ── Fixed positioning, measured on open ──────────────────────────────────
 * The panel is wider than the column it belongs to, and the metrics wrap, so
 * an absolutely-positioned panel would be clipped by the rightmost columns
 * and by the card's own edge. Measuring the button and clamping to the
 * viewport costs a dozen lines and works at every width.
 *
 * ── A button, not a hover target ─────────────────────────────────────────
 * 🚨 Hover alone is unreachable by keyboard and unusable on touch. This
 * opens on hover for a mouse AND on focus and click for everyone else, and it
 * is a real <button> so it lands in the tab order and announces itself.
 */
function InfoTip({ label, paragraphs }: { label: string; paragraphs: string[] }) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  const open = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const w = Math.min(340, window.innerWidth - 24);
    setPos({
      left: Math.min(Math.max(12, r.left - 14), window.innerWidth - w - 12),
      top: r.top - 10,
    });
  };

  return (
    <span data-bizx-infowrap="">
      <button
        ref={ref}
        type="button"
        data-bizx-info=""
        aria-label={`What is ${label}?`}
        aria-expanded={pos !== null}
        onMouseEnter={open}
        onMouseLeave={() => setPos(null)}
        onFocus={open}
        onBlur={() => setPos(null)}
        onClick={() => (pos ? setPos(null) : open())}
      >
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="5.1" r="0.85" fill="currentColor" />
          <path
            d="M8 7.4v4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {pos ? (
        <span
          role="tooltip"
          data-bizx-infotip=""
          style={{ left: pos.left, top: pos.top }}
        >
          {paragraphs.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
      ) : null}
    </span>
  );
}

function AverageStat({
  label,
  value,
  series,
  tone,
  badge,
  basis,
  link,
}: {
  label: string;
  value: string;
  series?: number[];
  tone?: "revenue" | "profit";
  badge?: string;
  basis: string;
  /** The jump to the chart, on the stat a reader is most likely to want to
   *  interrogate. An anchor rather than a scroll handler so it works with a
   *  middle-click, a keyboard, and with JS off. */
  link?: { href: string; label: string };
}) {
  return (
    <div data-bizx-avg="">
      <span data-bizx-avg-label="">
        {label}
        {badge ? <em data-bizx-unverified="">{badge}</em> : null}
      </span>
      <strong data-bizx-avg-value="">{value}</strong>
      {/* The sparkline needs a shape to draw. Three points is the floor —
          below it the line is a corner, which suggests a trajectory the data
          cannot support. */}
      {series && tone && series.length >= 3 ? <Spark series={series} tone={tone} /> : null}
      <span data-bizx-avg-basis="">{basis}</span>
      {link ? (
        <a data-bizx-jump="" href={link.href}>
          {link.label}
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path
              d="M8 3v10M4 9.5L8 13.5L12 9.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ) : null}
    </div>
  );
}

function Spark({ series, tone }: { series: number[]; tone: "revenue" | "profit" }) {
  const w = 200;
  const h = 34;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - 2 - ((v - min) / span) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} data-bizx-spark="" data-tone={tone} aria-hidden="true">
      <polyline points={pts} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Axis ticks: "$20K", not "$20,000.00". */
function compact(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return String(Math.round(n));
  }
}

/* ─── Valuation ───────────────────────────────────────────────────────── */

function ValuationPanel({
  b,
  currency,
}: {
  b: BusinessPayload;
  currency: string;
}) {
  /* 🚨 The recomputed v2 figures, not `b.valuation` — that payload is a
     version-1 snapshot whose multiple was clamped at 5.0, and it would print
     a headline the adjustments below no longer add up to. */
  const v = { ...b.valuation, ...amazonFba08873Valuation };
  if (!v.value) return null;
  const ups = amazonFba08873Adjustments.filter((a) => a.delta > 0);
  const downs = amazonFba08873Adjustments.filter((a) => a.delta < 0);
  const widest = Math.max(...amazonFba08873Adjustments.map((a) => Math.abs(a.delta)));

  return (
    <section data-bizx-val="">
      <div data-bizx-val-head="">
        <div>
          <h2>Indicative valuation</h2>
          <p>
            {v.multiple}× on {money(v.netProfitTtm ?? null, currency)} TTM net
            profit
          </p>
        </div>
        <strong data-bizx-val-figure="">{money(v.value, currency)}</strong>
      </div>

      <div data-bizx-val-adj="">
        <Column title={`What lifts it (${ups.length})`} items={ups} widest={widest} />
        <Column title={`What holds it back (${downs.length})`} items={downs} widest={widest} />
      </div>
    </section>
  );
}

function Column({
  title,
  items,
  widest,
}: {
  title: string;
  items: Array<{ label: string; delta: number; why?: string }>;
  widest: number;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p data-bizx-col-title="">{title}</p>
      <ul>
        {items.map((a) => (
          <li key={a.label} data-dir={a.delta > 0 ? "up" : "down"}>
            <span data-bizx-adj-bar="" style={{ width: `${(Math.abs(a.delta) / widest) * 100}%` }} />
            <span data-bizx-adj-label="">
              {a.label}
              {a.why ? <InfoTip label={a.label} paragraphs={[a.why]} /> : null}
            </span>
            <b>
              {a.delta > 0 ? "+" : "−"}
              {Math.abs(a.delta).toFixed(2)}×
            </b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Revenue splits ─────────────────────────────────────────────────── */

/**
 * Where the revenue comes from, as share-of-whole donuts.
 *
 * ── The form, and its limits ─────────────────────────────────────────────
 * A donut is the weakest way to compare quantities — angle is the hardest
 * encoding to read — so it earns its place here only because the question is
 * "how concentrated is this?", which is a shape question, and the answer is
 * legible at a glance from one dominant arc. Everything a reader might want
 * to COMPARE is in the legend as a number beside its swatch.
 *
 * 🚨 THREE COLOURED SLICES, MAXIMUM. A pie is an all-pairs form — any slice
 * can be set against any other — and the categorical palette stops passing
 * its separation checks at four: #2E6FD9/#B8621A/#8E3F96 clear all-pairs CVD
 * at ΔE 11.1 (deutan) and 18.4 (normal vision), while every four-colour set
 * tried failed one of them outright. Anything past the third folds into a
 * neutral "Other" rather than being seated in a hue nobody can distinguish.
 */
function RevenueSplits({ currency }: { currency: string }) {
  return (
    <section data-bizx-splits="">
      <h2>Where the revenue comes from</h2>
      <div data-bizx-splits-grid="">
        <SplitDonut
          title="By sales channel"
          slices={amazonFba08873ChannelSplit}
          currency={currency}
          note="August 2026, the one whole month of data — the same basis as the average monthly figures above. Amazon revenue is converted from each marketplace's own currency; Shopify comes from the connected store."
        />
        <SplitDonut
          title="By product line"
          slices={amazonFba08873ProductSplit}
          currency={currency}
          note="Three core products, with each product's variations rolled into its line. August 2026."
        />
      </div>
    </section>
  );
}

/** The three-hue categorical ramp for share charts, validated all-pairs.
 *  Fixed ORDER: a slice keeps its colour when the list is re-sorted or
 *  filtered, because colour follows the entity and never its rank. */
const SPLIT_HUES = ["#2e6fd9", "#b8621a", "#8e3f96"] as const;
const MAX_SLICES = SPLIT_HUES.length;

function SplitDonut({
  title,
  slices,
  currency,
  note,
  empty,
}: {
  title: string;
  slices: RevenueSlice[];
  currency: string;
  note?: string;
  empty?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  if (slices.length === 0) {
    return (
      <div data-bizx-split="">
        <h3>{title}</h3>
        <p data-bizx-split-empty="">{empty ?? "No data yet."}</p>
      </div>
    );
  }

  /* Beyond three, the tail folds into one neutral slice rather than taking a
     fourth hue the palette cannot separate. */
  /* 🚨 AUTHORED ORDER, not ranked. Sorting by size put Shopify between two
     Amazon marketplaces and split the Amazon group around a channel that is
     not one of them. The fixture states the order it wants; size only decides
     which slices get a hue. */
  const ranked = slices;
  const coloured = [...ranked].filter((x) => !x.neutral).sort((a, b) => b.share - a.share);
  const keep = new Set([...coloured.slice(0, MAX_SLICES), ...ranked.filter((x) => x.neutral)]);
  const shown = ranked.filter((x) => keep.has(x));
  const rest = ranked.filter((x) => !keep.has(x));
  let hue = 0;
  const rows: Array<RevenueSlice & { colour: string }> = shown.map((x) => ({
    ...x,
    colour: x.neutral ? "var(--bizx-neutral-slice)" : SPLIT_HUES[hue++ % SPLIT_HUES.length],
  }));
  if (rest.length) {
    rows.push({
      key: "other",
      label: `${rest.length} others`,
      usd: rest.reduce((a, x) => a + x.usd, 0),
      share: rest.reduce((a, x) => a + x.share, 0),
      colour: "var(--muted-foreground)",
    });
  }

  /* The centre states the LARGEST slice, which is not necessarily the first
     now that order is authored. */
  const biggest = [...rows].sort((a, b) => b.share - a.share)[0];

  const R = 52;
  const STROKE = 20;
  const C = 2 * Math.PI * R;
  /* A 2px surface gap between neighbouring fills, per the mark spec. Held
     back on a slice too small to survive it — a 1.6% arc minus two gaps is
     nothing at all, and a slice that renders as a hairline reads as a
     rendering fault rather than as a small number. */
  const GAP = 2;
  let offset = 0;

  return (
    <div data-bizx-split="">
      <h3>{title}</h3>
      <div data-bizx-split-body="">
        <svg viewBox="0 0 140 140" data-bizx-donut="" role="img" aria-label={`${title}: ${rows.map((r) => `${r.label} ${r.share.toFixed(1)}%`).join(", ")}`}>
          {rows.map((r, i) => {
            const len = (r.share / 100) * C;
            const gap = len > GAP * 3 ? GAP : 0;
            const dash = `${Math.max(0.6, len - gap)} ${C - Math.max(0.6, len - gap)}`;
            const el = (
              <circle
                key={r.key}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={r.colour}
                strokeWidth={hover === i ? STROKE + 4 : STROKE}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                data-bizx-arc=""
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
            offset += len;
            return el;
          })}
          {/* The headline the donut cannot state: how concentrated it is. */}
          {/* 🚨 The SHORT label. "Amazon United States" ran past the hole and
              under the arc itself — the ring is 140px across with a ~64px
              hole, and no font size that fits nineteen characters there is
              still readable. The legend beside it carries the full name. */}
          <text x="70" y="66" data-bizx-donut-big="">
            {biggest.share.toFixed(0)}%
          </text>
          <text x="70" y="82" data-bizx-donut-sub="">
            {biggest.short ?? biggest.label}
          </text>
        </svg>

        {/* 🚨 The legend is the chart's real information, not decoration. The
            smallest slice here is 1.6% — a 5.7° arc, unreadable by angle at
            any size — so every share is stated as a number beside its
            swatch, and identity never rests on colour alone. */}
        <ul data-bizx-split-legend="">
          {rows.map((r, i) => (
            <li
              key={r.key}
              data-on={hover === i ? "" : undefined}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span data-bizx-swatch="" style={{ background: r.colour }} />
              <span data-bizx-split-label="">{r.label}</span>
              <b>{r.share.toFixed(1)}%</b>
              <small>{money(r.usd, currency)}</small>
            </li>
          ))}
        </ul>
      </div>
      {note ? <p data-bizx-block-foot="">{note}</p> : null}
    </div>
  );
}

/* ─── Provenance legend ───────────────────────────────────────────────── */

function ProvenanceLegend({
  tone,
  title,
  when,
  note,
}: {
  tone: "derived" | "declared";
  title: string;
  when?: string;
  note?: string;
}) {
  return (
    <p data-bizx-legend="" data-tone={tone}>
      <span data-bizx-legend-dot="" aria-hidden="true" />
      <strong>{title}</strong>
      {when ? <span> · {when.slice(0, 10)}</span> : null}
      {note ? <em>{note}</em> : null}
    </p>
  );
}

/* ─── Where it sells ─────────────────────────────────────────────────── */

/** Amazon marketplaces, by the ISO code the payload carries. The country name
 *  is a CONSTANT about Amazon, not a fact about this business — nothing here
 *  is derived from the seller's data beyond the code itself.
 *
 *  The storefront domain used to ride along and be printed beside each
 *  country. It is gone: "amazon.com.mx" tells a reader nothing the flag and
 *  the country name have not already told them, and it made each row look
 *  like a link to somewhere. */
const MARKETPLACE: Record<string, { name: string; flag: () => ReactElement }> = {
  US: { name: "United States", flag: FlagUS },
  CA: { name: "Canada", flag: FlagCA },
  MX: { name: "Mexico", flag: FlagMX },
};

const CHANNEL_LABEL: Record<string, string> = {
  fba: "Fulfilled by Amazon",
  fbm: "Fulfilled by merchant",
  both: "FBA and FBM",
};

const PLATFORM_LABEL: Record<string, string> = {
  shopify: "Shopify",
  tiktok: "TikTok Shop",
  walmart: "Walmart",
  etsy: "Etsy",
  ebay: "eBay",
  own_site: "Own site",
};

/** Platform marks, inline. Simplified glyphs in each platform's own colour,
 *  not their trademarked lockups: enough to be recognised beside a wordmark
 *  that names the platform anyway. Same rule as the Amazon mark and the
 *  flags — drawn, never fetched. */
function PlatformMark({ id }: { id: string }) {
  if (id === "shopify") {
    return (
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        {/* The shopping-bag silhouette, in Shopify's green. */}
        <path
          fill="#95BF47"
          d="M12.8 3.4a.4.4 0 0 0-.33-.14c-.05 0-.5.09-.5.09s-.36-.36-.63-.63c-.27-.27-.79-.19-.99-.13-.03 0-.28.09-.7.22-.4-1.17-1.12-1.65-1.86-1.65h-.07c-.2-.27-.46-.4-.68-.4-1.7.01-2.51 2.14-2.77 3.22l-1.19.37c-.37.11-.38.13-.43.48C2.62 5.08 1.6 13.1 1.6 13.1l8.06 1.51 4.37-1.09s-1.2-8.06-1.23-8.12zM9.06 2.99l-1.13.35c0-.6-.08-1.4-.36-1.94.62.12.92.82 1.49 1.59zM7.4 1.3c.3.6.36 1.42.36 1.96l-1.9.59c.37-1.4 1.06-2.08 1.54-2.55zM6.5.86c.1 0 .2.03.29.1-.63.3-1.31 1.05-1.6 2.55l-1.5.47C4.02 2.9 4.75.86 6.5.86z"
        />
        <path
          fill="#5E8E3E"
          d="M12.47 3.26c-.05 0-.5.09-.5.09s-.36-.36-.63-.63a.72.72 0 0 0-.4-.19l-.6 12.08 4.37-1.09s-1.2-8.06-1.23-8.12a.4.4 0 0 0-.33-.14z"
        />
        <path
          fill="#fff"
          d="M8.35 5.53l-.51 1.9s-.57-.26-1.24-.22c-.99.06-1 .69-.99.85.06.85 2.28 1.04 2.4 3.02.1 1.56-.82 2.62-2.15 2.71-1.6.1-2.48-.84-2.48-.84l.34-1.44s.89.67 1.6.62c.46-.03.63-.4.61-.67-.07-1.11-1.88-1.05-1.99-2.86-.1-1.53.9-3.08 3.11-3.22.85-.06 1.3.15 1.3.15z"
        />
      </svg>
    );
  }
  return <span data-bizx-platform-dot="" aria-hidden="true" />;
}

/** The Amazon smile, inline.
 *
 *  Drawn rather than loaded for the same reasons as the flags below: the page
 *  must render with no network, and a remote logo is a third party watching
 *  everyone who opens a business page. The shared package does export an
 *  `AMAZON_MARK_SRC`, but it is an image URL and this file deliberately
 *  imports nothing from that package — see the header note.
 *
 *  The arrow alone, in Amazon's orange, beside the word. Not a reproduction
 *  of the wordmark: naming the platform a business sells on is what this is
 *  for, and the glyph only has to be recognisable enough to be read at a
 *  glance. */
function AmazonMark() {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" data-bizx-amazon="">
      <path
        d="M2.6 13.6c2.6 1.9 5.6 2.9 8.7 2.9 2.1 0 4.4-.45 6.6-1.6.33-.16.61.22.29.48-1.9 1.6-4.4 2.4-6.6 2.4-3.1 0-6-1.2-8.2-3.2-.17-.16-.02-.37.21-.24z"
        fill="#FF9900"
      />
      <path
        d="M15.9 12.4c-.33-.43-2.2-.2-3-.1-.25.03-.29-.19-.06-.35 1.5-1 3.9-.75 4.2-.4.3.36-.08 2.8-1.5 3.9-.21.17-.41.08-.32-.16.31-.79 1-2.5.68-2.9z"
        fill="#FF9900"
      />
      <path
        d="M11 3.3c-1.7 0-3.5.63-3.9 2.7-.04.22.12.34.27.37l1.7.19c.16 0 .27-.16.3-.32.15-.71.74-1.05 1.4-1.05.36 0 .77.13.98.45.24.36.21.85.21 1.27v.23c-1 .11-2.3.19-3.2.6-1.1.47-1.8 1.4-1.8 2.8 0 1.8 1.1 2.7 2.6 2.7 1.2 0 1.9-.29 2.8-1.2.31.45.41.67.98 1.14.13.07.29.06.4-.04l1.2-1c.13-.11.11-.29.01-.44-.29-.4-.6-.73-.6-1.47V7.7c0-1.05.07-2-.7-2.72-.61-.58-1.6-.78-2.4-.78zm.4 5c0 .63.02 1.15-.3 1.71-.26.45-.66.73-1.11.73-.62 0-.98-.47-.98-1.16 0-1.37 1.23-1.62 2.39-1.62v.34z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Flags as inline SVG — never hotlinked, never an <img>. Three reasons: the
   page must render with no network, a remote flag sprite is a third party
   watching everyone who opens a business page, and inline paths inherit the
   1px hairline the rest of the site is drawn with. Simplified on purpose —
   50 stars at 24px is mud. */

function FlagUS() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((y) => (
        <rect key={y} y={y} width="24" height="1.23" fill="#b31942" />
      ))}
      <rect width="10" height="8.6" fill="#0a3161" />
      {[1.6, 4.3, 7].map((x) =>
        [1.5, 4.2, 6.9].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#fff" />
        )),
      )}
    </svg>
  );
}

function FlagCA() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="6" height="16" fill="#d80621" />
      <rect x="18" width="6" height="16" fill="#d80621" />
      {/* An eleven-point leaf reduced to its silhouette. */}
      <path
        fill="#d80621"
        d="M12 3.1l.9 1.9 1.7-.5-.5 1.9 1.6-.3-1.5 1.6 2.1 1.3-1.9.6.4 1.3-2.1-.4.2 2.4h-.9l.2-2.4-2.1.4.4-1.3-1.9-.6L10.2 8 8.7 6.4l1.6.3-.5-1.9 1.7.5z"
      />
    </svg>
  );
}

function FlagMX() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="8" height="16" fill="#006847" />
      <rect x="16" width="8" height="16" fill="#ce1126" />
      {/* The coat of arms reduced to a mark. Drawing an approximate eagle at
          24px would be worse than not drawing one. */}
      <circle cx="12" cy="8" r="2.4" fill="none" stroke="#9a6a3a" strokeWidth="1" />
    </svg>
  );
}

/* ─── Declared grid ───────────────────────────────────────────────────── */

function DeclaredGrid({
  declared,
}: {
  declared: NonNullable<BusinessPayload["facts"]>["declared"];
}) {
  const rows: Array<[string, string]> = [];
  if (declared.foundedYear) {
    const n = new Date().getUTCFullYear() - declared.foundedYear;
    rows.push(["Founded", `${declared.foundedYear} · ${n} ${n === 1 ? "year" : "years"}`]);
  }
  if (declared.teamSize != null) rows.push(["Team size", String(declared.teamSize)]);
  if (declared.supplierCount != null) rows.push(["Suppliers", String(declared.supplierCount)]);
  if (declared.supplierCountries?.length) {
    rows.push(["Supplier countries", declared.supplierCountries.join(" · ")]);
  }
  if (rows.length === 0) return null;

  return (
    <section data-bizx-block="">
      <h2>Operations</h2>
      <dl data-bizx-dl="">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ─── Deep dive ───────────────────────────────────────────────────────── */

function DeepDivePanel({ b }: { b: BusinessPayload }) {
  const dd = b.deep_dive;
  if (!dd) return null;
  const body = dd.locked ? dd.teaser : (dd.text ?? dd.teaser);
  return (
    <section data-bizx-deepdive="" data-locked={dd.locked ? "" : undefined}>
      <h2>How this business makes money</h2>
      {paragraphs(body).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      {dd.locked ? (
        <p data-bizx-block-foot="">
          {dd.sentences} sentences in full. Unlocked by valuing a business.
        </p>
      ) : null}
    </section>
  );
}

/* ─── Disclosure tiers ────────────────────────────────────────────────
 *
 * 🚨 DECLARED BEFORE the copy block below, which is not cosmetic ordering:
 * INFO lists the rating bands by reading RATING_BANDS, and a `const` read
 * above its own declaration throws at module load. Keeping the definition
 * first is what lets the tooltip quote the real ladder instead of a second
 * copy of it that can drift.
 *
 * Catalogue size, review count and rating are published as BANDS, never as
 * the figure Keepa read.
 *
 * 🚨 The reason is re-identification, not tidiness. "295 SKUs, 7,637 reviews,
 * 4.72★, US/CA/MX, playmats" is close to a fingerprint: anyone willing to
 * search the category can find the one seller it matches, and the whole
 * premise of this page is that a business can publish its numbers WITHOUT
 * publishing itself. A band says the same useful thing — roughly how big,
 * roughly how well reviewed — while putting the business in a crowd.
 *
 * All three FLOOR. A business is never rounded UP into a bracket it has not
 * reached: "250+" on 295 SKUs is true, "300+" would not be.
 */

/** Reviews, on a 1 / 2.5 / 5 ladder per decade.
 *
 *  The step widens with the count on purpose. A fixed 1,000-wide bucket is
 *  far too revealing at 40,000 (forty brackets, few sellers in each) and far
 *  too blunt at 900. Multiplying the step as the number grows keeps every
 *  bracket roughly the same RELATIVE width, so the size of the crowd a
 *  business hides in stays about constant all the way up.
 *
 *  100 → "100+" · 900 → "500+" · 7,637 → "5,000+" · 40,000 → "25,000+" */
function reviewTier(n: number): string {
  if (n < 100) return "Under 100";
  let step = 100;
  while (step * 10 <= n) step *= 10;
  const band = [5, 2.5, 1].map((m) => m * step).find((v) => n >= v) ?? step;
  return `${band.toLocaleString()}+`;
}

/** SKUs, floored to the nearest 50. 295 → "250+".
 *
 *  A flat step rather than the review ladder because catalogue sizes cluster
 *  in the low hundreds, where 50 is already coarse enough to hide in. ⚠️ It
 *  does NOT widen: a 5,000-SKU catalogue lands on "4,950+", which is nearly
 *  the exact figure. If businesses that large start publishing here, this
 *  wants the same widening `reviewTier` does. */
function skuTier(n: number): string {
  if (n < 50) return "Under 50";
  return `${(Math.floor(n / 50) * 50).toLocaleString()}+`;
}

/** Rating, in bands. 4.72 → "4.7+".
 *
 *  Roughly quarter-star from 4.0 up, half-star below, because that is where
 *  the ratings actually are. Amazon ratings crowd into 4.0–5.0, so an evenly
 *  spaced ladder spends most of its brackets on a range almost nobody
 *  occupies and lumps the entire useful range into two or three.
 *
 *  🚨 The edges are ONE DECIMAL — 4.7 and 4.2, not 4.75 and 4.25. A star
 *  rating is a one-decimal quantity everywhere a seller has ever seen one, so
 *  a two-decimal bracket edge reads as a computed threshold rather than as a
 *  rating, and invites the reader to wonder what the extra digit is hiding.
 *  The bracket is a hair narrower at the top for it, which costs nothing.
 *
 *  Floors, like the other bands — "4.5+" never includes a 4.49 business —
 *  and 5.0 drops the plus, since nothing sits above the top of the scale. */
const RATING_BANDS = [5, 4.7, 4.5, 4.2, 4, 3.5, 3] as const;

/** The bands, written out for the tooltip: "5.0, 4.7+, … and Under 3.0".
 *
 *  Generated from RATING_BANDS rather than typed out beside it. A hand-written
 *  list is a second copy of the ladder, and the two drift the first time an
 *  edge moves — which it just did, from 4.75 to 4.7. */
function ratingBandList(): string {
  const bands = RATING_BANDS.map((b) => (b >= 5 ? "5.0" : `${b.toFixed(1)}+`));
  return `${bands.join(", ")} and Under 3.0`;
}

function ratingTier(n: number): string {
  if (n < 3) return "Under 3.0";
  const band = RATING_BANDS.find((v) => n >= v) ?? 3;
  /* toFixed(1), because a bare 4 renders "4+" beside a "4.5+" and reads as a
     different KIND of number rather than a neighbouring bracket. */
  return band >= 5 ? "5.0" : `${band.toFixed(1)}+`;
}

/* ─── What each metric means ──────────────────────────────────────────
 *
 * One paragraph array per metric, rendered by the ⓘ beside its label.
 *
 * The definitions of the industry terms — Brand Registry, TACoS, COGS —
 * follow the wording brokers already use, because a buyer comparing listings
 * should not have to learn a second vocabulary here. What they do NOT do is
 * copy a claim we cannot support:
 *
 * 🚨 COGS. The broker definition asserts what is inside the number —
 * procurement, labour, materials, fulfilment and storage fees, freight,
 * duties. We cannot assert that, because this figure is a SINGLE BLENDED
 * PERCENTAGE the seller typed (`Connection.blendedCogsPct`, with zero
 * CogsEntry rows behind it). What it includes is exactly what that seller
 * decided it includes, and nobody has checked. The tooltip says so; borrowing
 * the confident version would launder a claim into a definition.
 *
 * 🚨 The banded metrics each explain the band, because a reader who is not
 * told "250+" is a bracket will read it as a number that happens to be round.
 */
const INFO: Record<string, string[]> = {
  skus: [
    "The total number of SKUs (stock keeping units) the business sells. Where a product comes in several colours, sizes or other variations, each variation counts as its own SKU.",
    "Shown as a band, in steps of 50, rather than an exact count.",
  ],
  rating: [
    "The average customer star rating across the business's products. It is a rating of the PRODUCTS, not of the seller, and it is not an Amazon account health score.",
    "Weighted by revenue across the business's top-selling products rather than averaged flat, so a long tail of listings that barely sell cannot swing it in either direction.",
    `Shown as a band. The possible values are ${ratingBandList()} — so 4.7+ means at least 4.7 and less than 5.0.`,
  ],
  reviews: [
    "The combined number of customer reviews across the business's products.",
    "Shown as a band — 1,000+, 2,500+, 5,000+ and so on — rather than an exact count.",
  ],
  category: [
    "The part of Amazon's catalogue the business sells in, at the second level of Amazon's category tree.",
    "It is the quickest read on what kind of business this is: the category sets the referral fee a seller pays, how seasonal demand is likely to be, and who the business is competing against.",
  ],
  listedSince: [
    "The year the business's earliest products first appeared on Amazon, read from the public catalogue.",
    "Older listings tend to carry accumulated reviews and established search ranking, which is part of what a buyer is paying for. Note it describes the LISTINGS rather than the company — a business can be older than its oldest listing, and a listing can outlive the seller who created it.",
  ],
  brandRegistry: [
    "Whether this brand is enrolled in Amazon Brand Registry — the programme Amazon opens to sellers who hold a trademark on what they sell.",
    "What it buys is control. An enrolled brand owns its own listing copy and images rather than sharing edit rights with anyone who attaches to the ASIN, gets a faster route to pulling counterfeit and hijacked offers, and unlocks the advertising formats and search analytics Amazon reserves for brand owners. Without it, a business is exposed to having its own listings rewritten underneath it.",
    "A Yes here usually means a registered trademark exists, since one is normally required to enrol. Worth confirming separately in a sale: the trademark is a legal asset that changes hands on its own terms, not something that transfers with the Amazon account.",
    "Stated by the seller and not verified — enrolment is not something we read from Amazon.",
  ],
  tacos: [
    "Total Advertising Cost of Sales: advertising spend divided by total revenue.",
    "Unlike ACoS, the denominator is ALL revenue — organic sales as well as ad-driven ones — so it measures what advertising costs the business overall rather than how efficiently one campaign converts. A low TACoS means most sales arrive without being paid for.",
    "Calculated across every month of available history.",
  ],
  cogs: [
    "Cost of goods sold: what the business pays to have its products made and delivered into Amazon, as a percentage of what it sells them for. Manufacturing and inbound freight only — it does not include Amazon's own fees, which are shown separately.",
    "Blended across the three product lines and weighted by how much revenue each earns: 10% on the largest line, 20% on the second and about 17.5% on the third.",
    "Supplied by the seller and not checked against invoices.",
  ],
  otherCosts: [
    "Everything the seller expects to lose between the sale price and their profit other than the goods themselves — Amazon's referral fee, FBA picking, packing, shipping, storage and returns.",
    "This is not measured. The seller gave one blended cost figure of 55.5% of revenue; the products actually cost 13.7%, and this is the 41.8% difference. No fee data was read from Amazon — the sync records zero fees for every day of this business's history.",
    "So treat it as the seller's own assumption about their costs, not as a fee schedule. It is a plausible figure for bulky FBA goods, and it is worth checking against a settlement report before relying on it.",
  ],
};

/* ─── Formatting ──────────────────────────────────────────────────────── */

/** Splits the stored deep dive into readable paragraphs.
 *
 *  The column holds ONE block of prose — fourteen sentences of it here — and a
 *  wall that shape is the reason the section goes unread today. Three
 *  sentences a paragraph is a presentation choice and nothing more: no
 *  sentence is dropped, reordered or rewritten, so the text a reader sees is
 *  still exactly the text the owner approved. */
function paragraphs(text: string): string[] {
  const sentences = text.split(/(?<=\.)\s+(?=[A-Z])/);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    out.push(sentences.slice(i, i + 3).join(" "));
  }
  return out;
}

function money(n: number | null | undefined, currency: string): string {
  if (n === null || n === undefined) return "—";
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

function pct(n: number | null | undefined): string {
  return n === null || n === undefined ? "—" : `${n.toFixed(1)}%`;
}

/** "Jul" on its own, or "Jul 2026" with the year. Never "Jul 26" — a
 *  two-digit year beside a month name reads as the 26th of July. */
function fmtMonth(iso: string, withYear = false): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, 1)).toLocaleDateString(undefined, {
    month: "short",
    ...(withYear ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  });
}

function fmtDate(iso: string): string {
  const [y, m, dd] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, dd)).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
