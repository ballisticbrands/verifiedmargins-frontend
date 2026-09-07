import { useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  StatTile,
  TrendChart,
  VerificationBadge,
  type TrendPoint,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DemoBanner, useDemoMeta } from "@/demo/harness";
import { INVENTED, type Dossier, type DossierAsin, type TimelineEvent } from "@/demo/dossier";
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

export function DemoSourced({ demo }: { demo: SourcedDemo }) {
  const d = demo.dossier;
  useDemoMeta(`${d.brand} — sourced dossier — demo`);

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
      <DemoBanner />
      <div className="vm-form vm-profile vm-dossier">
        <span data-profile-crumbs="">
          <Breadcrumbs items={[{ label: "Demo", to: "/demo" }, { label: d.brand }]} />
        </span>

        <span data-profile-who="">
          {/* The brand's own logo, in the slot a founder's face occupies —
              served from our origin, never hotlinked. */}
          <span data-avatar="" data-business-avatar="" aria-hidden="true">
            <img src={d.logo} alt="" data-brand-logo="" />
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
  const invented = id === INVENTED;
  return (
    <button
      type="button"
      data-src-mark=""
      data-invented={invented ? "" : undefined}
      title={invented ? "Invented for this demo — nobody measured it" : `Source: ${sources[i].label}`}
      onClick={() => go("sources")}
    >
      {invented ? "*" : i + 1}
    </button>
  );
}

/** Shown at the top of every tab whose figures are made up. */
function InventedNotice({ what, go }: { what: string; go: Go }) {
  return (
    <p data-invented-notice="">
      🚧 <strong>Demo placeholder.</strong> {what} Nobody measured any figure on this tab — every
      one carries a <span data-invented-star="">*</span>. See{" "}
      <button type="button" data-linklike="" onClick={() => go("sources")}>
        Sources
      </button>
      .
    </p>
  );
}

