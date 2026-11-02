## 2026-11-02 — Engineering gate review READY FOR ONE PHYSICAL UAT; 16/16 physical NOT ACCEPTED
- Candidate application/test source 7b66191d: Chromium #41405000968, WebKit #41405001103, mobile #41405001050, nested #41405000996, writer #41405001163 SUCCESS. The old mixed legacy-writer P0 has been **fixed and verified in draft source**, including actual app stale save + failed write rollback, static no-unlocked-write audit. This does not authorize enabling nasal LIVE, deploying or merging.
- Browser coverage by row: #01 form-first Open Vial; #02 irrelevant site clearing/legacy source; #03 Add Kit; #04/#05 shared headers/close; #06 picker/custom focus; #07 capsule; #08 Raw/Topical; #09 nasal compact entry/review; #10 one-confirmation source→bottle; #11 direct historical source action; #12 explicit source and destination Review; #13 separate ledger balances; #14 injectable/capsule/spray Log Dose and historical edits/Undo; #15 8/8 exact computed font family/size/weight/theme colours and screens; #16 Goal Details 320/390 light/dark source/demo screenshots + keyboard tabs in BOTH browsers. See named exact CI above. The 16×16 per-row comprehensive matrix is NOT exhaustively sampled; do not claim more.
- Goal WebKit source 7b66191d: 32 new Goal PNGs (16 full viewport + 16 target crops), 296 total artifact entries CRC PASS, selected 320 screenshot visibly no title/close/tab horizontal collision. Chromium 8 Goal full screenshots, artifact 524 CRC PASS. Full-app isolated DEMO and 26-file LIVE ZIP source-matched.
- All 16 rows: **physical iPhone acceptance NOT TESTED** on this candidate. Previous physical screenshot failures remain historical evidence until user tests once. Use grouped single-session playbook in docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md; do not ask for fragmented retests. DS2, existing history, saved stock, form-specific source gates, nominal math preserved; nasal LIVE OFF, PR draft/unmerged/undeployed.

## 2026-11-02 — Consolidated 16-point QA audit, browser passed / physical OPEN
- Source 653a7f78, main da585ab3, PR #124 draft/unmerged/undeployed. Corrected Chromium #41400223943 PASS, WebKit #41400223773 PASS, mobile #41400223658 PASS, nested #41400223790 PASS, scoped writer #41400223736 PASS. P0 mixed legacy-writer remains BLOCKING; LIVE nasal gates OFF.
- #15: 8/8 LIVE/DEMO 320/390 light/dark computed typography assertions PASS; 8 expanded Additional dose options screenshots manually inspected. UI font matches method; summary 14px/650, checkbox labels 14px/500, helper 12px/400 and theme token colours. Original labels/one helper retained. Former screenshot harness ReferenceError fixed b4bd969c.
- Visual 16 stage types x 8 configurations x 2 engines = 256 recorded foreground/visible/in-bounds observations; screenshots reviewed in 320 light/dark for Add Kit, form-first Open Vial, capsule/spray Review, nasal Review, Raw Powder, Topical, picker. This is NOT 16 requirements exhaustively tested in every config.
- Exact manifest commit matches 653a7f78; Chromium outer 484-entry ZIP CRC PASS, LIVE ZIP 26 entries CRC PASS, full-app standalone DEMO 3,076,903 bytes isolated ephemeral-memory, offline DEMO ZIP 2 entries and byte-equal index.html; WebKit outer 264-entry ZIP CRC PASS.
- Per issue evidence and unfinished work:
  01 form-first chooser browser PASS; device pending.
  02 noninjectable site cleared Chromium PASS; legacy edit and device pending.
  03 Add Kit correct header/intro/step screenshot sample; full wizard/device pending.
  04 shared header subset visual PASS; Goal/legacy/all-sheet device pending.
  05 SVG close source/browser subset PASS; whole-sheet/device sweep pending.
  06 shared compound picker browser/visual PASS; native keyboard/device pending.
  07 capsule Entry/Review browser visuals PASS; device/legacy edit pending.
  08 Raw Powder/Topical browser visuals PASS; complete device journeys pending.
  09 nasal Entry/Review/Back/browser scroll PASS; native keyboard/device pending.
  10 fictional one-confirmation transfer exact-ledger PASS; LIVE BLOCKED by P0.
  11 historical reserved nasal source direct action browser PASS; wider legacy/device pending.
  12 nasal Review source/destination and CTA browser PASS; long-label/device pending.
  13 original source and prepared-bottle accounting tests PASS; older stock/device pending.
  14 capsule/spray Review WebKit and injectable Chromium PASS; legacy/device pending.
  15 exact typography and screenshots Chromium 8/8 PASS; physical pending.
  16 Goal keyboard tab and nested navigation PASS; native VoiceOver/safe-area pending.
