# PR162 — Stash real-screen fictional browser acceptance (2026-11-12 UTC)

Source: application 9ec970f829eaa64dd5aa9f0265420ead13d23dd0, main b4c83c06, separate PR160 006dc03a. PR162 remains draft/unmerged. No production data access/writes or approval to deploy.

Fictional full-app DEMO fixture: **Deadpool (fictional QA)** premixed blend of three 30mg physical vials: one historical empty vial with 30mg ledger draw, one open vial with 9mg ledger draw and 21mg remaining, one sealed. Historical opened vials have no sequenceNumber, _vialsBackfilled=true, reversed saved array order, preserving the original IDs. **Retatrutide Kit 2**: six sealed vials plus one historical empty vial, 60mg sealed stock, zero open, stale historical kit.reconDate 45 days earlier.

Playwright Chromium actual Stash UI at 320/390 x dark/light: Deadpool Vials panel shows **Vial 1 Finished** and **Vial 2 Open** (4/4 PASS); open amount 21mg (4/4 PASS); Retatrutide Kit 2 healthy, 6 sealed, 0 open and no false expiry warning (4/4 PASS); computeKitStatus expiryDaysLeft=null and stashExpiryMs=Infinity (4/4 PASS); no browser page exceptions (4/4 PASS). Separate Chromium 390 actual modal transaction, after deliberately marking prior fictional vial finished: Open Vial > Injectable > Log Reconstitution displayed and created **Vial 3**, sequenceNumber=3; previous two vial IDs preserved (1/1 PASS). No read/write to real data. Browser tests are not physical iPhone testing.

Targeted full-app QA edition assembled from exact-source official isolated DEMO with fixture-only addition after buildDemoState. No product JS/CSS changes. In-memory localStorage/sessionStorage and disabled fetch/XHR preserved. Companion offline HTML ZIP CRC pass and index byte-equal to standalone. Distinct from official GitHub LIVE ZIP and not an approved release artifact.

Remaining: physical iPhone test both Stash screens using targeted fictional DEMO; persistence across full refresh not supported because demo intentionally has ephemeral memory, so cannot claim refresh continuity; VoiceOver/Dynamic Type/clinical safety not tested. Previous 4 PASS/2 FAIL was **old** candidate 76402b84 and is not superseded as physical evidence.

Next: request user iPhone acceptance for the two specific Stash scenarios; only thereafter seek separate approval for PR162 release. Keep PR160 separate.