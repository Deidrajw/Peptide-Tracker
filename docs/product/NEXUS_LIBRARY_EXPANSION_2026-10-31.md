# Nexus compound library expansion — 31 October 2026

**Status:** CODED ON DRAFT PR #124; not approved for merge, not deployed. **Main baseline:** da585ab3458394ddf5e88e283b210933beeab810. **Candidate release manifest:** v0.9.20-beta (existing manifest, not a new published version).

## Source inventory and scope
- User-supplied `Peptide_Supplier_Comparison_v7.xlsx` (local attachment; NOT uploaded into GitHub): `LISTS` sheet has 248 distinct supplier-name labels and `ALL QUOTES` 2,440 price rows; list is a source of names to research, not proof of product composition, purity, evidence or administration suitability.
- Peptilogical homepage https://peptilogical.com/ accessible but yielded no machine-readable article/catalogue text. No individual Peptilogical product or research claims verified.
- Existing `assets/js/03-nexus.js` had 48 library entries. Append 53 curated additional entries, including 14 short-peptide/bioregulator entries, without modifying existing objects, `PEPTIDES`, stored user data or storage keys.
- Newly catalogued entries are informational; `meta` intentionally empty, no automatic dosing, preparation, method, frequency or protocol. In-app categorisation is descriptive, not an endorsement or statement of medical efficacy.
- Not imported as unique compounds: vendor SKUs (e.g. LC216, SK5, 5AD, RT10), uncharacterised blends, equipment/diluents, repetitive strengths, typo aliases (e.g. Slupp-322), incorrect peptide/nonpeptide classifications. Some commercial formulations require a distinct future blend/product layer. Existing `Epithalon` spelling is preserved, not duplicated as `Epitalon` to protect saved names.
- Specific classes: SLU-PP-332 is an ERR agonist small molecule (not peptide); L-Carnitine is an amino-acid derivative; Thymalin is a polypeptide extract rather than one synthetic peptide; N-acetyl variants are distinct chemical entities rather than synonyms for parent peptides.

## Bioregulators newly included
Bronchogen (AEDL), Cardiogen (AEDR), Chonluten (EDG), Cortagen (AEDP), Crystagen (EDP), Livagen (KEDA), Ovagen (EDL), Pancragen (KEDW), Prostamax (KEDP), Testagen (KEDG), Thymalin (extract), Thymogen (EW), Vesugen (KED), Vilon (KE).
Existing Cartalax, Pinealon, Epithalon are preserved.
Note: organ/tissue associations and sequences derive primarily from Khavinson-group tables and downstream reviews; strengths of evidence differ and many lack controlled human efficacy evidence.

## Independent research cross-checks
- SLU-PP-332 experimental ERR agonist: https://pubmed.ncbi.nlm.nih.gov/36988910/ ; mouse metabolic models https://pubmed.ncbi.nlm.nih.gov/37739806/
- Bioregulator sequence cross-check and evidence limitations: https://cellworks.tech/learn/peptide-bioregulators ; comparison register https://mypep.app/peptides?class=bioregulator
- Brenipatide (LY3537031) GIP/GLP-1 biologic identity from developer pipeline: https://www.lilly.com/science/research-development/pipeline
- N-Acetyl Epitalon identified as distinct chemical in PubChem: https://pubchem.ncbi.nlm.nih.gov/compound/N-Acetyl-Epitalon
- P021 (P21) identity caution: https://vialog.org/compounds/p21/

## QA and non-negotiable release boundaries
- `tools/validate-library-expansion.mjs` is wired into `.github/workflows/nexus-formulation-webkit.yml`. It asserts 101 canonical names, uniqueness, a subset of entries including bioregulators, classification of SLU-PP-332, no automatic dosing defaults for checked entries and preservation of existing Cartalax/Pinealon.
- Existing WebKit iPhone 320/390 light/dark LIVE+fictional DEMO is still required. Do not call this acceptance PASS until exact-source run confirms it.
- Open PR124 P0 concurrent synchronous/exclusive writer risk remains a release blocker independent of catalogue data.
- Complete exact-source full-app LIVE ZIP and isolated DEMO must be built and inspected, with physical iPhone acceptance and user-approved release plan before merge/deployment.
- **NEXT ONE ACTION:** confirm exact-head catalogue and WebKit CI then inspect full-app browser parity, artifacts and current full source; correct any failures without touching user records.
