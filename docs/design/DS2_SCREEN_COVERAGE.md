# Nexus Design System 2.0 — Complete Surface Coverage Register
**Updated:** 2026-10-27 | **PR:** #123 DRAFT / UNMERGED | **Purpose:** track EVERY screen and subpage; no automatic completion from a passing test.

## Approved direction
Hybrid **Soft Depth + Porcelain + Obsidian precision**. Midnight-lavender dark theme, pearl/porcelain light theme, restrained depth, consistent outline icons, 44–48px targets, legible hierarchy, limited borders, coherent disclosure and sheet design. Do not mistake UI changes for data or clinical recommendations. Existing data/history/math must remain untouched.

## Status semantics
- USER OKAY FOR NOW: user explicitly accepts current appearance; no fresh redesign required. This does NOT certify every keyboard/accessibility case.
- OPEN DS2: requires full styling across screen AND child screens, with screenshots; NOT COMPLETE even if some CSS exists.
- CODED / NEEDS CHECK: selective changes present; real visual/functional acceptance outstanding.
- FINAL POLISH: intentionally last within current DS2 pass.

## Screen and subpage inventory (including hidden and modal surfaces)
| Area | Surfaces to account for | Current DS2 status |
|---|---|---|
| Today | Overview/hero, Today/Active/Completed/All, compound expanded cards, due/recorded, Coming up, Check-In summary, daily supplements, needs-attention, all entry sheets | USER OKAY FOR NOW except specific deferred physical/Record Reaction verification |
| Calendar | Month, Week/Block, Day, Logs Day View, All Logs, Add Log, dated details/edit | USER OKAY FOR NOW; prior Month icon issue deferred, NOT blocking next screen |
| Protocol / Plans | Protocol list, Overview, phase roadmap, schedule/phase details, compound detail, create/edit wizard, Research, Shopping, Goals, action sheets | USER OKAY FOR NOW; don't reopen cosmetic review without new issue |
| Stash kits | Kit cards, expanded Overview/Vials/History, open-vial details, kit/blend create/edit wizard, attachments/viewer, Manage, Inventory Resolution, source actions | OPEN targeted Overview/Vials/History rounded tab fix and Prepare Dose; other prior work user okay for now |
| Supplies | Empty/populated, Add/Edit, usage/restock/details | USER OKAY FOR NOW |
| Profile | Profile hub, edit profile/avatar, preferences/settings, supplement catalogue, backup/export/import, notifications, security/privacy, info/about where present | OPEN DS2 FULL SURFACE PASS; user explicitly says NOT upgraded comprehensively |
| Supplements | Profile catalogue, inline Check-In creation/search, daily logger, date-specific history, Add/Remove and empty results | OPEN final visual and iPhone verification; Notion importer should not reappear |
| Trends / Insights / Nexus | Every trend dashboard, graph, timeframe toggle, data detail, empty/loading states, filters, correlation/pattern explorers and drill-downs currently reachable | OPEN DS2 FULL SURFACE PASS; user explicitly says NOT upgraded |
| More | All section headers and child destinations: Learn, Discover, Intel, saved resources, release notes / What's New, data health/help/privacy, all existing settings | OPEN DS2 FULL SURFACE PASS; inventory routes in actual code before redesign |
| Log Dose / Reaction | Quick/Guided, source selection and review, draft, edit, reaction invitation, event history/edit/delete, Combo Dose, prepared doses | CODED / NEEDS PHYSICAL ACCEPTANCE, preserve vial math |
| Tracking tools | Weight, Nutrition, Check-In modal, symptom picker/associations, measurements, activity, schedule/history, relevant calculators | OPEN DS2 FULL SURFACE CHECK; preserve all existing content and records |
| Onboarding | Consent, welcome, optional tour, data restore, existing-user bypass protections | Separate PRODUCT ROADMAP work; never assume DS2 implementation constitutes store readiness |
| Global | App-wide tab bar, shared design tokens, type scale, icons, contrast, focus, VoiceOver, required/optional fields, nested scrolling, keyboard/safe areas, motion/reduced motion | FINAL POLISH LAST in current DS2 pass per user instruction |

