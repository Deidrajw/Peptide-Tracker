# Nexus — multi-source Log Dose Review + atomic Undo proposed specification
**Date:** 2026-11-13 | **Status:** PROPOSAL / DESIGN PREVIEW ONLY — NOT IMPLEMENTED OR APPROVED
**Verified production main:** `b3a67ec48f5ba982abff042048e30a9549d83467` | **Release:** v0.9.27-beta.3
**Source:** `assets/js/01-nexus.js` (`nexusPlanBackedDoseChange`, `nexusCommitBackedDoseChange`); `assets/js/05-nexus.js` (`updateDoseReview`, `showUndoToast`, backed-dose save).

## Confirmed problems (fictional browser tests, 320 and 390px)
1. Exact 3mg split between two open physical sources (Vial 4 1mg, Vial 8 2mg) saved successfully; source balances went 1→0mg and 5→3mg, and dose count 13→14.
2. Review only displayed active Vial 4 and zero projected balance; failed to show Vial 8. `updateDoseReview` uses `activeKit()/activeVial()` and deducts **entire** `usedMg` from one vial, masking negatives with `Math.max(0,...)`.
3. Multi-source Undo is visibly offered but `nexusPlanBackedDoseChange` rejects `old.allocations.length !== 1`; tested Undo left dose count 14 and balances 0mg/3mg unchanged. This is a fail-closed functional gap and a misleading action, NOT proven data corruption.
4. Earlier single-source overdraw (99mg requested on 28mg) reached Review with projected “0.00mg” and enabled-looking confirmation; final save safely failed. Must show shortfall *before* confirm.

## Recommended scoped design contract (DS2)
- **Review header:** compound, requested dose and date; retain currently approved title, input unit, method and site.
- **Sources section:** one row for every unique exact physical `kitId + vialId`; distinguish identical vial numbers in different kits using kit name; show `from X` → `use Y` → `remaining Z` in native or clear display units, without mixing mg and mcg.
- **Total allocation:** `N of requested M`; never show “0.00mg after save” for insufficient available stock.
- **Ready:** required amount allocated to confirmed eligible vials, all unique and compatible; one primary “Confirm log” button and one “Back to edit” action.
- **Shortage / mismatch:** inline non-alarming but prominent error with exact missing quantity; “Edit amount” and “Select another source” controls; disabled/inaccessible final Confirm until valid. Keep previous draft and selection.
- **Stale / changed source:** invalidate preview and request user to refresh/reselect; avoid recomputing a silent new allocation to another vial.
- **Undo:** visible only if backend can support that event; do not promise a recovery action for an unsupported historical record. For supported multi-source records, show successful restoration only after exclusive transaction readback.

## Safe atomic Undo engineering contract
- Leave single-source edit/Undo behaviour unchanged. Prefer separate `planUndoMultiSourceBackedDose` for `operation === 'undo'` and `allocations.length >= 2`, rather than relaxing the single-source `edit` path.
- Input: source-identical dose ID, compound, native unit, original dose/history, all original exact allocations; no fallback to “currently open vial”.
- Validate against a **fresh exclusive snapshot** before *any* mutation: dose exists and remains eligible/latest; backed/unprepared/not blend; unambiguous positive finite amounts; sum of allocations equals historical dose in consistent mass units within an explicit precision tolerance; no duplicate source IDs; exact vial/kit identities, formulation/method and capacity/status eligible; no subsequent dependent stock transactions or attribution ambiguity (fail closed rather than guess). Explicitly evaluate historical legacy formats before enabling.
- Make a deep-cloned next state, restore **each** original vial with correct status transition (empty→open only as permitted), remove **exactly one** dose, detach only its reschedules, append event-specific audit with all original per-source amounts and before/after balances. Do not partially modify original state.
- Commit through the existing exclusive CAS/readback writer. If stale source, capacity, ledger, storage, or writer verification fails, report *nothing was reversed* and leave dose + all vials unchanged. Do not claim success before verified commit.
- Reversals must be exactly-once: second tap or same event in another tab fails without changing anything. Protect existing single-vial, prepared, combination/blend/nasal paths and localStorage key `peptide-tracker-html-v1`.
- Consider UI display and undo toast stacking with the post-save “Record reaction” sheet; accessibility text must announce failure/success.

## Fictional regression matrix (required before implementation can be called complete)
1. Two sources in separate kits: Vial 4 1→0 and Vial 8 5→3 after 3mg; Undo restores 0→1 and 3→5, removes one dose, preserves unrelated histories.
2. Two open sources in the *same* kit, exact IDs; allocation and Undo must not substitute another open vial.
3. Partial shortage 2mg requested but 1mg allocated; cannot reach Confirm until corrected. Same check for 99mg on 28mg.
4. Edits to an existing multi-source dose: remain fail-closed unless separate supported correction semantics tested; no UI implication that they work.
5. One original vial is absent/deleted/replaced or has incompatible method: whole Undo rejected, **both** balances unchanged and dose remains.
6. Restoring either vial would exceed physical vial capacity or break stock ledger: reject with all-or-nothing state.
7. Multi-tab stale state/duplicate Undo/race with inventory action: reject unsafe operation under coordinator, preserve all records.
8. Same dose logged in mg/mcg, with correct native conversions, decimal rounding and exact source sum.
9. Current single-source Undo, prepared source, blend and nasal gate: no regressions.
10. 320/390 light/dark, long names, VoiceOver labels, keyboard/sheet scrolling, iPhone user acceptance.

## Scope and approvals
**No code change in this proposal.** Major UX changes and any release require separate explicit approval. Initial visual preview is fictional and non-writing. Existing draft PR #168 holds audit documentation only; no unrelated merges or deployments are authorised.
**ONE NEXT ACTION:** review/approve the preview and scoped fix direction; then implement on a separate development branch with exact-source fictional full-app DEMO, LIVE ZIP, regression evidence and continuity updates.
