# Nexus — Future Discovery & UX Inspiration Register
**Captured:** 2026-10-25 · **Status:** IDEAS / DISCOVERY ONLY. Not approved code, subscriptions, medical advice, release or deployment.
**Baseline:** v0.9.20-beta, GitHub main c1c95e1. Preserve all saved records and approved functionality.
**Purpose:** Capture the ideas discussed across the competitor screenshot, onboarding, visual design, business model, and platform research sessions in one durable backlog. Feature proposals need discovery, approval, design preview, source review, tests and separate release before implementation.

## A. Onboarding, identity and trust
- [ ] Privacy-first onboarding: visible Terms, Privacy Policy, medical-use/calculator limitations, deliberate accept-and-continue; production acknowledgement must not be bypassable by normal navigation; isolated DEMO/QA may bypass with clear fixtures. Do not mistake a disclaimer for clinical or regulatory clearance.
- [ ] Keep existing local-first Start Fresh / validated Restore Backup workflow; prevent overwriting existing records and explain localStorage/no automatic sync.
- [ ] Introductory login/create-account screen when real auth infrastructure is available; allow local-only use, no mandatory account until product decision.
- [ ] User journey stage: exploring, preparing, already tracking, or other; optional and editable.
- [ ] Personalization preferences and tracking goals, optional sensitive demographics only when necessary with clear rationale.
- [ ] Account connection introduction: Sign in with Apple/Google distinct from Apple Health/Health Connect permission.
- [ ] Guided animated contextual tutorial (spotlights, Back/Next/Skip, accessible focus, replay from Help); feature-specific tours and short inline explanations.
- [ ] More polished onboarding progress, welcoming visual identity, consistent icon family and success/confirmation states.
- [ ] Publish-gated What's New, release notes and clear version/consent provenance; preserve existing changelog/acknowledgment records.

## B. Design system 2.0 and interaction polish
- [ ] Soft atmospheric violet gradient background in dark mode; pearl/ivory equivalent in light; restrained, accessible contrast.
- [ ] Soft Depth surfaces: subtle elevation/shadows and satin/gradient primary buttons, deliberate primary/secondary/tertiary hierarchy and press/disabled/focus/error states.
- [ ] Consistent rounded shapes, large-radius cards, pill-like navigation or selection, outline SVG icon stroke/optical alignment, appropriate 44–48px touch targets.
- [ ] Explore floating pill bottom navigation while preserving Today, Calendar, Protocol, Stash, More, safe-area, keyboard and narrow-screen behavior.
- [ ] Intentional animation system: sheet transitions, tab selection glide, accordion reveal, press feedback, save confirmation, appropriate haptics in native shells; respect Reduce Motion and avoid layout shifts.
- [ ] Avoid glass-everywhere, nested borders, excessive dividers, large shadows, over-animation and contrast regressions. Prototype Today, Stash, Log Dose, onboarding in 320/390 light/dark before adoption.
- [ ] Clear empty/loading/error/success/undo states, keyboard-aware focus/scroll, sticky actions, smooth non-destructive transitions.
- [ ] Use searchable modal/bottom-sheet selectors for extensive compound, kit, vial and symptom pickers; preserve simple segmented controls for few choices.
- [ ] Action sheets with frequent actions first, advanced management below and clearly separated destructive actions.

## C. Compound, kit, administration, tracking
- [ ] Searchable compound library with favourites/recent/category filtering, contextual Intel, provenance and uncertainty for half-life/research status.
- [ ] Separate product **form factor** (vial, pen, liquid, nasal spray, tablet/capsule, topical) from **administration route** (SubQ, IM, IV, oral, nasal, topical) and units; do not automatically assert any route is suitable/safe.
- [ ] Shared regular/premixed blend forms and consistent Log Dose UI: amount/date/time/site/observations/source, with inline blend composition; protect legacy kLOW/history and exact vial accounting.
- [ ] Kit essential fields vs collapsed optional advanced details: vendor/source, total price, batch/lot, purchase/acquired date, notes, kit provenance.
- [ ] COA / testing-document attachment vault (PDF/photo, lab, tested date, lot) linked to kits with security/backup constraints; attachment is not proof of authenticity or safety.
- [ ] Contextual protocol and additional kit information without leaving kit workflow.
- [ ] Simple schedule builder daily / specified weekdays / intervals, multiple times, variable phases, optional end date and clear advanced controls.
- [ ] Multi-format educational/measurement math tool modes: reconstituted vial, liquid, pen, nasal, tablet; separate explicit acknowledgment; no clinical approval from disclaimer. Gate each mode on validated units, bounds, dimensional invariance and policy requirements.
- [ ] Streamlined allocation disclosure, source choices, history filtering/pagination and reversible inventory operations; preserve draft, undo, prepared doses, multi-vial deduction and no double-count.
- [ ] Templates for recurring Check-Ins, dose-entry preferences and protocol configurations; never silently reuse dose data.

