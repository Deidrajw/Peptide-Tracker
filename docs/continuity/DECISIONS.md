# Nexus — Approved Decisions

> Durable UX, product and engineering decisions. Distinguish implemented, approved, proposed and superseded; never treat new suggestions as approvals. Add date, rationale and source PR when available.

| Decision | Status | Rationale / protected behaviour |
|---|---|---|
| GitHub main and verified commits are the source of truth | Approved | Never reconstruct production from old generated HTML, snapshots or chat summaries. |
| Premium iPhone-first application, consistent components, accessible targets and light/dark themes | Approved | Test 320px/390px, safe areas, keyboard, sticky actions and contrast. |
| Unified outline disclosure/chevron geometry, alignment, stroke and state | Approved active priority | Finish beyond PR #16; inspect all pages before calling complete. |
| Replace arbitrary emoji-based general-purpose icons with consistent outline icons | Approved direction, not fully implemented | Keep underlying records and mood meanings intact. |
| Calendar defaults to current local month and Month tab | Implemented (#7) | Do not persist an older month as default on fresh opening. |
| Calendar day cells display real saved numerical weight | Implemented (#8) | Do not replace weight with a dot or invent missing data. |
| Today shows Check-In complete/pending near top with direct Edit | Implemented (#12) | Status derives from persisted same-date record. |
| Supplements search, internal scroll, browse without typing and multi-select in both workflows | Implemented (#13) | Preserve 50+ item usability, dated log selections and history. |
| Selected Today count and collapsible supplement list | Implemented (#14) | Keep visual hierarchy; avoid giant chip clouds. |
| Symptoms search/browse with general and compound groups and intensity 1–3 | Implemented (#15) | Preserve custom terms and symptom associations. |
| Log Dose reliable draft, source selection, bottom sheets and vial deductions | Required existing behaviour | Protect multi-vial and insufficient-stock logic, sticky Confirm. |
| Show major redesign as interactive preview before approval | Approved workflow | Already-approved targeted improvements may proceed without repeated approval. |
| Six app release deliverables: in-chat demo, isolated whole-app DEMO HTML, complete LIVE ZIP, GitHub deployment verification, release notes, interactive QA checklist | Approved process | Never mislabel feature-only prototype as full-app DEMO. Mark missing artifacts INCOMPLETE. |
| Four GitHub living continuity documents | New documentation workflow | Keep project state, decisions, release history and regression in same PR as substantive app code; Project uploads may be stale copies. |

## Decision entry template
- Date / proposed by:
- Topic / affected screens:
- Approval state: proposed / approved / implemented / superseded
- Decision:
- Reasoning and alternatives:
- Previously completed behaviours to protect:
- What (if anything) this supersedes:
- Commit / PR / screenshots:

## 2026-10-23 — v0.9.1 source-aligned build
- **Status:** Application disclosure implementation merged in PR #18; packaging verification branch still unmerged.
- **Decision:** Full DEMO must compile in-line HTML/CSS/all 12 JS modules from the same release checkout as the LIVE root-index ZIP. Fictional data is inserted immediately before the initial render and storage is replaced in memory, failing closed if isolation cannot be installed. No demo network writes.
- **Rationale:** Earlier reconstructed demos omitted supplement DOM IDs and were inconsistent with LIVE. Preserve all real storage and existing logging workflows.

## Grouped symptom picker — approved 2026-10-23
- Status: APPROVED and CODED on release/grouped-symptom-picker-20261023, pending CI/deployment.
- Keep one compact search/browse combobox containing headings for active-compound symptoms, general categories, recent and custom symptoms. Filter across categories; selected symptoms and 1–3 intensities remain visible below. Category placement is discovery, not proof of causality. No destructive record migration.

## 2026-10-23 — Symptom category presentation
- **Status:** approved implementation in PR #21, awaiting final CI/deployment evidence.
- Keep original symptom catalog labels/record names and existing intensity 1–3 data. Surface Cycle / Hormonal as **PMS & Cycle** in the grouped combobox for clarity; show a dynamic **Retatrutide-specific** category for active Retatrutide (likewise for other supported compounds).
- Preserve searchable browsing, section expand/collapse, custom symptoms, shared picker reuse and multiple selection without data migration. Search matches across categories; historical name associations remain unchanged.

- **Grouped dropdown interaction:** default collapsed category headers to avoid forcing a lengthy scroll past multiple compound/general symptom rows; tapping a header reveals choices, and typing searches across *all* groups regardless of collapse. Keep recent and compound-specific groups in the catalog.

## 2026-10-23 — Grouped combobox shipped to main
- **Implementation merged:** PR #21 at `dea438e`; approved grouped Symptoms disclosure, categories collapsed when browsing, search reveals all matching sections, multi-select unchanged, intensity 1–3 unchanged. Label `PMS & Cycle` is presentation-only alias for existing `Cycle / Hormonal`; retained underlying category vocabulary and saved names.
- **DEMO-only safety:** never expose an Exit Demo button that could leave isolated fictional state; keep banner from obscuring modal actions.

## 2026-10-23 — v0.9.3 scoped readability treatment
- Status: APPROVED targeted contrast follow-up; CODED in `release/v0.9.3-contrast-legibility`, not yet verified/merged/deployed.
- Preserve neon/bright accent backgrounds but use dark text on pale lavender buttons, never white for important 12–14px action labels. Keep Check-In mood colors, selected symptoms, doses, supplement history and shared disclosure styling.
- Do not globally invert `.btn-primary`: some neutral buttons explicitly use theme text/surface colours. Improve only known failing foreground-on-solid-accent combinations and light muted helper labels; strengthen focus indicators without restructuring cards.

## 2026-10-23 — v0.9.3 contrast update merged
- PR #23 merged `f2fef99de4ea8c7cf28b9ed677054ca712bb77b4`: selective accessible foreground for pale purple CTAs, helper label contrast in light mode, focus-visible indicators through actual keyboard navigation. No universal dark-ink override on neutral theme-background buttons. Application features and records unchanged.
- Full WCAG-AA signoff and physical iPhone acceptance remain separate requirements; browser PASS on targeted elements does not certify entire app.

## v0.9.4-beta — mood accessibility and protected check-in lifecycle
- Status: targeted continuation coded on branch `release/v0.9.4-checkin-a11y-regression`; pending QA/merge/deployment.
- Preserve mood integer values 1–5 and accent borders/emoji. Mood option labels require min 11px themed high-contrast ink and 52px target height. Selected control uses `aria-pressed`, updated for each change, without changing data format.
- Use isolated fictional fixtures to verify create/Edit/no duplicate per date, notes/intensity/compound associations and date-specific supplements. No real user data migration or import.

## v0.9.4-beta — implemented/merged follow-up
- PR #25, GitHub merge `cab5cd8479fbfb537151c2db070a322ca7d01587`: mood UI accessibility only, with 11px labels, >=52px target heights, selected-state ARIA semantics; no schema/data changes.
- Synthetic browser tests protect Check-In single record per date, edited mood/notes, intensity, compound links and supplement history. Browser PASS is separate from actual user iPhone testing.

## v0.9.5-beta — search results show each symptom once
- Status: targeted implementation coded in release/v0.9.5-unique-symptom-search; tests and merge pending. No major redesign.
- Preserve original named browse groups and their existing membership for users discovering symptoms by group. When a query is present only, the same symptom name appears once; priority general category, then active compound, custom, recent and other. Example: Digestive owns Constipation, even if Retatrutide-specific or Recently logged also contains it. This is UI grouping only, not a causal medical classification or change to saved records. Category expand/collapse, multi-select, custom terms and intensity remain intact.

## v0.9.5 — deduplicated query results shipped (2026-10-23)
- PR #27 merged at `4addc72b8fdbb9906170d116af3f4a8183687e11`. When a query is present, a symptom appears once under preferred general category, then compound, custom, recent or other. Empty-query browsing retains all categories and their membership; selected symptoms/intensity and saved historical associations unchanged.
- This is a user-interface discovery improvement, not an assertion of medical causality, not a catalog migration, and not a replacement for active-compound categories.

## Public iOS core calculation requirements (user-confirmed 2026-10-23)
- **APPROVED PRODUCT REQUIREMENTS:** Both the syringe-unit calculator and reconstitution/concentration calculator are essential to public Nexus; retain their intended user value, rather than deleting them merely to simplify review.
- **SUPERSEDES** the previously proposed exclusion from the initial iOS edition. No approval to conceal functionality from Apple, to keep inaccurate math, to call medication dose calculations “general purpose” when they are not, or to change production WEB code/data.
- **PROPOSED UX (NOT APPROVED DESIGN):** a transparent “Measurements & Preparation” area in a personal wellness journal, retaining user-entered values and useful equations while clearly differentiating pure physical unit conversions from medication preparation/dose results. Wording is not an App Review exemption.
- **BLOCKING GATE:** Determine App Review §1.4.2 requirements with legal/regulatory review, Apple pre-submission informational appointment, and potential eligible clinical/pharmacy/university partner or regulatory authorization. Test syringe capacities, IU conversion, boundary cases and exact draw math before any public shipping. See [IOS_APP_STORE_READINESS.md](./IOS_APP_STORE_READINESS.md).


## Option 1 presentation approved as direction, visuals unapproved (2026-10-23)
- **APPROVED APPROACH:** Reframe mandatory concentration/reconstitution and syringe-unit workflows as clearly labelled **measurement tools** under working parent label **Measurements & Preparation**. Keep both capabilities. Do not imply the name or App Store category exempts actual drug dosage or medication-preparation calculations from Apple §1.4.2.
- **DESIGN PROPOSAL — preview only, not approved for code:** separate Concentration Calculator and Syringe Unit Converter screens, user-entered inputs, visible dimensional units, syringe capacity warnings, appropriate invalid-input handling and no prescriptive language in purely generic conversion UI. Retain all existing Nexus navigation and web records. See [IOS_APP_STORE_READINESS.md](./IOS_APP_STORE_READINESS.md).
- **DO NOT MODIFY existing web app yet:** wait for visual review and independent clinical numeric QA of suspected IU and syringe-scale arithmetic defects. Any subsequent code change requires all six Nexus update deliverables and deployment verification.
