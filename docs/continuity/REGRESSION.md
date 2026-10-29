## 2026-10-29 — User physical iPhone PR124 findings and subsequent exact-source bugfix QA
- User directly reported checklist: completed protocol follow-up PASS; elapsed schedule PASS; explicit PRN exemption NOT TESTED; Quick Log PRN carryover PASS; newer active protocol BLOCKED; acknowledgement BLOCKED; dose and inventory integrity BLOCKED; light/dark and scrolling PASS. These are USER-REPORTED test statuses, not automated conclusions.
- iPhone screenshots show real open-vial balances in Stash but erroneous "Not enough in current vial" with 0 eligible while entering a smaller dose, repeated after Open new vial / Confirm draw. Backup inspected privately, NOT committed. Diagnosis: missing legacy administration method labels excludes physical open stock from new route-eligibility filter. Targeted code a52999a / d5e360c supports explicit per-vial source method confirmation and preserves existing draft rows; additional safety code 96300dd / d1040e7 makes Confirm draw use the allocation row's exact vial ID and blocks kit-level guesses when multiple sources are open. Fictional targeted test 81d6907 covers sufficient unlabeled vial; test 40312b6 asserts exact-vial draw with simultaneous open vials. Latest application/test commit 40312b6; CI pending 40954439080 release, 40954439146 mobile, 40954439131 WebKit, 40954439145 nested. New scenarios NOT YET VERIFIED until full CI and manual iPhone acceptance. Previously passing run 40953414546 covers earlier source commit only, NOT 40312b6. Never overwrite saved dose, prepared, inventory, waste, transfer records.

## 2026-10-29 — PR124 legacy open-vial route eligibility blocker
- Physical iPhone reported two distinct open-vial balances shown in Stash but Log Dose falsely reads 0 open, including following Open a sealed vial / Confirm draw. Original user backup used for PRIVATE analysis; never include it in repo fixtures. Source-filter root cause: missing old kit/vial method metadata excludes a real open physical vial, not true 0 inventory. Fictional automated regression at tools/validate-logdose-ui.mjs asserts explicit SubQ source confirmation (2.95mg), 1mg saved dose, 1.95mg remainder, exact vial attribution, no prior history mutation; browser CI pending.
- Must still test 320/390 light/dark: legacy open vial selection, changing route incompatibility, multiple open vials, newly opened unlabeled vial and draft preservation, Confirm draw state refresh, negative insufficient case, and protected history/undo. Real iPhone source/debit, scroll and keyboard TESTING REQUIRED. Do not claim PASS for new fixture until CI finishes.

## 2026-10-29 — New exact-head reminder tests and observed failed preliminary attempt
- Browser tests at tools/validate-protocol-design.mjs now exercise fictional LIVE/DEMO phase-one start, seven-day transition, Phase 2 tomorrow/today, end in seven/one day, schedule ended, paused/completed exclusions, planned future/today/stale suppression, and no protocol/inventory mutation; across 320/390 light/dark. PRELIMINARY CI 40950394101 **FAIL** on first alert test expectation; root cause test incorrectly demanded simultaneous phase-one starts-today and 7-day transition message, while code intentionally prioritises phase-one start. Test corrected in 73a6ec2 and planned scenarios extended in b9545a6. Exact-head latest full run 40951124701 still IN PROGRESS; do not claim passing yet. Further pause-day, multi-compound, snooze/dismiss, accessibility, physical iPhone checks NOT TESTED.

## 2026-10-29 — In-app protocol reminder acceptance matrix (NEW; NOT YET TESTED)
- Verify phase-one start today; future phase start 7/3/1 days and transition day (dose/rest/resume); final phase end 7/1 days; ended schedule on day zero and later until dismissed/snoozed/status updated; 7-day and 1-day wording; paused time freeze; multiple compound timelines; manually Completed/archived exclusions; planned-start behaviour; transitions across timezone/local midnight; dismissal no duplicate; empty phases; no false completion/status mutation; no changes to dose records or stash; existing 320/390 light/dark and physical iPhone controls. Code commits 45264ec, 9737c44, d8a4768, c373081b pending exact-head CI and targeted browser tests. All new feature test statuses NOT TESTED pending evidence.

## 2026-10-29 — Final protocol reminder gap, new tests REQUIRED (NOT TESTED)
- Existing code 10-nexus.js skips done phase timelines and returns early when there is no next phase; final-phase/protocol end advance alert absent. Add tests for final phase 3d/1d/end day/after end, last phase transitioning to protocol end, pause-date shifts, multiple compounds with different ending dates, archived/completed exclusion, snooze/acknowledge, stored in_progress vs derived Schedule ended, non-destructive protocol history, and per-dose PRN exemption. No PASS claim for these new tests.
- Exact-head PR124 build at d42fd3cb: full release 40932209177 SUCCESS, WebKit 40932208627 SUCCESS, mobile 40932208817 SUCCESS, nested 40932208482 SUCCESS. Artifact #12922869213, manifest test-merge SHA b276f67f, LIVE ZIP 24 paths, 5 Git blob comparisons PASS, 320/390 light/dark browser QA PASS. Physical iPhone NOT TESTED. Cloudflare production parity intentionally NOT VERIFIED for unmerged PR.

## 2026-10-29 — Post-protocol PRN/active overlap edge cases
- New source fixes 7bc3474e / 13dcdd9d: Quick Log preserves explicitly prior PRN intent, and older-ended protocol does not nag when a newer active same-compound phase covers the logged date. Source code inspected; dedicated browser assertions for these two edge cases and final exact-head CI still pending, not Pass. Check post-save preservation, no repeated acknowledgement, undo and protocol status. Physical iPhone NOT TESTED.

## 2026-10-29 — Post-protocol dose-followup test matrix (pending CI)
- Code `740d6d3e`, `b2755558`, `767b8c25`, `0133d843`, `4725c4f8`; fictional browser assertions `c548369e`: PRN dose returns no reminder; completed protocol and continued dose opens actions; Not now stores per protocol/compound acknowledgement; repeated dose does not nag; dose count and completed protocol status remain unchanged. Run in source-equivalent LIVE/full DEMO × 320/390 × light/dark; CI PENDING. Also inspect manually: no protocol existing should not prompt, paused/active should not prompt before end, schedule-elapsed should prompt, Check-In/Calendar dose records unaffected, Quick Log undo preserved, reaction invitation after dismissal.

## 2026-10-29 — Physical iPhone partial acceptance + follow-up UX requests
- USER PHYSICAL IPHONE: Open two vials PASS; independent intended uses PASS; source-linked Create Preparation PASS as a **plan-only** action; Add purchased product PASS; historical data PASS. Exact-source Log Dose NOT TESTED; warning/navigation NOT TESTED; light-mode/site compatibility NOT TESTED. User supplied screenshots of opened Vial 1 nasal-source + Vial 2 SubQ, separately recorded capsule package, and Create Preparation button.
- USER QUESTIONS/UX REQUESTS: After Create Preparation, show a clear saved plan/detail and next step, not silent dead-end; actual source debit → destination stock requires future separately validated transfer workflow and is still DISABLED. Add Kit compound search should support an explicit inline `+ Create compound` action (existing raw free-text entry alone is not a shared compound record). Proposes segmented Stash tabs for Kits vs Other products and redesign of non-vial product cards; requires design preview/approval before redesign. Standardize dropdowns/pickers across Stash/Log Dose with iPhone accessibility. User asks for non-protocol standalone dose logging; audit existing Today dose entry and distinguish dose logging independent of a scheduled protocol from availability of an unscheduled quick-entry shortcut. Require step-by-step iPhone acceptance instructions, including #6 contextual warnings. Preserve completed DS2 Stash and historical data; do not merge/deploy.
- NEXT ONE ACTION: Present revised Stash product-tab/card and compound creation previews, get design decision; independently verify standalone dose entry and tested warning scenarios; then implement approved UX changes on draft PR with exact-source DEMO/LIVE and CI. User physical tests still required for 3 unchecked scenarios.

## 2026-10-29 — Release artifacts and iPhone acceptance gate
- GitHub full run 40913649262 SUCCESS. Artifact 12915741154 downloaded and ZIP integrity checked; root index and 23 referenced CSS/JS/icon paths packaged. LIVE ZIP blob SHA matched PR branch for index.html, nexus.css, 04,05,09,10 JS. Full standalone DEMO included and manifest identifies ephemeral isolated storage (not a physical runtime security audit). Browser/WebKit/nested passed separate runs 40913649295/40913649202/40913649436.
- Physical iPhone tests PENDING: open second vial within existing non-blend kit while first stays open, independent intended uses, explicit exact vial selection, dose history source attribution, in-kit linked no-transfer preparation plan, independent Add Kit purchased nasal/capsule, warning dismissal, light theme and IM/SubQ site compatibility. Block blend simultaneous open and legacy Prepare Doses ambiguous source. No production acceptance claimed.

## 2026-10-29 — Legacy shortfall test updated for explicit source contract
- Run 40913124098 FAILED (not a safe release) because old `openDose` helper expected automatic first-kit source. In new correct UX the source is intentionally unselected when there are multiple candidates. Test helper `4c6cf6ee` now explicitly taps first kit-opt; separate `validate-formulation-stock.mjs` checks no auto-default. Browser 40913649295, WebKit 40913649202 and nested 40913649436 SUCCESS on updated test commit; full release run 40913649262 PENDING. No physical iPhone test or production deployment.

## 2026-10-29 — Multi-open end-to-end browser/WebKit proof
- c95e439d fictional validator now opens second vial using `openNewVialModal` instead of pre-seeding it open, checks both remain open and individual balances, selects Vial2 for one dose, checks exact history source and sibling balance, and creates linked Vial1 nasal plan without transfer. Browser 40913124073 SUCCESS, WebKit 40913124222 SUCCESS, nested 40913124963 SUCCESS; physical iPhone NOT TESTED. Full artifact 40913124098 still building at checkpoint. Caveat: blends retain conservative single-open guard and legacy syringe Prepare Doses rejects ambiguous same-kit sources.

## 2026-10-29 — Final exact-source remediation check pending
- 178ab552 restores Prepare Doses local vial resolver; 015a0b87 labels next opened physical vial by sequence; ec82d9e5 prevents misleading allocation shortfall before source choice; dab844ab wraps preparation action at 320px; 3693c899 blocks legacy syringe preparation when more than one open same-kit source exists. Must verify normal Prepare Doses still functions with one vial, two-open path fails before stock writes and no unintended dose history changes; blend-specific opening remains blocked. CI on final application commit 3693c899 PENDING.

## 2026-10-29 — Same-kit exact source and linked preparation regression
- Browser 40912034303 SUCCESS at test commit 2680aba5: scripted fictional 320/390 light/dark LIVE/DEMO selection of two open Vials in same kit, explicit choice of second vial, precise dose deduction of second source only (7mg/9mg becomes 7mg/8mg), one dose history allocation sourceVialId=source-b; linked nasal preparation plan references source-a without debiting or generating available nasal stock. Later changes af2afbd8, 015a0b87, ec82d9e5, dab844ab need fresh CI. No real iPhone acceptance. Blend two-open remains blocked by ledger safety.

## 2026-10-29 — Exact-vial browser test checkpoint
- Run 40911647051 browser completed SUCCESS on bc9a8c77. This includes newly authored fictional exact-vial selection checks alongside browser workflow; per-run detailed assertions not independently downloaded. WebKit 40911646998 and nested 40911647244 still running. Physical iPhone not accepted; no transfer testing. No release.

## 2026-10-29 — Draft PR124 exact-vial UI regression, source only
- `bc9a8c77` adds browser fictional assertion at 320/390 widths, light/dark, LIVE and isolated DEMO: two open same-kit SubQ vials are separate `kit-opt` buttons, neither is preselected, selecting vial #2 uses its exact ID and does not consume either balance. Browser CI on this change PENDING (do not mark Pass yet).
- `fa88b464`, `8ae43d30` link no-transfer preparation plans to existing kit/vial, not fabricated bottle/quantity. Missing tests for save failures, restored history, alternate routes, simultaneous open/close, dose confirmation and blend gating. iPhone acceptance BLOCKED.

## 2026-10-29 — Source-linked in-kit preparation plan (unverified)
- Source `fa88b464`, `8ae43d30`: Create preparation appears per open vial and records `linkedPreparationPlans` on existing kit referencing exact sourceKitId and sourceVialId; list shows plan on that vial. No amount credited/debited, no conversion, no global formulationStock created. Require tests for two vials separate plan ancestry, preservation of all original vial/historical records, stale/closed-vial rejection, navigation/44px/320/390 dark/light, save failure handling. CI/physical iPhone NOT TESTED. Do not mark a physical nasal preparation or cross-route deductions complete.

## 2026-10-29 — Quick Log fail-closed safeguard
- 9aca8d6c prevents direct Quick Log inventory debit when selected kit has >1 open vial with >0.01 mg. Needs fictional browser regression for two-open source and single-open normal Quick Log, no unintended history append, no silent amount deduction. Source-only verification; CI and physical iPhone NOT TESTED. Full intended multiple-open workflow blocked pending explicit picker.

## 2026-10-29 — Suggested-allocation ambiguous source regression
- Source `6d6d9639`: `suggestAllocation` returns null when any candidate kit has two positive-balance open vials, instead of emitting allocations from first vial. Requires fictional test for two-open-vial rejection and single-vial unaffected, plus verification that user-facing picker supplies exact source ID before enabling two-open functionality. Tests for new commit PENDING. Do not confuse fail-closed guard with completed UX.

## 2026-10-29 — Exact-vial allocation safeguard (not yet accepted)
- `40622ae6` adds fail-closed behaviour for >1 open vial without vial ID and unknown supplied ID; preserves single-open-vial compatibility. Must test with fictional vials: two open different methods, ambiguous call leaves stock/history unchanged; ID-specific call debits only named vial; invalid ID fails; previously recorded allocation ID remains unchanged. CI pending, physical iPhone not tested. Do not mark multiple-vial workflow Pass until Stash, preparation and dose source picker wired and accepted.

## 2026-10-29 — Contextual warning dismissal
- Code `60f6aa0f` clears validation notice on modal close. PENDING automated and iPhone test: trigger warning, close sheet or navigate to another form, assert notice absent; confirm no existing inventory or dose history changed. Multiple open vials and linked-preparation flow NOT IMPLEMENTED.

## 2026-10-29 — Add Kit targeted remediation tests pending
- Source commit 57dce9b6: iPhone compound list via visible 44px buttons, creation labels distinguish initial amount from remaining stock, and commit rebases on persisted state after comparing inventory arrays. NEED automated tests for picker selection/free text, stale same-inventory state, changed inventory rejection, and preservation of unrelated persisted records. CI/physical iPhone not yet passed; no claim of atomic cross-tab safety.

## 2026-10-29 — Physical iPhone acceptance failures, PR #124 (unreleased)
- User reported: Add Kit compound search FAIL; save blocked by `Inventory changed; reload before editing`; newly acquired products incorrectly labelled Remaining; global stale open-vial warning; open second vial blocked; two separate workflows required (existing-kit source-linked preparation vs newly purchased product).
- Log Dose: light-mode inactive administration method buttons illegibly dark; SubQ site dropdown included previously recorded `Vastus lateralis — L (IM)`.
- Implemented on draft PR: 05-nexus.js 530b4849 prevents method-incompatible legacy site from appearing as an active choice, without editing persisted historical doses; nexus.css 0503087f light-mode inactive methods use theme surface/text.
- SOURCE-ONLY CHANGES; exact-head CI, live-browser verification, real-iPhone reacceptance NOT TESTED. Remaining Add Kit/vial/preparation defects OPEN. No production deployment, transfer or route-specific deduction enabled.

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

## v0.9.6 candidate Protocol UI regression — PENDING CI (2026-10-23)
- Planned automated 320/390px × light/dark × LIVE/full isolated DEMO: New Protocol starts at 1/6, Next twice correctly renders 3/6 Stack, separate outline search icon and unmodified search function, Add/Remove compound and route selection; Retatrutide expanded card includes collapsed Insights, can open full original timing content, menu accessible through SVG ellipsis, History/Calendar/Settings/Colour/Pause/Remove intact, no horizontal overflow, demo isolation. Run `tools/validate-protocol-design.mjs` in release CI. Existing Check-In save/edit/date/history tests must remain PASS.
- Screenshots and real physical iPhone: NOT TESTED. No QA pass claims until CI review; Pages release UNVERIFIED. Do not merge candidate until visual approval and no functional regression.

## v0.9.6-beta candidate actual automated evidence (2026-10-23)
- PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056553001 : eight LIVE/DEMO × 320px/390px × dark/light Protocol design tests: progress header, Step 3, SVG search, GHK-Cu add/remove and route selector, collapsed/open Insights, original guidance visibility, SVG ellipsis, menu actions/history/calendar/schedule/colour/pause/remove and no horizontal overflow. Eight legacy release/browser tests and eight deep fictional Check-In edit/date/inventory-independent tests also passed.
- PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056552959 existing mobile form regression. Artifact #12545936209 contains QA JSON and screenshots.
- NOT TESTED: real iPhone, keyboard/VoiceOver, menu reachable to bottom under keyboard and sticky navigation, medical validity of explanatory text, site-wide layout accessibility, Log Dose vial deduction arithmetic. Candidate PR is unmerged and Pages unverified.

## v0.9.6 final candidate QA addition — 2026-10-23
- PASS latest automated build/visual/function https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857750 and mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857769. 320px Retatrutide title fits without clipping, ring remains next to Last/Next; user review screenshot `proto-design-demo-light-320.png`. All prior Protocol and Check-In test matrices green, demo isolated.
- Open UX issue: contextual inline More menu extends below initial viewport and needs extra scrolling; bottom-sheet design is PROPOSED, NOT CODED/TESTED/APPROVED. Pages, real iPhone, dose/inventory comprehensive tests NOT TESTED; user approval before merging PR #31.

## v0.9.6 full DEMO attachment/opening follow-up — PENDING CI (2026-10-23)
- Earlier standalone full-app demo PASS in GitHub browser matrix; direct opening from ChatGPT file attachment reported FAIL by user. Root cause not verified: attachment viewer/browser can block arbitrary downloaded JavaScript, while GitHub Actions' full browser executes it. Separate full-app offline ZIP is supplied with browser instructions, containing byte-identical complete isolated `index.html`, checked by CI; actual user's local Safari/Chrome outcome NOT TESTED.
- Distinguish three things: GitHub browser PASS, packaging ZIP exact-byte PASS only when new CI succeeds, and actual user click/open still unverified. Physical iPhone, Pages deployment and production data remain untouched.

### v0.9.6 updated DEMO delivery QA — PASS automated (2026-10-23)
- ZIP validated in GitHub build workflow https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40057610410: offline ZIP has `index.html` and README; extracted HTML exactly equals complete standalone fictional demo; existing 8 LIVE/DEMO responsive and Check-In/Protocol validations succeed. Mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40057610653 PASS.
- Local archive content verified without errors and SHA-matched to previously QA-passed standalone HTML. User clicking/extracting and opening on actual Safari/Chrome remains NOT TESTED. The chat attachment's own HTML preview remains an unsupported/unverified JavaScript execution context. Neither live Nexus nor user records affected.

### v0.9.6 bottom sheet expanded test matrix — NOT TESTED until new CI (2026-10-23)
- Automated checks added to `tools/validate-protocol-design.mjs` for 8 kinds/themes/widths: modal dialog is portalled to body (not inline), backdrop present, anchored bottom, scroll locked, app inert, ARIA set; six actions present; keyboard Tab retained, Escape returns focus and scrolling, backdrop and close button dismiss; existing History and Schedule actions still expand their content on card, Colour input retained; no horizontal overflow. Existing Protocol step/search, Check-In save/edit and mobile form suites must remain PASS.
- Physical iPhone and full colour-picker functionality still NOT TESTED, as are complete vial math, Pages and regulatory signoff. Keep release incomplete until validated.

### v0.9.6-beta actual post-approval PR automation (2026-10-23)
- PASS GitHub workflow `40059005979` run on PR head `80bd01b878f60ddacb8e129178d53be6060cab0d`: 8 LIVE/standalone DEMO × dark/light × 320/390 cases: initial 1/6→3/6 wizard header, proper outline search SVG, compound GHK-Cu add/remove, route selector, compact Retatrutide title+countdown, Insights default collapsed/open and original content, ellipsis sheet body portal (does not push card), scrim, centered bottom dock, app inert/scroll lock, six actions, keyboard Tab/Escape, backdrop/close, restoration of app and focus, functional History and Schedule actions, no horizontal overflow. Screenshots `proto-open-sheet-{live|demo}-{dark|light}-{320|390}.png` in artifact `12546861220`.
- PASS existing deep Check-In synthetic state tests (8 LIVE/DEMO variants), grouped Symptoms test and mobile form regression `40059005978`. Complete source root ZIP has index.html+3 CSS+ordered 12 JS; full standalone DEMO and offline ZIP are byte-identical, isolated in-memory, no live storage writes.
- NOT TESTED: physical iPhone/VoiceOver, native iOS color spectrum interaction, full saved-history backup/restore and dose/vial multi-stock inventory calculations, independent live GitHub Pages publish after merge, comprehensive App Store medical/regulatory review. Never infer live Pages deployment from GitHub merge.

## v0.9.6 QA-only vial and publication checks — NOT TESTED until CI (2026-10-23)
- New isolated synthetic matrix `tools/validate-vial-safety.mjs`: 8 combinations LIVE/DEMO × 320/390 × dark/light. Cases: sealed stock excluded, insufficient source leaves inventory unchanged, single-vial 2 mg draw and precise undo, original-vial record reversal, explicit 1.5+2.5 mg multi-source split, automatically empty/reopen vial on undo, prepared batch 3 of 5 unused gives back only 6 mg of original 10 mg, mg/mcg exact conversion. No human clinical conclusions or prescription recommendations.
- New `tools/verify-pages.py --smoke` tests the verifier against a local HTTP server (does NOT imply GitHub Pages deployed). Main push workflow tests actual remote 16-file hashes and emits `Nexus_PAGES_SOURCE_PARITY.json`; only successful remote result may be marked PAGES PASS. All checks currently NOT TESTED until Actions evidence.
- Actual Safari iPhone, site-wide VoiceOver, native colour picker, full Log Dose UI/keyboard/confirm and multi-vial draft, import/export history and App Store safety review NOT TESTED.