- ALL physical iPhone acceptance items remain NOT TESTED on this candidate; prior rejected screenshots are not overwritten by CI green. Next priority: complete remaining legacy/Goal/device coverage as one coordinated acceptance round, but first clear P0 before any release. No merge/deploy or user-data changes.

## 2026-11-02 — User confirmation and #15 visual acceptance criteria
- User explicitly confirmed all 16 corrected interpretations. Do not replace targeted styling with extra copy, features or interactive previews. #15 is specifically Additional dose options font family/size/weight/colour parity with the existing Log Dose form in light and dark, keeping checkbox handlers and original text unchanged. Scoped CSS and restored original content already present on branch; exact computed typography assertion and expanded-panel screenshot added at `566a2536`. **Status: CODED; exact-head CI / screenshot review PENDING; physical iPhone NOT ACCEPTED.**

## 2026-11-02 — #02/#11/#15 latest browser VERIFIED; 16-point device acceptance still OPEN
- **#02:** Legacy Log Dose non-injectable methods Nasal, Oral, Topical, IV and Other now explicitly browser-asserted to hide/disable/clear irrelevant administration sites while SubQ/IM remain available. Runtime unchanged; Chromium #41394215775 SUCCESS (8/8 Log Dose cases).
- **#11:** DEMO-only direct nasal source Stash action verified on `1cb85019` and retained in current code; five workflow groups PASS. It opens existing single-confirmation Review, no write on opening and hides once source depleted. Physical acceptance still OPEN, LIVE gates OFF.
- **#15:** Additional dose options explanatory copy and accessible descriptions `1bf5e69d`; expanded/collapsed and independently checked/cleared unsaved checkbox regression PASS at `fbdaafea` Chromium #41394215775; **physical keyboard UAT still OPEN**.
- **#08/#09/#12:** WebKit #41394215749 PASS, CRC artifact #13119235667 (264 entries); manually inspected 320/390 light Raw Powder, Topical and actual nasal Review sample screenshots. This is focused browser visual acceptance, NOT full 16-point iPhone acceptance.
- Exact candidate `fbdaafea` all five workflow groups SUCCESS, full-app DEMO and LIVE ZIP exact-source audit PASS. **Do not mark all 16 device PASS, merge or deploy.** P0 release acceptance BLOCKED.

## 2026-11-02 — #11 automated VERIFIED; #15 UI implementation and #02 regression candidate
- **#11:** Demo-only opened nasal-source Stash action `7f06617e` + regression `1cb85019`: Chromium/build #41393354271, WebKit #41393354453, mobile #41393354352, nested #41393354356, writer #41393354445 **SUCCESS**. This verifies no pre-confirm state changes, same one-confirmation Review and absent redundant action for exhausted source. **Physical iPhone UAT not accepted.** LIVE nasal gating OFF.
- **#15:** Both Log Dose Additional dose option controls gain connected helper descriptions in `1bf5e69d`; control interaction regression `87cfc2c4` verifies independent toggle, collapse/reopen state and no save. **Await latest exact-head Chromium #41394215775.**
- **#02:** New route/site regression `fbdaafea` checks Nasal/Oral/Topical/IV/Other site controls hidden, disabled and cleared, SubQ/IM preserved. No runtime source/edit/history changed. **Await latest exact-head Chromium.**
- All 16 physical UAT points remain OPEN/not accepted. Preserve P0 mixed-writer blocker, demo-only nasal and PR draft/unmerged/undeployed.

