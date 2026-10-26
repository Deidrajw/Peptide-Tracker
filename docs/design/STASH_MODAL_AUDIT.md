# Nexus Stash action-modal audit — Phase 2E
**Date:** 2026-10-25 · **Status:** SOURCE INSPECTED / VISUAL + DEVICE QA INCOMPLETE
**Branch:** design/design-system-2-preview-20261025 · **Related:** draft PR #123
**User scope:** Prepare Dose, Open New Vial, kit actions, hierarchy, concentration, source selection, keyboard, scrolling and sticky confirmation. Preserve all dose and inventory logic; no merge or deploy without approval.

## Source evidence
- `assets/js/05-nexus.js` — `prepareDosesModal(name)`: header and instructional hint; syringe count, target amount, computed allocation panel; `#pd-save` Mark Prepared.
- `assets/js/05-nexus.js` — `reconstituteVialModal(kit,onDone)`: date/time, BAC water amount, live concentration label `#rc-conc`, notes, `#rc-save`; blend dispatches to `openNewVialModal`.
- `assets/js/04-nexus.js` — `manageKitMenu(kitId)`: grouped kit action sheet already includes Prepare for eligible kits, Open New Vial for permitted sealed-vial states, separately grouped destructive actions.
- `assets/css/nexus.css` — shared `.modal` max-height/overflow/padding/safe-area rules; later focus and 44px input defaults. Multiple later overrides warrant computed-style QA.
- User's 2026-10-25 physical iPhone screenshots show Prepare, Open New Vial and dose-log Inventory Resolution bottom sheets with significant differences in density, hierarchy and bottom actions.

## Findings and concrete proposals
| ID | Workflow | Finding | Proposal | Risk / acceptance |
|---|---|---|---|---|
| M01 | Prepare Dose | 34×34px minus/plus count controls; undersized vs 44–48px target goal | Increase actual hit boxes to >=44px; avoid nested scroll | Count never underflows; keyboard and 320px layout |
| M02 | Prepare Dose | Dense all-caps compound heading + long explanatory text before inputs | Unified modal title + concise subheading separating preparation from administration, preserve full distinction | Never imply this records administered dose |
| M03 | Prepare Dose | Amount, count, allocation and Draw details visually compete | Primary count/amount first, compact read-only allocation summary, advanced source details on demand | Exact amount, per-vial concentration/units, ledger/draft preserved |
| M04 | Prepare Dose | `#pd-save` is inside modal body rather than clearly verified fixed footer | Evaluate existing sticky footer architecture without duplicating Save, after keyboard/scroll screenshots | Confirmation always reachable; never bypass blocked/insufficient inventory |
| M05 | Open New Vial | Standard reconstitution and blend opening follow different implementations | Audit standard and blend side by side, harmonize shell/field rhythm without conflating logic | Same UX quality, different valid data semantics |
| M06 | Open New Vial | Concentration `#rc-conc` is a tiny inline single line, dynamically updates from BAC mL | Make recalculated concentration a legible read-only summary with clear units, warning state for invalid input | Preserve formula and prohibit misleading 'verified safety' |
| M07 | Open New Vial | Date/time + 'Now' row, BAC input, notes and CTA need small-screen checks | Responsive grouping; 44px tap targets, normal input font >=16px, focus-visible | 320px, 390px, light/dark keyboard |
| M08 | Both | Two competing modal/sheet styling systems in CSS cascade, potential nested scroll and top handle/header clipping | Source-scoped modal surface and sticky-area audit; avoid blind global overrides | Rendering screenshot parity; no hidden controls |
| M09 | Action sheet | Kit actions are already in categories but menu length can extend below viewport | Test full sheet and keyboard/a11y, preserve headers and grouping | 'Prepare' opens right existing workflow; destructive separate |
| M10 | Inventory Resolution | Repeated source labels and 'Draw' row density previously confused user; prior presentation patch is experimental | Check latest numbered source-label candidate and read-only unit outputs; distinguish physical vials, not just kit IDs | Exactly one dose record; source-by-source ledger, rollback, insufficient inventory unchanged |
| M11 | Accessibility | Dialog title/close button/focus and VoiceOver/Reduce Motion not physically verified | VoiceOver order, ESC/close behavior, 44–48px, dynamic text | Not a Pass until evidenced |

## Acceptance test matrix (all require evidence)
1. Standard kit: Open New Vial and return to existing dose draft, full field validation.
2. Premixed blend: Open New Vial visual parity with standard where appropriate, composition/history math unchanged.
3. Prepare Dose 1 and multi-syringe: count stepper, totals, allocations, disabled states, saved prepared history.
4. Prepare source shortage: one vial + sealed next vial, Draw confirmation, draft preserved, physical vial identity correct.
5. Modal full scroll, keyboard visible, numeric keyboard input, no double-scroll/CTA obstruction on 320/390 in both themes.
6. Confirm contrast (especially green concentration and purple disabled button) and focus outlines in rendered screenshots.
7. Undo, cancellation and resume, source-specific ledgers, single administration record where applicable.
8. Physical iPhone manual test — **NOT TESTED**.

## QA and production status
- Latest prior mobile form CI run `40246994151`: PASS.
- Full build `40246994233`: build + package validation PASS, main browser workflow **in progress** at last observation; cannot claim latest-head full QA or visual acceptance.
- This audit is documentation only; no changes to mathematics, persistence, storage, modal form actions or production app.
- **ONE NEXT ACTION:** use source-derived isolated FULL-APP DEMO/screenshots to perform actual Prepare/Open New Vial 320/390 light/dark modal tests, address verified hierarchy/CTA/contrast issues on draft PR #123, rerun exact-head CI and seek user iPhone review.
