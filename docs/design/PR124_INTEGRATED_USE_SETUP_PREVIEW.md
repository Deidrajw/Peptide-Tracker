# PR124 — Integrated UX journey preview (proposal, no application changes)
Date: 2026-10-30. Baseline main da585ab3458394ddf5e88e283b210933beeab810; PR branch design source 03e5a428d7e404c80084a33c8c376be5694fa90e. Status: **DESIGN PREVIEW, NOT IMPLEMENTED / NOT APPROVED FOR MERGE**.

## Core experience
One setup for each compound's form of use, not one method wizard per vial. Five primary choices: **Injectable / Nasal / Topical / Oral / Other**. Injectable reveals SubQ or IM as a contextual secondary field; don't erase exact route from existing dose records. Ask for preferred dose unit (mg/mcg, IU only if validated for particular product). Select product/form; distinguish a physical vial from actually prepared nasal stock. Link a source only when necessary and verified; remember a unique valid source. Preparation planning is optional, never an implicit transfer.

## Proposed flow, with fictional examples
1. **Set up** Cagrilintide → Injectable / SubQ → prefer mcg → connect exactly one compatible open vial. Display Ready. Example routine log enters 250 mcg. The UI displays exact source context quietly and a single review confirmation.
2. **Set up** Oxytocin → Nasal → prefer mcg → select an ALREADY RECORDED prepared nasal container if one exists. Example 100 mcg in Dose; number of sprays only if a verified mcg-per-spray exists. Never infer that a physical oxytocin vial or mere nasal plan equals prepared stock.
3. **Conflict** Retatrutide vial 4: 28 mg physical stock labelled Nasal, routine route SubQ. Explain that physically present source is not verified as compatible with selected route and offer an explicit **Review setup** action, not “0 mg available” or insufficient stock. Preserve draft; prevent confirm until source resolved; don't silently relabel/reassign/deduct.

## Dose-unit model (proposal, not schema)
A combined input showing number + directly selectable unit. mg↔mcg is an exact mass conversion (e.g. 0.25mg=250mcg); on switch the number changes but quantity does not. IU is biological activity, never assumed equivalent to mass or U100 syringe markings. Delivery controls (sprays/pumps, mL, syringe markings, tablets/drops) are separately shown only with validated calibration. Preserve entered unit and original value alongside normalized quantity for compatible mass units; no migration approved.

## Compact Stash
Collapsed card includes name, short format/status, stock summary, one primary disclosure and accessible ellipsis. Expanding reveals relevant vials, prepared containers, and history on demand. Preserve existing DS2, 44–48px targets, 320/390, dark/light and full detailed records. Do not collapse unrelated product forms into a false single inventory quantity.

## UX decision rules
- Routine: once configured, one dose field and a short confirmation, exact stock attribution stored silently when unique and verified.
- Different routes/forms: route selection is not a stock conversion; setup must connect actual compatible item.
- No available compatible source: plain-language distinction among *none recorded*, *incompatible route*, *actual shortage*, and *planned but not prepared*. No misleading zero or unverified save.
- Untracked-dose mode remains an unresolved explicit product decision, not assumed available.
- Persisting changes to users' records and production remains prohibited without separate migration review and approval.

## Acceptance scenarios after implementation
SET-01 initial injectable/SubQ + 250 mcg; SET-02 nasal + 100 mcg with existing prepared stock; SET-03 change use method without retroactive changes; UNIT-01 mg↔mcg reversible; UNIT-02 reject undefined IU mass conversion; STASH-01 collapsed and expanded layout at 320/390 dark/light; LOG-01 verified single-source quick flow; LOG-02 incompatible 28 mg nasal-labelled vial gets correct explanation; LOG-03 no plan-to-prepared stock; HIST-01 dose history/backups unaffected. Follow permanent NEXUS_TESTING_STANDARD, full isolated app DEMO + LIVE ZIP and physical iPhone.

## Next one action
Obtain user feedback on integrated preview and decisions on untracked-dose source vs stock-backed source, and whether use configurations can have multiple forms simultaneously; then implement branch-only with tests. Keep PR #124 unmerged and undeployed.
