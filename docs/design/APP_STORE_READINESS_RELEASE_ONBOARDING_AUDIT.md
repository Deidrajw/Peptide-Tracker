# Nexus — App Store readiness, onboarding and release identity audit
Date: 2026-10-24 Toronto / GitHub baseline: main 7624c4d3541e701faaed7f4e6eb8410272aa0c45
Status: AUDIT + DESIGN PROPOSAL; only neutral avatar fallback is implemented on this branch. This is NOT an app-store release, validated privacy disclosure, or completed full page visual QA.

## Verified source findings
1. Release identity collision: root `index.html` title is `Nexus · v0.9.15-beta`; `assets/js/01-nexus.js` CURRENT_CHANGELOG_VERSION=70, while `assets/js/02-nexus.js` CHANGELOG begins with version 89. `assets/js/11-nexus.js` computes `hasUnseenUpdate` using separate counter; `assets/js/12-nexus.js` renders historical What's New and marks latest seen when tab opened. Neither one machine-readable shared release record nor automatic once-per-actual-published-version popup is established by this code.
2. Onboarding exists, `showOnboarding()` in 12-nexus.js, steps Welcome → Goal → Stats → Done; features are briefly described and feature suggestions given at end. No explicit first-screen choice Start fresh / Restore backup; no clear browser-local storage limits on the welcome step. `getOnboardingChecklist()` exists in 10-nexus.js.
3. Browser persisted records: `STORE_KEY = "peptide-tracker-html-v1"` in 01-nexus.js, with pre-upgrade backup key and export/import flow. The `importData()` handler in 11-nexus.js calls `state=migrate(p);saveState()` immediately after basic `p.peptides` check. Before any first-run import option is exposed, introduce schema validation, preview, confirmation of replacement, rollback and backup guarantee. Never destroy existing storage on ambiguous import.
4. Profile fallback currently renders initial letter both in shell (11-nexus.js) and profile editor (10-nexus.js), including on avatar removal. Candidate changes in this branch replace with neutral SVG; uploaded photos remain intact.
5. Privacy: client-local persistence observed; notification permission and optional `nexusApiKey` settings appear in source, as do externally loaded Google fonts. DO NOT claim 'nothing ever leaves the device' or 'no collection' without exhaustive network and SDK audit. Need inventories for any AI/API requests, backups, diagnostics, permissions, linked domains, and future native wrappers. Confirm before drafting final privacy statements.
6. Root is static HTML, ordered `assets/js/01-nexus.js` through `12-nexus.js`, CSS including disclosures/contrast, icons. This is a web app/PWA-style package, not verified ready for native App Store / Play submissions.

## Target release manifest — one source of truth (PROPOSAL)
- Store a checked-in `release/release.json` per released build with `version` (e.g. NEXT VERSION ONLY after approval), `build`, `releasedAt` (ISO; supplied only at actual release), `sourceCommit`, `channel`, `isPublished`, `headline`, `changes` (short title, plain-language impact, screen, change type), `dataImpact`, `knownLimitations`, `privacyChanged`, `permissionsChanged`, `appleNotes`, `googleNotes`.
- Generate root display metadata, in-app What's New, Apple App Store What's New, and Google Play release notes from the SAME version/release source in CI. Keep prior changelog history read-only and build a migration/compatibility mapping rather than rewriting 70/89 counters blindly.
- Release validation must fail for mismatched display version, changelog, publish commit, missing text length policies, unauthorized changes, and live/demo artifact mismatch. Don't mark a draft published before deployment evidence.
- Show modal only on first launch of verified newer `published` version, stored as additive per-device `lastSeenReleaseVersion`; offer 'Later' and 'See all changes'. Never trigger on every render, never obscure import/first-run onboarding; unseen badge until acknowledged. Release notes should describe real shipped code only.

