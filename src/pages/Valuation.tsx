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
  /** Present on scale questions (the profit-share slider) only. */
  min?: number;
  max?: number;
  step?: number;
  page: string;
  /** The section's title — "How you source", "How hard it is to copy". */
  section: string;
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

/** Split a choice into the answer and the explanation of it.
 *
 *  The questionnaire writes these as one string — "Private label — your own
 *  brand on a product whose spec you control" — because that is one fact, and
 *  splitting it into two JSON fields would let the halves drift apart. The
 *  SPLIT is presentation: the seller is choosing between "private label" and
 *  "wholesale", and burying those two words mid-sentence makes six options
 *  look like six paragraphs.
 *
 *  Deliberately the EM dash, and deliberately the first one only. Ranges use
 *  an en dash ("5–10 hours a week") and must not split; explanations that
 *  contain their own em dash keep it in the explanation.
 */
function splitChoice(text: string): { label: string; hint?: string } {
  const at = text.indexOf(" — ");
  if (at === -1) return { label: text };
  return { label: text.slice(0, at), hint: text.slice(at + 3) };
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  /* "questions" until the last one is answered, then the deep-dive they are
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

  /* Load whatever they answered before, THEN price it — in that order, in one
     effect.
     🚨 These were two effects, and they raced. The preview fired as soon as
     the connection resolved, capturing `answers` from that render — an empty
     object, because the load had not come back yet — and it never re-ran,
     since making it depend on `answers` would have fired a request per
     keystroke. So a returning seller's stored answers landed in state and were
     never sent anywhere: the wizard said "0 of 10 answered", never reached
     complete, and the deep-dive step it gates stayed invisible. The answers
     were in the database the whole time.
     Sequencing them is the fix. It also means the FIRST preview already
     carries their answers, which is what the resume-position effect below
     reads to decide where to open. */
  useEffect(() => {
    if (!connectionId) return;
    let cancelled = false;
    void (async () => {
      let loaded: Answers = {};
      try {
        const r = await apiFetch<{ answers: Answers }>(
          `/v1/connections/${connectionId}/questionnaire`,
        );
        loaded = r.answers ?? {};
      } catch {
        /* Start empty — an unanswered wizard is still a usable one. */
      }
      if (cancelled) return;
      setAnswers(loaded);
      await refresh(loaded);
    })();
    return () => { cancelled = true; };
  }, [connectionId, refresh]);

  const questions = preview?.questions ?? [];

  /* 🚨 ALWAYS QUESTION ONE, deliberately — this used to resume at the first
     unanswered question. A seller re-entering the wizard is usually there to
     revisit what they said, not to be dropped in the middle of a deck with no
     sense of what came before; and now that "Review your deep-dive" shows
     from any question once the answers are complete, starting at the top
     costs a returning seller nothing. `resumed` is gone with it. */
  const current = questions[Math.min(index, Math.max(0, questions.length - 1))];

  function answer(name: string, value: unknown) {
    const next = { ...answers, [name]: value };
    setAnswers(next);
    void refresh(next);
  }

  /** Store the answers. Called on the way OUT of the questions, whether or
   *  not they go on to approve a deep-dive — the number they just watched
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
      /* The deep-dive is a bonus, not the deliverable. If it cannot be fetched
         the valuation is still saved, so send them to it rather than stranding
         them on a screen about a paragraph. */
      setError(err instanceof ApiError ? err.message : "Could not load the deep-dive.");
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
            <h1>Your business deep-dive</h1>
            <p data-val-desc="">
              This is the business deep-dive on your page, under your name. Readers
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

  /* Where this question sits WITHIN its section. Computed from the visible
     list rather than from the definition: the form branches, so "question 2
     of 4" is only true for the questions this seller's own answers surfaced. */
  const sectionQuestions = current
    ? questions.filter((q) => q.section === current.section)
    : [];
  const sectionPosition = {
    at: current ? sectionQuestions.findIndex((q) => q.name === current.name) + 1 : 0,
    of: sectionQuestions.length,
  };

  /* Every section, in order, so the seller can see the whole shape of the
     form and not just the step they are on. Derived from the visible
     questions rather than from the definition, so a section only appears if
     this seller's own answers actually lead there. */
  const sections: string[] = [];
  for (const q of questions) if (q.section && !sections.includes(q.section)) sections.push(q.section);

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
              {/* Which part of the form this is. One question at a time is
                  easy to answer and impossible to place: without this, a
                  seller three questions in has no idea whether they are near
                  the end or have just started a new subject. */}
              {sections.length ? (
                <nav data-val-sections="" aria-label="Sections">
                  {sections.map((name, i) => {
                    const here = name === current.section;
                    return (
                      <span
                        key={name}
                        data-val-section-item=""
                        data-current={here ? "" : undefined}
                        aria-current={here ? "step" : undefined}
                      >
                        {i > 0 ? (
                          <span data-val-section-sep="" aria-hidden="true">
                            →
                          </span>
                        ) : null}
                        <span data-val-section-name="">{name}</span>
                        {/* The count belongs to the section you are IN. On the
                            others it would be a number about a place you have
                            not reached. */}
                        {here ? (
                          <span data-val-section-count="">
                            {sectionPosition.at} of {sectionPosition.of}
                          </span>
                        ) : null}
                      </span>
                    );
                  })}
                </nav>
              ) : null}
              <h1>{current.title}</h1>
              {current.description ? <p data-val-desc="">{current.description}</p> : null}
              {current.type === "slider" ? (
                <ScaleAnswer
                  question={current}
                  value={answers[current.name]}
                  onChange={(v) => answer(current.name, v)}
                />
              ) : (
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
                      {(() => {
                        const { label, hint } = splitChoice(c.text);
                        return (
                          <>
                            <span data-val-choice-label="">{label}</span>
                            {hint ? <span data-val-choice-hint="">{hint}</span> : null}
                          </>
                        );
                      })()}
                    </button>
                  );
                })}
              </div>
              )}
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
          {/* Once every required answer is in, the deep-dive is one click away
              from WHEREVER they are — not only from the last question. Hiding
              it behind the end of the deck meant a seller who had already
              finished could not find it at all. */}
          {preview.completeness.complete ? (
            <button type="button" data-primary="" onClick={() => void toApproval()} disabled={saving}>
              {saving ? "Saving…" : "Review your deep-dive"}
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

/**
 * A percentage, on a line.
 *
 * 🚨 It does not auto-advance, and it does not answer itself. Every other
 * question here commits when you click a choice; a slider has a position
 * before anyone touches it, so committing that position would record a number
 * the seller never chose — on a question that is asking them to size part of
 * their own business. Until they move it, the value reads "—" and the
 * question counts as unanswered.
 */
function ScaleAnswer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: unknown;
  onChange: (v: number) => void;
}) {
  const min = question.min ?? 0;
  const max = question.max ?? 100;
  const step = question.step ?? 1;
  const answered = typeof value === "number";
  const shown = answered ? (value as number) : Math.round((min + max) / 2);

  return (
    <div data-val-scale="">
      <output data-val-scale-value="" data-empty={answered ? undefined : ""}>
        {answered ? `${shown}%` : "—"}
      </output>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={shown}
        aria-label={question.title}
        aria-valuetext={answered ? `${shown}%` : "not set"}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div data-val-scale-ends="">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
      {!answered ? <p data-val-scale-hint="">Drag to set a share, then continue.</p> : null}
    </div>
  );
}

