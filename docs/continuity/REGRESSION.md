# Nexus — Regression Matrix

> Reusable acceptance criteria, NOT proof of execution. Each release must supply an interactive in-chat Pass/Fail/Not Tested checklist with Copy Results. Date and link evidence for every actual test; never assume a Pass.

| Area | Critical test | Status for proposed v0.9.1-beta |
|---|---|---|
| Today | Completed/pending status from saved record; direct Edit opens correct date | NOT TESTED |
| Daily Check-In | Validate date; one record/day; editing persists mood, notes and symptom intensities | NOT TESTED |
| Symptoms | Search and browse; 1–3 intensity; general, custom and compound associations | NOT TESTED |
| Supplements | Check-In and Log Supplements search, scroll, browse, multi-select, Selected Today; date-specific historic safety | NOT TESTED |
| Calendar | Fresh current Month default; navigation; numeric weights; date detail | NOT TESTED |
| Log Dose | Source choice, draft recovery, Confirm, scrollable content, safe-area sticky footer | NOT TESTED |
| Stash / inventory | Single/multi-vial allocation, exact subtraction, insufficient-stock and no duplicate deduction | NOT TESTED |
| Protocol | Compound cards, plans, linked schedules and disclosures preserve state | NOT TESTED |
| Weight / Nutrition | Entry/edit persistence and numerical history | NOT TESTED |
| More / Settings / Backups | Settings persistence; import/export and backups protected | NOT TESTED |
| Shared disclosure UI | Chevron alignment, consistent outline/stroke, expanded direction, 44–48px targets and focus/keyboard access | NOT TESTED |
| Responsiveness | 320px and 390px widths; light/dark; no clipping, nesting, white gutters or double scrolling | NOT TESTED |
| Full-app DEMO | Entire app, every page/modal, matching DOM IDs, no null.innerHTML; fictional fixtures and isolated storage | NOT TESTED |
| LIVE/DEMO parity | Both generated from exact release source; complete ZIP includes root index.html and assets | NOT TESTED |
| Delivery | JS validation, automated tests, matched release commit, PR merge, Pages success confirmed | NOT TESTED |

## Evidence log (append actual runs)
- Version, date and tester:
- Browser/device, viewport and theme:
- Test case: Pass / Fail / Not Tested
- Expected and observed:
- Screenshots, CI URL or source commit:
- Reproduction and linked defect for failures:
- Explicit limitations and skipped tests:

Physical iPhone tests must be attributed to a real device test, not inferred from automated browser results. Documentation-only changes do not count as app functional testing.

## v0.9.1-beta validation execution entry (2026-10-23)
- Github branch: `release/nexus-v091-validation-artifacts` created from merged application commit e58e675.
- Source checks, browser render 320px/390px both themes, Check-In DOM and DEMO storage isolation: AUTOMATED WORKFLOW ADDED; results NOT TESTED until run evidence is reviewed.
- Physical iPhone: NOT TESTED. Do not mark individual end-to-end dosing, inventory math, history persistence or keyboard scroll as passed from a smoke test.

## Symptom combobox regression (2026-10-23)
- User screenshot: `Constipation` returned no matching results and Browse All contained no choices in Daily Check-In.
- Actual root cause: options JSON stored inside template.content, reader previously used template.textContent.
- PR #19 adds automated DOM checks: open combobox with no query, assert choices; type Constipation, assert visible match; select and assert Selected symptoms. Status: NOT TESTED pending CI results; physical iPhone: FAIL on original LIVE screenshots, retest repaired version pending.

## v0.9.1-beta PR #19 completed automated evidence (2026-10-23)
- Mobile regression on PR branch: PASS (GitHub Actions run 39988223703).
- Source package, demo isolation check, required DOM, responsive browser checks 320/390 and both themes: PASS (run 39988223654).
- Constipation search/browse/selected UI automation included in passing browser matrix.
- Real iPhone originally failed (reported screenshot); fix on main not yet retested on physical device. Status: NOT TESTED after fix.
- Full persistence/inventory functional suite: NOT TESTED; automation is a smoke/DOM matrix and cannot replace full end-to-end verification.
- Post-merge GitHub Pages success: NOT VERIFIED.

