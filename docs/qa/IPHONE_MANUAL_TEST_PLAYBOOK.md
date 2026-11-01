## PR124 — Guided final physical iPhone and VoiceOver acceptance addendum (2026-11-01)
Use the same permanent Manual QA Playbook; this section is additional cases, NOT a separate standard. **Preflight for every case:** Open the full-app isolated fictional DEMO whose displayed/packaged source SHA matches the PR release candidate; never use Cloudflare production or import a personal backup. Note tester/date, iPhone model, iOS, Safari/PWA mode, build SHA and Light/Dark. If the fixture cannot be set up with real DEMO controls, mark Blocked. All device results begin **Not Tested**. Record screenshots and observations separately for each case. Copy results using the guided in-chat checklist.

### QA-VOICEOVER-01 — Focus, labels, live feedback, safe areas (critical)
- **Where to start:** iPhone Settings > Accessibility > VoiceOver; then isolated full-app DEMO > Today.
- **Fictional setup:** Use the DEMO's fictional injectable, 30-count 5mg capsule container, and two fictional protocols. If missing, create them using Stash > Add capsules and Protocols > Add as supported; otherwise Blocked.
- **Exact steps:** 1. Enable VoiceOver (triple-click accessibility shortcut if configured or Settings). 2. Swipe through Today navigation and Log Dose, checking spoken names, role and selected state. 3. Open a fictional capsule log, enter 2 capsules, traverse Review and Back; inspect announcement of error if deliberately entering 31 capsules. 4. Navigate Stash > card Details > setup/Close and verify meaningful names/focus return. 5. Navigate Protocols > Pause All confirmation, Cancel, then reopen; verify focus is within the dialog and Cancel returns to the initiating button. 6. Repeat a focused Log Dose and Stash sheet with keyboard open and Dynamic Type enlarged; inspect top/bottom safe areas and 44px touch controls. 7. Turn VoiceOver off without saving fictional dose unless separately testing capsule accounting.
- **Expected:** All controls announce purpose and state, logical reading/focus order, errors are perceivable without colour, focus does not disappear behind sheets/keyboard, no clipped primary action or accidental data write.
- **Result:** Pass / Fail / Blocked / Not Tested. **Observations/evidence:** spoken text, focus path, screenshots/screen recording, device/iOS/theme, source SHA, tester/date. **Cleanup:** Cancel unsaved forms, disable VoiceOver if normally off, reset isolated DEMO.

### QA-CROSSTAB-01 — Stale save, settings/history, failed-write acknowledgement (critical; automated primary evidence)
- **Where to start:** Exact-source isolated full-app DEMO > More / Settings, and Stash > a fictional kit; use Chromium two-tab CI for actual concurrent storage races, not the real production app.
- **Fictional setup:** Two independently opened browser tabs under one isolated test origin, fictional vial source and dose history, separate settings and dated supplement history. On physical iPhone, test only visible acknowledgement and reload persistence; do not attempt to inject storage faults.
- **Exact steps:** 1. Record fictional Stash balance and Settings value. 2. Change a non-destructive fictional setting, save, close/reopen, verify it persists. 3. Add/edit a fictional dated supplement entry, save, navigate away and back; verify one correct dated entry without balance change. 4. Inspect controls for pending state and visible success only after confirmed persistence. 5. For engineering CI, hold a real exclusive inventory transaction in tab A while tab B attempts a settings/history write; verify B cannot bypass lock, stale writes are rejected, fresh retries read back, and simulated failed writes NEVER show success or mutate unrelated inventory. 6. Record actual CI job/run/commit; never infer a physical race PASS from UI-only checks.
- **Expected:** Settings/history persist with inventory untouched; no false saved state; true Chromium two-tab race has explicit atomicity/stale/failure evidence. The mixed-writer P0 release gate remains Blocked unless independently satisfied across ALL ordinary and erase call paths.
- **Result:** Pass / Fail / Blocked / Not Tested (separate physical and automated results). **Observations/evidence:** before/after values, screenshots, CI run ID/log and device details. **Cleanup:** Reset only isolated fictional DEMO. Never clear production localStorage.

