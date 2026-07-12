# Phase 0 rehearsal protocol — SYNTHETIC, no participants, no findings

**Purpose.** Rehearse the instrumented co-creation session + stimulated recall end-to-end before any real participant exists. Outputs are instrument-rehearsal data: does the trace capture the constructs, does the protocol hold, what breaks, and what does the practice teach about theory onboarding and RQ wording. Nothing here is empirical evidence about teacher educators.

## Personas (obviously synthetic, coded)

**SIM-A — "the veteran skeptic."** ~25 years in teacher education, subject didactics (ämnesdidaktik) specialist, deep commitment to formation (bildning) and the teacher's democratic mission. Uses GenAI reluctantly and precisely; treats every suggestion as a claim to be examined. Expected trace signature: high rejection/edit rate, articulate reasons, post-acceptance rework, judgment moments everywhere.

**SIM-B — "the eager adopter."** Early-career, teaches digital competence in teacher ed, chronically time-pressured, efficiency-first. Genuinely reflective when prompted but defaults to accepting. Expected trace signature: acceptance streaks, minimal editing, few flags — the automation-deference end of the spectrum.

## Session script (each participant, in persona, on the live instrument)

Task framing: "Prepare a 45-minute seminar for student teachers on using AI critically in lesson planning — real material you would actually teach."
1. Read the consent screen as your persona would; note your reaction.
2. At least 2 prompt cycles (different sections), reacting to each of the 3 suggestions per cycle in persona (accept / edit-then-insert / reject-with-reason).
3. At least one manual rework of previously accepted AI text (SIM-A: substantial; SIM-B: minimal or none — stay honest to persona).
4. Flag ≥1 recall moment with a note in persona voice.
5. Think aloud THROUGHOUT: every decision gets 1–2 sentences of in-persona reasoning, written to your think-aloud file with the approximate event it belongs to.
6. Note every friction, confusion, or "the instrument couldn't express what I wanted" moment — these are gold.

## Data outputs (rehearsal/ folder)
- `trace-SIM-X.json` — the full event log (read from localStorage after the session).
- `thinkaloud-SIM-X.md` — in-persona think-aloud + UX friction notes.

## Researcher procedure (plays Phong-as-researcher; output is simulation material for Phong, never his claims)
1. Observation pass: read both traces against design.md §3's trace→construct mapping. For every construct: is it visible in the trace? Where does the trace alone mislead without recall?
2. Stimulated recall: 4–6 questions per participant, each anchored to a SPECIFIC event (seq number), following Lyle 2003 discipline — describe the moment, ask them to reconstruct thinking, never lead.
3. After answers: final assessment in `assessment.md`:
   - Construct coverage audit (trace × construct table, with gaps)
   - Where recall changed the interpretation a trace-only reading would have made (the "traces never speak alone" test)
   - Instrument critique: what to fix before a real pilot (ranked)
   - Protocol critique: consent, task framing, recall procedure
   - GRAITE-vision fit: pedagogical / meaningful / ethical / democratic integration
   - RQ1–3 serviceability + refinement PROPOSALS (Phong owns final wording)
   - Feasibility notes for a year-1 doktorand

## Ground rules
- Traces never speak alone; every pattern earns meaning through (simulated) participant interpretation.
- Personas stay internally consistent even when it makes the data less flattering to the instrument.
- All outputs labeled SYNTHETIC/REHEARSAL.
