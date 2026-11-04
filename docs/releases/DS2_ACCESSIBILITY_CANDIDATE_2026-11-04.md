# Nexus DS2 accessibility candidate — release notes (UNRELEASED)
**Date:** 2026-11-04 Toronto
**Baseline:** main `755dea5eed417c1515543779fd81be77b6a504de`, deployed version `v0.9.24-beta`.
**Candidate branch:** `docs/v0924-iphone-acceptance-ds2-reconcile-20261104`, draft PR #132.
**Candidate code/test commit:** `c6872ebf897d6fae4ad18487ce9ad193a17b2336` (later documentation-only commits permitted).
**Version:** no new version assigned; this is an UNRELEASED candidate. A fresh version/manifest, release package and deployment approval will be needed before release.

## Changed screens and user experience
- **Calendar:** previous and next controls keep existing meaning and styling, with real minimum 44px square targets and descriptive accessible labels.
- **More / App Updates:** Back retains route and appearance, with minimum 44px square tap target and explicit `Back to Settings` accessible name.
- **Non-Today header:** Theme and Profile remain in their existing positions, with minimum 44px touch height/width. Today already has 44×48px header controls.
- **Today / Daily tracking:** Four small Log/Edit/Update buttons retain visible text and actions but expose contextual accessible names, such as Log Supplements and Update Weight.

## Engineering and data impact
- Source files changed: `assets/css/nexus-hybrid-preview.css`, `assets/js/10-nexus.js`, `assets/js/11-nexus.js`, `assets/js/12-nexus.js`; test script `scripts/ds2-global-consistency-audit.mjs`. Audit-only supporting workflow, documentation and regression metadata included in branch.
- CSS/markup/accessibility only. **No user data mutation, migration, import, inventory debit, history rewrite, protocol schedule, calculator math, or storage contract change.**
- Preserve accepted Today/Calendar/Plans/Stash/Check-In, generic transfers and prepared nasal dose administration OFF.

## Actual verification
- Historical baseline audit #41793395698: 112 fictional state captures at 320/390 light/dark, zero runner errors and overflow. Source evidence artifact #13303529916.
- Targeted corrective commit `7f8ba5e`: updated global Chromium #41797704348 SUCCESS, 112 captures / zero audit errors, targeted 44px and context labels passed; mobile #41797704356 SUCCESS; mixed writer #41797704393 SUCCESS; nested #41797704461 SUCCESS. Evidence archive #13305574343 downloaded and CRC checked; computed sizes show Calendar, header and App Updates controls exactly 44×44 where scoped.
- Additional App Updates accessible-name change `c6872ebf`: all **exact-final-source workflows PENDING** at time of writing. Do NOT carry previous-commit passes forward as tests of `c6872ebf`.
- Physical iPhone hit-target, VoiceOver announcement, Dynamic Type, reduced-motion and keyboard: **NOT TESTED** for this candidate.
- Whole-app typography semantic-role and modal visual standardization: **AUDIT IN PROGRESS**, not delivered.

## Required deliverables and release gate
- In-chat fictional interaction preview: to be provided with session report.
- Standalone FULL-APP DEMO HTML and exact-source FULL LIVE ZIP: **INCOMPLETE until final-head build artifact is verified and delivered**.
- Regression checklist: committed candidate assertions; final results require exact final-head workflows; physical-device UAT NOT TESTED.
- Draft PR only. **Do not merge or deploy without explicit approval.** Primary production remains v0.9.24-beta.

**Next one action:** verify exact `c6872ebf` audit/mobile/WebKit/nested/writer/build results, source-parity LIVE ZIP and isolated full-app DEMO; then present final device acceptance checklist and font/modal prioritization.
