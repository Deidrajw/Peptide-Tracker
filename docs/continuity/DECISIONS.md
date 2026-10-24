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

## 2026-10-23 — Protocol card/new protocol picker design proposal
- **Approval state: PROPOSED, NOT YET APPROVED for production merge.** User requested premium iPhone UX simplification of Retatrutide expanded cards, dense advisory panels, contextual ellipsis actions, emoji search icon in New Protocol Step 3, and inconsistent overflow menu glyphs.
- Preview candidate retains collapsible card, status/time-to-next and Log Dose primary control; groups nonurgent interpretive insights in disclosure, keeps injection-site safety warning visible, organizes secondary history/calendar/schedule/colour/pause/remove actions under ellipsis and uses outline icons. Routes, records, dose calendar, settings and archive commands still use preexisting event handlers.
- Addresses genuine 1/6 vs Step 3 header bug in New Protocol with live progress update; search field becomes proper outline SVG with separate placeholder text. Safety wording from source is not clinically validated; flag for later medical audit rather than inventing personalised dosing advice.
- No data migrations or storage writes from design proposal; no prior behaviour intentionally removed. Final visual approval after interactive review required before merge.

## v0.9.6 preview delivery — open-in-browser ZIP option (2026-10-23)
- **Decision status: IMPLEMENTED on unmerged proposal branch, verification pending.** A ChatGPT attachment viewer may treat a self-contained HTML app as static preview and not execute scripts. Do not replace the complete app with a feature-only mockup. Ship full-app isolated HTML as-is AND an archive with byte-identical `index.html` and plain-text instructions; keep LIVE ZIP separate.
- This does not constitute user approval for the revised compound-card, Insights, or bottom-sheet design; PR #31 still held for approval. No data migration/import/sync and no new production release.

## v0.9.6 compound action sheet — approved design, content review separate
- The user approved a true iPhone-style bottom sheet in place of inline expansion, plus separate audit of timing/escalation claims. Implementation reuses the exact same six contextual buttons and event handlers, temporarily moves `.morebox` to body, blocks underlying interaction, restores DOM and scroll/focus on close. Header, handle, scrim and safe area should avoid pushing card below viewport. Close by x, scrim, Escape or swipe handle. Do not hide urgent injection warnings inside collapsed insights.
- Approval is for visual action-sheet treatment, not medical treatment recommendations. Keep all timing/escalation text unchanged until separate clinical-content review; preserve syringe-unit/reconstitution calculators and no migrations. Findings and proposed safer copy recorded in `docs/ios/MEDICAL_CONTENT_AUDIT.md` for App Store risk review. Apple's dosage calculator rule is a separate gate.

## v0.9.6 — approved bottom-sheet implementation merged (2026-10-23)
- User approved converting compound overflow ellipsis into a dedicated iPhone bottom sheet rather than inline expansion, while preserving collapse card and separate nonurgent Insights disclosure. Shipped PR #31 merge `ddd38eeb7b78cda3e3cc63c5f57a13ef665143e0`. Existing history/calendar/schedule/colour/pause/remove actions preserve original event handlers; safe-area, backdrop, focus lock and restoration, Escape/dismiss, swipe handle. Scope includes New Protocol emoji-to-SVG search and wizard count repair.
- Medical wording audit is separate, not a code rewrite: `docs/ios/MEDICAL_CONTENT_AUDIT.md` suggests neutral recorded-history language, flags potential unreliable PK inference and dose-escalation cues; no copy change approved until clinical review. Preserve syringe/reconstitution tools while assessing Apple §1.4.2; approval for UI does not imply medical/legal compliance.

## 2026-10-23 — QA-only deployment and vial-safety safeguards
- Production publication is considered VERIFIED only when live GitHub Pages HTML, 3 CSS and all 12 JS are byte-identical to the checked-out `main` app source; a PR merge, Pages URL or version title is inadequate alone. New GitHub Actions workflow records independent parity evidence on push; local smoke checks explicitly do not count as publication verification.
- Protect inventory integrity via fictional, isolated browser tests for core v2 per-vial consumption, source selection, insufficient inventory, undo, prepared-dose unused balance and unit conversion. These tests do not justify changing any saved user data, reconstitution model or dosage calculations. Keep dose calculators and App Store medical audit separately gated.

## 2026-10-23 — deployment proof through PR-observable evidence
- GitHub connector only returns pull-request-triggered Actions runs; introduce an actual public Pages 16-file source-hash check in PR CI with `continue-on-error` and JSON artifact, keeping Pages evidence separate from the local smoke test. This prevents claiming deployed when only a GitHub merge or offline self-test passed. Main-push parity workflow retained for future independent checks.

## v0.9.6 Pages publication verification outcome — 2026-10-23
- The Pages proof threshold was met: GitHub-hosted remote HTTPS 16-file full application byte parity, not simply an app title or Github PR merge. Run `40060285190`, artifact `12546599640`, `Nexus_PAGES_REMOTE_CHECK_PR.json` has `smoke_only:false`, `verified:true`, 16 matching files on first attempt. Because the QA/ops branches changed ONLY tests/workflows/docs, served app files match the previously merged v0.9.6 main application. Browser/device caches and actual iPhone UI acceptance remain distinct tests.

## iOS Measurements & Preparation — APPROVED visual direction (2026-10-24)
- **User APPROVED** the two-tool in-chat design concept (Concentration Calculator and Syringe Unit Converter within “Measurements & Preparation”), consistent with Nexus premium iPhone design. Both remain **required features**, not omitted for App Store convenience.
- **Design acceptance is NOT regulatory approval.** Apple guideline 1.4.2 may cover medication-linked concentration/syringe preparation arithmetic even with non-clinical product framing. Naming must reflect real functionality; independent medical and regulatory review remains mandatory.
- Use user-entered, clearly labelled inputs, generic dimensional measurements, accurate capacity warnings, no preselected administration regimen and no direct treatment recommendation in generic UI. A separate gate applies to medication-specific preparation instructions. Preserve the original WEB app, inventory, schedules and every localStorage record.
- **Implementation NOT YET APPROVED AS A WEB RELEASE:** first run synthetic numeric diagnostics and propose repairs for IU-to-mass, 30u/50u scale drift and negative inputs. Clinical review and Apple feasibility need separate evidence. Details in [IOS_APP_STORE_READINESS.md](./IOS_APP_STORE_READINESS.md).

### 2026-10-24 — preserve concurrently merged iOS diagnostics across v0.9.7
- Old PR #35 was based on obsolete `df5b1ab` and cannot merge without conflicts after #36/#37 iOS documentation/QA landed. Continue on a FRESH branch from `b382a978` and reapply only the proven Log Dose guard/test/version alignments, preserving `tools/audit-measurement-math.mjs` and measurement planning documentation verbatim except test-version reference.
- Calculator diagnostics currently show 40/80 failures; neither this unrelated Log Dose confirmation fix nor generic "wellness" wording resolves them. Keep user data untouched, retain both calculators as documented but block claims of medical or App Store clearance.
