# Nexus iOS / App Store readiness audit (initial)
  
**Audit date:** 2026-10-23 (America/Toronto)  
**Repository:** Deidrajw/Peptide-Tracker  
**Source baseline:** main commit `1af0cfddf3780b7f08524b3b1ede9e878d645bd9`, app display `v0.9.4-beta`  
**Parallel web work:** PR #27 (v0.9.5 symptoms) remains in progress; this planning branch must not change or merge it.  
**Status:** INITIAL CODE/DOCUMENT REVIEW; NOT legal, clinical, medical-device, Apple, or security certification. No app source modification, iOS package, TestFlight upload, approval, or deployment.

## Explicit scope and product constraints
User's goal is a **public Apple App Store iOS release** of Nexus, while preserving the existing GitHub Pages app and every saved real record. Keep the browser production at https://deidrajw.github.io/Peptide-Tracker/ independently deployed from root `index.html` plus existing CSS and ordered JS. Preserve existing app functionality in WEB; never strip features from production to simplify App Store review. All regulatory modifications proposed for an iOS-specific build require user approval; no bypass or concealed functionality. Retain local-only fictional demo isolation and six Nexus deliverables whenever *application code* changes.

## External primary sources and questions
- Apple App Review Guidelines (current reading): https://developer.apple.com/app-store/review/guidelines/
  - §1.4.1 medical accuracy, professional consultation, potentially harmful outputs.
  - §1.4.2 drug dosage calculators: approved-origin/regulatory requirement.
  - §1.4.3 encourages consumption of illegal drugs; assess jurisdiction and presentation; no assumption that mentioning research peptides itself constitutes a violation.
  - §4.2 minimum app-like lasting utility beyond web wrapper.
  - §5.1.1(i), (ix): privacy policy, data handling, and legal-entity submission for highly regulated or sensitive services.
  - §5.1.2(i), §5.1.3: disclosure/consent for data shared with AI third parties; health data constraints.
- Health Canada SaMD guidance: https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/application-information/guidance-documents/software-medical-device-guidance-document.html
  - Intended use and actual functionality matter; passive personal records differ from software supporting treatment decisions.
  - Health Canada classification and applicable market authorization must be reviewed by qualified counsel/regulatory professional if any calculations or therapy guidance are offered in public release.
- Capacitor existing-web integration: https://capacitorjs.com/docs/getting-started
- Apple app privacy label: https://developer.apple.com/app-store/app-privacy-details/

