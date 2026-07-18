# SYNTHETIC / REHEARSAL — no participants, no findings

This is a synthetic instrument-validation rehearsal of the GRAITE Co-Creation Instrument. There are no real participants and nothing here should be read as a claim about teacher educators. It is a test run of whether the software works and what it captures.

**Persona:** A mathematics-didactics teacher educator at a Swedish university, first time using this tool, building a real seminar plan for student mathematics teachers about generative AI in mathematics education (AI tutors giving worked solutions, proof generation, etc.).

**Session:** DEMO-01, subject area "mathematics didactics"
**session_id:** `7d03a0a1-647f-4e2a-84e8-41e6c715cb1f`
**Trace file:** `trace-SIM-D.json` (22 events)

---

## Getting started

The consent screen was clear about what's recorded and what isn't. I typed "mathematics didactics" into the subject-area field and started the session without hesitation — it's optional and low-stakes, and I appreciated that it told me up front I could wipe everything with one click. Five sections were already scaffolded (Overview & rationale, Learning objectives, Activities, Assessment, Materials & readings), which matched how I'd structure a seminar plan anyway.

## Prompt cycle 1 — Activities

I went to Activities first, since that's the part of this seminar I find hardest to get right: I want something hands-on, not just a lecture about AI risks. I asked:

> "I want a hands-on activity where student teachers feed a proof problem to an AI tutor, get a worked solution back, and then have to hunt for a subtle logical gap in it before we discuss what that means for how they'd use these tools with their own pupils."

Three suggestions came back:

1. **Error-hunt (20 min)** — pairs get an AI worked solution with a baked-in misconception, have to find where the AI reproduced or silently patched it, and defend their finding.
   → **Accepted.** This was almost exactly what I asked for — a genuinely well-targeted response. I'll come back to this one below because I ended up rewriting it heavily later.

2. **Fishbowl discussion (30 min)** — half the group debates "if an AI can generate a valid proof, what's left for the pupil to understand?"
   → **Rejected**, tag "Too much preparation or time", with a note: *"Already have my error-hunt activity for this slot, and a 30-min fishbowl on top would blow the seminar's time budget. Good discussion question though, might reuse it as a follow-up prompt another week."* Genuinely a good prompt, just not one I have room for today — that's a real pedagogical trade-off, not a quality complaint about the suggestion.

3. **Representation exercise (25 min)** — an AI explanation using only one representation, students identify what's missing.
   → **Edit first.** I liked the core idea but wanted to shrink it to a 15-minute add-on and make it concrete (derivative-as-rate-of-change instead of an abstract "a concept"), since I'd already spent my main slot on the error-hunt. I rewrote it to be time-boxed and example-specific, then inserted it.

I flagged a moment on Activities right after accepting suggestion 1, because something nagged at me: *"The AI's first pitch (error-hunt) landed almost exactly right on the first try, which honestly surprised me a little. I want to remember to ask myself in the interview whether I accepted it partly just because it matched my prompt's wording so closely, rather than because it's the pedagogically strongest option."* That's a real methodological worry for me, not just box-ticking — a tool that mirrors your own phrasing back at you can look more "right" than it actually is.

## The rework — this is the important part

