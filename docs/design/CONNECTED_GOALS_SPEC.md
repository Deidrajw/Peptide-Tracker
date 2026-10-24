# Nexus Connected Goals — Product & UX Specification
Status: APPROVED DIRECTION / DESIGN SPECIFICATION; IMPLEMENTATION NOT STARTED
Date: 2026-10-24
Baseline: GitHub main `051f8203180e1aac486f93fc81841cd878f7c05f`
Owner: Nexus product/design. Do not infer a production deployment.

## Product promise
Goals answer "What am I trying to accomplish, how is it going, and what should I review next?" Existing Today, Check-In, Journal, Protocol, Plans, Stash, Calendar and Insights remain the canonical sources for their records. Goals aggregate **references** to relevant evidence; no duplicate journal/dose/symptom/measurement records and no automatic causal attribution.

## Current source evidence
- `assets/js/11-nexus.js` `plansView` uses `state.plans.goals`, active/other groups, static `metrics` free text, statuses active/planned/paused/completed, `compounds`, `targetDate`, `notes`.
- `goalModal` edits those fields and saves them to `state.plans.goals`. Existing editing/delete and data persistence must remain.
- `protocolBuilderModal` already has `goalId` and `goal` fields and a Goal builder step, while protocol `status` includes draft, planned, active (Ready), in_progress, paused, completed, archived.
- `protocolsView` partitions LIVE, PLANNED, DRAFTS and completed/archived; it currently mutates `p.status` in render when associated compound doses exist. New filter must not introduce additional in-render writes, distort status or leak irrelevant archived items.
- Check-In/day symptoms, weight and notes are separate history sources. Goal surfaces should read their existing records, not fork them.
- `researchModal` stores a legacy goal **name** string; it must survive goal rename and migration without silent mismatch.

## Main UX IA
1. **Plans > Goals**: compact cards (title, status, primary progress representation if available, next review, linked-protocol count); no heavy charts or always-visible edit controls. Card opens Goal details; ellipsis retains context menu/edit/delete.
2. **Goal detail**: Overview (most recent meaningful indicator + progress model + evidence provenance and date), Connections (protocols + supporting evidence sources + optional manual links), Activity (dated, filtered, read-only timeline and reflections).
3. **Protocol tab**: status filter chips All / Not started / In progress / Paused / Completed; optional separate Archived within Completed or More. Not started groups draft, planned, and ready/active **without** rewriting stored status; in progress is only `in_progress`; pause/completion retain semantics. Show count and useful no-match empty state with Reset filter. Preserve existing cards, management ellipsis, phase details and activation handlers. Don't automatically interpret any dose of a matching compound in another protocol as proof this protocol started: audit existing `hasDoses` behavior before release.
4. **Today**: small optional Goal review due / goal progress snippet; explicit open detail action; never interrupt automatically.
5. **Check-In / Journal / Insights**: original source screens persist. Offer optional linked-goal association on new or edited records when contextually meaningful, and link back from goal Activity to original record/edit route. Only add linking where record identity and one-record-per-date rules can be upheld.

## Flexible progress model (one goal, multiple optional indicators)
Required primary mode, may be changed later without deleting history:
- **Quantitative**: baseline, desired direction, target value or range, canonical unit, user-chosen source (e.g., existing weight/measurement records). Only show percent complete when mathematically well-defined and appropriately bounded; show original values and dates, handle gain/decrease targets, overshoot, missing baseline, sparse data and unit preference conversion.
- **Subjective**: stable user-defined 1–5 rating or comparable consistently-worded check-in, show dates and trend without claiming objective biology. Symptom intensity only if user explicitly maps an existing symptom, not automatic association.
- **Milestones**: user-managed dated checklist; percent applies only to explicitly defined countable milestones, not physiological outcomes.
- **Exploratory**: question/intention, linked activity, reflections, next review; **no invented 0–100% score** or automatic "success".
Supporting indicators may include existing symptom, mood, weight, measurement, health-import records, optional dated reflections and linked protocol statuses; always distinguish observed values from inferred clinical effects.

## Examples / evidence guardrails
- Weight loss: baseline 200 lb, target 180 lb, latest 185 lb => display 15 of 20 lb difference; attach measurement date and source, never attribute change to a compound or protocol.
- Skin: photos and a repeated subjective clarity rating, optionally user-selected symptom series; photos are optional and governed by existing photo storage safeguards.
- "Better mitochondrial function": exploratory by default; energy, exercise or self-ratings are proxies and **do not establish mitochondrial function**.
- Hormonal health: symptom history and explicitly imported/entered lab trends may be contextual; do not infer hormonal balance or diagnose from symptom reports.
- Recovery/sleep: rating, named symptom trends and milestones, not a single fabricated wellness score.

