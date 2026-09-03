import { useEffect, useRef, useState } from "react";

/**
 * "Ask <seller>" — a paid question, priced per question.
 *
 * A different product from the booking modal beside it: a consultation buys
 * somebody's calendar, an answer buys their judgement on one thing. That is
 * why this has no month grid — there is nothing to schedule — and why the
 * seller sets a price per QUESTION rather than per hour.
 *
 * 🚧 Demo-only, and in src/demo/ for the same reason ConsultationModal is:
 * nothing outside a /demo/<slug> page may import it, because a Pay button that
 * takes no payment is worse than no Pay button. The disclaimer is not
 * decoration — it is the only thing separating this from a checkout that
 * silently fails.
 */
export interface AskModalProps {
  name: string;
  /** Mirrors the section's heading, so the dialog is visibly the same feature
   *  the reader just clicked. Defaults to "Ask <name>". */
  heading?: string;
  question: string;
  priceLabel: string;
  /** 🚨 Per ITEM, because "Send question — $100/mo" is nonsense on a
   *  subscription. A menu that sells more than one KIND of thing cannot share
   *  one verb. */
  cta?: string;
  sentHeading?: string;
  sentLine?: string;
  onClose: () => void;
}

export function AskModal({
  name,
  heading,
  question,
  priceLabel,
  cta,
  sentHeading,
  sentLine,
  onClose,
}: AskModalProps) {
  const [sent, setSent] = useState(false);
  const [detail, setDetail] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const first = name.split(" ")[0];
  const title = heading ?? `Ask ${name}`;

  return (
    <div data-demo-overlay="" onClick={onClose} role="presentation">
      <div
        data-demo-modal=""
        role="dialog"
        aria-modal="true"
        aria-label={`${title}: ${question}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div data-demo-modal-head="">
          <h2>{sent ? (sentHeading ?? "Question sent") : title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {sent ? (
          <div data-demo-booked="">
            <p data-demo-booked-line="">{question}</p>
            <p>
              {sentLine ??
                `${first} answers in writing, usually within a day or two. You are charged only when the answer lands — if he passes on the question, you are not.`}
            </p>
            <button type="button" data-demo-primary="" onClick={onClose}>
              Done
            </button>
            <p data-demo-disclaimer="">Demo only. Nothing was sent and no payment is taken.</p>
          </div>
        ) : (
          <>
            <p data-demo-sub="">
              {question} · {priceLabel}
            </p>
            <label data-demo-ask-label="" htmlFor="vm-ask-detail">
              Anything {first} needs to know
            </label>
            <textarea
              id="vm-ask-detail"
              data-demo-ask-detail=""
              rows={4}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Your product, your numbers, what you have already tried…"
            />
            <button type="button" data-demo-primary="" onClick={() => setSent(true)}>
              {cta ?? `Send question — ${priceLabel}`}
            </button>
            <p data-demo-disclaimer="">Demo only. No payment is taken.</p>
          </>
        )}
      </div>
    </div>
  );
}