### QA-PROTECTED-DETAIL-01 — Check-In, Calendar, Supplements, Weight/Nutrition, backup and dose cancel
- **Where to start:** Isolated full-app DEMO > Today; use its bottom navigation to Calendar, Stash, Protocols and More.
- **Fictional setup:** One dated sample Check-In and dose, one eligible open vial, a fictional protocol, and fictional weight/nutrition entry. Where missing, use the app's corresponding Add flows; mark a subcase Blocked if creation is unavailable.
- **Exact steps:** 1. Open Check-In, choose a fictional date and mood, a symptom with intensity and note, and select two supplements using search; save. 2. Reopen the same date and edit the existing Check-In; check no duplicate dated record. 3. Open Calendar; verify current month by default, the saved day and day logs; enter/inspect a numeric weight. 4. Visit Weight and Nutrition histories; verify the fictional records remain readable. 5. Open Today > Log Dose, enter a fictional draft, Review, Back and Cancel; check vial/history unchanged. 6. Visit Protocols and Stash History; check records and balances preserved. 7. Inspect More > backup/export and import guard WITHOUT importing/overwriting records. 8. Repeat relevant navigation and bottom sheets in both themes, with keyboard and VoiceOver as possible; record each subcase separately.
- **Expected:** Single Check-In per date, edited data retained, searchable supplements/history, calendar date and numeric weight, Weight/Nutrition, safe draft cancellation, preserved protocol and stock, non-destructive backup controls and accessible navigation.
- **Result:** Pass / Fail / Blocked / Not Tested separately per step/subcase. **Observations/evidence:** before/after screenshots, changed record dates/amounts, theme, device/iOS, source SHA, tester/date. **Cleanup:** Reset isolated fictional DEMO; never test destructive restore on production.

## PR124 — Form-specific inventory, nasal DEMO preview, capsule source and bulk pause (2026-11-01)
**Scope:** This extends this permanent QA Playbook, not a new standard. Use exact-source fictional FULL-APP DEMO only; never import live account backups or production inventory. Tests begin **Not Tested** on a physical iPhone. Record tester/date, iPhone model/iOS, Safari mode, build SHA, Pass/Fail/Blocked/Not Tested, actual result and screenshots for every case. In-chat test controls should offer Copy Results. Do not equate browser CI with physical acceptance.

### QA-CAPSULE-01 — Oral form and count-based dose (critical)
- **Start:** Standalone full-app DEMO > Stash > Other forms > Add capsules; then Today > Log Dose.
- **Fixture:** Add fictional SLU-PP-332 capsule container with 30 capsules at 5 mg per capsule. Keep a different fictional injectable vial for the SAME compound in a separate kit. Record both starting balances and dose-history count. Do not use real inventory.
- **Steps:** 1. Save capsule container. 2. Open Today > Log Dose, select compound and choose Capsules. 3. Verify no injection methods/sites. 4. Enter two capsules and Review. 5. Confirm fictional dose. 6. Check exact capsule count, labelled strength, saved dose history and unchanged vial balance. 7. Use Undo and verify exact original capsule container restored. 8. Try more capsules than available; Review must refuse.
- **Expected:** Single event deducts exactly two capsules (30→28), records nominal 10 mg and exact container ID, retains injectable mg unchanged; Undo affects only same container and linked dose; overdraw fails closed.
- **Result:** Not Tested / Pass / Fail / Blocked. **Observation/evidence:** device, theme, before/after balances, event and screenshots. **Cleanup:** Reset isolated fictional DEMO.

