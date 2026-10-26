# Nexus Design System 2.0 — Sprint 02: Protocol + Stash

**Status:** PLAN / NOT IMPLEMENTED. **Branch:** design/design-system-2-preview-20261025. **PR:** #123 DRAFT; no merge or deployment authorized.

## Entry gate — Sprint 01
- Calendar Block View, Day View, All Logs, Today 2.0 and Add Log visual correction implemented on draft branch; user confirmed chevron fixed on their viewed build.
- Latest source QA must finish successfully (mobile regression, browser 320/390 dark/light, LIVE and isolated DEMO parity) before Sprint 01 is marked closed. At planning time workflows 40338983339 and 40338983345 are IN PROGRESS. Physical iPhone VoiceOver/keyboard/safe-area and real saved-record acceptance are NOT VERIFIED.
- Do not mark Sprint 01 complete on a prior green run or while new workflows are running.

## Goal
Extend the approved Hybrid Soft Depth + Porcelain + Obsidian design language from Today/Calendar to **Protocol/Plans** and **Stash/Inventory** without changing data models, dosing logic, saved histories, or existing actions.

## Sprint 02A — Protocol / Plans
1. Audit active/research/paused plan cards, compound identity, status, dose/schedule hierarchy and progressive disclosure; reduce duplicate labels, borders, and chevrons.
2. Standardize card action ellipsis and iPhone bottom action sheet; retain Intel, edit, pause/resume, phase and history routes.
3. Harmonize plan detail sheets, phase rows, selected states, timeline, date controls, long compound names, empty/loading/error states.
4. Keep scheduled vs recorded dose distinctions; no clinical or predictive language upgrades without separate review.

## Sprint 02B — Stash / Inventory
1. Audit kit and vial cards, active/frozen/used states, quantities, blend composition and source identity; keep numbers and units unambiguous.
2. Standardize 44–48px ellipsis/actions and shared bottom sheets; avoid nested borders and double scrolling.
3. Make create/edit/open-vial flows visually consistent for single-compound and blends, with readable light/dark primary actions and safe-area/keyboard support.
4. Preserve all vial allocation, inventory deduction, insufficient-stock validation, blend component math and historical associations; no implicit migrations.

## Shared components and design tokens
- Use existing approved midnight-lavender / porcelain palettes; evaluate contrast in both themes, 320px/390px.
- One disclosure indicator per action, shared SVG stroke/geometry, consistent spacing/typography, aligned labels, clear disabled/focus states.
- Keep compact cards scannable, with meaningful information above secondary actions. Use bottom sheets where already approved.

## Execution sequence and approval gates
1. **Baseline:** Recheck latest main, PR #123, continuity docs, current CI, protected data pathways and source version. Document exact SHA.
2. **Inventory:** Capture existing Protocol and Stash screens and action-sheet flows at 320/390 in light/dark using fictional fixtures; document defects and approved behaviors.
3. **Design preview:** Produce interactive in-chat proposed Protocol/Stash surfaces and testable controls; get user approval for material redesign before implementing.
4. **Implementation:** Small scoped commits on draft PR #123; no storage/schema/record migration, no merge/deploy.
5. **QA:** Functional and screenshot regression for Plan card/actions/history, kit/vial CRUD, source selection, single/multi-vial dose deductions, blend math, insufficient inventory, 320/390 both themes, keyboard, safe areas, 44px targets and accessible focus. Distinguish automated browser from physical iPhone.
6. **Deliverables:** Same-source complete LIVE ZIP, standalone isolated full-app DEMO HTML, interactive in-chat preview, GitHub PR/CI evidence, release notes and Pass/Fail/Not Tested checklist. Mark incomplete honestly.
7. **Release:** Only after explicit separate user authorization, validated merge and independent Cloudflare deployment confirmation.

## Out of scope
- Calendar redesign or reimplementation, medical guidance, new dosage algorithms, destructive data migrations, sync/auth changes, production import, release/deployment.

## Concrete next action
Finish latest-head Sprint 01 browser and mobile QA and artifact inspection, then begin **Protocol/Stash baseline screenshot + interaction audit** before presenting Sprint 02 visual proposals.


## 2026-10-26 — User-requested Protocol detail enhancements (PROPOSED, NOT CODED)
The user likes the Sprint 02A Protocol card direction and requested further work **inside Protocol screens**:
1. Subtle animation on explicit protocol completion (respect reduced motion; never animate a mere render/status refresh).
2. Notification when a compound/protocol enters a new scheduled phase, including rest transitions. Design must avoid duplicate alerts after reopening or rerendering and clearly distinguish scheduled transition from logged administration; permission/persistence model to be reviewed.
3. Days-remaining countdown derived from actual phase dates and pauses, not a fabricated global duration. Handle not started, paused, open-ended, finished and differing compound schedules.
4. Current phase shown in each compound's detail view, with phase name/number, week/day progress, and next phase where available.

**Status:** Requested/recorded, not implemented or tested. Design and edge-case review before code; no production changes. Prioritize Protocol detail and phase lifecycle work ahead of additional Stash refinements. Keep PR #123 draft.


## 2026-10-26 — User iPhone Protocol interior feedback (DESIGN REVISION REQUIRED)
User shared actual dark/light iPhone preview screenshots and requested:
- Redesign expanded Schedule & phases: current route pill, timing text, active-dosing line and mini Gantt are visually redundant/dense. Prefer a compact per-compound progress row with purposeful drill-down; preserve route/schedule in details.
- Redesign Phase Roadmap as a clear vertical timeline, current stage emphasized, other stages condensed; treat pause-aware effective dates and avoid contradictory "Now" labels.
- Investigate apparent stale status after Pause: user saw a card remain under In progress until leaving/reentering; this might be a transient render/filter issue, NOT confirmed root cause. Verify filter in-progress, paused, all tabs and immediate rerender.
- For schedule elapsed while recorded compound usage continues, distinguish scheduled completion from explicit protocol completion; prefer status "Schedule ended" rather than implying dosing stopped. Detect qualifying logs after scheduled end (avoid cross-protocol false positives; use known associations), show an optional one-time, dismissible non-clinical prompt to Review/extend, Create new, or Not now. Do NOT auto-extend or copy dosing instructions or mutate records; don't count future scheduled doses as actual logs.
- Redesign Create/Edit multi-step builder as polished iPhone workflow with progress, clear section labels, review, consistent Back/Next/sticky safe-area actions, and preserved selections. No migration.
**State:** USER FEEDBACK RECEIVED; proposals NOT APPROVED AS FINAL and NOT CODED. Review interactive in-chat prototype, then implement in priority order after approval. PR #123 draft only, no deployment.
