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

## Decision and delivery gates
All above are *not yet approved for implementation*. Existing approved UI, saved data and ongoing work remain authoritative. Design previews must be shown before large redesign approval, then implement on a separate branch with the Nexus six mandatory deliverables and tested Cloudflare release parity. Do not confuse proposal/design, branch code, tests, merge and deployment.

**Separate active tracks, not folded into this register:**
- Draft PR #121: paused medical/calculator claims matrix and follow-up inventory.
- PR #118: unmerged divider/light-dark contrast work.
- PR #110 / Issue #109: unmerged legacy blend parity; protect historical records.
- v0.9.20-beta production app: no change from this planning commit.

**Next discovery action:** Choose and prototype a cohesive Nexus Design System 2.0 + Onboarding 2.0 visual direction in fictional, isolated previews, then decide scope/approval. This planning document may be incrementally extended without turning ideas into releases.
