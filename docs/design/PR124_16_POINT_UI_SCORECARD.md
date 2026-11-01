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
