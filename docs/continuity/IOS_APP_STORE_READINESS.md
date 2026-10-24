# Nexus iOS — approved Measurements & Preparation direction

**Status:** DESIGN APPROVED for exploration; diagnostic engineering in progress. No live web UI, data, native iOS binary or App Store submission changed.

**Approved in chat on 2026-10-24:** The user liked the proposed two-tool premium iPhone interface, with (1) **Concentration Calculator** and (2) **Syringe Unit Converter** grouped under **Measurements & Preparation**. Both functions remain core product requirements. This approves their visual information architecture and general interaction direction, **not** the existing unsafe measurement arithmetic, a medical device classification, treatment advice or App Store acceptance. The published GitHub Pages app must retain all its existing records and features.

**Current authoritative source baseline:** `df5b1ab4a6924a4594422b22077930aa178d4d42` on `main`, title v0.9.6-beta. Main has verified live 16-file byte parity in prior ops run `40060285190`, but local device caching and all iPhone functions are distinct, untested concerns.

### Visual design decisions
- Keep entire current app, its five protected core flows, and navigation. Add **Measurements & Preparation** as an entry under existing tools/navigation, **not** an extra bottom tab.
- Concentration card: user-entered mass and **final** volume, clear dimensional units and non-directive arithmetic result. No default dose, mixing volume recommendation or claim the solution is safe for injection.
- Syringe scale card: user-entered volume, selectable *capacity* 30/50/100 U-100; the same volume must not change its unit value across syringe capacities. If over capacity, show a clear error and no usable fill position. Medication-specific syringe-draw guidance is a regulated-review gate, not automatically “generic” because renamed.
- Premium typography/spacing, same Nexus colors/icons, light/dark themes and 320px/390px, at least 44px targets, accessible labels, keyboard/safe areas and no nested scroll.
- Use fictional fixtures only in design/demo/testing. Preserve LIVE source `index.html` and `peptide-tracker-html-v1` data. Never write real values during testing.

### Safety/eligibility gates — not waived by visual approval
- Run `tools/audit-measurement-math.mjs` against 8 isolated LIVE-local/full-DEMO viewport/theme contexts and emit pass/fail per condition, including potential 30u/50u rescaling, unjustified IU→mass conversion and negative inputs. This is **diagnostic**, not clinical verification. Failures prevent an iOS calculator release, but the diagnostic does not block a documentation-only PR.
- Independently validate numeric formulas with qualified review before users are asked to act on an output. Calculator instructions must be truthful in Apple submission and respect §1.4.2, with eligible entity/authorization route if required. A cosmetic rename or disclaimer does not confer eligibility.
- Then implement the design on a separate iOS/release branch and deliver all six Nexus artifacts for any actual app UI/logic update. Do not slip modifications to the published WEB app under a documentation PR.
- **One next action:** Inspect executed synthetic measurement diagnostics, identify precise failures, build safe correction proposal and App Review consultation brief; no public dosage calculator release until legitimate compliance pathway is resolved.

---

## Historical audit and superseded proposals (from earlier planning branch)
The following historical notes were retained for continuity. Any earlier recommendation to exclude either calculator is **SUPERSEDED** by the user's explicit retention requirement and approval above; historical statements of “pending design approval” are also superseded. Earlier source baseline references are snapshots, not current main.

# CURRENT DIRECTIVE — Keep both calculation tools (2026-10-23)

**User-confirmed public iOS requirements:** (1) a syringe-unit calculator and (2) a reconstitution/concentration calculator are **mandatory product capabilities**, not optional features to discard to simplify App Store review. This supersedes the earlier proposed first-release exclusion described in the historical review below. This is approval to retain them as requirements, **not approval of existing unsafe math, therapeutic advice, a workaround for Apple, or a code deployment**.

**Product framing:** Nexus is primarily a personal peptide / wellness journal, with a transparent **Measurements & Preparation** (working label) area. Naming a drug-dosage calculator as “general math” does not exempt it from App Review §1.4.2. General dimension conversions such as mg↔mcg or volume↔U-100 units with no medication input may be defensible as generic measurement utilities, but interconnected medication-specific dilution/concentration/draw results remain at risk of falling under §1.4.2 even with user-entered numbers. **Do not evade review, hide features, or describe dose-related functions misleadingly.**

