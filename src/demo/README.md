# Demo pages — `/demo/<slug>`

A demo renders a **real app page against fixture data**. The layout is never
reimplemented here: `DemoProfile` mounts the same `PublicProfilePage` the
public profile uses, `DemoLeaderboard` mounts the same `Leaderboard` that `/`
serves, and each answers the one request its page makes. So a demo cannot
drift from production, and a change to the real page shows up in every demo
for free.

Demos may show features that do not exist yet. They are `noindex` and
`Disallow`ed, and must stay that way.

## Kinds

`kind` in the registry picks which page renders the fixture, and
`src/pages/Demo.tsx` is the only place that switches on it.

| kind | page | fixture signature | endpoint answered |
| --- | --- | --- | --- |
| `profile` | `PublicProfilePage` | `(months, currency) => payload` | `/v1/public/profiles/:username` |
| `leaderboard` | `Leaderboard` | `(mode, currency) => payload` | `/v1/public/leaderboard?by=&currency=` |
| `group` | `Leaderboard`, under a group header | `(mode, currency) => payload` | `/v1/public/leaderboard?by=&currency=` |

A further kind is a case in `Demo.tsx` and a component beside it — not a branch
inside an existing demo page.

### `group` — the one kind that shows a feature we do not have

`/demo/g/<slug>` is a coach, agency or mastermind and their people on one
ranked page. **The product has no groups**, so unlike every other demo there is
no real page it could drift from.

Three things it does differently, all of them deliberate:

- **Two path segments**, so it needs its own `<Route>` (`DemoGroupRoute`) BEFORE
  `/demo/:slug` — otherwise "group" is read as a slug — and its registry key
  carries the prefix (`g/ecgwholesale`). A group can therefore never
  collide with a seller's handle.
- **It is still the real `Leaderboard`.** The board a group needs is the board
  the product already has, pointed at a subset. Only the header above it is
  demo-only, and it rides in through `banner` — the prop that exists because
  `Leaderboard` renders its own `Shell`.
- **It may rank by `revenue`.** The real board ranks by profit on purpose; a
  group whose members published revenue and nothing else would render a column
  of "—" in the rank order of nothing. A board has to rank on a number its rows
  actually carry. That is the whole reason the `revenue` variant exists — see
  the comment on `variant` in `src/pages/Leaderboard.tsx`.

## Adding one

1. **Write the fixture** — `src/demo/fixtures/<slug>.ts`. For a `profile`, the
   payload shape is exactly what `GET /v1/public/profiles/:username` returns;
   see `PublicProfile` in
   `@ballisticbrands/frontend-shared/dist/lib/profiles.d.ts`, and copy
   `afrasiab.ts` as the worked example. For a `leaderboard` there is **no
   shared client to check against** — `src/pages/Leaderboard.tsx` calls
   `apiFetch` and declares `Board`/`Entry` locally, so that interface is the
   whole contract; copy `leaderboard.ts`.
2. **Register it** — add a line to `DEMOS` in `src/demo/registry.ts`.
3. **Give it a URL that answers 200** — add `'/demo/<slug>'` to `DEMO_PAGES`
   in `src/data/site.mjs`. That one list feeds `APP_ROUTES`, which gets the
   route a static stub, a `Disallow:` in robots.txt, and exclusion from the
   sitemap. Skipping this step still works when clicked from inside the app,
   but a cold hit on the URL answers 404 — which is exactly what
   `postbuild-spa-routes.mjs` exists to prevent.
4. **Shoot it** — add an entry to `PAGES` in `scripts/screenshot.mjs` and
   look at the PNG. A demo that renders wrong is a demo shown to a prospect.

No route change is needed: `/demo/:slug` is already declared. **`/demo` itself lists
every entry** (`DemoIndex`, read straight off `DEMOS`), so a registered demo is a linked
demo — nothing to update by hand, and no demo that exists but nobody remembers to send.

## Tags beside the name

`tags` on a profile demo renders pills after the @handle — `STANDARD_TAGS` is the set every
demo profile carries (✓ Verified margins, Paid consultation, Free resources).

Two things about them:

**They are portalled elements, not a `::after`.** The single pill used to be
`h1::after { content: var(--demo-pill) }`. `content` holds exactly one string, so a second
tag was never a bigger value — it was a different mechanism. `DemoProfile` portals real
`<span data-demo-tag>` nodes into the shared page's `<h1>`, the same technique the
consultation CTA already used for `[data-profile-actions-row]`.

**`tone` is a claim, not a colour.** `verified` is the green the product uses to mean
"checked against Amazon". `offer` is the same pill in neutral grey, for what a seller merely
advertises. An offer rendered in the verification green is this site claiming it verified
something it never saw — which is the one thing a demo of a *verification* product must not
do casually.

## The fetch seam

`src/demo/harness.tsx` holds `useDemoFetch`, the banner and the noindex meta.
Every demo kind shares them, because the lifecycle rules are subtle: the patch
is installed **synchronously in the component body** (a parent's effect runs
AFTER its children's, so a mount effect is already too late — the real page
has sent its request), keyed by responder identity so a double-mount cannot
leave a dangling override, and re-installed from the effect so StrictMode's
simulated remount puts it back instead of tearing it down in dev.

## The demo banner

Every demo renders a "Demo — illustrative figures" note above the page. It is
the one deliberate deviation from the real layout, and it is there because the
page is otherwise indistinguishable from a genuinely verified one. Drop
`<DemoBanner />` from a demo page if that demo needs to look untouched.

`Leaderboard` takes it as a `banner` prop rather than being wrapped, because
that page renders its own `Shell` — anything wrapped around it lands beside
the nav rail instead of above the board.

## Two contracts the shared page enforces (learned the hard way)

**Verification tiers are strings that must start with `verified`.** The green ✓
badge and the header's "*n* businesses with verified revenue" count are both
gated on `business.verification.tier.startsWith("verified")`. A plausible-looking
tier such as `connected_full` silently renders as an unverified ○ and drops the
header count to zero — nothing errors. Use `verified_margin` / `verified_revenue`.

**Business names are deliberately hidden.** The card renders a blurred literal
`"Stealth Brand"` with `aria-label="Business name hidden"`; the payload has no
field for a real name. `label` is documented as a PLATFORM ("Amazon FBA"), and
the demo abuses it to show names — which is why a blurred placeholder still sits
above them. Showing real business names is a product/privacy decision plus a
payload change, not something a fixture can fake cleanly.

**The header count cannot exceed the rendered list.** "117 businesses" would mean
117 cards — measured at an 11,000px page. Showing a count larger than the list
needs an optional `businesses_total` in the payload (falling back to
`businesses.length`), which real agencies will need too.