After accepting the error-hunt suggestion and inserting my edited representation exercise, I went back into the Activities text box and did a real rewrite, not a touch-up. I kept the *underlying moves* — an error-hunt on an AI-generated proof solution, plus a shorter representation-noticing add-on — but replaced essentially all of the actual sentences with my own phrasing: how the pairs are set up, what they have to be ready to argue, why the representation exercise matters pedagogically (I reframed it around "worse off mathematically" rather than the AI's more generic "missing representations... matters mathematically"). This is just how I work — I very rarely leave AI text as its own sentences for long, even when I've accepted it wholesale, because the exact phrasing needs to sound like something I'd actually say to a room of student teachers, in my own voice. The final self-report similarity scores (0.036 and 0.039, see below) reflect how far this went — that's not an accident, that's the habit.

Practically, this rewrite took much longer than it should have, and not because I was agonizing over the words. The little Activities text box is only a few lines tall, and when I tried to select all the text in it to replace it in one shot, the "select all" behaviour didn't seem to reliably grab the whole field — my first attempt at editing the representation-exercise suggestion actually **spliced my new sentence into the middle of the old one** rather than replacing it cleanly, and I only caught this by re-reading the box afterward. I had to painstakingly select smaller chunks, retype them, and re-check the result piece by piece until the whole passage read as one clean piece of prose. I've left a fuller account of this under UX friction below. The important part is: what ended up in the document is genuinely, sentence-by-sentence, mine — even though I only meant to smooth out one insertion originally.

## Prompt cycle 2 — Learning objectives

I moved to Learning objectives and asked:

> "Help me phrase 3-4 learning objectives for this seminar that go beyond 'can use AI tools' — I want something that names the critical/evaluative stance I actually care about, pitched at the level of a teacher education course, not a coding bootcamp."

(Note: because of the text-box issue described below, what actually got submitted was a garbled splice of this prompt with the leftover text from my first prompt. See UX friction notes — this bothered me more on reflection than it did in the moment.)

Three suggestions:

1. **"Student teachers can critically evaluate an AI-generated proof sketch or worked solution for mathematical validity, not just plausibility — distinguishing 'looks right' from 'is right'."**
   → **Accepted.** This is exactly the register I wanted — it's not about tool operation, it's about a genuine epistemic stance.

2. **"Student teachers can articulate where an AI tutor's step-by-step solution obscures a pupil's own misconception..."**
   → **Rejected**, tag "Other", note: *"This basically restates the objective I just accepted, just from the activity side instead of the assessment side. Keeping both would make the objectives list read as padded rather than sharp."* I want objectives that are distinct from each other, not near-duplicates dressed in different words.

3. **"Student teachers can design a task in which pupils compare an AI-generated solution method with their own, and identify which mathematical practices... the AI path skips."**
   → **Edit first.** Good bones, but I tightened the phrasing and made "quietly skipped" do more work than the flatter original — I want the objective to carry a bit of the same critical edge as the rest of the seminar, not read like a generic learning-outcomes template.

## The mid-session question

Right after I submitted the second prompt, the interface popped up a small panel: **"One quick question — You reworked AI text in past what I can track automatically. What did you keep of it?"** with four options: *its structure*, *its ideas*, *some phrases, not much else*, and *nothing — this is entirely mine now*.

It appeared **twice**, back to back, both times scoped to "Activities." At first I assumed it was one glitchy double-render of the same prompt. Looking at the trace afterward, I understand now that it was actually asking about two *separate* things I'd changed in that section — the accepted error-hunt suggestion and the edited representation-exercise suggestion — each compared independently against what ended up in the document. That's a sensible design once I understood it, but in the moment it read as odd repetition, and I flagged that confusion as its own moment (see below).

Both times I answered **"Its ideas — I kept the point, wrote it my way."** That's honestly exactly right: I kept the underlying pedagogical moves (hunt for an AI-reproduced misconception; notice what's missing from a single-representation AI explanation) but essentially none of the original sentences. The options fit what I meant well — I didn't feel like I had to force my answer into an ill-fitting box. If anything I was a little surprised the tool could tell so precisely that I'd drifted that far from the original wording; I don't know how it's measuring that, but the granularity (asking about "its structure" vs "its ideas" vs "some phrases") mapped cleanly onto distinctions I actually think in when I revise. It did *not* feel intrusive — more like being asked a fair, specific question about something I'd just done, at a moment when it was still fresh enough to answer honestly.

I flagged this as a moment on Learning objectives afterward: *"Right after I moved on to this section, the tool popped up twice asking me what I'd kept of the AI's wording in my Activities rewrite. Fair question, and I answered honestly, but I want to remember in the interview that it asked me TWICE for what felt like one continuous act of rewriting — worth asking whether that's a bug or by design."*

## What I did not bother with

I didn't touch Overview & rationale, Assessment, or Materials & readings this session — with a real seminar plan I'd normally start from whichever part is least settled in my head, which today was Activities and Learning objectives. I also didn't use "Add section." None of that felt like an omission worth flagging; it's just where a real first session with limited time naturally stopped.

## UX friction / instrument notes

A few things that got in the way, worth naming plainly since this is meant to be an honest test of the tool, not just of me:

- **The section text boxes are very short**, only a handful of lines tall. For quick single-sentence edits that's fine, but the moment I wanted to do a real, paragraph-level rewrite (which, given how I work, is often), selecting and replacing the whole thing reliably was much harder than it should be. My first attempt at cleaning up the representation-exercise suggestion actually spliced new text into the middle of the old text instead of replacing it — I didn't notice until I re-read the box. That's a real risk for careless errors sneaking into a document that's supposed to represent careful pedagogical thinking.
- **The "What do you need?" prompt box does not appear to clear between requests.** When I typed my second prompt (for Learning objectives), it landed in the middle of the leftover text from my first prompt rather than replacing it or appending cleanly. I caught this on screen and thought it was just a visual glitch — but when I read the trace afterward, the actual `prompt_text` recorded for that second request is the garbled splice, not my intended sentence. That's not just cosmetic: it means the record of "what I asked for" doesn't match what I actually meant to ask, for anyone reading the trace later (a supervisor, or future-me in the recall interview). For a research instrument whose entire value proposition is "we record exactly what you asked," this feels like the single most important thing to fix before this leaves a demo stage.
- **The two-part "what did you keep" question** was a nice touch conceptually, and I don't think it should be scrapped, but firing twice in a row for what felt to me like one continuous editing session did briefly make me wonder if something had broken. A little grouping or a "you changed two things — one question about each" framing would have made the repetition legible instead of surprising.
- On the positive side: the live trace panel is genuinely reassuring. Watching the accept/reject/edit counters and the similarity scores update in real time made the "this is being recorded as it happens" claim feel true rather than just stated, and it's what let me catch and understand the mid-session question and the prompt-box garbling after the fact.