## D. Dashboard, insights, personalization
- [ ] Customizable home cards, rearrange/hide/pin modules, personalized quick actions while leaving all core tabs discoverable.
- [ ] Customizable navigation shortcuts (without removing core destinations); global search / command palette for compounds, kits, records, screens.
- [ ] Cohesive metrics hub: weight, body measurements, symptoms, mood, energy, nutrition and optionally imported sleep/activity, with exact source and time windows.
- [ ] Date/compound/route/symptom/source advanced history filters, saved views and quick jump into Trends details.
- [ ] Contextual quick-log menu, drafts/continue-where-left-off, meaningful recent activity and smart first-use empty states.
- [ ] Reports centre: downloadable/printable configurable summaries/CSV/PDF and clinician-share exports; basic data export never paywalled.
- [ ] Visual and descriptive patterns only, clear missingness/uncertainty, never inferred clinical outcomes or automatic dosing advice.

## E. Native platform, integrations and reliability
- [ ] Local-first offline use plus optional encrypted cloud backup/sync across devices, with identity, conflict handling, duplication prevention, schema migrations, key management, deletion and recovery.
- [ ] Apple/Google account sign-in optional; Apple Health and Android Health Connect separately permissioned with source labels, selective import and deduplication.
- [ ] Configurable notifications: schedules, inventory/reorder, expiry, incomplete tracking, quiet hours, lock-screen privacy, snooze/undo. Never imply an administered dose from a reminder.
- [ ] Barcode/QR/vial label scanning with *reviewable suggestions*, explicit user confirmation and no assumed product authenticity.
- [ ] Home/Lock Screen widgets, Apple Shortcuts, Apple Watch, Wear OS and Android native quick actions, only when native platform capability is ready.
- [ ] Accessibility: Dynamic Type, VoiceOver/TalkBack, keyboard navigation, 44px targets, AA text contrast, colour independent statuses and reduced motion.
- [ ] Internationalization: languages, regional date/units, time-zone changes without shifting historical local dates or duplicating schedules.
- [ ] Secure account/device management, export/import integrity, undo/recovery, migrations, offline-first reliability, crash/rollback and telemetry with privacy-first consent.
- [ ] Optional expiring read-only healthcare-professional report links with fine-grained sharing/revocation (not a clinician portal by default).

## F. Business strategy and research
- [ ] Free vs Pro monetization discovery: tier boundary, willingness to pay, cloud/infrastructure costs, trials, billing grace/cancellation/refunds, entitlement restore, stores' rules and churn.
- [ ] Protect core logging, previously saved records, data export, safety information and correct math from arbitrary paywalls.
- [ ] Nexus AI assistant future discovery: grounded read-only queries over personal records, explain charts and time windows, find entries, summarize observations, draft categorization/duplicates for human approval; explicit data permissions, hallucination controls, private model processing and cost/budget. No autonomous prescription/dose escalation or silent record mutation.
- [ ] Product discovery interviews, privacy-respecting usability analytics, support/feedback intake, transparent roadmap and feature prioritization.
- [ ] App Store/Play operations: onboarding, listings, screenshot assets, accessibility, review policies, medical/calculator claims, privacy/data safety disclosures, phased release, support, rollback, store updates.
- [ ] Competitor references for **patterns only**, not direct copying: Pep AI, Medisafe, MyTherapy, Bearable, Gentler Streak and other peptide trackers; benchmark objectively and validate current feature sets before claims.
- [ ] Explicitly defer social community, compound marketplace, unsupported AI body scanning, excessive gamification until strong user need and risk review.

## G. Explicit feature checklist — iOS & Android research follow-up (2026-10-25)
This table makes the named research ideas individually searchable rather than only implicit in broader paragraphs. **Candidate tier is a hypothesis**, not a pricing decision. Essential data access/export and basic accuracy/safety must remain available without Pro.

| Idea | Existing register coverage | Candidate tier / decision |
|---|---|---|
| Apple Health + Android Health Connect | Section E; optional, granular-permission import, dedupe and source attribution | Free integration baseline; advanced cross-source analytics might be Pro |
| Optional Apple/Google account and encrypted Cloud Sync | Sections A/E | Investigate operational cost and a free backup baseline; Pro expanded sync/storage TBD |
| Android widgets + native shortcuts / quick tiles | Section E (previously grouped under native quick actions) | Investigate free basics vs configurable Pro widgets |
| Custom iPhone Home/Lock Screen widgets + Apple Shortcuts | Section E (previously grouped) | Free glanceable defaults; Pro advanced widget layouts TBD |
| Reusable templates | Section C | Free essentials; sophisticated reusable workflows a possible Pro benefit |
| Password vault / app lock | **New explicit discovery** | Evaluate *app-specific biometric/PIN lock and sensitive attachment protection first*. Do **not** store users' unrelated website passwords or call Nexus a general password manager without dedicated security design/audit |
| Advanced secure photo / document vault | Section C COA attachment vault, **expanded here** | Encrypted images/PDFs, camera imports, optional biometric unlock, attachment removal, backup/restoration, retention and storage quotas; free basic document access, Pro capacity TBD |
| Smart empty states | Sections B/D | Free core usability feature; not premium |
| Customizable dashboard / cards | Section D | Basic personalization free; advanced multi-layout dashboards possible Pro |
| Quick Actions / contextual quick-log | Section D | Free fast primary actions; premium automation uncertain |
| Global search / command palette | Section D | Core navigation should be free; advanced saved views potentially Pro |
| Personal reports and CSV/PDF | Section D | Basic export always free; custom layouts/automated reports possible Pro |
| Intelligent reminders / notifications | Section E | Free core reminders; customization and advanced automation potential Pro |
| Barcode / QR label scan | Section E | Reviewable inputs only; tier TBD |
| Guided tours / contextual Help | Sections A/B | Free onboarding/accessibility; not premium |
| Advanced multi-format calculator | Section C | No paywall for mathematical correctness, disclaimers, or safety; implementation independently gated |
| Nexus AI | Section F | Free trial/limited usage vs Pro allowances are *ideas*, pending privacy, model cost and safety |
| App Store lifecycle, subscriptions, pricing, billing | Section F | Research, not implemented |

