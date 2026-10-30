# PR124 — Use Setup, units, tracking and Stash regression
Date: 2026-10-30. Status: coded on draft branch; CI and real iPhone acceptance pending. Run against exact source of release artifact only. Permanent policy docs/qa/NEXUS_TESTING_STANDARD.md controls every case.
## Preflight
Open verified fictional FULL-APP DEMO only; never production or user backup. Record SHA, artifact, device, iOS/browser, light/dark, screen width, before/after physical vial remainingMg and dose history count. Start clean fictional weight_loss fixture for each write scenario. Expect original production localStorage untouched.
## SET-01 P0 — Configure injected use
Start Stash → fictional Retatrutide kit. Open Use setup. Choose Injectable → SubQ; preferred mcg; Doses and inventory. If one compatible open vial exists, inspect auto-selected exact vial; if several exist, explicitly choose. Save; reopen kit. Expected setup summary persists, exact kit/vial linked, no dose/history/stock change. FAIL wrong source, silent incompatible reassignment, mutation. BLOCKED fixture missing. Cleanup new demo fixture.
## SET-02 P0 — Untracked mode
Same kit → Use setup → Injectable/SubQ, mcg, Doses only → Save. Today → Log Dose → enter fictional 250 mcg, review: Untracked. Confirm once. Expected new administration with trackingMode untracked and source/allocations absent; dose saved in canonical mass with enteredDose 250, enteredUnit mcg; physical mg, prepared stock and transaction history unchanged. FAIL any source debit or missing record. Cleanup reset.
## SET-03 P0 — Inventory-backed exact source
Fresh fixture. Stash → Use setup → Injectable/SubQ, mcg, Doses and inventory → choose one exact eligible vial and note its mg. Today → Log Dose 250 mcg → Review → Confirm. Expected one record and precisely 0.25 mg deduction from selected vial, others unchanged, original unit metadata preserved. FAIL wrong source, duplicates, shortage with sufficient eligible source. Cleanup reset.
## UNIT-01 P0 — Conversion round-trip
Configured mcg input: enter 250; switch to mg → 0.25; switch to mcg → 250. Review must show selected unit and identical canonical mass. Save where safe. FAIL quantity mutation/rounding or inconsistent UI/internal amount. Cleanup reset.
## UNIT-02 P0 — IU safety
Use setup on non-IU-defined fictional compound: IU cannot be offered as convertible mass; no guessed IU→mg, mL, spray or syringe-units deductions. Native-IU compound, if available: IU is own activity unit; inventory-backed mode must reject unless verified product conversion exists. FAIL unsafe conversion. BLOCKED fixture unavailable; do not invent native-IU sample.
## ROUTE-01 P0 — Mismatched method without false shortage
Fictional Retatrutide open Vial 4 has 28 mg labelled Nasal; use setup Injectable/SubQ, backed. Start Log Dose 2 mg. Expected clear incompatible-method message, not 0 mg physical stock or 'Not enough in current vial'; Review cannot proceed or debit anything. FAIL misleading shortage or unresolved review. Cleanup reset.
## ROUTE-02 P0 — Nasal form not physical vial
Nasal setup, physically labelled vial with plan only, no actually prepared product: do not offer vial as completed nasal preparation; stock-backed log blocked without source. Doses-only mode can log without debit. FAIL fabricated prepared stock or transfer. Missing prepared-container support is an implementation limitation, not a Pass for a stock-backed nasal workflow.
## EDIT-01 P1 — Existing records and edits
Edit historical tracked and untracked dose notes only: verify original tracking mode, source ledger, dates, recorded unit metadata and balance preserved. Changing amount on backed history continues to use protected reconciliation path; unsafe calculator assertions block release. Cleanup reset.
## STASH-01 P1 — Compact cards
At 320/390, light/dark, visit Stash. Collapsed card shows name, stock and setup summary with accessible Use setup. Expand kit → Vials/History and ellipsis. Existing maintenance, plan, backup and kit/blend controls remain discoverable. Keyboard, safe area, VoiceOver and physical iPhone independently tested. FAIL clipped or inaccessible actions. Cleanup close sheets.
## QA statuses
For each case record Pass/Fail/Not Tested/Blocked, detailed actual observations, test source, evidence/run, notes and cleanup. New test code scripts/ds2-dose-inventory-regression.mjs covers untracked/backed/round-trip/mismatch at 390px in simulated mobile. Does NOT replace physical iPhone acceptance or prepared-container integration.
