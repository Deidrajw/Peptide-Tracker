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
