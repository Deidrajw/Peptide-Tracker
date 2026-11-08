# Nexus — Protocol renewal follow-up candidate (Issue #155)

**Status:** Coded on draft PR #156 only; not merged or deployed. **Version:** No new release version; baseline v0.9.26-beta.1. **Main baseline:** 1c6007fce7ea25a68ec29f480f3b4d6ede46477c.

## User-observed issue
After logging Reta on an ended protocol, tapping Start a new protocol looked unresponsive because `dismiss(false)` was asynchronous and later closed the just-opened builder.

## Candidate changes
- Await guarded follow-up acknowledgement before opening a new or existing protocol builder.
- Start New opens a separate unsaved draft with the triggering compound preselected; the previous protocol, history and logged dose are not copied or changed.
- Leave dose blank and require explicit schedule/dose review; no automatic activation or storage writes by opening the builder.
- Preserve Update Existing, reminder dismissal, and failure-to-acknowledge recovery.

## Affected/protected screens
Today → Log Dose → post-protocol reminder → Protocol Builder; Protocol tab retained. Protect Check-In, Calendar, Stash, Combo Dose, prepared nasal accounting, writer safety, plans and theme/320px responsiveness.

## Data impact
No migration. Only existing acknowledgement state changes on successful reminder choice; no production data accessed by development tools. Starting the new builder does not create a protocol until user saves; save follows existing guarded exclusive writer path. Existing protocol/dose history untouched by the new action.

## Evidence and limitations
Test case added to existing `tools/validate-protocol-design.mjs` full-app browser matrix (LIVE/isolated fictional DEMO × 320/390 × light/dark) for new/edit successful acknowledgement and failed acknowledgement, intended to run under the regular CI release validation workflow. Verify exact latest head results before marking Pass. Browser simulator is not physical iPhone acceptance. Source-matched standalone full-app DEMO, offline DEMO ZIP, exact-source LIVE ZIP and primary Cloudflare parity are incomplete until reviewed. No permission to merge or deploy.
