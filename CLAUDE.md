# CLAUDE.md — graite-instrument

Machine: Personal laptop | Local path: D:\graite-instrument | Created: 2026-07-12 | Kit: v1.3
Charter: Build & maintain the GRAITE co-creation research instrument — the trace-capturing environment that makes professional judgment observable in human–AI co-creation. Boundary object now; instrumented study tool (Phases 2–3) later.
Out of scope: research knowledge/notes + "My take" (phd-vault); ethics-governed participant data (GU storage ONLY — this repo holds code + synthetic fixtures, never real traces); reference PDFs (Zotero); coordination/state (the hub).

## Links
- Hub (control plane): https://app.notion.com/p/36d03e893f1f8052a309e03785fa48f2
- My Registry page: https://app.notion.com/p/39b03e893f1f81ecb86de7964112eb3c
- Sibling project (knowledge plane): phd-vault — https://app.notion.com/p/39203e893f1f817bb010d011c54d97c2
- Constitution (hard rules bind verbatim): https://app.notion.com/p/39203e893f1f81e69b3ed3108c17a256

## MANDATORY — session start (before any substantive work)
0. Repair before trusting. If pending-sync.md exists in the project root: flush its payload to the hub, then delete it. Fetch my Registry page; if the CURRENT STATE callout is duplicated, truncated, or its "As of" date disagrees with Last sync (auto), tell Phong (dirty close) and reconstruct from recent Worklog entries before proceeding.
1. Load the CURRENT STATE callout from my Registry page. Its next actions come first unless Phong directs otherwise.
2. Query Handoffs: To = graite-instrument AND Status = Open → read each, set Status = Acknowledged. Mark Done (+ Resolved date) only when resolved or carried into Current State. Flag anything Open ≥ 14 days.
3. Query Decision Register: Scope = Global AND Status = Active → if any entry is newer than Last sync (auto), refresh the snapshot below with FULL rule text.
4. Backstop: skim Worklog titles from other projects (esp. phd-vault) since my Last sync (auto) — does anything change what this project believes? (The vault owns WHY to log; this project owns HOW.)
5. If any step fails (MCP down, auth expired, page missing), tell Phong before doing substantive work.

## MANDATORY — session end (Phong triggers: "wrap up" / "sync and close")
Execute in this order — it fails loud, not silent:
1. Append exactly one Worklog entry: title "[YYYY-MM-DD] graite-instrument — summary", Type = Session (or Milestone / Decision / Lint), Date property set, Project relation set to my Registry row, body ≤ 10 lines.
2. OVERWRITE the contents of the CURRENT STATE callout on my Registry page — touch nothing else. ≤ 200 words; first line "As of YYYY-MM-DD —"; next actions first.
3. Handoffs: does this session change what phd-vault (or another project) believes? If yes, create a Handoff row (pointers, never payloads). Mark fulfilled Acknowledged handoffs Done + Resolved.
4. Durable decisions this session → new Decision Register row. SCHEMA CHANGES ALWAYS QUALIFY (the schema is data collection). Never edit an Active decision in place — supersede it.
5. Confirm Last sync (auto) on my Registry row shows today — it rolls up from step 1's Worklog entry; if not, the Project relation is missing.
DEGRADED MODE — do steps 1–2 only, title "… — partial close". HUB UNREACHABLE — write the full payload into pending-sync.md; next session start flushes it.

