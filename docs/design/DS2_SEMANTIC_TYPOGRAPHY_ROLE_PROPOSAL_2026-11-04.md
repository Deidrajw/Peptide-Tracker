# Nexus DS2 — Semantic typography role-map and targeted preview proposal
**Date:** 2026-11-04 (Toronto)  
**Production baseline:** main `755dea5eed417c1515543779fd81be77b6a504de`, v0.9.24-beta.  
**Candidate source:** `fd719b68dec475b8859c8a2380edbe190e6b603f` (draft PR #132, unmerged/undeployed).  
**Status:** Evidence-based DESIGN PROPOSAL ONLY. No typography changes implemented, no new version assigned.

## Reconciled source-matched evidence
Source-exact Chromium workflow #41803336431 (112 route/dialog captures at 320px and 390px, light/dark; zero runner errors, zero document horizontal overflow; artifact #13309235733) and real build source #41803336049 (artifact #13308678660) were reverified.

In 390px dark source-matched computed-style observations:
- `Today`: `.nx-daily-track-note` rendered 11px (substantive explanation).
- `Calendar`: "November 2026 · Resolved outcomes" and "Future doses are planned, not missed. Tap a day to explore records." rendered 11px.
- `Learn`: "Concentration and volume conversions only; not a clinical dose verification." rendered 11px.
- `Supplements`: `.nx2-supp-catalogue-note` explanatory saved-history note rendered 11px.
- `Settings > Health`: imported-records / HealthKit explanation rendered 11px.
- `Journal`: `.nx-journal-search-label` "SEARCH JOURNAL" and `.nx-journal-filter-label` "SHOW NOTES FOR" rendered 11px.
- `Today`, `Stash`, `Ask`, `Learn`, `Settings` repeated 9px `.mono` all-caps category/eyebrow text, e.g. "DUE / NEEDS ACTION", "YOUR KITS", "SAFETY", "NOTIFICATIONS" (29 distinct rows in 390px dark sampled screen inventory). These are not numeric metrics and should not be treated as such.
- The sampled route page title role remains uniformly 22px Fraunces. Other section-heading sizes may be intentional hierarchy; don't replace with one generic size.
- Some numeric/aligned technical text legitimately uses DM Mono. Do not infer all uses of a monospace family are wrong.

## Proposed role map (not approved, not coded)
| Role | Proposed default | Behaviour/rationale |
|---|---|---|
| Page title | Fraunces 22px | Preserve measured accepted header style |
| Functional/section heading | Existing system/DM Sans role; 16–19px by level | Consolidate only genuinely equivalent levels, retain visual hierarchy |
| Long explanatory copy | Readable body 13px, line-height ~1.5 | Strongest user-visible consistency candidate: 11px substantive paragraphs are small |
| Form field label | 12–14px by role; no arbitrary 11px on interactive search/filter | Improve readability without adding excess density |
| Categorization eyebrow | 10–11px, wider tracking only if contrast still sufficient | Keep compact, distinguish from technical/numeric values |
| Numeric/aligned measurement | DM Mono selectively, use 12px or more for primary numbers | Maintain alignment, avoid mono on editorial content |
| Buttons | Existing semantic role + 44px min touch target | Button *text* size must match role, not blindly set uniformly |
| Modal title/subtitle | Match semantic form/sheet level, allow distinct Plan and Stash content | Preserve different workflows, close target, footer/stage interaction |

## Required preview and testing before rollout
1. Create side-by-side original/proposed **real app** screenshots for Calendar explanatory note, Learn warnings, Supplements catalogue note, Settings Health, Journal search/labels and 9px eyebrows, at 320 and 390, light and dark. No source edits until preview approval for materially visible changes.
2. Compare computed wrap/height, truncation, vertical density, contrast, large text / Dynamic Type, and keyboard/sheet scroll behaviour.
3. Keep Calendar seven-column 320px day-grid geometry separate from typography and 44px button changes; no forced width that overflows.
4. Extend safe modal coverage beyond five dialog families before declaring consistency resolved.
5. Preserve accepted DS2 style, original datasets and localStorage, Check-In / Supplements / Log Dose / plans / inventory / histories, writer locking, and nasal LIVE safety gates.

## QA and release state
All six candidate exact-source workflows SUCCESS for `fd719b68`: nested #41803336119, WebKit #41803336156, mobile #41803336325, full build/parity #41803336049, global Chromium #41803336431, shared writer #41803336124. Build artifact #13308678660 outer 548 entries CRC PASS; LIVE inner 26 files CRC PASS with manifest exact membership and source SHA `fd719b68`; standalone fictional demo, no external script tags, offline demo ZIP matching standalone index byte-for-byte. Physical iPhone and VoiceOver NOT TESTED. No merge/deploy authorization.

**ONE NEXT ACTION:** produce and inspect screenshot comparisons for the bounded 11px long-form copy and 9px eyebrows and request visual approval before implementing any typographic redesign.
