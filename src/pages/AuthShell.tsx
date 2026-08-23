import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";

/**
 * Minimal chrome around the auth forms.
 *
 * ⚠️ DELIBERATELY PLAIN. VerifiedMargins has no visual identity yet and is
 * deliberately NOT Dragon-branded. This is a centred column, nothing more.
 *
 * 🚨 The wordmark is ONE text node on purpose. Every Dragon frontend renders
 * its name split across two elements so a gradient can hit the second half —
 * `Dragon<span className="…bg-clip-text…">Reply</span>` — which makes the brand
 * name invisible to `grep` while still reading as the brand name in the DOM.
 * That is how an inherited parent brand shipped in the header of every page on
 * dragonrestock-frontend; only a screenshot caught it. When real branding
 * lands, keep the name in a single node.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  const brand = useBrand();
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <header className="border-b border-black/10 pb-4 dark:border-white/10">
        <Link to="/" className="text-[17px] font-bold tracking-tight">
          {brand.displayName}
        </Link>
      </header>
      <main className="flex-1 pt-8">{children}</main>
      <footer className="pt-10 text-sm opacity-60">
        <a href="https://verifiedmargins.com/privacy/">Privacy</a>
        {" · "}
        <a href="https://verifiedmargins.com/tos/">Terms</a>
      </footer>
    </div>
  );
}
