# Demo pages — `/demo/<slug>`

A demo renders a **real app page against fixture data**. The layout is never
reimplemented here: `DemoProfile` mounts the same `PublicProfilePage` the
public profile uses and answers the one request it makes. So a demo cannot
drift from production, and a change to the real page shows up in every demo
for free.

Demos may show features that do not exist yet. They are `noindex` and
`Disallow`ed, and must stay that way.

## Adding one

1. **Write the fixture** — `src/demo/fixtures/<slug>.ts`, exporting
   `(months, currency) => payload`. The payload shape is exactly what
   `GET /v1/public/profiles/:username` returns; see `PublicProfile` in
   `@ballisticbrands/frontend-shared/dist/lib/profiles.d.ts`. Copy
   `afrasiab.ts` as the worked example.
2. **Register it** — add a line to `DEMOS` in `src/demo/registry.ts`.
3. **Give it a URL that answers 200** — add `'/demo/<slug>'` to `DEMO_PAGES`
   in `src/data/site.mjs`. That one list feeds `APP_ROUTES`, which gets the
   route a static stub, a `Disallow:` in robots.txt, and exclusion from the
   sitemap. Skipping this step still works when clicked from inside the app,
   but a cold hit on the URL answers 404 — which is exactly what
   `postbuild-spa-routes.mjs` exists to prevent.

That is the whole checklist. No route change is needed: `/demo/:slug` is
already declared.

## The demo banner

`DemoProfile` renders a "Demo — illustrative figures" note above the page. It
is the one deliberate deviation from the real layout, and it is there because
the page is otherwise indistinguishable from a genuinely verified profile.
Delete that block in `src/pages/DemoProfile.tsx` if a demo needs to look
untouched.

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
