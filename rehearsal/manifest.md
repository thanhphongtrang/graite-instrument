# Rehearsal manifest — provenance ledger for the synthetic corpus

> SYNTHETIC REHEARSAL, all sessions. Built 2026-07-18 (B+8, Round 3 methodology upgrade) so this corpus's provenance is auditable before any of it is cited in P4. Nothing here is evidence about teacher educators.

| Persona | Round | Date | Schema version | session_id | Trace file | Think-aloud file | Interview | Session driver | Prompt-blinding |
|---|---|---|---|---|---|---|---|---|---|
| SIM-A | 1 | 2026-07-12 | 0.1-draft | `ba4f2e2f-792c-48ef-8e9c-5ffe52180079` | `trace-SIM-A.json` | `thinkaloud-SIM-A.md` | `interviews-archive.md` (referenced in assessment.md; not separately archived verbatim before 2026-07-18) | Independent agent | Not applicable (pre-B+2; persona had full method knowledge) |
| SIM-B | 1 | 2026-07-12 | 0.1-draft | `5859c4a0-0c24-4d99-84d9-25ae1b35094b` | `trace-SIM-B.json` | `thinkaloud-SIM-B.md` | `interviews-archive.md` §"SIM-B — Round 1" | Independent agent | Not applicable (pre-B+2) |
| SIM-C | 2 | 2026-07-17 | 0.2-draft | `9f7cf579-0bba-47c7-8a6b-ed714304e5b3` | `trace-SIM-C.json` | `thinkaloud-SIM-C.md` | Fresh agent seeded from trace+think-aloud only (per assessment-round2.md provenance note) | Fresh agent (session), independent of R1 | Not applicable (pre-B+2) |
| SIM-A-R2 | 2 | 2026-07-17 | 0.2-draft | `fa2f4f7c-aa14-4956-bf46-d202381107aa` | `trace-SIM-A-R2.json` | `thinkaloud-SIM-A-R2.md` | `interviews-archive.md` §"SIM-A — Round 2" | **Orchestrating model played the session itself** (not independent — the known Round 2 same-author-session limitation; interview WAS conducted by the original R1 SIM-A agent, holding its own R1 memory) | Not applicable (pre-B+2) |
| SIM-D | 3 | 2026-07-18 | 0.4-draft | `7d03a0a1-647f-4e2a-84e8-41e6c715cb1f` | `trace-SIM-D.json` | `thinkaloud-SIM-D.md` | `interviews-archive.md` §"SIM-D — Round 3" | **Independent, freshly-spawned agent** (no shared context with analyst or with SIM-B-R2) | **Yes (B+2)** — task-natural persona instructions only; no mention of self-report mechanism, similarity detector, or expected event types |
| SIM-B-R2 | 3 | 2026-07-18 | 0.4-draft | `e4bb63f8-7f5c-471b-a128-791803f1d976` | `trace-SIM-B-R2.json` | `thinkaloud-SIM-B-R2.md` | `interviews-archive.md` §"SIM-B — Round 3" | **Independent, freshly-spawned agent**, seeded per B+9 from `trace-SIM-B.json` + `thinkaloud-SIM-B.md` + her own R1 interview only (explicitly forbidden from SIM-A's interview or any assessment doc) | Returning-persona seeding, not cold-start blinding — she legitimately "remembers" only what those three files contain |

## Two trajectories

- **SIM-A → SIM-A-R2** (veteran, R1→R2): same-author-session limitation on R2 noted above; interview independence preserved.
- **SIM-B → SIM-B-R2** (pragmatist, R1→R3): fully independent sessions both rounds; first trajectory with machine-readable `session_index` (schema v0.4-draft).

## Known gaps in this corpus (for anyone citing it later)

- No session has tested the `provenance_self_report` *skip* path (declining to answer) — untested across all three rounds.
- Only one persona-subject combination exists per subject area (SIM-D = math specialist + deep-reworker profile; no math-specialist-fast-accepter or generic-subject-deep-reworker exists yet) — see assessment-round3.md §1 Q2 for why this matters.
- No Swedish-language session has been rehearsed.
- SIM-A's Round 1/2 "documented deafness" episode requires the recoding note in assessment-round3.md §1 (Q2) before further citation — it was partly a static-pool artifact, not purely persona-negotiation data.