### v0.9.6 QA-only independent inventory evidence (2026-10-23)
- PASS branch CI `40060006633` (artifact #12547102223, `Nexus_v0.9.6-beta_VIAL_SAFETY_REGRESSION.json`): 8× LIVE/DEMO, dark/light 320/390; six tests per context, 48 total: sealed vs open source, insufficient stock unchanged, single-vial deduction and undo, original-vial dose record reversal, multi-source exact split/undo, prepared batch unused-only return, mg/mcg conversion. Existing browser/Check-In/protocol 8-case matrix PASS; mobile workflow `40060006632` PASS.
- GitHub Pages local HTTP smoke `Nexus_PAGES_SOURCE_PARITY.json` `smoke_only:true` PASS; do NOT treat as public Pages verification. Remote production check added to PR workflow (results PENDING). Actual Safari, full Log Dose form with multi-vial drafts/keyboard and App Store clinical audit still NOT TESTED.

### v0.9.6 published Pages independent source parity — PASS (2026-10-23)
- GitHub Actions remote check run `40060285190` artifact `12546599640`, JSON `Nexus_PAGES_REMOTE_CHECK_PR.json`: base HTTPS `https://deidrajw.github.io/Peptide-Tracker/`, `smoke_only:false`, `verified:true`, 16/16 identical source files on first attempt (index, 3 CSS, 12 JS). This is legitimate public live file content verification, unlike the earlier `smoke_only:true` local check. PR/mobile CI run `40060285144` PASS.
- Still NOT TESTED: physical iPhone Safari/PWA cache, VoiceOver, native iOS spectrum picker and actual Log Dose draft/confirm with full multi-vial history. No claim of complete device acceptance or medical regulatory approval.

## iOS measurement arithmetic diagnostic (2026-10-24; EVIDENCE PENDING)
- `tools/audit-measurement-math.mjs` tests CURRENT unmodified `reconCalcView()` via 8 synthetic disposable contexts (LIVE local checkout/isolated FULL DEMO × 320/390 px × dark/light), for 80 assertions total if the script completes.
- Cases: U-100 displayed units across 30/50/100 capacity compared to direct generic scale, capacity invariant, mcg/mg equivalence, unjustified generic IU conversion, negative/empty/zero-denominator rejection and browser exceptions.
- **ALL NOT TESTED pending actual GitHub workflow evidence.** Any FAIL must be recorded as FAIL, not converted to success merely because the diagnostics script intentionally exits with zero to preserve evidence. This is a docs/QA-only check: no source calculator change or clinical certification.
- Accept before *any public iOS math tool shipping* only after independently assessed tests PASS, physical-device tests PASS, regulatory eligibility resolved, clear source evidence and safe data migration. Existing web workflows remain protected; do not assert that current UI is safe from this diagnostic alone.

### Actual measurement diagnostic evidence — 2026-10-24
- Test source: PR #36 head `a5861cb`; automated LIVE local checkout / isolated fictional full-app DEMO at 320/390px and light/dark, 8 sessions, 80 assertions. GitHub Actions [40061025452](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025452), artifact ID `12547685887`, JSON `Nexus_v0.9.6-beta_MEASUREMENT_MATH_DIAGNOSTIC.json`.
- **40 PASS / 40 FAIL**. Each of 8 sessions: FAIL 30-unit syringe rendered scale; FAIL 50-unit syringe rendered scale; FAIL capacity invariance; FAIL unsupported IU input yields medication mass/preparation recipe; FAIL negative amount yields preparation recipe. PASS 100-unit syringe consistency; PASS mg/mcg equivalence; PASS empty/zero-volume input rejection; PASS no page exceptions.
- **This is a CONFIRMED SAFETY-QA FAILURE**, even though the diagnostic process exits successfully to preserve evidence and let a docs-only PR be reviewed. Do not mark calculator accuracy or App Store readiness PASS.
- Prior regression PASS same run: browser baseline 8/8, Check-In 8/8, Protocol 8/8, vial allocation 48/48; mobile form workflow 40061025531 PASS. These are not clinical/physical-iPhone tests. No production code/data mutation or deployment.

### v0.9.7 Log Dose on post-iOS-QA latest main — AWAITING rerun (2026-10-24)
- Prior v0.9.7 PR #35 source passed real Log Dose 40/40 browser flows, mobile, Check-In, Protocol, vial safety; but new main now includes `tools/audit-measurement-math.mjs` with 40 expected calculator diagnostic FAIL cases, and all must be preserved. Rerun complete source-aligned full-app DEMO/LIVE, 8 real form cases, and mathematical diagnostics on new branch.
- Status: new rebased test PENDING. Do not claim medical calculator PASS: wrong 30/50 U-100 syringe unit rendering, size-dependent rendering, missing IU dimensional qualifier, negative input are unresolved. Actual iPhone native testing and public v0.9.7 Pages unverified.

### v0.9.7 v0.9.6 bug reproduced, correction merged (2026-10-24)
- **PASS automated** `40061915470` on PR #38 source: 8 LIVE/full DEMO configurations × 5 real form workflows each (40/40): 2mg confirm/3mg edit original vial exact stock + no duplicate IDs; 7mg insufficient allocation rejected without record or vial mutation, 0/-1 rejected; explicit two-source 1.5+2.5mg one record; prepared-source dose no second vial deduction; Open Sealed Vial retains note/dose draft without stock write. 48 vial-core, 8 Check-In and 8 Protocol/browser suites PASS; mobile `40061915446` PASS. Source package CRC and DEMO ZIP byte parity validated. Physical iPhone manual Log Dose confirmation, native keyboard, real history import/export remain NOT TESTED.
- **Calculator diagnostic** `Nexus_v0.9.7-beta_MEASUREMENT_MATH_DIAGNOSTIC.json` still 40 PASS/40 FAIL in eight settings; test infrastructure PASS must not be misinterpreted as calculator-safety PASS. Explicit named failures remain 30/50 unit mismatches, syringe-size invariance, unsupported IU recipe, negative input. Medical release gate blocked.
- **Public postmerge v0.9.7 Pages verification** NOT TESTED until PR-observable remote 16 file parity; v0.9.6 prior Pages verification does not automatically prove v0.9.7 deployed.

### v0.9.7 public Pages source parity — PASS on actual HTTPS (2026-10-24)
- GitHub Actions `40062278673`, artifact `12547383562/Nexus_PAGES_REMOTE_CHECK_PR.json`, `verified:true`, `smoke_only:false`, exact 16 files served at `https://deidrajw.github.io/Peptide-Tracker/` match source v0.9.7 checkout. One attempt. GitHub app `main` merge `2a27f15`, docs-only source didn't change web-app bytes. Mobile `40062278638` PASS.
- **Not Tested:** physical iPhone/PWA cached version, actual iOS keyboard, VoiceOver, full clinic review. **Failed known calculator diagnostics remain 40/80**, despite independent Log Dose UI 40/40 PASS.


### v0.9.8 Combo Dose picker — PROPOSED automation/acceptance, status PENDING (2026-10-24)
- Newly coded browser suite `tools/validate-combo-picker.mjs`: fictional 50 tracked compounds, 224px bounded list, search Test Compound 49 / 50, two selections and corresponding dose inputs, amount 1.25 retained across second selection, notes/date retained through favorite, separate labeled favorite deletion control; 320px/390px light/dark, LIVE local/isolated full-app DEMO (8 cases). **NOT TESTED until workflow result confirmed.**
- Protected gates: existing Check-In date/mood/symptoms/supplements; Protocol bottom sheet; 48 vial accounting assertions; 40 real Log Dose confirm/edit/multi-vial/insufficient/prepared-source workflows; mobile forms; full-app DEMO storage isolation and source CRC; no production writes. New UI manual iPhone scroll/keyboard/VoiceOver, long favorites list and actually confirming combo dose still NOT TESTED from new suite; do not call these PASS without additional evidence. Separate original v0.9.7 measurement calculator remains 40 PASS/40 FAIL; medical release approval BLOCKED independently.

### v0.9.8 Combo picker — actual synthetic/browser evidence (2026-10-24)
- **PASS** Actions browser release run `40067532927`, 8/8 LIVE-local plus FULL isolated DEMO in 320/390px light/dark: 50 fictional tracked compounds, capped internal scrolling, search Test Compound 49/50, checked count/amount fields updated, entered 1.25 amount retained when another compound selected, notes and date survive favorite switch, separate accessible favorite delete control, no page exceptions. Artifacts `Nexus_v0.9.8-beta_COMBO_PICKER_QA.json` and full source-aligned standalone DEMO.
- **PASS** same Actions run for release/browser baseline 8, Check-In 8, Protocol sheet 8, vial-core 48, Log Dose real browser full transaction 40, demo isolation + archive source parity; mobile form regression `40067532954` SUCCESS. Both LIVE and DEMO ZIPs CRC-valid and standalone DEMO equals offline ZIP root index.
- **FAIL KNOWN (SEPARATE)** baseline measurement calculator 40/80 synthetic assertions still fail (30/50 unit scale, unjustified IU, negative amounts), no release/medical clearance. **NOT TESTED** actual physical iPhone Safari native picker/keyboard/VoiceOver, 100+ compounds beyond 50, actual manual confirmation of Combo Dose with long favorites list, public Pages v0.9.8 deployment until independent 16-file remote parity.

### v0.9.8 deployed release validation (2026-10-24)
- PASS on merge-source app tests [40067532927](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532927): 50-fictional-compound Combo picker 8/8 variants across 320/390px light/dark LIVE local and full DEMO, bounded list/search/2 compound selections, amounts/date/notes survive, favorite select/delete separate and no browser exceptions; baseline browser 8/8, Check-In 8/8, Protocol bottom sheet 8/8, vial core 48, real Log Dose full form 40; PASS mobile pre-merge `40067532954`. Source-identical full-app DEMO / LIVE ZIP packaging, archive CRC verified.
- PASS public GitHub Pages production **exact 16/16 source bytes** on merger `253544b`, Actions [40068084296](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068084296), artifact #12550490662; independent Pages deployment workflow `40068083410` SUCCESS and main postmerge mobile `40068084355` SUCCESS.
- FAIL KNOWN SEPARATE: 40/80 measurement-math synthetic diagnostic assertions remain failing; not medical clearance. NOT TESTED: real iPhone installed-home-screen stale cache/keyboard/VoiceOver, larger than 50 compound libraries, long native favorites list, user production data or manual real dose confirmations. Next UX regression gate: Add Kit searchable selector for library/custom/blend flows, preserve underlying kit-vial historical bookkeeping.

### Proposed v0.9.9 Stash Actions regression matrix — 2026-10-24 (NOT TESTED until CI)
- New `tools/validate-stash-actions.mjs` in actual browser: 8 combos 320/390 dark/light × LIVE-local/full isolated DEMO; open standard kit shows finish/add-to-open/restock/outflow/edit/Intel/history/prepare/finish kit/delete; sealed standard hides open-vial-specific actions, allows open and history; stored blend renders own ellipsis, retains blend Edit/delete and must not show standard finish or prepare; opening sheets doesn't modify inventory; row target 44px+; details disclosure visible.
- Protected screens/tests to rerun: Check-In, multi-select supplements/mood/notes; Protocol sheets; Log Dose full-form 40 cases (insufficient stock, edits, multi-vial, prepared), vial-core 48, Combo Dose 50-compound 8, full-app DEMO isolation, root-index LIVE ZIP/16 files parity; live postmerge Pages parity; actual iPhone Safari/Home Screen keyboard safe area and VoiceOver. **ALL STATUS PENDING** on PR #44 until actual logs verify. Separate existing calculator diagnostics 40 FAIL of 80 remain unvalidated; do not label medical calculations PASS.

### v0.9.9 deployed Stash Actions — actual evidence 2026-10-24
- **PASS browser automated** [40069652295](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40069652295): new Stash Actions test 8/8 local LIVE/isolated FULL DEMO × 320/390 dark/light, open standard shows 10 mapped actions, stored hides open-specific, blend uses own Edit/no standard Prepare/Finish, modal opening leaves canonical supply array intact, details open from sheet, touch target >=44px, no exceptions; complete full-app DEMO offline byte match and LIVE ZIP 16 files CRC-valid. Protected general browser 8, Check-In 8, Protocol 8, vial core 48, Log Dose 40, Combo 50-compound 8 all PASS; mobile run `40069652194` PASS.
- **PASS public deployment** 16/16 source files exact [40069938848](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40069938848) merged `704fdb16`, deployment [40069938543](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40069938543) SUCCESS; postmerge mobile [40069938840](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40069938840) PASS.
- **FAIL separate known calculator math** 40/80 diagnostic assertions on v0.9.9 source; clinically unsafe to assume validated. **NOT TESTED** physical iPhone Safari/PWA keyboard, VoiceOver, live user saved inventory, actual long-list focus, native safe area. Next protected UX change: card status/count and progress consistency for sealed standard kits versus blends; no fake consumption bar, do not change canonical totals.

### v0.9.10 Stash CARD browser acceptance — PENDING (2026-10-24)
- New actual test `tools/validate-stash-cards.mjs`, 8 synthetic LIVE-local/isolated FULL DEMO cases × 320/390 dark/light: standard sealed kit total and "No vial currently open" no fake bar; open GHK-Cu 30mg/50mg progress 60% and kit total 80mg with one sealed 50mg; stored fictional blend no fake 100% progress, still has v0.9.9 action sheet; 44px history disclosure expands; no overflow/browser exceptions. Only mark PASS after CI evidence.
- Protected gates: prior Stash actions (8), Check-In (8), Protocol (8), vial core (48), Log Dose (40), Combo 50-compound (8), source/demo exact parity and ZIP integrity. Physical iPhone Safari/Home Screen, keyboard, contrast/VoiceOver NOT TESTED. Separate pre-existing measurement calculator diagnostics 40 FAIL/80; no safety sign-off.

### v0.9.10-beta actual Stash CARD deployed regression (2026-10-24)
- **PASS** GitHub Actions [40071176740](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071176740): 8/8 fictional standard-sealed/open and blend-unopened cards across LIVE-local/isolated full-app DEMO × 320/390 dark/light. Tested canonical 80 mg kit remaining (30mg open + 50mg sealed), per-open-vial 30/50=60% bar, no bar for sealed and unprepared blend, expanded Details/History and retained v0.9.9 actions button. Source/archives integrity PASS: 16 app files, zip CRC, demo HTML byte equality.
- **PASS** protected baseline browser 8, Check-In 8, Protocol 8, vial core 48, Log Dose full UI 40, Combo Dose 50-compound 8, Stash Actions 8; postmerge mobile main [40071480104](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071480104) SUCCESS. **PASS** public production Pages exact 16/16 source bytes [40071479984](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071479984), Pages deployment [40071480385](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071480385) SUCCESS.
- **NOT TESTED** physical iPhone Safari/Home Screen, actual user's localStorage records, VoiceOver/dynamic type/native safe-area, keyboard and manual long histories. **FAIL KNOWN SEPARATE** measurement calculator diagnostic 40 FAIL/80 (PR #40 remains unmerged), clinical signoff blocked.

### v0.9.11 Chevron regression — PENDING verification
- New browser test `tools/validate-chevron-unification.mjs`: eight fictional 320/390 × dark/light × LIVE local/isolated full DEMO scenarios, checking a single indicator on Today, Protocol, Stash native disclosure, minimum 44px controls and functional expansion. Await full CI evidence. Protected Stash card/actions, Check-In, Protocol, Log Dose, Combo and vial-core suites must also pass.
- Physical iPhone/VoiceOver NOT TESTED. Preexisting separate clinical measurement calculator diagnostics remain 40 FAIL of 80. Do not mark this release deployed until source-parity proof.

### v0.9.11-beta chevron release — verified October 24, 2026
- **PASS automated:** Unified Chevron test 8/8 LIVE-local/isolated complete DEMO × widths 320/390 × light/dark, actual Today and Protocol expansion, one CSS indicator, minimum 44px and no authored arrows. Browser run `40107079456`. Protected general browser 8, Check-In 8, Protocol 8, vial-core 48, Log Dose UI 40, Combo picker 8, Stash Actions 8, Stash Cards 8 all PASS. Source artifact #12564833867: complete 16-file root LIVE ZIP and full-app isolated DEMO byte parity, CRC PASS.
- **PASS deployed source:** Pages 16/16 identical to merge `1ef9337f` from run `40107472550`; deployment `40107472341` and mobile `40107472461` SUCCESS.
- **NOT TESTED:** real iPhone Safari/PWA, actual user's localStorage, VoiceOver, physical safe-area/keyboard. **FAIL KNOWN SEPARATE:** calculator math diagnostic 40/80. Next regression: Combo Dose blend-only ingredient exclusion while retaining standalone tracked compounds and previous combo drafts/presets.

### v0.9.12-beta candidate: Combo Dose + Needs attention (NOT TESTED until CI evidence)
- New `tools/validate-blend-picker.mjs` uses entirely fictional isolated state in LIVE-local/FULL APP DEMO × 320/390 × dark/light: an ingredient solely within a blend absent from Combo picker, independently stocked and historically logged ingredient offered, ordinary compound still offered, Nasal excluded, explicit bordered internal scroll panel and scroll indicator, Canadian Favourites label, saved favourite still selectable, Today Needs attention summary no duplicate `›`. Must PASS 8/8 before release.
- Protected: Stash Card 8, Stash Actions 8, previous Combo 50-library 8, Check-In 8, Protocol 8, Log Dose UI 40, vial core 48, chevrons 8, root LIVE ZIP 16 and standalone complete DEMO/offline index parity. Physical iPhone/VoiceOver NOT TESTED. Separate clinical calculator diagnostics pre-existing 40 FAIL/80; no clearance implied.

### v0.9.12-beta browser and public regression evidence, October 24 2026
- PASS blend-only ingredient excluded; independent kit and historical compound retained; saved favourite and nasal filter retained; clearly bordered scroll list and Canadian wording. 8/8 browser environments 320/390 dark/light LIVE-local/isolated full-app DEMO. New validate-blend-picker.mjs CI 40109066287 SUCCESS.
- PASS protected Combo 50 library, Check-In, Protocol, Log Dose 40, vial core 48, Stash Actions, Stash Cards and chevrons. Complete LIVE 16-file source ZIP CRC pass, full isolated DEMO and offline ZIP index exact equality artifact 12565752103.
- PASS GitHub Pages exact 16/16 source match against merge 1253b2c2 run 40109401930; deployment 40109401334 and post-merge mobile 40109401939 SUCCESS.
- NOT TESTED actual iPhone Safari, PWA cache, VoiceOver or user's live records. FAIL pre-existing Measurement Calculator 40/80 diagnostics. Next UX regression Stash nested detail reorganization preserving all vial history and actions.

### v0.9.13-beta Stash detail panels QA — PENDING actual CI evidence
- New `tools/validate-stash-panels.mjs` runs full fictional app LIVE-local and standalone isolated DEMO at 320px/390px light/dark, tests Overview/Vials/History accessible tabs, Home key, selected/hidden panel, visible source history, no nested vial/dose chevrons, 44px touch target, and `state.supplies` unchanged by view switching. Existing Stash Cards/Actions, 50+ Combo, blend-only picker, Log Dose 40, vial accounting 48, Check-In, Protocol and chevrons must PASS before merge. Physical iPhone NOT TESTED. Calculator diagnostic separate 40 FAIL of 80.

### v0.9.13-beta verified Stash panels (October 24, 2026)
- **PASS automated** release source CI 40110883172: 8/8 synthetic Stash panels at 320/390 dark/light local LIVE/entire isolated DEMO. Checks new Overview/Vials/History tab selection and hidden states, keyboard Home, 44px targets, no nested dose-history disclosure, no mutation of `state.supplies`, prior card figures and actions. Also protected Check-In, Protocol, Stash Cards/Actions, Combo search 50, blend ingredient eligibility, 40 Log Dose flows, 48 vial safety assertions and single chevrons PASS.
- **PASS package integrity** 16-file root-index LIVE ZIP CRC, standalone complete fictional DEMO HTML byte-identical to offline DEMO ZIP index from Actions artifact 12565814124.
- **PASS public source verification** GitHub Pages 16/16 bytes match merge SHA `895d6bfd`, run 40111254674; deployment 40111253972 and postmerge mobile 40111254716 SUCCESS.
- **NOT TESTED** physical iPhone Safari/Home Screen, VoiceOver, actual private localStorage histories and long scroll/keyboard. **FAIL KNOWN SEPARATE** Measurement Calculator diagnostic 40/80, PR #40 still review only. Next protected UX audit: Plans action/status/Intel and disclosure hierarchy.

### Candidate v0.9.14 Plans regressions — PENDING
- New `tools/validate-plans-hierarchy.mjs`: Research header no Intel crowding, secondary Intel accessible, ellipsis 44px and existing Edit handler, Goal 44px detail expands, Shopping manage retained; eight local LIVE/full-isolated-DEMO 320/390 light/dark runs. Await CI evidence. Protected Stash v0.9.13 panels and v0.9.12 Combo, log, vial, Protocol and Check-In must continue passing. Physical iPhone NOT TESTED, preexisting calculator diagnostics 40 FAIL/80.

### v0.9.14 Plans release evidence — 2026-10-24
- **PASS** [40113456056](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113456056): Plans new fictional browser 8/8 live-local/isolated full-app DEMO × 320/390 × light/dark; Research Intel not in header but retained as separate action; management ellipsis >=44px opens Edit; Goal View details >=44px and expands, shopping manage preserved. Full source LIVE ZIP 16 files CRC and DEMO HTML/offline ZIP byte equality PASS. Protected browser Check-In, Protocol, Log Dose 40, vial core 48, Combo 50, blend-only selection, Stash Card/Actions/Panels and chevrons PASS. Branch mobile [40113456030](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113456030) SUCCESS.
- **PASS production** Pages 16/16 file bytes equal `529f81ea` [40113805546](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113805546), Pages [40113804812](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113804812), postmerge mobile [40113805479](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113805479) all SUCCESS.
- **NOT TESTED** real iPhone Safari/Home Screen, voiceover, production user-specific plans and keyboard. **FAIL known separate** Measurement Calculator diagnostic 40/80; no clinical signoff.

### v0.9.15-beta Plans outline icons — awaiting release QA (2026-10-24)
- NOT TESTED yet: at 320/390, dark/light, LIVE-local and complete fictional isolated DEMO, management SVG visibly centered, 44px target, Edit/Delete action still opens; Compound Intel shows a single right navigation outline arrow and original navigation still works; Goals View details toggles and other-goal/shopping management retained. Re-run protected v0.9.13 Stash tabs/action/data nonmutation, v0.9.12 Combo 50+ & blend-only selection, Check-In, Protocol, Log Dose 40, vial core 48 and chevron suite. Validate exact-source 16-file LIVE ZIP and complete isolated full-app DEMO/offline HTML equality. Physical iPhone NOT TESTED. No synthetic Pass claims.

### Cloudflare primary host transition gates — NOT TESTED (2026-10-24)
- Confirm Cloudflare Pages branch=main, no stale output directory, version and 16 application files match target GitHub SHA; verify theme/navigation, update lifecycle/cache, 320/390 iPhone Safari/PWA.
- With disposable fictional data only, verify full backup export on old origin, controlled import on new origin, count/shape/date-specific Check-In, supplements, history, protocols, Stash/vials and Combo Dose intact, with no old-origin overwrite. Real user migration is NOT TESTED / not approved until separate explicit confirmation. GitHub Pages retained fallback. Calculator diagnostics pre-existing 40 FAIL/80 separate.

### Icon integration candidate validation matrix — 2026-10-24
- Uploaded image blobs verified present main: PASS. Index iOS/PNG references and builder packaging implemented: CODED, automated browser test NOT TESTED until CI. Required QA: exact 180/192/512 PNG MIME/size; iPhone Safari icon display and cache refresh; standalone DEMO in-memory isolation and inline icons; LIVE ZIP icons and paths; 320/390 both themes Check-In/Stash/Combo/Plans/vial; Cloudflare commit and asset parity. Physical iPhone NOT TESTED; calculator 40/80 known baseline separate.

### Today disclosure pilot — required regression
- At 320/390 px and both themes: Coming up opens upcoming rows and See all; Daily tracking opens Check-in/Supplements/Weight/Nutrition and edit/log; This week toggles week details and preserves Full report, week strip and totals; alert Needs Attention retains one clear chevron; no duplicate pseudo chevron, label clipping, or lost accessible control; keyboard open/close; protected Stash/Calendar/Protocol/Combo Dose. Full browser CI pending, physical iPhone NOT TESTED, calculator diagnostic pre-existing failures separate.

### PR #62 extra chevron screenshot regression — 2026-10-24
- Visual FAIL on pre-fix candidate (user screenshot): 'View tracking' still displayed chevron due to app-wide pseudo-element. Fixed CSS on branch, result NOT TESTED until rerun. Add computed-style assertion for `details.nexus-today-details.nx-today-text-disclosure > summary::after` (`display:none`, `content:none`) in LIVE and DEMO at 320/390 dark/light. Test native expand/collapse, keyboard/VoiceOver, Needs Attention chevron preserved; ensure Stash history and filter/sort chevrons are unaffected.

### 2026-10-24 — Today icon QA gate corrected
- Full workflow 40127200163 FAILED at legacy `tools/validate-chevron-unification.mjs` assertion requiring a visible chevron on Daily tracking, contradicting user-approved explicit View tracking label. Earlier browser, data and Stash assertions passed before this point. Corrected automated expectations to assert the labeled Today disclosures have NO generated chevron; remaining generic Protocol/Stash chevron tests preserved. Re-run on new head required; do not mark release passed or merged until success.

### Rebased Stash consistency candidate — 2026-10-24
- Required: compound vs blend status/ellipsis header parity, exactly one ellipsis, kit action row no overflow, Sort chevron 320/390 light/dark no clipping, full sorting choices intact. Protected: Stored badge activation, kit management, reconstitution and Prepare, blended dose logging, histories, vial deductions, Check-In, Today chevron text-only release. New branch automated and physical iPhone results NOT TESTED; older PR #61 CI did pass but is not evidence for rebased head.

### Informational empty-state audit candidate — 2026-10-24
- Required explicit tests: unopened blend with sealed stock => VIAL & INVENTORY has readable 'No blend vial opened yet' explanation without an enabled blend dose control; prepared/open blend => existing Log blend dose action and no placeholder; regular sealed compound => Open a vial/Add vials actions intact; completed/empty regular kit => appropriate explanatory state; nonempty categories unaffected. 320/390 both themes, VoiceOver role=status, menu scroll/close, no duplicate labels, Check-In/Calendar/Protocol/Stash and vial math protected. All new branch tests NOT TESTED until CI; real iPhone NOT TESTED.

### Connected Goals Release A planned checks — 2026-10-24
- Protocol All/Not started(Draft/Planned/Ready)/In progress/Paused/Completed filter counts, empty filter message/reset, existing status/phase/activation/ellipsis/paused schedule unchanged. Saved Goal edit/rename/delete and protocols' legacy goalId template semantics preserved before explicit relinking. Check-In one-date and symptom association, Journal, Log Dose source/vial math, Stash, Calendar Month, Supplements and backups protected. Source+FULL DEMO 320/390 both themes, keyboard and VoiceOver. ALL NOT TESTED: specification only. Separate calculator numeric safety reviews remain blocked.

### Release A Protocol filter required QA (candidate)
- Not started shows draft/planned/active (ready) but does not rewrite their status; In progress/Paused/Completed/Archived exact; All restores every record; active first log, expand phase details, manage ellipsis, create/edit/delete, pause/resume, reminders and schedule no regressions. No-match state with Show all functional. Verify per theme and 320/390 on standalone full DEMO and live-source browser. Check-In single/date, Stash vial math, Log Dose drafts/allocation, Calendar, Plans links and calculator PR #67 separate. No test Pass claimed yet; real iPhone NOT TESTED.

### Connected Goals A2 linkage candidate required checks
- New protocol goal template selection still works when no saved goals. Personal goal selector optional; select, save draft/activate, reopen edit, change/clear link, refresh, rename source goal and see updated card; delete source goal leaves explicit unavailable reference not random match; duplicate goal names must not cross-link. No change to previous `goalId` template, paused/status/schedule, dose source/history, Stash vial math, Check-In date uniqueness. 320/390 light/dark LIVE/full isolated DEMO and 44px accessible picker. All newly scoped checks NOT TESTED until browser tests.

### Goal detail A3 candidate required regression
- Open modal from active and other goals, switch three tabs, accessible close and 44px targets, accurate link-by-ID including duplicate names, renamed/deleted goals, missing metrics, missing protocols, and empty Activity; ensure no fabricated progress or writes. Check Plans ellipsis/edit/delete, Protocol builder associations, Check-In one/date, dose history, Stash, Calendar. Test LIVE + isolated full DEMO at 320/390 in both themes. All NEW tests NOT TESTED; physical iPhone NOT TESTED.

### 2026-10-24 — A4 focused QA
- New `validate-plans-hierarchy.mjs` assertions exercise saving numeric source lb with latest 185 vs baseline 200 target 180 => 75%; switch and save subjective 4/5, two milestones, exploratory; confirm weight log length and notes preserved in all 8 browser environments. Expected but NOT TESTED until CI. Additional unit mismatch, equal baseline/target, dates invalid/future and switching away/back require follow-up testing.

### A5 evidence QA (all NOT TESTED)
- Goal with no linked symptom shows opt-in guidance; select existing symptom and save/reopen; Goal Activity displays only matching dates and recorded intensity; no irrelevant symptoms or imported notes; remove selection and keep Check-In data unchanged, edit original record propagates; 320/390 light/dark LIVE and full DEMO. Protect one-Check-In-per-date, symptoms and associations, Supplements, Protocols, Calendar, Log Dose and vial math.

### 2026-10-24 — A6a browser regression assertions (PENDING execution)
- Planned LIVE/full isolated DEMO × 320/390 × dark/light: matched Check-In symptom shows nonempty same-entry reflection, date and original ID navigation; unrelated symptom/date note and later update absent; edit existing original daily note and repaint changes Goal Activity; blank note disappears; no Goal text copy or dailyLogs mutation. Existing A5 symptoms/intensity and A4 progress, all Check-In/history, Protocol, Stash, dose/inventory, Calendar and supplements protected by their established suites only where actually executed. Physical iPhone, VoiceOver and published Cloudflare parity NOT TESTED.

### Combined UI refresh regression candidate — NOT TESTED until CI
- Research title dominates Intel; status/ellipsis align and are distinct; 44px action remains; edit/delete/status and Intel intact. Journal dropdown All/General/compound filtering, keyword search, no horizontally scrolling chip rail; original daily/dose/stash jump and note count intact. Check-In changes 7/14/30 day switching, mood and individual symptom focus, missing-day denominator and original date inspection without nested scroll, close behavior and no state writes. Visual Stash, Goals, Protocol ellipsis parity at 320/390 dark/light; Check-In, supplements, schedules, inventory math and all data preserve. Source-identical full-app DEMO/LIVE packages and real iPhone separately required.

### 2026-10-25 — Card-header parity targeted follow-up (PENDING)
- Screenshots show FAIL acceptance after #80: all four card headers still have title left with status pill next to large or differently rendered ellipsis at right. Required LIVE/full DEMO × 320/390 × dark/light visual and DOM checks: status below name in same left stack; ellipsis same SVG with 44×44px target, distinct surface, no overlap on long names; clickable Stash status toggle remains working; Goals edit/menu/View goal, Research Intel/menu, Protocol statuses/menu and scheduling unaffected. Physical iPhone retest NOT TESTED for candidate; independent calculator diagnostic remains held.

### 2026-10-24 — Avatar and future release infrastructure test plan (NOT TESTED)
- Candidate: no-photo shell uses SVG instead of letter, profile editor and avatar removal use same SVG; uploaded avatar remains unchanged; label/keyboard contrast 320/390 × light/dark; no profile data writes except existing explicit photo change, backup/state unchanged. Future gated tests: once-only popup per VERIFIED published release, later button, version/three output parity, never marks draft as published, onboarding existing-user safety, import schema preview/export/consent/rollback, notification permissions on use only, exact-source full LIVE/isolated DEMO and native store declarations. Physical iPhone not tested.

### 2026-10-25 — Release manifest foundation new gates (PENDING CI)
- Must pass: generated three channel note outputs exactly match release/release.json, builder refuses stale notes or mismatched index title/version, ordinary app LIVE/isolated DEMO builds retain all pages and scripts; old numeric CHANGELOG and saved `lastSeenChangelog` unchanged; draft/unverified release does not show user popup. Other protected Check-In/Protocol/Stash/Calendar/Dose flows remain governed by existing suite. No privacy permissions invoked. Real iPhone and Cloudflare parity NOT TESTED.

### 2026-10-25 — New publish gate tests (PENDING latest CI)
- Eight simulated LIVE/isolated complete DEMO 320/390 light/dark test cases now verify NEXUS_RELEASE version and unverified status no popup; simulated published release shows modal, Later leaves it unseen, Got it writes version-specific key and suppresses repeat; restores isolated test-local key/status. Generator check enforces release manifest as source for three outputs and runtime embedded metadata, builder crosschecks page title. Confirm no effects to onboarding, records, backup, or numeric legacy history. Physical iPhone and real publication pending.

### 2026-10-25 — Onboarding first-run new tests (PENDING)
- Verify welcome on 320/390 light/dark, local browser storage/cross-device/no-sync explanation, Start Fresh optional preferences and step navigation, Restore picker validation malformed/oversized JSON, file record-count preview, cancel/consent, existing-data blocking, pre-import snapshot, save failures/rollback, and existing users bypass onboarding. Verify version=manifest=title=runtime=in-app/Apple/Google generated notes, no announcement for UNVERIFIED status, full LIVE/full DEMO isolation. Preserve Check-In/Supplements/Protocol/Stash and dose history. Real iPhone/VoiceOver NOT TESTED.

### 2026-10-25 — Getting Started visual follow-up (NOT TESTED yet)
- New 320px and 390px light/dark LIVE/full DEMO assertions: exactly four feature cards with same outline SVG treatment and nonempty contextual route subtitles, 48px guide SVG/button, Log Dose label/route, no emoji replacement regression; existing onboarding step flow and import safeguards preserved. Physical iPhone acceptance and Cloudflare source parity pending. Calculator #67 hold.


### 2026-10-24 — v0.9.18-beta unified candidate validation matrix
- Source-level changed surfaces: Settings → Privacy & Data; Settings → Backup & Restore (picker, preview, Cancel, typed RESTORE, recovery copy), Dose Alerts disclosure, Settings/Calculator back actions, reduced-motion/focus; Dose Calculator numeric and U-100 invariant behavior.
- Required `tools/validate-recon-safety.mjs`: 5mg/2mL at 1mg equals 0.4mL; 200mcg equals 0.08mL; reject invalid/negative/nonfinite/zero, IU without potency, dose exceeding vial, syringe overflow and sub-display-level volume.
- Required blocking `tools/audit-measurement-math.mjs`: 30/50/100-unit U-100 calculated mark must be the same, mg↔mcg equivalence, no generic IU, negative, blank, zero denominator, no browser errors; × LIVE/full DEMO, 320/390 light/dark.
- Required `tools/validate-trust-ui.mjs`: four Privacy disclosures, entry in Settings, guard on Import, typed restore disabled until exact confirmation, Cancel unchanged, fictional restore and local pre-restore snapshot; 320/390 × both themes in standalone in-memory DEMO.
- Protected suites: Check-In single record/date, symptoms, notes and edits; Supplements search and day-specific history; Log Dose/Combo source, drafts, multi-vial deductions, Stash, Calendar month, Weight, Nutrition, Protocol/Goals/Plans and history.
- No fake PASS: latest-head PR #94 CI and artifact evaluation must be obtained. GitHub Pages comparator is NOT proof of primary Cloudflare parity. Real iPhone, VoiceOver and store submission NOT TESTED.

### 2026-10-24 — Evidence update for v0.9.18-beta PR #94
- AUTOMATED PASS: release-artifacts workflow run 40158486843 (head `c169db6`), including JS syntax, generated release artifacts, browser suites in 8 LIVE/isolated DEMO × 320/390 × light/dark configurations, 80/80 math diagnostic assertions and trust/typed-restore UI checks. Mobile form workflow run 40158486825 also passed. Candidate and merged-main 16 application-file blob SHAs match.
- VERIFIED PACKAGE STRUCTURE: artifact 12584823539, root `index.html`, 3 CSS, 12 JS, 4 icons; standalone full-app DEMO + offline DEMO ZIP present and fictional-storage isolation specified in build.
- HOST VERIFICATION: pre-merge Cloudflare comparison FAIL due to mismatched `index.html` hash; **post-merge Cloudflare unverified**, do not promote this to PASS from source smoke tests.
- NOT TESTED: independent physical iPhone and VoiceOver, all 120 function-indexed UI surfaces by human visual pass, actual App Store/Play submission, final processor/privacy declaration. Calculator math PASS is conversion assurance only, not a clinical dosage certification.

### 2026-10-24 — Cloudflare release parity observed and What's New re-publication gate
- PASS (automated, remote): v0.9.18-beta 16 hosted HTML/CSS/JS byte hashes equal verified merged app source (run 40159182188, `Nexus_CLOUDFLARE_PARITY.json` `verified:true`); source build and 8 browser modes PASS; mobile form regression run 40159182258 PASS.
- PENDING: manifest/runtime `published` follow-up must pass generated note parity and 8-browser publish-gated popup tests: show once after onboarding, Later does not acknowledge, Got it stores isolated version key, no duplicate old numeric changelog, no state corruption. Then verify live Cloudflare bytes again.
- NOT TESTED: real iPhone/VoiceOver, independent store submission, all 120 function-indexed UI surfaces individually reviewed visually.

### 2026-10-24 — Published manifest regression test correction (CANDIDATE)
- PR #97 run 40159568404: PASS prior sections (source, generate-release, artifact, 8-mode privacy, Check-In, Protocol, Stash, Combo, chevrons); FAIL at `tools/validate-plans-hierarchy.mjs` because its assertion hardcoded `publicationStatus==='unverified'` after verified publication. **No merge.**
- Updated assertion to match canonical `release/release.json.publication.status`; still explicitly verifies unpublished releases cannot auto-prompt, while the existing scenario tests published Later vs Got it and isolated acknowledgement. Requires fresh latest-head full CI PASS before merge.

### 2026-10-24 — Final published web source regression evidence
- **PASS (automated and remote):** post-published-flag GitHub Actions run 40160165392, root HTML/3 CSS/12 JS all 16 remote Cloudflare source hashes match expected merged application bytes (`Nexus_CLOUDFLARE_PARITY.json` `verified:true`). Mobile form run 40160165348 PASS. Full LIVE and fictional full DEMO packages and 320/390 light/dark browser regression PASS. Published popup Later/acknowledge and old changelog nonduplication covered by release suite; no data migration.
- **PASS (earlier independent numerical evidence):** measurement conversion diagnostic 80 PASS, 0 FAIL; invalid inputs/IU/multi-syringe guards verified mathematically, not clinically.
- **NOT TESTED:** physical iPhone, VoiceOver, complete human 57/120 visual surfaces, external processors and public privacy declaration signoff, native iOS/Android and Apple/Google store review.

### 2026-10-25 — v0.9.19 blend and Protocol mobile regression (PENDING)
- Required: fictional Deadpool-like blend has two sealed vials; Open vial enters BAC=2mL, expiry=30d and notes/date, marks one open and one sealed, does not duplicate inventory. Single blend 3mg log creates one blend dose and kit ledger entry, **zero** new component dose logs; Today picker shows blend once and hides ingredient-only choices, preserves independently taken constituent. Existing old dose/history unchanged; insufficient inventory rejected.
- Protocol 6/6 Review name field never clips at 320px/390px with iOS keyboard; Phase +/- and Dose/Rest buttons have consistent >=44px tap targets, prevent warping, dark/light. Protected Check-In, Supplement, Stash, Calendar, Protocol/Goals/Plans, full LIVE/isolated DEMO and version manifest suites must pass. Real iPhone fixes NOT TESTED until deployed and user validates.

### 2026-10-25 — v0.9.19-beta application-source QA and Cloudflare verification
- PASS (AUTOMATED): candidate release workflow 40161722598 + mobile forms 40161722564. Fictional isolated blend 2 sealed → 1 open with BAC/expiry/notes, single 3mg dose under blend name, no constituent logs, 31mg overdraw rejected, finish vial records 27mg outflow while preserving 1 sealed vial and 30mg remaining. Full app × 320/390 light/dark; math diagnostic 80/80; Check-In, Protocol, Stash, Log Dose, Combo, Calendar protection.
- PASS (HOST): 16/16 Cloudflare index/3 CSS/12 JS source hashes in 40162047192 against PR #100 merged implementation commit.
- PENDING: publication-metadata follow-up generated note/runtime parity, live re-verification and physical iPhone/VoiceOver/keyboard acceptance. Do not treat automated simulations as real iPhone tests.

### 2026-10-25 — Screenshot: light-mode What's New invisible CTA; hotfix QA pending
- User-observed FAIL: published v0.9.19-beta release modal primary control appears blank at bottom in light-mode iPhone screenshot. New browser gate tests foreground/background contrast >=4.5:1 and rendered 44px+ action bounds for both Later/Got it in 8 LIVE/full DEMO modes (320/390, dark/light). Gate NOT TESTED until CI.
- Every other screen, theme and nested bottom sheet text contrast: NOT TESTED as site-wide audit; follow-up surface sweep required. Physical iPhone post-fix NOT TESTED. PR #110 ongoing kit parity tests are separate.

### 2026-10-25 — Expanded source/browser contrast audit evidence
- PREVIOUS candidate 40165287614: all prior browser workflows and 8-mode publication contrast gate PASSED; 9-tab read-only scanner flagged 69 light/31 dark potential low-contrast nodes, **diagnostic counts only**, not measured individual failures (nearest-surface heuristic can misread translucent layers). Full WCAG signoff NOT claimed.
- Source-confirmed failures corrected in later PR #111 commits: dark --t4/--t5 readability, light t4/t5 on raised cards, Protocol New Protocol, published release buttons, white-on-lavender direct inline styles, and Calendar tiny numerical weight labels/today markers.
- Latest head: full 320/390 light/dark LIVE/full DEMO regression / primary Cloudflare parity / actual physical iPhone STILL NOT VERIFIED until run. Expanded sheet/modal text coverage remains OPEN; retain fail-closed release controls.

### 2026-10-25 — Contrast hotfix PR #111 merged, automated branch QA PASS
- PASS GitHub Actions workflow 40165612214: exact-source LIVE and isolated FULL DEMO generated; browser 320px/390px × dark/light × LIVE/DEMO; published What's New primary/secondary actions computed contrast >=4.5:1 and >=44px bounds; muted t3/t4/t5 against three surfaces >=4.5:1; preceding Check-In, Calendar, Stash, Dose, Combo, Plans, Protocol screens regression suites green.
- PASS mobile forms workflow 40165612207. Merged main squash `da18b2fb`; no storage key/schema mutation.
- NOT TESTED: real iPhone light/dark after correction, VoiceOver, all secondary modals and overlays with human AA/visibility signoff. Nine-tab diagnostic candidates not all validated; preserve Issue #112. New Cloudflare postmerge parity NOT YET VERIFIED.

### 2026-10-25 — Verified primary Cloudflare after v0.9.19 contrast patch
- PASS web host: PR #113 CI 40165897243 `Nexus_CLOUDFLARE_PARITY.json` verified:true, 16 identical remote entry files vs merged source, artifact #12588721468.
- PASS branch/browser: release 40165612214, mobile form 40165612207, 320/390 × light/dark × LIVE/full isolated DEMO, visible published Later/Got it computed foreground contrast >=4.5 and 44px targets, t3/t4/t5 neutral surfaces thresholds, existing protected Check-In/Log Dose/Calendar/Stash/Protocol suites.
- NOT TESTED: real physical iPhone post-fix, VoiceOver, every modal/control combination, true entire app WCAG AA. Heuristic 9-tab low contrast diagnostic has false-positive candidates and is not a full accessibility audit.


### 2026-10-25 — Production parity regression gate, source-only candidate
| Area | Acceptance | Current status |
|---|---|---|
| Version intent | Source `release/release.json`, `index.html` and manually entered version agree | CODED, NOT TESTED |
| Host parity | Production matches 16 exact app HTML/CSS/JS SHA256 values after merge; retry while Cloudflare deploys | CODED, NOT TESTED |
| Negative test | v0.9.20 candidate while production remains v0.9.19 must report mismatch, not pass based on older main | NOT TESTED |
| Protected app source | Safety PR changes workflow/script/docs only; no application files | TO VERIFY AT PR |
| Full application QA | v0.9.20 blend, KLOW, vial math, history, supplies, 320/390 themes, isolated full DEMO and LIVE ZIP | INCOMPLETE, DO NOT MERGE PR #110 |
| Physical iPhone | v0.9.20 real device before release acceptance | NOT TESTED |

### 2026-10-25 — Approved mobile hierarchy candidate test matrix
| Area | Acceptance | Status |
|---|---|---|
| Stash unopened / open / finished | No Prepare when no vial open, two/three equal actions; kit details and row ellipsis 44px usable | NOT TESTED |
| Log Dose ordinary/blend | Multi-vial mode still validates allocation and source, suggestion near site, no auto-change | NOT TESTED |
| Combo favourites | Many presets stay compact; load and Delete from management maintain exact saved semantics | NOT TESTED |
| Trends compound | Dedicated view; back restores compound list/search, one chevron per model disclosure | NOT TESTED |
| Today blend parity | Deadpool shares standard card and actions, not old rendering code | NOT IMPLEMENTED |
| Data | Check-In, history, KLOW, vial math, undo, localStorage unchanged | NOT TESTED |
| Release | Entire LIVE & isolated full DEMO build 320/390 both themes, physical iPhone, Cloudflare parity | NOT TESTED |

### 2026-10-25 — Physical preview follow-up checks
| Scope | Required evidence | State |
|---|---|---|
| Multi-vial button | Clearly readable/unclipped in 320px and 390px light/dark dose modal; existing multi-vial math untouched | CODED, NOT RE-TESTED |
| Per-vial ellipsis | 28px perceived box, full 44px tap target, focus visible, action sheet reachable for open/finished vial | CODED, NOT RE-TESTED |
| Remaining approved changes | User reviewed preview and accepted subject to two fixes; browser test confirmation on new head needed | USER ACCEPTED, AUTO QA PENDING |
| Blend Today-card modern parity | Same card renderer regardless of blend | OUTSTANDING |
| Full LIVE + isolated DEMO | Build and 320/390 both themes | NOT TESTED AT NEW HEAD |

### 2026-10-25 iPhone preview feedback
| Area | Evidence | Status |
|---|---|---|
| Log Dose multi-vial secondary action | User screenshot shows text compressed at 390px preview; branch CSS fix requires re-test | NOT TESTED after fix |
| Stash vial ellipsis | User screenshot shows oversized outlined 44px square; branch CSS keeps 44px hit area with 28px visual | NOT TESTED after fix |
| Other reviewed UI changes | User reports tested and good in preview; not a substitute for automated complete release QA | USER ACCEPTED |

### 2026-10-25 — Resolved cascade source; verification pending
| Area | Actual acceptance test | Current evidence |
|---|---|---|
| Log Dose Use multiple vials | Button `#toggle-multi` in full LIVE and isolated DEMO has computed padding >=12px vertical / >=20px horizontal, height >=48px, scrollWidth <= clientWidth+1 in 320/390 light/dark | CODED; latest CI PENDING |
| Previous fix | `.nx-dose-form button.nx-multi-vial-toggle` was overridden by ID-level `padding:5px 0!important` | ROOT CAUSE VERIFIED |

### 2026-10-25 — PR #119 release evidence
| Check | Evidence | Result |
|---|---|---|
| iPhone preview user acceptance | Explicit acceptance of corrected multi-vial padding and vial ellipsis, all other reviewed items | USER PASS (preview only) |
| Automated mobile form | Workflow 40212593190 on final PR head d57fbf | PASS |
| LIVE & isolated full DEMO browser/package suite | Workflow 40212593263 on final PR head d57fbf | PASS |
| Real production Cloudflare bytes | Need postmerge 16-file source hash parity report | NOT VERIFIED |
| Old blend Today-card expanded parity and app-wide divider audit | Not included in PR #119 | INCOMPLETE / separate PRs |


### 2026-10-25 — Hybrid visual preview regression plan (candidate PR #123)
| Check | Evidence | Status |
|---|---|---|
| All 12 JS modules source-matched to main | GitHub branch file fetch / no modified JS | SOURCE INSPECTION ONLY |
| HTML and four CSS stylesheets packaged | Builder updated for fourth stylesheet | CODED; CI PENDING |
| Fictional DEMO uses isolated in-memory storage; blocks external network | Existing `tools/build-release.mjs` DEMO bootstrap; preview copy also added | SOURCE INSPECTION; BROWSER NOT YET VERIFIED |
| 320/390 dark/light browser test, overflow, navigation and sheets | Playwright QA workflow added | NOT TESTED pending run |
| Check-In, supplements, Log Dose, blend, inventory, Protocol, Calendar and weight history | Protected JS source unchanged; no functional browser evidence yet | NOT TESTED |
| Real iPhone / dual-theme acceptance | User action required | NOT TESTED |
| Merge and primary Cloudflare | Prohibited until user approval | NOT MERGED / NOT DEPLOYED |


### 2026-10-25 — Browser evidence for source commit 3f3ff27
| Check | Result |
|---|---|
| Run 40233319212 build and release-artifact validation | PASS |
| Browser live/isolated DEMO at 320px and 390px, dark/light | PASS automated |
| Check-In, Protocol, Stash, Log Dose, combos, chevrons and math | PASS according to run logs; math diagnostic 80/80 is not clinical validity |
| Run 40233319183 mobile form regression | PASS |
| Light-mode text contrast diagnostic | 31 candidates over 9 tabs (some ~1.27:1), unresolved; no claim of WCAG AA |
| Physical iPhone review | NOT TESTED |
| Cloudflare parity against experimental branch | UNVERIFIED/EXPECTED MISMATCH; NO DEPLOY |


### 2026-10-25 — Hybrid visual depth feedback follow-up
| Check | Status |
|---|---|
| Actual selector `.tabbar` transformed into floating capsule and selected pill | CODED at `087e3679`, not visually device-verified |
| Cards/primary actions stronger elevation in dark/light | CODED; visual review pending |
| 320px/390px both themes, keyboard/safe area/overflow | LATEST HEAD CI PENDING |
| Light contrast previous 31 diagnostic candidates | UNRESOLVED pending screenshot evidence |
| User iPhone acceptance | NOT TESTED |
| Production deploy/merge | NOT DONE |


### 2026-10-25 — Today component redesign QA matrix
| Area | Status |
|---|---|
| `assets/js/10-nexus.js` source-level Today markup, unchanged progressPct logic | CODED; runtime verification pending |
| Five-tab nav floating active pill at 320/390 light/dark | CODED; visual review pending |
| Actual progress ring percent and empty state | CODED; numeric browser verification pending |
| Check-In click delegation, date-specific history, Supplements | NOT TESTED on latest head |
| Log Dose, blend, source-vial maths | NOT TESTED on latest head |
| Contrast and real iPhone keyboard/safe areas | NOT TESTED / unresolved |
| Merge and deployment | NOT PERFORMED |


### 2026-10-25 — source Today candidate functional test evidence
| Area | Outcome |
|---|---|
| Full-app DEMO and LIVE ZIP source packaging | PASS Actions 40237121428 |
| 320px + 390px dark/light LIVE/DEMO browser | PASS Actions 40237121428 |
| Check-In/Log Dose/Stash/Protocol/combos/chevrons | PASS automated browser suites 40237121428 |
| Calculator dimension/math | 80/80 diagnostic; NOT clinical approval |
| Mobile regression | PASS Actions 40237121416 |
| Light-mode contrast candidates | **56 flagged, NOT VERIFIED / BLOCKER** |
| Dark-mode contrast candidates | 2 flagged, NOT VERIFIED |
| Physical iPhone and VoiceOver | NOT TESTED |
| User design approval and deploy | NOT GIVEN / NOT DEPLOYED |


### 2026-10-25 — Stash Hybrid Phase 2 matrix
| Check | Status |
|---|---|
| Source visual selectors `.nx-stash-hero`, `.nx-kit-card`, `.nx-kit-primary-vial` styled | CODED `157a4128` |
| Vial source, multi-vial deduction, blend composition, prepared doses | JS unchanged; latest-head browser NOT YET VERIFIED |
| Kit action sheet/ellipsis/details/history/overview tabs | Latest-head browser NOT YET VERIFIED |
| 320px/390px dark/light layout/contrast | Latest-head browser NOT YET VERIFIED |
| Physical iPhone visual review | NOT TESTED |
| LIVE/DEMO packaging | CI PENDING |
| Merge and Cloudflare | NOT PERFORMED |


### 2026-10-25 — Stash refinement pass 2 regression plan
| Flow | Status |
|---|---|
| Compound kits/Supplies segmented switching and selected accessibility state | CODED, NOT YET TESTED latest head |
| Kit cards and Inventory Overview 320/390, dark/light | CODED, visual QA pending |
| Needs Attention notices trigger correct vial/coverage actions | JS unchanged; NOT TESTED latest head |
| Prepare Dose, Open Next Vial, Reconstitution, ellipsis/Manage sheets and keyboard | Baseline style CODED; modal-by-modal audit INCOMPLETE |
| Source vial math, prepared doses, multi-vial and blend calculations | Protected JS, latest-head browser pending |
| Demo isolation/source-parity packages | Latest-head CI pending |
| Light-mode contrast and physical iPhone acceptance | INCOMPLETE |
| Merge and Cloudflare deployment | NOT PERFORMED |


### 2026-10-25 — Phase 2C targeted cleanup QA
| Check | Status |
|---|---|
| Stash action buttons remain discoverable and clickable without raised shadow | CODED; browser latest-head pending |
| Today primary/secondary CTA aligned and functional | CODED; browser latest-head pending |
| Needs Attention review actions preserved, no left rail | CODED; browser latest-head pending |
| Inventory Resolution per-vial Draw and total confirmation math | NOT MODIFIED; targeted redesign pending |
| Light/dark 320px/390px modal and keyboard screenshot review | NOT TESTED latest head |
| Contrast audit and physical iPhone | INCOMPLETE |
| Merge/deploy | NOT PERFORMED |


### 2026-10-25 — Stash two-action card QA
| Check | Status |
|---|---|
| Card shows contextual vial action + Kit Details (or details only) | CODED; latest-head browser pending |
| Prepare Doses accessible in existing kit ellipsis for eligible recon kits | SOURCE VERIFIED; browser pending |
| Global Stash Prepare shortcut retained | SOURCE UNCHANGED; browser pending |
| Kit details disclosure, Overview/Vials/History, menu actions | BROWSER PENDING |
| Single/multi vial, blends, prepared accounting, edits/history | JS math unchanged; latest-head browser pending |
| 320/390 dark/light, modal scroll, contrast and keyboard | BROWSER PENDING / manual review needed |
| iPhone manual test and merge/deploy | NOT TESTED / NOT DONE |


### 2026-10-25 — Two-action Stash QA finding
- Browser QA `40246509943`: FAIL at `validate-trust-ui.mjs`, outdated visible Prepare card assertion; actual prepared blend inventory reversibility and ledger checks matched expected values. Test updated at `65cba791` to assert kit-sheet Prepare entry instead. Latest-head retest PENDING. Mobile regression on source `ac9a4f27`: PASS.


### 2026-10-25 — Inventory Resolution source-label preview
| Scenario | Status |
|---|---|
| Previous open-kit card assertion adapted to 2-action user-approved hierarchy | CODED `3dc44b22`; latest-run pending |
| Source 1/2 rows, kit identity, units, focus/keyboard | CODED; browser NOT TESTED latest head |
| Confirm draw opens existing draw-and-reconcile modal | Event class unchanged; browser NOT TESTED latest head |
| Existing multi-vial allocation, sum equality, open-next, draft and confirmation | Logic unchanged; latest-head tests pending |
| Blend accounting, reversals and history | Logic unchanged; latest-head tests pending |
| 320/390 dark/light and contrast | NOT TESTED latest head |
| iPhone review | NOT TESTED |
| Production merge/deploy | NOT DONE |


### 2026-10-25 — Stash modal audit QA additions
| Flow | Status |
|---|---|
| Prepare count stepper enlarged to 46px (44px at 320) | CODED, rendered verification pending |
| Open New Vial concentration summary visibly separated | CODED, source formula unchanged; contrast pending |
| Standard vs blend vial modal visual parity and keyboard scroll | NOT TESTED |
| Prepare Draw/source selection/shortage/cancel + draft resume | NOT TESTED latest head |
| Sticky confirmation visible on numeric keyboard + safe area | NOT TESTED |
| Latest 320/390 dual-theme browser release packaging | CI pending |
| Physical iPhone and VoiceOver review | NOT TESTED |
| Merge/Cloudflare deploy | NOT PERFORMED |


### 2026-10-25 — Today lower-page protection matrix
| Area | Result |
|---|---|
| Schedule Today / Active / Upcoming / All / add | Styled, runtime latest-head NOT TESTED |
| Compact compound card Last/Next, status, Log Dose, Reschedule, History | JS unchanged, styled; latest-head NOT TESTED |
| Expanded compound: Intel, Insights, warnings, overdue, after-dose links, actions | EXISTING renderer preserved; visual refactor INCOMPLETE |
| Daily tracking disclosure, supplements, weight/nutrition, weekly summary | Functional markup unchanged; redesign pending |
| Stash Prepare/Open New Vial modal keyboard/focus/sticky action and math | Modal audit documented; NOT FULLY TESTED |
| 320/390 light/dark, contrast, VoiceOver, physical iPhone | NOT VERIFIED latest head |
| Production merge and deploy | NOT PERFORMED |


### 2026-10-25 — Today expanded/tracking/week latest-head matrix
| Flow | Status |
|---|---|
| Expanded compound render, Intel/insights/site rotation/history/overdue | Markup retained, styling coded; NOT TESTED latest head |
| Compact and expanded toggling, dose/reschedule/History | NOT TESTED latest head |
| Daily tracking Check-in/Supplements/Weight/Nutrition | Markup/data unchanged, styling coded; NOT TESTED latest head |
| Weekly detail toggle, full report and metrics | Markup unchanged, styling coded; NOT TESTED latest head |
| 320px/390px light/dark, contrast, scroll, iPhone | NOT TESTED latest head |
| Stash modal Prepare/Open New Vial | INCOMPLETE |
| Source-parity LIVE/DEMO ZIP & HTML | Latest-head CI PENDING |
| Merge/deploy | NOT PERFORMED |


### 2026-10-25 — Today expanded-card follow-up
- Today expanded layout, actual Last/Next dates, multi-occurrence logging, insight disclosure, history, inventory math, 320/390 both themes, physical iPhone: NOT TESTED on new commits. Prior full browser run 40248559713 FAILED; prior mobile 40248559707 PASS only at earlier commit.


### 2026-10-25 — Segmented Today information follow-up
- At commits cf74e60b/6ff6ec2c: Today Insights/History/Details switching, preservation of doses and warnings, tab keyboard behavior, 320/390 light/dark, History handler, dose and vial calculations, full-demo isolation, iPhone/VoiceOver all NOT TESTED. Earlier full browser run failed. Do not infer parity or accessibility signoff.


### Today compact action cleanup
- 2026-10-25 newly changed Today compact/expanded flow: View details toggling, correct History panel entry and complete history, no duplicate History CTA, no blank action slots on log-unavailable states, reschedule/overdue/skip paths, site-warning count, 320/390 dual theme, full-app demo isolation: NOT TESTED pending latest-head browser evidence. Physical iPhone: NOT TESTED. Do not infer preservation of inventory math from source-only edits.


### Log Dose preview trial
- PR #123 Log Dose availability change 2dfae668: due now, due later today, overdue under/over aged threshold, taken today, rescheduled today/future, skipped, paused, no doses, multi-occurrence, prepared sources, multi-vial ledger: NOT TESTED. Preview deployment UNVERIFIED.


### 2026-10-25 — Log Dose preview release checkpoint
- 2026-10-25 — Log Dose CTA preview checks at 9fe7803: due now, due later today, overdue under 3 days, older overdue What happened?, logged today, rescheduled today/later, no history, paused/resting; Log Dose opens matching occurrence; multi-occurrence date/time, draft recovery, source selection, shortage, draw confirmation, one record and accurate ledger. All functional end-to-end cases NOT TESTED on latest head. Mobile regressions at earlier 0819acc1 SUCCESS; exact-head CI not yet verified. Cloudflare deploy SUCCESS per PR comment; physical iPhone NOT TESTED.


### 2026-10-25 — Today expanded screenshot audit
- 2026-10-25 latest Today expanded card changes: source-modified ring, status badge, Last/Next, slotLabel by configured time, standalone per-occurrence Log/Reschedule/Skip 46px controls, Taken today. Browser functional checks, 320/390 dual theme, date rollover, multi-occur independent actions, status for overdue and completed, snapshots, storage and inventory math: NOT TESTED. Do not mark Pass until exact-head run evidence. Physical iPhone NOT TESTED.


### 2026-10-25 — Critical preview syntax hotfix
- 2026-10-25 critical reported failure: 08-nexus.js line 128 Missing } in template expression prevented preview app startup. Fixed at `77de882`; V8 parse PASS for 07-12 at latest code readback. Browser startup, complete card render, recorded-dose timestamp, overdue resolution, mobile 320/390 light/dark, source-vial math, and full DEMO/LIVE artifact parity still NOT TESTED. No physical iPhone PASS claimed.


