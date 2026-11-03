# Nexus — Permanent QA and Release Acceptance Standard
Version 1.0 | Applies to every feature, fix, redesign, migration and release.

## Authority and scope
This policy is permanent and applies to all future Nexus PRs. Read with docs/continuity/REGRESSION.md, docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md, docs/design/DS2_SCREEN_COVERAGE.md and product roadmap. Never substitute a passing CI badge for detailed test evidence or real-iPhone acceptance. Preserve approved designs and production localStorage.

## Required test-case record
Each case MUST contain: stable ID; feature and screen; risk (critical/high/medium/low); baseline SHA and test build SHA; environment (LIVE/isolated DEMO, browser/device, viewport, theme); fixtures and prerequisites; numbered reproduction steps; expected result; actual observed result; status (Pass/Fail/Blocked/Not Tested); evidence reference (log/screenshot/video/CI run); tester and date; issue/commit reference if failed; retest status. An unexecuted case is Not Tested, never Pass.

## Mandatory test suites
- QA-SRC: Verify main/PR head, branch, docs, release version, source/script order, GitHub workflow checks and source hashes.
- QA-ART: Validate root LIVE ZIP (index.html, CSS/JS/assets, paths, archive CRC, exact release source), complete standalone FULL-APP DEMO (all screens/navigation/modal routes), isolated fictional fixtures, ephemeral storage, no sync/import/live writes. Validate 320px/390px light/dark. Provide downloadable artifacts and manifest.
- QA-NAV: Today, Calendar month/day/logs, Plans/protocols, Stash/Supplies, Trends/Insights/Nexus, Profile/Settings/More, every relevant nested route, back and sheet close.
- QA-DOSE: draft/back/review/confirm, date, route/site, PRN, combo and single dose, multiple eligible vials, explicit exact-source choice, one eligible verified vial auto-selection, shortage, multi-vial allocations, edit/history, duplicate prevention.
- QA-STASH: kits, blends, physical vial identity and balance, open/close, method confirmation, preparation plan save/view/edit, exact kit/vial association; planned metadata must NOT create prepared stock or deduct vial mg. Actual preparation transfers require independent explicit validated debit and credit and audit trail.
- QA-DATA: one check-in per date, symptoms/intensity/mood/notes, supplements search/multi-select/date history, weight/nutrition, calculators and safety assertions, inventory consistency, export/import/restore, deletion warning and existing records preserved.
- QA-UI: 320px and 390px, light/dark, 44–48px touch targets, contrast, typography, keyboard, safe area, bottom sheets, scroll, focus, reduced motion, VoiceOver where available.
- QA-DEVICE: physical iPhone test by user/device tester, actual observed results and screenshots. Automated WebKit/Chromium does NOT equal device acceptance.
- QA-DEPLOY: only after explicit authorization; verify merged SHA, Cloudflare primary served HTML/CSS/JS parity, release status and user-visible changes. A GitHub merge is not deployment proof.

## Acceptance and release gates
Critical data integrity, source attribution, calculator safety or destructive migration failure BLOCKS release. Failed test remains Fail until rerun on fixed SHA. Inaccessible environment is Blocked with reason; unattempted test is Not Tested. Every change requires detailed changed-flow tests plus risk-based protected regressions; full release requires all mandatory suites. User acceptance and deployment approval are separate decisions. Never merge/deploy without explicit approval when PR instructions prohibit it.

## Checklist delivery
Provide interactive in-chat checklist with meaningful steps, expected result, status selector, notes and Copy Results. Include a downloadable detailed test matrix when possible. Distinguish automated test evidence from physical-device observations and do not invent passes. Record outstanding failures and exact next action in continuity docs.

## Session reporting
Start: verified baseline/main SHA, branch/PR, production state, objective, protected flows, user action. During: Done/In progress/Next/Issues/What I need. Finish: DONE, NOT DONE, NEXT, WHAT I NEED, RELEASE STATUS, copyable handoff. Commit QA evidence and continuity updates to the development branch; never represent unpersisted changes as saved.
