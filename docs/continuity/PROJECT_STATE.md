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
Run the `Nexus v0.9.1 build and parity QA` workflow on `release/nexus-v091-validation-artifacts`, fix any failures, publish the validated FULL DEMO and LIVE ZIP, then merge only after review and verify GitHub Pages for the resulting main commit.

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
