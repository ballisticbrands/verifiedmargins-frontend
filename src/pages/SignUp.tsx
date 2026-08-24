import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthDivider,
  Button,
  GoogleSignInButton,
  Input,
  Label,
  Turnstile,
  useBrand,
  useSignUpForm,
} from "@ballisticbrands/frontend-shared";
import { config } from "@/lib/config";
import { Shell } from "./Shell";

/**
 * Sign-up. Placeholder presentation; the account itself is created by the
 * shared useSignUpForm, so the auth flow is identical to the sibling brand apps.
 */
export function SignUp() {
  const navigate = useNavigate();
  const brand = useBrand();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const form = useSignUpForm({
    onSuccess: () => {
      // 🚨 Do NOT also call track("sign_up") here. The GA4 `sign_up` event (and
      // Meta CompleteRegistration) is fired exactly once by the shared
      // identifyUserAcrossPlatforms() after the post-signup /me lookup. Firing
      // it here too double-counts the conversion.
      navigate("/dashboard", { replace: true });
    },
  });

  useEffect(() => {
    document.title = `Create your account — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm opacity-70">
        Reserve your profile handle. Connecting an Amazon account does not publish
        anything — publishing is a separate, deliberate step.
      </p>

      {/* Google signup. Renders nothing at all when VITE_GOOGLE_CLIENT_ID is
          empty — so a missing button is almost always an unset client ID, not a
          bug. This path skips Turnstile (Google's own bot defenses) and skips
          email verification. */}
      <div className="mt-6">
        <GoogleSignInButton
          text="signup_with"
          onSuccess={() => navigate("/dashboard", { replace: true })}
          onError={setGoogleError}
        />
        {googleError ? <p className="mt-2 text-sm text-red-600">{googleError}</p> : null}
      </div>
      {/* Only when Google can actually render. <GoogleSignInButton> returns
          null on an empty client ID, which otherwise leaves an orphaned "OR"
          floating above the form with nothing above it. */}
      {config.googleClientId ? <AuthDivider /> : null}

      <form onSubmit={form.onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => form.setName(e.target.value)}
                 autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email}
                 onChange={(e) => form.setEmail(e.target.value)}
                 autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password}
                 onChange={(e) => form.setPassword(e.target.value)}
                 autoComplete="new-password" required />
        </div>

        <Turnstile onToken={form.onTurnstileToken} onExpired={form.onTurnstileExpired} />

        {form.error ? <p className="text-sm text-red-600">{form.error}</p> : null}

        <Button type="submit" disabled={form.pending} className="w-full">
          {form.pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm opacity-70">
        Already have an account? <Link to="/sign-in" className="underline">Sign in</Link>
      </p>
    </Shell>
  );
}