### 2026-10-25 — Today card milestone consolidation
- 2026-10-25: Today acceptance cases asserted at source (14 invariants): labelled disclosure both states, compound casing, single overdue badge, existing overdue/log handler, independent occurrence data, large controls, completion notice, no duplicated history, tab panels, insights/detail hierarchy. These are source assertions only; runtime 320/390 light/dark, keyboard, logging, reschedule, multi-occurrence, vial math and physical iPhone: NOT TESTED. Latest CI outcome pending.


### Today milestone — source-derived QA gate (2026-10-25)
- 2026-10-25 new gates on PR #123: JavaScript syntax, 14 Today source assertions, runtime Playwright startup, 320/390 dark/light, no page errors, no horizontal document overflow, exact-source isolated FULL-APP DEMO. No browser result yet, and overdue modals, record edits, multi-vial deductions, site history, completed/uncompleted multi-occurrence states and physical iPhone remain NOT TESTED; these are release blockers.


### Today disclosure / typography parity (2026-10-25)
- 2026-10-25 PR #123 Today disclosure parity: source and JS syntax inspected PASS. Added browser computed-style equality test (background, radius, border, font, size, padding, compound title font/size/weight/letter spacing/line height/text) at 320/390 light/dark, plus paused-card source invariant. Actual browser PASS not yet established; keyboard, click/collapse, paused branch, landscape, dose log/history/overdue, full-app DEMO source isolation and physical iPhone NOT TESTED. Do not report as accepted before tests.


### Today grouped correction pass — 2026-10-25
2026-10-25 Today new acceptance checks: exactly one chevron in expanded Hide details; same right alignment as collapsed; Intel visibly actionable; insight labels grounded in data; no invented phase countdown; completed-dose state visible without Log Dose; verify multiple-occurrence and overdue states; 320/390 both themes. All visual/browser/physical checks NOT TESTED; source edit and JS syntax only.


### 2026-10-25 — Root disclosure and Insight cleanup
- 2026-10-25 expanded Today single-chevron CSS root fix: source assertion selectors verified, but actual computed ::after content, one SVG count, disclosure alignment, 320/390 both themes, Insights no borders, overdue action, completed status and physical iPhone remain NOT TESTED. Previous Hybrid QA failures included stale source invariant; test now targets nx-insight-summary. Requires full head browser PASS and real device acceptance before milestone complete.


### 2026-10-25 — Root cause of persistent duplicate chevron / insight borders
- 2026-10-25 root cause verified by CSS source: nexus-disclosures.css high-specificity generated pseudo-chevron persisted despite repeated overrides. Source selector now excludes nx-today-disclosure, and tabs wrapper/observation borders changed. Current head CI pending; actual 320/390 both themes, computed pseudo::after, border widths, toggling, history, overdue, completed and inventory NOT TESTED. Do not mark PASS until rendered verification.


### 2026-10-25 — Compact Today divider correction
- Compact Today card divider check: source CSS updated and source assertion added, rendered computed borders and visual light/dark 320/390 NOT TESTED. Expanded state, dose actions, history, modal flows, inventory unaffected in source but functional regression NOT TESTED.


### 2026-10-25 — PR #123 Today 2.0 candidate QA matrix
| Area | Acceptance requirement | Status |
|---|---|---|
| Protocol segmented card | Insights / History / Details panels and action-sheet tests replace obsolete accordion assertions | TEST UPDATE COMMITTED; exact-head run PENDING |
| Daily Tracking | Check-In saved/edit, supplement multi-select, dated weight/nutrition status, collapsed default, selections persisted after reload | NOT TESTED at latest head |
| Today activity | Scheduled vs adhoc records, multi-dose same day, skip/moved/missed/overdue, no false missed | NOT TESTED at latest head |
| This Week | Elapsed dates only; no future missed; accurate scheduled completion and unresolved | NOT TESTED at latest head |
| Coming Up | 2–3 future instances, explicit times only, repeated multi-dose schedules, working Calendar navigation | NOT TESTED at latest head |
| Visual | 320/390, dark/light, focus, keyboard, contrast, reduce-motion | NOT TESTED at latest head |
| Data integrity | No lost check-in, dose draft, multi-vial, blend deduction or history; DEMO isolated | NOT TESTED at latest head |
| Cloudflare / iPhone | No merge/deploy, real-device review pending | NOT DEPLOYED / NOT TESTED |


### 2026-10-25 — Current evidence for Today 2.0 candidate
- **PASS (earlier branch run 40264328882):** Protocol hybrid information segments + More sheet, 8 LIVE/DEMO mobile widths/themes; vial-source core 48 safety assertions, Log Dose E2E 40 flows, Combo picker matrix, Stash actions.
- **FAIL (same run):** Stash cards QA used removed `.nx-kit-actions-two` selector. Revised check now targets shared `.nx-hybrid-two-actions` in commit `29d81b1`; exact-head result PENDING.
- **PASS:** mobile form regression run `40264637486` at candidate app+test commit `29d81b1`.
- **NOT TESTED / NOT ACCEPTED:** complete full QA at latest head, physical iPhone, VoiceOver, all reschedule/skip/multi-occurrence details, WCAG AA contrast, Cloudflare preview/production, complete source-parity artifact extraction/review.
- No direct change to production saved records or dose/inventory engine. Recheck if subsequent commits alter scope.


### 2026-10-25 — Today dark gradient refinement
- Source: dark-only CSS scoped to `.nexus-today-hero`, its pseudo-elements and progress bar; light mode and computation untouched.
- **NOT TESTED latest head:** computed visual contrast and screenshots at 320/390 dark/light, iPhone review, no horizontal overflow, all QA gates. No release or production deployment.


### 2026-10-25 — Today dark hero visual acceptance
- Branch commit `04c5f1c`: remove upper-right glow from dark Today summary; source-level CSS review only. 320/390 dark and light snapshots, ring legibility and physical iPhone acceptance: NOT TESTED at new head. No app data behavior changed.


### 2026-10-25 — Dark-mode hero selector root-cause QA
- Source verification PASS: app initializes default dark with no `data-theme` and toggles back to dark by deleting `data-theme`; stale selector `html[data-theme="dark"]` could not match. CSS selector correction commit `6d08812` scoped to Today dark hero. Browser computed-style/raster at 320/390 dark and light: NOT TESTED at correction head. Cloudflare preview deployment: NOT VERIFIED for correction commit. Release prohibited until acceptance.


### 2026-10-26 — Today full-app candidate verified QA evidence
- **PASS:** GitHub Actions full build and parity run 40267178763 at test/app commit 640d594 (16 LIVE/DEMO and viewport/theme sessions across individual suites as configured), mobile forms run 40267178912. Prior run 40264637477 failure in weekly chevron selector resolved by switching to This Week before checking tap target. Prior temporary stylesheet query breaking builder removed.
- **PASS / local Chromium simulation:** downloaded full-app DEMO at 320px and 390px in light/dark; computed dark hero approved gradient, pseudo-orb disabled; no hero overflow or page exceptions; four daily tracking actions height 44px; week segmented control opens, Calendar navigation works.
- **PASS / inspected artifact:** 12627006318; LIVE ZIP root index + four stylesheets + twelve ordered scripts + four icon assets; standalone DEMO embeds all scripts/styles without live JS/CSS refs; build manifest states isolated in-memory storage and disabled sync.
- **NOT TESTED:** physical iPhone Safari, VoiceOver, keyboard/safe-area visual parity under native OS chrome, independent Cloudflare branch preview served-file SHA, actual end-user data fixture. Repeat same-compound Coming Up fixture identified for product review, not a test failure.


### 2026-10-26 — Calendar 2.0 new test matrix
| Test | Status |
|---|---|
| Month opens in current month and retains numeric historical weight | SOURCE PRESERVED; latest-head browser QA PENDING |
| Weekly and monthly metric calculation from canonical saved occurrence statuses | CODED; edge-case math NOT FULLY TESTED |
| Completed, Scheduled/Unresolved, Wellness selected-day tabs | CODED; 320/390 light/dark automated run PENDING |
| Week/Month switching and responsive horizontal bounds | Automated assertions added in `9ed4c89`; PENDING |
| Saved check-in/weight/supplement/nutrition and existing dose history protected | No mutation code added; end-to-end edit/history parity NOT TESTED |
| Full LIVE/isolated DEMO package and iPhone Safari | NOT VERIFIED |


### 2026-10-26 — Calendar 2.0 verified release-candidate evidence
| Flow | Status / evidence |
|---|---|
| Month/Week grid, 3 day category selectors, source-backed outcome overview, viewport bounds at 320/390 both themes in LIVE+DEMO | PASS, run `40273196256`, screenshots `calendar-hub-*.png` |
| Today compact weekly pulse, alerts open/close, shared chevrons, Protocol forms, Check-In history, vial/dose/Combo/Stash suites | PASS, full GitHub Actions run `40273196256` |
| Mobile form regression | PASS `40273196254` |
| Complete 21-file root LIVE ZIP and full-app DEMO, isolated ephemeral storage, disabled sync | PASS artifact inspection #12629580963 |
| Physical iPhone Safari, VoiceOver, saved real user data, keyboard/safe-area beyond emulation, Cloudflare preview byte parity | NOT TESTED / NOT VERIFIED |
| Detailed record edits from new categorized day cards, advanced activity trend filters | NOT IMPLEMENTED, legacy Logs/history preserved |


### 2026-10-26 — Logs journal candidate regression matrix
| Test | Evidence |
|---|---|
| Day/All mode switching, selected Calendar date preserved, Today date shortcut, Weight type filter | Browser assertions added in `aa84611`; pending full run `40275277177` |
| 320/390 light/dark LIVE and isolated full DEMO, icons and expandable entry actions | Source-coded, latest run PENDING; physical iPhone NOT TESTED |
| Existing Check-in/edit/update, supplements, weight, measurements, nutrition, dose data, history intact | Original state arrays and action-class handlers reused; end-to-end regression PENDING |
| Exact-source LIVE ZIP, self-contained demo, Cloudflare preview | NOT VERIFIED after Logs changes |


### 2026-10-26 — Logs Day View candidate checks
- Previous and Next day stepping returns to original date: automated assertions committed `5167a87`; latest-head QA PENDING.
- Existing Day/All modes, type filters, selected Calendar day, all-dose and wellness source records, SVG icons, record action handlers: SOURCE VERIFIED, latest-head browser QA PENDING.
- Physical iPhone keyboard, native date picker, accessibility, live saved user dataset and Cloudflare preview: NOT TESTED.


### 2026-10-26 — Logs latest-head candidate results
| Check | Result |
|---|---|
| Day View/All Logs and Previous/Next/Today interactions 320/390 light/dark LIVE+DEMO | PASS in workflow `40275552699` |
| Mobile form regression | PASS `40275552720` |
| Full source-aligned LIVE ZIP (21 files) and isolated standalone full-app DEMO | PASS artifact #12630341125, inspected |
| Physical iPhone, VoiceOver, Cloudflare preview byte parity | NOT VERIFIED |


### 2026-10-26 — Latest Logs source and visual evidence
| Gate | Result |
|---|---|
| Full LIVE/DEMO QA (Day/All Logs, Calendar navigation, protected workflows, 320/390 both themes) | PASS GitHub run `40276022471`, branch head `3eb6bf4` |
| Mobile form regression | PASS `40276022466` |
| 21-file LIVE root ZIP and standalone fully embedded DEMO, isolated fictional storage | PASS artifact #12630810614 independent ZIP/manifest inspection |
| Screenshot render of Logs 320/390 dark/light in both LIVE and DEMO | PASS presence and visual inspection of dark390/light320; screenshot top partially scrolled |
| Physical iPhone Safari, screen reader, keyboard safe-area, real saved-data histories and Cloudflare preview served bytes | NOT TESTED / NOT VERIFIED |


## 2026-10-26 — Draft PR #123 Calendar Logs acceptance checkpoint
- PR head observed `d6e3dfc4bf60592c7eb7296aa3038785d40fbef7`, open/draft. Calendar Day View + All Logs coded per user handoff; actual behavior not yet independently accepted.
- **PASS (GitHub Actions automated mobile forms):** run [40334643562](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40334643562), completed success. Do not extrapolate this to history editing, vial mathematics or physical iPhone.
- **PASS (CI steps only):** source JS validation, exact-source LIVE/DEMO builder and required file checks in run [40334643538](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40334643538).
- **IN PROGRESS:** same run browser matrix 320/390px light/dark and complete artifact upload; artifacts list empty at check. Mark full browser/DEMO isolation and parity **NOT YET VERIFIED** pending result files.
- **NOT TESTED:** real iPhone Calendar tap/day navigation, All Logs filtering, edit correct historical date, saved Check-In/Supplements/Weight/Nutrition/dose history, draft handling, single/multi-vial math, safe-area scroll and VoiceOver. No live/localStorage writes made.
- No failed test is being hidden or converted to PASS. No production release authorized.


### 2026-10-26 updated regression outcome — full browser failure found
- **FAIL (automated):** run 40334643538 final browser step; timeout `.nx-journal-mode[data-mode="all"]` at validate-chevron-unification.mjs:133 after fixture replacement. Previously completed browser/Check-In/Protocol/vial/dose/combo/Stash suites remain individually PASS; do not label aggregate PASS.
- **CODED, NOT RETESTED:** commit `d086513` updates test harness to re-open journal through real Calendar UI after synthetic fixture reset; new PR-head CI result pending. Does not alter app code or production storage.
- Artifact #12656152966 produced from failing preview checkout and locally inspected: LIVE ZIP contains 21 files at correct paths; full DEMO HTML and offline ZIP present; manifest flags ephemeral memory/no sync. Runtime isolation end-to-end and all Calendar cases cannot be marked PASS until passing post-fix QA.


## 2026-10-26 — Calendar Add Log menu / Today week patch
- Implemented targeted CSS in draft PR #123, no data/schema changes. Check Add Log plus-only (no pseudo chevron), 44px trigger, popup five options with centered text, 2-col grid and full-width Supplements tile, Measurements text clipping at 320/390, both themes. Check This week `29% so far` separated while percentage math unchanged.
- Automated assertions added to `tools/validate-chevron-unification.mjs`; **PENDING** new run. Prior full QA 40335573068 PASS was before this patch and is not its evidence. Physical iPhone/VoiceOver **NOT TESTED**. Historic logs, edit actions, storage and data math unchanged in source patch, functional regression pending.


## 2026-10-26 — Physical iPhone Sprint 01 report
- **PASS WITH MINOR VISUAL ISSUE (user-reported, physical iPhone):** Sprint 01 tested; user requests changes to **Calendar Month-view icons**. Individual checklist item results were not supplied, so do not backfill individual Pass outcomes.
- **PASS (automated latest pre-doc head):** mobile regression workflow 40339121261; full source/browser/package workflow 40339121469 at PR head 375b8879. Artifact #12658936702 published. The automated matrix is distinct from physical iPhone acceptance.
- **PENDING / NOT TESTED AFTER FIX:** specific Month icon changes, their legibility/alignment across 320/390 dark/light, icon QA on physical iPhone. No icon fix implemented in this checkpoint.


## 2026-10-26 — Sprint 02 Stash patch regression pending
- New CSS at `76f232d`: verify 320/390 dark/light kit name wrapping, 44px Manage target, focus visibility, Overview/Vials/History tap targets, Kit details toggling, light-mode visibility. **NOT TESTED on this latest commit at documentation time.** Protected vial opening (blend/single), edit, inventory deductions, insufficient stock, source association, history must remain unchanged. Sprint 01 Month icons still user-feedback pending.


## 2026-10-26 — Sprint 02A Protocol visual check
- **PASS (automation, previous exact head 137306ab only):** mobile run 40341448639 and full browser/build run 40341448649, includes prior Stash compact card patch.
- **CODED / NOT YET TESTED at new head 6479eea:** Protocol name/status/goal wrapping, 44px Manage ellipsis, Schedule & phases expansion and keyboard focus, first-dose and Activate actions, archived status. Verify 320/390 in both themes, no duplicate chevrons, sheets stay within safe area. Protect saved phases, schedules, dose history, first-log action handlers and production storage. Real iPhone new-build check pending.


