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

## v0.9.6 Log Dose real form and draft regression — CI NOT YET RUN (2026-10-24)
- `tools/validate-logdose-ui.mjs`: actual browser calls `doseModal`, types into visible form fields and clicks Confirm, captures application state, across 320px/390px, dark/light, LIVE/complete isolated DEMO. Assert single record with original ID across edit; exact same-vial restore/reapply; impossible total open stock never creates partial record or leaves modified vials; click Add Another Vial and save an explicit two-source dose; prepared-source confirmation adjusts prepared count exactly once with no extra vial consumption; Open Sealed Vial handoff keeps date/amount/notes draft with no inventory mutation. Test status pending, no fabricated PASS.
- Actual iPhone Safari keyboard, complex multi-vial Draw+Reconstitution completion, complete history export/import and App Store content audit NOT TESTED.

### v0.9.7-beta confirmed regression/fix gate (2026-10-24)
- Initial PR #35 run `40060961550` FAILED NEW ASSERTION: `UNDERALLOCATED_FORM_SAVED_PARTIAL_DOSE` (requested 7 mg, 6.5 mg open; produced a partial source dose record). This is a verified safety regression in v0.9.6. Existing browser, Check-In, Protocol, vial-core suite PASS before this failure; mobile `40060961592` PASS.
- v0.9.7 targeted fix: form must block 7 mg confirmation until all 7 mg are assigned, and reject 0/-1/empty/non-finite amount without creating records or moving vial stock. Test other real modal interactions at LIVE/complete DEMO, 320/390, dark/light: 2→3 mg edited same-vial replacement with same ID, 4 mg explicit 1.5+2.5 mg source split one record, prepared syringe no double deduction, Open Sealed Vial handoff preserving draft. **Latest CI NOT YET VERIFIED**; never mark PASS without Actions evidence.

### v0.9.7 full Log Dose UI result — PASS (2026-10-24)
- GitHub source/build/browser run `40061288470`, artifact `12546878570/Nexus_v0.9.7-beta_LOG_DOSE_END_TO_END.json`: 8/8 PASS LIVE & whole-app fictional DEMO, dark/light, 320/390; five end-to-end flows per case: one record and original ID across edit, 2→3 mg same-vial stock reapplication, rejected 7 mg/6.5 mg insufficient allocation and 0/-1 amounts with no recorded history or stock movement, 1.5+2.5 mg manual two-vial confirmation one entry, prepared source no second vial deduction, unsaved draft preserved across Open Sealed Vial handoff. Prior vial math source regressions 48 PASS, Check-In deep regression 8 PASS, Protocol sheet 8 PASS, mobile regression `40061288551` PASS.
- Original v0.9.6 real-UI negative test run `40060961550` FAILED (confirmed user-facing bug); this test now PASS with patched v0.9.7. Physical iPhone, native Safari keyboard and full draw shortfall dialogue not yet tested. PR merge and actual remote Pages confirmation pending.
