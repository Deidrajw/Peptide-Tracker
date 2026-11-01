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
| 06 | Vial and other-form compound pickers same search/browse/keyboard behavior | PARTIAL: picker keyboard parity c4f9e8d6; remaining layout audit | NEW HEAD NOT TESTED | UAT FAIL |
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
- Picker behavior parity code c4f9e8d6 is a NEW source change; its exact-head checks and artifact audit must be separately verified. No physical iPhone retest claimed.
- Mixed legacy-writer P0 BLOCKING; LIVE nasal transfer/log flags OFF. No merge, deploy, version promotion, production data migration or user-data writes.
- Remaining next action: finish the OPEN/PARTIAL UI issues, add explicit 320/390 light/dark visual assertions for all 16, inspect screenshots and exact-source isolated full-app DEMO/LIVE ZIP, then ask for physical iPhone acceptance.
