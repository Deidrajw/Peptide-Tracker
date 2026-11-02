## 2026-11-02 — second focused iPhone UAT and upstream selector fix (PR124 DRAFT)
- User tested former isolated app 1fd19d57 and supplied six-area scorecard: Typography FAIL, Raw powder FAIL, Topical FAIL, Review layout FAIL, Validation PASS, Vial setup PASS. Original 19-point acceptance was 18/19 but these observations reopen related flows; full physical acceptance is NOT achieved.
- Exact screenshots show AHK-Cu (raw powder) and SNAP-8 (topical) in Today Log Dose compound select, excessive Additional options typography differences, and blank Review card floating in Step 1. User explicitly requires selector source exclusion, existing Log Dose typography, Review only in Step 2, removal of conflicting legacy styles.
- Root causes: 04-nexus.js picker included unprepared formulationStocks; hybrid CSS included duplicated 14px/16px overrides and forced display:block!important overriding Review [hidden]. Corrections 0bfb28dc / 3ca9685f / c8fcf5cd / 29518068 and browser source e6a8f004; later test correction 5d833fa2 compares colour with --t1 primary controls rather than compound-coloured parent. This is CODED only, not physical acceptance.
- Screenshot evidence from e6a8f004 Chromium generated 320px Step 1 without Review, Step 2 with populated amount/date/method/vial rows, and 16px form text; inspect 390 and both themes during final QA. Full first Chromium CI 41511560381 FAILED on mis-specified test colour baseline (not labelled Pass); 4 other groups (mobile, nested, WebKit, writer) PASS. Exact revised test source 5d833fa2 five CI initiated and pending.
- User retest need only the four failed items after a verified current-source DEMO, not the whole 19-point suite. No data imports or live writes; P0 blocking, LIVE nasal OFF, PR draft/unmerged/undeployed.

## User physical iPhone return — 2026-11-02, source 6aa89c00
- User-provided 19-point scorecard: 18 Pass; #15 Additional dose options typography Fail. Device/iOS not supplied; fictional full-app DEMO only. Screenshots submitted for mixed Stash/Review/Additional options.
- User identified ADDITIONAL failures not captured by prior pass ticks: (A) raw powder inventory surfaced through generic Log Dose although no prepared/usable physical form; (B) Review dose too vertically loose; (C) old missing-amount warning persisted after a positive amount was entered; (D) unlabeled opened vial warning showed no next action and unrelated Open another vial. The earlier #08 and #14 ticks are not final acceptance for these newly reported behaviours. Topical user preference: do not force it into Log Dose; application tracking is a separate unresolved product choice.
- Targeted PR branch commits 160efd3a, 4ea917ca, 1fd19d57 are CODED, not device accepted. Five exact-head CI and new full-app artifacts pending. Follow-up focused tests: #15 typography, powder-only vs valid prepared source, stale warning after input, compact Review content and safe-area, direct “Identify vial form” flow. Do not merge/deploy; P0 release gate and nasal LIVE OFF.

# Nexus PR #124 — 19-point grouped acceptance evidence (2026-11-02)

**Status: CI VERIFIED / PHYSICAL ACCEPTANCE OPEN, NOT A RELEASE**. Application source `47c4894e1746ca3bd5892b45c179f472482ad3e9`, main `da585ab3458394ddf5e88e283b210933beeab810`. PR #124 draft/unmerged/undeployed; primary Cloudflare not updated. No production storage access or writes. Both LIVE nasal gates OFF and release P0 BLOCKING.

All five exact-source workflows **SUCCESS**: Chromium/build #41493225596; WebKit #41493225597; mobile #41493225640; nested #41493226553; shared writer #41493225584. Chromium artifact #13166096782: outer 540 entries CRC PASS, embedded 26-file LIVE ZIP CRC PASS, standalone 3,090,984-byte isolated full-app DEMO, offline ZIP byte-identical HTML; manifest source SHA exact. WebKit artifact #13166255488 outer 312 entries CRC PASS. Current 320/390 light/dark Goal/Stash and 19-stage visual contact sheet inspected. These source/automated checks **do not imply physical iPhone, VoiceOver, native keyboard or subjective design acceptance**.

