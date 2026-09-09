import { useEffect } from "react";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Reference page for the three attributes that describe HOW a business is
 * built, as opposed to what it earns: sourcing, catalogue structure and
 * differentiation.
 *
 * ── Why it exists ────────────────────────────────────────────────────────
 * Each of the three appears on a business page as two or three words —
 * "Private label", "Broad catalogue, low volume each", "Level 3". Those are
 * the ends of definitions, and a buyer comparing two listings needs the
 * definitions themselves: whether "wholesale" here means the same thing it
 * means on a broker's site, and what separates a level 3 product from a level
 * 4 one. The tooltips carry a sentence each; this page carries the rest, with
 * the worked examples.
 *
 * 🚨 The wording is the SPEC's own, from Attributes-per-business. It is also
 * the wording a seller reads when answering, and the wording an operator
 * applies when setting a differentiation level. One definition, three
 * audiences — the moment the page paraphrases it, the three drift apart and
 * the attribute stops meaning one thing.
 *
 * 🚨 Also in PUBLIC_PAGES (src/data/site.mjs) so the build emits a static stub
 * and GitHub Pages answers 200, and in the backend's RESERVED_USERNAMES so no
 * seller can claim "business-attributes" and shadow it through the
 * /:username catch-all.
 *
 * ── The figures ──────────────────────────────────────────────────────────
 * Four of them, and each one carries an argument the prose was making badly:
 *
 *   • `SameNumbers` — the intro's claim, drawn. Two panels with the SAME
 *     revenue figure and the SAME line, told apart only by the three
 *     attributes underneath. It is the reason the page exists, and it was a
 *     sentence a reader could skim past.
 *   • `SOURCING_MATRIX` — what actually transfers in a sale. Four columns,
 *     read off the definitions beside it and nothing more (see the note on
 *     the constant: it asserts nothing the paragraphs do not).
 *   • `CatalogueShape` — the six catalogue structures are six SHAPES of
 *     revenue distribution, which is a picture, not a paragraph. Broad vs
 *     dominance is one glance as a chart and two careful readings as prose.
 *   • `DiffLadder` + the decision flow — the ladder's stated principle is
 *     that complexity, cost and time make a product defensible. That is two
 *     axes, so it gets two axes.
 *
 * 🚨 EVERY FIGURE IS INK AND GREY (BRANDING.md §3.1). Green means verified
 * and nothing else, and none of these charts is about verification — a
 * catalogue shape is not a claim we checked. The bars distinguish themselves
 * by height, grouping and fill, which is also what keeps them legible in a
 * greyscale screenshot, which is how most of this site gets seen.
 *
 * 🚨 Illustrations, not data. The figures in `SameNumbers` are invented and
 * belong to no business; they exist to be identical to each other. Nothing
 * here reads a fixture, and nothing here should ever be given a real seller's
 * numbers — a specimen that names a business is a claim about that business.
 */
