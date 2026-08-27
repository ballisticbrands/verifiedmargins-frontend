import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ApiError,
  GoogleSignInButton,
  SESSION_KEY,
  Turnstile,
  fetchConnectionOptions,
  getSessionToken,
  linkConnection,
  listProfiles,
  openOAuthPopup,
  pollUntilClosed,
  readOAuthResult,
  requestProfileSnapshot,
  startConnection,
  useBrand,
  useMagicLinkForm,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { config } from "@/lib/config";

/**
 * The onboarding flow, entire.
 *
 * Everything a stranger has to do to get a verified business onto this site
 * happens in this one dialog: pick how they will prove their numbers, prove
 * them, say who they are, and land. It replaces the old path — a nav link to
 * an empty /verify page, or the sign-in page followed by a hunt through
 * settings — which asked someone to commit before showing them anything.
 *
 * 🚧 PLACEHOLDER NUMBERS. The visitor counts are constants (see below). They
 * are social proof, which means a wrong one is not a cosmetic bug — it is a
 * claim we cannot back. Wire them to something real before this gets traffic
 * worth quoting.
 */

/** 🚧 Placeholder. Replace with a real "online now"/today figure. */
const VISITORS_TODAY = 342;
/** 🚧 Placeholder. Replace with the real monthly audience. */
const MONTHLY_VISITORS = "20k";

type BusinessType = "amazon_fba";
type Method = "connect" | "call" | "sellerboard";

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  // One option today. It stays a <select> rather than becoming a fixed line
  // of text because the next one (Shopify, wholesale) is a data change, not
  // a layout change.
  { value: "amazon_fba", label: "Amazon FBA" },
];

/**
 * The three ways to prove a number, strongest first.
 *
 * `qualifier` is the honest label on each, and "Poor verification" is
 * deliberately unflattering: a reader deciding whether to believe a profile
 * is the whole product, so the weakest method has to SAY it is the weakest
 * at the moment someone picks it, not in small print afterwards.
 *
 * ⚠️ A native <option> cannot carry styled text, so the qualifier appears in
 * the option label in parentheses AND under the select, where it can be small
 * and muted. Rebuilding this as a custom listbox to style one word would cost
 * the keyboard and mobile behaviour a native select gives for free.
 */
const METHODS: {
  value: Method;
  label: string;
  price: string;
  qualifier?: string;
  blurb: string;
  /** What connecting CANNOT do. First, and longer than the ✅ list, because
   *  the hesitation this screen has to answer is "what are you going to do
   *  inside my account" — not "what do you offer". */
  cannot?: string[];
  does?: string[];
  /** Selectable so it can advertise itself, but the flow refuses to advance.
   *  A "coming soon" option that silently accepts a submission is worse than
   *  no option at all. */
  disabled?: boolean;
}[] = [
  {
    value: "connect",
    label: "Connect Seller Central",
    price: "Free",
    qualifier: "Recommended",
    blurb:
      "Your sales, fees and ad spend come straight from Amazon — nothing typed in, nothing to " +
      "take our word for. Amazon grants us three READ-ONLY roles and nothing else: Finance and " +
      "Accounting, Selling Partner Insights, and Inventory and Order Tracking.",
    cannot: [
      "Change your prices, listings, inventory or ad campaigns",
      "Create, cancel, refund or edit a single order",
      "Message your customers, or see who they are",
      "Reach your bank details, tax documents or payout settings",
      "See your suppliers, or what you pay them",
    ],
    does: [
      "Reads the same three read-only roles Amazon shows you on the consent screen",
      "Publishes revenue, profit and margin — and only the ones you switch on",
      "Never names your store, brands, ASINs or products; business names show as hidden",
      "Lets you unpublish, disconnect or delete the whole thing at any time",
    ],
  },
  {
    value: "sellerboard",
    label: "Connect to SellerBoard",
    price: "Coming soon",
    disabled: true,
    blurb: "Coming soon!",
  },
  {
    value: "call",
    label: "Video call verification",
    price: "$20",
    blurb:
      "Fifteen minutes on a call, screen-sharing your Seller Central so we can " +
      "see the figures ourselves. We'll send a booking link once you're in.",
  },
];

