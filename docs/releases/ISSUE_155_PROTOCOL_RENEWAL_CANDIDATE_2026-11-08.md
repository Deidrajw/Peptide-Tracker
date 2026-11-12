## Separate approved Issue157 stacked candidate (not part of Issue155 release)
- User approved simplified Duration & changes UX and exact end date for development. Independent stacked branch feature/protocol-duration-end-date-20261109 based on PR156 head 0c5536b1; this file's original PR156 release metadata remains unchanged. Issue157 is NOT yet CI-qualified, merged, deployed or approved for release. Preserve original protocol renewal acceptance and full-app isolation.

## Late candidate UI refinement (new exact-head requalification required)
- At app/test commits 69962583/20e9cb30/7824c74f/9557cc8d, removed graph emojis from Stash Supply Planner and Protocol Builder Review Phase Timeline; aligned scoped DM Sans typography and readable label/legend sizes. Source assertions cover labels and style. No stored phase schedule, dose calculations or inventory changed. New exact-source full app CI/browser/Demo/LIVE packages PENDING, physical reacceptance of visuals PENDING. Date-based ending and broader phase redesign are separate proposal Issue #157; no implementation of date model or migration. PR156 remains draft, unmerged, undeployed.

## iPhone user evidence + DS2 refinement after prior CI (not yet requalified)
User reported physical Ready-Stash and fictional dose/Undo PASS; post-dose New/Edit functional after QA launcher, activation/save visually completed. Separate optional reaction prompt confused initial access; Cancel/Not Now and original grouped tests remain incomplete. At PR156 JS11 1acc06a5 removed Review Phase Timeline emoji, JS09 69962583 removed Supply Planner graph emoji, CSS 23a8967c scoped DS2 DM Sans headings; test ab006008 adds static source checks. Prior 3b3a0ae0 six-suite pass/artifacts are baseline ONLY; fresh CI and exact new source LIVE/DEMO required. No data migration/production writes, release version change, merge or deploy. End-date scheduling and larger phases redesign NOT IMPLEMENTED (preview pending).

## Supplemental iPhone acceptance test harness — never ship in LIVE
- Dedicated complete fictional full-app QA HTML (original 3b3a0ae0 DEMO plus only 2,364-byte fictional launcher) and matching offline ZIP prepared for user testing. Test Reta renewal resets isolated completed-Reta fixture and calls actual post-dose reminder. It is not part of LIVE source or official build artifact. Static Node syntax, ZIP CRC and memory/no-network guards PASS. Local browser navigation BLOCKED by environment; physical Safari/VoiceOver NOT TESTED. No personal data, upload, migration, merge or deploy.

## Final safety-corrected exact-source qualification (not a release)
Application/test source `3b3a0ae03f806f3f4f0f2a108f60c62e9436a8ea`: six official workflows completed SUCCESS: full browser/build 42558271659, WebKit 42558271648, pinned Chromium 42558271815, mobile 42558271574, shared writer + mixed-writer/two-tab 42558271806, DS2 nested 42558271622. Full-app Protocol browser 8/8 LIVE/isolated DEMO × 320/390 × dark/light PASS, including failed acknowledgement canonical recovery. Exact-source official build artifact #13648003897 has 565/565 outer CRC PASS, 26/26 LIVE ZIP CRC PASS, root index and 12 ordered JS modules. Standalone full-app 3,204,922-byte fictional DEMO matches offline ZIP HTML byte-for-byte; demo sync disabled. LIVE index, CSS and JS01/JS11 match GitHub blob SHA. No data migration, real storage access, release version bump, merge or deployment. Remaining: physical iPhone Safari/VoiceOver, independent Cloudflare source parity (prior main still only user-confirmed). Review candidate only.

## Safety correction after initial QA
At JS11 40ff3fe3, a rejected reminder acknowledgement no longer reapplies its stale before-write acknowledgement map over the canonical writer-restored state. Test 78d0bc71 models the real restoration behaviour. Prior 0acde94c six-suite CI and artifact are baseline only; modified code is not yet qualified until fresh exact-head CI and packages pass.

# Nexus — Protocol renewal follow-up candidate (Issue #155)

**Status:** Coded on draft PR #156 only; not merged or deployed. **Version:** No new release version; baseline v0.9.26-beta.1. **Main baseline:** 1c6007fce7ea25a68ec29f480f3b4d6ede46477c.

## User-observed issue
After logging Reta on an ended protocol, tapping Start a new protocol looked unresponsive because `dismiss(false)` was asynchronous and later closed the just-opened builder.

## Candidate changes
- Await guarded follow-up acknowledgement before opening a new or existing protocol builder.
- Start New opens a separate unsaved draft with the triggering compound preselected; the previous protocol, history and logged dose are not copied or changed.
- Leave dose blank and require explicit schedule/dose review; no automatic activation or storage writes by opening the builder.
- Preserve Update Existing, reminder dismissal, and failure-to-acknowledge recovery.

## Affected/protected screens
Today → Log Dose → post-protocol reminder → Protocol Builder; Protocol tab retained. Protect Check-In, Calendar, Stash, Combo Dose, prepared nasal accounting, writer safety, plans and theme/320px responsiveness.

## Data impact
No migration. Only existing acknowledgement state changes on successful reminder choice; no production data accessed by development tools. Starting the new builder does not create a protocol until user saves; save follows existing guarded exclusive writer path. Existing protocol/dose history untouched by the new action.

## Evidence and limitations
Test case added to existing `tools/validate-protocol-design.mjs` full-app browser matrix (LIVE/isolated fictional DEMO × 320/390 × light/dark) for new/edit successful acknowledgement and failed acknowledgement, intended to run under the regular CI release validation workflow. Verify exact latest head results before marking Pass. Browser simulator is not physical iPhone acceptance. Source-matched standalone full-app DEMO, offline DEMO ZIP, exact-source LIVE ZIP and primary Cloudflare parity are incomplete until reviewed. No permission to merge or deploy.
