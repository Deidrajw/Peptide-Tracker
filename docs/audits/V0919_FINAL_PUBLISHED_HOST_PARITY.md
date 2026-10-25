# Nexus v0.9.19-beta — final published manifest Cloudflare parity

PR #100 merge `955c904860b39c5c56472b07cd3521828d5d9d79` implemented the user-supplied iPhone Deadpool/Protocol fixes. PR #101 post-merge CI run 40162047192 found **16/16 Cloudflare application files byte-identical**. PR #103 merge `61f5217bbd11f3598b582ff6fcfd75490b96aa0f` then enabled published release metadata and What's New; its PR-head release/browser and mobile tests both passed.

## Final check
This documentation-only branch is based on the exact PR #103 main application source; a new PR triggers 16-file remote byte parity for HTML, 3 CSS, 12 ordered JS. Read the uploaded `Nexus_CLOUDFLARE_PARITY.json` and require `verified:true` before claiming the published flag is on Cloudflare. PR comparison is **nonblocking**, so a green CI badge by itself is not proof.

## Safety and unresolved
No code, schema, backup, dose, or inventory writes in this verification-only branch. The complete original app, standalone fictional-data isolated demo, and versioned LIVE ZIP remain the mandatory package. Physical iPhone acceptance of the original Stash/Log Dose/Protocol screenshots and VoiceOver are still NOT TESTED. Do not claim App Store readiness.

ONE NEXT ACTION: Inspect published-flag Cloudflare 16-file JSON result, then update living continuity docs with the real published web source and user's real-iPhone acceptance as a separate gate.
