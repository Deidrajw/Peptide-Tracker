# Nexus — Medical and calculator claims matrix (October 25, 2026)

**Status:** SOURCE-BASED TRIAGE DRAFT. No product changes, medical approval, clinical validation, release, or actual device test. Source baseline: `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e` on GitHub `main`; app display version `v0.9.20-beta`. October 25 readiness audit is the planning baseline; this register does not supersede its other gates. All references below are to main paths (line numbers may move).

## Release rules

1. Distinguish **recorded observation**, **deterministic arithmetic**, **illustrative model**, **medical inference**, and **individual treatment recommendation**. Evidence for one does not validate another.
2. Classify each claim as **retain with clear provenance**, **qualify**, **remove pending evidence**, or **independently review**. No silent recommendation of therapy, dose increase, safety, efficacy, or adverse-event attribution.
3. Calculator results involving mass, solution volume and U-100 syringe marks require dimensionally valid input, consistent readings across capacities, finite positive values, no generic IU-to-mg equivalence, syringe bounds, explicit rounding and independent edge-case review. A passing automated conversion test is not a clinical endorsement.
4. Preserve production `peptide-tracker-html-v1` records, vial ledgers, Check-In, symptoms, protocols, saved formulas and backups. Audit and any future wording changes must not rewrite stored historical values. No automatic legacy kLOW migration. Use isolated synthetic fixtures.
5. Apple App Review Guidelines 1.4.1–1.4.2 require evidence/methodology for medical accuracy claims and have an especially restrictive eligibility standard for drug dosage calculators. Official source: https://developer.apple.com/app-store/review/guidelines/ (checked 2026-10-25). This matrix is not a legal classification.

## Claims inventory and decisions for review

| ID | Source / user-visible concept | Claim type | Risk & evidence gap | Proposed disposition | Acceptance evidence |
|---|---|---|---|---|---|
| C01 | `assets/js/08-nexus.js`, Today compound insight: “plasma levels rising from zero” / “No strong effects yet; any sensation at the injection site is normal” | Physiological inference / reassurance | A generic model cannot confirm actual plasma exposure or establish that a symptom is normal | **Remove/qualify** actual-effect and normality assurances pending compound-specific clinical substantiation | Source-backed copy inventory; neutral alternative; no false reassurance in 8-mode UI |
| C02 | Same, cruise phase “levels stable near peak, effects consistent” | Pharmacokinetic and clinical effect inference | Conflates estimated modeled trajectory with actual effects | **Qualify** as illustrative only; remove assertion of consistent clinical effect | Technical model assumptions documented, medical review |
| C03 | Same, “peak plasma levels,” “trough,” and appetite or food noise returning | Model-to-symptom prediction | Lacks person/compound-specific validated link | **Qualify/remove** predictive language; display log chronology as observations | No individual effect predictions, history unaffected |
| C04 | Same, escalation insight “you may be ready to discuss an increase with your clinician” | Personalized dose-escalation prompt | Schedule statistics do not determine dose escalation readiness | **Remove pending clinical review**; replace with neutral “review recorded schedule” | No threshold-based increase encouragement; review of all conditions |
| C05 | Same, “Rotate your site” and “lipohypertrophy,” plus `siteTrackerSection` fixed percentage/week-off language | Injection-site guidance | Site history can be useful, but arbitrary threshold and precise time-off advice require support | **Independently review**; keep historical site counts without claims of individualized protection | Guideline/source provenance; no unsupported numerical advice |
| C06 | `assets/js/09-nexus.js` Trends: “Estimated plasma activity” and model caveat | Illustrative exposure model | Must not be portrayed as measured blood concentration, efficacy or safe level | **Retain only with conspicuous model caveat** and accessible assumptions | Verify every chart/header/tooltip and stale/unknown half-life cases |
| C07 | `assets/js/09-nexus.js` Trends retrospective: records reflect logged values, not clinical conclusions | Observational analysis | Correlation mistaken for causality, missing log days | **Retain with safeguards**; avoid causal conclusions | Window/denominator/missingness tests |
| C08 | Learn / recon calculator (`reconCalcView`, `wireReconCalc`, `tools/audit-measurement-math.mjs`) mass, diluent and U-100 draw marks | Deterministic measurement arithmetic with medication-use implications | Precision, capacity, unit validity, scientific interpretation and regulatory eligibility are distinct from arithmetic | **HOLD native/store claim** pending independent test and regulatory pathway | Synthetic golden cases, 30/50/100 mark invariance, bounds, invalid/IU rejection, physical iPhone verification |
| C09 | `assets/js/09-nexus.js` Protocol/planning: total injections, vials needed, stock shortfall | Inventory and planned-use projection | Depends on entered schedules, inventory availability, units and assumptions | **Qualify** as arithmetic from personal entries, not a treatment recommendation | Unit tests including mixed mg/mcg, insufficient stock, prepared material and undo |
| C10 | Stash expiry, prepared syringe, BAC/reconstitution and open-vial dates | Storage and preparation representation | Historical logged date is not proof of stability, sterility or medical suitability | **Qualify** as user-entered record; review all labels and any implied safety promises | Source inventory of expiry logic, no automatic safety certification |
| C11 | Compound research/intel and guide content | Educational/medical information | Source freshness, study population, experimental status and applicability may be unclear | **Review individually** with source/date/evidence strength | Traceable citations and non-prescriptive wording |
| C12 | Blend constituent breakdown and dose allocation | Arithmetic + historical identity | Double-counting, vial source, legacy kLOW ambiguity and contraindicated migration | **HOLD any migration or new accounting claim** until separate blend parity validation | Single blend event, unchanged constituent history, exact vial ledger and import/export fixtures |

