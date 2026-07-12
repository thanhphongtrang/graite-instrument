# SYNTHETIC REHEARSAL — think-aloud, persona SIM-A ("the veteran skeptic")

**Label:** SYNTHETIC / REHEARSAL — no participants, no findings. Persona: ~25 years in Swedish teacher education, ämnesdidaktik specialist, bildning-committed, AI-wary but precise.
**Session:** 2026-07-11, session_id `ba4f2e2f-792c-48ef-8e9c-5ffe52180079`, participant code DEMO-01.
**Companion file:** `trace-SIM-A.json` (26 events). Seq numbers below refer to that trace.

---

## Consent screen (before seq 1)

The consent text is more honest than most edtech I have been shown in 25 years: it enumerates what is recorded, says plainly what is not, and gives me a one-click withdrawal with no surviving copy. That earns provisional trust. Two reservations, though. First, it tells me *what* is recorded but not *who* will read it or *for which research question* — consent to observation is not consent to interpretation. Second, "snapshots when you pause" is doing quiet work: what counts as a pause? If my hesitation is data, say so. I proceed, warily.

## Writing my own rationale first (seq 2–3, manual_edit, Overview & rationale)

I begin by writing the rationale myself. The framing of a seminar — what is worth teaching, for whom, why — is precisely where judgment lives, and that I do not delegate to a machine on principle. If the trace only shows me reacting to suggestions, it has already mis-framed who is the author here.

## Prompt cycle 1 — Activities (seq 4–5)

My prompt is deliberately constrained: three activities, 10–15 minutes each, AI as object of critique, every activity ending in an articulated, defensible position. I do not ask machines open questions; a vague prompt is an abdication dressed as curiosity.

### Suggestion 1, think-pair-share — ACCEPTED (seq 6), later reworked (seq 22)
The annotate-and-defend structure is sound: it forces students to give reasons, which is the whole game. But it is 20 minutes against my stated 10–15, and it ships with a "(Tailored to your request: …)" advertisement bolted to the text. I accept it as the least-bad scaffold, knowing I will rebuild it by hand. An accept is not the end of judgment; it is a promissory note.

### Suggestion 2, fishbowl — REJECTED, "Not pedagogically appropriate" (seq 8), flagged (seq 9)
The debate claim — "an AI-written lesson plan is still my lesson plan if I approve it" — is a genuine bildung question; I may steal it for a future seminar. But 30 minutes devours two thirds of my seminar and parks half the group as spectators. The real reason for rejection is: *it ignored my explicit constraints.* None of the four reject categories can say that. "Not pedagogically appropriate" was the nearest untruth, and I flagged the moment so the interview can repair what the checkbox flattened.

