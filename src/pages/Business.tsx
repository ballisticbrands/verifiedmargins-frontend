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
  VerificationBadge,
  ShareButton,
  AMAZON_MARK_SRC,
  UNVERIFIED_MARGIN_TAG,
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
  /** `Connection.provider` — where the numbers came from. */
  platform: string;
  /** What the business IS ("Amazon FBA"), from `Connection.type`. Never a
   *  label for the provider: a business transcribed from a broker listing is
   *  an Amazon FBA business whose figures are self-reported, and the second
   *  half of that sentence is what `verification` says. */
  label: string;
  /* 🚨 NO `source` FIELD, and none is expected. A business transcribed off a
   * public listing keeps that URL server-side on `Connection.info` — the page
   * names no source. Nothing here should ever start rendering one. */
  seller_type: string | null;
  markets: string[];
  verification: { tier: string; label: string };
  claimed: boolean;
  noindex: boolean;
  window: {
    months: number;
    from: string;
    through: string;
    includes_partial_month: boolean;
  };
  /** The seller behind this business, or `null` for an ORPHAN — one nobody
   *  has claimed. Every read of it below is guarded; an orphan renders with
   *  no founder rather than with a link to a profile that does not exist. */
  profile: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    /** True when this "founder" is a derived GHOST rather than a person — an
     *  orphan's stand-in at /af-<digits>. Rendered differently, and flagged
     *  by the backend so this never sniffs the `af-` prefix. */
    is_ghost: boolean;
  } | null;
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
      /** 30-day advertising spend. 🚨 Null means NOT REPORTED, never "spent
       *  nothing" — the PPC tile hides itself rather than rendering $0. */
      ad_spend: number | null;
    } | null;
    daily: Array<{
      date: string;
      revenue: number;
      units: number;
      orders: number;
      profit: number | null;
    }> | null;
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