## Math / safety validation matrix (not run in this workstream)

| Scenario | Expected acceptance | Current run |
|---|---|---|
| U-100 30 / 50 / 100 capacity | Same physical concentration and requested volume produce same U-100 marks, subject to capacity limit | **NOT TESTED on this branch** |
| mg ↔ mcg | Dimensionally identical inputs produce equal draw volume | **NOT TESTED** |
| Generic IU input | No inferred universal IU-to-mg medication recipe | **NOT TESTED** |
| Empty, zero, negative, NaN, infinity | Refuse calculation and any actionable recipe | **NOT TESTED** |
| Beyond barrel/diluent capacity | Explicit rejection rather than misleading marks | **NOT TESTED** |
| Precision / rounding and boundary | Display rounding does not obscure actual capacity constraints | **NOT TESTED** |
| Multi-vial / legacy blends | One record, correct stock depletion and full undo without existing history rewrite | **NOT TESTED** |
| 320/390 dark/light LIVE and isolated DEMO | All views read correctly; same source; demo cannot access live records | **NOT TESTED** |
| Physical iPhone + VoiceOver | Real input, controls, reading and focus acceptance | **NOT TESTED** |

**Historical evidence, not rerun:** `docs/continuity/REGRESSION.md` records earlier 40/80 failed math assertions (October 24), followed by later **80/80 automated arithmetic PASS** on a different source revision. Neither proves the October 25 application is clinically validated; rerun on latest head before any safety claim.

## Independently tracked work — DO NOT MERGE IN THIS AUDIT

- PR #118: divider reduction and light/dark contrast; incomplete site-wide/manual modal review.
- PR #110 / Issue #109: true shared kit/legacy premixed blend parity, unresolved legacy kLOW accounting and data-history regressions. Latest v0.9.20 includes some shared-kit changes but **does not automatically close this separate workstream**.
- Issue #112: exhaustive app-wide theme/contrast audit and iPhone accessibility remains open.

## Next concrete action

Complete a **source-wide string/function inventory** covering every calculator and medical claim in modules `01`–`12`, with exact UI location, evidence owner and test IDs; then propose wording-only changes and a fail-closed latest-main automated math/claims gate. Do not edit storage or merge either legacy PR as a shortcut.
