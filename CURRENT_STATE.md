# Current State

Read this first — before `STATUS.md`. This file is the live handover: what's true right now and the next step. `STATUS.md` is the detailed history (why things are built the way they are); `CHECKPOINTS.md` is recorded feedback not yet acted on. Both stay as the deeper record — update this file's **Last updated** / **Right now** / **Next step** every session; add detail to `STATUS.md` only when something durable changed.

**Last updated:** 2026-10-10

**Live:**
- Production: https://mrgibbsteach.com (custom domain, DNS live, cert issued) — also reachable at https://teaching-portal-eta.vercel.app
- Repo: https://github.com/MrGibbsTeach/teaching-portal (private), branch `main`, auto-deploys on push
- All 10 courses exist; 6 are `active` with real content (Y11+Y12 × Foundations/General/ATAR), Y7–10 (4 courses) are still `placeholder`

**Right now:**
- All pre-student infrastructure done: keep-alive cron, adaptive live-session polling, teacher CSV export, custom domain.
- Y12 ATAR and Y12 General content shipped (practice exam + glossary for ATAR; mentor voice + 19 hands-on tasks for General).
- Nothing shipped this session has been **visually checked in a browser** — every content/infra change was verified by `npm run build` + `npm test` + `npm run lint` + structural validation only.

**Next step:**
1. Browser pass on everything shipped recently — Y12 ATAR, Y12 General, the infra changes (export buttons, live polling, keep-alive route).
2. Y12 Foundations videos — a researched shortlist is waiting on Clayton's confirmation; see `STATUS.md` → "Open item — Year 12 Foundations videos".
3. After that: visual/brand polish for Y7/8, Y9/10 (still generic `CourseOverview`); see `STATUS.md` → "Next steps (priority order, per Clayton)".

**Working across tools:** Clayton moves between Claude Code and ChatGPT Codex on this project depending on usage limits. Both read `AGENTS.md` on start by convention — keep this file and `STATUS.md` current in the repo itself, not in either tool's private memory, so a cold start in *either* tool picks this project up correctly.
