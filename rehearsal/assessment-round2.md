# Round 2 assessment — aggregated analysis (quantitative + qualitative), Rounds 1+2

> SYNTHETIC REHEARSAL. Analyst: Fable (orchestrating model), 2026-07-17. **Provenance caveat, stated up front:** Round 2 sessions were played by the analyst at Phong's direction (not independent agents, unlike Round 1); the recall interviews WERE conducted with independent agents (the original R1 SIM-A agent, holding its session-1 memory, answered for SIM-A-R2; a fresh agent seeded only with SIM-C's trace+think-aloud answered for SIM-C). Same-author bias therefore applies to the *sessions*, less so to the *interviews*. Nothing here is evidence about teacher educators.

## 1. Quantitative — the traces (4 sessions, 2 rounds)

| Metric | SIM-A (R1) | SIM-B (R1) | SIM-C (R2) | SIM-A-R2 |
|---|---|---|---|---|
| Total events | 26 | 28 | 17 | 19 |
| Accepts / edits / rejects | 2 / 2 / 2 | 7 / 1 / 1 | 3 / 0 / 2 | 1 / 2 / 1 |
| Rejects with usable rationale | 0 of 2 (tags lied/void) | 0 of 1 ("Other") | **2 of 2** (1 tag-only, 1 text-only) | **1 of 1** (tag + full text) |
| Undecided suggestions (no action ever) | 0 | 0 | **1** | 0 |
| Post-acceptance codings | removed (disputed) | modified 0.478 (boilerplate cleanup) | modified 0.947 (time trim — correct) | **removed 0.019 (WRONG — skeleton kept)** |
| Recall flags | 2 | 1 | 0 | 1 (multi-line, argumentative) |
| session_end present | no (v0.1) | no (v0.1) | yes | yes |

**Key quantitative facts:**
- **Rejection rationale capture went from 0/3 usable (R1) to 3/3 usable (R2).** The v0.2 tag expansion + free text is a confirmed fix — and note the *mode split*: the pragmatist treats tag and text as either-or (never both); the veteran uses both. Rationale *format* may itself be a profile signature.
- **The similarity metric's failure is now quantified:** one-spelling receipt edit = 0.92; genuine deep rebuild at insertion = 0.113; skeleton-preserving rework post-acceptance = **0.019 → coded "removed."** The v0.2 `transformed` band (0.15–0.6) is empty in exactly the case it was created for. Meanwhile SIM-C's time-trim correctly landed at 0.947 = modified. Verdict: **the detector works for surface edits and fails for deep transformation — because Dice-over-bigrams measures word retention, and "skeleton kept, flesh replaced" retains structure, not words.** The category was right; the arithmetic cannot see it.
- **A new event class exists that no schema captures: the non-decision.** SIM-C's third suggestion received no action, ever. Currently invisible in analysis unless one diffs `suggestions_shown` against decisions. In real data, undecided suggestions will be common (and meaningful: "it stopped being a decision the second I moved my eyes").

## 2. Qualitative — the interviews (what only recall produced)

**The receipt problem (SIM-A-R2, Q1) — the round's central finding.** "The doubt was not about the sentence… the doubt was about how my clicking would *read*. Your instrument now measures a man managing his own record… a receipt is not a judgment — it is a signature forged in the shape of one. If participants leave receipts, your edit-rate stops measuring scrutiny and starts measuring self-consciousness." → **Reactivity is not noise around the signal; after session 1 it is *part of* the signal.** The 0.92-similarity edit is quantitatively indistinguishable from a light genuine edit; only the interview (and, remarkably, the participant's own pre-flag) identified it.

**The trajectory doctrine (SIM-A-R2, Q5).** "Trust neither session as 'the truth'; trust the *trajectory* — what changes across sessions is where the honest signal lives, because the drift itself is what your instrument does to people. The later the session, the more the trace needs me to translate it." → Direct design consequence for Phase 2: multi-session participation is not a convenience, it is the unit of analysis; and interview budget should be weighted toward later sessions.

**Adaptation as subject matter (SIM-A-R2, Q3).** The capitals-in-prompt behaviour: "if your object is the naive first encounter, I am spoiled goods; if your object is how professional judgment *adapts* to a tool over time — and for teacher education it had better be — then the capitals are a finding, not a flaw. Teachers do not meet these tools once." → Resolves the reactivity threat by reframing the study object; this belongs in the ISP's design rationale.