### QA-NASAL-01 — Actual nasal source transfer preview (critical)
- **Start:** Isolated full-app DEMO > Stash > Vial kits > Details > Vials > an open fictional vial reserved 'For nasal preparation'.
- **Fixture:** Fictional 5 mg open vial reserved for nasal preparation, separate fictional injectable vial in same kit, no prepared bottle. Use only recorded *fictional example* values; do not prepare a real compound. Capture before-state/source ID.
- **Steps:** 1. Confirm reserved source is not selectable as a ready spray in Log Dose. 2. Open Record prepared nasal spray on the reserved vial. 3. Enter fictional actual amount and volumes/pump volume, confirm recording. 4. Inspect nominal concentration preview and source vial ID. 5. Check a new separate prepared bottle is shown in Other forms and initial source mg debited once. 6. Repeat with missing values or insufficient source stock to confirm refusal.
- **Expected:** No plan prerequisite; exact reserved physical source debited once only in isolated DEMO, destination gets equivalent mass, nominal spray value stored without claiming verified output; no mutation of other vials, no duplicate events. **CRITICAL:** Live transfer still safety-gated and NOT accepted; live workflow must be marked Blocked until mixed-writer P0 resolved.
- **Result:** Not Tested / Pass / Fail / Blocked. **Observation/evidence:** source/destination balances/screenshots. **Cleanup:** Reset fictional DEMO.

### QA-NASAL-02 — Adaptive nasal spray count and undo (critical)
- **Start:** Isolated full-app DEMO > Today > Log Dose after completing QA-NASAL-01.
- **Fixture:** The fictional source-linked prepared bottle from QA-NASAL-01 with recorded nominal per-spray mass/volume, separate injectable vial still open.
- **Steps:** 1. Select compound then Prepared nasal spray. 2. Confirm route/site grid is absent. 3. Enter two sprays; review container and nominal amount. 4. Confirm fictional log; check prepared bottle mg/mL and saved dose. 5. Confirm original vial is NOT debited again. 6. Undo, recheck original prepared balances and log. 7. Attempt a count above prepared balance; Review should block.
- **Expected:** Only the exact prepared container changes; source vial unchanged after preparation; no plan-only source can be logged. Undo restores only prepared container and exact dose. Live gate: Blocked, not Pass.
- **Result:** Not Tested / Pass / Fail / Blocked. **Observation/evidence:** source IDs, balances, screenshots and details. **Cleanup:** Reset isolated DEMO.

### QA-P14-01 — Reversible Pause All / Resume All (critical)
- **Start:** Isolated full-app DEMO > Protocols / Plans.
- **Fixture:** Two fictional active protocols, one individually paused protocol, one future protocol, one completed protocol; fictional dose history and Stash balances recorded before.
- **Steps:** 1. Tap Pause All and Cancel; confirm no changes. 2. Repeat and Confirm. 3. Inspect Today/Plans due, overdue and reminder presentation; existing history stays unchanged. 4. Tap Resume All and Confirm. 5. Check only the two bulk-paused protocols resume to prior states, individual pause/future/completed unchanged. 6. Confirm independent Log Dose still available. 7. Verify vial, capsule, nasal stock and dates unchanged. 8. Repeat in light/dark at 320/390 equivalent where possible.
- **Expected:** Reversible explicit choice, no accidental missed-dose penalties or schedule rewriting, no stock/history change; no destructive reset.
- **Result:** Not Tested / Pass / Fail / Blocked. **Observation/evidence:** screenshots, status before/after, device and date. **Cleanup:** Reset fictional DEMO.

### QA-FORM-UI-01 — DS2 adaptive screen and input accessibility (high)
- **Start:** Isolated full-app DEMO > Stash / Log Dose / Protocols.
- **Fixture:** Fictional injectable vial, separate capsule container and prepared nasal bottle; no real records.
- **Steps:** 1. Inspect Stash badges and actions in light/dark, including uniform Healthy/Stored size and no left gradient artifact. 2. Open Vial Details, confirm neutral surface. 3. Log Injectable (SubQ/IM options) then Capsules (count only) and Nasal (spray count only). 4. Inspect Additional dose options typography and checkbox states. 5. Open/close keyboard on all fields, scroll to sticky actions, check 44–48px targets and safe areas. 6. Repeat landscape or at narrow iPhone width if available, and basic VoiceOver labels.
- **Expected:** Each physical form gets relevant fields; no double scroll, clipped buttons or missing confirmation, consistent DS2 hierarchy and accessible controls.
- **Result:** Not Tested / Pass / Fail / Blocked. **Observation/evidence:** screenshots/device notes. **Cleanup:** Reset fictional DEMO.