## Priority order confirmed by user 2026-10-27
1. Correct Stash **Overview/Vials/History** pill corners (physical screenshot).
2. Complete design system across skipped subpages: Trends/Nexus/Insights; Profile + Settings + Supplements; all reachable More subsections, Learn/Intel and other unconverted pages. Audit navigation tree first, not just main tabs. Present screen-by-screen preview before major redesign.
3. Check remaining unconverted subpages and modal/actions for true DS2 parity. Treat existing user-accepted Calendar, Protocol/Plans, Supplies as stable and do not gratuitously redesign.
4. **LAST:** accessibility and type/required fields/global scrolling/navigation/motion consistency sweep, incl. VoiceOver. Keep a reminder for this explicitly.
5. Broader PRODUCT ROADMAP stays distinct and is not superseded by this DS2 sprint.

## Closure checklist for EACH surface
- [ ] Current source route and all child actions identified
- [ ] Proposed visual matches approved hybrid tokens, no stale green / square tab / raw IDs
- [ ] At 320px and 390px, light/dark screenshot and interaction QA recorded
- [ ] Real iPhone acceptance where relevant (separate from emulation)
- [ ] Saved-data/backup/history protections and workflow regression established
- [ ] Status, commit, CI artifact, preview SHA and user approval recorded in this register

## Next step
Map actual navigation destinations and mark each child surface by exact route + visual conversion status; implement remaining Profile/Trends/More and other skipped subpages on draft PR #123. Production merge/deploy requires separate user authorization.


## 2026-10-27 DS2 progress: CSS commit dfe4df01 adds Trends summaries/jump, Body Progress tabs, compound library, Pattern Explorer and Profile/Settings hero, subtabs, rows/icons responsive styling. CODED/NEEDS CHECK. Stash tab corner CSS fix present; latest automated result and physical iPhone acceptance still pending. Nexus/Insights/More, settings child pages, supplements and hidden sheets remain OPEN. Accepted Calendar/Plans/Supplies unchanged. Global a11y/type/scroll/navigation/motion LAST.


## 2026-10-27 DS2 Nexus and Settings detail progress: commit bd26e3d6 extends existing Nexus Ask/Journal/Learn/Explore navigation, chat prompts, inputs, secondary panels, Profile privacy cards and Settings detail controls. CODED/NEEDS CHECK at 320/390 light/dark; child workflow and real iPhone acceptance remain OPEN. Source review found legacy _aminoSub='insights' normalizes to Ask; no functional route change made. Earlier dfe4df01 browser workflow 40601194237 and mobile 40601194692 SUCCESS; does not validate bd26e3d6. Stash corners still need physical acceptance. Global polish LAST.


## 2026-10-27 verification refinement: Stash tab guard branch full browser workflow 40600422694 SUCCESS, mobile 40600422891 SUCCESS, but physical iPhone reacceptance open. Trends/Profile dfe4df01 full 40601194237 and mobile 40601194692 SUCCESS for automated suites; child-by-child visual acceptance remains open. Nexus/Settings bd26e3d6 new workflow pending. All future roadmap lanes preserved and global polish LAST.


## 2026-10-27: CSS 9ed589e6 adds shared Nexus Learn/Explore/Journal card, accordion, input, and More panel styling plus Settings child card/control refinements. CODED, not visually accepted. Earlier bd26e3d6 browser 40614785248 PASS, mobile 40614785307 PASS. Current-head visual screenshots, hidden child routes and physical iPhone NOT TESTED. Global accessibility/typography/forms/scroll/navigation/motion LAST.


