# Nexus What's New — production release contract

Status: **DRAFT RELEASE PROCESS — not evidence of a production deployment**. Established 2026-10-28 after real-iPhone visual approval.

## User acceptance and popup expectations
- On the immutable preview `b9cede6b.nexuspeplog.pages.dev`, the user accepted the unified What's New appearance on a physical iPhone: consistent icon-free entries, canonical verified version labels and collapsed earlier numeric development notes. This is a visual acceptance report; the published automatic popup has **not** been physically observed.
- Preview `v0.9.20-beta` intentionally has `release/release.json.publication.status=unverified`. No popup in preview is the **correct result**, not failure.
- Existing app startup logic prompts only when manifest says `published`, onboarding has finished, Demo Mode is off, the version is newer than separately stored acknowledgement, and it was not deferred this session.
- **Later** defers that version for the current session; **Got it** records it as acknowledged. Reading manual App Updates must not acknowledge. Repeated navigation must never trigger the popup.
- Browser QA simulates a fictional published release and tests this lifecycle in isolation. **Physical-device published-notice acceptance is NOT TESTED**, and must not be implied.

## One mandatory release-note workflow for every user-facing production release
1. Prepare a user-facing change summary of actual changes included **in the production release**, with version, title, affected screens, fixes, improvements, data impacts, known limitations and relevant dates. Include all changes since the previous published version; never announce only the first PR in a multi-PR release.
2. Edit the canonical `release/release.json` before release. Do not increment the version for drafts alone or silently label the preview as `published`.
3. Generate/check all synchronized outputs through `tools/generate-release-notes.mjs`: runtime `NEXUS_RELEASE` in `assets/js/02-nexus.js`, `release/generated/in-app.json`, Apple notes and Google notes. The build rejects stale generated files.
4. Review full LIVE/DEMO exact-source packages and automated browser tests; verify protected flows and release notes. Request explicit user approval before an otherwise-prohibited merge or deployment.
5. After approved deployment, independently verify the primary Cloudflare host serves the intended source/assets. **Only then** update release publication metadata (`status: published`, verified commit/time) via an approved follow-up source release and independently verify *that* published metadata deploys. A successful GitHub merge or Cloudflare build alone is not proof of live publication.
6. Append the newly verified release to `release/published-history.json` when it becomes historical. Never overwrite older entries or remove existing personal records. Preserve archived internal notes separately for continuity.
7. Verify the popup in fictional isolated browser QA and, when available, on a real iPhone with a safe test account. A no-popup result in an unpublished preview does not test published-popup rendering.
8. Record the deployment/version, exact assets, test evidence, user acceptance and remaining limitations in `docs/continuity/{PROJECT_STATE,DECISIONS,RELEASE_HISTORY,REGRESSION}.md`.

## Important limitation
The repository currently has a **canonical manifest + synchronization checks**, *not* an automatic system that detects every new production push and writes human-quality release notes on its own. Shipping a changed build without preparing its release manifest can mean the What's New history is stale. Therefore the above manual/CI release gate is mandatory; stronger automation should be implemented and validated separately before claiming completely automatic release-note maintenance.

## App Store policy proposal — not an approved destructive change
Keep the historical beta notes in GitHub for traceability. Public first-release history should be curated to real public releases (possibly starting with 1.0.0); avoid displaying internal `Update #N` entries as app versions in store notes. Preserve the existing web release history unless a separate product decision approves changing its visibility. No data purge.

## Enforced stale-note gate (draft branch PR #123, 2026-10-28)
- `tools/check-release-readiness.mjs --self-test` runs six deterministic positive/negative checks (stale source, meaningful note/version update, docs-only changes, incomplete note, false published claim).
- `--candidate` validates the release record and **warns** if user-visible files have changed without a note/version update; it does not block design-only draft PRs from obtaining previews. It requires a Git diff against the current merge base where available.
- `--production` **fails** if changed `index.html`, `assets/js/*-nexus.js`, `assets/css/*.css` or icons do not have both a new version and changed release notes compared with the Git base. Missing Git diff evidence is a hard failure. Documentation-only updates are allowed without an app version increment.
- `.github/workflows/nexus-release-validation.yml` uses full Git checkout history and invokes this gate for all release build jobs; PRs use candidate mode, pushes to `main` or `release/**` use strict production mode.
- **Boundary:** a GitHub Actions status by itself cannot always prevent a separately configured Cloudflare auto-deployment after a merge. Require branch protections/Cloudflare deployment controls and explicit approval; the strict gate is an auditable release-readiness signal, not independent proof that every production deploy was blocked. It cannot independently judge whether a human-authored changelog lists every feature; PM review remains mandatory.