**Protected regression still required:** Daily Check-In one-record-per-date validation and edit, searchable supplements, Plans/schedules, Calendar current month and day logs, History, Weight/Nutrition, Stash adjustments and event-specific Undo, backup/import guard, calculator safety (failed assertions remain blockers), both theme modes, iPhone safe areas. Record each protected path separately instead of one blanket Pass. No merge/deploy without explicit approval.

## PR124 — New family-vs-route scenarios (NOT READY FOR DEVICE ACCEPTANCE)

As of 2026-10-31 22:20 Toronto, source 9ef27f9 is a known failing candidate for these newly reported workflows. These tests are FUTURE acceptance cases after an exact-source corrected full-app isolated DEMO is provided. Do not test source-changing scenarios using production data.

### QA-FORM-01: Set up injectable form, select dose route (critical)
- Start: corrected isolated DEMO > Stash > Vial kits > fictional compound (e.g. Fictional Injectable).
- Scenario: create fictional 10 mg kit with one sealed vial; open one using Open new vial; choose form Injectable without a SubQ/IM/IV setting. Note initial vial mg. If UI still requires route, Fail.
- Steps: 1. Open Use setup; verify no injection route field and save form preference. 2. Today > Log Dose; find compound, including without a protocol. 3. Choose SubQ and review source and site. 4. Cancel, repeat with IM. 5. Confirm a fictional dose only when the correct verified source and safe route are explicitly allowed; inspect history and exact balance.
- Expected: Stash form remains Injectable, recorded dose route reflects per-entry selection; no phantom or wrong source deduction; historical records preserved. Mark Blocked if fixture or verified route compatibility unavailable; never infer clinical route eligibility.
- Status: NOT TESTED on corrected build; known FAIL on 9ef27f9. Evidence: paired setup, route, vial and history screenshots; device/iOS and tester/date. Cleanup: restore new fictional fixture.

### QA-FORM-02: Same compound with independent injectable and oral forms (critical)
- Start: corrected isolated DEMO > Stash > a fictional compound with an injectable vial and a separately entered oral container.
- Scenario: create fictional vial 10 mg with 8 mg open and fictional oral container with known count. Record both balances, exact source IDs and date-specific history count before saving.
- Steps: 1. Today > Log Dose > compound. 2. Select Oral and view eligible source. 3. Cancel; return and select SubQ. 4. Check source choices and review. 5. Save one fictional supported form-backed dose; inspect both balances and history.
- Expected: no cross-form attribution; oral must not debit an injectable vial, injectable must not debit oral stock; incompatible or unverified source fails closed with draft intact. If oral inventory consumption is not implemented, mark Blocked rather than Pass.
- Status: NOT TESTED corrected build; user-reported current failure. Evidence: pre/post balances, screenshot and saved event. Cleanup: reset fictional fixture.

### QA-PICKER-01: Stocked compound not in any protocol (high)
- Start: corrected isolated DEMO > Stash > a fictional compound with open viable stock but no protocol.
- Scenario: create fictional unprotocolled compound/kit; ensure no schedule or protocol record.
- Steps: 1. Open Today > Log Dose picker. 2. Search exact compound name. 3. Select and inspect independent logging option. 4. Enter an amount, Review, cancel without saving.
- Expected: compound discoverable without creating schedule or protocol, available stock attributed only to verified source; cancellation preserves stock/history.
- Status: NOT TESTED on corrected source. Evidence: picker and cancelled form. Cleanup: reset fictional fixture.

### QA-STASH-ORDER-01: Vial order stable (medium)
- Start: corrected isolated DEMO > Stash > Vial kit > Details > Vials.
- Scenario: fictional kit with sequence numbered vials 1/2/4/5 and mixed open/finished statuses. If required fixture cannot be created via DEMO UI, mark Blocked.
- Steps: 1. Open Vial details. 2. Note every rendered sequence number. 3. Close/reopen Details and switch theme. 4. Compare numbering and histories.
- Expected: consistent intentional numeric vial order, not backing-array order; no mutation to actual sequence numbers/ledger.
- Status: NOT TESTED. Evidence: ordered list screenshots light and dark.

