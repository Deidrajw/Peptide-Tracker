# Nexus full-app UI/UX audit — populated fictional checkpoint (2026-11-13)

**Audit source:** GitHub main `b3a67ec48f5ba982abff042048e30a9549d83467`, app v0.9.27-beta.3. **Status:** Audit-only, no application changes, no user data writes, no release approval.

## Method
- Official Actions artifact `#14010642307` manifest matched main SHA; outer ZIP passed CRC, nested 26-file LIVE ZIP passed CRC.
- Local Chromium/Playwright against standalone full-app fictional in-memory DEMO using `set_content()` (file:// blocked). 320px and 390px, light/dark: 20 primary route captures. Additional 26 captures: Today + Log Dose + Check-In, Protocol + Create first step, Stash/Vial kits/Other forms/Supplies, Calendar Month/Week/Logs.
- No JavaScript page exceptions or document-level horizontal overflow in these 46 captures. This does not establish every scroll, form interaction, WebKit, real iPhone, VoiceOver, contrast, keyboard or functional save test.

## Ranked findings
1. **P1 Today hierarchy:** rich approved components but long sequence of hero, check-in, shortcuts, schedule, tracking, weekly and upcoming sections. Preserve important actions; consolidate redundant prompts and disclose secondary content deliberately.
2. **P1 Protocol Builder:** 320px first step displays eight similarly weighted emoji-led goal choices and navigation. Opportunity to improve scan and DS2 icon consistency; do not change accepted choices or other phases without approval. Issue #157/PR158 approved draft remains separate.
3. **P1 Check-In:** long but structured 320px sheet with mood/date, symptoms, notes, supplement templates/search and sticky Save. Confirm keyboard and large text behaviour and consider progressive disclosure for optional controls; preserve validation/history/multi-select.
4. **P1 Calendar:** *prior suspected 320px grid overflow was not reproduced*. Approx 40px day target width at 320px results from seven-column layout; test touch/VoiceOver rather than unconditionally enlarging past viewport. Status labels (resolved/missed/unresolved) need clarity.
5. **P2 Stash:** preserve accepted accurate active-vial cards and preparation data; simplify context-sensitive empty-state duplicate Add kit/filter/sort only after comparing populated screenshots.
6. **P2 Typography and controls:** source and computed examples show some 9–12px text; audit semantic copy/contrast/touch targets and unify SVG/chevron language without sweeping redesign.
7. **P2 More:** source/live read-only review shows Trends, Plans, Nexus, Profile/Settings. Clarify “Nexus” destination and duplicate Profile entry; panel pattern itself need not change.
8. **P1 Validation gap:** full Log Dose selection, insufficient inventory, Undo, multi-vial arithmetic, check-in saves and record edits NOT TESTED by this visual audit. Previous regression evidence remains separate.

## Audit test matrix
- PASS: main SHA/source artifact match; artifact ZIP CRC; 20 baseline primary route renders; 26 deeper route/modal renders; no JS errors; no document-level overflow.
- NOT TESTED: functional save/edit/delete/Undo, complete protocol wizard, populated More destinations, WebKit, physical iPhone, VoiceOver/Dynamic Type, full contrast, external webfonts, clinical maths.
- No claims of functional or accessibility PASS follow from screenshot rendering alone.

## One next action
Complete isolated fictional full-app audit of **More → Trends/Plans/Nexus/Profile/Settings** and perform controlled safe form lifecycle tests with separate evidence. Only then propose before/after Today design for approval. No merge/deploy authorised.

Related conversational deliverables: `Nexus_UIUX_Audit_2026-11-13.md` and `Nexus_UIUX_Audit_Screenshots_2026-11-13.zip` (46 screenshots + two machine-readable result files). They are not committed to this branch.

## 2026-11-13 — continued secondary navigation audit (same full-app fictional source)
- Local Chromium/Playwright on official isolated full-app DEMO from artifact #14010642307, GitHub main b3a67ec4, v0.9.27-beta.3. **36/36** secondary route/theme/width renders (320/390 light/dark) with zero page errors or document-level horizontal overflow: More → Trends, Plans, Nexus, Profile, Settings, Supplements, Backup & Restore, Dose Alerts and Data Management.
- **24/24** controlled UI interactions PASS at 320/390: Plans Goals/Research/Shopping; Nexus Ask/Journal/Learn/Explore; Supplements search matches/no-results/reset; Profile timeline expand. **6/6** fictional supplement add/remove/JS checks PASS at 320/390 (8→9→8 items), removal needs native window.confirm accepted. First automated removal was auto-dismissed by test harness, **not an app defect**.
- New measured a11y review candidates: Profile Show timeline <summary> 35px high; Supplements search 42px high (both under desired 44–48px). Not proven WCAG failures; test keyboard/focus on physical device. Nexus Ask has deep prompt list ahead of input on 320px; suggested UX improvement to consider, not a confirmed functional defect. Plans layout relatively clear; avoid unnecessary redesign.
- **NOT TESTED:** submitted AI requests, backup/restore/import/export, destructive settings actions, full dose math/Undo, real iPhone, VoiceOver/Dynamic Type, clinical safety. Local evidence: Nexus_UIUX_Audit_Continuation_2026-11-13.md and Nexus_UIUX_Secondary_Evidence_2026-11-13.zip (36 screenshots, 3 JSON evidence files), delivered in conversation, not committed.
- NEXT: isolated fictional Log Dose full transaction, single/multi-vial debit and Undo assertions; no code change, merge, deploy or real user data access.

## 2026-11-13 — fictional Log Dose transaction UX audit, 320/390 Chromium
- GitHub main b3a67ec4 / isolated official v0.9.27-beta.3 full-app demo. Single source Retatrutide vial #4 started at 28mg. At 320px and 390px: initial unconfirmed administration method blocked review, vial method confirmation caused NO deduction, reviewing 2mg previewed 26mg, successful confirmation saved exactly one dose (13→14) and debited vial 28→26mg; Undo removed that dose (14→13) and restored the **same vial 26→28mg**. PASS browser-only; no production storage writes.
- A deliberately invalid 99mg input on 28mg stock reached Review and displayed “Vial remaining after save: 0.00 mg”; the Confirm Log button remained available. Final confirmation REJECTED with “Source allocation must match dose”; 13 doses remained 13. **P1 UX FAIL: misleading projected balance and late insufficient-stock explanation.** This is NOT evidence of a successful overdraw, inventory corruption or clinically validated maths. Recommend review-stage explicit shortfall and actionable correction while retaining final transactional guard; no code change made.
- After valid save, reaction prompt appeared; Undo toast was offered on “Not now” and functionally passed. Undo discoverability while reaction prompt open NOT TESTED. Advanced multiple-vial toggle was opened but no valid two-open-vial allocation or Undo was exercised: NOT TESTED. Other methods, prepared/blend/nasal, WebKit, physical iPhone, VoiceOver and clinical safety NOT TESTED.
- Local deliverables: Nexus_UIUX_Log_Dose_Audit_2026-11-13.md and Nexus_UIUX_Log_Dose_Evidence_2026-11-13.zip (31 ZIP members, CRC PASS), not committed to repo. ONE NEXT ACTION: test two-open-vial allocation and recovery with fictional data, then preview review-stage shortfall UX before any implementation. Audit documentation branch only; no merge/deploy approved.
