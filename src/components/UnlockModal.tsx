import { useEffect, useRef } from "react";
import { VerifyIcon } from "@/components/NavIcons";

/**
 * The step in FRONT of the add-business flow.
 *
 * Shown when a reader reaches for something the gate holds back — today that
 * is a locked window on a profile or a business page ("Last 7 days", "Last 12
 * months"). Before this, the locked pick opened the seven-field Amazon-access
 * wizard directly, which is an answer to a question nobody asked: they
 * pressed a date range and got a signup form. It read as a paywall ambush.
 *
 * 🚨 THIS DIALOG SELLS NOTHING AND ASKS FOR NOTHING. One sentence naming
 * exactly what the click would have done, and the site's one call to action.
 * Anything more — a feature list, a price, a second button — makes it the
 * thing in the way rather than the thing that explains, and the reader who
 * only wanted to know why the option was greyed has still been charged a
 * dialog for it.
 *
 * The button is the RAIL'S button, `data-nav-cta` and all: same shape, same
 * colour, same icon, same words. Someone who has already seen it in the
 * sidebar recognises it here as the same door rather than as a second offer.
 *
 * Native <dialog>, like AddBusinessModal — the backdrop, the focus trap and
 * Esc-to-close come from the browser, which is three things not to get wrong.
 */
export function UnlockModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    /* `close` is native — Esc and the backdrop both raise it — so it is
       listened for natively rather than through React's synthetic system. */
    const handle = () => onClose();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  return (
    <dialog ref={ref} aria-labelledby="unlock-title" data-unlock="">
      <button
        type="button"
        onClick={() => ref.current?.close()}
        aria-label="Close"
        data-add-business-dismiss=""
      >
        ✕
      </button>

      <div data-unlock-body="">
        <h2 id="unlock-title">Add your business to unlock all business data</h2>
        {/* 🚨 The label is "Add your business", NOT the rail's session-aware
            "Add another business". Whoever is looking at this has no
            connection — that is what put the lock on the option they just
            pressed — so "another" would be a claim about them that is wrong
            by construction. */}
        <button type="button" onClick={onAdd} data-nav-cta="">
          <VerifyIcon />
          <span>Add your business</span>
        </button>
      </div>
    </dialog>
  );
}
