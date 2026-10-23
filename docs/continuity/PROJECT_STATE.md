# Nexus — Project State

> Living handoff. Update on every material change, including incomplete work. GitHub main is the source of truth; reverify each session. Never store private production data here.

**Documentation baseline:** 2026-10-23
**Repository:** Deidrajw/Peptide-Tracker
**Production:** https://deidrajw.github.io/Peptide-Tracker/
**Last verified pre-documentation main SHA:** a4dcad6f9d8c1a8599945af5fcefcbbc66b07107
**Last verified merged app PR:** #16 — Chevron Visual Consistency Audit
**Last verified Pages run:** https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973924397
**Last conversational release label:** v0.9.0-beta
**Metadata mismatch:** Production index.html reportedly still displays v0.7.8-beta (modular); reconcile via verified release.
**Documentation setup:** New continuity files proposed via docs/nexus-continuity-bootstrap-20261023; verify PR/merge separately. This is not an app release.

## Architecture and safeguards
- Existing root index.html, assets/css/nexus.css, and ordered assets/js/01-nexus.js through 12-nexus.js. Confirm against live main.
- Main tabs: Today, Calendar, Protocol, Stash, More; includes Check-In, supplements, symptoms, weight, nutrition, dose, schedule, history and inventory.
- Preserve real localStorage (historical key peptide-tracker-html-v1), exports, backups and all dose calculations. Do not import demo data into production.
- A stale PR #2 for modularization was previously identified; do not merge it blindly.

## Active priority — finish app-wide chevron and disclosure consistency
- PR #16 improved Symptoms, Browse All Supplements, Selected Today and compound-symptom chevrons; it was not a complete visual audit.
- Source audit in the 2026-10-23 conversation found different CSS and Unicode indicator patterns in Today, Protocol, kits/Stash, history, weight, settings, and Log Dose.
- Normalize shared stroke, geometry, direction, alignment, 44–48px touch targets and light/dark states. Verify actual rendered UI at 320px and 390px. Do not count source inspection as browser testing.
- Next planned app version v0.9.1-beta; PROPOSED ONLY, not implemented, tested, merged or deployed. Major new UI redesigns remain deferred until acceptance.

## Completed behaviours to preserve
- Calendar opens current local month, Month tab; compact cells keep real numeric weight and historical date details.
- Daily Check-In status and Edit near top of Today; date validation, no duplicate entry/date, edits, mood, symptoms (1–3), notes and compound associations.
- Supplements: searchable, internally scrollable, browseable multi-select in Check-In and Log Supplements; Selected Today count and date-specific history.
- Symptoms: general and compound-specific search/browse; selected symptom intensity 1–3, custom terms and historical associations.
- Log Dose: source selection, drafts, confirmation, scrollable bottom sheets, anchored actions, correct single/multi-vial deduction, insufficient inventory.

## Open bugs, risks, and other priorities
1. Prior reconstructed full-app DEMO had a missing supplement DOM-node error in paintCheckinSupp (null.innerHTML). Patch existed, but full all-modal browser verification remains unproven. Build DEMO from exact release source and keep isolated fictional fixtures.
2. Display version v0.7.8-beta vs conversational v0.9.0-beta. Verify canonical release numbering.
3. Light/dark contrast, emoji-based general UI icons, nested accordion borders, white gutters, excess spacing.
4. Broader Check-In, Supplements, Weight/Nutrition, Log Dose, date edge cases, inventory and history regression.
5. Documentation must be kept current with actual PRs/commits/tests; do not copy unverified claims into releases.

## Release artifact status for proposed v0.9.1-beta
- Source code change: NOT STARTED / NOT VERIFIED.
- In-chat conceptual chevron preview: shown Oct 23, not release UI.
- Standalone complete full-app DEMO: INCOMPLETE.
- Exact-source LIVE ZIP: INCOMPLETE.
- Release notes: preliminary.
- Interactive regression: preliminary checklist; affected real test results NOT TESTED.
- Branch, PR, merged status, deployed Pages: NOT STARTED for app update.
- Physical iPhone tests: NOT TESTED.

## One concrete next action
After merging the documentation-only PR, inspect latest main and all disclosures in CSS, HTML and JS; start the targeted v0.9.1-beta shared-chevron implementation on a separate app release branch. Update these files in that PR and complete every mandatory app release artifact before calling the release complete.

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
