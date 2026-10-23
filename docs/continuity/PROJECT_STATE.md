# Nexus — Project State

> Living handoff. Update on every material change, including incomplete work. GitHub main is the source of truth; reverify each session. Never store private production data here.

**Documentation baseline:** 2026-10-23
**Repository:** Deidrajw/Peptide-Tracker
**Production:** https://deidrajw.github.io/Peptide-Tracker/
**Latest verified main SHA at start of this release verification:** e58e6750a2ef000384c8d1084ffe22d5467a202d
**Last merged application PR:** #18 — v0.9.1-beta Chevron Parity (source verified; deployment outcome not reverified)
**Last verified Pages run:** https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973924397
**Last conversational release label:** v0.9.0-beta
**Version metadata:** Latest main index.html declares v0.9.1-beta; GitHub Pages output still requires separate confirmation.
**Documentation setup:** PR #17 merged and established the four continuity files.

## Architecture and safeguards
- Existing root index.html, assets/css/nexus.css, and ordered assets/js/01-nexus.js through 12-nexus.js. Confirm against live main.
- Main tabs: Today, Calendar, Protocol, Stash, More; includes Check-In, supplements, symptoms, weight, nutrition, dose, schedule, history and inventory.
- Preserve real localStorage (historical key peptide-tracker-html-v1), exports, backups and all dose calculations. Do not import demo data into production.
- A stale PR #2 for modularization was previously identified; do not merge it blindly.

## Active priority — finish app-wide chevron and disclosure consistency
- PR #16 improved Symptoms, Browse All Supplements, Selected Today and compound-symptom chevrons; it was not a complete visual audit.
- Source audit in the 2026-10-23 conversation found different CSS and Unicode indicator patterns in Today, Protocol, kits/Stash, history, weight, settings, and Log Dose.
- Normalize shared stroke, geometry, direction, alignment, 44–48px touch targets and light/dark states. Verify actual rendered UI at 320px and 390px. Do not count source inspection as browser testing.
- PR #18 has merged the v0.9.1-beta shared-chevron code. Rendered/browser verification and source-identical artifacts were still outstanding at the start of this validation branch. Major new UI redesigns remain deferred until acceptance.

## Completed behaviours to preserve
- Calendar opens current local month, Month tab; compact cells keep real numeric weight and historical date details.
- Daily Check-In status and Edit near top of Today; date validation, no duplicate entry/date, edits, mood, symptoms (1–3), notes and compound associations.
- Supplements: searchable, internally scrollable, browseable multi-select in Check-In and Log Supplements; Selected Today count and date-specific history.
- Symptoms: general and compound-specific search/browse; selected symptom intensity 1–3, custom terms and historical associations.
- Log Dose: source selection, drafts, confirmation, scrollable bottom sheets, anchored actions, correct single/multi-vial deduction, insufficient inventory.

## Open bugs, risks, and other priorities
1. Prior reconstructed full-app DEMO had a missing supplement DOM-node error in paintCheckinSupp (null.innerHTML). Patch existed, but full all-modal browser verification remains unproven. Build DEMO from exact release source and keep isolated fictional fixtures.
2. v0.9.1-beta title corrected on main; verify deployed title and reconcile formal releases.
3. Light/dark contrast, emoji-based general UI icons, nested accordion borders, white gutters, excess spacing.
4. Broader Check-In, Supplements, Weight/Nutrition, Log Dose, date edge cases, inventory and history regression.
5. Documentation must be kept current with actual PRs/commits/tests; do not copy unverified claims into releases.

## Release artifact status for v0.9.1-beta (verified 2026-10-23)
- App shared-chevron implementation: MERGED through PR #18 at e58e675; browser visual acceptance NOT VERIFIED.
- Packaging verification branch: `release/nexus-v091-validation-artifacts` based on e58e675; adds corrected builder, full-app isolated DEMO, root-index LIVE ZIP and 320/390 dark/light automated QA workflow. PR/CI outcome pending.
- In-chat conceptual chevron preview: available in conversation; not release evidence.
- Standalone complete full-app DEMO: BUILD CODED; artifact and end-to-end functionality INCOMPLETE until CI validation.
- Exact-source LIVE ZIP: BUILD CODED; artifact INCOMPLETE until CI run.
- Release notes and interactive regression checklist: in progress; no untested Pass assertions.
- Pages deployment for PR #18: UNVERIFIED here. Physical iPhone tests: NOT TESTED.