## 2026-10-26 — Sprint 02 shared vial sheet QA target
- New changes: shared `nx-open-vial-fields` responsive 2-column iPhone grid (BAC spans both) and 3-column at >=480px, 44px input targets, visible `#rvsave` primary action, focus styles. **NOT TESTED on new head**. Verify 320/390 dark/light, iPhone keyboard and bottom safe-area, blend and single create/open flows, numeric entry, validation, confirmation, dose history and inventory unchanged. No Pass inferred from earlier workflows.


## 2026-10-26 — Sprint 02A Protocol + Plans new-head validation targets
- **NOT TESTED on new head yet:** 320px/390px light/dark Protocol overview phase (live/planned/rest/completed), long names, filter groups, Schedule & phases timeline/disclosure, linked goals, Manage edit/pause/resume/record past pause/delete confirmation, Activate and Log First Dose; Plans goals/research statuses, goal detail, Intel, Manage edit/delete sheets, shopping unaffected; keyboard/focus/safe areas. Confirm computed phase data is accurate and no history/dose/pause records are mutated by UI refresh. Verify full-app isolated DEMO/LIVE ZIP from matching SHA, and physical iPhone acceptance separately. Sprint 01 Calendar Month icon follow-up still open.

- Additional latest-head target `29cb2434`: NEXT SCHEDULED must display verified existing `nextDueStr` when available, otherwise `See schedule`; handle unscheduled compounds without exceptions.


## 2026-10-26 QA checkpoint: PR #123 head 7751ccdc, workflow 40347404028 FAILED at Browser QA 320/390 light/dark; root failure cause unverified. Proposed NOT TESTED: completion celebration only on confirmed action, reduced motion; paused countdown, different compound phase duration; phase alerts deduplicated with correct deep linking, respecting settings and no background push. Existing stored records, dose and pause histories must stay unchanged.


## 2026-10-26 — Protocol interior latest-head regression pending
- **NOT TESTED on new head**: countdown for not-started/paused/elapsed/multi-compound protocols; explicit completion animation and reduced-motion; existing phase alerts (dedup, on/off, transition-day); compound roadmap current/past/future and pause frozen date; preservation of dose/phase histories. Mobile/browser green on older head is not evidence for `177e25fa`. Verify 320/390 themes, full DEMO/LIVE parity and physical iPhone separately.


## 2026-10-26 — Protocol interior enhancement regression targets
- NOT TESTED on new head: completion only after confirm, cancel path must not celebrate, single animation / reduced-motion, close/reopen no replay, historic dose records unchanged; countdown latest end across compounds, paused (frozen), start date missing, not started, elapsed schedule, completed (manual only); compound roadmap phase number/week/days and next phase accurate after pause/resume; per-compound buttons functional and focus/touch >=44px; in-app transition alerts at 3d/1d/day-of, no duplicates between protocols sharing a compound, respect settings and no push claim. Test 320/390 in light/dark and physical iPhone separately, full-app DEMO/LIVE parity and prior protected flows. No Pass until evidence.


## 2026-10-26 — User-observed Protocol visual and behavior issues
- **USER OBSERVED (not reproduced):** after Pause action, card appeared briefly in In progress filter until navigating away/back. Recheck immediate rerender under All, In progress and Paused; persist, reload, phase countdown and pause timestamp. No premature Pass/Fail root cause claim.
- **VISUAL FEEDBACK:** expanded compound route pill/time/active-dosing cluster and Phase Roadmap need redesign; Create/Edit builder needs hierarchy/sticky keyboard-safe actions. Not yet coded.
- **PROPOSED NOT TESTED:** 'Schedule ended' distinct from manually completed; after-end recorded dose correlation must avoid schedule-only and unrelated-protocol false positives; opt-in prompt choices Review/Extend, Create New, Not now; no automatic status, dose, history or stock mutations.
- Latest source QA at user review: run 40348986886 **FAIL**, mobile 40348987869 in progress, pre-documentation head 1448c411. Failure cause unverified; latest-head full-app DEMO and LIVE ZIP unverified.


## 2026-10-26 — Expanded Protocol phase row and Plans button contrast
- **FAIL on PRE-PATCH HEAD**: full QA workflow 40351719788, `Management surface must contrast against Research card`, at `tools/validate-plans-hierarchy.mjs:180`; preceding browser suites reported PASS but aggregate FAIL. CSS patch `da015ec0` **NOT RETESTED** at documentation time.
- **NOT TESTED on latest head:** Protocol rows at 320/390 dark/light, compound labels (long/short), paused / elapsed / not-started progress, zero compounds, full phase roadmap navigation (existing handler), correct source phase and date; Goals/Research menu contrast in both themes, protected modal/nav/dose/history behavior. Do not report passing latest source until workflow evidence arrives.


## 2026-10-26 — Dedicated Protocol detail QA required
- **NOT TESTED on current head:** Overview entry from list, correct Overview/Compound/Completion switching, ring percentage/day math after pause and multi-compound differing durations, started/paused/schedule-elapsed/completed labels, missing dates, long names, roadmap modal open from details and clean close/reopen, accessibility and 44px targets, 320/390 light/dark, safe areas and keyboard; protected dose/source/phase history and Manage actions. 'About phase notifications' is explanation only. Full-app DEMO/LIVE source parity and physical iPhone unverified. Do not claim release QA Passed.


## 2026-10-26 — Protocol detail status semantic correction
- Code review found active protocol label incorrectly `Ready` and paused elapsed schedule potentially labelled ended; corrected in `5764db48`. **NOT TESTED** latest head for active/paused/ended/completed/unscheduled and multi-compound calculations. GitHub build/parity 40354741333 and mobile 40354741424 were IN PROGRESS at review; no Pass claimed.


## 2026-10-26 — Protocol de-duplication latest-head checks
- NOT TESTED: 320/390 dark/light list compactness, no old details expansion or extra detail tabs, proper View overview entry, correct ring and list progress for paused, completed, ended, unscheduled, multi-compound; compound tap → approved vertical roadmap → back to Overview, bottom-sheet close, Manage edit/pause/resume/complete confirmation, activation and first dose; unchanged dose history, drafts, inventory and stored data. Previous browser run 40355170877 failed Plans Research manage-surface contrast; do not claim latest-head Pass. Full source packages and physical iPhone not verified.


## 2026-10-26 — Browser QA triage and new navigation assertion
- **FAILED prior head:** run 40358780283 stopped in `validate-chevron-unification.mjs` with `missing .nexus-protocol-details>summary`: a test for intentionally retired content, not proof that new navigation is broken. Its Browser matrix and Protocol candidate 8-session suites completed, but aggregate result FAIL.
- **NEW NOT YET VERIFIED:** `49484971` tests 320px/390px, light/dark, LIVE/DEMO: no retired inline disclosure, list View Overview, Overview progress ring, compound card, vertical phase roadmap, back to Overview, close. Other protected flows in same suite remain.
- **Potential remaining FAIL targeted:** Plans Research manage control had contrast assertion failure at older heads. `80289b93` corrects selector specificity. Await new-head browser result; don't mark Pass until evidence.


## 2026-10-26 — Automation results and screenshot evidence
- **PASS for PR test-merge c6885efd:** mobile form workflow 40359787123, build/parity workflow 40359787121; 8 LIVE/DEMO × 320/390 × light/dark navigation assertions (list→Overview→phase→back→close), 8 Plans hierarchy/contrast cases, 8 Browser matrix, protected Check-In, Log Dose, vial-source, Combo Picker, Stash panels/actions and calculator safeguards recorded as PASS in CI logs.
- **NOT TESTED physical:** iPhone Safari actual touch, keyboard, safe areas, VoiceOver, real saved-record history. Screenshot-enhanced test commit `b155134c` requires latest-head CI and visual review. Automated theme contrast audit reports candidates; cannot claim WCAG AA compliance for all surfaces.
- Artifact manifest source PR merge SHA c6885efd, GitHub Actions artifact 12667882258. Standalone demo ephemeral isolated state; no production writes. Preserve draft; production parity not expected and Cloudflare remains unchanged.


## 2026-10-26 — Protocol screenshot visual QA
- Automated navigation PASS on PR merge-ref `2adf5eea` (browser workflow 40360851339); screenshots of new Protocol sheets captured too early in opening animation and cannot support actual final-state visual approval. Commit `2d67b356` waits for settling and asserts onscreen bounds before each Overview and roadmap screenshot. **NOT TESTED** resulting screenshots yet. Physical iPhone / VoiceOver still pending.


## 2026-10-26 — Settled screenshot and navigation evidence
- **PASS automated** PR merge source 08bd02b7, workflow 40361824665: complete build/live/demo artifact verification and 8 LIVE/DEMO × 320/390 × light/dark navigation suites (Protocol list→Overview→vertical timeline→back→close), Plans contrast, protected Calendar/Check-In/Stash/Log Dose/Combo Picker/measurement checks. Screenshots now captured after animation settling; inspected 390 dark Overview/roadmap and 320 light Overview with no obvious offscreen clipping. Full WCAG AA contrast and physical iPhone gesture/keyboard tests **NOT TESTED**.
- **OBSERVED VISUAL FOLLOW-UPS (not blockers to demo preview):** single compound header `1 compounds` grammar and current Overview as bottom sheet rather than conceptual full-page destination. User acceptance pending.
- Latest mobile CI 40361824205 pending when documentation written; distinguish older successful mobile from latest. Cloudflare parity mismatch expected for unmerged preview; production not deployed. Keep PR draft.


## 2026-10-26 — Contextual Plans links: NOT TESTED latest head
- Verify at 320/390 light/dark: Protocol Overview → correct linked Goal → Connections → correct Protocol Overview, missing/unlinked goal, close/back/scroll, multiple protocols, touch size, no saved-data writes. Preserve protected dose, phase, pause and history tests.

## 2026-10-26 — Goals-first design new-head matrix
- NOT TESTED on new markup/style commits: 320/390 × dark/light Goals list titles/statuses/target dates; numeric goal valid baseline/target/unit/source and measured value; invalid target, unit mismatch, missing weights; subjective/milestones/exploratory absent numeric bar; linked/unlinked protocol count and Goal detail Connections → Protocol Overview → Goal; 44–48px targets and overflow.
- NOT TESTED new-head: preserved Goal edit/delete, Check-In original record activity, Protocol and phase/pause history, dose/vial/Combo, Stash, Calendar, backups and production localStorage isolation. Physical iPhone/VoiceOver not tested. Historic passing CI for pre-change heads is not a new-head PASS.

## 2026-10-26 — Compact Goals correction regression
- NOT TESTED latest head: 320/390 light/dark compact density, management action target, Details navigation, other goal statuses, numeric and nonnumeric progress, all Goals/Research/Shopping sub-tabs after header count removal, Protocol links, saved history and user data. CI and physical iPhone acceptance pending.


## 2026-10-26 Goals approved preview parity
- NOT TESTED latest head: screenshot parity at 320/390 light/dark for approved original goal card with status, target, progress, links and detail navigation. Physical iPhone pending.

## 2026-10-26 — Goal wizard test matrix (pending)
- NOT TESTED latest head: Add and Edit start values; Basics required name; Back/Continue across four stages; change numeric/subjective/milestones/exploratory and return without losing unsaved values; compound selection, original Check-In symptom association, target date, notes; final Review and exactly one save; closing without save, no duplicate goal; keyboard/safe-area/scroll 320/390 dark/light; protected Log Dose draft, source, multi-vial, Combo and insufficient inventory. Physical iPhone and VoiceOver NOT TESTED.

## 2026-10-26 — Goal wizard failing test triage
- FAIL pre-patch: build/parity 40386863855, Plans selector visibility timeout at Check-In connection before Connections step. Other automated suites preceding Plans passed; no actual user-flow parity established. `c9b6782c` test now advances stages and uses final Review save. Latest-head results PENDING. Physical iPhone/VoiceOver NOT TESTED.

## 2026-10-26 — Corrected Plans wizard regression harness
- Previous full build 40389027791 FAIL due to hidden wizard Connections field; other suites passed in that run. Verified new `validate-plans-hierarchy.mjs` blob `d653d2f7` at commit `fe024eaf`: test clicks through wizard and only saves on Review. Latest-head end-to-end NOT TESTED at handoff. Physical iPhone/VoiceOver pending.

## 2026-10-26 — Verified Goal wizard automated run
- PASS on head `701c6c7e`: 40389965572 build/browser including Plans hierarchy eight LIVE/DEMO 320/390 theme sessions, 40389965592 mobile forms, 40389962603 hybrid preview. Protected Check-In, Protocol, source-vial, Log Dose, Combo, Stash and chevron browser suites PASS. Full builder package assertions PASS. Measurement math diagnostic 80/80, not clinical validation.
- NOT TESTED: physical iPhone/VoiceOver, comprehensive WCAG AA contrast, independent artifact extraction and source file-level inspection. Diagnostic contrast candidate list exists in build log. No deployment.

## 2026-10-26 — Artifact and device QA follow-up
- INSPECTED: action artifact 12684590713 extracted, LIVE ZIP 21 expected files with root index and ordered modules, DEMO contains isolated demo markers; CI Plans QA JSON 8/8 PASS. Source manifest commit b04907ea differs from PR source SHA 701c6c7e: parity ancestry UNVERIFIED. Physical iPhone Safari keyboard, scroll, safe areas, VoiceOver NOT TESTED. Log Dose Quick/Guided design only; implementation/regression not tested.

## 2026-10-26 — Quick/Guided Log Dose new test matrix (NOT TESTED)
- Quick routine log and final explicit confirmation; Guided dose, source, review and actual inventory calculation visibility; switching modes and preserving date/route/site, note, symptoms; prepared source, fresh vial, multiple open vials, insufficient inventory, split vial, blend components/allocations, edits, pending drafts/Open New Vial; iPhone 320/390 light/dark, keyboard and bottom sheet; all old Log Dose browser flows. New-head QA pending. Physical iPhone/VoiceOver not tested.

## 2026-10-26 — Log Dose review-gate QA checklist
- NOT TESTED new head `c0b882d0`: Quick Entry→Review and Guided Dose→Source→Review, invalid amount/date blocked, final Save hidden before review, selected prepared/fresh kit, blend breakdown, split-vial plan, insufficient stock rejection, draft restoration, edit, keyboard/scroll/safe areas, 320/390 light/dark. Original dose calculation unchanged. Physical iPhone/VoiceOver pending; CI run may fail older one-page selectors.

## 2026-10-26 — Review-ledger QA (PENDING)
- Commit `631c36a8` modified end-to-end browser helper to traverse Review before clicking Save. Verify 8 live/demo viewport/theme combos, source kit/vial identity, native mg/mcg presentation, prepared no-double-deduction, split vial, invalid zero/negative amount, draft handoff, edits, blend save and source discrepancy. Latest-head browser results pending; manual iPhone/VoiceOver NOT TESTED.

## 2026-10-26 — Review source UI assertions
- `fb8a7c40` adds multi-vial and prepared-batch Review assertions to end-to-end browser regression. Pending latest-head CI. Expected kit/source rows, no repeated deduction for prepared source, amount/date validation, source handoff and split vial math. Blend component breakdown not yet verified. Physical iPhone still NOT TESTED.

## 2026-10-26 — Goals header move (PENDING)
- Verify #add-goal appears once above goal cards and below Goals/Research/Shopping navigation; no old footer duplicate; opens existing four-step goal wizard; empty state still usable; goal edit/delete/details and saved history remain unchanged. Check 320/390 light/dark, keyboard, focus and physical iPhone (NOT TESTED). Research/Shopping untouched in this commit.

## 2026-10-26 — Research/Shopping design regression (NEW HEAD PENDING)
- Research: top Add Research appears once, picker unchanged, status/goal/reason, notes collapsed initially and aria-expanded Show/Hide without notes chevron, one Intel chevron linking same destination, 44px ellipsis bottom sheet edit/delete, empty state. Shopping: top Add Item appears once, existing Needed/Ordered/Received list, quantity/category/goal/protocol/notes, original management menu and editor, no status mutation from read-only list. 320px/390px both themes pending browser run; physical iPhone/VoiceOver NOT TESTED. Prior Log Dose full QA previously passed at `ee22d0d9`, new-head retest required.

## 2026-10-26 — User-observed UI regressions
- Added automated assertions to Plans hierarchy browser suite: More→Plans defaults Goals despite previously selected Research; manual switch Research works; repeat More→Plans resets Goals; single rendered border above Intel (`.nx-plan-secondary` 1px, Intel button 0px); Add Research retains picker/status/reason/goal/notes. Test at 320/390 light/dark in both LIVE and isolated DEMO; latest HEAD pending. Physical iPhone screenshot confirms PRE-FIX double separator; no post-fix physical acceptance yet. Add Research and Add Shopping modal visual consistency vs Goal wizard still needs direct screenshot review.

## 2026-10-26 — Editor alignment test matrix
- New browser assertions in `9ddfac17`: Research modal 5 preserved fields, header title/label, min 44px save; Shopping 6 preserved fields, min 44px save. 320/390 both themes LIVE/DEMO automated run pending; direct physical iPhone keyboard, scroll, focus, native selects and screen reader NOT TESTED. Verify actual Add/Edit persistence, Research picker, Shopping links, management bottom sheet, and Log Dose regression before merging.

## 2026-10-26 — Stash kit editor parity verification (NEW HEAD PENDING)
- Check 320/390 LIVE/DEMO dark/light kit editor original `#sname/#stv/#svmg/#sbac/#sloc/#ssave`, 44px Save target, opening/closing without inventory state mutation; concentration calculation, open-vial conditional input, edited kit disabled vial-count fields, blend switch and source-aware vial math remain protected. Check Prepared SVG, attention 44px controls, kit detail tabs, no duplicate chevrons and full source/Log Dose/Combo Stash suites. `9b03db6c` adds subset automated checks; browser/physical iPhone results pending.

## 2026-10-26 — Proposed guided Stash form acceptance (NOT TESTED)
- Add/Edit kit 3-step flow, back preservation, searchable compound combobox and existing choices; blend vs ordinary kit parity; disabled pre-existing vial count/size edit; open-vial controls and unit conversion; cost/notes/expiry; Review summary and exactly one authoritative Save; cancelling without writes. Prepared inventory: list, prepare choice, single/mixed syringe detail, source allocations, prepared counts, logging/administration, delete/refund. Vial lifecycle: open/reconstitute/finish/reopen/adjust/outflow/undo. Test 320/390 both themes LIVE and isolated DEMO; keyboard, VoiceOver and physical iPhone pending. No new Pass claimed.

## 2026-10-26 — Guided Stash candidate verification status
- PASS (automated workflow status at exact PR branch head `5a9d6c7a`): mobile 40417820123; build/parity 40417820282. Individual guided wizard and keyboard tests NOT verified as covered by these workflow summaries.
- NOT TESTED manually: 320/390 light/dark wizard screenshots, searchable picker arrows/Enter/Escape/blur, original-select synchronization, screen reader semantics, positive vial counts/strength, zero/negative/excess remaining quantities, unit conversion, Back/Continue value preservation, correct Review, saving only once on step 3, blend editor parity, prepared batch refund, vial lifecycle and physical iPhone.
- NOT VERIFIED: independently downloaded and inspected complete full-app DEMO + LIVE ZIP for head; artifact 12696280782 exists.

## 2026-10-26 — Guided Blend Kit current-head matrix (NOT TESTED)
- Verify Add vs Edit 3-stage navigation, Back preserving all fields, no draft writes; multiple compound chooser browse/search, empty/no results, custom Other, keyboard Enter/Arrows/Escape, pointer/blur, 44px targets; positive mg entries, minimum 2 distinct components, total mg; sealed/open vial counts; existing-kit name and vial count lock; per-vial locked historical composition; final Review and original `#bk-save` called exactly once.
- Test duplicate blend name, negative BAC, zero/invalid expiry, numeric vial count, inventory history, ledger, prepared doses, Log Dose and Check-In regression; 320/390 light/dark LIVE and isolated full-app DEMO, physical Safari/VoiceOver. Results NOT TESTED until latest commit workflows and manual evidence checked.

## 2026-10-26 — Guided blend workflow acceptance follow-up
- User approved the three-step guided Blend Kit workflow and the screenshot-style dropdown with embedded search. Current source `assets/js/03-nexus.js` already includes a three-step blend wizard and component dropdown search, preserving original `#bk-save` handler. Review uncovered two BAC inputs on new blends (`#bk-bac` and `#bk-bac-edit`) with potentially divergent displayed review/save semantics. Existing edit must preserve opened-vial ratios and historical allocations. Do not merge/deploy until targeted validation, UI acceptance, and full-app artifact inspection. Next action: reconcile BAC UI and test blend save and history at 320/390 light/dark.

## 2026-10-26 — Guided Blend BAC parity assertions added, pending CI
- `tools/validate-stash-actions.mjs` now checks at 320/390, light/dark, LIVE/DEMO that there is no `#bk-bac`, one `#bk-bac-edit`, three-stage journey, no save before Review, two component amounts, review 2.5 mL and CAD $190, saved BAC 2.5 mL, vial count 3, total 15 mg and component ratio 10:5. Commit `6407d532`; workflow status PENDING at first check. Physical iPhone, full complete blend accounting history, VoiceOver and artifact extraction NOT TESTED.

## 2026-10-26 — User-observed guided Stash regressions / correction gate
- FAIL on user-provided physical iPhone screenshots: duplicate compound controls, redundant step counter, early Save Kit appearance, blend native-looking compound dropdowns, blue detached Continue CTA and open-vial default checked. User explicitly rejected screens. Corrective source commits `0a0a9f67`, `8d30293d`, `939e5c7e`, `90ecfd9e`, `b8f8f2db`; latest-head outcomes NOT TESTED. Browser checks added for hidden pre-review blend Save, editable searchable combo and sealed default. Must validate actual modal DOM, initial/read-write select, picker no matches/keyboard, one primary CTA, stage progression and historical ledger before Pass.

## 2026-10-26 — Latest guided Stash QA failure
- FAIL: `40421697164` full build/parity browser QA on app head `b8f8f2db`; error assertion unavailable from GitHub connector; job `121917447165`. PASS: mobile form regression `40421697072` on same SHA. Physical user iPhone screenshots documenting PRE-FIX broken Stash UI remain FAIL; post-fix device visuals NOT TESTED. No release clearance.

## 2026-10-26 — Clarified failure classification, not a UI pass
- Failure `40421697164`: stale Stash Cards assertion measured deliberately hidden Step-1 Save height; corrected in `6d209ed5` to test hidden on Steps 1–2 and visible 44px+ Review Save. Other suites in failed run include Stash Actions PASS 8 configurations, vial-source PASS 8/48 assertions, Log Dose PASS 8/40 flows, Combo picker PASS. Full overall QA still FAIL until rerun passes; iPhone screenshot pre-fix rejection remains FAIL.

## 2026-10-26 — Corrected Stash regression and screenshot suite
- PASS: full build/parity `40422263758` and mobile `40422263763` on application/test SHA `6d209ed5`, after updating obsolete Save-height assertion to require hidden Save before Review and >=44px visible Save at Review. Additional screenshot capture tests `ed77a3e7` and `dac2ba4a` pending newest-head QA. New images planned: Kit and Blend stages 1/2/Review, widths 320/390, themes dark/light, LIVE and full-app DEMO. Actual screenshots/real iPhone/VoiceOver NOT YET REVIEWED. Preserve physical screenshot reported defects as not accepted until resolved on real device.

## 2026-10-26 — Passing candidate artifact evidence
- Build 40422263758 PASS: Stash Cards 8/8, Stash Actions 8/8. Artifact 12698436592 downloaded/extracted: ZIP CRC good, root index and 21 manifest-listed files exact, standalone DEMO 2.56 MB, manifest notes ephemeral fictional data/no sync. Browser direct local render blocked by administrator; new 320/390 screen captures pending CI. Do not equate this candidate with user acceptance or deployment.

## 2026-10-26 — Visual defects found in CI screenshots despite passing automated workflows
- FAIL (visual review, older artifact 12698781391): ordinary Kit Review shows labels/values concatenated; step2 footer Continue appears as detached text; blend title not persistent across stages, Blend Step 2 shows wasted helper; first stage screenshot obscured during entrance animation. Corrective commits 83d374c3, be382d87, 4d34e265 and screen settling changes. Assert colored >=44px button and hidden duplicate native selects in commits 5129b2d3/5f210026. Newest-head screenshots and physical iPhone acceptance PENDING; do not mark PASS on older runs.

## 2026-10-26 — Guided Stash screenshot-led polish (DRAFT)
- Inspected actual source-generated 390px dark Kit/Blend screenshots from artifact `12698781391` (run `40422827201`, SUCCESS): regular Review values collide with labels; Step 2 Continue renders as a text link; Blend footer also has detached Continue styling. New CSS commit `4a1e090b` makes Continue a 48px full-width lavender button, Back a 48px secondary control, Review a two-column wrapped label/value grid, and normalizes Blend sticky footer. No data model or save-handler change.
- This is a corrective UI candidate, NOT approved on physical iPhone. Re-run newest-head CI, inspect 320/390 both themes and actual step screenshots. No merge/deploy without user approval.
- **ONE NEXT ACTION:** Inspect newest-head browser screenshot artifact for action visibility, scroll, keyboard and review readability; confirm iPhone user acceptance before merge.

## 2026-10-26/27 — Current-head automated guided Stash results
- **PASS automated:** PR merge-ref `d4e0ff1d` for draft head `455404bb`; mobile run `40424506766` SUCCESS, build/parity `40424506746` SUCCESS. Stash Actions/Cards/Panels browser QA result JSON each 8 configurations passing LIVE/isolated DEMO at 320/390 dark/light; source fixture Create Blend Review/Save matches component total and BAC water, no early Save, one combobox with native control hidden. Vial source and Log Dose protected browser suites pass in full workflow.
- **PASS independent artifact structure:** artifact `12699630393` complete 21-file root-index LIVE ZIP and 2.56 MB isolated self-contained full-app DEMO; manifest matches PR merge-ref, no sync, ephemeral in-memory demo. **PASS rendered visual review** in Chromium: 390 dark/light for all six Stash screens; 320 dark Blend Step 1; touch-target/overflow browser assertions. This is not WCAG AA or iPhone acceptance.
- **NOT TESTED:** physical iPhone Safari, VoiceOver, keyboard/safe-area on physical device, comprehensive blend historical ledger/opened-vial-ratio changes and prepared-source refund edge cases. Pre-fix user screenshots FAIL; latest actual iPhone retest pending. No production merge/deployment.

## 2026-10-26 — Blend component one-row layout regression
- New automated bounding checks in `tools/validate-stash-actions.mjs` at 320/390 dark/light LIVE and isolated DEMO require combobox, mg and remove aligned on the same row with no overlap/viewport overflow. First run pending for commit `269f468d`. Physical iPhone Safari and VoiceOver NOT TESTED; existing blend history math remains protected.

## 2026-10-26/27 — One-row Blend screenshot acceptance matrix
- PASS automated app/test commit `269f468d`: mobile workflow 40426868694, full build/parity 40426868293, Stash Actions 8/8 LIVE+isolated DEMO configurations at 320/390 dark/light, grid same-row no-overlap assertion. PASS manually inspected four DEMO screenshots for row alignment and no overlap. FINDING: placeholder clipped in four images, materially at 320; fix `3bab1d9a` changes text to `Search…`, newest-head QA pending at 40427570891/40427570879. Physical iPhone Safari, keyboard and VoiceOver NOT TESTED. No release approval.

## 2026-10-26/27 — Final one-row Blend four-way screenshot QA
- PASS full browser/parity `40427570891` for app head `3bab1d9a`, 8/8 Stash Actions LIVE/isolated DEMO cases (320/390 dark/light). Independently inspected four screenshot images: compound + mg + remove share one non-overlapping row; compact `Search…` placeholder visible at all sizes. Artifact `12700422861` complete full-app demo, 21-file LIVE ZIP, source manifest `3f2cb550`. NOT TESTED physical Safari keyboard, VoiceOver, custom name long-string input visual, full historical blend outflow/refund matrix. Mobile `40427570879` pending at check. User original screenshot failure remains historical; no merge/deploy.

## 2026-10-26 — Blend modal overlay, Review and app-wide scroll acceptance
- Physical iPhone screenshot FAIL before patch: combobox results push following form rows, black footer strip, Review lacks hierarchy, scrollbars inside bottom sheet.
- Pending new head test `e130934c`: popup position absolute/no row expansion, max five non-scrollable matches, correct searchable options, Review hero + prominent total mg and two components, transparent action footer, Review/Save backing values and no premature write. Run 320/390 dark/light LIVE/isolated DEMO; capture focused dropdown screenshot and review. Physical iPhone keyboard/VoiceOver and app-wide modal nested-scroll audit NOT TESTED. Never call no-nested-scroll policy globally complete until entire app audited.

## 2026-10-26 — Full-screen Blend follow-up QA
- Commit dd26fdc9 adds Playwright assertions that mobile Blend editor occupies the viewport height within 25 CSS pixels and does not overflow horizontally at 320/390 in LIVE/isolated DEMO dark/light. Alongside prior popup no-row-expansion, max-five suggestion and Review checks, latest CI result still pending. Physical iPhone keyboard, dropdown clipping, VoiceOver and full app-wide nested-scroll audit NOT TESTED.

## 2026-10-26 — Blend floating dropdown / Review / full-screen verified automated evidence
- PASS full build + browser 40428711527 at app/test dd26fdc9; 320 and 390 dark/light LIVE/isolated DEMO, popup absolute positioning (no row expansion), ≤5 unscrollable suggestions, full-height mobile editor viewport geometry, transparent footer, Review hero / 15 mg and 2 components, BAC/cost and original Save, unchanged inventory records pre-save. Independent screenshot inspection PASS visual for all four search and Review variants. Standalone demo storage overridden in-memory and network fetch disabled; 21-file LIVE ZIP valid.
- NOT TESTED physical iPhone keyboard/VoiceOver; **NOT AUDITED** no-nested-scroll principle on other app modals. Mobile run 40428711439 initially pending. The original user-reported iPhone defects remain recorded as PRE-FIX FAIL, not current observed Pass.

## 2026-10-26 — Full-library compound browser QA matrix
- New current-head tests: Blend browse-all opens a full-screen picker with >5 library items, filters BPC-157, selection updates backing .comp-select and returns to same editor. Regular Kit browse-all verifies >5 options, filters GHK-Cu, backing #sname synced, returns to wizard; tests run in LIVE/DEMO at 320/390 both themes. Mobile run 40430545528 PASS; full build 40430545381 PENDING at documentation time. NOT TESTED: physical iPhone keyboard/full-screen safe area, VoiceOver, no-data edge cases and every other app picker. No release clearance until full results.

## 2026-10-26 — Compound browser exact-source QA evidence
- PASS mobile CI 40430545528 and full build/parity 40430545381 on app SHA c7b06b2a; full-source artifact 12702105755 structurally complete and valid, DEMO ephemeral storage. Browser tests of regular Stash Kit and Blend Kit View all -> filter -> select at 320/390 LIVE/DEMO light/dark PASS (CI). Independently repeated 4 Blend DEMO 320/390 dark/light configurations via Chromium set_content: 45 fixture choices in full-screen primary list, BPC-157 search yields one, selection updates backing `.comp-select`, no form teardown. Four 320/390 screenshots rendered. **NOT TESTED:** actual iPhone keyboard/safe areas, VoiceOver, and other selector adaptations.

## 2026-10-26 — Protocol/Plans browse-all expansion awaiting CI
- New tests in `tools/validate-protocol-design.mjs` verify Protocol Stack full library >5, GHK-Cu filter/choose and route/remove recovery; reusable Plans compound multi-select Browse All BPC-157 selection persists as selected pill. 320/390, dark/light, LIVE/DEMO environment checks are queued on newest application test head. Original Stash browser tests retained. Physical iPhone and VoiceOver NOT TESTED; protected dose/vial accounting unchanged by UI code.

## 2026-10-26 — Latest Protocol/Plans browser run verified
- PASS full-browser CI `40432426016`; PASS mobile CI `40432425967`; tested source `471fdeed`. Exact-source artifact 12703425376 downloaded and CRC checked: complete full-app DEMO and LIVE ZIP root structure, all 12 JS ordered. PASS independent Chromium standalone DEMO Protocol Browse All at 320/390 dark/light (4/4): 49 compounds visible, GHK-Cu filter to one, selection returns to Stack. PNG captures saved for each case. This is actual HTML renderer in browser emulation; physical iPhone Safari/on-screen keyboard/VoiceOver NOT TESTED. App-wide no-nested-scroll audit remains INCOMPLETE.


## 2026-10-26 — PR #123 Calendar Logs failure and retest gate
- **FAIL (prior head):** full browser run 40334643538; Logs All-mode selector timed out after synthetic fixture reset. Earlier modules passed but full workflow failed.
- **CODED / NOT YET VERIFIED:** branch commit 7528306 updates fixture-reset test to explicitly restore Calendar Logs subview and assert All Logs mode. Must rerun full CI; no Pass claimed.
- **INCOMPLETE:** new exact-source FULL DEMO and LIVE ZIP artifact inspection, real iPhone Safari 320/390 visual, safe areas, focus and software keyboard interaction, VoiceOver. App-wide nested-scroll audit deferred as its own priority.