## Code-based feature triage — static source audit only
| Risk | Feature and evidence on baseline main | Disposition before App Store build |
|---|---|---|
| HIGH / BLOCKER to assess | `assets/js/10-nexus.js` `reconCalcView()` accepts vial strength, diluent, intended dose and syringe size, returning directions including **“Add ... mL diluent”** and **“Draw ... units”**. | Drug dosage calculation and medication-preparation instructions; do not assume Apple §1.4.2 eligibility. Qualified medical/regulatory review and test strategy required. |
| HIGH / SAFETY DEFECT CANDIDATE | In `reconCalcView()`, the code converts **IU to mg by multiplying by 0.001**, regardless of substance. A universal IU→mass conversion is scientifically invalid. | Reproduce with synthetic cases; do not rely on calculated values; independently prioritize web safety investigation and separately audit all unit domains. No silent change to production in this planning PR. |
| HIGH / SAFETY DEFECT CANDIDATE | `reconCalcView()` computes `syringeUnits = unitsRaw / 100 * syr.max` for 30-unit/50-unit U-100 syringe choices; this appears to rescale dose units according to capacity, not syringe calibration. | Validate clinically and with deterministic numerical test vectors; verify rendered label/display for each capacity; do not mark calculator safe on visual tests alone. |
| HIGH | `assets/js/08-nexus.js` `compoundIntelView()` shows **“Units to draw”**, dose-based recon examples and a highlighted **“SUGGESTED”** BAC water option. | Evaluate all recommendations and calculation dependencies; simply adding “educational” disclaimer is not adequate resolution. |
| HIGH | `assets/js/03-nexus.js` prepopulates compound benefits, suggested/“typical” dosing, frequency, cycles, timing and injection routes, including experimental/unapproved compounds. | Content-by-content clinical/source accuracy and legal jurisdiction review; distinguish label-approved prescribing from community anecdotes; no public therapeutic recommendations without clearance. |
| MODERATE–HIGH | `assets/js/06-nexus.js`, `08-nexus.js`: user-specific dosing/symptom insights and PK concentration estimates. | Determine whether they imply individualized clinical guidance; document assumptions, uncertainty and source evidence. |
| MODERATE | `assets/js/04-nexus.js`, `05-nexus.js`: dose recording, prepared syringes, consumption allocation, concentration/unit display, schedules. | Preserve historical logging; partition historical arithmetic/inventory from procedural dose instruction. Safeguard user-entered schedules. |
| LOW–MODERATE | Daily Check-In, symptom severity, supplement logging, Calendar, weight, nutrition, notes. | Primarily self-reported tracking; preserve data semantics; proper privacy/security controls and non-diagnostic positioning. |
| MODERATE | `assets/js/11-nexus.js`: Apple Health **file import** and data export/restore. | Assess file accessibility, iOS import picker compatibility, whether any future HealthKit native integration is planned; ensure correct privacy labels and permissions. |

**Clinical safety note:** The IU conversion and syringe capacity math are candidates for incorrect dosing results identified from static code, **NOT numerically verified by running the app**. Treat as urgent safety QA with medically qualified reviewer before any public distribution; web production remains untouched by this documentation change.

## Protection plan — hard invariants
1. Maintain existing GitHub Pages workflow rooted at `index.html` (3 CSS + 12 ordered JS on v0.9.4 baseline) unchanged; preserve PR #27 and normal release workflow. Distinct **web** and **ios** build/deployment pipelines from a shared, version-pinned source snapshot.
2. Add iOS packaging later under a separate `ios-app/` or comparable directory; `webDir` generated by copying exact web source into build assets, **not** by pointing to live production or replacing root `index.html`. Use Capacitor WKWebView with real offline assets and native affordances, not a website iframe.
3. Existing web persistence uses `localStorage['peptide-tracker-html-v1']` (in `assets/js/01-nexus.js`); currently there is an in-browser one-time pre-upgrade backup. The iOS app's WebView has **different storage** and cannot automatically see the web app's localStorage. Never assert seamless automatic migration.
4. Before any import/migration: user-created manual **Export JSON** from original browser, optional encrypted file transfer, visible preflight schema/record-count/date summary, full destination backup, dry-run validation, explicit import confirm, post-import data and dose/inventory invariant checks, rollback affordance, repeated import deduplication. The current `importData` in `assets/js/11-nexus.js` calls `state=migrate(p);saveState()` after basic structural check and **replaces destination records without a review/confirmation stage**; don't reuse unmodified for iOS migration.
5. Preserve `peptide-tracker-html-v1` data shape in web; use explicit tested versioned native storage adapter for iOS (durable native/secure storage with appropriate health-data protection; design pending). Avoid storing clinical data as a transient WKWebView localStorage-only solution. No cloud data transfer by default; obtain granular opt-in before sync/AI.
6. Demo/TestFlight fixtures must be completely isolated from real data with no sync/import/export to real accounts. Never ship developer-demo controls containing hypothetical doses as regular production experience.
7. Before any change to the existing web app, use normal release branch + separate PR, exact-source LIVE ZIP + full-app DEMO, in-chat walkthrough, release notes, QA matrix, docs and verified deployment; no unilateral destructive change.

