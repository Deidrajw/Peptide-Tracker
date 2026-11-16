## 2026-11-16 — Development-authorised safe prototype (NOT RELEASED)
- User explicitly authorized planning and development of BOTH review and user-confirmed correction. **No merge/deploy and no automatic inventory repair were authorized.**
- Experimental unmounted module: `assets/js/nexus-historical-reconciliation.js`. Functions `review`, `prepare` and `applyToClone` operate on explicitly supplied state and return a clone; they cannot save to app storage or change existing physical balances, statuses, canonical dose allocations or blend `doseLog`.
- This is **Stage A only**: review records and produce confirmed *annotations* of exact source evidence, not a verified stock correction. Unresolved source evidence is preserved. The module does not yet integrate with UI or persistent exclusive writer. It requires a verified backup and typed confirmation even for its cloned annotation result.
- `tests/historical-deadpool-reconciliation.cjs` uses fictional data; dedicated GitHub Actions workflow `historical-deadpool-reconciliation.yml` checks syntax, no-write isolation and tests. An initial workflow failure resulted from a static grep matching the WORD `localStorage` inside a comment, despite 8/8 Node assertions passing; this comment was edited and the workflow needs rerun before marking all-green.
- **Stage B still REQUIRED**: source-exact UI and controlled persistence adapter, independently user-reviewed per-dose evidence, verified physical balance method, hardened atomic preflight/rollback, independent recovery, multi-tab race/Undo, manual iPhone, and full-app isolated DEMO/LIVE candidate. Do not expose unsafe stock mutation or inject this module into production `index.html` before safeguards pass.
- Proposed UI: Stash > physical vial > Historical discrepancy > Inspect events > Source evidence > Review before/after > Confirm. A stock balance must remain UNKNOWN unless independently validated; a dose-source annotation is not a physical stock debit.
- Protect PR #169; its multi-source Undo design is separate.

# Historical Deadpool vial reconciliation — review-first specification

Status: DESIGN / READ-ONLY INVESTIGATION ONLY. No application implementation or historical data mutation approved.
Baseline: main a722465cb6f9adbf8009038e45bc87d5913a438e; production v0.9.27-beta.4; PR #172 merged; PR #169 independent draft, explicitly not approved for merge.
Date: 2026-11-15 Toronto.

## Problem and verified evidence
Previous read-only inspection of a private November 15 backup is documented in continuity: an existing Deadpool physical vial is marked EMPTY with zero remaining and missing finish timestamp. Six historical dose allocations totalling 14 mg have null/zero physical-source amounts; a distinct premixed-vial doseLog includes 9 mg of direct entries. **Neither figure proves actual use or physical remaining stock**. The backup is private and must not be committed or included in tests or demos. Do not add 14 and 9 without checking duplicate recording / dose linkage. Do not infer original fill, current vial possession, source identity or remaining mg.

Production v0.9.27-beta.4 corrected NEW blend Combo Dose to the physical doseLog, exact ledgerId allocation, and rollback. This does not fix old source identities or historic status. Existing blendInventoryMode choices must be interpreted without treating ordinary remainingMg as an independent amount.

## Review-only v1: design and acceptance contract
1. Entry: Stash > specific Deadpool kit > Vial details > 'Review historical discrepancy' (only if source evidence exists). No alerts on the main Today task.
2. Read-only summary shows exact kit/vial identity, stored status, stock field (clearly labelled *recorded, not physically verified*), last known preparation, chronological ledger entries, historical dose-log entries, allocations and source attribution, and unresolved/unlinked items. Never expose real user fixtures in demos.
3. Distinguish **Ledger-supported**, **Missing source**, **Possible duplicate**, **Conflicting status**, and **Unknown**. Show event IDs and local dates (never invent missing dates); list every candidate dose individually. Ambiguous transactions remain unresolved; do not auto-assign a vial because a kit name matches.
4. Separate 'Recorded total' from 'Physical stock confirmed by user'. Highlight that 9 mg ledger + 14 mg zero/null allocations are overlapping/uncertain sets, not additive stock deduction. A result may legitimately remain unknown.
5. Proposed correction (later explicit implementation): select verified event-to-vial links individually, and only then optionally enter a user-observed physical stock amount and verified status. Show before/after records, other affected totals, and what will NOT change. No automatic repair, bulk apply, automatic reopening, inferred fill or default BAC promotion.
6. Write safety **not yet authorized**: require a fresh export/backup, exact current snapshot/version check, protected exclusive writer, all-or-nothing atomic change, readback verification, immutable change audit and recoverable rollback/undo. Refuse when sources changed, amounts ambiguous, duplicates detected or when contemporaneous records cannot be reconciled. Never repurpose 'Adjust Remaining Amount' to secretly rewrite old doses.
7. Distinguish *re-link historical transactions* from *manually establish observed physical remainder*: a physical count is independent user evidence, not a claim that old logs were accurate. Never forge historical dose-log events to force arithmetic.
8. Keep PR #169 (multi-source Log Dose and Undo) untouched, test later integration as separate work.

## Required review questions (NOT permission to repair)
- Which specific labelled Deadpool kit/vial was physically used for each of six unattributed doses? Record uncertain answers as unknown.
- Was the 9 mg already represented within any of those same dose administrations? Confirm overlap one-by-one.
- Is the vial still physically in possession? If yes, is there an independently verifiable remaining amount, or only an approximate guess? Do not ask user to estimate precision unavailable from a syringe.
- Was the vial actually emptied/discarded, or only shown EMPTY by software? Is a reliable finish date known?
- Are there any reconstituted companion vials or preparations sharing that source ID? Keep component accounting separate from the premixed physical vial.

## Fictional review example (NOT real data)
A 30 mg fictional blend vial: recorded direct ledger withdrawal 9 mg, six additional dose cards containing null source allocations totalling 14 mg. Present 9 mg *ledger documented*, 14 mg *pending attribution*, and physical remainder *unknown*, NOT 7 mg or 21 mg. Show both 'Keep unresolved' and 'Export review summary'. No save-to-stock in review-only version.

## Regression gates before implementing or shipping a correction
- Read-only audit must not invoke saveState, nexusCommitCurrentState, migrateKitToV2, consumeCompoundInventory, finishVial, or any localStorage setter.
- No mutation on screen opening, filtering, cancel, reload or export.
- Distinguish history entries by IDs and verify no double-counting or missing records; include date unknowns and multiple vial candidates.
- 320/390 light/dark, keyboard, VoiceOver (not tested until physical device), empty and contradictory histories.
- Future mutation tests: stale snapshot, failed write, interrupted write, cross-tab edit, duplicate transactions, multiple vials, insufficient inventory, exact ledger refs, Undo once only, failed rollback, backup restore.
- Protect Today, Calendar, Check-In, Stash, Log Dose single/combo/prepared, history, BAC editing, supplements, protocols and PR169 integration. Calculator-safety failures remain separate blockers.
- Require actual per-test PASS evidence and a complete isolated full-app DEMO, exact-source LIVE ZIP, release notes and user-reviewed approval before any mutation release.

## Release boundary
This document is a draft product/reconciliation plan, not a deployed feature, not a real-data audit and not permission to modify inventory. Next: build a fictional read-only discrepancy explorer on an isolated branch, inspect the exact source schema and use user confirmation before any proposed correction.