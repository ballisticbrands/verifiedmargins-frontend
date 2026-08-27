import { useEffect, useMemo, useRef, useState } from "react";

/**
 * "Book a consultation" — a demo of a feature the product does not have.
 *
 * Lives in src/demo/ rather than src/components/ on purpose: nothing outside a
 * /demo/<slug> page may import it, because shipping a booking button that takes
 * no booking is worse than having none. The disclaimer line is not decoration —
 * it is the only thing separating this from a payment flow that silently fails.
 */

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:30"];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export interface ConsultationModalProps {
  name: string;
  priceLabel: string;
  minutes: number;
  onClose: () => void;
}

export function ConsultationModal({ name, priceLabel, minutes, onClose }: ConsultationModalProps) {
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    /* The page behind a modal must not scroll under it. */
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  /* Real current month, so the demo never shows a stale calendar. Monday-first
     to match the reference design. */
  const { label, cells, today, daysInMonth } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7; // Sun=0 → Monday-first
    const count = new Date(year, month + 1, 0).getDate();
    return {
      label: first.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      cells: [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)],
      today: now.getDate(),
      daysInMonth: count,
    };
  }, []);

  const canBook = day !== null && slot !== null;

  return (
    <div data-demo-overlay="" onClick={onClose} role="presentation">
      <div
        data-demo-modal=""
        role="dialog"
        aria-modal="true"
        aria-label={`Book a consultation with ${name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div data-demo-modal-head="">
          <h2>{booked ? "You're booked" : "Book a consultation"}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {booked ? (
          <div data-demo-booked="">
            <p data-demo-booked-line="">
              {label.split(" ")[0]} {day} at {slot} — {minutes} minutes with {name}.
            </p>
            <p>
              A calendar invite would land in your inbox, and {name.split(" ")[0]} would see the
              agenda you wrote.
            </p>
            <button type="button" data-demo-primary="" onClick={onClose}>
              Done
            </button>
            <p data-demo-disclaimer="">Demo only. Nothing was booked and no payment is taken.</p>
          </div>
        ) : (
          <>
            <p data-demo-sub="">
              {minutes} minutes · {priceLabel}
            </p>
            <p data-demo-month="">{label}</p>
            <div data-demo-weekdays="">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div data-demo-grid="">
              {cells.map((d, i) =>
                d === null ? (
                  <span key={`p${i}`} />
                ) : (
                  <button
                    key={d}
                    type="button"
                    disabled={d < today}
                    data-selected={d === day ? "" : undefined}
                    onClick={() => {
                      setDay(d);
                      setSlot(null);
                    }}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>

            {day === null ? (
              <p data-demo-hint="">Pick a day.</p>
            ) : (
              <>
                <p data-demo-hint="">
                  {label.split(" ")[0]} {day}
                  {day === daysInMonth ? "" : ""} — pick a time.
                </p>
                <div data-demo-slots="">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      data-selected={s === slot ? "" : undefined}
                      onClick={() => setSlot(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              data-demo-primary=""
              disabled={!canBook}
              onClick={() => setBooked(true)}
            >
              Book — {priceLabel}
            </button>
            <p data-demo-disclaimer="">Demo only. No payment is taken.</p>
          </>
        )}
      </div>
    </div>
  );
}