## Global decisions snapshot (full text, refreshed at session start)
1. **Architecture: Notion hub = control plane; git vault = knowledge; Zotero = references; GU storage = empirical data** (2026-07-03) — The hub stores memory and coordination (state, decisions, handoffs, logs). Bulk knowledge lives in the private git vault; references + PDFs in Zotero; ethics-governed empirical data ONLY in GU-approved storage. The hub holds pointers, never bulk content.
2. **Authorship line: agents write about sources; Phong writes claims (My take + permanent notes)** (2026-07-03) — Agents own bookkeeping. Phong owns claims. Agents never draft or fabricate Phong's positions. Test: if Lena could ask Phong to defend it, Phong wrote it.
3. **Language: notes in English; Swedish quotes verbatim + gloss; key terms bilingual** (2026-07-03) — Notes default to English. Swedish quotes verbatim with an English gloss, never silently translated. Key terms in bold parentheses, e.g. subject didactics (ämnesdidaktik).
4. **Citations flow only through Zotero + Word plugin; citekeys author-year kebab-case** (2026-07-03) — All paper citations go through the Zotero Word plugin. Citekeys are author-year kebab-case (e.g. mishra-koehler-2006).
5. **Planning governance: milestones link their assumptions; a Falsified assumption triggers review of all linked milestones** (2026-07-05) — Roadmap milestones link unverified inputs via 'Rests on' to the Assumptions Register; a Falsified assumption flags every linked milestone for re-planning — never re-plan silently.
6. **Session protocol v1.3 — automatic Last sync** (2026-07-07) — Session start begins with repair not trust; session end runs loud-first (Worklog with Project relation FIRST, then CURRENT STATE overwrite, then handoffs/decisions). Degraded mode: Worklog + state only, "— partial close". Hub unreachable: payload to pending-sync.md. Handoffs: Open → Acknowledged → Done (acted on, not merely received). Decision snapshots carry full rule text; Active decisions are immutable (supersede, never edit). Current State ≤200 words, first line "As of YYYY-MM-DD —", next actions first.
7. **Projects may span machines: git syncs content; the hub stays the single state surface** (2026-07-11) — A project may live on more than one machine. The private git repo is the ONLY content-sync mechanism (commit-push-pull, never manual copy). The hub remains the single state surface. The Registry row's Machine/Local path fields list every machine.
8. **Capture layer: Notion Capture DB is the vault's front door — transient capture, swept into the vault; the vault stays the single source of truth** (2026-07-11) — The hub's Capture database is a transient dump (ideas, meeting/lecture transcripts, reading reactions), swept into phd-vault by the capture-sweep skill and marked Processed. Never participant data. (Vault-facing; listed for completeness.)
9. **Split: graite-instrument is its own project (separate repo + Registry row) distinct from phd-vault** (2026-07-12) — The instrument lives in its own private repo and Registry row, not inside phd-vault. Different lifecycle (software, eventually open-source) and sensitivity regime (adjacent to trace data at maturity). Repo holds code + synthetic fixtures ONLY; real traces live in GU-approved storage. Vault owns WHY to log; instrument owns HOW.

## Hard boundaries (from the Constitution — inviolable)
- Ethics-governed / person-identifiable data NEVER enters this repo, Notion, or a Handoff. Code + SYNTHETIC fixtures only; identifiers are pseudonymous codes. `.gitignore` guards `/empirical/` + `*.transcript` from the first commit. Real data where it shouldn't be = incident, stop and tell Phong.
- Agents do bookkeeping; Phong writes claims. Never fabricate Phong's positions or research findings. Rehearsal/synthetic data validates the instrument, never stands in for findings about teacher educators.
- No deleting Registry/Worklog history, no making content public, no contacting third parties — without Phong's explicit confirmation. (Note: making THIS repo public is a real future step — it stays private until Phong decides, ethics-cleared, data never.)
- Propose before writing to shared surfaces this project does not own (hub databases, phd-vault files, external systems).

## Working style — instrument-smith discipline (see skill in phd-vault/skills)
- The logging schema IS data collection: any change to what/how/which-identifiers gets logged is a RESEARCH decision — propose to Phong, version explicitly, record in the Decision Register. Silent schema drift can invalidate months of traces.
- Ponytail ladder: the best code is the code you never wrote — but NEVER cut validation, security, accessibility, data-loss handling, or consent/withdrawal mechanics to get smaller. Leave `# ponytail:` receipts + a debt-ledger line for deliberate deferrals.
- Verify by RUNNING (not reading); reproducibility — pin deps, document run steps, runnable start-to-finish on a clean machine. New dependencies are proposals, not defaults.
- Multi-step work runs against a visible task list ending in verification.

## Project-specific conventions
- Schema version lives in `src/types.ts` (SCHEMA_VERSION); design rationale + change log in `docs/design.md`; deferrals + named checks in `debt-ledger.md`.
- Named check: `trace.log()` must NEVER be called inside a React state-updater (StrictMode double-fires → duplicate events). Review every `set*(prev => …)` for logging side effects.
- Rehearsal artifacts in `rehearsal/` are SYNTHETIC — always labeled, never cited as findings.
- Real LLM provider stays deferred behind the `SuggestionProvider` interface until ethics approval (EU-hosted endpoint; model choice is a GDPR decision before a capability decision).
