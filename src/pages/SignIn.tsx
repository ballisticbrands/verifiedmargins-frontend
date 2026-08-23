import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthDivider,
  Button,
  GoogleSignInButton,
  Input,
  Label,
  useBrand,
  useSignInForm,
} from "@ballisticbrands/frontend-shared";
import { AuthShell } from "./AuthShell";

export function SignIn() {
  const navigate = useNavigate();
  const brand = useBrand();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const form = useSignInForm({
    onSuccess: () => navigate("/dashboard", { replace: true }),
  });

  useEffect(() => {
    document.title = `Sign in — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>

      {/* The Google button must render on BOTH /sign-in and /sign-up — that is
          an explicit verify gate in the funnel playbook. */}
      <div className="mt-6">
        <GoogleSignInButton
          onSuccess={() => navigate("/dashboard", { replace: true })}
          onError={setGoogleError}
        />
        {googleError ? <p className="mt-2 text-sm text-red-600">{googleError}</p> : null}
      </div>
      <AuthDivider />

      <form onSubmit={form.onSubmit} className="mt-6 space-y-4">
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
                 autoComplete="current-password" required />
        </div>

        {form.error ? <p className="text-sm text-red-600">{form.error}</p> : null}

        <Button type="submit" disabled={form.pending} className="w-full">
          {form.pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm opacity-70">
        <Link to="/forgot-password" className="underline">Forgot your password?</Link>
      </p>
      <p className="mt-2 text-sm opacity-70">
        No account yet? <Link to="/sign-up" className="underline">Create one</Link>
      </p>
    </AuthShell>
  );
}