## Goal review interaction
User-controlled optional frequency Off / Weekly / Every 2 weeks / Monthly. In web app, reminders are **in-app while Nexus is open**, not guaranteed push. Today notice (dismiss/snooze); tap launches compact bottom sheet: progress sentiment (on track / challenges / reconsidering), optional notes, date/time and next review. Save review in a new goal-specific record keyed to stable goal ID, not existing Check-In; support history/edit/delete. No unsolicited blocking modal; do not automatically complete goals when target reached. Native push notification planning is separate and must be opt-in with platform permissions and actual push support.

## Proposed additive data design — subject to implementation audit
Keep existing `state.plans.goals[]` and add optional `progressModel: {type, source, baseline, target, targetRange, unit, direction, ratingLabel, milestones[]}`, `reviewSettings: {frequency, nextReviewAt, remindersEnabled}`, `linkedProtocolIds: []`, `linkedRecordRefs: []` (typed stable source/id; no full copies). Keep existing `metrics`, `compounds`, `notes`, `category`, `targetDate`, `status` intact. Consider `state.goalReviews[]` entries `{id,goalId,date,sentiment,notes}`.
Existing protocols have goalId/goal fields with historical goal/template semantics: distinguish preset template/category IDs from **actual user goal IDs**, do not overwrite `goalId` blindly. Build a verified mapping and explicit goal selection; no fuzzy auto-link by identical names. Ambiguous/unmatched old name strings remain visible, labeled "Needs relinking" until user confirms.
No destructive migration. Versioned additive normalization and backup/restore compatibility are required before release. No changes to `peptide-tracker-html-v1` storage key without separately authorized migration.

## Read-only evidence and privacy
Only display relevant existing records with dates, source and direction. Never silently associate every symptom/dose or claim intervention causality. Handle missing values and no matching records with specific, calm empty-state explanations. Provide visibility and unlink controls; changes to a source entry propagate via re-query; unlink never deletes the original record. Imported Apple Health or other sensitive data must not become automatically exposed in goal views without user choice.

## Phased deliverables / acceptance
### Release A — Foundation
Protocol status filter; stable explicit user Goal ↔ Protocol association; basic Goal detail with Overview / Connections / Activity scaffold and existing details. Existing protocol status transitions unaffected. Test empty results, Draft vs Planned vs Ready grouping, paused/completed archive, create/edit/rename/delete goals, preservation of existing protocol template goal selections, cross-links both ways, 320/390 light/dark and keyboard.
### Release B — Progress & evidence
Structured progress models; read-only goal evidence from existing weight/symptom and optional linked records; provenance, unit changes, edit propagation, no spurious percentages, no automatic causal conclusions, migration fallback of `metrics` text.
### Release C — Reviews & engagement
Review bottom sheet, history, optional due-card in Today, Off/weekly/biweekly/monthly in-app reminder scheduling, snooze/dismiss, no push claims, accessible focus and safe-area behavior. Native push only in later scoped app-store project.

## QA / ship gates
- Test actual app and FULL standalone DEMO from **same source** at 320px/390px light/dark, with fictional isolated localStorage; no live writes.
- Preserve Check-In's single record/date, symptom intensity/links, supplements search/multiselect/date histories; Log Dose draft/source/vial allocations; Calendar Month default; Stash history/reconciliation; Protocol phases/paused schedules.
- 44–48px tap targets, accessible focus labels, touch sheet scroll, no duplicate chevrons, no nested double scroll, WCAG AA when feasible.
- Each app release requires in-chat fictional demo, complete standalone DEMO, offline DEMO ZIP, LIVE ZIP, release notes, interactive regression checklist and verified branch/PR/CI/merge/deployment. Do not count this design spec as a release.
- Independent calculator PR #67 and historical #40 remain **HOLD MERGE**; no clinical claims or calculator production promotion in these goal releases.

## Open engineering decisions (not blockers to spec)
1. Resolve dual use of protocol `goalId` as template/category vs saved Goal reference.
2. Stable source IDs for historic Check-In and Journal entries; prefer read-only date references until verified.
3. How to support quantitative ranges and measurement units without arbitrary conversion or false progress.
4. Notification timing and quiet hours only after in-app reminder behavior proven.

## Next action
Implement **Release A**, starting with Protocol status filtering on a targeted branch and an interactive full-app preview, while keeping storage schema unchanged until safe Goal–Protocol linkage resolution is tested.
