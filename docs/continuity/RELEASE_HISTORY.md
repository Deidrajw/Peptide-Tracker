# Nexus — Release History

> Append-only history. Chat version labels may not correspond to GitHub releases. Verify PRs, SHA and Pages workflow before asserting deployed. Never rewrite earlier entries to hide errors.

| PR / release | User-visible changes | Evidence/status known at 2026-10-23 handoff |
|---|---|---|
| #7 | Calendar current local month, Month tab fresh default | Historically merged; inspect PR for further detail |
| #8 | Compact Calendar cells retain saved numeric weight and date details | Historically merged |
| #9 | Check-In date validation and duplicate-date prevention | Historically merged |
| #10 | Supplement date safety, deduplication, deletion confirmation and history protection | Historically merged |
| #11 | Search-first supplement selector | Historically merged |
| #12 | Today Check-In status with top-level Edit | Historically merged |
| #13 | Scrollable searchable browseable multi-select Supplements in both entry points | Historically merged |
| #14 | Selected Today count and supplement UI hierarchy; initial contrast changes | Historically merged, NOT a complete accessibility audit |
| #15 / v0.8.9-beta | Searchable Symptoms, general/compound groups and intensity 1–3 | Reported merged and deployed in previous handoff |
| #16 / v0.9.0-beta | Targeted chevrons in Symptoms and Supplements | Verified merged at a4dcad6f9d8c1a8599945af5fcefcbbc66b07107; Pages https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973924397 and mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973926348 |
| v0.9.1-beta | Proposed application-wide disclosure consistency, demo/source parity and metadata reconciliation | PROPOSED — NOT IMPLEMENTED OR DEPLOYED |

## Documentation bootstrap — 2026-10-23
- Creates docs/continuity/PROJECT_STATE.md, DECISIONS.md, RELEASE_HISTORY.md and REGRESSION.md in a documentation-only branch.
- **No application source changes; no data migration; not an app version or deployment.** Verify PR, merge and eventual current main SHA separately.

## Release entry template (append below)
### vX.Y.Z — PROPOSED / CODED / TESTED / MERGED / DEPLOYED
- Date and version metadata:
- Baseline SHA → merged release SHA:
- Branch / PR:
- Features/fixes and affected screens:
- Data impact and migrations (including none):
- LIVE ZIP / complete DEMO parity and paths:
- Automated/browser tests, 320px/390px dark/light, device testing (only if done):
- GitHub Pages workflow and resulting SHA:
- Known limitations and outstanding regressions:

### v0.9.1-beta — IMPLEMENTED / MERGED, release artifacts under verification (2026-10-23)
- Application baseline: PR #18 merge e58e6750a2ef000384c8d1084ffe22d5467a202d; index displays v0.9.1-beta.
- Changes: shared CSS disclosure geometry; targeted glyph cleanup in Check-In, Symptoms, history and Stash; version title correction.
- Screens: Today, Protocol, Check-In, Supplements, Stash/inventory and expandable history/trends.
- Data impact/migrations: none intended; no storage key changes.
- Packaging remediation in separate branch `release/nexus-v091-validation-artifacts`: standalone self-contained fictional-data full-app DEMO, source-identical LIVE ZIP and responsive/browser matrix. Artifacts currently INCOMPLETE pending CI.
- Actual iPhone visual acceptance: NOT TESTED; deployment for this SHA NOT VERIFIED here.

### PR #19 symptom combobox remediation — CODED, NOT DEPLOYED
- Fixed empty catalog via template.content; unified search/browse into one scrollable combobox; current symptom logging values/intensity untouched.
- Scoped CSS; extended 320px/390px light/dark browser checks for option display and Constipation selection. Data impact: none intended.
- Remains open pending CI; physical iPhone and production deployment not verified.

### v0.9.1-beta follow-up — PR #19 MERGED, Pages UNVERIFIED (2026-10-23)
- Merge: `5b44b1e187b37059f7e63c399c8463f6e4782745` from PR #19.
- Bug fix: Daily Check-In symptom catalog empty because template.textContent did not read the stored choices; use template.content.textContent. Replaced separate search/Browse button with a single searchable combobox; existing symptom intensity and saved records unchanged.
- Build: corrected isolated whole-app fictional DEMO compiler; LIVE root-index ZIP generated from matching source; GitHub Actions artifact 12516393327.
- Automated checks: release + browser workflow 39988223654 SUCCESS, mobile form regression 39988223703 SUCCESS; run belongs to PR branch SHA 9336139. No physical iPhone retest yet.
- No planned production data migrations.
- GitHub Pages for merge commit: UNVERIFIED. Do not mark deployed solely from merge.

### v0.9.2-beta — CODED, PR/TEST/DEPLOY pending
- Baseline main a82017daad493dbbff9920ad66788ddb5c5d61de. Branch release/grouped-symptom-picker-20261023.
- Compact grouped selector returns recent, compound-specific, general and custom category headings within combobox. Search, multi-select, intensity and historical records retained; avoids deep nested card borders.
- Affected: Daily Check-In symptom selector and shared picker. Data impact: none intended. Test/live artifact and deployment: not yet verified.

### v0.9.2-beta — grouped symptom category follow-up (PR #21, PENDING FINAL CI)
- User-facing organization: searchable grouped combobox with Digestive, Energy & Sleep, PMS & Cycle, active compound-specific (e.g. Retatrutide-specific), Recently logged and Custom sections.
- Expand/collapse categories for browsing; search across groups; multi-select and intensity 1–3 unchanged. No data schema/storage migration.
- Responsive 320/390 light/dark and full-app LIVE/DEMO checks strengthened; actual CI outcome and Pages deployment require independent verification.

### v0.9.2-beta — PR #21 MERGED, Pages UNVERIFIED (2026-10-23)
- Merge SHA `dea438e63dd11fce263429e6ee47f32f6df24ea2`; baseline `a82017daad493dbbff9920ad66788ddb5c5d61de`.
- Sections in Symptoms combobox: Digestive, Appetite & Food, Energy & Sleep, PMS & Cycle, Mood & Mind, Physical, Injection Site/Reaction, Red Flag, custom, recent and dynamically active compound-specific (e.g. Retatrutide-specific). Default collapsed browse for scannability; search reveals matches across categories; selected symptoms/intensity persist according to existing app state.
- Data impact: presentation and selector changes only; no migrations, real data overwrite, dose math or inventory mutations intended.
- Browser QA https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583792 SUCCESS, 8 LIVE/DEMO width/theme combinations, DOM, search, category toggle, selection, demo isolation, screenshots; mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583750 SUCCESS. Artifacts on workflow run, ID 12534692167, valid full-app HTML and root-level LIVE ZIP.
- Limitations: physical iPhone untested, full edit/persistence/vial maths suite untested, Pages deployment SHA unverified, known light-mode Save Check-In contrast concern. Delivery status MERGED; deployment INCOMPLETE verification.

### v0.9.3-beta — CODED / QA PENDING (October 23, 2026)
- Baseline main `6a19a76813aced836f7f9a8dc78400f8bd6d7b22`, branch `release/v0.9.3-contrast-legibility`.
- Affected screens: Daily Check-In, custom symptom input, relevant purple action buttons elsewhere, keyboard focus on disclosures, light-mode secondary helper text. Added `assets/css/nexus-contrast.css` and linked it after the existing CSS; version/title + exact-source release packaging + browser contrast QA updated.
- Color audit: white on #C9A0FF = ~2.1:1, white on #A78BFA = ~2.7:1; dark #1A1728 on those colors ~8.3:1 and ~6.45:1. Computed browser tests required prior to PASS claim.
- No migrations or modification to saved localStorage, check-ins, supplements, dose math, inventory. QA, full-app DEMO, LIVE ZIP, PR, Pages and physical iPhone statuses remain INCOMPLETE/NOT TESTED until verified evidence.

