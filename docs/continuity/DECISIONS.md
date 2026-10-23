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
