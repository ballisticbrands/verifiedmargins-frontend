import { useEffect, useState } from "react";
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

  /* The CTA belongs UNDER the social buttons, which the shared page renders in
   * its own column ([data-profile-actions-row]) — a slot the host is not given.
   * Rather than fork the shared page for a demo-only control, portal into it.
   * Polled because the row only exists once the payload lands, and the parent's
   * mount effect fires long before that. */
  const [actionsRow, setActionsRow] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      const el = document.querySelector<HTMLElement>("[data-profile-actions-row]");
      if (el) {
        setActionsRow(el);
        window.clearInterval(id);
      } else if (++tries > 60) {
        window.clearInterval(id);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [slug]);

  return (
    <Shell width="profile">
      <DemoBanner />
      <div
        className="vm-form vm-profile vm-demo"
        data-demo-pill={demo.pill ? "" : undefined}
        data-demo-count={demo.countLabel ? "" : undefined}
        style={
          {
            ...(demo.pill ? { "--demo-pill": JSON.stringify(demo.pill) } : {}),
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
      {actionsRow && demo.consultation
        ? createPortal(
            <button type="button" data-demo-cta="" onClick={() => setBooking(true)}>
              Paid consultation — {demo.consultation.price}
            </button>,
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