### v0.9.3-beta — MERGED, production deployment unverified (2026-10-23)
- Baseline `6a19a76813aced836f7f9a8dc78400f8bd6d7b22` → merged `f2fef99de4ea8c7cf28b9ed677054ca712bb77b4` (PR #23).
- Screens: Daily Check-In, custom symptom Add, solid lavender action buttons, helper text/focus-visible in selectors and disclosures. Added CSS `assets/css/nexus-contrast.css`; index displays v0.9.3-beta. No data model, migrations, localStorage, user saved history or vial-math edits.
- Automated LIVE/full standalone DEMO browser validation PASS: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037977087, 8 combinations 320/390px dark/light; WCAG normal text contrast on tested Check-In/custom buttons; keyboard focus. Complete root-index LIVE ZIP/full-app isolated DEMO generated same release checkout, GitHub artifact 12538366105.
- Existing mobile form regression PASS on same application source earlier branch SHA: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037868319. Later mobile rerun 40037977076 pending at last check (final change only browser QA test script).
- Limitations: no actual iPhone tests, no complete history/dose/inventory full regression, no site-wide WCAG certification. Pages publication for merge SHA NOT VERIFIED; delivery status CODED/TESTED/MERGED, deployment INCOMPLETE.

### v0.9.4-beta — IMPLEMENTED ON BRANCH / VALIDATION PENDING (2026-10-23)
- Baseline `56f2f4b7eda2fad201c801cafad72e19229afc5e`; branch `release/v0.9.4-checkin-a11y-regression`.
- Change: Check-In Mood 1–5 now exposes `aria-label`/`aria-pressed`, with readable >=11px text and 52px button targets. Release metadata/build/test set to v0.9.4.
- New `tools/validate-checkin.mjs` asserts fictional create/edit/notes/intensity/compound tag, date-specific supplements, date collision safety across both builds, dark/light and 320/390px. This is a new regression suite, NOT yet proven passed.
- Affected page: Daily Check-In modal only, plus testing/build. Data impact: no model key changes, no migration, no production writes.
- Mandatory DEMO HTML and source-identical LIVE ZIP: builder updated but files INCOMPLETE until CI. GitHub PR, merge, Pages deployment, real iPhone signoff and full-app deep regression: PENDING.

### v0.9.4-beta — IMPLEMENTED / AUTOMATED TESTED / MERGED (2026-10-23)
- GitHub app PR #25 merged `cab5cd8479fbfb537151c2db070a322ca7d01587` from baseline `56f2f4b7eda2fad201c801cafad72e19229afc5e`; title declares v0.9.4-beta.
- UI: Daily Check-In mood options have 11px theme-visible text, >=52px target, ARIA selected feedback. No change to mood numeric values, date semantics, existing supplement/symptom data and vial math; migration none.
- Full-app source-aligned DEMO and root-index LIVE ZIP in GitHub Actions artifact #12540338019; archived standalone HTML 1,784,233 bytes, LIVE ZIP 492,353 bytes, ZIP includes 3 CSS + 12 ordered JS. DEMO in-memory fixture isolation confirmed.
- Branch CI success: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524923 (8 display and 8 Check-In functional test matrices) and https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524934 (mobile forms). Tested synthetic Check-In create/edit, Retatrutide association, intensity, dated supplements, conflicting date protection; actual production records not touched.
- Limitations: Pages deployment for this merge SHA not independently verified; physical iPhone real tests NOT TESTED; whole-app WCAG and vial-dose deep functional tests NOT TESTED. Release status MERGED, deployment INCOMPLETE.

### v0.9.5-beta — PROPOSED/CODED, validation pending (2026-10-23)
- Base `1af0cfddf3780b7f08524b3b1ede9e878d645bd9`, branch `release/v0.9.5-unique-symptom-search`.
- Affects the shared Symptoms combobox: search dedupes names across overlapping Recent, Retatrutide-specific and Digestive/general categories and keeps each match under the general category when one exists. Browse with no query remains unchanged; selection values, history, intensity 1–3 and compound tags unchanged. No data migration.
- Source-aligned complete standalone fictional-data DEMO HTML and root-index LIVE ZIP builder versions updated; browser test asserts Constipation/Nausea exactly one visible option, with Constipation classified Digestive, while all prior Save/Edit safety and main-tab regressions remain. Actual tests, CI artifacts, merge and Pages deployment INCOMPLETE pending evidence. Real iPhone untested.

### v0.9.5-beta — MERGED, Pages UNVERIFIED (2026-10-23)
- Baseline `1af0cfddf3780b7f08524b3b1ede9e878d645bd9`, app PR #27 merged at `4addc72b8fdbb9906170d116af3f4a8183687e11`.
- Screen: shared Symptoms combobox under Check-In and other usage contexts. Query displays each symptom name once, placing Constipation under Digestive instead of repeating in active Retatrutide/recent; the initial category browse remains unchanged. Saved selection, intensity 1–3, associations, custom terms and medical logs untouched. Data migration: none.
- Branch CI: source and standalone DEMO/full root-index LIVE ZIP PASS, 8 width/theme/kind visual and search DOM checks, 8 deep Check-In data-integrity checks: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902230; existing mobile regression PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902171. Artifact #12544887723 contains both release files, manifests, JSON results and screenshots.
- GitHub Pages publication for this merge SHA: UNVERIFIED/INCOMPLETE. Real iPhone Safari, site-wide WCAG, complete Log Dose stock math: NOT TESTED. No claim of fully deployed release.

### v0.9.6-beta Protocol UI candidate — PROPOSED / BRANCH CODED, NOT RELEASED (2026-10-23)
- Baseline `ed1db9e6f384c06d6aa882458ef41e51be69955b`; candidate branch `design/v0.9.6-protocol-card-density`.
- New Protocol stack selection: outline search SVG replaces emoji, compact accessible search field, enlarged compound list rows/route targets, wizard header step counter now advances. Expanded compound cards: informational insights compact accordion, meaningful injection-site warning still visible, secondary menu actions use outline SVG and include Remove from Today; retained existing handlers and collapse/Log Dose.
- Affected: Today compound card, Protocol builder Stack step, associated menu and alert disclosures. No clinical or inventory data change/migration; medical guidance copy preserved but not medically audited. Automated responsiveness and functional design checks added; TEST RESULTS PENDING. Exact-source standalone full-app DEMO, LIVE ZIP, PR approval, merge and Pages publication INCOMPLETE pending reviews.

### v0.9.6-beta candidate — BRANCH TESTED / APPROVAL PENDING (2026-10-23)
- PR #31 https://github.com/Deidrajw/Peptide-Tracker/pull/31; app main remains v0.9.5-beta. Branch implementation of outline Protocol wizard compound search, corrected step counter, larger targets, condensed informational Insights, and menu outline icons + Remove from Today under ellipsis; existing action handlers retained. No migration.
- Full PR-source test merge build v0.9.6 at synthetic checkout `1b0dd618f8e0d51905623bf5535dbaa4345283be` from PR head `edb9d9c`: browser/build workflow 40056553001 PASS, mobile regression 40056552959 PASS, artifact #12545936209 with self-contained demo, complete LIVE ZIP, 8 protocol UI screenshots, full Check-In QA and manifests.
- Observed limitation: opening inline more menu pushes choices beneath viewport; a true bottom sheet is proposed for further approval. No release merge, no verified Pages deployment, no physical iPhone QA; medical content not audited. Status is TESTED DESIGN CANDIDATE, NOT LIVE.

### v0.9.6-beta candidate final responsive QA — PASS on design branch, NOT MERGED (2026-10-23)
- Final narrow-screen refinements to avoid Retatrutide title ellipsis, preserve horizontal ring+date summary at 320px and remove redundant emoji in status badge. No data/logic changes or migrations.
- CI https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857750 PASS (build/live standalone full-app demo, 8 legacy visual, 8 functional Check-In and 8 Protocol candidate DOM workflows); mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857769 PASS. Artifact ID `12545847021` has versioned HTML and ZIP (16 app source files), screenshots, manifests, JSON QA.
- Approval and release remain **INCOMPLETE**: PR #31 OPEN; no main merge, no new Pages deployment, physical iPhone not tested. Card menu inline is an interim design, proposed upgrade to bottom action sheet requires approval and retesting.

### v0.9.6-beta design preview packaging follow-up — CODED, QA PENDING (2026-10-23)
- User reported browser opening problem with direct standalone full-app DEMO attachment. Existing 1,794,663-byte standalone complete HTML matched previously QA-passed GitHub release artifact. Added a second deliverable: extractable offline ZIP containing the same exact full-app isolated HTML as root `index.html` and a README. No app logic or production schema changes; PR #31 unmerged, deployment incomplete.
- Browser and build/archive parity CI rerun pending. Preview does not require a user to rename or overwrite live `index.html`: extracted file is separate and should not be uploaded over the live app.

### v0.9.6 design candidate — offline DEMO ZIP packaging verified (2026-10-23)
- Still unmerged PR #31; no production changes. Source builder now emits both standalone full-app HTML and a separate ZIP containing **the exact same HTML** as root `index.html` with opening instructions, in addition to the complete independent LIVE ZIP. Designed for users whose chat attachment viewer cannot execute JavaScript.
- Verified GitHub Actions run `40057610410` PASS (artifact `12545973188`, exact-byte ZIP parity, full UI + Check-In matrix), mobile forms `40057610653` PASS. User local browser opening is NOT TESTED; this is a reviewed candidate delivery artifact, not a deployed public preview.

### v0.9.6 bottom action sheet — CODED, awaiting CI/merge evidence (2026-10-23)
- Approved user interaction change to replace overflow inline menu with fixed iPhone bottom sheet and scrim, role dialog, focus trap, Escape/dismiss, swipe header, safe-area and scroll lock; History, Calendar, Schedule, Colour, Pause, Remove use existing handlers and no data changes. New protocol wizard search and compact Insights from pending PR #31 remain part of same candidate.
- Separate research-backed clinical-content audit drafted in `docs/ios/MEDICAL_CONTENT_AUDIT.md`; no clinical text modified. Critical unresolved pre-App-Store issues include precise plasma predictions, weeks-at-dose escalation suggestion and Apple App Review guideline §1.4.2 for dose calculators. CI and final release artifacts pending; Pages and physical iPhone unverified.

### v0.9.6-beta — IMPLEMENTED, TESTED, MERGED; Pages deployment UNVERIFIED (2026-10-23)
- Baseline app main `ed1db9e6f384c06d6aa882458ef41e51be69955b` → app PR #31 merged `ddd38eeb7b78cda3e3cc63c5f57a13ef665143e0`, `main/index.html` shows v0.9.6-beta.
- Changes: Today expanded compound card has nonurgent timing/escalation Insights disclosure, important site-rotation notice remains visible, dense Remove from Today row moved under ellipsis, true modal bottom sheet with six original actions and SVG icons; name and 320px ring alignment, New Protocol search icon and corrected step progress. Behaviour preserved for collapse, Log Dose, history/calendar/schedule/colour/pause/remove; stored records/formats untouched. No data migrations, schemas or dosing logic changes.
- PASS branch CI for tested PR head `80bd01b`: `https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40059005979` source/ZIP/HTML parity, Playwright 8 LIVE/DEMO × 320/390 × light/dark, functional Back/Next/Stack search, sheet scrim/focus/backdrop/Escape/focus/scroll, History and Schedule after action; Check-In state/date safety. Mobile forms CI PASS `https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40059005978`. GitHub artifact ID `12546861220` includes standalone full app DEMO, extractable isolated-demo ZIP, deployable complete LIVE ZIP, QA JSON, 8 open-sheet screenshots. No physical iPhone validation.
- Contents in `docs/ios/MEDICAL_CONTENT_AUDIT.md` are separately researched proposed replacements, not shipped UI copy. Retatrutide status and Apple drug dosage calculator provenance are unresolved App Store gates. Pages publication not independently verified; release status MERGED, DEPLOYMENT **INCOMPLETE**.

### v0.9.6-beta QA/Pages assurance follow-up — CODED / CI PENDING (2026-10-23)
- No visible app release/version change: QA-only PR branch `qa/v096-pages-inventory-assurance` from `25ca6e7`, preserves the complete v0.9.6 app files and storage.
- Added 16-file Pages deployment byte-parity verification workflow (run after main push), paired with local verifier self-test; added 8 × 6 synthetic inventory core assertions across LIVE/isolated DEMO, 320px/390px, light/dark. GitHub CI status, PR merge, Pages attestation, physical iPhone outcome PENDING. Full app DEMO + complete LIVE ZIP builder unaffected and required for QA artifact.
- No data migrations and no production writes. App Store clinical-content and dosage calculator risk remain unresolved.

### v0.9.6-beta QA assurance merged; Pages remote check pending (2026-10-23)
- QA-only PR #33 merged to `main` at `89d5066251eaf49462e3128a17cf62fb3bc4bf32`. App source remains v0.9.6-beta, no UI, calculator, storage, schema or migration changes. Release/build/48 vial safety assertions PASS `40060006633`; mobile form PASS `40060006632`. Artifact `12547102223` contains complete isolated full-app DEMO, offline ZIP, full LIVE ZIP and JSON QA. Local Pages verifier smoke PASS only; remote Pages deployment unverified at merge.
- Follow-up PR-observable live Pages checker coded in `ops/v096-pages-evidence-handoff` to record remote HTTP/16-file hash evidence; result pending. Physical iPhone and App Store medical review incomplete.

### v0.9.6-beta production Pages VERIFIED for app files — 2026-10-23
- GitHub App PR #31 merged app `ddd38ee`; QA-only PR #33 merged `89d5066251eaf49462e3128a17cf62fb3bc4bf32`. Actual GitHub Pages remote HTTPS byte parity PASS for 16/16 source files: PR #34 workflow `40060285190`, evidence `12546599640/Nexus_PAGES_REMOTE_CHECK_PR.json`, first remote request pass, not local smoke. App source unchanged through both ops branches. No migrations, version change or protected-data writes.
- Physical iPhone and native Safari colour picker, actual local home-screen cache, full dose-form inventory/draft workflow NOT TESTED. App Store medical-content and calculator compliance review still incomplete. Status v0.9.6 app code: MERGED, AUTOMATED TESTED, PAGES VERIFIED; real-device acceptance and medical review remain open.

### Public iOS measurements planning + synthetic diagnostic — QA-only, NO NEW APP RELEASE (2026-10-24)
- Branch `qa/ios-measurements-approval-math-diagnostics`, PR #36, baseline `df5b1ab4a6924a4594422b22077930aa178d4d42` v0.9.6-beta. User approved the two-tool design **Measurements & Preparation** as a public iOS direction, with both calculators retained. No visible app change/version increment, no storage/migration change, no LIVE Pages publish performed.
- CI workflow adds synthetic numerical diagnostic, source files untouched. PR head `a5861cb` run [40061025452](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025452): eight LIVE-local/full-demo contexts 320/390 dark/light, 80 math checks, **40 PASS / 40 FAIL**; recurring calculator problems: syringe 30u/50u scaling and capacity mismatch, unqualified IU conversion, negative input. **Calculator validation FAIL** and iOS release blocked pending fixes/review.
- Other existing test results unaffected: browser/Check-In/Protocol matrices and 48 vial safety assertions PASS, mobile [40061025531](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025531) PASS. Artifact `12547685887` includes exact-source v0.9.6 LIVE ZIP, full isolated standalone DEMO, JSON and screenshots; these are unmodified builds, not newly deployed app version. Device tests, professional clinical validation, App Store review and iOS packaging NOT TESTED. PR merge outcome pending at entry.

### v0.9.6-beta unchanged — iOS planning/QA PR #36 MERGED (2026-10-24)
- PR #36 merged `d2e77f155ccf7f19a0d7644e47338bb10689788d`, **NO USER-VISIBLE APP RELEASE**; only approved design documentation, synthetic calculator safety diagnostic `tools/audit-measurement-math.mjs` and release QA workflow updated. No stored records, schema, imported data, app CSS/JS/HTML or GitHub Pages publication changed.
- CI latest branch run [40061188674](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061188674) PASS for suite execution; mobile [40061188614](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061188614) PASS; artifact `12547830430` contains unchanged source FULL DEMO + LIVE ZIP and diagnostics. **Critical measurement calculator results still 40 FAIL/40 PASS of 80 tests; not medically validated.** iOS App Store, physical iPhone and clinical/legal verification incomplete.

### v0.9.7-beta — rebased safety release proposal after concurrent main updates (2026-10-24)
- Previous PR #35 data-integrity guard/test PASS run `40061288470`, mobile `40061288551` and release archive #12546878570, but branch unmergeable because #36/#37 concurrently changed main; old archive is only evidence for its tested source.
- New source baseline `b382a978` contains approved iOS Measurements & Preparation design docs and 40 PASS/40 FAIL diagnostic tests, all PRESERVED. New branch `release/v097-logdose-confirmation-from-latest-main` reimplements only Log Dose reject underallocation and invalid amount + full real UI regression; display/ZIP/demo version v0.9.7. No existing history migration, storage overwrite, reconstitution formula change or calculator math change. New branch CI and deployment NOT VERIFIED.

### v0.9.7-beta — APP MERGED / PAGES PENDING (2026-10-24)
- GitHub application PR #38 merged `2a27f155e3b174bbfaa5347e5f785e8a8fcddadc` onto main previously at `b382a9781a90c67349a0e0708e3843cadfe83e5f`. v0.9.7 title verified on main. Fix: Log Dose cannot save incomplete source amount or zero/negative/nonfinite input. Source-vial accounting math, prepared history, existing records and storage schema untouched. User-visible error explains that nothing was saved.
- Branch QA PASS `40061915470` (8 LIVE/full isolated DEMO × dark/light × 320/390, 40 real-form Log Dose workflows, 48 vial source safety, existing Check-In/Protocol), `40061915446` mobile PASS. GitHub artifact `12548340363`: standalone COMPLETE DEMO HTML, offline DEMO ZIP, root-index LIVE ZIP with 3 CSS + 12 JS, screenshot matrix and QA JSON. Medical calculator diagnostic still 40 FAIL of 80; not addressed by this release. Physical iPhone not tested. Postmerge Github Pages production version NOT YET INDEPENDENTLY CONFIRMED; scheduled to check via remote CI artifact.

### v0.9.7-beta — LIVE PAGES VERIFIED (2026-10-24)
- App PR #38 merged `2a27f155e3b174bbfaa5347e5f785e8a8fcddadc`. Postmerge docs PR #39 run `40062278673`, artifact #12547383562, `Nexus_PAGES_REMOTE_CHECK_PR.json`: HTTPS `smoke_only:false`, `verified:true`, 16 app source files byte-identical on first attempt, so v0.9.7 published code parity VERIFIED. PR #39 mobile `40062278638` PASS.
- Real Log Dose underallocated/invalid input protection shipped, no history migrations; 40 end-to-end Log Dose cases, 48 vial-core cases and all existing display/Check-In/Protocol checks passed. Entire isolated DEMO HTML and browser ZIP, complete LIVE ZIP and release manifest delivered. Medical measurement math 40/80 failures, App Store requirements and physical iPhone remain incomplete.


### v0.9.8-beta — Log Combo Dose scalable picker (CODED ON PR #42, QA PENDING, 2026-10-24)
- Baseline main `2da1001` (public v0.9.7-beta). Branch `release/v098-combo-picker-20261024`, draft PR #42. New searchable, capped-height 50+ compound multi-select avoids whole-modal rebuild, preserves in-progress amount, date, site, notes and symptom UI, separates favorite selection from deletion, keeps prepared physical syringes and existing source allocation/dose logging logic. Code and build metadata display v0.9.8-beta. Add Kit and Stash redesign NOT IMPLEMENTED.
- Data impact: no migrations; no history, calculation, localStorage or inventory schema changes. Complete full-app isolated DEMO HTML, offline DEMO ZIP and complete LIVE ZIP implemented in existing same-source builder; **delivery artifacts INCOMPLETE pending passing CI**. Automated test target 8 × 50-compound search and protected existing suites. Physical iPhone NOT TESTED. PR, merge, deployment all INCOMPLETE until verified. Medical calculator diagnostic unrelated and still BLOCKED, not fixed by this release.

### v0.9.8-beta Combo picker — BRANCH VALIDATED, NOT YET DEPLOYED (2026-10-24)
- Draft PR #42 `release/v098-combo-picker-20261024`; original main `2da1001` to tested source `89d253d`. Screen: Log Combo Dose; searchable 50+ compound selection in max-height scroll panel, dynamic selected dose fields with amount/date/site/notes draft retention, separate favorite apply/delete controls. No alteration to planAndApplyComboDoses, prepared physical syringe routing, kit inventory or saved historical records; no migration.
- PASS browser/build [run 40067532927](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532927) and PASS mobile [run 40067532954](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532954). 8/8 fictional 50-compound picker cases at 320/390 dark/light, 8/8 baseline and Check-In and Protocol; 48 vial safety core assertions, 40 Log Dose real form workflows. Complete exact-source full-app DEMO HTML, offline HTML ZIP and LIVE root-index 16-file ZIP in Actions artifact #12550276253; actual ZIP CRC and byte-identical standalone/offline HTML verified.
- Existing unrelated measurement math diagnostic **40 FAIL/80** remains blocking for clinical calculator safety, not represented as a pass. Physical iPhone/Safari/VoiceOver NOT TESTED. PR merge, GitHub Pages public v0.9.8 parity and device acceptance INCOMPLETE at this entry.

### v0.9.8-beta — RELEASED: CODED, AUTOMATED TESTED, MERGED, PUBLIC PAGES VERIFIED (2026-10-24)
- Baseline main `2da1001a43812819266066159cb7f2d73746e3c1` → PR #42 merge `253544b46c014675c18d4c2e6255228e28333028`. Public URL `https://deidrajw.github.io/Peptide-Tracker/`, Pages deployment workflow [40068083410](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068083410) SUCCESS and actual **16/16 exact byte source parity** [40068084296](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068084296), artifact `12550490662`; postmerge mobile form [40068084355](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068084355) SUCCESS.
- Screen: Log Combo Dose. 50-compound-scale scroll-bounded search-first multi-select, in-place selection, preserved draft amounts/shared date/site/notes, separate favorites apply/delete; prepared syringes, inventory deductions, symptom recording, historical dose records and all other tabs unchanged. No database/storage migration and no intentional data impact.
- Browser/run [40067532927](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532927) PASS: 8 LIVE-local / complete isolated DEMO × 320/390 × light/dark 50-compound picker; 8 other display/browser, 8 Check-In, 8 Protocol, 48 vial core, 40 real Log Dose workflows. Complete full-app DEMO HTML, browser-openable offline ZIP, complete root-index 16-file LIVE ZIP, manifest, screenshots and JSON QA in artifact `12550276253`; ZIP CRC and HTML byte parity checked. In-chat interactive picker and checklist delivered.
- Limitations: real physical iPhone/VoiceOver/PWA cache NOT TESTED; separate original Measurement Calculator still **40 FAIL/80 assertions** (not changed), clinical/iOS App Store release gate remains BLOCKED. Stash/Add Kit designs in draft PR #41, unimplemented.

### v0.9.9-beta — proposed Stash Actions sheet, CODED ON RELEASE PR #44 (2026-10-24)
- Baseline public v0.9.8-beta main `6d616856`; branch `release/v099-stash-sheet`, PR #44 DRAFT. Stash kit action bottom sheet with grouped conditional inventory, kit/history and destructive rows. Standard and blend kit cards receive ellipsis paths; blend uses its own Edit/Log handlers. Source version/build/tests aligned v0.9.9. No migrations, saved record or inventory math changes; public LIVE remains v0.9.8 pending release.
- Full-app fictional isolated DEMO HTML, offline DEMO ZIP, complete 16-file root-index LIVE ZIP assembled by retained same-source release builder; CI run, actual artifact QA, merge, Pages parity, physical iPhone all **INCOMPLETE/NOT TESTED** until evidence arrives. Existing calculator medical-math 40/80 failure on old public baseline unaffected.

### v0.9.9-beta — RELEASED / PAGES VERIFIED 2026-10-24
- Baseline `6d616856` → release PR [#44](https://github.com/Deidrajw/Peptide-Tracker/pull/44) merge `704fdb16b6720fc36929d2183a2c4651e91771ef`. Affected screen Stash: grouped compound actions bottom sheet, added blend ellipsis, preserved standard and blend inventory operation handlers and all history. No data migrations or storage/record updates.
- All six: fictional in-chat interactive sheet PREVIEW delivered; exact-source complete isolated standalone full-app DEMO HTML and byte-parity offline DEMO ZIP, complete 16-file deployable LIVE ZIP in Actions artifact **12550214994**; GitHub branch/PR checks passing and merge completed; release notes and regression checklist delivered; production Pages independently VERIFIED as 16/16 source bytes [run 40069938848](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40069938848), proof artifact #12550612521; GitHub Pages run `40069938543` and main mobile `40069938840` SUCCESS.
- Automated browser validation `40069652295`: Stash actions 8/8 standard open/stored/blend, standard browser 8, Check-In 8, Protocol 8, vial source core 48, Log Dose full UI 40, Combo Dose 50 compounds 8. ZIP CRC and DEMO HTML offline index identical. Physical iPhone/manual VoiceOver and keyboard NOT TESTED. **Separate preexisting calculator diagnostics 40 FAIL/80** remains a safety blocker and no medical-release clearance is implied.

### v0.9.10-beta — actual Stash cards CODED on draft PR #46 (2026-10-24; TEST/DEPLOY PENDING)
- Baseline main `870105ce` v0.9.9. Stash standard and blend cards display owned kit remaining, sealed/open counts, state-aware open-vial progress and no manufactured 100% bar for unopened products. Detail disclosures raised to 44px with matching outline chevrons; preserved full history and v0.9.9 actions menu.
- No data migration or saved inventory math edits. Source/full app DEMO and LIVE ZIP version v0.9.10; new 8-environment synthetic Stash card QA added with protected prior regression suites. Source-verified artifacts, PR merge, LIVE Pages parity and physical iPhone all INCOMPLETE until proof. Existing separate clinical measurement math 40/80 synthetic failures not fixed.

### v0.9.10-beta — RELEASED AND PUBLIC PAGES VERIFIED (2026-10-24)
- Baseline `870105ce` (v0.9.9) → PR [#46](https://github.com/Deidrajw/Peptide-Tracker/pull/46) merge `f13b79639b968bfafd5b38df64c7456381799721`. Updated actual Stash standard/blend card body: canonical kit inventory headline, sealed/open labels, open-vial-only percentage bar, consistent Details/History disclosure. Preserves all existing actions, dose and vial history, protocols, localStorage storage key, backups and math. No migration or data loss; user data not touched.
- Automated release run [40071176740](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071176740) PASS; 8/8 actual Stash card 320/390 dark/light LIVE/isolated DEMO, general browser 8, Check-In 8, Protocol 8, vial safety 48, Log Dose 40, Combo 50 compounds 8 and Stash Actions 8. Complete same-source isolated full-app DEMO HTML, offline demo ZIP (byte-identical index), full LIVE root-index 16-file ZIP; QA source artifact #12550884240 CRC validated. In-chat interactive preview, release notes and copyable checklist supplied.
- GitHub Pages deployment [40071480385](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071480385) SUCCESS, main mobile [40071480104](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071480104) SUCCESS, **public exact 16/16 file parity** [40071479984](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071479984) SUCCESS, artifact #12551731208. Physical iPhone Safari/PWA/VoiceOver NOT TESTED. Separate known measurement calculator 40 FAIL/80 diagnostic assertions, no clinical safety clearance, PR #40 unmerged.

### v0.9.11-beta — PROPOSED/IMPLEMENTED BRANCH, NOT RELEASED (2026-10-24)
- Baseline `17657d682e6c601774c79b603e761f9830085038` public v0.9.10-beta. [PR #49](https://github.com/Deidrajw/Peptide-Tracker/pull/49): remove doubled authored disclosure icons from Today, Protocol, Stash; rely on one CSS pseudo-chevron for native disclosure, retain one for custom This Week button. No schema changes, saved data changes, migrations, history edits or math changes. Source and full-app/demo bundle version v0.9.11.
- Automated browser QA, generated full-app DEMO/LIVE ZIP checks, PR merge and production Pages parity **INCOMPLETE** until CI evidence. Physical iPhone Safari/VoiceOver NOT TESTED. Separate pre-existing measurement calculator audit 40/80 failing remains an independent blocker.

### v0.9.11-beta — deployed October 24, 2026
- Issue #48 first phase, PR #49 merged as `1ef9337f61a45b012c0d6da21fc35b92e38939c8` from v0.9.10 baseline `17657d68`. Today, Protocol and Stash now use one shared disclosure chevron without redundant authored glyphs. No data migrations, inventory/dose calculations changed, or prior workflows removed.
- Browser suite `40107079456` PASS, including new chevron 8/8, protected Check-In/Protocol, Stash Cards and Actions, vial core (48), Log Dose (40), Combo (50 compounds). Isolated full-app DEMO HTML and offline ZIP identical, LIVE root-index 16-file ZIP verified, artifact #12564833867. Pages deployment `40107472341`, post-merge mobile `40107472461`, exact public 16/16 file parity `40107472550` PASS; proof #12565656097. Manual iPhone NOT TESTED. Unrelated calculator math diagnostics 40/80 failed; no clinical safety clearance. Further Combo Dose blend eligibility and Plans/Stash density remain pending.

### v0.9.12-beta — SOURCE IMPLEMENTED, PR #51 DRAFT, NOT DEPLOYED (2026-10-24)
- Baseline production v0.9.11-beta, main `533a3766`. PR [#51](https://github.com/Deidrajw/Peptide-Tracker/pull/51) includes missing Needs attention duplicate arrow correction, Combo Dose blend-only eligibility (protects independently stocked, historical and preset names), bordered search panel with bounded scroll and Canadian Favourites. Changes only rendering/filter logic, not localStorage or vial calculations.
- Full isolated full-app DEMO, offline ZIP, source LIVE ZIP, in-chat preview, test evidence, PR merge and production Pages verification all **INCOMPLETE pending CI**. New blend-specific regression 8 configurations added; protected prior tests remain required. Manual iPhone NOT TESTED; unrelated calculator diagnostic 40/80 FAIL.

### v0.9.12-beta — RELEASED, October 24 2026
- PR #51 merged 1253b2c2f64043b449c75e8f21b484f3aaaea636. Removed Today Needs attention duplicate arrow. Combo Dose blend-only constituent filtering retains independent and historical selections, contains bounded search in a bordered panel, displays Canadian Favourites. No migration or record loss; no calculation changes.
- Browser CI 40109066287 SUCCESS: new blend-picker 8/8, protected Combo 50-compound 8/8, Check-In 8, Protocol 8, vial core 48, Log Dose 40, Stash Cards/Actions 8 each, chevrons 8. Complete standalone isolated full-app DEMO, offline DEMO ZIP byte-identical HTML, 16-file root LIVE ZIP verified from artifact 12565752103. Mobile CI 40109066248 SUCCESS.
- Pages deploy 40109401334 SUCCESS; public 16/16 exact merged source integrity 40109401930 SUCCESS; main mobile 40109401939 SUCCESS. Physical iPhone NOT TESTED. Separate calculator diagnostic 40 failures of 80 uncorrected, PR #40 not merged. Next Stash history hierarchy/Plans layout.

### v0.9.13-beta — STASH DETAILS CODED, NOT YET RELEASED (2026-10-24)
- Base v0.9.12 SHA `225252be`. Standard Stash expanded kit details separated into Overview, Vials and History; removed nested vial/dose disclosure controls, kept detailed rows and actions, moved forecast/notes into Overview and outflow into History, preserved blend card and all stored data. Files `assets/js/10-nexus.js`, `12-nexus.js`, `assets/css/nexus-disclosures.css`, versioned build/CI. New 8-environment Stash panels test. PR, release artifacts, tests and Pages deployment **INCOMPLETE until checked**. Physical iPhone not tested; clinical calculator remains separate 40 FAIL/80.

### v0.9.13-beta — RELEASED / PAGES VERIFIED (2026-10-24)
- Source baseline v0.9.12 main `225252be` → [PR #53](https://github.com/Deidrajw/Peptide-Tracker/pull/53) merge `895d6bfd846755807a20bf7f43809bad515b2104`. Stash expanded standard kit reorganized into Overview, Vials, History tabs (44px, keyboard Left/Right/Home/End). Retains kit metadata, editable vial/dose/outflow histories, forecast, notes, Intel/reconstitution and existing ellipsis actions. Removed redundant nested history disclosures and bottom Manage link, not any records. Blend kits unchanged; localStorage, data formats and inventory calculations unchanged.
- CI [40110883172](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40110883172) SUCCESS including 8/8 new Stash panel tests in isolated LIVE-local/full DEMO × 320/390 × light/dark, protected Stash Card/Actions, Check-In, Protocol, Log Dose 40, vial core 48, Combo 50, blend selection and chevrons. Mobile branch 40110883132 PASS. Complete source artifact #12565814124 delivered: standalone isolated FULL APP DEMO HTML and byte-identical offline ZIP; CRC valid root-index LIVE ZIP (3 CSS+12 JS+index). In-chat fictional preview, release notes and copyable checklist provided.
- GitHub Pages deployment 40111253972 SUCCESS, post-merge mobile 40111254716 SUCCESS, **16/16 exact public source files** [40111254674](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40111254674) match release merge SHA. Actual iPhone Safari/PWA/VoiceOver NOT TESTED. Separate known measurement calculator 40 FAIL/80, no clinical sign-off.

### v0.9.14-beta — Plans controls CODED, NOT YET TESTED / DEPLOYED
- On `release/v0914-plans-card-hierarchy`, starting main `491b1a00` v0.9.13. Research status/ellipsis/Intel separation, 44px management controls and 44px Goal detail disclosure. No schema/data/dose/inventory changes. New 8-matrix fictional Plans QA and protected full-app build/tests; expected same-source DEMO + LIVE ZIP. Branch PR, CI results, merge, Pages and physical iPhone INCOMPLETE. Calculator diagnostic 40/80 remains unresolved.

### v0.9.14-beta — RELEASED / PAGES VERIFIED 2026-10-24
- Baseline v0.9.13 main `491b1a00` → [PR #55](https://github.com/Deidrajw/Peptide-Tracker/pull/55) merged `529f81ea55f521e7f4df3b7611617fdcf29e9fc0`. Plans Research Intel separated from title/status/ellipsis, all management controls 44px and Goal details disclosure 44px. Existing record fields/notes, Goal/Research/Shopping save and delete, Intel navigation preserved. No localStorage migrations or source calculations modified.
- CI browser [40113456056](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113456056) PASS: Plans 8/8 320/390 dark/light LIVE-local/full isolated DEMO, plus Check-In, Protocol, Stash Cards/Actions/Panels, Combo search and blend eligibility, vial core 48, Log Dose 40 and chevrons. Full fictional standalone DEMO HTML and offline DEMO index byte-identical; root index and all 16 LIVE files CRC PASS, artifact #12567208936. Deployment [40113804812](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113804812) SUCCESS, postmerge mobile 40113805479 SUCCESS; production 16/16 source equality [40113805546](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113805546) SUCCESS, proof #12567481902. Physical iPhone NOT TESTED. Separate diagnostic calculator remains 40 FAIL/80, no clinical approval.

### v0.9.15-beta — CANDIDATE, not released (2026-10-24)
- Baseline main `6645f375`; branch `release/v0915-plans-icon-coherence`; Plans management and Research Intel icons changed from font glyphs to consistent SVG outline controls; CSS preserves >=44px management hit area. Index candidate title v0.9.15-beta.
- Affected: Plans Goals/Research/Shopping. Data impact: none intended; no saved records, Stash/Combo math, protocol or calculator changes. PR/CI/LIVE ZIP/full-app DEMO/merge/Pages deployment: INCOMPLETE until independently verified. Physical iPhone: NOT TESTED. Separate calculator #40 still hold.

### Cloudflare hosting decision — 2026-10-24 (not an application release)
- User approved GitHub-connected Cloudflare Pages `https://nexuspeplog.pages.dev/` as future primary hosting; GitHub Pages retained as fallback. No code deployment/merge, changes to localStorage, version bump or migrations in this decision. Cloudflare published SHA, 16-file parity and user data restoration NOT VERIFIED. Existing v0.9.14-beta source remains latest confirmed main, PR #57 v0.9.15 candidate unmerged.

### v0.9.15-beta icon integration candidate — 2026-10-24
- User uploaded four approved PNGs to `main` commit before release branch. Candidate branch `release/nexus-icon-integration-v0915`: iPhone 180 and browser 192/512 references, updated LIVE/DEMO packaging. Intended data impact none. CI, merge and Cloudflare publication NOT YET VERIFIED. Prior Plans v0.9.15 merged separately; calculator PR #40 held.

### Today disclosure hierarchy pilot (unreleased) — 2026-10-24
- User approved UI redesign direction. Branch `release/today-disclosure-hierarchy` keeps all underlying data and handlers but changes three repetitive chevron affordances into text-labeled expanders. Source version remains v0.9.15-beta until release finalized. CI, merged commit, Cloudflare parity, manual iPhone acceptance currently INCOMPLETE. Separate PR #61 Stash work and PR #40 calculator review unaffected.

### PR #62 follow-up: Today disclosure text-only correction — 2026-10-24
- User found extra `summary::after` chevron in Daily tracking candidate demo. Added scoped CSS override on branch; no JS business behavior, stored data or calculations changed. Previous PR #62 head had both workflows PASS, but new head requires fresh validation. Merge, publication and real iPhone acceptance UNVERIFIED.

### 2026-10-24 — Today icon QA gate corrected
- Full workflow 40127200163 FAILED at legacy `tools/validate-chevron-unification.mjs` assertion requiring a visible chevron on Daily tracking, contradicting user-approved explicit View tracking label. Earlier browser, data and Stash assertions passed before this point. Corrected automated expectations to assert the labeled Today disclosures have NO generated chevron; remaining generic Protocol/Stash chevron tests preserved. Re-run on new head required; do not mark release passed or merged until success.

### Post-Today Stash header candidate — 2026-10-24
- Applied previously approved and CI-validated PR #61 UI-only changes on latest Today release baseline main `44b04728` to avoid old PR merge conflicts. Candidate branch `release/stash-consistency-current-main`. Version title remains v0.9.15-beta until release bookkeeping; new branch CI/merge/deployment NOT YET VERIFIED, data migration none.

### Informational empty-state audit / Stash menu pilot — 2026-10-24 (candidate)
- Branch `release/stash-empty-states-20261024` from main `62fae531` implements placeholder for zero eligible Kit actions menu entries, specifically unopened/unreconstituted blend; existing action buttons and safety guards unchanged. Broader cross-app source audit documented. LIVE/DEMO builds, CI, merge and Cloudflare deployment UNVERIFIED. Data impact none; no migration.

### 2026-10-24 — Connected Goals product specification (design only)
- `docs/design/CONNECTED_GOALS_SPEC.md` authored on design branch from main `051f8203`; maps approved Goal/Protocol/Check-In/Journal/Insights experience, staged releases, additive schema plan and regression gates. No code, migration, PR merge, app release or deployment implied. Status SPEC DRAFT.

### Connected Goals Release A Protocol status filter — candidate 2026-10-24
- On branch `release/connected-goals-a-protocol-filter`, after design PR #68 merge `7abdc7e1`, added UI filter chips and reset to Protocol view in JS 11/12. No saved data changes. CI/merge/Cloudflare/physical iPhone still UNVERIFIED; displayed version unchanged until real release. Goal association and progress are staged separately.

### Connected Goals A2 explicit goal association — candidate 2026-10-24
- Branch `release/connected-goals-a2-linking` from main `17182101` adds Protocol Builder Review personal-goal selector and protocol-card linked goal display via new optional `linkedGoalId`. Legacy template `goalId` unchanged. No migration, no data loss intended; normal protocol Save writes new optional reference. QA, merge, artifacts, Pages/Cloudflare remain UNVERIFIED.

### Connected Goals A3 detail sheet — candidate 2026-10-24
- On branch `release/connected-goals-a3-detail` from verified main `d25a5a36`, add read-only Goal Details Overview, Connections, Activity accessible through active and other goal cards. No data migration, no calculation changes, no deployment. CI and full release artifacts PENDING.

### 2026-10-24 — A4 flexible progress modes candidate
- Based on A3 main `223fea3c`, A4 branch adds progressModel editor, truthful Goal Overview and opt-in weight-history comparison, no record duplication or migration. Added browser matrix functional assertions; CI/merge/deployment unverified pending PR.

### 2026-10-24 — A5 Goal Check-In evidence candidate
- Proposed additive `goal.evidenceSymptom` selection and read-only existing `dailyLogs` evidence in Goal Activity. No Check-In data writes or duplication. Code staged on release branch only, CI/merge/deployment UNVERIFIED.

### 2026-10-24 — A6a Check-In reflections candidate (NOT RELEASED)
- On branch `release/connected-goals-a6a-checkin-reflections` from A5 main f980a283, coded source-linked Goal Activity daily reflections and navigation to original Check-In; no migration, no copied Journal content, no changes to original logging. New browser assertions cover source matching, exclusion, edit/removal, and storage preservation. CI, exact-source LIVE/full DEMO artifact, merge, deployment and iPhone QA INCOMPLETE.

### 2026-10-24 — Combined UX consistency candidate (UNRELEASED)
- Branch `release/unified-ui-research-journal-insights` from A6a main. Research title/Intel/reason hierarchy, Journal dropdown filter, single-focus Check-In changes modal, shared style adjustments. No persisted schema or data migration. Full-browser mobile 320/390 light/dark LIVE/DEMO, artifact parity, merge/deployment, physical iPhone PENDING. Do not call release shipped based on branch code.

### 2026-10-25 — Card header parity corrective candidate (UNRELEASED)
- From main dded5084, user-reported visual mismatch remains after PR #80. Branch `release/card-header-parity-20261025` applies DOM-level status-below-title structure and unified menu SVG to Research/Goals/Protocol/Stash, preserves all actions/status semantics and storage. CSS parity rules and targeted browser assertions added. CI, packaging, PR merge and host parity pending; physical screenshot defects are confirmed in current live UI, not signed off.

### 2026-10-24 — Store readiness and neutral avatar audit candidate (NOT RELEASED)
- Branch `feature/release-readiness-onboarding-avatar-audit` from main `7624c4d3`: scoped no-photo profile avatar replaced with user outline in shell/profile editor (candidate), detailed release/onboarding/privacy audit committed. No migrations, no final changelog popup, no release manifest implementation. CI/merge/host/artifacts INCOMPLETE; no app store submission. Calculator #67 held.

### 2026-10-25 — Release manifest foundation candidate (NOT PUBLISHED)
- Branch `feature/unified-release-manifest-foundation` adds machine-readable `release/release.json` for current v0.9.15-beta (publication status `unverified`), three derived note outputs and build-time parity gate. It does not claim a new release, activate a popup or change user records. LIVE/full isolated DEMO CI, branch PR, deployment and iPhone testing pending. Legacy numeric CHANGELOG remains intact. Neutral avatar fix remains separately in PR #84 pending final merge.

### 2026-10-25 — Release notes and publish-gated popup candidate (UNRELEASED)
- PR #85 now includes generator/output parity, ordered runtime metadata in 02 JS, first-launch publication-gated modal in 12 JS, and browser assertions for unverified silence, Later and acknowledgement. Current release manifest status UNVERIFIED so no popup triggers for that build. Legacy numeric changelog not erased; no record migration. CI/merge/Cloudflare/real device pending.

### 2026-10-25 — v0.9.16-beta onboarding candidate (UNRELEASED)
- Branch `release/onboarding-safe-first-run` at main base a3318973, changes first-run welcome, local storage explanation, Start Fresh, guarded import with JSON shape checking/count preview/confirmation/empty-state backup, and standard CSS. Canonical manifest and generated three note formats updated to v0.9.16-beta (status UNVERIFIED); browser/source/CI and packaging unverified, no merge/Cloudflare/physical iPhone. No destructive migration or automatic import. Calculator #67 held.

### 2026-10-25 — v0.9.17-beta Getting Started polish (NOT RELEASED)
- New candidate branch `release/onboarding-getting-started-polish` from v0.9.16 main 888d746c. Changes onboarding Done-step visuals and guide button only, no migration/storage/calculation changes; aligns canonical release manifest and three notes with v0.9.17-beta (publication unverified). CI/artifact/merge/deployment pending.


### 2026-10-24 — v0.9.18-beta unified UI/trust/release (CANDIDATE / NOT DEPLOYED)
- Branch `audit/unified-experience-trust-release-20261024`, PR #94 from main b6737fad (PR #89 merged v0.9.17-beta). Publication metadata still unverified, no deploy commit claimed.
- Added Privacy & Data, notification context, backup restore preview/typed confirmation/recovery, 44px navigation, reduced-motion/focus controls, strict calculator input/capacity/IU guards and fixed 30/50/100 U-100 invariant math.
- Synchronized `release/release.json`, in-app metadata, Apple and Google notes and HTML title to v0.9.18-beta. CI and 13 browser scripts now obtain version from canonical manifest. Added protected restore/privacy browser tests and blocking math assertions. No schema migration.
- At entry: latest-head LIVE/full isolated DEMO/QA, PR merge, Cloudflare site parity, iPhone/VoiceOver and native stores are INCOMPLETE. Final evidence and mapping must be appended, not inferred.

### 2026-10-24 — v0.9.18-beta merged source and package verification (WEB PUBLICATION UNVERIFIED)
- PR #94 merged at main `623025665c549dadbe3fb467b6d556f5d44e7e34`. Prior candidate note marked NOT MERGED is retained as historical state.
- GitHub Actions PR release run 40158486843 successful; mobile-form run 40158486825 successful. Candidate artifact 12584823539 contains standalone full-app DEMO HTML, offline DEMO ZIP, complete LIVE ZIP and JSON browser evidence. Inspected LIVE ZIP: root index, all three CSS, twelve ordered JS, four icons. All 16 index/CSS/JS Git blob SHAs match merged main. No storage migration; user-initiated restore remains explicitly gated.
- Pre-merge host comparison `Nexus_CLOUDFLARE_PARITY.json` was FAIL (`index.html` hash mismatch), so no actual Cloudflare publication is certified. Manifest status remains `unverified`. Physical iPhone, VoiceOver, native store policy/privacy signoff NOT TESTED.

### 2026-10-24 — v0.9.18-beta verified Cloudflare live and publication acknowledgment candidate
- Web app PR #94 merged in main `623025665c549dadbe3fb467b6d556f5d44e7e34`. Docs PR #96 merged `1a5b6f231dd279db306d2a17906a4fbbab2303d9`.
- Remote comparison in Actions run 40159182188: `verified:true`, 16/16 HTML/CSS/JS byte hashes match target web source. Full CI and mobile forms run 40159182258 PASS. Earlier pre-merge host mismatch was correctly treated as a temporary unpublished source, not covered up.
- Next staged follow-up `release/v0918-publish-verified-manifest`: manifest status `published`, source commit `623025...`, UTC verification timestamp `2026-10-25T03:45:21Z`, updated in-app/runtime metadata, same app version and no record migration. Follow-up PR CI, merge and new Cloudflare deployed byte parity still pending.
- Physical iPhone, VoiceOver, native store approvals and public privacy policy remain NOT TESTED / INCOMPLETE.

### 2026-10-24 — v0.9.18-beta PUBLISHED WEB, FINAL CLOUDFLARE PARITY PASS
- PR #94 implementation merged `623025665c549dadbe3fb467b6d556f5d44e7e34`; PR #96 docs merged `1a5b6f231dd279db306d2a17906a4fbbab2303d9`; PR #97 publisher metadata merged `3625462a04c1eb124e350f6989b57019e3256380`; PR #98 final remote comparison docs merged `8c3d874c549f2e3ef3b8004bb961ec29b7f4743f`.
- **LIVE:** Cloudflare `https://nexuspeplog.pages.dev/`; post-publication remote byte compare Actions run 40160165392 `verified:true` for all 16 app entry files (HTML/3 CSS/12 JS). Final published manifest source includes the once-per-version What's New popup. Browser/build and mobile forms PASS in runs 40160165392/40160165348; previous independent conversion math 80/80 and backup trust matrix PASS.
- LIVE 20-file package, standalone full-app fictional isolated DEMO HTML and offline DEMO ZIP were generated from the same v0.9.18-beta published source; data impact: no automatic migration, manual restore requires typed confirmation and attempts local recovery/rollback. Historical changelog preserved.
- Not equivalent to native-store approval: human iPhone/VoiceOver, all surfaces manual usability/contrast, policy/privacy processor declarations, and Apple/Google submissions remain incomplete.

### 2026-10-25 — v0.9.19-beta corrective candidate (NOT YET RELEASED)
- Targeted response to physical iPhone issues: blend open vial and reconstitution metadata, blend-as-one-entry in Today picker/dose logs, composition percentages, and Protocol phase/review input geometry. Source branch `release/v0919-blend-protocol-iphone-fixes`; baseline v0.9.18 main `2bf40535`.
- Data impact: additive blend vial metadata, new single blend-dose logs, no automatic migration; existing constituent dose logs retained. Version manifest `unverified`. Full CI/live Cloudflare/iPhone acceptance pending. Published v0.9.18 unaffected until safe merge.

### 2026-10-25 — v0.9.19-beta merged and Cloudflare-confirmed application source
- Implementation PR #100 merged `955c904860b39c5c56472b07cd3521828d5d9d79`. Release CI 40161722598 and mobile form 40161722564 PASSED. Post-merge PR #101 remote site audit 40162047192 verified 16/16 primary Cloudflare application entry files; docs PR #101 merged `c6b64c113c703fcfcb7fb372172fcf8c966d7266`.
- Data effect: no migration; explicit open/finish blend entries and new blend-level dose logs only, with existing ingredient doses preserved. Full LIVE ZIP and fictional isolated standalone DEMO/ZIP generated from identical source. Physical iPhone review outstanding.
- Publication metadata follow-up `release/v0919-verified-publication` is an UNMERGED candidate; generated runtime and notes updated, not yet verified on live host.

### 2026-10-25 — Published release modal theme contrast hotfix candidate (NOT RELEASED)
- v0.9.19-beta in live screenshot, published What's New light theme primary acknowledgment appears absent. Candidate branch `fix/issue-109-theme-visibility-audit` adds explicit modal action colors/geometry and Playwright contrast/visibility gate. No data model/storage changes, real dose logs unaffected.
- Branch awaiting latest-head CI, version/manifest decision, complete isolated FULL DEMO + LIVE ZIP, merge and independent Cloudflare host parity. Real iPhone revalidation and broad full-app theme audit remain incomplete. Do not mark deployed from a PR merge.

### 2026-10-25 — PR #111 extended theme audit candidate (still NOT DEPLOYED)
- Scope grew from published release Got it invisible on physical light-mode iPhone to targeted source-confirmed repeated contrast defects in Protocol actions, inline lavender buttons/badges, Calendar numerical weights and dark/light muted token palette. CSS only; 9-tab diagnostic + block on 4.5:1 release modal and neutral token combos in 8 browser modes.
- PR #111, independent of unfinished PR #110. First CI failed due audit regex bug, corrected; run 40165287614 passed after correction. *Later* commits require new latest-head CI. No changes to localStorage/data history; no actual iPhone recheck or independently verified deployment yet.

### 2026-10-25 — v0.9.19-beta theme contrast hotfix — CODED / TESTED / MERGED, CLOUDFARE UNVERIFIED
- PR #111 merged with squash `da18b2fb243a57e3023e493093dac70bfe8056f9`; unchanged version v0.9.19-beta (patch delivery to published channel, not a new published What's New entry).
- Fixed published release Got it/Later visibility in light/dark, AA muted palette on neutral surfaces, Protocol CTA, inline white-on-lavender buttons/badges, and Calendar compact weight/day colours. CSS + QA/doc code only; no localStorage changes, history edits or changes to dose math. Browser matrix 40165612214 and mobile forms 40165612207 PASS on PR head, 8 LIVE/full DEMO theme/width configurations; 9-main-surface contrast diagnostic still requires manual candidate review.
- FULL DEMO/LIVE ZIP generated in passing workflow artifact; independent postmerge Cloudflare 16-file verification pending; physical iPhone, VoiceOver, all modal AA certification NOT TESTED. Issue #112 remains open. Separate blend parity PR #110 remains unmerged.

### 2026-10-25 — v0.9.19-beta accessibility hotfix: WEB DEPLOYED / CLOUDFLARE VERIFIED
- App PR #111 squash merge `da18b2fb243a57e3023e493093dac70bfe8056f9`. No version bump: original v0.9.19-beta published acknowledgment remains as-is. Fixes blank-looking Got it/Later action, muted palette, Protocol Create, inline light-lavender text, Calendar small weights/today marker. No data migration, inventory or dose-math change.
- PR #111 release/full DEMO and browser build run 40165612214 PASS, mobile forms 40165612207 PASS; LIVE ZIP 20 files, standalone full fictional isolated DEMO plus offline demo ZIP artifact #12588676170. Version source app files match main merge.
- **Independent primary host audit:** docs-only PR #113 run 40165897243 artifact #12588721468 `Nexus_CLOUDFLARE_PARITY.json` `verified:true` for 16/16 index+CSS+JS remote SHA256 hashes. Mobile forms #40165897242 PASS. Hence web implementation deployed. Human device acceptance and full all-modal AA contrast are **NOT TESTED**, Issue #112 remains open. PR #110 still unmerged.


### 2026-10-25 — Release reliability guard (candidate)
- Intended version v0.9.20-beta exists on unmerged `release/issue-109-kit-experience-parity` / Cloudflare preview deployment `a3c0ce76-5176-406a-91b2-08bf73763ceb`; production and current main confirmed v0.9.19-beta at audit. Preview SUCCESS does not imply production deployed.
- Dedicated read-only post-main-push and manually invokable version + exact 16-file remote parity gate authored on `safety/release-deployment-parity-gate-20261025`. Candidate, not merged or CI verified at writing. Does not modify release.json, app source, data or published assets.
- v0.9.20 application release still blocked by unverified inventory/KLOW/legacy edit, full LIVE/full isolated DEMO and responsive functional regression on PR #110. Promotion not claimed.

### 2026-10-25 — Approved mobile hierarchy candidate (unreleased)
- Candidate on `feature/approved-ui-hierarchy-20261025`: compact vial ellipsis, responsive empty/open kit actions, multi-vial action styling, injection-site guidance relocation, Combo favourite dropdown, single-compound Trends detail/back navigation and duplicate glyph removal. No data schema changes. Blend Today card parity outstanding; branch/PR validation and Cloudflare production NOT COMPLETE.

### 2026-10-25 — PR #119 follow-up (candidate; not a production release)
- From iPhone preview evidence, fixed cramped multi-vial control and oversized Stash per-vial ellipsis by CSS-only overrides. User accepted the rest of the previewed UI, but latest-head automated and release artifact verification pending; PR draft and Cloudflare production unchanged.

### 2026-10-25 — v0.9.20-beta UX hierarchy patch — MERGED; DEPLOYMENT UNVERIFIED
- PR #119 squash merge SHA `3ef22b98326fc54777dbbef8ca9b013082f8f9fb` includes adaptive Stash kit actions/empty state and compact vial ellipsis, injection-site guidance relocation, corrected multi-vial button with 20px horizontal/12px vertical padding, compact Combo favourites selector, and compound Trends dedicated detail/back; targeted browser fixture updates.
- User preview iPhone acceptance for displayed changes recorded. CI mobile `40212593190` PASS, release browser and packaging `40212593263` PASS. Application version remains 0.9.20-beta; no destructive migration. Main merge is proven, Cloudflare Production source parity PENDING. The specific old expanded blend-card parity and app-wide divider/contrast PR #118 remain separately unresolved.


### 2026-10-25 — Hybrid Design System 2.0 preview (UNRELEASED CANDIDATE)
- Draft PR #123; experimental CSS, source-derived standalone full-app preview, branch-only builder support and browser QA. Main/Cloudflare unaffected. Version still v0.9.20-beta; this entry is *not a release* or deployed version. No data schema change. Build/browser results pending latest CI; full artifact parity and isolated storage require verification before approval.


### 2026-10-25 — Hybrid Today screen source-level redesign (UNRELEASED)
- Design draft PR #123: Today presentation in `assets/js/10-nexus.js` + experimental CSS; responsive progress ring uses existing schedule percentage, Check-In action event classes preserved. All historical data and JS calculations unchanged. Workflow results pending. This is not a deployed release.


### 2026-10-25 — Phase 2 Stash hybrid visual preview (UNRELEASED)
- Draft PR #123 visual-only Stash CSS commit `157a4128`; layered inventory summary, elevated kit/vial surfaces, action control hierarchy and two themes. Source math/data unchanged. Branch-only; CI and design approval pending; not a versioned production release.


### 2026-10-25 — Hybrid Stash refinement pass 2 (UNRELEASED)
- Draft PR #123 code `e29cb50f` / `5134978f`: native-style category segments, toned-down Inventory Overview and kit gradients, structured Needs Attention list, modal styling baseline. No data migration or logic change. Latest-head QA pending. Not merged or deployed; production unaffected.


### 2026-10-25 — Visual cleanup candidate (NOT RELEASED)
- Design PR #123 commit `7fa1a893`: reduced kit-button shadow, paired Today CTA consistency, Needs Attention rail removed. Visual-only CSS; no migrations. Latest-head tests pending, no production deployment.


### 2026-10-25 — Kit-card action hierarchy Phase 2D (UNRELEASED)
- Draft PR #123 commits `bba65429` and `ac9a4f27`: remove persistent Prepare button from Stash cards, retain menu Prepare and global shortcut; responsive two-action card styling. Data impact none; branch-only candidate pending QA. No production changes.


### 2026-10-25 — Inventory source allocation clarity (UNRELEASED)
- Draft PR #123 source commits `3875da06`/`74228713`: numbered source labels, kit identity and explicit Draw confirmation wording, CSS grouping. Previous Stash open-card test updated `3dc44b22`. Math and persistence logic unchanged; testing and design approval pending. No production deployment.


### 2026-10-25 — Stash modal audit / responsive control preview (UNRELEASED)
- Draft PR #123 audit doc `1a2c3540`, CSS `0bd28df5`: larger Prepare count hit targets, readable concentration output and 50px buttons. No data changes; latest-head QA/visual signoff pending. No production merge or deployment.


### 2026-10-25 — Today lower-page visual refinement (UNRELEASED)
- Draft PR #123 CSS commit `287cd89d`: schedule nav, compact cards, facts, actions and chevrons. Functional renderer/recorded data unchanged. Expanded rich card parity and iPhone visual validation still incomplete; no merge/deploy.


### 2026-10-25 — Today expanded/tracking/week visuals (UNRELEASED)
- Design PR #123 commits `685a6aab` and `593e6d19`: expanded compound presentation hook and scoped style treatment for expanded cards, tracking and weekly disclosure. Does not alter dose logic or saved records. Browser visual/functional QA pending; no release.


### 2026-10-25 — Today expanded-card follow-up
- 2026-10-25 Today expanded detail hierarchy coded at 464e07de + fd66a187; branch-only, not merged, not deployed. No storage or math migrations. Exact-head QA and release artifacts INCOMPLETE.


### 2026-10-25 — Segmented Today information follow-up
- PR #123 preview commits cf74e60b and 6ff6ec2c: Today expanded card gained segmented Insights, History, Details; moved site rotation notice into Insights and removed rotation emoji. No intended dose data, schedule, storage or math changes; no merge or deployment; exact-head test/artifact status NOT VERIFIED.


### Today compact action cleanup
- 2026-10-25 PR #123 CODED / NOT MERGED: Today UX clarity follow-up, commits c0124a0, d969527, 8b27bab. Affects compact card disclosure/action row and expanded history menu/helper. No dose math, localStorage migration, or production user data writes. LIVE ZIP / FULL isolated DEMO artifacts and latest head QA still INCOMPLETE. No Cloudflare deployment.


### Log Dose preview trial
- 2026-10-25 PR #123 preview-only code 2dfae668: conditional expanded Log Dose presentation, no changes to doseModal or storage. Browser and physical iPhone NOT TESTED, deployment unverified; no merge to main.


### 2026-10-25 — Log Dose preview release checkpoint
- 2026-10-25 — DESIGN PREVIEW CODED / CLOUDFLARE PREVIEW DEPLOYED / PRODUCTION UNCHANGED. PR #123 commits 0819acc1, 9fe7803. Today compact scheduled dose CTA, overdue entry, completed state and conditional action styling. No localStorage schema or accounting logic migrations intended. Cloudflare reports success at 9fe7803; preview https://fce7e142.nexuspeplog.pages.dev. Exact-head full browser/iPhone acceptance INCOMPLETE. GitHub LIVE/DEMO bundles must be validated against final branch head before release.


### 2026-10-25 — Today expanded screenshot audit
- 2026-10-25 preview-only PR #123 commits 4c1ba682, 56f215c8, 59c6e7b6: expanded Today overdue de-duplication, visual timing/data hierarchy, per-occurrence labels and hit targets, completed-state notice. No persistent schema, calculation or inventory edits intended. QA NOT TESTED at this head. LIVE ZIP/isolated FULL DEMO INCOMPLETE; Cloudflare and merge not verified/authorized.


### 2026-10-25 — Critical preview syntax hotfix
- 2026-10-25 unreleased preview hotfix on draft PR #123: `77de882432af2ec48a0d44b3342af13f5b68df26` repairs missing `}` in `assets/js/08-nexus.js` expanded completed-dose presentation. Data impact: none intended; source code-only syntax correction. V8 syntax parse of scripts 07-12 PASS; browser UX, builds, Cloudflare deploy, physical iPhone NOT TESTED. No merge or production release. Standalone DEMO and LIVE ZIP INCOMPLETE.


### 2026-10-25 — Today card milestone consolidation
- 2026-10-25 — Draft PR #123 unmerged Today-card consolidation: `5ef99dea` heading/insight cleanup, `91cf8bce` Today invariant test, `99c12afc` CI gate. Data impact none intended; source assertions 14/14 pass by independent string inspection, but browser startup, runtime flows and physical iPhone are not yet validated. LIVE ZIP, full-app standalone DEMO INCOMPLETE. Not deployed to production.


### Today milestone — source-derived QA gate (2026-10-25)
- 2026-10-25 draft PR #123: 5ef99dea improved expanded text presentation; 91cf8bce + 99c12afc added Today source-invariant CI; b397ac12 + 0513998a changed preview QA to generate and test exact-source isolated full-app demo. Data impact: no migration or dose engine changes. V8 source parse PASS (12/12), source invariants 14/14 reviewed. Latest CI/browser, artifacts and deployment not verified. Not released.


### Today disclosure / typography parity (2026-10-25)
- 2026-10-25 draft PR #123 continued: shared disclosure/typography changes 1b4feb9f, 12da3fa7, 6405c0db, 853e58e3, b9cc9a7a, 4c52a898; tests 87a32f82, 5d555d70, 6fee66f0. Impact: Today compact, paused compact, expanded cards. Data changes: none intended; no schedule, dose, ledger or inventory algorithm modifications. JS syntax checks PASS; full browser/cross-theme parity and iPhone NOT TESTED. DEMO/LIVE artifacts not delivered; no production release.


### Today grouped correction pass — 2026-10-25
2026-10-25 PR #123 draft changes c38b9a0 and bdb0da6: Today expanded disclosure CSS, insight grouping, Intel button, record-grounded protocol review copy. No dose math, localStorage, history or migration changes intended. JS 08 syntax checked by V8. Browser QA, 320/390 screenshots, full-app artifacts and Cloudflare preview NOT VERIFIED. Not released.


### 2026-10-25 — Root disclosure and Insight cleanup
- 2026-10-25 unmerged design PR #123 commits 77a86a43, e2245f91, 74409b57, 353b2a31: remove legacy double-chevron generator, reconcile nested insights CSS, update current-source invariant, neutralize speculative phase descriptions. Changes affect Today display and QA only; no changes to stored records, dosing engine or inventory. JavaScript parse PASS for changed module; full browser regression pending; DEMO/LIVE artifacts INCOMPLETE; Cloudflare preview and production deployment not verified/authorized.


### 2026-10-25 — Root cause of persistent duplicate chevron / insight borders
- 2026-10-25 draft PR #123 corrections d4174ac0 (source of duplicate generated-chevron in nexus-disclosures.css), b6222ea9 (remove unnecessary outer Insights border and per-entry dividers), f65255af (CI guard checks). No application storage, history or dose math changes. Browser visual pass and physical iPhone NOT VERIFIED. LIVE ZIP and full isolated DEMO artifacts INCOMPLETE. No release.


### 2026-10-25 — Compact Today divider correction
- 2026-10-25 PR #123 unmerged preview correction: 73ec2a05 targeted compact-card divider CSS; 4208fe9b source regression assertion. No storage, dose, or inventory logic changes. Browser rendered QA NOT TESTED at this commit. DEMO HTML/LIVE ZIP INCOMPLETE; no production release.


### 2026-10-25 — Unreleased candidate: Today 2.0 (DRAFT, NOT A RELEASE)
- PR #123 design/design-system-2-preview-20261025, ongoing implementation based on user-approved interactive Today design.
- Source commits include Protocol regression test replacement `0ea163c`, saved tracking + activity sections `8e14733`, handlers `73dc37b`, styling `b0dcf5f`, upcoming `3c8e952`.
- Changes to Today and test suite; optional non-destructive settings preference addition, no dose/inventory/storage migration.
- Status: coded; not verified as fully passing, not merged, not deployed, physical iPhone not tested. Release artifacts/manifest and final version-to-commit mapping INCOMPLETE until passing CI and authorized release.


### 2026-10-25 — PR #123 continued; unreleased hybrid Today candidate
- Additional candidate commits: `ebfd769` weekly reporting consolidated under Your Activity, `07c3d42` period persistence on rerender, `e11a69f` reschedule/canonical week collection and adhoc exclusion, `9f9aafc` Protocol History tab test parity, `29d81b1` Stash selector QA parity. No version bump or live release authorized.
- Release/artifact state INCOMPLETE pending exact-head green full-app tests and independent package review. CI pass on individual suites does not supersede failed full workflow. Cloudflare not deployed by these commits; real iPhone untested.


### 2026-10-26 — PR #123 Today pre-release QA candidate (NOT DEPLOYED)
- QA/code corrections: 3f128dc (relocated weekly disclosure test), ef600d1 (restore exact CSS path), 640d594 (default-dark computed-gradient and 320/390 bounds assertions).
- Full GitHub Actions build & parity run 40267178763 PASS; mobile form regression run 40267178912 PASS. Downloaded artifact 12627006318 independently inspected for LIVE ZIP complete 21 files and standalone full-app DEMO inline CSS/JS. Local Chromium screenshots for Today 320/390 both themes verified gradient and tap/action behavior, not physical iPhone.
- Version metadata unchanged v0.9.20-beta (unverified publication). Draft PR #123 remains open, no merge, no Cloudflare production deploy. No production storage/data migration. Final release commit, version bump, deployment verification and real-device acceptance remain INCOMPLETE.


### 2026-10-26 — Calendar 2.0 initial implementation, UNRELEASED
- Draft PR #123: `ef93fc2` Calendar Week/Month activity overview, `060c583` categorized selected-day source-backed records, `5480de2` Calendar hub CSS, `9ed4c89` eight-case browser QA assertions. Affected Calendar screen, zero destructive migrations, Today weekly pulse unchanged.
- Candidate NOT a release: tests, final packages, iPhone, merge and deployment still incomplete.


### 2026-10-26 — Calendar 2.0 candidate validated, NOT RELEASED
- Source commits: `ef93fc2` activity hub, `060c583` categorized day records, `5480de2` visual styles, `9ed4c89` browser tests, `ce2b54e` cross-month week integrity. Test updates `4f63119`, `137adc0`, `ed0fc8c` align protected Today controls with approved compact weekly pulse.
- 320/390 dark/light LIVE/DEMO full QA run `40273196256` PASS, mobile run `40273196254` PASS; download artifact #12629580963 inspected (full 21-file LIVE package + standalone isolated full DEMO). No production migrations. Version metadata remains v0.9.20-beta; no new release label authorized.
- Draft PR #123 open/unmerged, Cloudflare preview/production parity and physical iPhone remain NOT VERIFIED. Calendar analytics trending/filtering/history edit UX remains subsequent implementation before sign-off.


### 2026-10-26 — Calendar Logs Day/All candidate, UNRELEASED
- PR #123 draft: `e465049` source-backed Day/All log journal with outline icons, `044f9c7` handlers, `6d921a0` Calendar selected-date handoff, `5c7e241` responsive styles, `aa84611` browser QA extension. No historical data rewrite or schema migration, existing editing handlers preserved. Full QA and LIVE/DEMO package acceptance pending; no merge or production deployment.


### 2026-10-26 — Logs Day View navigation candidate (unreleased)
- Commits `25b5124` date controls, `bcb8cd7` handler, `8d2c616` styling, `5167a87` browser tests; builds on existing Day/All journal. No saved data migration; candidate on draft PR #123. Latest full build/isolated DEMO artifacts and preview deployment not yet verified; no merge/release.


### 2026-10-26 — Logs candidate QA verified, NOT DEPLOYED
- Candidate at `5167a87`: complete QA workflow `40275552699` and mobile `40275552720` PASS. Artifact #12630341125 inspected: complete root LIVE ZIP, standalone isolated full app DEMO. No storage migration. PR #123 remains draft, no production deployment/Cloudflare parity confirmation. Final version remains v0.9.20-beta pending approved release.


### 2026-10-26 — Logs current candidate QA evidence, still UNRELEASED
- Latest tested PR head `3eb6bf4`, full pipeline `40276022471` PASS, mobile forms `40276022466` PASS, exact-source artifact #12630810614 inspected: 21-file LIVE ZIP, self-contained isolated DEMO, 16 log screenshots across viewports/themes and LIVE/DEMO. Existing version metadata v0.9.20-beta; no schema changes or saved-data migration. Draft PR #123 unmerged; Cloudflare deployment and physical iPhone not verified.


### 2026-10-26 — PR #123 Calendar Logs validation checkpoint (DRAFT, NOT RELEASED)
- PR #123 head `d6e3dfc4bf60592c7eb7296aa3038785d40fbef7`; source main base `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e` at observation. User-approved Calendar Logs Day View + All Logs coded on design branch; not merged or deployed.
- Mobile forms workflow 40334643562 PASS; full release workflow 40334643538 exact-source build/required files steps PASS, browser matrix still in progress and downloadable artifacts unavailable at observation. Physical iPhone NOT TESTED. No production data touched; migration effect requires final source review. This entry records QA progress only, not a new release.


### 2026-10-26 — PR #123 optical patch (CODED; NOT RELEASED)
- Scoped Add Log plus-only, tile centering/wrapping, and Today This week label gap to hybrid CSS. New automated mobile matrix assertions added. Branch commits `799f254` CSS and `bf5a4b1` test. No saved-data migration or business logic changes. New CI, artifacts, physical iPhone approval and deployment **PENDING**. Draft PR #123 remains unmerged.


### 2026-10-26 — Sprint 01 physical iPhone acceptance (CONDITIONAL, NOT RELEASED)
- User reported PASS WITH MINOR VISUAL ISSUES and requested Calendar Month icon modifications. Exact correction pending clarification and implementation. Full browser/build workflow 40339121469 PASS, mobile workflow 40339121261 PASS at pre-doc head 375b8879. No Sprint 01 final acceptance or production release claim. No app code or data migration in this docs-only checkpoint; PR #123 stays draft/unmerged.


### 2026-10-26 — Sprint 02 Stash card visual patch (DRAFT; UNRELEASED)
- Commit `76f232d` adds long-kit-name wrapping, 44px Manage action, focus outlines and narrower-tab labeling in hybrid CSS. Affected: Stash kit cards only. Data impact: none (CSS only). **New-head QA and physical iPhone checks pending;** no LIVE/DEMO artifact claim for this commit, no merge/deployment.


### 2026-10-26 — Sprint 02A Protocol visual refinement (DRAFT; NOT RELEASED)
- Prior head `137306ab`: workflows mobile 40341448639 PASS, browser/build 40341448649 PASS, validating prior Stash patch.
- Protocol CSS commit `6479eea`: improved card spacing and long-name wrapping, minimum 44px controls, keyboard-visible focus and compact viewport styling. Affected: Protocol cards and existing disclosure/actions; no JS, business logic, storage or migration changes. Latest-head QA, complete LIVE/DEMO artifacts, physical iPhone and deployment **pending**. Draft PR #123 not merged.


### 2026-10-26 — Sprint 02 vial form layout (CODED, UNRELEASED)
- Commits `d21f2cf` (shared form grid class) and `e6eacc6` (responsive field layout and visible confirm/focus). Affected: Stash Open New Vial sheet for blends and singles. No data migration or business-logic change. Fresh-head CI/browser and physical iPhone tests **NOT YET VERIFIED**. Draft PR #123; no deployment.


### 2026-10-26 — Sprint 02A Protocol + Plans actual implementation (DRAFT, NOT RELEASED)
- `3d318602` actual Protocol card markup current phase/schedule and collapsed goal details; Goals/Research styling hooks. `0f1fd7eb` hybrid responsive Protocol/Plans CSS. `3063af12` Manage sheet header structure for Protocol and Plans; `666e2483` shared accessible action sheet styling. Affected: Protocol cards/details/action sheets and Plans Goals/Research cards/action sheets. Existing navigation and handlers retained. No data migration. QA and same-source release artifact verification **PENDING**; production untouched.


### 2026-10-26 — Protocol interior features (DRAFT, NOT RELEASED)
- Verified current draft source includes `protocolCountdownSummary`, `protocolCompletionCelebration`, and compound `phaseRoadmapModal`, with existing phase alert configuration. `177e25fa` corrects paused roadmap marker day. Data impact: none from marker correction. Latest-head tests, full-app packages and physical iPhone QA incomplete; no deployment.


### 2026-10-26 — Protocol interior enhancement candidate (DRAFT / UNRELEASED)
- Commits `de2ee577`, `6cdd1174`, `7b0c2b9`, `94b66f88`: per-protocol countdown from existing phase data, in-card per-compound roadmap shortcuts and current phase interior, post-confirmation completion celebration (reduced-motion support), existing in-app phase reminder ID collision fix. Screens: Protocol cards, phase roadmap modal, completion modal, in-app notifications. No storage migration or inventory/dose math modifications. QA, FULL DEMO HTML/LIVE ZIP and physical iPhone tests PENDING. Draft PR #123 unmerged, no deployment.


## 2026-10-26 — Approved vertical phase timeline
DRAFT UNRELEASED: `e87e984b` vertical compound roadmap HTML and `8ecc6caf` responsive CSS. Visual-only; no data migrations. QA/latest-head DEMO/LIVE artifacts pending; no deployment.


### 2026-10-26 — Expanded Protocol detail refinement (DRAFT, UNRELEASED)
- `fd6fda06`: remove duplicated mini Gantt/route pill/dose-status cluster and show current compound phase progress rows; `23f3d666`: mobile responsive CSS; `da015ec0`: Plans Research ellipsis contrast adjustment after browser QA 40351719788 failed assertion at validate-plans-hierarchy.mjs:180. Affected: Protocol expanded card and Plans Research ellipsis styling. Data impact: none expected (markup/CSS only). Latest-head browser/mobile QA and exact-source full-app artifacts pending, physical iPhone untested, PR #123 unmerged/deployment unchanged.


### 2026-10-26 — Protocol dedicated overview (DRAFT, NOT RELEASED)
- `89f33fbe`: actual Overview/Compound/Completion detail surface and phase-aware progress ring; `be3fa15f`: list card View protocol overview action; `3c10f974`: action binding; `c8353f0e`: responsive CSS. Preview concept source is user-approved, implementation and exact-source parity NOT TESTED. No data schema or dose migration. Latest-head CI/real iPhone/full-app standalone DEMO/LIVE ZIP incomplete; PR #123 unmerged.


### 2026-10-26 — Protocol detail status semantics (DRAFT)
- `5764db48`: fix detail Overview active status `In progress` and paused status precedence over elapsed schedule. Presentation only, no user data migration. Latest-head QA, full-app DEMO/LIVE ZIP, physical iPhone validation incomplete; PR #123 draft and production unchanged.


### 2026-10-26 — Protocol list/Overview IA cleanup (DRAFT, NOT RELEASED)
- `ed6b984a` removes duplicated Compound/Completion tabs and list-card expanded details, preserves Overview with compound roadmap and Manage action. `48784383` computes list progress using pause-aware scheduled phase dates; `0d3a3d33` compact card CSS. Affected: Protocol list and dedicated detail navigation. No schema or recorded dose/history changes. QA, user iPhone acceptance, standalone full DEMO/LIVE ZIP, merge/deployment incomplete.


### 2026-10-26 — Navigation QA corrective commits (DRAFT, UNRELEASED)
- `49484971`: replace obsolete Protocol chevron regression assertion with approved end-to-end navigation journey in 8 LIVE/DEMO × 320/390 × light/dark contexts. `80289b93`: Plans Research management control background selector specificity fix. No schema/data changes. New CI and full-app artifacts pending at documentation time; no merge/deployment.


### 2026-10-26 — Sprint 2A QA candidate verified (DRAFT, NOT RELEASED)
- Verified PR head `17112406`, merge SHA `c6885efd`: mobile run 40359787123 SUCCESS, build/parity run 40359787121 SUCCESS. GitHub artifact 12667882258 contains 2.49 MB standalone FULL DEMO HTML, 0.88 MB offline DEMO ZIP, 1.79 MB 21-file LIVE ZIP and QA evidence; manifest reports ephemeral demo storage and no sync, physical iPhone untested. Browser matrix 8 cases and amended chevron navigation 8/8 PASS; Plans Research contrast 8/8 PASS. Cloudflare mismatch expected because draft not deployed. Commit `b155134c` adds screenshot capture; latest-head screenshot run pending. No data migration, merge, deployment, or published version bump.


### 2026-10-26 — Screenshot visual QA refinement (DRAFT)
- Successful merge-ref test `2adf5eea` completed mobile and full-browser suites, produced full DEMO HTML, 21-file LIVE ZIP, offline demo ZIP and 16 Protocol screen captures. Inspecting captures revealed opening-frame fade/blur, so `2d67b356` adds 450ms settling and bounds checks to visual QA; latest-head visual validation pending. Application data/code unchanged by test correction. PR draft, no release.


### 2026-10-26 — Sprint 02A validated DEMO candidate (DRAFT / NOT DEPLOYED)
- Test merge source `08bd02b7`, PR branch head `ae49c851`: GitHub browser/build 40361824665 SUCCESS; GitHub artifact 12668996607 contains COMPLETE isolated standalone FULL DEMO HTML, offline full-app DEMO ZIP, 21-file LIVE ZIP, QA reports, and 16 320/390 light/dark LIVE/DEMO Protocol screenshots. Downloaded and verified archive integrity. Screenshot settle test `2d67b356` validated final state. No code/schema/data migration; stored production history untouched. Physical iPhone review, VoiceOver, and Cloudflare/GitHub Pages deployment NOT performed. Version manifest still `v0.9.20-beta` as draft baseline; not a new published release.


### 2026-10-26 — Plans/Protocol contextual navigation (DRAFT)
- `3b692b1e`: Goals Connections linked protocol action opens Protocol Overview; singular compound count fixed. Existing Protocol Overview linked-goal path retained. No schema/data changes. Latest-head QA/artifacts pending; no merge/deploy.

### 2026-10-26 — Goals-first Plans UI (DRAFT / UNRELEASED)
- PR #123; commits `8393d955` and `1ead81b6`. Affected Plans → Goals list: title/status/date hierarchy, honest measurement summary and progress track, connected-protocol count, unified details target, 320px adaptation.
- Progress is read-only from existing `progressModel` and comparable recorded weight logs; no saved state/schema/measurement/dose migration. Original goal detail navigation and management remain.
- QA for new head, complete full-app DEMO/LIVE packages, iPhone and VoiceOver all **NOT VERIFIED**. Draft/unmerged; Cloudflare remains unchanged.

### 2026-10-26 — Goals visual density correction (DRAFT)
- `457652a8`, `f5be4806`: remove duplicate Plans counts, shorten repeat progress copy and tighten Goal cards while retaining detail/management handlers. No data schema change; newest-head QA/artifacts and iPhone acceptance pending. Not deployed.


### 2026-10-26 Approved Goals preview restored (DRAFT)
- Commits d98d7b78 and 7727191f restore originally accepted spacious Goals card in place of compact experiment. No migration. New-head QA pending; not deployed.

### 2026-10-26 — Goal Add/Edit four-stage wizard (DRAFT / UNRELEASED)
- PR #123: `23aa6e04` wizard markup reusing existing controls; `d7a8026c` hybrid theme/step styling; `a44cdcb8` preserve unsaved progress method choices. No intended schema or localStorage migration. Existing save handler still writes only on final Save. Latest-head QA/source-parity artifacts and physical acceptance incomplete. Log Dose unchanged; not deployed.

### 2026-10-26 — Goal wizard QA harness correction, DRAFT
- Commit `c9b6782c` changes Plans browser test to navigate wizard steps before field selection and saving. Pre-patch build/parity workflow 40386863855 FAILED (hidden Connections input). Other suites passed, but full release QA not passed. No production merge/deployment, new-head retest pending.

### 2026-10-26 — Goal wizard automated acceptance candidate (DRAFT, NOT DEPLOYED)
- Tested PR #123 head `701c6c7e`, workflows 40389965572 full build/Plans/browser SUCCESS, 40389965592 mobile SUCCESS, 40389962603 hybrid SUCCESS. Artifact 12684590713 contains builder-produced full-app LIVE/standalone fictional DEMO/offline demo packages; internal build assertions PASS, independent extraction pending. Data schema migration none intended. Physical iPhone/VoiceOver and contrast-wide acceptance pending; PR draft/unmerged and production unchanged.

### 2026-10-26 — Quick/Guided Log Dose UI (DRAFT / UNRELEASED)
- `56d0b7ef` existing dose form step-navigation and `69dace51` styling. No intended dose schema or storage changes, existing `#save` remains authoritative. Full separate Quick review and source allocation evidence in Guided review require further implementation. New-head CI, packages, Safari/VoiceOver incomplete. No merge/deploy.

### 2026-10-26 — Log Dose Review gate + validation (DRAFT)
- `2649a11a` implements separate Quick final Review and Guided final Review, positive amount/date Continue validation and original Save visibility gate; `c0b882d0` styles sticky step controls and errors. No migration or intended dose math change; automated/physical verification pending, no merge/deploy.

### 2026-10-26 — Draft Log Dose source-review iteration (UNRELEASED)
- `3fe3f1a9` structured allocation review, `631c36a8` browser regression helper follows final Review, `14981bf6` visual refinement. No storage change. New-head full QA, exact-source artifacts, manual mobile testing pending. No merge/deploy.

### 2026-10-26 — DRAFT source identity review (NOT RELEASED)
- `8abba0bb` source ID/selected vial/prepared batch readout; `fb8a7c40` browser assertions. No storage migration, no production release; latest-head QA and source-matched artifacts pending.

### 2026-10-26 — Goals Add Goal top placement (DRAFT / UNRELEASED)
- `efbbd544`: moves existing Add Goal action to top of Goals section and removes bottom duplicate; `7706e8f7`: responsive 46px header styling. No schema or persistent data changes. New-head automated/mobile/physical QA pending; no merge/deploy. Next: Research and Shopping design audit.

### 2026-10-26 — Research card density and Shopping action placement (DRAFT / UNRELEASED)
- `5a060265` Research header/card semantic structure and single Intel chevron, `dd654713` chevron-free Show/Hide notes disclosure, `fca17f95` Shopping top Add Item, `cbd286c4` hybrid spacing/focus CSS, `477e6e59` and `d860c2d9` research browser assertions. No persistent schema modification and existing Add/Edit/Intel/inventory actions retained. Latest-head CI, full-app DEMO, LIVE ZIP and physical iPhone signoff INCOMPLETE. PR #123 draft/unmerged.

### 2026-10-26 — Plans Goals-default and single Research separator (DRAFT)
- `d794a215` More→Plans defaults Goals; `daf9acdb` generic quick Plans same; `af4cd980` single Intel divider; `d4a5b488` regression assertions. Existing source data, add/edit forms and workflows untouched; no storage migration. Prior head `1d0815d4` full/mobile/hybrid success, new-head QA and exact-source packages pending. No merge/deployment.

### 2026-10-26 — Research/Shopping Add/Edit visual parity (DRAFT, UNRELEASED)
- `d4a55d5e` shared labelled modal markup; `23064980` spacing, 46px form fields, 48px sticky save, theme colors, focus and reduced motion; `9ddfac17` regression assertions. Saved field definitions and original save code retained, no schema change. Prior `c7ffe1bb` all three QA workflows SUCCESS, latest commit QA and artifacts not verified. No merge or production deployment.

### 2026-10-26 — Stash kit editor parity polish (DRAFT / UNRELEASED)
- `9cfb316e`, `8a223e78`, `bdd7532c`, `9b03db6c` add form styling hooks, SVG navigation, light border polish and validation assertions without changing inventory handler math or data schema. New-head QA, complete artifacts, and physical iPhone NOT VERIFIED. PR #123 remains draft/unmerged; no production deploy.

### 2026-10-26 — Proposed guided Add/Edit Kit and Prepared screens redesign (DESIGN ONLY)
- User-requested design study and Stash secondary-screen audit; no new kit/prepared workflow implementation, schema migration, merge, or deployment. Retain same original inventory/save calculations. Draft PR #123 remains unmerged.

### 2026-10-26 — Stash guided wizard source reconciliation (DRAFT / NOT RELEASED)
- PR #123 branch head `5a9d6c7a` already contains three-step ordinary Kit wizard and searchable compound picker in `assets/js/07-nexus.js`; previously documented as merely proposed. Found during code review; no new app code, storage migration, merge or deployment in this documentation update.
- Current-head PR workflows 40417820123 mobile and 40417820282 build/parity SUCCESS. Artifact 12696280782 exists but extraction and source integrity unverified; real-device/VoiceOver and blend parity NOT TESTED. Separate authoritative inventory handler remains. Proposed design not accepted as finished.

### 2026-10-26 — Guided Blend Kit and browse selector (CODED DRAFT / NOT RELEASED)
- PR #123 `design/design-system-2-preview-20261025`: commits `8f47c431`, `c28302e9`, `0af72826` add 3-stage blend editor layout and screenshot-inspired compound browse/search picker with responsive CSS. Reuses `#bk-save` inventory pathway and in-memory composition input values; intended no data schema or storage migration. Existing opened vial and recorded dose accounting must be verified, not assumed.
- Current-head CI, exact full-app DEMO/LIVE ZIP, physical iPhone and a11y tests PENDING. PR stays DRAFT/UNMERGED/UNDEPLOYED; no Cloudflare production change authorized.

## 2026-10-26 — Guided blend workflow acceptance follow-up
- User approved the three-step guided Blend Kit workflow and the screenshot-style dropdown with embedded search. Current source `assets/js/03-nexus.js` already includes a three-step blend wizard and component dropdown search, preserving original `#bk-save` handler. Review uncovered two BAC inputs on new blends (`#bk-bac` and `#bk-bac-edit`) with potentially divergent displayed review/save semantics. Existing edit must preserve opened-vial ratios and historical allocations. Do not merge/deploy until targeted validation, UI acceptance, and full-app artifact inspection. Next action: reconcile BAC UI and test blend save and history at 320/390 light/dark.

### 2026-10-26 — Guided Blend BAC single-source fix (CODED DRAFT; NOT RELEASED)
- PR #123 commits d87600cb, b1586e20 and 6407d532. Remove duplicated creation BAC field and reconcile `#bk-bac-edit` between Review and authoritative `#bk-save`; add cost/notes Review, and test create/review/save with fictional 10 mg + 5 mg blend. No intended schema migration, production writes, per-component accounting or history edits. Latest-head CI and independent DEMO/LIVE artifact validation pending; no merge/deploy or real iPhone acceptance.

### 2026-10-26 — Guided Stash iPhone rejection corrective branch changes (CODED DRAFT; NOT RELEASED)
- Physical iPhone screenshots show substantial UI failures in Add Kit and Blend: duplicated select, broken step count/action hierarchy, premature Save and default opened blend vial. User rejected the design. Targeted fixes on draft PR #123 regular Kit staged save/combobox, Blend editable combo + sealed default, consistent CSS, progress count removal and browser regression assertions. No planned data migration, authoritative inventory handler/maths unchanged. Newest-head QA and exact-source full-app DEMO/LIVE artifacts NOT VERIFIED; no merge or deployment.

### 2026-10-26 — Guided Kit corrective QA fails (DRAFT, NOT RELEASED)
- Source UI fixes at `b8f8f2db` mobile run `40421697072` PASS, full build/parity `40421697164` FAIL at browser QA step. Exact error not retrieved; release artifacts not verified, physical iPhone acceptance outstanding, no merge/deployment. Draft PR #123 remains open.

### 2026-10-26 — Stash test harness correction (DRAFT, unreleased)
- `6d209ed5` updates outdated card QA for guided Kit staged Save: hidden before Review, visible and >=44px on Review. Triggered after full build `40421697164` failed on hidden-button sizing; preceding Stash Actions, Combo, Log Dose, vial-source checks passed in that run. New-head CI and artifacts pending; production unchanged.

### 2026-10-26 — Guided Stash correction automated candidate (DRAFT / NOT RELEASED)
- At `6d209ed5`, GitHub mobile workflow 40422263763 SUCCESS and browser build 40422263758 SUCCESS after test updated to navigate to Kit Review; original authoritative inventory handlers unchanged. New later test-only commits ed77a3e7 and dac2ba4a capture 320/390 × dark/light × LIVE/DEMO real Kit/Blend step screenshots. Their CI and images pending independent inspection. Production unchanged; no iPhone acceptance or merge/deploy.

### 2026-10-26 — Candidate package inspection (NOT RELEASED)
- Successful source build 40422263758 at app/test SHA 6d209ed5 produced artifact 12698436592. Downloaded and verified 21-file ZIP, root index, standalone full-app DEMO, manifest source merge ref 7203418d, and Stash Actions/Cards QA reports 8/8 each. Physical iPhone acceptance not achieved; new screenshot-run CI pending; no merge/deployment.

### 2026-10-26 — Guided Stash visual rejection follow-up (DRAFT, NOT RELEASED)
- Inspected actual browser captures from preceding Actions artifact 12698781391 and discovered poor button hierarchy, unstyled ordinary review rows and wasted Blend preparation space despite passing automation. Targeted draft CSS/markup changes 83d374c3, be382d87, 4d34e265; screenshot settling and CSS regression 7eb10d09, e29d2443, 5129b2d3, 5f210026. No intended schema, stored record or inventory math changes. Full build/visual tests on latest app source and independent full-app LIVE/DEMO checks pending; PR #123 unmerged and production unchanged.

## 2026-10-26 — Guided Stash screenshot-led polish (DRAFT)
- Inspected actual source-generated 390px dark Kit/Blend screenshots from artifact `12698781391` (run `40422827201`, SUCCESS): regular Review values collide with labels; Step 2 Continue renders as a text link; Blend footer also has detached Continue styling. New CSS commit `4a1e090b` makes Continue a 48px full-width lavender button, Back a 48px secondary control, Review a two-column wrapped label/value grid, and normalizes Blend sticky footer. No data model or save-handler change.
- This is a corrective UI candidate, NOT approved on physical iPhone. Re-run newest-head CI, inspect 320/390 both themes and actual step screenshots. No merge/deploy without user approval.
- **ONE NEXT ACTION:** Inspect newest-head browser screenshot artifact for action visibility, scroll, keyboard and review readability; confirm iPhone user acceptance before merge.

### 2026-10-26/27 — Guided Kit/Blend screenshot-led corrective candidate (DRAFT, NOT RELEASED)
- PR #123 at head `455404bb`, baseline main `c1c95e1`; tested PR merge ref `d4e0ff1d`. Changes: unify stage progress and sticky 48px CTA; conceal native backing compound selects, expose one editable browse/search field; sealed blend default; consistent persistent Blend header; separate legible Kit Review rows, full-width Blend compound search fields and concise instructions. Existing authoritative `#ssave` and `#bk-save`, inventory ID/schema/history and component allocations untouched; no migration intended.
- Tested: mobile Actions `40424506766` SUCCESS, full build and eight-configuration browser parity `40424506746` SUCCESS. Downloaded artifact `12699630393`: version display remains `v0.9.20-beta` draft baseline, 21-file root-index LIVE ZIP 1,807,846 B, isolated standalone complete DEMO 2,564,463 B, 112 screenshots; manifest source `d4e0ff1d` matches PR merge-ref. Independently inspected 390 dark/light regular/blend Step 1/2/Review and 320 dark Blend Step 1. Physical iPhone/VoiceOver and exhaustive blend ledger refund testing NOT VERIFIED. Branch remains draft, unmerged, undeployed; no production data modified.

### 2026-10-26 — Blend component one-row UI (CODED DRAFT / UNRELEASED)
- PR #123 `a9a3643e` stylesheet now places compound search, per-vial mg and remove in one responsive row; `269f468d` adds multi-viewport browser assertion. No data migration/inventory math modification. QA and artifacts pending; production unchanged.

### 2026-10-26/27 — One-row Blend browser-tested candidate, clipped-placeholder correction (DRAFT/UNRELEASED)
- Exact app/test commit `269f468d`: mobile 40426868694 and full-browser 40426868293 SUCCESS; artifact 12700776008 downloaded and checked: complete full-app DEMO, 21-file root-index LIVE ZIP, Stash Actions 8/8; four 320/390 dark/light Blend step-one screenshots independently inspected and same-row layout correct. Review exposed truncated placeholder, so later draft commit `3bab1d9a` uses shorter `Search…`, with latest CI pending (40427570891, 40427570879). Authoritative blend math/storage untouched; PR draft/unmerged/undeployed, no physical iPhone acceptance.

### 2026-10-26/27 — One-row Blend candidate verified in browser (DRAFT/NOT RELEASED)
- Code `a9a3643e`, browser assertion `269f468d`, compact placeholder `3bab1d9a`. Full-browser workflow `40427570891` SUCCESS with 320/390 × dark/light × LIVE/DEMO 8/8 Stash Actions; artifact `12700422861` extracted and independently verified ZIPs/source and four screenshots. Four-way visual shows compound, mg, remove aligned horizontally and `Search…` readable. No schema or authoritative inventory math changes. Mobile current-head `40427570879` awaiting outcome; physical iPhone signoff/VoiceOver outstanding. PR #123 remains DRAFT/UNMERGED/UNDEPLOYED.

### 2026-10-26 — Blend popup and Review UX follow-up (DRAFT; unreleased)
- Draft commits 416e6217, 7720cef8, 0ad6d4c8 and e130934c address an expanding compound list, opaque footer backdrop and flat Blend Review. Floating suggestions show up to five items with no list scrollbar; Review prioritizes blend identity, total mg and individual components. Additional mobile browser checks added. Production inventory handlers and data schema unchanged. Physical iPhone feedback and an app-wide nested-scroll audit remain outstanding. No merge or deployment.

### 2026-10-26 — Blend full-screen mobile editing candidate (DRAFT, not released)
- Commits 6db7acf7, 767c2ae8 and dd26fdc9 add full-viewport Blend editor for narrow phones, fix grouped Review CSS override and assert mobile modal geometry. This builds on floating picker / Review hierarchy revisions without changing blend IDs, storage schema or inventory accounting. Latest source QA and visual screenshots pending; no merge/deployment.

### 2026-10-26 — Full-screen Blend search/review candidate validated (DRAFT, UNRELEASED)
- Exact tested app commit dd26fdc9; merge-ref 723b06cb; GitHub Actions full build 40428711527 SUCCESS, artifact 12701700107 independently inspected. Source updates: floating max-five suggestion list, no row expansion; transparent footer; hierarchical Blend Review; full-viewport mobile editor replacing short nested-scrolling sheet. Complete isolated full-app DEMO 2,572,777 B; 21-file root-index LIVE ZIP 1,809,501 B. Visual screenshots inspected 320/390 dark/light search and Review. No accounting, storage or historical data change; actual iPhone test and other modal audits pending, PR draft/unmerged/undeployed.

### 2026-10-26 — Approved compound browser foundation (DRAFT / NOT RELEASED)
- Commits c7b4784b, 3ecc008d, a2a9d24a, dcc32a6e, ad2b74b3, c7b06b2a: full-library browse-all screen added to single and blend kit compound comboboxes, five-option popup, cross-screen helper and 320/390 LIVE+isolated DEMO browser tests. No live schema, vial math, dose history or inventory handler changes. Mobile QA pass 40430545528; full build, exact-source full-app artifacts and real iPhone acceptance pending. PR remains draft, unmerged, undeployed.

### 2026-10-26 — Full-library browsing QA candidate validated (DRAFT / UNRELEASED)
- Application/test SHA c7b06b2a passed mobile 40430545528 and full browser 40430545381. Artifact 12702105755 exact-source full-app DEMO (2,578,053 B) and root LIVE ZIP (1,810,764 B; 21 valid files, ordered JS) independently downloaded/inspected; merge-source manifest 8069de53 parent is c7b06b2a. Independent Chromium browse-all tests also passed 4/4 at 320/390 dark/light, 45 fictional compounds, filter/choose, backing state unchanged except user selection. No migration, active production storage write, PR merge or deployment; physical iPhone and broader app-wide picker rollout remain pending.

### 2026-10-26 — Compound browser expanded to Protocol and Plans (DRAFT/UNRELEASED)
- Commits 8da177d2, 472c211b, 642b74d2, fd266141, cb1144af and 471fdeed implement reusable five-result and Browse All compound selector across Protocol Stack and Plans/Research multi-select, preserving original state and save paths; add browser regression tests and remove nested quick-list scroll. CI latest head pending, no source-matched artifacts inspected yet, no production data impact/migration/merge/deployment.

### 2026-10-26 — Protocol/Plans compound picker cross-screen QA verified (DRAFT, NOT RELEASED)
- Tested application source 471fdeed; GitHub Actions mobile 40432425967 and browser 40432426016 SUCCESS. Artifact 12703425376 manifest merge 15acd041 (parents main c1c95e1d and tested source 471fdeed), independent ZIP integrity PASS and extracted standalone full-app DEMO and 21-file LIVE ZIP. Independent Chromium 320/390 dark/light Protocol library browse/filter/selection passed 4/4. Production main unmodified; PR #123 draft/unmerged. No code fixes necessary for CI; physical iPhone keyboard acceptance, VoiceOver and global modal audit still incomplete.


### 2026-10-26 — Kit creation currency and footer parity (DRAFT / UNRELEASED)
- User screenshot feedback prompted unified Standard/Blend footer insets and expanded cost-currency selector for both kit workflows. Standard previously supported CAD/USD/GBP/EUR/AUD while Blend hardcoded CAD and lacked a selector.
- Draft branch code commits aaea7807 (blend input), 27675f3 (standard currency list), 7d1fad2 (footer inset), 4e7c685 (CAD display preservation). Validation updated in 7d19ea0 and 8307987 to cover non-CAD Blend save and selector choices. User requested a separate future mandatory-fields audit; no required-field migrations or new constraints implemented.
- Last previously completed full browser workflow 40441021070 SUCCESS and mobile 40441021069 SUCCESS **predate** these edits; latest workflow 40441896108 and mobile 40441896055 require status verification. Source-matched updated LIVE ZIP/isolated DEMO, native iPhone keyboard and visual reacceptance not yet confirmed. PR #123 stays draft, no merge or deployment. No existing data migration, kit math change or production write.


### 2026-10-27 — Standard/Blend Kit Step 2 parity (DRAFT / UNRELEASED)
- Draft PR #123 adds unified Cost/Currency paired layout, BAC water/Expiry pairing and common ordering, multiline Notes, matched optional labels, open-vial toggle treatment and 320px equal-width label alignment. Recent code includes `02e0ce9`, `f0bca60`, `551c13b`, and `9d3e54f`; tests `7dba19a` and `c131144`.
- Source-matched full-browser 40448545857 **SUCCESS** and mobile 40448545887 **SUCCESS**; artifact 12708814792 manifest source `fb6d089edf98b48d8e4b1ad2afc2be3357d9c9cf` with validated 21-file LIVE ZIP and standalone/offline full-app DEMO parity. No migration, production storage writes, merge or deployment. Blend Test Results initially partially behind sticky footer despite scroll-to-clear passing; real iPhone keyboard/safe-area approval outstanding. Mandatory fields/global nested scroll audits separately unfinished.


### 2026-10-27 — Supplies empty state + form/card hierarchy (DRAFT, NOT RELEASED)
- Draft PR #123 implemented user-approved compact empty Supplies state (5d85c6e, eaa92a3) and continuation into Add/Edit Supply form/populated-card styling (cb49d73, 5a8f1b6), tests (c6f1085, 49e2298, 327141d). Prior empty-state full CI failed due welcome overlay intercepting test click; corrected fixture on draft. No storage schema changes, changes to unit history, consumption, restock, forecaster or save actions. Latest head CI and artifacts unverified as of this documentation, no deployment or merge.


### 2026-10-27 — Supplies screenshot QA fixes (DRAFT / UNRELEASED)
- Full-browser runs 40451096484 and 40451199358, mobile 40451199390 PASSED for preceding source; artifact 12710184475 manifest 506244fe, integrity verified. Screenshot review uncovered onboarding-overlay capture (test fixture) and narrow 320px initial-status chip clipping (UI issue). Scoped test and CSS corrections at commits 248e1c2 and ef9f6fe, now awaiting complete latest-head CI/artifact acceptance. No changes to supply data shape, quantities or history; no merge, deployment or production writes. Native iPhone acceptance remains not tested.


### 2026-10-27 — Supplies corrected QA, still DRAFT/UNRELEASED
- Corrected fictional onboarding-overlay screenshot issue and 320px Initial Status button clipping (commits 248e1c2, ef9f6fe). Automated full-browser `40452358905` and mobile `40452358894` SUCCESS. Artifact `12711520065` source manifest `727686bae253bb5ef4f3a1c2cd4c25234dbdf86a`, 21-file LIVE ZIP integrity and 17/17 application blob parity confirmed, full isolated DEMO equals offline ZIP index, screenshots reviewed at 320/390 dark/light. No schema or inventory math modification, no merge/deploy or production writes. Native iPhone keyboard/VoiceOver and complete stateful Supply save/use/restock acceptance remain unverified; PR #123 retained draft.


### 2026-10-27 — First-dose Today and wizard polish (DRAFT / UNRELEASED)
- Draft PR #123 commits `b538f0f` (Today first-dose inclusion), `b1302de` (Back/Continue, start/target date labels), `20df1d9` and `1d2d412` (Protocol schedule groups/touch styling), `06c0617` and `9924be2` (Goal Check-In connection empty state). Preserves existing storage/schema, protocol sync, dose history and inventory handlers; no migration or production data mutation.
- Affected: Today hero summary, New Protocol Schedule/navigation, Add/Edit Goal wizard. At documentation time current-head browser/mobile CI, standalone full-app DEMO/LIVE ZIP and real-device acceptance are **INCOMPLETE**; do not inherit passes from older releases. PR unmerged, undeployed; production unchanged.


### 2026-10-27 — First-dose scheduling/wizard preview QA verified (DRAFT / NOT DEPLOYED)
- Browser/build run `40529783789` **SUCCESS**, mobile form run `40529783780` **SUCCESS** for test head `370a826e`; exact-source CI artifact `12746621222` (21-file LIVE ZIP, full standalone/offline DEMO equality, 320/390 dark/light Protocol browser suite 8/8). First-dose regression fixture verified Today `0 of 1` when eligible, absent when paused/future/other weekday. An earlier test-escape FAIL `40529630932` was corrected, not erased.
- Affected screens: Today hero, Protocol Schedule/Back-Continue, Add/Edit Goal/optional Check-In connection. Data impact: no migration or production write; canonical dose history and inventory code unchanged. Remaining limitations: physical Safari, keyboard, VoiceOver, full Goal wizard visual acceptance, more advanced multi-protocol scenarios. PR #123 draft/unmerged, no Cloudflare production deployment or user release signoff.


### 2026-10-27 — Expanded first-dose/wizard regression, code unchanged (DRAFT / UNRELEASED)
- Test-only commits `d48a0003` and `8771ce94` extend Protocol browser suite for distinct concurrent active protocols, two same-day occurrences for one compound, rest phase and read-only summary; plus Protocol/Goal wizard tap geometry and navigation checks. No new app logic, schema or UI changes, no production data effect. CI pending at documentation write; real iPhone Safari/keyboard/VoiceOver not tested. PR #123 draft/unmerged, no production deployment.


### 2026-10-27 — Preview discrepancy follow-up (DRAFT / NOT RELEASED)
- User reports that preview does not reflect Today first-dose fix. Previously asserted passing CI did not establish deployed preview SHA or user real-case scheduling behaviour. Draft changes `aa8472b` extend zero-dose Today first-dose eligibility to linked active/in_progress protocols and `ef7eb116` adds test through Protocol sync. No dose/inventory writes or schema changes. Latest source QA/artifacts and Cloudflare branch preview deployment pending; PR #123 draft/unmerged, production untouched.


### 2026-10-27 — Goal quick-status action sheet (DRAFT / NOT RELEASED)
- Draft PR #123 commits `e7f3df6` (status options and save), `9e055e1` (light/dark action sheet styling) and `4c32d42` (browser regression). Affects Plans > Goals ellipsis only. Existing saved goal schema/status values retained, no data migration, linked protocols/check-ins/history/inventory untouched by code; current-head CI and iPhone acceptance pending, no preview deployment verified. PR unmerged and production unchanged.

- Additional draft styling (2026-10-27): `acda2604`/`1c636bca` remove neon green from Protocol first-log status and align CTA to DS2 lavender, source check `172c1f07`. No data or handler changes; QA pending, not released.


### 2026-10-27 — Today header action alignment (DRAFT / NOT RELEASED)
- Draft PR #123 Today home view now composes bell, Profile and theme as one header action group, reused IDs/handlers; Goal quick status and Protocol first-log updates carried forward. CSS light/dark + 320/390 touch alignment, browser action regression added. No schema change, production localStorage or dose history writes. Latest-head CI and isolated artifact verification pending, physical Safari/VoiceOver not tested. PR remains draft/unmerged; no production deployment.

- QA corrective change `6dec6a49`: explicitly sets Goal quick-status touch options to 48px in modal, after failing rendered height assertion in browser run `40536801200`. Current-head outcome pending, production remains unchanged.


### 2026-10-27 — Log Dose review readability (DRAFT / NOT DEPLOYED)
- Draft PR #123 commits `befe2a2` (human-readable Review source and nested IDs disclosure), `b6d901b` (responsive scoped styling) and `988b315` (browser regression). Affects Log Dose Quick/Guided Review, Observations. Data impact: none by design; dose ID/source allocations, history, stock reconciliation and saves not rewritten; no storage/schema migration. Current-head 320/390 light/dark CI, source-matched LIVE ZIP and full DEMO, physical iPhone unverified at writing. PR unmerged, no production deployment.


### 2026-10-27 — Supplements / vial details / Prepare source UI (DRAFT / NOT RELEASED)
- Draft PR #123 commits `a9e54daf` inline daily supplement add, `15038801` Profile supplements cleanup, `86ae622a` retired Notion handler, `d24bbada` lavender inline styling, `647b1368` browser fixture, `84a00064` Stash vial detail hierarchy, `2eb7c11c`/`3da1a412` Prepare source responsive styling. No migration, no intentional changes to dosing, vial calculations, prior supplement histories or protocol source. Current-head CI + complete source-parity artifacts and physical iPhone QA pending. PR remains unmerged; no preview/production deployment confirmed.

- Draft extension: `78bafc1d` adds supplement-creation control in Check-In; `36b81eea` adds no-auto-log browser coverage. Prior records and save validation untouched. CI pending; not deployed.


### 2026-10-27 — Screenshot-driven Supplements and source-identity correction (DRAFT / UNRELEASED)
- PR #123 commits `4b8eaa67` reorder supplement add under search/browse/selected and replace main editable Log Dose Kit ID with readable source label plus optional IDs disclosure; `8df3711a` scoped source layout; `801b62a6` supplement order regression assertion. Screens: Check-In Supplements, standalone Supplements logger, Log Dose source details. Data impact: none by design; internal kit/vial IDs preserved and no migration. CI/full-app packages/device retest pending; PR draft, not merged/deployed.


### 2026-10-27 — DS2 screenshot fixes QA clearance and preview (DRAFT / NOT RELEASED)
- App head `e743c2fd` of draft PR #123 passed browser/package workflow `40549029521` and mobile workflow `40549029721`. Generated full-app LIVE ZIP (21 files) and ephemeral standalone/offline DEMO with application blob parity checks. Cloudflare bot confirms successful **preview** deployment `https://fd8194f6.nexuspeplog.pages.dev` for `e743c2f` (stable branch alias `https://design-design-system-2-previ.nexuspeplog.pages.dev`). No production merge/deployment, no migration and no change to production localStorage. Physical iPhone acceptance remains outstanding; preview files not independently fetched for hash comparison.


### v0.9.20-beta DS2 iPhone corrections — CODED ON DRAFT, NOT RELEASED (2026-10-27)
- Branch `design/design-system-2-preview-20261025`, PR #123 DRAFT and UNMERGED, baseline main `c1c95e1d`.
- Code `f2b31d2e`, style `aaf3998b`, tests `f39458e7`: unified search/Add combobox in Check-In and Supplements logger, standalone Add removed; Source identifiers disclosure full-width beneath source actions; existing separate optional Observations disclosure preserved.
- No planned production data migration, storage-key change, catalogue auto-log, allocation ID remapping, vial maths change or live user writes.
- Actions on `f39458e7`: mobile `40555517593` SUCCESS; full browser `40555517407` FAILURE at obsolete test DOM nesting assumption after disclosure relocation. Test locator fixed `e14d78e3`, current-head rerun PENDING; retain historical failure.
- Cloudflare bot reports immutable preview `https://bbdc78c4.nexuspeplog.pages.dev` for `f39458e7`; independently rendered content parity and physical iPhone acceptance UNVERIFIED. Full-app release artifact available from failed Actions run 40555517407 but NOT release-cleared until green CI and exact-source review. LIVE ZIP / complete isolated DEMO current-head delivery INCOMPLETE. No merge or production deployment.


### DS2 v0.9.20-beta latest-head test milestone — TESTED IN CI, UNMERGED (2026-10-27)
- PR #123 checked branch head `63a6a863`; full build/browser `40557050146` SUCCESS, mobile `40557050089` SUCCESS, hybrid preview `40557040475` SUCCESS. Source test-fix `e14d78e3` now validated.
- Actions artifact `12758495941`: complete source-based LIVE ZIP, standalone full-app fictional DEMO HTML, offline browser-opening DEMO ZIP. CI manifest source commit `bdd95f87753b21585b6bdf5b4821cd13686347f2` (GitHub synthetic merge SHA); branch byte-for-byte equivalence not independently established here.
- Automated matrix checks include 320/390 light/dark LIVE/DEMO; Check-In, Log Dose (40 flows), Protocol, vial source (48), stash/blends, other protected pages, math diagnostic 80/80; clinical safety and WCAG-AA independent acceptance not implied.
- Data impact: no intended schema migration or production writes. PR remains draft/unmerged, Cloudflare exact app asset fetch and physical iPhone validation pending; no production release.


### v0.9.20-beta post-dose reactions — PARTIALLY CODED, QA PENDING (2026-10-27)
- PR #123 draft branch, source commits `126ca799` (isolated reaction form/event on dose), `06177e4b` (scoped accessibility CSS), `24b98949` (end-to-end regression additions).
- Removes visible legacy Observations from new dose form and retains legacy fields on prior saved entries with data; new reaction records `observedAt` and `recordedAt` separately, `intensity`, `notes` on the existing dose ID. Existing inventory/dose math not intentionally changed. No destructive migration.
- Saved-dose Edit provides Record Reaction. Saved-dose action menu and post-save entry not implemented; cannot claim full approved UX complete. Tests/current-head artifacts, Cloudflare served hashes, iPhone and VoiceOver **PENDING/NOT TESTED**. Version candidate unchanged, no merge or production deploy.


### DS2 v0.9.20-beta — direct Record Reaction entry points (DRAFT / NOT RELEASED)
- App head 9d8ad41e adds Record reaction to compound dose-history row, saved-dose retrospective detail and Calendar day detail without opening Edit Dose. Existing standalone reaction form appends distinct events to same dose, preserving vial deductions and dose data. App-head mobile 40569192074 and full 40569192089 SUCCESS.
- Stronger targeted test commit 85afbd03 adds retrospective, three reactions, note-history and zero-deduction assertions; current-head CI PENDING. Cloudflare bot preview for app head https://d8c3286f.nexuspeplog.pages.dev reported successful, but no independent served-asset hash comparison or real iPhone acceptance. Complete FULL DEMO/LIVE artifact availability to verify from current-head CI; no merge, no production deployment, no schema migration.


### v0.9.20-beta — direct Record Reaction test milestone GREEN (DRAFT / NOT RELEASED)
- Source/test head 85afbd03: browser/build run 40569926373 SUCCESS; mobile 40569926374 SUCCESS. Test suite confirms 8 LIVE/DEMO 320/390 light/dark cases and Log Dose 64 flows including Calendar and retrospective direct reaction, 3 reaction history, legacy note preservation, unchanged vial counts and original dose ID. All fictional/isolated data; no production data exercised.
- CI artifact 12765770553 bundles full LIVE ZIP and isolated full-app DEMO. Cloudflare bot reports draft preview deployment https://32aef596.nexuspeplog.pages.dev for docs head a783546; raw served asset hashes and physical iPhone acceptance unverified. PR #123 remains draft/unmerged; no production release or migration.


### DS2 v0.9.20-beta — compound View details render hotfix (DRAFT / NOT RELEASED)
- User-reported draft-only render blocker: undefined fmtT when compound’s latest dose counts as taken today. Fixed at e5bb5d93 in assets/js/07-nexus.js, regression assertion at 7097d07c. No changes to saved data, math or source allocations. Browser/mobile QA, full DEMO/LIVE packages and Cloudflare preview for this head pending; physical iPhone not retested, PR #123 unmerged and production unchanged.


### v0.9.20-beta — Today Record reaction discoverability (DRAFT / NOT RELEASED)
- One-tap button added to completed Today compound cards by 55232dd9, wired to existing saved-dose standalone reaction form in e8d5e762, scoped responsive CSS 2a1038e0, tests 6142ff10 and 305481bc. Optional action remains available after saving in Today; no blocking new post-save dialog. Existing dose math, inventory and storage unchanged. Native timed notification concept separate, NOT CODED.
- CI, complete LIVE ZIP/isolated full-app DEMO artifact, Cloudflare latest-head deploy and physical iPhone acceptance PENDING. PR #123 draft/unmerged, production unchanged.


### v0.9.20-beta — Today navigation filter cleanup (DRAFT / NOT RELEASED)
- Top navigation Upcoming replaced with Completed (bf3ef4db, 61103bf9); Completed shows only compounds completed today using existing status logic with the same compact and expanded cards / Record reaction action. Existing lower Coming up preview and Calendar drill-down kept. Browser regression assertion e8c685fa protects current-day inclusion and historical exclusion.
- Data impact: none intended; no change to production storage, dose records, reaction events or inventory. Full new-head CI, exact-source artifacts, immutable Cloudflare preview and real iPhone acceptance PENDING. PR #123 draft/unmerged, no production deploy.

- 2026-10-27 correction: browser run 40583259646 FAILED new Completed inclusion test, despite other suites passing. Fixed date-of-dose filter code ebd66e42; await replacement CI. No deployment or approval of failed build.


### v0.9.20-beta — Completed/Coming up regression investigation (DRAFT / NOT RELEASED)
- Previous full browser QA 40583699831 failed at Completed test expecting expanded action in collapsed card (test mismatch). Targeted test correction dff7ea52 validates both states, and 79c7bd35 tests Coming up → Calendar and revised nav. Full QA at new head PENDING. No migration, merge or production release.

- 2026-10-27: 40585053600 full browser FAILED newly added Coming up → Calendar click because fixture onboarding modal intercepted; test-only correction at 3d4ae796. No application code or production data changed. Full rerun pending.


### v0.9.20-beta — Today Completed + Coming up automated QA passed (DRAFT / NOT RELEASED)
- App/filter code up to ebd66e42; regression fixture correction 3d4ae796. CI mobile 40585601628 and full/browser 40585602137 both SUCCESS. 8 LIVE/DEMO 320/390 light/dark configurations; Log Dose 96 E2E flows, including Completed filter, saved-dose Record reaction, historical exclusion, Coming up → Calendar. Full LIVE ZIP and fictional isolated complete DEMO artifact 12771971424 generated and uploaded.
- Cloudflare bot reports draft preview https://2d04bd1c.nexuspeplog.pages.dev at source/doc commit f88ec7e. Physical iPhone UX and independent served asset hash comparison not verified; no production deployment, merge, migration or saved data modification.


### v0.9.20-beta Reaction management draft (NOT RELEASED)
- Code e5b9b14f introduces optional post-save invitation and individual reaction edit/delete; responsive CSS 7e1a94f and targeted browser tests 6a34b432. Mobile 40590709765 PASS, full browser run 40590709842 pending. No migration; PR #123 draft and production unchanged.


## 2026-10-27 DS2 v0.9.20-beta draft not released: dfe4df01 on PR #123 extends Trends and Profile/Settings visual styling only. No intended schema, data, clinical calculation or production changes. Current-head QA, source-built LIVE/DEMO packages, iPhone acceptance, Cloudflare parity INCOMPLETE. No merge or deployment authorized.


## 2026-10-27 DS2 Nexus and Settings styling: draft commit bd26e3d6 extends scoped CSS for Nexus navigation, Ask/chat, Learn/Journal/Explore shared surfaces, Profile privacy cards, Settings details and narrow layouts. No JS logic/schema/production writes or calculator change. Prior commit dfe4df01 passed full workflow 40601194237 and mobile 40601194692; new-head QA, artifacts, Cloudflare parity and physical acceptance NOT VERIFIED. Unmerged, not released.


## 2026-10-27 DRAFT ONLY: 9ed589e6 shared DS2 styling of Nexus child surfaces, More panels, Settings child cards. CSS only, no data migration. Current-head QA, physical iPhone, standalone full DEMO and LIVE ZIP not independently verified; PR #123 unmerged and production unchanged.


## 2026-10-27 DS2 unreleased candidate: fdc1d608 hybrid polish for Journal, Explore, Insights UI and Settings detail surfaces; 81adc534 More bottom sheet and Learn route CSS. Visual only, no intended persistence, schema or calculator change, no live deployment. Prior bd26e3d6 browser 40614785248 and mobile 40614785307 SUCCESS; new-head QA, standalone full DEMO/LIVE ZIP, iPhone acceptance and independent preview parity INCOMPLETE. PR #123 draft.


## 2026-10-27 UNRELEASED DS2 action hierarchy candidate: afced369 scoped Log Dose Quick/Guided primary/secondary/confirm shading; test scaffold 4c24b27 nested page screenshots and computed button inventory. No JS/save/storage or clinical dose math changes. New-head test runner has NOT RUN; exact-head CI, physical iPhone, demo/live ZIP parity and safety allocation test incomplete. Draft PR #123 unchanged; no merge/deployment.


## 2026-10-27 — Log Dose review correction 03d83f64 (DRAFT)
Source review found original non-blend Save path validates plan totals and available open-vial quantities, rolls back partial deductions upon shortfall and shows an error; screenshot alone did not prove dose was saved. The earlier review UI displayed only a selected vial balance, potentially misleading for a multi-vial dose, and unformatted ISO date. Commit 03d83f64 adds a review-stage warning when current plan/selected vial is short and formats date/time for readability. Underlying save, source allocation, inventory math and stored records unchanged. CURRENT-HEAD JS/browser and modal screenshot verification PENDING; caution: warning is informational, save guard remains authoritative. 320/390 light/dark nested screenshots and all action-style taxonomy review INCOMPLETE. PR #123 draft, production untouched.


## 2026-10-27 DS2 DRAFT: d7a45b4b initial dose chooser primary+secondary family; a08f62f9 adds PR/dispatch nested screenshot workflow with isolated localhost browser and no production writes. Current runs queued; screenshots not inspected. All changes unreleased, PR #123 unmerged; no data migrations. Full-app DEMO/LIVE ZIP independently downloadable exact-head packages INCOMPLETE.


## 2026-10-27 unreleased DS2 CSS 49271c54 gives Settings per-category delete and full data wipe distinct restrained/strong danger treatment; no changes to JS, storage, migration or computations. Revised deep screenshot runner 48e3293b bypasses onboarding in isolated local context; rendered outcome and exact-head artifact status pending. No merge or deployment.


## 2026-10-27 UNRELEASED DS2 screenshot and button evidence at e00d802a: 40618241161 nested Playwright visual SUCCESS (92 route-state screenshots 320/390 light/dark) after correcting invalid onboarding-overlay capture. Downloaded artifact 12785574088, reviewed actual rendered results and computed button styling. Four top-level primary actions share #C6A6F2; deletion controls use differentiated danger family. Mobile #40618241156 SUCCESS. Full build #40618241138 pending on record; full app DEMO/LIVE ZIP delivery, deep modal safety and native iPhone QA incomplete. No schema/data changes, merge or deployment.