## 2026-10-26 — Kit review parity acceptance matrix
- Standard Add Kit Step 3 visible `Review & save` heading, hero and inventory facts: **NOT TESTED after implementation**.
- Blend Step 3 retains component composition and matching review anatomy; new-kit action Save Kit: **NOT TESTED after implementation**.
- Continue/Save button depth, inset, sticky positioning at 320/390 dark/light and iPhone keyboard: **NOT TESTED after implementation**.
- Existing standard/blend save handlers, same vial creation math, history/persistence: source handlers untouched; **functional regression NOT TESTED after implementation**.
- CI pending on source commit 6e0075d; physical iPhone/VoiceOver NOT TESTED. No nested-scroll app-wide pass claimed.


## 2026-10-26 — Standard/Blend Kit review parity follow-up
- **Source reviewed:** standard and blend step 3 both display `Step 3 of 3 · Review & save` via independent existing wizard components; standard has summary hero and two-column facts; blend adds physical-vial component breakdown. Shared CSS addresses 16px footer inset and button states.
- **CODED / CI PENDING:** Both new kit save button captions read `Add to Stash`, while edit remains `Save Changes`. App commits 6bf591d and 4c177db; saved record calculations/handlers unchanged.
- **NOT TESTED:** completed current-head 320/390 light/dark full-browser checks, exact-head full-app DEMO/LIVE ZIP artifact inspection, real iPhone keyboard/focus/scroll/safe-area. Do not infer native keyboard pass from screenshots.
- **OUT OF SCOPE:** app-wide nested scroll audit remains separate unfinished work.


## 2026-10-26 — Kit wizard CI failure triage
- **PASS mobile:** workflow 40440313001 after test-harness update 62d9d1a. Prior app code mobile 40437121414 also SUCCESS.
- **FAIL full-browser:** 40437121849 flagged gradient button as transparent when checking only backgroundColor; corrected assertion to permit non-none backgroundImage. Follow-up 40440313012 exposed opaque Blend footer background and FAILED. Scoped kit footer surface changed to transparent at 93ebdae; latest full-browser rerun PENDING.
- **Artifact partial verification:** artifact 12704174741 zipped 21 files with clean CRC, full standalone DEMO identical to offline ZIP HTML; 17 source text blobs matched GitHub then-current source. Current post-CSS exact-head artifact NOT VERIFIED.
- **NOT TESTED:** physical native iPhone software keyboard, real safe-area interaction and VoiceOver. Local Chromium navigation blocked by environment policy; no invented browser interaction pass. Broader app-wide nested-scroll audit remains separate.


## 2026-10-26 — Latest Kit Wizard visual and CI evidence
- **PASS automated:** mobile 40441021069; previous full-browser 40440638898 passed all 8 Stash Actions combinations including blend wizard steps and final Add to Stash.
- **FAIL historical full-browser:** 40440638898 subsequently failed in Stash Cards because Kit Continue gradient was interpreted as transparent. Test updated at a781431d; rerun 40441021070 PENDING.
- **Visual finding, requires follow-up:** reviewed CI Blend 320/390 dark/light step1, step2, review screenshots from artifact 12705638730; all show readable review content and primary action, but step1/2 footer is placed high with unused bottom viewport. Do not label full visual acceptance PASS.
- **NOT TESTED:** native physical iPhone software keyboard and safe-area behavior, actual VoiceOver. App-wide scrolling audit remains separate.


## 2026-10-26 — Kit currency parity / button inset acceptance pending
- **CODED, NOT YET TESTED:** both standard/blend forms expose expanded currency codes; Blend persists chosen code instead of hard-coded CAD; edits retain currency and historical kit cost, without exchange-rate conversions. New kit defaults CAD. Verify create, review, save, edit and reload for non-CAD values in isolated DEMO.
- **CODED, NOT YET TESTED:** 16px footer inset parity across Standard/Blend stages 1–3 and both themes at 320/390 widths; observe iOS keyboard and scroll. Existing blend composition/count/BAC/vial math and histories must not change.
- **FEATURE LOG ONLY:** app-wide mandatory-field audit; current validations unchanged. App-wide no-nested-scrolling audit separate.
- Last green 40441021070 full and 40441021069 mobile predate currency changes, so do not count as latest-head passes. Physical iPhone native keyboard/VoiceOver NOT TESTED.


## 2026-10-26 — Heading parity verification gate
- Actual user screenshots FAIL old visual parity: standard Add kit was compact letter-spaced/mono while blend title 20px bold. CSS aligned on `2852088a` (CODED; latest visual acceptance pending).
- PASS automated on preceding app source: currency/footer QA 40441896108, mobile 40441896055. Post-typography mobile 40442588421 PASS; full browser 40442588345 NOT VERIFIED at last check. Screenshot acceptance at both 320/390 and themes plus native iPhone keyboard/VoiceOver NOT TESTED after title edit.
- Currency fields/selected non-CAD review/persistence belong to protected regression. Mandatory fields audit and global scrolling audit are independent backlog priorities.


## 2026-10-26 — Kit typography latest source validation
- Full-browser 40442588345 **PASS**; mobile 40442588421 **PASS**. Artifact 12707236994 source manifest 66908fa; outer ZIP, LIVE 21-file ZIP and offline DEMO ZIP CRC PASS; standalone DEMO matches offline ZIP index. Stash Actions and Cards each 8/8 PASS, including 320/390 dark/light.
- Native physical iPhone software keyboard, focus movement and safe areas **NOT TESTED**. Broader nested scrolling and required-field policy remain separate.


## 2026-10-26 — Kit test-result attachment acceptance matrix (pending)
- **SOURCE VERIFIED, NOT TESTED:** existing optional test-result control in both standard and blend kit editors; check Step 2 placement beneath Notes, file picker, 750KB PDF/JPEG/PNG/WebP validation, invalid file handling, replace/remove, and async read/save races.
- **NOT TESTED:** create/edit persistence, kit detail retrieval, backup/export/import restore, storage quota, 320/390 dark/light, physical iPhone picker/keyboard/safe areas. Do not mark PASS based solely on existing code.
- Blend Composition & Dose Analytics future discovery only; verify component math, physical vial deductions and history totals separately. App-wide mandatory fields and nested-scroll audits remain separate.


## 2026-10-26 — Test attachment card screenshot-driven correction
- UI CODING COMPLETE on draft source commits 65ac266 / 7d36813: both Kit Step 2 flows share attachment card with outline icon, title/Optional, explanatory one-line-ish text, full-width Choose file and concise accepted types/750 KB hint. Existing file input and persistence code preserved.
- NOT TESTED: updated-head browser screenshot 320/390 light/dark, tap/focus/screenreader, actual iPhone file picker, PDF/image validation, replacement/removal, save/edit, export/restore and storage quota. Keep separate from broader scrolling audit.


## 2026-10-26 — Kit attachment viewing regression gate
- **CODED/CI PENDING:** Step 2 attached PDF `View file` launches viewer iframe with download action, closes without clearing editor. Saved Stash regular and blend kits with attached image each show View file, launch image and close. Test in `validate-stash-cards.mjs` commit 3f55add.
- **NOT TESTED on physical iPhone:** Safari native PDF rendering in in-app iframe, orientation, document zoom, safe-area, iOS file picker/keyboard, VoiceOver; opening unsupported file should not navigate externally or execute HTML.
- No data migration; attachment stays under existing `testResultAttachment` shape. Broader mandatory-fields and nested-scroll audits separate.


## 2026-10-26 — Kit file viewing / sticky footer tests
- Full browser 40445814585 **PASS**, mobile 40445814594 **PASS** for View file in unsaved standard PDF and saved regular/blend images. Artifact 12707779675 source manifest 7b3ffbe, both ZIP CRC PASS and offline DEMO parity confirmed.
- 320px Blend Step 2 screenshot revealed attachment card partially overlapped by sticky footer. CSS padding and explicit bottom-scroll unobscured test added in commits 708b6d2, f1827eb; **pending rerun**. Native iPhone PDF/keyboard/VoiceOver still NOT TESTED. Global scrolling audit is separate.


## 2026-10-27 — Standard/Blend Step 2 parity regression gate
- User's physical screenshot review found mismatched Cost widths, inconsistent Cost+Currency grouping, label wording, Notes input types, open-vial checkbox treatment and Blend sticky footer overlap. Scoped markup/CSS corrections committed on draft PR #123.
- **CODED, NOT YET PASSED:** automated equal-width (<=2px) Cost/Currency assertions, same-top alignment and TEXTAREA Notes assertions in both Kit browser suites, 320/390 dark/light, LIVE/isolated DEMO. Both share BAC+Expiry, Cost+Currency, Storage, Notes, attachment order. Must verify layout after keyboard opens on physical iPhone and ensure attachment can scroll clear of sticky footer.
- **NOT TESTED** latest native Safari device, backup/restore and VoiceOver. No inventory logic or history changes. App-wide no-nested-scroll and mandatory-fields audits are separately unfinished.

- **CI failure evidence (2026-10-27):** full browser 40448235375 failed new strict Blend equal-width/vertical-alignment assertion. At narrow width, cost/optional label likely wraps differently from currency. CSS fix 9d3e54f reserves matching field-label height. Rerun 40448545857 PENDING; keep FAIL historical until new evidence. Mobile prior run passed.


## 2026-10-27 — Step 2 parity verified on source-matched CI
- **PASS automated:** full-browser 40448545857, mobile 40448545887, 320/390 light/dark LIVE and isolated DEMO wizard suites. Equal-width/label alignment Cost+Currency assertion passed after scoped `min-height:34px` CSS correction. Archive 12708814792: outer/live/offline ZIP CRC PASS and full standalone DEMO matches offline ZIP index. Compared three app-source Git blob SHAs with current branch; equal.
- **OPEN visual observation:** Blend sticky actions obscure top of Test Results card in unscrolled screenshot; browser scrolling test allows card to clear footer. Do not mark physical iPhone visual acceptance PASS without user confirmation.
- **NOT TESTED:** physical iPhone keyboard, focus, native Safari PDF and VoiceOver. App-wide nested scrolling and mandatory-fields audit remain separate.


## 2026-10-27 — Supplies empty-state and CTA regression
- **CODED, CI PENDING**: Stash > Supplies empty view contains only one `#add-equipment` CTA inside accessible card, min-height 48px, consistent lavender button. Source handler continues to call `equipmentModal(null)`. Test across 320/390 dark/light and LIVE/isolated DEMO added in `validate-stash-cards.mjs` commit c6f1085.
- **NOT TESTED**: native iPhone screen/VoiceOver, save/edit/restock/usage-history in populated Supplies; no changes to those workflows. Broader app-wide nested scroll and required field audits remain separate.


## 2026-10-27 — Supplies form & populated cards regression (pending)
- Prior empty-state full-browser 40450450037 FAIL was test-overlay interception; test fixture now dismisses fictional welcome modal before tapping Add Supply. Scoped Add/Edit Supply form/card style and wording coded. `validate-stash-cards.mjs` now checks empty CTA, original equipment form, 44px+ save, sample sealed BAC water card, two inventory actions, and screenshots at 320/390 light/dark for LIVE and isolated DEMO.
- **PENDING** full CI and source-bundle inspection. **NOT TESTED** actual physical iPhone / keyboard / VoiceOver, real save/restock/consumption history end-to-end for latest UI. Do not infer pass. App-wide mandatory-fields and no-nested-scroll audits separately unfinished.


## 2026-10-27 — Supplies visual QA follow-up
- **PASS earlier source:** full-browser runs 40451096484, 40451199358; mobile 40451199390. Artifact 12710184475: 21-file LIVE ZIP and full standalone/offline DEMO parity, CRC PASS; browser output covers 320/390 dark/light.
- **VISUAL FAIL on earlier source:** empty-state screenshots were overlaid by fictitious onboarding modal; status chips cramped/clipped at 320. Fixed screenshot setup and CSS, added button-rectangle test commits 248e1c2 and ef9f6fe. Latest corrected run 40452358905 **PENDING**, do not claim current-head visual pass without reviewing screenshots.
- **NOT TESTED:** native iPhone Safari keyboard, focus movement, screenreader, safe-area; latest UI end-to-end supply save, edit, restock and usage history. Separate mandatory fields, global nested scroll and Kit acceptance priorities unchanged.


## 2026-10-27 — Supplies source-matched visual regression (latest)
- **PASS automated:** full-browser `40452358905`, mobile `40452358894`. Validated artifact `12711520065`: outer 172-file archive and 21-file LIVE ZIP CRC PASS; full standalone DEMO HTML exactly equals offline DEMO ZIP index; 17 Git blob hashes match current draft GitHub application HTML/CSS/JS. Visual screenshot review LIVE at 320/390 both themes: no onboarding overlay in empty screenshot; status choices do not clip; populated primary/secondary buttons legible. Browser test covers CTA click, form and status button dimensions, and sealed sample Supply card.
- **NOT TESTED (real iPhone):** native Safari input focus, virtual keyboard obscuration, safe areas, VoiceOver, Save/Edit/restock/use with persistent real test records, offline restore, and supply history. Do not mark these PASS based on screenshots. Kit physical acceptance and separate global mandatory-fields/nested-scroll audit unchanged.


## 2026-10-27 — First-dose and Protocol/Goal wizard regression (PENDING, DO NOT MARK PASS)
- Verify Today hero includes first occurrence when active protocol begins today on a scheduled weekday, including weekly (e.g. Tuesday) and multi-dose configurations; Protocol first-log CTA and Today agree on due-today count. No artificial dose logs or stock deductions until explicit Save.
- Verify non-scheduled weekday, future start, paused protocol, rest phase, inactive protocol and unrelated zero-dose tracking compounds do **not** inflate Today's count; after logging once, no double count; legacy records and edit history intact. Verify multi-protocol same-compound situation rather than assuming a single protocol resolver.
- Verify New Protocol Schedule at 320/390 light/dark: schedule chips, seven weekday controls, min 44px targets, Start date, dose count/time controls, scroll and sticky Back/Continue/Activate; Save Draft and existing protocol save semantics unchanged.
- Verify Goal wizard at 320/390 light/dark: Start/Target date discoverability, empty Check-In selector disabled with explanatory message and nonempty options retained, Back/Continue/Save, form field persistence between steps, edits and reviews, keyboard/safe area/VoiceOver. No saved data migration. Latest-code CI and device tests **NOT YET VERIFIED**.


## 2026-10-27 — First-dose targeted regression CI outcome
- **PASS automated (source/test head `370a826e`):** full browser/build `40529783789` and mobile `40529783780`. `validate-protocol-design.mjs` now creates an active fictional protocol with no recorded doses and tests Today showing `0 of 1` scheduled; toggles paused status, future start and different weekday and checks they produce `No scheduled doses`. Test data is restored before original suites continue. 8 Protocol matrix combinations (LIVE/DEMO × 320/390 × light/dark) PASS in artifact `12746621222`.
- **Earlier FAIL preserved:** build run `40529630932` failed new assertion due to incorrectly escaped regex, despite fixture evidence `due:0 of 1`; fixed in `370a826`, rerun PASSED. No claim of real-device testing or broad protocol scheduling proof: multi-dose/overlapping protocol, first-dose inventory absence and legacy backup/restore require further targeted acceptance.
- **NOT TESTED physical iPhone:** native date/time pickers, keyboard, sticky footer, Goal no-connection state and VoiceOver for changed wizard screens. No live data tested/written.


## 2026-10-27 — Expanded first-dose + wizard mobile regression (PENDING)
- Source test `tools/validate-protocol-design.mjs` at `8771ce94`: two distinct active protocols with zero logged doses, 2+1 occurrences due today; third active tracking-only compound excluded; rest phase removes its occurrence, and rendering Today does not mutate recorded doses/protocols. Check 8 combinations (LIVE/DEMO × 320/390 × light/dark). This is **not** a test of two protocols sharing one compound; shared-compound overlap remains an unresolved risk in `protocolForData` which selects the first match.
- Added automated controls audit: Protocol Schedule step 4 Start date, Back/Continue, schedule chips/day/time/dose count at 44px; Goal step 1 target date label/calendar discoverability and step 3 optional symptom connection with no-history empty state; field persistence through steps. Browser CI and physical iPhone acceptance **NOT YET VERIFIED**. Do not mark PASS based on prior source.

- **Fail/correction 2026-10-27:** full browser `40532933798` FAIL new rest-case assertion (3 slots instead of expected 2) because test manually wrote `{type:'rest'}` to compound phases, whereas app canonical sync uses `{isRest:true}`. Corrected fixture at `87044e09`. This is a test-data representation error, not evidence of a production rest-phase calculation defect. Latest corrected CI pending; preserve historical FAIL.


## 2026-10-27 — Preview-vs-code discrepancy and real Protocol sync scenario
- User reports Today still says no scheduled doses in the preview while Protocol shows first-log. This is a **reported fail on the current viewed preview**; deployed preview source SHA has not been verified, and the newer draft branch was not deployed there.
- Code refinement `aa8472b` allows qualifying no-dose first occurrences from active **or in_progress** linked protocols rather than active-only. Test `ef7eb116` constructs a weekly activated Protocol and calls the actual `syncProtocolToCompoundData`, verifies Today first due and no synthetic dose, then changes status to `in_progress`. **PENDING CI**. Also preserve paused/future/wrong weekday, 2+1 distinct protocols, rest phases and Goal/Protocol wizard 320/390 test matrix.
- Cloudflare preview deployment/unverified stale bundle: NOT TESTED from code CI. Physical Safari, local user data and overlapping multiple protocols per compound remain NOT TESTED. No merge/deployment.


## 2026-10-27 — Goal ellipsis quick-status regression (PENDING)
- Browser `tools/validate-plans-hierarchy.mjs` tests quick status options Planned/In progress/Paused/Completed, >=44px options, selected ARIA state, save/resume to Active, preserved goal identity and linked Protocol/Check-In/dose records, plus existing edit/delete and Goals list. Run LIVE/isolated DEMO × 320/390 × light/dark. **NOT YET VERIFIED** current-head browser or mobile CI, physical iPhone tap/keyboard/safe area/VoiceOver, persistence after app restart. No data migration. Keep previous source passes separate.

- Protocol first-log visual pass pending: check neutral first-log label, lavender 44px primary action, correct text contrast at 320/390 in light/dark, same handler opens Log Dose and preserves drafts/source/inventory. Source assertion only is not visual/device QA.


## 2026-10-27 — Today header grouping (PENDING)
- In LIVE and complete isolated DEMO at 320/390 light/dark, assert only one bell, Profile and theme button in `.nx-today-header-actions`; all >=44px and vertically aligned with no horizontal overflow; bell opens Needs Attention overlay, Profile navigates, theme changes and back; alert count remains readable and profile update dot visible. Verify other screens' header controls unchanged and no saved data mutation. Browser assertion committed in `tools/validate-protocol-design.mjs`; latest CI PENDING. Physical iPhone narrow/large font, accessibility focus/VoiceOver and safe-area appearance NOT TESTED.

- **FAIL observed** run `40536801200`: `Goal quick status target undersized` on new action sheet test; mobile run `40536801121` SUCCESS but did not gate this case. Fix commit `1011a58b` enforces 46px min touch target; CURRENT-HEAD browser/visual validation pending. Preserve failure evidence.

- Goal status touch target: browser run `40536801200` FAIL on rendered button height (below 44px); fixed scoped 48px modal rule `6dec6a49`. Await current-head browser measurement PASS at 320/390 dark/light; do not silently upgrade historical failure.


## 2026-10-27 — Log Dose Review + optional Observations (PENDING)
- LIVE/isolated FULL DEMO × 320/390 × light/dark: open Log Dose with long kit/vial IDs, confirm primary Review displays human source without numeric identifiers, use `Source identifiers` disclosure to inspect exact kit/vial IDs; opening Review must not save dose or deduct inventory. Multi-vial per-source IDs are preserved; test prepared source, no open vial and edit. Long text wraps without horizontal overflow.
- Confirm Observations collapsed for new Quick Log, accessible 48px summary, opens symptoms + notes + escalation, retains content across review/back and save/edit. Guard existing `validate-logdose-ui.mjs` real dose confirm/edit original ID, multi-vial insufficient stock, source chooser, drafts, prior inventory deductions and history; NEVER mark PASS without current-head CI and manual evidence. iPhone native keyboard / VoiceOver NOT TESTED.

- **FAIL and correction:** build run `40539787972` failed at legacy multi-vial assertion expecting raw numeric kit IDs in Review (`validate-logdose-ui.mjs:129`). New UX instead shows IDs under Source identifiers; actual allocation and authoritative save remain unchanged. Corrected test at `58d226b` validates both per-vial IDs in disclosure and source rows in review. Rerun pending; prior FAIL preserved. Do not label latest browser PASS until verified.


## 2026-10-27 — Supplements and source-detail DS2 test matrix (PENDING)
- Verify Profile Supplements retains all entries/search/remove/history, Add is 44+px lavender both themes, obsolete Notion import absent. Inline Supplements logger with empty catalogue: create name, select, deduplicate case-insensitively, do not log as taken until explicit Save; confirm correct date, edit existing log, and Check-In selected supplements remain intact. Browser fixture added to `validate-checkin.mjs`; current CI pending, no PASS claim.
- Stash > Vials: opened status, details and ellipsis aligned, history/remaining values retained, responsive light/dark 320/390 and no horizontal overflow. Prepare Dose source details: long 'Current vial' wraps, amount field small but 44px tall, multi-source buttons/actions accessible, no automatic/double deductions, draft + open next vial + partial draw preserve IDs/math. Physical iPhone keyboard, safe area, focus and VoiceOver NOT TESTED. No data migration.

- **FAIL** run `40542480271`: `node --check assets/js/05-nexus.js` unexpected `}` at line 2503 from leftover empty-catalogue redirect; fixed source `02b75a2c`. Browser Supplement, Prepare Dose and Stash cases NOT TESTED by failed run. Pending rerun; preserve failure.

- Added Check-In empty-supplement-list fixture: inline Add visible, adding name updates catalogue and selection without creating a taken log before explicit Check-In Save. Browser test `36b81eea` pending current CI. Confirm that future date edits do not overwrite another day's supplement log and persistence works after reopen.


## 2026-10-27 — Physical Safari screenshot follow-up (PENDING)
- Validate search typed `Vitamin` displays matches immediately below Browse all, not below Add. Order: search, Browse/Results, Selected today, Add new. Confirm empty-catalogue inline Add still works, duplicates select rather than duplicate, prior daily supplement history retained, light/dark and 320/390 without double-scrolling.
- Validate Log Dose editable `Source 1` shows human-readable compound/vial label and no long kit ID. `Source identifiers` expands to exact Kit/Vial IDs, collapsed by default. Multi-vial rows have distinct traceable identities; editable draw amount/units/confirm/remove functionality and vial allocation/save history unchanged. Physical iPhone latest preview QA NOT TESTED. New source and DOM tests are not evidence of production deployment.

- `validate-logdose-ui.mjs` at `ac503930` tests actual editable row readable label and collapsed exact Kit ID, prior to dose Review; user screenshot raw ID FAIL should not be promoted to PASS without current browser test and iPhone preview confirmation.

- Added multi-kit assertion `ad5722ab`: two same-compound kits must render distinguishable `Kit 1` and `Kit 2` labels, with no raw storage IDs in primary editable rows; exact ID still accessible in optional source identifiers. Browser run PENDING, physical Safari not confirmed.

- **FAIL** `40548324241`: test incorrectly required detailed allocation rows for a single-vial dose, though those rows appear only when additional allocation is needed. Correction `1d0d95a3` moves ID-disclosure assertion into multi-vial case. Preserve failed-run evidence and await corrected CI before PASS.


## 2026-10-27 — Browser correction and preview acceptance status
- Automated full build/browser `40549029521` **PASS** and mobile `40549029721` **PASS** at app head `e743c2fd`. Fixtures include LIVE/isolated full DEMO at 320px/390px in dark/light, supplement order search → Browse/results → Selected → Add new, first empty-catalogue creation and no auto-log, source-row multi-vial readable labels/kit ordinals, exact IDs in disclosure, single/multi-vial deduction and record identity preservation.
- Previous browser `40548324241` **FAIL**: source details wrongly expected on single-vial default; correction `1d0d95a3` targets genuinely expanded multi-vial details. Preserve failure, don't misclassify as app bug.
- Cloudflare bot reports preview commit `e743c2f` deployed successfully to `https://fd8194f6.nexuspeplog.pages.dev`; this is not independent browser-content hash parity. Physical iPhone review **NOT TESTED**. CI's primary production parity intentionally failed because production hasn't been updated.


## 2026-10-27 — Unified supplement picker + dose disclosures, latest-head gate
- **PASS (automated limited):** Mobile form regression 40555517593 on `f39458e7`; full build 40555517407 completed Check-In 8/8, Protocol 8/8 and vial source safety 8/8 (48 assertions) before Log Dose stage.
- **FAIL (historical, test DOM assumption):** full browser run 40555517407 expected `.nx2-source-identifiers` nested inside allocation row. In source the disclosure deliberately follows the action row as a sibling; correct locator committed `e14d78e3`. Do not infer latest full suite PASS until rerun.
- **PENDING tests:** LIVE/full isolated DEMO × 320/390 × both themes; searchable filtered supplements; Add only when no exact match; case-insensitive duplicate selection; no auto taken log; date-specific re-edit; keyboard and VoiceOver; collapsed/expanded Observations retain intensity/notes and edits; full-width Source identifiers no clipping with long labels; exact source IDs and single/multi-vial deduction/insufficient stock; artifacts/source matched; physical iPhone Safari and actual preview commit parity.
- Production unchanged; no real user data tested.


## 2026-10-27 — Current-head CI completed
- **PASS automated** at `63a6a863`: mobile `40557050089`, Hybrid Preview `40557040475`, release/full browser `40557050146`.
- Full-browser tested LIVE + isolated DEMO, both 320/390 widths and light/dark: Check-In, Protocol, vial-source core (48), Log Dose E2E (40 flows), combo search (50 fictional compounds), Stash, chevrons, blend, Plans. Measurement math diagnostic 80/80 PASS, no claim of clinical validation.
- Artifact `12758495941` contains full DEMO HTML, offline DEMO ZIP and LIVE ZIP. GitHub Actions source_commit uses synthetic PR merge `bdd95f87`, not raw branch head. Byte-level file comparison to branch head remains an additional gate.
- **NOT TESTED:** physical iPhone real Safari, native keyboard/safe area, VoiceOver, actual user's production data, full site WCAG AA, independently fetched Cloudflare preview asset hash. Contrast audit emitted multiple low-ratio candidates in light theme; investigate rather than claim full compliance.


## 2026-10-27 — Separate Record Reaction test gate (PENDING)
- New dose form must not expose old Observations, while legacy saved symptoms and notes remain editable. Saved-dose Edit must expose Record Reaction independently; records link to same dose ID, distinguish observedAt/recordedAt and preserve intensity, notes, multiple reactions. Saving reaction must not create dose entry, alter vial inventory, source allocations, schedules or original history. Reopening dose Edit after reaction must preserve saved reaction history.
- `tools/validate-logdose-ui.mjs` test code added for fresh/save/edit/reaction/re-edit and unchanged vial deductions. Current-head CI not yet verified, do not mark PASS. Browser 320px/390px light/dark, keyboard/safe area/VoiceOver, combo/blend historical edits, exact-source DEMO/LIVE packaging and physical iPhone acceptance remain gates.


## 2026-10-27 — Log Dose header scroll regression correction
- FAIL (physical Safari before fix): header, close control and Quick/Guided segment disappear when scrolling within long Log Dose form; old preview 9c06830d, user screenshots.
- PASS (automated): current fix/test commit 04530905, mobile workflow 40562669101 and full release/browser QA 40562669018. New E2E guard asserts mode switch and header are separate from scroll body and available after scrolling. Artifact 12761377615, 320/390 light/dark suites successful.
- NOT TESTED: corrected immutable Cloudflare preview 4da04e4e in real iPhone Safari with on-screen keyboard, viewport zoom, Guided mode step switch and VoiceOver; no independent served asset hash parity. Production unchanged.


## 2026-10-27 — Physical Safari Log Dose orphan-button / clipping incident
- FAIL (real device and web screenshots): preview before HTML repair showed orphan chevron/close button between header and Dose source; source/administration cards misplaced, curved edges and footer scroll clipping. This supersedes prior green CI for this specific layout.
- ROOT CAUSE: extra closing div in dose modal markup closed .nx-dose-head before #x; moving header out of .nx-dose-scroll also exposed malformed DOM nesting. Fixed code at 310ccb01, strengthened E2E guards at b61052cc for direct child header/close, scrolling section ancestry and bounding-box separation.
- Mobile regression workflow 40566073856 SUCCESS for branch head a909e16. Full browser/artifact workflow 40566074048 running as of last check; no physical retest yet. Cloudflare bot reports branch preview 99754367 for a909e16; independently fetched asset bytes unverified.
- PENDING real-device acceptance: exact preview shows x in header, no orphan control, source and administration cards fully rounded and aligned, one vertical body scroll, bottom review/actions unobstructed, keyboard and Quick/Guided switch work.


## 2026-10-27 — Direct reaction access tests
- **PASS automated on 9d8ad41e:** mobile workflow 40569192074, full build/browser workflow 40569192089. Calendar direct Record reaction path opens independent editor; timestamps, multiple reactions, dose ID and no inventory changes are asserted on fictional fixtures, including re-edit preservation.
- **ADDED / latest CI PENDING:** commit 85afbd03 tests independent saved-dose retrospective Record reaction, third appended event, unchanged vial count, and legacy note preserved across dose edit in 8 LIVE/DEMO x 320/390 x both theme configurations. CI 40569926373 / 40569926374 not yet cleared.
- **NOT TESTED:** real iPhone Safari, keyboard, VoiceOver, real production records; Cloudflare source asset hash parity. Draft PR #123 unmerged.


## 2026-10-27 — Direct reaction latest app/test full QA PASS
- CI 40569926374 (mobile) SUCCESS; 40569926373 (full) SUCCESS at app/test head 85afbd03. Browser log: Log Dose E2E PASS 8 LIVE/DEMO 320px/390px light/dark configurations, 64 flows, including three independent timestamped reactions, direct Calendar and retrospective entry, preserved old notes, no duplicate dose and no inventory deduction. Other core suites passed; calculator math diagnostic 80/80 not clinical validation.
- PASS (CI package validation): full-app standalone fictional DEMO, offline DEMO ZIP, complete LIVE ZIP uploaded as artifact 12765770553. Cloudflare bot preview commit a783546 reported successful https://32aef596.nexuspeplog.pages.dev; independent HTTP hash parity NOT VERIFIED.
- NOT TESTED: physical iPhone Safari, real keyboard/VoiceOver, actual saved production data and full WCAG AA. User acceptance remains pending; production untouched.


## 2026-10-27 — Compound details completed-dose render regression
- FAIL (user screenshot): compound View details crashes with ReferenceError fmtT is not defined, replacing screen with global render error.
- ROOT CAUSE: fmtT scoped inside getDoseStatus but invoked from renderCompoundActionArea taken_today branch in assets/js/07-nexus.js. FIX e5bb5d93 uses local toLocaleTimeString equivalent at call site.
- Added browser guard at commit 7097d07c exercises taken_today completed-dose markup with fictional 3:03 PM dose in every LIVE/DEMO 320px/390px dark/light E2E case. Current-head CI PENDING, and physical Safari acceptance NOT TESTED. No production change.


## 2026-10-27 — Today one-tap Record reaction gate
- New completed-dose Today action must display Record reaction linked to the correct persisted dose ID, with More actions still functional; if no dose ID exists do not show stale link. Button must open standalone reaction editor without editing dose or deducting inventory. CSS wraps at 320px and uses 48px target. App commits 55232dd9/e8d5e762/2a1038e0; new browser assertions 6142ff10/305481bc.
- PENDING: latest LIVE/DEMO 320/390 themes CI, correct click routing, responsive physical iPhone visuals, keyboard and VoiceOver. Existing Calendar/History/retrospective history, multiple reactions and vial balances protected by earlier passing automated suites. Do not infer production release from preview.


## 2026-10-27 — Today/Active/Completed/All filter test matrix
- New browser test e8c685fa: Completed view includes a recorded dose today with Record reaction bound to its ID, excludes an old historical-only dose, while existing full suite protects doses, logs and inventory. New-head QA PENDING; DO NOT mark PASS yet.
- Manual acceptance NOT TESTED: top tabs switch with clear selected state; 320px/390px dark/light fit without clipping; Today retains needs-action plus completed today; Active/All unchanged; Coming up remains below with functioning Calendar drill-down; correct completed-dose reaction form and keyboard. No real production data tested.

- Regression discovered: workflow 40583259646 FAILED in new Completed-tab test because a dose recorded today was not listed by status-only filter. Changed filter at ebd66e42 to include records whose canonical doseDayFor equals today, independently of remaining schedule status (supports multiple daily doses). Fresh CI pending; prior PASS claims do not supersede this failure.


## 2026-10-27 — Completed and Coming up browser gate expanded
- Full QA 40583699831 FAILED at Completed tab action assertion after ebd66e42. Analysis: test searched for Record reaction in *collapsed* compact card, but app deliberately displays the action only in expanded View Details. Adjusted test dff7ea52 to assert collapsed disclosure and expanded Record reaction, plus historical-only exclusion. Added 79c7bd35 browser test for top Completed presence, top Upcoming absence, lower Coming up and working Calendar navigation. New-head CI pending; physical iPhone not tested. Retain failed-run record for traceability.

- Browser 40585053600 FAILED added Coming up Calendar click: Playwright reported fixture onboarding modal intercepted pointer events; prior Completed expanded-card assertions cleared. Browser fixture correction at 3d4ae796 removes stale onboarding overlay only within test before clicking link. Fresh run PENDING; physical Safari still NOT TESTED.


