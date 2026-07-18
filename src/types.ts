// Event schema v0.1-draft — the schema IS data collection.
// Any change here is a RESEARCH decision: propose to Phong, bump the version,
// record it (Decision Register when hub-connected). See docs/design.md §3.

export const SCHEMA_VERSION = '0.4-draft'
export const APP_VERSION = '0.4.0-boundary-object'

export type EventType =
  | 'session_start'
  | 'session_end'
  | 'prompt_submitted'
  | 'suggestions_shown'
  | 'suggestion_accepted'
  | 'suggestion_edited_then_inserted'
  | 'suggestion_rejected'
  | 'manual_edit'
  | 'ai_text_modified_post_acceptance'
  | 'ai_text_transformed' // skeleton kept, flesh replaced (rehearsal finding: SIM-A disputed 'removed')
  | 'ai_text_removed'
  | 'provenance_self_report' // v0.3: participant names what they kept when the detector can't tell (Round-2 finding: sim 0.019 on a skeleton-preserving rework)
  | 'suggestion_unresolved' // v0.3: shown but never accepted/edited/rejected — the "non-decision" (Round-2, SIM-C)
  | 'recall_marker'
  | 'artifact_snapshot'
  | 'section_added'
  | 'section_renamed'
  | 'section_removed'

export interface TraceEvent {
  event_id: string
  session_id: string
  seq: number // session-monotonic: process mining needs total order
  at: string // ISO-8601
  type: EventType
  data: Record<string, unknown>
}

export interface Suggestion {
  suggestion_id: string
  content: string // insertable text ONLY — no provider annotations (rehearsal finding: boilerplate contaminated artifacts and edit metrics)
  note?: string // provider annotation, shown on the card, never inserted
}

export interface SuggestionRequest {
  prompt: string
  sectionKind: string
  sectionTitle: string
  // v0.4-draft: subject-variant suggestion pools (B+1, Round 3 methodology fix).
  // A generic pool serving a subject-specialist persona manufactures ecologically
  // nonsense rejections and flattens the subject-variance Willermark 2025 claims
  // (see prereading-brief.md, p1-positioning-map.md §6). Optional — undefined
  // falls back to the generic pool.
  subjectArea?: string
}

export interface SuggestionProvider {
  name: string
  model: string
  version: string
  getSuggestions(req: SuggestionRequest): Promise<Suggestion[]>
}

export interface Section {
  id: string
  title: string
  kind: 'objectives' | 'activities' | 'assessment' | 'materials' | 'generic'
  content: string
}

// Provenance of accepted AI text, for post-acceptance judgment detection.
// v0 heuristic: similarity tracking, not char-level spans (see design.md §3).
export interface AcceptedSpan {
  suggestion_id: string
  section_id: string
  text: string // the text as it was when inserted (post-edit if edited)
  status: 'intact' | 'modified' | 'transformed' | 'removed' | 'queried'
}

// v0.3: when accepted AI text diverges below the confident-modification band,
// the instrument stops guessing and asks the participant what they kept.
// Their answer is the record; the raw similarity is still logged for recoding.
export const PROVENANCE_OPTIONS = [
  { key: 'structure', label: 'Its structure — I kept the shape, replaced the words' },
  { key: 'ideas', label: 'Its ideas — I kept the point, wrote it my way' },
  { key: 'phrases', label: 'Some phrases, not much else' },
  { key: 'nothing', label: 'Nothing — this is entirely mine now' },
] as const

// Rehearsal finding: both personas' real reasons fell outside the original four
// tags ("ignored my brief"; "too much prep time") — tags alone destroy RQ1's
// core datum. Free-text rationale now accompanies every tag.
export const REJECT_REASONS = [
  'Not pedagogically appropriate',
  'Ignored my instructions or constraints',
  'Too much preparation or time',
  'Factually off',
  'Wrong tone or register',
  'Other',
] as const
