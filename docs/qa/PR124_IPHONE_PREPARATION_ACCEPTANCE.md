# PR #124 — Physical iPhone Preparation Plan Acceptance
**Policy:** docs/qa/NEXUS_TESTING_STANDARD.md v1.0. **Tested app SHA:** 9cf25469d901e47877fcc372f2aa2092627c6522. **Full-app DEMO:** Nexus_v0.9.20-beta_FULL_DEMO.html from CI artifact 12950707925. **Environment:** real iPhone, Safari or installed PWA, fictional isolated data only. **Physical acceptance:** ALL NOT TESTED until tester reports evidence.

## PREP-00 P0 — Preflight and baseline
Start with standalone isolated FULL DEMO, NOT nexuspeplog.pages.dev. (1) Open DEMO on iPhone. (2) Note iPhone model, iOS, browser/PWA, theme, date, build. (3) Today → Stash/Supplies → fictional kit → Vials, identify one OPEN vial with positive balance. (4) Screenshot exact kit label/vial number, remaining mg, existing prepared items and dose/history count. Expected: usable isolated fictional app and documented baseline; no production writes. FAIL: live-user write or bogus stock. BLOCKED: no interactive file/eligible vial, describe why. Reset: fresh isolated demo session, never import demo into production.

## PREP-01 P0 — Discover plan action on exact source
Prereq PREP-00. (1) Today → Stash → same kit → Vials → same vial. (2) Tap **Plan preparation**. (3) Read sheet source identifier, available fields and status. (4) Close without Save; compare source mg. Expected: correct linked source, no stock movement or completed-prep language. FAIL: wrong source, hidden eligible action, misleading prepared claim, stock mutation. BLOCKED only if fixture absent. Reset by closing unsaved form.

## PREP-02 P0 — Save metadata only
Prereq PREP-01 with mg/history recorded. (1) Open Plan preparation again. (2) Fill available safe fictional nonclinical plan fields; write down actual labels and entries. (3) Tap Save ONCE. (4) Check plan status, original vial mg, prepared/bottle inventory and dose history. Expected: one saved *planned-no-transfer* link; exact same vial mg, zero created prepared stock/bottle/dose. FAIL any silent transfer, duplicate or no save. BLOCKED if required fictional form controls inaccessible. Retain plan for next case.

## PREP-03 P0 — View linked plan
Prereq PREP-02 success. (1) Return Today → Stash → same kit → Vials → same vial. (2) Tap **View preparation plan**. (3) Compare plan values, exact source and status. (4) Close and reopen. Expected: correct saved values and planned status, no repeating create loop, no mg/history change. FAIL wrong source, missing or reset plan, status implies actually prepared. BLOCKED if PREP-02 unavailable. Keep linked plan.

## PREP-04 P0 — Edit without duplicate
Prereq PREP-03. (1) View preparation plan → **Edit plan**. (2) Change one safe editable text/plan field; record before/after. (3) Save once, reopen; navigate Today and back and reopen again. (4) Check one linked plan only, correct source, new field, same vial mg and dose/history. Expected: edits persist in active demo session; no duplicate, transfer or source change. FAIL duplication/missing edits/stock changes. BLOCKED missing viable prior saved plan. Reset fresh isolated session if necessary.

## PREP-05 P0 — Cancel edit
Prereq linked saved plan. (1) Open View preparation plan → Edit plan. (2) Change field. (3) Close/cancel WITHOUT saving. (4) Reopen and compare. Expected: original saved value stays, stock/history unchanged. FAIL unsaved changes persist or any mutation. BLOCKED if no reachable close action. Reset by discarding draft.

## PREP-06 P0 — Plan not eligible prepared stock
Prereq linked plan. (1) Today → Log Dose → fictional matching compound. (2) Inspect exact physical vial source choices and any prepared destination. (3) DO NOT confirm; close. (4) Recheck stock/history. Expected: planned-only item is not selectable *as prepared inventory*, no automatic debit; ambiguous vials require explicit choice. FAIL invented prepared source or unwanted saved dose. BLOCKED no matching demo compound. Cancel draft.

## PREP-07 P1 — Method setup is distinct
Prereq unresolved-method OPEN fictional vial, else BLOCKED and identify fixture. (1) Stash → kit → Vials → exact vial → **Set method**. (2) Choose and confirm method using available fictional options. (3) Reopen; compare original mg and history. (4) Check Plan preparation remains a separate action. Expected: intended use updated only, no deduction or legacy-history rewrite. FAIL any transfer/dose or conflation. Reset fresh demo for alternative route.

## PREP-08 P1 — Device UI/UX
Prereq PREP-01, PREP-04 accessible. (1) Portrait: open plan sheet and scroll to Save; raise keyboard on every text field. (2) Check sheet close, Save, focus order, scrolling, safe area, targets 44–48px. (3) Repeat dark/light and larger text if available; record separate Safari/PWA results if tested. Expected: controls visible/readable/tappable; no clip/keyboard overlap, duplicate arrows or horizontal scrolling. FAIL observed layout defect with screenshot. NOT TESTED for unattempted variants. Close sheet for cleanup.

## PREP-09 P1 — Protected workflows
Prereq fictional DEMO. (1) Today → Log Dose open/cancel: no record. (2) Calendar → current month → date/logs: no plan-as-dose. (3) Plans/Protocols → existing fictional item → back. (4) Stash → source vial balance. (5) More/Settings → return. (6) Check-In, Supplements, Weight, Nutrition individually where fixtures permit. Expected: navigation works and no hidden mutation. Record separate outcome per subflow, not blanket PASS; mark absent fixtures BLOCKED. Cleanup with fresh demo.

## PREP-10 P0 — In-session persistence boundary
Prereq PREP-04. (1) Close/reopen plan IN SAME running demo. (2) Confirm saved edit and no stock changes. (3) If also testing tab reload/close, record it separately: isolated in-memory demo may intentionally reset, not an automatic FAIL. Expected: saved plan persists within session and no production write. FAIL active-session loss. BLOCKED uninteractive JS. Reset by reopening fixture.

## Mandatory result record for EACH case
ID | source SHA + artifact | device / iOS / Safari or PWA / theme | fixture kit/vial/starting mg | numbered actions actually performed | expected | actual | status Pass/Fail/Blocked/Not Tested | screenshot/video | date/tester | severity/issue | cleanup completed.
Do not infer iPhone Pass from the four successful CI workflows (full #40994146112; mobile #40994146083; nested #40994146163; WebKit #40994146079). All 11 cases NOT TESTED until user returns actual results. Never test against live production personal inventory.

## Gate / next action
P0 unexpected stock transfer, false prepared source, wrong exact vial, duplicate plan or loss of saved edit block acceptance. PR124 draft; no merge or deploy authorization. Next: user runs PREP-00 through PREP-04 on physical iPhone, returns results and screenshots of failures, then PREP-05 through PREP-10. Preserve source-plan distinction.
