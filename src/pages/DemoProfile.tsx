import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { PublicProfilePage, useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { useCurrency } from "@/currency";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DEMOS } from "@/demo/registry";
import { ConsultationModal } from "@/demo/ConsultationModal";

/**
 * /demo/<slug> — a real app page, rendered against fixture data.
 *
 * ── Why a fetch seam rather than a prop ──────────────────────────────────
 * PublicProfilePage takes a username and fetches; there is no data prop, and
 * the state-free PublicProfileBody underneath it is deliberately not exported
 * ("a seam, not API"). Rather than reimplement the layout — which would drift
 * from the real page the first time either changed — the demo answers the one
 * request the page makes. What renders IS the production component, so a demo
 * is always a truthful picture of the page.
 *
 * The patch is scoped: installed synchronously before the child mounts (a
 * parent effect runs AFTER its children's, which would be too late), removed
 * on unmount, and refcounted so StrictMode's double-mount cannot leave a
 * dangling override.
 */

const realFetch = window.fetch;
let depth = 0;

function install(slug: string, build: (m: number, c: string) => unknown) {
  depth += 1;
  if (depth > 1) return;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const href =
      typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (href.includes(`/v1/public/profiles/${slug}`)) {
      const u = new URL(href, window.location.origin);
      const months = Number(u.searchParams.get("months")) || 12;
      const currency = u.searchParams.get("currency") || "USD";
      return new Response(JSON.stringify(build(months, currency)), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return realFetch(input, init);
  };
}

function uninstall() {
  depth = Math.max(0, depth - 1);
  if (depth === 0) window.fetch = realFetch;
}

export function DemoProfile() {
  const { slug = "" } = useParams();
  const brand = useBrand();
  const { currency } = useCurrency();
  const demo = DEMOS[slug];
  const [booking, setBooking] = useState(false);
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

  /* Synchronous, in the body — see the header note on effect ordering. */
  const armed = useRef(false);
  if (demo && !armed.current) {
    armed.current = true;
    install(slug, demo.build);
  }
  useEffect(() => () => {
    if (armed.current) uninstall();
  }, []);

  useEffect(() => {
    document.title = `${slug} — demo — ${brand.displayName}`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [slug, brand.displayName]);

  if (!demo) {
    return (
      <Shell width="wide">
        <div className="vm-form">
          <h1>No demo here</h1>
          <p>
            There is no demo registered as <code>{slug}</code>. See{" "}
            <code>src/demo/README.md</code>.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell width="profile">
      {/* Remove this banner if a demo needs to look untouched — it is the one
          deliberate deviation from the real page. It exists because these
          figures are illustrative and the page is otherwise indistinguishable
          from a verified profile. */}
      <div className="vm-demo-banner" role="note">
        <strong>Demo</strong>
        <span>Illustrative figures — not a verified profile.</span>
      </div>
      <div className="vm-form vm-profile vm-demo">
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
      {actionsRow
        ? createPortal(
            <button type="button" data-demo-cta="" onClick={() => setBooking(true)}>
              Paid consultation — $200
            </button>,
            actionsRow,
          )
        : null}
      {booking ? (
        <ConsultationModal
          name="Afrasiab Khan"
          priceLabel="$200"
          minutes={45}
          onClose={() => setBooking(false)}
        />
      ) : null}
    </Shell>
  );
}
