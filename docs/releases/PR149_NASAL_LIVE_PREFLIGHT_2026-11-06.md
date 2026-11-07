# Nexus — PR149 / Issue #148 guarded LIVE nasal preflight (UNRELEASED)
Date: November 6, 2026 (Toronto)
Production reference: v0.9.25-beta.1, main a0482abc42060ad4b31108538a207bf983df90d7
PR: #149, branch fix/p0-nasal-logging-preflight-20261106

## Scope
- Prevent presenting an unsavable LIVE prepared nasal spray dose form while NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED is false. Warn immediately before any form, write or changed inventory.
- Replace one misleading blanket error with separate feature-disabled, stale/snapshot, storage readback and invalid-source messages in an otherwise still gated save handler.
- Protect existing nasal preparation (ON), generic transfer gates (OFF), prepared nasal dose gate (OFF), all dose histories, Today, Calendar, Check-In, Stash and complete user data.
- Preserve PR146 user-accepted injection/nasal calculator and single-X search design; this PR builds from main and does not include PR146.

## Data integrity
No schema migration, saved-record modification, historical inventory adjustment, LIVE spray entry, physical vial double deduction or nasal gate flip. Source changes limited to nasal modal early UI check and accurate errors. Never infer a failed write was saved.

## Exact-source testing
- Static real handler Node VM test tests/nasal-live-gate-preflight.test.cjs, asserts disabled LIVE prevents modal and state writes, demo/eligible path continues original eligibility branch.
- Chromium full-app LIVE and offline fictional DEMO tests at tools/validate-nasal-live-preflight-ui.mjs, 320px/390px light/dark, checks accessible warning, no dose form, no state/localStorage mutations, no page errors.
- Both included in .github/workflows/nexus-release-validation.yml. Exact-head GitHub CI, official complete full-app standalone DEMO/LIVE ZIP and physical iPhone acceptance are still PENDING until independently verified.

## Explicitly not done
Issue #148 actual saved nasal spray dose, prepared balance deduction, undo, cross-tab mixed-writer exclusion, two-tab CAS/stale/failed-write runtime and history visibility remain UNIMPLEMENTED/BLOCKED. Draft PR142 backed-dose false-warning safety work remains unmerged; no automatic release.
Clinical nasal administration suitability, actual calibrated spray delivery, and sterility are not validated by Nexus.

## Release status
Proposed and coded only on draft PR149, unmerged and undeployed. No production data touched. No permission to merge or deploy.
Next action: verify CI and artifacts for PR149 partial step, then coordinate PR142 and shared writer acceptance for guarded LIVE prepared nasal logging on a subsequent safely qualified change.

## Added explicit two-tab transaction safety experiment
- Test-only tools/validate-nasal-exclusive-writer.mjs (commit 96f92367) uses two actual Chromium tabs on local fictional storage under a shared Web Lock. It exercises the existing prepared-nasal engine's executeExclusive behind a **test-only enabled parameter**, not the product LIVE gate: expect exactly one accepted prepared bottle debit and one stale-tab rejection, no second debit from original physical vial, single dose history and ledger, exact reversal, rejected duplicate reversal. Registered in build CI at 2fc34a11.
- This controlled engine test is NOT permission to change NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED=false. The full app still needs actual SAVE handler, historical view, quota, stale tab, offline DEMO, iPhone and mixed-writer reconciliation qualification. Exact-head result PENDING.
