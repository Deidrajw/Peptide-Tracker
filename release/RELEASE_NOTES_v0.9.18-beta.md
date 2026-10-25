# Nexus v0.9.18-beta — Release Candidate Notes

**Status:** IMPLEMENTED ON PR #94 / NOT YET MERGED OR DEPLOYED. Canonical version: `release/release.json`. Publication status: `unverified`.

## Product experience
- Settings: Privacy & Data screen, matching shield outline icon, accessible detail navigation and 44px back target.
- Reduced motion and visible keyboard focus for controls. Calculator input labels and larger back navigation.
- Existing first-run onboarding, Getting Started action cards, shared chevrons, card headers, five-tab navigation and keyboard/safe-area handling preserved.

## Trust and reliability
- Backup & Restore: import is now a deliberate file-review workflow displaying record counts; replacing saved records requires typing RESTORE, creates a dated local recovery snapshot before replacement and attempts rollback when writing fails. Import Cancel has no storage changes. Export remains available.
- Dose Alerts: permission and lack of closed-app/background notifications now explained before enabling; notification behavior unchanged.
- Calculator: removes unqualified IU-to-mg conversion, rejects invalid/nonfinite/negative/missing measurements, dose larger than vial amount, smaller-than-readable U-100 draws and syringe capacity overflows. Corrects invariant U-100 marks across 30/50/100-unit syringes; numeric results are conversion estimates, not clinical instruction.

## Release infrastructure
- The release manifest, generated in-app What's New metadata, Apple/Google notes and HTML title are synchronized to v0.9.18-beta.
- Browser test scripts and CI derive the version from the manifest instead of hardcoding prior beta filenames.
- Publish-gated, per-version What's New behavior is retained; no popup should announce a version while the publication manifest is unverified.
- GitHub Actions generates full LIVE ZIP and complete in-memory fictional DEMO HTML and offline DEMO ZIP from the same source. Independent source checks and browser suites are release gates.

## Data impact
**No automatic migration.** Existing Check-In, Stash, supplements, protocols, schedules and history are not changed by this upgrade. A user-initiated backup import is explicitly destructive **only after** typed confirmation, with attempted browser recovery-copy/rollback protection. The normal storage key remains `peptide-tracker-html-v1`.

## Tests and unresolved limitations
- Test suite target: 320/390px × light/dark × LIVE/full DEMO plus mobile-form, Check-In, Protocol, Vial, Stash, Combo, Dose, Plans, chevron and independent calculation audits.
- At candidate authoring time: full latest-head workflow, physical iPhone, VoiceOver, Cloudflare commit/asset parity and final publication **NOT VERIFIED**. Do not claim release complete while any remains unverified.
- Apple App Review 1.4.2 places additional restrictions on drug dosage calculators. Public privacy policy URL, native iOS/Android wrappers, store declarations, and relevant review/clearance are outstanding. See `docs/store/STORE_READINESS_V0918.md`.

## Primary website
https://nexuspeplog.pages.dev/ — Cloudflare Pages, publication parity must be verified separately from GitHub PR merge.
