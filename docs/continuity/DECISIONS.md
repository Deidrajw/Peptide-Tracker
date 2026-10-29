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

## v0.9.7 Log Dose guard shipped, iOS measurement audit explicitly separate (2026-10-24)
- PR #38 merged `2a27f155e3b174bbfaa5347e5f785e8a8fcddadc` with only safe Log Dose under-allocation/invalid amount validation, version 0.9.7 source-aligned packaging and full form automated tests. Retained PR #36/#37's iOS measurement diagnostics untouched (40 PASS / 40 FAIL). The guard does not imply medical calculation or App Store compliance. No record migration.

### 2026-10-24 — v0.9.7 remote Pages proof recorded
- Unlike smoke, remote Actions run `40062278673` returned `verified:true, smoke_only:false` for public exact-byte 16/16 application source parity. This is strong proof that merged v0.9.7 app files were served publicly at check time; does not test a physical iPhone's cache, content semantics, medical compliance or native app availability. Existing measurement-math 40 FAIL/80 remains separate gate.


### 2026-10-24 — approve scoped implementation work after Stash/Combo audit (IN PROGRESS, NOT A FULL REDESIGN APPROVAL)
- Following the proposed in-chat Stash/Add Kit/Combo audit, user said "let's continue". Implement the first discrete Combo Dose picker improvement without asserting approval for all visual designs. Search works at any library size, options remain in bounded scroll for 50+ tracked compounds, checked rows are at least 44px, and choosing compounds updates in place without discarding entered values. Favorite selection and deletion become separate targets. Keep prepared physical syringes distinct from reusable favorites; preserve existing real Log Dose/vial validations, date/site/notes, symptom selection and history. Add Kit/Stash hierarchy remains proposed until separately implemented and QA reviewed.

### 2026-10-24 — Combo picker scoped interaction now implemented (PR #42, not a wholesale Stash redesign)
- Evidence from source-specific [run 40067532927](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532927): search-first choice input always available regardless of compound count, bounded 224px browse list, in-place multi-select and amount updates avoid full sheet destruction; separate favorite select/delete; preserve prepared syringe path and underlying inventory/logging. Changes may merge only after final checks; no approval of unreviewed Stash/Add Kit designs or clinical dosage math. Physical iPhone/device sign-off and medical calculator remediation remain separate.

### 2026-10-24 — v0.9.8 searchable Combo Dose picker SHIPPED (PR #42)
- A persistent searchable bounded-height compound list with multi-select and 44px touch controls replaces page-height options at any library size. Choosing/unchoosing compounds updates amounts without rebuilding the modal; typed draft fields and modal position survive. Favorites have separate named Select and Delete controls. Same underlying compound dose logging, source allocation, prepared syringes and recorded history are retained. Verified production via 16/16 file Pages parity `40068084296`. No changes to the still-proposed Stash/Add Kit hierarchy in PR #41 and no deployment of calculator safety candidate PR #40.

### 2026-10-24 — Stash actions bottom-sheet direction APPROVED, implementation under PR #44
- User approved implementing contextual kit actions after visual interaction proposal. Keep the most common Open/Prepare actions on standard kit cards; put detailed actions in grouped sheet accessible from ellipsis; adapt it to stored/open/done and blend kit state. Route actions to existing verified handlers rather than reimplementing vial accounting, histories or deletion; retain add-to-open, outflow, restock, Edit/Intel, Done/Reopen and destructive confirmations. Blend-specific edit and log must never call standard single-vial workflows. Info hierarchy and disclosure changes are limited to current Stash action entry; broader card redesign and Add Kit combobox not yet implemented. Real iPhone/clinical sign-offs remain separate.

### 2026-10-24 — v0.9.9 Stash compound actions SHIPPED
- Approved and deployed contextual actions sheet grouped into Vial & Inventory, Kit & Records, and Danger Zone with outline SVG icons and minimum 44px controls. Standard kit uses existing handlers and guards; blend kit gets an ellipsis entry, has dedicated Edit and Blend Log paths, and must not expose unsupported standard vial restock/finish/prepare controls. All existing detailed vial/dose histories remain. No data migration, no recalculation and no redesign of entire Stash cards yet. PR #44 `704fdb16`; full 16-file Pages parity `40069938848`. Next Stash card overview density/design preview is independent.

### 2026-10-24 — actual Stash card redesign APPROVED (v0.9.10 PR #46)
- User explicitly confirmed that previously shipped v0.9.9 actions sheet did NOT fulfill card redesign and approved actual Stash card work. Across standard and blend cards, headline is remaining *owned kit inventory* (never substitute single open-vial mg), sealed reserve visibly distinguished from current active vial, show a progress bar only for real open vial with capacity taken from that vial. Avoid synthetic 100% for sealed kits. Retain collapsible full kit history, v0.9.9 actions sheet, all handlers/data/legacy backups. Current scope does not change quantity calculations or generic Add Kit picker. Medical calculator PR #40 remains independent.

### 2026-10-24 — actual Stash cards SHIPPED on v0.9.10-beta
- Corrected previous discrepancy between card design prototype and v0.9.9 actions-only release. Standard/blend card hierarchy now distinguishes canonical owned kit remaining from per-open-vial capacity and percentage. Sealed kits never display synthetic 100% progress, and both use accessible 44px Details & History disclosures with standardized outline chevrons. Retain all existing inventory/actions calculations, records and mobile workflows. Implemented in PR #46 merge `f13b79639b968bfafd5b38df64c7456381799721`, production exact 16-file Pages parity [40071479984](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071479984). Physical iPhone review remains outstanding, separate from clinical calculator PR #40.

### 2026-10-24 — #48 disclosure chevron system, code in PR #49 (not released)
- Prefer exactly one active chevron per expansion affordance; generic native summary uses standardized CSS pseudo-chevron. Remove authored supplementary SVG/text arrows on Today Coming up/Daily tracking, Protocol Schedule & phases, Stash nested Details/Vial/Dose history; This Week custom button uses one CSS icon. Never alter event handlers or saved records in icon-only work. Plans visual hierarchy and Stash info architecture require separate UX review; Combo Dose blend eligibility requires distinct data selection regression. Version PR #49 v0.9.11-beta, pending tests and deployment. Physical iPhone signoff separate.

### 2026-10-24 — Chevron normalization v0.9.11 DEPLOYED
- Approved Issue #48 first fix: native Today/Protocol/Stash disclosures use a single shared CSS-owned open/closed chevron. Removed old manually authored duplicate SVG/text arrows; This Week's custom non-native button keeps one CSS arrow. No event-handler or data-math changes. PR #49 merged `1ef9337f61a45b012c0d6da21fc35b92e38939c8`, exact Pages 16-file parity 40107472550. Combo selection, Stash nested content reorganization and Plans card hierarchy remain separate work.

### 2026-10-24 — Combo blend-only availability, scoped PR #51 (unverified release)
- User's Deadpool/Cartalax example established ingredient-only names should not appear as independently available in Log Combo Dose simply because tracked. Eligible names include separate standard inventory, independent logged use or protocol, prepared syringe source, previously saved favourites and in-progress drafts to prevent silent loss. All blend kits keep their own blend dose logging; no historical migration/deletion. Display copy Favourites for Canadian English, but preserve existing stored keys. Keep 224px internally scrollable list contained by a visible labelled border, distinct from Dose Amounts. Today Needs attention native disclosure should use one shared chevron, remove manually authored right-arrow. Scope and QA for v0.9.12 beta PR #51.

### 2026-10-24 — v0.9.12 Combo Dose and Today arrow SHIPPED
- Ingredients only stored inside named blends are not independently offered in Combo Dose merely due to a tracked library entry. Separate standard inventory, independent history, protocol, prepared source, saved preset or selected draft remains eligible. No deletion or history rewrite. Label Favourites for Canadian display only; storage fields unchanged. Compound picker has bounded bordered scroll panel and affordance. Today Needs attention uses single CSS chevron without handwritten extra right arrow. Release PR #51 merge 1253b2c2; Pages source parity 40109401930 SUCCESS.

### 2026-10-24 — Stash expanded standard-kit progressive disclosure design (IMPLEMENTED ON BRANCH, not deployed)
- User-approved Issue #48 Stash density follow-up: expanded standard-kit card uses accessible Overview/Vials/History tabs rather than three simultaneously visible information stacks and nested chevrons. Always retain vial-level actions, dated dose history, forecast, notes, original Edit/Intel/Reconstitute/outflow edit+undo, and kit ellipsis. Removing duplicate Manage Kit link is not removal of underlying handler. No persistence changes or record/math changes; blend composition workflow preserved as-is. Tab-selection keyboard arrows/Home/End and 44px targets required.

### 2026-10-24 — v0.9.13 Stash expanded detail tabs SHIPPED
- A standard kit should show essential inventory in the collapsed card; expanded secondary content must be clearly separated into Overview, Vials and History so vial breakdown, dated dose ledger and outflow records don't become three nested disclosure chevrons. Preserve all original record data, full vial actions, Edit/Reconstitute/Intel, forecasts, notes and outflow Edit/Undo. The top kit ellipsis is canonical management; remove redundant bottom Manage Kit link. Tabs are view-only, 44px+ and support arrows/Home/End. Blend-specific card stays unchanged rather than pretending to use standard-vial accounting. PR #53 merged `895d6bfd`; GitHub Pages 16/16 exact files run 40111254674 SUCCESS.

### 2026-10-24 — Plans status/management/Intel hierarchy candidate (v0.9.14)
- Preserve one primary management ellipsis (44px), passive status badge, Intel as independently labelled secondary action below the Research header, and 44px goal details disclosure. No research/goal/shopping record, link or handler deletion. This is a scoped implementation following #48 and previously released v0.9.13 Stash. Physical device acceptance and deployment pending; broad redesign not implied.

### 2026-10-24 — Plans hierarchy shipped v0.9.14
- Passive status plus one 44px ellipsis in header, independent labelled Compound Intel action below in Research, and a single >=44px Goals detail disclosure. Preserve existing editor/delete actions and all linked plan records; do not duplicate Stash rework already delivered in v0.9.13. PR #55 merge `529f81ea`, public exact 16-file parity 40113805546. Real iPhone manual acceptance remains pending.

### 2026-10-24 — targeted Plans icon cleanup approved, v0.9.15 candidate
- User approved continuing narrowly from source-verified v0.9.14 and unresolved Issue #48. Normalize Research Intel right navigation arrow and manage ellipsis to inline outline SVG geometry, without reopening the approved Research/Goals/Shopping layout or changing Edit/Delete/Intel handlers. Keep 44px management targets; no storage mutations, Stash/Combo rewrites or calculator PR #40 changes. Approval for code iteration is not physical device signoff or authorization to bypass CI.

### 2026-10-24 — Cloudflare Pages added as potential host, migration NOT APPROVED
- User supplied https://nexuspeplog.pages.dev/ as a new Cloudflare site. Keep GitHub `Deidrajw/Peptide-Tracker` source-of-truth and existing GitHub Pages production during verification. Proposed future primary Cloudflare hosting is NOT an approved domain switch. Browser storage is origin-scoped: GitHub Pages data will not follow to Cloudflare. Prioritize verified full backup, schema compatibility, integrity validation and user confirmation before any migration/overwrites. Preserve demo isolation and calculator PR #40 separation.

### 2026-10-24 — Cloudflare primary hosting APPROVED, rollout gated
- User confirmed Cloudflare Pages `https://nexuspeplog.pages.dev/` is connected to GitHub and explicitly chose it as Nexus's **primary hosting destination**. Keep `Deidrajw/Peptide-Tracker` as canonical source and GitHub Pages as fallback until parity and safe record migration. Approval of host direction does NOT approve destructive localStorage migration, overwriting saved data, or claiming deployment parity without evidence. Validate Cloudflare source files, HTTPS, PWA cache, app version and backup/restore from previous origin before cutover. Existing PR #40 measurement calculator stays separate and unmerged.

### 2026-10-24 — Icon integration source verified
- Reuse user's exact approved images already uploaded to `main` rather than generate a substitute. iOS apple-touch-icon uses 180 PNG, browser/PWA-ready 192 and 512 PNG references; 1024 source kept for distribution. Full release source ZIP must contain icons, standalone DEMO embeds them. No record or calculator modification.

### 2026-10-24 — Approved disclosure hierarchy principle
- Chevron reserved for a genuine expand/collapse affordance only when needed; repeated stacked chevrons on Today are distracting. Keep one meaningful indicator for grouped alerts (Needs Attention) while secondary disclosures Coming up, Daily tracking and This week expose labeled View schedule/View tracking/View details controls. Maintain ability to open content, keyboard semantics, touch target and history. Prefer explicit action labels, not unlabeled glyphs; never hide essential status behind disclosure. Pilot first; do not automatically propagate CSS to all pages before review.

### 2026-10-24 — Disclosure icon audit decision
- User approved precise correction: Daily tracking's explicit View tracking label must NOT also show pseudo-element chevron. Use a scoped selector with enough specificity to beat global `!important` disclosure rules. Design audit policy: explicit action labels use text only, unlabeled accordions one chevron, navigation conventional link/right arrow, contextual management ellipsis. Preserve keyboard/VoiceOver/44px touch access and underlying detail state. Apply remaining app surfaces by targeted follow-up, never blanket-hide all arrows.

### 2026-10-24 — Consistent kit/blend Stash headers (approved)
- Standard compound kits and blends show status plus a 44px contextual ellipsis in the same top-right header position. No redundant ellipsis in ordinary kit action row. Opening/Preparing/Log Blend Dose and kit management retain original handlers. Compact sort label `Attention` with full option preserved in menu, chevron assigned reserved width.

### 2026-10-24 — Informational empty-state design principle (approved)
- Empty areas must not look accidentally broken. Always explain what is absent and why, distinguish never-created from filtered/no-match/temporarily-unavailable/all-done/error and, where an existing safe path exists, provide contextual next-step guidance. Never invent actionable controls, imply sealed stock is unavailable, or label a blend as reconstituted when it isn't. Preserve non-empty layouts, vial/dose/kit state and confirmation flows. Avoid extra nested borders and dense illustration; concise title + one sentence within existing section. First implementation: empty Kit actions VIAL & INVENTORY group.