## 2026-10-27 DS2 child-surface candidate: fdc1d608 styles Nexus Journal filters/cards, Explore feature rows, Insights tab controls and Settings unit, health import, backup, data management and developer controls. 81adc534 styles actual More bottom destination sheet and standalone Learn route. Nexus uses Ask/Journal/Learn/Explore under amino and More contains Trends, Plans, Nexus and Profile & Settings. CODED / NEEDS CHECK; not user-accepted. Source discovered older _aminoSub=insights maps to Ask, and some Explore links point there; functional/navigation review deferred, not silently changed. Existing accepted Calendar/Plans/Supplies stay protected, global audit LAST.


## 2026-10-27 — Nested navigation and DS2 consistency audit (SOURCE REVIEW, NOT VISUAL PASS)
**Audit principle:** examine every reachable destination recursively: top-level tab → subtab/menu → detail → nested action/editor/dialog → confirmation/empty/error state. The More menu is only one entry point; inspect journeys reached from Today, Stash, Trends, Protocols, Calendar and Nexus too. CSS selector presence and green CI are not visual acceptance.

| Trace / depth | Verified route mechanism in source | DS2 finding / action | Status |
|---|---|---|---|
| More → Profile & Settings → Settings → Dose Alerts / Protocol Phase Alerts | `showNexusMorePanel()` to profile; `renderSettingsDetailScreen(reminders/phasereminders)` | Detail pages use individually styled containers; inspect alerts, toggles, status text and return affordance | SOURCE FOUND / VISUAL NOT TESTED |
| More → Profile → Settings → Units & Preferences | `renderSettingsDetailScreen(units)` | Verify radio/select units, old nested card geometry, confirm/save and returning to Settings | SOURCE FOUND / VISUAL NOT TESTED |
| More → Profile → Settings → Health & Data, Privacy & Data | `renderSettingsDetailScreen(health/privacy)` | Inspect nested import context, data-health sections and privacy cards in both themes | SOURCE FOUND / VISUAL NOT TESTED |
| More → Profile → Settings → Backup & Restore → import/restore confirmation | `renderSettingsDetailScreen(backup)` plus `nx-import-open/confirm/cancel` controls | Highest data-risk journey: render modal/confirmation, keyboard, scroll, preservation; no test with real production storage | SOURCE FOUND / VISUAL NOT TESTED |
| More → Profile → Settings → Data Management / Shortcut Activity / Developer Options | `renderSettingsDetailScreen(datamanagement/usage/developer)` | Check destructive confirmations, details, reset controls and non-standard layout | SOURCE FOUND / VISUAL NOT TESTED |
| More → Profile → Supplements → search/add/remove/empty results | `renderSupplementsTabContent()`, `supp-search`, `add-supp`, `del-supp` | Row uses inline delete glyph and styling, inspect zero/many/filtered states; preserve date-specific supplement history | SOURCE FOUND / VISUAL NOT TESTED |
| Nexus → Ask → suggested question → composer → answer/follow-up | `aminoView()` | Inline chat and chip styling; inspect long answers, transcript scroll, input keyboard and empty/error states | SOURCE FOUND / VISUAL NOT TESTED |
| Nexus → Journal → filtered entry → linked source record | `journalView()` and `data-jump-type/id` | Check destination context, detail back, badges, long notes and empty search | SOURCE FOUND / VISUAL NOT TESTED |
| Nexus → Learn → guide/discovery item → guide/discovery detail | `aminoView()`, `guideDetail()`, `discoverDetail()`; standalone `learn` route in `renderBody()` | Test both entry points, detail scroll/back, old icon/colour treatment and multiple-depth navigation | SOURCE FOUND / VISUAL NOT TESTED |
| Nexus → Explore → feature → other primary/subtab → details | `featureExplorerView()` actions navigate protocols/plans/home/trends/stash | Several icons are emoji and actions have inlined colours. Test full destination and back path, not just Explore card | SOURCE FOUND / VISUAL NOT TESTED |
| Trends → compound Intel → detail | `trendsView()` switches to `compoundIntelView(state._compoundIntel)` | Child replaces trends root; inspect back, composition, long content and visual language | SOURCE FOUND / VISUAL NOT TESTED |
| Trends → Pattern Explorer / Symptom Timing → results → chart/data detail | `nx-open-pattern`, `nx-open-symptom-timing`, `nxTrendsDetail()`, `chartDetailModal()` | Nested controls, result/no-data cards and modals require dedicated visual evidence | SOURCE FOUND / VISUAL NOT TESTED |
| Stash → kit → Vials/History → source action → confirmation/editor | `stashView()`, `openNewVialModal()`, `editOutflowModal()`, `logWasteModal()` | Validate DS2 sheets in context, selected tab roundness and math; don't redesign accepted base kit UI | SOURCE FOUND / VISUAL NOT TESTED |
| Plans → protocol/goal/research → detail → phase/editor/confirmation | `protocolsView()`, `plansView()`, `protocolBuilderModal()`, `phaseRoadmapModal()` | Approved main pages stay stable; deep editors and confirmations are still audit targets | SOURCE FOUND / VISUAL NOT TESTED |
| Today/Calendar → record/log/check-in → editor → confirmation/history | `homeView()`, `protocolCalendarView()` and modal/record flows | Audit deeper surfaces without altering validated data logic, drafts, single date records or history | ROUTE FAMILY FOUND / CHILD INVENTORY INCOMPLETE |

