# Nexus — Unified product, trust and release sweep

Status: AUDIT IN PROGRESS, NOT A RELEASE. Baseline: main merge commit b6737fad61195211f0e2b0025a6074c2de8f3e81 (PR #89, v0.9.17-beta Getting Started visual parity). Branch: audit/unified-experience-trust-release-20261024.

## Source-verified findings
- release/release.json declares v0.9.17-beta but publication.status is unverified, publishedAt and commit null, and source.pullRequest null. Do not mark Cloudflare published from GitHub merge alone.
- tools/build-release.mjs derives VERSION from the manifest, checks generated release notes, checks title/version parity, expects ordered 01–12 JS and three CSS files, and builds a complete standalone demo with fictional fixtures.
- The demo builder overrides localStorage/sessionStorage with in-memory storage, disables fetch/XMLHttpRequest, and labels fictional data. This is code inspection, not a successful browser isolation test.
- docs/continuity/PROJECT_STATE.md, DECISIONS.md, RELEASE_HISTORY.md and REGRESSION.md still describe the v0.9.17 candidate as pending, although PR #89 is merged. Continuity must be reconciled before release claims.
- Calculator PR #67 remains on hold in continuity; no safety acceptance established.
- No physical iPhone, VoiceOver, full 320/390 × light/dark matrix or Cloudflare source parity was verified in this audit.

## Coordinated workstreams and acceptance gates

### A. Product experience — 57-surface inventory
Inventory Today, Calendar, Protocol, Stash, More, all subpages, sheets, editors, onboarding, import/export, and calculators. For each record: screen/entry route, title hierarchy, one consistent chevron/menu system, navigation/back, loading/empty/error states, 44–48px touch targets, safe-area/keyboard, contrast in both themes, and 320/390 screenshots. Retest onboarding Start Fresh / Restore / Guide / Log Dose / Protocol / Stash / Learn. Preserve existing action handlers and history.

### B. Trust, reliability, privacy
Trace actual storage keys and network calls before drafting Privacy & Data claims; distinguish browser-local records from cloud sync and explain clear-browser-data loss. Inventory permissions and request them only in context, with refusal behavior. Backup tests: malformed/oversized input, counts preview, explicit confirmation, existing-data guard, cancel, rollback, unchanged originals, round-trip export. Calculator: dimensioned concentration/dose/unit formulas, mixed-vial cases, zero/negative/NaN/overflow inputs, precision, rounding, insufficient inventory, warning copy, confirmation, and unchanged history. Hold #67 until independent assertions and browser interaction tests pass.

### C. Release infrastructure
Treat release/release.json as canonical version; validate runtime, title, in-app What's New, Apple/Google outputs, and LIVE/DEMO package parity. Publication-gated What's New must remain silent until independently verified Cloudflare release, then display once per published version with Later and acknowledgement semantics. Record deployed commit, HTTP asset checks and cache/version parity; do not change publication.status without evidence. Document privacy/permission/data-handling evidence for Apple/Google submission; do not claim native store readiness until native wrapper and review requirements are checked.

## Release gates (all mandatory)
1. Interactive fictional-data in-chat workflow preview.
2. Exact-source standalone complete DEMO HTML and offline DEMO ZIP, no live data or sync.
3. Complete versioned LIVE ZIP rooted at index.html.
4. Branch PR, automated checks, validated merge and independently verified Cloudflare deployment.
5. Versioned notes with affected screens, data impact, limitations and precise release state.
6. Interactive regression matrix with Pass/Fail/Not Tested and Copy Results.

## Protected regression inventory
Check-In single record/date, edits, mood, notes, symptoms and associations; Supplements searchable multi-select and date-specific history; Log Dose drafts, vial source and multi-vial deductions; Calendar current-month default, numeric weight and day details; Weight, Nutrition, schedules and histories; Protocol, Stash, Goals, Research, Journal; localStorage key peptide-tracker-html-v1 unless code establishes otherwise.

## Current evidence / blockers
PASS (source inspection only): release manifest exists, builder has version checks, isolated DEMO builder logic exists.
NOT TESTED: browser suites, physical iPhone, VoiceOver, data-flow/privacy assertions, calculator math, artifact generation, Cloudflare parity.
BLOCKED: final release signoff pending above tests. No production data changes or destructive migration authorized.

## ONE NEXT ACTION
Inventory current main's UI surfaces, privacy/storage/network entry points and calculator code, and write a traceable 57-surface issue matrix with exact file/function references; then implement prioritized fixes on a separate release branch and execute the eight-mode browser suite before merge.
