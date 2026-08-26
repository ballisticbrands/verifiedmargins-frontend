/* ═══════════════════════════════════════════════════════════════════════
 * 🚨 DEMO CODE — DELETE THIS ENTIRE FILE WHEN THE DEMO IS OVER 🚨
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Built 2026-08-25 to show a potential client what a VerifiedMargins profile
 * COULD do. None of it is real: the consultation takes no payment, books
 * nothing and tells nobody, the calendar is a static month with plausible
 * slots, and the reviews are invented.
 *
 * It renders for exactly ONE username (DEMO_USERNAME below) and returns null
 * everywhere else, so every other profile on the site is untouched.
 *
 * ── HOW TO REMOVE IT (three places, all greppable for "DEMO_PROFILE") ──
 *   1. Delete this file (src/demo/).
 *   2. src/pages/PublicProfile.tsx — drop the <ConsultationDemo> line and
 *      its import.
 *   3. src/globals.css — delete the block headed "DEMO_PROFILE".
 * Nothing else in the app knows this exists. The shared package was
 * deliberately NOT touched: demo scaffolding must never reach a package four
 * other brands install.
 *
 * ── WHY A PORTAL ──
 * The profile page is rendered by <PublicProfilePage> from the shared
 * package, and this belongs between the socials and the dashboard — inside
 * that component's markup. Rather than add a slot prop to a shared package
 * for a throwaway, it portals into a node inserted after the socials section
 * the shared page already marks (`[data-profile-socials]`).
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** The only profile this renders on. */
const DEMO_USERNAME = "ggballas";

const CONSULTATION_PRICE = "$150";

/** Fake social proof. The numbers are internally consistent on purpose —
 *  13 × $150 = $1,950 — because a client who does the arithmetic and finds
 *  it wrong stops believing the rest of the page. */
const STATS = {
  consultations: 13,
  rating: 4.5,
  comments: 9,
  earned: "$1,950",
};

/** Slots are fixed, not generated from "now" — a demo that shows different
 *  availability every time it is opened invites questions about the booking
 *  system, which does not exist. */
const SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

/** Two stacked rows of stars, the filled one clipped to the rating. Cheaper
 *  and sharper than half-star SVG paths, and it degrades to plain glyphs if
 *  the CSS is stripped.
 *
 *  Ink, not gold: green here means VERIFIED, and a rating is not a
 *  verification, so it must not borrow the badge colour. */
