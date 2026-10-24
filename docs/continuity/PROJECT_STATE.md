# Nexus — Project State

> Living handoff. Update on every material change, including incomplete work. GitHub main is the source of truth; reverify each session. Never store private production data here.

**Documentation baseline:** 2026-10-23
**Repository:** Deidrajw/Peptide-Tracker
**Production:** https://deidrajw.github.io/Peptide-Tracker/
**Latest verified main SHA at start of this release verification:** e58e6750a2ef000384c8d1084ffe22d5467a202d
**Last merged application PR:** #18 — v0.9.1-beta Chevron Parity (source verified; deployment outcome not reverified)
**Last verified Pages run:** https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973924397
**Last conversational release label:** v0.9.0-beta
**Version metadata:** Latest main index.html declares v0.9.1-beta; GitHub Pages output still requires separate confirmation.
**Documentation setup:** PR #17 merged and established the four continuity files.

## Architecture and safeguards
- Existing root index.html, assets/css/nexus.css, and ordered assets/js/01-nexus.js through 12-nexus.js. Confirm against live main.
- Main tabs: Today, Calendar, Protocol, Stash, More; includes Check-In, supplements, symptoms, weight, nutrition, dose, schedule, history and inventory.
- Preserve real localStorage (historical key peptide-tracker-html-v1), exports, backups and all dose calculations. Do not import demo data into production.
- A stale PR #2 for modularization was previously identified; do not merge it blindly.

## Active priority — finish app-wide chevron and disclosure consistency
- PR #16 improved Symptoms, Browse All Supplements, Selected Today and compound-symptom chevrons; it was not a complete visual audit.
- Source audit in the 2026-10-23 conversation found different CSS and Unicode indicator patterns in Today, Protocol, kits/Stash, history, weight, settings, and Log Dose.
- Normalize shared stroke, geometry, direction, alignment, 44–48px touch targets and light/dark states. Verify actual rendered UI at 320px and 390px. Do not count source inspection as browser testing.
- PR #18 has merged the v0.9.1-beta shared-chevron code. Rendered/browser verification and source-identical artifacts were still outstanding at the start of this validation branch. Major new UI redesigns remain deferred until acceptance.

## Completed behaviours to preserve
- Calendar opens current local month, Month tab; compact cells keep real numeric weight and historical date details.
- Daily Check-In status and Edit near top of Today; date validation, no duplicate entry/date, edits, mood, symptoms (1–3), notes and compound associations.
- Supplements: searchable, internally scrollable, browseable multi-select in Check-In and Log Supplements; Selected Today count and date-specific history.
- Symptoms: general and compound-specific search/browse; selected symptom intensity 1–3, custom terms and historical associations.
- Log Dose: source selection, drafts, confirmation, scrollable bottom sheets, anchored actions, correct single/multi-vial deduction, insufficient inventory.

## Open bugs, risks, and other priorities
1. Prior reconstructed full-app DEMO had a missing supplement DOM-node error in paintCheckinSupp (null.innerHTML). Patch existed, but full all-modal browser verification remains unproven. Build DEMO from exact release source and keep isolated fictional fixtures.
2. v0.9.1-beta title corrected on main; verify deployed title and reconcile formal releases.
3. Light/dark contrast, emoji-based general UI icons, nested accordion borders, white gutters, excess spacing.
4. Broader Check-In, Supplements, Weight/Nutrition, Log Dose, date edge cases, inventory and history regression.
5. Documentation must be kept current with actual PRs/commits/tests; do not copy unverified claims into releases.

## Release artifact status for v0.9.1-beta (verified 2026-10-23)
- App shared-chevron implementation: MERGED through PR #18 at e58e675; browser visual acceptance NOT VERIFIED.
- Packaging verification branch: `release/nexus-v091-validation-artifacts` based on e58e675; adds corrected builder, full-app isolated DEMO, root-index LIVE ZIP and 320/390 dark/light automated QA workflow. PR/CI outcome pending.
- In-chat conceptual chevron preview: available in conversation; not release evidence.
- Standalone complete full-app DEMO: BUILD CODED; artifact and end-to-end functionality INCOMPLETE until CI validation.
- Exact-source LIVE ZIP: BUILD CODED; artifact INCOMPLETE until CI run.
- Release notes and interactive regression checklist: in progress; no untested Pass assertions.
- Pages deployment for PR #18: UNVERIFIED here. Physical iPhone tests: NOT TESTED.

## One concrete next action
Review PR #19's latest mobile/browser CI run, including Constipation browse/search selection and DEMO isolation; fix failures before merging and publishing artifacts. Verify deployment for the resulting main commit.

## Session handoff template
- Timestamp and timezone:
- Verified current main SHA:
- Open branch / PR / status:
- Code and documentation changed:
- Tests executed (device/browser, 320px/390px, themes) / failures:
- LIVE ZIP and full-app DEMO status:
- Release version, merge SHA, deployment evidence:
- Blockers and unverified assumptions:
- **One next action:**

## New issue: empty symptom options (2026-10-23)
- Real iPhone screenshot confirmed search for Constipation and Browse All returned `No matching symptoms`. Root cause discovered: `HTMLTemplateElement.textContent` was read rather than `template.content.textContent` in `wireSymptomPicker`, leaving catalog empty. Fix committed on PR #19 branch, NOT YET DEPLOYED.
- Replaced separate Search + Browse All with a single searchable combobox that opens available options on focus, supports filtering and multiple selections with intensity controls; protected recorded symptom values. Browser QA added, outcome pending.
- PR #19: https://github.com/Deidrajw/Peptide-Tracker/pull/19. Initial CI packaging succeeded but test had wrong navigation selector; corrected on branch. No confirmed pass yet.

