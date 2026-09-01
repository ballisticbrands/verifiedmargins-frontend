import { useCallback, useEffect, useMemo, useState } from "react";
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
  dashboardPlots,
  plotLabel,
  type PlotKey,
  WindowPicker,
  WINDOW_OPTIONS,
  type WindowKey,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
import { useAddBusiness } from "@/AddBusiness";
import { useUnlockedWindows } from "@/lib/unlocked-windows";
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

/** Two provenances, and the page must never render them alike. `derived` was
 *  read from Amazon and carries when; `declared` was typed by the seller. */
interface BusinessFacts {
  declared: {
    foundedYear?: number | null;
    strategy?: string | null;
    differentiation?: string | null;
    otherPlatforms?: string[];
    supplierCountries?: string[];
    supplierCount?: number | null;
    teamSize?: number | null;
    brandRegistry?: boolean | null;
    updatedAt?: string;
  };
  derived: {
    marketplaces?: string[];
    channels?: "fba" | "fbm" | "both" | null;
    derivedAt?: string;
  };
}

const CHANNEL_LABEL: Record<string, string> = {
  fba: "FBA",
  fbm: "FBM",
  both: "FBA and FBM",
};

const PLATFORM_LABEL: Record<string, string> = {
  shopify: "Shopify",
  tiktok: "TikTok Shop",
  walmart: "Walmart",
  etsy: "Etsy",
  ebay: "eBay",
  own_site: "Own site",
};

interface BusinessValuation {
  value?: number | null;
  multiple?: number | null;
  netProfitTtm?: number | null;
  complete?: boolean;
  computedAt?: string;
}