export function BusinessAttributes() {
  const brand = useBrand();

  useEffect(() => {
    document.title = `Business attributes — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Business attributes</h1>

      {/* `vm-prose` caps sentences at 70ch (BRANDING.md §4.1) without capping
          the figures, which want the whole 52rem column. */}
      <div className="vm-attrs vm-prose mt-6 space-y-10 text-sm leading-relaxed">
        <section>
          <p>
            Every business page carries three attributes describing how the
            business is <em>built</em>, alongside the figures describing what it
            earns: <strong>sourcing</strong>, <strong>catalogue structure</strong>{" "}
            and <strong>differentiation</strong>. None of the three can be read off an
            account — all three are answered by the seller, in the
            questionnaire.
          </p>
          <p className="mt-3">
            They matter because two businesses with identical revenue can be
            worth very different amounts. A private-label brand with tooling
            nobody can copy and a retail-arbitrage account with the same monthly
            profit are not the same asset, and the difference is not visible in
            the numbers.
          </p>

          <SameNumbers />

          {/* Plain in-page anchors, not router links: react-router would treat
              a hash-only <Link> as a navigation and remount the page. */}
          <nav data-toc="" aria-label="On this page">
            <p data-toc-title="">On this page</p>
            <ol>
              {TOC.map(({ href, label, note }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                  <span data-toc-note="">{note}</span>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* ── Sourcing ─────────────────────────────────────────────────── */}
        <section>
          <h2 id="sourcing" className="text-xl font-bold tracking-tight">
            Sourcing
          </h2>
          <p data-derivation="" data-by-hand="">Answered by the seller</p>
          <p data-range="">
            Scored from <b>+0.30</b> for private label down to <b>−0.60</b> for
            Merch on Demand. Every method carries a value, shown against it below.
          </p>
          <p className="mt-2">
            How the business gets its product — the single method most of its
            revenue comes from. It is the strongest signal of what actually
            transfers in a sale: a brand you own conveys to a buyer, a knack for
            finding discounted stock does not.
          </p>
          <p className="mt-2 text-[13px] text-[var(--muted-foreground)]">
            Named by the seller as the single method most of the revenue comes
            from. The connected account shows the catalogue and the brand
            records attached to it, but not how the stock was bought.
          </p>
          <dl className="mt-4 space-y-3">
            {SOURCING.map(({ term, def, delta }) => (
              <div key={term}>
                <dt className="font-semibold" data-term="">
                  <span>{term}</span>
                  <Score delta={delta} />
                </dt>
                <dd className="mt-0.5">{def}</dd>
              </div>
            ))}
          </dl>

          <SourcingMatrix />
        </section>

        {/* ── Catalogue ────────────────────────────────────────────────── */}
        <section>
          <h2 id="catalogue" className="text-xl font-bold tracking-tight">
            Catalogue structure
          </h2>
          <p data-derivation="" data-by-hand="">Answered by the seller</p>
          <p data-range="">
            Scored from <b>+0.30</b> for category dominance down to{" "}
            <b>−0.30</b> for a trend-driven catalogue. Six shapes, each with a
            value below.
          </p>
          <p className="mt-2">
            The shape of the catalogue: whether revenue rests on one product, a
            handful, a long tail of variations, or a portfolio with no anchor. It
            tells a buyer what running the business involves day to day, and
            where it breaks if a single listing stalls.
          </p>
          <p className="mt-2 text-[13px] text-[var(--muted-foreground)]">
            Chosen by the seller from six shapes, describing how revenue is
            spread across the catalogue rather than how many listings there
            are.
          </p>

          {/* The definitions and their shapes, one row each: the chart is the
              first thing scanned and the paragraph is what confirms it. */}
          <dl className="mt-5" data-catalogue="">
            {CATALOGUE.map((entry) => (
              <div key={entry.term}>
                <CatalogueShape entry={entry} />
                <div>
                  <dt className="font-semibold" data-term="">
                    <span>{entry.term}</span>
                    <Score delta={entry.delta} />
                  </dt>
                  <dd className="mt-0.5">
                    {entry.def}
                    <br />
                    <em className="text-[var(--muted-foreground)]">Example: {entry.eg}</em>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <p data-figure-note="">
            Each chart is one business's revenue split across its catalogue —
            one bar per product, tallest first. Trend / seasonal churn is the
            exception and runs along months rather than products, because
            turnover is the thing that defines it.
          </p>
        </section>

        {/* ── Differentiation ──────────────────────────────────────────── */}
        <section>
          <h2 id="differentiation" className="text-xl font-bold tracking-tight">
            Differentiation
          </h2>
          <p data-derivation="" data-by-hand="">
            Answered by the seller
          </p>
          <p data-range="">
            Scored from <b>+0.70</b> at level 4 down to <b>−0.40</b> at level 1 —
            the widest range of the three, and level 4 is the single largest
            positive in the whole model. The steps are uneven on purpose: the
            jump from level 2 to level 3 (0.55) is larger than the one from 3 to
            4 (0.25), because level 3 is where a rival can no longer order the
            identical item from the same factory.
          </p>
          <p className="mt-2">
            How hard the product is for a competitor to copy. The principle
            behind the ladder is that{" "}
            <strong>complexity, cost and time spent make a product defensible</strong>{" "}
            — and that the uniqueness has to be visible to the customer and worth
            something to them. A difference nobody can see is not
            differentiation.
          </p>

          <DiffLadder />

          <p className="mt-4 text-[13px] text-[var(--muted-foreground)]">
            Like the other two, this one is answered rather than read — but it
            is the one that takes someone looking at the actual product against
            the generic version of it. It is a factual checklist rather than a
            rating: the questions below are answered in order, and the level is
            the first one that gets a yes.
          </p>
          <ol className="mt-4 space-y-3">
            {LEVELS.map(({ term, def, eg, delta }) => (
              <li key={term}>
                <p className="font-semibold" data-term="">
                  <span>{term}</span>
                  <Score delta={delta} />
                </p>
                <p className="mt-0.5">
                  {def}
                  <br />
                  <em className="text-[var(--muted-foreground)]">Example: {eg}</em>
                </p>
              </li>
            ))}
          </ol>

          <h3 className="mt-6 text-sm font-semibold">How the level is decided</h3>
          <DiffFlow />
          <p className="mt-3 text-[13px] text-[var(--muted-foreground)]">
            Most successful Amazon products land at level 2 or 3. A level 1
            product is not a bad business — plenty of them earn well — but it is
            one a competitor can stand up quickly, and that is a fact a buyer is
            entitled to before they pay for it.
          </p>
        </section>

        <section>
          <h2 id="where" className="text-xl font-bold tracking-tight">
            Where these appear
          </h2>
          <p className="mt-2">
            All three sit under <strong>Additional metrics</strong> on a business
            page. All three are only available for a business whose seller has
            completed the questionnaire — there is no way to establish any of
            them from a connected account or a public listing, so a business
            without answers shows a question mark rather than a guess.
          </p>

          <WhereTheyAppear />
        </section>
      </div>
    </Shell>
  );
}

/* ══ The figures ═══════════════════════════════════════════════════════ */

/**
 * The intro's argument, drawn: same revenue, same shape, different asset.
 *
 * 🚨 THE TWO PANELS ARE DELIBERATELY IDENTICAL above the divider — same
 * figure, same path data, same label. The moment one line is drawn healthier
 * than the other, the picture is arguing that you CAN see the difference in
 * the numbers, which is the opposite of what the paragraph above it says.
 * Both panels therefore read `SPARK`, one constant, rather than two paths that
 * somebody will later "improve" apart.
 */
function SameNumbers() {
  return (
    <figure data-same="">
      <div data-same-panels="">
        {SAME_NUMBERS.map((side) => (
          <div key={side.key} data-same-panel="">
            <p data-same-label="">REVENUE · LAST 12 MONTHS</p>
            <p data-same-figure="">$1.2M</p>
            <svg viewBox="0 0 260 54" aria-hidden="true">
              <line x1="0" y1="46" x2="260" y2="46" data-axis="" />
              <path d={SPARK} data-series="" />
            </svg>
            <ul data-same-attrs="">
              {side.attrs.map(([label, value]) => (
                <li key={label}>
                  <span data-attr-label="">{label}</span>
                  <span data-attr-value="">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figcaption>
        Two businesses, one figure. Everything a revenue chart can tell you
        about these two is the same; everything that decides what they are
        worth is underneath it.
      </figcaption>
    </figure>
  );
}

/** One path, both panels. See the note on `SameNumbers`. */
const SPARK =
  "M4 40 L25 36 L46 39 L67 30 L88 33 L109 25 L130 28 L151 19 L172 22 L193 13 L214 17 L235 8";

const SAME_NUMBERS = [
  {
    key: "built",
    attrs: [
      ["Sourcing", "Private label"],
      ["Catalogue", "Concentrated bets, few SKUs"],
      ["Differentiation", "Level 4 — hard to copy"],
    ],
  },
  {
    key: "bought",
    attrs: [
      ["Sourcing", "Arbitrage"],
      ["Catalogue", "Generalist portfolio"],
      ["Differentiation", "Level 1 — standard product"],
    ],
  },
] as const;

/**
 * What transfers with the business, per sourcing method.
 *
 * 🚨 THE TABLE ASSERTS NOTHING THE DEFINITIONS DO NOT. Every cell is read off
 * the paragraph above it — "Nobody else sells the identical listing" is the
 * sole-seller ✓ for private label, "Other sellers can list the same product"
 * is the ✗ for wholesale, "never holds inventory" is the ✗ for dropship, and
 * so on. Four columns rather than the six that were tempting, because the two
 * that were dropped (who sets the price, who owns the customer) are answered
 * by the spec for two methods and guessed for the other six. A summary that
 * has to guess is no longer a summary of anything.
 *
 * ● and ○ carry a word for screen readers and are told apart by SHAPE, not
 * fill alone — the same discipline the verification ladder is held to
 * (BRANDING.md §5), and the reason this survives a greyscale screenshot.
 */
function SourcingMatrix() {
  return (
    <figure data-matrix="">
      <figcaption data-figure-title="">What transfers with the sale</figcaption>
      <div data-scroll="">
        <table>
          <thead>
            <tr>
              <th scope="col">Sourcing</th>
              {MATRIX_COLUMNS.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOURCING_MATRIX.map(({ term, cells }) => (
              <tr key={term}>
                <th scope="row">{term}</th>
                {cells.map((yes, i) => (
                  <td key={MATRIX_COLUMNS[i]} data-yes={yes ? "" : undefined}>
                    <span aria-hidden="true">{yes ? "●" : "○"}</span>
                    <span className="vm-visually-hidden">{yes ? "Yes" : "No"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p data-figure-note="">
        Read off the definitions above — a filled dot is something the
        definition says the seller holds. The more of a row is filled, the more
        of the business is an asset rather than an activity.
      </p>
    </figure>
  );
}

const MATRIX_COLUMNS = [
  "Own brand",
  "Controls the spec",
  "Holds the stock",
  "Only seller of the listing",
] as const;

const SOURCING_MATRIX: Array<{ term: string; cells: [boolean, boolean, boolean, boolean] }> = [
  { term: "Private label", cells: [true, true, true, true] },
  { term: "Wholesale", cells: [false, false, true, false] },
  { term: "Dropship", cells: [false, false, false, false] },
  { term: "Arbitrage", cells: [false, false, true, false] },
  { term: "Handmade / artisan", cells: [true, true, true, true] },
  { term: "Print on demand", cells: [true, true, false, true] },
  { term: "Amazon Merch on Demand", cells: [true, true, false, true] },
  { term: "Amazon KDP", cells: [true, true, false, true] },
];

/**
 * One catalogue structure, as the shape of its revenue.
 *
 * Bars are a business's products, tallest first — so "broad catalogue" is a
 * flat run of short bars and "flagship" is a cliff, and the difference is one
 * glance rather than two paragraphs. `groups` draws the brackets underneath
 * that separate categories, which is the ONLY thing distinguishing category
 * dominance from a generalist portfolio: both are a spread of mid-sized
 * products, and whether they sit inside one category or three is the whole
 * distinction the definitions are drawing.
 *
 * Churn renders as humps over months instead, because it is the one structure
 * defined by time rather than by spread — a ranked bar chart of it would look
 * exactly like one of the others and teach the reader something false.
 */
function CatalogueShape({ entry }: { entry: CatalogueEntry }) {
  const { bars, groups, humps, axis, alt } = entry;
  const W = 210;
  const BASE = 46;

  return (
    <div data-shape="">
      <svg viewBox={`0 0 ${W} 62`} role="img" aria-label={alt}>
        <line x1="0" y1={BASE} x2={W} y2={BASE} data-axis="" />

        {humps
          ? humps.map(([cx, w, h], i) => (
              <path key={i} d={humpPath(cx, w, h, BASE)} data-hump="" />
            ))
          : layoutBars(bars ?? [], groups, W).map(({ x, w, h }, i) => (
              <rect key={i} x={x} y={BASE - h} width={w} height={h} data-bar="" />
            ))}

        {/* Brackets sit BELOW the axis so they read as a grouping of the bars
            rather than as another series. */}
        {groups
          ? bracketSpans(bars ?? [], groups, W).map(([x0, x1], i) => (
              <path key={i} d={`M${x0} 51 v4 h${x1 - x0} v-4`} data-bracket="" />
            ))
          : null}
      </svg>
      <p data-shape-axis="">{axis}</p>
    </div>
  );
}

/** Bar geometry: even slots across the width, with a wider gap between groups. */
function layoutBars(bars: readonly number[], groups: readonly number[] | undefined, W: number) {
  const sizes = groups ? [...groups] : [bars.length];
  const GROUP_GAP = 9;
  const inner = W - GROUP_GAP * (sizes.length - 1);
  const slot = inner / bars.length;
  const w = Math.max(1.5, slot * 0.62);

  const out: Array<{ x: number; w: number; h: number }> = [];
  let i = 0;
  let x = 0;
  for (const size of sizes) {
    for (let k = 0; k < size; k += 1, i += 1) {
      out.push({ x: x + (slot - w) / 2, w, h: Math.max(1.5, bars[i] * 40) });
      x += slot;
    }
    x += GROUP_GAP;
  }
  return out;
}

/** The x-extent of each group, for the brackets under the axis. */
function bracketSpans(bars: readonly number[], groups: readonly number[], W: number) {
  const laid = layoutBars(bars, groups, W);
  const spans: Array<[number, number]> = [];
  let i = 0;
  for (const size of groups) {
    const first = laid[i];
    const last = laid[i + size - 1];
    spans.push([first.x - 1, last.x + last.w + 1]);
    i += size;
  }
  return spans;
}

/** A season: up, over, and gone again. */
function humpPath(cx: number, w: number, h: number, base: number) {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  return [
    `M${x0} ${base}`,
    `C ${x0 + w * 0.28} ${base} ${cx - w * 0.2} ${base - h} ${cx} ${base - h}`,
    `C ${cx + w * 0.2} ${base - h} ${x1 - w * 0.28} ${base} ${x1} ${base}`,
    "Z",
  ].join(" ");
}

/**
 * The ladder as the two axes it is actually describing.
 *
 * The paragraph above it states the principle — complexity, cost and time
 * spent make a product defensible — which is an x and a y, so it is drawn as
 * an x and a y. The steps rise faster than they widen on purpose: the spec's
 * own examples put days between level 1 and 2 and a commissioned mould
 * between 3 and 4, so an evenly-stepped staircase would flatten the one part
 * of the ladder that carries value.
 */
function DiffLadder() {
  const BASE = 128;
  const X0 = 30;
  const STEP_W = 108;
  /* 🚨 The tallest step tops out at 92 against a 128 baseline, which leaves
     the 36px of headroom the two label lines need. Raise a height and the
     level-4 label leaves the canvas silently — SVG does not clip loudly. */
  const heights = [16, 36, 62, 92];

  return (
    <figure data-ladder="">
      <svg
        viewBox="0 0 470 168"
        role="img"
        aria-label="A staircase of four steps rising left to right: level 1 standard product, level 2 cosmetic variation, level 3 functional customisation, level 4 hard to copy. The vertical axis is how hard the product is to copy; the horizontal axis is the complexity, cost and time it takes to produce."
      >
        <line x1={X0 - 8} y1={BASE} x2="466" y2={BASE} data-axis="" />
        <line x1={X0 - 8} y1="8" x2={X0 - 8} y2={BASE} data-axis="" />

        {heights.map((h, i) => (
          <g key={i} data-step="" data-level={i + 1}>
            <rect x={X0 + i * STEP_W} y={BASE - h} width={STEP_W - 6} height={h} />
            <text x={X0 + i * STEP_W + (STEP_W - 6) / 2} y={BASE - h - 16} data-step-level="">
              {`Level ${i + 1}`}
            </text>
            <text x={X0 + i * STEP_W + (STEP_W - 6) / 2} y={BASE - h - 5} data-step-name="">
              {LADDER_NAMES[i]}
            </text>
          </g>
        ))}

        <text x={X0 - 14} y={BASE - 4} data-axis-label="" transform={`rotate(-90 ${X0 - 14} ${BASE - 4})`}>
          Harder to copy →
        </text>
        <text x={X0 - 8} y={BASE + 16} data-axis-label="">
          More complexity, cost and time to produce →
        </text>
      </svg>
    </figure>
  );
}

const LADDER_NAMES = ["standard", "cosmetic", "functional", "custom + IP"] as const;

/**
 * The checklist, as the flow it is.
 *
 * 🚨 THE QUESTIONS ARE VERBATIM. This replaced a numbered list, and the
 * temptation when a question goes into a box is to trim it to fit — but this
 * is the wording an operator applies when they set a level, and a shorter
 * version on the public page is a second, looser test that a reader can hold
 * us to. The boxes grow instead.
 *
 * Answered in order, first yes wins: the "no" edge is the spine down the left
 * and the "yes" edge steps out to a level, which is the same shape the
 * sentence has.
 */
function DiffFlow() {
  return (
    <ol data-flow="">
      {DECISION.map(({ q, level }) => (
        <li key={level}>
          <p data-flow-q="">{q}</p>
          <p data-flow-yes="">
            Yes <span aria-hidden="true">→</span> <b>{level}</b>
          </p>
        </li>
      ))}
      <li data-flow-end="">
        <p data-flow-q="">No to all three.</p>
        <p data-flow-yes="">
          <span aria-hidden="true">→</span> <b>level 1</b>
        </p>
      </li>
    </ol>
  );
}

const DECISION = [
  {
    q: "Does the product need custom tooling, a mould or complex engineering to manufacture — or does it have patent or trademark protection a competitor cannot legally copy?",
    level: "level 4",
  },
  {
    q: "Is it custom-made with several unique changes against the generic version — form, features, functionality, performance or materials, not just colour?",
    level: "level 3",
  },
  {
    q: "Does it have at least one visible difference from the off-the-shelf version — a different colour or pattern, or a small feature change?",
    level: "level 2",
  },
] as const;

/**
 * The three rows as a business page actually renders them, connected and not.
 *
 * A specimen rather than a description: "shows a question mark rather than a
 * guess" is a sentence that reads as a hedge until you have seen the question
 * mark. The right-hand column is what an unconnected business looks like, and
 * it is deliberately the same size and weight as the left — the absence is the
 * point, and shrinking it would soften it.
 *
 * 🚧 Hand-built markup, not the real `Metric`. That component lives in
 * DemoBusiness.tsx and carries tooltips, a learn-more link back to THIS page
 * and its own data plumbing; importing it would be a cycle and a great deal of
 * machinery for a picture. If the metric row is ever extracted into a shared
 * component, this should use it.
 */
function Score({ delta }: { delta: number }) {
  const sign = delta > 0 ? "+" : "\u2212";
  return (
    <span
      data-score=""
      data-dir={delta > 0 ? "up" : "down"}
      title={`${sign}${Math.abs(delta).toFixed(2)} on the multiple`}
    >
      {sign}
      {Math.abs(delta).toFixed(2)}
    </span>
  );
}

function WhereTheyAppear() {
  return (
    <figure data-appear="">
      {APPEAR.map((col) => (
        <div key={col.title} data-appear-col="" data-empty={col.empty ? "" : undefined}>
          <p data-appear-title="">{col.title}</p>
          <dl>
            {col.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {col.empty ? <p data-appear-badge="">Needs the questionnaire</p> : null}
        </div>
      ))}
    </figure>
  );
}

const APPEAR = [
  {
    title: "Questionnaire answered",
    empty: false,
    rows: [
      ["Sourcing", "Private label"],
      ["Catalogue", "Broad catalogue, low volume each"],
      ["Differentiation", "Level 3 — functional customisation"],
    ],
  },
  {
    title: "No answers",
    empty: true,
    rows: [
      ["Sourcing", "?"],
      ["Catalogue", "?"],
      ["Differentiation", "?"],
    ],
  },
] as const;

/* The definitions, kept as data so the page reads as one list and a new option
   is one entry rather than a new paragraph somebody has to match to the
   others' voice. */

const TOC: Array<{ href: string; label: string; note: string }> = [
  { href: "#sourcing", label: "Sourcing", note: "+0.30 to \u22120.60" },
  { href: "#catalogue", label: "Catalogue structure", note: "+0.30 to \u22120.30" },
  { href: "#differentiation", label: "Differentiation", note: "+0.70 to \u22120.40" },
  { href: "#where", label: "Where these appear", note: "on a business page" },
];

const SOURCING: Array<{ term: string; def: string; delta: number }> = [
  {
    term: "Private label",
    delta: 0.3,
    def: "The seller puts their own brand on the product and controls its spec — packaging, design, sometimes formulation. Nobody else sells the identical listing.",
  },
  {
    term: "Wholesale",
    delta: -0.1,
    def: "Buys an existing branded product in bulk from the brand or an authorised distributor and resells it. Other sellers can list the same product.",
  },
  {
    term: "Dropship",
    delta: -0.4,
    def: "Lists products it never holds inventory of; a third party ships directly to the customer when an order comes in.",
  },
  {
    term: "Arbitrage (retail or online)",
    delta: -0.5,
    def: "Buys already-branded products from shops or other websites at a discount and resells them at a markup. There is no ongoing supplier relationship.",
  },
  {
    term: "Handmade / artisan",
    delta: -0.3,
    def: "The seller, or a small team, physically makes the product. It is not mass-manufactured by a factory.",
  },
  {
    term: "Print on demand",
    delta: -0.2,
    def: "A third-party print service fulfils a listing the seller owns and controls — price, branding and reviews stay with them.",
  },
  {
    term: "Amazon Merch on Demand",
    delta: -0.6,
    def: "Amazon's closed royalty programme. The seller uploads designs; Amazon sets the price and fulfils, and pays a fixed royalty.",
  },
  {
    term: "Amazon KDP",
    delta: -0.5,
    def: "Amazon's publishing royalty programme, for books, journals and similar.",
  },
];

/** The six structures, each with the shape of the revenue that defines it.
 *
 *  `bars` are fractions of the chart's height, tallest first — a business's
 *  products ranked by revenue. `groups` splits them into categories and draws
 *  the brackets. `humps` is the churn exception: [centre, width, height] per
 *  season, along months rather than products.
 *
 *  🚨 The heights are ILLUSTRATIVE and belong to no business. They are drawn
 *  to be told apart at a glance — flagship is a cliff, concentrated is a
 *  plateau, broad is a floor — not to be measured. Nothing reads them. */
type CatalogueEntry = {
  /** What this shape is worth on the multiple. */
  delta: number;
  term: string;
  def: string;
  eg: string;
  /** The caption under the chart — what the axis is, in the fewest words. */
  axis: string;
  /** The chart's `aria-label`. A shape is only an argument if it reaches
   *  everyone; a decorative-only chart would drop this section for a screen
   *  reader down to six paragraphs that no longer contrast with anything. */
  alt: string;
  bars?: number[];
  groups?: number[];
  humps?: Array<[number, number, number]>;
};

const CATALOGUE: CatalogueEntry[] = [
  {
    term: "Broad catalogue, low volume each",
    delta: 0.1,
    def: "Many SKUs, each aimed at a small slice of search demand and differentiated mainly by design or variation.",
    eg: "hundreds of poster designs, each pulling modest individual search volume, together adding up to meaningful revenue.",
    axis: "many products · none of them large",
    alt: "A long run of two dozen short bars of almost equal height.",
    bars: [
      0.3, 0.29, 0.28, 0.27, 0.26, 0.26, 0.25, 0.24, 0.24, 0.23, 0.22, 0.22, 0.21, 0.2, 0.2, 0.19,
      0.19, 0.18, 0.18, 0.17, 0.16, 0.16, 0.15, 0.14, 0.13, 0.12,
    ],
  },
  {
    term: "Flagship + complementary",
    delta: -0.1,
    def: "One dominant product drives most revenue, with adjacent products sold alongside it to the same customers.",
    eg: "a bestselling yoga mat, plus blocks, straps and a carry bag sold as add-ons.",
    axis: "one hero · the rest sold alongside it",
    alt: "One bar at full height, followed by five much shorter ones.",
    bars: [1, 0.26, 0.21, 0.17, 0.13, 0.09],
  },
  {
    term: "Concentrated bets, few SKUs",
    delta: 0.1,
    def: "A handful of independently significant products with no filler around them. Unlike flagship + complementary there is no hero carrying the rest — each would still be a real business alone.",
    eg: "six to eight SKUs — a garlic press, a knife sharpener, a spiraliser — each a top seller in its own right.",
    axis: "few products · each one significant",
    alt: "Six tall bars of similar height with no small ones beside them.",
    bars: [0.92, 0.86, 0.82, 0.75, 0.7, 0.62],
  },
  {
    term: "Category dominance",
    delta: 0.3,
    def: "Owns most or all major variations within one narrow category — every size, colour and pack count of essentially one product type, rather than different products around a hero SKU.",
    eg: "every case style, colour and size for one specific phone model.",
    axis: "one category · every variation of it",
    alt: "Twelve mid-height bars gathered under a single bracket marking one category.",
    bars: [0.72, 0.68, 0.66, 0.62, 0.6, 0.57, 0.55, 0.52, 0.5, 0.47, 0.44, 0.4],
    groups: [12],
  },
  {
    term: "Trend / seasonal churn",
    delta: -0.3,
    def: "Deliberately high turnover: launch against a trend or season, ride it, retire it, launch the next one.",
    eg: "a new set of Halloween costume designs each year, discontinuing the previous year's underperformers rather than maintaining a stable catalogue.",
    axis: "months · launched, ridden, retired",
    alt: "Four humps rising and falling one after another along a time axis.",
    humps: [
      [34, 62, 30],
      [86, 58, 38],
      [136, 60, 26],
      [186, 56, 34],
    ],
  },
  {
    term: "Generalist / multi-niche portfolio",
    delta: -0.2,
    def: "Products spread across unrelated categories with no single anchor or shared customer base.",
    eg: "phone cases, kitchen gadgets and pet toys under one account with no connection between them.",
    axis: "unrelated categories · no anchor",
    alt: "Three separate clusters of bars, each cluster bracketed as its own category.",
    bars: [0.62, 0.5, 0.42, 0.7, 0.55, 0.36, 0.58, 0.48, 0.4, 0.3],
    groups: [3, 3, 4],
  },
];

/**
 * 🚨 `eg` is a NODE, not a string, for one entry: level 4's example is a real,
 * named product — OTOTO's "Gracula" — and the spec carries it as a link to the
 * listing. A reader deciding whether their own product clears the bar is best
 * served by being able to go and look at one that does, and the whole ladder
 * is easier to place once the top of it is a thing you can hold.
 *
 * It names a third party rather than a seller on this site, which is the only
 * reason it is safe: nothing here is a claim about anyone's business, their
 * numbers or their verification. Do not put a VerifiedMargins seller's product
 * in this list — a worked example on a reference page reads as an assessment
 * we published about them.
 */
const LEVELS: Array<{ term: string; def: string; eg: React.ReactNode; delta: number }> = [
  {
    term: "Level 1 — standard product",
    delta: -0.4,
    def: "An off-the-shelf generic product with the seller's logo on it, and any improvement invisible to the customer. The lowest complexity, cost and time to produce — and correspondingly the lowest defensibility.",
    eg: "a standard stainless-steel garlic press from a supplier catalogue with a brand logo on the handle. A competitor replicates it in days by ordering the same base unit from the same factory.",
  },
  {
    term: "Level 2 — cosmetic variation",
    delta: -0.1,
    def: "An off-the-shelf product with one or more unique changes to its form — colour, pattern — and perhaps some enhancement to features or functionality.",
    eg: "the same garlic press moulded in a novelty shape, or offered in several colours with a slightly better handle grip. A competitor copies it by requesting a variant from the same manufacturer.",
  },
  {
    term: "Level 3 — functional customisation",
    delta: 0.45,
    def: "A custom product with multiple unique changes to form, features, functionality, performance or quantity. It may be made from simple customisable materials such as paper, fabric or wood.",
    eg: "the garlic press sold as a bundled kitchen kit — press, spoon holder, sharpener — in a custom wood or fabric case, with genuinely different functionality from the single tool. Copying it means re-sourcing several components and re-engineering the bundle.",
  },
  {
    term: "Level 4 — hard to copy",
    delta: 0.7,
    def: "Fully custom, with multiple unique changes across form, features, functionality and performance. Hard to imitate through design and manufacturing complexity, intellectual property protection, or both — typically requiring a mould, tooling or complex engineering.",
    eg: (
      <>
        OTOTO&rsquo;s{" "}
        <a
          href="https://www.amazon.com/Gracula-Garlic-Twist-Crusher-OTOTO/dp/B076CTTZKX"
          rel="nofollow noopener"
          target="_blank"
        >
          &ldquo;Gracula&rdquo; garlic crusher
        </a>{" "}
        — a fully custom Dracula-shaped mould requiring proprietary tooling. A
        competitor cannot legally or economically reproduce the design without
        commissioning their own mould from scratch.
      </>
    ),
  },
];