## Post-merge verification — October 23, 2026
- GitHub main merge SHA: `5b44b1e187b37059f7e63c399c8463f6e4782745` — PR #19 merged successfully.
- Symptom combobox defect fixed in GitHub source: template.content reader now supplies available symptoms, single searchable/browseable combobox supports selection and intensity; physical iPhone retest NOT TESTED.
- Automated PR branch QA: mobile workflow run 39988223703 SUCCESS; release artifact/browser workflow run 39988223654 SUCCESS (320/390, both themes, LIVE and DEMO smoke checks).
- Build artifact: `Nexus-v0.9.1-beta-release` artifact ID 12516393327 (release run), contains LIVE ZIP, full-app standalone DEMO and manifest plus available browser evidence; artifact associated with PR SHA `9336139005c9b025afe71a25a9c05b932a346914`. Later branch changes were documentation only until merge.
- **Pages post-merge deployment: NOT VERIFIED**; available GitHub connector only exposed PR-scoped commit workflow runs. Do not claim deployed.
- Remaining tests: user iPhone combo browse/search/selection/intensity; comprehensive log/persistence/inventory functional regression beyond smoke coverage.
- **One concrete next action:** Confirm GitHub Pages workflow for merge SHA 5b44b1e, then user-test Constipation search and Browse on iPhone; address any defects before full signoff.

## v0.9.2-beta grouped symptoms (2026-10-23)
- Baseline main: a82017daad493dbbff9920ad66788ddb5c5d61de. Working release branch: release/grouped-symptom-picker-20261023.
- Approved grouped symptom combobox implemented in assets/js/04-nexus.js; recently logged, active compound-specific, general named groups, custom and other selected symptoms. Search filters across groups; expand/collapse category state, multi-select and existing intensity controls. No schema change.
- Added CSS in assets/css/nexus-disclosures.css, version changed to v0.9.2-beta. Release builder/test source updated. Full-app demo/LIVE ZIP/test results INCOMPLETE until workflow confirmed.
- Next action: validate workflow and fix failures; merge PR only after CI pass, then verify Pages deployment and iPhone testing.

### Category label and QA follow-up (2026-10-23)
- UI labels refined to Retatrutide-specific (only for an active matching compound) and PMS & Cycle (existing Cycle / Hormonal symptom items). Underlying catalog, stored names, selected intensity and associations not altered.
- Automated browser assertions added for Digestive, Energy & Sleep, PMS & Cycle headings; collapse/reopen behavior; Retatrutide-specific fictional fixture category; search and selected intensity. CI PENDING after follow-up commits.
- **One concrete next action:** Review latest PR #21 mobile and full-app DEMO/LIVE build QA logs; correct failures, verify artifact completeness, then merge only if all checks pass and confirm Pages deployment.

- Picker sections now default collapsed so category headers remain scannable in the fixed-height dropdown; searching automatically reveals matches without requiring category expansion. In-session expand/collapse choices survive picker rerenders; no stored schema change. QA pending for this latest change.

- Full-demo artifact review found fictional banner overlapping modal header and exposing Change/Exit controls. Build script now replaces banner with static fiction warning below modal z-index and offsets main content. Extra regression verifies no exit buttons. PR #21 CI must be rerun; LIVE data and source behavior unchanged.

## Verified v0.9.2-beta merge handoff — 2026-10-23
- **Application release merge:** PR #21 https://github.com/Deidrajw/Peptide-Tracker/pull/21 MERGED, verified application SHA `dea438e63dd11fce263429e6ee47f32f6df24ea2`.
- **Production source display version:** `v0.9.2-beta` confirmed from merged GitHub main index.html. GitHub Pages published run for merge SHA could **not** be independently retrieved; PAGES DEPLOYMENT UNVERIFIED, not described as deployed.
- **Features:** categorized scrollable/searchable combobox, collapsed browse headers for Digestive, Energy & Sleep, PMS & Cycle, active Retatrutide-specific and other general/compound categories; multiple selection and intensity 1–3 retained. Saved schema, localStorage and dose math unchanged.
- **CI passed on PR head `4a8a4a4929ac5fcafd8816a66a860d5af92781f6`:** mobile test https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583750, release/browser matrix https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583792. Eight LIVE/DEMO cases: 320/390px, dark/light, Check-In, category toggles, search Constipation, selected intensity, smoke navigation, demo in-memory isolation. Build artifact ID `12534692167`, includes COMPLETE full-app DEMO HTML and complete root-index LIVE ZIP from release source; physical iPhone NOT TESTED, deeper saved history/inventory math regression NOT TESTED.
- **DEMO safeguard:** fictional-only sticky/fixed banner below modal z-index, cannot Exit fictional data; no live writes/sync. The demo and LIVE ZIP are build files, not substitute for verified Pages deployment.
- **Known visual defect remaining:** light-theme Save Check-In text on yellow appears low-contrast in screenshot; broader light/dark contrast work remains. Do not treat these visual QA passes as full WCAG AA validation.
- **One concrete next action:** Verify Pages deployment to merge commit `dea438e` in GitHub Actions/Pages, then real iPhone 320/390 user acceptance of grouped Symptoms and continue light-theme contrast fixes.

