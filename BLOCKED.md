# 🔴 CI is red — `@ballisticbrands/frontend-shared` 0.8.0 is not published

**Symptom:** the Pages deploy fails, either at install
(`ETARGET  No matching version found for @ballisticbrands/frontend-shared@^0.8.0`)
or at typecheck
(`Module '"@ballisticbrands/frontend-shared"' has no exported member 'ProfileSettingsPage'`).

**Cause:** `src/pages/Settings.tsx` imports `ProfileSettingsPage`, `createProfile` and
`listProfiles`. Those exist **only in 0.8.0**, and 0.8.0 was never published to GitHub
Packages — it exists as a local build in the `node_modules` of every sibling repo on
the dev machine (`dragonbot-frontend`, `dragonrefunds-frontend`, `dragonreply-frontend`,
and this one). So the code builds locally and cannot build in CI.

**Fix (not in this repo):** publish `@ballisticbrands/frontend-shared@0.8.0` to GitHub
Packages. Nothing here needs to change — the pin is already `^0.8.0` — and the next push
will go green on its own.

**Do NOT "fix" it by pinning back to ^0.7.0.** That trades an install error for a
typecheck error and hides the real problem. It was tried; it is worse.

Everything else in this repo is green and independently verified:

```bash
npm test                                  # Meta standard-event rewrite — 0 failing
npm run build && npm run verify:events    # all 3 loaders fire — 0 failing
```

Delete this file when 0.8.0 ships.