### Proposed premium packaging research (not approved)
- **Free/core:** onboarding and disclaimers, records and editing, essential reminders, core tracking/history, correct available calculator features, essential local backups and export, accessibility and data security.
- **Potential Pro convenience:** deeper configurable analytics, multi-workspace dashboards, advanced report templates/scheduling, expanded encrypted attachments and sync history, advanced widgets, extra automation, optional higher AI usage.
- **Evaluate before deciding:** infrastructure costs, storage quotas and offline support, fair downgrade/grace behavior, Play/App Store subscription rules, user willingness to pay, consent and privacy. No data hostage behavior.

## H. Distinct visual inspiration and UI pattern library
**This is a different backlog from feature delivery.** Inspiration describes presentation/interactions, not an agreement to adopt another app's implementation, aesthetic, or claims.

| Reference / concept | UI idea to examine | Nexus design evaluation |
|---|---|---|
| Apple iOS / Liquid Glass examples | Familiar tab shell, depth/translucency, navigation layering | Safe areas, contrast, keyboard/Reduce Motion and performance |
| Android Material 3 / Material 3 Expressive | Adaptive shapes, navigation bars, selected states, typography/motion | Consistent Android behavior rather than an exact iPhone clone |
| User screenshots of peptide apps | Rounded pill bottom tabs, soft cards, icon geometry, spacious onboarding | Original Nexus styling, not copying screenshots or brand assets |
| Competitor guided tour | Spotlight/coachmark overlays, animated step transitions, replay | Real focus management, Back/Next/Skip and screen-reader support |
| Competitor searchable modal selection | Search, recents/favourites, selection checkmark, dismiss gestures | Keyboard-safe scroll, preserved drafts, 320px fit |
| Competitor kit/add forms | Essential details first; accordion for pricing, batch, COAs | Progressive disclosure and separate kit-vs-vial metadata |
| Pep AI calculator acknowledgment | A clear 'measurement math, not medical advice' explanation | Keep a separate safety validation gate; acknowledgment does not prove safe math |
| Gentler Streak wellness examples | Gentle visual storytelling and progress hierarchy | No misleading claims or ungrounded causal inference |
| Bearable and Medisafe examples | Daily logging patterns, reminder states, legible history | Compare interactions without inventing current competitor capabilities |
| Nexus original proposed Soft Depth | Midnight violet, pearl/ivory light mode, atmospheric gradient, satin primary, raised secondary | Contrast and battery/performance evidence before code |
| Nexus original rounded control system | Consistent 44–48px targets, outline icon family, subtle haptics/motion | All five tabs, modal consistency, reduced-motion fallback |

**Research references:** Apple Human Interface Guidelines (developer.apple.com/design/human-interface-guidelines/), Android Design (developer.android.com/design), user-provided screenshots, and prior in-chat competitive design notes. These are design *sources and ideas*, not a verified October 2026 feature-by-feature competitor audit.

### Suggested research artifact structure
- Keep **this file** as master candidate features and business-tier hypotheses.
- Future `docs/design/VISUAL_INSPIRATION.md`: original moodboard references, annotated patterns, platform differences and approved design tokens once visual direction is signed off.
- Future `docs/product/MONETIZATION_DISCOVERY.md`: tier economics, entitlement rules, cancellation/downgrade and AI/token/storage costs once monetization research begins.
- Do not mix sketches, discovery hypotheses or competitive examples with actual deployed features.

## Decision and delivery gates
All above are *not yet approved for implementation*. Existing approved UI, saved data and ongoing work remain authoritative. Design previews must be shown before large redesign approval, then implement on a separate branch with the Nexus six mandatory deliverables and tested Cloudflare release parity. Do not confuse proposal/design, branch code, tests, merge and deployment.

**Separate active tracks, not folded into this register:**
- Draft PR #121: paused medical/calculator claims matrix and follow-up inventory.
- PR #118: unmerged divider/light-dark contrast work.
- PR #110 / Issue #109: unmerged legacy blend parity; protect historical records.
- v0.9.20-beta production app: no change from this planning commit.

**Next discovery action:** Choose and prototype a cohesive Nexus Design System 2.0 + Onboarding 2.0 visual direction in fictional, isolated previews, then decide scope/approval. This planning document may be incrementally extended without turning ideas into releases.