function money(cents: number): string {
  const d = cents / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(2)}M`;
  if (d >= 1000) return `$${Math.round(d).toLocaleString()}`;
  return `$${d.toFixed(2)}`;
}

/* ────────────────────────────────────────────────────────────────── tabs */

function Overview({ d, go }: { d: Dossier; go: Go }) {
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
        <div data-tiles="">
          <StatTile
            label="Revenue (monthly)"
            value={d.headline.revenue}
            hint="A floor — the deep-dive says why."
          />
          <StatTile label="Units (monthly)" value={d.headline.units} />
          <StatTile label="Avg selling price" value={d.headline.asp} />
          <StatTile
            label="Catalogue"
            value={d.headline.catalogue}
            hint={`${d.counts.priced} of ${d.counts.catalogue} are priced and selling.`}
          />
        </div>
        <p data-chart-label="">
          <small>
            Revenue, units and price from Keepa
            <Src id="keepa" sources={d.sources} go={go} />, across the whole{" "}
            {d.counts.catalogue}-product catalogue.
          </small>
        </p>

        <p data-chart-label="">
          <small>Products live on Amazon, cumulative</small>
        </p>
        <div data-chart="">
          <CatalogueChart asins={d.asins} />
        </div>
        <p data-chart-label="">
          <small>
            Each step is a product going live — nearly the whole catalogue inside eight weeks. The
            brand itself has traded since 2019; see the{" "}
            <button type="button" data-linklike="" onClick={() => go("timeline")}>
              timeline
            </button>
            .
          </small>
        </p>
      </section>

      <section>
        <h2>Where the revenue is</h2>
        <RevenueBars asins={d.asins} />
        <p data-src-line="">
          <Src id="keepa" sources={d.sources} go={go} /> The {d.asins.length} largest of{" "}
          {d.counts.priced} priced products.{" "}
          <button type="button" data-linklike="" onClick={() => go("sales")}>
            Full sales breakdown
          </button>
          .
        </p>
      </section>

      <Operator d={d} go={go} />
    </>
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
        <div>
          <dt>Registered address</dt>
          <dd>
            {d.operator.address.join(", ")} · {d.operator.country}
          </dd>
        </div>
        <div>
          <dt>Seller feedback</dt>
          <dd>
            <span className="vm-num">{d.operator.feedback}</span>{" "}
            <span data-muted="">— poor, for a business this size</span>
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
function Timeline({ d, go }: { d: Dossier; go: Go }) {
  const TRACK: Record<TimelineEvent["track"], string> = {
    brand: "Brand",
    amazon: "Amazon",
    ads: "Advertising",
    web: "Web",
  };
  return (
    <section>
      <h2>How this business got here</h2>
      <p>
        Oldest first. The strands are kept together on one line on purpose: four years of building
        an audience elsewhere, a lone Amazon listing that goes nowhere for ten months, and then the
        catalogue and the ad spend arriving in the same eight weeks.
      </p>
      <ol data-timeline="">
        {d.timeline.map((e) => (
          <li key={`${e.date}-${e.title}`} data-track={e.track}>
            <span data-when="" className="vm-num">
              {e.date}
            </span>
            <span data-dot="" aria-hidden="true" />
            <span data-what="">
              <span data-track-tag="">{TRACK[e.track]}</span>
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
        Monthly revenue by product, from <code>monthlySold × buy box price</code>. Three packs carry
        the business; the long tail of single-flavour 5-packs barely registers. These are the{" "}
        {d.asins.length} largest of {d.counts.priced} priced products, so the bars sum to slightly
        less than the headline — the remainder is worth about $4,950 a month.
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
        why every row reads <em>n+</em>. A row with no price has a live badge and no current offer —
        it sells, and it is out of stock.
      </p>
    </section>
  );
}

function Sourcing({ d, go }: { d: Dossier; go: Go }) {
  return (
    <section>
      <h2>Product sourcing</h2>
      <InventedNotice
        what="What a unit costs to make and to land is the number this product refuses to guess, so nothing here is a real quote."
        go={go}
      />
      <p>
        Cost of goods is the one figure that turns revenue into margin, and it is the one nobody
        publishes. The intended pipeline prices it the way a buyer would: a manufacturing quote and
        a freight quote, each from a named source a reader can go and check.
      </p>
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
      <p data-src-line="">
        On a site called VerifiedMargins, a margin nobody measured is the one number that must never
        be guessed — which is why these are marked rather than quietly totalled into a profit figure.
      </p>
    </section>
  );
}

function Advertising({ d, go }: { d: Dossier; go: Go }) {
  const meta = d.advertising.find((a) => a.href);
  return (
    <section>
      <h2>Advertising</h2>
      <InventedNotice
        what="No public source reports a competitor's ad spend on any of these channels."
        go={go}
      />
      <p>
        The one genuinely public thing here is Meta's ad library, which publishes every ad a page is
        running along with its creative and run dates. It does <em>not</em> publish spend, and
        Amazon publishes nothing at all — so a spend figure is always somebody's model, including
        ours.
      </p>
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
      <p>
        The half Amazon cannot see. The brand is not new — it is new <em>to Amazon</em>, arriving
        with an audience it spent years building elsewhere, and that is the single most useful thing
        on this page.
      </p>
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

      <h3>Search presence</h3>
      <InventedNotice what="Ranks and search volumes are placeholders." go={go} />
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
        Not Amazon, not the seller — nobody at this business has spoken to us. Every number on this
        page was modelled from public data, read off somebody else's public page, or (on three tabs)
        invented outright and marked. Each one carries a marker to the source answerable for it.
      </p>

      <h3>Sales — Amazon's own "bought in past month"</h3>
      <p>
        Amazon prints a badge on a listing that reads "10,000+ bought in the past month". It is the
        only sales figure Amazon publishes, and{" "}
        <a href="https://keepa.com/#!api" rel="nofollow noopener" target="_blank">
          Keepa
        </a>{" "}
        records it. We read it across all {d.counts.catalogue} listings and multiplied by the buy box
        price.
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
        A brand and the business running it are not the same record. We resolve the buy-box seller on
        the top listings, then read that seller's own registration — legal name, address, country and
        feedback score. Amazon publishes it; we did not model it.
      </p>

      <h3>What is not here</h3>
      <ul data-gaps="">
        {d.gaps.map((g) => (
          <li key={g.slice(0, 24)}>{g}</li>
        ))}
      </ul>

      <h3>What would replace all of this</h3>
      <p>
        One thing: the seller connecting their Amazon account. Then revenue and fees come from Amazon
        directly, cost of goods comes from them, and the badge at the top stops saying "Estimated".
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
        Every figure on this page points at one of these. A numbered marker means somebody published
        it and we read it; a <span data-invented-star="">*</span> means we made it up for the demo.
      </p>
      <ol data-sources="">
        {d.sources.map((s, i) => (
          <li key={s.id} id={`src-${s.id}`} data-invented={s.id === INVENTED ? "" : undefined}>
            <span data-src-n="" className="vm-num">
              {s.id === INVENTED ? "*" : i + 1}
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

/**
 * Catalogue size over time, through the SHARED TrendChart.
 *
 * It counts LISTINGS, not revenue, and that is the honest choice rather than a
 * timid one: `monthlySold` is a reading taken today, so plotting it against
 * each product's launch date would draw a revenue history nobody ever measured.
 */
function CatalogueChart({ asins }: { asins: DossierAsin[] }) {
  const points = useMemo<TrendPoint[]>(() => {
    const dates = [...asins].sort((a, b) => a.listed.localeCompare(b.listed));
    let n = 0;
    return dates.map((a) => ({ date: a.listed, value: ++n }));
  }, [asins]);
  return (
    <TrendChart
      points={points}
      label="Products live"
      format={(v) => (v == null ? "—" : `${v} live`)}
      formatDate={(iso) =>
        new Date(iso).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
      }
    />
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
