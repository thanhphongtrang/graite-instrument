import { useEffect, useMemo, useRef, useState } from 'react'
import type { AcceptedSpan, Section, Suggestion, TraceEvent } from './types'
import { PROVENANCE_OPTIONS, REJECT_REASONS, SCHEMA_VERSION } from './types'
import { TraceLog, downloadJSON } from './logging'
import { SimulatedProvider, subjectAreaKey } from './providers'
import { similarity } from './diff'
import './App.css'

const PARTICIPANT_CODE = 'DEMO-01' // pseudonymous always; hardcoded for the boundary object

const provider = new SimulatedProvider()
const trace = new TraceLog()

// v0.4-draft (A2): session_index is "settable at launch" via a URL param —
// the researcher constructs per-session links, not the participant typing a
// number (avoids seeding demand characteristics about "which session is this").
// On a page refresh mid-session, prefer the value already logged in this
// browser's session_start event over the URL, so a reload can't drift it.
function resolveSessionIndex(existingSessionStart: TraceEvent | undefined): number {
  if (existingSessionStart && typeof existingSessionStart.data.session_index === 'number') {
    return existingSessionStart.data.session_index
  }
  const raw = new URLSearchParams(window.location.search).get('session_index')
  const n = raw ? parseInt(raw, 10) : 1
  return Number.isFinite(n) && n >= 1 ? n : 1
}

// v0.4-draft (A2): task-framing configurability — one constant per subject key,
// no template system (YAGNI). Shares subjectAreaKey with providers.ts so the
// doc title and the suggestion pool never disagree about which subject a
// session is in.
const TASK_FRAMING: Record<'math' | 'generic', string> = {
  math: 'Mathematics seminar plan — working draft',
  generic: 'Course material — working draft',
}

const DEFAULT_SECTIONS: Section[] = [
  { id: crypto.randomUUID(), title: 'Overview & rationale', kind: 'generic', content: '' },
  { id: crypto.randomUUID(), title: 'Learning objectives', kind: 'objectives', content: '' },
  { id: crypto.randomUUID(), title: 'Activities', kind: 'activities', content: '' },
  { id: crypto.randomUUID(), title: 'Assessment', kind: 'assessment', content: '' },
  { id: crypto.randomUUID(), title: 'Materials & readings', kind: 'materials', content: '' },
]

const LOGGED_THINGS = [
  'Prompts you send to the AI (text, timing, target section)',
  'Every suggestion shown, with the model name and version',
  'Your decisions: accept, edit-then-insert, reject (with optional reason)',
  'Your own edits to the document (snapshots when you pause)',
  'Later changes to accepted AI text (modified or removed)',
  'Moments you flag for the recall interview',
  'Document snapshots (version history)',
]

export default function App() {
  const existingSessionStart = useMemo(() => trace.all.find((e) => e.type === 'session_start'), [])
  const sessionIndex = useMemo(() => resolveSessionIndex(existingSessionStart), [existingSessionStart])
  const [consented, setConsented] = useState(!trace.isNew)
  const [subjectArea, setSubjectArea] = useState<string | null>(
    (existingSessionStart?.data.subject_area as string | null | undefined) ?? null,
  )
  if (!consented) {
    return (
      <ConsentGate
        sessionIndex={sessionIndex}
        onAccept={(subjectAreaInput) => {
          const normalized = subjectAreaInput.trim() || null
          setSubjectArea(normalized)
          trace.logSessionStart(PARTICIPANT_CODE, provider, {
            session_index: sessionIndex,
            subject_area: normalized,
            consent_delta_shown: sessionIndex >= 2,
          })
          setConsented(true)
        }}
      />
    )
  }
  return <Workbench subjectArea={subjectArea} />
}

