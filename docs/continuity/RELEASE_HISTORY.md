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
