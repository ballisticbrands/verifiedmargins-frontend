import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthDivider,
  Button,
  GoogleSignInButton,
  Input,
  Label,
  Turnstile,
  useBrand,
  useMagicLinkForm,
} from "@ballisticbrands/frontend-shared";
import { config } from "@/lib/config";
import { Shell } from "./Shell";

/**
 * The ONE auth page. Continue with Google, or type an email and get a
 * link — and the same page and the same submit serve a brand-new
 * visitor and a returning one.
 *
 * 🚨 There is no password field here, and there must never be one. The
 * split into /sign-up and /sign-in was a lie on this product: a seller
 * arriving from a profile someone shared has no idea whether they
 * already have an account, and making them pick the right door first is
 * a question we answer ourselves from the email address. The backend
 * makes that real — POST /v1/auth/magic-link creates the account when
 * the address is unknown, and returns the identical `200 {}` either
 * way, so this page cannot tell (and neither can a bot).
 *
 * /sign-up and /sign-in still resolve, as redirects here: already-sent
 * emails, the LP tombstone and any live ad creative point at them.
 *
 * See skills/feature-dev/open/FEATURE_VM_2026-08-24_google-and-magic-link-only-auth
 * in the sellerconnect repo.
 */
export function Login() {
  const navigate = useNavigate();
  const brand = useBrand();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const form = useMagicLinkForm();

  useEffect(() => {
    document.title = `Sign in — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell>
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm opacity-70">
        New here or coming back — same button.
      </p>

      {/* Google first: it is one click and lands the seller straight in
          the dashboard, where the email path costs an inbox round-trip.
          Renders nothing at all when VITE_GOOGLE_CLIENT_ID is empty — so
          a missing button is almost always an unset client ID, not a bug. */}
      <div className="mt-6">
        <GoogleSignInButton
          onSuccess={() => navigate("/dashboard", { replace: true })}
          onError={setGoogleError}
        />
        {googleError ? <p className="mt-2 text-sm text-red-600">{googleError}</p> : null}
      </div>
      {/* Only when Google can actually render, or the divider floats above
          nothing. */}
      {config.googleClientId ? <AuthDivider /> : null}

      {form.sent ? (
        <div className="mt-6 space-y-3">
          <h2 className="text-base font-semibold">Check your email.</h2>
          <p className="text-sm opacity-70">
            We sent a sign-in link to{" "}
            <span className="font-medium opacity-100">{form.email.trim()}</span>. It
            works once and expires in 15 minutes.
          </p>
          <p className="text-sm opacity-70">
            Nothing after a minute? Check your spam folder — and make sure the
            address above is right.
          </p>
        </div>
      ) : (
        <form onSubmit={form.onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
          </div>

          {/* Turnstile is now the ONLY thing between a bot and both our SES
              quota and unbounded account creation — this submit creates the
              account when the address is new. Do not remove it. */}
          <Turnstile onToken={form.onTurnstileToken} onExpired={form.onTurnstileExpired} />

          {form.error ? <p className="text-sm text-red-600">{form.error}</p> : null}

          <Button
            type="submit"
            disabled={form.pending || form.cooldownSeconds > 0}
            className="w-full"
          >
            {form.cooldownSeconds > 0
              ? `Try again in ${form.cooldownSeconds}s`
              : form.pending
                ? "Sending…"
                : "Email me a login link"}
          </Button>

          <p className="text-sm opacity-70">
            No password to remember, and none to lose.
          </p>
        </form>
      )}
    </Shell>
  );
}