**Observed source-level DS2 drift to fix after rendered screenshots:** per-detail inline styles in Settings; text-only Settings back glyph; emoji-based Explore icons; inline coloured Journal/Insights items; single-use modal geometry; possible mismatches between standalone Learn and Nexus Learn. Do not claim any rendered discrepancy without screenshots. Legacy `_aminoSub=insights` maps to Ask; scope as separate navigation review, not a silently corrected bug.

**Required screen-coverage evidence:** for each trace, capture actual start path, child destination, light/dark screenshots at 320 and 390px, scroll and return actions, confirmation/empty/error states, source commit, browser run/artifact and real-device result separately. Mark PASS only after evidence. Manual QA should use fictional isolated storage; do not exercise real import/delete/reset data.

**Next action:** add route-level screenshot/browser assertions for the Settings deep journeys and Nexus Learn/Explore-to-detail routes first, then audit Trends/Stash/Plans deep modal families; fix only verified DS2 defects. Keep global accessibility/typography/required-fields/scroll/navigation/motion final, preserve accepted Calendar/Plans/Supplies, PR #123 draft and production unchanged.

## 2026-10-27 — User physical iPhone screenshot audit: Log Dose action hierarchy and inventory blocker
Evidence: three user-supplied screenshots of Cloudflare preview `e1d12e64.nexuspeplog.pages.dev` (actual browser screenshots, not automated traversal). Compound selection → Quick Log entry → Review. Findings to verify against exact preview source: (1) violet primary button fill differs between "Continue to dose log", "Continue" and "Confirm Log"; (2) Back control appearance/layout varies between stages; (3) selector X is bare but Log Dose X is boxed; (4) review date shows raw ISO `2026-10-27T21:44`; (5) review right-column values are cramped and long strings can collide; (6) CRITICAL POSSIBLE LOGIC/INVENTORY ISSUE: review shows 300 mg recorded amount and selected open vial "10.00 mg remaining". Need establish whether source can deduct from other vials, stale stock, or missing insufficient-inventory guard before allowing confirmation. Do not infer cause or change math without reproduction. Screenshots demonstrate design differences, not proof of a broken deduction.
**Action taxonomy proposed for audit, not yet implemented:** Primary = one high-emphasis filled lavender treatment for forward/commit; Secondary = low-emphasis outlined/surface Back/Cancel; Destructive = distinct warning/confirmation and never primary lavender; Tertiary = text/ghost contextual; Close = consistent icon-only 44px hit target with unobtrusive surface; Disabled = reduced contrast without suggesting active state. "Confirm Log" may use same primary visual as Continue but requires stronger confirmation copy and validation, not a random colour change. Modal-specific density may differ only with documented rationale.
**Coverage expansion:** inspect ALL tabs and recursively opened subpages, drawers, dialogs, wizards, sheets and nested confirmation actions. Record each button label, semantic role, visual treatment, hover/pressed/disabled state, screenshot path and DS2 parity. Test 320px/390px light/dark and scroll/back/keyboard, plus independent real iPhone. Do not equate passing main-screen CI with child acceptance.
**Status:** SCREENSHOT FINDINGS / NEEDS REPRODUCTION. Automated nested-navigation screenshots NOT RUN this checkpoint; no code fix validated. Treat 300mg-vs-10mg as a safety/regression blocker until explained. No merge/deploy.


