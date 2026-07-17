# GRAITE Co-Creation Instrument — Design Document

**Version:** v0.3 boundary object · 2026-07-17 · **Status: DRAFT — the logging schema is a research decision and is NOT final until Phong and supervisors sign off (Phase 0's purpose is exactly this co-design).**

> **Schema v0.3-draft changes (2026-07-17, from Round 2 rehearsal — see rehearsal/assessment-round2.md):**
> 1. Round 2 FALSIFIED the auto-detector: a skeleton-preserving rework scored similarity 0.019 (word overlap ~0) and was mis-coded `ai_text_removed` — the very dispute v0.2 tried to settle. Fix: below the confident-modification band (sim < 0.6) the instrument no longer guesses transform-vs-remove; it asks the participant `provenance_self_report` (kept: structure / ideas / phrases / nothing). Their answer is the record; raw similarity is still logged for recoding. Above 0.6 it still auto-logs `ai_text_modified_post_acceptance` (clear light edit, no interruption). This makes the trace obey the study's own epistemology: traces never speak alone.
> 2. New `suggestion_unresolved` event, emitted at session_end for every shown suggestion with no accept/edit/reject — the "non-decision" (SIM-C: "it stopped being a decision the second I moved my eyes"), previously invisible.
> 3. The self-report question is deliberately NON-blocking (no modal, no forced reflection) — Round 2 (SIM-C) showed friction trades ecological validity for data; an unanswered question stays a `queried` span and surfaces as unresolved at session end.
> **Deferred to P4 / real build, not v0.x:** structural/graph-based similarity (parse both texts into actor-action-object steps, compare sequences) — SIM-A-R2's own proposal; it is a research contribution, not a demo feature. Reactivity ("the receipt problem") and the trajectory doctrine (session index as covariate; ≥2 sessions/participant; weight interviews to later sessions) are ANALYSIS-PLAN items, not code.

> **Schema v0.2-draft changes (2026-07-12, from the synthetic rehearsal — see rehearsal/assessment.md):**
> 1. `suggestion_rejected` gains `reason_text` (free text) and two new tags ("Ignored my instructions or constraints", "Too much preparation or time") — both rehearsal personas' true reasons fell outside the original four tags, destroying RQ1's core datum at capture.
> 2. New event `ai_text_transformed` between modified and removed (sim 0.15–0.6): SIM-A disputed the binary coding — "I kept the machine's skeleton and replaced its flesh; that is not removal." Thresholds are draft values; every event carries `similarity` so later recoding needs no recollection.
> 3. Provider annotations moved out of insertable content into a card-only `note` field — the "(Tailored to…)" tail had contaminated artifacts, acceptance volume, and edit metrics across four constructs.
> 4. `prompt_submitted`/`suggestions_shown` gain `request_index` — first-cycle latencies are orientation-confounded (SIM-B's longest "deliberation" was finding the Accept button); a real protocol adds a warm-up task.
> 5. Recall markers get a multi-line inline editor (markers did real interpretive work in rehearsal — they repaired two capture failures) and an explicit **End session** button now emits `session_end` (neither rehearsal trace had one).

## 1. What this is

A purpose-built co-creation environment in which teacher educators produce real course materials with an AI partner, while every act of professional judgment — requesting, accepting, editing, rejecting, overriding — is captured as a structured, replayable trace. The instrument is to this study what the video camera is to interaction analysis: a designed way of making practice observable (Research Plan v2). This v0 is a **supervision boundary object**: a demo with synthetic data, no participants, no real AI calls.

## 2. Theoretical grounding

| Design element | Grounding |
|---|---|
| Trace-first design; artifact + interaction history as data | **CoAuthor** (Lee, Liang & Yang, CHI 2022): 63 writers × GPT-3, every session fully replayable from logged events; suggestion lifecycle (request → shown → select/dismiss) with model parameters logged per request. The direct methodological precedent — proof this design publishes at top venues. |
| User-invoked AI, never proactive; easy dismissal and correction | **Amershi et al. 2019** (18 guidelines for human–AI interaction, CHI): efficient invocation (G7), efficient dismissal (G8), efficient correction (G9); also **Horvitz 1999** mixed-initiative principles. The teacher educator always initiates — this is a construct-validity requirement, not just UX: unprompted suggestions would contaminate the agency constructs. |
| Event cycles as analytic unit | Process-mining study of preservice teachers' GenAI lesson planning (JDLTE 2025): prompt → review → refine cycles distinguish "Reflective Iterative" from "Linear Extraction" patterns — validates RQ2's interaction-pattern analysis. |
| Trace → construct mapping | Research Plan v2 §4 (Suchman 2007 reconfigurations; Mishra, Warr & Islam 2023 relational TPACK; Pareto & Willermark 2022 TPACK in situ). See §4 below. |
| Statement shape | Loosely aligned with **xAPI** actor–verb–object so future export to a Learning Record Store is a mapping, not a redesign. Deliberately NOT adopting xAPI/LRS now (ponytail rung 1: YAGNI for a demo). |
| Participant interpretive authority | Stimulated recall (Lyle 2003): the **trace mirror** shows participants their own trace live, and **recall markers** let them flag moments for the recall interview themselves. Frame: their mirror, not our camera. |

## 3. Event schema v0.1-draft

Envelope (every event): `{ event_id, session_id, seq, at, type, data }` — `seq` is a session-monotonic integer (process mining needs total order; wall-clock alone is not safe), `at` is ISO-8601.

Session context (in `session_start.data`): `schema_version`, `app_version`, `participant_code` (pseudonymous — never a name), `provider {name, model, version}` (model churn rule: the model is a documented material condition), `consent_ack`.

| Event type | Key data fields | Construct it serves |
|---|---|---|
| `session_start` / `session_end` | context above | session bounding |
| `prompt_submitted` | `prompt_text, target_section_id, chars` | pedagogical intentionality as steering; reformulation chains |
| `suggestions_shown` | `request_id, suggestions[{id, content}], model, latency_ms` | suggestion lifecycle (CoAuthor) |
| `suggestion_accepted` | `suggestion_id, request_id, section_id` | acceptance streaks → automation-deference candidates (interpret only via recall) |
| `suggestion_edited_then_inserted` | `suggestion_id, section_id, original, edited, similarity` | **negotiated authorship** — agency reconstituted, not surrendered |
| `suggestion_rejected` | `suggestion_id, request_id, reason_tag?, reason_text?` (tag + free text, both optional) | **judgment moment** (Suchman's breakdowns made visible) |
| `manual_edit` | `section_id, before, after` (snapshot on pause/blur) | human authorship baseline |
| `ai_text_modified_post_acceptance` | `suggestion_id, section_id, similarity` (sim ≥ 0.6) | delayed judgment; light rework |
| `ai_text_transformed` | `suggestion_id, section_id, similarity` (0.15 ≤ sim < 0.6) | **negotiated authorship, deep form** — skeleton kept, flesh replaced |
| `ai_text_removed` | `suggestion_id, section_id, similarity` (sim < 0.15) | **override** — the strongest judgment signal |
| `recall_marker` | `note?, section_id?` | participant-flagged stimulated-recall anchor |
| `artifact_snapshot` | `version, sections[]` | version history → distribution of authorship |
| `section_added/renamed/removed` | `section_id, title` | artifact structure agency |

**Granularity decision (deliberate, revisit with supervisors):** NOT keystroke-level (CoAuthor was). Snapshot-on-pause + suggestion lifecycle is sufficient for the v2 constructs and is the data-minimisation posture GDPR wants. `# ponytail:` receipt in code; debt ledger entry. If interaction analysis later needs finer grain, that is a schema version bump proposed through the Decision Register.

**Post-acceptance provenance (v0 heuristic, honest limitation):** accepted AI text is tracked by substring/similarity against its section; disappearance → `ai_text_removed`, partial survival (similarity 0.3–0.9) → `ai_text_modified_post_acceptance`. Character-level provenance spans are deferred — right answer for a demo, flagged for the real build.

## 4. Privacy & ethics posture (demo-safe, deployment-ready shape)

- Consent screen before anything; states in plain language exactly what is logged, with the full list visible.
- Trace mirror permanently visible — transparency is structural, not a settings toggle.
- **Withdraw & wipe** button: one click deletes all local session data (consent/withdrawal mechanics are never on the chopping block).
- Pseudonymous `participant_code` only; demo hardcodes `DEMO-01`.
- All data stays in the browser (localStorage) + explicit JSON export. No network calls in demo mode. Real deployment: EU-hosted endpoints under DPA, storage only in GU-approved systems — decided at etikprövning time, not here.

## 5. Simulated provider

`SuggestionProvider` interface (`name/model/version` + `getSuggestions()`); demo ships `SimulatedProvider` — curated, pedagogically-plausible suggestion pools per section kind (objectives / activities / assessment / materials / generic), light prompt-keyword echo, ~600ms artificial latency, 3 suggestions per request. A real `AnthropicProvider` is an adapter drop-in later; its model choice is a GDPR decision before a capability decision (Research Plan v2 §6).

## 6. References

Lee, Liang & Yang 2022 (CHI) · Amershi et al. 2019 (CHI) · Horvitz 1999 · Suchman 2007 · Mishra, Warr & Islam 2023 · Pareto & Willermark 2022 · Lyle 2003 · Shaffer 2017 (QE/ENA) · JDLTE 2025 process-mining study · xAPI spec (ADL).
