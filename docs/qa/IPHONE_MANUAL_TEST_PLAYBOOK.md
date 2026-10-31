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
