## 2026-11-04 — initial rendered computed-style audit (source-matched Chromium)
- Exact app baseline: main 755dea5eed417c1515543779fd81be77b6a504de. Test-only script/workflow committed in draft PR132; app CSS/JS/HTML unchanged.
- Corrected runner GitHub Actions #41793395698 SUCCESS at test commit 4545139cd90c5793411358ba2a29f364bda06cd7. 112 screen/dialog captures (23 route states + 5 safe modal openers across 320px/390px and light/dark), 0 runner-reported errors, 0 horizontal overflows; evidence artifact #13303529916 (~16MB) contains screenshots and computed-style-inventory.json/summary.json. Earlier first run #41793278067 SUCCESS had 96 captures/12 unreachable modal selectors because of test selector mismatches, corrected in the second run; not an app defect.
- Computed samples: page titles 52 samples Fraunces 22px; section headings 52 samples system UI 14/15/16/17/19/21px; body text 116 samples system UI 11/12/13/14px; labels 32 samples system UI 11/12/14/16px; mono samples 148 at 9/10px; buttons 1004 samples of system-ui and SF Pro-oriented font stacks with sizes 0/10/10.5/11/12/12.48/13/13.333/14/15/16/20/24px. Some 0px button typography likely icon-only buttons; need semantic filtering before declaring a bug. Sample counts are repeated across viewports/themes, not independent unique components.
- Status: SOURCE-MATCHED BROWSER RUN PASS for successful capture and zero overflow in sampled routes; visual inconsistency/contrast/size/accessibility defect determinations NOT YET VERIFIED by image inspection and semantic role matching. Captured screenshot files not independently viewed in this tool session. Physical iPhone VoiceOver/dynamic type NOT TESTED for this new sweep.
- NEXT ONE ACTION: analyze inventory JSON/screenshots by role and classify specific font, button and modal mismatches with screenshot names and selector evidence; extend safe modal matrix to remaining reachable child dialogs, keyboard and failure states. Preview only any major design change before implementation. No merge/deploy.

# Nexus — Global Typography, Button & Modal Consistency Audit
**Date:** November 4, 2026 (Toronto)  
**Scope:** Whole-app review requested by user; not limited to one screen.  
**Source:** Verified `main` `755dea5eed417c1515543779fd81be77b6a504de` (v0.9.24-beta, release merge `699fd373`).  
**Status:** Phase 1, static source inventory **COMPLETE**. Rendered computed-style matrix, screenshots, user review, physical iPhone accessibility **NOT TESTED** for this new audit. No application changes, migrations, merge or deployment.

## Product problem and outcome
User reports that Nexus appears to use too many fonts and that typography, buttons and modals are not always applied consistently. Audit each usage by semantic role and user flow, **not** by requiring every element to look identical. An excellent result is one coherent visual grammar: page title, section title, item name, metric, field label, supporting copy, primary/secondary/destructive action, navigation, form sheet and decision dialog should be recognizable across features. Preserve previously approved DS2 screens unless a reproducible inconsistency is found and the design correction is reviewed.

## Sources inspected and exact inventory (source-level, not rendered counts)
- `index.html` loads these CSS layers in order: `assets/css/nexus.css`, `nexus-disclosures.css`, `nexus-contrast.css`, `nexus-hybrid-preview.css`, followed by ordered application modules `assets/js/01-nexus.js` through `12-nexus.js`.
- All **four** CSS files and all **twelve** JS modules were read at the baseline SHA.
- CSS files contain approximately **1,063** text occurrences of `font-size:` declarations (545 + 4 + 24 + 490) and **3,783** `!important` tokens (1,193 + 49 + 138 + 2,403). These are source occurrences across revisions, rules, breakpoints and variants, **not** counts of visual defects, unique components or computed cascade conflicts.
- JS templates contain approximately **2,762** `style=` occurrences and **715** `<button` occurrences by literal source search, including reusable/generated templates, not necessarily distinct on-screen elements. Many JS files contain direct inline `font-size:` values. Dynamic DOM, duplicate template usage, JS-created nodes and runtime state cannot be fully enumerated from these counts.
- This inventory is a **maintainability and consistency risk signal**; it is not evidence that 3,783 button conflicts or 1,063 visually wrong sizes exist.