## Active follow-up — v0.9.3-beta contrast and legibility (2026-10-23)
- Baseline verified GitHub `main`: `6a19a76813aced836f7f9a8dc78400f8bd6d7b22` (PR #22 documentation merge; v0.9.2 application PR #21 at `dea438e63dd11fce263429e6ee47f32f6df24ea2`).
- Branch `release/v0.9.3-contrast-legibility`; app update: new `assets/css/nexus-contrast.css`, referenced after disclosure styles, title v0.9.3-beta, build from all THREE CSS and 12 JS modules, updated mobile/browser QA.
- Scoped WCAG fixes: bright lavender button foreground no longer white (white on #C9A0FF ~2.1:1, on #A78BFA ~2.7:1); light Check-In helper labels; accessible light-focus outlines; dark text on mood-colored Check-In Save. No JS business logic, data schemas, storage keys, medical content or inventory changes.
- GitHub Pages verification of prior v0.9.2 and future v0.9.3 cannot yet be established via connector's PR-limited runs. Production LIVE ZIP and full-app DEMO from v0.9.3 **INCOMPLETE until GitHub CI and artifact review**; real iPhone NOT TESTED.
- **ONE NEXT ACTION:** Review branch/PR v0.9.3 browser QA for computed CTA contrast >=4.5:1, focus contrast, DEMO/LIVE parity; repair any failures before merge, then independently verify Pages deployment.

## v0.9.3-beta post-merge handoff — 2026-10-23 (authoritative newest status)
- Verified current `main` SHA: `f2fef99de4ea8c7cf28b9ed677054ca712bb77b4`; PR #23 https://github.com/Deidrajw/Peptide-Tracker/pull/23 MERGED. Source `index.html` reads Nexus · v0.9.3-beta.
- New `assets/css/nexus-contrast.css` fixes pale purple solid-background action label contrast, light Check-In secondary labels, keyboard focus rings, and Check-In Save ink. Grouped Symptoms, all prior features, localStorage and dose inventory logic left unchanged. No migration.
- Passing v0.9.3 LIVE/DEMO build and Playwright suite: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037977087 (PASS, branch SHA 252c5d). Eight sessions covering LIVE/DEMO, 320/390px and light/dark; computed Check-In Save/custom Add contrast, keyboard focus, symptom groups/selection, overflow, modal DOM, demo isolation. GitHub artifact ID 12538366105 contains complete LIVE ZIP, full-app self-contained isolated DEMO, manifest and screenshots.
- Mobile form regression: PASS from prior app-identical branch revision https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037868319. Latest rerun 40037977076 was still IN PROGRESS in package installation when merged; only code change between previous mobile pass and merged PR was browser QA harness. Do not claim latest mobile run passed without checking.
- GitHub Pages deployment for merge SHA: NOT VERIFIED (connector offers PR-scoped workflow lookup only; live endpoint externally inaccessible in this session). Do not call this release fully deployed. Real physical iPhone tests: NOT TESTED. Broader WCAG/functional regression: INCOMPLETE.
- **ONE NEXT ACTION:** Verify GitHub Pages publication and correct merge SHA for v0.9.3-beta through Actions, then test on real iPhone (both themes) and continue deeper contrast/a11y and saved-record regression without redesigning grouped Symptoms.

## v0.9.4-beta — active Check-In accessibility and data-protection verification (2026-10-23)
- Current verified baseline main `56f2f4b7eda2fad201c801cafad72e19229afc5e`. Prior v0.9.3 user-visible changes merged as PR #23 at `f2fef99de4ea8c7cf28b9ed677054ca712bb77b4`. Older headings above are historical, not latest state.
- Branch `release/v0.9.4-checkin-a11y-regression`; scope: Check-In mood label size and contrast, 52px targets, `aria-pressed` and `aria-label` selection state. Same 1–5 mood values, colours and persisted records.
- New `tools/validate-checkin.mjs` intended to test fictional Check-In creation, edit preserving symptom intensity and Retatrutide associations, supplement date-specific selection, and duplicate date protection for both LIVE served checkout and fully isolated full-app DEMO at 320/390px and light/dark.
- GitHub Pages v0.9.3 source deployment UNVERIFIED because live endpoint and Pages API unavailable from this runtime; GitHub merge and source code are verified, Pages not.
- Release artifacts, branch PR, CI results and physical iPhone testing: **INCOMPLETE/NOT TESTED** until independently verified.
- **One next action:** Run new branch regression CI, fix failures without changing stored-state semantics, review LIVE ZIP/full-app isolated DEMO, merge on passed checks and recheck Pages.

## v0.9.4-beta — verified merged release handoff (2026-10-23)
- GitHub main app merge SHA `cab5cd8479fbfb537151c2db070a322ca7d01587`, PR #25 MERGED: https://github.com/Deidrajw/Peptide-Tracker/pull/25. `index.html` reads v0.9.4-beta. App baseline `56f2f4b7eda2fad201c801cafad72e19229afc5e`.
- User-visible change: Daily Check-In mood labels 11px and theme-readable, 52px touch targets, `aria-label`/`aria-pressed` updated on selection. Preserves mood 1–5, symptoms, supplements, historical records, dose inventory math and localStorage; no migration.
- Branch tests on SHA `bb2797633ad174a5bdad3d42477aab6b8552f085`: release build/browser QA SUCCESS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524923; mobile form regression SUCCESS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524934. Data-integrity regression: 8 PASS combinations LIVE/DEMO x 320/390px x dark/light, with create/edit, mood aria state, symptom intensity 3, Retatrutide tag, supplements by date, duplicate-date conflict preservation; test results are in build artifact #12540338019.
- Artifacts: full-app self-contained standalone DEMO (fictional, in-memory isolated), exact-source LIVE ZIP containing root `index.html`, 3 CSS and ordered 12 JS modules, manifests/screenshots and QA evidence. Generated from PR branch source; source checked on merge main. No production data in sample files.
- Pages deployment for app merge: **INCOMPLETE / NOT VERIFIED** because the live Pages site is inaccessible via current external networking and connector returns no push Pages deployment runs. Browser run is not proof of Pages. Physical iPhone acceptance, entire-app WCAG AA and broader inventory full regression: NOT TESTED.
- **ONE CONCRETE NEXT ACTION:** Independently verify Pages deployment for merge `cab5cd8`; inspect iPhone Check-In mood labels/scroll and grouped Symptoms at 320/390 light/dark; audit duplicated search options across groups and remaining UI contrast without disturbing protected data.

## v0.9.5-beta — grouped symptom search deduplication (2026-10-23)
- Baseline verified GitHub main SHA `1af0cfddf3780b7f08524b3b1ede9e878d645bd9` (post v0.9.4 continuity PR #26); application v0.9.4 had merged as PR #25 at `cab5cd8479fbfb537151c2db070a322ca7d01587`.
- Active release branch: `release/v0.9.5-unique-symptom-search`; status CODED/CI NOT YET VERIFIED. `assets/js/04-nexus.js` now suppresses duplicate *search-result* options when a symptom appears in recent, compound-specific and general categories. Prefer stable general group, then active-compound, custom, recent and other. Example: search Constipation appears once in Digestive; browsing without a search retains all original sections and membership. Selected values, intensity 1–3, custom/recent and compound associations unchanged. No migrations or localStorage key changes.
- Added regression assertions for unique Constipation/Nausea matches and Digestive heading in LIVE and full-app fictional DEMO; retain Check-In save/edit/date-protection tests and light/dark 320/390 coverage.
- v0.9.5 source package & complete full-app DEMO builder version updated; CI, PR merge and deployment PENDING. GitHub Pages access not yet independently available: public endpoint disabled from web and DNS unavailable in container, current live version unverified. Real physical iPhone: NOT TESTED.
- **ONE NEXT ACTION:** Review v0.9.5 branch CI for 8-case parity, search dedup, Check-In protected records and mobile regression; only merge if green, publish versioned LIVE/DEMO artifacts; independently verify Pages for release commit when possible.

## v0.9.5-beta — verified merge handoff (October 23, 2026)
- Current application merge: PR #27 https://github.com/Deidrajw/Peptide-Tracker/pull/27 MERGED, SHA `4addc72b8fdbb9906170d116af3f4a8183687e11`; source `index.html` displays v0.9.5-beta. Baseline pre-release main `1af0cfddf3780b7f08524b3b1ede9e878d645bd9`.
- Implemented: shared Symptoms combobox presents one selectable row for a matching name when searching overlapping Recent, general and active-compound categories. General group preferred (Constipation -> Digestive); browse with no query retains original categories, multi-select, intensity, compound and custom terms. Records, state key, check-ins and dose inventory business logic unchanged; migration NONE.
- CI PASS on PR head `caafbb79e16d91bfe32b1f59710bfda9181ecd63`: release/build, 8 responsive dark/light LIVE/full-demo sessions, duplicate search labels, grouped browse, intensity and contrast https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902230; mobile form regression PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902171. The deep Check-In functional validation also passed 8 LIVE/DEMO cases for create/edit/date conflict/supplements/intensity/compound tags.
- Artifact #12544887723 on successful build: self-contained full-app fictional DEMO HTML (1,785,387 bytes) with in-memory isolation, complete root-index LIVE ZIP (492,737 bytes; 3 CSS and ordered 12 JS), manifest, screenshot matrix, browser and Check-In JSON evidence. Exact release source checkout, no real-data migration.
- Pages deployment for v0.9.5 merge: **UNVERIFIED / INCOMPLETE** (public web blocked and GitHub connector returned no merge-workflow deployment evidence). Actual iPhone Safari and physical accessibility: NOT TESTED; complete vial inventory/dose regression and site-wide WCAG AA: NOT TESTED.
- **ONE NEXT ACTION:** Independently confirm GitHub Pages published v0.9.5 app release commit 4addc72; conduct physical iPhone testing of categorized browse, single-result search, keyboard/modal fit, and proceed to deeper Log Dose/vial safety QA without modifying real records.

## v0.9.6-beta — Protocol UI design candidate, approval pending (2026-10-23)
- GitHub baseline verified main: `ed1db9e6f384c06d6aa882458ef41e51be69955b` (v0.9.5 application PR #27, docs PR #29). Working branch `design/v0.9.6-protocol-card-density`. Do NOT call this a production release until user approves design, CI passes, PR merges and Pages publication is verified.
- User supplied screenshots of expanded Retatrutide card showing competing winding-down and escalation notices, Log Dose ellipsis options with emoji icons, and New Protocol Step 3 Stack search with emoji magnifier. Observed inaccurate wizard counter 1/6 vs STEP 3 — STACK; source confirmed header is rendered once rather than updated by rebuildModal().
- Candidate presentation: make wizard search a real input with inline outline SVG, 44–48px results and route targets, live counter; retain all compound selection/wizard logic. Group informational phase/trough/escalation notes in optional Insights disclosure; injection-site safety warning stays visible. Use coherent outline SVG for 6 existing overflow menu options, move 'Remove from Today' into menu without changing archive handler, retain Log Dose, Intel, historical, schedule, calendar, colour, pause and collapse controls. UI CSS only, event handlers retain identifiers; no storage schema changes.
- A medically relevant limitation: existing timing and dose-escalation copy makes specific predictions (plasma timing, readiness to discuss increasing dose). This UI-only candidate preserves text in an accordion; claims require separate medical-content audit before public App Store submission. Do not silently certify clinical validity.
- Source version / DEMO builder / LIVE ZIP / browser suite updated to v0.9.6-beta; added `tools/validate-protocol-design.mjs` for 8 LIVE/DEMO × 320/390px × light/dark cases, with wizard counter, search/select/remove, card insights and context menu actions. All tests, branch artifact, PR, release status and Pages deployment are **PENDING**. Real iPhone NOT TESTED; do not merge major layout redesign without approved preview.
- **One next action:** Run v0.9.6 PR CI and inspect 8 screenshots, fix any design or regression failures, supply user an interactive preview and exact-source candidate full-app DEMO/LIVE ZIP, collect approval before merging/deploying.

### v0.9.6 design candidate — verified PR CI, user approval still required (2026-10-23)
- PR #31 OPEN: https://github.com/Deidrajw/Peptide-Tracker/pull/31 ; head `edb9d9c4d5b3095992556a6ad62c4ad917885b7a` at time of test. GitHub Actions uses a synthetic PR merge checkout `1b0dd618f8e0d51905623bf5535dbaa4345283be` (merge of PR head into `ed1db9e`); the source-identical LIVE ZIP and DEMO are from that tested PR merge tree, not a production Pages deployment.
- Build and full browser suites PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056553001; mobile form regression PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056552959. Artifact ID `12545936209` includes `Nexus_v0.9.6-beta_FULL_DEMO.html`, root-index LIVE ZIP (16 source files), 8 responsive LIVE/DEMO protocol-design screenshot cases, 8 Check-In persistence cases, and manifest/JSON.
- Automated assertions: new wizard 1/6→3/6 and Stack, outline SVG magnifier/search, select/remove GHK-Cu, Retatrutide Insights collapsed by default and expandable with original timing copy, functional ellipsis with six preserved actions, ARIA state, no horizontal overflow. All passes are automated, not physical iPhone testing.
- 390px screenshot review: inline ellipsis menu extends below initial viewport and pushes later content. Proposed follow-up: native-feeling bottom action sheet instead of inline menu, subject to user approval; do not falsely call menu a bottom sheet or complete a full visual audit.
- **Approval/merge: PENDING, no production deployment.** Main stays v0.9.5-beta unless a separate verified merge occurs. Physical Safari/iPhone not tested. Medical timing/escalation copy not clinically validated; defer to medical compliance review.
- **ONE NEXT ACTION:** Ask user to approve the compact Insights hierarchy and decide whether ellipsis should become a true bottom action sheet. Only then refine candidate, re-run CI, merge and verify Pages when accessible.

### v0.9.6 candidate — final narrow-screen QA evidence (2026-10-23)
- Improved 320px title and ring/Last/Next alignment based on screenshot review; normalized Winding Down badge without redundant emoji. Added browser assertion that the Retatrutide title does not ellipsize and 70px countdown does not force date summary to next row at 320px.
- Latest successful LIVE/full DEMO release/browser CI **PASS**: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857750 on application head `da0c38d598f285a8305456194d7fa0e71bd79355`; mobile forms **PASS**: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857769. Source packaging artifact `12545847021`, download bundle `Nexus_v0.9.6-beta_DESIGN_REVIEW_APPROVAL_PENDING.zip` contains complete isolated full-app DEMO, root-level LIVE ZIP with 16 files, 8 UI test cases, 8 functional Check-In tests, screenshot evidence. Source from PR merge checkout (not published).
- Screenshot evidence 320px light now shows full Retatrutide title and side-by-side ring + last/next dates; inline ellipsis still flows below viewport. **Recommend real iPhone bottom action sheet as next approved iteration**, rather than deploying current inline submenu as final UX. Do NOT merge until user explicitly approves new design. Production main remains v0.9.5 unless independently verified otherwise.
- **ONE NEXT ACTION:** Ask user to approve compact Insights and bottom-sheet ellipsis direction; if approved, implement bottom sheet safely with keyboard, scrim, focus, deep link/action preservation and tests, then merge after updated CI and confirm Pages.

### v0.9.6 design demo delivery repair — attachment browser compatibility (2026-10-23)
- User reported standalone full-app DEMO not loading from ChatGPT's file link. Verified earlier downloadable HTML exists and its SHA-256 exactly matches the isolated standalone artifact from passing GitHub browser QA; therefore no confirmed application startup defect, and the in-chat HTML renderer/file preview is a suspected compatibility blocker (not proven).
- Supplied an additional **ZIP with index.html** (identical complete fictional app) plus README with download/extract/open-in-Safari-or-Chrome instructions. This is a separate preview package, not the LIVE deploy ZIP. New candidate builder generates `Nexus_v0.9.6-beta_OFFLINE_FULL_DEMO_OPEN_ME.zip`; CI verifies that its index.html byte-for-byte matches the standalone complete DEMO and that no live data is used. This is a delivery workaround; a hosted HTTPS preview is not established.
- PR #31 remains OPEN and NOT APPROVED/NOT MERGED; production source remains v0.9.5-beta until independently reverified. New artifact packaging CI outcome PENDING at time of documentation entry. **Next action:** confirm new ZIP and parity CI pass, deliver user the zipped demo, get confirmation it opens in the user's browser, then collect UI approval before merging any redesigned application code.

### v0.9.6 offline-demo packaging — CI verified (2026-10-23)
- Fix artifact validated on design PR #31 (unmerged). CI `40057610410` **PASS** for source/ZIP parity, 320/390 light/dark LIVE and isolated DEMO, Check-In and Protocol design tests. Existing mobile forms `40057610653` **PASS**. Artifact `12545973188` includes byte-identical standalone complete HTML plus `Nexus_v0.9.6-beta_OFFLINE_FULL_DEMO_OPEN_ME.zip` containing root `index.html` and `README_OPEN_FIRST.txt`.
- Download ZIP archive integrity verified: no damaged entries, zipped `index.html` bytes match separately included standalone HTML and prior QA-passed demo. Reproducibility fix is in `tools/build-release.mjs`; GitHub workflow asserts parity. File-attachment viewer limitation remains probable but not proven as user's precise cause; user device/browser load **UNVERIFIED** until user opens extracted HTML and reports outcome.
- **NEXT ACTION:** Confirm user's browser opens extracted `index.html`. Gather approval/feedback for candidate Protocol design and true bottom-sheet More menu; keep PR #31 unmerged until approved. GitHub Pages and real iPhone status unchanged (not verified/tested).

## v0.9.6 — approved iPhone compound bottom sheet and separate clinical-content audit (2026-10-23)
- User explicitly approved converting the overflow ellipsis from an inline expanding menu to a polished bottom action sheet, and separately reviewing timing/escalation wording before public App Store release. This approval applies to the interaction direction, NOT to clinical wording changes or final App Store compliance.
- Work in ongoing PR #31 `design/v0.9.6-protocol-card-density`; baseline production `ed1db9e6f384c06d6aa882458ef41e51be69955b` (v0.9.5-beta). `assets/js/12-nexus.js` now portals the original `.morebox` actions into an accessible modal bottom sheet with backdrop, safe-area, scroll lock, focus trap, keyboard Esc/Tab, close button, swipe-down header and appropriate return of DOM, focus, body scrolling and aria-expanded; existing handlers/classes preserved. `assets/css/nexus-contrast.css` styles the sheet; separate Playwright tests in `tools/validate-protocol-design.mjs` verify layout, Escape, backdrop, history and schedule behaviour at 320/390 × light/dark × LIVE/DEMO. **CI PENDING**, no claim of pass.
- Wording researched as separate file `docs/ios/MEDICAL_CONTENT_AUDIT.md`: current app asserts measured/precise plasma phase and readiness to increase from weeks alone, unsupported for individual decision-making; retatrutide remains investigational (Lilly Sep 2026). Apple §1.4.2 specifically addresses drug dosage calculators. Suggested neutral labels/alternatives documented only; clinical text/code has NOT been changed in this UI branch. Full medical accuracy/regulatory signoff NOT COMPLETE.
- No saved-state/schema, reconstitution or dose-calculator, original action handler, inventory calculation modifications in sheet update. Prior DEMO file direct-open issue addressed via full standalone HTML and byte-identical offline ZIP packaging. Release builder/CI artifacts and Pages publication PENDING latest checks.
- **ONE NEXT ACTION:** Run the PR #31 new bottom-sheet browser test matrix, repair issues and check full app DEMO/LIVE; after green CI, merge UI update as approved, verify main SHA and Pages if possible, update four continuity docs; keep medical wording audit as separate unapproved action.

## v0.9.6-beta — merged bottom-sheet UI and separate App Store content audit (2026-10-23)
- **VERIFIED APP MAIN merge SHA:** `ddd38eeb7b78cda3e3cc63c5f57a13ef665143e0` for PR #31 `https://github.com/Deidrajw/Peptide-Tracker/pull/31`. Verified `main/index.html` says `Nexus · v0.9.6-beta`. Baseline was `ed1db9e6f384c06d6aa882458ef41e51be69955b` (v0.9.5). User explicitly approved bottom action sheet direction.
- Shipped UI scope: Retatrutide/compound card Insights groups informational timing/escalation messages, leaves injection-site rotation safety visible, cleaner 320px countdown/title, New Protocol Step 3 outline compound search with better touch targets and correct 3/6 header counter, SVG contextual icons. Compound ellipsis moves SAME six controls to a fixed modal iPhone bottom sheet with scrim, handle, name, safe-area padding, Escape/Tab trap, backdrop/close/swipe dismissal and scroll/focus restoration. Existing `.morebox` child controls and handlers retained; no change to stored records, dose or stash/vial calculations, storage key or migration.
- **APP-SOURCE CI PASS:** PR head `80bd01b878f60ddacb8e129178d53be6060cab0d` workflow `https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40059005979` (8 LIVE/standalone full DEMO × 320/390 × light/dark browser/check-in/protocol/sheet tests, sheet screenshots) and mobile regression `https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40059005978` PASS. GitHub artifact **12546861220**: `Nexus_v0.9.6-beta_FULL_DEMO.html` (~1.8MB complete isolated app), independent `Nexus_v0.9.6-beta_OFFLINE_FULL_DEMO_OPEN_ME.zip` containing byte-identical root `index.html` plus README, LIVE ZIP (~498kB) with root index, 3 CSS and all ordered 12 JS, manifests/JSON + screenshot matrix. Full LIVE/DEMO byte parity and ZIP CRC validated.
- Separate research findings, NOT clinical approved and NOT altered in runtime: `docs/ios/MEDICAL_CONTENT_AUDIT.md` documents unmeasured plasma phase statements, escalation based on weeks alone, blanket injection-site reassurance and Apple §1.4.2 drug dosage calculator App Store eligibility concern. Retatrutide investigational according to Lilly (Sep 2026). Do not claim renaming/neutral copy resolves calculator compliance. App Store submission **BLOCKED pending review**.
- **GitHub Pages production deployment after merged app SHA NOT VERIFIED**: Pages public endpoint disabled from available web access and connector workflow lookup does not include Pages push status. GitHub merged source verified; actual Pages version unknown. Actual iPhone physical test NOT TESTED, long-term menu/backup/vial math not comprehensively tested.
- **ONE NEXT ACTION:** Independently verify GitHub Pages shows `v0.9.6-beta` for app merge `ddd38ee`; then perform physical iPhone bottom sheet/keyboard/colour/long content checks. Separately seek clinical/legal/App Store review of medical-content audit while preserving calculators and storage.

## v0.9.6 Pages and inventory assurance — active QA-only branch (2026-10-23)
- Verified GitHub `main` at `25ca6e7dce74f2c6e8de94a8b0200df33a37880a`: `index.html` remains v0.9.6-beta, app merge PR #31 `ddd38ee`, docs merge PR #32. Public Pages URL `https://deidrajw.github.io/Peptide-Tracker/` could not be fetched in the current assistant environment (disabled); a GitHub merged commit or app title alone is not deployment proof.
- Active branch `qa/v096-pages-inventory-assurance`. New `tools/verify-pages.py` compares the served root HTML, all THREE CSS and ordered 12 JS *byte-for-byte* against checkout source (source file count 16) with cache-busting requests, 26 retries over publication delay and JSON evidence. New GitHub workflow `.github/workflows/nexus-pages-integrity.yml` triggers automatically on main pushes and manual dispatch, emitting attested parity or a failing, clearly UNVERIFIED run. PR CI runs an explicitly LOCAL smoke test only and does NOT claim live publication.
- New `tools/validate-vial-safety.mjs` tests isolated synthetic v2 kit/vial stock: sealed vials must not count as drawable, single-vial deduction/undo, original-vial edit/delete reversal, insufficient multi-kit stock, exact explicit multi-vial split and undo, prepared syringe deletion returns unused share only, mcg/mg conversions. Runs both served LIVE checkout and isolated full-app DEMO, 320/390px light/dark. This protects pure inventory bookkeeping functions and is NOT a full physical iPhone Log Dose transaction test.
- No app UI/business logic, source version, localStorage key, production records or release schemas modified. v0.9.6 DEMO HTML + LIVE ZIP still generated exactly as before, with new JSON QA evidence. Physical iPhone remains NOT TESTED; medical content and App Store compliance still INCOMPLETE. **PR/CI outcome pending**.
- **ONE NEXT ACTION:** Verify both regression workflows pass for QA branch, merge QA/Pages workflow, then inspect GitHub Actions Pages parity result for resulting main commit. If production fails parity, diagnose Pages branch/settings before claiming deployment. Continue actual device acceptance separately.

## v0.9.6 — Pages assurance code merged; independent remote confirmation pending (2026-10-23)
- QA-only PR #33 MERGED at `89d5066251eaf49462e3128a17cf62fb3bc4bf32`; no app code or version changed (v0.9.6-beta). PR branch `82e9c3fbf206f98ecdbad3cd2abd2a43d8a52ad4`: CI PASS `40060006633` (LIVE/DEMO release + 8× six synthetic vial safety assertions + existing browser/Check-In) and mobile PASS `40060006632`. GitHub artifact #12547102223 includes complete isolated DEMO HTML, extractable demo ZIP, LIVE ZIP, JSON results. Local source-integrity self-test PASS but correctly labelled smoke-only.
- New `main` push GitHub Pages integrity workflow introduced by PR #33, comparing published `index.html`, 3 CSS and 12 JS against merged source by SHA-256 and bytes; however connected workflow lookup only exposes PR-triggered runs and cannot independently fetch the push result here. Site could not be fetched with assistant public web tool (disabled). Thus **Pages remains UNVERIFIED**.
- Follow-up branch `ops/v096-pages-evidence-handoff` adds a nonblocking live Pages fetch to PR CI (actual public HTTP, NOT smoke) that uploads JSON even on failure, so evidence is observable through supported PR workflow tools. Production data and calculations unchanged. **Remote CI pending at time of entry.**
- **ONE NEXT ACTION:** Inspect the PR workflow artifact `Nexus_PAGES_REMOTE_CHECK_PR.json` for all 16 files matching; update deployment status accurately, merge documentation/ops change if CI green and verify latest main. Physical iPhone colour picker and modal bottom-sheet acceptance still NOT TESTED, medical audit remains unapproved.

## v0.9.6 — LIVE Pages verified by independent byte-parity (2026-10-23)
- **PAGES VERIFIED at check time:** GitHub Actions PR workflow `40060285190`, source head `a62418714650a74033691b5f6e71c0a2d1b843c6`, artifact `12546599640` → `Nexus_PAGES_REMOTE_CHECK_PR.json`: `smoke_only:false`, `verified:true`, first remote HTTPS attempt success, **16/16** exact-byte matches of `https://deidrajw.github.io/Peptide-Tracker/` against v0.9.6 `index.html` + three CSS + ordered 12 JS. These application files are identical to GitHub main `89d5066251eaf49462e3128a17cf62fb3bc4bf32` after app merge `ddd38eeb7b78cda3e3cc63c5f57a13ef665143e0`. This verifies publicly served application code parity, not any unpublished GitHub docs changes or every device cache.
- Latest visible project work: QA-only PR #33 merged `89d5066`, inventory core PASS 48 checks and prior UI/browser/Check-In regressions PASS. Ops PR #34 adds PR-observable Pages check. No Nexus app UI, inventory code, production storage, calculators, dosage guidance or version changed. Verified deployment refers to v0.9.6 application files. User's physical iPhone Safari and local cached install still NOT TESTED.
- **ONE NEXT ACTION:** Complete PR #34 docs/ops-only merge after latest CI, then perform actual iPhone Safari/standalone bottom-sheet, native colour picker and Log Dose full-form regression with user-reported results. Keep separate App Store medical content and drug calculator review gated.

## v0.9.6 — Log Dose user-flow QA (2026-10-24)
- Verified main baseline `df5b1ab4a6924a4594422b22077930aa178d4d42`, v0.9.6-beta; PR #34 merged, public GitHub Pages 16/16 file parity previously verified on run `40060285190`. No new mobile/iPhone test yet.
- Active release/QA branch `qa/v096-logdose-full-flow-20261024`, new `tools/validate-logdose-ui.mjs` browser tests the **real modal** (not only core math) on LIVE and complete isolated fictional DEMO, dark/light, 320/390px. Coverage: single-source save and edit without duplicate record, exact original-vial reapplication; insufficient total open stock must NOT silently save partial dose or mutate inventory; manual second open-vial allocation creates one dose with two named vial sources; prepared-source dose decrements prepared count without a second vial deduction; New Vial handoff retains entered dose/notes as in-progress draft and avoids deductions before confirmation.
- Code inspection flagged a **suspected** under-allocation path: the Log Dose Confirm handler checks `allocationOverdrawsDose` but lacks corresponding guard for under-allocation. Must be confirmed by browser failure before modifying production code. Never infer test pass from source inspection.
- No saved real user data, schema, localStorage key or calculations changed while adding test. CI and PR pending. Full source-aligned standalone DEMO, extractable fictional-demo ZIP and LIVE root-index ZIP continue from existing v0.9.6 builder; no App Store content claim.
- **ONE NEXT ACTION:** Run full 8-case Log Dose browser regression; if it exposes actual unsafe partial confirmation, make smallest guarded save fix and rerun full mobile/Check-In/vial/Protocol tests, then merge and verify Pages before marking release complete. Physical iPhone actual test remains NOT TESTED.

### v0.9.7-beta — Log Dose under-allocation defect reproduced and guarded (2026-10-24)
- GitHub Actions run `40060961550` on initial PR #35 branch **FAILED intentionally on actual regression**: `UNDERALLOCATED_FORM_SAVED_PARTIAL_DOSE: 7 mg recorded despite only 6.5 mg open`. This followed PASS of prior 8-case browser UI, Check-In, Protocol and 48 synthetic vial source tests. Existing mobile-form regression `40060961592` PASS. This is a verified real `doseModal` confirmation defect, not an inference.
- Minimal code fix in `assets/js/05-nexus.js` blocks saving when a multi-source allocation totals less than entered dose, before modifying any source vial or creating a history record; displays explanatory correction warning. Also refuses empty, zero, negative or nonfinite dose amounts before preparing, inventory and history changes. No migration, changes to canonical vial math, history schema or localStorage key.
- Bump display/versioned builder and all QA paths to `v0.9.7-beta` for exact-source LIVE ZIP + isolated entire-app DEMO HTML + offline browser-openable DEMO ZIP. Actual full UI regression now covers original-vial edit reapply, multi-vial selection and confirmation, under/invalid reject, prepared source no-double-count and draft handoff. **New CI PENDING**. Must not merge or claim live deployment until all tests pass.
- **ONE NEXT ACTION:** Run updated PR #35 v0.9.7 build/Check-In/Protocol/Log Dose/vial/mobile suites; resolve test issues and confirm real safety guard, download and check full release packages, merge and verify public 16-file Pages parity; physical iPhone acceptance and App Store clinical audit remain distinct NOT TESTED gates.
