// Single-brand registry for verifiedmargins-frontend.
//
// This repo only builds the VerifiedMargins app (app.verifiedmargins.com).
// The BrandConfig type is owned by @ballisticbrands/frontend-shared.

import { VERIFIEDMARGINS } from "./verifiedmargins";

export type { BrandConfig } from "@ballisticbrands/frontend-shared";
export { VERIFIEDMARGINS };
export { META_PIXEL_ID } from "./verifiedmargins";

/** The one brand this repo builds. */
export function activeBrand() {
  return VERIFIEDMARGINS;
}
