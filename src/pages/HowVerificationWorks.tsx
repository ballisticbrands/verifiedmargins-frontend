import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { useAddBusiness } from "@/AddBusiness";

/**
 * The trust page. What a badge means, how you earn one, and what each route costs.
 *
 * This is the page the whole product rests on: every other screen shows a
 * number, and this is the only one that explains why a stranger should believe
 * it. A reader who lands here is deciding whether the site is worth anything.
 *
 * 🚨 THREE TWINS THIS PAGE MUST NOT DRIFT FROM. All three are trust copy, and
 * a page that describes verification differently from the code that performs
 * it is worse than no page — it is a written promise we are failing.
 *
 *   1. `sellerconnect/src/services/profiles/verification.ts` — the tiers, the
 *      labels and the one-sentence descriptions are DERIVED there and shipped
 *      in the API payload. The strings quoted below in TIERS are that file's
 *      LABELS map. When it changes, this changes.
 *   2. `src/components/AddBusinessModal.tsx` — its METHODS array is the same
 *      three routes, described to someone mid-signup. The prices, the
 *      "what we cannot do" list and the SellerBoard status are duplicated
 *      here on purpose (the modal does not export them) and must stay in
 *      step. 🚧 The honest fix is one shared constant both import; until
 *      somebody does that, edit both.
 *   3. `frontend-shared/src/pages/PublicProfile.tsx` — `BusinessCard` renders
 *      the badge. `Badge` below reproduces its exact conditional (a tier that
 *      startsWith "verified" gets ✓ and the green fill, everything else gets
 *      ○ and grey type), because a specimen that does not match the thing it
 *      is a specimen OF teaches the reader the wrong badge.
 *
 * 🚧 THE PAGE IS AHEAD OF THE FLOW IN TWO PLACES, both marked in the copy:
 *   • The $20 upgrade from ✓ Verified revenue to ✓ Verified margin is the
 *     designed model. Nothing charges $20 or takes a COGS sheet today — the
 *     modal's connect route is Free and stops there.
 *   • SellerBoard is `disabled: true` in the modal ("Coming soon"), so it is
 *     labelled Coming soon here too. Drop the marker in both when it lands.
 *
 * 🚨 In PUBLIC_PAGES (src/data/site.mjs), not APP_ROUTES: this page is meant
 * to be crawled — it answers the query someone types before they trust us —
 * and APP_ROUTES becomes a `Disallow:`. "how-verification-works" is already in
 * the backend's RESERVED_USERNAMES, so the /:username catch-all cannot shadow
 * it.
 */

/** The booking link the video-call route actually uses. Twin of
 *  `CALENDLY_URL` in frontend-shared's VerifyAccounts.tsx. */
const CALENDLY_URL = "https://calendly.com/ggballas";

/**
 * One badge, rendered exactly as a profile renders it.
 *
 * ⚠️ The conditional is `tier.startsWith("verified")`, copied from
 * BusinessCard — which means BOTH `verified_revenue` and `verified_margin`
 * come out green with a ✓. That is not a bug to fix on this page: it is the
 * live behaviour, and a specimen that quietly "improved" it would send a
 * reader looking for a grey Verified-revenue badge that does not exist.
 * The two tiers are told apart by the WORD on the badge and by the sentence
 * underneath it, which is exactly the point §2 is making.
 *
 * `.vm-badge` is the app-owned alias for the shared package's `[data-badge]`
 * hook (globals.css §badges) — same rule, same look, no second stylesheet.
 */
function Badge({ tier, label }: { tier: string; label: string }) {
  return tier.startsWith("verified") ? (
    <span className="vm-badge" data-state="verified">
      {"✓"} {label}
    </span>
  ) : (
    <span className="vm-badge" data-state="estimated">
      {"○"} {label}
    </span>
  );
}

/** The three routes, as the comparison table reads them.
 *
 * Ordered strongest-first-by-default: Connect is what we recommend, the call
 * is what someone who will not connect anything can still do. `note` is the
 * honest qualifier that belongs ON the option, never in small print after it. */
const ROUTES = [
  { key: "connect", label: "Connect Seller Central", note: "Recommended" },
  { key: "sellerboard", label: "Connect SellerBoard", note: "Coming soon" },
  { key: "call", label: "Video call", note: "Most private" },
] as const;

