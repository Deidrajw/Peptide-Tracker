# Nexus mobile UX audit · 2026-10-22

## Functional baseline
Deployed GitHub code is v0.7.8-beta lineage, modularized into 12 sequential scripts and one stylesheet. The modular packaging **does not** by itself contain every separate candidate patch from v0.8.0–v0.8.3. Do not claim all candidate patches were deployed.

## Confirmed source observations
- Log Dose has a dedicated `.nx2-dose-modal` with a separate `.nx-dose-scroll` and bottom `.nx-dose-footer`.
- Daily Check-In has a structured sheet and optional symptoms disclosure.
- Shared symptom rows use three compact numbered intensity choices.
- Continue to dose log receives direct button styling from the preceding hotfix.
- Inventory calculations, existing storage model, and all JavaScript are unchanged in this audit patch.

## This change
- Make symptom names wrap on narrow viewports without pushing intensity controls offscreen.
- Improve focus/scroll padding for the Check-In sheet and Log Dose scrollport.
- Respect iPhone home-indicator safe area for action footers.
- Ensure footer action controls have usable minimum touch heights.
- Label the HTML's existing functional baseline correctly as modular, rather than falsely claiming that separate v0.8.3 candidate was merged.

## Regression checklist (run with fictional demo data first)
- [ ] 320 px: symptoms, three intensity buttons, and all labels remain visible.
- [ ] 390 px: symptoms fit comfortably on one row when possible.
- [ ] Both themes: Continue to dose log is legible and clickable.
- [ ] Check-In symptoms stay selected while switching tabs or collapsing.
- [ ] Log Dose form scrolls with Confirm Log reachable at bottom.
- [ ] iOS virtual keyboard does not cover the last form field.
- [ ] Shortfall allocation and multi-vial accounting unchanged.
- [ ] Cancel Draw restores the unfinished draft; inventory unchanged.
- [ ] LIVE storage remains intact; no sample data inserted.
- [ ] GitHub Pages deployment has successful status for merged commit.

## Verification limits
Static source checks and GitHub assets check are not a substitute for iPhone Safari interaction testing.
