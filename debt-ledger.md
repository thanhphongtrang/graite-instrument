# Debt ledger — deliberate deferrals with receipts

## FREEZE — v0.4-boundary-object (2026-07-18)

**The instrument is frozen as of this commit, tagged `v0.4-boundary-object`, for the first supervision demo.** Per phase0-next-plan.md's Trap-3 clause (hard rule): **no Round 4, no v0.5, and no further schema or code changes without supervisor input** — the next legitimate move on this repo is Lena/Johan's reaction to the schema table (thresholds, `subject_area`, `session_index`, the self-report mechanic) at the first supervision meeting, not another solo iteration. This freeze covers: schema v0.4-draft (session_index, subject_area, subject-variant suggestion pool, consent-delta screen — all implemented and rehearsal-verified in Round 3, see rehearsal/assessment-round3.md), the reground provenance rationale in docs/design.md §3, docs/analysis-plan.md v0.1, and the prompt-textarea bug fix. Everything below this line is prior deferral history, still valid, now also frozen — do not act on any of it either without the same supervisor go-ahead.

## Deferred (v0.3, 2026-07-17)
- [2026-07-17] deferred STRUCTURAL similarity (graph/sequence parse of AI vs edited text) because a word-overlap metric can't see "skeleton kept, flesh replaced" (Round 2: sim 0.019 on a genuine skeleton-preserving rework) — but structural parsing is a P4 research contribution, not a boundary-object feature. v0.3 instead asks the participant (provenance_self_report). Revisit when building the real analysis pipeline.
- ~~[2026-07-17] deferred multi-session consent deltas~~ — **implemented in v0.4-draft** (B+7, 2026-07-18): the consent-delta screen now fires when `session_index >= 2`. See docs/design.md changelog and rehearsal/assessment-round3.md. The underlying real-study question (what a returning participant's consent should cover) remains open in ethics-skeleton.md §5 — the code shipped, the ethics question didn't resolve itself.

## Named checks (failures promoted to rules)
- **No-log-in-updater check** (2026-07-11): `trace.log()` must NEVER be called inside a React state-updater function — StrictMode double-invokes updaters and silently duplicates trace events (caught in first verification walkthrough: post-acceptance events fired twice). Review every new `set*(prev => …)` for logging side effects before merge.

- [2026-07-11] deferred keystroke-level logging (CoAuthor granularity) because snapshot-on-pause suffices for v2 constructs and is the better data-minimisation posture; revisit if supervisors want interaction-analysis-grade granularity → schema version bump via Decision Register.
- [2026-07-11] deferred AnthropicProvider (real LLM adapter) because Phase 0 is a no-participants, no-network demo; revisit at ethics-gated pilot, and choose the endpoint as a GDPR decision first.
- [2026-07-11] deferred char-level provenance spans for accepted AI text because a substring + Dice-similarity heuristic is honest and adequate for a demo; revisit for the real build (needed for defensible authorship-distribution claims).
- [2026-07-11] deferred IndexedDB because localStorage holds a demo session comfortably; revisit at real deployment together with server-side storage in GU-approved systems.
- [2026-07-11] deferred session replay UI (CoAuthor-style) because the event log already contains everything needed to build it; revisit when preparing stimulated-recall tooling for Phase 2.
- [2026-07-11] deferred xAPI statement export because no LRS exists in the loop; the envelope maps cleanly if one ever does.
