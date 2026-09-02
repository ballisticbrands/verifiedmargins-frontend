import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError, apiFetch, useBrand, useSession } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * The valuation wizard — full screen, one question at a time.
 *
 * 🚨 THE SERVER DRIVES THE FORM. Every answer POSTs to /valuation/preview,
 * which returns both the new number AND the questions that are visible for
 * those answers. Branching is survey-core's expression language and stays on
 * the backend: shipping the rules here would mean shipping their evaluator
 * and owning the drift between two answers to "what comes next". The round
 * trip is already paid for by the live number.
 *
 * The number is the point. It moves on every answer, above the question, so
 * answering visibly does something — which is the whole reason a seller
 * fills this in rather than abandoning it.
 */

interface Choice { value: string; text: string }
interface Question {
  name: string;
  type: string;
  title: string;
  description?: string;
  isRequired: boolean;
  choices: Choice[];
  page: string;
  answered: boolean;
}
interface Adjustment { label: string; delta: number }
interface Preview {
  value: number | null;
  multiple: number | null;
  netProfitTtm: number | null;
  adjustments: Adjustment[];
  questions: Question[];
  completeness: { complete: boolean; missing: string[]; required: number; answered: number };
}

type Answers = Record<string, unknown>;

function money(n: number | null): string {
  if (n === null) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(n);
}

