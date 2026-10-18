# Current State

Read this first — before `STATUS.md`. This file is the live handover: what's true right now and the next step. `STATUS.md` is the detailed history (why things are built the way they are); `CHECKPOINTS.md` is recorded feedback not yet acted on. Both stay as the deeper record — update this file's **Last updated** / **Right now** / **Next step** every session; add detail to `STATUS.md` only when something durable changed.

**Last updated:** 2026-10-18

**Live:**
- Production: https://mrgibbsteach.com (custom domain, DNS live, cert issued) — also reachable at https://teaching-portal-eta.vercel.app
- Repo: https://github.com/MrGibbsTeach/teaching-portal (private), branch `main`, auto-deploys on push
- All 10 courses exist; 6 are `active` with real content (Y11+Y12 × Foundations/General/ATAR), Y7–10 (4 courses) are still `placeholder`

**Right now:**
- Production infrastructure changes are in place: keep-alive cron, adaptive live-session polling, teacher CSV export, and custom domain. Preview Redis separation, a school-device check, and the school data-policy review remain before student use.
- Y12 ATAR and Y12 General content shipped (practice exam + glossary for ATAR; mentor voice + 19 hands-on tasks for General).
- Clayton reviewed the Y12 ATAR practice exam, glossary, and lesson navigation, plus Y12 General mentor callouts and hands-on tasks; all looked good (2026-10-10).
- Two migrated Y11 Foundations hotspot activities now retain their original diagrams and targets, with numbered touch- and keyboard-accessible controls. The shared header also has improved spacing at mobile widths.
- Verification: `npm test` (76 passed), `npm run build` (passed), and `npm run lint` (0 errors, 4 warnings). Chrome review checked both hotspot activities and the shared header on desktop and at 390px mobile width.
- Teacher/infrastructure screens browser-tested 2026-10-18 (worked around the built-in browser's localhost block by driving a local Playwright/Chromium instance against `npm run dev` instead). Teacher login, dashboard, class creation, add-student, the class management page, CSV export, and the live-session teacher view all render correctly with no React/console errors. Full detail in `STATUS.md` → "Teacher/infrastructure browser pass (2026-10-18)".
- Autonomous follow-up session, same night (2026-10-18): fixed a dev-only in-memory-store bug found during the browser pass (`lib/db.ts` now anchors its no-Redis-configured fallback on `globalThis` — production unaffected); closed Y11 General's remaining audit gaps (5 topics got an `interactiveDiagram`, Managing Data got 2 real hands-on `task` blocks — Hardware/Networks/Impacts of Technology deliberately stay task-free, see `STATUS.md`); cleared 3 of 4 lint warnings; full teacher+student+live-session browser pass with zero console errors. Full detail in `STATUS.md` → "Autonomous follow-up session (2026-10-18)".
- Confirmed Y7/8/9/10 render `CoursePlaceholder`, not `CourseOverview` — they have zero real content (not just unstyled), and `course-reference/year-{7,8,9,10}-*/` only hold empty `curriculum`/`exams-and-marking-guides` folders (`.gitkeep` only). Building these out needs Clayton to drop source material in first, the same way Y12 ATAR/General did from his docx/pptx — it's not a styling-only task.

**Next step:**
1. Y12 Foundations videos — a researched shortlist is waiting on Clayton's confirmation; see `STATUS.md` → "Open item — Year 12 Foundations videos". Not picked unilaterally — needs Clayton's own ~30s check per video.
2. Y7–10 need source curriculum material from Clayton before any content work can start (see note above) — ask him where to find it, or whether to adapt the old OneDrive copy at `D:\OneDrive\Personal\Work\mrgibbs-teach` (a stale pre-Y12-ATAR clone of this same repo, last touched 2026-09-25 — worth a look but not authoritative).
3. Y12 General still has 8 topics with no interactive block (design-concepts, impacts-of-technology-u3/u4, application-skills-u3/u4, project-management-u3/u4, managing-data) — same audit gap as what Y11 General just had closed, not yet started.

**Working across tools:** Clayton moves between Claude Code and ChatGPT Codex on this project depending on usage limits. Both read `AGENTS.md` on start by convention — keep this file and `STATUS.md` current in the repo itself, not in either tool's private memory, so a cold start in *either* tool picks this project up correctly.
