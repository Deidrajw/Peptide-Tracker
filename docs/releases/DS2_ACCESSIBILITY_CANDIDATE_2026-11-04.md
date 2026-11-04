## 2026-11-04 Toronto — PR132 exact-source release candidate QA and artifacts VERIFIED, unmerged
- Latest app/test source `c6872ebf897d6fae4ad18487ce9ad193a17b2336`, base production main `755dea5eed417c1515543779fd81be77b6a504de`. Docs-only branch heads thereafter do not change shipped candidate app bytes. Production remains v0.9.24-beta (PR130 release). PR132 is DRAFT, unmerged, undeployed; no user data or localStorage touched. Canonical version in candidate archive still v0.9.24-beta — NOT a newly published version; before any approval/merge release notes/manifest must be versioned.
- All SIX exact-app-source workflow groups SUCCESS: Chromium global typography/button/modal #41798219411 (112 captures, zero reported audit errors/overflow; artifact #13306282484), WebKit formulation #41798219324, mobile #41798219412, shared writer #41798219383, DS2 nested #41798219339, and complete Nexus build/parity #41798219358. Automated browser emulation is not physical iPhone or VoiceOver UAT.
- Final build artifact #13307535308 downloaded and independently inspected: outer ZIP 548 entries/CRC PASS; embedded 26-file `Nexus_v0.9.24-beta_LIVE_GitHub.zip` CRC PASS, root `index.html`, all 4 ordered CSS files, 12 numbered JS modules plus five support modules, four icons. Build manifest `Nexus_v0.9.24-beta_BUILD_MANIFEST.json` identifies source commit c6872ebf. Full standalone fictional `Nexus_v0.9.24-beta_FULL_DEMO.html` present, demo-mode flag and in-memory storage + blocked network guard present, zero external script tags, OFFLINE_FULL_DEMO_OPEN_ME.zip CRC PASS, embedded index.html byte-for-byte matches standalone FULL_DEMO. No live production writes/import/sync.
- Prior scope A11Y-01 corrected in candidate: calendar prev/next, App Updates Back, non-Today theme/profile tap bounds to >=44px, contextual accessible names for calendar, Today daily tracking and App Updates. All 112 Chromium samples PASS scoped assertions. Physical device tests for these candidate changes NOT TESTED.
- New source-matched **semantic-role audit findings** documented in `docs/design/DS2_SEMANTIC_ROLE_FINDINGS_2026-11-04.md`: 11px substantive descriptions in Calendar/Supplements/Learn/Settings Health compared with 12–14px elsewhere; repeated 9px DM Mono all-caps category labels; 390px compact actionable controls in Learn 35px, reminders 30px, Profile timeline 31px, Stash Add 41px and other isolated controls. 320px 7-column Calendar day cells ~40px wide is a separate responsive constraint; do NOT blindly force 44px width and cause overflow. Findings are measured candidates, not all WCAG failures. Fonts/modal-wide changes NOT CODED.
- NEXT ONE ACTION: review proposed semantic typography token hierarchy and fix next genuinely undersized high-frequency actions on an additional source/test slice, with 320/390 screenshots and explicit preview before material visual redesign. Then new-head CI, full-app artifacts and physical iPhone acceptance. No merge/deploy without explicit approval.

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
