# Nexus — Active Workstream Registry

## 2026-11-26 — Backlog audit closed; starting new chats
The live GitHub Project [Nexus — Product & Development](https://github.com/users/Deidrajw/projects/1) now contains **all 12 open issues found in the audit**: #48, #109, #112, #138, #139, #140, #141, #145, #148, #157, #170, #171. Issue sidebars confirmed the seven formerly unverified members; #109/#112/#141 were added, others already linked. Existing PRs #175/#176 remain separate, unmerged and preserved. Cards are not yet all triaged by Priority/Area/Workstream; never treat Todo as release readiness.

**New-chat default:** read latest main and continuity files; until PR176 is merged read WORKSTREAMS on `ops/nexus-development-control-centre-20261122`; inspect Project #1 and the relevant issue/PR; search for duplicates before creating; add the appropriate issue to Project #1; record accurate status and cross-stream dependencies; never merge/deploy without specific approval. Discussion can proceed immediately; don't wait for perfect board metadata. Main app priority remains PR175 exact-head QA.



## 2026-11-26 — Live GitHub Project coordination
Board: https://github.com/users/Deidrajw/projects/1 — actual owner-linked GitHub Projects V2 board, saved Board/Bugs/Ideas & UX/Active work/Releases views, Priority/Area/Workstream fields. Project count reported 18. Confirmed issues #48, #148, #157, #170, #171 and PRs #175, #176 are members. Older open issues #109, #112, #138, #139, #140, #141, #145 **not yet verified as board members**; import by direct issue links without duplication. GitHub issues/PRs remain the persistent record; other chats must refresh current state, not assume their drafts are synchronized. New items initially appear as Todo and require intentional triage. PR176 remains DRAFT, NO MERGE/DEPLOY.



**Established:** 2026-11-22. **Status:** proposed control-centre branch; no merge/deploy authorization.
**Verified main at setup:** `657ad6a8f1de534f337c74420bb5f45d89bc2e6a`.
**Primary production:** v0.9.27-beta.6, last independently verified by documented 2026-11-21 Cloudflare parity evidence; not rechecked live this session.
**Purpose:** A lightweight pointer registry. GitHub issues and PRs hold detailed histories; never copy private production records into issues.

| Workstream | Home | Current state at audit | Next coordination action |
| --- | --- | --- | --- |
| Active Log Dose development | [Draft PR #175](https://github.com/Deidrajw/Peptide-Tracker/pull/175), branch `integration/pr169-multisource-on-beta6-20261121` | OPEN DRAFT, head `0f9589a8eaa5271c3b335be2e0a944d1341100cf`; exact-head QA and physical iPhone still require verification | Recheck latest PR head, CI, two-vial fixture and protected writer/Deadpool/BAC/Combo flows; do not merge/deploy |
| Original multi-source design | [Draft PR #169](https://github.com/Deidrajw/Peptide-Tracker/pull/169) | OPEN; historical source, not a merge target | Preserve unchanged; coordinate with PR #175 |
| Stash defects | [#170](https://github.com/Deidrajw/Peptide-Tracker/issues/170), [#171](https://github.com/Deidrajw/Peptide-Tracker/issues/171) | OPEN reports; no new fix verified in this setup | Triage separately; do not overlap Stash/Log Dose source edits without branch reconciliation |
| Protocol development | [#157](https://github.com/Deidrajw/Peptide-Tracker/issues/157) | OPEN; roadmap records draft PR #158 and prior user-reported iPhone tests | Check PR #158 and dependencies before implementing or releasing |
| Protocol product discovery | [#145](https://github.com/Deidrajw/Peptide-Tracker/issues/145) | OPEN future UX | Design discussion only until approved |
| Nasal safety | [#148](https://github.com/Deidrajw/Peptide-Tracker/issues/148) | OPEN P0; multiple historical draft PRs | Keep existing LIVE gate and writer safety requirements; release separately approved only |
| Search and app-wide UI | [#139](https://github.com/Deidrajw/Peptide-Tracker/issues/139), [#140](https://github.com/Deidrajw/Peptide-Tracker/issues/140), [#48](https://github.com/Deidrajw/Peptide-Tracker/issues/48) | OPEN; many older draft PRs | Reconcile stale branches and accepted DS2 decisions before selecting scope |
| Other open issues | #109, #112, #138, #141 | OPEN; mixed safety and design | Triage individually before work |

## Session handshake (every Nexus chat)
1. Fetch latest `main`, four continuity docs, this registry, the relevant issue/PR, active branch head, test evidence and applicable roadmap/design docs. Report checked SHA and access failures.
2. Identify **one issue or initiative**, its stream, owner chat (descriptive only; ChatGPT conversations do not synchronize live context), base/branch/PR, dependencies, protected flows and approval gates.
3. If only investigating or ideating, record findings to the issue and do **not** edit live app source.
4. For implementation use an isolated branch; before editing any shared code, recheck other active PRs touching those files. Never overwrite another stream or treat older integration branches as current main.
5. At every meaningful change update the issue/PR and this registry or PROJECT_STATE as appropriate, including tested versus not-tested evidence, blockers and single next action.
6. Never merge/deploy on silence; production storage, saved history, inventory, protocols and full-app fictional demo isolation remain protected.
7. A closed issue means verified resolution with code link and release status, not merely a PR opened. Do not close or reclassify historical work automatically.

## Coordination protocol
- **Ownership:** issue number is the persistent key; a conversation is a temporary working surface.
- **Dependencies:** use direct GitHub links and explicit `Blocked by #N / PR #N` references in issue descriptions.
- **Conflict:** concurrent ideas and reproduction tests are fine; overlapping edits to the same JS/CSS, writer or storage paths require one agreed integration owner and a fresh base reconciliation.
- **Promotion:** Inbox → Triage → Ready → In progress → Review / QA → Release ready → Released; Blocked is an explicit exception. Status and release state are separate fields.
- **Priorities:** P0 data integrity/safety, P1 broken core workflow, P2 usability/consistency, P3 improvement, Discovery unapproved concept.
- **Evidence:** always attach exact branch SHA, workflow URL/run, screenshot or fixture when available; mark unknown outcomes NOT TESTED, never infer production deploy from merge.
- **Cross-chat refresh:** one chat cannot automatically see another chat's unsaved draft. Record meaningful outcomes on GitHub at the end of each session; new chats must reread them.

## One next action
Complete PR #175 exact-head CI and protected-flow verification in its own development stream. This organizational branch must not alter that stream.
