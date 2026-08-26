import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * The display currency, for the whole site.
 *
 * Every figure on VerifiedMargins is stored in the currency it was earned in
 * and converted only at render (plan §7) — a seller with a EUR marketplace
 * and a USD one has no single native currency, and inventing one would be a
 * lie about the numbers. So "which currency am I reading this in?" is a
 * property of the READER, not of the profile, and it belongs in the site
 * chrome rather than on any one page.
 *
 * It is a preference, so it persists: a reader in London who switched to GBP
 * once should not have to do it again on the next profile they open.
 */

/** Plan §7: USD is the default display currency, everywhere. */
export const DEFAULT_CURRENCY = "USD";

/* The codes the backend's rate table carries (services/profiles/fx.ts). Kept
 * as a literal rather than fetched: the picker has to render before any
 * payload arrives, and a control that appears a beat late is worse than one
 * that occasionally offers a code this particular profile can't convert —
 * that case is already reported honestly on the page ("No rate for X — those
 * markets are shown in their own currency"). */
export const CURRENCIES: { code: string; symbol: string }[] = [
  { code: "USD", symbol: "US$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "AU$" },
  { code: "JPY", symbol: "¥" },
  { code: "MXN", symbol: "MX$" },
  { code: "BRL", symbol: "R$" },
  { code: "INR", symbol: "₹" },
  { code: "SEK", symbol: "kr" },
  { code: "PLN", symbol: "zł" },
  { code: "SGD", symbol: "S$" },
  { code: "AED", symbol: "AED" },
  { code: "TRY", symbol: "₺" },
];

const STORAGE_KEY = "vm.currency";

const CurrencyContext = createContext<{ currency: string; setCurrency: (c: string) => void }>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    // Storage can throw outright (private windows, blocked site data) and can
    // hold anything at all — including a code we have since dropped from the
    // rate table. Neither may take down a public page.
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CURRENCIES.some((c) => c.code === saved)) return saved;
    } catch {
      /* no storage: the default is the answer */
    }
    return DEFAULT_CURRENCY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      /* the choice still holds for this page view */
    }
  }, [currency]);

  const setCurrency = useCallback((c: string) => setCurrencyState(c), []);
  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
