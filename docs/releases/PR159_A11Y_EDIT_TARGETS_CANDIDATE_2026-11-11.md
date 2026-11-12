# PR159 — Draft accessibility touch-target correction
Version: candidate based on v0.9.26-beta.1; no new version or deployment.
GitHub baseline main: 8be7ef2ea9125d69d21a9b6d0a053f678c362d38.
Affected screen: More/Profile > Edit targets. Increase button min-height from 42px to 44px. Add source-level DOM test guard to DS2 global audit. Exact original local browser result 100x42px; patched measured >=44px on 320/390, light/dark.
Fictional 20-route Chromium audit: 20/20 loaded, no JS errors, overflow or unnamed visible buttons. Known unresolved: 320 Calendar seven-column day-cell buttons 40px wide, 67px tall. Needs real iPhone touch/VoiceOver assessment, not forced resize. Full-app isolated fictional DEMO and 26-file LIVE candidate locally built and CRC checked; CI-exact official artifacts / full GitHub workflow status pending at documentation time. No data schema, dosage, writer, history, inventory or other UI changes. No live writes, imports, merge or deployment. Physical iPhone Dynamic Type, VoiceOver and accessibility focus untested.
Release state: DRAFT PR ONLY. Approval required before merge/deploy.