/** One row of the comparison table. `cells` is in ROUTES order — three, always,
 *  so a route added to ROUTES without a cell added to every row is a type error
 *  rather than a silently short table. */
const COMPARISON: {
  row: React.ReactNode;
  cells: [React.ReactNode, React.ReactNode, React.ReactNode];
}[] = [
  {
    row: "Price",
    cells: ["Free", "Free", "$20 one-off"],
  },
  {
    row: "Badge it earns",
    cells: [
      <Badge tier="verified_revenue" label="Verified revenue" />,
      <Badge tier="verified_revenue" label="Verified revenue" />,
      <Badge tier="verified_margin" label="Verified margin" />,
    ],
  },
  {
    row: "Where revenue comes from",
    cells: [
      "Amazon's own API — sales, fees and ad spend, read directly from Seller Central.",
      "Your SellerBoard account, which is itself reading Seller Central.",
      "Seller Central on your screen, on the call, with us watching.",
    ],
  },
  {
    row: "Where cost of goods comes from",
    cells: [
      "A blended cost percentage you supply. We do not check it.",
      "Per-SKU costs already in SellerBoard. We still have to check them.",
      "Your own cost records, shown to us on the call.",
    ],
  },
  {
    row: (
      <>
        Upgrade to <span className="whitespace-nowrap">✓ Verified margin</span>
      </>
    ),
    cells: [
      "+$20 — send a COGS sheet and take a 15-minute call.",
      "+$20 — take a 15-minute call so we can check the SellerBoard costs.",
      "Included.",
    ],
  },
  {
    row: "Stays up to date on its own",
    cells: [
      "Yes — continuous. Your profile shows current figures without you touching it.",
      "Yes — continuous, for as long as SellerBoard stays connected.",
      "No. A call verifies the window you showed us; it does not refresh itself.",
    ],
  },
  {
    row: "What we can reach in your account",
    cells: [
      "Three read-only Amazon roles, revocable by you at Amazon at any time.",
      "SellerBoard's read access. No Amazon credentials pass through us.",
      "Nothing. We are never given access to anything.",
    ],
  },
  {
    row: "How anonymous you can be",
    cells: [
      "Store, brands, ASINs and products are never published. Your figures live on our servers.",
      "Same — nothing identifying is published. Your figures live on our servers.",
      "Highest. Your business name and products stay off this site entirely, and we hold no account of yours.",
    ],
  },
];

/** The two badges the page exists to distinguish, plus the grey state, in the
 *  product's own words. `description` is verbatim from the backend's LABELS —
 *  see the twin note at the top. */
const TIERS = {
  verifiedRevenue: {
    tier: "verified_revenue",
    label: "Verified revenue",
    description:
      "Revenue, fees and ad spend come straight from Amazon. Cost of goods is a percentage the " +
      "seller supplied, so margin is modelled, not verified.",
    marginNote: "Modelled from a blended cost percentage the seller supplied.",
  },
  verifiedMargin: {
    tier: "verified_margin",
    label: "Verified margin",
    description:
      "Revenue, fees and ad spend come straight from Amazon, and margin is computed from per-SKU " +
      "costs the seller uploaded.",
    marginNote: "Computed from per-SKU costs.",
  },
  selfReported: {
    tier: "self_reported",
    label: "Self-reported",
    description: "Revenue and costs were entered by hand and are not verified against Amazon.",
  },
};

/** What Amazon's consent screen does NOT hand us. Twin of `METHODS[connect].cannot`
 *  in AddBusinessModal.tsx — and longer than the ✅ list on purpose, because the
 *  hesitation this page has to answer is "what are you going to do inside my
 *  account", not "what do you offer". */
const CANNOT = [
  "Change your prices, listings, inventory or ad campaigns",
  "Create, cancel, refund or edit a single order",
  "Message your customers, or see who they are",
  "Reach your bank details, tax documents or payout settings",
  "See your suppliers, or what you pay them",
];

