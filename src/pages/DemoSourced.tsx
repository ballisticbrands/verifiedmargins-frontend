import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StatTile, VerificationBadge } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DemoBanner, useDemoMeta } from "@/demo/harness";
import {
  INVENTED,
  MODELLED,
  type BrandLink,
  type Dossier,
  type DossierAsin,
  type TimelineEvent,
} from "@/demo/dossier";
import type { SourcedDemo } from "@/demo/registry";

/**
 * /demo/<slug> for a SOURCED DOSSIER — everything public about a seller who
 * has never heard of us, with every figure naming where it came from.
 *
 * 🚧 The product has no such page, so — like `group` — there is no real page
 * this could drift from, and src/demo/README.md's third-kind rule applies.
 *
 * ── Shaped like /business/<slug> ─────────────────────────────────────────
 * Same wrapper (`vm-profile`), same header, the shared StatTile row, the
 * shared TrendChart, the same `Business deep-dive` block. Reusing those rather
 * than restyling them is what stops the two drifting. `.vm-dossier` adds only
 * what a business page has no equivalent for: tabs, the timeline, source
 * markers and the bibliography.
 *
 * ── Why tabs, and why the tab is in the URL ──────────────────────────────
 * Eight subjects, most of which a given reader does not want. As one column it
 * ran past 4,500px and the sources — the part that makes the rest defensible —
 * were below everything. `?tab=` rather than component state so a tab can be
 * SENT: the bibliography is the natural end of any argument about a figure, and
 * "look at the sources" has to be a link. Same idiom as Leaderboard's `?by=`,
 * including `replace: true` — a tab is not a navigation, and pushing would make
 * Back walk a reader through their own tab presses.
 *
 * ── Nothing here is verified ─────────────────────────────────────────────
 * Bottom rung, drawn by the SHARED badge. And three tabs are openly INVENTED —
 * every figure on them carries a "*" that links to the bibliography entry
 * admitting it. See the note on INVENTED in @/demo/dossier.
 */

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "sales", label: "Sales breakdown" },
  { id: "sourcing", label: "Product sourcing" },
  { id: "advertising", label: "Advertising" },
  { id: "traffic", label: "Traffic & presence" },
  { id: "deepdive", label: "Deep-dive" },
  { id: "sources", label: "Sources" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * 🚨 TWO MODES, ONE COMPONENT.
 *
 * `demo` is the original: a fixture behind /demo/<slug>, wearing the demo
 * banner, noindex, and the "illustrative figures" note. `public` is the same
 * page published at /brand/<slug> as a real, indexable page about a real
 * business — no banner, no noindex, and the title and description come from
 * build-dossiers.mjs rather than from the demo harness.
 *
 * Parameterised rather than forked because the difference is chrome, not
 * substance: the figures, the markers and the bibliography are identical, and
 * a forked copy would be the version that quietly stops matching. The one
 * thing mode must never change is a marker — a public page carries the same
 * ≈ and * as the demo did, because the same numbers are behind them.
 */
export function DemoSourced({
  demo,
  mode = "demo",
}: {
  demo: SourcedDemo;
  mode?: "demo" | "public";
}) {
  const d = demo.dossier;
  const isDemo = mode === "demo";
  /* The demo harness sets a noindex meta as well as the title, which is
     exactly wrong for a published page — so the public mode sets only the
     title and leaves indexability to the static page's own head. */
  useDemoMeta(isDemo ? `${d.brand} — sourced dossier — demo` : undefined);
  /* 🚨 A TIMEOUT, not a plain effect. App.tsx sets a fallback title in its own
     effect, and a parent's effect runs AFTER its children's — so setting the
     title here directly is immediately overwritten, and the tab reads
     "VerifiedMargins" on every published page. Measured on the live site
     before this line existed. Deferring by a tick puts it after the parent.
     The static page from build-dossiers.mjs already carries the right <title>
     for crawlers and link previews; this is the tab a human looks at. */
  useEffect(() => {
    if (isDemo) return;
    const want = `${d.brand} — VerifiedMargins`;
    const t = setTimeout(() => {
      document.title = want;
    }, 0);
    return () => clearTimeout(t);
  }, [isDemo, d.brand]);

  const [params, setParams] = useSearchParams();
  const raw = params.get("tab");
  const tab: TabId = (TABS.some((t) => t.id === raw) ? raw : "overview") as TabId;
  const go = useCallback(
    (next: TabId) => {
      const p = new URLSearchParams(params);
      if (next === "overview") p.delete("tab");
      else p.set("tab", next);
      setParams(p, { replace: true });
      /* A tab is a new page to a reader even though it is not a navigation,
         and landing halfway down the previous one reads as a broken link. */
      window.scrollTo({ top: 0 });
    },
    [params, setParams],
  );

  return (
    <Shell width="profile">
      {isDemo ? <DemoBanner /> : null}
      <div className="vm-form vm-profile vm-dossier">
        <span data-profile-crumbs="">
          {/* A published page must not say "Demo" — the crumb is the reader's
              way back to the board it is listed on, not to the demo index. */}
          <Breadcrumbs
            items={[
              isDemo ? { label: "Demo", to: "/demo" } : { label: "Leaderboard", to: "/leaderboard" },
              { label: d.brand },
            ]}
          />
        </span>

        <span data-profile-who="">
          {/* The brand's own logo, in the slot a founder's face occupies —
              served from our origin, never hotlinked. */}
          <span data-avatar="" data-business-avatar="" aria-hidden="true">
            <img src={d.logo} alt="" data-brand-logo="" data-logo-shape={d.logoShape} />
          </span>
          <span data-profile-identity="">
            <h1>
              {d.brand}
              <VerificationBadge verification={{ tier: "estimated", label: "Estimated" }} />
            </h1>
            <p data-verified-count="">{d.what}</p>
            <p data-verified-count="">
              Profiled from public data ·{" "}
              <Link to="/how-verification-works">How verification works</Link>
            </p>
            {/* Where this brand can be found, in the header rather than on a
                tab: it belongs to the identity, not to one section's argument,
                and a reader looking for "do they have a website" should not
                have to guess which of eight tabs hides it. */}
            <BrandLinks d={d} go={go} />
          </span>
        </span>

        <nav data-tabs="" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              data-tab=""
              data-current={t.id === tab ? "" : undefined}
              aria-current={t.id === tab ? "page" : undefined}
              onClick={() => go(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "overview" ? <Overview d={d} go={go} /> : null}
        {tab === "timeline" ? <Timeline d={d} go={go} /> : null}
        {tab === "sales" ? <Sales d={d} go={go} /> : null}
        {tab === "sourcing" ? <Sourcing d={d} go={go} /> : null}
        {tab === "advertising" ? <Advertising d={d} go={go} /> : null}
        {tab === "traffic" ? <Traffic d={d} go={go} /> : null}
        {tab === "deepdive" ? <DeepDiveTab d={d} go={go} /> : null}
        {tab === "sources" ? <Sources d={d} /> : null}
      </div>
    </Shell>
  );
}

/* ─────────────────────────────────────────────────────────── shared pieces */

type Go = (t: TabId) => void;

/**
 * The marker that ties a figure to the source answerable for it.
 *
 * A BUTTON, not an anchor: the bibliography lives on another tab, so the job
 * is "switch tab, then reveal that entry" rather than "jump to an id on this
 * page". An `href="#src-…"` would have silently done nothing whenever the
 * sources tab was not the one rendered.
 *
 * Invented figures render "*" instead of a number — one mechanism for both, so
 * a fabricated value cannot be shown without a marker.
 */
function Src({ id, sources, go }: { id: string; sources: Dossier["sources"]; go: Go }) {
  const i = sources.findIndex((s) => s.id === id);
  if (i < 0) return null;
  const mark = MARK[id];
  return (
    <button
      type="button"
      data-src-mark=""
      data-invented={id === INVENTED ? "" : undefined}
      data-modelled={id === MODELLED ? "" : undefined}
      title={
        id === INVENTED
          ? "Invented for this demo — nobody measured it"
          : id === MODELLED
            ? "Computed by us from the sources listed — the formula is in Sources"
            : `Source: ${sources[i].label}`
      }
      onClick={() => go("sources")}
    >
      {mark ?? i + 1}
    </button>
  );
}

/** The two ids that render a glyph instead of a number. Keeping them in one
 *  map is what stops a third rung being added in one place and forgotten in
 *  the bibliography. */
const MARK: Record<string, string> = { [INVENTED]: "*", [MODELLED]: "≈" };

/**
 * The caveat, folded into a badge.
 *
 * 🚨 Every paragraph behind one of these used to sit in the page as body text,
 * and there were six of them. Each was defensible on its own and together they
 * buried the thing they were defending: a reader met four paragraphs about how
 * a number was made before meeting the number. The honesty is not in the word
 * count — it is in the caveat being one hover away from the figure it belongs
 * to, and in nothing being deleted to get there.
 *
 * Hover OR focus OR tap: the popover has to survive a keyboard and a phone,
 * not just a mouse. It lives inside the wrapper so a pointer can travel from
 * the badge into the text — several of these contain source markers a reader
 * is meant to be able to click.
 */
function Info({ children, label }: { children: React.ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span data-info="" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        data-info-badge=""
        aria-label={label}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        i
      </button>
      {open ? (
        <span data-info-pop="" role="tooltip">
          {children}
        </span>
      ) : null}
    </span>
  );
}

/** Shown at the top of every tab whose figures are made up.
 *
 * `scope` exists because the overview is now HALF invented: its tiles are
 * Keepa's and its chart is not. "Every figure on this tab" was true of the
 * three tabs this notice was written for and became a lie the moment it
 * appeared above a row of real numbers. */
function InventedNotice({
  what,
  go,
  scope = "on this tab",
}: {
  what: string;
  go: Go;
  scope?: string;
}) {
  return (
    <p data-invented-notice="">
      🚧 <strong>Demo placeholder.</strong> {what} Nobody measured any figure {scope} — every one
      carries a <span data-invented-star="">*</span>. See{" "}
      <button type="button" data-linklike="" onClick={() => go("sources")}>
        Sources
      </button>
      .
    </p>
  );
}

/**
 * The invented economics, computed ONCE.
 *
 * The tile row, the profit chart and the sourcing tab's margin block all show
 * the same three numbers, and three copies of `100 - sum(lines)` is three
 * chances for a page to contradict itself about a figure it made up — which
 * is a worse look than the made-up figure.
 */
function modelled(d: Dossier) {
  const net = 1 - d.economics.lines.reduce((t, l) => t + l.pct, 0) / 100;
  const adsPct = (d.economics.lines.find((l) => l.key === "ads")?.pct ?? 0) / 100;
  const revenue = d.asins.reduce((t, a) => t + a.monthlySold * (a.priceCents ?? 0), 0);
  return { net, adsPct, revenue, profit: revenue * net, ads: revenue * adsPct };
}

/** The tag both invented tiles carry.
 *
 * 🚨 NOT a verification tier. `--partial` (amber) means "we checked half of
 * this" and the shared tile paints every tag in it, so `.vm-dossier` repaints
 * this one neutral — an invented number is not a rung on the ladder, it is off
 * the ladder entirely. */
const MODELLED_TAG = {
  label: "Modelled",
  title:
    "Computed by us from published fee rates, supplier quotes and category benchmarks — not measured, and not made up. The formula is in Sources.",
};

/**
 * A country's flag from its ISO code, by arithmetic rather than by an asset.
 *
 * Regional-indicator letters: "US" → 🇺🇸. No image, no icon font, no lookup
 * table to fall out of date, and nothing to 404 — the two code points ARE the
 * flag. Returns an empty string for anything that is not two letters, so a
 * malformed code renders as no flag rather than as tofu.
 */
function flag(code: string): string {
  const c = (code ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return "";
  return String.fromCodePoint(...[...c].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

function money(cents: number): string {
  const d = cents / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(2)}M`;
  if (d >= 1000) return `$${Math.round(d).toLocaleString()}`;
  return `$${d.toFixed(2)}`;
}

/* ────────────────────────────────────────────────────────────────── tabs */

function Overview({ d, go }: { d: Dossier; go: Go }) {
  const m = modelled(d);
  return (
    <>
      {/* The deep-dive, clamped. It does not expand in place — the whole
          argument is a tab of its own, and two ways to read the same prose is
          one more than a reader needs. */}
      <section data-deep-dive="">
        <h2 data-facts-legend="">Business deep-dive</h2>
        <p data-deep-dive-text="" data-clamped="">
          {d.deepDive}
        </p>
        <button type="button" data-deep-dive-toggle="" onClick={() => go("deepdive")}>
          Read the deep-dive
        </button>
      </section>

      <section>
        <h2 className="vm-visually-hidden">Estimated figures</h2>
        {/* 🚨 ORDER IS LOAD-BEARING. Tiles 1, 2 and 4 are the three series on the
            chart below, and the CSS colours their borders by :nth-child to match
            the lines. A tile whose border says "revenue" over a figure that is not
            revenue is worse than no colour at all — reorder these and reorder the
            border rules with them. Margin sits third and uncoloured because it is
            a ratio of the other three, not a fourth line. */}
        <div data-tiles="">
          <StatTile
            label="Profit / mo"
            value={money(m.profit)}
            tag={MODELLED_TAG}
            hint="Before returns and overhead, both set to zero — so a ceiling. See the sourcing tab."
          />
          <StatTile
            label="Revenue / mo"
            value={d.headline.revenue}
            hint="A floor — the deep-dive says why."
          />
          <StatTile
            label="Margin"
            value={`${Math.round(m.net * 100)}%`}
            tag={MODELLED_TAG}
            hint="Revenue less cost of goods, Amazon's fees and modelled ad spend."
          />
          <StatTile
            label="Ad spend / mo"
            value={money(m.ads)}
            tag={MODELLED_TAG}
            hint={`≈${Math.round(m.adsPct * 100)}% of revenue. The advertising tab shows the arithmetic.`}
          />
        </div>
        <p data-tiles-note="">
          <small>
            Where these come from
            <Info label="Where the figures in this row come from">
              <span data-info-para="">
                Revenue, units, price and catalogue from Keepa
                <Src id="keepa" sources={d.sources} go={go} />, across the whole{" "}
                {d.counts.catalogue}-product catalogue. Profit and margin are neither: they are
                computed
                <Src id={MODELLED} sources={d.sources} go={go} /> from published supplier quotes,
                Amazon's own fee rates and a modelled ad spend — before returns and overhead, which
                are set to zero, so the profit figure is a ceiling. The{" "}
                <button type="button" data-linklike="" onClick={() => go("sourcing")}>
                  sourcing tab
                </button>{" "}
                shows every line that comes off.
              </span>
            </Info>
          </small>
        </p>
      </section>

      <section>
        {/* No heading and no headline sentence here on purpose: the tile row
            immediately above already names the three figures this chart draws,
            and the caveat that used to justify them now rides on the legend,
            where the series it is about are. */}
        <ProfitChart d={d} go={go} />
        <p data-chart-label="">
          <small>
            {d.copy.profitChart}{" "}
            <button type="button" data-linklike="" onClick={() => go("timeline")}>
              See the full timeline
            </button>
            .
          </small>
        </p>
      </section>

      <Operator d={d} go={go} />
    </>
  );
}

/**
 * Where the brand can be found, as icon links under the bio.
 *
 * The metric beside each one is the platform's own headline number and carries
 * its own marker: a follower count read off a public profile is a figure like
 * any other here, and an unmarked one sitting in a row of marked ones reads as
 * the measured half.
 */
function BrandLinks({ d, go }: { d: Dossier; go: Go }) {
  if (!d.links.length) return null;
  return (
    <ul data-brand-links="">
      {d.links.map((l) => (
        <li key={l.href}>
          <a href={l.href} rel="nofollow noopener" target="_blank">
            <PlatformIcon platform={l.platform} />
            <span data-link-label="">{l.label}</span>
          </a>
          {l.metric ? (
            <span data-link-metric="" className="vm-num">
              {l.metric}
              <Src id={l.source} sources={d.sources} go={go} />
            </span>
          ) : (
            <Src id={l.source} sources={d.sources} go={go} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** Inline SVG, one path per platform: a CSP that blocks external hosts blocks
 *  icon fonts and CDN sprites too, and a logo that 404s months later is worse
 *  than no logo. `currentColor` throughout, so nothing here can spend the
 *  verification green by accident. */
function PlatformIcon({ platform }: { platform: BrandLink["platform"] }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  } as const;
  if (platform === "amazon")
    return (
      <svg {...common} fill="currentColor">
        {/* The smile, and the "a" above it — recognisable at 16px without
            reproducing the wordmark. */}
        <path d="M2.6 16.9c3.2 1.9 6.9 2.9 10.6 2.9 2.6 0 5.2-.5 7.6-1.5.4-.2.7.2.4.5-2.2 1.9-5.4 2.9-8.2 2.9-4 0-7.8-1.5-10.7-4-.2-.2 0-.5.3-.8Zm19.1-.4c-.3-.4-2-.2-2.8-.1-.2 0-.3-.2-.1-.3 1.4-1 3.6-.7 3.9-.4.3.4-.1 2.6-1.4 3.7-.2.2-.4.1-.3-.1.3-.8.9-2.4.7-2.8Z" />
        <path d="M13.1 9.3c0 1.1 0 2.1-.6 3.1-.4.8-1.1 1.3-1.9 1.3-1 0-1.6-.8-1.6-2 0-2.3 2.1-2.7 4.1-2.7v.3Zm2.8 6.7c-.2.2-.5.2-.7.1-1-.8-1.2-1.2-1.7-2-1.6 1.7-2.8 2.2-4.9 2.2-2.5 0-4.5-1.5-4.5-4.6 0-2.4 1.3-4.1 3.2-4.9 1.6-.7 3.9-.8 5.7-1v-.4c0-.7.1-1.5-.4-2.1-.4-.5-1.1-.7-1.7-.7-1.2 0-2.2.6-2.5 1.8-.1.3-.3.6-.5.6L5.2 4.7c-.2-.1-.5-.3-.4-.6C5.4 1.3 7.9.4 10.2.4c1.2 0 2.7.3 3.6 1.2 1.2 1.1 1.1 2.6 1.1 4.2v3.8c0 1.1.5 1.6 1 2.3.2.2.2.5 0 .7-.5.5-1.5 1.3-2 1.8Z" />
      </svg>
    );
  if (platform === "instagram")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (platform === "facebook")
    return (
      <svg {...common} fill="currentColor">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.7v8h3.5Z" />
      </svg>
    );
  if (platform === "tiktok")
    return (
      <svg {...common} fill="currentColor">
        <path d="M16.5 3c.4 1.9 1.6 3.3 3.5 3.5v2.6c-1.3.1-2.5-.3-3.6-1v5.6c0 3.4-2.6 5.6-5.6 5.3-2.7-.3-4.6-2.6-4.4-5.4.2-2.6 2.5-4.6 5.1-4.4v2.7c-.4-.1-.8-.1-1.2 0-1.2.2-2 1.2-1.9 2.4.1 1.2 1.1 2.1 2.3 2 1.3 0 2.2-1 2.2-2.4V3h3.6Z" />
      </svg>
    );
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
  );
}

function Operator({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section>
      <h2>The operator</h2>
      <dl data-operator="">
        <div>
          <dt>Legal name</dt>
          <dd>{d.operator.businessName}</dd>
        </div>
        <div>
          <dt>Seller</dt>
          <dd>
            <a href={d.operator.storefrontUrl} rel="nofollow noopener" target="_blank">
              {d.operator.sellerName}
            </a>{" "}
            <span className="vm-num" data-muted="">
              {d.operator.sellerId}
            </span>
          </dd>
        </div>
        {d.operator.since ? (
          <div>
            <dt>Trading since</dt>
            <dd>
              <span className="vm-num">{d.operator.since.value}</span>
              <Src id={d.operator.since.source} sources={d.sources} go={go} />
              {d.operator.since.note ? (
                <span data-muted=""> — {d.operator.since.note}</span>
              ) : null}
            </dd>
          </div>
        ) : null}
        <div>
          <dt>Registered address</dt>
          <dd>
            {d.operator.address.join(", ")} · <span data-flag="">{flag(d.operator.country)}</span>{" "}
            {d.operator.country}
          </dd>
        </div>
        <div>
          <dt>Seller feedback</dt>
          <dd>
            <span className="vm-num">{d.operator.feedback}</span>{" "}
            {d.operator.feedbackNote ? (
              <span data-muted="">— {d.operator.feedbackNote}</span>
            ) : null}
          </dd>
        </div>
      </dl>
      <p data-src-line="">
        <Src id={d.operator.source} sources={d.sources} go={go} /> Resolved from the buy-box seller
        on the brand's best-selling products.
      </p>
    </section>
  );
}

/**
 * The history as one vertical line.
 *
 * Ordered oldest first and NOT grouped by track, because the whole point is
 * what the strands do to each other: four years of Instagram, then a single
 * Amazon listing that sits alone for ten months, then the catalogue and the ad
 * spend arriving together. Grouping would hide exactly that.
 */
const TRACK_LABEL: Record<TimelineEvent["track"], string> = {
  brand: "Brand",
  amazon: "Amazon",
  ads: "Advertising",
  web: "Web",
};

function Timeline({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section>
      <h2>How this business got here</h2>
      <p>Oldest first. {d.copy.timelineLede}</p>
      <ol data-timeline="">
        {d.timeline.map((e) => (
          <li key={`${e.date}-${e.title}`} data-track={e.track}>
            <span data-when="" className="vm-num">
              {e.date}
            </span>
            <span data-dot="" aria-hidden="true" />
            <span data-what="">
              <span data-track-tag="">{TRACK_LABEL[e.track]}</span>
              <strong>{e.title}</strong>
              <Src id={e.source} sources={d.sources} go={go} />
              {e.detail ? <span data-detail="">{e.detail}</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Sales({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section>
      <h2>Where the revenue is</h2>
      <p>
        Monthly revenue by product, from <code>monthlySold × buy box price</code>.{" "}
        {d.copy.salesLede}
      </p>
      <RevenueBars asins={d.asins} />

      <h3>Every product we priced</h3>
      <table data-asins="">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">ASIN</th>
            <th scope="col">Listed</th>
            <th scope="col">Sold / mo</th>
            <th scope="col">Price</th>
            <th scope="col">Revenue / mo</th>
          </tr>
        </thead>
        <tbody>
          {d.asins.map((a) => (
            <tr key={a.asin}>
              <td>{a.title}</td>
              <td>
                <a
                  className="vm-num"
                  href={`https://www.amazon.com/dp/${a.asin}`}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  {a.asin}
                </a>
              </td>
              <td className="vm-num">{a.listed}</td>
              <td className="vm-num">{a.monthlySold.toLocaleString()}+</td>
              <td className="vm-num">{a.priceCents ? money(a.priceCents) : "—"}</td>
              <td className="vm-num">{a.priceCents ? money(a.monthlySold * a.priceCents) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p data-src-line="">
        <Src id="keepa" sources={d.sources} go={go} /> "Sold / mo" is Amazon's own badge, which is
        why every row reads <em>n+</em>.
        {/* Only where such a row exists. Explaining a dash in a column that has
            no dashes reads as a page describing a different catalogue — which
            is the failure `copy` was extracted to stop. */}
        {d.asins.some((a) => a.priceCents == null)
          ? " A row with no price has a live badge and no current offer — it sells, and it is out of stock."
          : null}
      </p>
    </section>
  );
}

function Sourcing({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section>
      <h2>
        Product sourcing
        <Info label="What these quotes are, and what they are not">
          <span data-info-para="">
            Cost of goods is the one figure that turns revenue into margin, and it is the one nobody
            publishes about themselves. So these are{" "}
            <strong>real published quotes for a comparable product</strong> — named suppliers, their
            own price ranges and their own minimum orders, each one a link you can open.
          </span>
          <span data-info-para="">
            What they are not is this business's cost sheet. A published range prices the CATEGORY,
            the quotes are FOB China with no freight or duty in them, and nobody here has seen what
            this seller actually pays. That distance is why the margin below is still marked.
          </span>
        </Info>
      </h2>
      <table data-asins="" data-sourcing="">
        <thead>
          <tr>
            <th scope="col">Quote</th>
            <th scope="col">Region</th>
            <th scope="col">MOQ</th>
            <th scope="col">Lead time</th>
            <th scope="col">Unit cost</th>
          </tr>
        </thead>
        <tbody>
          {d.sourcing.map((r) => (
            <tr key={r.supplier}>
              <td>
                {r.href ? (
                  <a href={r.href} rel="nofollow noopener" target="_blank">
                    {r.supplier}
                  </a>
                ) : (
                  r.supplier
                )}
                <Src id={r.source} sources={d.sources} go={go} />
              </td>
              <td>{r.region}</td>
              <td className="vm-num">{r.moq}</td>
              <td className="vm-num">{r.leadTime}</td>
              <td className="vm-num">{r.unitCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UnitEconomics d={d} go={go} />
    </section>
  );
}

/**
 * 🚧 The quotes above, totalled into a margin — which is the one thing this
 * page was built NOT to do.
 *
 * It is here on an explicit instruction, so that a demo can show the finished
 * shape rather than a hole where the interesting half goes, and the whole of
 * its defensibility rests on the marking: every figure carries a "*", the tab
 * leads with the placeholder notice, and the sentence under the table says in
 * words that a real page would leave this blank until a seller connected.
 * Whoever changes this next: the margin is the number the product exists to
 * refuse to guess. Keep the markers.
 */
function UnitEconomics({ d, go }: { d: Dossier; go: Go }) {
  /* The same three numbers the tile row and the chart show — one helper, so
     they cannot drift apart. */
  const { net: netFraction, revenue, profit } = modelled(d);
  const net = netFraction * 100;
  return (
    <>
      <h3>
        What that makes the margin
        <Info label="What is measured here and what is computed">
          <span data-info-para="">{d.economics.basis}</span>
          <span data-info-para="">
            Read the markers, not the total. A number means somebody published it — a supplier's own
            price, Amazon's own referral rate, Amazon's own fee card. A{" "}
            <span data-invented-star="">≈</span> means we computed it from those, and the
            advertising line is the one that moves everything: shift it five points and the margin
            shifts five points. Returns and overhead are set to ZERO deliberately, which is why this
            is a ceiling on profit rather than profit.
          </span>
        </Info>
      </h3>
      <ul data-econ="">
        {d.economics.lines.map((l) => (
          <li key={l.label}>
            <span data-econ-label="">{l.label}</span>
            <span data-econ-pct="" className="vm-num">
              −{l.pct}%<Src id={l.source} sources={d.sources} go={go} />
            </span>
            {l.note ? <span data-econ-note="">{l.note}</span> : null}
          </li>
        ))}
        <li data-econ-total="">
          <span data-econ-label="">Margin</span>
          <span data-econ-pct="" className="vm-num">
            {net.toFixed(0)}%<Src id={MODELLED} sources={d.sources} go={go} />
          </span>
          <span data-econ-note="">
            ≈ {money(profit)} a month on {money(revenue)} of catalogue revenue — the tile and the
            line on the overview. Before returns and overhead, which are set to zero here, so this
            is a CEILING on profit rather than profit.
          </span>
        </li>
      </ul>
      <p data-src-line="">
        On a site called VerifiedMargins the real version of this block stays empty until the seller
        connects their account and the costs are theirs.
      </p>
    </>
  );
}

function Advertising({ d, go }: { d: Dossier; go: Go }) {
  const meta = d.advertising.find((a) => a.href);
  return (
    <section>
      <h2>
        Advertising
        <Info label="Why the dollar column is arithmetic">
          <span data-info-para="">
            ≈ <strong>Modelled.</strong> No public source reports a competitor's ad spend, so the
            dollar column is arithmetic — a published category cost-per-click and conversion rate
            against real unit and visit counts. The <em>Counted</em> line under each row is the part
            somebody actually measured. Every dollar figure carries a{" "}
            <span data-invented-star="">≈</span>; each formula is in{" "}
            <button type="button" data-linklike="" onClick={() => go("sources")}>
              Sources
            </button>
            .
          </span>
          <span data-info-para="">{d.copy.advertisingLede}</span>
        </Info>
      </h2>
      <ul data-adspend="">
        {d.advertising.map((a) => (
          <li key={a.channel}>
            <span data-ad-channel="">
              {a.href ? (
                <a href={a.href} rel="nofollow noopener" target="_blank">
                  {a.channel}
                </a>
              ) : (
                a.channel
              )}
              {/* Cites what is genuinely published about the CHANNEL. The
                  figure's own citation sits on the figure. */}
              {a.linkSource ? <Src id={a.linkSource} sources={d.sources} go={go} /> : null}
            </span>
            <span data-ad-spend="" className="vm-num">
              {a.spend}
              <Src id={a.source} sources={d.sources} go={go} />
            </span>
            {/* What somebody actually publishes about this channel, beside what
                nobody does. A spend figure with a counted figure next to it is
                much harder to misread as measured. */}
            {a.activity ? (
              <span data-ad-activity="">
                Counted: <span className="vm-num">{a.activity}</span>
                {a.activitySource ? (
                  <Src id={a.activitySource} sources={d.sources} go={go} />
                ) : null}
              </span>
            ) : null}
            {a.note ? <span data-ad-note="">{a.note}</span> : null}
          </li>
        ))}
      </ul>
      {meta?.href ? (
        <p data-src-line="">
          Worth opening for real:{" "}
          <a href={meta.href} rel="nofollow noopener" target="_blank">
            their live creative in the Meta ad library
          </a>{" "}
          — that part is not invented.
        </p>
      ) : null}
    </section>
  );
}

function Traffic({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section>
      <h2>Traffic &amp; presence</h2>
      <p>The half Amazon cannot see. {d.copy.trafficLede}</p>
      <ul data-off-amazon="">
        {d.offAmazon.map((o) => (
          <li key={o.href}>
            <a href={o.href} rel="nofollow noopener" target="_blank">
              {o.label}
            </a>
            {o.value ? (
              <span className="vm-num" data-off-value="">
                {o.value}
              </span>
            ) : null}
            {o.note ? <span data-off-note="">{o.note}</span> : null}
            <Src id={o.source} sources={d.sources} go={go} />
          </li>
        ))}
      </ul>

      <h3>
        Where they rank on Amazon
        <Info label="Why best-seller rank and not keyword positions">
          <span data-info-para="">
            Amazon publishes no search volumes and localises its search results to whoever is
            looking, so a scraped keyword position is worth less than it looks. Best-seller rank is
            printed on the listing itself, is the same number for everyone, and is what a seller in
            this category actually watches.
          </span>
        </Info>
      </h3>
      <ul data-bestsellers="">
        {d.bestsellers.map((r) => (
          <li key={r.label}>
            <span data-bsr-label="">{r.label}</span>
            <span data-bsr-rank="" className="vm-num">
              {r.rank}
              <Src id={r.source} sources={d.sources} go={go} />
            </span>
            {r.note ? <span data-bsr-note="">{r.note}</span> : null}
          </li>
        ))}
      </ul>

      <h3>Search presence off Amazon</h3>
      {d.keywords.some((k) => k.source === INVENTED) ? (
        <InventedNotice what="Ranks and search volumes are placeholders." go={go} />
      ) : null}
      <table data-asins="">
        <thead>
          <tr>
            <th scope="col">Term</th>
            <th scope="col">Where</th>
            <th scope="col">Rank</th>
            <th scope="col">Volume</th>
          </tr>
        </thead>
        <tbody>
          {d.keywords.map((k) => (
            <tr key={`${k.engine}-${k.term}`}>
              <td>{k.term}</td>
              <td>{k.engine}</td>
              <td className="vm-num">
                {k.rank}
                <Src id={k.source} sources={d.sources} go={go} />
              </td>
              {/* The volume is invented too. The notice above promises every
                  figure carries a marker, so it has to actually carry one —
                  an unmarked number beside marked ones reads as the measured
                  half of the row. */}
              <td className="vm-num">
                {k.volume}
                <Src id={k.source} sources={d.sources} go={go} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function DeepDiveTab({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section data-method="">
      <h2>Business deep-dive</h2>
      <p data-lede="">{d.deepDive}</p>

      <h2>How these estimates were made</h2>

      <h3>Nobody has asserted these figures</h3>
      <p>
        Not Amazon, not the seller — nobody at this business has spoken to us. So every number here
        carries a marker saying where it came from, and there are three kinds. A{" "}
        <strong>number</strong> means somebody published it and we read it: Amazon's own fee rates,
        a supplier's own price list, a best-seller rank printed on the listing, a keyword tool's
        volume. A <span data-invented-star="">≈</span> means we computed it from those, and the
        formula is in{" "}
        <button type="button" data-linklike="" onClick={() => go("sources")}>
          Sources
        </button>{" "}
        — ad spend and the margin are the two that matter. A <span data-invented-star="">*</span>{" "}
        means we made it up, and on this page it is down to one row: the freight and duty nobody
        quoted.
      </p>
      <p>
        The distinction is the point. A figure you can reproduce from the sources listed is a figure
        you can argue with — and being argued with is the outcome this page is built for. A figure
        you would have to take our word for is marked so you do not.
      </p>

      <h3>Sales — Amazon's own "bought in past month"</h3>
      <p>
        Amazon prints a badge on a listing that reads "10,000+ bought in the past month". It is the
        only sales figure Amazon publishes, and{" "}
        <a href="https://keepa.com/#!api" rel="nofollow noopener" target="_blank">
          Keepa
        </a>{" "}
        records it. We read it across all {d.counts.catalogue} listings and multiplied by the buy
        box price.
      </p>
      <p>
        Two things make this a <strong>floor rather than a guess</strong>. The badge is bucketed, so
        "10,000+" is recorded as 10,000 when the truth is somewhere under 20,000. And Amazon only
        shows it above roughly 50 sales a month — the {d.counts.unbadged} listings below that
        threshold show nothing and are counted here as zero. The real figure is higher than the one
        above, not lower.
      </p>

      <h3>The operator, and where they are</h3>
      <p>
        A brand and the business running it are not the same record. We resolve the buy-box seller
        on the top listings, then read that seller's own registration — legal name, address, country
        and feedback score. Amazon publishes it; we did not model it.
      </p>

      <h3>What is not here</h3>
      <ul data-gaps="">
        {d.gaps.map((g) => (
          <li key={g.slice(0, 24)}>{g}</li>
        ))}
      </ul>

      <h3>What would replace all of this</h3>
      <p>
        One thing: the seller connecting their Amazon account. Then revenue and fees come from
        Amazon directly, cost of goods comes from them, and the badge at the top stops saying
        "Estimated".
      </p>
      <p data-src-line="">
        Every figure's origin is listed in{" "}
        <button type="button" data-linklike="" onClick={() => go("sources")}>
          Sources
        </button>
        .
      </p>
    </section>
  );
}

/** The bibliography. Every marker anywhere on the page lands here. */
function Sources({ d }: { d: Dossier }) {
  return (
    <section>
      <h2>Sources</h2>
      <p>
        Every figure on this page points at one of these. A <strong>number</strong> means somebody
        published it and we read it. A <span data-invented-star="">≈</span> means we computed it
        from the numbered entries beside it, and the formula is in the entry. A{" "}
        <span data-invented-star="">*</span> means we made it up for the demo.
      </p>
      <ol data-sources="">
        {d.sources.map((s, i) => (
          <li
            key={s.id}
            id={`src-${s.id}`}
            data-invented={s.id === INVENTED ? "" : undefined}
            data-modelled={s.id === MODELLED ? "" : undefined}
          >
            <span data-src-n="" className="vm-num">
              {MARK[s.id] ?? i + 1}
            </span>
            <div>
              <p>
                {s.href ? (
                  <a href={s.href} rel="nofollow noopener" target="_blank">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}{" "}
                {s.read ? <span data-muted="">read {s.read}</span> : null}
              </p>
              <p data-muted="">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────── charts */

/** Width of a block element, measured. The shared TrendChart keeps its own
 *  copy of this and does not export it; ten lines is cheaper than reaching
 *  into a package's internals. */
function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => setW(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}
function monthEnd(key: string): number {
  const [y, m] = key.split("-").map(Number);
  return Date.UTC(y, m, 0, 23, 59, 59);
}
function addMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

/**
 * 🚧 A MODELLED PROFIT HISTORY. Nobody measured a month of it.
 *
 * Built the only way this data allows: `monthlySold` is a reading taken today,
 * so a month's revenue here is today's run rate for every product that WAS
 * ALREADY LISTED then — the real listing dates give the steps, and the heights
 * are an assumption. Costs come off at the invented rates in `economics`.
 *
 * The page used to draw catalogue COUNT for exactly this reason, and the
 * comment where that lived said plotting revenue against launch dates "would
 * draw a revenue history nobody ever measured". It now does, on instruction,
 * so the honesty has to be carried somewhere else: the section leads with the
 * placeholder notice, and every value the chart reports carries a "*".
 */
function ProfitChart({ d, go }: { d: Dossier; go: Go }) {
  const [wrapRef, width] = useMeasuredWidth();
  const [hover, setHover] = useState<{
    kind: "month" | "event";
    i: number;
  } | null>(null);
  /**
   * 🚨 A REF, not the state, because the svg's mousemove and the dot's
   * mouseenter fight over the same pointer.
   *
   * Moving onto a dot fires mouseenter (card = this event) and then more
   * mousemove on the svg underneath. Those mousemove handlers were closed over
   * the PREVIOUS render's `hover`, so their "is an event already showing?"
   * guard read stale and set the card straight back to the month. The result
   * was a chart that looked like it needed a CLICK: only a click left the
   * pointer still long enough for the event card to survive, and focus kept it
   * there. A ref is written and read synchronously, so the guard sees the dot
   * the pointer is actually over.
   */
  const overDot = useRef(false);

  const { net, adsPct } = modelled(d);

  /* One point per calendar month, spanning EVERY dated timeline event as well
     as every listing.
     
     🚨 Not "from the first listing": both dossiers turn on things that happened
     before the Amazon business existed — a Shopify store trading fifteen months
     early, a trademark filed ten weeks early — and a chart that begins at the
     first ASIN silently drops exactly those dots. The flat stretch at zero on
     the left is not missing data. It is the finding: the brand was already
     running, and this line was not. */
  const points = useMemo(() => {
    const listed = d.asins.map((a) => a.listed).sort();
    const dated = d.timeline
      .map((e) => e.date)
      .filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x))
      .sort();
    /* 🚨 The window follows the DATA when there is data.
       It used to span every dated timeline event, so that a brand trading
       before it reached Amazon showed that stretch at zero. With Keepa's badge
       history the plot has something to draw, and spanning back to a 2024 event
       squeezed ten months of real movement into the right quarter of the frame.
       Earlier events keep their place on the Timeline tab, which the caption
       links to. Without history the old span stands: there is nothing else to
       show. */
    const hist = d.salesHistory ?? [];
    const first = hist.length
      ? hist[0].month
      : [d.firstListed, listed[0], dated[0]].filter(Boolean).sort()[0];
    const last = hist.length
      ? hist[hist.length - 1].month
      : [listed.at(-1)!, dated.at(-1)].filter(Boolean).sort().at(-1)!;
    let key = monthKey(first);
    const stop = monthKey(last);
    const out: Array<{
      key: string;
      t: number;
      revenue: number | null;
      profit: number | null;
      ads: number | null;
    }> = [];
    /* 🚨 Keepa's badge history where it exists, and NOTHING where it does not.
       A month Keepa never recorded a badge for is not a month of zero sales —
       it is a month nobody measured, and the line breaks there rather than
       drawing a business that sold nothing. Only if a dossier carries no
       history at all does the old model run: today's reading applied back over
       each product's launch date, which is what produced a flat line from the
       last launch onwards. */
    const real = new Map((d.salesHistory ?? []).map((h) => [h.month, h]));
    for (let guard = 0; guard < 240; guard++) {
      const t = monthEnd(key);
      const hit = real.get(key);
      const revenue = d.salesHistory?.length
        ? (hit?.revenueCents ?? null)
        : d.asins
            .filter((a) => a.priceCents && Date.parse(`${a.listed}T00:00:00Z`) <= t)
            .reduce((sum, a) => sum + a.monthlySold * (a.priceCents as number), 0);
      out.push({
        key,
        t,
        revenue,
        profit: revenue === null ? null : revenue * net,
        ads: revenue === null ? null : revenue * adsPct,
      });
      if (key === stop) break;
      key = addMonth(key);
    }
    return out;
  }, [d.asins, d.timeline, d.firstListed, net, adsPct]);

  const height = 260;
  const pad = { top: 14, right: 16, bottom: 30, left: 58 };
  const w = width || 640;
  const innerW = Math.max(1, w - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;
  /* Scaled to REVENUE, because both series share one axis: scaling to profit
     would push the revenue line off the top of the plot. */
  const max = Math.max(...points.map((p) => p.revenue ?? 0), 1);
  const x = (t: number) => pad.left + ((t - t0) / Math.max(1, t1 - t0)) * innerW;
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  /* Segments, not one polyline: a gap in the data has to be a gap in the line.
     Joining across it would invent the months Keepa never recorded. */
  const path = (pick: (p: (typeof points)[number]) => number | null) => {
    let out = "";
    let open = false;
    for (const p of points) {
      const v = pick(p);
      if (v === null) {
        open = false;
        continue;
      }
      out += `${open ? "L" : "M"}${x(p.t).toFixed(1)},${y(v).toFixed(1)} `;
      open = true;
    }
    return out.trim();
  };
  const line = path((p) => p.profit);
  const revenueLine = path((p) => p.revenue);
  const adsLine = path((p) => p.ads);
  const drawn = points.filter((p) => p.profit !== null);
  const area = drawn.length
    ? `${line} L${x(drawn[drawn.length - 1].t).toFixed(1)},${(pad.top + innerH).toFixed(1)} L${x(
        drawn[0].t,
      ).toFixed(1)},${(pad.top + innerH).toFixed(1)} Z`
    : "";

  /* Profit at any date, by walking to the month the date falls in. Events sit
     ON the line rather than on a rail beneath it: the whole point of putting
     them here is to show what the business did at the moment the line moved. */
  const profitAt = (iso: string) => {
    const t = Date.parse(`${iso}T00:00:00Z`);
    const p = points.find((q) => q.t >= t && q.profit !== null);
    /* An event before the first measured month sits on the baseline: there is
       no line there to put it on, and the date is still worth showing. */
    return p?.profit ?? 0;
  };
  const events = useMemo(
    () =>
      d.timeline
        .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date))
        .map((e) => ({
          e,
          t: Date.parse(`${e.date}T00:00:00Z`),
          v: profitAt(e.date),
        }))
        .filter((p) => p.t >= t0 - 86400000 && p.t <= t1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [d.timeline, points],
  );

  const ticks = [0, 0.5, 1].map((f) => max * f);
  /* Axis money, rounded — money() gives "$814,111" for a gridline, which reads
     as a measurement of something rather than as a scale. */
  const tick = (cents: number) => {
    const d = cents / 100;
    if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
    if (d >= 1000) return `$${Math.round(d / 1000)}K`;
    return "$0";
  };
  const fmtMonth = (key: string) =>
    new Date(`${key}-01T00:00:00Z`).toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  const card =
    hover?.kind === "event"
      ? { cx: x(events[hover.i].t), cy: y(events[hover.i].v) }
      : hover?.kind === "month"
        ? { cx: x(points[hover.i].t), cy: y(points[hover.i].profit ?? 0) }
        : null;

  return (
    <div data-chart="" data-profit-chart="" ref={wrapRef}>
      <p data-chart-legend="">
        <span data-legend-item="" data-kind="profit">
          <span data-swatch="" data-kind="profit" aria-hidden="true" /> Profit
        </span>
        <span data-legend-item="" data-kind="revenue">
          <span data-swatch="" data-kind="revenue" aria-hidden="true" /> Revenue
        </span>
        <span data-legend-item="" data-kind="ads">
          <span data-swatch="" data-kind="ads" aria-hidden="true" /> Ad spend
        </span>
        <Info label="Where this chart's numbers come from">
          <span data-info-para="">
            Revenue is <strong>measured</strong>: Amazon's own "bought in past month" badge as
            Keepa recorded it moving, read at each month end
            <Src
              id={d.salesHistory?.length ? "keepa-history" : "keepa"}
              sources={d.sources}
              go={go}
            />{" "}
            and priced at today's buy box. Profit and ad spend are computed from it{" "}
            <Src id={MODELLED} sources={d.sources} go={go} /> — cost of goods, Amazon's published
            fees and a modelled ad rate, before returns and overhead, which are set to zero. So the
            profit line is a ceiling.
          </span>
          <span data-info-para="">
            The line stops where Keepa's badge history does. Amazon only shows the badge above
            roughly 50 sales a month, so the months before it are absent rather than zero — a gap
            in the line is a month nobody measured, not a month of no sales.
          </span>
        </Info>
      </p>
      {width > 0 ? (
        <svg
          width={w}
          height={height}
          role="img"
          aria-label="Modelled monthly revenue and profit, with the events on this business's timeline"
          onMouseLeave={() => {
            overDot.current = false;
            setHover(null);
          }}
          onMouseMove={(ev) => {
            if (overDot.current) return;
            const rect = ev.currentTarget.getBoundingClientRect();
            const px = ev.clientX - rect.left;
            let best = 0;
            points.forEach((p, i) => {
              if (Math.abs(x(p.t) - px) < Math.abs(x(points[best].t) - px)) best = i;
            });
            setHover({ kind: "month", i: best });
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={w - pad.right} y1={y(t)} y2={y(t)} stroke="var(--border)" />
              <text
                x={pad.left - 8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--muted-foreground)"
              >
                {tick(t)}
              </text>
            </g>
          ))}
          {/* Largest series furthest back: revenue, then ad spend, then profit
              on top with the area under it. The gap between revenue and profit
              IS the cost stack, and drawing the smaller numbers last keeps them
              legible where the lines converge. */}
          <path
            d={revenueLine}
            data-series-revenue=""
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={adsLine}
            data-series-ads=""
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d={area} fill="var(--accent)" fillOpacity={0.08} />
          <path
            d={line}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {hover?.kind === "month" ? (
            <>
              <line
                x1={x(points[hover.i].t)}
                x2={x(points[hover.i].t)}
                y1={pad.top}
                y2={pad.top + innerH}
                stroke="var(--muted-foreground)"
                strokeOpacity={0.35}
              />
              {points[hover.i].profit === null ? null : (
                <circle
                  cx={x(points[hover.i].t)}
                  cy={y(points[hover.i].profit ?? 0)}
                  r={4}
                  fill="var(--accent)"
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              )}
            </>
          ) : null}
          {/* One dot per timeline event. Amazon events are filled and the other
              three tracks hollow — a shape difference, not a colour one, since
              colour on this site means a verification tier. */}
          {events.map((p, i) => (
            <g
              key={`${p.e.date}-${p.e.title}`}
              tabIndex={0}
              role="button"
              aria-label={`${p.e.date}: ${p.e.title}`}
              data-event-dot={String(i)}
              onMouseEnter={() => {
                overDot.current = true;
                setHover({ kind: "event", i });
              }}
              onMouseLeave={() => {
                overDot.current = false;
                setHover(null);
              }}
              onFocus={() => setHover({ kind: "event", i })}
              onBlur={() => setHover(null)}
            >
              {/* 🚨 Releasing on mouseleave matters as much as taking on
                  mouseenter: without it the event card outlived the pointer,
                  and the chart felt like it needed a click to change. Focus
                  handlers stay for keyboards and for the screenshot script. */}
              <title>{`${p.e.date} — ${p.e.title}`}</title>
              {/* A 16px invisible target. The dot is 4.5px and nobody hits a
                  4.5px dot on the first try. */}
              <circle cx={x(p.t)} cy={y(p.v)} r={16} fill="transparent" />
              <circle
                cx={x(p.t)}
                cy={y(p.v)}
                r={hover?.kind === "event" && hover.i === i ? 6 : 4.5}
                fill={p.e.track === "amazon" ? "var(--accent)" : "var(--card)"}
                stroke="var(--accent)"
                strokeWidth={2}
              />
            </g>
          ))}
          <text x={pad.left} y={height - 8} fontSize={11} fill="var(--muted-foreground)">
            {fmtMonth(points[0].key)}
          </text>
          <text
            x={w - pad.right}
            y={height - 8}
            textAnchor="end"
            fontSize={11}
            fill="var(--muted-foreground)"
          >
            {fmtMonth(points[points.length - 1].key)}
          </text>
        </svg>
      ) : null}

      {card && hover ? (
        <div
          data-chart-card=""
          data-wide={hover.kind === "event" ? "" : undefined}
          style={{
            left: Math.min(
              Math.max(8, card.cx + 12),
              Math.max(8, w - (hover.kind === "event" ? 280 : 170)),
            ),
            top: Math.max(8, card.cy - 12),
          }}
        >
          {hover.kind === "event" ? (
            <>
              <p data-card-when="" className="vm-num">
                {events[hover.i].e.date} · {TRACK_LABEL[events[hover.i].e.track]}
              </p>
              <p data-card-title="">{events[hover.i].e.title}</p>
              {events[hover.i].e.detail ? (
                <p data-card-detail="">{events[hover.i].e.detail}</p>
              ) : null}
              <p data-card-detail="">
                Modelled profit that month:{" "}
                <span className="vm-num">{money(events[hover.i].v)}</span>
                <Src id={MODELLED} sources={d.sources} go={go} />
              </p>
            </>
          ) : (
            <>
              <p data-card-when="" className="vm-num">
                {fmtMonth(points[hover.i].key)}
              </p>
              {points[hover.i].revenue === null ? (
                <p data-card-detail="">
                  No badge recorded this month — Amazon shows one only above roughly 50 sales, and
                  Keepa can only store what Amazon showed.
                </p>
              ) : (
                <>
                  <p data-card-title="" className="vm-num" data-kind="revenue">
                    {money(points[hover.i].revenue ?? 0)} revenue
                    <Src
                      id={d.salesHistory?.length ? "keepa-history" : "keepa"}
                      sources={d.sources}
                      go={go}
                    />
                  </p>
                  <p data-card-detail="" data-kind="profit">
                    <span className="vm-num">{money(points[hover.i].profit ?? 0)}</span> profit
                    <Src id={MODELLED} sources={d.sources} go={go} /> at {Math.round(net * 100)}%
                  </p>
                  <p data-card-detail="" data-kind="ads">
                    <span className="vm-num">{money(points[hover.i].ads ?? 0)}</span> ad spend
                    <Src id={MODELLED} sources={d.sources} go={go} />
                  </p>
                </>
              )}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Bars as divs, so they stay selectable and wrap on a phone. */
function RevenueBars({ asins }: { asins: DossierAsin[] }) {
  const rows = asins
    .filter((a) => a.priceCents)
    .map((a) => ({ ...a, rev: a.monthlySold * (a.priceCents as number) }))
    .sort((a, b) => b.rev - a.rev);
  const max = Math.max(...rows.map((r) => r.rev), 1);
  return (
    <ul data-bars="">
      {rows.map((r) => (
        <li key={r.asin}>
          <span data-bar-label="">{r.title}</span>
          <span data-bar-track="">
            <span data-bar-fill="" style={{ width: `${(r.rev / max) * 100}%` }} />
          </span>
          <span data-bar-value="" className="vm-num">
            {money(r.rev)}
          </span>
        </li>
      ))}
    </ul>
  );
}
