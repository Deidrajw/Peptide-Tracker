# Nexus Cloudflare Preview acceptance
Candidate branch: release/consolidated-readiness-preview-v2
Status: PREVIEW BRANCH CREATED, HOST NOT VERIFIED.
- Production remains main; no merge or production deployment authorized.
- Preview includes complete current app source. `noindex,nofollow` discourages search indexing but is NOT authentication or data isolation.
- Do not enter actual health data into a public preview. Browser localStorage is origin-scoped, but preview is not automatically fictional-data-only; no claims of disabled imports, exports or network writes.
- Cloudflare Pages must have branch previews enabled; exact preview URL is not known until Cloudflare creates deployment.
- Required before use: verify preview URL belongs to expected Cloudflare Pages project, source commit parity, restrict preview access, inspect storage/API requests, and implement isolated fixture mode if using fictional data.
- Required tests: full app Today, Calendar, Protocol, Stash, More, settings, onboarding; 320/390 both themes; backups/import block, dose math, notifications, profile, keyboard and modal scroll. Report automated vs physical iPhone separately.
- Privacy PR #91 and calculator #67 remain held. Production manifest v0.9.17-beta remains publication unverified.
- One next action: verify Cloudflare preview deployment for commit 11dbe16cb3b621b70524594fe582fe8d07cf4077, then implement isolated fixture preview mode before user testing.
