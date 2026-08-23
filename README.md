# verifiedmargins-frontend

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
| ⏳ Clarity | **project ID pending** — `clarityId: ""` in `src/brands/verifiedmargins.ts` |
| ⏳ Meta pixel | **dataset ID pending** — `META_PIXEL_ID = ""` in the same file |
| ⏳ Backend | `brand.ts` row, CORS origin and Prisma models are owned elsewhere; auth calls will 4xx until they land |

## Two IDs to fill in

Both loaders no-op on an empty string, so the app ships and works without them —
you just get no session recordings and no Meta events. Both live in
[`src/brands/verifiedmargins.ts`](src/brands/verifiedmargins.ts):

```ts
clarityId: "",          // ← clarity.microsoft.com project ID
export const META_PIXEL_ID = "";   // ← Meta dataset ID
```

The same two IDs must also be filled into `VerifiedMargins-LP/index.html`.

## Gotchas that are already handled here — don't undo them

- **`dataLayer.push(arguments)`, never `push(args)`.** gtag.js silently ignores a
  rest-param array, sending *zero* hits — not even `page_view`. That bug zeroed a
  sibling app's GA4 for ten days with nothing in the console.
- **`sign_up` fires exactly once**, from the shared `identifyUserAcrossPlatforms()`
  after the post-signup `/me` lookup. Do **not** add a `track("sign_up")` in
  `SignUp.tsx`.
- **`fixMetaStandardEvents()` in `main.tsx`** rewrites the shared package's
  `fbq("trackCustom", "CompleteRegistration")` into `fbq("track", …)`.
  `CompleteRegistration` is a Meta *standard* event; sending it as custom forfeits
  Meta's optimization priors and its AEM slot. **Delete this shim** once
  `@ballisticbrands/frontend-shared` fixes it upstream.
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
```

CI authenticates to GitHub Packages with the built-in `GITHUB_TOKEN`; only local
installs need a PAT.

## Per-product setup still outstanding

- Cloudflare Turnstile: add `app.verifiedmargins.com` to the shared widget's hostname allowlist.
- Google OAuth: add `https://app.verifiedmargins.com` to the shared Web client's
  Authorized JavaScript origins, and `verifiedmargins.com` to the consent screen's
  Authorized domains.
- DNS: `app` → `CNAME ballisticbrands.github.io.`, then set the Pages custom domain.
