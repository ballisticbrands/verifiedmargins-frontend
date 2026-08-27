/* Demo pages: /demo/<slug>.
 *
 * A demo renders a REAL app page against fixture data, so it can never drift
 * from what production looks like — the layout is not reimplemented here, it
 * is the same component the public profile uses. See ./README.md to add one.
 *
 * 🚧 Demos may show features that do not exist yet. They are noindex and
 * Disallow'd (site.mjs DEMO_PAGES → APP_ROUTES), and must stay that way.
 */

import { afrasiab } from "./fixtures/afrasiab";

/** Builds the payload GET /v1/public/profiles/:username would return. */
export type DemoBuilder = (months: number, currency: string) => unknown;

export interface Demo {
  /** Which app page to render the fixture through. */
  kind: "profile";
  build: DemoBuilder;
}

export const DEMOS: Record<string, Demo> = {
  afrasiab: { kind: "profile", build: afrasiab },
};