## Findings — grounded in source
| ID | Area | Source evidence | Assessment | Next proof required |
|---|---|---|---|---|
| T01 | Font families | `nexus.css:3,70-77`: Google font import DM Sans, DM Mono, Fraunces; body DM Sans; explicit `.serif` Fraunces and `.mono` DM Mono | **Confirmed** intentional multi-family baseline; not intrinsically wrong | Map actual page title, metric, data label, nav and button computed families |
| T02 | Scoped font exception | `nexus-hybrid-preview.css:1305-1317`: Today compound cards use system SF Pro-type stack `!important`, explicitly documented as intentional iPhone typography | **Confirmed** separate typography treatment; **not** labelled a defect because previously approved | Side-by-side Today/Plans/Stash comparison; decide whether to preserve exception or propose a role-based rule |
| T03 | Field-label inconsistencies possible | `nexus.css:89`: `.field-label` DM Mono/10px/tracking; `nexus.css:470`: modal field labels inherit/11px and normalize casing | **Confirmed** competing contextual definitions, **visual impact not tested** | Compare labels in actual Today Check-In, Stash Add, Log Dose, Protocol/Goals, Settings modal at 320/390 both themes |
| T04 | Type-scale proliferation | `nexus.css` 545 and `nexus-hybrid-preview.css` 490 explicit font-size declarations; JS templates also use inline 9–14px styling | **Confirmed** high variation/override density; **not** proof all are wrong | Compute role-specific font sizes, weights, line heights, tracking and usage across all screens, sheets and states; flag mismatches by role |
| B01 | Primary button styling layers | `nexus.css:111,475,677-680` and `nexus-hybrid-preview.css:70-79,169-178,193-194,4021-4029` contain successive primary-button radius, background, height, font and context-specific rules | **Confirmed** multiple applicable style layers; **cascade/runtime outcome not yet measured** | Computed matrix: CTA primary/secondary/destructive; visible size, shape, font, state, colour, target height across screens |
| B02 | Tap target differences | `nexus.css:474` permits modal button minimum 40px, and `nexus.css:476` modal segmented buttons 42px; `nexus-hybrid-preview.css:505,4024` raises selected modal primary actions to 48px; other specialized selectors exist | **Confirmed** different declared minima, but effective computed hit areas may override them | Verify actual bounding rectangles and hit boxes; prioritize critical 44–48px phone targets, without enlarging noninteractive text |
| B03 | One-off inline actions | 715 literal button source tags and 2,762 literal inline-style attributes across 12 JS files; several modal actions assembled with inline CSS | **Confirmed** reuse/maintenance risk, not 715 individual errors | Inventory by actual user-facing action and class; report visually inconsistent same-role buttons, not just CSS differences |
| M01 | Sheet foundation layers | `nexus.css:86-88,467-480` defines and revises bottom-sheet overlay, padding, radius, maximum height, inner scrolling and viewport rules; `nexus-hybrid-preview.css:179-182,497-505` further modifies modal geometry | **Confirmed** layered modal shell definitions; not yet demonstrated bad layout | Render sheet variants and review header, close position, footer, keyboard and safe-area geometry |
| M02 | Form-specific modal refinements | `nexus-hybrid-preview.css:4008-4040` styles Log Dose and prepared nasal Review/Entry, including text wrapping and 48px action targets | **Confirmed** targeted corrections that are protected; do not blindly replace with generic modal CSS | Check those actual screens first; baseline screenshot comparison and regression safety |
| A01 | Accessibility | `nexus.css:480` and `nexus-hybrid-preview.css:187-189` include reduced-motion handling; `nexus-contrast.css` contains focus/contrast patches | **Confirmed** targeted accessibility rules exist; whole-app WCAG AA or VoiceOver correctness **not demonstrated** | Keyboard focus sequence, explicit labelling, VoiceOver, larger text, motion and contrast sampling for real states |

