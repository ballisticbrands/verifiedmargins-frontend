# verifiedmargins-frontend

> 🔴 **CI is currently red** through no fault of this repo — see [BLOCKED.md](BLOCKED.md).
> `frontend-shared` 0.8.0 needs publishing. Local builds and both test suites pass.

The VerifiedMargins app, served at **https://app.verifiedmargins.com** from
GitHub Pages (Actions → Pages, `.github/workflows/deploy.yml`).

> **This is a deliberate placeholder.** VerifiedMargins has **no visual identity
> yet** and is deliberately **not** Dragon-branded — no Forest/Lime palette, no
> pixel dragon, no `get` prefix. `Dragon-marketing/BRANDING.md` does **not**
> apply to this product. Every screen here is plain scaffolding whose only job
> is to make the funnel events genuinely fireable. **Real branding is
> outstanding.**

## What is actually finished

| | |
|---|---|
| ✅ GA4 | property `551201641`, measurement ID `G-B9Y3JRFNT8`, injected from `src/main.tsx` |
| ✅ SPA route pageviews | `App.tsx` — first route skipped so the boot loaders aren't double-counted |
| ✅ Auth | shared `useSignUpForm` / `useSignInForm`, Turnstile, Google sign-in, on `/sign-up` + `/sign-in` |
| ✅ Attribution | `captureAttribution()` at boot, before React mounts |
| ✅ Activation events | `reconcileConnectionActivations()` on dashboard mount (server state, not the OAuth popup) |
| ✅ Clarity | project `y6xgjjs7z9`, injected from `src/main.tsx` |
| ✅ Meta pixel | dataset `4044834252476491`, injected from `src/main.tsx` |
| ✅ Profile settings | `/settings` — username (availability + the 2-change cap), bio, avatar, links, per-field visibility toggles, connected-account opt-in and the blended-COGS basis. The form is `ProfileSettingsPage` from the shared package; `src/pages/Settings.tsx` only picks which profile to edit |
| ✅ Backend | `brand.ts` row, CORS origins, Prisma models, `/v1/profiles/*` and `/v1/public/profiles/*` all landed — see `sellerconnect/docs/VERIFIEDMARGINS_API.md` |
| ⏳ Public profile pages | `verifiedmargins.com/<username>` has no home yet. The renderer exists (`PublicProfilePage` in the shared package, reads `/v1/public/profiles/:username`); somebody has to mount it on the apex |

The settings screen needs `@ballisticbrands/frontend-shared` **≥ 0.8.0**.
`node_modules/@ballisticbrands/frontend-shared` is currently a symlink to the
local checkout, so it already resolves — but **0.8.0 has not been published to
GitHub Packages**, and CI installs from the registry. Publish it before relying
on a CI build.

## Gotchas that are already handled here — don't undo them

- **`dataLayer.push(arguments)`, never `push(args)`.** gtag.js silently ignores a
  rest-param array, sending *zero* hits — not even `page_view`. That bug zeroed a
  sibling app's GA4 for ten days with nothing in the console.
- **`sign_up` fires exactly once**, from the shared `identifyUserAcrossPlatforms()`
  after the post-signup `/me` lookup. Do **not** add a `track("sign_up")` in
  `SignUp.tsx`.
- **`src/lib/meta-events.ts`** rewrites the shared package's
  `fbq("trackCustom", "CompleteRegistration")` into `fbq("track", …)`.
  `CompleteRegistration` is a Meta *standard* event; sending it as custom forfeits
  Meta's optimization priors and its AEM slot. **Still present in frontend-shared
  0.8.0.** Unit-tested by `npm test` — that test is the only thing standing between
  this shim and being silently deleted, because `track` and `trackCustom` are
  byte-identical on the wire. **Delete both** once the shared package is fixed.
- **The tab title is set in two places** — `main.tsx` at boot and an effect in
  `App.tsx` on every route change. Changing only one is silently overridden.
- **One text node for the wordmark** (`AuthShell.tsx`). A split lockup
  (`Verified<span>Margins</span>`) is invisible to `grep` but reads as the brand
  name in the DOM — that is how an inherited parent brand shipped in the header
  of every page on a sibling repo.

## Local development

```bash
npm install          # needs a GitHub PAT with read:packages for @ballisticbrands
npm run dev
npm test             # unit-tests the Meta standard-event rewrite
npm run build && npm run verify:events   # drives a real browser, asserts all 3 loaders fire
```

CI authenticates to GitHub Packages with the built-in `GITHUB_TOKEN`; only local
installs need a PAT.

## Per-product setup still outstanding

- Cloudflare Turnstile: add `app.verifiedmargins.com` to the shared widget's hostname allowlist.
- Google OAuth: add `https://app.verifiedmargins.com` to the shared Web client's
  Authorized JavaScript origins, and `verifiedmargins.com` to the consent screen's
  Authorized domains.
- DNS: `app` → `CNAME ballisticbrands.github.io.`, then set the Pages custom domain.