## 2026-10-27 — Current Completed and Calendar QA CLEARANCE
- **PASS automated**: fresh app/test commit 3d4ae796; full/browser 40585602137 SUCCESS, mobile 40585601628 SUCCESS. Log Dose browser E2E 8 LIVE/DEMO × 320/390 × light/dark, 96 flows; Completed includes today record with expanded Record reaction, excludes historical-only record, Coming up section retained and View Calendar click changes to Calendar. Vial core 48 safety assertions, math diagnostic 80/80 (not clinical validation).
- Full source-built LIVE ZIP, complete isolated standalone DEMO HTML / offline DEMO ZIP uploaded in artifact 12771971424. Previous browser failures 40583699831 (test expecting expanded action in collapsed card) and 40585053600 (fixture onboarding blocked Calendar) resolved in test; history kept.
- **NOT TESTED** physical iPhone Safari interaction, keyboard, VoiceOver, real production records; Cloudflare served-file hash parity. PR #123 unmerged, primary production unchanged.


## 2026-10-27 — Reaction edit/delete test gate
- Targeted browser test 6a34b432 checks optional post-save invitation, edit preserves reaction identity and recorded timestamp, deletion removes one event after confirmation, and no change to original dose or inventory. Mobile 40590709765 PASS. Full browser 40590709842 pending; iPhone and VoiceOver NOT TESTED.


## 2026-10-27 — Reaction invitation and individual event management QA GREEN
- PASS automated: app/test head 6a34b432, full 40590709842, mobile 40590709765. Browser E2E 112 Log Dose flows in eight LIVE/DEMO viewport/theme combinations, including optional post-save invitation, reaction event edit preserving ID/recordedAt, confirmed delete of one reaction, unaffected sibling reactions, original dose ID and vial balances. Source-built full LIVE ZIP + isolated full-app DEMO artifact 12773443866. No actual production data.
- NOT TESTED: physical iPhone Safari with on-screen keyboard, VoiceOver, independent Cloudflare served-asset hash parity; native reminder notifications NOT IMPLEMENTED. PR #123 draft/unmerged.


## 2026-10-27 — DS2 unfinished scope (user correction)
- OPEN / NOT ACCEPTED: Profile Supplements remove personal Notion import UI and dependent handler safely; Add action color consistency; inline Check-In supplement creation including empty catalogue, search/browse, no duplicate and no save-before-confirm; date-specific historical records must survive.
- OPEN / NOT ACCEPTED: Stash segmented tab selected corners at 320/390 light/dark, Prepare Dose multi-source amount fields fit and keyboard avoidance, opened-vial status aligned with vial header/actions; source selection/allocations and saved vial balances unchanged.
- Prior implementation notes are NOT full physical-device acceptance; focused browser and iPhone tests required before closing. Mandatory-fields and app-wide scrolling audits follow afterward.


## 2026-10-27 — Stash Overview/Vials/History pill corner regression
- User-provided physical iPhone screenshot FAIL: selected Overview ends in square underlined lower edge despite rounded container. Source cause legacy `assets/css/nexus.css` `.nx-kit-detail-panel .nx-stash-tab` `border-radius:0!important` and selected `border-bottom:2px` overrode hybrid rules. Targeted CSS candidate 135848e adds stronger scoped selected round radius, removes underlining; browser test e97a2d5 checks computed top/bottom radii and bottom border in LIVE/DEMO 320/390 light/dark. Mobile CI 40600422891 SUCCESS; full browser 40600422694 PENDING at recording. Device retest NOT TESTED. Keep Draft PR #123 and production unchanged.


## 2026-10-27 NEW STYLING GATE: dfe4df01 CSS-only changes. NOT TESTED current-head: Stash selected bottom corner/border, Trends accordions/ranges/library/drilldowns, Profile subtabs/settings/back, 320/390 both themes, iPhone/VoiceOver, full LIVE/DEMO parity. No claim of PASS; preserve history, supplements, storage, doses, vial math, and accepted Calendar/Plans/Supplies.


## 2026-10-27 DS2 new-head gate bd26e3d6: NOT TESTED at commit: Nexus Ask/Journal/Learn/Explore selection, assistant/user message contrast, suggestions, keyboard compose, Settings detail/back, privacy/backup, Stash selected pill, 320/390 dark/light and physical iPhone. Full/browser and mobile prior dfe4df01 PASS workflow statuses; no assumption of UI acceptance or new head PASS. Protect backups, stored history, math and user-accepted Calendar/Protocol/Supplies.


## 2026-10-27 STASH/DS2 EVIDENCE: Stash rounded-pill code guard e97a2d5 branch browser workflow 40600422694 SUCCESS, mobile 40600422891 SUCCESS. Following Trends/Profile styling dfe4df01 full workflow 40601194237 SUCCESS with browser QA 320/390 light/dark and artifacts, mobile 40601194692 SUCCESS. Exact rendered Stash pill screenshot and native iPhone acceptance not independently inspected in this session. New Nexus/Settings bd26e3d6 workflows pending; do not count earlier passes as current-head.


## 2026-10-27: New styling 9ed589e6 NOT TESTED: Nexus Learn/Explore/Journal details, More, Settings backup/privacy and 320/390 light/dark. Prior bd26e3d6 full/mobile workflows PASS; do not infer current-head pass. Production data, history, math and accepted Calendar/Plans/Supplies untouched by intended CSS.


## 2026-10-27 DS2 child QA gate: SOURCE-CODED fdc1d608 and 81adc534, not yet regression PASS. Verify Nexus Journal filter/search/entry open, Explore item navigation/disabled, Learn search/detail/back, More sheet four links/close/backdrop/scroll, Settings unit/health/backup/data management/developer controls, 320/390 both themes, no horizontal overflow; check check-in/dose and all backup/storage protections. Old Insights routing maps to Ask; record as source finding, not a validated fix. Physical Safari and VoiceOver NOT TESTED. Global polish intentionally LAST.


## 2026-10-27 recursive surface audit (documentation-only): DS2_SCREEN_COVERAGE.md records nested route paths and requirements for 320/390 light/dark, back stack, editor/empty/error/confirm states. No route-level browser screenshots or manual tests executed in this checkpoint. All deep routes NOT TESTED, despite older primary-screen CI passes. Never test backup/import/reset against real user storage.

## 2026-10-27 — User physical iPhone screenshot audit: Log Dose action hierarchy and inventory blocker
Evidence: three user-supplied screenshots of Cloudflare preview `e1d12e64.nexuspeplog.pages.dev` (actual browser screenshots, not automated traversal). Compound selection → Quick Log entry → Review. Findings to verify against exact preview source: (1) violet primary button fill differs between "Continue to dose log", "Continue" and "Confirm Log"; (2) Back control appearance/layout varies between stages; (3) selector X is bare but Log Dose X is boxed; (4) review date shows raw ISO `2026-10-27T21:44`; (5) review right-column values are cramped and long strings can collide; (6) CRITICAL POSSIBLE LOGIC/INVENTORY ISSUE: review shows 300 mg recorded amount and selected open vial "10.00 mg remaining". Need establish whether source can deduct from other vials, stale stock, or missing insufficient-inventory guard before allowing confirmation. Do not infer cause or change math without reproduction. Screenshots demonstrate design differences, not proof of a broken deduction.
**Action taxonomy proposed for audit, not yet implemented:** Primary = one high-emphasis filled lavender treatment for forward/commit; Secondary = low-emphasis outlined/surface Back/Cancel; Destructive = distinct warning/confirmation and never primary lavender; Tertiary = text/ghost contextual; Close = consistent icon-only 44px hit target with unobtrusive surface; Disabled = reduced contrast without suggesting active state. "Confirm Log" may use same primary visual as Continue but requires stronger confirmation copy and validation, not a random colour change. Modal-specific density may differ only with documented rationale.
**Coverage expansion:** inspect ALL tabs and recursively opened subpages, drawers, dialogs, wizards, sheets and nested confirmation actions. Record each button label, semantic role, visual treatment, hover/pressed/disabled state, screenshot path and DS2 parity. Test 320px/390px light/dark and scroll/back/keyboard, plus independent real iPhone. Do not equate passing main-screen CI with child acceptance.
**Status:** SCREENSHOT FINDINGS / NEEDS REPRODUCTION. Automated nested-navigation screenshots NOT RUN this checkpoint; no code fix validated. Treat 300mg-vs-10mg as a safety/regression blocker until explained. No merge/deploy.


## 2026-10-27 NEW USER EVIDENCE / TEST GATE: branch-preview Log Dose screenshots at 21:44 show chooser/step1/review inconsistent action fill; Review displays recorded 300 mg alongside selected vial 10.00 mg remaining, full allocation unknown from screenshot. Test with isolated fixtures: 10 mg sole open vial + 300 mg requested must not save; multi-vial sufficient allocation must allocate correct total; edit must preserve original deductions and drafts. CSS afced369 code changed only rendering colours/shades; validate first-entry chooser/Quick/Guided, continue/back/confirm, 320/390 light/dark and touch footer. New deep screen screenshot runner 4c24b27 NOT EXECUTED. No manual/browser/device PASS granted.


## 2026-10-27 — Log Dose review correction 03d83f64 (DRAFT)
Source review found original non-blend Save path validates plan totals and available open-vial quantities, rolls back partial deductions upon shortfall and shows an error; screenshot alone did not prove dose was saved. The earlier review UI displayed only a selected vial balance, potentially misleading for a multi-vial dose, and unformatted ISO date. Commit 03d83f64 adds a review-stage warning when current plan/selected vial is short and formats date/time for readability. Underlying save, source allocation, inventory math and stored records unchanged. CURRENT-HEAD JS/browser and modal screenshot verification PENDING; caution: warning is informational, save guard remains authoritative. 320/390 light/dark nested screenshots and all action-style taxonomy review INCOMPLETE. PR #123 draft, production untouched.


## 2026-10-27 DEEP SCREEN CI: new GitHub Actions workflow a08f62f9 run 40617435379 queued at check. Scope screenshots and button computed properties across root and nested Settings/Nexus route states 320/390 light/dark. No completed test evidence yet. Log Dose chooser button shading updated d7a45b4b, step button normalization afced369; visual acceptance pending. Inventory scenario 300mg and sole 10mg source remains NOT TESTED.


## 2026-10-27 CRITICAL AUDIT EVIDENCE CORRECTION
Downloaded GitHub Actions artifact 12785791789 from run 40617435379 (92 PNGs and action-inventory.json). Direct inspection of 320-dark-settings-backup and 390-light-nexus-ask shows FIRST-RUN 'Welcome to Nexus' ONBOARDING MODAL covering intended routes. Inventory 972 buttons and 65 background/radius/shadow combinations therefore includes obstructed views and CANNOT certify 23 child routes or button hierarchy; 0 overflow is likewise not sufficient. Existing script used localStorage.clear() and failed to dismiss onboarding. Fix commit 279703c1 tries Skip and explicitly fails if overlay persists; re-run and inspect screenshot pixels before any PASS. Further need full action/modal traversal, isolated 300mg/10mg save guard test, button role taxonomy. No user data touched, no merge/deploy. ONE NEXT ACTION: verify fixed audit workflow run and inspect unblocked child screenshots; if blocked, set up fictional local fixture using actual onboarding flow.


## 2026-10-27 FALSE-GREEN QA CAUGHT: initial new nested screenshot workflow 40617435379 SUCCESS operationally but screenshots NOT VALID for child appearance because welcome/onboarding sheet covered foreground. 92 images, 0 script errors/overflow, but visual coverage failed. Test fixture fixed in 48e3293b, run 40617673780 queued. No user-screen PASS until overlay-free evidence inspected. Preserve previous automated main-screen checks separately.


## 2026-10-27 additional test gate 49271c54: Settings Data Management destructive rows require danger tone distinct from neutral navigation in 320/390 both themes; must verify that click still opens existing confirmation, never trigger real delete. Corrected screenshots 48e3293b still in progress. All visual acceptance not yet passed.


## 2026-10-27 CORRECTED EVIDENCE: after first invalid overlay-covered screenshots, fixture 48e3293b now closes onboarding only in isolated localhost. Latest e00d802a nested run 40618241161 SUCCESS, 92 images inspected: 0 runner errors and 0 document overflow; four primary actions computed same #C6A6F2. Mobile regression 40618241156 SUCCESS. Does not prove modal action handling, keyboard/back, user data math or physical Safari. Inventory 300mg vs 10mg still NOT TESTED, block release claims until checked.


## 2026-10-27 EXPANDED MODAL QA new script 528b3da1: six non-mutating opener screenshots for Log Dose chooser, Add Goal, Add Kit, Pattern Explorer, Symptom Timing and Import Backup; tests 320/390 both themes, button computed styles and horizontal overflow. Run 40618782970 pending at first check. No real import/delete/reset, no inventory transactions or physical iPhone checks. Browser script FAIL must not be relabeled as app FAIL without diagnosing selector/fixture.


## 2026-10-27 expanded nested QA correction: first 116-case audit 40618782970 FAILED ONLY four Settings Import cases; source shows #nx-import-open triggers native file input click, not a DOM sheet. Excluded from screenshot-only modal requirement (1d1d9679). 112-case audit 40619001108 SUCCESS; none of these click any save/delete/restore. Additional semantic assert a00109b2 for primary CTA colours #C6A6F2 and informational Done neutral; latest run pending. Physical iPhone and actual allocation test Not Tested.


## 2026-10-27 EXPANDED NESTED PASS (LIMITED): run 40619363394 succeeded; 112 rendered screenshot captures and computed button checks, 0 capture errors/horizontal overflow, expected primary lavender and neutral informational Done in 320/390 dark/light. Mobile run 40619363338 SUCCESS. This only tests route states and 5 safe opener dialogs; 300mg selected against 10mg remaining, save/rollback/vial ledger, populated Quick/Guided/Review, native import, destructive confirmation, keyboard/back interactions and real iPhone remain NOT TESTED. Do not equate with global DS2 acceptance.


## 2026-10-27 — Isolated fixture validation REQUIRED, new test coded not passed
- DS2 browser audit must use local-only fresh context, populated fictional Demo Mode and explicitly fail when fixture missing or a target child route did not render. Commit aaaca022; screenshot/role audit pending run.
- Role inventory must distinguish primary / secondary / destructive / selection / disabled / unclassified. Count same-role appearance variants and inspect context before deciding defects. Screenshot runner must not interact with production, delete, import or save data.
- Prior 112 screenshot run 40619363394 PASS applies to empty/default route capture only, not the new fictional-populated gate. Physical iPhone, nested editor flow, Log Dose 300mg-10mg allocation block NOT TESTED.


## 2026-10-27 REACHABLE FICTIONAL FIXTURE AUDIT: first new fixture run 40619846887 FAIL for 4 App Updates route checks (320/390 light/dark), due to test assuming shared Settings back control while source uses dedicated #au-back. No evidence of app failure. Test corrected d66fd3e1; run 40619990770 pending. Other routes captured on fictional Demo Mode; role audit records per-screen computed styles. Do not claim complete child acceptance, save safety or real-device verification.


## 2026-10-27 Full source-built CI proof: workflow 40619363343 SUCCESS and downloaded manifest 387e32814bd4320d3313b8d8dc7e93079e0d573a; browser 8/8 PASS; Log Dose end-to-end 8/8 PASS including insufficient open-stock cannot save partial; vial safety 8/8 PASS including 2-source insufficient and reversal; measurement 80/80 PASS, Check-In automated create/edit/intensity/date fields all reported PASS. Deep screenshot workflow 40619363394 PASS 112 views, zero overflow/errors and semantic CTA assertions. This is synthetic data, not the screenshot's exact 300mg on 10mg case or physical iPhone confirmation. Native file chooser/restore, destructive app actions, all nested editor states and saved user data unchanged (not exercised). Keep open until separate tests.


## 2026-10-27 FINAL FICTIONAL-DATA EVIDENCE
Local-only built-in Demo Mode run 40619990770 SUCCESS: 112 screenshot route/action states at 320/390 light/dark; verified 2 fictional kits, 54 check-ins and 27 doses; zero capture errors or document overflow. Semantic action-role breakdown in docs/design/DS2_BUTTON_ROLE_AUDIT.md, commit fcbf5bf3. Current review does not cover all editor paths, native file import, 300mg-versus-10mg source safety, real iPhone or full-app artifact release. Mobile CI 40619990814 SUCCESS. No production deployment/merge.


## 2026-10-27 new targeted test (not yet PASS): isolated fictional Demo Mode one-vial 10mg source with 300mg request → no history/inventory change, followed by 2mg valid control → one saved dose, 8mg remains. Test script de42c0f3 and CI workflow 86e09376, run 40621540795 pending. Does not exercise multi-vial, prepared dose, dose edit, real user data or actual iPhone.


## 2026-10-27 Verified single-vial save-path QA
Run 40621540795 SUCCESS for isolated localhost fictional Demo Mode UI Log Dose regression: 300mg requested with only 10mg available did not save or deduct; valid 2mg added one dose and left 8mg. No production storage writes. This is limited to one open vial, 390px Chromium; multi-vial, prepared-dose, edits and physical iPhone remain NOT TESTED. Detailed role audit updated at docs/design/DS2_BUTTON_ROLE_AUDIT.md. PR #123 draft/unmerged and not deployed. NEXT ACTION: add multi-vial and prepared-dose tests, then expand nested action classification.


## 2026-10-27 — Action hierarchy and Protocol first-log QA pending
Test visual CSS fb05e322 and 5f0be242: Stash Add/Save, reactions Save/Open, Protocol Activate/Log first dose must use same solid primary token #C6A6F2, no gradient; Back/informational Done neutral, selected controls distinct. JS 0445f6b0 first-log label only; original handler preserved. Script bd6c374e captures Protocol route and records whether conditional CTA present; if absent, dedicated active/no-dose fixture required before PASS. CI pending, physical iPhone not tested. Earlier one-vial inventory safety 40621540795 PASS remains separate.


## 2026-10-27 BUTTON QA PASS LIMITED: 40623390625 nested screenshot run SUCCESS; 124 screenshots, all four 320/390 dark/light combinations show Protocol first-log CTA and Reaction editor Save fill rgb(198,166,242), radius 13px/no shadow. Mobile 40623390895 SUCCESS. No route/overflow failures reported by workflow. Stash final Add to Stash, prepared/multi-vial, physical Safari, destructive confirmation remain NOT TESTED. Reaction subtitle ISO date observed, separate UI issue. No production data accessed.


## 2026-10-27 visual QA: 40623724305 SUCCESS, Stash final wizard Add to Stash 4/4 viewport-theme primary fill #C6A6F2 with radius 13px and no shadow, no storage mutation. New a1cf67c6 test asserts additional Today dose chooser Continue, Protocol first-log, Reaction Save and Stash final Save; 40623795341 pending. One-vial fictional inventory safety previously passed #40621540795. Multi-vial, prepared dose, physical iPhone, exact deployment and all nested actions not tested.


## 2026-10-27 EXPECTED VISUAL FAILURE CAUGHT: new explicit primary role audit 40623795341 FAIL because Today dose chooser Continue to dose log remained #A78BFA in all four viewport/theme states; direct inline JS source was stronger than previous CSS override. Source fixed at 9436f41e (assets/js/04-nexus.js), rerun 40623977189 pending. This is a genuine DS2 contrast/consistency failure, not data math; keep FAIL until new evidence PASS. Other Stash final Add to Stash screenshots passed 40623724305; Protocol/Reaction CTA passed 40623390625.


## 2026-10-27 NEW SOURCE FIX VERIFIED: Run 40623977189 SUCCESS with 128 fictional-data screenshots, 0 errors/overflow; inspected artifact 12789125364. Previously failing Today's Continue to dose log button now rgb(198,166,242) in 320/390 dark/light, matching Kit Continue, Add to Stash, Reaction Save and Protocol first-log. Mobile CI 40623977210 SUCCESS. Full app parity/artifacts pending run 40623977248, physical iPhone and remaining nested flows NOT TESTED. Prior 40623795341 FAIL remains documented as failure corrected in 9436f41e.


## 2026-10-27 — VERIFIED REQUEST: BUTTON HIERARCHY + PROTOCOL FIRST-LOG
- Latest source already contains targeted DS2 fix: primary solid lavender #C6A6F2 / dark ink #24182F, flat fill and aligned radii for Add to Stash, kit Continue, Today chooser Continue, reaction save, dose wizard Continue/Confirm; secondary/selection/danger remain differentiated by semantic role. Protocol 'Ready for first log' now stacks its context copy above a full-width lavender 'Log first dose' CTA (existing handler retained). This resolves user-screenshot discrepancy on draft branch, not production.
- Verified GitHub Actions nested visual run 40623977189 **SUCCESS**, 128 fictional populated route/action screenshot cases (320/390 light/dark), including four targeted primary CTAs; mobile regression 40623977210 **SUCCESS**, build/parity artifact workflow 40623977248 **SUCCESS** checked after prior 'in progress' notes. These are browser CI, not physical iPhone acceptance or complete depth.
- App logic, dose allocations, history, localStorage schema unchanged. Draft PR #123 not merged/deployed. Standalone full-app DEMO and LIVE ZIP independent download/pixel inspection still INCOMPLETE in this turn. ONE NEXT ACTION: download and inspect exact-head LIVE/DEMO artifacts then verify physical iPhone UI when available; continue residual nested button role coverage. Global polish LAST.


## 2026-10-27 — Physical iPhone acceptance evidence gate (four priority CTAs)
- Reverified draft branch `ffb96f610ace9334c44a9b2285f1258ab3f41f67`, main `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e` before this documentation update.
- **Physical iPhone — NOT TESTED (all four):** (1) Log Dose → Continue to dose log → Quick/Review, (2) Protocol → Log first dose, (3) existing Reaction → Save, (4) Stash wizard → Add to Stash. No new user device screenshots, video, iOS/Safari recording or firsthand observations were supplied. Browser emulation cannot close this gate.
- **Automated evidence remains separate:** semantic fill and visibility passed in 128 screenshot cases at 320/390 light/dark in run 40623977189; single-vial 300mg vs 10mg safety test previously passed in 40621540795. Current-head workflows 40626757681 nested, 40626757720 mobile and 40626757650 build/parity report SUCCESS; these are not new physical iPhone tests.
- **No device failure verified** and therefore no justified app code patch. Residual deep-action audit should target Quick/Guided Review/Confirm, multi-vial/prepared-dose, nested Stash vial/outflow/waste editors, destructive Settings confirmation, Reaction subtitle date formatting and secondary/dismiss affordances. Do not reopen accepted Calendar/Plans/Supplies or re-style contextual mint Today button without a role decision.
- Keep global accessibility, typography, required fields, scrolling, navigation and motion polish **LAST**. No merge, Cloudflare deploy, schema change, saved-data write or real-data fixture. **NEXT ACTION:** gather actual iPhone Safari observations of these four draft-preview controls, record Pass/Fail with evidence, fix only reproduced failures on draft PR #123, and rerun nested/mobile/build QA.


## 2026-10-28 — Stash outflow screenshot acceptance + danger/confirmation audit
- GitHub nested run 40631961194 SUCCESS, artifact 12792185822 downloaded and 8 screenshots (Edit Outflow, Log Outflow × 320/390 × light/dark) inspected. Both sheets render in all four combinations; Edit Outflow Save Changes is flat primary lavender. Log Outflow `#waste-save` appeared lavender **despite** inline red request, a confirmed semantic-style defect.
- Scoped correction `c345c8d5` assigns distinct caution/danger red `#a62c4a`, white label, no gradient/shadow to Log It only; test `32817090` adds computed colour assertion in all four browser variants. **Post-fix CI/visual QA pending**. No production writes or merge/deploy.
- Close X exists in each modal; no labelled Cancel. Nested whole-vial selection sheet provides X but clicking a vial option directly commits an outflow, no separate Confirm step. DO NOT claim confirmation flow validated.
- **SOURCE-DISCOVERED INVENTORY RISK (not corrected here):** `logWasteModal` partial-outflow branch accepts `mg > openVial.remainingMg`, clamps remaining to zero but records the larger requested amount; requires separate transactional validation and regression before release. This is an observed code-path risk, not a live-data incident. Avoid modifying inventory logic casually; preserve existing records and migrations.
- Next audit priority: isolate and test partial overspend and whole-vial choice/cancel flow with fictional fixture, then assess confirmation/button hierarchy before Protocol/Plans management. Global polish last.


## 2026-10-28 — Blend parity phase 1 code (DRAFT, QA NOT YET VERIFIED)
- User confirmed blend ingredient totals should appear in Trends and approved continuing implementation. On PR #123, `287e8ca4` adds read-only Blend composition & history cards in Trends, displaying saved composition and physical blend-ledger draw counts/total mg. It does NOT infer constituent exposure from unversioned historic recipes, write separate dose records, or modify inventory. Test `af2bab34` checks the section on 320/390 light/dark fictional browser states.
- Stash blend-menu parity begins with `d517cbe7`: blends now show Finish This Kit, and finished blends show Reopen Kit. `1ac22ae9` adds a blend-specific confirmation that records remaining material as outflow and retires physical vials while preserving original logs. `84a7d05c` adds fictional confirmation/cancel UI test, not the full commit/restore transactional test. No real data touched. **All code is unmerged and post-change test results pending**; do not treat as accepted.
- Required incomplete scope: Log Outflow and Add To Open Vial for blends with safe ledger semantics, per-vial composition snapshots, accurate per-component dose/time reporting, historical unknown cases, outflow undo and finish/reopen transaction regression. Do not use standard kit handlers blindly or double count physical stock. Full release DEMO/LIVE parity and physical iPhone acceptance outstanding. Global polish LAST.
- ONE NEXT ACTION: inspect latest nested/mobile/build QA, repair failures, add explicit blend finish transaction/idempotence and inventory integrity tests, then proceed to blend outflow and constituent analytics.


## 2026-10-28 — Blend transactions and ingredient reporting implementation checkpoint
- Verified prior app head `5b599835`: build/parity 40633892291 SUCCESS, mobile 40633892297 SUCCESS, nested 40633892309 SUCCESS. These predate new changes and do NOT prove latest updates.
- Draft-only new code: `651e4bbd` adds dedicated blend `Log Outflow` with positive/available mg guards, explicit warning confirmation, physical waste ledger and no duplicate constituent dose. `6352b6e6` exposes it in blend Kit actions. `096b3f0d` saves an immutable copy of kit composition on a blend vial at its new opening; never retroactively infers composition of existing vials. `7aef09de` computes estimated ingredient amounts in Trends solely for physical blend ledger entries with saved per-vial snapshots; unlinked historic rows are excluded/marked unavailable, original blend draws remain one physical event. `dfe743cd` adds fictional cancel check to nested audit.
- **INCOMPLETE/SAFETY BLOCKER:** blend `Add to Open Vial` is NOT implemented: existing physical blend ledger total/open-vial balance must support merging sealed and external material with precise volume/strength accounting; no regular-kit handler reuse. Blend finish/reopen full transaction and historical ratio changes also need strong validation; existing test only covers cancel. Latest CI and artifacts after these commits NOT YET VERIFIED. Do not claim release completeness, physical acceptance, production write or deployment. Keep PR #123 DRAFT.
- ONE NEXT ACTION: inspect latest branch CI; add isolated blend outflow commit/overspend, finish/reopen and composition-snapshot per-vial regression, then safely design/implement Add to Open Vial mass-balance without rewriting history. Global polish LAST.


## 2026-10-28 — User clarifies Add to Open Vial means CORRECT FOUND REMAINING (blend)
- User explicitly corrected the interpretation: no physical substance is added or mixed; actual open-vial remainder is greater than expected. This supersedes prior mass-mixing blocker for this use case. Existing ordinary-kit `Add to open vial` wording remains unchanged; blend menu now says **Correct open vial balance** to avoid implying physical addition.
- `9602572c` implements explicit confirmed positive balance correction on the currently open blend vial with `balanceCorrections[]` transaction ledger, no sealed vial deduction, no component/dose event, and no changes to immutable vial recipe. `3f21ee05` exposes the action on blend menu; legacy-v2 path adjusts direct physical vial balance. Balance derivation counts active corrections only. `20efc274` adds fictional correction/consumption/reversal math checks.
- `76195155` and `ade739c0` add Trends blend period filtering (7/30/90/all) and administered-only versus all physical draws; contributions continue to require original vial composition snapshots, and old unverified histories are not backfilled. `6be513ee` adds fictional blend transaction matrix for rejection, valid outflow, finish and reopen preservation, without live data access.
- Latest source changes and new exact-source QA **NOT YET VERIFIED**; no production deployment/merge. Remaining risks: existing historical data lacking vial snapshots; blend transaction undo and reopened-state presentation; full iPhone 320/390 light/dark/keyboard acceptance, new LIVE/DEMO packaging, and analytics data parity. Test/inspect before claiming passes.
- ONE NEXT ACTION: read new CI workflow outcomes and screenshots, repair any failing transaction tests or source issues, then complete package QA and physical preview acceptance. Global accessibility/typography/scroll/navigation/motion LAST.


## 2026-10-28 — User iPhone screenshot: Trends blend detail routing + validation alert (DRAFT FIX)
- Physical iPhone screenshot showed selected blend (KLOW) rendered with separate full-width Blend composition & history cards rather than only compound-centric dose history, and `Log blend outflow` attempted 50mg with 48.50mg available showing a red `SCRIPT ERROR — send to Claude` banner. Overdraw rejection is expected; banner classification and outdated Claude wording are defects.
- `517f6a4d` separates normal `showErrorBanner` validation (inline alert within modal / toast outside) from `showScriptErrorBanner` for actual uncaught errors, removes Claude reference. `9ca4348e` hides standalone Blend Analytics section when compound selected and adds estimated per-injection ingredient values within selected compound Dose history, sourced from dose allocations + locked physical-vial composition only. Missing trusted snapshot explicitly shows unavailable; old dose history unchanged. `a9010959`/`c48b92aa` add selected-blend route regression fixture; no production writes.
- This is CODED, **new CI/screenshots and physical retest NOT VERIFIED**. The current injection-level display is inside selected compound's Dose history, not yet a full replacement of all historical detail screens. More holistic Trends IA to be revisited after tests, without altering accepted parent layouts.
- ONE NEXT ACTION: inspect latest nested/browser/mobile CI and actual selected-blend screenshots; fix regressions. Verify validation warning stays in modal, no Claude copy anywhere in source. Preserve PR #123 draft, production untouched, no merge/deploy. Global polish last.


## 2026-10-28 — Selected blend dose history + 50/48.5 overdraw regression
- Previous nested audit 40637537306 FAILED in 4 mobile/theme states. Downloaded artifact #12794650050, inspected `action-inventory.json`: all 4 failures were `blend-populated-visual`, selected-history fixture yielded empty title/html and no duplicate analytics. Root cause: fictional custom blend inserted into `state.peptides` though `allPeptides()` only includes built-in names from that registry; custom names belong in `state.customPeptides`. This is **test-fixture construction failure**, not proven production KLOW rendering bug.
- Commit `f08e9be9` corrects fictional blend registration and cleanup in nested test. Commit `591b4c5b` adds isolated 50mg requested versus 48.5mg available test; it must verify inline `#nx-validation-message`, no developer `#err-text`, modal retained, no `wasteLog` addition and unchanged `getBlendOpenVialRemainingMg`. **New tests NOT YET VERIFIED**, no physical Safari acceptance.
- Existing app fix `517f6a4d` separates expected validation from script diagnostics and removes Claude wording; `9ca4348e` nests reliable attributed dose composition within selected compound history. Do not call these accepted until newest nested visual/specific regression PASS with screenshot inspection.
- Production main still unchanged; draft PR #123 not merged. LIVE/DEMO for newest code INCOMPLETE. ONE NEXT ACTION: verify newest CI and inspect selected-history screenshot, then validate error styling 320/390 light/dark and user iPhone acceptance. Global polish LAST.


## 2026-10-28 — Release candidate artifact byte-level parity VERIFIED, no deployment
- Build workflow #40637795436 completed SUCCESS (mobile #40637795363 SUCCESS; nested #40637795575 SUCCESS). Downloaded exact CI artifact #12794665751. Artifact ZIP CRC PASS. Manifest version v0.9.20-beta, workflow PR merge-source SHA `00d21e7f91586f9b4b2ec4199c91c66d8d026a83`; this is a synthetic workflow checkout, NOT branch SHA.
- Extracted LIVE ZIP with exact 21 manifest paths: root index.html, 4 CSS, 12 ordered JS, 4 icons. ZIP CRC PASS. Independently compared all 21 Git blob hashes byte-for-byte with current draft application files; all MATCH. Branch head before docs: 818131c7498ab326ea565b9cf0fd5ec68487e17a. Compare `f08e9be9..818131c7` confirms only `scripts/ds2-nested-navigation-audit.mjs` and 3 continuity MD files changed; app source unchanged.
- Standalone full-app DEMO HTML present ~2.69 MB, inline JS (no external script src), memory-only localStorage/sessionStorage substitution with explicit fail-closed assertion, fictional buildDemoState, sync disabled. Offline demo ZIP CRC PASS includes index.html + instructions. Browser results: LIVE and DEMO 320/390 dark/light 8/8 PASS in automated Chromium. Not native iPhone proof. Both LIVE and DEMO files were extracted from SAME CI artifact and exact app source.
- Cloudflare parity manifest verified=false as expected for unmerged draft; production main c1c95e1d unchanged. Full release artifacts now AVAILABLE/VERIFIED for application content; physical iPhone acceptance, deep manual workflow sign-off, merge, Pages/Cloudflare deployment INCOMPLETE. No production data writes. User explicitly prohibited merge/deploy without approval.
- ONE NEXT ACTION (ASSISTANT): provide exact-source LIVE and DEMO downloads, request hands-on iPhone acceptance for current preview, then seek explicit release approval separately. USER ACTION NEEDED only for physical iPhone acceptance and later merge/deploy decision. Global polish LAST.


