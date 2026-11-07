# Nexus v0.9.26-beta.1 — Prepared nasal LIVE logging release candidate

**Release state:** DRAFT / NOT MERGED / NOT DEPLOYED. **Draft PR:** #152. **Main:** a0482abc42060ad4b31108538a207bf983df90d7. **Candidate application source:** b34ce0519c6370f1ca5e53dafd028c246ba06f87. No physical iPhone acceptance for the enabled LIVE path.

## Change
- Enable LIVE prepared nasal administration only on the candidate branch; preserve independent generic-transfer OFF switch and previously accepted recorded nasal preparation.
- Exact prepared bottle form, review of date/quantity/nominal spray mass and remaining balance, Confirm & save via shared exclusive writer Web Lock + optimistic CAS + verified durable readback, one bottle debit and dose history record, immutable ledger event and exact-source Undo. Review source fingerprint rejects bottle balance, calibration and ledger changes after review.
- Preserve PR146 approved search-clear/injection and read-only nasal calculator and PR142 backed-dose error/data protections. Increase existing undo toast touch target to 44px.

## Data impact
Existing localStorage key peptide-tracker-html-v1, histories, plans, weight, Check-Ins, supply records and backups are preserved; no schema migration or overwrite. A future user-confirmed LIVE save (only after deployment) will add one administration plus exact prepared stock deduction. Original physical source vial is not deducted again. DEMO fixtures are fictional and isolated.

## Validation / limitations
Initial candidate static test failures for old OFF switch and stale release notes were actively fixed. A direct browser regression revealed that an incomplete, not-yet-persisted synthetic vial was mutated by legacy metadata repair on render, so Undo correctly blocked rather than silently discarding changes; complete v2 fixture now used for normal flow. Six exact-head CI and new artifacts remain PENDING as of this note. Clinical spray delivery/stability and actual medical dose safety are not certified; iPhone, VoiceOver and Dynamic Type acceptance not completed. User GO permitted development qualification; **merge and deployment still require separate explicit approval**.

## Next
Verify all CI without suppressing failures, check exact-source LIVE + complete fictional DEMO artifacts and seek release authorization only once safely qualified.
