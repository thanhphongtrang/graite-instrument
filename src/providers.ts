import type { Suggestion, SuggestionProvider, SuggestionRequest } from './types'

// Simulated provider: deterministic-ish, offline, no API key, no GDPR
// questions — right for a supervision boundary object. A real provider
// (EU-hosted endpoint under a DPA) is an adapter drop-in behind the same
// interface; its model choice is a GDPR decision before a capability
// decision (Research Plan v2 §6).

const POOLS: Record<string, string[]> = {
  objectives: [
    'Student teachers can critically evaluate an AI-generated lesson plan against curriculum goals (Lgr22) and justify which parts they would keep, revise, or reject.',
    'Student teachers can articulate the difference between delegating a task to AI and delegating the judgment about that task, using examples from their own subject area.',
    'Student teachers can design a classroom activity in which pupils compare an AI explanation with a textbook explanation and identify the epistemic differences.',
  ],
  activities: [
    'Think-pair-share (20 min): pairs prompt an AI tool for a lesson introduction on their topic, then annotate the output — green for "keep", yellow for "revise", red for "reject with reason" — and defend their annotations to another pair.',
    'Fishbowl discussion (30 min): half the group observes while the other half debates the claim "an AI-written lesson plan is still my lesson plan if I approve it". Observers note which arguments appeal to responsibility, which to efficiency.',
    'Deconstruction exercise (25 min): give students a deliberately mediocre AI-generated activity. Task: identify the three pedagogical assumptions it silently makes, then redesign it for their actual pupil group.',
  ],
  assessment: [
    'Formative: exit ticket where each student teacher names one AI suggestion they rejected this week and the professional reason why — collected into a shared "judgment log" for the group.',
    'Summative option: a 2-page annotated lesson plan where every AI-assisted element is marked and justified; grading criteria weight the quality of justification over the polish of the plan.',
    'Peer assessment: exchange AI-assisted lesson drafts; the reviewer must find one place where the AI text does not fit the stated learning objective.',
  ],
  materials: [
    'Skolverket guidance on digital tools in teaching (latest edition) — assign the section on professional responsibility as pre-reading.',
    'A curated set of three AI outputs on the same topic from different models, prepared in advance, so the comparison activity does not depend on live tools.',
    'UNESCO (2023) Guidance for generative AI in education and research — chapter on human agency, as a seminar text.',
  ],
  generic: [
    'Consider opening with a concrete dilemma from practice: a colleague uses AI to write all parent communication. What is gained, what is at risk, and who is accountable?',
    'A short reflective writing prompt: "Describe one moment this term when you overrode a technology default for a pedagogical reason."',
    'Link this section explicitly to the TPACK framework: which knowledge domain is doing the work here — technological, pedagogical, or content — and where do they intersect?',
  ],
}

const LATENCY_MS = 600

export class SimulatedProvider implements SuggestionProvider {
  name = 'simulated'
  model = 'scripted-pool'
  version = '0.1'
  private cursor: Record<string, number> = {}

  async getSuggestions(req: SuggestionRequest): Promise<Suggestion[]> {
    await new Promise((r) => setTimeout(r, LATENCY_MS))
    const pool = POOLS[req.sectionKind] ?? POOLS.generic
    const start = this.cursor[req.sectionKind] ?? 0
    this.cursor[req.sectionKind] = (start + 3) % pool.length
    const picks: string[] = []
    for (let i = 0; i < 3; i++) picks.push(pool[(start + i) % pool.length])
    // Rehearsal finding (v0.2): provider annotations must NEVER be part of the
    // insertable content — the "(Tailored to…)" tail contaminated artifacts,
    // acceptance volume, and edit metrics. Echo lives in `note`, card-only.
    const echo = req.prompt.trim()
    return picks.map((content, i) => ({
      suggestion_id: crypto.randomUUID(),
      content,
      note: i === 0 && echo ? `Responding to: "${echo.slice(0, 120)}"` : undefined,
    }))
  }
}

// ponytail: AnthropicProvider deliberately not built — Phase 0 is a demo
// with no participants and no network calls; a real EU-hosted adapter is
// a later, ethics-gated step. See debt-ledger.md.