## 2026-11-02 — #11 direct historical nasal-source action implemented, browser verification pending
- App `7f06617e`: within Stash Details > Vials, an eligible opened, explicitly reserved nasal-source with remaining mg shows one **Prepare nasal bottle** action in isolated DEMO. This invokes existing unified preparation Review/Confirm (not an extra "Record prepared nasal spray" action) and is omitted when source remaining mass is zero; retains original vial history. LIVE remains OFF.
- Exact UI regression `1cb85019`: actionable view; no pre-confirm mutation; no post-full-transfer action; 320/390 and light/dark in both browser engines. Chromium/WebKit CI still pending. **#11 PARTIAL until exact-head browser pass and real-iPhone UAT**. P0 mixed-writer BLOCKING, no merge/deploy.

## 2026-11-01 — Engineering delta after consolidation; user-device signoff NOT CLAIMED
**Source/test baseline:** application `1cc45e4622baa18250c3105c31990018946a12ef`; Chromium #41390039557 PASS, WebKit #41390039507 PASS, mobile #41390039506 PASS, nested #41390039533 PASS, writer #41390039503 PASS. Exact demo/live artifact #13117342031 CRC checked. This is not a physical iPhone UAT pass and P0 remains blocking.

| Issue | Concrete improvement verified in this sprint | Remaining before closing |
|---|---|---|
| #02, #04 | Open Vial fields no longer use a forced three-column 320px layout; source-controlled responsive 2/1-column CSS `b44c4122` | Full legacy/site route walkthrough and actual 320px Open Vial editor visual approval |
| #05 | All 3 remaining **shared Open Vial** close glyphs replaced by matched outline SVG `42ef2f71`; static source gate `694852b4` PASS in full CI | Whole 16-screen close alignment and physical taps |
| #07, #14 | Existing capsule/spray review docks preserved; exact-head two-engine formulation tests PASS | Legacy/edit paths, iOS software keyboard, physical UAT |
| #09, #12 | Actual nasal-preparation Review now uses an anchored action dock, one bounded summary scroll, visible consent and Confirm at 320/390 light/dark. **Real bug reproduced** on test `3d65617f`: Confirm at y=1081 for 844px viewport; corrected at `1cc45e46`. Chromium/WebKit screenshots manually inspected. Nominal qualification remains in Review `50f399ac` | Full legacy and physical iPhone acceptance |
| #16 | Goal Details tabs now have roving focus, ArrowLeft/Right, Home/End and control relationships `86e3d242`; regression `4f005b47` passes Chromium full QA | Real iPhone safe-area/VoiceOver acceptance |

**Not silently marked complete:** #01/#03/#06/#10/#13 previously CODED with focused/broad QA; #08 topical/raw form full visual parity, #11 historical nasal fallback, #15 optional-dose detailed physical UAT, #02 legacy-path inventory/route audits remain unresolved or partially verified. All 16 are still **physical UAT pending / previously rejected**. No merge or deploy permission. LIVE nasal gates remain OFF. Do not collapse "CODED" with "device ACCEPTED".

## 2026-11-01 — #14 WebKit corrected Review screenshots
- #14 / #07 / #09: `d4b18b8` WebKit #41387143892 PASS, 320 dark and 390 light LIVE capsule/spray Review screenshots inspected: docked Edit/Confirm visible, header/close clear, summary scrolls. 320 capsule whole-viewport image confirms no actual left header clipping despite target-crop glyph artefact. Chromium same-source pending; physical UAT remains rejected/unaccepted. #14 PARTIAL, not release-ready.

