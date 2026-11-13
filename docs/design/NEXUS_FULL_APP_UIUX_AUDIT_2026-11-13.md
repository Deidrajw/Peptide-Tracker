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
