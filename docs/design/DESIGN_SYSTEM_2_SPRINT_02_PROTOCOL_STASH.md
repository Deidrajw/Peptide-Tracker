# Nexus Design System 2.0 — Sprint 02: Protocol + Stash
**Date:** 2026-10-26  
**Status:** IMPLEMENTATION PLAN ONLY — NOT CODED, MERGED OR DEPLOYED  
**Working PR:** [Draft #123](https://github.com/Deidrajw/Peptide-Tracker/pull/123)  
**Baseline:** main `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e`; branch at planning start `6cda650996df9bdd5a7b69b45cca65ba199e3117`. Reverify before implementation.  
**Release gate:** No merge, production deploy, migration or user-data imports without explicit approval.

## 1. Objective and current boundary
Finish Sprint 1's *automated* browser release gate first, then refine existing Protocol/Plans and Stash/Inventory surfaces under the user-selected **Hybrid Soft Depth + Porcelain + Obsidian precision** design. Calendar Week/Month, Day View/All Logs, Today, and the corrected plus-only Add Log button are accepted as existing workflows, not Sprint 2 rebuild targets. The initial Sprint 01 design file's "documentation only" wording describes its original state and has been superseded by candidate implementation and subsequent evidence on PR #123.

## 2. Scope, prioritized
### S2.1 — Protocol / Plans card hierarchy (targeted visual pass)
- **At-a-glance:** compound/plan name, actual status, relevant saved schedule and dose facts before secondary content. No invented timing or progress data.
- **Disclosure discipline:** a single consistent chevron for content expansion; ellipsis only for contextual actions in bottom sheet (no inline expanded action clutter). Keep Intel independently discoverable.
- **Goals and phases:** improve label/data hierarchy, line wrapping, numerical legibility and collapsed summaries without changing phase sequencing or protocol model.
- **History/editing:** keep existing saved dose history and edit routes; never silently replace them with read-only summaries.
- **Screen size/theme:** 320px and 390px, dark/light, minimum 44–48px interactive targets and controlled sheet/keyboard scroll.

### S2.2 — Stash cards and kit detail parity
- **Card hierarchy:** kit/compound identity, active/frozen status, stock/vials, optional factual lot/expiry, then context actions. Keep actionable data above secondary metadata.
- **Actions:** compact ellipsis visually inside 44px tap target; one bottom action sheet rather than controls pushing cards downward; no redundant chevrons, stacked outlines or overlapping labels.
- **Blend/nonblend parity:** shared create/open/edit/detail shell; only formula/component fields differ as necessary. Preserve component splits, stock units, vial allocations, inventory deductions and legacy KLOW data.
- **Selectors:** keep filter/sort/group and active-vial logic. Preserve equipment/supplies, historical transactions and source eligibility.
- **Safe presentation:** signal empty, low-stock and insufficient-stock states without a destructive auto-correction.

### S2.3 — Cross-screen component consistency
- Reuse approved Hybrid design tokens for heading scale, card radius, surface elevation, icon stroke, labels, fields and responsive spacing.
- Ensure action sheets, confirm/close buttons, focus states, safe-area footer and reduced-motion behavior are consistent; do not alter underlying arithmetic.
- Maintain all five main tabs and do not add unapproved routes or clinical dosing recommendations.

## 3. Out of scope / safeguards
No app-wide redesign wholesale; no database/storage migration; no new cloud sync, authentication, COA upload, calculators, medical dosing claims or changed protocol/schedule logic. Preserve `peptide-tracker-html-v1` (unless latest source demonstrates otherwise), saved Check-Ins, supplements and symptoms, Weight, Nutrition, scheduled instances, logs and edits, backups, historical-dose/vial math and all already-approved Today/Calendar work. Do not merge concurrent older PRs #110/#118/#121 by accident.

## 4. Incremental execution gates
1. **S1 exit:** Confirm final latest-head full browser + mobile CI with 320/390 dark/light and source-identical complete LIVE ZIP/isolated full-app DEMO. Treat Cloudflare production parity and real iPhone as separate gates.
2. **Inventory current UI:** Capture current Protocol, Plans, Stash, new/edit vial, and existing action sheet in both themes/widths; list actual overflow, duplicate controls and density issues. Prioritize actionable defects over aesthetic churn.
3. **Preview S2.1:** Fictional in-chat interactive side-by-side Protocol card and expanded detail, with working status/disclosure/action controls. Obtain targeted design feedback before major structural revisions.
4. **Implement S2.1:** Smallest code/CSS changes possible on PR #123; add automated parity tests; no storage rewrites.
5. **Preview and implement S2.2:** Separate blend/nonblend and inventory sheet cases; user visual acceptance before larger rewiring.
6. **Signoff:** Full browser/functional regression, exact-source LIVE ZIP, isolated complete DEMO HTML and offline ZIP, release notes, four continuity docs, physical iPhone QA clearly noted; retain PR draft until explicit merge/deploy approval.

## 5. Regression matrix — required evidence
| Flow | Check |
|---|---|
| Protocol | Cards, phase/goals, status, schedule, Intel, single disclosure and contextual bottom sheet |
| Protocol history | Existing dose detail/edit and date-specific persistence, without duplicates |
| Stash | Kits, vials, Supplies, filter/sort/group, active/frozen display and inventory history |
| Vials/blends | Open/create/edit parity, component math, legacy KLOW; no loss of saved values |
| Dose logging | Draft recovery, source selection, scroll/confirm, single/multi-vial deductions, insufficient inventory, no duplicate allocation |
| Protected | Today, Calendar Month/Week, Day/All Logs, Check-In, Supplements, Weight, Nutrition, More/backups |
| Visual | LIVE/DEMO at 320px and 390px light/dark, no clipped text/overlap, 44px minimum, focus, safe areas, reduced motion |
| Isolation | Fictional full-app DEMO cannot read or write production storage/network; exact-source ZIP manifest matches candidate commit |
| Acceptance | Distinguish GitHub automation, real iPhone Safari/VoiceOver, and independent Cloudflare verified deployment |

## 6. Definition of done
Sprint 02 can be marked **IMPLEMENTED** only after code and tested branch artifacts exist; **ACCEPTED** only after user approves visuals/behaviors; **RELEASED** only after explicit merge approval and independent primary Cloudflare source/deployment verification. Do not use passing CI alone as a release or physical-device signoff.

**One concrete next action:** After confirming full Sprint 1 automated QA success, create the S2.1 Protocol/Plans fictional interactive design preview based on actual current source hierarchy, and gather targeted visual acceptance before modifying card structure.