**Dual-track feasibility plan:**
1. **Product validation:** retain and prototype both tools; inspect complete input/output workflows to identify truly general arithmetic vs preparation/dosage functions; preserve the current web experience and every saved record.
2. **Numeric safety:** construct independent deterministic tests for unit domains, rounding, syringe sizes, max capacity/overflow, input limits and invalid combinations. Review and correct **possible** present code defects (general IU→mg conversion and capacity-scaled U-100 unit marking), using isolated fictional fixtures and clinical verification before users rely on the result. Do not treat reading source code as executing tests.
3. **Regulatory/App Store pathway:** request Apple's 30-minute App Review appointment and present *real screenshots / function descriptions*, asking whether these functions trigger §1.4.2 and which sponsoring organizations, evidence, or authorizations would qualify. Appointment is **informational only**, not preapproval. https://developer.apple.com/help/app-review/before-submitting-for-review/app-review-appointment
4. **Qualified entity or authorization:** if full medication preparation calculators require it, investigate authentic collaboration with eligible pharmacy/hospital/university/approved organization or applicable FDA/Health Canada regulatory approval and developer legal-entity requirements. A cosmetic label/partnership without genuine accountability is not sufficient. Budget/timing unknown pending expert review.
5. **Decision gate:** do not publish a public iOS edition that deletes required tools without explicit user's reconsideration. If full functionality cannot meet review standards, flag BLOCKED and revisit legitimate options. No re-enabling hidden functions after review.

**Verified sources:** https://developer.apple.com/app-store/review/guidelines/ (§1.4.1, §1.4.2, §2.3, §5.1); https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/application-information/guidance-documents/software-medical-device-guidance-document.html ; Apple appointment URL above.

**Current implementation status:** planning and initial static audit only; neither numeric QA nor expert review, legal eligibility, native build, TestFlight, App Store submission or Apple clearance has occurred. Current GitHub main at start of this planning branch `ed1db9e6f384c06d6aa882458ef41e51be69955b`; `index.html` display `v0.9.5-beta`. Nothing in this PR edits web, iOS, calculations or production data.

---

## Earlier initial audit (historical context; superseded proposals marked)

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

## Proposed reframing: personal peptide and wellness journal (2026-10-23)
**User intent:** Public App Store app, explicitly **not** a medical advice or clinical treatment product. This is a clarified product objective, not approval for implementation or feature removal. The app may still handle health-related data and must meet Apple privacy and safety rules.

**Proposed truthful positioning:** “Nexus — Your Personal Peptide & Wellness Journal: organize routines, record self-reported entries, track supplies, and reflect on trends.” Do not promise disease diagnosis, therapeutic effect, dose optimization, clinical accuracy, or treatment guidance. App Store category cannot override actual functions, and disclaimers alone do not neutralize medical functionality.

| Current area | Public iOS personal-tracker proposal | Protected record/data behaviour |
|---|---|---|
| Today / Check-In | Keep mood, symptoms, supplements, notes, self-reported log | Historical validation, intensity and associations unchanged |
| Calendar | Keep personal history and self-set reminders | Date-local semantics, numerical records unchanged |
| Protocol | Consider label “My Routines”; users enter their own dates/frequency, no default clinical escalation/suggested dose | Do not delete existing schedules; design transparent mapping |
| Stash | Keep purchase counts, items, batch/recon date, user-entered inventory; separate from actionable injection math | Protect exact vial history and inventory deductions |
| Log Dose | Keep entry as **user-reported past event**, not an instruction to draw/inject or increase a dose | Preserve single/multi-vial math for accounting; validate all numeric transformations independently |
| Recon / syringe calculator | **SUPERSEDED:** Earlier proposal to exclude from iOS. The user requires both tools; pursue Apple-compliant retention, independent numerical safety testing and regulatory assessment. | **WEB preservation is not proof of safety**; independently address confirmed bugs through normal reviewed web release |
| Protocol/compound encyclopedia | Replace dose/cycle/reconstitution instructions with personal tags, notes and content reviewed for truthful non-prescriptive claims | Keep original user-added compound names and notes |
| AI / patterns | Restrict to neutral factual summaries of stored historical entries; no treatment optimization or causation assertions | Explicit consent before any external AI processing; keep existing entries |

**Important:** Merely converting a prescriptive feature to user-entered inputs does not guarantee Apple §1.4.2 avoidance if software still calculates medication doses. No hidden modules toggled on after review. If Apple rejects the truthful reduced-scope release or considers it medical, appeal/review decision; no misrepresentation. Apple policies: https://developer.apple.com/app-store/review/guidelines/ §§1.4, 2.3, 4.2, 5.1. Health Canada examples: https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/application-information/guidance-documents/software-medical-device-guidance/examples.html

