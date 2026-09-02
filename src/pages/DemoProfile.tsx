import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { PublicProfilePage, useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { useCurrency } from "@/currency";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { ProfileDemo } from "@/demo/registry";
import { DemoBanner, useDemoFetch, useDemoMeta } from "@/demo/harness";
import { ConsultationModal } from "@/demo/ConsultationModal";

/**
 * A public profile, rendered against fixture data.
 *
 * `PublicProfilePage` takes a username and fetches; there is no data prop, so
 * the demo answers the one request it makes rather than reimplementing the
 * layout. The fetch patch and its ordering rules live in @/demo/harness —
 * they are shared with every other demo kind and the subtleties are documented
 * there. Reached from Demo.tsx, which owns the route.
 */
export function DemoProfile({ slug, demo }: { slug: string; demo: ProfileDemo }) {
  const brand = useBrand();
  const { currency } = useCurrency();
  const [booking, setBooking] = useState(false);

  useDemoFetch((url) => {
    if (!url.pathname.includes(`/v1/public/profiles/${slug}`)) return undefined;
    const months = Number(url.searchParams.get("months")) || 12;
    return demo.build(months, url.searchParams.get("currency") || "USD");
  });
  useDemoMeta(`${slug} — demo — ${brand.displayName}`);

  /* Demo-only controls go into slots the shared page owns and does not offer
   * the host: the CTA under the social buttons ([data-profile-actions-row]),
   * the tags inside the header's <h1>, after the @handle. Portalled rather
   * than forking the shared page for a demo. Polled because those nodes only
   * exist once the payload lands, and the parent's mount effect fires long
   * before that. */
  const actionsRow = useHostNode("[data-profile-actions-row]", slug);
  const identity = useHostNode("[data-profile-identity] h1", slug);

  return (
    <Shell width="profile">
      <DemoBanner />
      <div
        className="vm-form vm-profile vm-demo"
        data-demo-count={demo.countLabel ? "" : undefined}
        style={
          {
            ...(demo.countLabel ? { "--demo-count": JSON.stringify(demo.countLabel) } : {}),
          } as React.CSSProperties
        }
      >
        <PublicProfilePage
          username={slug}
          owner={null}
          defaultCurrency={currency}
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: brand.displayName, to: "/" },
                { label: "Demo" },
                { label: `@${slug}` },
              ]}
            />
          }

        />
      </div>
      {identity && demo.tags?.length
        ? createPortal(
            <>
              {demo.tags.map((t) => (
                <span key={t.label} data-demo-tag="" data-tone={t.tone ?? "offer"}>
                  {t.label}
                </span>
              ))}
            </>,
            identity,
          )
        : null}
      {/* 🚧 The group's tag, UNDER the header's business-count line rather than
          beside the name. A group is an affiliation, not a claim about this
          seller's own figures, and sharing a row with "✓ Verified margins"
          would read as one. Portalled into [data-profile-identity], which is
          the count line's own parent, so it lands after it. */}
      {identity?.parentElement && demo.groupTag
        ? createPortal(
            <Link data-demo-grouptag="" to={demo.group?.to ?? "#"}>
              {demo.groupTag}
            </Link>,
            identity.parentElement,
          )
        : null}
      {/* Both CTAs in ONE portal so their order is ours: the group link sits
          ABOVE the booking button. Two portals into the same node would order
          by mount, which is not something to leave to chance on the one
          control a reader is meant to press. */}
      {actionsRow && (demo.group || demo.consultation)
        ? createPortal(
            <>
              {demo.group ? (
                <Link data-demo-cta="" data-variant="quiet" to={demo.group.to}>
                  {demo.group.label}
                </Link>
              ) : null}
              {demo.consultation ? (
                <button type="button" data-demo-cta="" onClick={() => setBooking(true)}>
                  Paid consultation — {demo.consultation.price}
                </button>
              ) : null}
            </>,
            actionsRow,
          )
        : null}
      {booking && demo.consultation ? (
        <ConsultationModal
          name={demo.consultation.name}
          priceLabel={demo.consultation.price}
          minutes={demo.consultation.minutes}
          onClose={() => setBooking(false)}
        />
      ) : null}
    </Shell>
  );
}


/**
 * A node inside the shared page, once it exists.
 *
 * Polled rather than queried once: every one of these lives under data the
 * page has not fetched yet, so a mount effect finds nothing. Capped at ~3s of
 * tries so a selector that never matches (a shared-package rename) fails as a
 * missing control rather than a timer running for the life of the tab.
 */
function useHostNode(selector: string, resetKey: string): HTMLElement | null {
  const [node, setNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setNode(null);
    let tries = 0;
    const id = window.setInterval(() => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        setNode(el);
        window.clearInterval(id);
      } else if (++tries > 60) {
        window.clearInterval(id);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [selector, resetKey]);
  return node;
}