## One concrete next action
Review PR #19's latest mobile/browser CI run, including Constipation browse/search selection and DEMO isolation; fix failures before merging and publishing artifacts. Verify deployment for the resulting main commit.

## Session handoff template
- Timestamp and timezone:
- Verified current main SHA:
- Open branch / PR / status:
- Code and documentation changed:
- Tests executed (device/browser, 320px/390px, themes) / failures:
- LIVE ZIP and full-app DEMO status:
- Release version, merge SHA, deployment evidence:
- Blockers and unverified assumptions:
- **One next action:**

## New issue: empty symptom options (2026-10-23)
- Real iPhone screenshot confirmed search for Constipation and Browse All returned `No matching symptoms`. Root cause discovered: `HTMLTemplateElement.textContent` was read rather than `template.content.textContent` in `wireSymptomPicker`, leaving catalog empty. Fix committed on PR #19 branch, NOT YET DEPLOYED.
- Replaced separate Search + Browse All with a single searchable combobox that opens available options on focus, supports filtering and multiple selections with intensity controls; protected recorded symptom values. Browser QA added, outcome pending.
- PR #19: https://github.com/Deidrajw/Peptide-Tracker/pull/19. Initial CI packaging succeeded but test had wrong navigation selector; corrected on branch. No confirmed pass yet.

## Post-merge verification — October 23, 2026
- GitHub main merge SHA: `5b44b1e187b37059f7e63c399c8463f6e4782745` — PR #19 merged successfully.
- Symptom combobox defect fixed in GitHub source: template.content reader now supplies available symptoms, single searchable/browseable combobox supports selection and intensity; physical iPhone retest NOT TESTED.
- Automated PR branch QA: mobile workflow run 39988223703 SUCCESS; release artifact/browser workflow run 39988223654 SUCCESS (320/390, both themes, LIVE and DEMO smoke checks).
- Build artifact: `Nexus-v0.9.1-beta-release` artifact ID 12516393327 (release run), contains LIVE ZIP, full-app standalone DEMO and manifest plus available browser evidence; artifact associated with PR SHA `9336139005c9b025afe71a25a9c05b932a346914`. Later branch changes were documentation only until merge.
- **Pages post-merge deployment: NOT VERIFIED**; available GitHub connector only exposed PR-scoped commit workflow runs. Do not claim deployed.
- Remaining tests: user iPhone combo browse/search/selection/intensity; comprehensive log/persistence/inventory functional regression beyond smoke coverage.
- **One concrete next action:** Confirm GitHub Pages workflow for merge SHA 5b44b1e, then user-test Constipation search and Browse on iPhone; address any defects before full signoff.

## v0.9.2-beta grouped symptoms (2026-10-23)
- Baseline main: a82017daad493dbbff9920ad66788ddb5c5d61de. Working release branch: release/grouped-symptom-picker-20261023.
- Approved grouped symptom combobox implemented in assets/js/04-nexus.js; recently logged, active compound-specific, general named groups, custom and other selected symptoms. Search filters across groups; expand/collapse category state, multi-select and existing intensity controls. No schema change.
- Added CSS in assets/css/nexus-disclosures.css, version changed to v0.9.2-beta. Release builder/test source updated. Full-app demo/LIVE ZIP/test results INCOMPLETE until workflow confirmed.
- Next action: validate workflow and fix failures; merge PR only after CI pass, then verify Pages deployment and iPhone testing.

### Category label and QA follow-up (2026-10-23)
- UI labels refined to Retatrutide-specific (only for an active matching compound) and PMS & Cycle (existing Cycle / Hormonal symptom items). Underlying catalog, stored names, selected intensity and associations not altered.
- Automated browser assertions added for Digestive, Energy & Sleep, PMS & Cycle headings; collapse/reopen behavior; Retatrutide-specific fictional fixture category; search and selected intensity. CI PENDING after follow-up commits.
- **One concrete next action:** Review latest PR #21 mobile and full-app DEMO/LIVE build QA logs; correct failures, verify artifact completeness, then merge only if all checks pass and confirm Pages deployment.

- Picker sections now default collapsed so category headers remain scannable in the fixed-height dropdown; searching automatically reveals matches without requiring category expansion. In-session expand/collapse choices survive picker rerenders; no stored schema change. QA pending for this latest change.
