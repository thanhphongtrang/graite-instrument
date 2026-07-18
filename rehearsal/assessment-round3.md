# Round 3 assessment — v0.4-draft field test

> SYNTHETIC REHEARSAL. Analyst: executing agent (orchestrating this Phase 0 plan), 2026-07-18. **Provenance, stated up front (per B+8 manifest discipline):** SIM-D and SIM-B-R2 were each played by an independent, freshly-spawned agent with no shared context with this analyst or with each other — restoring the genuine independence Round 1 had and Round 2 lacked. SIM-D was prompt-blinded per B+2 (no mention of the self-report mechanism, similarity detector, or expected event types — task-natural persona instructions only). SIM-B-R2 was seeded per B+9 from `trace-SIM-B.json` + `thinkaloud-SIM-B.md` + her own verbatim R1 interview in `interviews-archive.md` (and explicitly forbidden from reading the SIM-A section of that file, or any assessment document). Recall-interview questions for both were drafted by a third, separately-spawned researcher agent, blind to all prior-round assessments at draft time (B+4) — reading only each session's own trace + think-aloud. Nothing here is evidence about teacher educators; it is evidence about whether the instrument works.

## 0. Sessions run

| Persona | Round | Session_index | Subject area | Prompt-blinded? | Seeded from |
|---|---|---|---|---|---|
| SIM-D | 3 | 1 | mathematics didactics | Yes (B+2) | fresh, no seed (new-to-study persona) |
| SIM-B-R2 | 3 | 2 | digital competence | N/A (returning persona, not blind to being persona SIM-B) | trace-SIM-B.json, thinkaloud-SIM-B.md, SIM-B's R1 interview only (B+9) |

Full session manifest, all 6 rehearsal sessions to date: `rehearsal/manifest.md`.

## 1. Three-question verdicts

**Q1 — Does `provenance_self_report` work on naive users (wording bias? skip behavior? does skipping land correctly as unresolved)?**

Yes, semantically — with one real UX rough edge. SIM-D met the question genuinely cold (blind prompt, no foreknowledge) and it fired twice (seq 14, 15) after a single manual rewrite touched two previously-accepted/edited spans in the same section. Both times SIM-D answered "its ideas — I kept the point, wrote it my way," and both the in-session account and the later recall interview describe the options as fitting cleanly: *"The options fit what I meant well — I didn't feel like I had to force my answer into an ill-fitting box."* The wording itself passed cold contact.

The rough edge: firing **twice, back to back, for what felt like one continuous editing act** read as a glitch before it read as two legitimate, separately-scoped questions (SIM-D: *"my first instinct was 'didn't I just answer this?'"*). This is a real, previously-undetected finding — the mechanism is semantically sound but its batching/presentation is not yet legible when multiple spans resolve near-simultaneously. Worth a design note (e.g. "you changed two things in this section — one question about each"), not necessarily a schema change.

**Not tested this round:** the *skip* path (declining to answer, leaving a span `queried`) — neither SIM-D nor SIM-B-R2's session produced an unanswered self-report question. This remains genuinely untested; do not claim "skip lands correctly as unresolved" as verified.

**Q2 — Does subject-area shape the trace signature (Willermark), or does the generic instrument flatten it?**

Suggestive yes, but **confounded with profile**, and that confound must be named plainly. SIM-D's accepted/edited/rejected material is substantively mathematical — "looks right vs. is right," representation-completeness, mathematical-practice language ("quietly skipped" a practice) — genuinely different in kind from SIM-B-R2's curriculum-anchoring and generic delegation-vs-judgment framing. The subject-variant pool (B+1) clearly serves *disciplinarily distinct content*, which is the necessary first condition for Willermark's claim to even be testable.

But SIM-D and SIM-B-R2 differ in **two** ways at once — subject area AND persona profile (careful deep-reworker vs. fast light-touch accepter) — and this round has only one arm per combination. We cannot yet separate "the subject shaped the judgment pattern" from "this profile shapes the judgment pattern, and happens to be the one we gave the math pool to." **Design note for Phase 2:** subject-area and profile need to be crossed (e.g. a fast-accepting math specialist, or a deliberate digital-competence specialist) before subject-specificity can be claimed independently of who happens to hold that subject.

