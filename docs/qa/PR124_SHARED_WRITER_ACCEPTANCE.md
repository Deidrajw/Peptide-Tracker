# PR124 — Shared inventory writer acceptance plan
Date: 2026-10-30
Status: **Coded candidate — not released; real prepared nasal logging DISABLED**
Main baseline: da585ab3458394ddf5e88e283b210933beeab810
Draft PR: #124

## Architecture boundary
- Canonical production key remains `peptide-tracker-html-v1`. No migration, renaming, reset or alteration of existing user records.
- `assets/js/nexus-write-coordinator.js` provides a pure, tested writer interface: `saveLegacy(next)` for existing synchronous callers, `removeLegacy()` for an explicitly confirmed erase and `transaction(snapshot, plan)` for async exclusive operations.
- Every writer validates its last observed saved raw snapshot, rereads immediately before writing, verifies serialized readback and fails closed on stale state, storage exception or uncertain readback.
- An in-flight transaction blocks further synchronous writes within the same tab; `transaction` requires a real cross-tab `navigator.locks` adapter and refuses if absent.
- Ordinary `saveState` and existing Stash formulation edits, manual restore, onboarding restore and confirmed erase/reset are routed through the shared guarded interface. The demo-specific flows remain isolated in-memory.
- Pure prepared nasal and preparation-transfer operations use the same async transaction writer boundary and clone/validate before assigning the new app state.
- **Hard limitation:** The legacy `saveState()` contract is synchronous and cannot synchronously acquire a browser Web Lock. Its snapshot checks reduce stale overwrites but do not constitute full cross-tab atomicity against a concurrently locked async transaction. **Do not enable `NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED` or `NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED`** until all stock-changing legacy paths are migrated or explicitly protected through a design proven safe for concurrent tabs and crash/restart.
- Backup import/restore replacement remains an explicit confirmed action with a separate recovery copy; automatic blind rollback is prohibited on an uncertain write.

## Fictional cases (all statuses default NOT TESTED until exact-head execution)
All cases run in isolated Node fixtures or isolated full-app DEMO, never against actual saved user storage. For a fresh run, call a new factory fixture and new in-memory storage adapter. Record source SHA, CI run, browser/device, theme/width, evidence and actual result.

| ID | Priority | Starting screen/fixture and actions | Expected | Status |
|---|---|---|---|---|
| WR-01 | P0 | Node: `node tests/write-coordinator.test.cjs`; start with known saved JSON, invoke `saveLegacy` | Exactly one write/readback, updated expected snapshot | NOT TESTED |
| WR-02 | P0 | Two virtual tabs, same initial snapshot, queue two `transaction()` operations behind shared lock | Exactly one successful commit; second rejects stale; no overwrite | NOT TESTED |
| WR-03 | P0 | Within one coordinator hold exclusive inventory transaction, attempt normal `saveLegacy` | Blocked before a write; no duplicate/source deduction | NOT TESTED |
| WR-04 | P0 | Saved state changes externally or starts empty then another tab creates data; attempt legacy save | Reject stale data without overwriting | NOT TESTED |
| WR-05 | P0 | Simulate quota exception, corrupt readback or interleaved write | Fail closed, blocked until reload; no success receipt | NOT TESTED |
| WR-06 | P0 | Test guarded `removeLegacy()` with fresh vs stale snapshot, then recreate | Fresh removal succeeds and verifies absence; stale removal fails | NOT TESTED |
| WR-07 | P0 | Full-app fictional DEMO: Settings → Backup & Restore → import fictional JSON, cancel then confirm | Cancel changes nothing, confirm replaces fictional profile, recovery backup exists; no live storage writes | NOT TESTED |
| WR-08 | P0 | Full-app fictional DEMO: Stash → capsule/nasal formulation Add/Edit; ordinary Log Dose save, combo, Check-In and Calendar | Previous histories, allocations and controls remain functional; no surprise overwrite or stock mutation | NOT TESTED |
| WR-09 | P0 | Source-code and CI `node tools/validate-storage-writers.mjs` | Main-key direct writes only inside coordinator adapter, safety flags remain false | NOT TESTED |
| WR-10 | P0 | Release gate: attempt unverified prepared nasal Log Dose or source transfer | Controls remain disabled; preparation plan is not prepared inventory; no stored mutation | NOT TESTED |
| WR-11 | P1 | iPhone Safari/PWA 320px/390px, light/dark, keyboard, VoiceOver on isolated full-app DEMO | Screens usable, no clipped actions/extra scroll; physical acceptance distinct from CI | NOT TESTED |

## Repro/fail rules
- FAIL if a reachable flow overwrites stale data, loses backup, silently moves physical vial stock, deletes edits/reactions, double-deducts, changes tracking mode or opens live prepared nasal controls.
- BLOCKED if a case cannot be executed in the supported isolated environment (e.g. physical iPhone unavailable or feature intentionally disabled); do not count blocked as passed.
- Save screenshot and console logs with the exact failed step, fixture and before/after quantities. Preserve all original records for debugging.
- Never treat a mocked lock as proof that synchronous legacy writes participate in a cross-tab Web Lock. This specific invariant remains an unverified blocker until explicitly resolved.

## Reset / evidence
Use new in-memory adapters for Node tests; reopen the isolated standalone DEMO to reset fictional data. Do not erase real Safari localStorage. Record GitHub Actions job/result links, archive parity and physical device acceptance separately. Do not merge or deploy without explicit user approval.
