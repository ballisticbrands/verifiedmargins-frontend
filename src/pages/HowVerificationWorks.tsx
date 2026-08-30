import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBrand,
  verificationBadgeState,
  VERIFICATION_GLYPH,
} from "@ballisticbrands/frontend-shared";
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
 *      ○ and red type), because a specimen that does not match the thing it
 *      is a specimen OF teaches the reader the wrong badge.
 *
 * 🚧 THE PAGE IS AHEAD OF THE FLOW IN TWO PLACES, both marked in the copy:
 *   • The $20 upgrade from ◑ Verified revenue to ✓ Verified margins is the
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
 * The hero: a claim nobody can check, beside a number anyone can.
 *
 * 🚨 COLOUR DISCIPLINE, both directions (BRANDING.md §3, §3.1).
 *
 *   Green means VERIFIED and is not spent anywhere else, so the ✓ badge on the
 *   right has to stay the loudest thing here. Nothing on this page may put a
 *   second green next to it.
 *
 *   Red is ERRORS ONLY — §4.3 is explicit that a thin margin is not an error
 *   and never renders red. A fabricated claim IS a falsehood rather than a bad
 *   number, so red is honest here, but it is rationed to the ✗ mark and one
 *   word. As a panel fill it would out-shout the green and turn the rule off.
 *
 * The left panel is a silhouette on purpose. A rendered face would be a person,
 * and a person who resembles an identifiable real seller is a defamation
 * problem on a page whose entire subject is who is lying about their numbers.
 * No face, no name, no logo.
 *
 * The right panel is not a drawing of the product — the badge is the real
 * `.vm-badge` and the figures are real `--font-mono`, so it cannot drift from
 * what a profile actually renders. Same reason §2's specimens are real.
 */
function Hero() {
  return (
    <div className="vm-hero" data-hero="">
      <div data-hero-panel="" data-side="claimed">
        <div data-hero-art="">
          {/* The claim. Silhouette, money, a rented-looking car, and a figure
              with no basis under it — which is the entire point of the panel. */}
          <svg viewBox="0 0 320 200" role="img" aria-label="A silhouetted figure celebrating amid flying banknotes beside a sports car, claiming fifty thousand dollars a month">
            {/* Banknotes, low opacity so they read as texture, not as objects. */}
            <g data-hero-cash="">
              <g transform="rotate(-18 44 58)"><rect x="26" y="46" width="36" height="22" rx="3" /><text x="44" y="62" textAnchor="middle">$</text></g>
              <g transform="rotate(14 268 76)"><rect x="250" y="64" width="36" height="22" rx="3" /><text x="268" y="80" textAnchor="middle">$</text></g>
              <g transform="rotate(-9 72 128)"><rect x="54" y="116" width="36" height="22" rx="3" /><text x="72" y="132" textAnchor="middle">$</text></g>
              <g transform="rotate(24 252 146)"><rect x="234" y="134" width="36" height="22" rx="3" /><text x="252" y="150" textAnchor="middle">$</text></g>
            </g>

            {/* The car, hinted rather than drawn — it is a prop in the claim,
                not the subject. */}
            <g data-hero-car="">
              <path d="M6 180 v-10 q2-15 20-18 l18-16 q26-9 52 0 l18 16 q18 3 20 18 v10 z" />
              {/* The cabin is punched out in the panel's own grey, which is
                  what makes the shape read as a car rather than as a lump —
                  the same trick as the sunglasses. */}
              <path d="M50 152 l14-12 q22-7 44 0 l13 12 z" data-cutout="" />
              <circle cx="40" cy="180" r="11" />
              <circle cx="118" cy="180" r="11" />
              <circle cx="40" cy="180" r="4.5" data-cutout="" />
              <circle cx="118" cy="180" r="4.5" data-cutout="" />
            </g>

            {/* The figure. Arms up, sunglasses, no face. */}
            <g data-hero-guru="">
              <path d="M160 88 L118 44" data-limb="" />
              <path d="M160 88 L202 44" data-limb="" />
              <circle cx="116" cy="42" r="8" />
              <circle cx="204" cy="42" r="8" />
              <path d="M154 140 L148 180" data-limb="" />
              <path d="M170 140 L178 180" data-limb="" />
              <path d="M141 80 q0-9 9-9 h20 q9 0 9 9 v50 a10 10 0 0 1 -10 10 h-18 a10 10 0 0 1 -10 -10 z" />
              <circle cx="160" cy="54" r="19" />
              <rect x="144" y="48" width="32" height="8" rx="4" data-shades="" />
            </g>

            {/* The claim itself, in the figures face — it IS a figure, and one
                with nothing underneath it. */}
            <g data-hero-bubble="">
              <path d="M196 10 h112 a8 8 0 0 1 8 8 v30 a8 8 0 0 1 -8 8 h-96 l-14 12 v-12 h-2 a8 8 0 0 1 -8 -8 v-30 a8 8 0 0 1 8 -8 z" />
              <text x="252" y="39" textAnchor="middle">$50K/mo</text>
            </g>
          </svg>
        </div>

        <p data-hero-mark="" data-state="false">
          <span aria-hidden="true">{"✗"}</span> Fake news profits
        </p>
        <p data-hero-note="">
          A screenshot and a claim. Nothing behind it can be checked by the
          person reading it — which is every margin figure this industry
          has ever been shown.
        </p>
      </div>

      <div data-hero-panel="" data-side="verified">
        <div data-hero-art="">
          {/* The same kind of number, with its basis attached: a window, an
              axis, and a source. */}
          <div data-hero-card="">
            <p data-hero-label="">REVENUE · LAST 12 MONTHS</p>
            <p data-hero-figure="">$1.2M</p>
            <svg viewBox="0 0 280 78" role="img" aria-label="Monthly revenue rising from August 2025 to July 2026, with a labelled axis">
              <line x1="0" y1="62" x2="280" y2="62" data-axis="" />
              <line x1="0" y1="34" x2="280" y2="34" data-grid="" />
              <path
                d="M4 56 L27 52 L50 55 L73 45 L96 48 L119 38 L142 41 L165 30 L188 33 L211 22 L234 26 L257 14"
                data-series=""
              />
            </svg>
            <p data-hero-axis-labels="">
              <span>Aug 2025</span>
              <span>Jul 2026</span>
            </p>
          </div>
        </div>

        <p data-hero-mark="">
          <Badge tier="verified_margin" label="Verified margins" />
        </p>
        <p data-hero-note="">
          The same kind of number, read from Amazon through their own API,
          with the window it covers and the costs it was computed against
          stated beside it.
        </p>
      </div>
    </div>
  );
}