### QA-PREP-01: Nasal plan is not prepared inventory (critical)
- Start: corrected isolated DEMO > Stash > Vials > fictional open kit vial.
- Scenario: use fictional stock; note original mg. Do not mix real compounds/ingredients for a software test.
- Steps: 1. Open Plan a preparation > Nasal. 2. Save a fictional planning note. 3. Verify saved-plan status. 4. Open Stash and Log Dose sources.
- Expected: plan does not reduce original mg, does not create nasal spray stock or enable a nasal dose. A separate validated transfer/container step must exist before any prepared stock may be consumed.
- Status: NOT TESTED after explanatory redesign. Evidence: source and plan screens, before/after mg. Cleanup: reset fictional fixture.

All cases require Pass/Fail/Blocked/Not Tested, exact observations, evidence, build SHA and tester/date using the in-chat Copy Results form. Prior CI/browser tests DO NOT validate these cases.

## PR124 — Stash button parity and expanded vial setup (candidate CSS d9cb70a6)

**Scope and proof:** Retest the approved compact cards, action-button hierarchy, use setup and unresolved-vial message at 320px/390px (emulation) and on a physical iPhone in both system light and dark appearance. Physical results must be observed by the device tester; all cases start **Not Tested**. Record device model, iOS version, DEMO source SHA, theme, screenshots, actual result, tester/date and any issue. Use the PR124 source-matched **isolated full-app DEMO** only. Do not import a personal backup or change the Cloudflare production app.

### QA-STASH-VIS-01 — Collapsed actions, light and dark (medium)
- **Start:** On physical iPhone, open the isolated PR124 full-app DEMO > Stash > Kits (Vials). If the file opens as a download rather than a working app, open the provided self-contained offline demo ZIP's index.html and verify sample/demo status.
- **Fixture:** Use the included fictional stocked vial kit (for example Retatrutide or GHK-Cu). If none with an OPEN vial appears, navigate through the DEMO's Add Kit flow and create a fictional vial kit with 2 vials of 10 mg, open exactly one by the existing Open new vial flow; do not invent missing controls. If DEMO prevents that, mark Blocked.
- **Steps:** (1) Switch iPhone appearance to Light. (2) Open Stash > Kits and locate the fictional open-vial card. (3) Confirm title, badge, open count, mg remaining and progress bar. (4) Visually compare Set up vial or Open new vial against Details; inspect equal corner radii, alignment, readability and accessible touch size. (5) Tap Details and close; confirm chevron/disclosure meaning and no new navigation. (6) Repeat in Dark appearance.
- **Expected:** Exactly one emphasized primary and one secondary Details action, both at least 44px, clear theme contrast and consistent alignment. Collapsed geometry remains compact with no overflow/clipping, no duplicate arrows or unintentional stock mutation.
- **Status:** Pass/Fail/Blocked/Not Tested. **Evidence:** light/dark screenshots and device notes. **Cleanup:** Leave Details collapsed and reset fictional DEMO.

### QA-STASH-VIS-02 — Expanded setup and unresolved method attention (high)
- **Start:** Isolated full-app DEMO > Stash > Kits > a fictional OPEN vial whose administration method has NOT yet been confirmed.
- **Fixture:** Use an existing unlabelled/open fictional vial if present. Otherwise in the DEMO use the supported kit/vial creation flow to create a fictional 10 mg vial and leave its method unspecified (do not intentionally mislabel a vial); if the UI enforces confirmation or the exact state is impossible, mark Blocked rather than altering real records.
- **Steps:** (1) Tap Details. (2) Locate the Use setup preference row and the unresolved-vial warning. (3) Compare outlined Use setup button, amber notice and Open new vial secondary action in Light and Dark. (4) Tap Use setup and verify it opens the existing setup editor; inspect accessibility of controls and safe area. (5) Close setup without saving and return to the same kit.
- **Expected:** Setup preference is visually distinct and tap target >=44px. Unresolved-vial warning stands out without a fake disabled state. Open new vial remains a different secondary action. No vial method, mg, kit identity or dose history changes from viewing/cancelling.
- **Status:** Pass/Fail/Blocked/Not Tested. **Evidence:** expanded screenshots, observations of visibility and cancellation. **Cleanup:** Close setup, reset DEMO.

