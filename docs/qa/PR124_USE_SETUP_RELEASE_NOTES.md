## 2026-10-30 — Exclusive prepared dose execution scaffold, NOT RELEASED
- Source 48ca41872507a7e9c3e4cc780797d5852869b34b; 8dbf9bfa adds default-off coordinator.transaction orchestration for prepared nasal dose and reversal. No modal wiring, stock enablement, migration or active use of production inventory. Test 40f2d869/corrected 48ca4187 covers source attribution/one-write/undo/stale/quota/readback; CI rerun pending. Baseline 16673efc all five workflows successful, LIVE 26 CRC + isolated full DEMO and offline byte parity checked from artifact 13008115990. Cross-tab synchronous legacy writer gap, calibration proof and physical iPhone acceptance remain release blockers. PR draft and Cloudflare production untouched.

## 2026-10-30 — Stash formulation exclusive writer staging (NOT RELEASED)
- Version: v0.9.20-beta development candidate, PR124 draft. Source 8cef8157 migrated Stash formulation Add/Edit from synchronous saveLegacy to awaited exclusive cross-tab Web Lock transaction; Save disabled while awaiting, original form remains on error, state only replaced after verified persistence. Existing DEMO remains in-memory fictional; production key/schema untouched.
- Affected screens: Stash → Add Kit → capsule/nasal/raw/topical formulation editor and adjustments. Protected: physical vial balances, routine Log Dose, Check-In, Calendar, Plans, backup/restore and history.
- Tests: dedicated safety CI 41117925738 SUCCESS on b82b8265; static writer ownership, exclusive formulation add/edit Node tests, stale tab conflict, physical vial conservation and adjustment history. New real Chromium Stash form UI case added d58e75b6; complete browser QA and latest exact-source artifact validation PENDING. No physical iPhone/VoiceOver acceptance.
- Limitations: other legacy synchronous writes still do not own cross-tab Web Locks. Prepared nasal stock deductions and actual preparation transfers remain gated OFF; no merge/deploy authorized.
- Release status: CODED / dedicated safety TESTED / full browser NOT VERIFIED / PR DRAFT / UNMERGED / UNDEPLOYED.

## 2026-10-30 — Save-ack hardening (NOT RELEASED)
On draft PR124, verified saveState boolean now prevents false success in normal Log Dose, combo, and quick logging after stale/quota/readback failure. 4 Log Dose paths guarded; separate fictional 8-configuration browser regression added. Dedicated safety CI 41116725844 PASS, source-exact complete LIVE/isolated FULL DEMO package artifact 13005203507 CRC and offline parity checked, full QA 41116725723 pending; no storage migration/production writes. Prepared nasal remains disabled and cross-tab sync-to-exclusive migration incomplete. Real iPhone acceptance not tested, no merge/deploy.

## 2026-10-30 — Source-exact shared writer candidate evidence, NOT RELEASED
GitHub application source c003f77a: 26/26 LIVE Git blob parity PASS, outer+inner archive CRC PASS and standalone/offline full-app fictional DEMO byte equality, artifact 12998570703 from dedicated CI 41099893634 SUCCESS. Local isolated Chromium 320/390 dark/light smoke PASS, stale writer protection PASS. Full browser QA 41099893633 still running, physical iPhone and VoiceOver NOT TESTED. Cross-tab synchronous legacy-to-exclusive coordination unresolved, prepared nasal live UI safely OFF, no production changes/merge/deploy. See continuity docs and PR124_SHARED_WRITER_ACCEPTANCE.md.

## 2026-10-30 — Shared guarded writer development update (NOT RELEASED)
Version v0.9.20-beta development; no release tag. New coordinator and guarded save/restore/Stash/erase boundaries coded with exact-source async inventory transaction API, fail-closed stale/readback and two-tab simulation tests. Dedicated safety CI 41099075003 PASS. Full browser QA and downloadable new-head LIVE/isolated DEMO pending; physical iPhone NOT TESTED. Critical unresolved: synchronous legacy saves do NOT own cross-tab browser Web Locks, so stock-backed prepared nasal logging and actual measured transfers stay explicitly disabled. No production storage migration/writes, merge or deploy.

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
