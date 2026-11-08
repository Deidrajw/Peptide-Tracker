# Nexus — Other Forms and Semax Nasal Repair (PR #154)
**Status:** Development candidate, not merged, not deployed.
**Source:** main baseline 96fb4804, branch fix/other-forms-management-semax-20261108.
**Version:** Source currently declares v0.9.26-beta.1; no new published version or deploy asserted.

## User-visible changes
- Stash → Other Forms: Manage actions for Edit Setup / Adjust, View history, Finish/Reopen and guarded Delete.
- Nasal spray editor: record pump mL per spray on a purchased bottle or an existing container; preserve existing source ID and balance. Show nominal mg per spray based on *recorded* solution concentration, without claiming verified delivered amount.
- Log Dose: an archived/not-scheduled compound becomes eligible when it has a calibrated, positive-balance prepared nasal stock. Finished stock is excluded from selection; direct capsule/nasal writers reject finished containers.
- Inventory deletion no longer archives a compound automatically. Existing archived tracking status is not rewritten.

## Data integrity
No migration, personal-data import, automatic user-balance rewrite, or personal data stored in the repository. Existing per-container adjustments/history are retained and new configuration adds an audit transaction. Deletion rejects any container with transactions, linked prepared doses or dose history; marking Finished is the non-destructive alternative. Exclusive writer uses the exact durable snapshot and rejects cross-tab stale state. Underlying physical vial inventory must not be changed by prepared nasal spray dosing.

## Affected areas
Stash / Other Forms; Today / Log Dose picker; nasal/capsule dose planners; Discover (automatic kit-delete archiving removed). Existing Check-In, Calendar, Protocol, Supplements, other Stash, physical vial/Combo Dose and history are protected.

## Verification
At source 2cc03fe8: 5 of 6 GitHub CI groups passed (mobile 42458849911, DS2 nested 42458849605, writer 42458849591, pinned Chromium 42458849579 and formulation WebKit 42458849569). Build/parity 42458849568 was pending when documented. Fictional regression includes calibration, archived tracking, single-bottle debit/Undo, Finish/Reopen and deletion guards. Earlier failures from outdated Adjust-direct flow and null-calibration test assertions were corrected.

## Limitations / remaining release gates
Official exact-source complete LIVE ZIP and isolated full-app DEMO not requalified; browser screenshots of new management modal not individually reviewed; primary Cloudflare deployment/version not independently verified; physical iPhone Safari, VoiceOver and Dynamic Type not tested; clinical suitability and real pump calibration not established. Merge/deploy requires qualified artifact and authorization consistent with continuity documents.

## Semax recovery after release
Stash → Other Forms → Semax → Manage → Edit setup; preserve recorded 10mg/10mL balance and enter confirmed pump 0.1mL per spray; save and verify existing container ID and history. Nominal amount per spray: 0.1mg (100mcg). Open Today → Log Dose → Semax. Do not create duplicate bottles or restore personal backup to work around missing calibration.