### 2026-10-24 — Connected Goals approved product direction
- Goals are unified outcome-flexible progress hubs, **not** a duplicate logging system; support numeric, subjective, milestone and exploratory progress. Link to canonical Check-In/Journal/Protocol/Insights histories only via typed references with optional user control and visible provenance, never causal claims. Existing Goal/Protocol data preserved. Gentle optional in-app goal review prompt, not automatic blocking modal or promised native push; no auto-completion. Protocol user filters All/Not started/In progress/Paused/Completed group stored statuses without mutation. See `docs/design/CONNECTED_GOALS_SPEC.md` for UX, data/migration hazards and release phases. SPEC APPROVED DIRECTION; implementation NOT STARTED.

### 2026-10-24 — Protocol filter interaction (approved Release A part 1)
- Filter selection is UI-only (`state._protocolStatusFilter`) and must not change actual protocol status, schedules, dose records or goal links. Not started includes draft/planned/ready-active; In progress includes `in_progress`; Paused and Completed each exact, Archived exposed separately for retrieval. Keep original lifecycle groups, management, confirmation and expandable schedule. Empty match provides Show all action; users can always return to all records.

### 2026-10-24 — Stable optional personal Goal ↔ Protocol association
- Preserve `protocol.goalId` as predefined purpose/template ID. Add separately named `protocol.linkedGoalId` for saved `state.plans.goals[].id`. Resolve goal names at render time so renaming updates label. If goal deleted/missing, do not link by name or silently relink; show 'Linked goal unavailable · edit to relink'. Link selection on Protocol Builder Review is optional, including None. Linking does not imply compound effectiveness, change dose/history, or create a goal record. Release A2 candidate only.

### 2026-10-24 — Goal detail A3 minimal first implementation
- Show Overview / Connections / Activity as read-only sheets sourced from existing `plans.goals` and `protocols[].linkedGoalId`. Do not invent progress percentages, journal histories or physiological insights. Show an informational empty Activity state until source-aware linking exists. Existing Goal edit, delete and source records unchanged. Candidate only until CI and physical validation.

### 2026-10-24 — A4 progress sources staged
- Legacy goals remain supported. Optional progressModel supports numeric, subjective, milestones and exploratory (fallback). Numeric weight source is opt-in and reads weightLogs, not clones; goal/app units must match. Progress isn't proof of treatment effectiveness. Candidate only; results need tests and user physical iPhone acceptance.

### 2026-10-24 — Goal symptom evidence (A5 candidate)
- A personal Goal may opt in to one named existing Check-In symptom, matched exactly by symptom name. Show dated observations and any recorded intensity, not inferred effectiveness. Deselecting unlinks the evidence view without editing Check-In records. Journal linkage separately scoped after stable source identity audit.

### 2026-10-24 — A6a Check-In reflection implementation (branch coded, unmerged)
- Reflections are read live from `dailyLogs[].notes` only when that *same* daily record contains the goal's exact selected symptom. Label 'Check-In reflection from the same entry', not symptom-specific or causal evidence. Show nonempty text, source date and canonical original Check-In ID action; no copied data/goal schema change. Other Journal aggregations and contextual Insights deferred to later releases. Regression and physical iPhone pending.

### 2026-10-24 — Approved coordinated hierarchy refresh
- User explicitly approved Research, Journal, Check-In Changes and consistent status/ellipsis handling together. Compounds take title priority; 'Compound intel' is secondary, research reason has semantic label, ellipsis distinct from card. Journal keeps canonical records, uses accessible select instead of horizontal filter rail, preserves jump actions. Check-In Changes defaults to one selected metric/symptom and sample coverage, avoids 100%-of-logged-day ambiguity and nested scrolling record box. All saved data and prior approved actions protected. Broader shared components to validate across Goals, Protocol and Stash.

### 2026-10-25 — Explicit approved card header standard (correction)
- User screenshots reject earlier styling-only claim. Required pattern on Research, Goals, Protocol and Stash cards: readable title first; status pill directly beneath title in left stack (not beside menu); single standardized 44×44px right-aligned ellipsis control with same filled SVG circles, stroke/size, distinct surface/border in both themes. Badge may remain actionable where it already was; handlers preserved. Existing shared CSS alone was insufficient; HTML hierarchy itself must change. No data, calculation or migration effects. Source/browser and user iPhone acceptance required.

### 2026-10-24 — Store readiness design proposals (pending implementation)
- Approved direction: once-per-published-version in-app What's New popup and single release manifest producing in-app, Apple and Google notes. Preserve historical changelog counters until reconciled; never infer deployment from merge. First-run onboarding must explain features and browser-local storage, offer Start Fresh vs validated/confirmed Restore Backup. Privacy/permission declarations require actual network/native-wrapper audit, not blanket 'no data collected'. Neutral outline user avatar instead of initial is coded on isolated branch, pending CI/merge.

### 2026-10-25 — Canonical release notes source (candidate)
- `release/release.json` is proposed as source for one semantic app version, release channel/status, commit/date, user-visible changes, data impact and limitations. Three generated outputs must match exactly; release builder checks parity and display title. Publication remains `unverified`, NOT assumed from GitHub merge. Existing history and localStorage change-log number are not rewritten or marked read. Popup and native submission declarations follow only after release mechanism and store review.

### 2026-10-25 — Publish-gated release announcement candidate
- Source manifest drives generated runtime NEXUS_RELEASE and three channel outputs. New popup is silent for unverified/draft releases, only shows once per version when manifest explicitly published and onboarding finished, supports Later and explicit Got it, and stores seen version in an additive localStorage key rather than rewriting saved clinical/log records or legacy lastSeenChangelog. Existing history is retained; numeric legacy popup suppressed for confirmed published manifest to avoid duplicate announcements. Real publication status requires verified GitHub/Cloudflare evidence, not inferred from merge.

### 2026-10-25 — First-run onboarding staged implementation
- User approved welcoming feature explanation and Start Fresh / Restore Backup. New welcome clearly states that current web records use per-browser localStorage, do not sync automatically, and can be erased by clearing browser data. Import must be user-triggered JSON, preview counts and require explicit consent; onboarding blocks import when existing Check-In, kit, protocol or compound records exist. Current goal/stats/final onboarding steps protected. Version v0.9.16-beta remains unpublished/unverified and must not falsely prompt as deployed.

### 2026-10-25 — Onboarding action icon consistency
- User rejected final Getting Started card icon hierarchy. Corrective design uses single outline SVG family in all 4 actions (Log Dose, Protocol, Stash, Learn) and guide, with matching icon box, type scale and supporting route copy. Existing routes/workflows protected. Release v0.9.17-beta candidate, do not claim publication until host parity verified.


### 2026-10-24 — Unified implementation sweep and data-protection controls (approved direction)
- User requested development without repeating planning; deliver product UX, privacy/reliability and version/release infrastructure as one coordinated candidate, but keep engineering/test/deployment gates explicit.
- Preserve baseline v0.9.17 onboarding, original localStorage key `peptide-tracker-html-v1`, Check-In, dose, Stash, Calendar, Plans/Goals and all past records. No automatic migration. A manual restore may replace data **only after** preview and typed RESTORE; previous bytes require recovery-copy attempt before applying.
- Browser transparency must distinguish local records, host/font network access, manual Apple Health imports, in-app reminders and browser permission. Do not claim no external data collection without server/native audit.
- Calculator must not infer universal IU→mg potency, show a result for invalid nonfinite or physically overflowing entries, or change U-100 unit readings when syringe capacity changes. Independent math gate must block candidate on failures; clinical/safety certification is not implied.
- Canonical release manifest drives runtime/title/three What's New channels and test artifact paths. Publish-gated popup remains silent for unverified builds. Apple 1.4.2 dosage-calculator review requirements and Google Play health/privacy declarations are store blockers independent of web-app UX.

### 2026-10-24 — Verified web publication activates What's New without claiming store clearance
- Independent GitHub Actions remote comparison returned 16/16 Cloudflare HTML/CSS/JS exact source hashes for merged v0.9.18-beta (run 40159182188). This meets the previously adopted publication gate for the web build, unlike PR merge alone.
- Allowed additive publication acknowledgment: set `release/release.json.publication.status` to `published` with the previously verified deployed source SHA/date, then regenerate in-app and JS runtime metadata; the once-per-version popup is only enabled after that new source is independently deployed. Preserve `Later`/acknowledge version-key behavior, legacy changelog and all user records.
- Web publication says nothing about physical iPhone acceptance, independent calculator clinical safety, Apple/Google review, or complete external-processor privacy declarations.

### 2026-10-24 — Release completion is web-specific
- v0.9.18-beta has verified published web delivery after PR #97, and primary Cloudflare served 16/16 byte-identical app entry files in run 40160165392. Treat this as completed **web deployment**, not App Store readiness or full human usability acceptance.
- Persistent policy: publication metadata must follow independent host-byte evidence; What's New is version-gated, stores a separate acknowledgment key, never rewrites legacy changelog or clinical/logging state. Protect localStorage storage and backup integrity.
- Physical iPhone/VoiceOver signoff, Apple/Google store compliance, public privacy policy and third-party processor disclosures require independent evidence and are not inferred from GitHub CI.

### 2026-10-25 — Premixed blend identity and Stash parity
- User explicitly clarifies Deadpool consists of Cartalax, BPC-157 and TB-500 physically premixed **in one vial**. One blend = one tracked dose selection, one blend dose record and one Stash vial; constituent names are formulation metadata, not separate administered compounds. Keep all old constituent logs intact; do not automatically delete/migrate history. If an ingredient is independently tracked or has a standalone kit/dose, retain that choice.
- Blend Stash must allow opening/reconstituting sealed vials with BAC, expiration-days and notes; do not route through single-compound stock deduction math. Protocol phase steppers need consistent 44px targets; Review input must not clip.

### 2026-10-25 — Premixed blend releases use independently verified publication gates
- v0.9.19 merge #100 changed only new blend vial and dose logic; old ingredient dose entries remain immutable historical records. Opening/finalizing a vial requires explicit user action; current-vial math prevents drawing against sealed kit inventory. Displayed blend component percentages use the vial total rather than kit total.
- After 16/16 Cloudflare remote parity for main source (Actions 40162047192), source of truth may mark v0.9.19 published via an additive, separately validated manifest/What's New follow-up, not by retroactively rewriting saved localStorage history.

### 2026-10-25 — Theme visibility is a release-blocking usability requirement
- Real iPhone screenshot confirmed a blank-looking published What's New CTA on light theme. Approval: permanent theme-aware foreground/background contrast for all actionable text including modals attached outside #app, not isolated copy changes. Require computed browser assertions for visible action targets and text contrast, both dark/light at 320/390px; do not claim whole-app audit from testing only one modal.
- Scoped candidate on `fix/issue-109-theme-visibility-audit` does not modify saved data or the unfinished blend experience parity PR #110.

### 2026-10-25 — App-wide contrast token baseline (branch approval implementation)
- User requires app-wide light/dark legibility, not isolated controls. Preserve hierarchy but prevent muted text tokens from fading below AA on neutral surfaces. Dark t3/t4/t5 elevated to legible lavender-gray tones; light t4/t5 darkened. Small Calendar weight labels use accessible light blue (dark) or navy (light), no changes to saved numerical weights.
- Direct white-on-solid-lavender foreground is not accepted (observed ratios 2.1–2.7); use dark ink. Browser gate checks rendered modal buttons and neutral token/surface combinations, plus diagnostic sweep of nine tabs, but no whole-app AA certification without broader human and modal audit.

### 2026-10-25 — Theme hotfix risk gate and follow-up (implemented PR #111)
- PR #111 implements systemic neutral muted token legibility in both themes plus direct solid-accent and modal action fixes. A published patch may retain canonical v0.9.19-beta version if manifest, title and runtime continue to match, but then existing acknowledged users won't see a second What's New; do not claim announcement delivered.
- Browser computed contrast checks block known failures. Nine-tab diagnostic remains informational because translucent backgrounds and JS-rendered states need manual pixel review. A passed PR does NOT equal all-modal WCAG AA or physical iPhone acceptance. Primary Cloudflare byte parity is independent post-merge gate.


### 2026-10-25 — Version-aware release promotion policy
- **APPROVED by user:** A successful preview deployment is not an approved production release. Report separately PREVIEW, CODE MERGED and PRODUCTION VERIFIED with exact version + commit; do not certify newest-release success merely because production files match an older main. Implement a production SHA-256 parity gate plus intended-version check, not a manual checklist alone. Current proposal on safety branch, not yet accepted as deployed.
- Preserve the v0.9.20 release preview and branch; do not merge open PR #110 while its inventory and legacy-vial regressions are incomplete, and never convert users' KLOW data automatically.

### 2026-10-25 — Approved navigation/control hierarchy
- Use 44px+ interactive tap areas even for smaller visual ellipsis; kit card shows two evenly sized actions when no vial is actually open, three when one is. No-open label visually prominent. Do not use stale reconDate as evidence that an open vial exists.
- Log Dose multi-vial is an outlined action and keeps existing underlying multi-source calculations. Site history/suggested next sits by injection-site selector, informational only.
- Combo favourites remain saved in existing schema; one compact select loads via existing handler, optional Manage area retains deletion controls. Compound History is a dedicated detail view with a back action, preserving search query; model row has one clear disclosure signifier.
- Blend cards must eventually share same standard component/layout instead of legacy UI branch; functional parity still pending and not implied by these design changes.

### 2026-10-25 — Size by visual hierarchy, not touch target
- User approved compact 28px visible ellipsis with 44px interactive target for vial-level actions. 'Use multiple vials' remains explicitly outlined with unconstrained readable label and 46px minimum height; it must not squeeze/truncate at iPhone width. The controls must not change dose allocations or saved inventory.

### 2026-10-25 — Preview-approved UI hierarchy released to GitHub main
- User accepted PR #119 iPhone preview following targeted `Use multiple vials` 20px inline/12px block padding override against legacy #toggle-multi selector, plus visually compact 28px vial ellipsis within 44px touch target. PR merged to main at 3ef22b98326fc54777dbbef8ca9b013082f8f9fb; version retained v0.9.20-beta. Production parity remains separate signoff, not implied by GitHub merge.