## 2026-11-01 — #14 real Review action accessibility failure and pinned-dock candidate
- WebKit `bb213bb7` #41386559560 PASS geometry but inspected capsule and prepared spray 320px Review images showed final actions below viewport; 390 light spray Review also not showing Confirm. This is genuinely OPEN UI failure, not a test false positive. CSS `9d409122` bounds Review and docks Back+Confirm, preserving compact Entry; test `d4b18b8` asserts fixed actionable viewport and single summary scroll owner in all 16 engine/build/theme/width cells. Latest CI/screenshots/physical UAT **PENDING**.

## 2026-11-01 — Shared capsule/prepare spray header audit corrected
- Test-only `9b9e6ca0` both engines FAIL at artificial title-in-header +4px inset assertion; header and close were within sheet, no 320px overflow. `bb213bb7` corrects measure to border clearance ≥10px. New screenshots/CI pending, all #04/#05/#07/#09/#14 physical acceptance still OPEN.

## 2026-11-01 — #04/#05/#07/#09/#14 cross-form header and review evidence gate
- `9b9e6ca0` adds explicit capsule + prepared spray Log Dose Entry/Review screenshots and per-sheet shared header/close inset checks, Chromium/WebKit × 320/390 × light/dark × LIVE/DEMO. Both engines' new-head results PENDING. Do not treat earlier normal injectable 8/8 PASS as all #14 acceptance. No new UI/CSS changes, real iPhone still pending.

## 2026-11-01 — #14 normal injectable Entry/Review browser gate PASSED, broader scope remains PARTIAL
- Corrected test source `ddd6e42a`, Chromium #41385255742 PASS 8/8 fictional LIVE/isolated DEMO 320/390 dark/light; 24 PNG captures and JSON; manually inspected 4 LIVE Review screenshots; no clipping observed in these specific cases. Other capsule/prepared nasal/edit sheets, physical iOS keyboard and real iPhone UAT remain OPEN. Thus #14 still **PARTIAL**, not physical PASS.
- #01/#04/#05 WebKit #41385255709 screenshot target 320/390 both themes inspected; form-first title, two choices and X stay clear of rounded border. No blanket 16-point acceptance. Proceed with grouped shared header #04/#05/#07/#08/#09/#16.

## 2026-11-01 — #14 browser review assertion correction
- Chromium #41384577261 FAIL at Review 320 dark/live due to wrong hidden footer CTA selector, not verified clipping. `ddd6e42a` selects currently visible action; same-source full CI pending. Shared #04/#05 headers and #07/#08/#09/#16 remain incomplete for physical acceptance; no app source was modified.

## 2026-11-01 — #14 clipping test upgraded (new acceptance gate, not accepted)
- `e301cafa` strengthens Log Dose entry/Review/Focused geometry across 320/390 light/dark LIVE/DEMO with in-sheet header/title, footer, visual viewport action and single scroll owner assertions. Corrected test syntax after predecessor `e0687dc8` failed preflight. No UI source change yet pending measured result, and all 16 remain physically unaccepted. Continue #14 before grouped shared header #04/#05/#07/#08/#09/#16.

## 2026-11-01 — current corrective implementation #04/#05/#14 and strict regression
- `5d406a72` fixes #04/#05 close-button double-render/transparent-SVG presentation; keeps 48px close and keyboard focus ring. `aca4a10b` tests visible SVG without pseudo duplicate on actual capsule/nasal form sheets.
- `445ad980`+`1c41a3d6` add #14 entry AND Review bounding-box clipping evidence gate: fixed header, 44px close, single scroll body and sticky footer all within 320/390 viewport, both themes and isolated DEMO/LIVE builds. Source TEST CODED, NOT RUN/VERIFIED on latest head. `docs/design/PR124_FULL_VISUAL_ACCEPTANCE_MATRIX.md` remains a specification, not an execution result.
- Predecessor WebKit `de85376c` #41360134694 is SUCCESS (16 fictional LIVE/DEMO), but predecessor Chromium and current exact-head workflows remain running/queued. All 16 physical acceptance items stay PENDING/previously REJECTED. Mixed writer P0 BLOCKING; nasal LIVE OFF; draft/no merge/deploy.