### QA-STASH-VIS-03 — Setup action without duplicate stock changes (critical)
- **Start:** DEMO Stash > Kits > selected fictional kit > Vials.
- **Fixture:** Record exact open-vial ID/sequence and remaining mg, total kit quantity and dose-log count. Use a fresh isolated fixture, or mark Blocked if those details are unavailable.
- **Steps:** (1) Expand Details and tap Use setup. (2) Without saving, inspect options for method/dose unit/tracking. (3) Cancel/close. (4) Reopen Vials and compare balances/counts and method. (5) Return to Today > Log Dose and back without saving.
- **Expected:** Disclosure and cancelled setup are view-only: exact vial remaining, method, dose history and inventory unchanged. Draft behavior preserved; no phantom stock or new log.
- **Status:** Pass/Fail/Blocked/Not Tested. **Evidence:** before/after screenshots of vial balances and log count. **Cleanup:** Close unsaved forms and reset DEMO.

### QA-PROTECTED-01 — Existing protected workflows smoke checks (high)
- **Start:** Isolated full-app DEMO > Today using fictional sample data.
- **Fixture:** Existing fictional protocol, a dated sample dose/log, and an eligible fictional vial. If any is absent, mark just that subcase Blocked, not Pass.
- **Steps:** (1) Open Today and dismiss/close a dose sheet. (2) Open Calendar current month > day detail > recorded logs. (3) Open Protocol/Plans > fictional plan and return. (4) Open Stash > Vials/History and verify balances unchanged. (5) Open Supplies and More/Profile. (6) Open fictional Log Dose > enter amount/date > Review > Back without saving, and confirm no deduction/history mutation. (7) Check light/dark and scrolling.
- **Expected:** All named routes, sheets and backward navigation work; cancellation leaves existing records intact; 44px tap targets, no clipped text or horizontal overflow. Per-route result must be logged rather than one blanket Pass.
- **Status:** Pass/Fail/Blocked/Not Tested per named subcase. **Evidence:** screenshots/screenscreen and result notes. **Cleanup:** Reset demo and confirm fictional only.

**Record for every case:** case ID | start/fixture achieved | exact steps executed | expected vs actual | Pass/Fail/Blocked/Not Tested | notes | screenshot evidence | device/iOS | tester/date | source SHA | retest. Use interactive in-chat checklist and Copy Results in the session report. Browser CI is separately recorded; it never substitutes for physical iPhone or VoiceOver acceptance.

# Nexus — Manual iPhone QA: mandatory step-by-step instructions

**Standing instruction approved by user on 2026-10-29:** Every future user-facing manual regression checklist MUST show each scenario's **starting point and prerequisites**, **exact navigation to reach it**, **numbered taps/entries to create the scenario**, **expected result**, **what constitutes Pass / Fail / Blocked**, and **reset/cleanup directions**. Explain how to set up fictional data rather than assuming it already exists. Provide Pass/Fail/Not Tested/Blocked and Copy Results controls where practical. Don't claim untested cases passed. Distinguish physical iPhone evidence from automated browser QA. Use only an isolated DEMO for test writes; never ask user to adjust their real production stock to prepare a test. If a required fixture or route is missing, mark BLOCKED; don't invent app controls. Cite specific demo/build version and PR.

## PR124 — single-screen Log Dose testing (source e50873c)

**Preflight:** Open the verified PR124 **isolated full-app DEMO** on iPhone, *not* nexuspeplog.pages.dev. Confirm demo/sample mode and fictional Retatrutide inventory. Do not enter personal data. For deduction tests, record the exact individual open-vial balances and history count first; refresh/reset the sample fixture between separate saves when possible to avoid mixing test results.