## v0.9.2-beta pre-merge matrix
- Grouped headings present: NOT TESTED.
- Constipation search across group: NOT TESTED.
- Group collapse/expand and selection persistence: NOT TESTED.
- Real iPhone at 320/390 dark/light: NOT TESTED.
- Full-app DEMO and LIVE ZIP: NOT TESTED until CI builds.

## v0.9.2 symptom category user acceptance (2026-10-23)
- Added automated checks for presence of Digestive, Energy & Sleep, PMS & Cycle, active Retatrutide-specific category in fictional DEMO, category expand/collapse, Constipation search, selection and intensity buttons.
- Execute at 320px/390px, light and dark, standalone full-app DEMO and LIVE served source. Latest run evidence: PENDING; real iPhone: NOT TESTED; persistence/compound association deep tests: NOT TESTED.

- Default collapsed state and first expand/collapse transition are directly asserted in automated browser QA. Search results are still expected even when categories begin collapsed. Current latest run: PENDING.

## v0.9.2-beta merged PR #21 evidence — 2026-10-23
- **PASS, automated:** 8 LIVE/DEMO cases at 320px and 390px, dark/light; grouped Digestive, Energy & Sleep, PMS & Cycle headings; active Retatrutide-specific fictional category; category collapse and re-expand; Constipation search; selected symptom and three intensity options; Check-In modal DOM and overflow check; main tab navigation smoke; isolated demo storage; safe demo banner. Evidence: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583792.
- **PASS, automated:** existing mobile form regression: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583750.
- **NOT TESTED:** real iPhone after release; complete saved Check-In editing persistence, compound tagging history, Log Dose single/multi-vial deductions and insufficient-stock, Calendar numerical weight historical correctness, entire application end-to-end, Pages deployment after merge. CI smoke tests must not imply these flows passed.
- **KNOWN OPEN:** light-theme Save Check-In on bright yellow visually low contrast in captured automation screenshot; address in next contrast audit.

## v0.9.3-beta contrast acceptance — CODED, NOT TESTED (2026-10-23)
- Browser: at 320/390px dark/light in LIVE source and isolated complete DEMO, Check-In Save CTA computed foreground/background ratio >=4.5:1, custom symptom Add CTA ratio >=4.5:1, light focused symptom category indicator outline accessible and present; syntax/build/package, grouped symptoms and page navigation tests. All **NOT TESTED** until CI run completes.
- Physical iPhone, actual VoiceOver, all navigation contrast, deep Check-In date edit, dose and vial inventory math: **NOT TESTED**; no false WCAG-wide compliance claim.

## v0.9.3-beta actual regression evidence (October 23, 2026)
- PASS automated from https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037977087: JavaScript syntax; 3 CSS files + ordered 12 JS in exact-source LIVE ZIP; self-contained complete DEMO fixtures and isolated in-memory storage; 320px/390px, light/dark, both builds; computed Save Check-In/custom Add normal-text contrast ≥4.5:1; keyboard Tab focus-visible in light mode; grouped symptoms search/select/intensity; navigation and Check-In sizing.
- PASS automated mobile forms on app-identical earlier branch commit: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037868319; latest mobile run 40037977076 IN PROGRESS at merge, not counted as pass.
- NOT TESTED: actual iPhone/light-dark/keyboard, voiceover, all screens' contrast, full historical editing and date protections, compound association history, Log Dose single/multi-vial and stock math, backup/restore, actual Pages deployment outcome.

## v0.9.4-beta — planned protected-data regression (2026-10-23)
- NOT TESTED until GitHub Actions run is confirmed: Check-In create 1 record for fixture date; mood label >=11px and touch >=48px; correct `aria-pressed`; add Constipation intensity 3, link Retatrutide; select dated magnesium supplement; save and edit notes preserving intensity and association; ensure only one daily log/date; reject changing to already occupied date and preserve both records.
- Matrix intended across LIVE/standalone isolated FULL DEMO, 320px/390px, dark/light. Never mark physical iPhone or real production records as tested from automation.