## ## 2026-10-27 — User screenshot-driven action hierarchy & deep-route browser gate
**Physical screenshot evidence provided:** October 27 Log Dose chooser → Quick Log step 1 → Review step 2 on Cloudflare branch preview. Identified inconsistent purple fills for "Continue to dose log" vs "Continue"/"CONFIRM LOG", inconsistent Back visual weight, and a **potential source/inventory risk**: dose 300 mg, selected vial remaining 10.00 mg. Screenshot alone cannot prove whether other vials are allocated; must verify save-time allocation blocks insufficient inventory without changing live data.

**Targeted CSS:** afced369 applies one scoped dose-modal primary lavender (#C6A6F2) and ink (#24182F) to Continue and final Confirm/Save; one neutral outlined Back; selected Quick/Guided state remains neutral. This normalizes **same functional class, same shade**, without altering JavaScript logic, storage, source allocation or clinical calculations. Source selected compound step "Continue to dose log" still requires exact selector/screenshot verification; do not claim whole-app button consistency.

**Automated audit added:** scripts/ds2-nested-navigation-audit.mjs at 4c24b27. Localhost-only Playwright route/screenshots: Today, Calendar, Plans, Stash, Trends, Nexus Ask/Journal/Learn/Explore, standalone Learn, Profile, Settings, Supplements, and 10 Settings child details; 320/390px light/dark. Captures computed visible button colours/borders/radii/shadows, horizontal overflow and screenshots into artifacts/ds2-nested-audit. **SCRIPT NOT EXECUTED in this checkpoint**. It is an audit scaffold, not proof of nested action coverage. Expand to all modals, action sheets, selection states and source fixture setup, and review screenshot diffs. Do not run with real user data.

**Button semantics (proposed design standard):** primary progress/commit (solid lavender), secondary/back (subtle outlined), selection/tabs (neutral selected surface), destructive (danger and confirmation/Undo), disabled (unavailable), icon-only close (consistent square touch target). Exceptions need documented purpose, not screen-by-screen arbitrary overrides. Audit all action labels, variants, disabled states and confirmation consequences across every deep route. Global a11y/typography/forms/scroll/nav/motion remains LAST.

**Open QA:** Run script on the exact branch head and inspect screenshots, compare original full-app button classes and selectors, verify insufficient 300 mg/10 mg inventory scenario against isolated fixtures. Physical iPhone acceptance, current-head CI, full-app demo, LIVE ZIP, and production release remain INCOMPLETE.



## 2026-10-27 — Log Dose review correction 03d83f64 (DRAFT)
Source review found original non-blend Save path validates plan totals and available open-vial quantities, rolls back partial deductions upon shortfall and shows an error; screenshot alone did not prove dose was saved. The earlier review UI displayed only a selected vial balance, potentially misleading for a multi-vial dose, and unformatted ISO date. Commit 03d83f64 adds a review-stage warning when current plan/selected vial is short and formats date/time for readability. Underlying save, source allocation, inventory math and stored records unchanged. CURRENT-HEAD JS/browser and modal screenshot verification PENDING; caution: warning is informational, save guard remains authoritative. 320/390 light/dark nested screenshots and all action-style taxonomy review INCOMPLETE. PR #123 draft, production untouched.


## 2026-10-27 CI attachment: d7a45b4b adds exact initial-dose chooser primary/secondary hierarchy (#today-dose-single, #today-dose-combo) to match step Continue/Confirm/Back styling at afced369. a08f62f9 adds workflow .github/workflows/ds2-nested-audit.yml to run localhost-only screenshot and computed button inventory at 320/390 light/dark; queued run 40617435379 when checked. User screenshot observations require independent visual review, not a blanket PASS. Workflow currently captures route states, not all clickable modal descendants. Expand deep path traversal after evidence inspection. 300 mg requested while selected vial showed 10 mg remaining remains urgent isolated save-path regression. All release artifacts/physical iPhone acceptance INCOMPLETE.


## 2026-10-27 QA FINDING: first nested screenshot workflow 40617435379 completed SUCCESS with 92 screenshots/4 viewport-theme pairs and zero script errors/overflow, but inspected contact sheet revealed ONBOARDING OVERLAY obscuring most pages! Thus NESTED VISUAL VALIDATION FAIL/INVALID; 'PASS' is runner-only, not screen QA. Fixed isolated fixture script at 48e3293b to mark onboarding complete and close overlay before captures; new workflow 40617673780 queued at check. Re-inspect actual screenshot images and computed button variants before marking any child PASS. The first evidence zip contains 92 images but must NOT be considered screen acceptance.


## 2026-10-27 source and computed style audit: Settings data-removal actions (#del-*) previously used neutral surface identical in family to standard navigation while #nuke-data used danger. Commit 49271c54 now gives individual data deletion a restrained danger treatment and full wipe stronger danger treatment in both themes; no handler/storage changes. Source justification: different consequences deserve distinct visual semantics. Await corrected overlay-free route screenshots and full current-head CI; physical iPhone and all modal descendants NOT TESTED.


## 2026-10-27 VERIFIED SCREENSHOT PASS, LIMITED SCOPE: exact code e00d802a nested visual CI 40618241161 SUCCESS; artifact 12785574088 downloaded and inspected. 23 route states × 320/390 × light/dark = 92 screenshots, no runner errors or document horizontal overflow. Corrected onboarding fixture no longer obscures child views. Computed colours show Today Log Dose, Plans Add Goal, Stash Add Kit and Supplements Add all rgb(198,166,242), ink rgb(36,24,47). Settings individual data removal has red-tinted background/border; full reset stronger danger style. Observed child pages include Nexus Ask/Journal/Learn/Explore, standalone Learn, all 10 Settings details, Profile, Supplements, Trends, Stash, Plans, Calendar, Today. Still NOT COVERED: actual deep route clicks and transitions, modal editors, back stack, confirmation, dose chooser/Quick/Guided/Review in automated screenshots; browser emulation is not real iPhone. User-provided iPhone screenshots are actual device evidence of pre-fix action shade discrepancy but NOT post-fix acceptance. Source 300mg dose vs 10mg selected vial remains inventory regression to test. Full-app LIVE/DEMO artifact parity and production deployment separate.


## 2026-10-27 NEXT NESTED LAYER: script commit 528b3da1 expands localhost-only screenshot QA beyond 23 route states to six safe action openers: Today Log Dose chooser, Plans Add Goal, Stash Add Kit, Trends Pattern Explorer, Trends Symptom Timing and Settings Import Backup. No save/delete/import or production requests are triggered by intended test. CI run 40618782970 in progress at first check; 528b screenshots/interaction outcomes NOT VERIFIED. This is still a subset of all editors and confirmations; preserve all open states in registry and do not declare whole-app button parity.


## 2026-10-27 Expanded modal QA update: run 40618782970 FAILED 4/116 screenshots because native Backup Import opens file picker instead of in-DOM modal; no application failure proved. Removed incorrect modal expectation at script 1d1d9679; run 40619001108 SUCCESS and mobile 40619001003 SUCCESS (112 route/action captures expected). Source screenshot inspection of 390-dark five opener cases showed kit wizard Continue gradient/transparent computed background and Trends Pattern/Symptom informational Done bright fill; scoped CSS 42560603 changed kit Continue to flat #C6A6F2 and informational Done to neutral outlined. Test script a00109b2 adds semantic computed-fill assertions for Today/Plans/Stash/Supplements/kit progression and informational Done at 320/390 both themes. Latest semantic test run pending; no visual/device acceptance until current code evidence checked. Native file picker, actual restore confirmation, records and save-path inventory still NOT TESTED.


## 2026-10-27 VERIFIED EXPANDED NESTED AUDIT: source/script 1f9fda2b succeeded GitHub Actions #40619363394. Downloaded artifact 12785899054 and inspected action-inventory.json: 112 screenshots = 28 route/action states × 320/390 × both themes; 0 capture errors, 0 document horizontal overflow; semantic CTA assertions pass. Computed primary buttons Today Log Dose, Plans Add Goal, Stash Add Kit, Supplements Add, and Kit wizard Continue share rgb(198,166,242) fill and rgb(36,24,47) text. Pattern/Symptom informational Done actions share neutral rgb(53,45,67) in dark. Mobile regression #40619363338 SUCCESS; full build/parity #40619363343 in progress at last observation. This is route-state/5 safe dialog opener coverage, NOT ALL screens, populated Log Dose Quick/Guided/Review, every back/action/confirmation, native Import picker, save transaction or physical iPhone. User screenshot 300mg vs 10mg selected-vial mismatch remains unresolved until isolated allocation tests. No production deployment. Next: verify latest full artifact build then expand deep-editor/transaction regression while preserving accepted screens.


## 2026-10-27 — Fictional-data, reachable-route and semantic button audit gate
- Script commits 8c78d9d8 / ef61fbf0 / aaaca022 require **built-in populated weight_loss DEMO mode** in a fresh LOCALHOST isolated browser context. The audit checks fictional kits, check-ins and compounds exist, and Demo Mode's saveState suppression prevents real-state writes. No preview/production origin is used.
- Every route-state screenshot now checks actual rendered .nx2-page root plus the selected Nexus child tab / Profile subtab or Settings detail back affordance; failing navigation makes the run fail rather than photographing another screen.
- button-role-audit.json classifies buttons conservatively as primary, secondary, destructive, selection, disabled or unclassified. Inventory includes computed shading/radius/shadow, source screen, theme and viewport. Unclassified variants are review items, not automatic failures; distinction between semantically different roles is legitimate.
- Previous 112-screen current-head run 40619363394 SUCCESS used a cleared state and is **not** proof of populated fictional-data workflows. The NEW fixture/route gate is CODED / CI PENDING. Specific current-head screenshots, populated Log Dose Quick/Guided/Review, saved-dose source allocation, native Import and physical iPhone remain unaccepted.
- Next: verify new CI and screenshot artifact. Inspect same-role shade anomalies and fix only verified inconsistencies; extend safe click-through to populated nested editors, dates, confirmations, history and 300mg-vs-10mg inventory guard. Preserve global a11y/motion/forms/scroll/type audit LAST.


## 2026-10-27 FICTIONAL DATA / ACTION ROLE GATE: built-in populated weight_loss Demo Mode established in fresh localhost context with saveState disabled and fictional compounds/kits/logs/weight. Route assertions added and App Updates special #au-back route test fixed (d66fd3e1). Initial stronger run 40619846887 had 4 App Updates test-assertion failures, not proven app faults. New run 40619990770 pending. New button-role-audit.json groups by primary / secondary / destructive / selection / disabled / unclassified and records computed background, radius and shadow by 320/390 light/dark; deviations only comparable within same semantic role. Actual deep log saves, native file imports and physical iPhone not tested.


## 2026-10-27 artifact closure gate for implemented SCOPED styling: full build 40619363343 SUCCESS, artifact 12787100570, live exact-source 21 paths, full standalone demo fictional storage isolated according to manifest source 387e3281. 112 screenshot/action states pass semantic colours at 320/390 light/dark. Mark current sampled routes CODED/TESTED IN BROWSER, NOT ALL-SCREEN DS2 COMPLETE; deep editor saves, populated dose confirmation, back stack, real iPhone and global final pass remain OPEN. Never infer a child screen Pass from parent Pass.


## 2026-10-27 FINAL FICTIONAL-DATA EVIDENCE
Local-only built-in Demo Mode run 40619990770 SUCCESS: 112 screenshot route/action states at 320/390 light/dark; verified 2 fictional kits, 54 check-ins and 27 doses; zero capture errors or document overflow. Semantic action-role breakdown in docs/design/DS2_BUTTON_ROLE_AUDIT.md, commit fcbf5bf3. Current review does not cover all editor paths, native file import, 300mg-versus-10mg source safety, real iPhone or full-app artifact release. Mobile CI 40619990814 SUCCESS. No production deployment/merge.


## 2026-10-27 source transaction gate pending: scripts/ds2-dose-inventory-regression.mjs (de42c0f3) and workflow change 86e09376 test canonical one-open-vial 300mg versus 10mg insufficient stock with fictional isolated records and valid 2mg control. Expected no dose record or inventory change for shortfall, exactly one save and 2mg deduction for valid case. New CI 40621540795 in progress; no PASS claim. Need expand to multi-vial source allocations, prepared doses and nested action confirmation in subsequent QA. Global polish LAST.


## 2026-10-27 — Screenshot-led Protocol and action consistency
User identified inconsistent shading on Stash Add, wizard Continue, Save reaction, dose Continue/Confirm and Protocol 'Ready for first log'. Targeted CSS fb05e322 / 5f0be242 unifies named primary gradient versus solid and redesigns Protocol first-log from small right CTA in mint-bordered row to vertically stacked neutral info section with full-width primary CTA; JS 0445f6b0 changes only label to 'Log first dose'. No math/storage modifications. Script bd6c374e adds Protocol route screenshot in fictional demo, records whether conditional first-log card exists. Latest CI pending. Physical screenshots user-supplied are pre-fix evidence; post-fix real iPhone untested.


## 2026-10-27 RENDERED PROTOCOL/REACTION ACCEPTANCE BOUNDARY: CI #40623390625 SUCCESS, 124 screenshots covering 31 route/action states at 320/390 light/dark using fictional local Demo Mode. New conditional Protocol first-log fixture actually displays the redesigned stacked card and full-width Log first dose CTA; screenshot inspected at 390 dark. New saved-dose reaction editor also opens and Save reaction computed #C6A6F2/no shadow/13px radius across all viewports/themes; screenshot inspected. Stash final Add/Save screenshot still NOT TESTED; actual human physical iPhone sign-off not obtained. Need inspect and fix raw ISO date shown in reaction subtitle in future child-page typography/content phase.


## 2026-10-27 first complete Stash wizard final CTA visual proof: fictional fields progressed to Step 3 without saving, run 40623724305 SUCCESS and screenshot evidence show 'Add to Stash' solid #C6A6F2 in 320/390 light/dark, consistent with initial Continue and kit wizard Continue. Inline Today's Continue to dose log #A78BFA source identified; CSS f238e6d2 overrides to canonical primary token. Exact current-head tests a1cf67c6 pending as of writing. Protocol first-log and Reaction editor validated in earlier 40623390625. Physical iPhone sign-off and all nested buttons incomplete.


## 2026-10-27 nested role audit found real unmatched Today chooser Continue primary #A78BFA on both viewport/theme sizes. CSS f238e6d2 insufficient because direct inline !important in 04-nexus.js; source fixed 9436f41e. New visual QA #40623977189 pending, so not visually accepted yet. Stash final Add to Stash wizard screenshot pass 40623724305 and Protocol/Reaction screenshot pass 40623390625 remain historical verified results.
