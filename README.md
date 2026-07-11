# graite-instrument — Phase 0 boundary object

A demo of the GRAITE co-creation research instrument: a teacher educator co-creates course material with a (simulated) AI partner while every act of judgment — prompt, accept, edit, reject, override — is captured as a structured, exportable trace. **Demo only: synthetic data, no participants, no network calls.** Design rationale and the event schema (v0.1-draft) live in [docs/design.md](docs/design.md).

## Run

```
npm install
npm run dev      # → http://localhost:5173
npm run build    # type-check + production build
```

Node 20+ required. No environment variables, no API keys — the AI is simulated (`src/providers.ts`); a real EU-hosted provider is an adapter drop-in behind the same interface, gated on ethics approval.

## What to look at in a demo

1. Consent screen — states exactly what is logged; the list is the schema.
2. Ask the AI for suggestions on a section → accept one, edit-then-insert one, reject one (with a reason).
3. Watch **Your trace** update live — the participant's mirror, not our camera.
4. Edit or delete accepted AI text → the instrument logs post-acceptance judgment.
5. ⚑ Flag a moment — participant-authored stimulated-recall anchors.
6. Export the JSON; **Withdraw & wipe** deletes everything.

## Boundaries

- The logging schema is data collection: changes are research decisions, versioned and signed off — never silent refactors.
- `/empirical/` and `*.transcript` are gitignored from the first commit; no participant data ever enters this repo.
