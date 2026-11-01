## Execution checkpoint — 2026-11-01 (NOT complete visual acceptance)
- Baseline `27f24637` Chromium #41362141111 **PASS** and WebKit #41362141098 **PASS**. Chromium Log Dose 8 LIVE/DEMO width/theme regression cells (176 functional flows); WebKit 16 fictional formulation sessions. These results do not complete 16×16 visual cells.
- Downloaded exact-source artifact #13105393555, validated release manifest SHA `27f24637` and all 26 LIVE ZIP asset paths. Existing PNG set has no dedicated normal Log Dose entry/focused/review screenshots.
- TEST-ONLY `18e63ece` adds Chromium entry, focused, review screenshot and bounds evidence in 8 width/theme/build combinations (=24 images) to `validate-logdose-ui.mjs`. Execution and manual screenshot inspection remain **NOT TESTED** for this new commit; WebKit equivalent, actual iPhone software keyboard, nasal and picker screenshot grids remain **NOT TESTED**. Do not equate focus proxy with iOS keyboard.
- Next execution: confirm exact-head artifacts and manually inspect eight sets of Log Dose screenshots; then compound picker and nasal preparation in both engines. Release P0 mixed writer BLOCKING; nasal LIVE OFF; draft/no merge/deploy.

# PR #124 — Full DS2 visual acceptance matrix (working gate)
Date: 2026-11-01. Draft PR only. This is a **test specification**, not a PASS report. Previous physical iPhone screenshots FAILED; user has withheld retest until all 16 corrections are coded. No merge/deploy approval.

## Coverage dimensions
For **each** row below, execute **Chromium and WebKit** at **320 × 844** and **390 × 844**, in **light and dark**, against **both LIVE-source build and isolated full-app DEMO**: 2 engines × 2 widths × 2 themes × 2 builds = **16 configurations per row**. Include screenshots at entry, expanded/keyboard where applicable, and Review/confirmation. Automated emulation is not real iPhone Safari/Edge, software keyboard or VoiceOver acceptance.

## Invariants for every screen
- All headings, text, input labels, SVG close, Back and primary action visible without horizontal clipping; no document-level horizontal overflow, no accidental nested vertical scrolling.
- Close button outline SVG, 44–48px target, inside safe-area, aligned with title; only one header and one meaningful scroll owner.
- Minimum 44px interactive targets; readable 16px form inputs and AA contrast in both themes; long compound names wrap without overlap.
- Primary CTA reachable above bottom safe-area; focused input remains visible when keyboard appears; no lost unsaved draft when Back, Review or compound picker changes focus.
- No save, source opening, vial debit, bottle transfer, history mutation or live storage write on mere opening, browsing, Back or Review. Review explicitly names exact source/destination and debit; only confirmed action commits.

## Row-by-row acceptance cases
| # | Surface and interaction | Automated visual/function status | Physical iPhone |
|---|---|---|---|
| 01 | Open New Vial → exactly Injectable/Nasal, form first | Earlier focused browser PASS; full visual matrix NOT TESTED | PENDING |
| 02 | Injectable/Nasal conditional fields; injection site absent when irrelevant | Focused browser PASS; legacy/edit matrix NOT TESTED | PENDING |
| 03 | Add Kit → five forms, compact chooser, one entry | Earlier browser PASS; current full matrix NOT TESTED | Rejected; retest pending |
| 04 | Shared Add Kit/Capsule/Topical/Log Dose/Goal header, safe-area | SVG changes coded; current full matrix NOT TESTED | Rejected |
| 05 | Every close: outline SVG, 44–48px, correct accessible name | SVG regression coded; current full matrix NOT TESTED | Rejected |
| 06 | Vial/Other compound search: 5 results, browse, custom, keyboard, focus, scroll | Prior hidden-results FAIL; newer candidate WebKit PASS on predecessor; exact-head full matrix NOT TESTED | Rejected |
| 07 | Capsule editor compact; fields/Review/actions/keyboard | Partial; full matrix NOT TESTED | Rejected |
| 08 | Topical/raw/purchased nasal form editor picker, controls, Review | Partial; full matrix NOT TESTED | Rejected |
| 09 | Nasal preparation entry → Review → Back, scroll reset and focus | Candidate coded; full matrix NOT TESTED | Rejected |
| 10 | One explicit source→bottle confirmation, zero pre-confirm debit | Fictional focused Oxytocin E2E PASS at 66959ba7; current matrix NOT TESTED | PENDING |
| 11 | No redundant Record prepared nasal spray; legacy entry still accessible | New path PASS; legacy fallback matrix NOT TESTED | Rejected |
| 12 | Nasal Review source ID, mg/mL, bottle, one transfer; no clipped rows | Focused ledger PASS; full visual matrix NOT TESTED | Rejected |
| 13 | Stash source-vial and prepared-bottle separated, no double count | Focused ledger PASS; full visual matrix NOT TESTED | PENDING |
| 14 | Injectable/Capsule/Nasal Log Dose entry + Review, site conditional, no clipping | Focused PASS; full visual matrix NOT TESTED | Rejected |
| 15 | Additional dose options expanded/collapsed, 44px rows, no overflow | New automated assertions coded; exact-head result NOT VERIFIED | Rejected |
| 16 | Goal Details tabs/header, scrolling, keyboard, VoiceOver, sheet transitions | Partial; full visual matrix NOT TESTED | Rejected |

## Matrix execution and evidence
For every case record: commit SHA, engine, build, width, theme, screenshot paths, entry/Review DOM geometry, focus and scroll owner, test result **PASS/FAIL/BLOCKED/NOT TESTED**, and issue/commit for any failure. A green general CI workflow alone is insufficient to mark every cell PASS. Capture explicit before/after screenshots for corrected surfaces. Preserve previous failure evidence.

**Current overall status:** INCOMPLETE / NOT ACCEPTED. No complete 16-row × 16-configuration visual matrix has been evidenced. P0 mixed-writer BLOCKING, LIVE nasal transfer and administration gates OFF. No production data change, merge, or deployment.

**Next action:** finish current exact-head Chromium/WebKit runs, fix failures, execute and inspect the complete screenshot matrix; only then request physical iPhone keyboard and VoiceOver acceptance.
