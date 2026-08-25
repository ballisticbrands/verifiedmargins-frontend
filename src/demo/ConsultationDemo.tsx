/* ═══════════════════════════════════════════════════════════════════════
 * 🚨 DEMO CODE — DELETE THIS ENTIRE FILE WHEN THE DEMO IS OVER 🚨
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Built 2026-08-25 to show a potential client what a VerifiedMargins profile
 * COULD do. None of it is real:
 *
 *   - "Consultation — $150" takes no payment, books nothing, and tells
 *     nobody. The calendar is a static month with plausible slots.
 *   - The social buttons link to the seller's real handles, but "moving them
 *     to the top" is a demo layout, not a decision about the page.
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
 * package, and the client asked for this "at the very top, below the name" —
 * which is INSIDE that component's markup. Rather than add a slot prop to a
 * shared package for a throwaway demo, this finds the header the shared page
 * already marks (`[data-profile-head]`) and portals into a node inserted
 * after it. When the demo goes, the DOM goes back to normal by deletion
 * alone.
 */
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { fetchPublicProfile, type PublicProfile } from "@ballisticbrands/frontend-shared";

/** The only profile this renders on. */
const DEMO_USERNAME = "ggballas";

const CONSULTATION_PRICE = "$150";

/** Slots are fixed, not generated from "now" — a demo that shows different
 *  availability every time it is opened invites questions about the booking
 *  system, which does not exist. */
const SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

const SOCIAL_LABELS: Record<string, string> = {
  x: "X",
  reddit: "Reddit",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

function socialHref(key: string, value: string): string {
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "").replace(/^u\//, "");
  switch (key) {
    case "x": return `https://x.com/${handle}`;
    case "reddit": return `https://reddit.com/user/${handle}`;
    case "linkedin": return `https://linkedin.com/in/${handle}`;
    case "instagram": return `https://instagram.com/${handle}`;
    case "tiktok": return `https://tiktok.com/@${handle}`;
    case "facebook": return `https://facebook.com/${handle}`;
    default: return value;
  }
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
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  // Insert the portal target directly after the shared page's header.
  useEffect(() => {
    if (!isDemo) return;
    let node: HTMLDivElement | null = null;
    let cancelled = false;
    // The shared page renders after its own fetch resolves, so poll briefly
    // rather than assume the header exists on first paint.
    const attach = () => {
      if (cancelled || node) return true;
      const head = document.querySelector("[data-profile-head]");
      if (!head?.parentElement) return false;
      node = document.createElement("div");
      node.setAttribute("data-demo-profile-extras", "");
      head.parentElement.insertBefore(node, head.nextSibling);
      setHost(node);
      document.body.setAttribute("data-demo-profile", "");

      /* "Move the links to the top" means the originals have to go, or they
       * appear twice. CSS cannot reach them: the shared page marks only its
       * OWNER-EDITING links section with `data-profile-links`, while the
       * public list is a bare <section>. Rather than add a hook to a shared
       * package for a demo, the hiding happens here in JS and is undone in
       * the cleanup below — so deleting this file restores the page exactly,
       * with nothing left behind in the shared component or the stylesheet. */
      for (const section of Array.from(document.querySelectorAll(".vm-profile section"))) {
        if (section.querySelector("h2")?.textContent?.trim() === "Links") {
          (section as HTMLElement).dataset.demoHidden = "";
          (section as HTMLElement).style.display = "none";
        }
      }
      return true;
    };
    if (!attach()) {
      const t = window.setInterval(() => attach() && window.clearInterval(t), 120);
      window.setTimeout(() => window.clearInterval(t), 6_000);
    }
    return () => {
      cancelled = true;
      node?.remove();
      document.body.removeAttribute("data-demo-profile");
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-demo-hidden]"))) {
        el.style.removeProperty("display");
        delete el.dataset.demoHidden;
      }
    };
  }, [isDemo]);

  // The links come from the real payload so the demo shows the seller's own
  // handles. Second request, browser-cached; acceptable for demo code.
  useEffect(() => {
    if (!isDemo) return;
    let cancelled = false;
    fetchPublicProfile(username)
      .then((p: PublicProfile) => {
        if (!cancelled) setSocials((p.socials ?? {}) as Record<string, string>);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [isDemo, username]);

  const links = useMemo(
    () => Object.entries(socials).filter(([, v]) => Boolean(v)),
    [socials],
  );

  if (!isDemo || !host) return null;

  return createPortal(
    <div data-demo-extras="">
      <div data-demo-actions="">
        <button type="button" data-demo-primary="" onClick={() => setOpen(true)}>
          Consultation — {CONSULTATION_PRICE}
        </button>
        {links.map(([key, value]) => (
          <a
            key={key}
            href={socialHref(key, value)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            data-demo-social=""
          >
            {SOCIAL_LABELS[key] ?? key}
          </a>
        ))}
      </div>
      {open ? <SchedulerDialog onClose={() => setOpen(false)} /> : null}
    </div>,
    host,
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
