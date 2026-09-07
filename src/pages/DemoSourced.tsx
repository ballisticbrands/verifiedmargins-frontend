import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  StatTile,
  TrendChart,
  VerificationBadge,
  type TrendPoint,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DemoBanner, useDemoMeta } from "@/demo/harness";
import type { Dossier, DossierAsin } from "@/demo/dossier";
import type { SourcedDemo } from "@/demo/registry";

/**
 * /demo/<slug> for a SOURCED DOSSIER — everything public about a seller who
 * has never heard of us, with every figure naming where it came from.
 *
 * 🚧 The product has no such page, so — like `group` — there is no real page
 * this could drift from, and src/demo/README.md's third-kind rule applies: a
 * case in Demo.tsx and a component beside it.
 *
 * ── It is SHAPED like /business/<slug>, deliberately ─────────────────────
 * Same wrapper (`vm-form vm-profile`), same header (a logo in the avatar slot,
 * the name, the shared VerificationBadge), the same `Business deep-dive` block,
 * the shared `StatTile` row, the shared `TrendChart`, and the method last under
 * "How these estimates were made". A reader moving between a real business page
 * and this one should not have to re-learn what anything means, and REUSING
 * those components rather than restyling them is what stops the two drifting.
 * `.vm-dossier` adds only what a business page has no equivalent for: source
 * markers, the per-product bars, and the sources list.
 *
 * It installs no fetch seam. Every other demo answers a request the real page
 * makes; this page makes none, so a responder here would never fire and would
 * imply a backend that does not exist.
 *
 * ── The one rule this page is built around ───────────────────────────────
 * Nothing here is verified. It sits at the bottom rung of the ladder, drawn by
 * the SHARED badge rather than a local pill, so the ○/word/colour treatment is
 * the one every other page uses. No green anywhere, charts included — green
 * means verified (BRANDING.md §3.1) and this page verified nothing.
 */