## Onboarding target (PROPOSAL, preserve current journey until approved)
1. Welcome — what Nexus does (Today, Calendar, Protocol, Stash, Journal/Plans); explain private, browser-based storage precisely including browser clearing/data loss risk. No promises of automatic cloud sync.
2. Choose path — Start fresh OR Import existing Nexus backup. Import pathway validates first, previews record counts/date, and requires explicit overwrite confirmation, preserving an exportable copy of current data.
3. Personalize — optional name, units, initial goals; allow skip without writing synthetic records.
4. Quick tour — 4–5 skippable cards with real feature route and sample-free explanations.
5. Finish — backup reminder and optional permissions. Request notification permission at use-time, with purpose/disable instructions; don't request unrelated platform permissions on launch.
- Provide progress, Back/Skip, VoiceOver labels, contrast and safe area at 320/390 both themes. Existing user with persisted records must NEVER be treated as brand new solely due to a new onboarding flag.

## Privacy / store readiness gate
- Public privacy-policy URL and in-app access; purposes, data categories, local storage, third-party processing (only after verified network audit), retention/deletion and backup responsibilities; store-specific declarations; terms/disclaimer and support contact.
- Apple requires public privacy policy URL and accurate App Privacy submissions; review third-party handling. See https://developer.apple.com/app-store/app-privacy-details/ and https://developer.apple.com/app-store/review/guidelines/.
- Google Play Data safety form/privacy policy required by applicable store policy; verify against current official Google Play Console docs before publishing.
- Notification permission explanation at first opt-in, not launch; photo/file access via user-initiated browser picker; identify actual OS-level permissions only after native wrapper chosen.
- Sensitive medical/wellness data, AI claim review, accessibility test, offline/backup integrity, update continuity, clinical calculation diagnostics, submission packaging and signing all gated.

## Provisional audited scorecard (heuristic — not empirical user study or complete automated visual sweep)
Scale 0–5. Scores are provisional estimates based on verified files and supplied screenshots.
- Visual hierarchy/consistency: 3/5 — improved headers, but recent real-device repeated defects demonstrate inconsistency risk.
- Onboarding/discoverability: 2.5/5 — steps and checklist present, no import-or-start decision or storage explanation.
- Information architecture: 3/5 — full core pages, Journal/Insights recently changed; subpage evaluation incomplete.
- Accessibility/mobile: 2.5/5 — 44px rules and browser matrix exist; no physical VoiceOver/zoom validation.
- Data portability/integrity: 3/5 — local backup and import exist, but immediate import overwrite needs safeguards.
- Privacy/transparency: 1.5/5 — disclosures and network audit incomplete.
- Release/version reliability: 1/5 — three mismatched release identity mechanisms.
- Engineering/test delivery: 3/5 — CI, artifacts, continuity and regression, but published Cloudflare parity & store automation not verified.
- Native store readiness: 1/5 — native wrappers, policies, permission and submission evidence not verified.
Do not use these estimates as a test PASS. Overall: roughly 2.3/5 — functional beta, NOT APP STORE/GOOGLE PLAY RELEASE READY.

## Screens / subpage inventory and audit follow-ups
- Today: scheduling, dose, Check-In, summary, trends; protect single record/date, notes/mood/symptom intensity, dose drafts, sources and vial math. Actual visual exploration pending.
- Calendar: month and week, weight/date details; preserve current-month default and numeric weight. Actual visual exploration pending.
- Protocol: first-class protocols, builder, compound picker, schedule/history, card management; source-level layout reviewed, full hands-on audit pending.
- Stash: regular & blend kits, actions, inventory, vial math/history; source-level renderer reviewed and parity browser tests previously passed; physical audit pending.
- Plans: Goals, Research, Shopping, Goal Activity/Connections; recent header parity code passed prior CI but physical feedback must be verified. Full modal audit pending.
- More/Nexus: Ask, Journal, Learn, Explore and Insights/Check-In Changes; filter and focused comparison recently updated. Actual visual testing pending.
- Profile/Settings: avatar, units, data import/export, What's New, support/notifications; source-identified gaps above.
- Modal ecosystem: all sheets, pickers, history, keyboard focus/scroll, alerts and restoration; full accessibility/visual audit pending.

## Candidate implemented code
Only avatar placeholder SVG and CSS on the isolated branch. No release manifest or onboarding/storage migration implementation yet. Do not merge without CI + source-identical LIVE/full isolated DEMO artifact QA. Version display remains unchanged.

## One next engineering action
Finish testing neutral avatar fallback (profile shell, edit, remove), then implement and test checked-in single release manifest with generated 3-channel notes + launch-only published-version modal in a separate targeted release branch; follow with safe onboarding backup import as a distinct gated workflow.