## v0.9.4-beta — actual test evidence 2026-10-23
- PASS automated: branch workflow https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524923 and attached build artifact ID 12540338019. Tested 8 LIVE/DEMO viewport/theme configurations at 320/390px, dark/light; Check-In mood option ARIA and 11px/52px targets, first save, edit without duplicated record, symptom intensity 3 persisted, Retatrutide association persisted, dated supplement history preserved, second-day record protected from attempted collision. All eight cases recorded PASS in `Nexus_v0.9.4-beta_CHECKIN_REGRESSION.json`.
- PASS automated: existing mobile form regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524934.
- NOT TESTED: actual user device iPhone, keyboard/VoiceOver on Safari, complete backup restore, all inventory/vial math, whole-app WCAG AA, GitHub Pages for app merge.
- Additional observation from rendered 320px Check-In screenshot: searching Constipation returns same selectable name under Recently logged, Retatrutide-specific and Digestive categories. The app keeps one selected name across groups; UX deduplication is an unapproved follow-up, not part of v0.9.4.

## v0.9.5-beta — duplicate symptom search regression (planned)
- NOT TESTED until passing CI evidence: with grouped dropdown open and a query, both Constipation and Nausea must show exactly one selectable row despite being in general, compound-specific and recent categories; Constipation appears under Digestive. With no query, sections remain discoverable and collapsed by default. On selection, intensity 1–3 and compound tagging still function. Verify 320px/390px, dark/light, LIVE and isolated complete full-app DEMO; maintain deep Check-In date/edit/supplement save test.
- Physical iPhone NOT TESTED; complete dose/vial arithmetic and site-wide contrast NOT TESTED; GitHub Pages release deployment UNVERIFIED.

## v0.9.5-beta — executed branch QA (2026-10-23)
- PASS: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902230 (on `caafbb79`), 8 LIVE and standalone full DEMO variations at 320px/390px and dark/light: category headings, collapsed browse, selected symptom intensity, single unique Constipation and Nausea search option, Constipation under Digestive, no JavaScript exceptions, responsive Check-In sizing, demo in-memory data isolation, light focus and scoped button contrast.
- PASS: bundled `Nexus_v0.9.5-beta_CHECKIN_REGRESSION.json` has 8 cases covering fictional creation, edit, mood, symptom intensity 3, Retatrutide tags, dated supplements and date conflict protection. Historical values and real records were not touched.
- PASS: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902171 mobile form regression.
- NOT TESTED: physical iPhone, actual Pages deployment, complete backup/restore, single/multi-vial deductions, insufficient inventory and full app WCAG AA. Next functional QA should target these deeper inventory/scheduling paths using isolated fixtures.

## Required iOS calculation feature protection (2026-10-23)
The public iOS **syringe-unit** and **reconstitution/concentration** calculators are now non-negotiable user requirements. Numeric validation must precede live iOS feature release and any public use claims. ALL listed items **NOT TESTED** as of this documentation-only planning update.
| Protected calculation behaviour | Acceptance basis | Status |
|---|---|---|
| U-100 syringe calibration | A fixed volume has the same unit value across compatible 30/50/100-unit syringes; capacity warnings rather than scale changes | NOT TESTED |
| Unit domains | Medication-specific IU↔mass conversion is forbidden without source-specific validated factors; mg/mcg/mL kept dimensionally sound | NOT TESTED |
| Reconstitution math | Deterministic concentration tests, validation of unknown strength and volumes, round trips, underflow/overflow/rounding | NOT TESTED |
| No directive claim | Product copy must not disguise an injectable draw recommendation as mere general-purpose math | NOT TESTED |
| Review eligibility | Document outcome of Apple §1.4.2 informational guidance and legal/regulatory classification | NOT TESTED |
| Web non-regression | No web storage, workflows, or calculated histories changed by iOS planning code | NOT TESTED (no application code edited) |


## iOS Option 1 design preview tests — planned, not application QA (2026-10-23)
| Preview case | Expected result | Status |
|---|---|---|
| Generic concentration UI | Fictional 10 mg / 2 mL renders 5 mg/mL | NOT TESTED in released app |
| Generic U-100 scale UI | Fictional 0.20 mL displays 20 U-100 units for 30/50/100 capacity | NOT TESTED in released app |
| Capacity warnings | If value exceeds selected capacity, display clear warning and no usable drawing guidance | NOT TESTED |
| IU unit safety | Reject direct IU→mg without substance-specific validated factor | NOT TESTED |
| Wording parity | Every existing Dose Calculator/guide entrypoint is accounted for in the planned labels; no renamed hidden functionality | NOT TESTED |
| Web protection | Source, `peptide-tracker-html-v1`, Check-In, Log Dose, vial math and existing PWA/GitHub Pages untouched by design-only PR | SOURCE NOT MODIFIED; functional app regression NOT TESTED |
