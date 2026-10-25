# Nexus Design System 2.0 — Sprint 01 Preview Proposal
**Date:** 2026-10-25
**Status:** PROPOSED, not design-approved / coded / deployed.
**Baseline:** main c1c95e1, app v0.9.20-beta.
**Related:** draft future discovery PR #122 (independent), paused claims PR #121, unmerged contrast PR #118, unmerged blend parity PR #110.

## Objective
Establish a unified visual language for existing Nexus screens, preserving all protected behavior, records and UI approvals. Preview Today, Stash, Log Dose and Onboarding before global styling changes.

## Direction: Soft Depth
- Dark canvas: midnight/navy-violet with restrained upper atmospheric violet highlight.
- Light canvas: ivory/pearl with equally restrained lavender illumination.
- Cards: one elevated surface level, soft edge and minimal shadow; no stacks of nested borders.
- Controls: clear primary/secondary/tertiary treatments, softly graded primary action, visible disabled/focus/error states, consistent 44–48px targets.
- Icons: coherent optical weight, 20–24px outline SVG, small ellipsis appearance inside 44px targets, one-chevron-per-disclosure.
- Navigation: explore a pill-like treatment while retaining the five actual existing tabs (Today/Calendar/Protocol/Stash/More), preserving keyboard visibility and safe areas.
- Motion: 150–300ms purposeful sheet, selection and accordion motion, disabled with reduced-motion preference; no animated measurement arithmetic.
- Both themes: maintain legible contrast and selected states, independent light-mode evaluation.

## Fictional interactive design-preview entry points
1. Today: dashboard atmospheric background, informative cards, prominent log action.
2. Stash: existing kit action hierarchy with compact ellipsis, detail disclosure and optional COA/lot display.
3. Log Dose: consistent modal compound picker and route selection preview (SubQ/IM/IV/oral/nasal/topical); route is *not* a clinical recommendation; no save.
4. Onboarding: welcoming three-step visual journey for review. Future real production requirements include nonbypassable acknowledgment with non-destructive existing-user treatment; informational tour optional and skippable.

## Approval questions
1. Soft atmospheric gradient vs flatter canvas in each theme.
2. Floating pill navigation vs updated docked bar after 320px/390px testing.
3. Card and action elevation intensity, icon stroke and animation restraint.
4. Consent/onboarding visuals prior to engineering a durable production gate.

## Protected workflows
All five main navigation sections; single-date check-in/history; Supplements multi-select; dose drafts, source vials, single/multi-vial deduction; blend accounting/legacy KLOW; calendars, measurements, schedules, backups, localStorage key and migrations.

## Regression planning
- Before coding: verify current main, PRs, deployment parity and source structure.
- Browser: 320px and 390px, dark/light, long forms, modal scrolling, keyboard, sticky actions, focus, reduced motion, tap target sizing, chart readability.
- Logic: no changes to stored schemas, calculators, vial allocations, records, scheduling or dose calculations.
- Separate unmerged PR #118/#110 review; never assume this proposal resolves their failures.
- Physical iPhone acceptance must be user-performed and not implied by automated QA.

## Artifact gate
This branch contains **documentation only**. The in-chat interactive design concept is fictional and does not substitute for a tested source-parity FULL-APP DEMO or LIVE ZIP when a software release is produced. No app implementation, PR merge, deployment, performance test, or iPhone test has occurred.

**Next action:** review the in-chat preview and approve/adjust visual direction; then implement one targeted preview branch with full Nexus six-deliverable release protocol.


## 2026-10-25 — User-selected hybrid visual direction (APPROVED FOR REFINEMENT, NOT FOR DEPLOYMENT)

The user selected **Hybrid: Soft Depth + Porcelain + Obsidian precision** for the *design exploration*. This is not authorization to implement global code changes, merge, or deploy.

