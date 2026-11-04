# Nexus DS2 — Whole-app typography, buttons and modal consistency audit
**Date:** 2026-11-04 (Toronto)  
**Baseline:** main `755dea5eed417c1515543779fd81be77b6a504de` / v0.9.24-beta  
**Status:** SOURCE INVENTORY COMPLETED; rendered/browser and physical iPhone visual audit NOT TESTED  
**Scope:** four CSS layers and twelve numbered application JS files; index.html verified loads the four CSS layers in this order: nexus.css, nexus-disclosures.css, nexus-contrast.css, nexus-hybrid-preview.css. No application source or production data changed.

## User feedback and audit objective
User reports that fonts look inconsistent and may not be used appropriately. Extend DS2 to audit **all fonts, typography roles, buttons, modal/sheet/dialog variants and common component patterns** across every page and child state. Do not assume the feedback establishes a specific defect until computed-style and rendered evidence is obtained. Preserve previously accepted designs and behaviors.

## Initial exact-main source inventory (pattern counts, not DOM counts)
| Source | font-family declarations | font-size declarations | `!important` occurrences | `style=` occurrences in JS text |
| --- | ---: | ---: | ---: | ---: |
| nexus.css | 37 | 545 | 1,193 | — |
| nexus-disclosures.css | 0 | 4 | 49 | — |
| nexus-contrast.css | 0 | 24 | 138 | — |
| nexus-hybrid-preview.css | 29 | 490 | 2,403 | — |
| JS 01–12 combined | 4 | 1,398 | 9 | 2,760 |
| **Total** | **70** | **2,461** | **3,792** | **2,760** |

These are approximate lexical counts in source text, not unique rendered elements, computed rules, accessibility failures or distinct fonts. JS contains dynamic HTML strings and can include conditional markup; some matches may be in comments or strings. No browser was run for this inventory.

**Observed font imports:** DM Sans (400/500/600/700), DM Mono (400/500) and Fraunces (400/500/600) via Google Fonts import in nexus.css. CSS also specifies `system-ui`, Apple system font fallbacks and an explicit Apple/SF Pro stack in a hybrid-preview rule. Whether those declarations apply to distinct UI roles or conflict at runtime is UNVERIFIED. Multiple font stacks alone do not prove visual inconsistency.

**Potential maintenance risk requiring rendered verification:** layered CSS with many `!important` declarations and 2,760 inline-style occurrences can make the effective typographic and button hierarchy hard to predict. Do not delete overrides indiscriminately: later CSS may implement approved DS2 designs and safety-critical layouts.

## Proposed design contract for review (not yet approved or implemented)
1. **Body and interactive UI:** one consistent sans-serif body role; recommend DM Sans where existing approved design uses it.
2. **Editorial/display headings:** Fraunces only where deliberate and approved; no surprise serif headings in functional forms.
3. **Numeric and technical data:** DM Mono only for measurements, vial/stock numbers or tabular technical values where alignment helps; ensure labels remain readable.
4. **Typography tokens:** define named roles (page title, section heading, card title, body, secondary, label, caption, metric, button) with responsive size, weight, line height and letter spacing. Do not enforce a single font size for all roles.
5. **Buttons:** inventory primary, secondary, tertiary, destructive, icon-only, segmented/selection and disabled states. Check accessible names, minimum 44px targets, consistent focus and contrast, no role-confusing colour treatment.
6. **Modals and sheets:** inventory all opener → header/title → close → body → form fields → footer/CTA → validation/error/success → dismiss paths. Standardize geometry, close icon, scrim, scrolling, keyboard/safe-area ownership, focus management and destructive confirmation without removing needed differences between informational and transactional dialogs.
7. **Cross-component consistency:** inputs, pickers, search, chips, cards, badges, chevrons, bottom navigation and sticky actions; preserve approved semantic differences.

## Required next source-exact rendered audit
- Generate an inventory of reachable routes, nested editors and all modal/sheet openers from current main; map each to the responsible JS and CSS selectors. Do not infer completeness from string counts.
- Use isolated fictional-data full-app DEMO, never production storage, at 320px/390px and both light/dark themes. Capture computed font-family, font-size, weight, line-height, letter-spacing, button dimensions, modal structure and effective CSS source. Flag deviations *within the same semantic role*, not legitimate role differences.
- Inspect representative screenshots, including normal/empty/error/disabled states, keyboard-open and long content; verify scroll ownership, footer reachability and no clipped labels.
- Test VoiceOver names/focus order and larger text on a physical iPhone separately; automated emulation is not hardware acceptance.
- Produce a defect register: screen/state, screenshot/source SHA, expected token, actual computed style, severity, proposed shared fix, risk to accepted flows, test status.
- Before code changes, preview any material font hierarchy or modal redesign for approval. Implement only evidence-backed targeted fixes on a separate branch/PR; exact-source LIVE ZIP, isolated FULL-APP DEMO, regression, user UAT and explicit merge/deploy approval remain release gates.

## Current statuses
| Work | Status |
| --- | --- |
| Current main, CSS/JS file inventory | PASS (read-only source inspection) |
| Three imported font families and layered CSS | PASS (source observation) |
| Specific visually incorrect font/button/modal identified | NOT TESTED |
| Browser-computed typography, buttons, dialogs | NOT TESTED |
| 320/390 light/dark screenshots of all deep states | NOT TESTED |
| Keyboard, VoiceOver, dynamic text and reduced motion | NOT TESTED |
| Source changes, release artifacts, merge/deployment | NOT DONE / not authorized |

**ONE NEXT ACTION:** build and execute the computed-style/route-and-modal inventory on the current main in a fictional isolated full-app browser, then present a prioritized screenshot-backed inconsistency register and small proposed shared-component fixes before coding.