## Recommended typography roles for design review — PROPOSED, NOT APPROVED/CODED
- **Display/title:** reserved for large page/section identity; evaluate Fraunces use for genuinely editorial headings only.
- **Interface/body:** one primary reading family for item names, copy, input, menus and most actions; DM Sans is current root family. Today system-font exception remains until a specific reviewed decision.
- **Data/numerals:** DM Mono only where tabular technical values, units or IDs materially benefit; do not automatically use it for every label/button.
- **Type tokens (to evaluate, not apply):** Page title; section title; card/item title; body; form label; helper/caption; compact metadata; numeric metric. Each role needs consistent family/size/weight/line-height/contrast and responsive rule, with a limited documented exception set.
- Eliminate **unjustified same-role discrepancies**, not intentional hierarchy. Avoid a blanket search-and-replace of small sizes or `!important` because of existing specificity and accessibility protections.

## Recommended button roles for design review — PROPOSED
- **Primary:** exactly one highest-emphasis next step per context; label and feedback match outcome.
- **Secondary/neutral:** Back, Cancel, View, Apply where they are not the main action.
- **Destructive:** explicit semantics and confirmation for consequential deletion; no destructive swipe-only action.
- **Selection:** chips, segmented controls, tabs — visibly selected versus focused.
- **Icon-only:** meaningful accessible name and measured 44–48px hit target.
- **State matrix:** default, pressed, focus, disabled, loading, success, failure, confirmation/undo; do not infer from colour alone.

## Recommended modal/sheet types for design review — PROPOSED
- **Bottom form sheet** for contextual editing; single scroll owner, close in common header, sticky main action where needed, keyboard/safe-area-safe.
- **Action sheet** for a short menu of choices; consistent row spacing, iconography and Cancel behaviour.
- **Confirmation dialog** for destructive or irreversible decisions; distinct action hierarchy and no accidental dismissal.
- **Multi-step workflow** for Add Kit/Log Dose where Review is required; explicit Back/Review/Confirm, preserved drafts and source-specific safeguards.
- **Informational modal** for read-only details; neutral dismiss action rather than an unnecessary primary Save-style CTA.
- Every variant must have clear open/close focus, dismissal recovery, back stack, keyboard avoidance, 320px fit, light/dark readability and VoiceOver names.

## Rendered QA matrix — NOT TESTED for this audit
| Area | 320 dark | 320 light | 390 dark | 390 light | Physical iPhone / VoiceOver |
|---|---|---|---|---|---|
| Today / Log Dose (chooser, Entry, Review, confirm, errors) | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |
| Calendar / day detail / edits | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |
| Plans / Protocols / Goals / pause / editors | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |
| Stash (kits, other forms, supplies, Add Kit, vial details, preparation) | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |
| Check-In / Supplements (history, template, save failure) | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |
| Trends / Weight / Nutrition | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |
| More / Settings / Profile / onboarding / backup & restore | Not Tested | Not Tested | Not Tested | Not Tested | Not Tested |

**Historical evidence not erased:** prior scoped PR124 16/16 and PR130 7/7+2/2 physical user reports and prior 320/390 CI remain valid for their specific source/flows, but are not scored as fresh results of this whole-app audit.

## Next execution (one priority)
Build or run an exact-current-main **computed typography/button/modal inventory** in isolated fictional DEMO at 320/390 light/dark. Capture screenshots and element role tables (computed family, px, weight, line height, contrast, min hit rectangle; visible modal header/close/footer and scroll/keyboard). Identify a short, evidence-backed fix list **without changing accepted UX**. Review major typography direction visually before implementation. A new feature/fix release would require source-matched full-app DEMO HTML, LIVE ZIP, regression, release notes, CI and explicit merge/deploy approval.

**Safety:** no real user storage, no new migrations; preserve write guards, source-matched vial histories, standalone nasal preparation, and both generic transfer and prepared nasal dose administration gates OFF. No current action changed these.
