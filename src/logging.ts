import { SCHEMA_VERSION, APP_VERSION } from './types'
import type { TraceEvent, EventType, SuggestionProvider } from './types'

// Append-only event log. Persisted to localStorage on EVERY append so a
// refresh or crash loses nothing (data-loss handling is never cut).
// ponytail: localStorage over IndexedDB — a demo session is a few hundred
// events, far below any quota; revisit at real deployment.

const STORAGE_KEY = 'graite-instrument-trace-v01'

export class TraceLog {
  private events: TraceEvent[] = []
  private seq = 0
  readonly session_id: string
  private listeners: Array<(events: TraceEvent[]) => void> = []

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { session_id: string; events: TraceEvent[] }
        // Integrity check before trusting stored state (read before trusting):
        if (Array.isArray(parsed.events) && typeof parsed.session_id === 'string') {
          this.events = parsed.events
          this.session_id = parsed.session_id
          this.seq = parsed.events.length > 0 ? parsed.events[parsed.events.length - 1].seq : 0
          return
        }
      } catch {
        // corrupted store: start fresh but keep the corrupt copy for inspection
        localStorage.setItem(STORAGE_KEY + '-corrupt', saved)
      }
    }
    this.session_id = crypto.randomUUID()
  }

  get all(): TraceEvent[] {
    return this.events
  }

  get isNew(): boolean {
    return this.events.length === 0
  }

  subscribe(fn: (events: TraceEvent[]) => void): () => void {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  log(type: EventType, data: Record<string, unknown>): TraceEvent {
    const ev: TraceEvent = {
      event_id: crypto.randomUUID(),
      session_id: this.session_id,
      seq: ++this.seq,
      at: new Date().toISOString(),
      type,
      data,
    }
    this.events = [...this.events, ev]
    this.persist()
    this.listeners.forEach((l) => l(this.events))
    return ev
  }

  logSessionStart(participant_code: string, provider: SuggestionProvider) {
    this.log('session_start', {
      schema_version: SCHEMA_VERSION,
      app_version: APP_VERSION,
      participant_code,
      provider: { name: provider.name, model: provider.model, version: provider.version },
      consent_ack: true,
    })
  }

  exportJSON(): string {
    return JSON.stringify(
      { schema_version: SCHEMA_VERSION, session_id: this.session_id, exported_at: new Date().toISOString(), events: this.events },
      null,
      2,
    )
  }

  // Consent withdrawal: wipe everything, locally and irreversibly.
  wipe() {
    this.events = []
    this.seq = 0
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY + '-corrupt')
    this.listeners.forEach((l) => l(this.events))
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ session_id: this.session_id, events: this.events }))
  }
}

export function downloadJSON(filename: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
