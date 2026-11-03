# NEXUS — PERMANENT TESTING & RELEASE ACCEPTANCE STANDARD
Version 1.0 • Adopted 2026-10-29 • Owner: Nexus Product/Engineering/QA

## Authority and scope
Mandatory for EVERY Nexus feature, fix, redesign, PR, demo and release, including follow-up chats. This is the canonical test-report format. Read this document AND `docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md`, `docs/continuity/REGRESSION.md`, and the latest source/PR before drafting tests. The playbook provides case-specific historical instructions and does not supersede this policy. The source of truth is current GitHub branch/commit, not prior screenshots/chat. Never present simulated or historical results as fresh evidence.

## Required preflight / session header
Record: date/time zone; verified main SHA; exact tested head SHA/branch/PR; release/version; primary Cloudflare deployment status and how verified; demo/build manifest/source SHA; device/browser/OS; fixture profile; data storage isolation; scope changed and protected; open safety blockers. Explicitly note missing verification.

## Every manual test case MUST include ALL these fields
- **Stable case ID / title / priority**: e.g. PREP-01, P0/P1/P2, with feature and associated issue/decision.
- **Environment and source**: exact PR head, artifact/DEMO identifier, target device and theme.
- **Prerequisites and safe fictional fixture**: exact records/amounts/statuses needed; how to obtain/reset them in the isolated DEMO, without assuming they exist. Never modify the user's production storage to set up a test.
- **Starting screen + navigation**: literal tap-by-tap route from Today, Stash, etc. Name controls from CURRENT source/demo, not outdated screenshots.
- **Numbered actions and inputs**: precise taps, sample values, dates, amounts and choices (including how to save/cancel).
- **Expected observable results**: visible UI state AND saved-data consequences, before/after quantities, history, ID/attribution and persistence after reopen where applicable.
- **Failure / blocking criteria**: distinguish a functional defect (FAIL), inaccessible controls/fixture (BLOCKED), and not attempted (NOT TESTED). A bug in a reachable app flow is FAIL, not BLOCKED.
- **Cleanup / reset**: dismiss without save, restore demo fixture or use fresh isolated session, with checks that records are not duplicated. No production writes.
- **Actual result and evidence**: PASS / FAIL / NOT TESTED / BLOCKED; evidence method (CI test name/run, browser manual, real iPhone, VoiceOver); screenshot or short observation, timestamp, tester and limitations.
- **Repro and severity** if FAIL; precise blocker and unblocking action if BLOCKED.
- **Editable status and Copy Results** in the in-chat version where controls are supported. Statuses default to NOT TESTED until direct evidence exists.

Do not replace detailed cases with generic checkbox labels like “Stash works” or “no regressions.” Include negative/edge cases and recovery.

## Required coverage matrix (map each to stable IDs)
1. **Changed flow**: create/view/edit/delete/cancel; empty, loading, error, duplicate, retry; draft/back/sheet reopen; persistence and history; date/time.
2. **Vial and preparation accounting**: explicit exact physical kit/vial ID; route compatibility; sealed/open/empty/legacy; one vs multiple sources; mixed/multi-vial allocations; shortage and atomic rollback; no silent inference; transfer debit-and-credit conservation; duplicate transaction prevention; stale-tab/quota failure; no dose counted for transfer.
3. **Planned versus prepared**: intended method metadata does not deduct stock; a saved plan remains planned-no-transfer, no fabricated bottle or usable inventory; plan Save→View→Edit preserves one linked plan; only a separately verified actual preparation transaction can create prepared stock; source provenance survives edits, backups and later doses. Do not simulate actual clinical preparation.
4. **Protected data flows**: Today records; Calendar default current month, numeric weight, day/all logs; Plans/Protocols schedules; Stash/Supplies; Check-In single-date, edits, symptoms intensity, mood and notes; Supplements searchable multiselect/date history; Log Dose/Combo, PRN, drafts, review, reaction, dose history and vial math; Weight, Nutrition, trend/history, export/import, localStorage.
5. **Mobile UI/UX**: 320/390px, light/dark, safe area/notch, keyboard, bottom sheets, sticky controls, one natural scroll, overflow, 44–48px targets, focus order, readable contrast, large text, reduced motion, screen reader labels; physical Safari/PWA and VoiceOver separately.
6. **Artifacts/deployment**: standalone full-app fictional DEMO, offline DEMO ZIP and versioned LIVE ZIP, root index/assets/script order, archive CRC, exact-source hashes, demo storage/sync isolation and zero production writes, primary Cloudflare parity independently after approved merge.
7. **Calculators**: unit conversions, boundary/rounding/invalid inputs, blend amounts and syringe/reconstitution outputs. Any unresolved safety assertion = FAIL/BLOCKER, never “validated” because UI renders.

