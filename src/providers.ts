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

// v0.4-draft (B+1, Round 3 methodology fix): a subject-specialist persona
// (e.g. mathematics-didactics) served the generic AI-literacy pool above
// receives ecologically nonsense suggestions — manufacturing rejections and
// flattening exactly the subject-variance Willermark 2025's claim predicts
// (see p1-positioning-map.md §6). A simple map lookup, keyed off subjectArea,
// generic pool as fallback — deliberately NOT a template system (YAGNI).
// CONFESSED CONFOUND (see rehearsal/assessment-round3.md): SIM-A's Round 1/2
// "documented deafness" (ignoring demokratiuppdraget twice) was partly an
// artifact of this single static pool not existing yet, not simulated-AI
// behavior in itself — prior assessments treated it as participant-negotiation
// data; recode with care once this pool exists.
const MATH_POOLS: Record<string, string[]> = {
  objectives: [
    'Student teachers can critically evaluate an AI-generated proof sketch or worked solution for mathematical validity, not just plausibility — distinguishing "looks right" from "is right".',
    'Student teachers can articulate where an AI tutor\'s step-by-step solution obscures a pupil\'s own misconception, using examples from their own strand (algebra, geometry, statistics).',
    'Student teachers can design a task in which pupils compare an AI-generated solution method with their own, and identify which mathematical practices (justifying, generalizing, representing) the AI path skips.',
  ],
  activities: [
    'Error-hunt (20 min): pairs prompt an AI tool for a worked solution to a problem with a known common misconception baked in, then must find where the AI silently "fixed" or reproduced the misconception, and defend their finding.',
    'Fishbowl discussion (30 min): half the group observes while the other half debates "if an AI can generate a valid proof, what is left for the pupil to understand?" — grounded in a concrete algebra or geometry example.',
    'Representation exercise (25 min): give students an AI-generated explanation of a concept using only one representation (e.g. symbolic). Task: identify which representations (graphical, tabular, verbal) are missing and why that matters mathematically.',
  ],
  assessment: [
    'Formative: exit ticket where each student teacher names one place an AI-generated solution was mathematically correct but pedagogically unhelpful, and why — collected into a shared log.',
    'Summative option: a 2-page annotated problem set where every AI-assisted explanation is marked with which mathematical practice (not just "correctness") it supports or undermines.',
    'Peer assessment: exchange AI-assisted worked examples; the reviewer must find one place where the AI\'s solution path would mislead a pupil who has not yet met the target concept.',
  ],
  materials: [
    'Skolverket\'s commentary material on mathematical competencies (kompetenser) — assign as pre-reading alongside the seminar.',
    'A curated set of three AI-generated worked solutions to the same problem from different models, prepared in advance, so the error-hunt does not depend on live tools.',
    'NCTM or Skolverket guidance on generative AI and mathematical reasoning, as a seminar text.',
  ],
  generic: [
    'Consider opening with a concrete dilemma: an AI tutor gives a pupil a correct final answer via a method three years ahead of the curriculum. What is gained, what is at risk, who is accountable for the mismatch?',
    'A short reflective writing prompt: "Describe one moment this term when an AI-generated solution was right but not how you would have wanted a pupil to get there."',
    'Link this section explicitly to subject-specific TPACK (Willermark 2025): which mathematical practice is at stake here, and does a generic AI-literacy framing capture it?',
  ],
}

// Keyed lookup, not a template system: normalize + substring match, generic
// fallback if no key matches or subjectArea is absent. Document any new key
// here and in docs/design.md §5 when a supervisor requests another subject.
// Exported so App.tsx's task-framing selection (doc title) uses the same key,
// rather than duplicating the normalize logic.
export function subjectAreaKey(subjectArea?: string): 'math' | 'generic' {
  const norm = (subjectArea ?? '').trim().toLowerCase()
  if (norm.includes('math') || norm.includes('matte')) return 'math'
  return 'generic'
}

function selectPools(subjectArea?: string): Record<string, string[]> {
  return subjectAreaKey(subjectArea) === 'math' ? MATH_POOLS : POOLS
}

const LATENCY_MS = 600

export class SimulatedProvider implements SuggestionProvider {
  name = 'simulated'
  model = 'scripted-pool'
  version = '0.2' // v0.4-draft: subject-variant pool selection added (B+1)
  private cursor: Record<string, number> = {}

  async getSuggestions(req: SuggestionRequest): Promise<Suggestion[]> {
    await new Promise((r) => setTimeout(r, LATENCY_MS))
    const pools = selectPools(req.subjectArea)
    const pool = pools[req.sectionKind] ?? pools.generic
    const cursorKey = `${req.subjectArea ?? 'generic'}:${req.sectionKind}`
    const start = this.cursor[cursorKey] ?? 0
    this.cursor[cursorKey] = (start + 3) % pool.length
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