### 2026-10-25 — Hybrid design proposal, preview authorization only
- User chose Hybrid (Soft Depth dark/violet, Porcelain warm-ivory light, Obsidian precision for dense data) and authorized building a source-derived full-app preview. They explicitly prohibited merge/deployment pending approval.
- Use a branch-only fourth stylesheet, preserve existing JS/data schema and all five navigation destinations; no entitlement, sync, onboarding consent gate or medical calculation changes in this visual sprint. Keep unmerged #118/#110 separate. Browser CI cannot replace user physical-device signoff.


### 2026-10-25 — User feedback mandates component-level visual differentiation
- User rejected overly subtle hybrid CSS-only styling and asked to actually implement earlier proposals. Replace actual Today component hierarchy, progress visualization, cards, actions and schedule grouping on existing design branch, while retaining all event classes/IDs and stored logic. Physical design acceptance remains pending. No production deployment approval.


### 2026-10-25 — Stash follows user-liked Today 2.0 depth
- User confirmed meaningful Today progress and approved continuing next screen: Stash. Visual work only on draft PR #123; use original Stash markup/classes/actions, preserve 28px ellipsis in 44px target, kit/vial math, status, details tabs and blend records. No production deployment or blanket design-system signoff.


### 2026-10-25 — Stash polish direction confirmed
- Keep Hybrid but avoid decorative localized top-right glows in kit cards and Inventory Overview. Favor smooth low-contrast matte gradients and hierarchy over spotlight effects.
- Model Compound kits / Supplies after a native-style two-segment switcher (Nexus-original styling), preserving route/tab logic.
- Keep Needs Attention information but visually soften into compact rows; do not hide alerts or change their triggers.
- Apply coherent action-sheet foundation first, then inspect each kit modal for header, save, keyboard, scroll, focus, math and light contrast. Production deployment still prohibited.


### 2026-10-25 — Visual feedback on action hierarchy and attention
- Keep kit actions rounded with little/no elevation inside already elevated cards. Today Log Dose may remain primary and Check-In secondary, but geometry/spacing/type must match. Remove amber left rail from Needs Attention; use neutral rows and plum review link. Distinct design from alert urgency semantics.
- Inventory Resolution allocation confusion is a separate UX workflow task; do not silently alter source-vial allocations, single dose record, Draw confirmations or inventory deduction math.


### 2026-10-25 — Kit-card two-action design approved for preview
- User prefers one context-sensitive inventory action plus a visible Kit Details disclosure. Prepare Doses should stay accessible from existing kit ellipsis sheet and top Stash Prepare control, not appear as a third equally weighted persistent button. Never show Open New Vial if existing conditions do not permit it, and do not change calculations or preparation behaviour.


### 2026-10-25 — Inventory Resolution design scope after full-app gate
- User requested clearer vial source allocation without changing math/ledger. Number and distinguish source rows, label confirm-draw more explicitly, preserve existing editable mg allocations, calculated units, draft flow, multi-vial depletion, undo and exactly one administered dose. Do not assume duplicate 'current vial' rows mean duplicate physical inventory without evidence. No automatic allocation changes authorized.


### 2026-10-25 — Stash modal priority and safety boundary
- Prepare Dose and Open New Vial must get individual UI audits for hierarchy, field size, live concentration, source identity, keyboard, overflow, safe-area sticky confirmation and blend/standard parity. Preserve existing formulas, vial ledger, saved drafts, one-dose semantics and validations; CSS may improve target sizes and readability without rewriting arithmetic. No production deployment approval.


### 2026-10-25 — Today full-screen scope reminder
- User approves finishing Today visual redesign including schedule selector, compact AND expanded compound cards, alerts, insights, actions, tracking and weekly detail. Never erase expanded insights/history to imitate a cleaner compact card. Prioritize these protected workflows and outstanding Stash modals before moving to Protocol/Plans. Keep Hybrid visual identity across modes; preview only.


### 2026-10-25 — Today complete coverage reiteration
- User explicitly wants original entire-app redesign not forgotten; finish lower Today including expanded compound, insights and alerts, tracking disclosure, week summary and all actions before Protocol/Plans. Preserve richer expanded information rather than reducing it to compact scan card. No production merge/deploy approval.


### 2026-10-25 — Today expanded-card follow-up
- PR #123 preview only: group existing Last/Next facts in equal-width surface while preserving schedule calculations, insights, site notices and actions. Intel receives plain label and aria label. Not production-approved.


### 2026-10-25 — Segmented Today information follow-up
- Approved direction via user screenshot: pill-shaped segmented Insights / History / Details in expanded Today compounds. Keep status and primary logging visible; supporting notices under Insights and site rotation text without emoji. Preview-coded only, iPhone acceptance pending.


### Today compact action cleanup
- 2026-10-25 approved preview-only: compact compound disclosure explicitly says View details; expanded card uses existing Insights/History/Details for history; no repeated card-level History CTA. Compact action row adapts to present actions, site warning says repeated-site count rather than generic Site rotation, obsolete history instruction removed. Preserve history edit/view and overdue/reschedule handlers. Do not merge/deploy.


### Log Dose preview trial
- 2026-10-25 user approved trial of calmer Log Dose action hierarchy on PR #123. Scheduled action should reflect getDoseStatus.showLogBtn; no duplicate scheduled Log Dose in completed/upcoming/paused states. Preserve separate unscheduled/retrospective entry routes and overdue resolution.


### 2026-10-25 — Log Dose preview release checkpoint
- 2026-10-25 — Approved preview-only Log Dose UX: show scheduled Log Dose when occurrence is actionable; show What happened? for older overdue situations, completed-state readout after recorded scheduled dose, with available controls filling the row. Keep unscheduled/retroactive logging and other existing logging flows discoverable; preserve drafts/source allocations/math. Cloudflare preview deployment approval does not authorize merge or production deployment.


### 2026-10-25 — Today expanded screenshot audit
- 2026-10-25 user feedback: use matching compact/expanded compound typography and disclosures; status should appear once, preserve overdue context; align ring with date facts; keep immediately useful Last/Next only, move long-running statistics to Details and logging pattern to Insights; give Today doses normal heading and minimum 44px actions; show Taken today confirmation when a single daily occurrence is recorded. Approved as design refinement only; no deployment authorized.


### 2026-10-25 — Critical preview syntax hotfix
- 2026-10-25 blocker response: syntax errors that stop preview startup take priority over UX polish; apply minimal source edit only, never reset production localStorage or change dose data. The `Taken today` timestamp must close both JavaScript interpolations correctly. Validation requires source JS parse plus browser startup; parse alone is not enough. PR #123 remains preview-only.


### 2026-10-25 — Today card milestone consolidation
- 2026-10-25 Consolidated milestone decision: stop presenting individual card polish commits as acceptance. Preserve one labelled compact/expanded disclosure, a single overdue status, history inside tabs, context-sensitive dose action, no duplicate History CTA, and 44px+ touch targets. Keep calculation and persistence code unchanged. Validate the entire card-state matrix before advancing to Daily Tracking. No production approval.


### Today milestone — source-derived QA gate (2026-10-25)
- Preview test policy: source-specific Today changes must be tested against a FULL APP DEMO rebuilt from the exact design-branch head, never a stale checked-in demo snapshot. Card UX acceptance means state-complete testing and user visual approval, not source string assertions alone. PR #123 remains draft.


### Today disclosure / typography parity (2026-10-25)
- 2026-10-25: compact/expanded View details and Hide details are ONE shared UI: `nxTodayDisclosureInner(expanded)` text plus same outline SVG, with only label/rotation differing; both wrapped in `.nx-today-disclosure`. Same `.nx-today-compound-name` class for typography in both states, including paused compact card. No ellipsis reintroduced. Design preview code, not yet user accepted or merged.


### Today grouped correction pass — 2026-10-25
Today insights must be record-grounded, not imply pharmacokinetic certainty or suggest escalation. A phase countdown should only appear when an actual dated phase boundary exists. Completed-dose main action uses existing Dose completed / Scheduled entry recorded, not an additional Log Dose CTA. One chevron per disclosure, Intel must read as a button.


### 2026-10-25 — Today visual reset based on iPhone screenshot
- 2026-10-25 user rejected stacked insight boxes and generic Wear Off Window / Protocol review wording. Use one calm segmented surface with typography and whitespace rather than nested cards; avoid duplicating overdue state between ring and insight summary as much as practicable. Scope native system-font stack to Today compound cards during preview, subject to visual acceptance. Legacy pseudo chevron must be suppressed by selector valid independent of screen ancestry; do not add a second chevron. Do not invent phase countdowns absent actual schedules.


### 2026-10-25 — Root disclosure and Insight cleanup
- 2026-10-25 root-level correction: legacy `.compound-collapse-btn::after` pseudo icon must exclude `.nx-today-disclosure` rather than append endless override rules. Insights content should be a single unboxed surface using typographic grouping, not nested mini-cards. Pharmacokinetic or treatment-effect claims must not be presented as if derived from tracked records. No invented countdown until actual dated milestone source verified. Preview only, not approved for merge.


### 2026-10-25 — Root cause of persistent duplicate chevron / insight borders
- 2026-10-25 clear user direction: eliminate decorative bordered container around Insights and unnecessary per-row dividers; preserve pill-shaped segmented control. Shared View/Hide details must show exactly one SVG chevron; inspect all ordered CSS layers including nexus-disclosures.css, not just base and preview. No production merge/deploy.


### 2026-10-25 — Compact Today divider correction
- Compact Today compound cards should not contain horizontal separator rails between heading, last/next facts and context. Use spacing and typographic hierarchy; do not alter the outer card boundary or unrelated surfaces.


### 2026-10-25 — Today Daily Tracking and Activity design direction approved
- **Approval:** User explicitly liked and approved the interactive Today proposal (compact expandable Daily Tracking, Today / This Week numerical Your Activity report, short Coming Up list with View Calendar). This is **design approval for implementation and review**, NOT permission to merge PR #123 or deploy to production.
- **Daily Tracking:** collapsed by default, shows saved-record-derived recorded/pending state; progress denominator includes user-selected tracking activities, not all possible activities. Preserve editable Check-In, searchable multi-select Supplements, Weight and Nutrition.
- **Activity:** retain motivating completion count and progress indicator; scheduled occurrence completion is distinct from total actual dose records, future items are not 'missed', unresolved / skipped / rescheduled remain distinct, multiple same-day occurrences cannot double-count. Today / This Week views use consistent metrics shared with later Calendar 2.0.
- **Coming Up:** 2–3 meaningful upcoming occurrences with date/compound/time and grounded status, Calendar navigation; no redundant week strip or completed items repeated.
- **Weekly:** compact retrospective summary integrated coherently with Activity, separate from future Coming Up.
- **Design:** midnight lavender/porcelain, minimal borders, readable hierarchy, 44–48px targets, both themes at 320/390, reduced motion; retain functionality and data protections.
- **Implementation status:** not yet implemented or accepted on physical iPhone. Keep draft PR #123 unmerged, production unchanged pending explicit release approval.


### 2026-10-25 — Today 2.0 implementation details (DRAFT PR #123)
- Approved UI direction implemented for review using existing saved dailyLogs, supplementLogs, weightLogs and macroLogs, and canonical `getWeekInstances` / `getDayOccurrences` for scheduled occurrence reporting.
- Tracking selection is a preference only, under `state.settings.todayTrackingActivities` (array of `checkin`, `supplements`, `weight`, `nutrition`). Defaults to Check-In + Supplements where absent; toggles must never synthesize activity entries or change historical logs.
- Scheduled completion excludes `adhoc` events, keeps explicit skipped/moved/missed distinct from unresolved overdue, and reports only elapsed week dates; planned future occurrences are in Coming Up, not "missed".
- Explicit scheduled times shown only when configured; no fabricated 8 AM default is presented as user-intended. No dose engine or inventory schema changes. This remains CODED / AWAITING TEST, not accepted or approved for production.


### 2026-10-25 — Dark Today hero intensity adjustment
- **User feedback:** previous dark hero gradient too aggressive. Approved direction: calmer, low-contrast obsidian-violet panel; use lavender as an accent for progress ring, bar and action, not as the main card fill. Implemented for draft review only at `0ae00f2`; do not infer release approval.


### 2026-10-25 — Today dark-mode hero: no decorative corner orb
- User identified top-right glow as aggressive in screenshot. **Approved targeted correction:** eliminate the decorative `::before` radial orb in dark mode while retaining the quiet dark card gradient, progress ring, and lavender data accents. No global lighting changes, light-mode change or production merge approval.


### 2026-10-25 — Today dark hero gradient refinement
- User rejected the nearly flat dark surface after removing the concentrated upper-right glow. Approved direction: retain a visibly graduated full-card dark gradient, matching light mode's even gradient distribution, without a circular spotlight. Implemented dark linear gradient #443451 → #382B46 at 64% → #30263D in draft PR #123; corner orb stays disabled. Light-theme CSS and progress accents unchanged. No release approval.


### 2026-10-25 — Actual dark-mode selector (verified)
- Nexus dark theme is represented by the ABSENCE of `html[data-theme]`, while light explicitly uses `data-theme="light"` in assets/js/01-nexus.js. For theme-specific Today CSS, use `html:not([data-theme="light"])` for dark instead of `html[data-theme="dark"]`, unless theme bootstrapping is separately migrated with testing. This fixes the incorrectly applied hero override without touching stored theme choice.


### 2026-10-26 — Today information hierarchy and Needs Attention UX approved
- User approved replacement of duplicated **Your Activity** Today/This Week segment with a compact **This Week** report, retaining actual scheduled-occurrence metrics and optional weekly drill-down without duplicating Daily Summary.
- User approved removing the redundant upper **Coming up** preview. Exactly one **Coming up** section should remain on Today (below reporting), grounded in the schedule engine.
- User selected **Option A** for Needs Attention: a compact, visible alert chip (with actionable count) that opens a polished iPhone bottom sheet, rather than the current 9-item inline expansion. Sheet groups actionable notices by urgency/type, retains real existing actions/navigation (Stash, Protocol, Check-In, Calendar) and management/dismissal/snooze behavior. Distinguish urgent safety-related notices from ordinary reminders; never hide critical alerts solely because the list is collapsed.
- Design approval is authorization to implement and test on **draft PR #123**, not approval to merge or deploy. Preserve production storage, reminders and calculation logic. Physical iPhone, parity package and full regression still required after changes.


