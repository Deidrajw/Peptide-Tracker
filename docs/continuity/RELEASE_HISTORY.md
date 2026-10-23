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
