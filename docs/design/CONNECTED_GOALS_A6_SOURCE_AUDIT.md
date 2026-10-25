# Connected Goals A6 — Journal and contextual Insights source audit
Date: 2026-10-24
Status: DESIGN / DATA-CONTRACT PROPOSAL ONLY. No application change or approval to merge app code.

## Verified baseline
A5 PR #76 merged to GitHub main at f980a2837e342e1b99adc476a17f9a2d12039e50. A5 exact-name goal.evidenceSymptom displays matching dated Check-In symptoms and recorded intensity. CI for A5 head 7c166c6a: mobile workflow 40144905392 SUCCESS; release/browser workflow 40144905391 SUCCESS with 320px/390px, light/dark, LIVE/isolated full DEMO. Physical iPhone, Cloudflare published parity and calculator validation are NOT VERIFIED; calculator PR #67 remains held.

## Source audit: current Journal implementation
assets/js/06-nexus.js defines journalEntries() as a derived read-only aggregate, not a separate persisted Journal collection.
- dailyLogs[].notes: source Check-in, jump {type:'daily',id:dailyLog.id}; entry date dailyLog.date; optional symptomLinks and mood context.
- dailyLogs[].compoundNotes[compound]: source Check-in note, same dailyLog.id but distinct note field.
- dailyLogs[].updates[] with nonempty notes: source General update, jump {type:'daily',id:dailyLog.id}; date update.time or log.date.
- allPeptides()[compound].doses[].notes: source Dose log, jump {type:'dose',name:compound,id:dose.id}.
- state.supplies[].wasteLog[].notes: source Stash note, jump {type:'stash',name:supply.name,id:supply.id}.
Only nonempty written observations appear. Same-date entries do NOT automatically belong to a goal. Avoid inventing persisted Journal IDs, using note text as identity, or storing copies of entries inside goals.

## Proposed staged A6 data contract
1. A6a: read-only contextual Journal evidence in Goal Activity, initially from the linked original Check-In that contains an *exact* goal.evidenceSymptom observation; display its actual written note only if nonempty. Show source and date and open existing Check-In by original ID. Do not claim text describes the symptom unless source actually links it; label as 'Check-In reflection from the same entry'. Exclude unrelated dates, entries or doses; no new goal schema.
2. A6b (separate change): opt-in stable typed reference for specific journal-derived note, only after validating target identities. Candidate {kind:'daily-note',dailyLogId}, {kind:'compound-note',dailyLogId,compound}, {kind:'update-note',dailyLogId,updateId} where updateId truly exists, {kind:'dose-note',compound,doseId}, {kind:'stash-note',supplyId,wasteId} where wasteId truly exists. Unsupported missing IDs must not be auto-generated in real records without user approval. Missing targets show 'Source entry unavailable' and never silently relink by text/date.
3. A6c (separate change): contextual Insights as on-demand derived summaries from eligible linked dated evidence, displaying timeframe, source and coverage; missing data stays unknown. No fabricated confidence, diagnosis, recommendation or compound-causality. Inspect existing Insights computation before hooking in. Do not persist copied analytical outputs into Goal.

## UX proposal
Goal Details retains Overview / Connections / Activity. Activity orders observations by date and labels Check-In observations, same-entry reflections and, later, explicit Journal links and contextual Insights. One disclosure per source group, no duplicate chevrons. 'View original Check-In' navigates to the canonical source; no editing within Goal. Optional connection stays off by default. At 320px and 390px in both themes preserve 44–48px targets, sheet scroll/focus and modal exit.

## QA release gate
- Journal source eligibility: exact symptom match, nonempty daily note, same source entry; no unrelated date/note; no raw note copied to goal storage.
- Editing original note updates Goal display; removing original note or unlinking symptom updates the view; deleting record leaves no stale content; same date with multiple updates must not cross-link.
- No duplicate Check-Ins; existing symptom intensity/associations, supplements, dose notes, Stash, Protocol, Calendar and backups unchanged.
- Full LIVE/isolated DEMO at 320/390 dark/light; source-identical packaging; physical iPhone separately NOT TESTED unless verified.
- CI and artifacts mandatory before app merge. Cloudflare deployment requires independent parity verification; fallback GitHub Pages likewise.
- Calculator PR #67 HOLD, unresolved numerical safety assertions not treated as passing.

## Single next action
Implement and browser-test A6a's source-linked, read-only Check-In reflections on a new release branch from verified latest main; update all continuity docs in that branch, build exact-source LIVE/full DEMO, and merge only after CI and parity validation.
