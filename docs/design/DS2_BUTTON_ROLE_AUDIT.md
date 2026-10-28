# DS2 — Button semantics and fictional-data visual audit
**Audit:** 2026-10-27 | **Source:** draft PR #123, screenshot/test source d66fd3e1 | **Evidence:** GitHub Actions run #40619990770, artifact #12787365423 | **Status:** verified for captured routes, not entire app

## Test environment and integrity
- A fresh Chromium mobile-emulation context for every width/theme: 320 and 390 pixels × light/dark.
- Localhost-only; no production/preview network target. The real application enters built-in `enterDemoMode('weight_loss')`, whose `saveState` method does not write demo data into persistent localStorage.
- The runner demands populated fictional data and confirms **2 fictional Stash kits, 54 check-ins and 27 dose records** across all four contexts. Rendered snapshots cannot silently fall back to onboarding or the wrong route.
- Captures: **112** route/action snapshots = 28 states × 4 contexts. **0 errors or document-level horizontal overflows** in action-inventory.json. The actual screenshots were spot-checked, including Today, Stash/Add Kit, Settings/Data Management and Nexus Ask. This is not physical Safari testing.
- CI: nested screenshot run **40619990770 SUCCESS**; mobile form regression **40619990814 SUCCESS**. Release-artifact workflow **40619990796 was still in progress at recording**.

## Button-role classification and interpretation
These are *observations repeated across states and viewports*, not unique buttons. The `button-role-audit.json` contains each computed background, border radius and shadow for independent review.

| Semantic role | Observations | Distinct background/radius/shadow combinations | Interpretation |
|---|---:|---:|---|
| Primary | 48 | 5 | Named global CTAs and Kit wizard Continue use #C6A6F2; Today scheduled in-card Log dose uses mint #7DF9C0, a *contextual accent candidate*, not automatically approved |
| Secondary | 52 | 4 | Back and informational Done controls use neutral surface; variation across theme and icon vs text density can be legitimate |
| Destructive | 32 | 4 | Seven data-category removals use subtle red; full reset stronger red, a justified risk distinction |
| Selection | 60 | 9 | Selected and unselected tabs must differ by design, not a DS2 defect |
| Disabled | 4 | 2 | First-step Back disabled by workflow; reduced emphasis is expected |
| Unclassified | 1,340 | 60 | Many contextual icon, navigation, disclosure and variable-label buttons not yet safely mapped; **not visually accepted or presumed defective** |

## Observed role decisions
1. **Continue / Save / global Add**: one primary DS2 treatment unless context intentionally distinguishes a direct scheduled action. Violet `#C6A6F2` is verified on Today global Log dose, Plans Add Goal, Stash Add Kit, Supplements Add and Kit wizard Continue in captured states.
2. **Back / Cancel / informational Done**: neutral surface and outline; do not visually compete with primary Save/Continue.
3. **Destructive**: restricted red tint, explicit confirmation for irreversible actions. Individual data category delete and full wipe differ intentionally in severity.
4. **Selection**: active state requires a visible surface contrast from inactive state; this is a valid change in shading.
5. **Disabled**: controls must be visually and functionally disabled; reduced emphasis is appropriate.
6. **Contextual Today card Log dose**: captured mint fill differs from global violet within the broad `primary` classification. It may encode an action on the actively due occurrence; this requires an explicit DS2 token/role decision before changing an accepted Today screen.
7. **Corner radius**: primary buttons range roughly 12–17px in captured 390px dark states, due to container/wizard-specific density. Harmonize by component size only after confirming differences are not intentional.

## Remaining gaps — MUST NOT count as PASS
- Current classification leaves 1,340 repeated button observations unclassified. Manually map contextual, sheet, disclosure, menu, delete and icon-only controls with named semantic roles; avoid blanket CSS selectors.
- Only five safe in-DOM modal openers have screenshot tests: Today dose chooser, Add Goal, Add Kit, Pattern Explorer and Symptom Timing. Real click-through into Quick/Guided Log and final review, editors, date pickers, confirmations and every action sheet remains incomplete.
- Backup Import opens native file picker, not a DOM sheet; separate isolated file-selection and restore-confirmation tests are required.
- Actual insufficient-inventory save guard for the user's screenshot (300mg selected dose, vial showing 10mg remaining), single/multi-vial allocations, draft preservation and mutations remain **NOT TESTED**.
- Real iPhone Safari, VoiceOver, keyboard and gesture acceptance are separate. No merge/deployment without explicit approval.

## Next test
Expand the fixture-based nested click traversal, audit all action affordances against the documented role taxonomy, then test dose source inventory in an isolated fictional transaction. Maintain user-accepted Calendar, Protocol/Plans and Supplies layouts until there is a demonstrated defect. Global typography/accessibility/navigation/motion polish stays last.


## 2026-10-27 — Single-vial fictional transaction verification
CI run 40621540795 PASS for scripts/ds2-dose-inventory-regression.mjs. In localhost isolated Demo Mode, one open Retatrutide vial set to 10mg; 300mg save attempt does not add a record or deduct stock, and separate 2mg save adds exactly one record and deducts to 8mg. This is one-vial UI save path, not all multi-vial, prepared, edit, import or physical iPhone flows. Earlier NOT TESTED statement above is superseded only for these two cases. Next: classify remaining contextual controls and extend nested editor and multi-vial transaction QA.


## 2026-10-27 — User screenshot comparison and targeted hierarchy correction
User supplied 10 screenshots of CTAs: Add to Stash, kit wizard Continue, dose Continue and Confirm Log, Save/Record reaction, Protocol first-log card action, and contextual Add dose. The appearance differs without documented role distinction for several instances, especially gradient reaction save and kit save. DS2 primary token: solid #C6A6F2 with #24182F text, no gradient/shadow; secondary Back/Cancel/Done neutral; destructive red; selection chosen vs unchosen; disabled muted. CSS fb05e322 and 5f0be242 normalize reaction Save/Open and Stash Add/Save; Protocol first-log redesigned as a stacked neutral card with full-width lavender primary action, changed copy to 'Log first dose' in 0445f6b0. Protocol Activate uses same primary token. Primary-vs-contextual Today scheduled dose mint remains distinct pending documented role decision, no silent change to accepted Today. Test bd6c374e adds Protocol route snapshot; first-log CTA may be absent with demo fixture. Tests/real iPhone acceptance still pending. Existing dose inventory math, protocol status and storage untouched.


## 2026-10-27 POST-FIX RENDER EVIDENCE: updated screenshot test 9c5f5c65 CI 40623390625 SUCCESS, with 124 screenshots = 31 route/action states × 320/390 × light/dark, including dedicated active/no-dose Protocol first-log and saved-dose Reaction editor. Downloaded artifact 12788965151. Protocol CTA 'Log first dose' uses #C6A6F2, radius 13px, no shadow across 4 combinations. Save reaction same computed style across 4 combinations. This validates named buttons only; remaining contextual variants, final Stash Add/Save stage and other nested actions unverified. Reaction editor screenshot exposes a raw ISO date in subtitle (separate formatting gap, not changed in button pass). No real iPhone testing.
