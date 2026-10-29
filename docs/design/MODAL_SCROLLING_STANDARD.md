# Nexus Design System 2.0 — Single-Scroll Modal & Editor Standard
Status: **APPROVED PRINCIPLE; PARTIALLY IMPLEMENTED; FULL-APP AUDIT PENDING**
Updated: 2026-10-26

## User intent and accessibility rationale
An iPhone workflow must never require the user to scroll a sheet *inside* another scrollable page or to scroll a secondary picker nested inside the sheet. Scrolling long content is sometimes necessary; it must happen on **one primary full-screen surface**, with a clear, stable Back/Continue/Save action that is reachable above the keyboard/safe area. Never hide/clamp the rest of a form just to achieve zero scrolling.

## Presentation rule
- Short dialogues/confirmations: bottom sheet, contents fit without internal scrolling.
- Long data-entry or multi-step workflows: transition to a full-screen editor using one primary scroll surface; fixed header and sticky footer where appropriate.
- Searchable compound/selection combobox: same input for typing and choosing. Suggestions float in a bounded, non-scrollable panel; show up to five options, filter as typed, display “Type to narrow” for more results. Popup must not push down sibling fields or create a scrollbar inside the form.
- Review: scan-first grouped summary, prioritize change implications and source quantities; avoid repeated borders and long flat lists.
- No double-scroll on the parent page behind the editor, and no nested overflow:auto on component panels, text areas, lists or lookup popups unless a separately approved exception exists.
- 44–48px controls, visible focus/validation, reduced motion, WCAG AA contrast target, logical VoiceOver order. At 320/390 with open keyboard, primary navigation must remain reachable.
- For very long selections, replace a nested scroller with a dedicated full-screen selector route using one scroll surface and return selection without losing entered values.

## Protected workflows
Existing kit, vial IDs, dose history, blend component math and original inventory Save handlers must remain unchanged. No UI refactor may automatically migrate or rewrite localStorage.

## Audit inventory and sequence
1. Stash: ordinary Add/Edit Kit, Blend Add/Edit, Prepared Doses, Open/Reconstitute/Finish/Reopen Vial, Add Vials, Adjust Remaining, Outflow/Undo, kit details, filters, supplies.
2. Log Dose: Quick/Guided, source selection, multi-vial allocation, prepared batches, keyboard/confirm.
3. Today/Calendar: Check-In, symptom and supplement selection, day records/edits, details.
4. Protocol/Plans: wizard, Goal/Research/Shopping Add/Edit, timelines, selectors.
5. More/settings/import/export and any cross-app overlay.
Each screen must be audited in both themes at 320px and 390px plus a physical iPhone keyboard test. Report Pass/Fail/Not Tested and identify any approved exception.

## Implementation progress
- Draft PR #123: Blend full-screen mobile editor CSS implemented; bounded floating suggestion panel; grouped Review and transparent footer. Await source-matched browser/physical iPhone acceptance.
- Remaining full-app modal list: **NOT AUDITED / NOT IMPLEMENTED**. Do not claim this rule globally completed.

## One next action
Validate Blend latest-head 320/390 dark/light screenshots and iPhone input+keyboard. Then conduct the Stash-wide modal scroll audit before changing other screens, ensuring protected accounting and data history.
