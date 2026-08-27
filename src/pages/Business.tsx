import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ApiError,
  StatTile,
  TrendChart,
  apiFetch,
  fetchConnectionOptions,
  listProfiles,
  useBrand,
  useSession,
  type ConnectionOption,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCurrency } from "@/currency";

/**
 * ONE business, at verifiedmargins.com/business/<slug>.
 *
 * 🚨 PUBLIC. No auth guard, and there must never be one: this is a share
 * target — a seller posting one brand's numbers has nowhere else to point
 * that is not their whole portfolio — so it has to render identically for a
 * signed-out visitor, a crawler and an AI assistant.
 * scripts/build-businesses.mjs bakes a static copy of each published one at
 * build time for exactly that reason.
 *
 * ── The name is the URL ──────────────────────────────────────────────────
 * "Amazon FBA 48213", derived by the backend from the opaque slug. The real
 * account name is never published — profiles render a blurred "Stealth
 * Brand" and this page must not become the hole in that — and an opaque
 * identifier means the page needs no private data to have a heading, a title
 * and a share card. A seller-controlled name toggle stays possible later
 * without changing a single URL.
 *
 * ── Why "not live yet" is a state, and why it is owner-only ──────────────
 * The backend answers ONE 404 for five different reasons (never published,
 * never claimed, no rows yet, an Ads slug, a slug nobody was issued) because
 * the difference is an existence oracle. That is right for a stranger and
 * useless for the person who just finished the add-business wizard and
 * landed here minutes before their first sync completes. So ownership is
 * resolved the same way the profile page resolves it — from the caller's OWN
 * `GET /v1/profiles` and that profile's OWN connection list, both of which
 * return only their own rows — and nothing here can be used to discover that
 * somebody else's business exists.
 */

interface BusinessPayload {
  slug: string;
  name: string;
  platform: string;
  label: string;
  seller_type: string | null;
  markets: string[];
  verification: { tier: string; label: string };
  claimed: boolean;
  noindex: boolean;
  window: { months: number; from: string; through: string; includes_partial_month: boolean };
  profile: { username: string; display_name: string | null; avatar_url: string | null };
  metrics: {
    display: {
      currency: string;
      revenue: number | null;
      profit: number | null;
      margin_pct: number | null;
      fx: { as_of: string; source: string; unconvertible: string[] };
    } | null;
    last_30d: {
      revenue: number | null;
      profit: number | null;
      units: number;
      margin_pct: number | null;
    } | null;
    daily: Array<{ date: string; revenue: number; units: number; orders: number; profit: number | null }> | null;
    margin_pct: number | null;
    margin_series: Array<{ month: string; margin_pct: number | null }> | null;
    margin_note: string | null;
    sku_count: number | null;
    brand_count: number | null;
    brands_label: string;
    category: string | null;
  };
  notes: string[];
}

const SELLER_TYPE_LABEL: Record<string, string> = {
  private_label: "Private label",
  wholesaler: "Wholesale",
  dropshipper: "Dropshipping",
};

function money(n: number | null, currency: string): string {
  if (n === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: Math.abs(n) >= 1000 ? 1 : 0,
    }).format(n);
  } catch {
    // Unknown/invalid currency code — never throw on a public page.
    return `${Math.round(n).toLocaleString()} ${currency}`;
  }
}

function percent(n: number | null): string {
  return n === null ? "—" : `${n.toFixed(1)}%`;
}

function fetchBusiness(slug: string, currency: string): Promise<BusinessPayload> {
  // auth: false — a public page must render for a signed-out visitor, and
  // sending a stale bearer is the easiest way to make it LOOK like it works
  // when it does not.
  return apiFetch<BusinessPayload>(
    `/v1/public/businesses/${encodeURIComponent(slug)}?currency=${encodeURIComponent(currency)}`,
    { auth: false },
  );
}

type Load =
  | { state: "loading" }
  | { state: "found"; payload: BusinessPayload }
  | { state: "missing" };

