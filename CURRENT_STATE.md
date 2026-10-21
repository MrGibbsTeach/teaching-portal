# Current State

Read this first — before `STATUS.md`. This file is the live handover: what's true right now and the next step. `STATUS.md` is the detailed history (why things are built the way they are); `CHECKPOINTS.md` is recorded feedback not yet acted on. Both stay as the deeper record — update this file's **Last updated** / **Right now** / **Next step** every session; add detail to `STATUS.md` only when something durable changed.

**Last updated:** 2026-10-21

**Live:**
- Production: https://mrgibbsteach.com (custom domain, DNS live, cert issued) — also reachable at https://teaching-portal-eta.vercel.app
- Repo: https://github.com/MrGibbsTeach/teaching-portal (private), branch `main`, auto-deploys on push
- All 10 courses exist; 6 are `active` with real content (Y11+Y12 × Foundations/General/ATAR), Y7–10 (4 courses) are still `placeholder`

**Owner's instruction for new sessions:** if Clayton types just "continue", follow "If the owner just types continue" in `claude/project-handover.md`. Next up is the course experience redesign (the courses feel static and boring). The code and content audit is already written in `claude/course-audit.md`.

**Open on GitHub (owner to merge):** PR #4 (docs: course audit, ranked feature backlog; includes #3). Merging it puts `claude/` docs updates on `main`. PR #2 (interactive animations) is already merged; check one lesson of each course on production.

**Right now:**
- 2026-10-21: the interactive rebuilds of Inside the Computer, Packet Journey and Binary Lights replaced the old looping animations in `public/animations/` (tap-to-select, Name it quiz, Flyover). Same filenames, so all 12 lesson placements picked them up. Not yet checked in a real lesson page on the preview deploy. Fetch, Decode, Execute and Colour Mixing are still old-style or unplaced.
- 3D animations live in 12 Y11/Y12 lessons (new `animation3d` block; see `STATUS.md` → "3D animations in lessons"). Clayton reviewed the preview and approved; merged to `main` 2026-10-19.
- Production infrastructure changes are in place: keep-alive cron, adaptive live-session polling, teacher CSV export, and custom domain. Preview Redis separation, a school-device check, and the school data-policy review remain before student use.
- Y12 ATAR and Y12 General content shipped (practice exam + glossary for ATAR; mentor voice + 19 hands-on tasks for General).
- Two migrated Y11 Foundations hotspot activities now retain their original diagrams and targets, with numbered touch- and keyboard-accessible controls. The shared header also has improved spacing at mobile widths.
- Verification: `npm test` (76 passed), `npm run build` (passed), and `npm run lint` (0 errors, 4 warnings). Chrome review checked both hotspot activities and the shared header on desktop and at 390px mobile width.
- Y12 course pages and the infrastructure screens still need their own browser pass.

**Next step:**
1. Browser pass on the remaining recent releases — Y12 ATAR, Y12 General, and the infrastructure changes (export buttons, live polling, keep-alive route). Y11 Foundations hotspots and the shared mobile header were checked 2026-10-10.
2. Y12 Foundations videos — a researched shortlist is waiting on Clayton's confirmation; see `STATUS.md` → "Open item — Year 12 Foundations videos".
3. After that: visual/brand polish for Y7/8, Y9/10 (still generic `CourseOverview`); see `STATUS.md` → "Next steps (priority order, per Clayton)".

**Working across tools:** Clayton moves between Claude Code and ChatGPT Codex on this project depending on usage limits. Both read `AGENTS.md` on start by convention — keep this file and `STATUS.md` current in the repo itself, not in either tool's private memory, so a cold start in *either* tool picks this project up correctly.