### Cohesive token recommendations — subject to visual QA
| Design aspect | Dark | Light | Invariant |
|---|---|---|---|
| Base | Midnight violet #171521 with restrained upper lavender glow | Warm pearl #F9F7F8 with very light lavender atmospheric glow | Prevent text/contrast failures |
| Surface | Deep aubergine #292436 | Clean porcelain #FFFFFF | Cards legible without nested border stacks |
| Secondary surface | #352D43 | #F4EEF8 | Separate interactive from passive blocks |
| Text | #F9F5FC primary, #CDC1D8 secondary | #292332 primary, #635A6E secondary | Verify contrast for all combinations |
| Primary interactive | Gentle lavender gradient #DEC5FA → #AF89E6 | Softer lavender gradient #D7B8F1 → #BC9BE9 | Dark text on light accent; full focus/disabled states |
| Data-dense blocks | Obsidian/navy subdued neutral surfaces and monospaced numerical alignment | Ivory/slate-ink data labels with subtle rules | No decoration near calculation results |
| Corners | Cards 18–22px; fields 12–14px; primary CTA/pill nav 999px | Same | One coherent rounded scale |
| Elevation | Very low shadow; 1px stroke only when necessary | Subtle shadow instead of unnecessary outlines | Never stack cards inside bordered cards without reason |
| Motion | 160–240ms controlled easing; modal ~260ms | Same | prefers-reduced-motion disables optional motion |

*Palette values are exploration tokens, not checked WCAG contrast ratios or ready-to-merge CSS.*

### Screen-by-screen coverage matrix — retain all workflows
| Area | Styling proposal | Functional protection |
|---|---|---|
| Today | Soft hero glow, compact progress cards, clear activity sections and one strong action | All due items, multiple recorded doses, recorded check-ins, symptom associations, drafts |
| Calendar | Pearl/obsidian precise month grid, legible selected day and weight values, consistent day sheet | Current-month default, numerical weight and day details |
| Protocol / Plans | Pill filters, clear phase hierarchy, subtle expandable steps | All plans, phase schedules, approvals, preserved dates |
| Stash | Quiet inventory cards, compact 28px ellipsis/44px target, status badges only where useful | Kit/vial history, combo composition, multi-vial math, safe source-selection |
| More / Learn | Group settings and guides into clear rows with one chevron | Discover, Intel, guide navigation, backups, Preferences, What's New |
| Log Dose | Strong header + selected compound sheet + groups with sticky CTA | Route-independent source math, drafts, allocations, blend deductions, edit and confirm |
| Check-In | Symptom sections, pill severity controls, calm validation and clear Save | Single record/date, mood, notes, supplements searchable multiselect and date-specific history |
| Measurements | Precise chart typography and compact timeframe controls | Weight/nutrition and all tracked history, no fabricated correlations |
| Kit create/edit | Basic fields first, optional accordion, shared blend and nonblend appearance | Existing kit/vial data preserved; optional COA still future only |
| Onboarding | Soft welcoming hero, concise consent presentation, privacy-first restore, optional journey stage, optional guided tour | Non-destructive restore and records, consent enforcement only after separate implementation approval |
| Modal/action sheets | Unified sheet handle, iconography, selectable lists, focus trapping, keyboard avoidance | No missing controls, hidden confirm, doubled scroll, or overlays trapping input |
| Accessibility | AA text target, focus indicators, 44–48px touch targets, keyboard/VoiceOver, reduced motion | No loss of function in 320/390 and both themes |

### Visual acceptance criteria and non-goals
- Maintain existing five real tabs (not the four demo-switcher screens); use the interactive in-chat preview only to test representative surfaces, never claim full-app parity.
- Allow dark/light switching for evaluation; evaluate icon optical geometry, transitions, active tab and modal sheet treatments.
- Preserve localStorage key and export/import shape. Do not rename element IDs, reorder scripts, change calculator/dose logic or touch existing backups.
- Avoid new data storage, account sign-in, cloud sync, COA upload and route-level dosing automation in this visual sprint: these are separate discoveries.
- Existing PR #118 contrast and PR #110 legacy-blend work stay isolated; paused PR #121 stays paused.
- **No implementation/tests/merge/deploy:** This document plus in-chat conceptual preview are the only deliverables in this design refinement stage.

**Next action:** Review full-app coverage and approve individual hybrid tokens (colors, radii, elevations, motion, navigation) before coding a release candidate.
