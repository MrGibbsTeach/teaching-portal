# Current State

Read this first — before `STATUS.md`. This file is the live handover: what's true right now and the next step. `STATUS.md` is the detailed history (why things are built the way they are); `CHECKPOINTS.md` is recorded feedback not yet acted on. Both stay as the deeper record — update this file's **Last updated** / **Right now** / **Next step** every session; add detail to `STATUS.md` only when something durable changed.

**Last updated:** 2026-10-23

**Live:**
- Production: https://mrgibbsteach.com (custom domain, DNS live, cert issued) — also reachable at https://teaching-portal-eta.vercel.app
- Repo: https://github.com/MrGibbsTeach/teaching-portal (private), branch `main`, auto-deploys on push
- All 10 courses exist; 6 are `active` with real content (Y11+Y12 × Foundations/General/ATAR), Y7–10 (4 courses) are still `placeholder`

**Right now:**
- Production infrastructure is in place: keep-alive cron, adaptive live-session polling, teacher CSV export, and custom domain. Preview Redis separation, a school-device check, and the school data-policy review remain before student use.
- All 6 active courses (Y11+Y12 × General/ATAR/Foundations) now have complete per-lesson check-question and hands-on/interactive coverage, closed 2026-10-21 across three sessions' worth of audit scripts (see `STATUS.md` for the full list). Y7–10 remain `placeholder` courses with zero real content — need source material from Clayton first (see Next step).
- 3D animations: 12 Y11/Y12 lesson placements live via the `animation3d` block. Three (Inside the Computer, Packet Journey, Binary Lights) were rebuilt to an interactive style and swapped in 2026-10-19–21; the raw files are confirmed live and intact on production, but no one has looked at them inside an actual lesson page yet (`/courses/*` requires a login session, which blocks anonymous verification).
- Per-student quiz-results tracking (built 2026-10-21, Clayton approved): teachers can now see each student's own right/wrong answers via a "Quiz results" link on the class page → `/teacher/classes/[id]/students/[username]`, not just the class-wide aggregate on `/teacher/insights`.
- Y12 General's Design Concepts lessons (elements, principles) now have a photo for every term, matching how Y11 ATAR already does it — Clayton flagged the gap directly (2026-10-21). See `STATUS.md` → "Y12 General design-concepts visuals".
- Y11 and Y12 AIT General Design Concepts visual pass is live (commit `b5a2267`), with follow-up screenshot fixes now live in `6c81844`: removed the crowded label from the Y11 focal-point illustration; clarified Year 12 Typography Do/Avoid advice in paired cards; and structured the Year 12 relationship example, rubric and practice scenario. Build passes; Vercel deployment succeeded. See `STATUS.md` → "Y11/Y12 General Design Concepts visual upgrade".
- Full-course visual pass for Y11/Y12 AIT General is live in commit `292d965`: 104 lesson-specific visual models added to the non-Design Concepts topics (55 Y11, 49 Y12), using each lesson's existing comparison, table, key terms or check questions. The Design Concepts lessons already have their custom visuals. SVG validation and `npm run build` pass; Vercel deployment succeeded. Repeatable script: `scripts/add-general-course-visual-upgrade.mjs`.
- Y11/Y12 General course-map polish and reading guidance/accessibility descriptions across all 104 non-Design Concepts models shipped in `2667c45`; production build and Vercel deployment succeeded. Logged-in browser review remains.
- **`claude/project-handover.md` is the source of truth for product/content/animation/commercial work** (AGENTS.md points to it) — read it before any of that. This file stays the technical/infra log.
- Nothing from 2026-10-21's content/feature work (General/ATAR/Foundations lesson changes, the new quiz-results page) has had an actual logged-in browser look yet — not blocking (all passed build/test/lint), but worth a glance next session.

- Syllabus accuracy pass for AIT General Y11/Y12 completed 2026-10-23 against the supplied SCSA syllabuses: corrected Y11 Design Concepts elements, principles and review questions, and corrected Y12 elements/principles briefs. Content JSON parses and changed visual asset paths resolve. See `STATUS.md` for details.

**Next step:**
1. Logged-in browser pass (teacher preview is enough) over the Y11/Y12 General course-map polish, syllabus corrections and updated reading cues on the 104 visual models, plus recent Y12 General/ATAR/Foundations lessons, 3D animation placements, and quiz-results page.
2. Y12 Foundations videos — a researched shortlist is waiting on Clayton's confirmation; see `STATUS.md` → "Open item — Year 12 Foundations videos". Not picked unilaterally — needs Clayton's own ~30s check per video.
3. Y7–10 need source curriculum material from Clayton before any content work can start — ask him where to find it, or whether to adapt the old OneDrive copy at `D:\OneDrive\Personal\Work\mrgibbs-teach` (a stale pre-Y12-ATAR clone of this same repo, last touched 2026-09-25 — worth a look but not authoritative).
4. `claude/project-handover.md`'s own next-actions list (A2 merge the Fetch/Decode/Execute animation, A3 place Colour Mixing, A1 swap confirmation) are waiting on Clayton, not started here.

**Working across tools:** Clayton moves between Claude Code and ChatGPT Codex on this project depending on usage limits. Both read `AGENTS.md` on start by convention — keep this file and `STATUS.md` current in the repo itself, not in either tool's private memory, so a cold start in *either* tool picks this project up correctly.
