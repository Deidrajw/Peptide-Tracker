## 2026-10-30 — Atomic prepared-source transaction candidate (NOT RELEASED)
Version v0.9.20-beta development; new pure nasal-dose transaction planner + reverse, exact source and one-state persistence, with regression suite and 25-file source builder. UI/writer disabled pending shared lock across legacy sync saves, product-specific verified bottle calibration and physical iPhone acceptance. No migration, no legacy vial changes, no merge/deploy. Source b0340e3a; new-head CI awaiting outcomes. Earlier full 41084097074 SUCCESS (fixture correction). Detailed status in continuity.

## 2026-10-30 — Updated release evidence (not released)
- App SHA e4945d24 (code fix db756749), main da585ab3. GitHub full run 41083204564 built and verified 24/24 source ZIP bytes, LIVE/DEMO CRC and standalone-offline DEMO parity; downloaded artifact 12990628004 inspected locally. 8 live/demo Log Dose browser scenarios with 168 flow checks PASS; full browser overall FAIL at outdated Stash Actions test fixture missing confirmed vial method, corrected test-only at 5bd5a204. New-head full rerun 41084097074 pending, real iPhone NOT TESTED. Preparations remain plans until a verified physical measured transfer. Pure nasal eligibility/spray planner is not wired into stock writer or routine Log Dose; atomic prepared stock deduction/undo, multiple simultaneous use setups and writer concurrency unresolved. Production version stays v0.9.20-beta, no migration/merge/deploy.

# Nexus PR #124 — Integrated Use Setup candidate (NOT RELEASED)
Date: 2026-10-30
Version: v0.9.20-beta development continuation; no new production tag or deployment.
Main baseline: da585ab3458394ddf5e88e283b210933beeab810.
Branch: feature/dose-administration-method-20261029, draft PR #124.
Latest app/testing candidate commits through 46766dfbf5ca982f883b019b5a06acac5cefb728, awaiting final exact-head checks.

## Changes coded
- Add one additive use preference object per compound: broad method category (Injectable groups SubQ/IM, plus Nasal/Topical/Oral/Other); exact route persisted.
- Choose preferred mass dose unit mg/mcg at setup and switch in routine dose entry. Maintain native internal quantity and entered amount/unit metadata, avoiding a destructive migration. Native IU is supported only for an already IU-defined product and only without an unsupported mass inventory debit.
- Choose inventory-backed or explicitly untracked at setup and remember it; untracked creates a labelled administration, preserves follow-up/reaction prompts and never debits physical or prepared stock; backed preserves existing source and allocation validations.
- Explicitly associate one compatible open physical vial at setup, remember its kit/vial IDs, and don't silently select among multiple vials.
- Add a Stash Use setup entry/summary and reduce collapsed kit card density; maintain Vials/History, kit menus and approved DS2 surfaces.
- Protect unsupported nasal raw-vial-to-spray substitution and clarify the distinction between inventory existing and route-compatible inventory.
- Update the existing browser test selectors for the new visible amount input and add fictional regression cases in scripts/ds2-dose-inventory-regression.mjs.

## Screens and data impact
Affected: Stash kit cards, Use setup bottom sheet, Today/Log Dose form and Review, associated dose records, automated browser test scripts. Additive saved state key state.nexusUseSetups; new doses may carry trackingMode, enteredDose, enteredUnit. Existing saved dose histories, physical vial ledger, old records and production localStorage have NOT been migrated. No production writes by this development session.

## Safety and limitations
- Stock-backed Nasal prepared-container selection and measured spray counting are NOT fully wired through the new use-setup path. A mere physical vial or saved preparation plan cannot become nasal usable stock; unsupported backed nasal case remains a release-blocking functional gap pending validated conversion and source model.
- Multiple independent use profiles for the same compound (e.g., simultaneous injectable and nasal products) are NOT implemented; current preference is per compound name. Needs separate design/schema approval before public release.
- IU is not a universal mg/mcg or U-100 syringe-unit conversion; activity definitions remain product-specific. Do not invent IU->mass stock debit.
- Compound-specific spray-count forms, blends, historical edit reconciliation and calculators require protected-path full regression before release. Any failed safety assertion is an unresolved release blocker.
- Primary Cloudflare deployment, merge and physical iPhone acceptance are NOT performed. PR #124 must remain draft/unmerged without explicit approval.

## Test evidence (update when verified)
Permanent policy: docs/qa/NEXUS_TESTING_STANDARD.md; detailed cases docs/qa/PR124_USE_SETUP_REGRESSION.md.
Mobile/WebKit/nested workflows on preceding app commit b5b8534 reported SUCCESS; final full browser and exact-head artifact verification pending. Prior failed browser runs were stale selectors for hidden #dose input; selectors updated in tools/validate-trust-ui.mjs, tools/validate-logdose-ui.mjs and scripts/ds2-dose-inventory-regression.mjs.
Physical iPhone new flow: NOT TESTED. Prior VUX-07A/B user-reported Pass applies only to obsolete app SHA 8a28433a, and prior VUX-08A failed/mismatch remains the reason for this work, not acceptance of new source.

## Release status and next action
CODED, IN QA; NOT COMPLETE, NOT MERGED, NOT DEPLOYED.
One next action: finish exact-head CI and matching artifact verification, then run full-app fictional QA and obtain physical iPhone acceptance before seeking merge permission.
