import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DEMOS } from "@/demo/registry";
import { DemoBanner, useDemoMeta } from "@/demo/harness";

/**
 * /demo — every demo page, listed.
 *
 * Read straight off `DEMOS`, so registering a demo lists it and there is no
 * second place to forget. A demo that exists but is not linked from anywhere
 * is a demo nobody remembers to send.
 *
 * Carries the same banner and noindex as the demos themselves: this page
 * enumerates pages that must not be crawled, so it must not be a crawlable
 * index OF them. `/demo` is in DEMO_PAGES for exactly that reason.
 */
export function DemoIndex() {
  const brand = useBrand();
  useDemoMeta(`Demos — ${brand.displayName}`);

  const entries = Object.entries(DEMOS);

  return (
    <Shell width="wide">
      <DemoBanner />
      <div className="vm-form">
        <Breadcrumbs items={[{ label: brand.displayName, to: "/" }, { label: "Demo" }]} />
        <h1>Demos</h1>
        <p>
          Real pages rendered against fixture data — the same components production serves, so
          these cannot drift from what a seller actually sees. Some show features that do not
          exist yet.
        </p>
        <ul data-demo-index="">
          {entries.map(([slug, demo]) => (
            <li key={slug}>
              <Link to={`/demo/${slug}`}>
                <strong>{demo.label ?? slug}</strong>
                <code>/demo/{slug}</code>
                {demo.blurb ? <p>{demo.blurb}</p> : null}
                {demo.kind === "profile"
                  ? demo.tags?.map((t) => (
                      <span key={t.label} data-demo-tag="" data-tone={t.tone ?? "offer"}>
                        {t.label}
                      </span>
                    ))
                  : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