## 2026-11-01 — shared 48px outline close and Additional dose options test checkpoint
- **#04/#05/#07/#08/#09/#14/#16 CODED correction:** shared form close buttons in `05-nexus.js` (4), `07-nexus.js` (1), `10-nexus.js` (3), and `11-nexus.js` (1) now use the same 20px outline SVG inside the existing 44–48px touch-target button; IDs, event handlers and storage unchanged. App commits `0f580936`, `dd4819ea`, `6fff5770`, `cdf5b421`. Explicit mobile form and Goal Details SVG assertions added in `ff0b050e` and `3a7b8ef1`.
- **#15 TEST CODED:** Log Dose Additional dose options expanded/collapsed, two controls, 44px row/summary and no overflow are now asserted in existing LIVE/DEMO 320/390 light/dark browser loops at `7212783e`.
- Last picker app test `ee903da8`: WebKit PASS #41359883284, writer PASS #41359883263, mobile PASS #41359883287, nested PASS #41359883312; Chromium/build #41359883310 was in progress when observed. These PASS are **not** new SVG/Additional options acceptance.
- Combined test source `3a7b8ef1` five workflows queued; **no exact-head full suite PASS yet**. User's 16-point physical iPhone acceptance still NOT ACCEPTED, legacy/nasal sections remain partial. P0 BLOCKING, LIVE nasal OFF, PR draft/no merge/deploy.

## 2026-11-01 — #15 Additional dose options narrow-screen assertions added
- Test `7212783e` now opens the live/isolated-DEMO Log Dose panel across Chromium 320px/390px × light/dark, asserts one accessible Additional dose options disclosure, ≥44px summary and both optional rows, no viewport overflow, two underlying optional controls and reversible expand/collapse without saving. **TEST CODED, no PASS until matching workflow completes.** Remaining physical UAT, route/site and Goal Details screen review is not accepted. No dose mutation or storage schema change.

## 2026-11-01 — #06 focused custom-result hidden-state blocker
- Instrumented WebKit #41359516504 at `4086417e` FAILED: compound search retained focus and custom option existed but the result list was hidden following keyboard choice. Corrective candidate `73e036c9` schedules a focused-input repaint to survive delayed blur/focusout. Full 320/390 light/dark Chromium/WebKit tests still pending. **#06 is CODED / AUTOMATED FAIL ON PREDECESSOR / PHYSICAL NOT ACCEPTED**, not PASS. All 16 scope and nasal/P0 holds remain.

## 2026-11-01 — picker keyboard selection + shared browser navigation correction
- Earlier 320/390 × light/dark Chromium/WebKit on `0ed9d03e` FAILED at six options: Browse all was incorrectly `role="option"`; `bc8325a5` fixes that.
- Subsequent WebKit on `1fab968c` FAILED with hidden custom selection after keyboard choice. Exact identified cause: focus remained on an option in the collapsed list. Other-form focus restoration `96dc4bc0` and Vial kit focus restoration `4e1b0502` are CODED, with explicit focus+keyboard regression `57196a96`.
- Shared compound browser Back affordance was misleading outside Vial kits. `4d162c31` changes the accessible label to **Back to compound selection** with existing no-save navigation preserved.
- **Row #06 remains CODED / QA PENDING, UAT FAIL historical.** Latest exact-head full Chromium/WebKit/motion/keyboard and physical iPhone acceptance must be verified; no new device pass assumed. All other still-partial rows remain OPEN for acceptance. P0 BLOCKED; LIVE nasal OFF; draft/no deployment.

## Log Dose clipping — explicit cross-screen acceptance gate