### 2026-10-26 — Calendar 2.0 tracking hub and Today boundary APPROVED
- Calendar becomes Schedule & Activity Hub with week/month outcome summaries, progress trends, navigable grid, categorized selected-day history (Completed, Scheduled/Unresolved, Wellness), and searchable chronological logs. Remove the current undifferentiated compound wall; preserve every dose, schedule, check-in, weight, supplement, nutrition and edit route. Calendar remains current-month by default; numeric weight across months stays available. Do not count future/unresolved events as missed.
- Today stays action-focused: daily hero, quick log actions, Daily Tracking, one Coming Up, bell alerts, and only a compact This Week pulse. Detailed weekly metrics and trends belong to Calendar. Today and Calendar must use the same saved-history/schedule outcome computation, without modifying stored historical records.
- User approved design direction, NOT merge or production release. Implement on draft PR #123, test with isolated full-app DEMO and exact-source LIVE ZIP at 320/390 both themes before acceptance.


### 2026-10-26 — Calendar Logs interaction pattern APPROVED
- Day View displays every available saved event on one date (check-ins with updates, weights, measurements, macros, supplements, recorded doses). A date picker and Today shortcut enable navigation; entering from a Calendar selected day preselects that date. All Logs spans dates and applies optional type filters. Consistent outline SVG icons replace emojis. Dense Edit/Delete buttons move inside optional record details using existing app edit/delete handlers, preserving history and data integrity. Dose read-only summary in journal keeps existing compound history as editor; no new destructive flows. No data schema migration. Design approval is not permission to merge/deploy.


### 2026-10-26 — Logs full-day UX approved
- Logs support **Day View** for all record types on a date and **All Logs** for cross-date type filtering. Selected Calendar day must open full history for that date. Use consistent outline SVG icons instead of emojis. Previous/Today/Next and date picker must remain accessible at mobile widths. Keep existing dose-history and check-in update editing paths, saved dates, supplement selections and delete-confirmation safeguards; no destructive migrations. Design approval does not authorize merge/deployment.


## 2026-10-26 — Calendar Logs approved implementation boundary
- User confirms **Calendar Logs Day View + All Logs approved and implemented** on draft PR #123 branch. Approved implementation does **not** authorize merging or deploying.
- Preserve historical day-specific records, editors and dose history without rewriting stored dates, localStorage or production accounts. Keep draft PR and isolate full-app DEMO fictional data. Physical iPhone signoff and comprehensive 320/390 light/dark browser verification remain separate gates.


## 2026-10-26 — Approved Add Log / weekly score optical fixes
- APPROVED targeted visual patch on draft PR #123. Add Log uses plus icon only; eliminate redundant chevron. Popup tiles horizontally/vertically center labels; Measurements must not escape bounds; Supplements stays full-width. Today This week must show a perceptible gap in `29% so far`. Retain layout intent, real handlers, saved records, 44px actions, light/dark and mobile sizing. No merge or deployment authorization.


## 2026-10-26 — Calendar Month icons require minor Sprint 01 follow-up
- **User feedback recorded, design choice unresolved:** physical iPhone Sprint 01 passed with minor visual issues specifically in the **Calendar Month icons**. Exact change not specified; no replacement icon set or appearance is approved yet. Do not change other Calendar workflows or saved records as part of icon follow-up. Keep PR #123 draft; release approval not provided.


