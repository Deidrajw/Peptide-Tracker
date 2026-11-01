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