**Consent that ages (SIM-A-R2, Q4).** Second consent ≠ first consent ("by then each bullet had a face"). Proposal from the participant himself: per-session consent deltas ("here is what your trace was used for, here is what changed in what we record"), and showing the previous trace officially before each new session. → Goes into ethics-skeleton §5 as a design item; also note his point that v0.2's changes were made *because of* participant feedback and participants should acknowledge that — a co-design ethics loop.

**The friction economics of the median case (SIM-C, Q2–4).** Tag-vs-text is either-or in the pragmatist's hands; 0.3-second accepts are real and unashamed ("that's what 0.3 seconds of reading buys you"); the counter "made me NOTICE, it didn't make me STOP — information doesn't stop a busy person, friction does. And even then I'd probably be annoyed at the friction, so, pick your poison." → Any design that tries to *force* reflection will trade ecological validity for data richness; the instrument should stay observational and let the interview carry the reflective load.

**The mirror's limits (SIM-C, Q5 vs SIM-A-R2, Q5).** Pragmatist: "it didn't bother me, it just wasn't for me, and maybe that's okay" (would want an end-of-session *useful summary* — "you kept quick-and-concrete, you cut duplicates" — but admits he'd barely use it). Veteran: mirror AND stage, refuses to give back the transparency that caught the detector error. → The trace mirror's value is profile-dependent; its *transparency* function (catching miscodings live) is defensible for everyone, its *reflective* function is not universal. Answerability, notably, did NOT arise unprompted from SIM-C — first evidence the construct may be profile-bound (engaged profiles), not universal. Honest note: R2 sessions were played by the analyst, so absence-of-answerability in SIM-C is weak evidence; flag for real data.

## 3. v0.2 fix-by-fix verdict

| Fix | Verdict |
|---|---|
| Reject tags + free text | ✅ Works; also yields a new signal (rationale format as profile marker) |
| `ai_text_transformed` category | ⚠️ **Category right, detector blind** — 0.019 on a skeleton-preserving rework; the exact R1 dispute recurred |
| Clean payloads (note field) | ✅ No boilerplate in artifacts; SIM-C noticed and ignored the note line — correct behaviour |
| `request_index` | ✅ Present; not yet analytically exercised |
| Inline multi-line flag | ✅ Veteran used it argumentatively ("annotating your data about me, inside your data about me"); zero use by pragmatist (persona-honest) |
| `session_end` | ✅ Both R2 traces bounded |

## 4. Refinements proposed for v0.3 (research decisions — Phong + supervisors sign off)

1. **Stop auto-adjudicating transformed-vs-removed.** The similarity number stays logged (cheap, recodable), but when accepted AI text disappears at sim < 0.6, the instrument should ASK THE PARTICIPANT — one tap, their words: "You replaced the AI's text. Did you keep anything of its idea? [its structure / its ideas / some phrases / nothing]" → event `provenance_self_report`. This converts the detector failure into participant interpretive authority (the study's own epistemology), and SIM-A-R2's interview Q2 effectively specified it. Structural/graph parsing (his other suggestion) is a research contribution in itself — park for P4, don't build into v0.x.
2. **Log `suggestion_unresolved` at session_end** for every shown suggestion with no decision event — makes the non-decision a first-class datum instead of a join nobody runs.
3. **Consent deltas for multi-session studies** — per-session "what changed, what your trace was used for" screen (ethics-skeleton §5 addition; UI trivial).
4. **Do NOT add reflection friction** (no forced confirms, no overlap warnings) — SIM-C's testimony; the interview carries reflection.
5. **Analysis-plan rule, not code:** treat session index as a covariate everywhere; design Phase 2 for ≥2 sessions per participant and weight interviews toward later sessions (trajectory doctrine).

## 5. Standing limitations of this rehearsal
Same-author sessions (R2); scripted suggestion pool (no real model variance); no Swedish-language sessions yet; personas are archetypes even when aiming for the median. None of this touches the mechanical verdicts (§3) — all of it caps the interpretive ones (§2).