export function DemoSourced({ demo }: { demo: SourcedDemo }) {
  const d = demo.dossier;
  useDemoMeta(`${d.brand} — sourced dossier — demo`);

  return (
    <Shell width="profile">
      <DemoBanner />
      <div className="vm-form vm-profile vm-dossier">
        <span data-profile-crumbs="">
          <Breadcrumbs items={[{ label: "Demo", to: "/demo" }, { label: d.brand }]} />
        </span>

        <span data-profile-who="">
          {/* The brand's own logo, in the slot a founder's face occupies —
              served from our origin, never hotlinked (the Shopify CDN URL
              carries a version query and blocks it), as with every other demo
              image. */}
          <span data-avatar="" data-business-avatar="" aria-hidden="true">
            <img src={d.logo} alt="" data-brand-logo="" />
          </span>
          <span data-profile-identity="">
            <h1>
              {d.brand}
              {/* The shared ladder, not a local copy of it. */}
              <VerificationBadge verification={{ tier: "estimated", label: "Estimated" }} />
            </h1>
            <p data-verified-count="">{d.what}</p>
            <p data-verified-count="">
              Profiled from public data ·{" "}
              <Link to="/how-verification-works">How verification works</Link>
            </p>
          </span>
        </span>

        <DeepDive dossier={d} />

        <section>
          <h2 className="vm-visually-hidden">Estimated figures</h2>
          <div data-tiles="">
            <StatTile
              label="Revenue (monthly)"
              value={d.headline.revenue}
              /* StatTile renders `hint` as visible text, not only as a
                 tooltip, so it has to earn its line — a paragraph here makes
                 the first tile twice the height of the three beside it. */
              hint="A floor — the method below says why."
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
              <SourceMark id="keepa" sources={d.sources} />, across the whole{" "}
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
              Each step is a product going live. The brand has traded since 2019, so this is not a
              company being born — it is an existing business arriving on a new channel, nearly
              all of it inside eight weeks. Its very first listing was earlier still, on{" "}
              {d.firstListed}.
            </small>
          </p>
        </section>

        <section>
          <h2>Where the revenue is</h2>
          <p>
            Monthly revenue by product. Three packs carry the business; the long tail of flavour
            5-packs barely registers. These are the {d.asins.length} largest of {d.counts.priced}{" "}
            priced products, so the bars sum to slightly less than the headline — the remainder is
            worth about $4,950 a month.
          </p>
          <RevenueBars asins={d.asins} />
        </section>

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
            <SourceMark id={d.operator.source} sources={d.sources} /> Resolved from the buy-box
            seller on the brand's best-selling products.
          </p>
        </section>

        <section>
          <h2>The half Amazon cannot see</h2>
          <p>
            This is the part that changes the reading. The brand is not new — it is new{" "}
            <em>to Amazon</em>, arriving with an audience it spent years building elsewhere.
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
                <SourceMark id={o.source} sources={d.sources} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>The products that carry it</h2>
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
                  <td className="vm-num">
                    {a.priceCents ? money(a.monthlySold * a.priceCents) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p data-src-line="">
            <SourceMark id="keepa" sources={d.sources} /> The {d.asins.length} largest of{" "}
            {d.counts.priced} priced products. "Sold / mo" is Amazon's badge, which is why every
            row reads <em>n+</em>. A row with no price has a live badge and no current offer.
          </p>
        </section>

        {/* The method LAST, in the same place and the same shape as a real
            business page's — h2, then one h3 per thing a reader might doubt. */}
        <section data-method="">
          <h2>How these estimates were made</h2>

          <h3>Nobody has asserted these figures</h3>
          <p>
            Not Amazon, not the seller — nobody at this business has spoken to us. Every number
            above was modelled from public data or read off somebody else's public page, and each
            one carries a marker to the source answerable for it.
          </p>

          <h3>Sales — Amazon's own "bought in past month"</h3>
          <p>
            Amazon prints a badge on a listing that reads "10,000+ bought in the past month". It
            is the only sales figure Amazon publishes, and{" "}
            <a href="https://keepa.com/#!api" rel="nofollow noopener" target="_blank">
              Keepa
            </a>{" "}
            records it. We read it across all {d.counts.catalogue} listings and multiplied by the
            buy box price.
          </p>
          <p>
            Two things make this a <strong>floor rather than a guess</strong>. The badge is
            bucketed, so "10,000+" is recorded as 10,000 when the truth is somewhere under 20,000.
            And Amazon only shows it above roughly 50 sales a month — the {d.counts.unbadged}{" "}
            listings below that threshold show nothing and are counted here as zero. The real
            figure is higher than the one above, not lower.
          </p>

          <h3>The operator, and where they are</h3>
          <p>
            A brand and the business running it are not the same record. We resolve the buy-box
            seller on the top listings, then read that seller's own registration — legal name,
            address, country and feedback score. It is the fastest read on what kind of business
            this is, and Amazon publishes it; we did not model it.
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
            Amazon directly, cost of goods comes from them, and the badge above stops saying
            "Estimated".
          </p>

          <h3>Sources</h3>
          <ol data-sources="">
            {d.sources.map((s, i) => (
              <li key={s.id} id={`src-${s.id}`}>
                <span data-src-n="" className="vm-num">
                  {i + 1}
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
                    <span data-muted="">read {s.read}</span>
                  </p>
                  <p data-muted="">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Shell>
  );
}

/**
 * The deep-dive block, in the shape /business/<slug> uses: a legend, prose
 * clamped to a few lines, and an Expand toggle.
 *
 * The real one FETCHES its text and gates it behind a paywall. Here the text
 * travels on the fixture and there is nothing to gate, so what the two share
 * is the presentation, not the mechanism — which is why this is a local
 * component rather than an import that would drag the lock and the offer in
 * with it.
 */
function DeepDive({ dossier }: { dossier: Dossier }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section data-deep-dive="">
      <h2 data-facts-legend="">Business deep-dive</h2>
      <p data-deep-dive-text="" data-clamped={expanded ? undefined : ""}>
        {dossier.deepDive}
      </p>
      <button type="button" data-deep-dive-toggle="" onClick={() => setExpanded((e) => !e)}>
        {expanded ? "Collapse" : "Expand"}
      </button>
    </section>
  );
}

function money(cents: number): string {
  const d = cents / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(2)}M`;
  if (d >= 1000) return `$${Math.round(d).toLocaleString()}`;
  return `$${d.toFixed(2)}`;
}

/** The superscript that ties a figure to its origin. */
function SourceMark({ id, sources }: { id: string; sources: Dossier["sources"] }) {
  const i = sources.findIndex((s) => s.id === id);
  if (i < 0) return null;
  return (
    <a data-src-mark="" href={`#src-${id}`} title={`Source: ${sources[i].label}`}>
      {i + 1}
    </a>
  );
}

/**
 * Catalogue size over time, through the SHARED TrendChart — the same chart a
 * real business page plots revenue on.
 *
 * It counts LISTINGS, not revenue, and that is the honest choice rather than a
 * timid one. `monthlySold` is a reading taken today, so plotting it against
 * each product's launch date would draw a revenue history nobody ever
 * measured. What we genuinely know per date is that a product went live.
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

/**
 * Revenue by product — bars as divs rather than SVG, so they stay selectable
 * and wrap on a phone. The time series above earns SVG; a labelled list of
 * quantities does not.
 */
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