function ConsentGate({ sessionIndex, onAccept }: { sessionIndex: number; onAccept: (subjectArea: string) => void }) {
  const [subjectAreaInput, setSubjectAreaInput] = useState('')
  return (
    <div className="consent-wrap">
      <main className="consent-card" aria-labelledby="consent-title">
        <p className="badge">Demo — synthetic data only · no participants · no network calls</p>
        <h1 id="consent-title">GRAITE Co-Creation Instrument</h1>
        {sessionIndex >= 2 && (
          <div className="consent-delta" aria-label="What changed since your last session">
            <h2>Since your last session</h2>
            <p>This is session {sessionIndex}. Since you last used this instrument, what we record changed:</p>
            <ul>
              <li>Your subject area (below) is now recorded, so we can tell whether it shapes your trace.</li>
              <li>When you rework accepted AI text past what we can track automatically, we now ask you directly what you kept, instead of guessing.</li>
              <li>Suggestions you never acted on are now logged as "unresolved" rather than silently dropped.</li>
            </ul>
          </div>
        )}
        <p>
          You are about to co-create a piece of course material with an AI partner. This environment is a{' '}
          <strong>research instrument</strong>: your interaction with it is recorded as a structured trace, which
          you can watch live in the <em>Your trace</em> panel and export at any time.
        </p>
        <h2>What is recorded</h2>
        <ul>
          {LOGGED_THINGS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h2>What is not recorded</h2>
        <p>Individual keystrokes, anything outside this page, or your identity — you appear only as a code ({PARTICIPANT_CODE}).</p>
        <p>
          Everything stays in this browser. You can <strong>withdraw and wipe all data</strong> with one click at any
          time — no copy survives.
        </p>
        <label htmlFor="subject-area-input">Your subject area / ämnesområde (optional)</label>
        <input
          id="subject-area-input"
          type="text"
          value={subjectAreaInput}
          onChange={(e) => setSubjectAreaInput(e.target.value)}
          placeholder="e.g. mathematics didactics, Swedish, civics"
        />
        <button className="primary" onClick={() => onAccept(subjectAreaInput)}>
          I understand — start the session
        </button>
      </main>
    </div>
  )
}

function Workbench({ subjectArea }: { subjectArea: string | null }) {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [ended, setEnded] = useState(false)
  // Provenance spans live in a ref, not state: they are never rendered, and
  // logging inside a state updater would double-fire under StrictMode
  // (verified bug, 2026-07-11) — events must be logged exactly once.
  const spansRef = useRef<AcceptedSpan[]>([])
  const [events, setEvents] = useState<TraceEvent[]>(trace.all)
  const [wiped, setWiped] = useState(false)
  // v0.3: provenance questions the participant hasn't answered yet.
  const [pendingProvenance, setPendingProvenance] = useState<
    Array<{ suggestion_id: string; section_id: string; similarity: number }>
  >([])

  useEffect(() => trace.subscribe(setEvents), [])

  const snapshot = (next: Section[]) => {
    trace.log('artifact_snapshot', {
      version: events.filter((e) => e.type === 'artifact_snapshot').length + 1,
      sections: next.map((s) => ({ id: s.id, title: s.title, content: s.content })),
    })
  }

  // Post-acceptance provenance (v0.3 — see design.md §3).
  // Round-2 falsified the auto-detector: a skeleton-preserving rework scored
  // sim 0.019 (word overlap near zero) and was mis-coded "removed", exactly
  // the dispute v0.2 tried to fix. So v0.3 splits the decision:
  //   sim >= 0.6  → confident light edit, auto-log ai_text_modified (no interruption)
  //   sim <  0.6  → the detector CANNOT tell transform from removal → ask the
  //                 participant (provenance_self_report). Their answer is the
  //                 record; raw similarity is still logged for recoding.
  // This converts a detector failure into participant interpretive authority —
  // the study's own epistemology (traces never speak alone).
  const checkProvenance = (section: Section) => {
    const newPending: Array<{ suggestion_id: string; section_id: string; similarity: number }> = []
    spansRef.current = spansRef.current.map((span) => {
      if (span.section_id !== section.id) return span
      if (span.status === 'removed' || span.status === 'queried') return span
      if (section.content.includes(span.text)) return span
      const sim = Number(similarity(span.text, section.content).toFixed(3))
      if (sim >= 0.6) {
        if (span.status === 'intact') {
          trace.log('ai_text_modified_post_acceptance', { suggestion_id: span.suggestion_id, section_id: section.id, similarity: sim })
          return { ...span, status: 'modified' as const }
        }
        return span
      }
      // Below the confident band: don't guess — queue a question for the participant.
      newPending.push({ suggestion_id: span.suggestion_id, section_id: section.id, similarity: sim })
      return { ...span, status: 'queried' as const }
    })
    if (newPending.length) setPendingProvenance((p) => [...p, ...newPending])
  }

  const answerProvenance = (suggestion_id: string, kept: string, similarity: number, section_id: string) => {
    trace.log('provenance_self_report', { suggestion_id, section_id, similarity, kept })
    setPendingProvenance((p) => p.filter((q) => q.suggestion_id !== suggestion_id))
  }

  const insertIntoSection = (sectionId: string, text: string) => {
    // Compute outside setSections: logging inside a state updater double-fires
    // under StrictMode (same bug class as spansRef above).
    const next = sections.map((s) =>
      s.id === sectionId ? { ...s, content: s.content ? s.content + '\n\n' + text : text } : s,
    )
    setSections(next)
    snapshot(next)
  }

  if (wiped) {
    return (
      <div className="consent-wrap">
        <main className="consent-card">
          <h1>Session wiped</h1>
          <p>All trace data and document content stored by this demo has been deleted from this browser.</p>
          <button className="primary" onClick={() => window.location.reload()}>
            Start a fresh session
          </button>
        </main>
      </div>
    )
  }

  if (ended) {
    return (
      <div className="consent-wrap">
        <main className="consent-card">
          <h1>Session ended</h1>
          <p>
            Thank you. Your trace ({events.length} events) is bounded by an explicit end marker and stays in this
            browser until you export or wipe it.
          </p>
          <div className="sug-actions">
            <button className="primary" onClick={() => downloadJSON(`trace-${trace.session_id.slice(0, 8)}.json`, trace.exportJSON())}>
              Export trace (JSON)
            </button>
            <button
              className="danger"
              onClick={() => {
                trace.wipe()
                setWiped(true)
              }}
            >
              Withdraw &amp; wipe
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>GRAITE Co-Creation Instrument</strong>
          <span className="badge">boundary object · schema {SCHEMA_VERSION}</span>
        </div>
        <div className="topbar-meta">
          <span title="Pseudonymous participant code">{PARTICIPANT_CODE}</span>
          <span title="AI provider (simulated for demo)">
            AI: {provider.name}/{provider.model}
          </span>
          <button onClick={() => downloadJSON(`trace-${trace.session_id.slice(0, 8)}.json`, trace.exportJSON())}>
            Export trace (JSON)
          </button>
          <button
            onClick={() => {
              // v0.3: log every suggestion that was shown but never acted on —
              // the "non-decision" (Round-2, SIM-C: "it stopped being a decision
              // the second I moved my eyes"). Invisible unless made explicit.
              const shown = new Map<string, string>() // suggestion_id -> request_id
              const decided = new Set<string>()
              for (const e of trace.all) {
                if (e.type === 'suggestions_shown') {
                  for (const s of (e.data.suggestions as Array<{ suggestion_id: string }>)) shown.set(s.suggestion_id, e.data.request_id as string)
                } else if (e.type === 'suggestion_accepted' || e.type === 'suggestion_edited_then_inserted' || e.type === 'suggestion_rejected') {
                  decided.add(e.data.suggestion_id as string)
                }
              }
              for (const [sid, rid] of shown) {
                if (!decided.has(sid)) trace.log('suggestion_unresolved', { suggestion_id: sid, request_id: rid })
              }
              trace.log('session_end', { ended_by: 'participant', total_events: trace.all.length + 1 })
              setEnded(true)
            }}
          >
            End session
          </button>
          <button
            className="danger"
            onClick={() => {
              if (window.confirm('Withdraw and wipe ALL session data from this browser? This cannot be undone.')) {
                trace.wipe()
                setWiped(true)
              }
            }}
          >
            Withdraw &amp; wipe
          </button>
        </div>
      </header>

      <div className="columns">
        <Editor
          sections={sections}
          setSections={setSections}
          docTitle={TASK_FRAMING[subjectAreaKey(subjectArea ?? undefined)]}
          onManualEdit={(section, before, after) => {
            trace.log('manual_edit', { section_id: section.id, before, after })
            checkProvenance(section)
            snapshot(sections.map((s) => (s.id === section.id ? section : s)))
          }}
        />
        <aside className="side">
          <AIPanel
            sections={sections}
            subjectArea={subjectArea}
            onAccept={(sug, sectionId, requestId) => {
              trace.log('suggestion_accepted', {
                suggestion_id: sug.suggestion_id,
                request_id: requestId,
                section_id: sectionId,
              })
              insertIntoSection(sectionId, sug.content)
              spansRef.current = [...spansRef.current, { suggestion_id: sug.suggestion_id, section_id: sectionId, text: sug.content, status: 'intact' }]
            }}
            onEditedInsert={(sug, edited, sectionId) => {
              trace.log('suggestion_edited_then_inserted', {
                suggestion_id: sug.suggestion_id,
                section_id: sectionId,
                original: sug.content,
                edited,
                similarity: Number(similarity(sug.content, edited).toFixed(3)),
              })
              insertIntoSection(sectionId, edited)
              spansRef.current = [...spansRef.current, { suggestion_id: sug.suggestion_id, section_id: sectionId, text: edited, status: 'intact' }]
            }}
            onReject={(sug, requestId, reason, reasonText) => {
              trace.log('suggestion_rejected', {
                suggestion_id: sug.suggestion_id,
                request_id: requestId,
                reason_tag: reason ?? null,
                reason_text: reasonText || null,
              })
            }}
          />
          <ProvenanceQuestions
            pending={pendingProvenance}
            sections={sections}
            onAnswer={answerProvenance}
          />
          <TraceMirror events={events} sections={sections} />
        </aside>
      </div>
    </div>
  )
}

// v0.3: when the participant replaces accepted AI text beyond recognition, the
// instrument asks — non-blocking — what they kept. Answering is one tap; NOT
// answering is itself data (the span stays 'queried', logged as unresolved at
// session end). Deliberately no forced modal: Round-2 (SIM-C) showed friction
// trades ecological validity for data; the question waits, it doesn't nag.
function ProvenanceQuestions({
  pending,
  sections,
  onAnswer,
}: {
  pending: Array<{ suggestion_id: string; section_id: string; similarity: number }>
  sections: Section[]
  onAnswer: (suggestion_id: string, kept: string, similarity: number, section_id: string) => void
}) {
  if (pending.length === 0) return null
  const sectionName = (id: string) => sections.find((s) => s.id === id)?.title ?? ''
  return (
    <section className="provenance" aria-label="A quick question about the AI text you changed">
      <h2>One quick question</h2>
      {pending.map((q) => (
        <div key={q.suggestion_id} className="prov-card">
          <p>
            You reworked AI text in <strong>{sectionName(q.section_id)}</strong> past what I can track automatically.
            What did you keep of it?
          </p>
          <div className="prov-options">
            {PROVENANCE_OPTIONS.map((o) => (
              <button key={o.key} className="ghost" onClick={() => onAnswer(q.suggestion_id, o.key, q.similarity, q.section_id)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Editor({
  sections,
  setSections,
  docTitle,
  onManualEdit,
}: {
  sections: Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  docTitle: string
  onManualEdit: (section: Section, before: string, after: string) => void
}) {
  const beforeRef = useRef<Record<string, string>>({})
  // Inline recall-note editor (v0.2): replaces the single-line native prompt —
  // rehearsal showed the markers doing real interpretive work, so they get a
  // real writing surface.
  const [flagFor, setFlagFor] = useState<string | null>(null)
  const [flagNote, setFlagNote] = useState('')
  return (
    <main className="editor" aria-label="Course material editor">
      <h1 className="doc-title">{docTitle}</h1>
      {sections.map((s) => (
        <section key={s.id} className="section-card">
          <div className="section-head">
            <input
              className="section-title"
              aria-label={`Title of section ${s.title}`}
              defaultValue={s.title}
              onFocus={(e) => (beforeRef.current['t' + s.id] = e.target.value)}
              onBlur={(e) => {
                const before = beforeRef.current['t' + s.id]
                if (e.target.value !== before) {
                  trace.log('section_renamed', { section_id: s.id, from: before, to: e.target.value })
                  setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))
                }
              }}
            />
            <div className="section-actions">
              <button
                className="ghost"
                title="Flag this moment for the recall interview"
                aria-expanded={flagFor === s.id}
                onClick={() => {
                  setFlagFor(flagFor === s.id ? null : s.id)
                  setFlagNote('')
                }}
              >
                ⚑ Flag moment
              </button>
              <button
                className="ghost danger-text"
                onClick={() => {
                  if (window.confirm(`Remove section "${s.title}"?`)) {
                    trace.log('section_removed', { section_id: s.id, title: s.title })
                    setSections((prev) => prev.filter((x) => x.id !== s.id))
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
          {flagFor === s.id && (
            <div className="flag-editor">
              <label htmlFor={`flag-${s.id}`}>What just happened here that we should revisit in the recall interview?</label>
              <textarea
                id={`flag-${s.id}`}
                value={flagNote}
                onChange={(e) => setFlagNote(e.target.value)}
                placeholder="A note to your future self — as much or little as you want. Leave empty to just flag."
              />
              <div className="sug-actions">
                <button
                  className="primary"
                  onClick={() => {
                    trace.log('recall_marker', { note: flagNote.trim() || null, section_id: s.id })
                    setFlagFor(null)
                    setFlagNote('')
                  }}
                >
                  Save flag
                </button>
                <button className="ghost" onClick={() => setFlagFor(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          <textarea
            aria-label={`Content of section ${s.title}`}
            value={s.content}
            placeholder="Write here, or ask the AI partner for suggestions →"
            onFocus={() => (beforeRef.current[s.id] = s.content)}
            onChange={(e) => setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, content: e.target.value } : x)))}
            onBlur={() => {
              const before = beforeRef.current[s.id]
              if (before !== s.content) onManualEdit(s, before, s.content)
            }}
          />
        </section>
      ))}
      <button
        className="ghost add-section"
        onClick={() => {
          const sec: Section = { id: crypto.randomUUID(), title: 'New section', kind: 'generic', content: '' }
          trace.log('section_added', { section_id: sec.id, title: sec.title })
          setSections((prev) => [...prev, sec])
        }}
      >
        + Add section
      </button>
    </main>
  )
}

function AIPanel({
  sections,
  subjectArea,
  onAccept,
  onEditedInsert,
  onReject,
}: {
  sections: Section[]
  subjectArea: string | null
  onAccept: (s: Suggestion, sectionId: string, requestId: string) => void
  onEditedInsert: (s: Suggestion, edited: string, sectionId: string) => void
  onReject: (s: Suggestion, requestId: string, reason?: string, reasonText?: string) => void
}) {
  const [prompt, setPrompt] = useState('')
  const [target, setTarget] = useState(sections[0]?.id ?? '')
  const [busy, setBusy] = useState(false)
  const [batch, setBatch] = useState<{ requestId: string; suggestions: Suggestion[] } | null>(null)
  const [decided, setDecided] = useState<Record<string, 'accepted' | 'rejected' | 'edited'>>({})
  const [editing, setEditing] = useState<Record<string, string>>({})
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [rejectTag, setRejectTag] = useState<string | null>(null)
  const [rejectText, setRejectText] = useState('')
  const requestCountRef = useRef(0)

  const targetSection = useMemo(() => sections.find((s) => s.id === target) ?? sections[0], [sections, target])

  const ask = async () => {
    if (!targetSection || busy) return
    setBusy(true)
    const requestId = crypto.randomUUID()
    // request_index lets analysis mark first-cycle latencies as
    // orientation-confounded (rehearsal finding: SIM-B's longest "deliberation"
    // was interface orientation).
    const requestIndex = ++requestCountRef.current
    trace.log('prompt_submitted', {
      request_id: requestId,
      request_index: requestIndex,
      prompt_text: prompt,
      target_section_id: targetSection.id,
      chars: prompt.length,
    })
    const t0 = performance.now()
    const suggestions = await provider.getSuggestions({
      prompt,
      sectionKind: targetSection.kind,
      sectionTitle: targetSection.title,
      subjectArea: subjectArea ?? undefined,
    })
    trace.log('suggestions_shown', {
      request_id: requestId,
      request_index: requestIndex,
      suggestions: suggestions.map((s) => ({ suggestion_id: s.suggestion_id, content: s.content, note: s.note ?? null })),
      model: `${provider.name}/${provider.model}@${provider.version}`,
      latency_ms: Math.round(performance.now() - t0),
    })
    setBatch({ requestId, suggestions })
    setDecided({})
    setEditing({})
    setRejecting(null)
    setRejectTag(null)
    setRejectText('')
    setBusy(false)
  }

  return (
    <section className="ai-panel" aria-label="AI co-creation partner">
      <h2>AI partner</h2>
      <label htmlFor="target-select">Working on</label>
      <select id="target-select" value={target} onChange={(e) => setTarget(e.target.value)}>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
      <label htmlFor="prompt-box">What do you need?</label>
      <textarea
        id="prompt-box"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='e.g. "Suggest activities that make student teachers question AI output, for a 45-minute seminar"'
      />
      <button className="primary" onClick={ask} disabled={busy || !targetSection}>
        {busy ? 'Thinking…' : 'Ask for suggestions'}
      </button>

      {batch && (
        <ol className="suggestions" aria-label="AI suggestions">
          {batch.suggestions.map((sug) => {
            const state = decided[sug.suggestion_id]
            return (
              <li key={sug.suggestion_id} className={`sug-card ${state ?? ''}`}>
                {editing[sug.suggestion_id] !== undefined ? (
                  <>
                    <textarea
                      aria-label="Edit suggestion before inserting"
                      value={editing[sug.suggestion_id]}
                      onChange={(e) => setEditing((p) => ({ ...p, [sug.suggestion_id]: e.target.value }))}
                    />
                    <div className="sug-actions">
                      <button
                        className="primary"
                        onClick={() => {
                          onEditedInsert(sug, editing[sug.suggestion_id], targetSection!.id)
                          setDecided((p) => ({ ...p, [sug.suggestion_id]: 'edited' }))
                          setEditing((p) => {
                            const { [sug.suggestion_id]: _drop, ...rest } = p
                            return rest
                          })
                        }}
                      >
                        Insert edited
                      </button>
                      <button
                        className="ghost"
                        onClick={() =>
                          setEditing((p) => {
                            const { [sug.suggestion_id]: _drop, ...rest } = p
                            return rest
                          })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{sug.content}</p>
                    {sug.note && <p className="sug-note">{sug.note}</p>}
                    {state ? (
                      <p className="sug-state">{state === 'accepted' ? '✓ accepted' : state === 'edited' ? '✎ edited & inserted' : '✕ rejected'}</p>
                    ) : rejecting === sug.suggestion_id ? (
                      <div className="reject-reasons" role="group" aria-label="Why are you rejecting this?">
                        <span>Why? Pick a tag and/or say it in your own words (both optional):</span>
                        <div className="sug-actions">
                          {REJECT_REASONS.map((r) => (
                            <button
                              key={r}
                              className={rejectTag === r ? 'tag-selected' : 'ghost'}
                              aria-pressed={rejectTag === r}
                              onClick={() => setRejectTag(rejectTag === r ? null : r)}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                        <textarea
                          aria-label="In your own words, why are you rejecting this? (optional)"
                          placeholder="In your own words… (optional, but this is the part that matters)"
                          value={rejectText}
                          onChange={(e) => setRejectText(e.target.value)}
                        />
                        <div className="sug-actions">
                          <button
                            className="primary"
                            onClick={() => {
                              onReject(sug, batch.requestId, rejectTag ?? undefined, rejectText.trim() || undefined)
                              setDecided((p) => ({ ...p, [sug.suggestion_id]: 'rejected' }))
                              setRejecting(null)
                              setRejectTag(null)
                              setRejectText('')
                            }}
                          >
                            Confirm reject
                          </button>
                          <button
                            className="ghost"
                            onClick={() => {
                              setRejecting(null)
                              setRejectTag(null)
                              setRejectText('')
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="sug-actions">
                        <button
                          className="primary"
                          onClick={() => {
                            onAccept(sug, targetSection!.id, batch.requestId)
                            setDecided((p) => ({ ...p, [sug.suggestion_id]: 'accepted' }))
                          }}
                        >
                          Accept
                        </button>
                        <button className="ghost" onClick={() => setEditing((p) => ({ ...p, [sug.suggestion_id]: sug.content }))}>
                          Edit first
                        </button>
                        <button className="ghost" onClick={() => setRejecting(sug.suggestion_id)}>
                          Reject
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

const EVENT_LABELS: Record<string, string> = {
  session_start: 'Session started',
  session_end: 'Session ended',
  prompt_submitted: 'You asked the AI',
  suggestions_shown: 'AI suggested',
  suggestion_accepted: 'You accepted a suggestion',
  suggestion_edited_then_inserted: 'You edited, then inserted',
  suggestion_rejected: 'You rejected a suggestion',
  manual_edit: 'You edited the document',
  ai_text_modified_post_acceptance: 'You reworked accepted AI text',
  ai_text_transformed: 'You transformed accepted AI text (kept its skeleton)',
  ai_text_removed: 'You removed accepted AI text',
  provenance_self_report: '↳ You told us what you kept',
  suggestion_unresolved: 'A suggestion you never decided on',
  recall_marker: '⚑ You flagged a moment',
  artifact_snapshot: 'Document snapshot',
  section_added: 'Section added',
  section_renamed: 'Section renamed',
  section_removed: 'Section removed',
}

function TraceMirror({ events, sections }: { events: TraceEvent[]; sections: Section[] }) {
  const count = (t: string) => events.filter((e) => e.type === t).length
  const sectionName = (id: unknown) => sections.find((s) => s.id === id)?.title ?? ''
  return (
    <section className="trace" aria-label="Your trace — live view of everything recorded">
      <h2>Your trace</h2>
      <p className="trace-sub">Everything recorded, as it happens. This is yours to see — and yours to interpret in the recall interview.</p>
      <div className="chips">
        <span className="chip">✓ {count('suggestion_accepted')} accepted</span>
        <span className="chip">✎ {count('suggestion_edited_then_inserted')} edited</span>
        <span className="chip">✕ {count('suggestion_rejected')} rejected</span>
        <span className="chip">⟳ {count('ai_text_transformed')} transformed</span>
        <span className="chip">↩ {count('ai_text_removed')} overridden</span>
        <span className="chip">⚑ {count('recall_marker')} flagged</span>
      </div>
      <ol className="trace-list">
        {[...events]
          .reverse()
          .slice(0, 60)
          .map((e) => (
            <li key={e.event_id}>
              <span className="trace-time">{e.at.slice(11, 19)}</span>
              <span className={`trace-type t-${e.type}`}>{EVENT_LABELS[e.type] ?? e.type}</span>
              {typeof e.data.section_id === 'string' && <span className="trace-ctx">{sectionName(e.data.section_id)}</span>}
              {typeof e.data.reason_tag === 'string' && <span className="trace-ctx">“{e.data.reason_tag}”</span>}
              {typeof e.data.similarity === 'number' && <span className="trace-ctx">sim {e.data.similarity}</span>}
            </li>
          ))}
      </ol>
    </section>
  )
}