## Required execution layers
- **L1 static/source**: inspected code and DOM requirements. Source inspection is not a functional PASS.
- **L2 automated unit/CI**: test command, exact SHA, run ID, results, log/artifact links and failures.
- **L3 browser functional + visual**: 320px and 390px, dark/light, screenshots, interactions, persistence, errors.
- **L4 isolated full-app DEMO**: fictional fixtures only; no live accounts, production keys, imports, writes or sync; verify isolation.
- **L5 physical iPhone**: actual device, iOS/Safari/PWA mode, real taps and keyboard, screenshots/results supplied by tester. Browser emulation cannot substitute.
- **L6 deployment**: after separate approval, verify Cloudflare primary commit/assets/parity; merge success alone is insufficient.

## Status semantics and release gates
- PASS = test executed with specified method, expected result observed, evidence recorded on exact source.
- FAIL = executed and observed incorrect result, including safety/calculation mismatch. Preserve reproduction and severity.
- BLOCKED = cannot run due to concrete missing fixture, access or dependency; identify unlock step.
- NOT TESTED = no sufficient execution evidence. Prior-head passes may be referenced HISTORICAL only.
Report P0/P1 failures explicitly and do not label release complete while required cases fail or remain blocked/not tested. Distinguish CODED, TESTED, PR, APPROVED, MERGED, DEPLOYED and PHYSICAL IPHONE ACCEPTED. No merge or production deployment without explicit permission where required.

## Standard results output
A. Source / environment and fixture manifest
B. Scope and changed/protected flows
C. Detailed scenario table: ID | environment/steps | expected | actual | status | evidence | bug/owner
D. Summary by layer and severity, uncovered areas and unresolved calculator blockers
E. Downloadable detailed manual test script plus interactive in-chat checklist with Copy Results
F. Exact-source DEMO/LIVE/manifest hashes and links if verified
G. Physical iPhone acceptance separated from browser results
H. Decision/release status, required user action and one next priority
I. GitHub continuity persistence: update PROJECT_STATE, DECISIONS when new durable choice, RELEASE_HISTORY when applicable, REGRESSION actual evidence. If any write fails report NOT PERSISTED.

## Example: preparation plan, must be detailed not merely marked
**PREP-PLAN-01 (P0)** — In isolated fictional DEMO, open Stash → specific kit → Vials → specified open vial → Plan preparation. Record source kit and vial label and pre-test balance. Enter fictional plan fields, Save once, return to source and tap View preparation plan. Verify plan shows saved status and exact source, plan can be edited without duplicate, original vial mg and dose history unchanged, no nasal bottle/prepared stock/dose created and Log Dose does not offer planned-only stock. Reopen and compare. FAIL if any stock movement, duplicate, false prepared stock, wrong source or save/edit break. BLOCKED only if source route or required fictional fixture cannot be made available. Reset via fresh isolated fixture.

## Maintaining the standard
Reuse stable IDs and extend this document's matrix, not replace it with sparse ad hoc checklists. Each PR may add a `docs/qa/PR<number>_TEST_PLAN.md` using the mandatory fields. Record fixture setup and actual evidence in REGRESSION.md. Changes to this permanent standard require a documented DECISIONS.md entry; never silently weaken gates.