## App Store gating decisions
- **G0: clarify intended medical purpose / public listing**: wellness tracking versus active treatment support; prepare exact screenshots and user journey list.
- **G1: clinical and legal assessment**: can app be submitted by individual or must legal entity under §5.1.1(ix)? Is a specific calculation regulated or otherwise ineligible under §1.4.2? Canada market (Health Canada) plus any additional storefront countries. Document reviewer and outcome, not assumptions.
- **G2: remediate confirmed numeric safety bugs in separately approved WEB + iOS work**, prioritize unit domains, tiny doses, invalid inputs, rounding, syringe capacities, IU semantics, max volume, reconstitution alternatives. Put tests before any clinical-use shipping; no clinical efficacy claims.
- **G3: choose public iOS feature treatment**: for every screen retain / revise / exclude from iOS with user sign-off. Feature omissions in iOS must be transparently disclosed, never hidden for review.
- **G4: privacy and security**: threat model (on-device health data, local exports, backup deletion), published privacy policy and support URL, accurate Apple privacy questionnaire, encryption, explicit consent before sending health data to outside services. Current static inspection does **not** establish whether any external data is transferred.
- **G5: minimum native functionality**: notifications based on user-set schedules, share/Files export, native safe-area handling, accessibility, reliable background handling, offline support; ensure §4.2 compliance. Avoid claiming native HealthKit integration from existing Apple Health **XML/file** import.
- **G6: launch**: Mac/Xcode build; real iPhone dark/light 320/390 equivalents, iOS keyboard/accessibility, notifications, offline import/export; TestFlight; App Store Connect privacy/media/age and review notes; Apple review result. Apple Developer membership and incorporation decisions only after G1.

## Suggested implementation layout (PROPOSED, not approved code)
```
/index.html                 # existing GitHub Pages entrypoint; unchanged
/assets/css/...             # existing shared web UI
/assets/js/01-...12-...     # existing shared app code
/ios-app/package.json       # new isolated Capacitor project
/ios-app/capacitor.config.* # local bundled build in ios-app/www
/ios-app/ios/...            # Xcode project on iOS development branch
/tools/build-ios.*          # version-pinned packaging from root assets
/docs/continuity/IOS_APP_STORE_READINESS.md
```
Web deploy watches existing root; native build does not write new persistent data to web or change the Pages URL.

## Validation / release status (as of audit)
- [x] READ: current main code samples and all four continuity files.
- [x] READ: current Apple guidelines, Health Canada SaMD guidance, Capacitor documentation.
- [x] VERIFIED: source at 1af0cfd (code v0.9.4-beta); open PR #27 exists.
- [ ] NOT TESTED: numerical calculations via live UI or medically validated reference cases.
- [ ] NOT TESTED: web-browser state migration into native application.
- [ ] NOT TESTED: native iOS/Xcode app or physical iPhone.
- [ ] NOT ASSESSED: legal counsel, clinical review, App Store decision, Health Canada classification.
- [ ] NO APP RELEASE: in-chat working app demo, standalone full-app demo HTML, exact-source LIVE ZIP, app regression checklist, CI release and Pages deployment are NOT APPLICABLE to this documentation-only audit (no code changes). None should be asserted as delivered for an app update.
- [ ] NOT DONE: iOS branch code, signed package, TestFlight, public App Store release.

**ONE NEXT ACTION (iOS track):** Create a clinician/regulatory review matrix for `reconCalcView` and `compoundIntelView`, including specific unsafe unit-conversion test cases and §1.4.2 eligibility, before any iOS functional code or developer membership spend. Coordinate with ongoing WEB v0.9.5 QA, without disturbing production.

## Baseline reconciliation (2026-10-23)
- During the audit, PR #27 merged v0.9.5 into main at `4addc72b8fdbb9906170d116af3f4a8183687e11`. The medical review source files `03`, `08`, `10` and `11-nexus.js` were verified **blob-identical** between the original audit baseline and v0.9.5 main. The documentation-only planning branch was rebuilt on this newer main SHA without changing source code.