function fetchBusiness(
  slug: string,
  currency: string,
): Promise<BusinessPayload> {
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
          const found = (
            options as Array<ConnectionOption & { slug?: string }>
          ).some((o) => o.slug === slug);
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
                This is your business, and its page is not public yet. It goes
                live once your profile is published <em>and</em> we have pulled
                your first numbers from Amazon — for a brand-new connection that
                can take a few hours.
              </p>
              <p>
                <Link to="/settings">Publishing and connected accounts →</Link>
              </p>
            </>
          ) : (
            <>
              <h1>No business here</h1>
              <p>
                This page does not exist, or its owner has not published it.
                Business links change when a seller reconnects their account, so
                an older link can stop working.
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
  /* "Amazon FBA · Private label · MX · CA · US" — what this business IS, in
     the slot a founder profile uses for its tier pills. Markets are part of
     the same sentence rather than a separate span: they disambiguate two
     businesses on one platform, which is the same job the rest of the line
     does. */
  const sub = [
    p.label,
    p.seller_type ? SELLER_TYPE_LABEL[p.seller_type] : null,
    ...p.markets,
  ]
    .filter(Boolean)
    .join(" · ");
  /* `profile` is null for an ORPHAN — a business with no founder behind it.
     Every use of it below is guarded, and the guard is the feature: an orphan
     must render as a business nobody has claimed, never as a broken link to a
     profile that does not exist. */
  const owner = p.profile
    ? p.profile.display_name || `@${p.profile.username}`
    : null;

  return (
    <Shell width="profile">
      <div className="vm-form vm-profile">
        <main>
          {/* THE SAME HEADER SHAPE AS A FOUNDER PROFILE, on purpose: mark
            where the avatar goes, share in the actions column, identity in
            between. A reader moving between /:username and /business/:slug
            should recognise the page, and reusing the attributes means the
            two share one stylesheet rather than drifting apart in two. */}
          <header data-profile-head="">
            <span data-profile-main="">
              <span data-profile-crumbs="">
                <Breadcrumbs
                  items={[
                    { label: brand.displayName, to: "/" },
                    ...(p.profile && owner
                      ? [{ label: owner, to: `/${p.profile.username}` }]
                      : []),
                    { label: p.name },
                  ]}
                />
              </span>
              <span data-profile-who="">
                {/* The platform mark sits where a founder's face does. Same
                  file the business cards use, served from our own origin. */}
                <span data-avatar="" data-business-avatar="" aria-hidden="true">
                  <img src={AMAZON_MARK_SRC} alt="" width={30} height={30} />
                </span>
                <span data-profile-identity="">
                  <h1>
                    {p.name}
                    {/* The shared badge component, so this page, the profile
                        cards and the leaderboard all render ONE ladder from
                        one implementation rather than three that drift. */}
                    <VerificationBadge verification={p.verification} />
                  </h1>
                  {/* Where a founder profile says "3 businesses with ◑ Verified
                    revenue", a business says what IT is. */}
                  <p data-verified-count="">{sub}</p>
                  {/* The business belongs to a seller, and the profile is where
                    the rest of their portfolio lives — when there IS one. An
                    orphan has no founder, so it says nothing rather than
                    linking somewhere empty.

                    🚨 There is deliberately NO source line. A transcribed
                    business's listing URL is not on the payload at all, so
                    there is nothing here to render even by accident. */}
                  {/* An ORPHAN still names a founder, because "one business
                      of" nothing reads as missing data rather than as the
                      fact it is: nobody has claimed this business. Its
                      founder is the GHOST — a derived second view of this
                      same business at /af-<digits> — and it links there.

                      The link TEXT stays "anonymous founder" while the page
                      it opens is titled "Anonymous founder 42360". They are
                      the same thing said at two lengths; the digits would add
                      nothing in a sentence that already sits under the
                      business they belong to. */}
                  {p.profile ? (
                    <p data-business-owner="">
                      One business of{" "}
                      <Link
                        to={`/${p.profile.username}`}
                        {...(p.profile.is_ghost ? { "data-business-anon": "" } : {})}
                      >
                        {p.profile.is_ghost ? "anonymous founder" : owner}
                      </Link>
                    </p>
                  ) : null}
                </span>
              </span>
            </span>
            <span data-profile-actions-row="">
              <ShareButton fallbackPath={`/business/${p.slug}`} />
            </span>
          </header>

          <section data-profile-dashboard="">
            <div data-tiles="">
              {/* FOUR CARDS, all on the same 30-day period, and the same four
                  the founder profile shows — a reader moving between the two
                  pages should not have to re-learn what a tile means.

                  🚨 NO `emphasis` on any of them. It sets `text-3xl` where the
                  rest are `text-xl`, and a figure twice the size of the one
                  beside it reads as a different KIND of number rather than as
                  one of a set. */}
              <StatTile
                label="Profit (30d)"
                value={money(last30?.profit ?? null, displayCurrency)}
                hint={p.metrics.margin_note ?? undefined}
              />
              <StatTile
                label="Revenue (30d)"
                value={money(last30?.revenue ?? null, displayCurrency)}
                hint={
                  last30?.revenue == null
                    ? "This seller keeps revenue private."
                    : undefined
                }
              />
              {/* 🚨 An unverified margin says so, ON the tile. Only
                  `verified_margin` means we checked the cost side;
                  `verified_revenue` means the REVENUE came from Amazon and the
                  margin was modelled from a percentage the seller supplied, so
                  it is theirs rather than ours. Without this the two render
                  identically and a checked figure vouches for an unchecked
                  one. Twin of the Margin tile in the shared package's profile
                  dashboard — keep the two in step. */}
              <StatTile
                label="Margin"
                value={percent(last30?.margin_pct ?? null)}
                hint={p.metrics.margin_note ?? undefined}
                tag={
                  p.verification.tier !== "verified_margin" &&
                  last30?.margin_pct != null
                    ? UNVERIFIED_MARGIN_TAG
                    : undefined
                }
              />
              {/* PPC — advertising spend, beside the margin it eats into.
                  🚨 THE ONE TILE THAT DISAPPEARS rather than showing a dash:
                  `ad_spend` is null for "not reported", so "—" would imply we
                  looked and found nothing while "$0" would assert that a
                  seller who advertises does not. Twin of the PPC tile in the
                  shared package's profile dashboard — keep the two in step. */}
              {last30?.ad_spend != null ? (
                <StatTile label="PPC" value={money(last30.ad_spend, displayCurrency)} />
              ) : null}
              <StatTile
                label="SKUs"
                value={
                  p.metrics.sku_count === null
                    ? "—"
                    : p.metrics.sku_count.toLocaleString()
                }
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

          {/* No "Brands sold" row. A business page is ONE business, and its
              brand count was a figure with nothing to compare against — unlike
              on a founder profile, where it summarises an estate.

              🚨 The whole SECTION is conditional, not just the row inside it.
              Category is the only entry left, so a business without one was
              rendering an empty <section> — which still carries its top rule
              and 2.5rem of margin, and read on the live page as a band of
              dead space between the chart and the notes. */}
          {p.metrics.category ? (
            <section>
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd data-metric="">{p.metrics.category}</dd>
                </div>
              </dl>
            </section>
          ) : null}

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
              Converted to {d.currency} at rates from {d.fx.source}, as of{" "}
              {d.fx.as_of}.
            </p>
          ) : null}
        </main>
      </div>
    </Shell>
  );
}
