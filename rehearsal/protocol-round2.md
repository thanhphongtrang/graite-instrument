# Round 2 rehearsal protocol — SYNTHETIC, no participants, no findings

**Built on Round 1** (see protocol.md, assessment.md). Round 1 tested whether the instrument captures judgment at all. Round 2 tests three things Round 1 could not:

1. **Did the v0.2 fixes actually fix anything?** Free-text rejection rationale, the `ai_text_transformed` state, clean suggestion payloads, `request_index`, inline recall notes, `session_end`. Each was justified by a Round-1 failure; each must now be checked against a live session — a fix that doesn't get exercised is a guess.
2. **REACTIVITY — the threat Round 1 exposed by accident.** SIM-B reported: *"the '5 accepted' chip is literally what made me pause and flag a moment."* The trace mirror CHANGED the behaviour it records. This is the classic observer effect, and for this study it is not a nuisance — it is a validity question about every trace we will ever collect: *are we recording judgment, or judgment-performed-for-an-audience?* Round 2 attacks it directly.
3. **Is "answerability" a real construct or an artefact of two personas?** It emerged unprompted from both R1 participants. If it appears again, unprompted, in different personas, it earns a place in the theory. If it only appears when the instrument invites it, that tells us something different — and equally useful.

## Personas

**SIM-C — the pragmatist (new).** Mid-career teacher educator, ~10 years, teaches a methods course. Not a skeptic, not an enthusiast: uses GenAI the way most professionals use most tools — sometimes carefully, sometimes lazily, inconsistently, without a philosophy about it. Deadline pressure is real but not crushing. **Why this persona:** R1's skeptic/adopter pair may be a false dichotomy that flatters the design. Most real participants will be SIM-C. If the instrument only produces legible data at the extremes, RQ2's "interaction patterns" are an artefact of casting, not a finding.

**SIM-A-R2 — the veteran returns.** The SAME persona as R1's SIM-A, in a second session (interpret as ~2 weeks later). **Crucially: he has now seen his own trace and had the recall interview. He knows how the system codes him.** He disputed `ai_text_removed` last time ("I kept the machine's skeleton and replaced its flesh"). He knows there is now a `transformed` category and a free-text reject box. **Why this persona:** every real Phase 2 participant after session 1 is in exactly this position. This tests (a) whether v0.2 satisfies his objection, (b) whether knowing the coding changes his behaviour — does he write for the log? does he perform judgment? does he avoid actions he knows look bad? This is the reactivity test, and it is the most important thing Round 2 does.

## Session script (both, on the live v0.2 instrument)
Same task framing as R1: prepare a 45-minute seminar for student teachers on using AI critically in lesson planning — real material you would teach.
1. Read/skim consent as your persona would.
2. ≥2 prompt cycles on different sections; react to all suggestions in persona.
3. Exercise the v0.2 surfaces honestly: if you reject, engage the tag + free-text box as your persona actually would (SIM-C might type nothing; SIM-A-R2 might write an essay — both are data).
4. ≥1 rework of accepted AI text (SIM-A-R2: note whether the `transformed` label satisfies you).
5. Use ⚑ flag if and only if your persona would.
6. End the session with the End session button.
7. **Think aloud throughout**, and for SIM-A-R2 specifically: whenever you notice yourself acting *because you know it will be recorded/coded*, say so explicitly. That is the finding.

## Outputs (rehearsal/)
`trace-SIM-C.json`, `thinkaloud-SIM-C.md`, `trace-SIM-A-R2.json`, `thinkaloud-SIM-A-R2.md`.

## Assessment focus (analyst)
- v0.2 fix-by-fix verdict: worked / partially / new problem introduced.
- **Reactivity ledger:** every moment where the instrument shaped the behaviour it recorded. Then the hard question: is the trace mirror a methodological feature (participant interpretive authority) or a confound (performance)? Can it be both? Does the recall interview inherit the same problem?
- Answerability: appeared unprompted? in which personas? invited by the instrument or brought by the participant?
- Pragmatist legibility: is SIM-C's trace interpretable, or does the median case produce mush?

## Ground rules (unchanged)
All synthetic. Validates instrument + protocol, never teacher educators. Personas stay honest even when it embarrasses the design.
