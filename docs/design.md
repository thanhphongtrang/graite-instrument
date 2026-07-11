# GRAITE Co-Creation Instrument — Design Document

**Version:** v0.1 boundary object · 2026-07-11 · **Status: DRAFT — the logging schema is a research decision and is NOT final until Phong and supervisors sign off (Phase 0's purpose is exactly this co-design).**

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
| `suggestion_rejected` | `suggestion_id, request_id, reason_tag?` (optional quick tag) | **judgment moment** (Suchman's breakdowns made visible) |
| `manual_edit` | `section_id, before, after` (snapshot on pause/blur) | human authorship baseline |
| `ai_text_modified_post_acceptance` | `suggestion_id, section_id, similarity` | delayed judgment; authorship distribution over time |
| `ai_text_removed` | `suggestion_id, section_id` | **override** — the strongest judgment signal |
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