/** The wizard's steps.
 *
 * `details` always runs; `claim` is for signed-OUT visitors only. There is no
 * third step: a claimed profile is editable in place on the seller's own page
 * (the x.com model — see PublicProfile.tsx), so asking for a bio and handles
 * inside a modal would be a second, worse editor for fields they are about to
 * be looking at anyway.
 */
type Step = "details" | "claim";

export function AddBusinessModal({ onClose }: { onClose: () => void }) {
  const { status, refresh } = useSession();
  const signedIn = status === "authenticated";

  const [step, setStep] = useState<Step>("details");
  const [businessType, setBusinessType] = useState<BusinessType>("amazon_fba");
  const [method, setMethod] = useState<Method>("connect");
  const [marginPct, setMarginPct] = useState("");
  /* 🚧 The 6-digit code is UI only — nothing sends one. See
     FEATURE_VM_2026-08-28_email-six-digit-code in the sellerconnect repo's
     skills/feature-dev/draft/. Kept in state so the shape is right for
     whoever wires it. */
  const [code, setCode] = useState("");
  /* Lifted out of ConnectSellerCentral: the footer's enablement depends on it,
     and "Add your business" must not be pressable for a business that was
     never actually verified. */
  const [connected, setConnected] = useState(false);
  /* The slug of the business they just connected, when we could resolve it.
     Null through the whole flow for the methods that connect nothing (a video
     call, SellerBoard), which is why `finish` still has its profile
     fallbacks — this is a better landing, not the only one. */
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  /* Set when Connect sent a signed-out visitor to `claim` just to get a
     session. They came here to connect, so claiming returns them to `details`
     to finish that — not onward to `identity`. */
  const [resumeConnect, setResumeConnect] = useState(false);
  /* Bumped when that return trip lands. Handed to ConnectSellerCentral, which
     fires Amazon's OAuth on sight of a non-zero value.

     🚨 Returning to `details` is NOT the fix on its own, and shipping only
     that is the bug this counter exists to close: someone who clicked
     "Connect Seller Central", was detoured through the claim step and then
     dropped back on step 1 has to find and press the SAME button a second
     time to get what they asked for the first time. From their side the click
     did nothing. So the wizard presses it for them. */
  const [autoConnect, setAutoConnect] = useState(0);

  const ref = useRef<HTMLDialogElement>(null);
  const magic = useMagicLinkForm();

  /* A real <dialog>: the backdrop, the focus trap and Esc-to-close come with
     it, which is three things not to get wrong on a surface that asks for
     Amazon access. `close` is a native event, so it is listened for natively
     rather than through React's synthetic system. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    const handle = () => onClose();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  /* `refresh` is a fresh closure every render, so the listener below reads it
     through a ref — as a dependency it would re-bind on every keystroke. */
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  /* The sign-in that finishes the claim step usually happens in ANOTHER TAB.
   *
   * The emailed link opens `/magic?token=…` wherever the mail app sends it,
   * that page redeems the token and writes the session to localStorage, and
   * then navigates itself to the dashboard. This tab — the one holding the
   * half-finished wizard — is never told. `useSession` reads /me once on
   * mount, so without this the modal sits on "Check your email" forever and
   * the return trip below can never run.
   *
   * A `storage` event fires only in the OTHER documents of an origin, which
   * is exactly the case that needs it, and only when the value actually
   * changed — so this is a listener, not a poll. Scoped to the session key so
   * an unrelated write (the currency preference, the draft stash) doesn't
   * trigger a round trip.
   */
  useEffect(() => {
    if (signedIn) return;
    const onStorage = (e: StorageEvent) => {
      // `key` is null when the other tab called clear(); nothing to adopt.
      if (e.key && e.key !== SESSION_KEY) return;
      if (getSessionToken()) refreshRef.current();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [signedIn]);

  const chosen = METHODS.find((m) => m.value === method)!;

  /* Margin is the one figure this whole site is about, so it is required
     whatever method you pick — and a percentage that isn't one is not a
     field to "validate later". */
  const marginValid = useMemo(() => {
    if (marginPct.trim() === "") return false;
    const n = Number(marginPct);
    return Number.isFinite(n) && n > -100 && n <= 100;
  }, [marginPct]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(magic.email.trim());

  /* One button, three meanings — so what enables it is per-step. A disabled
     method blocks `details` outright: the option exists to be seen, not
     submitted. */
  const canAdvance = (() => {
    if (step === "details") {
      /* Each method earns the button differently. Connect must actually have
         completed Amazon's OAuth — the whole claim of this route is that the
         figures were not typed in, so a business added without connecting
         would be exactly the thing the site says it does not accept. The
         other two have nothing behind them yet and say so. */
      if (method === "connect") return connected && marginValid;
      return false;
    }
    return emailValid && !magic.pending; // claim
  })();

  const navigate = useNavigate();

  function stash() {
    /* 🚧 NOTHING PERSISTS THE ANSWERS YET. There is no endpoint that takes a
       business type, a method and a margin as one object, and "profit margin
       %" in particular has no honest home: the backend's blended figure is
       COGS as a share of revenue, and writing (100 − margin) into it would
       silently invent a number. So the draft is stashed where the next step
       can pick it up, and the flow does the part that IS real. */
    try {
      localStorage.setItem(
        "vm.addBusiness.draft",
        JSON.stringify({ businessType, method, marginPct }),
      );
    } catch {
      /* a private window costs the draft, not the signup */
    }
  }

  /** Where a finished flow lands, best destination first.
   *
   * 1. `/business/<slug>` — the business they JUST added, which is the thing
   *    they came here to make and the thing they will want to share. It can
   *    say "not live yet" for the first few hours (the page resolves that
   *    for its owner and only for its owner), which is still a truthful
   *    answer about the business they created rather than a detour.
   * 2. `/<username>` — their whole portfolio, when the flow connected
   *    nothing (a video call, SellerBoard) but we resolved their handle.
   * 3. `/profile` — the resolver route, when we know neither. A signed-in
   *    seller adding a second business never visits the claim step, so never
   *    learns their handle here.
   */
  function finish(username?: string) {
    stash();
    ref.current?.close();
    navigate(businessSlug ? `/business/${businessSlug}` : username ? `/${username}` : "/profile");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdvance) return;

    if (step === "details") {
      // Someone already signed in has answered both later steps.
      if (signedIn) {
        finish();
        return;
      }
      stash();
      setStep("claim");
      return;
    }

    {
      /* The real work: this CREATES the account when the address is new, and
         the backend answers identically either way — so neither this code nor
         a bot can tell a new visitor from a returning one. That is also why
         the next step cannot be chosen here; see the effect below, which
         advances once a session actually exists. */
      void magic.onSubmit(e);
    }
  }

  /* Where a returning visitor and a brand-new one part company.
   *
   * The backend deliberately answers sign-in IDENTICALLY for both — that is
   * what stops this form being an oracle for "does this address have an
   * account". So the submit result cannot tell us, and asking it to would
   * undo a deliberate property.
   *
   * `GET /v1/profiles` can: it returns only the caller's OWN profiles, so an
   * empty list means "nothing to claim yet" without disclosing anything about
   * anyone else. Empty ⇒ finish setting them up (`identity`). Non-empty ⇒ they
   * are already somebody here, and re-asking their name would be the form that
   * makes them close the tab.
   *
   * A failed call falls through to `identity` rather than to `finish`: the
   * worst case there is one extra optional screen, where the other way round
   * silently skips profile setup for someone who has none.
   */
  useEffect(() => {
    if (step !== "claim" || !signedIn) return;
    let cancelled = false;
    listProfiles()
      .then((mine) => {
        if (cancelled) return;
        const first = mine[0];
        if (resumeConnect) {
          // They came to connect; a session was only ever the prerequisite.
          // Back to `details` AND straight on to Amazon — see `autoConnect`.
          setResumeConnect(false);
          setStep("details");
          setAutoConnect((n) => n + 1);
          return;
        }
        /* Straight to their own page, new seller or returning. The brand
           declares autoCreateProfile, so claiming created a Profile — a brand
           new one is empty, and empty is fine: that page IS the editor. */
        finish(first?.username);
      })
      .catch(() => {
        /* Cannot tell which profile is theirs — the resolver route can. */
        if (!cancelled) finish();
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, step]);

  return (
    <dialog ref={ref} aria-labelledby="add-business-title" data-add-business="">
      <button
        type="button"
        onClick={() => ref.current?.close()}
        aria-label="Close"
        data-add-business-dismiss=""
      >
        ✕
      </button>

      {/* The scrolling body IS the form, so the fixed footer's button can
          submit it from outside via `form=` — and so Enter in any field does
          what Enter should. */}
      <form id="add-business-form" onSubmit={submit} data-add-business-scroll="">
        <header data-add-business-head="">
          <h2 id="add-business-title">
            {step === "details" ? "Add your business" : "Claim your business"}
          </h2>
          {/* 🚧 Placeholder count. The dot pulses because "today" is a live
              claim; if the number ever stops being live, drop the dot. */}
          {step === "details" ? (
            <span data-live-pill="">
              <span data-live-dot="" aria-hidden="true" />
              {VISITORS_TODAY} visitors today
            </span>
          ) : null}
        </header>

        {step === "details" ? (
          <>
            <p data-add-business-pitch="">
              Showcase your numbers to <strong>{MONTHLY_VISITORS} monthly visitors</strong>.
              It&rsquo;s free!
            </p>

            <section data-add-business-section="">
              <h3>Choose your verification method</h3>

              <label data-field="">
                <span>Business type</span>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                >
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>

              <label data-field="">
                <span>Method</span>
                <select
                  data-method-select=""
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                >
                  {METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label} — {m.price}
                      {m.qualifier ? ` (${m.qualifier})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <p data-method-blurb="">{chosen.blurb}</p>

              {/* The ❌ list comes first and runs longer than the ✅ one. The
                  question this screen exists to answer is "what can you do
                  inside my account", and answering it with benefits reads as
                  a dodge. */}
              {chosen.cannot ? (
                <div data-permissions="">
                  <p data-permissions-head="">Connecting does NOT let VerifiedMargins:</p>
                  <ul data-perm-list="" data-tone="no">
                    {chosen.cannot.map((line) => (
                      <li key={line}>
                        <span aria-hidden="true">❌</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p data-permissions-head="">What it actually does:</p>
                  <ul data-perm-list="" data-tone="yes">
                    {(chosen.does ?? []).map((line) => (
                      <li key={line}>
                        <span aria-hidden="true">✅</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {chosen.disabled ? (
                <p data-field-note="" role="status">
                  Not available yet — pick another method to continue.
                </p>
              ) : null}

              {method === "connect" ? (
                <>
                  <ConnectSellerCentral
                    autoStart={autoConnect}
                    onConnected={(slug) => {
                      setConnected(true);
                      // Null for a flow that connected nothing — `finish`
                      // falls back to the profile in that case.
                      setBusinessSlug(slug ?? null);
                    }}
                    onNeedsAccount={() => {
                      setResumeConnect(true);
                      setStep("claim");
                    }}
                  />

                  {/* Only this method asks for a margin. SellerBoard will carry
                      the cost data itself, and the call reads the figures off a
                      screen share — typing one in either case would be a number
                      nobody verified. */}
                  <label data-field="">
                    <span>Enter your profit margin %</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={-99}
                      max={100}
                      step="0.1"
                      placeholder="e.g. 24"
                      value={marginPct}
                      onChange={(e) => setMarginPct(e.target.value)}
                      required
                    />
                  </label>
                </>
              ) : null}

              {method === "call" ? (
                /* 🚧 Inert. There is no scheduler behind it — see the demo
                   page's ConsultationModal for the shape one would take. */
                <button type="button" data-book-call="" onClick={() => {}}>
                  Book your call
                </button>
              ) : null}
            </section>
          </>
        ) : null}

        {step === "claim" ? (
          <section data-add-business-section="">
            <p data-add-business-pitch="">
              {resumeConnect
                ? "Amazon needs an account to connect to. Claim yours and we'll take you straight back to connect."
                : "Your business is ready. Claim it so it's yours to edit, publish and unpublish."}
            </p>

            {magic.sent ? (
              <>
                {/* 🚧 UI ONLY — nothing sends a code. The magic LINK behind
                    this submit is what actually arrives today, so the copy
                    must not promise digits that never come. Brief:
                    FEATURE_VM_2026-08-28_email-six-digit-code. */}
                <p data-status="" role="status">
                  Check your email — we sent a sign-in link to{" "}
                  <strong>{magic.email.trim()}</strong>. It works once and expires in 15 minutes.
                </p>
                <label data-field="">
                  <span>Or enter the 6-digit code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    disabled
                    data-code-input=""
                  />
                </label>
                <p data-field-note="">🚧 Codes aren&rsquo;t sent yet — use the link above.</p>
              </>
            ) : (
              <>
                {/* Google first: one click, and it lands them signed in
                    without an inbox round-trip. Renders nothing when
                    VITE_GOOGLE_CLIENT_ID is unset.

                    🚨 `onSuccess` MUST refresh the session. The button stores
                    the token itself but nothing re-reads /me, so an empty
                    handler here left a seller signed in at the backend and
                    still `anonymous` to this dialog — the claim step just sat
                    there, and the return trip below never fired. */}
                <GoogleSignInButton onSuccess={() => refresh()} onError={() => {}} />
                {config.googleClientId ? <p data-or="">or</p> : null}

                <label data-field="">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={magic.email}
                    onChange={(e) => magic.setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
                <p data-field-note="">
                  We&rsquo;ll email you a 6-digit code — there is no password.
                </p>

                {/* The only thing between a bot and both our SES quota and
                    unbounded account creation: this submit CREATES the
                    account when the address is new. Do not remove it. */}
                <Turnstile onToken={magic.onTurnstileToken} onExpired={magic.onTurnstileExpired} />
                {magic.error ? (
                  <p data-error="" role="alert">
                    {magic.error}
                  </p>
                ) : null}
              </>
            )}
          </section>
        ) : null}

        <p data-add-business-terms="">
          <small>
            By adding your business, you agree to our <Link to="/tos">Terms of Service</Link>.
          </small>
        </p>
      </form>

      {/* Fixed, not scrolled away with the content: on a long form the action
          you came for should never be something you have to go looking for. */}
      <footer data-add-business-footer="">
        <button type="submit" form="add-business-form" disabled={!canAdvance} data-primary="">
          {step === "claim"
            ? magic.cooldownSeconds > 0
              ? `Try again in ${magic.cooldownSeconds}s`
              : magic.pending
                ? "Sending…"
                : "Claim business"
            : signedIn
                ? "Add another business"
                : "Add your business"}
        </button>
      </footer>
    </dialog>
  );
}

// ─── method A: connect (the real one) ────────────────────────────────

/** `armed` is the blocked-popup state: we HAVE Amazon's consent URL and the
 *  browser refused to open it for us. See `begin`. */
type Phase = "idle" | "waiting" | "armed" | "linking" | "linked";

/**
 * Amazon's OAuth, run from inside the dialog.
 *
 * 🚨 It cannot run for a signed-out visitor, and that is not a gap to paper
 * over: OAuth needs an account to attach the connection to, and there is
 * none until they finish the section below. So the button says so rather
 * than opening a popup that would fail at the callback. Signed in, it is the
 * genuine flow — authorize, link to the profile, ask for a snapshot now
 * instead of at 08:30 UTC.
 */
function ConnectSellerCentral({
  autoStart,
  onConnected,
  onNeedsAccount,
}: {
  /** Non-zero once the claim step has handed back a session that this panel
   *  asked for. Fires the consent flow without a second click — the seller
   *  already made that click, before the detour. */
  autoStart: number;
  /** Called with the new business's public slug when we could resolve it —
   *  the wizard lands on /business/<slug> rather than on the profile. */
  onConnected: (slug?: string) => void;
  /** Signed out. `POST /connect/start` 401s without a session AND signs the
   *  OAuth state with the user id — that signed state IS the ownership
   *  binding, so this cannot be worked around client-side. The wizard detours
   *  through the claim step and comes back. */
  onNeedsAccount: () => void;
}) {
  const brand = useBrand();
  const { status } = useSession();
  /* begin() reads the session AFTER an await, where the captured `status`
     would be the stale one from the render that started it. */
  const statusRef = useRef(status);
  statusRef.current = status;
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  /* Amazon's consent URL, held only while `phase === "armed"`. Keeping it is
     what makes the recovery click a bare synchronous window.open — see
     `openConsent`. The backend signs this state for 30 minutes, so a URL
     parked here is good for far longer than anyone will stare at the panel. */
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const cancelPoll = useRef<(() => void) | null>(null);

  const stopPolling = () => {
    cancelPoll.current?.();
    cancelPoll.current = null;
  };
  useEffect(() => stopPolling, []);

  const finish = useCallback(async (connectionId?: string) => {
    setPhase("linking");
    setError(null);
    if (!connectionId) {
      setPhase("linked");
      onConnected();
      return;
    }
    let slug: string | undefined;
    try {
      // Their own profile — created on signup, so there is one.
      const mine = await listProfiles();
      const profileId = mine[0]?.id;
      if (profileId) {
        try {
          await linkConnection(profileId, connectionId);
        } catch (err) {
          // Already feeding this profile is success, not failure.
          const code =
            err instanceof ApiError
              ? (err.body as { error_code?: string } | undefined)?.error_code
              : undefined;
          if (code !== "already_linked") throw err;
        }
        /* The new business's public address, so the wizard can land on the
           page it just created. Read from the caller's OWN connection list
           (owner-scoped by construction) rather than from the link response,
           which the already_linked path above never produces. `slug` is on
           the wire but not yet in the shared package's ConnectionOption type,
           so it is widened here rather than republishing the package for one
           optional field. Best-effort: without it we land on the profile. */
        try {
          const options = await fetchConnectionOptions(profileId);
          slug = (options as Array<{ id: string; slug?: string }>).find(
            (o) => o.id === connectionId,
          )?.slug;
        } catch {
          /* the profile landing is a fine fallback */
        }
        // Best-effort: a failure here costs a wait, not the connection.
        try {
          await requestProfileSnapshot(profileId);
        } catch {
          /* the nightly run covers it */
        }
      }
    } catch {
      /* Connected but unlinked. Settings can still switch it on, and saying
         "connection failed" would send them round again to make a second. */
    }
    setPhase("linked");
    /* Amazon granted consent, which is what the footer gates on. Linking to a
       profile can still have failed above — that is recoverable in Settings,
       and refusing to let them finish over it would send them back through
       Amazon to create a second connection. */
    onConnected(slug);
  }, [onConnected]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const result = readOAuthResult(event, {
        provider: "amazon-selling-partner",
        messageType: brand.oauthMessageType,
      });
      if (!result) return;
      stopPolling();
      if (result.status !== "connected") {
        setPhase("idle");
        setError(result.detail || "Amazon didn't complete the connection.");
        return;
      }
      void finish(result.connection_id);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [brand.oauthMessageType, finish]);

  /** Try to put Amazon on screen. `false` means the browser said no. */
  const openConsent = useCallback(
    (url: string) => {
      const popup = openOAuthPopup(url, `${brand.id}-spapi-verify`);
      if (!popup) return false;
      setAuthUrl(null);
      setError(null);
      setPhase("waiting");
      // Closing Amazon's consent screen sends no message at all, so without
      // this the panel waits forever.
      cancelPoll.current = pollUntilClosed(popup, () => {
        cancelPoll.current = null;
        setPhase((p) => (p === "waiting" ? "idle" : p));
      });
      return true;
    },
    [brand.id],
  );

  const begin = useCallback(async () => {
    setError(null);
    setPhase("waiting");
    const res = await startConnection("amazon-selling-partner");
    if (res.error || !res.authorization_url) {
      setPhase("idle");
      /* By now /me has resolved. If it says anonymous, the failure was the
         401 that POST /connect/start returns without a session — which is a
         detour to claim, not an error to read. Deciding from the settled
         session rather than by matching the message keeps this working if
         the backend ever rewords it. */
      if (statusRef.current === "anonymous") {
        onNeedsAccount();
        return;
      }
      setError(res.error ?? "We couldn't start the connection. Please try again.");
      return;
    }
    if (openConsent(res.authorization_url)) return;
    /* 🚨 Blocked — and on the auto-fired path that is the EXPECTED outcome,
       not the exception: every browser refuses window.open outside a user
       gesture, and returning from the claim step is not one. So a blocked
       popup is not an error message, it is a state: hold the consent URL and
       show one loud button. That click opens it with no await in front of it,
       which is the one form of window.open a popup blocker cannot touch. */
    setAuthUrl(res.authorization_url);
    setPhase("armed");
  }, [onNeedsAccount, openConsent]);

  /* The whole point of the detour: they clicked Connect BEFORE the claim
     step, so nobody should have to click it again after it. */
  const beginRef = useRef(begin);
  beginRef.current = begin;
  useEffect(() => {
    if (!autoStart) return;
    void beginRef.current();
  }, [autoStart]);

  if (phase === "linked") {
    return (
      <p data-status="" role="status">
        Connected. We&rsquo;re pulling your numbers from Amazon now — for a brand-new account that
        can take a few hours. Nothing appears publicly until you publish.
      </p>
    );
  }

  const armed = phase === "armed";

  return (
    <div data-connect="" data-armed={armed ? "" : undefined}>
      {/* 🚨 Detour ONLY when definitively anonymous.
          `useSession` has THREE states, and reading "not authenticated" as
          "signed out" makes the third one — loading — behave like the second.
          A signed-in seller who clicked before /me came back got bounced to
          the claim step instead of Amazon, which is what this button did on
          first ship. Optimistically start the connection whenever the answer
          is not yet no; the server is the authority, and begin() below routes
          to claim if it turns out there is no session after all. */}
      <button
        type="button"
        onClick={() => {
          /* Armed: nothing may be awaited here. The consent URL is already in
             hand precisely so this handler can reach window.open inside the
             click that triggered it. */
          if (armed) {
            if (authUrl && !openConsent(authUrl)) {
              setError(
                "Your browser is still blocking the Amazon window. Allow popups for this site, then try again.",
              );
            }
            return;
          }
          if (status === "anonymous") return onNeedsAccount();
          void begin();
        }}
        disabled={phase === "waiting" || phase === "linking"}
      >
        {armed
          ? "Continue to Amazon"
          : phase === "idle"
            ? "Connect Seller Central"
            : "Waiting for Amazon…"}
      </button>
      {armed ? (
        <p data-field-note="" role="status">
          You&rsquo;re signed in — this is the Amazon consent screen you asked for. Your browser
          only opens it on a tap.
        </p>
      ) : null}
      {status === "anonymous" ? (
        <p data-field-note="">
          Amazon needs an account to connect to — this takes you to claim yours first, then comes
          straight back here.
        </p>
      ) : null}
      {error ? (
        <p data-error="" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
