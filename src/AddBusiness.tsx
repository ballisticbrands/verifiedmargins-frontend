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
/**
 * Two surfaces, one flow.
 *
 * `open` is the flow itself. `promptUnlock` is the SMALL step in front of it,
 * shown when someone reaches for something they have not earned — a locked
 * window on a profile or a business page.
 *
 * 🚨 THE PROMPT IS NOT THE FLOW, and the distinction is the point. Dropping a
 * seven-field Amazon-access wizard on someone who clicked "Last 7 days" is an
 * answer to a question they did not ask; it reads as a paywall ambush and the
 * honest version costs one click. So the locked pick opens a sentence and a
 * button, and the button opens the wizard.
 *
 * Both live here, above the router, because the same two surfaces are reached
 * from unrelated places (the rail's button, /verify, and now every window
 * picker on the site).
 */
const AddBusinessContext = createContext<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** The interstitial: "Add your business to unlock all business data". */
  unlockOpen: boolean;
  promptUnlock: () => void;
  closeUnlock: () => void;
}>({
  isOpen: false,
  open: () => {},
  close: () => {},
  unlockOpen: false,
  promptUnlock: () => {},
  closeUnlock: () => {},
});

export function AddBusinessProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  /* Opening the flow always dismisses the prompt — they are two steps of one
     journey, never two dialogs stacked on each other. Written here rather
     than at the prompt's button so ANY route into the flow leaves no orphan
     dialog behind it. */
  const open = useCallback(() => {
    setUnlockOpen(false);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const promptUnlock = useCallback(() => setUnlockOpen(true), []);
  const closeUnlock = useCallback(() => setUnlockOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, open, close, unlockOpen, promptUnlock, closeUnlock }),
    [isOpen, open, close, unlockOpen, promptUnlock, closeUnlock],
  );
  return <AddBusinessContext.Provider value={value}>{children}</AddBusinessContext.Provider>;
}

export function useAddBusiness() {
  return useContext(AddBusinessContext);
}
