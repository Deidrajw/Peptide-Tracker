# Nexus DS2 — Semantic typography and touch-target findings (Phase 2)

**Date:** 2026-11-04 (Toronto)  
**App source inspected:** main `755dea5eed417c1515543779fd81be77b6a504de`; candidate application code `c6872ebf897d6fae4ad18487ce9ad193a17b2336` (draft PR #132).  
**Evidence:** exact-code Chromium #41798219411, artifact #13306282484, `computed-style-inventory.json`, 112 capture states (23 route states + 5 safe dialogs × 320/390 × light/dark). Evidence ZIP byte-read and representative screenshot inspection completed within conversation.  
**Status:** Phase 2 diagnostic audit; **no new fixes implemented in this report**. Other unvisited screens/modals are NOT TESTED, not assumed pass.

## 1. Typography: semantic role—not mere number of families

The imported DM Sans / DM Mono / Fraunces trio does not by itself show too many font families; current computed UI relies heavily on the system font stack and an SF Pro-oriented header stack. The most reproducible issue to review is same-purpose readability and hierarchy:
- Longer body descriptions in **Calendar** (the resolved-outcomes line and scheduled-vs-missed explanation), **Supplements** (locally saved catalogue explanation), **Learn** (calculator limitations) and **Settings > Health** (imported-data limitation) are **11px**, although sampled body descriptions elsewhere use **12px–14px**. This is a measured role discrepancy; usability/contrast/user preference impact needs review, especially at larger Dynamic Type.
- Repeated small all-caps DM Mono labels are generally **9px** in Today, Stash, Ask, Learn, Settings, etc.; their role is frequently an *eyebrow/categorical marker*, not a numerical data value. Calling all such instances “technical metrics” would be incorrect. Proposed distinction: numeric data monospaced only when alignment benefits, category markers need legible token treatment, no blanket replace.
- **Journal** search/filter field labels render **11px**, while a sampled Calendar toggle label is **12px** and Settings usage label is **14px**. Compare same field-label roles before changing.
- Rendered page headings in sampled routes consistently use Fraunces 22px; section headings vary across 14, 15, 16, 17, 19, 21px. That variation may reflect legitimate hierarchy. Build token map rather than normalizing all to one size.

**Recommended bounded next typography correction (proposal, not coded):** introduce semantic tokens for readable explanatory copy (candidate 13px / line-height ≈1.5), functional labels (candidate 12–14px), compact eyebrows (candidate ≥10–11px where room permits), title and numeric display. Test actual line breaks and scrolling at 320/390 before any rollout; verify contrast, dynamic text, and user approval for visually material changes.

## 2. More below-preferred-size button surfaces in final candidate

These are **computed visible button boxes** in the 390px dark-theme route sample, not definitive failures of WCAG or physical-tap acceptance. Source audit cannot establish whether enlarged parent/adjacent tap regions are semantically equivalent. Prior first-slice calendar/month and App Updates Back controls have already been corrected in draft PR132.

| Route / control | Measured actual box | Suggested action | Status |
|---|---:|---|---|
| Learn > Guides / Discover / Stacking / Dose Calc | ~87×35px each | Inspect segmented-row parent geometry; prefer 44px-high interactive controls if layout permits | CANDIDATE |
| Learn > Dose calculator | ~155×35px | Increase touch height while preserving hierarchy and explanatory warning | CANDIDATE |
| Settings > Reminders > Enable | ~76×30px | Increase actual button target to 44px, keep secondary semantics | CANDIDATE |
| Settings > Phase reminders > Turn off | ~75×30px | Increase tap target and preserve state/actions | CANDIDATE |
| Profile > Timeline toggle | ~294×31px | Increase vertical target; preserve disclosure/caret context | CANDIDATE |
| Profile > Edit targets | ~115×42px | Increase ~2px to meet preferred 44px | CANDIDATE |
| Stash > Add Kit | ~366×41px | Small height fix to 44px; safeguard existing approved Stash layout | CANDIDATE |
| Settings > Developer > Erase All Local Data | ~366×41px | Investigate 44px without weakening destructive confirmation | CANDIDATE |
| Protocols > All filter | ~40×44px | Understand tab density and button spacing; avoid horizontal scroll | CANDIDATE |
| Calendar day grid at 320px | ~40×67px per day | **Do not force 44px width without redesign**: seven columns + gutters constrain geometry; audit WCAG target spacing and accessible labels; separate design decision if changing grid | DESIGN CONSTRAINT |

**Audit coverage limitation:** 390px sampled visible buttons had 12 undersized surface records; 320px had 38 largely due to seven-column Calendar cells. The 390px count includes 1 Protocols All control, 1 Stash Add, 5 Learn controls, 2 Profile controls, 2 Settings reminders controls and 1 Developer delete button. These numbers are not a count of all buttons across Nexus.

## 3. Modals/sheets: initial status

Five safe dialog openers per viewport/theme were captured: Today Log Dose, Plans Add Goal, Stash Add Kit, Trends Pattern, Trends Symptom Timing. Initial selector mismatches were test problems; corrected run has zero audit errors. **Do not declare all bottom sheets consistent.** Remaining child editors, confirm/dismiss/delete, error/success, picker variants, keyboard/safe-area and VoiceOver focus ownership must be inventoried and exercised before shared modal changes. Preserve distinct form-first, Review and destructive-confirmation semantics.

## 4. Prioritization and safeguards

1. Complete exact-head **build artifact and WebKit** verification for first candidate `c6872ebf`, plus full-app DEMO/LIVE package parity.
2. Audit actionable **30–42px target candidates** in Learn, Settings reminders, Profile and Stash; apply only approved semantics-preserving 44px min targets with screenshots and 320px overflow checks. Treat the 320px seven-column Calendar grid separately.
3. Compare typography role-based samples in full-screen/dense and keyboard states; preview proposed token hierarchy and material line-wrap changes **before** coding across all routes.
4. Extend modal coverage to all reachable editor depths and validation/failure states. Cross-browser, physical iPhone, larger text/VoiceOver remain separate acceptance gates.

**No merge or deployment authorized.** Production remains `v0.9.24-beta`, and all storage, writer, inventory, check-in and nasal feature gates remain protected.
