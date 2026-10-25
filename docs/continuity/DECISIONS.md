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
