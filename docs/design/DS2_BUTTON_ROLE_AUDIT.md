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


## 2026-10-27 screenshot CTA closure: found inline #A78BFA!important on #today-dose-single 'Continue to dose log' in 04-nexus.js, overridden to canonical solid #C6A6F2 (CSS f238e6d2). Stash final Add to Stash stage tested with fictional fields and no save; 40623724305 SUCCESS, 4/4 320/390 dark/light screenshots show #ssave solid rgb(198,166,242), 13px radius/no shadow. Primary semantic assertions expanded in script a1cf67c6 for chooser, Protocol first log, Reaction Save, Stash final Save. Most recent audit 40623795341 pending at checkpoint. Existing dose math/data unchanged.


## 2026-10-27 PRIMARY SHADE DEFECT CONFIRMED and corrected: script a1cf67c6 flagged Today's first dose chooser #today-dose-single at rgb(167,139,250) in 320/390 both themes, while semantic primary requires rgb(198,166,242). CSS override alone had not changed it due inline !important in assets/js/04-nexus.js. Corrected original markup at 9436f41e with background #C6A6F2, dark text, transparent border, no gradient/shadow, 13px radius. Run 40623977189 pending, do not call this PASS before new result.


## 2026-10-27 Verified source-level correction 9436f41e: nested CI 40623977189 SUCCESS, evidence 12789125364 independently inspected. 128 screenshots=32 states×4 width/theme, 0 capture errors/overflow. Today initial Continue to dose log now rgb(198,166,242) in all 4 test contexts; Protocol Log first dose, Save reaction and Add to Stash final also same fill. Solid no-shadow treatment. Each role distinction remains primary/secondary/destructive/selection/disabled; contextual Today mint due dose remains separate open product decision. Physical iPhone not accepted; full app button parity incomplete.


## 2026-10-27 — Physical iPhone acceptance evidence gate (four priority CTAs)
- Reverified draft branch `ffb96f610ace9334c44a9b2285f1258ab3f41f67`, main `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e` before this documentation update.
- **Physical iPhone — NOT TESTED (all four):** (1) Log Dose → Continue to dose log → Quick/Review, (2) Protocol → Log first dose, (3) existing Reaction → Save, (4) Stash wizard → Add to Stash. No new user device screenshots, video, iOS/Safari recording or firsthand observations were supplied. Browser emulation cannot close this gate.
- **Automated evidence remains separate:** semantic fill and visibility passed in 128 screenshot cases at 320/390 light/dark in run 40623977189; single-vial 300mg vs 10mg safety test previously passed in 40621540795. Current-head workflows 40626757681 nested, 40626757720 mobile and 40626757650 build/parity report SUCCESS; these are not new physical iPhone tests.
- **No device failure verified** and therefore no justified app code patch. Residual deep-action audit should target Quick/Guided Review/Confirm, multi-vial/prepared-dose, nested Stash vial/outflow/waste editors, destructive Settings confirmation, Reaction subtitle date formatting and secondary/dismiss affordances. Do not reopen accepted Calendar/Plans/Supplies or re-style contextual mint Today button without a role decision.
- Keep global accessibility, typography, required fields, scrolling, navigation and motion polish **LAST**. No merge, Cloudflare deploy, schema change, saved-data write or real-data fixture. **NEXT ACTION:** gather actual iPhone Safari observations of these four draft-preview controls, record Pass/Fail with evidence, fix only reproduced failures on draft PR #123, and rerun nested/mobile/build QA.


## 2026-10-28 — Quick access accepted; next deep-action audit
- User confirmed the regenerated Quick access icons worked; mark **USER ACCEPTED for icon display**, limited to the screenshot-reviewed icon issue. Latest icon tests: nested workflow 40631718460 SUCCESS; mobile 40631718361 SUCCESS; build/parity 40631718395 was IN PROGRESS at verification. Physical acceptance of unrelated flows remains pending.
- Source review identified next deep-action surfaces: `assets/js/09-nexus.js` `editOutflowModal` (line ~1059), `logWasteModal` (~1116), `openNewVialModal` (~1271), and `assets/js/11-nexus.js` protocol management `mp-delete` plus Plans `pm-delete`. These are **SOURCE IDENTIFIED, NOT rendered/accepted**.
- Proposed next scoped sequence: inspect Stash edit-outflow/waste confirmation buttons and sheet layout first using isolated fictional data without saving, then test explicit destructive confirm/cancel semantics, then Protocol/Plans management sheets. Preserve inventory accounting and accepted parent screens; only fix reproduced defects.
- No new app feature or CSS change in this checkpoint. Do not merge/deploy. Global accessibility, typography, required fields, scrolling, navigation and motion LAST.
- ONE NEXT ACTION: add safe automated route captures for Stash edit-outflow and waste modals at 320/390 light/dark; inspect actual pixels and computed button roles before modifying styles.


## 2026-10-28 — Stash outflow screenshot acceptance + danger/confirmation audit
- GitHub nested run 40631961194 SUCCESS, artifact 12792185822 downloaded and 8 screenshots (Edit Outflow, Log Outflow × 320/390 × light/dark) inspected. Both sheets render in all four combinations; Edit Outflow Save Changes is flat primary lavender. Log Outflow `#waste-save` appeared lavender **despite** inline red request, a confirmed semantic-style defect.
- Scoped correction `c345c8d5` assigns distinct caution/danger red `#a62c4a`, white label, no gradient/shadow to Log It only; test `32817090` adds computed colour assertion in all four browser variants. **Post-fix CI/visual QA pending**. No production writes or merge/deploy.
- Close X exists in each modal; no labelled Cancel. Nested whole-vial selection sheet provides X but clicking a vial option directly commits an outflow, no separate Confirm step. DO NOT claim confirmation flow validated.
- **SOURCE-DISCOVERED INVENTORY RISK (not corrected here):** `logWasteModal` partial-outflow branch accepts `mg > openVial.remainingMg`, clamps remaining to zero but records the larger requested amount; requires separate transactional validation and regression before release. This is an observed code-path risk, not a live-data incident. Avoid modifying inventory logic casually; preserve existing records and migrations.
- Next audit priority: isolate and test partial overspend and whole-vial choice/cancel flow with fictional fixture, then assess confirmation/button hierarchy before Protocol/Plans management. Global polish last.