### Suggestion 3, deconstruction exercise — EDITED THEN INSERTED (seq 10)
The best of the three: a deliberately mediocre AI artifact as an object of deconstruction is exactly how AI should enter teacher education. I compressed 25 minutes to 15, made the silent assumptions didactically specific (about the pupils, about why the content matters, about the teacher's role), and made the *written justification* the product rather than the redesign. The trace records similarity 0.139 — good; the number honestly says I kept the idea and replaced the flesh.

## Prompt cycle 2 — Learning objectives (seq 12–13)

Again a constrained prompt: one objective on justifying when NOT to use AI, one connecting AI use to demokratiuppdraget, all as observable capabilities. This is a test as much as a request: can the machine handle the professional-ethical register, or only the operational one?

### Suggestion 1, Lgr22 evaluation objective — EDITED THEN INSERTED (seq 14)
Competent but generic. It cites Lgr22 without asking which school form my students teach — a didactician does not wave at curricula; Gy25 exists. It also carried the same boilerplate tail. I kept the keep/revise/reject skeleton, added the subject-didactic criteria the curriculum does not spell out, and required the justification in writing.

### Suggestion 2, task-vs-judgment objective — ACCEPTED (seq 16), flagged (seq 18)
"The difference between delegating a task to AI and delegating the judgment about that task" — that is the heart of the matter, and it grates that the machine phrased it better than I would have. I accepted it faster than I have accepted anything from a machine in years, which is exactly why I flagged it: did I judge it, or did it flatter my own vocabulary back at me? The interview should press on this.

### Suggestion 3, pupil-facing design objective — REJECTED, "Other" (seq 19)
A fine objective for a different course. Designing a classroom activity is a session of its own, not a 45-minute outcome, and it drifts from the student teacher's judgment to the pupils'. The honest reason is "does not answer the brief" — again no category for it. I chose "Other" and note that "Other" records *nothing further*: a data black hole precisely where the reasoning is most individual.

### The missing objective — MANUAL (seq 20)
Both of my explicit requirements — when NOT to use AI, and demokratiuppdraget — were ignored across all three suggestions. Twice asked, twice avoided; the machine retreats to the operational register when the professional-ethical one is requested. So I wrote objective 3 myself and marked it "(Mine — the machine avoided this one twice.)" in the document itself, because provenance should be legible to a colleague reading the plan, not only to a researcher reading a trace.

## Rework of accepted AI text — Activities (seq 22–23)

The promissory note comes due. I rewrote the think-pair-share entirely: 12 minutes; the SAME pre-prepared AI artifact for every pair (no live prompting — the seminar's minutes belong to judgment, not typing, and shared material means disagreements are about judgment, not prompt luck); individual marking before pair talk (protects the hesitant voice); every mark carries a one-line reason anchored in ämnesdidaktik — a colour without a reason does not count; and the pair's task is to resolve their two sharpest disagreements, because the disagreement is the learning material. I also deleted the machine's "(Tailored to your request…)" boilerplate, which had sat in my document like a price tag left on the furniture.

**Instrument observation:** the trace recorded this as `ai_text_removed` (seq 23). Interesting and slightly wrong: I kept the AI's pedagogical skeleton (annotate, then defend) and replaced every word. String-matching provenance calls that removal; a didactician would call it inheritance. The modified/removed binary under-credits the AI's structural influence on the final artifact — a construct-validity gap the recall interview must carry.

## Assessment (seq 25) — MANUAL

No graded assessment in 45 minutes; that would be theatre. The exit ticket is the written justification from the deconstruction exercise — it tells me whose judgment is forming and whose is deferring.

---

## UX friction and "the instrument couldn't express what I wanted"

1. **Reject reasons are a four-box cage (seq 8, 19).** My two rejections had the same true reason — *the suggestion ignored my stated constraints / did not answer the brief* — and neither category set could express it. Once I filed the nearest untruth; once I filed "Other", which records nothing. For a study whose object is professional judgment, the rejection rationale is the single most valuable datum, and the instrument flattens it at the moment of capture. Minimum fix: free-text on every reject, or at least on "Other".
2. **Provenance by string similarity misreads rework (seq 22–23).** A substantial rewrite that preserves the AI's structure registers as `ai_text_removed`. Traces will systematically undercount AI influence on exactly the participants — skeptics — who rework hardest. The construct "post-acceptance rework" needs a third state: transformed, not just modified/removed.
3. **Accepted suggestions carry vendor boilerplate into the artifact (seq 6–7).** The "(Tailored to your request: …)" tail entered my course document verbatim on accept. Suggestion text must be clean content, or every accept is contaminated and every later cleanup pollutes the manual-edit data.
4. **Flag notes are single-shot prompt dialogs.** A browser prompt() for the recall note: no line breaks, no review, easy to lose. For the one field where the participant speaks in their own voice, give me a real text area.
5. **No way to say "I am taking the idea but not the text."** I wanted to credit the fishbowl's debate claim while rejecting the activity (seq 8–9). Reject is total; accept is total. Partial uptake — the most common thing an experienced teacher does with any suggestion — has no event type. It will surface, mislabelled, in later manual edits.
6. **Consent (pre-seq-1):** state who reads the trace and for what question; define "when you pause". Minor but the skeptical participant notices.
7. **Cycle observation, for what it is worth:** both cycles' suggestion sets ignored the hardest explicit requirement in the prompt (time constraints in cycle 1, demokratiuppdraget in cycle 2). If the scripted pool does this deliberately, it is a good provocation; if the real model does it, the participant's authorship of the difficult parts becomes the finding.

## Decision tally (this session)

- Accepted: 2 (seq 6, 16) — one later substantially reworked (seq 22), one flagged for scrutiny (seq 18)
- Edited then inserted: 2 (seq 10, 14)
- Rejected with reason: 2 (seq 8 "Not pedagogically appropriate", seq 19 "Other")
- Manual edits: 4 (seq 2 rationale, seq 20 objective 3, seq 22 rework, seq 25 assessment)
- Recall flags: 2 (seq 9, 18)