### 1. Single screen and scrolling
- **Start:** DEMO > Today. Tap **Log Dose** and choose fictional Retatrutide if prompted.
- **Do:** Inspect the amount/date fields; scroll to optional extra information and back; expand **Review details before saving** without saving. Look at the confirmation footer.
- **Pass:** One scrollable form, fixed header/footer and available **CONFIRM LOG**, no Quick/Guided toggle or Back/Continue wizard; review doesn't save a record.
- **Fail:** Wizard returns, header/footer clips, or expanding review writes anything. **Reset:** Close without confirming.

### 2. Draft while switching sources
- **Start:** DEMO > Stash/Supplies > fictional Retatrutide kit > vials. Ensure TWO compatible **open** physical vials exist; sealed vials don't count. If demo cannot provide two, **Blocked**.
- **Do:** Return Today > Log Dose > Retatrutide. Enter e.g. **4 mg** and change the fictional date/time and optional note. Choose one open source, then choose the other without pressing Confirm Log.
- **Pass:** Dose/date/note remain, selected source updates, and no stale allocation creates a false shortage. **Fail:** Fields reset or old source allocation sticks. **Reset:** Close without confirming; check no entry added.
- **Scope:** This only tests changing sources within an open form; browser-restart recovery is a separate test, not assumed.

### 3. Exact-vial deduction
- **Start:** DEMO Stash/Supplies > Retatrutide kit > vial details. Note balances of TWO compatible open vials with at least **4 mg** each. Use fictional inventory only; **Blocked** if unavailable.
- **Do:** Today > Log Dose > Retatrutide > **4 mg** > explicitly select the *second* open vial (e.g., Vial 5) > **CONFIRM LOG** ONCE. Dismiss any optional reaction prompt with Later/Not now. Return to Stash > same kit > vial details.
- **Pass:** The specifically chosen vial decreases by exactly 4 mg; other open vial unchanged. **Fail:** Wrong vial or duplicate deduction. **Reset:** Fresh demo fixture before repeating.

### 4. False shortage
- **Start:** Two open compatible fictional vials, one with ≥4 mg left; note the amount in Stash.
- **Do:** Today > Log Dose > Retatrutide > enter **4 mg** > choose the known-sufficient exact vial. Inspect inventory status/allocation *before* saving.
- **Pass:** No outstanding shortage/partial 2 mg warning. **Fail:** Insufficient-stock warning despite selected usable 4+ mg. **Reset:** Close without confirming.

### 5. Single history record
- **Start:** DEMO Today/Calendar, note current fictional dose history count for the date/compound; use a fresh demo fixture if a prior case already saved a dose.
- **Do:** Today > Log Dose > Retatrutide > enter valid fictional amount/date and explicit vial source if required > Confirm Log once > dismiss optional invitation. Calendar > choose that date > logs/day details (or Today history if shown).
- **Pass:** Exactly one new record for the save, correct date and amount. **Fail:** Zero or duplicate records. **Reset:** Fresh demo fixture for next save test.

### 6. Cancel without inventory/history mutation
- **Start:** In DEMO note vial balances in Stash and existing history count in Calendar/Today.
- **Do:** Today > Log Dose > fictional compound > enter dose and choose a vial if needed. Tap **X / close** without tapping Confirm Log. Return to Stash and history.
- **Pass:** No balance change or new history record. **Fail:** Any unconfirmed debit/log. **Reset:** Return to original demo state.

### 7. Protected workflow smoke test — report individually
- **Do:** DEMO bottom navigation > Today; Calendar > a date with logs; Plans/Protocols > existing fictional plan; Stash/Supplies > kit > vials; More. On an existing fictional dose, open its edit action, change **notes only**, save, and inspect history.
- **Pass:** Each visited page works and dose edit doesn't create duplicate records/deductions. **Fail:** Note which exact route broke. **Not Tested:** Any subpage not visited. Don't mark blanket Pass based on only one tab.

**Results format:** Case number | Pass/Fail/Not Tested/Blocked | actual steps performed | observed result | screenshot when failing. Record physical iPhone device and isolated DEMO source; no live writes. Never report iPhone acceptance based only on automated CI.
