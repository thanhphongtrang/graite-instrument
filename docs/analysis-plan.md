# Analysis plan — v0.1

**Status:** DRAFT bookkeeping (agent-authored 2026-07-18, per phase0-next-plan.md A5). This codifies rules that were, until now, only stated in rehearsal-assessment prose (rehearsal/assessment.md, assessment-round2.md). It does not itself constitute a research finding — it is P3/P4 prep. **[PHONG/SUPERVISORS]** — these are standing analytic rules the instrument's design implies; they are not final until you've read and pushed back on them.

## 1. `session_index` is a covariate everywhere

Every analysis that aggregates across sessions must carry `session_index` (schema v0.4-draft) as a variable, never collapse it away. This is not a housekeeping preference — Round 2's central finding (the "receipt problem," SIM-A-R2) is that the instrument's own transparency changes participant behavior *after* the first session. A trace from session 2 is not the same kind of evidence as a trace from session 1; treating them as interchangeable observations of the same underlying construct would silently average away the study's own most interesting effect.

**Design consequence for Phase 2:** plan for ≥2 sessions per participant (already a standing decision, see rehearsal/assessment-round2.md §4.5); weight recall-interview budget toward later sessions, per the trajectory doctrine (§3 below).

## 2. First-cycle latencies are orientation-confounded, not deliberation

Bødker's interface-as-object-vs-medium distinction (Suchman 2007 ch.15, see docs/design.md §3 and sources/suchman-2007.md) names what Round 2 found empirically: a participant's first interaction cycle in a session is disproportionately about learning the interface, not exercising judgment. `request_index` (schema v0.2+) exists precisely so this can be marked and excluded or flagged, not averaged in with later, interface-transparent cycles.

**Rule:** any latency-based measure (time-to-accept, time-to-reject, dwell time) must exclude or separately report `request_index === 1` within a session. This applies per-session, not just per-participant — a returning participant's session 2 still has its own first cycle, though Bødker's distinction predicts it should be shorter (transparency carries over faster the second time; worth checking, not assuming).

## 3. Trajectory (change across sessions) is the primary analytic object, not any single session

Direct consequence of SIM-A-R2's interview (Q5): "trust neither session as 'the truth'; trust the trajectory." A single session's trace is not "ground truth" that a later session's trace should be checked against — both are data points in a trajectory, and the *drift itself* (what changes, and why) is where analysis should look first. Concretely: don't ask "was session 1 or session 2 more accurate?"; ask "what changed between them, and does the participant's own account of the change (recall interview) make that drift interpretable?"

## 4. Receipt-detection is an interview task, not a trace task

The "receipt problem" (a click that reads as judgment but is actually self-conscious record-keeping, SIM-A-R2) is **not mechanically detectable from the trace alone** — a receipt edit and a genuine light edit can carry the same similarity score (Round 2: both landed near 0.9+). This is a standing limit, not a gap to engineer around: per docs/design.md §3's provenance rationale (Suchman/Goodwin), what a click *means* is made visible through the participant's own accounting, not through pattern-matching on the click. **Rule:** any construct sensitive to the receipt problem (e.g. "scrutiny," "deference") must be triangulated through recall interview, never asserted from trace shape alone.

## 5. `suggestion_unresolved` is a first-class category — the "non-decision"

Schema v0.3 added this event (SIM-C: "it stopped being a decision the second I moved my eyes"). Analytically, an unresolved suggestion is not missing data or a null result to filter out before analysis — it is itself a datum, on the same footing as an accept/edit/reject. Any operationalization of "engagement with AI suggestions" that only counts accept/edit/reject and silently drops unresolved suggestions from the denominator will overstate engagement. Report unresolved-rate alongside accept/edit/reject rates, not as a footnote.

## 6. B+3 — rehearsal timing is never evidence (standing rule)

**This rule is specific to rehearsal data (rehearsal/), not real participant data.** Agent-played rehearsal sessions act in seconds; real participants take minutes. Event **order and content** in a rehearsal trace are legitimate rehearsal data (they test whether the instrument's logic and question-wording work); event **latencies and inter-event gaps are artifacts** of the agent acting, not evidence about deliberation speed, and must never be cited as if they were.

**Retrospective flag:** rehearsal/assessment.md and assessment-round2.md both flirt with citing rehearsal latencies in passing (e.g. framing "0.3-second accepts" as a real timing observation about the pragmatist persona in assessment-round2.md §2). Those readings are about the persona's *stated* attitude (via think-aloud/interview), which is legitimate — but any place a rehearsal document cites a wall-clock duration as if it measured deliberation speed should be treated as illustrative color, not data, going forward. This rule is now binding for rehearsal/assessment-round3.md and beyond.

## 7. Chesher's avocation/invocation/evocation triad — evaluated, not yet adopted

Suchman ch.15 (via Chesher) offers a three-beat structure for narrating an assemblage: a person is *hailed* into it (avocation), acts to change its state (invocation), and experiences material/affective results (evocation) that condition the next avocation (see sources/suchman-2007.md).

**Evaluation for P3/P4 episode write-ups:** the triad is attractive as a narrative frame because it explicitly closes the loop — evocation feeding the next avocation matches what the trajectory doctrine (§3) already claims empirically (drift across sessions is conditioned by what came before). It would give episode narration a principled alternative to a flat event-type log, and a vocabulary for *why* a session's ending state matters to the next session's opening state, not just *that* it does.

**Reservation:** the triad describes a single actor's repeated cycle through an assemblage; a co-creation session has (at minimum) the participant AND the simulated/real AI as sources of invocation, and it is not yet clear the triad handles two invoking parties without collapsing one into background "assemblage." It may need adaptation (e.g. tracking whose invocation follows whose evocation) rather than a straight application.

**Recommendation:** provisionally adopt for internal episode-drafting in Round 3's artifact review (B+5) and P3 prototyping, but do not commit to it as the paper's structuring device until it's been tried against at least one real multi-session trace. **[PHONG]** — this is a methodological/narrative choice for you and supervisors, not an agent decision; the reasoning above is bookkeeping, the adoption call is yours.

## 8. What this document deliberately does not do

It does not resolve the similarity-metric thresholds (0.15/0.6 bands remain draft, per docs/design.md), does not propose statistical tests, and does not touch RQ wording. It exists so that analytic rules discovered piecemeal in rehearsal prose don't have to be rediscovered by re-reading assessment.md/assessment-round2.md every time — they're collected here, once, for Round 3 and beyond to build on.