## 2026-10-28 — Approved historical blend explorer: reversible attribution checkpoint
- Verified prior implementation on branch: `b63497ca` non-destructive `blendHistoryAttributions[]` confirmation, `f80f9e54` chart-first Explore Dose Records child screen, `d768390b` inclusive dates/one-vial mapping. Parent inline 80-row blend ledger removed. These commits predate current turn, not new work.
- NEW commit `c995a493`: add auditable review and explicit reversal UI for user-confirmed historical date ranges. Reversal changes only `blendHistoryAttributions[].status` to `reversed` with timestamp; does NOT edit dose events, physical inventory, composition snapshots or original transaction histories. NEW `90aba392`: isolated fictional 2mg old dose and 80mg 50/10/10/10 recipe tests attribution 1.25/.25/.25/.25, then reversal to unknown, with immutable dose/vial/waste ledger. Script only; execution status PENDING.
- Risks: multi-kit/vial ambiguous histories intentionally remain unknown; date-range confirmation requires review; no automatic destructive migration. UI transaction confirmation/overlap/cancel and legacy conversion edges still need deeper browser tests. FULL-app LIVE/DEMO refreshed for these changes INCOMPLETE; physical iPhone acceptance NOT TESTED. PR #123 remains DRAFT, no merge/deploy.
- ONE NEXT ACTION (ASSISTANT): check branch CI for 90aba392, inspect chart-first screenshot and regression evidence, repair failures; then update release artifacts and device acceptance separately. USER ACTION: Nothing needed right now. Global polish LAST.


