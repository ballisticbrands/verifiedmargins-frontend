import type { BrandConfig } from "@ballisticbrands/frontend-shared";

/**
 * VerifiedMargins brand config.
 *
 * ⚠️ This product is deliberately NOT Dragon-branded. No Forest/Lime palette,
 * no pixel dragon, no "get" prefix — BRANDING.md does not apply here. Real
 * branding is still outstanding; everything visual in this repo is placeholder.
 */
export const VERIFIEDMARGINS: BrandConfig = {
  id: "verifiedmargins",
  // ONE ORIGIN. The app and the public profiles share the apex — there is
  // no app.* host, and no landing page. appOrigin is what the shared
  // library builds auth redirects and OAuth popup targets from, so a stale
  // subdomain here would bounce users to a host that no longer exists.
  appHost: "verifiedmargins.com",
  appOrigin: "https://verifiedmargins.com",
  headerLabel: "VerifiedMargins",
  displayName: "VerifiedMargins",
  metaDescription:
    "VerifiedMargins is a public seller-profile network. Your margin, computed from your connected Amazon account rather than self-reported.",
  supportEmail: "hello@verifiedmargins.com",
  // GA4 property 551201641 "VerifiedMargins" — its own property, spanning both
  // verifiedmargins.com.
  ga4MeasurementId: "G-B9Y3JRFNT8",
  // Clarity project y6xgjjs7z9 — its own project, not a Dragon one.
  clarityId: "y6xgjjs7z9",
  // Same postMessage namespace as every other brand — the backend sends this
  // type regardless of tenant.
  oauthMessageType: "dragonbot-oauth-result",
};

/**
 * Meta Pixel (dataset) ID for VerifiedMargins — its own dataset, never a
 * Dragon one. Two products in one dataset are inseparable, because they run
 * the same shared code firing identical event names.
 *
 * Dataset 4044834252476491 ("VerifiedMargins website"), owned by the Dragon
 * Suite portfolio (1843062053072002).
 *
 * Deliberately NOT a BrandConfig field: that type is owned by
 * @ballisticbrands/frontend-shared and has no `metaPixelId`, so adding one
 * would mean publishing the shared package and bumping every sibling repo.
 *
 * Why this has to exist at all: the shared lib's Meta calls are guarded by
 * `typeof window.fbq === "function"`. With no base snippet loaded, every Meta
 * event here silently no-ops — no error, just nothing. Creating the dataset in
 * Business Manager is NOT enough on its own.
 */
export const META_PIXEL_ID = "4044834252476491";
