# PR124 — Prepared-source transaction safety acceptance (not released)
Date: 2026-10-30
Branch: feature/dose-administration-method-20261029
Main: da585ab3458394ddf5e88e283b210933beeab810

## Isolation / starting conditions
Run automated tests only with fictional fixture state; never import real backups or test destructive edits against production data. The standalone FULL DEMO uses its own storage. Read docs/qa/NEXUS_TESTING_STANDARD.md before physical device acceptance. Prepared nasal live UI remains intentionally disabled (NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED=false), so physical administration tests must be BLOCKED, not Fail or Pass, until a newly approved safe coordinator/build enables them.

Fictional fixtures (pure Node test inputs):
- Sample A / physical kit K1 / vial V1 / OPEN / 24 mg / intendedUse Nasal; an unrelated linked preparation plan P1 with status planned-no-transfer.
- Separate actual nasal bottle N1, method Nasal, 6 mg, 3 mL, recorded and **independently verified** bottle-specific 0.1 mg per spray and 0.05 mL per spray; empty transaction log.
- Compound history Sample A has no dose records. IDs are fictional; never substitute another vial because the compound name happens to match.

## Numbered checks / expected results
**TX-01 — Prepared debit + new history.** Execute `node tests/prepared-dose-transaction.test.cjs` on the exact PR head, then independently inspect `planDose` with sample N1, 2 sprays, 2026-10-30T12:30, native mg. Expected: proposed N1 = 5.8 mg and 2.9 mL, doseId D1 + event T1 linked to N1, one new record, K1/V1 remains 24 mg, no real storage writes until `commit`.

**TX-02 — Plan-only refusal.** Replace sourceId N1 with P1 or physical-vial source kind. Expected: exception; zero dose history, zero preparation creation, zero stock changes.

**TX-03 — Unverified/insufficient conversion.** Set mgPerSpray=null, mlPerSpray=null, invalid/partial count or 0.01 mL balance. Expected: precise rejection before any proposed mutation; no fabricated conversion and no negative balance.

**TX-04 — Replay and stale storage.** Execute duplicate T1/D1, tamper storage between read and write, or test a failed write/readback. Expected: fail closed, no success receipt, no in-memory state swap, and explicit reload/reconciliation required after indeterminate browser storage outcomes.

**TX-05 — Undo once only.** Reverse exact event T1 using new reversal event R1. Expected: N1 returns to 6 mg/3 mL, active dose D1 removed from active history, audit events T1 and R1 retained, V1 stays 24 mg; retry refused.

**TX-06 — Editing/history protection.** Add reaction/notes after D1, then attempt reversal without reconciliation. Expected: blocked, with dose/reactions preserved and unchanged prepared balance.

**TX-07 — User source modes.** Existing Use Setup must remember Backed or Untracked. Backed must never silently switch to Untracked; untracked must write explicit provenance and zero stock events. Existing browser source fixtures must pass; full iPhone test remains separate.

**TX-08 — UI / device validation (BLOCKED).** Once and only once the shared writer is implemented, use isolated FULL DEMO and real iPhone Safari at 320/390 widths light/dark: choose route Nasal, verified prepared N1, enter 2 sprays, Review, Save, revisit history and stock, Undo, test expired/insufficient source, cancelled review and route change. Expected one durable atomic transaction, correct source, no hidden physical-vial deduction, safe-area/keyboard/scroll/VoiceOver checks. Until then, not accepted.

## Evidence and reset
Capture exact GitHub source SHA, workflow run IDs, passing assertion logs, before/after full fictional state for TX-01..06 and screenshots for TX-08. To reset pure unit tests, start a new fixture instance. To reset browser demo, reopen its isolated file/reload fictional scenario; never clear live production localStorage or overwrite a user backup. Document each case as Pass / Fail / Not Tested / Blocked, including tester/device/version, actual observed result, and screenshot on failures. A CI build is not physical UAT.