**Next proposed design deliverable (pending user approval):** screen-by-screen compare WEB vs App Store iOS, render interactive fictional-data preview of any major UX modifications BEFORE approval; preserve web storage and all existing flows. No code changes in this proposal.


## Option 1 selected — honest measurement-tool presentation (2026-10-23)
**User direction:** Proceed with Option 1 (measurement-focused product/UX framing), **while preserving both** the Concentration/Reconstitution Calculator and Syringe Unit Converter as mandatory public iOS capabilities. This approval selects an approach, not final visual acceptance, App Review clearance, clinician sign-off or production release.

### Source-specific, iPhone-first design proposal — SHOW BEFORE CODING
- Working IA: Nexus → Learn / Tools → **Measurements & Preparation**; keep the existing Today, Calendar, Protocol, Stash, More destinations and original WEB behaviour. Do not create an arbitrary extra bottom tab.
- Two distinct entries, not two conflicting calculators: **Concentration Calculator** (user-entered mass and measured final volume; simple concentration readout with explicit units) and **Syringe Unit Converter** (generic mL↔U-100 graduated marks, syringe **capacity** 30/50/100, without changing units because barrel size changes).
- Generic conversion examples are fictional and for UI tests only: 10 mg / 2 mL = 5 mg/mL; U-100 0.20 mL = 20 units, independent of compatible syringe's total capacity. Cases exceeding chosen capacity must warn; never silently rescale. Never say “Draw X units” or give a treatment directive on the generic math preview.
- A third possible contextual link, **My Kit Measurements** in Stash, may refer to *already recorded* vial/container attributes, subject to privacy and dose-calc safety review. Preserve multi-vial allocations, source selection, editable history, notes and original calculations until independently validated changes are approved.
- Rename “Dose Calculator”, “Dosing Math Guide”, etc. only where wording is truthful; if calculation actually provides personalized medication-preparation instructions, App Review receives accurate explanation under §1.4.2. No feature hiding/re-enabling post-approval, no category/disclaimer workaround.
- UI guidelines: minimal premium iOS surfaces, coherent native outline icons, clear foreground text/light-dark modes, 44–48px targets, safe-area/keyboard, no nested scroll; test 320/390px.
- Prototype-only in-chat UI with interactive fictional numerical inputs is **not** the deployed app, not a signoff on numeric safety or iOS runtime. After preview confirmation, implement in separate versioned release branch and deliver all six mandatory Nexus artifacts.
- Wording and entrypoint changes must be tracked across every existing link (Nexus learning tools, contextual kit pages, navigation and guides), tested against current source (v0.9.5-beta at verified main `ed1db9e`). No change of storage key `peptide-tracker-html-v1`; no user data migration.
- Existing code audit: `reconCalcView()` appears to multiply IU by 0.001 mg regardless of substance and to scale U-100 unit values by syringe capacity; require correction/medical validation through controlled synthetic tests before any public reliance.
- Next compliance step: present Apple with both screenshots and real end-to-end functionality, asking whether the medication-linked result falls within §1.4.2, and if so obtain qualifying organization/regulatory pathway before public submission. The measurement-oriented name is not a guarantee.

**Next action:** Review illustrated conceptual in-chat prototype; then create numeric regression tests and make a feature-by-feature App Review consultation brief. **Current status: DESIGN PROPOSAL; no production code edits.**

## Diagnostic result — actual synthetic browser execution (2026-10-24)
- GitHub Actions PR #36 run `40061025452` on `a5861cb` completed 8 isolated environment cases and 80 checks: **40 PASS, 40 FAIL**.
- Consistent FAIL across all 8: displayed U-100 syringe units on 30-unit and 50-unit options differ from the invariant unit measurement; changing capacity changes the displayed number; IU without a substance-specific validated IU↔mass factor generates a drug preparation recipe; a negative dose generates a recipe. Existing 100-unit, mcg/mg equivalence, blank/zero volume tests and JavaScript exception checks passed.
- CI tooling itself can succeed while diagnostic assertions fail: reported FAILs are a **release safety blocker**, not an eligible dose-calculator result.
- Existing v0.9.6 application and GitHub Pages are unchanged in this branch. Do not use the present draw/preparation results for injections; independently reviewed corrections and a qualified App Store §1.4.2 route are needed.
- Tests and evidence: `tools/audit-measurement-math.mjs`, [run 40061025452](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025452), [artifact 12547685887](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025452/artifacts/12547685887). No clinical approval, no public iOS build.
