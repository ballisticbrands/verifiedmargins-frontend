import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateProfile,
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
    blurb:
      "Not built yet. SellerBoard already holds the cost data most sellers keep out of Seller " +
      "Central, so this will verify margin without a COGS upload — but nothing behind it works " +
      "today, and we would rather say so than take a signup we cannot honour.",
  },
  {
    value: "call",
    label: "Video call verification",
    price: "$20",
    blurb:
      "🚧 Placeholder. Fifteen minutes on a call, screen-sharing your Seller Central so we can " +
      "see the figures ourselves. We'll send a booking link once you're in.",
  },
];

/** The wizard's steps.
 *
 * `details` always runs. `claim` and `identity` are for signed-OUT visitors
 * only — someone already signed in has answered both, and asking again is the
 * kind of form that makes a person close the tab. A returning visitor who
 * signs in at `claim` is finished there: `identity` exists to fill in a
 * profile that does not exist yet, so it must not re-ask someone who has one.
 */
type Step = "details" | "claim" | "identity";

export function AddBusinessModal({ onClose }: { onClose: () => void }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  const [step, setStep] = useState<Step>("details");
  const [businessType, setBusinessType] = useState<BusinessType>("amazon_fba");
  const [method, setMethod] = useState<Method>("connect");
  const [marginPct, setMarginPct] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [xHandle, setXHandle] = useState("");
  const [redditHandle, setRedditHandle] = useState("");
  const [linkedinHandle, setLinkedinHandle] = useState("");
  /* 🚧 The 6-digit code is UI only — nothing sends one. See
     FEATURE_VM_2026-08-28_email-six-digit-code in the sellerconnect repo's
     skills/feature-dev/draft/. Kept in state so the shape is right for
     whoever wires it. */
  const [code, setCode] = useState("");
  /* The profile the claim step resolved. Held so `identity` knows what to
     write to and where to land afterwards, without a second round trip. */
  const [claimed, setClaimed] = useState<{ id: string; username: string } | null>(null);
  const [saving, setSaving] = useState(false);

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

  /* One button, three meanings — so what enables it is per-step. A disabled
     method blocks `details` outright: the option exists to be seen, not
     submitted. */
  const canAdvance = (() => {
    if (step === "details") return marginValid && !chosen.disabled;
    if (step === "claim") return emailValid && !magic.pending;
    return !saving; // identity: every field on it is optional
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
        JSON.stringify({
          businessType, method, marginPct, anonymous,
          xHandle, redditHandle, linkedinHandle,
        }),
      );
    } catch {
      /* a private window costs the draft, not the signup */
    }
  }

  /** Where a finished flow lands: the seller's own public page.
   *
   * Prefers the handle we already resolved — a direct /:username push, which
   * is the page they just earned. Falls back to /profile, the resolver route,
   * when the flow finished without one (a signed-in seller adding a second
   * business never visits the claim step, so never learns their handle here).
   *
   * 🚧 `/business/:slug` does not exist yet — no route, no page, no slug on
   * the backend — so a business-scoped landing is not an option today. Brief:
   * FEATURE_VM_2026-08-28_business-detail-page in the sellerconnect repo's
   * skills/feature-dev/draft/.
   */
  function finish(username?: string) {
    stash();
    ref.current?.close();
    navigate(username ? `/${username}` : "/profile");
  }

  /** Step 3 commits before it closes.
   *
   * Per-step persistence: someone who fills this in and then closes the tab
   * has still said it. The User and Profile already exist by now — the brand
   * declares `autoCreateProfile`, so the claim step created both — which is
   * why this is an update rather than a create.
   *
   * A failed save still closes the flow and still lands them on their page:
   * these fields are all optional and editable there, so blocking the exit on
   * them would be the worse trade.
   */
  async function saveIdentityAndFinish() {
    if (!claimed) return finish();
    setSaving(true);
    try {
      await updateProfile(claimed.id, {
        socials: {
          ...(xHandle.trim() ? { x: xHandle.trim() } : {}),
          ...(redditHandle.trim() ? { reddit: redditHandle.trim() } : {}),
          ...(linkedinHandle.trim() ? { linkedin: linkedinHandle.trim() } : {}),
        },
        /* "Stay anonymous" means the NAME does not appear; the handle still
           does. Google sign-in is the path that supplies a name at all, so
           this is the field it has to suppress. */
        ...(anonymous ? { display_name: null } : {}),
      });
    } catch {
      /* optional fields, editable on the profile itself — see above */
    } finally {
      setSaving(false);
      finish(claimed.username);
    }
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

    if (step === "claim") {
      /* The real work: this CREATES the account when the address is new, and
         the backend answers identically either way — so neither this code nor
         a bot can tell a new visitor from a returning one. That is also why
         the next step cannot be chosen here; see the effect below, which
         advances once a session actually exists. */
      void magic.onSubmit(e);
      return;
    }

    void saveIdentityAndFinish();
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
        if (first) finish(first.username);
        else setStep("identity");
      })
      .catch(() => {
        if (!cancelled) setStep("identity");
      })
      .then(async () => {
        /* The identity step needs a profile id to write to. autoCreateProfile
           means one exists by now; re-reading is cheaper than threading it
           through the branch above. */
        if (cancelled) return;
        try {
          const mine = await listProfiles();
          const first = mine[0];
          if (!cancelled && first) setClaimed({ id: first.id, username: first.username });
        } catch {
          /* identity will fall back to /profile */
        }
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
            {step === "details"
              ? "Add your business"
              : step === "claim"
                ? "Claim your business"
                : "Last step — who are you?"}
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
                <select value={method} onChange={(e) => setMethod(e.target.value as Method)}>
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
          </>
        ) : null}

        {step === "claim" ? (
          <section data-add-business-section="">
            <p data-add-business-pitch="">
              Your business is ready. Claim it so it&rsquo;s yours to edit, publish and unpublish.
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

        {step === "identity" ? (
          <section data-add-business-section="">
            <p data-add-business-pitch="">
              All optional. You can change any of it later from your profile.
            </p>

            {/* A switch, not a checkbox: this reads as a setting with
                consequences, and the tooltip states them rather than leaving
                "anonymous" to be guessed at. */}
            <div data-switch-row="">
              <button
                type="button"
                role="switch"
                aria-checked={anonymous}
                onClick={() => setAnonymous((v) => !v)}
                data-switch=""
              >
                <span data-switch-thumb="" aria-hidden="true" />
              </button>
              <span data-switch-label="">
                Stay anonymous
                <span data-tip="" tabIndex={0} aria-label="What staying anonymous means">
                  ?
                  <span role="tooltip" data-tip-body="">
                    Your name will NOT appear. Your handle will appear. You can still add a bio
                    and social links.
                  </span>
                </span>
              </span>
            </div>

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

            <label data-field="">
              <span>LinkedIn handle (optional)</span>
              <input
                type="text"
                placeholder="in/yourname"
                value={linkedinHandle}
                onChange={(e) => setLinkedinHandle(e.target.value)}
                autoComplete="off"
              />
            </label>
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
            : step === "identity"
              ? saving
                ? "Saving…"
                : "Finish"
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
