import { useEffect, useMemo, useRef, useState } from 'react'
import type { AcceptedSpan, Section, Suggestion, TraceEvent } from './types'
import { REJECT_REASONS, SCHEMA_VERSION } from './types'
import { TraceLog, downloadJSON } from './logging'
import { SimulatedProvider } from './providers'
import { similarity } from './diff'
import './App.css'

const PARTICIPANT_CODE = 'DEMO-01' // pseudonymous always; hardcoded for the boundary object

const provider = new SimulatedProvider()
const trace = new TraceLog()

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
  const [consented, setConsented] = useState(!trace.isNew)
  if (!consented) {
    return (
      <ConsentGate
        onAccept={() => {
          trace.logSessionStart(PARTICIPANT_CODE, provider)
          setConsented(true)
        }}
      />
    )
  }
  return <Workbench />
}

function ConsentGate({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="consent-wrap">
      <main className="consent-card" aria-labelledby="consent-title">
        <p className="badge">Demo — synthetic data only · no participants · no network calls</p>
        <h1 id="consent-title">GRAITE Co-Creation Instrument</h1>
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
        <button className="primary" onClick={onAccept}>
          I understand — start the session
        </button>
      </main>
    </div>
  )
}

function Workbench() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  // Provenance spans live in a ref, not state: they are never rendered, and
  // logging inside a state updater would double-fire under StrictMode
  // (verified bug, 2026-07-11) — events must be logged exactly once.
  const spansRef = useRef<AcceptedSpan[]>([])
  const [events, setEvents] = useState<TraceEvent[]>(trace.all)
  const [wiped, setWiped] = useState(false)

  useEffect(() => trace.subscribe(setEvents), [])

  const snapshot = (next: Section[]) => {
    trace.log('artifact_snapshot', {
      version: events.filter((e) => e.type === 'artifact_snapshot').length + 1,
      sections: next.map((s) => ({ id: s.id, title: s.title, content: s.content })),
    })
  }

  // Post-acceptance provenance heuristic (v0 — see design.md §3):
  const checkProvenance = (section: Section) => {
    spansRef.current = spansRef.current.map((span) => {
      if (span.section_id !== section.id || span.status === 'removed') return span
      if (section.content.includes(span.text)) return span
      const sim = similarity(span.text, section.content)
      if (sim >= 0.3 && span.status === 'intact') {
        trace.log('ai_text_modified_post_acceptance', {
          suggestion_id: span.suggestion_id,
          section_id: section.id,
          similarity: Number(sim.toFixed(3)),
        })
        return { ...span, status: 'modified' as const }
      }
      if (sim < 0.3) {
        trace.log('ai_text_removed', { suggestion_id: span.suggestion_id, section_id: section.id })
        return { ...span, status: 'removed' as const }
      }
      return span
    })
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

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>GRAITE Co-Creation Instrument</strong>
          <span className="badge">boundary object v0.1 · schema {SCHEMA_VERSION}</span>
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
          onManualEdit={(section, before, after) => {
            trace.log('manual_edit', { section_id: section.id, before, after })
            checkProvenance(section)
            snapshot(sections.map((s) => (s.id === section.id ? section : s)))
          }}
        />
        <aside className="side">
          <AIPanel
            sections={sections}
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
            onReject={(sug, requestId, reason) => {
              trace.log('suggestion_rejected', {
                suggestion_id: sug.suggestion_id,
                request_id: requestId,
                reason_tag: reason ?? null,
              })
            }}
          />
          <TraceMirror events={events} sections={sections} />
        </aside>
      </div>
    </div>
  )
}

function Editor({
  sections,
  setSections,
  onManualEdit,
}: {
  sections: Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  onManualEdit: (section: Section, before: string, after: string) => void
}) {
  const beforeRef = useRef<Record<string, string>>({})
  return (
    <main className="editor" aria-label="Course material editor">
      <h1 className="doc-title">Course material — working draft</h1>
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
                onClick={() => {
                  const note = window.prompt('Optional note for your recall interview (leave empty to just flag):') ?? undefined
                  trace.log('recall_marker', { note: note || null, section_id: s.id })
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
  onAccept,
  onEditedInsert,
  onReject,
}: {
  sections: Section[]
  onAccept: (s: Suggestion, sectionId: string, requestId: string) => void
  onEditedInsert: (s: Suggestion, edited: string, sectionId: string) => void
  onReject: (s: Suggestion, requestId: string, reason?: string) => void
}) {
  const [prompt, setPrompt] = useState('')
  const [target, setTarget] = useState(sections[0]?.id ?? '')
  const [busy, setBusy] = useState(false)
  const [batch, setBatch] = useState<{ requestId: string; suggestions: Suggestion[] } | null>(null)
  const [decided, setDecided] = useState<Record<string, 'accepted' | 'rejected' | 'edited'>>({})
  const [editing, setEditing] = useState<Record<string, string>>({})
  const [rejecting, setRejecting] = useState<string | null>(null)

  const targetSection = useMemo(() => sections.find((s) => s.id === target) ?? sections[0], [sections, target])

  const ask = async () => {
    if (!targetSection || busy) return
    setBusy(true)
    const requestId = crypto.randomUUID()
    trace.log('prompt_submitted', {
      request_id: requestId,
      prompt_text: prompt,
      target_section_id: targetSection.id,
      chars: prompt.length,
    })
    const t0 = performance.now()
    const suggestions = await provider.getSuggestions({
      prompt,
      sectionKind: targetSection.kind,
      sectionTitle: targetSection.title,
    })
    trace.log('suggestions_shown', {
      request_id: requestId,
      suggestions: suggestions.map((s) => ({ suggestion_id: s.suggestion_id, content: s.content })),
      model: `${provider.name}/${provider.model}@${provider.version}`,
      latency_ms: Math.round(performance.now() - t0),
    })
    setBatch({ requestId, suggestions })
    setDecided({})
    setEditing({})
    setRejecting(null)
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
                    {state ? (
                      <p className="sug-state">{state === 'accepted' ? '✓ accepted' : state === 'edited' ? '✎ edited & inserted' : '✕ rejected'}</p>
                    ) : rejecting === sug.suggestion_id ? (
                      <div className="sug-actions reject-reasons" role="group" aria-label="Why are you rejecting this?">
                        <span>Why? (optional)</span>
                        {REJECT_REASONS.map((r) => (
                          <button
                            key={r}
                            className="ghost"
                            onClick={() => {
                              onReject(sug, batch.requestId, r)
                              setDecided((p) => ({ ...p, [sug.suggestion_id]: 'rejected' }))
                              setRejecting(null)
                            }}
                          >
                            {r}
                          </button>
                        ))}
                        <button
                          className="ghost"
                          onClick={() => {
                            onReject(sug, batch.requestId)
                            setDecided((p) => ({ ...p, [sug.suggestion_id]: 'rejected' }))
                            setRejecting(null)
                          }}
                        >
                          Skip reason
                        </button>
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
  ai_text_removed: 'You removed accepted AI text',
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
