# PR124 — Exclusive physical-vial Log Dose acceptance (NOT RELEASED)
Date: 2026-10-31. Main baseline da585ab3. Draft PR #124. Version remains v0.9.20-beta development candidate.

## Implemented boundary
- New fresh backed physical Log Dose only: an exact, already-migrated method-labelled OPEN kit/vial ID, validated entered mg/mcg mass, immutable cloned stock plus dose/reschedule history committed once under nexusWriter().transaction exclusive Web Lock, with readback before in-memory swap.
- Multi-vial allocation requires independently verified kit/vial IDs for every step, matching compound and method, and allocated sum equal to dose; no source guess, no sealed-vial draw, no negative stock.
- Failed save leaves draft/Confirm modal open and restores Save button. Fictional DEMO is in-memory only. Original canonical localStorage key unchanged.

## Explicit exclusions — P0 release limitations
- Inventory-backed EDIT/UNDO, prepared syringe, blend and Quick Log remain legacy paths; finished/predrawn source rows are not migrated to this planner and must fail closed. Other synchronous stock and settings writers still do not hold cross-tab Web Locks.
- Prepared nasal and transfer gates remain OFF; no inferred nasal spray calibration, legacy source attribution or destructive migration.

## Targeted fictional automated cases
- Source actual helpers in assets/js/01-nexus.js through tests/write-coordinator.test.cjs, two isolated VM tab coordinators sharing one serialized exclusive lock: V1=10mg and V2=8mg, 2.5mg (2500mcg) deducts selected V1 to 7.5mg; competing stale second tab rejected; only one durable write; losing tab remains unchanged.
- Also validates split 1mg+1.5mg across exact vials, sealed, shortage, cross-compound, duplicate vial ID, sum mismatch, already-finished rows, route mismatch, unsupported nasal, duplicate dose, quota failure, and demo isolation.
- Dedicated CI source-run proof to be recorded when all final-head workflows complete. A simulated VM concurrency check is NOT a real two-browser-tab acceptance.

## Physical / browser acceptance checklist (all not yet independently accepted)
BDL-01 P0: 250mcg backed V1 SubQ, precisely 0.25mg debit and one exact-source history record.
BDL-02 P0: Multiple compatible open physical vials, manually select V2; only V2 debited.
BDL-03 P0: Multi-vial split exact mass; both vial balances and allocation IDs match.
BDL-04 P0: Insufficient/empty/sealed/mismatched route/legacy vial; blocked no stock/history mutation, draft retained.
BDL-05 P0: Two real same-origin browser tabs competing to save dose; one accepted, losing tab preserves draft and data.
BDL-06 P0: Two browser tabs dose versus outflow/undo, dose versus settings/check-in and failed storage.
BDL-07 P0: Duplicate submit, quota/readback exception, lock unavailable, tab reload; no false success or orphaned dose.
BDL-08 P1: iPhone Safari 320/390 light/dark, keyboard, scrolling, VoiceOver, focus, exact source in Review and history.
BDL-09 P0: Legacy backed edit/undo, prepared/quick/blend source ledger regression; must be addressed before complete release.

Record actual status for each: Pass / Fail / Not Tested / Blocked, exact SHA and fixture, device/browser, before/after IDs and mg, screenshots/logs and cleanup. Fictional only. Never merge or deploy without approval.
