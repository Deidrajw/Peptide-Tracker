# PR #124 — Kit-first Stash replacement (UX proposal, NOT APPROVED)
Date: October 29, 2026
Status: **PREVIEW / DECISION REQUIRED**, no migration or deduction enabled

## Problem
The separate "Other formulations" panel with "+ Capsules"/"+ Nasal bottle" was rejected by the user. It obscures that physical stock is acquired as a kit/package and that one vial from a kit may be reserved for injectable use while another may be prepared as a nasal bottle. GHK-Cu can also be stocked as capsules, raw powder or topical products without being a vial kit. Two open items of the same compound must remain distinct.

## Recommended hierarchy
**Stash → Physical kits (cards)**, each with:
1. **Kit identity**: compound/product name, purchased form (lyophilized vial kit, capsule package, raw powder, topical product), package count, storage and notes.
2. **Inside a vial kit**: individual sealed/open/empty vials, source vial identity and remaining canonical mg. Each open vial may have optional intended method (SubQ, IM, nasal preparation) assigned independently; do not apply a kit-level default to every vial.
3. **Derived preparations**: if the person elects to make a nasal preparation from a specific vial, show a linked child bottle with its own balance, initial transfer audit, date and measured composition. **Never create/debit both records by merely changing the intended method.** A validated explicit transfer is a distinct consent/action with quantity, source availability and atomic storage requirements.
4. **Non-vial packages**: capsules (count, labelled strength), raw (net mass and units), topical (volume/mass and product label)—each a real kit/package card with its own unit-specific inventory, NOT a fake vial. Their accounting cannot reuse vialMg or openedVials fields.
5. **Legacy unlinked formulationStocks**: retain every record and adjustment; offer a clearly labelled "Link to kit" review workflow that requires the user to choose an exact kit or to leave unlinked. No auto-link by compound name. Keep legacy records visible during transition, without promoting the rejected separate cards.

## Proposed flows
**Add kit** → choose form on first step (Vials / Capsules / Raw / Topical) → form-specific fields. Choosing Capsules does not show reconstitution or vial math. Existing Vial Kit screens retain accepted DS2 styling and flows.

**Open vial** → choose exact sealed vial → ask "How will you use this vial?" with non-committing choice Injectable (SubQ/IM), Prepare nasal, or Decide later. If nasal, open a separate "Create nasal preparation" review referencing the chosen vial and keeping its sealed/open lineage. No auto-conversion, balance credit or source debit until confirmed with a validated transfer protocol. Show the link under the parent kit thereafter.

**Dose logging** → 3×2 method buttons; single detailed site dropdown. Show only sources matching method and exact container identity. A context warning for Nasal disappears when route changes. No persistent global banner for exploratory taps.

## Non-destructive phased implementation
A. Keep existing source data and PR #124 unmerged; remove rejected standalone presentation only after preview approved and safe replacement wired.
B. Implement new kit-type distinction and kit details as an **additive schema**, retaining existing supplies and independent formulationStocks records. Do not backfill source IDs by name.
C. Model per-vial method metadata and source-linked preparations; no automatic reassignment of historical dose sources.
D. Validate shared write protocol, transaction replay and rollback safety before enabling nasal vial→bottle transfers or oral/nasal dose deductions.
E. Run Node + 320/390 Chromium/WebKit LIVE/isolated DEMO tests, user physical iPhone acceptance and explicit release approval.

## Explicit user decision
Approve a single Add Kit wizard with form choices **Vials / Capsules / Raw / Topical**, and an **Open Vial → intended use → optional nasal preparation review** path. Keep the method as a recording property, not a dose/stock transfer by itself. 


## 2026-10-29 — User approval and implementation update
- User APPROVED the unified **existing Add Kit** selector with five products/forms: Vials, Capsules, Raw Powder, Topical, purchased Nasal Spray. The same compound may be purchased in different forms; a capsule package (e.g. SLU-PP) is entered without pretending to be a vial. Physical kit/package terminology is flexible; no extra add buttons in Stash.
- Purchased nasal spray is added directly as its own product package. Homemade nasal spray must begin at Open New Vial on the exact source kit/vial. Initial per-vial intended-use selector is implemented, but remains a non-transferring designation; validated source debit → bottle credit and linked nasal bottle are NOT IMPLEMENTED.
- Implementation commits on PR #124: single Add Kit gateway and five descriptive choices, integrated package cards instead of separate Other formulations, raw/topical additive inventory model, compound searchable/free text, 80px+ selection targets and 46px Adjust, revised deep navigation audit. Exact-head CI pending; no merge/deploy.
- Prior initial status of this document as PREVIEW superseded **only for the approved five-form Add Kit direction**. The linked homemade nasal transfer experience requires separate data-integrity testing and approval before activation.
