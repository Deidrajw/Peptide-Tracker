# Nexus — Route-specific dose deduction plan (PR #124 design only)
Date: 2026-10-29
Status: **PROPOSED — no live route-specific dosing or physical transfers enabled**

## Baseline and data boundaries
- Existing `state.supplies` and each canonical `vial.remainingMg` remain the source of truth for historical injectable kits; never relabel or move them automatically.
- Additive `state.formulationStocks` records have separate IDs, `containerType`, `method`, `compound` and their own balance. Capsule bottles track integer `remainingCount` and fixed labelled `mgPerCapsule`; nasal bottles track `remainingMl` and `remainingMg` independently and currently have `mgPerSpray:null`.
- Do **not** merge by compound name. Multiple simultaneous open SubQ, IM, nasal or oral containers of the same compound are normal. User selects an explicit eligible source ID, with appropriate label/remaining balance.
- Legacy unknown-route stock stays visible but ineligible for new route-specific deductions until explicitly classified using a non-destructive, audited user choice. Existing historical logs remain untouched.
- IU is activity and is never converted to mg or mcg without a verified product-specific potency factor. Mass arithmetic uses mg internally; preserve entered/display unit per dose.

## Proposed atomic transaction interface
`planDose(snapshot,{id,doseId,compound,method,containerId,quantity,unit,date,...})` should return an immutable `{next,event,dose}`; it must not save, alter the caller or append dose records until all validations succeed. The only durable writer commits the entire resulting snapshot exactly once after version/freshness checks under a coordinated write protocol. If write/readback fails, no in-memory swap and no success UI.

### Oral / capsules
- Require `method:"Oral"`, `containerType:"capsule-bottle"`, explicit container ID, integer number of capsules >= 1 and sufficient `remainingCount`.
- Derive total mass only from the labelled `mgPerCapsule` already recorded on this particular container; do not use product-name defaults. Log entered capsule count, capsule strength, derived total mg and source ID. Subtract **count**, not an injectable vial balance.
- Capsule strengths on saved containers should be immutable without a separate audited relabelling workflow; existing entries retain the original strength and source.

### Nasal / bottle
- Require `method:"Nasal"`, `containerType:"nasal-bottle"` and explicit bottle ID.
- For spray-count entry, reject until a verified bottle-specific `mgPerSpray` is recorded (and output volume per spray if decrementing mL by sprays). A quoted nominal volume or self-reported concentration alone is not proof of consistent delivery.
- For a directly recorded administered volume/mass, require independently specified, verified compatible conversion values before decrementing both mL and mg. Do not infer volume from kit water added, nominal container size, or a different vial. If no verified conversion exists, allow notes-only/history capture **without** falsely showing a deducted stock amount, subject to product decision.
- Verify `remainingMl` and `remainingMg` are both sufficient; store values used for calculations with the event for exact historical traceability.

### Injectable / vial
- Continue canonical vial allocation by explicit kit/vial ID and method; never count sealed backup as open available stock. A source labelled SubQ is not automatically eligible for IM or Nasal.
- Preserve multi-vial allocation and same-compound dual open-kit selection. Original allocation IDs, dose history, vial math and undo remain authoritative.

## Required concurrency and storage redesign before enabling
1. Inventory-only `commitAdd`/`commitEdit` and transfer guards currently do guarded read-compare-write/readback but cannot achieve true cross-tab atomicity while legacy `saveState()` synchronously writes without a shared lock. Preserve its current synchronous save contract; explicitly scope an audited write coordinator and upgrade *all* writers together, or keep route-stock deductions disabled.
2. Add unique transaction ID/replay detection across the **whole** state, source balances and target dose history. An edit or delete reverses only its own recorded allocation, not inferred stock.
3. Fail closed on missing metadata, stale source, duplicate, invalid quantity, insufficient stock, storage error, cross-compound, different-method source, and ambiguous multi-source choice.
4. Existing dose records and backups are never rederived or migrated. No automatic retroactive deductions.

## Fictional release gates
- Multiple same-name containers with different methods and two open vials; no cross-route source leakage.
- Oral capsule count integer and strengths, partial/zero balances, changing an unrelated vial never changes capsules; correct single per-dose record.
- Nasal sprays without verified bottle factor rejected; volume/mass never negative; no assumed mg/act units.
- Replay, stale tab, failed write/readback, conflicting writers, rollback, edit/undo/delete and legacy unknown-route handling.
- Isolated LIVE and full-app DEMO browser QA at 320/390, light/dark, Safari-oriented safe-area/keyboard/tap targets/scroll, accessibility labels and no double deduction.
- Real iPhone Safari acceptance by the user on a **preview build only** (not production), with fictional records before release consideration.
- Complete exact-source LIVE ZIP, offline full-app DEMO, release notes, CI checks and explicit approval required for merge/deployment.

## UX proposal
A route selector shows method first; a second “Source” section lists matching labelled containers as individual selectable cards (name, formulation, source label/ID, available amount, low-stock warning), remembering the last selected source *only when still eligible*. For oral: capsule quantity stepper and total strength readout. For nasal: an explicit safety warning when no validated spray calibration exists; no fake dose or stock movement. Keep dosage/site/reaction logging separate. Do not attach the new inventory to existing vial kits by name.

**Next implementation action:** Refactor and test a shared write coordinator without changing existing synchronous save semantics, then implement a pure, gated `planDose` against formulation stock and fictional tests; enable live controls only after all release gates and approval.
