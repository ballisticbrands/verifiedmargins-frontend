// Single-brand registry for verifiedmargins-frontend.
//
// This repo builds the whole of VerifiedMargins on verifiedmargins.com —
// the app AND the public seller profiles. There is no separate app host.
// The BrandConfig type is owned by @ballisticbrands/frontend-shared.

import { VERIFIEDMARGINS } from "./verifiedmargins";

export type { BrandConfig } from "@ballisticbrands/frontend-shared";
export { VERIFIEDMARGINS };
export { META_PIXEL_ID } from "./verifiedmargins";

/** The one brand this repo builds. */
export function activeBrand() {
  return VERIFIEDMARGINS;
}
