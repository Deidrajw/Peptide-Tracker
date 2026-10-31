# PR #124 — canonical stock-writer migration audit (2026-10-30)

**Status: INCOMPLETE / SAFETY BLOCKER.** This is a source-inspection inventory, not a completed migration or a passed test. Audited draft PR branch after the previously verified application commit `20417719` and continuity commit `a709c4f6`. Recheck exact head before making code changes. Main baseline in current continuity: `da585ab3458394ddf5e88e283b210933beeab810`.

## Existing coordinator boundary
- `assets/js/01-nexus.js`: `nexusWriter()` provides `writer.saveLegacy(state)` and exclusive `writer.transaction(snapshot, planner)`. Ordinary `saveState()` is synchronous and **does not acquire** navigator.locks; optimistic stale snapshot rejection alone is not cross-tab atomicity.
- `assets/js/10-nexus.js` Stash formulation Add/Edit already awaits `writer.transaction`; preserve verified saved readback, in-modal pending/failed states, and fictional-memory DEMO path.
- Prepared nasal dose and exact-vial transfer planners are implemented but their live feature flags must stay **FALSE**. Planned-no-transfer must never credit stock. An inverse dose does not restore physical vial mg.

## Priority migration map from branch inspection
Locations below are approximate source line positions, subject to change; they indicate writer call sites requiring read/transaction design review, **not** proof that every caller changes stock.

1. **P0 — physical-vial lifecycle and adjustments**: `assets/js/04-nexus.js` saveState calls near lines 681, 850, 972, 1006, 1025, 1071, 1079, 1178, 1310, 1417, 1567–1882. Includes vial open/finish/reopen, add-to-open vial, restock, outflow and undo. Inspect each handler and subfunction before migration. The add-to-open-vial operation currently mutates shared `s`/`vial` and stores a snapshot for an undo toast; `undoAddToOpenVial` pops the last wasteLog element, which is unsafe after intervening writes. Replace with immutable ID-addressed event validation and inverse under the **same** exclusive coordinator.
2. **P0 — dose/prepared syringe accounting and history edits**: `assets/js/05-nexus.js`, especially 249–273 (combo), 1440–1634 (dose write routes), 2304–2463 (prepared syringe and related mutations), 2544 (quick dose) and 2847–2904 (edit/deletion contexts). Classify each call as stock-mutating, history-only, or display-only. Existing checked save acknowledgement is not exclusive locking.
3. **P0 — separate Stash actions and global event delegates**: `assets/js/09-nexus.js` around 900, 1073, 1171–1344, 1481–1632, 1966–2037; `assets/js/10-nexus.js` around 1134, 1417, 1457, 1591, 2213, 2281; `assets/js/12-nexus.js` around 225, 283, 980–1011. Validate kit deletion, source-dependent actions, balance repair, and undo behaviour. Do not route a delete through a synchronous wrapper.
4. **P1 — read-time migration and repair**: `assets/js/04-nexus.js` near 578, 609, 630. Existing self-healing vial metadata invokes saveState. Eliminate uncoordinated persistence from read/render paths by staging a deterministic repair in an exclusive transaction, without rewriting historic source attribution.
5. **P1 — non-stock saves sharing full-state persistence**: `assets/js/06-nexus.js`, `07-nexus.js`, `11-nexus.js`, `12-nexus.js` contain synchronous writes of check-ins, settings, plans and other records. Even when not modifying stock directly, whole-state saves can overwrite a concurrently changed inventory if not properly rebased; handle writer ownership explicitly while preserving existing editors, histories and user state.

## Required transaction contract
- UI handlers must **await** exclusive `nexusWriter().transaction` before reporting success or dismissing modal. Disable the exact submit control while pending; on stale/quota/readback failure leave entry and user input visible, explain recovery, and do not show success.
- Inside the exclusive lock, re-read canonical persisted state; validate exact source kit/vial/container IDs and current version/history; compute pure next state from **fresh persisted snapshot**, not mutable old `state` references; commit stock and audit ledger together in one verified write; update in-memory state only after confirmed persistence.
- Undo and edits must look up their immutable event IDs and verify no dependent changes, rather than assuming the last ledger element remains theirs. Do not silently reconstruct undocumented source attribution, modify past dose history, re-credit a vial when reversing administration from a prepared bottle, or change a planned preparation into physical stock.
- A tab without Web Locks must fail closed for stock-changing actions rather than silently falling back to unsafe synchronous commits. DEMO remains isolated and must never write/import/sync real records.

## Acceptance tests before activating either live gate
- True simultaneous **two independent browser tabs**: same-vial dose vs dose, dose vs transfer, transfer vs restock, dose vs outflow, stale open-vial add vs finish, add vs inverse; exactly one winning conflicting write with preserved audit attribution.
- Cross-tab unrelated setting and check-in update during stock transaction: no lost data and no hidden stock overwrite.
- Locked transaction read failure, quota/write failure, post-write mismatched readback, lock unavailability, abort/retry, duplicate-submit, stale form, and reload/restore.
- Accurate multi-vial deductions, prepared-syringe state, partial draws, exact source and undo after intervening events; fail closed on ambiguous legacy source.
- Full fictional app DEMO, source-matched 26-file LIVE package parity, 320px/390px light/dark Chromium/WebKit, history editing, no horizontal overflow and physical iPhone/VoiceOver acceptance reported separately.
- Nasal source transfer inverse, bottle/pump calibration and compound-specific simultaneous configurations remain additional **BLOCKERS** after writer migration.

## Shipping rule
Keep PR #124 draft/unmerged/undeployed and both nasal preparation feature gates OFF. No production storage migration or live user write. Never infer approval to merge or deploy from testing. **Next concrete action:** implement the smallest atomic vertical slice of the P0 physical-vial lifecycle (including an event-addressed undo) on the existing draft branch and run dedicated race/rollback tests before moving to dose writers.
