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

### 2026-10-24 — Protocol status filter A1 merge QA
- GitHub workflow A1 head `c9d53c31`: build/parity `40139548045` PASS, mobile `40139548154` PASS, 20-file LIVE ZIP CRC and full/offline DEMO byte-parity PASS. No dedicated newly-added automated assertion for selecting each Protocol filter confirmed; physical iPhone and Cloudflare NOT TESTED. Baseline diagnostic remains calculator 40 FAIL/80, independent PR #67 held. Next Goal↔Protocol refs, preserve inactive/paused/completed status and old template goalId meaning.