export function Valuation() {
  const { slug = "" } = useParams();
  const brand = useBrand();
  const { status } = useSession();
  const navigate = useNavigate();

  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [preview, setPreview] = useState<Preview | null>(null);
  const [index, setIndex] = useState(0);
  /* Set ONCE, from the first preview — not on every refresh, or answering a
     question would yank you somewhere else mid-wizard. */
  const resumed = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  /* "questions" until the last one is answered, then the write-up they are
     asked to approve. A separate stage rather than a final question, because
     approving prose we generated is a different kind of act from answering a
     question about your own business, and it has its own refusal. */
  const [stage, setStage] = useState<"questions" | "approve">("questions");
  const [draft, setDraft] = useState<string | null>(null);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Value your business — ${brand.displayName}`;
  }, [brand.displayName]);

  /* Ownership, the same way the business page resolves it: from the caller's
     OWN profiles and connection list, so nothing here can answer a question
     about somebody else's business. */
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const { listProfiles, fetchConnectionOptions } = await import(
          "@ballisticbrands/frontend-shared"
        );
        const profiles = await listProfiles();
        for (const p of profiles) {
          const opts = (await fetchConnectionOptions(p.id)) as Array<{ id: string; slug?: string }>;
          const found = opts.find((o) => o.slug === slug);
          if (found && !cancelled) {
            setConnectionId(found.id);
            return;
          }
        }
        if (!cancelled) setDenied(true);
      } catch {
        if (!cancelled) setDenied(true);
      }
    })();
    return () => { cancelled = true; };
  }, [status, slug]);

  /* Load whatever they answered before, so the wizard is resumable rather
     than all-or-nothing — half a questionnaire is worth keeping. */
  useEffect(() => {
    if (!connectionId) return;
    let cancelled = false;
    apiFetch<{ answers: Answers }>(`/v1/connections/${connectionId}/questionnaire`)
      .then((r) => { if (!cancelled) setAnswers(r.answers ?? {}); })
      .catch(() => { /* start empty */ });
    return () => { cancelled = true; };
  }, [connectionId]);

  /* One request per answer, debounced. Returns the number and the form. */
  const seq = useRef(0);
  const refresh = useCallback(async (next: Answers) => {
    if (!connectionId) return;
    const mine = ++seq.current;
    try {
      const p = await apiFetch<Preview>(`/v1/connections/${connectionId}/valuation/preview`, {
        method: "POST",
        body: JSON.stringify({ answers: next }),
      });
      /* Out-of-order guard: a slow early request must not overwrite the
         answer to a later one. */
      if (mine === seq.current) setPreview(p);
    } catch (err) {
      if (mine === seq.current) setError(err instanceof ApiError ? err.message : "Could not value that.");
    }
  }, [connectionId]);

  useEffect(() => { void refresh(answers); }, [connectionId, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const questions = preview?.questions ?? [];

  /* Land where the work is. Someone returning to a half-finished
     questionnaire resumes at their first unanswered question; someone whose
     answers are already complete lands on the last one, where the write-up
     button is. Starting everyone at question one made a returning seller
     click Next through ten questions they had already answered to reach
     anything new — which is how the write-up step became invisible. */
  useEffect(() => {
    if (resumed.current || !preview || questions.length === 0) return;
    resumed.current = true;
    const firstUnanswered = questions.findIndex((q) => !q.answered);
    setIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
  }, [preview, questions]);
  const current = questions[Math.min(index, Math.max(0, questions.length - 1))];

  function answer(name: string, value: unknown) {
    const next = { ...answers, [name]: value };
    setAnswers(next);
    void refresh(next);
  }

  /** Store the answers. Called on the way OUT of the questions, whether or
   *  not they go on to approve a write-up — the number they just watched
   *  move is theirs either way, and losing it because they closed the tab on
   *  the approval screen would be the worst moment to lose it. */
  async function saveAnswers(): Promise<boolean> {
    if (!connectionId) return false;
    try {
      await apiFetch(`/v1/connections/${connectionId}/questionnaire`, {
        method: "PUT",
        body: JSON.stringify({ answers }),
      });
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
      return false;
    }
  }

  async function finish() {
    setSaving(true);
    if (await saveAnswers()) navigate(`/business/${slug}`);
    else setSaving(false);
  }

  /* Banks the answers, then fetches the paragraph to put in front of them. */
  async function toApproval() {
    if (!connectionId) return;
    setSaving(true);
    setError(null);
    if (!(await saveAnswers())) { setSaving(false); return; }
    try {
      const r = await apiFetch<{ draft: { text: string }; approved: { text?: string; approvedAt?: string } }>(
        `/v1/connections/${connectionId}/deep-dive`,
      );
      setDraft(r.draft.text);
      setApprovedAt(r.approved?.approvedAt ?? null);
      setStage("approve");
    } catch (err) {
      /* The write-up is a bonus, not the deliverable. If it cannot be fetched
         the valuation is still saved, so send them to it rather than stranding
         them on a screen about a paragraph. */
      setError(err instanceof ApiError ? err.message : "Could not load the write-up.");
      navigate(`/business/${slug}`);
      return;
    }
    setSaving(false);
  }

  async function approve() {
    if (!connectionId || !draft) return;
    setSaving(true);
    try {
      await apiFetch(`/v1/connections/${connectionId}/deep-dive/approve`, {
        method: "POST",
        body: JSON.stringify({ text: draft }),
      });
      navigate(`/business/${slug}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
      setSaving(false);
    }
  }

  if (status === "loading") return <Shell width="wide"><p>Loading…</p></Shell>;
  if (status !== "authenticated" || denied) {
    return (
      <Shell width="wide">
        <div className="vm-form">
          <h1>Not your business</h1>
          <p>Only the owner of a business can value it. <Link to={`/business/${slug}`}>Back to the business</Link>.</p>
        </div>
      </Shell>
    );
  }
  if (!preview) return <Shell width="wide"><p>Loading…</p></Shell>;

  /* ── The consent screen ──────────────────────────────────────────────
   *
   * They read what we would publish under their name, and they approve it or
   * they don't. "Not now" is a real button on purpose: consent you cannot
   * refuse is not consent, and the valuation is already saved by the time
   * this renders, so refusing costs them nothing they earned.
   *
   * The paragraph is a placeholder today — the same text for every business.
   * The flow around it is the part worth building first: when a model starts
   * writing these, it will be dropping into something that already refuses
   * to publish a word the seller has not read. */
  if (stage === "approve" && draft) {
    return (
      <Shell width="wide">
        <div data-valuation="">
          <header data-val-head="">
            <div>
              <p data-val-label="">Estimated value</p>
              <p data-val-number="">{money(preview.value)}</p>
              <p data-val-sub="">Saved. One last thing.</p>
            </div>
          </header>

          <div data-val-approve="">
            <h1>Your write-up</h1>
            <p data-val-desc="">
              This is what appears on your business page, under your name. Readers
              who have valued a business of their own see all of it; everyone else
              sees the first couple of sentences.
              {approvedAt ? " You approved a version of this before." : ""}
            </p>

            <blockquote data-val-draft="">{draft}</blockquote>

            <p data-val-fineprint="">
              Written from your answers and your verified numbers. It says nothing
              we have not read from your account or been told by you, and you can
              change your mind later.
            </p>
          </div>

          {error ? <p data-error="" role="alert">{error}</p> : null}

          <footer data-val-nav="">
            <button type="button" onClick={() => { setStage("questions"); setError(null); }} disabled={saving}>
              Back to the questions
            </button>
            <button type="button" onClick={() => navigate(`/business/${slug}`)} disabled={saving}>
              Not now
            </button>
            <button type="button" data-primary="" onClick={() => void approve()} disabled={saving}>
              {saving ? "Publishing…" : "Approve and publish"}
            </button>
          </footer>
        </div>
      </Shell>
    );
  }

  const answeredCount = questions.filter((q) => q.answered).length;
  const pct = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <Shell width="wide">
      <div data-valuation="">
        <header data-val-head="">
          <div>
            <p data-val-label="">Estimated value</p>
            {/* The number leads, and moves on every answer. A wizard whose
                reward is only at the end is a wizard people abandon. */}
            <p data-val-number="" aria-live="polite">{money(preview.value)}</p>
            <p data-val-sub="">
              {preview.multiple
                ? `${preview.multiple}× net profit of ${money(preview.netProfitTtm)}`
                : "Connect costs to see a value"}
              {" · "}
              <span data-val-basis="">on net profit, not SDE — brokers quote SDE, which is higher</span>
            </p>
          </div>
          <Link to={`/business/${slug}`} data-val-exit="">Save and exit</Link>
        </header>

        <div data-val-progress=""><span style={{ width: `${pct}%` }} /></div>
        <p data-val-count="">{answeredCount} of {questions.length} answered</p>

        <div data-val-body="">
          {current ? (
            <section data-val-question="">
              <h1>{current.title}</h1>
              {current.description ? <p data-val-desc="">{current.description}</p> : null}
              <div data-val-choices="">
                {current.choices.map((c) => {
                  const selected =
                    current.type === "checkbox"
                      ? Array.isArray(answers[current.name]) &&
                        (answers[current.name] as string[]).includes(c.value)
                      : answers[current.name] === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      data-val-choice=""
                      data-selected={selected ? "" : undefined}
                      onClick={() => {
                        if (current.type === "checkbox") {
                          const cur = Array.isArray(answers[current.name])
                            ? (answers[current.name] as string[])
                            : [];
                          answer(
                            current.name,
                            cur.includes(c.value) ? cur.filter((x) => x !== c.value) : [...cur, c.value],
                          );
                        } else {
                          answer(current.name, c.value);
                          /* Single-choice advances itself; multi-select cannot,
                             because there is no way to know they are done. */
                          setIndex((i) => Math.min(i + 1, questions.length - 1));
                        }
                      }}
                    >
                      {c.text}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <p>No questions to answer.</p>
          )}

          <aside data-val-adjustments="">
            <h2>What is moving it</h2>
            {preview.adjustments.length === 0 ? (
              <p data-val-empty="">Nothing yet. Answer a question.</p>
            ) : (
              <ul>
                {preview.adjustments.map((a) => (
                  <li key={a.label} data-dir={a.delta > 0 ? "up" : "down"}>
                    <span>{a.label}</span>
                    <b>{a.delta > 0 ? "+" : ""}{a.delta}×</b>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        {error ? <p data-error="" role="alert">{error}</p> : null}

        <footer data-val-nav="">
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
            Back
          </button>
          {index < questions.length - 1 ? (
            <button type="button" onClick={() => setIndex((i) => i + 1)}>
              Next
            </button>
          ) : null}
          {/* Once every required answer is in, the write-up is one click away
              from WHEREVER they are — not only from the last question. Hiding
              it behind the end of the deck meant a seller who had already
              finished could not find it at all. */}
          {preview.completeness.complete ? (
            <button type="button" data-primary="" onClick={() => void toApproval()} disabled={saving}>
              {saving ? "Saving…" : "Review your write-up"}
            </button>
          ) : index === questions.length - 1 ? (
            <button type="button" data-primary="" onClick={() => void finish()} disabled={saving}>
              {saving ? "Saving…" : "Save what I have"}
            </button>
          ) : null}
        </footer>
      </div>
    </Shell>
  );
}
