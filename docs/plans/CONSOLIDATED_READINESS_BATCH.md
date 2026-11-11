# Nexus consolidated readiness batch — implementation plan
Status: APPROVED SCOPE / NOT IMPLEMENTED. Baseline main b6737fad61195211f0e2b0025a6074c2de8f3e81 (v0.9.17-beta).
## Track A — Product experience
- Inventory Today, Calendar, Protocol, Stash, More and every sheet, Settings, Journal, Plans/Goals, Research and onboarding. Standardize action controls, chevrons, badges, touch areas, typography, keyboard and safe areas.
- Fix failures with evidence from screenshots and 320/390 light/dark browser comparisons; maintain established information hierarchy.
- Accessibility: VoiceOver semantics, focus, dynamic type, reduced motion, contrast.
## Track B — Trust and safety
- Continue draft Privacy & Data PR #91; do not merge before live traffic/provider verification and reviewed claims. Just-in-time notifications, external-service rationale, manual backup disclosure. No destructive data changes.
- Backup: fresh-browser restore, invalid/oversized files, storage-quota failure rollback, existing-record guard and byte-preservation checks.
- Calculator PR #67 held: resolve all independent numerical diagnostics before enabling, including precision, mixture and insufficient inventory.
## Track C — Release delivery
- Canonical version manifest drives in-app/Apple/Google notes. Verify Cloudflare host against main build; only then mark publication and enable one-time What's New popup. Preserve history and acknowledge per version.
- Full-app standalone DEMO isolated from production and complete LIVE ZIP built from exact same release source; CI at 320/390 both themes, iPhone manual acceptance and protected flows.
- Native iOS/Android wrapper and store declarations are separately gated after web release readiness.
## Merge gates
1. No unverified privacy claims, data migrations or automatic backup overwrites.
2. Source-reviewed changes and testable full-app preview; automated + real-device results labeled separately.
3. PR checks, LIVE/DEMO artifact parity, version notes, all four continuity docs and verified deployment.
4. Separate held calculator changes until safety tests pass.
## One next action
Reconcile open PR #91 with current main and capture production network traffic evidence; then implement safe product/UI fixes in a coordinated release branch and run complete matrix.