- User reconfirmed that **Log Dose screens clipping** is part of the 16 requested corrections, not an optional polish item. Cross-reference items **#14**, **#15**, and **#16**. Keep these OPEN until independently validated.
- Required coverage: normal injectable Log Dose **entry and Review**, Capsules **entry and Review**, prepared nasal spray **entry and Review**, form-choice sheet, expanded **Additional dose options**, and any supported edit/legacy flows. At **320px and 390px**, in **both light and dark**, assert: header/title and 44–48px close entirely visible; no horizontal clipping/overflow; primary CTA and Back accessible and readable; one vertical scroll owner; bottom safe-area clearance; long labels and results wrap; opening the software keyboard does not conceal the currently focused field or permanently hide the save/confirm action.
- Automated viewport checks are distinct from on-device iOS Safari/Edge keyboard and VoiceOver checks. Previous physical screenshots **FAILED** and user explicitly withheld another acceptance cycle until full corrective implementation. Do not mark PASS solely from CSS presence or a broad green CI workflow.
- Status: **OPEN / BLOCKING PHYSICAL UAT**. Existing CSS and nasal scroll/focus candidate `2503f55f` are partial fixes, not complete clipping remediation. No merge/deploy, live nasal gates OFF, cross-tab writer P0 blocking.

## 2026-11-01 — nasal review scroll/focus follow-up
- Application `2503f55f` resets the single scroll-owner sheet to top when switching from nasal preparation fields to Review or Back; Review receives explicit programmatic focus. Regression `7d00437e` checks focus and scroll state in existing 320/390 × light/dark fictional LIVE/DEMO Playwright loops. **CODED, exact-head CI PENDING**, iPhone UAT still FAIL/retest withheld.
- No change to prepared-bottle/source ledger, transaction IDs, safety gates or production data. Do not mark #9/#12/#16 accepted pending screenshots and physical retest.


## 2026-11-01 — custom Enter selection safety follow-up
- Application commit `130d2200`: Other-form compound input Enter now selects only an exact matching suggestion; otherwise preserves and dispatches the typed custom compound instead of silently replacing it with the first candidate. Existing five visible suggestions, browse-all, click selection, and ordinary save remain intact.
- Regression commit `7d99ae18`: actual Playwright Add Kit capsule-form flow asserts that Enter preserves the fictional unlisted compound, alongside 320/390 light/dark LIVE and isolated DEMO loops. **CODED / QA PENDING** until matching workflow completion; physical iPhone acceptance remains unverified. No accounting, schema, legacy-writer or production-gate changes.
# PR #124 — 16-point physical iPhone DS2 correction scorecard

Updated 2026-11-01. Source: user-rejected physical iPhone screenshots and continuity decisions. This is a **working decomposition of the 16-point request**, not a claim that an original verbatim numbered list was recovered. Keep coded, automated QA, and physical acceptance distinct. User explicitly withholds another iPhone retest until all 16 are actually fixed.

Status key: CODED = source change present; PARTIAL = some source changes but scope unfinished; OPEN = not resolved; PASS = matching automation evidence; UAT FAIL = previous device rejection; UAT PENDING = no new device acceptance.

