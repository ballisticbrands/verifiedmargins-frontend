import { useBrand } from "@ballisticbrands/frontend-shared";
import { Link } from "react-router-dom";
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
 * It uses no fetch seam. Every other demo answers a request the real page
 * makes; this page makes none, so wiring `useDemoFetch` here would install a
 * responder that never fires and imply a backend that does not exist.
 *
 * ── The one rule this page is built around ───────────────────────────────
 * Nothing here is verified. It sits at the bottom rung of the ladder
 * (BRANDING.md section 5): ○, the word, `--unverified`. The claim strip sits
 * ABOVE the numbers rather than under them, because a reader who scrolls to a
 * $1.58M tile and meets the caveat afterwards has already believed it.
 *
 * No green anywhere, including the charts — green on this site means verified
 * (BRANDING.md section 3.1), and this page verified nothing.
 */
export function DemoSourced({ demo }: { demo: SourcedDemo }) {
  const brand = useBrand();
  const d = demo.dossier;
  useDemoMeta(`${d.brand} — sourced dossier — demo — ${brand.displayName}`);

  return (
    <Shell width="wide">
      <DemoBanner />
      <div className="vm-form vm-dossier">
        <Breadcrumbs
          items={[
            { label: brand.displayName, to: "/" },
            { label: "Demo", to: "/demo" },
            { label: d.brand },
          ]}
        />

        <header data-dossier-head="">
          <h1>{d.brand}</h1>
          {/* Shape + word + colour, all three — never colour alone. */}
          <p data-tier="">
            <span data-tier-pill="">
              <span aria-hidden="true">○</span> Estimated
            </span>
            <Link to="/how-verification-works">How verification works</Link>
          </p>
          <p data-what="">{d.what}</p>
          <p data-standfirst="">{d.standfirst}</p>
        </header>

        {/* The caveat before the numbers, not after them. */}
        <section data-claim="">
          <h2>Nobody has asserted these figures</h2>
          <p>
            Not Amazon, not the seller. Every number below was modelled from public data or read
            off somebody else's public page, and each one carries a marker to the source it came
            from. Revenue is a <strong>floor</strong>: Amazon publishes its "bought in past month"
            badge in brackets and only above roughly 50 a month, so each badged product is counted
            at the bottom of its bracket and the {d.counts.unbadged} unbadged ones of{" "}
            {d.counts.catalogue} are counted as zero.
          </p>
        </section>

        <section>
          <h2>What the numbers say</h2>
          <ul data-tiles="">
            {d.figures.map((f) => (
              <li key={f.label} data-flag={f.flag ? "" : undefined}>
                <span data-tile-label="">{f.label}</span>
                <span data-tile-value="" className="vm-num">
                  {f.value}
                </span>
                {f.note ? <span data-tile-note="">{f.note}</span> : null}
                <SourceMark id={f.source} sources={d.sources} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Where the revenue is</h2>
          <p>
            Monthly revenue by product, from <code>monthlySold × buy box price</code>. Three
            packs carry the business; the long tail of flavour 5-packs barely registers. These are
            the {d.asins.length} largest of {d.counts.priced} priced products, so the bars sum to
            slightly less than the headline — the remainder is worth about $4,950 a month.
          </p>
          <RevenueChart asins={d.asins} />
        </section>

        <section>
          <h2>When the catalogue arrived</h2>
          <p>
            Products first listed on Amazon, by month, for the {d.asins.length} shown below. The
            brand has traded since 2019 — this is not a company being born, it is an existing
            business arriving on a new channel, almost all of it inside eight weeks. Its very
            first listing was earlier still, on {d.firstListed}, and sits outside this window.
          </p>
          <ListingTimeline asins={d.asins} />
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

        <section>
          <h2>What we do not know</h2>
          <ul data-gaps="">
            {d.gaps.map((g) => (
              <li key={g.slice(0, 24)}>{g}</li>
            ))}
          </ul>
        </section>

        <section data-sources="">
          <h2>Sources</h2>
          <ol>
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
  const s = sources[i];
  return (
    <a data-src-mark="" href={`#src-${id}`} title={`Source: ${s.label}`}>
      {i + 1}
    </a>
  );
}

/**
 * Revenue by product — horizontal bars, drawn as divs rather than SVG.
 *
 * A bar chart is a list of labelled quantities, and as divs it stays
 * selectable, wraps on a phone and needs no viewBox arithmetic. SVG is for
 * the timeline below, where the x-axis is continuous and actually earns it.
 */
function RevenueChart({ asins }: { asins: DossierAsin[] }) {
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

/**
 * Products first listed, by month.
 *
 * Deliberately counts ASINs, not revenue: the point is the SHAPE of the
 * arrival — a catalogue dropped onto Amazon in one burst — and revenue per
 * month of listing would say something else entirely.
 */
function ListingTimeline({ asins }: { asins: DossierAsin[] }) {
  const byMonth = new Map<string, number>();
  for (const a of asins) {
    const m = a.listed.slice(0, 7);
    byMonth.set(m, (byMonth.get(m) ?? 0) + 1);
  }
  const months = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...months.map(([, n]) => n), 1);
  const W = 640;
  const H = 160;
  /* t leaves room for the count ABOVE the tallest bar. At t:8 that label sat
     at y=3 and was clipped by the viewBox edge — the biggest month was the one
     month whose number you could not read. */
  const pad = { l: 28, r: 8, t: 22, b: 28 };
  const bw = (W - pad.l - pad.r) / months.length;

  return (
    <svg
      data-timeline=""
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={months.map(([m, n]) => `${m}: ${n} products`).join("; ")}
    >
      {/* Baseline only. No gridlines: five bars do not need a lattice. */}
      <line
        x1={pad.l}
        y1={H - pad.b}
        x2={W - pad.r}
        y2={H - pad.b}
        stroke="var(--border)"
        strokeWidth="1"
      />
      {months.map(([m, n], i) => {
        const h = ((H - pad.t - pad.b) * n) / max;
        const x = pad.l + i * bw;
        return (
          <g key={m}>
            <rect
              x={x + bw * 0.18}
              y={H - pad.b - h}
              width={bw * 0.64}
              height={h}
              fill="var(--foreground)"
            />
            <text
              x={x + bw / 2}
              y={H - pad.b - h - 5}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="var(--foreground)"
            >
              {n}
            </text>
            <text
              x={x + bw / 2}
              y={H - 9}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="var(--muted-foreground)"
            >
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
