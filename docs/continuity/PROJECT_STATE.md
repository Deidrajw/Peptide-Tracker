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