/**
 * One badge, rendered exactly as a profile renders it.
 *
 * The ladder — which tier is green, which glyph it wears — comes from the
 * shared package, so a specimen can never drift from the thing it is a
 * specimen OF. Two things stay local on purpose:
 *
 *   1. `.vm-badge`, not `[data-badge]`. The shared rule is scoped
 *      `.vm-profile [data-badge]` and this page is not a profile, so the
 *      app-owned alias is what carries the styling here.
 *   2. NO `data-tip`. Everywhere else a badge explains itself on hover
 *      (BRANDING.md §5 wants its explainer within reach) — but this page IS
 *      that explainer, and a tooltip repeating the paragraph a reader is
 *      already looking at is noise.
 */
function Badge({ tier, label }: { tier: string; label: string }) {
  const state = verificationBadgeState(tier);
  return (
    <span className="vm-badge" data-state={state}>
      {VERIFICATION_GLYPH[state]} {label}
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
      <Badge tier="verified_margin" label="Verified margins" />,
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
        Upgrade to <Badge tier="verified_margin" label="Verified margins" />
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

/** The two badges the page exists to distinguish, in the product's own words.
 *  `description` is verbatim from the backend's LABELS — see the twin note at
 *  the top.
 *
 *  🚨 `self_reported` is NOT documented here, deliberately. Nothing a visitor
 *  can reach carries it: no route in the add-business flow can produce a manual
 *  connection, and the seeded businesses that could are transcribed from
 *  fully-trusted public sources, so they are meant to read as verified margins.
 *  A page explaining a badge nobody will meet invites the one question it must
 *  not invite — "so can I just self-report?" — whose answer is no. `Badge`
 *  still renders the state, because the component must handle every tier the
 *  API can return; this section just does not teach it. */
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
    label: "Verified margins",
    description:
      "Revenue, fees and ad spend come straight from Amazon, and margin is computed from per-SKU " +
      "costs the seller uploaded.",
    marginNote: "Computed from per-SKU costs.",
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

      {/* The argument in one look, before a word of it is made in prose. */}
      <Hero />

      {/* `vm-prose` caps sentences at 70ch (BRANDING.md §4.1). It hits the
          text elements, not this wrapper — the table and the card grids below
          are data views and want the whole 52rem column. */}
      <div className="vm-prose mt-6 space-y-10 text-sm leading-relaxed">
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
              ◑&nbsp;Verified revenue.
            </small>
          </p>
        </section>

        {/* ── §2 The badges ───────────────────────────────────────────────
            The heart of the page. Rendered with the SAME component a profile
            uses, so what a reader learns here is what they will meet there. */}
        <section>
          {/* The real pills, not a description of them. The heading is the
              first place a reader meets the two badges, so meeting the actual
              component — right colour, right glyph, right geometry — is worth
              more than a sentence about it. `data-heading-badges` lets the
              flex wrap land evenly instead of hanging one pill off the
              baseline. */}
          <h2 className="text-base font-semibold" data-heading-badges="">
            <span>What the badges mean —</span>
            <Badge tier="verified_revenue" label="Verified revenue" />
            <span>vs</span>
            <Badge tier="verified_margin" label="Verified margins" />
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
            The two badges differ in three channels at once — the <strong>glyph</strong>{" "}
            fills in (◑ → ✓), the <strong>word</strong> changes, and the{" "}
            <strong>colour</strong> steps amber → green. Any one of the three tells you which
            you are looking at, which is the point: most people meet this product as a
            screenshot, and a distinction carried by colour alone is invisible in greyscale and
            to a colour-blind reader.
          </p>
          <p className="mt-2">
            The amber badge is the one that matters most, because it is the easiest to overclaim.
            Revenue really did come from Amazon — that half is checked, and the badge says so
            rather than withholding credit. But the costs behind the margin are a number the
            seller supplied and we did not open, so the badge stops short of green and the line
            beneath it says exactly where it stopped.
          </p>

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
            it into <Badge tier="verified_margin" label="Verified margins" /> you send a per-SKU cost
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
            <Badge tier="verified_margin" label="Verified margins" /> on their own. The same
            fifteen-minute call does — <strong>$20, once</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Route 3 — Video call verification · $20</h2>
          <p className="mt-2">
            Fifteen minutes on a call, sharing your screen, so we can see the figures in Seller
            Central and your cost records ourselves. It earns{" "}
            <Badge tier="verified_margin" label="Verified margins" /> directly — the highest tier,
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
 * The badge names a rung; this names the evidence. Even with the ladder now
 * legible at a glance (○ → ◑ → ✓, red → amber → green), "Verified revenue"
 * does not on its own tell a reader WHICH half went unchecked — so the card
 * spells out all three facts and marks each one. ✓ / ○ here are the same
 * marks the badges use, so the vocabulary the reader is learning inside the
 * diagram is the vocabulary they meet on a profile.
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