**Confessed confound, recoded (per B+1):** SIM-A's Round 1/2 "documented deafness" — the simulated AI repeatedly ignoring *demokratiuppdraget* — was previously read in `assessment.md`/`assessment-round2.md` as a participant-negotiation finding (SIM-A's persistence against an unresponsive interlocutor). With the subject-variant pool now built, it's clear this was **at least partly an artifact of there being only one static, generic pool at the time** — the machine could not have surfaced *demokratiuppdraget* because nothing resembling it existed in the only pool available, for any persona, regardless of insistence. This does not erase the finding (SIM-A's *behavior* — capitalizing the clause, repeating it — is still real persona data about adaptation), but its *object* (an AI that specifically, meaningfully ignores civic-mission framing) was oversold; a fair recoding is "SIM-A adapted to a limitation of the demo pool," not "SIM-A adapted to the AI declining to engage with democratic values." Future citation of this episode (e.g. in P1/P4) should carry this caveat.

**Q3 — Is the receipt problem profile-dependent? (Round 2 had only the veteran's trajectory.)**

Now tested against a second profile, and the answer is: **dependent in form, not in occurrence.** SIM-B-R2 (the fast, efficiency-first pragmatist) shows a real but structurally different version of reactivity than SIM-A-R2's edit-for-the-record. She made no post-hoc prose edits driven by self-consciousness — her one edit (30→15 minutes) is identical in kind to Round 1. But her recall interview (Q4, on the recall-marker she left after the third learning objective) surfaces a parallel effect on **attention allocation** rather than editing: *"I made myself actually read it before accepting... I caught myself reading carefully specifically because I knew this moment might get replayed to me in an interview like this one... I genuinely don't know [if that's a real change in me or just me managing what the log would show]."*

That is the receipt problem in a different register: not "a click dressed as judgment" but "attention redirected toward what the log will show." **Verdict: reactivity of some kind appears to be a general effect of this instrument's transparency across at least two distinct profiles, not an artifact of the veteran's particular relationship to scrutiny.** This generalizes Round 2's single-trajectory finding, though still only n=2 trajectories — treat as a real signal, not a settled claim.

## 2. v0.4-draft fix-by-fix verdict

| Fix | Verdict |
|---|---|
| `session_index` | ✅ Present and correct in both sessions (1, 2); consent-delta correctly gated at `>= 2` (did not fire for SIM-D, fired for SIM-B-R2) |
| `subject_area` | ✅ Present in both (`"mathematics didactics"`, `"digital competence"`); optional field, no friction reported by either persona |
| Task-framing (doc title) | ✅ Correctly switched per subject (`"Mathematics seminar plan — working draft"` for SIM-D; generic title for SIM-B-R2) |
| B+1 subject-variant suggestion pool | ✅ Confirmed working — SIM-D's suggestions were substantively mathematics-didactics content, not the generic AI-literacy pool. Also surfaced the confessed pool confound above (recode SIM-A's "deafness" episode) |
| B+7 consent-delta screen | ✅ Fired correctly for SIM-B-R2 only. **Bonus finding:** the screen's content measurably shaped her behavior — her interview (Q1) reports the "unresolved suggestions are logged" line "planted a seed" she only consciously connected to her own actions after the fact, when she left two suggestions unresolved. The consent-delta text is not inert; it appears to prime what participants later notice about themselves |
| `provenance_self_report` (carried from v0.3, first cold/blind test) | ✅ Semantically sound (see Q1) — **UX gap found:** simultaneous/rapid double-firing for two spans changed in one edit reads as a glitch, not two questions. Worth a grouping affordance; not a wording or schema fix |
| `suggestion_unresolved` | ✅ Fired correctly for SIM-B-R2 (2 events) — first confirmation this category fires from genuine session-ending time pressure in a different profile, not just SIM-C's single Round-2 instance |
| **New fix, found via Round 3 (not in the original plan):** prompt-box not clearing after submission | 🔧 **Real data-integrity bug**, found by SIM-D: the "What do you need?" field never reset after a request, so a second prompt could land spliced into leftover text from the first — the recorded `prompt_text` then no longer matched what the participant meant to ask. **Fixed during this round** (`setPrompt('')` added after each request in `App.tsx`; see git history) — this is exactly the kind of thing Round 3 exists to catch before the freeze, and is now closed, not deferred |

## 3. Updated cross-round quantitative table (6 sessions, 2 trajectories)

| Metric | SIM-A (R1) | SIM-B (R1) | SIM-C (R2) | SIM-A-R2 (R2) | SIM-D (R3) | SIM-B-R2 (R3) |
|---|---|---|---|---|---|---|
| Total events | 26 | 28 | 17 | 19 | 22 | 32 |
| Accepts / edits / rejects | 2 / 2 / 2 | 7 / 1 / 1 | 3 / 0 / 2 | 1 / 2 / 1 | 2 / 2 / 2 | 8 / 1 / 1 |
| Rejects with usable rationale | 0 of 2 | 0 of 1 | 2 of 2 | 1 of 1 | **2 of 2** | **1 of 1** |
| Undecided suggestions (`suggestion_unresolved`) | 0 (pre-schema) | 0 (pre-schema) | 1 (uncoded) | 0 | 0 | **2 (coded)** |
| Post-acceptance codings | removed (disputed) | modified 0.478 | modified 0.947 | removed 0.019 (wrong) | **`provenance_self_report` ×2, sim 0.036/0.039, both "ideas"** | none this session |
| Recall flags | 2 | 1 | 0 | 1 | 2 | 1 |
| `session_end` present | no (v0.1) | no (v0.1) | yes | yes | yes | yes |
| `session_index` (schema field) | n/a (pre-field) | n/a (pre-field) | n/a (pre-field) | n/a (pre-field) | **1** | **2** |
| `subject_area` (schema field) | n/a | n/a | n/a | n/a | **"mathematics didactics"** | **"digital competence"** |

**Two trajectories now on record:** SIM-A (veteran, R1→R2, pre-v0.4 schema — session numbering informal) and **SIM-B (pragmatist, R1→R3, now machine-readable `session_index` 1→2)** — the second trajectory the trajectory doctrine (docs/analysis-plan.md §3) called for.

## 4. B+5 — artifact-quality mini-review

**SIM-D's seminar plan (mathematics didactics).** Coheres pedagogically: the error-hunt activity and its shorter representation-noticing add-on share a single throughline (an AI's mathematical output can be locally correct yet pedagogically incomplete), and the two accepted/edited learning objectives name that same throughline explicitly ("looks right" vs. "is right"; naming which mathematical practice the AI's path skipped). Assessment and Materials sections are empty — consistent with a first, time-bounded session, not a design flaw. Trace-pattern correlation: the sections with the deepest rework (Activities, sim 0.036–0.039) are also the sections carrying the plan's sharpest, most distinctive language — a visible link between "the participant fought this text" and "this text is the strongest part of the artifact," worth watching for as a candidate outcome measure in Phase 2.

**SIM-B-R2's seminar plan (digital competence).** Coheres as a fast, serviceable plan: Overview, Activities, and Materials read as a standard, competently-assembled seminar (curriculum-anchored objectives, a time-budgeted activity set, two recognizable readings); nothing is incoherent, but nothing is distinctively hers either — the one edit (a time correction) is logistical, not substantive. Assessment remains empty. Trace-pattern correlation: the fast, low-friction trace corresponds to a fast, low-friction artifact — no rework, no distinctive phrasing — which is the expected, profile-consistent pairing, not a concerning one (a time-pressed practitioner producing a usable-if-generic plan quickly is a legitimate outcome, not a failure of engagement).

## 5. Standing limitations of this rehearsal

Same limitations as Rounds 1–2 (personas are archetypes; scripted suggestion pools, now two of them, still no real model variance; no Swedish-language sessions). New this round: Q2's subject-vs-profile confound (§1); the skip-path of `provenance_self_report` remains untested across all three rounds now; only one session per persona-subject combination exists, so "subject shapes trace" and "profile shapes trace" cannot yet be statistically separated even informally. B+3 (docs/analysis-plan.md §6) applies to all timing figures in this document and in the manifest — none should be read as evidence about deliberation speed.