export function HowVerificationWorks() {
  const brand = useBrand();
  const addBusiness = useAddBusiness();

  useEffect(() => {
    document.title = `How verification works — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">How verification works</h1>

      <div className="mt-6 space-y-10 text-sm leading-relaxed">
        <section>
          <p>
            Everyone in this industry has seen a revenue figure in a screenshot, and nobody can check
            one. On {brand.displayName} a figure gets onto a profile through one of three routes,
            each of which ends in a badge that says exactly how far the checking went — and,
            just as deliberately, where it stopped.
          </p>
        </section>

        {/* ── §1 The comparison ───────────────────────────────────────────
            First, before any prose: someone arriving here is choosing between
            three things and wants the shape of the choice, not an essay. */}
        <section>
          <h2 className="text-base font-semibold">The three routes, side by side</h2>
          {/* TWO renderings of ONE array, and the array is the reason this is
              not a duplication: `COMPARISON` is the single source, so the card
              list and the table cannot come to say different things.

              🚨 The table alone was wrong on a phone. Three columns of
              monospace need ~46rem, so at 390px a reader saw the row labels
              and ONE column, and had to scroll sideways and remember — which
              is precisely the comparison the section exists to make. This
              product's most common first view is a phone (a profile link
              opened from a DM), so the small screen gets the shape that
              actually works there: one card per route, read top to bottom. */}
          <div className="mt-4 space-y-4 md:hidden">
            {ROUTES.map((route, j) => (
              <div
                key={route.key}
                className="rounded-[var(--radius)] border border-[var(--border)] p-4"
              >
                <p className="font-semibold">{route.label}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{route.note}</p>
                <dl className="mt-3 space-y-3">
                  {COMPARISON.map((line, i) => (
                    <div key={i}>
                      <dt className="text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]">
                        {line.row}
                      </dt>
                      <dd className="mt-0.5">{line.cells[j]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* The same eight facts as a real table, from md up — where three
              columns fit and side-by-side is strictly the better read. */}
          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[46rem] border-collapse text-left text-[13px]">
              <thead>
                <tr>
                  <th className="w-[13rem] border-b border-[var(--border)] px-3 py-2 align-bottom font-semibold" />
                  {ROUTES.map((r) => (
                    <th
                      key={r.key}
                      scope="col"
                      className="border-b border-[var(--border)] px-3 py-2 align-bottom font-semibold"
                    >
                      {r.label}
                      <span className="block text-[11px] font-normal text-[var(--muted-foreground)]">
                        {r.note}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((line, i) => (
                  <tr key={i} className={i % 2 ? "bg-[var(--muted)]" : undefined}>
                    <th
                      scope="row"
                      className="border-b border-[var(--border)] px-3 py-3 align-top font-medium text-[var(--muted-foreground)]"
                    >
                      {line.row}
                    </th>
                    {line.cells.map((cell, j) => (
                      <td
                        key={j}
                        className="border-b border-[var(--border)] px-3 py-3 align-top"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[var(--muted-foreground)]">
            <small>
              🚧 SellerBoard is not live yet — the option appears in the flow so you can see it
              coming, and the flow will not accept it. The $20 upgrade on the two connected
              routes is the model we are building to; today connecting is free and stops at
              ✓&nbsp;Verified revenue.
            </small>
          </p>
        </section>

        {/* ── §2 The badges ───────────────────────────────────────────────
            The heart of the page. Rendered with the SAME component a profile
            uses, so what a reader learns here is what they will meet there. */}
        <section>
          <h2 className="text-base font-semibold">
            What the badges mean — ✓ Verified revenue vs ✓ Verified margin
          </h2>
          <p className="mt-2">
            A profile's badge is not a score out of ten. It is the name of a cell in a
            two-by-two: <strong>where the revenue came from</strong> and{" "}
            <strong>where the cost of goods came from</strong>. Those are separate questions, and
            they are answered by separate evidence.
          </p>
          <p className="mt-2">
            Keeping them separate is the point. A seller with real Amazon revenue and a
            cost percentage they guessed has verified <em>revenue</em> and a{" "}
            <em>modelled</em> margin — and a strong signal on one axis must never be allowed to
            launder a weak one on the other. So the badge names what was checked, and the line
            underneath it names what was not.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TierCard
              spec={TIERS.verifiedRevenue}
              routes="Connect Seller Central (free) · Connect SellerBoard (free)"
              rows={[
                { fact: "Revenue, fees, ad spend", from: "Amazon's API", checked: true },
                { fact: "Cost of goods", from: "A percentage you supplied", checked: false },
                { fact: "Margin", from: "Modelled from the two above", checked: false },
              ]}
            />
            <TierCard
              spec={TIERS.verifiedMargin}
              routes="Any route + a 15-minute call ($20)"
              rows={[
                { fact: "Revenue, fees, ad spend", from: "Amazon's API, or shown to us live", checked: true },
                { fact: "Cost of goods", from: "Per-SKU costs, checked by us", checked: true },
                { fact: "Margin", from: "Computed from the two above", checked: true },
              ]}
            />
          </div>

          <p className="mt-4">
            Both badges are green and both carry a ✓, because in both cases we really did check
            something against Amazon. The difference is stated in the word on the badge and in the
            sentence that always travels with it — never in the colour alone, which most people
            never see (screenshots, greyscale, colour-blind readers) and which cannot carry a
            distinction this important.
          </p>

          <div className="mt-5 rounded-[var(--radius)] border border-[var(--border)] p-4">
            <p className="font-medium">The third state, for completeness</p>
            <p className="mt-2">
              <Badge tier={TIERS.selfReported.tier} label={TIERS.selfReported.label} />
            </p>
            <p className="mt-2 text-[var(--muted-foreground)]">
              {TIERS.selfReported.description}
            </p>
            <p className="mt-2 text-[var(--muted-foreground)]">
              <small>
                Hollow ○, no fill, grey type — provisional by appearance, from across the room.
                The shape and the word change too, not just the colour.
              </small>
            </p>
          </div>
        </section>

        {/* ── §3 Where the badge lives ────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold">A badge belongs to a business, not to a person</h2>
          <p className="mt-2">
            Verification is per connected business, so the badge sits on the business card rather
            than beside the seller's name. Someone running a connected Amazon account and a second
            business they typed in carries both badges on the same page, side by side — rolling
            them into one would either flatter the typed-in half or malign the connected one.
          </p>
          <p className="mt-2">
            The header count says <em>“n businesses with verified revenue”</em> for the same
            reason: “3 businesses” is a claim a reader cannot do anything with.
          </p>
        </section>

        {/* ── §4 The routes in full ───────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold">Route 1 — Connect Seller Central · Free</h2>
          <p className="mt-2">
            You go through Amazon's own consent screen and grant three read-only roles: Finance and
            Accounting, Selling Partner Insights, and Inventory and Order Tracking. We pull the
            order, settlement, advertising and inventory reports Amazon provides, compute the
            aggregate figures, and publish only those. Nothing is typed in and nothing is taken on
            our word. You can revoke it at Amazon, or disconnect here, at any time.
          </p>
          <p className="mt-3 font-medium">What that access cannot do:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {CANNOT.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-3">
            This earns <Badge tier="verified_revenue" label="Verified revenue" />. Your margin still
            rests on a blended cost percentage you supply, so it is published as modelled. To turn
            it into <Badge tier="verified_margin" label="Verified margin" /> you send a per-SKU cost
            sheet and spend fifteen minutes on a call while we check it against what Amazon is
            telling us — <strong>$20, once</strong>.
          </p>
          <p className="mt-3">
            <strong>The advantage of connecting is that it does not stop.</strong> Verification is
            continuous: the profile keeps showing current figures for as long as the connection
            lives, with nothing to re-submit and nothing to go stale.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">
            Route 2 — Connect SellerBoard · Free{" "}
            <span className="text-[var(--muted-foreground)]">(coming soon)</span>
          </h2>
          <p className="mt-2">
            Identical in every way that matters to Route 1 — same badge, same continuous
            verification, same figures — except that your <strong>cost of goods comes out of
            SellerBoard</strong> rather than out of a percentage you type. SellerBoard is already
            reading your Seller Central, so this suits sellers who keep their costs there and would
            rather not maintain them twice.
          </p>
          <p className="mt-3">
            Per-SKU costs arriving from SellerBoard are still <em>your</em> numbers, entered by you
            into a tool of your choosing. We did not check them, so they do not earn{" "}
            <Badge tier="verified_margin" label="Verified margin" /> on their own. The same
            fifteen-minute call does — <strong>$20, once</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Route 3 — Video call verification · $20</h2>
          <p className="mt-2">
            Fifteen minutes on a call, sharing your screen, so we can see the figures in Seller
            Central and your cost records ourselves. It earns{" "}
            <Badge tier="verified_margin" label="Verified margin" /> directly — the highest tier,
            without connecting anything.
          </p>
          <p className="mt-3">
            <strong>This is the most private route on the site.</strong> Your business name and your
            products stay off {brand.displayName} completely, we are granted no access to any
            account of yours, and no seller data of yours is stored here — what remains afterwards is
            the aggregate figures you chose to publish and the fact that we checked them.
          </p>
          <p className="mt-3">
            The trade is freshness. A call verifies the window you showed us; unlike a connected
            account it does not keep itself up to date, so the profile carries the date it was
            verified.
          </p>
          <p className="mt-3">
            <a
              className="underline underline-offset-4"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book the call
            </a>
            , or start from the flow below and we will send you the link.
          </p>
        </section>

        {/* ── §5 The boundary ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold">What a verified profile still never shows</h2>
          <p className="mt-2">
            Whichever route you take: not the store name, the brands, the products, the ASINs, the
            suppliers or the customers. A profile is aggregate financial metrics plus whatever you
            chose to write about yourself, and every metric on it has its own visibility switch —
            margin can be public while revenue stays hidden. Connecting an account publishes
            nothing at all until you publish it.
          </p>
          <p className="mt-2">
            The boundary is enforced in the code and covered by tests. It is spelled out in the{" "}
            <Link className="underline underline-offset-4" to="/privacy">
              privacy policy
            </Link>{" "}
            and in{" "}
            <Link className="underline underline-offset-4" to="/about">
              what this site is
            </Link>
            .
          </p>
        </section>

        <section className="rounded-[var(--radius)] border border-[var(--border)] p-5">
          <h2 className="text-base font-semibold">Get a badge</h2>
          <p className="mt-2">
            Connecting takes about a minute and publishes nothing until you say so.
          </p>
          <p className="mt-3">
            <button
              type="button"
              onClick={addBusiness.open}
              className="rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
            >
              Add your business
            </button>
          </p>
          <p className="mt-3 text-[var(--muted-foreground)]">
            <small>
              Questions about any of this, or about a specific profile:{" "}
              <a className="underline underline-offset-4" href={`mailto:${brand.supportEmail}`}>
                {brand.supportEmail}
              </a>
            </small>
          </p>
        </section>
      </div>
    </Shell>
  );
}

/**
 * One badge with its evidence underneath — the visual half of §2.
 *
 * The badge alone cannot do this job: "Verified revenue" and "Verified margin"
 * are two words apart and both green, so the card spells out the three facts
 * behind them and marks each one checked or not. ✓ / ○ here are the same two
 * marks the badges use, so the vocabulary the reader is learning is consistent
 * within the diagram as well as with the profile.
 */
function TierCard({
  spec,
  routes,
  rows,
}: {
  spec: { tier: string; label: string; description: string; marginNote?: string };
  routes: string;
  rows: { fact: string; from: string; checked: boolean }[];
}) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] p-4">
      <p>
        <Badge tier={spec.tier} label={spec.label} />
      </p>
      <p className="mt-2 text-[var(--muted-foreground)]">
        <small>{routes}</small>
      </p>

      {/* A grid, NOT a flex row: the mark holds its own column so the three
          marks line up as a column a reader can scan, while the text beside it
          wraps as ordinary prose. As a flex row the term and its source were
          two shrinking boxes, and "Revenue, fees, ad spend" broke across a line
          in the middle of itself. */}
      <dl className="mt-4 grid grid-cols-[1rem_1fr] gap-x-2 gap-y-2">
        {rows.map((r) => (
          <Fragment key={r.fact}>
            {/* The mark carries a word for a screen reader; sighted readers get
                the glyph. Never the glyph alone. */}
            <dt className={r.checked ? "text-[var(--verified)]" : "text-[var(--estimated)]"}>
              <span aria-hidden="true">{r.checked ? "✓" : "○"}</span>
              <span className="sr-only">{r.checked ? "Verified:" : "Not verified:"}</span>
            </dt>
            <dd>
              <span className="font-medium">{r.fact}</span>{" "}
              <span className="text-[var(--muted-foreground)]">— {r.from}</span>
            </dd>
          </Fragment>
        ))}
      </dl>

      {/* The sentence the API ships with this tier, and the margin note the
          profile prints under the headline figure. Both verbatim: this card is
          a specimen of the profile, not a paraphrase of it. */}
      <p className="mt-4 border-t border-[var(--border)] pt-3">{spec.description}</p>
      {spec.marginNote ? (
        <p className="mt-2 text-[var(--muted-foreground)]">
          <small>On the profile, under the headline margin: “{spec.marginNote}”</small>
        </p>
      ) : null}
    </div>
  );
}