interface BusinessPayload {
  facts?: BusinessFacts;
  valuation?: BusinessValuation;
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
    /** Which window the backend actually answered for. Echoed back so the
     *  picker, the tiles and the chart caption cannot disagree with the
     *  figures — the page asks, the server decides, the label follows. */
    key: WindowKey;
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
  window: WindowKey,
): Promise<BusinessPayload> {
  // auth: false — a public page must render for a signed-out visitor, and
  // sending a stale bearer is the easiest way to make it LOOK like it works
  // when it does not.
  return apiFetch<BusinessPayload>(
    `/v1/public/businesses/${encodeURIComponent(slug)}` +
      `?window=${encodeURIComponent(window)}&currency=${encodeURIComponent(currency)}`,
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
  /* 30 days by default: what a business is doing NOW, with a year as the
     context you opt into. The backend defaults the same way, so a payload
     fetched with no window and one fetched with "30d" are the same payload. */
  const [windowKey, setWindowKey] = useState<WindowKey>("30d");
  /* THE GATE, resolved by the host and shared with the founder profile —
     see lib/unlocked-windows.ts. A pricing rule kept in two files is one
     place to change and one place to forget. */
  const unlocked = useUnlockedWindows();
  /* The PROMPT, not the flow: a locked pick opens one sentence and a
     button, and that button opens the wizard. Dropping the wizard on
     someone who pressed a date range reads as a paywall ambush. */
  const { promptUnlock } = useAddBusiness();
  /** `true` once we have confirmed this slug is one of the caller's own.
   *  Only ever consulted on the 404 path. */
  /** The caller's connection id for THIS business, or null when it is not
   *  theirs. An id rather than a boolean because editing facts is scoped to
   *  the connection. */
  const [mine, setMine] = useState<string | null>(null);

  /* A refetch that deliberately does NOT reset `mine` or flash the loading
     state: it runs after the owner saves their own facts, and blanking the
     page they are editing to prove the save worked is a worse answer than
     the numbers arriving a beat later. */
  const reload = useCallback(async () => {
    try {
      const payload = await fetchBusiness(slug, currency, windowKey);
      setLoad({ state: "found", payload });
    } catch {
      /* Leave the page as it was — the save already succeeded. */
    }
  }, [slug, currency, windowKey]);

  useEffect(() => {
    let cancelled = false;
    setLoad({ state: "loading" });
    setMine(null);
    fetchBusiness(slug, currency, windowKey)
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
    /* `windowKey` in the deps is what makes the picker DO something: the
       window is resolved server-side, so changing it has to refetch or the
       heading would move while the figures stood still. */
  }, [slug, currency, windowKey]);

  /* Owner resolution, on the 404 path only. Two authenticated calls that
     each return ONLY the caller's own rows, so this can never answer a
     question about anyone else's business. Never runs signed out, and never
     during the static build (there is no session there), so the prerendered
     copy is always the public one. */
  useEffect(() => {
    /* Runs whenever signed in, not only on a missing page: ownership now
       decides whether the FACTS below are editable, not just whether to
       explain an empty one. */
    if (status !== "authenticated") return;
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
          const found = (options as Array<ConnectionOption & { slug?: string }>).find(
            (o) => o.slug === slug,
          );
          if (found) {
            /* Keep the id: PATCHing facts is scoped to the CONNECTION, and
               re-deriving it from the slug later would mean asking the same
               question twice. */
            if (!cancelled) setMine(found.id);
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
  const marginSeries =
    load.state === "found" ? load.payload.metrics.margin_series : null;
  /* WHAT IS CLICKABLE IS NOT THIS PAGE'S DECISION — see dashboardPlots in
     the shared package. This page used to hardwire the chart to Revenue and
     make none of its tiles a control, while the founder profile showing the
     same four tiles made three of them controls. Same data, same tiles, two
     different answers. */
  const board = useMemo(
    () => dashboardPlots({ daily, marginSeries }),
    [daily, marginSeries],
  );
  /* null until the reader picks one, so the leading plottable tile opens
     selected. Reset when the slug changes — a key that was plottable on the
     last business need not be on this one. */
  const [plot, setPlot] = useState<PlotKey | null>(null);
  useEffect(() => {
    setPlot(null);
  }, [slug]);

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

  /* 🚨 THE LABEL COMES OFF THE PAYLOAD, not off `windowKey`. They agree
     almost always and disagree in exactly the moment that matters: while a
     new window is in flight, the old figures are still on screen, and a
     heading that had already jumped ahead would be captioning them wrongly. */
  const windowLabel =
    WINDOW_OPTIONS.find((o) => o.value === p.window.key)?.label ?? "Last 30 days";

  /* The tile the chart is currently showing. Falls back to the leading
     plottable one rather than to a fixed "profit", which would leave nothing
     looking selected on a business with no costs on file. */
  const activeKey = board.plots.includes(plot as PlotKey)
    ? (plot as PlotKey)
    : (board.plots[0] ?? null);
  /* 🚨 A TILE IS A CONTROL ONLY WHEN IT HAS A SERIES BEHIND IT — `board.plots`
     is the whole answer, and this page must not add to it. Spread onto the
     three tiles that can plot; PPC and SKUs get nothing, because the payload
     carries one figure for each rather than a series, and a button that
     changed no chart would be a control lying about being one. */
  const tilePlot = (key: PlotKey) =>
    board.plots.includes(key)
      ? {
          spark: board.sparkFor(key),
          selected: key === activeKey,
          onClick: () => setPlot(key),
        }
      : {};

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
            {/* THE PICKER IS THE HEADING — the same arrangement as a founder
                profile, and the same control (WindowPicker, from the shared
                package, not a lookalike). It names the span the tiles and the
                chart describe and is the only way to change it, so two of
                them would be one label and one control saying the same words.
                The <h2> stays for structure and for a screen reader. */}
            <div data-dashboard-head="">
              <h2 className="vm-visually-hidden">{windowLabel}</h2>
              <WindowPicker
                value={windowKey}
                options={WINDOW_OPTIONS}
                unlocked={unlocked ?? WINDOW_OPTIONS.map((o) => o.value)}
                onPick={setWindowKey}
                /* A locked pick must not move the board underneath the
                   dialog: showing the answer while asking someone to pay for
                   it is worse than not showing it. */
                onLockedPick={() => promptUnlock()}
              />
            </div>

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
                {...tilePlot("profit")}
              />
              <StatTile
                label="Revenue (30d)"
                value={money(last30?.revenue ?? null, displayCurrency)}
                hint={
                  last30?.revenue == null
                    ? "This seller keeps revenue private."
                    : undefined
                }
                {...tilePlot("revenue")}
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
                {...tilePlot("margin")}
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

            {/* The caption names the SELECTED tile, not "Revenue" — it used
                to say Revenue over a chart that could only ever be revenue,
                and a caption that cannot be wrong is a caption that is not
                doing anything. `activeKey` is null only when nothing is
                plottable, and then there is no chart to caption. */}
            {activeKey ? (
              <>
                <p data-chart-label="">
                  <small>
                    {plotLabel(activeKey)}{" "}
                    {board.useDaily
                      ? `by day, ${windowLabel.toLowerCase()}`
                      : `by month, ${windowLabel.toLowerCase()}`}
                  </small>
                </p>
                <div data-chart="">
                  <TrendChart
                    points={board.pointsFor(activeKey)}
                    label={plotLabel(activeKey)}
                    format={
                      activeKey === "margin"
                        ? percent
                        : (v) => money(v, displayCurrency)
                    }
                    formatDate={(iso) =>
                      new Date(iso).toLocaleDateString(
                        undefined,
                        board.useDaily
                          ? { month: "short", day: "numeric", timeZone: "UTC" }
                          : { month: "short", year: "2-digit", timeZone: "UTC" },
                      )
                    }
                  />
                </div>
              </>
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
          <BusinessValuationStrip slug={p.slug} valuation={p.valuation} isOwner={Boolean(mine)} />

          <BusinessFactsSection
            facts={p.facts}
            connectionId={mine}
            onSaved={() => void reload()}
          />

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


// ─── What this business IS ───────────────────────────────────────────
//
// 🚨 TWO PROVENANCES, RENDERED APART. `derived` was read from Amazon and
// carries when; `declared` was typed by the seller and nobody checked it.
// The backend keeps them in two columns and ships them as two objects
// precisely so this page can show the difference — collapsing them into one
// tidy list here would undo that at the last step, on a site whose product is
// knowing which figures are checkable.

const FACT_FIELDS = [
  { key: "foundedYear", label: "Founded", kind: "year" },
  { key: "teamSize", label: "Team size", kind: "number" },
  { key: "supplierCount", label: "Suppliers", kind: "number" },
  { key: "supplierCountries", label: "Supplier countries", kind: "codes" },
  { key: "otherPlatforms", label: "Also sells on", kind: "platforms" },
  { key: "brandRegistry", label: "Brand Registry", kind: "bool" },
  { key: "strategy", label: "Strategy", kind: "text" },
  { key: "differentiation", label: "Differentiation", kind: "text" },
] as const;

function yearsSince(year: number): string {
  const n = new Date().getUTCFullYear() - year;
  if (n <= 0) return "this year";
  return `${year} · ${n} ${n === 1 ? "year" : "years"}`;
}

function BusinessFactsSection({
  facts,
  connectionId,
  onSaved,
}: {
  facts?: BusinessFacts;
  /** Non-null ⇒ the viewer owns this business and may edit. */
  connectionId: string | null;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const declared = facts?.declared ?? {};
  const derived = facts?.derived ?? {};

  const derivedRows: Array<[string, string]> = [];
  if (derived.marketplaces?.length) {
    derivedRows.push(["Marketplaces", derived.marketplaces.map((m) => m.toUpperCase()).join(" · ")]);
  }
  if (derived.channels) derivedRows.push(["Fulfilment", CHANNEL_LABEL[derived.channels] ?? derived.channels]);

  const declaredRows: Array<[string, string]> = [];
  for (const f of FACT_FIELDS) {
    const v = (declared as Record<string, unknown>)[f.key];
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (f.kind === "year") declaredRows.push([f.label, yearsSince(Number(v))]);
    else if (f.kind === "bool") declaredRows.push([f.label, v ? "Yes" : "No"]);
    else if (f.kind === "codes") declaredRows.push([f.label, (v as string[]).join(" · ")]);
    else if (f.kind === "platforms") {
      declaredRows.push([f.label, (v as string[]).map((x) => PLATFORM_LABEL[x] ?? x).join(" · ")]);
    } else declaredRows.push([f.label, String(v)]);
  }

  /* An owner always gets the section — the empty state is where they start.
     A stranger only sees it when there is something in it. */
  if (!connectionId && derivedRows.length === 0 && declaredRows.length === 0) return null;

  return (
    <section data-business-facts="">
      <div data-facts-head="">
        <h2>About this business</h2>
        {connectionId && !editing ? (
          <button type="button" data-facts-edit="" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : null}
      </div>

      {derivedRows.length > 0 ? (
        <div data-facts-group="" data-provenance="derived">
          <p data-facts-legend="">
            From Amazon
            {derived.derivedAt ? <span> · read {derived.derivedAt.slice(0, 10)}</span> : null}
          </p>
          <dl data-facts-list="">
            {derivedRows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {editing && connectionId ? (
        <FactsForm
          connectionId={connectionId}
          initial={declared}
          onDone={() => {
            setEditing(false);
            onSaved();
          }}
          onCancel={() => setEditing(false)}
        />
      ) : declaredRows.length > 0 ? (
        <div data-facts-group="" data-provenance="declared">
          {/* Says who said it. These are unverified, and a page that renders
              them in the same voice as the Amazon-read ones would be lending
              them credibility they have not earned. */}
          <p data-facts-legend="">Stated by the seller</p>
          <dl data-facts-list="">
            {declaredRows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : connectionId ? (
        <p data-facts-empty="">
          Nothing stated yet. <button type="button" data-link-button="" onClick={() => setEditing(true)}>Add details</button>
        </p>
      ) : null}
    </section>
  );
}


const PLATFORM_CHOICES = ["shopify", "tiktok", "walmart", "etsy", "ebay", "own_site"] as const;

/**
 * The declared-facts editor.
 *
 * PATCHes only what changed. The endpoint's semantics are: an absent key is
 * left alone, an explicit null clears — so sending the whole form every time
 * would work, but sending only the diff means a field this form does not know
 * about yet cannot be blanked by an older client.
 */
function FactsForm({
  connectionId,
  initial,
  onDone,
  onCancel,
}: {
  connectionId: string;
  initial: BusinessFacts["declared"];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [foundedYear, setFoundedYear] = useState(initial.foundedYear?.toString() ?? "");
  const [teamSize, setTeamSize] = useState(initial.teamSize?.toString() ?? "");
  const [supplierCount, setSupplierCount] = useState(initial.supplierCount?.toString() ?? "");
  const [supplierCountries, setSupplierCountries] = useState(
    (initial.supplierCountries ?? []).join(", "),
  );
  const [platforms, setPlatforms] = useState<string[]>(initial.otherPlatforms ?? []);
  const [brandRegistry, setBrandRegistry] = useState<string>(
    initial.brandRegistry === true ? "yes" : initial.brandRegistry === false ? "no" : "",
  );
  const [strategy, setStrategy] = useState(initial.strategy ?? "");
  const [differentiation, setDifferentiation] = useState(initial.differentiation ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* "" means CLEARED, which the endpoint spells as null — not as absent,
     which would leave the old value in place. A blank box the seller emptied
     on purpose has to actually empty the field. */
  const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/v1/connections/${encodeURIComponent(connectionId)}/facts`, {
        method: "PATCH",
        body: JSON.stringify({
          foundedYear: numOrNull(foundedYear),
          teamSize: numOrNull(teamSize),
          supplierCount: numOrNull(supplierCount),
          supplierCountries: supplierCountries
            .split(/[,\s]+/)
            .map((c) => c.trim())
            .filter(Boolean),
          otherPlatforms: platforms,
          brandRegistry: brandRegistry === "" ? null : brandRegistry === "yes",
          strategy: strategy.trim() === "" ? null : strategy,
          differentiation: differentiation.trim() === "" ? null : differentiation,
        }),
      });
      onDone();
    } catch (err) {
      /* The backend's own message, not a generic one: it names the field and
         the rule ("foundedYear must be a year between 1994 and 2026"), which
         is the only thing that tells the seller what to change. */
      setError(err instanceof ApiError ? err.message : "Could not save. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form data-facts-form="" onSubmit={submit}>
      <p data-facts-legend="">
        Stated by you. We publish these as your words — nothing here is verified.
      </p>

      <div data-facts-grid="">
        <label>
          <span>Founded (year)</span>
          <input type="number" inputMode="numeric" min={1994} max={new Date().getUTCFullYear()}
            placeholder="2019" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} />
        </label>
        <label>
          <span>Team size</span>
          <input type="number" inputMode="numeric" min={0} placeholder="6"
            value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
        </label>
        <label>
          <span>Number of suppliers</span>
          <input type="number" inputMode="numeric" min={0} placeholder="4"
            value={supplierCount} onChange={(e) => setSupplierCount(e.target.value)} />
        </label>
        <label>
          <span>Supplier countries</span>
          <input type="text" placeholder="CN, VN" value={supplierCountries}
            onChange={(e) => setSupplierCountries(e.target.value)} />
        </label>
        <label>
          <span>Brand Registry</span>
          <select value={brandRegistry} onChange={(e) => setBrandRegistry(e.target.value)}>
            {/* Three states, not a checkbox: "not saying" is not "no". */}
            <option value="">Not saying</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>

      <fieldset data-facts-platforms="">
        <legend>Also sells on</legend>
        {PLATFORM_CHOICES.map((pf) => (
          <label key={pf}>
            <input
              type="checkbox"
              checked={platforms.includes(pf)}
              onChange={(e) =>
                setPlatforms((cur) =>
                  e.target.checked ? [...cur, pf] : cur.filter((x) => x !== pf),
                )
              }
            />
            <span>{PLATFORM_LABEL[pf] ?? pf}</span>
          </label>
        ))}
      </fieldset>

      <label data-facts-text="">
        <span>Strategy</span>
        <textarea rows={3} maxLength={2000} placeholder="How this business wins."
          value={strategy} onChange={(e) => setStrategy(e.target.value)} />
      </label>
      <label data-facts-text="">
        <span>Differentiation</span>
        <textarea rows={3} maxLength={2000} placeholder="What makes it hard to copy."
          value={differentiation} onChange={(e) => setDifferentiation(e.target.value)} />
      </label>

      {error ? <p data-error="" role="alert">{error}</p> : null}

      <div data-facts-actions="">
        <button type="submit" data-primary="" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}


/**
 * The valuation, and the way in to producing one.
 *
 * For an OWNER with no valuation this is the whole pitch: a button, and the
 * reason to press it. For an owner with one it is the number plus a way back
 * in — a valuation goes stale as the questions grow, and "update" has to be
 * one click rather than a hunt.
 *
 * A stranger sees a valuation only when it is COMPLETE. A half-answered
 * questionnaire produces a real number, and it is the right number to show
 * the person answering — but publishing it to everyone else would put a
 * figure derived from four answers next to figures derived from Amazon.
 */
function BusinessValuationStrip({
  slug,
  valuation,
  isOwner,
}: {
  slug: string;
  valuation?: BusinessValuation;
  isOwner: boolean;
}) {
  const v = valuation ?? {};
  // The backend publishes a valuation only once the questionnaire is complete
  // (see buildPublicBusiness), so anything that arrives here is publishable as
  // it stands — there is no partial case to hide in the browser.
  const hasNumber = typeof v.value === "number" && v.value > 0;

  if (!isOwner && !hasNumber) return null;

  const money = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <section data-biz-valuation="">
      <div>
        <p data-facts-legend="">Estimated value</p>
        <p data-biz-val-figure="">{hasNumber ? money(v.value as number) : "Not valued yet"}</p>
        <p data-biz-val-note="">
          {hasNumber ? (
            <>
              {v.multiple}× net profit{v.netProfitTtm ? ` of ${money(v.netProfitTtm)}` : ""} · on net
              profit, not SDE — brokers quote SDE, which is higher
            </>
          ) : (
            "Nine questions. We already know your numbers, reviews, marketplaces and niche."
          )}
        </p>
      </div>
      {isOwner ? (
        <Link to={`/business/${slug}/value`} data-biz-val-cta="">
          {hasNumber ? "Update valuation" : "Value this business"}
        </Link>
      ) : null}
    </section>
  );
}