| # | User-visible correction | Implementation | Automated evidence | Physical acceptance |
|---|---|---|---|---|
| 01 | Open New Vial asks Injectable/Nasal FIRST, no irrelevant choices | CODED | PASS at 66959ba7 | UAT PENDING |
| 02 | Injectable and Nasal next screens conditional, no irrelevant injection site | CODED/PARTIAL broader legacy paths | PASS focused at 66959ba7 | UAT PENDING |
| 03 | Add Kit one entry, five purchased forms, consistent hierarchy | CODED | PASS broad suite at 5b7f878e | UAT FAIL, retest pending |
| 04 | Shared modal header hierarchy across Add Kit, Capsules, Topical, Log Dose, Goal | PARTIAL CSS 2b19a5de | PASS suite at 5b7f878e; visual acceptance unproven | UAT FAIL |
| 05 | Standard 44–48px rounded close button, consistent SVG/position | PARTIAL CSS 2b19a5de | PASS suite at 5b7f878e | UAT FAIL |
| 06 | Vial and other-form compound pickers same search/browse/keyboard behavior | CODED: shared picker keyboard parity c4f9e8d6 and Other-form native dropdown removal e394603f; browser test bedff373; remaining layout/device audit | NEW HEAD NOT TESTED | UAT FAIL |
| 07 | Capsule form compact, readable and non-clipped | PARTIAL | PASS earlier broad suite | UAT FAIL |
| 08 | Topical/raw form consistent picker, fields, actions | PARTIAL | PASS earlier broad suite | UAT FAIL |
| 09 | Nasal actual preparation compact, no wasted full-height whitespace | PARTIAL CSS | PASS earlier Oxytocin browser | UAT FAIL |
| 10 | One clear confirmed nasal source→bottle workflow, no pre-confirm writes | CODED DEMO ONLY | PASS 66959ba7 exact source/bottle ledger | UAT PENDING |
| 11 | No redundant Record prepared nasal spray action after successful transfer; preserve historical source entry | PARTIAL; legacy fallback audit open | PASS focused new-flow only | UAT FAIL |
| 12 | Nasal Review legible source, transferred mg/mL, destination and confirmation | PARTIAL CSS/review | PASS focused E2E; visual UAT pending | UAT FAIL |
| 13 | Stash shows source vial and prepared bottle separately without double count | CODED | PASS exact Oxytocin ledger 66959ba7 | UAT PENDING |
| 14 | Capsule/nasal Log Dose appropriate route, review, dose controls, no clipped sheet | PARTIAL | PASS focused 66959ba7 | UAT FAIL |
| 15 | Additional dose options typography, grouping and optional-state hierarchy | PARTIAL | Broad suite PASS 5b7f878e, not specific visual acceptance | UAT FAIL |
| 16 | Goal Details hierarchy, keyboard/safe-area and single scroll across shared sheets | PARTIAL CSS 2b19a5de | Broad suite PASS 5b7f878e, physical keyboard NOT TESTED | UAT FAIL |

## Verified engineering and release gates
- Main da585ab3; PR #124 draft/unmerged. Prior exact Oxytocin Chromium/WebKit PASS at application 66959ba7 with matching full-app isolated DEMO and LIVE artifact audit.
- CSS candidate 2b19a5de: five workflows at 5b7f878e SUCCESS (Chromium/build 41355828075, WebKit 41355828082, mobile 41355828040, writer 41355828049, nested 41355828098).
- Picker behavior parity code c4f9e8d6, Other-form native/custom picker consolidation e394603f and browser assertion bedff373 are NEW source changes. Both the new 320/390 suite and artifact audit must be verified at exact-head before PASS. No physical iPhone retest claimed.
- Mixed legacy-writer P0 BLOCKING; LIVE nasal transfer/log flags OFF. No merge, deploy, version promotion, production data migration or user-data writes.
- Remaining next action: finish the OPEN/PARTIAL UI issues, add explicit 320/390 light/dark visual assertions for all 16, inspect screenshots and exact-source isolated full-app DEMO/LIVE ZIP, then ask for physical iPhone acceptance.

## 2026-11-01 — additional picker consolidation checkpoint
- Other-form capsule/raw/topical/purchased nasal compound field now has a **single** custom searchable combobox rather than overlapping native datalist and custom results. It preserves five-option browse, View all, custom names and field values; click/custom/browse now dispatch change consistently. Application commit `e394603f`.
- Regression `bedff373` demands no #nx-form-compound-list and an accessible search intent label in addition to existing five-result, custom, Browse all, >=44px touch-target and save tests.
- This is CODED, not physical acceptance. Need confirm exact-head CI, inspect narrow screenshots, and resolve all remaining PARTIAL items before requesting iPhone testing. P0 BLOCKED, nasal LIVE OFF.