An independently executed local Node test using `nexus-preparation-bridge.js` extracted from the exact LIVE ZIP **PASS**: fictional legacy first bottle exact 30mg source debit, 30mg/10mL destination credit, no input mutation; duplicate ID, malformed stock, insufficient stock and missing confirmation fail closed. This is **pure planner only**, NOT actual Confirm UI → durable storage nor physical retest. Prior iPhone failure stays open.

| # | Requirement | Current evidence/status | Notes |
|---|---|---|---|
| 01 | Open Vial Injectable/Nasal first | Browser PASS; physical NOT ACCEPTED | Form-first chooser screenshots; WebKit and Chromium formulation QA |
| 02 | Conditional methods/sites | Browser PASS; legacy/device pending | Source-conditional Log Dose and site-clear tests |
| 03 | Add Kit form hierarchy | Browser PASS; device pending | Chromium Add Kit 19 fictional sessions; visual step screenshots |
| 04 | Shared sheet typography/header | CODED; physical VISUAL FAIL previous build; retest pending | Current Goal/Stash screenshots inspected, no subjective acceptance |
| 05 | 44–48px close buttons | Browser PASS covered sheets; device pending | Modal geometry/WebKit; 48px Stash close |
| 06 | Compound picker and keyboard | Browser PASS; device pending | Picker/custom result screenshot and test |
| 07 | Capsule entry/review | Browser PASS; device pending | Chromium/WebKit capsule entry/review screenshot |
| 08 | Raw/topical form parity | Browser PASS; device pending | 8 configuration visual evidence |
| 09 | Nasal compact entry/review | Browser PASS; device pending | WebKit nasal entry/back/review screenshot and scroll geometry |
| 10 | Single confirmed nasal transfer | Browser PASS for fictional existing-source flow; physical FAIL on older first-container DEMO | Source-to-bottle E2E test; first-container isolated pure test; iPhone confirmation pending |
| 11 | No duplicate prepared-spray recording action | Browser PASS new flow; legacy/device pending | Existing-source direct action and depletion test |
| 12 | Nasal Review exact source and destination | Browser PASS; device pending | Nasal Review source/destination screenshots |
| 13 | Separate source and bottle balances | Browser PASS; device pending | Mixed-source Stash inventory assertions |
| 14 | Log Dose route/review/no clip | Browser PASS scoped; device pending | End-to-end and 320/390 dark/light Review captures |
| 15 | Additional dose options style | Browser PASS; device pending | Computed font assertions and 8 screenshots |
| 16 | Goal Details hierarchy/keyboard/safe areas | Browser geometry PASS; physical VISUAL FAIL prior build, retest pending | Chromium Goal/ WebKit screenshots; user visual objection |
| 17 | Stash Vial Setup typography | Browser computed-style PASS; physical VISUAL FAIL prior build, retest pending | 23px DM Sans, 48px close, no radio preselect; 320/390 screenshot |
| 18 | First nasal-container UI save | Planner PASS; full iPhone CONFIRM/SAVE FAIL prior build, retest pending | Exact ZIP bridge local Node 5 assertions PASS; not full persisted UI |
| 19 | Today direct injectable Log Dose | Browser PASS; device pending | SubQ/IM/IV source-conditional direct-route tests |

**Protected flows:** Chromium source/Undo/edit, two-tab stale/failed-write, Check-In and supplements, Calendar, Plans, Stash, full DEMO isolation and calculator-safety gates are covered by existing exact-head workflows; individual physical device cases remain NOT TESTED unless explicitly accepted. No claim that all 19 items were physically exercised in a single iPhone session.

**Single next action:** perform one consolidated physical iPhone test on the exact full-app isolated DEMO, targeting previous visual rejections #04/#16/#17, first nasal container #18 and protected Log Dose/stock flows. Capture Pass/Fail/Blocked/Not Tested per item. Only then consider release readiness; separate explicit merge/deploy approval required.
