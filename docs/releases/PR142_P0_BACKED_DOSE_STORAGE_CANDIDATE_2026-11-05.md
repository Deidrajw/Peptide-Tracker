# PR142 — P0 backed dose save and warning correction (DRAFT / NOT RELEASED)
**Date:** 2026-11-05. **Base:** main a0482abc42060ad4b31108538a207bf983df90d7. **Issue:** #141. **PR:** #142.

## User-impacting symptoms
- A physical iPhone dose Review showed an exact-vial/saved-state failure despite displayed sufficient stock.
- A red device-storage failure alert persisted across unrelated screens.
- A logged combo component appeared absent from Today, though a private local-only backup contains the relevant paired records. This display discrepancy is NOT YET RESOLVED.
- No private backup contents, medicine/compound names or personal dosage data are committed or used in CI.

## Coded changes
1. Backed physical-dose writer uses its own verified durable serialized snapshot as transaction input, not transient UI navigation state. Exclusive cross-tab Web Lock, readback, stale-state CAS and strict physical-vial planner still apply.
2. Planner, stale/conflict and genuine device storage failures display different error messages. Planner errors do not automatically trigger an erroneous device-storage banner.
3. True device-storage warning gets a 44px accessible dismiss control; subsequent write failures can show a new warning.
4. Fictional Node regression tests now cover normal save with transient UI changes, genuine stale storage rejection with zero writes, exact-vial failure, and quota write rejection. Added to build workflow, updated source-shape safety assertion to require durable snapshot CAS.

## Protected data
No schema or storage key migration. No inventory rewriting, historical dose edits, imports, live production writes or automatic duplicate-record creation. LIVE nasal admin and generic transfers remain separately OFF.

## QA checkpoint
- Original test workflow failed because VM lexical state was accessed as a global property. Test corrected at 64382294.
- Existing safety assertion requiring old transaction(state,...) source failed; updated to mandate exact verified snapshot/lock at 191342d5, rather than weakening safety.
- Final app classification source 579d4b2c, documentation 5bfdf2d2. Latest exact-head GitHub QA was queued as of this writing. Treat status as NOT TESTED until result verified.
- Real iPhone acceptance, physical Safari/VoiceOver, independent clinical math certification and exact current-source FULL DEMO/LIVE ZIP release package are NOT VERIFIED.
- Today/Calendar visibility of private backup's existing record remains unresolved, not automatically fixed by transaction change.

## Status
CODED on draft PR. Not merged, not deployed, not physically accepted; no version bump.
**Next priority:** Qualify exact-head safety, browser/WebKit/mobile and source-matched full isolated DEMO/LIVE packages; trace missing Today display independently. Do not merge/deploy without explicit user approval.
