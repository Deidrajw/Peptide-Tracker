# Nexus v0.8.4-beta — visible dose continuation hotfix

Scope: Restore the Log Dose selection screen's Continue button in light and dark modes. This is a narrow production hotfix on the current GitHub modular baseline.

## Changes
- Added direct display, background, and foreground styling to the existing Continue button to prevent inherited modal/button styles from making it invisible.
- No event handlers, identifiers, stored data, inventory calculations, or symptom logic were changed.
- No data migrations.

## Regression checklist
- [ ] Open Log Dose in light mode. Continue button is clearly visible.
- [ ] Open Log Dose in dark mode. Continue button is clearly visible.
- [ ] Tap Continue. The correct dose form opens.
- [ ] Scroll through Log Dose. Confirm footer stays reachable.
- [ ] Confirm no unexpected inventory changes after dismissing the dialog.
- [ ] Review Daily Check-In and symptom selector on iPhone.
- [ ] Verify keyboard and iPhone safe-area behavior.

## Validation
GitHub Actions modular asset/syntax workflow should pass. Physical iPhone interaction not yet confirmed.