function Stars({ rating }: { rating: number }) {
  return (
    <span data-demo-stars="" role="img" aria-label={`${rating} out of 5`}>
      <span data-demo-stars-empty="" aria-hidden="true">★★★★★</span>
      <span
        data-demo-stars-full=""
        aria-hidden="true"
        style={{ width: `${(rating / 5) * 100}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

/** A fixed month grid. Weekends and past days are disabled so it reads like a
 *  real scheduler without pretending to know anything about availability. */
function monthGrid(year: number, month: number): Array<number | null> {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first + 6) % 7; // Monday-first
  return [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

export function ConsultationDemo({ username }: { username: string }) {
  const isDemo = username.trim().toLowerCase() === DEMO_USERNAME;
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(false);

  useEffect(() => {
    if (!isDemo) return;
    let node: HTMLDivElement | null = null;
    let cancelled = false;
    const attach = () => {
      if (cancelled || node) return true;
      /* Anchored to the SOCIALS section: the layout is name → bio →
       * businesses → socials → consultation → dashboard. Falls back to the
       * header for a profile with no links at all. */
      const anchor =
        document.querySelector("[data-profile-socials]") ??
        document.querySelector("[data-profile-head]");
      if (!anchor?.parentElement) return false;
      node = document.createElement("div");
      node.setAttribute("data-demo-profile-extras", "");
      anchor.parentElement.insertBefore(node, anchor.nextSibling);
      setHost(node);
      document.body.setAttribute("data-demo-profile", "");
      return true;
    };
    // The shared page renders after its own fetch resolves, so poll briefly
    // rather than assume the anchor exists on first paint.
    if (!attach()) {
      const t = window.setInterval(() => attach() && window.clearInterval(t), 120);
      window.setTimeout(() => window.clearInterval(t), 6_000);
    }
    return () => {
      cancelled = true;
      node?.remove();
      document.body.removeAttribute("data-demo-profile");
    };
  }, [isDemo]);

  if (!isDemo || !host) return null;

  return createPortal(
    <div data-demo-extras="">
      <div data-demo-actions="">
        <button type="button" data-demo-primary="" onClick={() => setOpen(true)}>
          Consultation — {CONSULTATION_PRICE}
        </button>
      </div>
      {/* Social proof sits UNDER the price, small: it qualifies the button
          rather than competing with it. */}
      <div data-demo-proof-row="">
        <span data-demo-proof="">
          <span data-demo-stat="">
            <b>{STATS.consultations}</b> consultations
          </span>
          <span data-demo-sep="" aria-hidden="true">·</span>
          <Stars rating={STATS.rating} />
          <b data-demo-rating="">{STATS.rating.toFixed(1)}</b>
          <span data-demo-sep="" aria-hidden="true">·</span>
          <button type="button" data-demo-link="" onClick={() => setComments(true)}>
            {STATS.comments} comments
          </button>
          <span data-demo-sep="" aria-hidden="true">·</span>
          <span data-demo-stat="">
            <b>{STATS.earned}</b> earned
          </span>
        </span>
      </div>
      {open ? <SchedulerDialog onClose={() => setOpen(false)} /> : null}
      {comments ? <CommentsDialog onClose={() => setComments(false)} /> : null}
    </div>,
    host,
  );
}

/** Fake reviews. Deliberately short, specific and unglowing — five-star
 *  raves read as invented, which is the opposite of what a demo for a
 *  verification product wants. */
const COMMENTS = [
  { who: "@northgate", when: "Aug 2026", stars: 5,
    text: "Went through my ad spend line by line. Found £4k of wasted spend in 20 minutes." },
  { who: "@saltwater", when: "Jul 2026", stars: 4,
    text: "Useful on sourcing. Wanted more on EU VAT, which was outside his lane — he said so up front." },
  { who: "@bellweather", when: "Jul 2026", stars: 5,
    text: "Straight answers, no upsell at the end." },
];

function CommentsDialog({ onClose }: { onClose: () => void }) {
  return (
    <div data-demo-backdrop="" role="dialog" aria-modal="true" aria-label="Consultation reviews">
      <div data-demo-modal="">
        <div data-demo-modal-head="">
          <strong>Reviews</strong>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p data-demo-price="">
          {STATS.consultations} consultations · {STATS.rating.toFixed(1)} average
        </p>
        <ul data-demo-comments="">
          {COMMENTS.map((c) => (
            <li key={c.who}>
              <span data-demo-comment-head="">
                <b>{c.who}</b>
                <Stars rating={c.stars} />
                <span data-demo-when="">{c.when}</span>
              </span>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
        <p data-demo-hint="">Demo only. These reviews are invented.</p>
      </div>
    </div>
  );
}

function SchedulerDialog({ onClose }: { onClose: () => void }) {
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const today = now.getUTCDate();
  const cells = monthGrid(year, month);
  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div data-demo-backdrop="" role="dialog" aria-modal="true" aria-label="Book a consultation">
      <div data-demo-modal="">
        <div data-demo-modal-head="">
          <strong>Book a consultation</strong>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>

        {booked ? (
          <div data-demo-booked="">
            <p>
              <strong>
                {monthLabel.split(" ")[0]} {day} at {slot}
              </strong>
            </p>
            <p>A calendar invite would land in your inbox. Nothing was charged.</p>
            <button type="button" data-demo-primary="" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p data-demo-price="">
              45 minutes · {CONSULTATION_PRICE}
            </p>

            <p data-demo-month="">{monthLabel}</p>
            <div data-demo-cal="">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} data-demo-dow="">{d}</span>
              ))}
              {cells.map((d, i) => {
                if (d === null) return <span key={`b${i}`} />;
                const date = new Date(Date.UTC(year, month, d)).getUTCDay();
                const disabled = d < today || date === 0 || date === 6;
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={disabled}
                    aria-pressed={day === d}
                    data-demo-day=""
                    onClick={() => { setDay(d); setSlot(null); }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {day ? (
              <div data-demo-slots="">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={slot === s}
                    data-demo-slot=""
                    onClick={() => setSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <p data-demo-hint="">Pick a day.</p>
            )}

            <button
              type="button"
              data-demo-primary=""
              disabled={!day || !slot}
              onClick={() => setBooked(true)}
            >
              Book — {CONSULTATION_PRICE}
            </button>
            <p data-demo-hint="">Demo only. No payment is taken.</p>
          </>
        )}
      </div>
    </div>
  );
}