## 2026-10-28 — Chart-first blend explorer / reversible historical interpretation implementation
- **APPROVED FEATURE (draft PR #123 only):** source `assets/js/09-nexus.js` now provides chart-first Explore Dose Records, period picker, selected injection and per-component breakdown, compact period ingredient totals with coverage warning, and an opt-in date-scoped reconciliation overlay `kit.blendHistoryAttributions[]`. Does NOT rewrite original dose events, inventory or vial composition. Includes explicit review/reversal and source provenance. Parent selected compound shows overview and link, not 80-row ledger.
- Source commits: prior `b63497ca` resolver/opt-in attribution, `f80f9e54` explorer, `d768390b` date inclusivity; current `c995a493` attribution audit/reverse UI; `af3cbf54` correct local calendar-day inclusion (08:00 first-day doses), `0a7537ae` period ingredient totals with partial coverage, `99c2c864` excludes explicit other-kit allocations from confirmation candidates.
- Regression scripts updated through `cbbdd18b`: fictional regular-kit→blend classification cancel/confirm and vial balance preservation, historical 80mg recipe with 2mg dose resolves 1.25/.25/.25/.25, morning boundary, date overlap rejection, confirmation cancellation, audit reversal to unknown, other-kit exclusion, four dated doses driving a chart and 19mg total with 13.571/2.714/2.714 component totals and selected individual dose changing to 3.571mg; no real user storage writes. Previous run 40641014080 revealed test-scope errors (fixture reference and full-object metadata comparison), corrected by `cbbdd18b`. Latest CI pending. Prior mobile runs successful; not evidence for current final head.
- **RELEASE INCOMPLETE:** new source exact LIVE ZIP / isolated full-app DEMO, latest screenshot inspection, full regression acceptance, physical iPhone acceptance, merge and Cloudflare deployment not yet verified. Keep `main` and production unchanged; user approval required for merge/deploy. No destructive migrations approved.
- **ONE NEXT ACTION (ASSISTANT):** inspect latest nested workflow 40641541861 and build/parity 40641541756, fix actual failures, verify source matched app artifacts, then request current-preview physical iPhone acceptance. **USER ACTION:** nothing now. Global accessibility/typography/motion polish last.


## 2026-10-28 — VERIFICATION: chart-first blend explorer and historical reconciliation candidate
- Verified app source on draft branch (app JS/CSS unchanged after source commit `99c2c864`); tests through `cbbdd18b`. Nested GitHub Actions #40641541861 **SUCCESS**, artifact #12795234120 downloaded/inspected: ZIP CRC PASS; 196 evidence observations, zero `error` and zero overflow across 320/390 light/dark. Tests PASS: 4 fictional injections (7/5/4/3 mg), chart and 19.000mg period total, 13.571/2.714/2.714mg ingredient coverage, selected 5mg injection -> 3.571mg Ingredient A; 2mg historical legacy dose -> 1.25/.25/.25/.25mg; Stash legacy kit classification Cancel/Confirm preserving saved dose, waste and physical vial mg; reconciliation Cancel/Confirm/date overlap/other-kit exclusion/reversal, preserved dose & waste logs; morning date boundaries. Mobile regression #40641541769 **SUCCESS**.
- Build/parity #40641541756 **SUCCESS**, artifact #12796340141 downloaded: outer ZIP CRC PASS, LIVE ZIP CRC PASS, 21/21 Git blob hashes match current draft app assets and ordered scripts. Standalone 2.70MB full-app DEMO has inline resources and memory-only local/session storage fail-closed, disabled network; Offline DEMO ZIP CRC PASS; LIVE/DEMO 320/390 light/dark 8/8 browser checks PASS. Manifest `v0.9.20-beta`, synthetic workflow merge SHA `f91c348b...` not branch head; direct Git hash comparison independently establishes application-content parity. Cloudflare parity false as expected for unmerged draft.
- Physical iPhone acceptance of new explorer and real historical data **NOT TESTED**; actual KLOW/Deadpool historical recipes are not silently inferred. Before old-record component estimates appear, user must opt in to kit/date/recipe confirmation; ambiguity remains unknown. No destructive migration, no original dose/ledger rewrite, no production user storage touched in tests.
- GitHub PR #123 remains DRAFT/unmerged, main `c1c95e1d` unchanged, no deployment. **ONE NEXT ACTION (ASSISTANT):** hand off refreshed source-matched LIVE and isolated full-app DEMO files with an exact physical iPhone acceptance checklist; after user acceptance, seek separate explicit permission to merge/deploy. **USER ACTION:** preview the explorer and opt-in reconciliation on physical iPhone when ready; no action required immediately. Global polish LAST.


## 2026-10-28 — Dated injection drilldown failure corrected (QA PENDING)
- Verified latest draft app already implements vertical dated rows, selected injection drilldown, ingredient-derived history and distinct Intel action. Continuity source verified against GitHub, production main unchanged.
- Screenshot audit #40704187987 FAILED four viewport/theme states (320/390 × light/dark): after tapping a date, `#nx-blend-date-list` remained visible. Downloaded artifact #12822189270, `action-inventory.json` confirmed four `Date list should hide in injection detail` errors. Root cause: `hidden` attribute did not override a display rule; application fix commit `e7b811f0` explicitly applies `display:none` to date list while details are visible, restores it on Back, and explicitly hides/shows detail container. This is a reproduced app UI defect, not a fixture issue.
- Test fixture also had a duplicate ingredient click after navigating Back to date rows; removed via `381a6767`. Existing nested fictional QA checks dated-row visibility, 7/5/4/3 mg chart and 19 mg total, per-ingredient contributions, navigation to derived ingredient history and Intel control, historical reconciliation confirm/cancel/reverse, separate source kits and inventory preservation. **Newest app-fix CI and screenshots NOT YET VERIFIED**; prior mobile success does not prove updated UI.
- Next ASSISTANT action: inspect new nested/mobile/build workflows and screenshot artifacts for full pass, fix any newly observed failure, package exact-source LIVE/isolated DEMO, and request physical iPhone review only after verified. USER action: none. PR #123 draft, no merge/deploy or production data writes. Global polish LAST.


## 2026-10-28 — Approved Trends/Blend drill-down redesign IMPLEMENTED ON DRAFT, QA PENDING
- User-approved navigation: Trends → compound → Explore Dose Records → vertical chronological date rows → tap dated injection for ingredient amounts → tap ingredient for read-only history of direct doses and estimated contributions from KLOW/Deadpool, with separate Compound Intel action. No horizontal date pills. Ingredient history does not create logged administrations or mutate saved data. Tracked ingredients also expose View direct doses & blend contributions; untracked constituent compounds appear in Compound History with From blend labels.
- `assets/js/09-nexus.js` replaces the carousel and puts injection details behind the dated row, adds back-to-dates, source-labelled ingredient history, removes redundant bottom-of-Trends blend ledger, replaces symptom action arrow with SVG chevron, and defaults historical reconciliation date review to full eligible historic record range with optional advanced date refinement. No automatic historical attribution: explicit confirmation still required; existing reversible overlay and dose/vial history remain authoritative.
- `assets/js/11-nexus.js` resets selected compound on fresh Trends entry; `assets/js/12-nexus.js` starts selected compound/back navigation at top. Scoped CSS standardizes symptom/detail/attribution button roles to DS2 primary/secondary, ensures [hidden] works, and removes nested date-list scroll. `assets/js/03-nexus.js` adds explicit primary tone for historic confirmation instead of blue. All production records untouched; no migration.
- QA: first nested audit #40704187987 FAILED with 4 instances of date-list hidden CSS overridden by author display rule; inspected artifact 12822189270, source fixed in commit `9ebd57b6`. Previous mobile QA #40704188001 SUCCESS, but it predates recent code. Updated nested browser regression checks date list, injection detail, back, attribution and ingredient/source view; latest CI and screenshots **NOT YET VERIFIED**. No physical iPhone sign-off, no current exact-source LIVE/DEMO ZIP verification, no merge/deploy. Retain earlier accepted parent layouts and defer global polish.
- ONE NEXT ACTION (ASSISTANT): verify latest nested/mobile/build checks, fix any failures, inspect actual 320/390 dark/light screenshots, then generate/download exact current-head LIVE/DEMO artifacts. USER ACTION: nothing until preview acceptance is requested; merge/deploy requires separate explicit approval.


## 2026-10-28 — Trends drilldown iteration: source/QA handoff (DRAFT, NOT DEPLOYED)
- Approved UX implemented as targeted source changes on PR #123: chronological vertical dose-date rows, separate injection detail, tappable ingredient direct/from-blend history, independent Intel action, labeled contribution browser entries, fresh Trends home on tab entry, page top on compound navigation, removal of redundant bottom Blend composition section, scoped DS2 semantic button styling and chevron, no nested date scroller, optional date refinement after automatic whole-history candidate discovery. Historical reconciliation remains explicitly opt-in and reversible; no old doses or physical inventory modified.
- Source hardening: `nxIngredientHistoryDetail` avoids double-counting the same blend name across multiple kits; direct unit values converted to mg, and already-attributed historic doses excluded from reconciliation candidates. No stored data migration. Protect previously accepted Calendar, Plans and Supplies.
- First nested workflow #40704187987 FAILED due date-list `[hidden]` overridden by authored CSS; source corrected at `9ebd57b6`. Follow-up nested #40704880841 SUCCESS; downloaded artifact #12823228513: ZIP CRC PASS, 196 observations, zero recorded errors; eight 320/390 light/dark explorer and ingredient-history screenshots present/inspected. Later nested #40705326292 SUCCESS and mobile #40705326516 SUCCESS, both preceding final wording/logic changes; final post-hardening head QA NOT YET VERIFIED. Current full-app LIVE/DEMO build for this source INCOMPLETE until exact-head workflow artifact available. Physical iPhone NOT TESTED. No merge or Cloudflare deployment approved.
- ONE NEXT ACTION (ASSISTANT): verify latest automated nested/mobile/build results, inspect exact current screenshots and artifact LIVE/DEMO parity, then request physical iPhone acceptance. USER ACTION: nothing now; review on iPhone only when ready. Global polish remains LAST.


## 2026-10-28 — USER-MANDATED RELEASE BLOCKER: keep issue open
- USER DECISION: keep the Trends drilldown/inventory integrity issue OPEN and the entire PR #123 release BLOCKED until all previously failing cases AND explicit inventory-integrity assertions pass on the exact current source. No bypass for a green visual snapshot alone. Do not merge, mark ready, deploy or close the issue without separate user acceptance/authorization.
- Current-head `1fb355d3e8c1663cd903e7a475edee5bc0f184a6`: nested visual #40707036588 SUCCESS; mobile regression #40707036638 SUCCESS; build/parity #40707036612 IN PROGRESS at verification. Passing generic CI is not proof that all conversion/reconciliation mass-balance requirements have been tested. Do not claim release complete.
- Mandatory release gates: (1) chronological drilldown, top-of-page and reset navigation, ingredient detail/Intel, theme roles and date list at 320/390 light/dark; (2) fictional inventory conservation before/after blend classification, reconciliation confirmation/cancel/reversal and refresh; no original dose/waste/vial mutation, no double-counted ingredient contributions, missing/ambiguous provenance rejected or labelled, insufficient stock/outflow blocked without ledger change; (3) new exact-source FULL DEMO and LIVE ZIP integrity/parity plus automated browser QA; (4) physical iPhone acceptance; (5) explicit user permission before merge/deploy. Mark untested checks NOT TESTED rather than Pass.
- NEXT ACTION (ASSISTANT): inspect whether exact-head QA specifically asserts all inventory conservation cases and add missing fictional transaction assertions, correct any failures, verify new build artifacts, and report gate status. USER ACTION: none required now.


## 2026-10-28 — Trends ingredient return navigation targeted fix (DRAFT, RELEASE BLOCKED)
- Inspected current `assets/js/09-nexus.js` and nested browser audit. Confirmed return-context defect: entering ingredient history from a selected injection in a non-default period returned to a fresh 90-day modal, losing the chosen filter and potentially hiding an older selected injection.
- Commit `44f0e4b6` passes the selected range into the read-only ingredient history and restores both range and dose ID on Back. Commit `5d88f4dc` extends the 320/390 light/dark nested navigation audit to switch to All and assert return retains All and the same injection. No saved data, ledger, calculator or vial/inventory changes.
- **QA status:** new exact-head browser/CI run NOT YET VERIFIED; physical iPhone NOT TESTED. Existing verified CI from prior commits does NOT validate this change. LIVE ZIP and isolated full-app DEMO from exact new head INCOMPLETE. Draft PR #123 stays unmerged, production unchanged.
- **RELEASE BLOCKER OPEN:** historical conversion/reconciliation inventory conservation, insufficient-inventory and outflow rollback, original dose/waste/vial preservation, recipe provenance and no double counting require explicit pass evidence on exact current source. Do not merge/deploy or mark ready based on a green UI run.
- **ONE NEXT ACTION (ASSISTANT):** inspect new-head nested/mobile/build CI; run or strengthen explicit conservation assertions and review artifact parity; prepare exact-source LIVE/isolated full-app DEMO after verification. **USER ACTION:** none until physical preview acceptance; separate authorization required before release.


## 2026-10-28 — Exact-source navigation and inventory gate follow-up (DRAFT, BLOCKED)
- Inspected draft PR #123 and current source. Navigation fix `44f0e4b6` retains selected range and dose ID when Ingredient History Back reopens the selected injection. Regression `5d88f4dc` checks `All` period stays selected on return. Earlier exact-head `92800847` mobile workflow #40749092286 SUCCESS and nested navigation #40749092261 SUCCESS; build/parity #40749092228 was IN PROGRESS at inspection, not verified as successful.
- Identified inventory QA coverage weakness, not evidence of a reproduced conservation failure: `scripts/ds2-dose-inventory-regression.mjs` asserts only single-ingredient insufficient 300mg rejection and valid 2mg deduction. Existing nested visual browser regression additionally covers fictional legacy blend classification cancel/confirm and dose/waste/vial preservation; historical attribution confirmation/cancel/overlap/reversal and source exclusions; blend overdraw rejection; outflow/finish/reopen and correction reversal. New commit `2295b967` strengthens blend transaction matrix with explicit **open-vial mass balance** (remaining + administered + logged outflow = original 10mg) and sealed 10mg vial stability, including finish/reopen. No app data code or production storage modified.
- Fresh workflow runs for source `2295b967`: nested #40749663848, mobile #40749663763, build/parity #40749663778 launched; **results pending/unverified** when documented. No real-device Safari test. Full-app exact-head DEMO HTML and LIVE ZIP remain **INCOMPLETE** until workflow artifact materialized and parity verified; cannot infer old artifacts apply to new test/doc commit.
- **RELEASE BLOCKED**: do not infer real user data correctness from fictional tests; separately verify unresolved historic inventory conservation edge cases, ambiguous provenance, exact-head test success and parity, physical iPhone acceptance. PR stays draft/unmerged, Cloudflare unchanged. **ONE NEXT ACTION:** verify the three exact-head runs and build artifacts; inspect any failures and repair; complete source-matched DEMO/LIVE handoff. **USER ACTION:** nothing until physical iPhone review; no merge/deploy without explicit approval.


## 2026-10-28 — Inventory mass-balance regression failure triaged and assertion corrected (DRAFT)
- New conservation assertion `2295b967` ran in nested audit #40749663848 and **FAILED in all four 320/390 light/dark cases**. Exact log: before 8 mg, partial outflow 3 mg, after 5 mg, administered 2 mg, final waste 18 mg, sealed vial no longer sealed. Root cause of new **test assertion**: `finishBlendKitModal` intentionally retires BOTH the 5mg open remainder and 10mg sealed vial, explicitly writing `blend_kit_retired` waste entries and marking both vials empty. The assertion mistakenly expected the sealed vial to survive the *Finish Kit* operation and expected waste to remain 3mg. This is not evidence of lost physical material; it revealed insufficient phase-specific accounting in the test. No app code changed.
- Corrected test `c7d1e800`: BEFORE Finish Kit require open mass conservation `5 remaining + 2 administered + 3 outflow = 10mg` and sealed vial unchanged at 10mg; AFTER Finish Kit require `2 administered + 18 total waste = 20mg` kit-wide, explicit retirement entries exactly `5mg` and `10mg`, both vials empty, and reopen does not erase dose or outflow history. No production data writes; fictional local Demo fixtures only.
- Workflow #40749663763 mobile regression SUCCESS on pre-correction `2295b967`; #40749663778 build/parity IN PROGRESS at observation. **Corrected exact-head nested, mobile, build/parity are NOT YET VERIFIED**. Physical iPhone NOT TESTED. Updated full-app DEMO HTML and LIVE ZIP exact-head delivery **INCOMPLETE**. PR #123 remains draft, unmerged, undeployed; release BLOCKED.
- ONE NEXT ACTION: check exact `c7d1e800` nested audit result; if green verify build/parity artifact contents and packaging, maintain unresolved user acceptance/physical iPhone and inventory edge-case gates. USER ACTION: none at present; explicit merge/deploy consent needed later.


## 2026-10-28 — Verified exact application source: Trends navigation + blend inventory audit (DRAFT, BLOCKED)
- Verified PR #123 remained draft/unmerged; main `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e`; audited app/test commit `c7d1e800365749f2335a90eb9dd9233bdbd78010`. Navigation fix `44f0e4b6` maintains All/other range and selected injection upon returning from ingredient history; `5d88f4dc` asserts this in 320/390 light/dark browser QA.
- **All three corrected-source automated runs SUCCESS:** nested visual #40750035475 (196 deep-route screenshot observations, 0 reported error/overflow, confirmed via actual job logs); mobile form #40750035479; build/parity #40750035494 (8/8 LIVE and isolated DEMO 320/390 light/dark browser results). Nested inventory test includes fictional classification Cancel/Confirm preserving dose, waste, physical vial; reconciliation Confirm/Cancel/Overlap/Reverse and other-kit exclusion; overdraw rejection; corrected per-phase physical mass balance: BEFORE Finish 5mg open +2mg administered+3mg logged outflow=10mg with sealed 10mg unchanged; AFTER Finish 2mg administered +18mg logged waste (3+5+10)=20mg across both vials, retirement outflows exactly 5mg/10mg, both vials marked empty, reopen retains logs. The earlier failed run #40749663848 tested the false assumption that Finish Kit retains sealed inventory; corrected at `c7d1e800`, not an app code failure. Automated Chromium + fictional data; physical Safari NOT TESTED.
- **FULL DEMO/LIVE VERIFIED FROM SAME APP SOURCE** via downloadable build artifact #12843593212, workflow #40750035494; standalone 2,707,867-byte full-app DEMO HTML, memory-only isolated fictional data and no external script tags; offline full-app DEMO ZIP CRC PASS; LIVE ZIP CRC PASS with root `index.html`, 21 expected files and ordered 01-12 JS modules; all 21 local ZIP git-blob SHA1 hashes checked against live GitHub branch blobs and MATCH. Build manifest v0.9.20-beta; workflow synthetic merge `45f4b2c2` not branch head, but verified 21/21 content equality. Eight LIVE/DEMO browser configuration results PASS; source-matched downloaded artifacts verified. Cloudflare production intentionally unchanged. Do not treat CI as real iPhone acceptance.
- **RELEASE BLOCK STILL OPEN BY USER DECISION** pending physical iPhone acceptance and explicit approval; original historical inventory data/provenance requires user review and no destructive migration. Broadest untested cases and real legacy records are not automatically validated by fictional QA. Draft PR #123 must not merge/deploy. **ONE NEXT ACTION (USER):** test the isolated full-app DEMO on a physical iPhone at the dated injection → ingredient history → Back flow and any historical review UX; report issues. **ASSISTANT AFTERWARDS:** triage iPhone findings; request separate authorisation before any merge/deployment. User data unchanged.


## 2026-10-28 — Physical iPhone DEMO HTML file-viewer blocker and existing Cloudflare preview
- User supplied an iPhone screenshot from the ChatGPT/iOS local HTML file-preview interface: yellow `FICTIONAL FULL-APP DEMO — No live data` banner renders but initial `LOADING…` remains; no interactive app appeared. **PHYSICAL iPHONE ACCEPTANCE FAILED / BLOCKED IN FILE VIEWER**. This does not prove the app fails in Safari; the file-preview container likely does not execute embedded scripts. Do not count Chromium pass as iPhone acceptance.
- Verified the standalone HTML has `#app` initial `LOADING…` markup replaced by its JavaScript boot; it contains inline scripts and isolated in-memory storage. To test through actual browser instead of document preview, the already-existing Cloudflare bot comment on draft PR #123 explicitly reports successful **automatic branch preview for current commit `460ed59`** at `https://4adc8b10.nexuspeplog.pages.dev/` and branch alias `https://design-design-system-2-previ.nexuspeplog.pages.dev/`. No new deployment was requested. **External browser fetch from assistant failed**, so actual Safari runtime behaviour is still NOT VERIFIED. Cloudflare preview is application preview, NOT the standalone memory-only DEMO: use built-in Demo Mode / fictional fixtures, never import personal backup or perform production sync for testing. Preview has a separate origin from `nexuspeplog.pages.dev`.
- One NEXT ACTION: have user open the existing commit-specific preview URL in Safari, switch to the app's fictional Demo Mode and test Trends injection → ingredient → Back, plus Stash/reconciliation, then report any actual Safari errors/screenshots. If the branch preview still shows Loading, investigate Safari runtime/bootstrap and script exceptions. Do not merge/deploy or mark physical QA passed. USER ACTION: open preview in Safari and report what loads. Release remains BLOCKED.


## 2026-10-28 — Physical iPhone Trends visual consistency feedback (DRAFT ONLY)
- USER TEST: existing Cloudflare draft preview loads on iPhone; screenshot of Trends compound page, selected blend injection date list, and TB-500 Ingredient History confirms functional browser access. NOT a full physical acceptance pass. User noted misaligned Back to compounds button/text and inconsistent arrow/chevron forms. No production merge/deploy approval.
- Targeted UI implementation `52de0788` (`assets/js/09-nexus.js`): replace mixed text arrow/› glyphs with uniform inline outline chevrons for parent library/record actions and left-chevron for Back actions; replace ingredient footer competing half-width Back + large purple Intel with full-width stacked secondary actions, label contextual Back to injection/compounds; remove one redundant ingredient-history CTA that opened the same view. CSS `faa4192f` aligns icon/label baseline and 48px actions, text rows and destination alignment. Scoped to Trends; no data storage/schema, inventory, history, attribution or calculator change.
- APPROVAL/STATUS: preliminary targeted implementation on existing DRAFT PR #123, no production deployment; new-head nested visual/mobile/build CI and actual Safari retest are **PENDING / NOT TESTED**. Inspect screenshot styles and navigation actions at 320/390 light/dark; physical screenshots remain manual user evidence. Preserve earlier accepted Calendar, Protocol/Plans and Supplies. Inventory-integrity release blocker still mandatory and not cleared by this purely visual fix.
- ONE NEXT ACTION (ASSISTANT): verify new-head GitHub CI, adjust any styling/test failures, verify available Cloudflare draft preview corresponds to new head and request iPhone review. USER NEXT ACTION: nothing until updated preview is ready; then review Back, Compound Intel and chevron alignment. Do not merge/deploy without explicit approval.


## 2026-10-28 — New Trends button/chevron iPhone review gates
- PRE-FIX user iPhone screenshots: page loads, selected blend date list and ingredient-history TB-500 view render; mismatched arrows and two half-width footer buttons observed. Browser loading issue is resolved for the Cloudflare preview, but standalone HTML file viewer is still unsupported/failed.
- Code `52de0788`, `8f575c00`, `42049f5f`, CSS `faa4192f` and `bb5b5233`: require single svg chevron for forward drill-down, left for Back, one clear ingredient-history CTA, full-width vertically stacked Back to injection/compounds and secondary Compound Intel, minimum 48px targets and baseline alignment.
- Test `395920b8`: assert Back/Intel SVGs, equal full width (>220px), vertically stacked, correct contextual labels on fictional ingredient modal at 320px and 390px, both themes. **Newest CI pending**, NOT marked Pass. Physical new-head Safari and VoiceOver NOT TESTED. Core inventory conservation/safety regression must still pass; draft PR #123 RELEASE BLOCKED.


## 2026-10-28 — iPhone Trends footer stacking regression diagnosed, fixed on draft
- New nested UI assertion `395920b8` correctly FAILED on source `bb5b5233`, run #40765122960: 4 viewport/theme errors, 192 rather than 196 deep screenshots. Actual bounds at 320px were `Back 138px` and `Intel 138px`, same Y=691; at 390px each 173px, same Y. Their SVG icons/labels were correct, but actions still sat side by side. No inventory calculation defect was involved.
- Root cause isolated in `applyNexusSheetStructure()` in `assets/js/04-nexus.js`: generic sheet adapter detects any final DIV with exactly two buttons, moves buttons into `.nx-unified-footer` and removes the container. This unintentionally stripped `.nx-ingredient-actions` before scoped CSS could stack it. Targeted source fix `6471d2cb`: exclude only `.nx-ingredient-actions` from that generic footer move, retaining intended full-width grid and existing onclick handlers; all other sheets retain adapter behaviour. No storage writes or saved-data migration.
- Corrected-source nested #40765564957, mobile #40765564935, build/parity #40765564849 were IN PROGRESS at documentation time. Physical iPhone retest and exact-new-source LIVE and DEMO parity NOT VERIFIED. Continue hold PR #123 draft/unmerged and release BLOCKED on inventory user acceptance and no deployment authorisation.
- ONE NEXT ACTION: verify corrected nested workflow assertions and screenshot evidence; then new-source LIVE/DEMO parity and physical Safari preview. USER NEXT ACTION: none until new browser preview confirmed; then check Back/Intel footer and chevrons.


## 2026-10-28 — Verified correction of stacked ingredient actions; balanced two-stat header follow-up
- **Verified exact-source CI for adapter fix `6471d2cb`**: nested audit #40765564957 SUCCESS, 196 deep-route screenshots, zero recorded errors/overflow; mobile #40765564935 SUCCESS. Downloaded artifact 12850601841, ZIP CRC PASS; visually inspected actual `390-dark-trends-ingredient-history.png` and `320-light-trends-ingredient-history.png`: contextual Back to injection and Compound Intel now show as distinct, aligned, vertically stacked full-width actions; original half-width regression is resolved in automated browser images. Build/parity #40765564849 IN PROGRESS at evidence checkpoint, not claimed success.
- Screenshot inspection found another targeted visual defect: Ingredient History had two stat cards using the generic three-column summary grid, leaving the third column blank. Commit `9186e744` adds specific `nx-ingredient-counts` class; CSS `737cb4f6` sets exactly two equal-width columns; test `1995b8c3` asserts both cards equal width in iPhone 320/390 modes, in addition to icon/footer navigation. Source/data logic untouched. **Final newest commit CI and updated screenshots NOT YET VERIFIED**; earlier passing build does not prove last header refinement. No physical post-fix Safari retest. No production merge/deploy.
- NEXT ACTION: verify current `1995b8c3` nested/mobile/build runs, inspect 2-column screenshot and current-source LIVE/DEMO packaging; then request actual iPhone feedback using automatically published PR preview. USER ACTION: none until new preview ready. Inventory conservation and provenance acceptance remain release blockers.


## 2026-10-28 — Final targeted Trends alignment verification (DRAFT)
- Final affected source `assets/js/04-nexus.js` adapter fix `6471d2cb`, Trends JS icon/CTA and two-stat class through `9186e744`, CSS through `737cb4f6`, nested regression `1995b8c3` (no underlying saved-record or physical-inventory edits).
- Exact-source nested audit run **40765996863 SUCCESS**: 196 deep-route screenshots, zero recorded errors or overflow, and fictional insufficient/valid dose source regression PASS. New assertions passed for 320/390 light/dark: Back to injection and Compound Intel are each full-width, vertically stacked with distinct correct SVG chevrons; two ingredient summary cards have equal width. Downloaded nested screenshots artifact **12849668800**, ZIP CRC PASS; visually inspected `390-dark-trends-ingredient-history.png` showing balanced two-column stat cards and vertically stacked footer actions. New mobile form run **40765996846 SUCCESS**. Latest build/parity run **40765996886 IN PROGRESS** at documentation, not claimed PASS.
- Existing Cloudflare automatic draft preview successfully published for documented head `b5c885b` according to PR #123 Cloudflare bot: `https://b36a9ee3.nexuspeplog.pages.dev/` and branch alias `https://design-design-system-2-previ.nexuspeplog.pages.dev/`. External browsing of preview could not verify Safari behavior; user pre-fix screenshots show previous preview loaded. New physical iPhone acceptance and VoiceOver NOT TESTED.
- Keep PR #123 DRAFT, main/production unchanged. Full exact-source LIVE/DEMO artifacts from latest build **INCOMPLETE until build/artifact verified**. User's user-data inventory conservation and historical source provenance review remain release blockers despite fictional checks passing. Separate explicit user permission required to merge/deploy.
- **ONE NEXT ACTION:** finish verifying run #40765996886, validate package parity and hand off files; then request physical iPhone UI acceptance. **USER ACTION:** open updated draft preview in Safari when handoff provided and evaluate icons, Back/Intel row, two stats; no production merge approval needed.


## 2026-10-28 — Compact Intel acceptance and current source CI
- Source `50eb4faaf39a8fb5cb978d7f121210606624f17d` draft PR #123. User accepted compact Back/Intel on physical iPhone (“perfect looks good”), **visual acceptance only**. Cloudflare preview deployment confirmed for exact SHA at https://a86e0d00.nexuspeplog.pages.dev/ ; no production merge.
- #40770526500 nested browser/navigation: **PASS** (196 deep-route 320/390 light/dark screenshots, 0 reported error/overflow). Screenshot artifact #12851898105 downloaded and viewed across 4 viewport/theme variations; tested aligned compact Intel/right-chevron, Back/left-chevron, two stat columns. In same run fictional insufficient inventory prevents save and valid 2mg save deducts one vial by 2mg: **PASS**. Do not extrapolate to real records.
- #40770526570 mobile forms: **PASS**.
- #40770526457 build/full source parity: **IN PROGRESS/NOT PASSED** on last query, browser QA step still active; no release artifact available. DEMO isolation and exact-source LIVE/DEMO ZIPs: **INCOMPLETE**.
- Physical-device whole-app navigation, edit/keyboard/scroll, dates, historic blend attribution confirmation/reversal and production vial conservation: **NOT TESTED** on actual private user dataset; release gate remains open. No current end-to-end iOS Safari/VoiceOver pass claimed.


## 2026-10-28 — FINAL EVIDENCE: Compact Intel QA + artifact parity VERIFIED (draft)
- User accepted Compact Intel visual design on physical iPhone (“perfect looks good”). This is **scoped visual approval**, not full iOS/VoiceOver acceptance and not merge/deploy authorisation.
- **Verified app source:** draft PR #123 application commit `50eb4faaf39a8fb5cb978d7f121210606624f17d`; main base `c1c95e1d`; PR draft/unmerged. Cloudflare bot successfully deployed this commit to **draft preview only** https://a86e0d00.nexuspeplog.pages.dev/ . Production Cloudflare parity report in artifact `Nexus_CLOUDFLARE_PARITY.json` has `verified:false` / mismatched root index, EXPECTED because draft was not promoted to production. Do not mistake this for a failed source package.
- **All exact-app-code QA successful:** #40770526570 mobile form SUCCESS; #40770526500 nested navigation visual SUCCESS (196 screens 320/390 light/dark, 0 overflow/errors; fictional insufficient/vial deduction passes); #40770526457 build and parity SUCCESS after previously pending browser QA. Built browser results 8/8 LIVE/DEMO PASS and vial safety results 8/8 configurations PASS. Downloaded workflow release artifact ID **12852152849** (`Nexus-release-artifacts`) and screenshot evidence ID **12851898105**.
- **Artifact validation performed independently on extracted ZIP**: archive CRC PASS; standalone `Nexus_v0.9.20-beta_FULL_DEMO.html` ~2.7 MB, NO external script tags, inline full application with fictional demo `buildDemoState`, `localStorage` / `sessionStorage` replaced with ephemeral memory and fail-closed validation, `fetch`/XHR/beacon disabled. Offline zip CRC PASS, exactly HTML+README, inner `index.html` byte-for-byte equal to standalone HTML. LIVE ZIP CRC PASS, exactly 21/21 expected root/asset files (index, 4 CSS, ordered 01–12 JS, 4 icons), zero missing/extras. **Every LIVE ZIP file's Git blob SHA-1 matched the actual `50eb4faa` GitHub file SHA (21/21)**, proving PR-head source parity despite build manifest recording internally generated combined source SHA `e18b1a4f41728fbafe35c4d505e928a68c4e2cea`; do not misrepresent synthetic build SHA as PR HEAD. Local Pages source parity `verified:true`; production Cloudflare remains distinct and intentionally unchanged.
- **Release delivery status:** in-chat preview DELIVERED; standalone full-app isolated DEMO HTML and offline ZIP VERIFIED; exact-source LIVE ZIP VERIFIED; release notes/QA in docs VERIFIED; GitHub draft PR UPDATED; automated checks PASSED; **merge and production deploy ON HOLD by user's explicit instruction**. Physical full-app iPhone functional checks, VoiceOver and real personal inventory/historical attribution acceptance **NOT TESTED / remain release gates**; no user backup imported or production storage altered.
- **ONE NEXT ACTION:** finish user-facing exact-source handoff and review remaining inventory/provenance acceptance gate without altering production; keep PR #123 draft. **USER NEXT ACTION: Nothing needed immediately**; compact design visual review already accepted. Separate explicit approval is required before any production merge/deployment.

## 2026-10-28 — Historical-only ingredient scenario added, NOT YET TESTED
- Commit `3ca0f351` adds synthetic dated 2026-01-15 confirmed recipe Ingredient A 40mg + Ingredient D 30mg while current kit recipe excludes Ingredient D; 7mg older unallocated dose should resolve 3mg Ingredient D and appear in ingredient history. Exact new-head nested CI **PENDING / NOT TESTED**; do not report Pass. Prior 50eb4faa workflows remain historical prior-source evidence. Multi-vial/mixed-source reversal and real-data conservation remain release blockers.

## 2026-10-28 — What's New lifecycle, partial code / NOT TESTED
- Commit `f34a847f`: manual What's New close no longer writes legacy `lastSeenChangelog` or saves primary state. Source audit confirms published startup notice requires `NEXUS_RELEASE.publicationStatus==='published'`, while draft manifest is `unverified`. Full trigger-reproduction, multi-release chronological history, Later/Got it browser test, iPhone and package parity **NOT TESTED**. Do not mark Pass or announce candidate as published.

## 2026-10-28 — What's New fictional lifecycle tests ADDED, OUTCOME PENDING
- `5dc3d1df` adds Playwright 320px/390px light/dark fiction-only tests for parsing v99.1.0-beta, upgrade/downgrade, first published launch, Later suppressing same-session re-prompt, future session reprompt, Got it acknowledgement, navigation re-render, subsequent version and unverified gate; restores storage keys and manifest in finally. `1341376b` fixes double-escaped semver dots (previous parser could compare incorrectly). CI exact-head **IN PROGRESS**, do not claim Pass until logs checked. Browser != physical iPhone/VoiceOver. Existing legacy history provenance unverified.

## 2026-10-28 — Historical published-releases archive test added (PENDING)
- `9a1838ca` adds read-only App Updates validation of v0.9.18-beta and v0.9.19-beta **Verified published** history labels in 320/390 dark/light nested browser matrix. `5dc3d1df` fictional release lifecycle tests cover first published launch, Later same session/next session, Got it, navigation rerender, next-version prompt and unverified suppression. `release/published-history.json` is generated into `02-nexus.js` and `release/generated/in-app.json`; build --check must validate output. **Current-head CI not yet passed/verified**, full-artifact parity and actual physical iPhone NOT TESTED.

## 2026-10-28 — Corrected What's New fictional lifecycle audit PASS
- Initial 4-width/theme cases FAILED due test expectation while in Demo Mode, where release prompts are correctly disabled: GitHub nested #40775720789. Harness `599f1de8` now separately verifies Demo Mode suppression and temporarily stubs eligibility while preserving and restoring all synthetic storage/manifest values. Exact application commit `599f1de8` nested audit #40776200367 **SUCCESS** (208 screenshots, 0 overflow/errors; includes historical archive, lifecycle and local fictional inventory). Mobile forms #40776200395 **SUCCESS**; preview browser #40776192105 **SUCCESS**. This is browser emulation; actual browser reload post-acknowledgement is not explicitly tested by a page.reload call, only rerenders plus simulated new session; physical iPhone/VoiceOver NOT TESTED. Build QA/upload #40776200351 still running at checkpoint.

## 2026-10-28 — Failed build QA after verified artifact construction, test repaired
- Build 40776200351: source/package validation PASS; full browser QA FAIL due legacy Plans test expecting `shouldShowPublishedRelease()` true directly after clicking Later. This contradicts production-gated designed Later session deferral. `68cf3356` updates harness: assert false same session, remove synthetic session defer key to model next session, assert true again, and restore original key. Source runtime unchanged. New run NOT YET VERIFIED. Failed-run artifacts must not count as cleared. Physical iPhone/VoiceOver, real navigation/reload and native release acceptance remain NOT TESTED.

## 2026-10-28 — Second Plans test failure, corrected eligibility and added real reload check
- Run 40776896536 FAIL at `Published version must show once, Later defer and acknowledgement persist` after prior browser test suites passed. Latest test-only f8d16a48 separately verifies Demo Mode intentionally suppresses production announcements before temporarily overriding `isDemoMode` in isolated fictional contexts; restores original function/storage. Test `2537ee40` now calls actual Playwright `page.reload` in each 320/390 light/dark LIVE/DEMO pass and asserts unpublished draft stays silent. **Latest-source test results pending**; no Pass claims for these new cases. Physical iPhone/VoiceOver and actual published-version hard reload remain NOT TESTED.

## 2026-10-28 — Corrected published popup/contrast eligibility in archived Plans suite
- Run #40776896536 FAIL at Plans published release prompt test in the fictional full-demo environment despite prior browser suites PASS. `29c4066f` and `f8d16a48` separate explicit demo suppression from fictional release notification; `4c5b23cd` extends eligible-user stub to release contrast visibility and `a8292e57` restores original session deferral key. `2537ee40` added actual hard-reload unpublished silence check for 8 live/demo dimensions. Current exact-head nested/browser/build statuses pending; only mobile #40777876462 and hybrid #40777868652 verified success at checkpoint. No physical iPhone/VoiceOver confirmation.

## 2026-10-28 — What's New exact-head FINAL AUTOMATED QA PASS
- Fixed legacy test setup `29c4066f`/`f8d16a48` for published fictional user vs Demo Mode guard, `4c5b23cd`/`a8292e57` for modal contrast and restoration, `2537ee40` for actual unpublished hard reload. Build + full QA #40777876259 **SUCCESS**: Plans hierarchy 8 live/demo 320/390 light/dark including Later/Got it/reload, full browser matrix 8, Check-In 8, Log Dose 112 flows/8 configurations, vial source 48 assertions, measurement math diagnostic 80/80, other protected suites PASS. Nested #40777876220 **SUCCESS**, mobile #40777876462 **SUCCESS**, preview #40777868652 **SUCCESS**. Release artifact #12855962516 versioned LIVE + self-contained isolated full-app DEMO + offline zip produced and GitHub workflow validated. Browser emulation does not prove physical iPhone, VoiceOver, clinical safety or personal-data correctness; physical iPhone **NOT TESTED**. Previous failed runs #40776200351 and #40776896536 remain historical, not retroactively marked passes.

## 2026-10-28 — User iPhone prior-preview acceptance and new candidate visual retest
- Real iPhone preview bcddbfd0 at commit 757f68e: user reports PASS 8/8 (navigation; manual App Updates opening; verified v0.9.18/v0.9.19; older note separation; smooth history scroll; light/dark readability; no surprise popup from nav; none after reopen). User confirms no automatic popup; v0.9.20-beta manifest is `unverified`, so this is correct, not published-version trigger acceptance. New `69399ef1` changes layout to icon-free unified rows, canonical verified version strings and collapsed legacy archive with `Update #N`; `27be794a` updates fictional nested history assertion. **Automated latest-head CI and fresh physical Safari UI retest NOT YET VERIFIED.** Test later: summary 44px, expansion and older entry accessibility, text wrapping 320px/390px dark/light, no duplicate versions; do not equate prior device pass with new design acceptance.

## 2026-10-28 — What's New user iPhone visual acceptance, production popup still NOT TESTED
- Physical iPhone on updated immutable preview: user reports redesigned history visual consistency ACCEPTED. Prior original preview 8/8 device checklist PASS; do not transfer every detailed prior pass to revised preview without explicit retest. No automatic What's New popup in unverified preview is EXPECTED, not a failed test. Fictional published-release browser tests from exact-head #40796526234 and full QA #40796526094 PASS; latest-head mobile #40796526082 and hybrid #40796519629 SUCCESS. Still NOT TESTED: published release popup on physical device, VoiceOver acceptance, personal-data production integrity. App Store history curation not actioned.

## 2026-10-28 — Stale What's New release gate tests
- `tools/check-release-readiness.mjs --self-test` includes 6 deterministic assertions: valid new version+notes; stale source blocked in strict mode; draft stale source warning; docs-only allowed; incomplete release change blocked; falsely published manifest blocked. Gate step in GitHub run #40797868119 **SUCCESS** with candidate mode. Full browser/nested new-head checks still pending at checkpoint. IMPORTANT coverage limit: prior DS2 fictional insufficient inventory test is single-vial only; multi-vial/prepared doses and user historical data not marked safe or accepted.

## 2026-10-28 — New prepared-dose multi-vial conservation test (PENDING)
- Added `56dc3f16` to `tools/validate-vial-safety.mjs`: fictional split batch 4 mg from vial A and 6 mg from vial B; 5 doses prepared, 3 unused; deletion must refund 2.4 mg to A and 3.6 mg to B, reopen both original empty vials and remove batch record. Extends test matrix to 7 cases x 8 viewport/theme/mode combinations (56 checks). **NOT TESTED** at commit time; no production data or clinical safety acceptance implied. Previous release-readiness gate synthetic tests and existing single-vial/multi-source tests remain separate evidence. Next: check full QA exact SHA and treat any failure as blocker.

## 2026-10-28 — Orphan prepared-dose source fail-closed regression ADDED / PENDING
- Code `4968983c` prevents deleting a prepared batch with unused doses when its explicit source kit/vial is absent; intended to prevent lost recoverable inventory history. Fictional test `b8ca5abf` uses 5 doses/3 remaining and a missing kit ID, then an existing kit with missing vial ID, asserting deletion returns false, batch persists and unrelated vial remains unchanged. Original multi-vial prepared unused-share test `56dc3f16` checks 4 mg + 6 mg source, 2.4 mg + 3.6 mg unused refund. `tools/validate-vial-safety.mjs` now 8 cases x 8 configurations; **LATEST-HEAD TEST IN PROGRESS, NOT VALIDATED**. Preserve failure status until logs reviewed. Human iPhone and historical personal attribution NOT TESTED.

## 2026-10-28 — Original prepared split-vial refund PASSED; orphan guard pending
- Source `56dc3f16` full build #40798440095 SUCCESS; explicit log evidence 8 LIVE/DEMO x 320/390 x light/dark = 56 vial-safety case checks PASSED. ZIP/full-app demo structural verification, Plans 8 and measurement math 80/80 PASS. New production-source change `4968983c` and fictional missing-source test `b8ca5abf` have not yet passed full QA; 64-case matrix run #40798876625 in progress. Physical iPhone/real historical records not tested.

## 2026-10-28 — Prepared two-vial and orphan-source safety regression FINAL PASS
- GitHub exact app/test commit `b8ca5abf`, full build/parity #40798876625 **SUCCESS**, explicit log 8 live/demo × 320/390 light/dark = **64 vial-safety case checks PASS**. Includes test `56dc3f16` two-vial 4+6 mg allocation, 3/5 unused returns 2.4+3.6 mg exactly, original empty vials reopened; test `b8ca5abf` missing explicit kit/vial ID returns false, keeps prepared batch and leaves unrelated inventory unchanged; code guard `4968983c`. Also source-matched package QA, full browser 8, Plans 8, measurement math 80/80 diagnostic PASS. Nested #40798876622, mobile #40798876627 and hybrid #40798869966 SUCCESS. Artifact #12864798683 available (CI validation, not independently extracted locally). Actual iPhone blocked-deletion UI, VoiceOver and real historical records **NOT TESTED**. Safety approval limited to tested fictional paths; broader release remains blocked.

## 2026-10-28 — Two-vial refund exact-source confirmation + blocked-dialog test pending
- Full source `ccd3b032` build #40799634203 PASS; explicit GitHub job log confirms 8 configurations, 64/64 fictional vial safety assertions PASS (including 4+6 mg prepared two-vial refund 2.4+3.6 mg and orphan kit/vial fail-closed). Protected Log Dose 112 flows, Plans 8, measurement diagnostics 80/80, ZIP+isolated full-app DEMO validation PASS. New test-only `f70b5c26`: exercise actual orphaned prepared-batch Delete confirmation UI, assert modal stays open, exact warning is visible and no changes to prepared batch or unrelated inventory. Target 9 x 8 = 72 assertions; **NOT VERIFIED pending #40801104052**. Physical iPhone UI/VoiceOver and personal historical records remain NOT TESTED.

## 2026-10-28 — Orphan prepared batch confirmation UI exact-source PASS
- `f70b5c26` full build #40801104052 **SUCCESS**; explicit log `Nexus vial-source core regression PASS: 8 LIVE/DEMO viewport/theme combinations, 72 safety assertions`. Includes actual delete modal, user confirm click, alert message visibility, modal persistence, record and unrelated balance unchanged on absent original vial. Workflow also verifies exact LIVE ZIP, full standalone isolated DEMO/offline ZIP. Artifact #12866491578. **Not verified:** real iPhone warning/keyboard/VoiceOver, user historical data provenance, clinical calculator safety, production byte parity.

## 2026-10-28 — Legacy prepared-dose source-attribution cases added, NOT YET VERIFIED
- Runtime `0ad1f6cb`, fictional test `af1b789b`: (1) legacy allocation missing vialId with replacement open vial must block refund/deletion; (2) missing allocations must preserve prepared record and both vial balances; (3) actual delete confirmation must keep dialog open and show unverified-source message. Existing exact-vial refunds and orphan-source tests remain. 8 mode/viewport/theme configurations × 12 named scenarios = 96 expected; result **NOT TESTED / CI PENDING**. Physical Safari warning layout, VoiceOver and real historical provenance **NOT TESTED**. No live-data testing authorized.

## 2026-10-28/29 — Isolated orphan-warning Safari fixture (candidate, results pending)
- `4c5c6988` builds a source-matched standalone in-memory full-app Safari fixture and ZIP with missing historical vial ID, original vial 0mg and currently open vial 7mg. `c93b1bac` adds browser assertion that actual confirmation opens, blocked-delete warning is visible, dialog stays open and count/balances remain unchanged in 320/390px and light/dark. No real Safari iPhone/VoiceOver test, no validated hosted fixture; CI pending. Production state untouched.

## 2026-10-28/29 — Isolated orphan warning artifact validated in GitHub CI and local extraction
- Full run #40805671460 SUCCESS on `c93b1bac`: isolated orphan preview automated 8 configurations PASS, core vial source 96/96 PASS, Log Dose 112 flows PASS. CI artifact #12868362089 downloaded and extracted; standalone orphan HTML byte-identical to ZIP `index.html`; ZIP integrity PASS and memory-only storage, fictional banner and QA fixture markers present. **Physical Safari / VoiceOver: NOT TESTED**. Dark light-theme audit 58 light candidate contrasts need manual confirmation; production host byte parity expected mismatch on unmerged draft.

## 2026-10-28/29 — Physical iPhone standalone orphan-source acceptance USER REPORTED PASS (12/12)
- User marked **PASS** for all 12 physical iPhone checks on fictional isolated legacy prepared-dose warning demo: open, fictional banner, confirmation auto-opens, fit/safe area, deletion action, warning visible, dialog persists, text legible, cancel/close, batch preserved, vial balances preserved, light/dark. Note “Everything looks good!” Distinguish reported visual/functional device acceptance from independent device instrumentation or VoiceOver acceptance; VoiceOver NOT TESTED. Matching CI #40805671460 PASS (96/96 source, 8 preview), artifact #12868362089 validated. No real records tested and none required.

## 2026-10-28 — DS2 exact-head final automated QA + focused physical iPhone (USER REPORTED)
- Application SHA `441d22a0847e536cbb5a0e6bc27463b74e2de34d`, PR #123 draft. PASS automated: full build/parity #40812666592; mobile form #40812666510; nested visual #40812666504. Nested evidence #12870992426: 176 screenshots, 208 cases, zero document horizontal overflow. Release artifact #12870988417 downloaded; exact-source LIVE and fictional isolated DEMO checked.
- USER REPORTED physical iPhone: PASS Compound History single scroll; PASS Compound History bottom actions; PASS Profile fresh-entry overview; PASS Settings normal Back. 4/4, notes None. Do not mislabel as automated device instrumentation or whole-app VoiceOver coverage.
- NOT TESTED/UNVERIFIED: Cloudflare preview commit identity, production deployment/byte parity, comprehensive physical iPhone VoiceOver, personal historical production data. No known new failure in these four focused cases; do not generalize to every flow. No merge/deploy approval.

## 2026-10-28 — Approved merge gate and deployment verification hold
- Exact PR head `8c3fbf9c` CI PASS full #40813703596, mobile #40813703634, nested #40813703782. Guarded merge PASS, merge SHA `6737d9c7`, PR #123 closed/merged. Focused physical iPhone user-reported PASS 4/4 retained from `441d22a0`.
- Production Cloudflare index/CSS/JS, deployment commit and post-merge browser parity: BLOCKED / NOT VERIFIED (web cache miss and container DNS failure). Release certification held; no claim that Cloudflare has deployed merged files or changed users' saved data.

## 2026-10-28 — Production parity attempt (BLOCKED, not FAIL)
- Source main index structure PASS: expected v0.9.20-beta title, 12 ordered JS scripts, four CSS links. Live primary Cloudflare homepage, /assets/js/12-nexus.js and /assets/css/nexus.css: BLOCKED (web cache miss/inaccessible; container DNS resolution failure). No byte/hash parity and no deployment timestamp. Post-merge GitHub commit-status query returned no statuses and workflow query no runs: NOT VERIFIED. Previously exact PR-head CI PASS and focused physical iPhone user 4/4 PASS remain valid for their tested source only.

## 2026-10-29 — What's New automatic launch NOT DISPLAYED (user-reported)
- User observed no What's New when launching Nexus after approved PR #123 merge. Source examination: `NEXUS_RELEASE.publicationStatus='unverified'` in `02-nexus.js`; `shouldShowPublishedRelease()` in `12-nexus.js` returns false unless `published`. This is expected under currently unverified publication, but end-to-end published-release notification remains INCOMPLETE, not PASS.
- Live Cloudflare verification still BLOCKED via web; do not conflate source inspection with live asset proof. Isolated published-mode and real iPhone published-popup acceptance remain NOT TESTED here. No production data changed.

## 2026-10-29 — Isolated preparation ledger prototype (PR #124)
- Added pure, **not live-wired** `assets/js/nexus-preparation-ledger.js` at `e2dad0f5` with explicit preparation ID, compound, method, container type, remaining mg, optional nasal mg/spray, source IDs and transaction events. Separate transfer (vial → nasal bottle) from dose; reject duplicate transaction IDs, method mismatch, invalid amounts, cross-compound transfers and insufficient stock before mutation.
- Added `tests/preparation-ledger.test.cjs` at `960e2829`. Ran six equivalent fictional Oxytocin nasal/SubQ assertions in isolated JavaScript evaluator: transfer, nasal dose, SubQ dose, duplicate block, method mismatch block, insufficient stock atomicity: **6/6 PASS**. Repository test script not yet executed in CI; no integration with production dose/save logic.
- **INCOMPLETE:** live Stash preparation editing and persistence, source-switch UI, vial-to-bottle integration and existing inventory ledger reconciliation, browser/CI regression, full-app DEMO/LIVE ZIP. Do not merge/deploy. Next: integrate ledger through a single guarded transaction boundary with legacy data compatibility and test edits/rollback/stock.

## 2026-10-29 — Preparation bridge integration milestone, not release-ready
- PR #124: loaded `assets/js/nexus-preparation-ledger.js` before `04-nexus.js`/`05-nexus.js` in root index (`a25adbc3`). Added `nexusPreparationForKit`, `nexusEligiblePreparedSources`, `nexusCreatePreparationRecord` and `nexusPreviewPreparationTransaction` (`3cd25d74`). The new state.preparations collection is additive; no automatic conversion or mutation of legacy kits or dose records. Preview transaction works on a cloned preparation collection and never deducts live vial inventory. Explicit guard prevents treating a preview as committed transfer.
- Verified syntax parsing for ledger and `04-nexus.js`: PASS; HTML script order ledger → 04 → 05: PASS. Earlier six fictional pure-ledger assertions PASS; **live source switching, canonical kit transfer deduction, atomic persistence, replay/idempotency, full browser tests NOT TESTED / INCOMPLETE**. No Stash editor, LIVE ZIP or isolated full-app DEMO yet. Do not merge/deploy.
- ONE NEXT ACTION: implement atomic adapter that reconciles kit open-vial ledger and preparation ledger without double counting, plus explicit Stash preparation editor; run real app fictional transfer/dose/rollback tests.


## 2026-10-29 — Atomic preparation bridge candidate, CI PENDING
- Added `tests/preparation-bridge.test.cjs` on PR #124. Fictional source inventory 8mg, 2mg transfer into nasal bottle, expected vial 6mg and bottle 2mg while original snapshot remains unmodified. Covers duplicate replay and 12 rejected cases (overdraw, negative amount, missing IDs, legacy missing remainingMg, sealed vial, wrong compound, conflicting origin, blend kit and wrong destination container). CI workflow now invokes both preparation-ledger and bridge scripts.
- Results: **NOT TESTED / PENDING CI** until exact-head workflow evidence. Integration, persistence rollback, protected flows, 320/390 light/dark, device and release parity remain **NOT TESTED**. Do not count isolated assertions as live inventory safety.


## 2026-10-29 — Preparation transfer guarded commit checkpoint
- Pure bridge `commit(current, tx, {read,write})` compares complete saved snapshot, plans transfer without mutating input, checks sum of authoritative vial `remainingMg` before/after against source debit and preparation credit, rechecks storage before writing, writes full snapshot once and verifies readback. Fail-closed on nonnumeric canonical vial totals, legacy source, insufficient stock, duplicate ID and stale snapshot.
- Fictional tests added for successful single write, duplicate replay, insufficient stock, thrown quota/storage failure, legacy missing `remainingMg`, stale snapshot and silent write failure. **CI outcome pending; do not mark PASS without run evidence.**
- **Limitation:** no UI transfer controls, no production integration or live storage writes. The caller must swap in-memory state only after commit returns. Storage readback is not cross-tab compare-and-swap and cannot guarantee crash-atomic disk durability; stronger concurrency handling remains required before exposing controls. Full-app DEMO/LIVE ZIP and physical iPhone verification INCOMPLETE.


## 2026-10-29 — Ordinary-save stale-write guard and CI blocker
- Ordinary `saveState` now captures the storage snapshot, refuses a changed stored snapshot, verifies readback, and updates its baseline; guarded transfer updates the baseline after successful commit. Existing `saveState` still catches errors and shows a warning rather than returning success, and does not acquire a shared browser lock. **This is partial coordination, not proven cross-tab atomicity. Keep transfer UI disabled.**
- Prior CI release-artifacts run 40820258068 FAILED in `tools/validate-trust-ui.mjs:139`: premixed blend dose expected one blend record and one ledger entry, observed zero. Do not mark browser regression PASS; investigate blend flow before merge.
- Latest changes have not yet been tested by CI. Fictional integrity tests and complete regression matrix PENDING. No production merge/deploy, no real data migration.


## 2026-10-29 — Blend optional-site candidate fix
- Release browser regression failed at `tools/validate-trust-ui.mjs:139`, expected one premixed blend dose and ledger entry but observed zero. In `assets/js/05-nexus.js`, blend save handler read `#site.value` unconditionally despite optional administration-site UI. Changed to optional read (`?.value || ''`) in `efef69ee`; **candidate root cause only, CI rerun required**. Historical doses not migrated or modified.
- Ordinary saves currently have stale-write detection/readback but do not acquire the transfer's exclusive Web Lock; full shared coordination remains **INCOMPLETE**, transfer controls disabled. Browser/full suite and exact-head artifacts **NOT VERIFIED**.


## 2026-10-29 Regression follow-up
- Run 40820869183 browser FAILED: blend 0 and ledger 0 vs expected 1. Run 40820869207 nested screens FAILED at valid-dose save; mobile 40820869205 SUCCESS.
- Original detailed SubQ and IM site choices had been collapsed in the new selector. Restored detailed sites and legacy edit values at 23d8b667. Browser/iPhone tests PENDING.
- Fictional blend fixture lacked explicit route label and was ineligible under new route filtering. Labelled fictional fixture SubQ at 13579680 without relaxing production route validation. CI rerun PENDING.
- Full shared locks for synchronous saveState and transfers are NOT IMPLEMENTED. Transfer controls disabled. Formulation-specific capsule/route inventory NOT IMPLEMENTED. Full QA, full-app DEMO/LIVE source packages and physical iPhone acceptance remain INCOMPLETE.


## 2026-10-29 — Additional method/source regressions
- Release browser QA on 1f3c5f5e: check-in, 8x 320/390 theme browser matrix, 96 vial-source assertions passed, then FAILED at validate-logdose-ui.mjs:182 optional source ID disclosure. Test fixture source was unlabelled and therefore filtered. Fixed fictional fixture route to SubQ at 96ed8e; CI for corrected head pending.
- Method-scoped getEligibleSourceKits(name, method) and dose modal selection implemented at 1bbf23e / 55d886f; new fictional 320/390 tests assert same-compound SubQ and Nasal open vials do not co-mingle (f4fb8d9). Execution on updated head pending.
- Safety gate for internal preparation transfer explicitly disabled 119d81b until coordinated writer protocol verified. Ordinary synchronous saveState cannot acquire async Web Locks without changing save timing; no claim of full coordination or real-data testing.


## 2026-10-29 — Unknown-route fail-closed guard
- Source eligibility now uses nexusExplicitAdminMethod: unknown method labels return null, unlike nexusAdminMethod legacy display fallback SubQ. Prevents unknown/unlabelled stock from silently appearing as injectable SubQ. Fictional route isolation suite now seeds simultaneous SubQ, Nasal, Unknown and unlabelled open vials and expects only the exact corresponding known route (commits af98f36e, 0813a555, b0da45d8).
- Latest full CI for this exact source head still pending. Ordinary synchronous saves have not migrated to shared Web Locks; preparation transfer enabled flag remains false. No production data changes.


## 2026-10-29 — Selector UI regression coverage added
- Added fictional LIVE/DEMO browser checks for six admin method buttons, SubQ abdominal site selection, switch to IM region options, and synchronised canonical method/site values. UI implementation includes 44px targets, keyboard focus and 320px/390px sizing. These are assertions committed, **NOT verified passing until CI reports**.
- Historical saved doses and data schema unchanged. No merge/deployment, no real transfer controls.


## 2026-10-29 — Combo Dose omission regression
- Combo Dose previously included a shared symptom picker and passed state._comboSymptoms to planAndApplyComboDoses. Removed picker/UI wiring, pass [] for new dose symptom annotations, preserve existing symptom data. Added fictional regression asserting no combo-sym and no change to previous temporary symptom values. Full CI still PENDING.
- Full build at fd40e886 FAILED fictional method isolation: expected only 9331 SubQ but 9334 was also included because the test factory automatically labelled all vials SubQ; fixed fixture by deleting the label before the unlabelled-case assertion. Exact updated build verification PENDING.


## 2026-10-29 — Formulation Stash regression additions
- Fictional Node tests validate oral capsule vs nasal bottle separation, duplicate IDs, negative/fractional stock rejection, preserved original supplies/peptide history, immutable audited balance adjustments, duplicate adjustment replay and thrown/stale/readback-failed storage saves.
- Playwright LIVE/DEMO test added for 320/390px light/dark: Stash Add Capsules, Add Nasal, Adjust capsule count and original vial stock immutability. Earlier run 40890957999 failed because fictional onboarding overlay intercepted + Capsules. Test fixture now dismisses onboarding modal and demo banner before tapping; rerun pending.
- No physical iPhone test, no production data writes, no dosage or spray conversions; transfers remain disabled. Mark final full-browser result only from exact-head CI.


## 2026-10-29 — Full QA and iPhone-width formulation touch audit
- Full build/browser run 40891595782 SUCCESS on 4484dc5d. Mobile form 40891595812 SUCCESS; DS2 nested-navigation 40891595726 SUCCESS. Release artifact 12906345167 exists. No Cloudflare production deployment asserted.
- Added 320px and 390px fictional LIVE/DEMO checks for formulation section horizontal overflow and 44px minimum buttons including Adjust at c8507b74. Latest new-head CI PENDING, not falsely marked Pass.
- Physical iPhone Safari tap, modal keyboard/safe-area and VoiceOver acceptance **NOT TESTED**; user testing required once a verified isolated preview is accessible. Transfer/dose deduction controls disabled.


## 2026-10-29 — Added WebKit iPhone-emulation regression
- New .github/workflows/nexus-formulation-webkit.yml runs standalone full-app DEMO and LIVE local fictional Stash Add/Adjust tests across widths 320/390 and light/dark with WebKit. Test started on commit 1374fbaa run 40893001058; no pass claim until completion.
- Tests include minimum 44px actions/Adjust touch targets, no 320/390 horizontal overflow, no legacy vial mutation and correct capsule/nasal balances. Real iPhone Safari keyboard, safe-area, VoiceOver and home-screen PWA behaviour remain NOT TESTED.


## 2026-10-29 — WebKit evidence confirmed
- WebKit Stash workflow 40893001058 on 1374fbaa **SUCCESS**, exercising fictional LIVE/DEMO 320/390 light/dark capsule/nasal Add and Adjust, isolated vial inventory and 44px/overflow checks. This proves automated Safari-engine coverage only; physical iPhone/VoiceOver **NOT TESTED**.
- Full Chromium/browser CI 40891595782 on 4484dc5d **SUCCESS**; exact latest-head full browser CI still pending. No merge, no deployment and no production data changes.


## 2026-10-29 — Explicit UX correction regression
- Log Dose method 3x2 button grid retained; site selection changed back to native dropdown with full SubQ/IM regions, legacy site options preserved in edit flow. Browser assertion now checks site option selection and temporary Nasal-specific warning hides on switching method. Code commit 6b941cac, test 78783c6e. Exact-head CI PENDING.
- Standalone Other formulations Stash section explicitly rejected; replacement kit-centred UX not yet implemented. Protect existing data including formulationStocks and legacy kit/vial IDs; full browser/device tests for replacement NOT TESTED.


## 2026-10-29 — Unified Add Kit and per-vial intended-use regression
- New fictional Add Kit test enters via supplyModal(null,null), asserts five physical forms, 44px+ chooser targets, then adds capsule kit and purchased nasal spray kit, adjusts a capsule balance and checks no legacy vial changes across LIVE/DEMO, 320/390, light/dark, Chromium/WebKit.
- Earlier run 40896650468 FAILED iPhone-width form button height 40; WebKit 40896650641 FAILED height 43. New run 40896852592 reached Adjust control and FAILED height 17. Form buttons now explicitly min-height 80px, Adjust explicitly 46px. Exact revised CI NOT YET VERIFIED.
- New route-isolation assertion ensures a vial labelled intendedUse=nasal-source is ineligible for SubQ logging; no history rewrite, transfer or automatic stock deduction. Shared write lock still INCOMPLETE.


## 2026-10-29 — Unified Add Kit DS2 test reconciliation
- DS2 audit 40897763612 FAIL had 4 x missing nx-kit-next on first Add Kit chooser; this is an outdated assertion, since Continue is inside Vials editor after selecting its product form. Updated scripts/ds2-nested-navigation-audit.mjs to enter Vials for its wizard/final-save screenshots and to omit ungrounded primary-CTA expectation on form-choice screen (commit fcb459a2). Next run PENDING.
- Formulation WebKit run 40897763578 SUCCESS and mobile 40897763656 SUCCESS on a90bc116. Full browser on that commit in progress. Exact latest-head pass not yet established. Real iPhone NOT TESTED; no production data changes.
