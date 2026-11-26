# Nexus Development Control Centre — GitHub Operating Model

## Backlog closeout — 2026-11-26
**Verified audit scope:** Every one of the 12 GitHub issues open at the baseline audit is linked to [Project #1](https://github.com/users/Deidrajw/projects/1): #48, #109, #112, #138, #139, #140, #141, #145, #148, #157, #170, #171. The previously unconfirmed seven were checked on individual GitHub issue pages: #109/#112/#141 added; #138/#139/#140/#145 already linked. This supersedes earlier claims that seven issues were outstanding.
**Pragmatic taxonomy:** Existing native GitHub Issue Types Bug and Feature support Bugs / Ideas & UX views. Type=Feature view includes implementation-ready features and early ideas, so it is NOT a separate approval state; Discovery priority and explicit status/decision notes are needed to distinguish ideas. Avoid destructive removal of GitHub's Todo, In Progress, Done status options; initial Todo means untriaged. Do not claim auto-sync from ChatGPT; future chat progress persists only when written to issues/PRs/docs. Existing custom Priority, Area, Workstream fields are available, but retrospective population and GitHub automation are not yet verified. These are optional quality enhancements, not a blocker to parallel chats.
**Operating rule:** On every new issue search GitHub for duplicates, create/update the issue, link to Project #1, record affected app area, priority, dependencies and acceptance criteria, then update workstream/continuity notes when materially changed. Separate development branches may coexist but touching the same files requires integration coordination. No merge/deployment by inference.
**Outstanding approval:** PR #176 remains open draft and needs explicit merge approval to bring documents/templates to main. No app release artifacts, personal records or production changes in this organizational branch.



## Live configuration checkpoint — 2026-11-26
**Board created:** https://github.com/users/Deidrajw/projects/1 (owner Deidrajw, default repository Deidrajw/Peptide-Tracker verified linked). This supersedes the original 2026-11-22 proposal-only status below without changing its rationale.
**Verified via signed-in GitHub browser:** Board layout, added Status options (Inbox, Triage, Ready, In progress, Review / QA, Release ready, Released, Blocked; original Todo/In Progress/Done preserved), Priority/Area/Workstream single-select fields with proposed options. Four saved Board views: Bugs `type:Bug`; Ideas & UX `type:Feature` (NOT yet specific to unapproved ideas); Active work `In progress OR Review / QA OR Blocked`; Releases `Release ready OR Released`. Built-in Type field exists but original seven-value product taxonomy not verified configured. Some statuses duplicate GitHub defaults: cleanup requires careful verification that cards will not be orphaned.
**Membership:** tool reported 18 project items; confirmed issue #48/#148/#157/#170/#171 and PR #175/#176 present. Older open issues #109/#112/#138/#139/#140/#141/#145 NOT confirmed imported, despite ambiguous bulk picker. Do not advertise complete backlog migration. Newly added items retain Todo until properly triaged.
**Next:** verify/import missing issues by exact URL; refine Type/idea discovery semantics; triage project fields and status options with no alteration of underlying issue/PR content. PR #176 remains draft and requires separate merge approval. No production app code or data changes.



**Proposal implemented as repository documentation on a separate branch, 2026-11-22.** This does NOT mean a GitHub Projects board was created. Connected GitHub actions available in this session cannot administer Projects V2, and existing board configuration has not been verified.

## Purpose and source of truth
Use GitHub Issues as persistent work items, PRs as implemented change reviews, `docs/continuity/WORKSTREAMS.md` for cross-chat coordination, and the existing four continuity documents for official state, decisions, release and regression history. ChatGPT conversations are workspaces, not authoritative synchronization channels.

## Board configuration to apply in GitHub Projects
Suggested name: **Nexus — Product & Development**.
Views: **Board** grouped by Status; **Bugs** filtered Type=Bug; **Ideas & UX** filtered Type=Idea/Design; **Active work** filtered In progress/QA/Blocked; **Releases** filtered Release ready/Released.

| Field | Values / purpose |
| --- | --- |
| Status | Inbox, Triage, Ready, In progress, Review / QA, Release ready, Released, Blocked |
| Type | Bug, Feature, Design / UX, Technical debt, Regression, Research / Idea, Release |
| Priority | P0, P1, P2, P3, Discovery |
| Area | Today, Calendar, Protocol / Plans, Stash / Supplies, Log Dose, Check-In, Settings / More, Platform / Data |
| Workstream | Development, Bug investigation, Product / Design, Release / QA |
| Source / PR | GitHub issue link, draft PR and branch (linked wherever possible) |
| Target release | Optional planning field, never imply approval |
| Device acceptance | Not tested, Needs iPhone, User-reported pass, Failed, Not applicable |

Use GitHub's supported built-in fields where possible. The exact custom fields/views remain **NOT CONFIGURED** until independently confirmed.

## Intake
- A free-form chat report is enough: reproduce the user's language, then turn it into a clear title, actual/expected behaviour, steps, device/version, severity, screenshots, known dependencies, protected flows and acceptance criteria. Ask only for details indispensable to diagnosing.
- Search open AND recently closed issues to avoid duplicates before creating a new one. Link related issues, preserve original reports and distinguish observed facts from hypotheses.
- New feature ideas should start as Discovery; capture problem, target user, alternatives, UX mockup and decision status. Do not silently code an unapproved design.
- Safety/data-integrity defects override cosmetic priorities, but do not alter unrelated branches.

## Stage gates
1. **Inbox:** report captured; no diagnosis implied.
2. **Triage:** reproduce or investigate; assign priority, scope and links.
3. **Ready:** acceptance criteria and dependencies understood, authorized scope.
4. **In progress:** branch/PR owner established and verified against current main.
5. **Review / QA:** exact-source full app, protected regressions and evidence; report Fail/Blocked.
6. **Release ready:** approval decision explicitly pending or received, release package verified.
7. **Released:** approved merge, independently verified primary Cloudflare deploy, release docs and regression evidence. Physical iPhone acceptance separately recorded.
8. **Blocked:** explicit reason, unblock condition and owner; preserve stage history.

## Branch and collision policy
One release-facing implementation owner at a time for overlapping app source. Other chats may investigate and write issues or design notes without modifying that branch. No force pushes or blind cherry-picks from stale PRs. Keep app data and backups untouched. Never merge/ship without specific authorization.

## Session output
At start: verified SHA, production evidence/date, workstream issue/PR, target and protected flows, and what the user must do. At finish: DONE, INCOMPLETE, NEXT, user action, release status and a short GitHub-linked handoff. A docs-only change does not require LIVE/DEMO release artifacts; mark app-feature deliverables not applicable rather than claiming they were built.

## Initial audit — 2026-11-22
GitHub connector authenticated with admin repo permissions. Main found at `657ad6a8f1de534f337c74420bb5f45d89bc2e6a`. Search returned 12 open issues and 40+ open PRs, many historical drafts; **these are audit snapshots, not proof of clean relevance or board membership**. PR #175 OPEN DRAFT head `0f9589a8eaa5271c3b335be2e0a944d1341100cf`; original #169 OPEN. Project boards could not be enumerated from the available GitHub connector tools; existing Projects status UNKNOWN. No issues/PRs were relabelled, closed, or merged as part of setup.

## Rollout boundary
Repository docs and issue templates: implementation branch. GitHub Projects V2 creation / custom fields / automation: **BLOCKED by connector capability**. Do not present example boards as real data. A later connected browser/Projects-capable session may configure it after checking existing boards and avoiding duplicates.
