# Nexus v0.8.0-beta — Workflow reliability gate

**Status:** Baseline audit and regression plan. **No application code has been merged into main.**

## Baseline
- Latest supplied release artifact: Nexus v0.7.9-beta LIVE and DEMO, separate root-level index.html builds.
- Connected deployment repository: Deidrajw/Peptide-Tracker.
- GitHub's connected file reader returned an empty content body for main/index.html. Do not overwrite that file until its complete source can be read and compared with the supplied build.

## Audit findings from v0.7.9-beta
- Modal backdrop taps and Escape call the global closeModal() function directly.
- Draw-window X invokes onCancel(), restoring the pending Log Dose or Prepare Dose draft when supplied.
- Consequently, backdrop and Escape dismissals bypass that specialized recovery callback.
- Draw reconciliation modifies inventory; do not treat partial reconciliation as a simple UI dismissal.
- The pending draft is consumed when opening the dose form, so a new draft snapshot must be captured before transitions.

## Required acceptance criteria
1. Closing Draw via X, Escape, or tapping the backdrop returns to the unfinished dose/preparation without losing date, amount, site, notes, selected symptoms, intensity, or allocations.
2. Explicit discard is the only path that silently abandons a draft.
3. Canceling Draw never deducts stock, finishes a vial, creates a dose, or logs waste.
4. Successful reconciliation deducts exactly once, and final dose confirmation creates exactly one dose record.
5. Reconciliation stage must never be dismissible without a safe recovery or explicit warning.
6. Opening a sealed vial preserves the draft, resumes at the correct step, and retains the allocation ledger.
7. Close, Back/Escape, swipe, backdrop, and keyboard focus are checked on mobile Safari.
8. LIVE and DEMO maintain isolated persistence; no fictional records enter LIVE storage.

## Execution checklist
- [ ] Fetch and compare complete GitHub main/index.html with v0.7.9-beta LIVE.
- [ ] Apply targeted fixes for modal dismissal and draft recovery.
- [ ] Add automated browser tests with seeded fictional inventories for scenarios above.
- [ ] Validate localStorage isolation and invalid-draw constraints.
- [ ] Manually test at 320px and 390px, both themes and with iOS keyboard.
- [ ] Publish completed LIVE/DEMO artifacts, changelog, ZIP, HTML preview and regression checklist.
- [ ] Merge release branch into main only after verified review.
