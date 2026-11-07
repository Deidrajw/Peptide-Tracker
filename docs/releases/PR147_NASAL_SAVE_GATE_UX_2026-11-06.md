## Verified QA checkpoint
- Original candidate source 93c51883: six GitHub standard workflows SUCCESS, including full-build #42337431621. GitHub artifact #13560332059 verified: 549 CRC-clean outer members; 26-file root-correct LIVE package, 12 numbered scripts, CRC PASS; complete fictional standalone DEMO 3,169,462 bytes equals offline ZIP index byte-for-byte.
- Local full-app Chromium QA 8/8 (320/390, dark/light, gated-live and fictional DEMO states): LIVE notice/Close 44px, no false save CTA or inventory writes; DEMO invalid source inline failure; corrected fictional source successful dose and bottle decrement; no second source-kit debit or page errors. This is NOT physical Safari or clinical safety testing.
- Dedicated expanded CI at subsequent test-only commits still PENDING. App/source bytes remain unchanged. PR147 remains unmerged/undeployed; LIVE nasal administration cannot be saved from production.

# Nexus — PR147 nasal prepared-stock save feedback (nonproduction)
Date: November 6, 2026 (Toronto); production baseline v0.9.25-beta.1 at GitHub main a0482abc42060ad4b31108538a207bf983df90d7.
Branch: fix/nasal-dose-save-gate-feedback-20261106; draft PR #147; NOT MERGED OR DEPLOYED.

## Screenshot issue
The Fictional Compound A Log a dose confirmation offered “Confirm & save”, showing four nominal sprays, 200.00 mcg and a hypothetical 8.60 mL post-entry bottle balance. In LIVE app source, NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED is explicitly false. The save handler therefore throws on every attempt; the existing global error banner can be missed in a long scrolled sheet. Displayed projected inventory is NOT a confirmed transaction.

## Targeted changes
- Add early LIVE preflight to nexusNasalDoseModal so disabled nasal logging shows a visible, closeable notice, with no fake Review or Confirm & save CTA.
- Display failure reason inline beside the DEMO Confirm & save button when its fictional planning engine rejects a dose, with an accessible role=alert and scrollIntoView.
- Keep DEMO pure planner behaviour, bottle validation, source associations and undo semantics unchanged. No migration, inventory mutation, historical edits or automatic records.
- Safeguard with tests/nasal-save-gate-ux.test.cjs in the release validation workflow; do not enable the protected LIVE writer.

## QA
Source changes committed b7b39712; test e450f125 and workflow 93c51883. PR CI, 320/390 iPhone-emulated browser screenshots, full-app artifacts and physical iPhone acceptance PENDING at document creation. The live safety gate remains OFF; the inability to store a LIVE nasal dose is NOT fixed or bypassed.
No clinical verification of pump output, potency, stability or suitability.

## Release status
PROPOSED/CODED on draft PR147 only. Not merged, not deployed, not physically accepted. Separate user approval required for a merge/deploy; enabling LIVE nasal saving is a different, still-blocked safety decision.
Next action: verify exact branch CI and offline fictional full-app demo/LIVE packaging; check browser notice and inline DEMO error before requesting iPhone review.
