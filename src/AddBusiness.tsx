import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * "Add your business" — the one way into this product.
 *
 * It is a modal rather than a page on purpose: the thing that makes someone
 * want to add their business is a profile or a leaderboard they are looking
 * at, and navigating away from it to a signup page is where they reconsider.
 * The flow opens ON TOP of whatever convinced them.
 *
 * The state lives here, above the router, because two unrelated things open
 * it: the button in the rail (every page) and the /verify route (inbound
 * links that predate the button).
 */
const AddBusinessContext = createContext<{ isOpen: boolean; open: () => void; close: () => void }>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function AddBusinessProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <AddBusinessContext.Provider value={value}>{children}</AddBusinessContext.Provider>;
}

export function useAddBusiness() {
  return useContext(AddBusinessContext);
}
