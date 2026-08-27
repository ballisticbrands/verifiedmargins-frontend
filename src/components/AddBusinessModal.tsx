import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ApiError,
  GoogleSignInButton,
  Turnstile,
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
type Method = "connect" | "call" | "screenshot";

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
  qualifier?: string;
  /** 🚧 Placeholder copy for everything except `connect`. */
  blurb: string;
}[] = [
  {
    value: "connect",
    label: "Connect Seller Central",
    qualifier: "Recommended",
    blurb:
      "Reads your sales, fees and ad spend straight from Amazon — nothing typed in, nothing to " +
      "take our word for. We never publish anything that identifies your store, your brands or " +
      "your products.",
  },
  {
    value: "call",
    label: "Verification call",
    blurb:
      "🚧 Placeholder. Fifteen minutes on a call, screen-sharing your Seller Central so we can " +
      "see the figures ourselves. We'll send a booking link once you're in.",
  },
  {
    value: "screenshot",
    label: "Business analytics screenshot",
    qualifier: "Poor verification",
    blurb:
      "🚧 Placeholder. Upload a Business Reports screenshot and we review it by hand. It is the " +
      "weakest evidence we accept, and profiles verified this way say so.",
  },
];

export function AddBusinessModal({ onClose }: { onClose: () => void }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  const [businessType, setBusinessType] = useState<BusinessType>("amazon_fba");
  const [method, setMethod] = useState<Method>("connect");
  const [marginPct, setMarginPct] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [xHandle, setXHandle] = useState("");
  const [redditHandle, setRedditHandle] = useState("");

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
  const canSubmit = marginValid && (signedIn || emailValid) && !magic.pending;

  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    /* 🚧 NOTHING PERSISTS THE ANSWERS YET. There is no endpoint that takes a
       business type, a method and a margin as one object, and "profit margin
       %" in particular has no honest home: the backend's blended figure is
       COGS as a share of revenue, and writing (100 − margin) into it would
       silently invent a number. So the draft is stashed where the next step
       can pick it up, and the flow does the part that IS real. */
    try {
      localStorage.setItem(
        "vm.addBusiness.draft",
        JSON.stringify({ businessType, method, marginPct, anonymous, xHandle, redditHandle }),
      );
    } catch {
      /* a private window costs the draft, not the signup */
    }

    if (signedIn) {
      ref.current?.close();
      navigate("/profile");
      return;
    }
    // Signed out: the real work is creating the account. The same submit
    // serves a new visitor and a returning one — the backend answers
    // identically either way, so this cannot tell and neither can a bot.
    void magic.onSubmit(e);
  }

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
          <h2 id="add-business-title">Add your business</h2>
          {/* 🚧 Placeholder count. The dot pulses because "today" is a live
              claim; if the number ever stops being live, drop the dot. */}
          <span data-live-pill="">
            <span data-live-dot="" aria-hidden="true" />
            {VISITORS_TODAY} visitors today
          </span>
        </header>

        <p data-add-business-pitch="">
          Showcase your numbers to <strong>{MONTHLY_VISITORS} monthly visitors</strong>. It&rsquo;s
          free!
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
            <select value={method} onChange={(e) => setMethod(e.target.value as Method)}>
              {METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.qualifier ? `${m.label} (${m.qualifier})` : m.label}
                </option>
              ))}
            </select>
          </label>
          {chosen.qualifier ? <p data-field-note="">{chosen.qualifier}</p> : null}

          <p data-method-blurb="">{chosen.blurb}</p>

          {method === "connect" ? <ConnectSellerCentral signedIn={signedIn} /> : null}

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
        </section>

        {/* Signed-in sellers already told us who they are — asking again is
            the kind of form that makes someone close the tab. */}
        {!signedIn ? (
          <section data-add-business-section="">
            <h3>Who are you?</h3>

            <label data-toggle="">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span>
                Stay anonymous
                {/* 🚧 Inert. It reads as a promise, so it must not ship
                    looking finished — wire it to Profile.visibility before
                    removing this note. */}
                <small> — not wired up yet</small>
              </span>
            </label>

            <label data-field="">
              <span>X handle (optional)</span>
              <input
                type="text"
                placeholder="@yourhandle"
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                autoComplete="off"
              />
            </label>

            <label data-field="">
              <span>Reddit handle (optional)</span>
              <input
                type="text"
                placeholder="u/yourhandle"
                value={redditHandle}
                onChange={(e) => setRedditHandle(e.target.value)}
                autoComplete="off"
              />
            </label>

            {magic.sent ? (
              <p data-status="" role="status">
                Check your email — we sent a sign-in link to{" "}
                <strong>{magic.email.trim()}</strong>. It works once and expires in 15 minutes.
              </p>
            ) : (
              <>
                {/* Google first: one click, and it lands them signed in
                    without an inbox round-trip. Renders nothing when
                    VITE_GOOGLE_CLIENT_ID is unset. */}
                <GoogleSignInButton onSuccess={() => {}} onError={() => {}} />
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
                <p data-field-note="">We&rsquo;ll email you a link — there is no password.</p>

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
        <button type="submit" form="add-business-form" disabled={!canSubmit} data-primary="">
          {magic.cooldownSeconds > 0
            ? `Try again in ${magic.cooldownSeconds}s`
            : magic.pending
              ? "Sending…"
              : signedIn
                ? "Add another business"
                : "Add your business"}
        </button>
      </footer>
    </dialog>
  );
}

// ─── method A: connect (the real one) ────────────────────────────────

type Phase = "idle" | "waiting" | "linking" | "linked";

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
function ConnectSellerCentral({ signedIn }: { signedIn: boolean }) {
  const brand = useBrand();
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
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
      return;
    }
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
  }, []);

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

  async function begin() {
    setError(null);
    setPhase("waiting");
    const res = await startConnection("amazon-selling-partner");
    if (res.error || !res.authorization_url) {
      setPhase("idle");
      setError(res.error ?? "We couldn't start the connection. Please try again.");
      return;
    }
    const popup = openOAuthPopup(res.authorization_url, `${brand.id}-spapi-verify`);
    if (!popup) {
      setPhase("idle");
      setError("Your browser blocked the Amazon window. Allow popups for this site and try again.");
      return;
    }
    // Closing Amazon's consent screen sends no message at all, so without
    // this the panel waits forever.
    cancelPoll.current = pollUntilClosed(popup, () => {
      cancelPoll.current = null;
      setPhase((p) => (p === "waiting" ? "idle" : p));
    });
  }

  if (phase === "linked") {
    return (
      <p data-status="" role="status">
        Connected. We&rsquo;re pulling your numbers from Amazon now — for a brand-new account that
        can take a few hours. Nothing appears publicly until you publish.
      </p>
    );
  }

  return (
    <div data-connect="">
      <button type="button" onClick={begin} disabled={!signedIn || phase !== "idle"}>
        {phase === "idle" ? "Connect Seller Central" : "Waiting for Amazon…"}
      </button>
      {!signedIn ? (
        <p data-field-note="">
          Amazon needs an account to connect to — finish &ldquo;Who are you?&rdquo; below and this
          opens straight after.
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