## 2026-10-26 — Sprint 02 draft Stash visual kickoff
- Sprint 02 Protocol hierarchy design preview was presented; user authorized continuation (“let's go”), **not release**. First code scope is CSS-only Stash card accessibility / compact text treatment on draft PR #123; preserve exact existing Manage, Kit details, Overview/Vials/History behaviors and vial/dose calculations. No approval to merge/deploy.


## 2026-10-26 — Sprint 02A Protocol implementation boundary
- User requested to continue after Protocol card preview. Approved direction: improve hierarchy and accessibility without changing status, saved phases, scheduling, compound calculations, first-dose/activate functionality or the Manage bottom sheet. CSS-only change `6479eea` implements long-name wrapping, 44px Manage/primary targets, focused detail summary and restrained card treatment. No data/schema migration; still requires latest-head QA and real iPhone preview acceptance. PR remains draft, unmerged and undeployed.


## 2026-10-26 — Shared Open New Vial form, Sprint 02
- Existing blend and non-blend open-vial buttons both reach `openNewVialModal`; keep this canonical handler. Approved Sprint 02 continuation permits scoped visual layout and accessibility correction only: responsive two-column grid at iPhone widths, BAC water full-width, readable inputs/confirm action. Do not change vial allocation, blend math, validation, history or storage. PR #123 remains draft; no merge/deploy approval.


## 2026-10-26 — Sprint 02A Protocol + Plans must precede Stash
- User clarified approved Protocol/Plans visual proposal was a request to **implement** the Protocol/Plans changes, not to move directly to Stash. Respect feature priority. Protocol cards now foreground status, phase and schedule with purpose/linked goal in existing details. Plans goal/research cards get consistent design hierarchy, and Protocol/Plans Manage sheets gain explicit headings and accessible close buttons. Preserve existing handlers, timeline, goal detail, Intel, edit/pause/resume/history and existing calculation/storage semantics. Earlier Stash draft edits remain but no further Stash work before Protocol acceptance. No merge/deploy approval.


## 2026-10-26 Protocol interior ideas — USER PROPOSALS, NOT IMPLEMENTED. Requested: celebration animation on completion; notification when phase changes; countdown of protocol days; current phase displayed in compound details. Source already supports in-app phase transition alerts (3 days, 1 day, transition day), not closed-app push. Existing getProtocolPhaseInfo function is pause-aware and authoritative. Preview designs before behavioral changes; completion only on explicit action with reduced-motion alternative and no replay; decide how a protocol-wide countdown handles differing compound durations. No deployment approval.


## 2026-10-26 — Protocol interior implementation and pause parity
- User approved proceeding with four Protocol enhancements. Current draft source contains countdown, completion celebration and compound roadmap; existing phase alert settings/notifications reused rather than adding browser push. Roadmap visual phase markers must use the pausedAt effective day when paused, matching `getProtocolPhaseInfo`; commit `177e25fa`. Keep PR draft and do not deploy without separate authorization.


## 2026-10-26 — Approved Protocol interior behaviors (draft implementation)
- Completion celebration is a one-time visual response to explicitly confirmed Mark completed, never on screen refresh; reduced-motion static checkmark. Existing saved doses/phases unaffected.
- Reuse existing in-app transition alerts at 3 days, 1 day and phase start; IDs include protocol ID and compound to prevent same-compound collisions across protocols. No promise of closed-app push notifications.
- Protocol countdown uses the latest computed phase end of all compounds with known start and phases, respecting accumulated pauses; paused, not started, scheduled elapsed, and manually completed states are explicit. Each compound shows its own current phase and roadmap with existing pause-aware source-of-truth. No automatic complete state change, no dose logic changes. Draft PR only.


## 2026-10-26 — User Protocol details feedback, design pending
- User dislikes pill/timing/active-dosing cluster under Schedule & phases and present flat phase roadmap; wants redesigned surfaces. Also requests better Create/Edit builder and optional notification when recorded compound use continues after scheduled protocol phases. These are **design requests, not final approval of proposed layout**.
- Distinguish schedule elapsed from user-confirmed protocol completion; never mark complete automatically. Explicit future scheduled activity is not proof of dose administration. Do not infer medical advice or automatically extend/copy dosing. Validate historical record association before prompting, respect dismissal, preserve localStorage, existing data and manual pause/resume.
- Possible post-pause stale filter rendering is an observation to reproduce, not a confirmed defect diagnosis. Keep PR draft and production unchanged.


## 2026-10-26 — Approved vertical phase timeline
User explicitly approved the vertical phase timeline proposal. It replaces the flat phase list, emphasizes current stage, and distinguishes completed/current/upcoming. Keep existing phase dates and pause-aware calculation. Other proposed expanded-card, elapsed schedule prompt and builder redesign remain unapproved/not coded.


## 2026-10-26 — Simplify expanded Protocol compound content after approved roadmap
- User approved vertical phase timeline and said continue. Replace duplicate mini Gantt, route pill, and active-dosing text in expanded Schedule & phases with one coherent per-compound progress row linking to the existing approved vertical roadmap. Preserve schedule cadence and goal details, and avoid equating planned phases with administered doses. No new storage or dosage behavior. PR remains draft.


## 2026-10-26 — Dedicated Protocol Overview screen approved
- User explicitly clarified the approved screenshot: detail navigation with Overview / Compound / Completion segmented tabs, a ring countdown and estimated scheduled end, a compound/phase card list, and optional phase alert explanation. This is the intended **Protocol detail screen**, separate from lightweight list cards; do not replace it with only card expansion. The initial draft implementation uses a sheet and preserves the approved vertical compound roadmap, existing Manage actions, data history and phase math. The prior compact list card remains entry context. Product equivalence and physical iPhone signoff are still pending; no merge/deploy.


## 2026-10-26 — Approved Protocol information architecture de-duplication
- User approved simpler Protocol navigation. Protocol list must be compact with only name/status, short timeline progress and next actions. Dedicated Overview is source for ring countdown, estimated schedule end and compound progress. Tapping a compound opens approved vertical timeline. Remove duplicated Compound tab and status-only Completion tab; retain completion/pause/edit and other existing actions via Manage. List must not expose another Schedule & phases expansion. Progress is derived from canonical pause-aware timeline, never a placeholder. Approval does not authorize merge/deploy.


## 2026-10-26 — Regression contract updated for approved Protocol IA
- Tests must verify the current approved compact Protocol list → dedicated Overview → vertical phase timeline/back navigation; do not require the removed inline Schedule & phases disclosure. Protected Today/Calendar/Stash behaviors and dose logs remain tested. Plans Research ellipsis must visibly contrast from its parent card; override the higher-specificity `#app` rule rather than masking test failure.


## 2026-10-26 — Protocol artifact provenance and acceptance
- An Actions `pull_request` build uses the tested PR merge ref (not branch head) and its merge SHA is the build manifest source_commit; compare it with PR merge_commit_sha before calling builds exact-source. User acceptance must inspect extracted full isolated standalone DEMO and actual 320/390 light/dark browser screenshots; automated tests are not physical iPhone checks. Keep PR draft and Cloudflare unchanged.


## 2026-10-26 — Contextual Plans/Protocol navigation approved
- Keep Protocol list compact; Protocol Overview links directly to an associated goal, not a generic Plans button. Goals Connections links back to existing Protocol Overview. No shortcut when a goal is unlinked. Never infer goal progress from protocol activity. User approved design, not deployment.

 
## 2026-10-26 — Next-chat Plans priority confirmed
- User accepted moving on to Plans. Start with **Goals** and contextual relationships to Protocol, then Research and Shopping. A goal's Connections should point to its genuine linked protocol; Protocol Overview should point to its actual linked goal. Avoid generic navigation buttons, duplicated content, status inference, automatic goal progress or medical recommendations. Preserve standalone Goals/Research/Shopping flows.
- Design approval to proceed is not an instruction to merge/deploy. Current PR #123 stays draft; source and tests must be reverified in next chat.

## 2026-10-26 — Goals-first progress hierarchy (approved direction, draft implementation)
- Show goal identity, status, real progress evidence, target date, connections, and detail navigation. Numeric percent appears only with comparable saved weight records, configured source, valid baseline and target; subjective, milestones and exploratory goals show descriptive states, not fabricated completion. No protocol-to-goal causality or automatic status inference.
- Preserve Goal detail Overview/Connections/Activity, management actions, linked Protocol Overview route and Check-In original-record links. CSS/markup changes in draft PR #123 only; no release approval.

## 2026-10-26 — Goal density refinement
- User rejected earlier Goals card pass as visually unchanged. Approved direction is less redundant summary, fewer stacked labels and more compact hierarchy; preserve accessible 44px controls and actual evidence. Draft implementation only, user visual acceptance pending.

## 2026-10-26 — Original Goals preview is approved visual reference
- User provided two screenshots of the original in-chat Goals preview and rejected the subsequent compact experiment. Preserve original spacious card hierarchy (title, status, target, meaningful progress, linked protocol, View goal details) and original detail sections. Do not independently reimagine or compact an already-approved preview. `d98d7b78`, `7727191f` are draft restoration commits; real UI acceptance pending.

## 2026-10-26 — Approved Add/Edit Goal four-step wizard
- Approved design: one persistent bottom-sheet modal, four stages Basics / Progress / Connections / Review, Back/Continue and final Save, existing Goal data and Check-In associations preserved, no intermediate persisted writes. Reuse same wizard for Add and Edit. Implemented draft, browser/device acceptance pending.
- Log Dose: quick vs guided concept approved for exploration; **not authorized as a dose accounting change**. Design and validate separately; preserve source selection, drafts, blend splits and inventory confirmation.

## 2026-10-26 — Log Dose Quick/Guided design proposal (not coded)
- Quick Log should reduce repeated entry for known routine doses while ALWAYS exposing compound, route, amount, vial source, calculated units and deductions for explicit confirmation. No silent recording or silently chosen source. Guided Log splits (1) compound/amount, (2) vial/source and allocation, (3) final review with per-vial and per-component breakdown for blends. Preserve original state, drafts, source selection, dose history, insufficient-inventory blocking and editing. User has approved design exploration, not merge/deploy or bypass of validation. Hybrid Soft Depth + Porcelain + Obsidian Precision styling.

## 2026-10-26 — Log Dose implementation boundary
- Approved Quick Log / Guided Log layout; first code pass uses one existing `doseModal` and single `#save` handler, no independent calculator or storage path. Guided stage navigation does not persist dose; preserve existing logic and user-entered values while changing stages. Do not conflate implemented mode switching with full approved quick-review parity: Quick separate review is not yet coded and must be validated before approval. Both themes use Soft Depth / Porcelain / Obsidian Precision.

## 2026-10-26 — Log Dose final confirmation requirement
- Every mode must explicitly reach Review before record Save becomes available. Step errors are visible and anchored near sticky footer. Preserve original validated Save logic; UI prevalidation for amount/date must not become a new independent inventory calculator. Quick uses 2 steps; Guided uses 3. User-approved visual direction unchanged. Audit checklist must be compact, avoid warped per-row controls.

## 2026-10-26 — Ledger truth and safe wording
- Render in-memory allocation rows in Review rather than copied DOM text; label as read-only preview and retain original save-time vial/stock checks. Never claim a blend is deducted until original Save validates it. Native unit conversion is required for each displayed vial allocation. Use 46px sticky actions and reduced-motion preferences.

## 2026-10-26 — Source identification in Review
- Show actual selected open vial ID (not generic `open`), identify prepared batch amount and count, display per-vial rows from the existing allocation records; never invent blend-specific deductions before authoritative save calculation.

## 2026-10-26 — Approved Goals header action and next design focus
- User approved moving Add Goal above goal cards after Plans subnavigation. Keep the current Goal wizard/editing logic, goals data and visual system; remove bottom duplicate only. Approved next design sequence: Research UI/UX audit and preview first; Shopping audit next. Do not treat visual discussion as release authorization. Research remains an existing queue with status, Intel, reason/notes and management; Shopping remains Needed/Ordered/Received with categories, quantities and goal links; retain all actions and data.

## 2026-10-26 — Approved Research and Shopping UI: single-chevron rule
- User approved refined Research card, and explicitly prohibited double chevrons (notes + Compound Intel). Research uses one right-pointing chevron only on Compound Intel; personal notes use a 44px labeled Show/Hide button with notebook outline icon and aria-expanded, no chevron. Keep research management ellipsis and original bottom action sheet; original compound picker, status, reason, goal, notes, edit/delete and Intel remain. Add Research and Add Item moved to top like Goals. Shopping keeps Needed/Ordered/Received and original add/edit/delete without new status automation.

## 2026-10-26 — Plans default and single Intel divider
- Approved by user: normal entry into Plans from More (or generic Plans quick action) defaults to Goals every time. Explicit Research Queue / Shopping List shortcuts and manual sub-tab switching remain functional. Research card has exactly one separator above Compound Intel, exactly one Intel chevron, and no notes chevron. Preserve all records and navigation destinations.

## 2026-10-26 — Research and Shopping form design
- User approved aligning the Add/Edit Research and Add/Edit Item modals with premium Nexus styling without adding wizard steps or modifying records. Keep both single-page; reuse original compound picker, values, field IDs, status options, linked goal/protocol choices and save handlers. Visible field labels, one header close action and one sticky Save primary action; no emoji category labels. User-approved one-chevron-per-Research-card rule and Plans→Goals default retained.

## 2026-10-26 — Stash parity polish implementation scope
- The existing Stash hierarchy stays authoritative, including active/frozen kits, open vial and blend math, prepared batches, history and deductions. Add/Edit Kit receives presentation-only header, associated labels, one sticky primary action, touch/focus and reduced redundant panel depth. Prepared list uses one outline chevron. Needs-attention actions gain a 44px minimum. Existing separate blend editor unchanged until source-faithful parity tests; never silently convert formats or fields.

## 2026-10-26 — User-requested Stash workflow redesign direction (design proposed, approval pending)
- User requests guided Add/Edit Kit similar to Log Dose (reduce scrolling), searchable compound combobox, Prepared Doses redesign, and complete Stash secondary-screen visual consistency audit. Proposed three-step Kit Details → Preparation & Storage → Review & Save. Existing blend editor must receive consistent experience without flattening component-level vial math. Do not alter inventory identifiers, existing vial accounting, prepared allocations, history or storage; no destructive migration. Proposal not yet coded or approved as exact interaction design.

## 2026-10-26 — Stash guided wizard approval boundary clarified
- Source audit found guided ordinary kit editor and searchable compound combobox already coded on draft PR #123 despite previous DESIGN ONLY handoff. Treat code as **draft candidate, not approved or accepted**; review exact interaction and validation before extending changes.
- Keep ordinary kit `#ssave` and separate blend-kit authoritative handlers, original element IDs, vial-count/strength edit restrictions, per-component accounting, review-only navigation and no intermediate persistence. Do not merge or deploy without explicit approval.

## 2026-10-26 — Approved compound selection visual for guided Blend Kit
- User selected dark screenshot style: labelled Compound field, selected value with a single chevron; an expanded bordered browse surface containing Search compounds input and vertically stacked matching choices. Retain type-to-search and keyboard/VoiceOver accessibility. Apply this pattern to ordinary and blend kit selectors as alignment work, not to reimplement calculation logic.
- Approved continuation of a 3-step guided Add/Edit Blend Kit presentation in PR #123. The original `#bk-save`, component composition, existing-vial locked ratio, historic allocations, and single physical inventory representation remain authoritative. This is approval to implement in draft, not permission to merge/deploy.

## 2026-10-26 — Guided blend workflow acceptance follow-up
- User approved the three-step guided Blend Kit workflow and the screenshot-style dropdown with embedded search. Current source `assets/js/03-nexus.js` already includes a three-step blend wizard and component dropdown search, preserving original `#bk-save` handler. Review uncovered two BAC inputs on new blends (`#bk-bac` and `#bk-bac-edit`) with potentially divergent displayed review/save semantics. Existing edit must preserve opened-vial ratios and historical allocations. Do not merge/deploy until targeted validation, UI acceptance, and full-app artifact inspection. Next action: reconcile BAC UI and test blend save and history at 320/390 light/dark.

## 2026-10-26 — Approved guided Blend BAC single-source interpretation
- A blend has one BAC-water-per-vial input in Preparation & storage (`#bk-bac-edit`), and final Review must display the exact value the existing authoritative `#bk-save` will persist for a new kit. The old duplicate new-kit `#bk-bac` field is removed. Preserve the existing composition and history protections. Code is draft; not release approval.

## 2026-10-26 — User rejected guided Stash UI, approved pattern reaffirmed
- Physical iPhone screenshots explicitly REJECT the current ordinary and blend kit UI. The source-faithful acceptance requirement is one searchable editable combobox per compound (type OR browse same field, no double native select), same stepper geometry as approved Goal wizard without redundant `1 / 3`, single sticky Continue/Back or final Save—not both, and *new blend open vial defaults false*. Match approved modal typography/safe-area and eliminate isolated blue text actions. Keep original inventory accounting and draft PR; new corrective code awaits visual/functional acceptance.

## 2026-10-26 — iPhone visual feedback overrides green CI screenshots
- User rejected detached blue Continue, double compound controls and poor step/content hierarchy. Source-faithful iPhone screenshots are design acceptance evidence; automated functional PASS is insufficient. Follow previously approved Goals hierarchy with one persistent modal header, one step label/progress bar, one strong sticky Continue/Save CTA and readable review rows; unique editable combobox instead of native+search duplicates. Blank/sealed default for new blend, preserve canonical handlers. User has not yet approved post-fix screenshots; PR stays draft.

## 2026-10-26/27 — Guided Stash design acceptance candidate, not production approval
- User's original screenshot complaints are addressed in draft source: consistent Goal-like three-step bar, no duplicated step counter, permanent Blend title and close, visible 48px purple Continue and final Review-only Save, native backing selectors hidden, full-width single editable compound combobox per blend component, unselected open-vial default. Verified browser screenshots at 390 dark/light and 320 dark Blend (artifact 12699630393). This is automated preview acceptance only; **user's physical iPhone signoff pending**. Existing inventory/save math remains canonical; no deployment permitted without explicit approval.

## 2026-10-26 — Approved Blend Kit one-row compound composition
- Each blend composition row displays editable searchable compound combobox, mg per vial and 44px remove on the **same horizontal line**, including narrow iPhone widths. Keep combobox sufficiently flexible to type and view options, mg compact, and custom Other field below only when selected. Layout-only; no changes to component math, saved records or ledger.

## 2026-10-26/27 — One-row Blend visual detail decision
- Required one horizontal row: editable searchable compound name, compact mg value, and 44px remove control. `269f468d` screenshots show aligned controls at 320/390 in both themes, but full compound search placeholder was clipped; shorten visible placeholder to `Search…` (draft `3bab1d9a`), keep accessibility name complete. Do not increase row width or stack mg. Acceptance contingent on latest screenshot and iPhone check.

## 2026-10-26 — Global scrolling principle and Blend sheet feedback
- User's actual iPhone preview screenshots explicitly reject dark rectangular footer backdrop, expanding in-flow compound results, and a flat verbose Review; require floating suggestion overlay (no added row height), clear visual component quantities, and footer visually continuous with sheet.
- **App-wide approved principle:** avoid nested scrolling inside modals, popovers or other windows. Long content must use one primary page-level scroll surface or be split into digestible steps; preserve keyboard focus, safe-area and fixed primary action. Do NOT globally disable overflow on existing forms: audit screen by screen and convert long workflows to full-screen editor where necessary; do not clip fields.

## 2026-10-26 — Blend editor uses mobile full-page editing surface
- To meet the app-wide no-nested-scrolling principle, prefer a full-screen mobile workflow for long guided Blend editing instead of a partial-height sheet with internal scrollbar. Keep one primary editing scroll surface, a sticky primary action, keyboard-safe suggestions that overlay without increasing form height, and iOS safe area support. Treat other modal conversions as a separate systematic audit; don't globally hide content or disable scroll.

## 2026-10-26 — Compound combobox type, suggestions, browse-all (USER APPROVED)
- One editable field allows searching, tapping for five quick alphabetical suggestions, and a **View all compounds** action opening a full-screen searchable library (one primary scroll only, no nested scrolling). Selection returns to the original form/step without clearing entered vials or mg. Native select remains authoritative backing control where legacy handlers use it. First rollout ordinary Stash Kit + Blend Kit on draft PR #123; broader Protocol/Plans/global picker standard approved in principle but needs per-flow implementation/QA.

## 2026-10-26 — Shared compound browser rollout implementation
- Approved quick five-result and full-library Browse All is now implemented in draft Stash single/blend editors, Protocol Stack and reusable Plans/Research/Protocol Idea compound multi-select. Existing selection arrays and route/goal/save handlers are authoritative. Browser returns to editor without a separate record write. Quick result lists must not scroll inside a scrolling window. Other compound filters are not automatically converted without separate audit.


## 2026-10-26 — Shared kit creation review and actions (user-requested)
- **Status:** Approved refinement, implementation on draft PR #123; not deployed or real-device accepted.
- Both standard and blend kit creation use a consistent three-step progress label, final step `Review & save`, review hero and two-column inventory/preparation facts. Blend additionally lists its compound composition; standard highlights its single compound and strength per physical vial. New-kit primary action uses **Save Kit** for both, while edits retain Save Changes.
- Continue and Save use one subtle primary lavender depth treatment with 16px horizontal footer insets; Back remains secondary. Avoid full-bleed bottom action backgrounds. No business logic or storage migration permitted for presentation consistency.


## 2026-10-26 — Unified standard/blend Add Kit UI, user-approved
- **Approval:** User approved the unified Step 3 review design in chat after comparing real iPhone screenshots of standard Add Kit and Blend Kit on Cloudflare preview. Approval is for UI/UX parity, **not** for PR merge or production deployment.
- Both workflows use `Step 3 of 3 · Review & save`, the same progress treatment, consistent heading, one unified review-card hierarchy and grouped `Inventory and preparation` details. Blends additionally show composition and total mg per physical vial; standard kits show the regular compound/strength information. Preserve each workflow's actual data semantics, validations, calculations, editing and vial histories.
- Use **Add to Stash** as the final primary CTA for both creation flows (do not use Save Kit for only one). Keep Back/Continue button hierarchy, 16px minimum horizontal sheet/footer inset on both sides and consistent touch targets. All wizard primary buttons should share purposeful styling; avoid inconsistent glowing/3D shadow only on the final CTA. Prefer clean lavender primary controls with legible dark text, pressed/focus/disabled states.
- User's real iPhone screenshots reveal different header spacing, step placement, review density, footer background, border/gradient, and nested-scroll indications across standard versus blend. Apply shared components/tokens rather than isolated overrides. Correct sheet-specific scrolling and keyboard/safe-area conflicts in this scoped UX parity task; **broader app-wide no-nested-scrolling audit remains separate unfinished work**.
- **Status:** design APPROVED; implementation and post-change device QA not verified. Protect all saved records, storage key, single and blended kit accounting; no destructive migration, merge or deploy without explicit authorization.


## 2026-10-26 — Approved preference and idea classification protocol
**Status: APPROVED documentation workflow.** Classify all newly captured Nexus feedback under three clearly distinct categories:
1. **Approved preferences / principles:** User explicitly approves a reusable design or interaction rule. Record date, scope, rationale, protected behaviors, and where else it should apply. Approval of a design is **not** authorization to merge or deploy.
2. **Ideas to explore:** Brainstorms, tentative likes/dislikes, potential enhancements, alternatives or unanswered questions. Record as proposed, with relevant screens and a next evaluation criterion. Do **not** present as approved, coded or scheduled.
3. **Implemented decisions:** Link exact code commit/PR, tests, source and deployment state. Do **not** equate coded with tested, merged, deployed or physical-iPhone accepted. Track those gates separately.

**Practice:** Capture the underlying rule behind specific screenshots and comments, not merely the one-off correction. Keep user wording where useful, explain trade-offs and superseded choices, and never silently promote proposals to approval or claims of implementation. Cross-reference PROJECT_STATE for active priority and RELEASE_HISTORY/REGRESSION for verifiable evidence. Existing historical entries are not presumed exhaustively recategorized.


## 2026-10-26 — Add Kit UX feedback: currency parity and required-field discovery
- **Approved direction (user visual feedback):** Standard and Blend creation should present consistent Continue/back/final-action insets and styling, including 16px horizontal space around footer buttons. Intro copy in standard Add Kit may remain near the top; do not move or delete merely to force parity. Blend uniquely requires composition; otherwise group equivalent kit details consistently.
- **Approved functional parity:** Blend Kit must allow selecting a currency like standard Add Kit. Both offer expanded available currency codes: CAD, USD, GBP, EUR, AUD, NZD, CHF, JPY, CNY, HKD, SGD, INR, MXN, BRL, ZAR; retain historical currency codes on editing. New kits default CAD. No exchange-rate conversions or changes to historical costs.
- **IDEA TO EXPLORE / SEPARATE FEATURE LOG:** User requested an app-wide **mandatory/required fields audit**. Audit forms screen-by-screen (especially Standard/Blend Kit) for essentials, clear optional labels, validation, visible required markers and inline error feedback. Define exact required fields and legacy edit/import behavior before implementation. Do not add mandatory validation across existing workflows without review/approval; preserve backward compatibility and existing stored records.
- **STATUS:** currency selector and UI styling coded on draft PR #123, pending browser/native iPhone checks. Mandatory-fields audit only logged, NOT approved field-by-field, implemented or deployed. Separate app-wide scrolling audit remains unfinished.


## 2026-10-26 — Standard/Blend Kit title typography parity (APPROVED)
- User compared actual screenshots: regular `Add kit` rendered as a small tracked/monospace label while `Add blend kit` used a prominent bold heading. Both are equivalent creation workflows and should use the same 20px/750-weight/1.25-line-height title hierarchy, normal letter spacing, matching 44px close controls, and 14px/700 step labels. Keep wording specific to kit/blend and retain standard intro at top as user accepted it. No data or inventory logic changes. CSS fix committed to draft PR #123 at `2852088a5f83e8312b6a6767dc2efdac0f62d1c7`. This is approved design, **not authorization to merge/deploy**.


## 2026-10-26 — User-approved optional kit test results and blend analytics discovery
- User requests **optional Upload test results** on **Step 2 · Preparation & storage** in both standard Add Kit and Add Blend Kit, ideally beneath Notes, with consistent UX. Existing code in `assets/js/03-nexus.js` already defines `nexusKitTestResultControl` and inserts it before the save action in both workflows, storing small attachments as `testResultAttachment` on kit records; do not create a second attachment system. Verify the attachment appears in step 2 after wizard DOM moves nodes, survives create/edit/export/restore, and is viewable later. PDF/JPG/PNG/WebP <=750KB currently supported; HEIC is not. Attachment storage limits and browser quota must be assessed before expansion.
- User approves the rest of the current kit layout; avoid unrelated redesign. After completing attachment QA, **next screen priority: Supplies**.
- **Future discovery, not yet approved for implementation:** Blend Composition & Dose Analytics should expose actual per-compound contributions from blend doses in relevant Stash, Log Dose, and history views. Audit current stored composition, recorded dose components and totals first; avoid double counting and protect historical logs. Do not conflate physical-vial deductions with per-component amounts.
- Mandatory-fields and app-wide nested-scrolling audits remain separate unfinished priorities.


## 2026-10-26 — Test results attachment visual correction (approved preview parity)
- User explicitly rejected the plain blue `Upload test results` link and oversized, dry explanatory paragraph: it did not match the previously shown polished card preview. Preserve the approved Step 2 location beneath Notes and optional behavior, but render a unified bordered, padded card in both Standard and Blend Kit with outline upload icon, `Test results` title, `Optional` pill, concise COA description, full-width `Choose file` outlined 46px action, and subtle concise file limit help. Selected files retain meaningful name/remove/validation feedback. Do not claim image HEIC support or server upload. Do not change record storage semantics or inventory logic.
- Draft PR #123 only, code `65ac266` and `7d36813`; CI/device acceptance pending. Supplies remains next screen after attachment QA. Mandatory-fields and app-wide nested-scrolling audits separate.


## 2026-10-26 — Kit attachment must be reopenable, not download-only (USER REQUIREMENT)
- User explicitly clarified the core reason to upload test results: **open and view the saved file later**. A filename/download-only Stash action was insufficient.
- Coded on draft PR #123: both Standard and Blend Step 2 attachment cards expose `View file` after selection, and saved Stash Kit details expose a `View file` action alongside Download. Shared in-app full-screen PDF/image viewer uses temporary local Blob URLs, native PDF frame or image display, close/return, optional download. Does not modify inventory, attachment record schema, history or storage.
- Preview supported PDF, JPEG, PNG and WebP only; unsupported/imported file blocked. No HEIC support or server upload. Browser runtime + native iPhone Safari PDF viewing/safe-area still acceptance gates, not assumed passing.
- After attachment acceptance, review Supplies screen. Mandatory-fields and app-wide nested scroll audits remain separate unfinished priorities.


## 2026-10-27 — Step 2 Kit/Blend consistency audit from physical iPhone screenshots
- User confirmed persistent unequal-looking Cost field widths and broader Standard vs Blend layout mismatch, asked assistant to enumerate actual differences and enforce consistency. **Approved reusable principle:** equivalent Step 2 input groups must use the same field order, paired widths, labels, input height, multiline Notes and actions, except truly blend-specific data. The user previously approved keeping Standard Kit's introduction at top, so do not remove it solely to make headers identical.
- Scope implemented on draft #123: Blend Step 2 now orders BAC+Expiry, Total Cost+Currency, Storage, Notes, Test Results, rather than Storage+Cost and standalone currency; grid uses `repeat(2,minmax(0,1fr))` shared with standard; cost+currency controls use equal width. Standard Notes is now multiline; both labels standardized to TOTAL COST (optional), STORAGE LOCATION, NOTES (optional). Blend open-vial checkbox styled as full-width selection. No change to underlying field IDs, values, validators or inventory mutation handlers.
- Required-fields audit and app-wide nested scrolling still separately unfinished. Physical iPhone acceptance of this exact UI pending; no merge/deploy approval.


## 2026-10-27 — Supplies empty-state UX (targeted design improvement)
- User identified Stash > Supplies as the next screen for review; screenshot shows a thin green dashed “+ Add Supply” button, weak floating empty-state copy, and excessive blank space. **User direction:** align Add Supply CTA and empty-state UI with the rest of the app, preserving existing inventory behavior.
- Targeted draft design implemented on PR #123: when no supplies exist, show a single compact centered empty-state card with outline inventory icon, short inviting title, purposeful explanatory copy, and one accessible lavender **Add supply** CTA. Once inventory exists, keep the same add action above the inventory list. No duplicate calls to action in the empty view; button ID `add-equipment` and `equipmentModal(null)` remain unchanged.
- Scope limited to initial empty presentation and CTA styling; no saved supply schema, consumption, forecasting, reconstitution, editing or delete logic changed. Await visual approval and current-head CI. Mandatory-fields and app-wide nested-scroll audits remain separate unfinished priorities. No merge or production deploy authorization.


## 2026-10-27 — Supplies form and populated-card visual alignment (user approved continuation)
- User approved Supplies empty-state direction and explicitly requested continuing to the **Add Supply form and populated Supplies cards**. Preserve current equipment types, pack units, open/sealed state, BAC water use-by, consumption forecasting, history, restock and editing semantics.
- Draft PR #123 UI work: Add/Edit Supply heading brought into shared 20px hierarchy, create action `Add to Supplies` / edit `Save changes`, lavender primary actions, equal-width paired fields, 48px touch controls, multiline Notes, existing unit/status fields and logic preserved. Populated supply cards receive unified rounded surface, outlined secondary Details and lavender primary action, consistent spacing and accessible focus treatment. No destructive data changes, nor release approval.
- App-wide mandatory-fields and nested-scrolling audits remain independent priorities. Historical kit iPhone keyboard/attachment acceptance still outstanding.


## 2026-10-27 — Wizard navigation and first-dose Today principle (user requested)
- User approved investigating/fixing Today-versus-active-Protocol first-dose visibility, then upgrading Protocol and Goal wizards together. Design System 2.0 navigation standard: **Back** for prior step, **Continue** for advancing intermediate steps, explicit final actions (Save Draft, Activate, Save changes/Add Goal). Do not mix “Next →” with “Continue” for equivalent navigation.
- An active protocol's scheduled first occurrence should be visible on Today even before any logged dose, if due on that date; no fabricated dose record or premature inventory deduction. Future-start, paused and wrong-weekday protocols must not generate a due-today item. Use canonical occurrence logic; verify edge cases before release.
- Protocol Schedule uses labelled groups and touch-friendly controls; Goal's optional target date is visibly labelled and Check-In connection shows an honest empty state when no observed symptoms exist. Preserve all choices and existing save/data mapping. This code is **draft pending QA**, not a released/fully accepted design.


## 2026-10-27 — First-dose UX confirmation (draft QA, not deployment)
- Preserve the decision that Protocol activation may generate scheduled Today occurrences before the first administration is recorded. The new test fixture verifies an active scheduled first dose is displayed without logging it, while pause/future/wrong-weekday cases remain absent. An automated PASS does not imply medical advice, a dose taken, a physical-device PASS, or authorization to deploy.
- Maintain the unified Back/Continue convention and clearly labelled date and schedule inputs across Protocol and Goal; obtain visual acceptance before calling both wizards fully complete.


## 2026-10-27 — Goal status should be editable without reopening full wizard
- User requested quick Goal Planned → In progress changes from the ellipsis action sheet. Use four explicit actions with persisted canonical statuses `planned`, `active`, `paused`, `completed`; display `active` as “In progress” in this context, without renaming saved values. Only mutate the selected goal's `status`; never cascade to linked Protocols or dosage history without separate approval. Keep Edit/Delete available; use shared lavender DS2 visual treatment. Implementation is draft pending device/CI acceptance.

- Approved audit direction (2026-10-27): Protocol `Ready for first log` is informational rather than success; avoid neon green. Use neutral title text and shared lavender CTA in both themes, without changing status semantics or log action. Implementation draft pending visual/contrast QA.


## 2026-10-27 — Today header grouped controls (draft design decision)
- Group existing Needs Attention bell, Profile and light/dark theme toggle on one aligned Today header rail, replacing separate top-row/Profile placement on Today only. Retain icons, action handlers, alert badge, profile update dot and non-Today header; do not duplicate actions. Three 44×48px touch targets, safe responsive spacing, outline/focus and accessible labels. Avoid touching schedule/dose state or storage. Approval remains subject to visual iPhone review.


## 2026-10-27 — Dose Review source labels and observations disclosure
- Present *readable source identity first* in Log Dose Review (compound name, vial size/remaining, prepared-dose description), while retaining exact kit/vial and multi-source IDs in an opt-in disclosure for auditability. Never suppress source traceability or change which source is deducted. Explicit dose confirmation continues to invoke original validation/allocation/save code; entering Review is read-only.
- Keep Observations optional and progressive (collapsed in Quick Log, expanded when editing existing record) so symptoms, notes and escalation remain available without extending the default form. Don't lose entered observations when changing Quick/Guided mode or navigating steps. Approved as part of DS2 continuation, pending device/browser acceptance.


## 2026-10-27 — Supplements and Stash details DS2
- Remove the legacy `Import from Notion` canned supplement action from the public-facing Profile screen. Never delete an existing supplement or historical supplement log as part of removing the importer. Allow a new supplement to be created in the daily Supplements logging sheet, even with an empty catalogue; adding the name saves it to the catalogue and selects it, but recording it as taken still requires the existing explicit Save supplements confirmation.
- Apply DS2 lavender/neutral hierarchy to Profile's Add, align Stash opened-vial status next to its vial title and constrain Prepare Dose source amount controls without changing allocation/reconstitution math or logging behaviour. Design remains draft pending browser and physical iPhone review.

- Supplements inline creation must also work in Daily Check-In, even when catalogue empty. New catalogue name is selected in unsaved Check-In draft; existing Check-In Save remains the only path recording day-specific supplement use. Historical logs preserved.


## 2026-10-27 — Supplement search-first ordering and readable dose sources
- In Check-In and Supplements logger, searching/browsing and selecting is primary; new supplement creation is fallback BELOW Browse/results and Selected today, not interposed between search and results. Retain search-as-you-type, multi-select, empty catalogue creation and date-specific history.
- Log Dose editable source rows should never display a long numeric Kit/Vial ID as their primary label. Use compound + Vial sequence and open/finished status; preserve authoritative internal IDs in an optional collapsed disclosure labelled `Source identifiers` for support/traceability. Do not modify allocation IDs, math, source selection, dose confirmation or deductions. This addresses user-submitted physical Safari screenshot, pending acceptance.

- If multiple kits of one compound exist, distinct human-facing kit ordinals (`Kit 1`, `Kit 2`) are needed in addition to vial sequence; neither ordinal replaces persistent IDs. Technical IDs in disclosure must explain why they exist. Never use bare timestamp-length IDs as user-facing kit labels.


## 2026-10-27 — Unified supplement combobox / source identifiers / observations (draft implementation)
- User-approved targeted direction: one search-and-select multi-select for supplements with explicit Add “name” in unmatched results; remove redundant standalone Add input. Catalogue creation selects only the current unsaved entry and **must never log taken** until separate Save. Preserve date-specific history and duplicates by case-insensitive matching.
- Technical kit/vial identifiers are disclosed in a full-width row below source action controls; underlying authoritative IDs, allocation and maths are unchanged. Human-readable kit/vial labels remain primary.
- Observations is a separately labeled optional collapsed section in Log Dose; symptoms, intensity and notes remain available, independent of dose save. New mandatory wizard step is NOT approved. Physical iPhone acceptance pending. Draft PR #123 must not merge or deploy without explicit authorization.


## 2026-10-27 — Reaction vs Check-In architecture APPROVED, partial implementation
- User-approved direction: Log Dose captures administration facts only. Separate optional Record Reaction captures an event observed at/after a dose (actual observedAt and recordedAt, intensity, note), linked to persistent dose ID. Daily Check-In remains the place for delayed or ongoing experiences such as perceived sleep, appetite, energy and recovery. Never infer a specific compound caused a symptom or outcome solely from temporal association.
- Protect prior dose symptoms, notes, escalation, history, backups and inventory. Legacy observations are not auto-migrated or deleted. A dose can have multiple reaction events, and a reaction must not deduct inventory or create an additional dose.
- **Approved target:** Record Reaction from dose detail and saved-dose action menu, optionally after save, including hours/days later. **Partially coded** access from saved-dose Edit; context menu and after-save invitation pending, as are reaction edit/delete design and device acceptance. Keep PR #123 draft, unmerged, production unchanged.


## 2026-10-27 — Timed Record Reaction prompts for future native iOS/Android (USER-REQUESTED DIRECTION)
- After a confirmed and saved dose, offer an opt-in delayed notification inviting the user to record a reaction. This is a **reminder to observe**, not a claim that the compound should cause an effect. Notification opens Record Reaction pre-linked to the exact persistent dose ID. Do not require reactions to complete a dose or edit inventory when a reaction is saved.
- UX proposal pending timing/default approval: enable notifications contextually and only with explicit platform permission; suggested scheduling presets 15 min, 30 min, 1 hour, next day and custom per-compound/user setting; optional no prompt, snooze and dismiss, quiet hours and notification grouping. Keep a persistent one-tap Record Reaction action on Today/saved dose; reminders cannot be the sole access path. Avoid displaying sensitive compound names on lock screen by default; users may opt in to descriptive labels.
- Native iOS should use device local notifications, Android should use the platform's scheduled notifications with runtime notification permission (and avoid restricted exact-alarm permissions where not necessary). Reschedule or cancel pending reminders on edits/deletions; prevent duplicate notifications; account for time zones, device reboot and app data restore. Native scheduling not implemented in web PR #123.
- Current web/PWA is a separate capability: iPhone web push requires a Home Screen web app and server push; no assumption that closed Safari can run a client-only timer. No remote notification endpoint or production notification permission introduced. **Status: proposed native feature specification; not coded, QA NOT TESTED, deployment NOT AUTHORIZED.**


## 2026-10-27 — Today navigation: Completed replaces redundant Upcoming (USER-DIRECTED, CODED ON DRAFT)
- The top schedule filter becomes **Today · Active · Completed · All**, keeping plus/Add distinct. User found top Upcoming redundant with the dedicated lower Coming up preview, which already links to Calendar for complete future dates. Today remains needs-action first plus its own Completed Today section; Active retains every active compound; Completed is only today's completed/taken or explicitly skipped occurrences, not historical records; All retains status filtering. Calendar and coming-up remain the future schedule access path. Existing recorded doses, source allocations and reaction history unchanged.
- Keep compound card design/actions consistent across view contexts. Completed cards retain direct Record reaction for a recorded dose. Change is approved as filter direction; physical iPhone UI acceptance still pending and PR #123 remains DRAFT/UNMERGED.


## 2026-10-27 — Post-dose reaction invitation and event management (APPROVED / CODED ON DRAFT)
- New single-compound Log Dose save displays an optional, skippable post-save invitation: **Would you like to record a reaction?** Not now closes it; Record reaction opens standalone editor linked to the just-saved dose ID. Invitation must not save a reaction or deduct inventory; no prompt when merely editing an existing dose. User retains manual Today/Calendar/History access. No timed browser notifications; native iOS/Android reminders remain future separate implementation.
- Saved reaction history displays Edit/Delete per event. Edit preserves event ID and original recordedAt, changes only label/observedAt/intensity/notes; Delete requires explicit confirmation and removes only the chosen reaction. Dose event, all other reactions, source allocations, history and vial balances preserved. No automatic migration. Physical iPhone UI approval pending.


## 2026-10-27 — Design System 2.0 unfinished work ordering (USER CORRECTION)
- Keep Profile/Supplements and Stash/Prepare Dose as OPEN user-directed workstreams, despite partially implemented source and earlier test coverage. Prioritize these before broad form/scroll consistency audits. No new green actions, Notion personal importer, clipped Stash pill corners, hidden source amount fields or detached opened-vial status. Preserve supplement history, vial math, source IDs and all saved records. PR #123 draft and unmerged until explicit release approval.


## 2026-10-27 — Whole-app DS2, accepted screens and future sprint retention (USER DIRECTED)
- User confirms Calendar, Protocol/Plans and Supplies are **okay for now**, so avoid unrequested redesign. Design System 2.0 must cover **every subpage** as well as primary tabs: especially Trends/Nexus/Insights, Profile/Settings/Supplements, More/Learn/Intel and hidden sheets. Use approved hybrid Soft Depth + Porcelain + Obsidian. Track all child routes in docs/design/DS2_SCREEN_COVERAGE.md; no implicit Done without acceptance.
- Put accessibility/VoiceOver, required fields, app-wide scrolling, typography, navigation, motion/reduced-motion and consistency testing **LAST** in the DS2 styling sequence; retain as tracked commitments, not discarded.
- Separate long-horizon product roadmap (core workflow design, onboarding, personalization, platform expansion to iOS/Android and future functionality) in docs/product/NEXUS_MASTER_ROADMAP.md. Do not overwrite with the current sprint. Screenshot shows squared selected Stash kit detail tabs: draft CSS repair 135848e and automated guard e97a2d5; native iPhone acceptance pending.


## 2026-10-27 — Future UX ideas captured; NOT APPROVED FOR IMPLEMENTATION
User asks to retain potential swipe left/right contextual actions (including swipe-to-delete), drag-and-drop, and a more capable Nexus Ask assistant with improved visual formatting, UI and UX. They are roadmap discovery ideas P-08/P-09/P-10, not a decision about which screens to change or an authorization for destructive gestures. Require preview and scope approval; use safe confirmations/Undo, accessible alternatives and prevent scroll conflicts. Preserve current DS2 priority, production data and existing app flows.


## 2026-10-27 user clarifies DS2 review scope includes subpages accessible FROM other subpages, not only tabs or More first-level destinations. Follow paths recursively to details, editors, sheets, confirmation and empty/error states. Source inventory 85a604a9; no implicit acceptance from shared CSS or overall CI. Keep earlier accepted screens stable, perform global polish last, no merge/deploy without approval.


## 2026-10-27 USER-DIRECTED BUTTON CONSISTENCY: audit every page, nested child, modal and action button against semantic hierarchy; arbitrary gradients/grey/lavender variants are not acceptable. Different appearance must signal a distinct role (primary progression/commit, secondary/back, danger/destructive, selection, disabled). Physical Log Dose screenshot provided; provisional CSS action-family normalization afced369, pending visual acceptance. Keep data logic and selected source calculations unchanged; verify 300mg dose versus 10mg remaining before allowing release. Global a11y/motion/type/scroll sweep last.


## 2026-10-27 UX consistency refinement: Initial Dose chooser Continue/Combo and Quick/Guided Continue/Confirm/Back must share consistent semantic action colours; scoped CSS d7a45b4b and afced369 provide proposal, pending screenshot and iPhone acceptance. Automated button inventory CI added a08f62f9 to reveal deviations before approving broader tokens. No assumption that a blue/purple shade difference indicates functionality unless documented.


## 2026-10-27 DS2 button visual proof: the same semantic primary fill #C6A6F2 is now applied to Today Log dose, Plans Add Goal, Stash Add Kit and Supplements Add; Log Dose chooser/step primary family aligned. Danger family differentiates destructive Settings actions from neutral navigation; full reset gets stronger red. Separate visual/semantic classification justified. Evidence 40618241161 computed styles and screenshots; native device acceptance pending. Keep nested modal confirmation and inventory validation separate from button visual proof.


## 2026-10-27 DS2 action semantics clarified by real rendered child screenshot: Add Kit wizard Continue advances flow and is a primary lavender CTA; Trends Pattern Explorer/Symptom Timing Done merely dismisses read-only information and is neutral secondary. Implemented as CSS-only 42560603, pending exact-head evidence. Import Backup invokes native file chooser, so browser modal screenshot is not the right verification; requires dedicated file selection/confirmation test with isolated backup fixtures.


## 2026-10-27 — DS2 button role rule reaffirmed by user screenshots
Primary Continue, Save, Confirm Log, Add to Stash, Record/Save reaction uses a coherent solid lavender action treatment unless semantics differ; do not vary gradients arbitrarily. Neutral secondary Back/Cancel/informational Done; destructive danger red; selection/disabled have distinct states. Protocol 'Ready for first log' is context not success status, so mint-framed compact CTA is redesigned to neutral vertically stacked card and full-width primary Log first dose. User request authorizes this focused Protocol change despite prior acceptance of other Protocol surfaces. No functional algorithm changes.


## 2026-10-28 — USER REQUIREMENT: blend kit action parity and component reporting
- User explicitly requires blend kits to expose the applicable management actions available to ordinary kits; missing `Log outflow`, `Finish this kit`, `Reopen kit`, `Add to open vial` (when physically valid), and constituent `Compound intel` are FUNCTIONAL GAPS, not acceptable intentional omissions. `Mark as premixed blend` is logically inapplicable to a kit already a blend. Do not wire blend menus to standard handlers without validating blend physical ledger, component proportions and historical records. Keep PR #123 draft, no merge/deploy.
- User additionally requests dose-level and aggregate constituent reporting: per-vial recipe, per-dose amount of each ingredient, cumulative constituent totals, reporting by period and blend, source-vial attribution, and clear difference between blend-wide inventory deductions and analytic components. UI destinations: blend Kit details, dose review/history, Trends/Insights. Do NOT create separate physical inventory kits or duplicate administered dose events.
- Current code evidence: `assets/js/03-nexus.js` blend kit records save `composition` [{compound,mg}] and physical vial mg; `assets/js/05-nexus.js` blend doses are recorded with isBlendDose/allocations and ledger consumption. Existing `docs/continuity/DECISIONS.md` 2026-10-26 calls broader composition analytics future discovery; THIS entry supersedes that approval-status description: now REQUESTED/REQUIRED, not verified implemented. Validate historic ratio snapshots and legacy-v2 kit migrations before calculating prior doses; display unresolvable history as unknown, never fabricate.
- Accepted kit layouts protected; use existing details panels/new child reporting surfaces. Target tests: 320/390 light/dark, multi-vial ratios, old composition edits, partial/whole outflows, idempotent ledger, reversals, insufficient stock, archive/reopen, historical reporting without double-count. Physical iPhone acceptance separate. Global polish LAST.
- ONE NEXT ACTION: implement blend-aware outflow/finish/reopen paths with fictional transaction regression first, then build and verify ingredient contribution reporting. Do not claim either completed until rendered tests pass.


## 2026-10-28 — Blend parity phase 1 code (DRAFT, QA NOT YET VERIFIED)
- User confirmed blend ingredient totals should appear in Trends and approved continuing implementation. On PR #123, `287e8ca4` adds read-only Blend composition & history cards in Trends, displaying saved composition and physical blend-ledger draw counts/total mg. It does NOT infer constituent exposure from unversioned historic recipes, write separate dose records, or modify inventory. Test `af2bab34` checks the section on 320/390 light/dark fictional browser states.
- Stash blend-menu parity begins with `d517cbe7`: blends now show Finish This Kit, and finished blends show Reopen Kit. `1ac22ae9` adds a blend-specific confirmation that records remaining material as outflow and retires physical vials while preserving original logs. `84a7d05c` adds fictional confirmation/cancel UI test, not the full commit/restore transactional test. No real data touched. **All code is unmerged and post-change test results pending**; do not treat as accepted.
- Required incomplete scope: Log Outflow and Add To Open Vial for blends with safe ledger semantics, per-vial composition snapshots, accurate per-component dose/time reporting, historical unknown cases, outflow undo and finish/reopen transaction regression. Do not use standard kit handlers blindly or double count physical stock. Full release DEMO/LIVE parity and physical iPhone acceptance outstanding. Global polish LAST.
- ONE NEXT ACTION: inspect latest nested/mobile/build QA, repair failures, add explicit blend finish transaction/idempotence and inventory integrity tests, then proceed to blend outflow and constituent analytics.


## 2026-10-28 — User clarifies Add to Open Vial means CORRECT FOUND REMAINING (blend)
- User explicitly corrected the interpretation: no physical substance is added or mixed; actual open-vial remainder is greater than expected. This supersedes prior mass-mixing blocker for this use case. Existing ordinary-kit `Add to open vial` wording remains unchanged; blend menu now says **Correct open vial balance** to avoid implying physical addition.
- `9602572c` implements explicit confirmed positive balance correction on the currently open blend vial with `balanceCorrections[]` transaction ledger, no sealed vial deduction, no component/dose event, and no changes to immutable vial recipe. `3f21ee05` exposes the action on blend menu; legacy-v2 path adjusts direct physical vial balance. Balance derivation counts active corrections only. `20efc274` adds fictional correction/consumption/reversal math checks.
- `76195155` and `ade739c0` add Trends blend period filtering (7/30/90/all) and administered-only versus all physical draws; contributions continue to require original vial composition snapshots, and old unverified histories are not backfilled. `6be513ee` adds fictional blend transaction matrix for rejection, valid outflow, finish and reopen preservation, without live data access.
- Latest source changes and new exact-source QA **NOT YET VERIFIED**; no production deployment/merge. Remaining risks: existing historical data lacking vial snapshots; blend transaction undo and reopened-state presentation; full iPhone 320/390 light/dark/keyboard acceptance, new LIVE/DEMO packaging, and analytics data parity. Test/inspect before claiming passes.
- ONE NEXT ACTION: read new CI workflow outcomes and screenshots, repair any failing transaction tests or source issues, then complete package QA and physical preview acceptance. Global accessibility/typography/scroll/navigation/motion LAST.


## 2026-10-28 — User iPhone screenshot: Trends blend detail routing + validation alert (DRAFT FIX)
- Physical iPhone screenshot showed selected blend (KLOW) rendered with separate full-width Blend composition & history cards rather than only compound-centric dose history, and `Log blend outflow` attempted 50mg with 48.50mg available showing a red `SCRIPT ERROR — send to Claude` banner. Overdraw rejection is expected; banner classification and outdated Claude wording are defects.
- `517f6a4d` separates normal `showErrorBanner` validation (inline alert within modal / toast outside) from `showScriptErrorBanner` for actual uncaught errors, removes Claude reference. `9ca4348e` hides standalone Blend Analytics section when compound selected and adds estimated per-injection ingredient values within selected compound Dose history, sourced from dose allocations + locked physical-vial composition only. Missing trusted snapshot explicitly shows unavailable; old dose history unchanged. `a9010959`/`c48b92aa` add selected-blend route regression fixture; no production writes.
- This is CODED, **new CI/screenshots and physical retest NOT VERIFIED**. The current injection-level display is inside selected compound's Dose history, not yet a full replacement of all historical detail screens. More holistic Trends IA to be revisited after tests, without altering accepted parent layouts.
- ONE NEXT ACTION: inspect latest nested/browser/mobile CI and actual selected-blend screenshots; fix regressions. Verify validation warning stays in modal, no Claude copy anywhere in source. Preserve PR #123 draft, production untouched, no merge/deploy. Global polish last.


## 2026-10-28 — Explicit assistant/user action ownership in every Nexus update (APPROVED)
- Every progress, QA, design and release response must clearly distinguish **What I'm doing / What I'll do next (assistant-owned)** from **What I need you to do (user-owned)**. Never phrase an assistant's next task as if the user must initiate it; if no user action is needed, explicitly state **Nothing needed from you right now**. Use **Decision needed from you** only when approval or a choice is genuinely required. Label planned, coded, tested, verified, and deployed distinctly.
- For release gating, assistant owns GitHub checks, code, artifacts and automated browser testing; user owns physical iPhone hands-on acceptance and explicit approval to merge/deploy. Don't request repeated confirmations or imply background execution without automation.


## 2026-10-28 — User REJECTED inline blend injection ledger design; replacement PREVIEW REQUIRED
- Physical iPhone screenshots reject `Blend ingredients by recorded injection` as long repeated text on the selected compound Trends parent page. Also reject small Dose history heading and repeated 'unavailable' message under each injection; information belongs in dedicated `Explore dose records` child detail, with a scannable chart, date/range exploration, selected injection and ingredient contribution details. Parent selected compound should have a concise preview/summary and prominent link, not another 80-row ledger. Treat old inline approach as superseded; preview new child screen before redesign implementation approval, preserve accepted parent layouts otherwise.
- Current source `assets/js/09-nexus.js` 168-190 requires `dose.allocations[]` linking to a specific `kit.vials[].composition`; `kit.composition` displayed correctly in Stash is a CURRENT RECIPE, not proof of original composition for every historical vial. Source `assets/js/09-nexus.js` history does not currently backfill older records. Do not silently infer retroactive per-injection totals or rewrite history. Investigate historical dose/kit links and offer an explicit user-confirmed vial/period recipe attribution workflow with evidence and previews; show one summarized provenance warning rather than repeating unknown per row. No data migration approved.
- New UX proposal status PROPOSED/NOT IMPLEMENTED. No merge/deploy. NEXT ASSISTANT ACTION: create interactive child-screen proposal and inspect matching storage/mapping code, then implement only after approval. USER ACTION: review/approve proposed layout and any retrospective attribution separately.


## 2026-10-28 — User-approved chart-first blend explorer + opt-in historical reconciliation
- User APPROVED replacing the rejected inline 80-row ingredient ledger with a dedicated chart-first `Explore dose records` detail surface: period filters, recorded dose trend, selectable dated injection, and ingredient breakdown in selected detail. Parent compound history must remain compact; user requested a narrative from older blend records, including ordinary kit later marked as premixed blend.
- Code: `b63497ca` adds per-dose attribution resolver and explicit date-scoped historical recipe review/confirmation saved as `kit.blendHistoryAttributions[]` only after user approval; original dose events/allocations and physical inventory are not mutated. `f80f9e54` removes huge parent ledger and adds chart-first selected-injection explorer with a reconciliation entry. `d768390b` fixes date-range inclusivity and permits a previously allocated single legacy vial to use a confirmed recipe where physical vial snapshot absent. Saved-vial snapshot still takes precedence. Histories with ambiguous multi-vial attribution remain unknown; inferred values labelled **user-confirmed**, not laboratory-verified.
- Test `bc7deed1` updates nested suite to check compact parent, chart-first modal, selected injection ingredient values, 320/390 light/dark, and no overflow. **New post-change CI and physical Safari not yet verified**. Future regression needed for historical attribution confirmation, cancel, non-overlap, linked/unlinked legacy doses, and persistence; no destructive migration authorized.
- Existing production main untouched, PR #123 stays draft, no merge/deploy. Exact-source LIVE/DEMO artifacts and physical iPhone acceptance for this change INCOMPLETE.
- ONE NEXT ACTION (ASSISTANT): verify new CI, inspect chart-first screenshots and add isolated reconciliation regression; remediate failures. USER ACTION: nothing now; preview acceptance and historical confirmation will be requested when candidate passes.


## 2026-10-28 — APPROVED: chart-first blend dose explorer and historical reconciliation
- User explicitly APPROVES chart-first Explore Dose Records child view, selected-injection ingredient breakdown, compact parent compound card, and historical blend reconciliation. This supersedes repeated inline injection list. Maintain one physical injection as one dose; ingredient contributions are derived components, not extra administrations.
- Support legacy ordinary-compound kits converted later into blends via Stash. Reconciliation must map historical doses to actual kit/vial/date ranges, preserve original ledger and amounts, show evidence/confidence, request user confirmation for ambiguous composition/period, and keep an audit trail; never silently apply current recipe retroactively. Permit correction/reversal without destructive overwrite, avoid double-counting in Trends, and distinguish measured/recorded vs estimated. Protect localStorage and backups. Approved direction is not blanket permission to overwrite historical records.
- User explicitly wants a narrative over time: chart total blend doses and ingredient contributions, with filters and an inspectable injection detail; provenance warnings concise and contextual. Keep PR #123 draft and production unchanged until separate merge/deploy approval.


## 2026-10-28 — Physical iPhone UX feedback: redesign SECOND ITERATION (user direction, preview pending)
- User rejects horizontal date-pill scrolling within Explore Dose Records as clunky. Prefer a chronological date list / date rows, tap a date to drill into that injection's estimated constituent amounts (one additional tap acceptable); keep chart and date navigation legible without a horizontally scrolling selection rail. Review before shipping.
- User wants constituent compound names (GHK-Cu/KPV/TB-500/BPC-157 etc.) navigable to Intel and an aggregated compound history view that includes contributions from blends, explicitly labeled 'from KLOW/Deadpool'; distinguish independently administered doses from derivative ingredient contributions to prevent double counting. Current separate Blend composition & history at bottom of Trends is considered redundant/unhelpful; move to relevant compound/detail flows or remove in proposed design.
- Navigation defects reported on physical Safari: selecting a compound scrolls into middle/down instead of starting at top; leaving/reopening Trends or refreshing retains last `_nxHistorySelected` instead of resetting to Trends home. Source `assets/js/12-nexus.js` uses `renderBody()` then `#nx-compound-library?.scrollIntoView()` which is absent on selected screen; fix navigation ownership and reset selected route on new Trends tab entry, while preserving temporary in-flow back behaviour.
- Design-system issues: `Explore symptom records & compare periods` uses a forward arrow, inconsistent text size/hierarchy with related accordion rows and standardized chevrons; historical-attribution review buttons are neutral/blue rather than aligned with DS2 button roles. Correct by semantic roles; no unrelated global polish.
- User wants reconciliation accessed as one 'Review full historical records' entry point, auto-detect dated candidate records and preview summary/ambiguities; avoid requiring manual date-from/date-to as default. Require explicit confirmation per plausible historical formulation/period, and preserve auditable reversal. Never automatically rewrite all 41 historic doses from today's recipe.
- Status: UX DIRECTION CAPTURED, NEW SCREEN DESIGN PROPOSAL NOT YET ACCEPTED/IMPLEMENTED. Do not undo currently functioning features until replacement preview accepted. Maintain PR #123 draft, production unchanged.


## 2026-10-28 — APPROVED: compound drill-down navigation with distinct Intel action
- Approved flow: **Trends → Compound History → Select compound → Explore Dose Records → Tap dated injection row → Injection Details → Tap ingredient → Ingredient Compound History**, where **Intel** is a separate clearly labelled action from that compound-history screen (not an automatic substitution for history). Support direct doses and labelled derived contributions “From KLOW/Deadpool” without duplicate administered events.
- Child screens start scrolled to top, use clear Back destination; entering Trends fresh or after refresh starts at Trends home, not last selected compound. No horizontal date-pill carousel. Blend history reconciles through a single whole-history review entry point, with user confirmation for ambiguous historical provenance; original records never overwritten.
- This approval is for navigation and information architecture, not permission to merge/deploy or destructively migrate saved data. Preserve accepted other layouts and current functionality; implementation and real-iPhone verification pending. Global polish remains scheduled last.


## 2026-10-28 — Trends navigation consistency (IMPLEMENTED ON DRAFT; pending iPhone acceptance)
- Adopt one local Trends navigation grammar: right-aligned 18px outline chevron means moving into a destination/detail; left-aligned outline back chevron means returning; icons and labels are vertically centred on at least 48px targets. Do not use alternating text glyphs (`›`, `→`, `‹`) for equivalent drill-down actions.
- Ingredient History has two separate full-width secondary actions, ordered Back to injection/compounds and Compound Intel, rather than a half-width text Back competing with a prominent purple CTA. Remove duplicate links to the same ingredient history from a compound card. Based on user's physical iPhone screenshots and request for consistent alignment, pending retest; global design-system polish remains last and accepted Calendar/Plans/Supplies are unchanged.


## 2026-10-28 — APPROVED: Compact Intel replaces full-width Ingredient History actions
- User explicitly selected **Compact Intel** instead of full-width footer buttons, then reviewed the updated Cloudflare draft on physical iPhone and responded “perfect looks good”. **Approved design**: Back to injection/compounds as subtle, left-aligned text navigation with left chevron; Compound Intel as a compact outlined right-aligned action with right chevron in the same horizontal row. Preserve at least 44px touch targets and clear baseline/spacing at 320 and 390px, both themes. Two equally sized summary cards; preserve source and history navigation. This **supersedes** the 2026-10-28 earlier full-width stacked Back and Intel footer decision in this file (retain old entry as historical).
- Current draft SHA `50eb4faa`; compact layout regression succeeded in #40770526500. Approval applies to this visual design only and does not authorise PR merge, production deployment, data migration or wholesale design revisions.

## 2026-10-28 — Historical composition and reporting safeguard
- **Status:** existing user-approved preservation principle; targeted engineering correction CODED, QA pending.
- Ingredient History must derive contributions from saved vial composition snapshots or uniquely user-confirmed date-bounded historical recipes, not filter older dose records through today's kit ingredient list. Report user-confirmed provenance without pretending independent verification. No destructive retrospective edits, attribution auto-confirmation, dose-event rewrites or physical stock migration. Commits `21ac2094`, `3ca0f351` on draft PR #123; release approval NOT granted.

## 2026-10-28 — Mandatory explicit next action and user action in every Nexus response
- **User-directed non-negotiable communication rule:** Every Nexus development response, including Session Brief, milestone/progress update, answer to a product/design request, and Session Completion Report, must explicitly state **WHAT I WILL DO NEXT** with specific work/actions, and **WHAT I NEED FROM YOU** with an exact requested action and reason. When no user action is needed, say exactly **Nothing needed right now.** Do not bury either requirement in narrative or omit them because the answer is brief. Never imply background work or deployment approval. Include these headings in future chat handoffs and response templates.

## 2026-10-28 — What's New publication gate and history accuracy
- User requested reliable release-triggered What's New and thorough chronological update history. Only the generated `NEXUS_RELEASE` publication status may trigger an automatic announcement; draft/unverified code remains silent. Manual App Updates reading never acknowledges a release or writes main saved state. `Later` defers to a future session; `Got it` acknowledges that version independently. Historical `CHANGELOG` entries without verified publication metadata are explicitly labelled **Earlier update notes**, never misrepresented as independently verified production releases. Pending: migrate authoritative historical releases into the manifest once exact publication provenance is verified, not invented. No production merge/deploy without approval.

## 2026-10-28 — Published release history archive is canonical
- Use `release/published-history.json` for independently verified older published releases, compiled into runtime and in-app generated notes by `tools/generate-release-notes.mjs`. Include documented version, date, actual source commit, verification evidence, user-facing changes and data impact; never infer draft/merged-only candidate was published. Keep earlier `CHANGELOG` notes visible but label as older notes with no independently verified publication provenance. The current release must be `published` in canonical `release/release.json` (with deployment evidence) to trigger a notice. Preserve old localStorage and never silently acknowledge based on reading history.

## 2026-10-28 — What's New historic presentation and Store-launch proposal
- User feedback after 8/8 real iPhone preview checks: unify legacy emoji and new plain note rows; standardize public semantic versions; clarify why automatic popup does not display for unpublished preview. Implemented draft preference: icon-free text hierarchy for all What's New entries; verified publications display canonical v0.x.y-beta, earlier raw CHANGELOG numeric indices labelled Update #N in a collapsed Earlier development notes archive, explicitly NOT certified public app versions. App Updates explains published first-launch and Later/Got it rules. Preserve historic source records; no deletion. **Proposed for App Store (not approved):** keep internal history in repository but present a curated public release history/onboarding notes in the consumer build, not dozens of pre-store beta development entries. Do not destructively delete notes without separate user approval.

## 2026-10-28 — What's New visual acceptance and release-update requirement
- User accepted the new icon-free, consistently versioned What's New history on a physical iPhone. Treat **visual presentation approved**, not approval to merge, deploy, remove early history, or evidence that automatic popup was seen. A draft `unverified` manifest correctly prevents automatic popup. Existing fictional isolated browser QA covers simulated published release.
- Durable release discipline: each user-facing production deployment must have a curated and synchronized canonical manifest and verified publishing follow-up. The current generator synchronizes notes **only after manifest content is supplied**; it is not an autonomous release-changelog writer. Full procedure at `docs/product/WHATS_NEW_RELEASE_PROCESS.md`. App Store public-history curation remains proposed; do not delete archived beta notes without separate decision.

## 2026-10-28 — Strict stale-release-note CI gate, no automatic false publishing
- Approve principle of enforceable release-note readiness without fabricating human-authored release notes. Draft PR checks may warn on unchanged release version/notes, whereas release/main CI fails if user-facing application files change with no new version and notes; checks are against previous Git source, not a calendar timer. Maintain publication `unverified` until separately approved and independently verified live deployment. Script `tools/check-release-readiness.mjs`, wired to `.github/workflows/nexus-release-validation.yml`. This is an engineering safeguard, not proof that Cloudflare could not deploy a failing build or that changelog covers every feature; human review and host parity remain gates. User-approved Calendar/Plans/Supplies/What's New designs unaffected.