export function Business() {
  const { slug = "" } = useParams();
  const brand = useBrand();
  const { status } = useSession();
  const { currency } = useCurrency();
  const [load, setLoad] = useState<Load>({ state: "loading" });
  /** `true` once we have confirmed this slug is one of the caller's own.
   *  Only ever consulted on the 404 path. */
  const [mine, setMine] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoad({ state: "loading" });
    setMine(false);
    fetchBusiness(slug, currency)
      .then((payload) => {
        if (!cancelled) setLoad({ state: "found", payload });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // Anything that is not a payload is "we cannot show you this
        // business" — a 502 and a 404 read the same to a visitor, and
        // guessing at the difference would be inventing detail we do not have.
        void err;
        setLoad({ state: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug, currency]);

  /* Owner resolution, on the 404 path only. Two authenticated calls that
     each return ONLY the caller's own rows, so this can never answer a
     question about anyone else's business. Never runs signed out, and never
     during the static build (there is no session there), so the prerendered
     copy is always the public one. */
  useEffect(() => {
    if (load.state !== "missing" || status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const profiles = await listProfiles();
        for (const p of profiles) {
          const options = await fetchConnectionOptions(p.id);
          // `slug` is on the wire (connectionToWire in the backend's
          // routes/profiles.ts) but not yet in the shared package's
          // ConnectionOption type. Widened here rather than republishing
          // frontend-shared for one optional field.
          const found = (options as Array<ConnectionOption & { slug?: string }>).some(
            (o) => o.slug === slug,
          );
          if (found) {
            if (!cancelled) setMine(true);
            return;
          }
        }
      } catch (err) {
        // Not being able to answer "is this mine?" falls back to the public
        // view, which is what a stranger would get anyway.
        void (err instanceof ApiError);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load.state, status, slug]);

  const name = load.state === "found" ? load.payload.name : slug;
  useEffect(() => {
    document.title = `${name} — ${brand.displayName}`;
  }, [name, brand.displayName]);

  const daily = load.state === "found" ? load.payload.metrics.daily : null;
  const trend = useMemo(
    () => (daily ?? []).map((d) => ({ date: d.date, value: d.revenue })),
    [daily],
  );

  if (load.state === "loading") {
    return (
      <Shell width="profile">
        <p>Loading…</p>
      </Shell>
    );
  }

  if (load.state === "missing") {
    return (
      <Shell width="profile">
        <div className="vm-form">
          {mine ? (
            <>
              <h1>Not live yet</h1>
              <p>
                This is your business, and its page is not public yet. It goes live once your
                profile is published <em>and</em> we have pulled your first numbers from Amazon —
                for a brand-new connection that can take a few hours.
              </p>
              <p>
                <Link to="/settings">Publishing and connected accounts →</Link>
              </p>
            </>
          ) : (
            <>
              <h1>No business here</h1>
              <p>
                This page does not exist, or its owner has not published it. Business links change
                when a seller reconnects their account, so an older link can stop working.
              </p>
              <p>
                <Link to="/leaderboard">Browse verified sellers →</Link>
              </p>
            </>
          )}
        </div>
      </Shell>
    );
  }

  const p = load.payload;
  const d = p.metrics.display;
  const last30 = p.metrics.last_30d;
  const displayCurrency = d?.currency ?? currency;
  const sub = [p.label, p.seller_type ? SELLER_TYPE_LABEL[p.seller_type] : null]
    .filter(Boolean)
    .join(" · ");
  const owner = p.profile.display_name || `@${p.profile.username}`;

  return (
    <Shell width="profile">
      <div className="vm-form vm-profile">
        <Breadcrumbs
          items={[
            { label: brand.displayName, to: "/" },
            { label: owner, to: `/${p.profile.username}` },
            { label: p.name },
          ]}
        />
        <main>
          <header data-profile-head="">
            <h1>{p.name}</h1>
            <p>
              {sub}
              {p.markets.length > 0 ? (
                <span data-business-markets=""> · {p.markets.join(" · ")}</span>
              ) : null}
            </p>
            <p>
              <span
                data-badge=""
                data-state={p.verification.tier.startsWith("verified") ? "verified" : "estimated"}
              >
                {p.verification.tier.startsWith("verified") ? "✓" : "○"}{" "}
                {p.verification.label}
              </span>
            </p>
            <p>
              {/* The business belongs to a seller, and the profile is where the
                  rest of their portfolio lives. */}
              One business of <Link to={`/${p.profile.username}`}>{owner}</Link>
            </p>
          </header>

          <section data-profile-dashboard="">
            <div data-tiles="">
              <StatTile
                label="Revenue (30d)"
                value={money(last30?.revenue ?? null, displayCurrency)}
                emphasis
                hint={last30?.revenue == null ? "This seller keeps revenue private." : undefined}
              />
              <StatTile
                label="Margin (30d)"
                value={percent(last30?.margin_pct ?? null)}
                hint={p.metrics.margin_note ?? undefined}
              />
              <StatTile
                label={`Revenue (${p.window.months}m)`}
                value={money(d?.revenue ?? null, displayCurrency)}
              />
              <StatTile
                label={`Margin (${p.window.months}m)`}
                value={percent(p.metrics.margin_pct)}
                hint={p.metrics.margin_note ?? undefined}
              />
            </div>

            {trend.length > 0 ? (
              <div data-chart="">
                <TrendChart
                  points={trend}
                  label="Revenue"
                  format={(v) => money(v, displayCurrency)}
                />
              </div>
            ) : null}
          </section>

          <section>
            <dl>
              {p.metrics.sku_count !== null ? (
                <div>
                  <dt>SKUs</dt>
                  <dd data-metric="">{p.metrics.sku_count}</dd>
                </div>
              ) : null}
              {p.metrics.brand_count !== null ? (
                <div>
                  <dt>{p.metrics.brands_label}</dt>
                  <dd data-metric="">{p.metrics.brand_count}</dd>
                </div>
              ) : null}
              {p.metrics.category ? (
                <div>
                  <dt>Category</dt>
                  <dd data-metric="">{p.metrics.category}</dd>
                </div>
              ) : null}
              <div>
                <dt>Covering</dt>
                <dd data-metric="">
                  {p.window.from} – {p.window.through}
                </dd>
              </div>
            </dl>
          </section>

          {/* The backend's own caveats, verbatim. It is the only thing that
              knows why a figure is missing, and paraphrasing them here would
              be a second voice on the honesty this product sells. */}
          {p.notes.length > 0 ? (
            <section data-notes="">
              {p.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </section>
          ) : null}

          {d ? (
            <p data-fx="">
              Converted to {d.currency} at rates from {d.fx.source}, as of {d.fx.as_of}.
            </p>
          ) : null}
        </main>
      </div>
    </Shell>
  );
}
