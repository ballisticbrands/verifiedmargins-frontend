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
import { AskModal } from "@/demo/AskModal";

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
  const [asking, setAsking] = useState<{ q: string; price: string } | null>(null);

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
        {/* 🚧 "Ask <name>" — a priced question menu, and a feature the product
            does not have. A plain sibling rather than a portal: it is a
            SECTION of its own, not a control belonging in one of the shared
            page's slots, so it wants the bottom of the column and no host
            node to poll for. */}
        {demo.ask ? (
          <section data-demo-ask="">
            <h2>{demo.ask.heading ?? `Ask ${demo.ask.name}`}</h2>
            {demo.ask.blurb ? <p data-demo-ask-blurb="">{demo.ask.blurb}</p> : null}
            <ul>
              {demo.ask.items.map((item) => (
                <li key={item.q}>
                  <button type="button" onClick={() => setAsking(item)}>
                    <span data-demo-ask-q="">{item.q}</span>
                    <span data-demo-ask-price="">{item.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
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
                /* A plain <a target="_blank">, not a router <Link>. The icon
                   PROMISES a new tab, so the control has to actually open one
                   — an arrow-out-of-box over an in-place navigation is a small
                   lie, and this page is a demo of a product about not telling
                   those. `rel` set because target="_blank" without it hands
                   the new tab a window.opener reference. */
                <a
                  data-demo-cta=""
                  data-variant="quiet"
                  href={demo.group.to}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {demo.group.label}
                  <ExternalIcon />
                </a>
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
      {asking && demo.ask ? (
        <AskModal
          name={demo.ask.name}
          heading={demo.ask.heading}
          question={asking.q}
          priceLabel={asking.price}
          onClose={() => setAsking(null)}
        />
      ) : null}
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

/**
 * The same glyph the shared page puts on its outbound profile links, redrawn
 * here rather than imported: `frontend-shared` does not export it, and a demo
 * control that says "new tab" in a different hand than every other link on the
 * page reads as a different kind of control.
 */
function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 4.5h5.5V10M19 5l-8 8" />
      <path d="M18 14.5v4A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </svg>
  );
}
