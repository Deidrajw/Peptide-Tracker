# Nexus v0.9.18-beta — Final published build host parity gate

**Observed application source:** PR #97 merged to main at `3625462a04c1eb124e350f6989b57019e3256380`.
**Release:** `v0.9.18-beta`, manifest publication `published`, verified predecessor source `623025665c549dadbe3fb467b6d556f5d44e7e34`.
**Host:** https://nexuspeplog.pages.dev/
**Status at authoring:** Awaiting an independent remote byte parity check **after** the publication metadata is merged.

## Required evidence
- Fetch live root `index.html`, 3 CSS and 12 JS from primary Cloudflare with cache-busting query; compare SHA-256 to current merged GitHub source.
- Store `Nexus_CLOUDFLARE_PARITY.json` from Github Actions and report only `verified:true` with `file_count:16` as PASS.
- Verify `assets/js/02-nexus.js` now contains `NEXUS_RELEASE.publicationStatus:'published'`, while the per-version What's New Later/Got it behavior passes CI. Do not infer from the title alone.
- Preserve root-index LIVE/full fictitious DEMO packages and all saved browser records. No migrations or source changes on this verification branch.
- Continue to label real iPhone, VoiceOver, comprehensive manual visual QA and native App Store/Play Store clearance as NOT TESTED or INCOMPLETE.

A PR build on this docs-only branch uses the same published app bytes as main, so its independent Cloudflare comparison can establish production parity without changing the production application. The CI comparison step is nonblocking on PRs; check its JSON contents rather than treating green workflow status as proof.
