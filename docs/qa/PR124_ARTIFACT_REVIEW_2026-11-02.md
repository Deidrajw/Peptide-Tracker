# PR124 exact-source artifact review — 2026-11-02

App/test source: `4867da8e56ac1c66f6d60995ca79a435b6f90c6d`. Main `da585ab3`. PR #124 draft, unmerged, undeployed. Candidate v0.9.20-beta.

## Verified
- All five source-head workflows SUCCESS: Chromium #41470861152, WebKit #41470861175, mobile #41470861166, nested #41470861486, writer #41470861469.
- Chromium artifact #13153879912 downloaded: outer ZIP 524 entries CRC PASS. Build manifest source equals 4867da8e; 26-file exact manifest LIVE ZIP with root index, CSS, JS and icons CRC PASS. Standalone full-app DEMO 3,085,202 bytes, offline DEMO ZIP present. DEMO manifest states in-memory fixtures and sync disabled; prior automated browser gate PASS. No personal imports or production writes.
- WebKit artifact #13153724176 downloaded: 296-entry ZIP CRC PASS with 320/390 light/dark screenshots. This review sampled Chromium 320 light/dark injectable Entry, 390 light/dark Review, Additional dose options light/dark. SubQ/IM/IV, accessible header/close and Review dock visible in samples; no obvious crop. Remaining screenshots not exhaustively manually reviewed.
- Cloudflare branch parity is intentionally false in the test artifact because candidate not deployed; no production deployment claimed.

## Still open
- #15 content contract needs reconciliation: current Additional dose options screenshot has helper description, while DECISIONS.md says remove unrequested extra helper copy and retain original text; later scorecard describes intentional helper descriptions. Do not claim all 16 visual issues fully accepted before reconciling.
- Original 16 physical iPhone and VoiceOver items NOT TESTED. Release P0 BLOCKING, both nasal LIVE gates OFF. No merge/deploy approval.
- One next priority: resolve #15 authoritative copy and conduct single consolidated fictional iPhone UAT following docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md. Preserve data, source accounting, history and existing DS2.

Documentation-only commit; exact-source app CI evidence continues to apply to application source 4867da8e. Revalidate if any application or test source changes.
