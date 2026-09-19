# Status

Living tracker for where MrGibbs Teach is at. Update this whenever a session wraps up so the next one (you or Claude) can pick up cold.

**Live site:** https://teaching-portal-eta.vercel.app/ (auto-redeploys on every push to `main`)
**Repo:** https://github.com/MrGibbsTeach/teaching-portal (private)
**Archived source projects:** `D:\OneDrive\Personal\Work\archive\` (`11-ait-general-course`, `11-ait-atar-course`, `ait-foundations-course`) — untouched, kept for reference only
**Curriculum reference docs:** `course-reference/<course-slug>/` (one folder per course) — curriculum documents, marking guides, past exams. Gitignored (local only, not on GitHub) — check here for source material when working on a specific course. See `course-reference/README.md`.

## Done

- Site scaffolded: Next.js (TypeScript, App Router) + Tailwind + shadcn/ui + Supabase client
- All 9 courses exist as routes; metadata in `lib/courses.ts`
- Home page groups courses into Years 7–10 / AIT Foundations / Year 11 & 12 Applied IT
- Placeholder courses (Y7/Y8 Digital Technologies, Y9 Digital Innovations, Y10 Digital Enterprise, Y12 Applied IT General, Y12 Applied IT ATAR) render greyed out with a "Coming soon" badge and aren't clickable — no real content exists for these yet
- **Content migration complete** for the 3 courses that had prior content:
  - AIT Foundations — all 4 units populated (71 lessons: Computer Foundations, Applications in Practice, Applied Digital Skills, Online Ethics & Multimedia); only 6 videos so far
  - Year 11 and Year 12 Applied IT General — 2 units each (10 topics per year), full lesson content, quizzes, tasks; Apprenticeship Framework topics deployed
  - Year 11 Applied IT ATAR — both units (10 modules), lessons + quiz + practice questions + exam practice, plus a "Unit 1 Practice Exam" topic (full 100-mark mock exam) and a "Glossary" section
  - Migration was done programmatically via `scripts/transform-{general,atar,foundations}.mjs` — these read the archived projects' source files directly and convert to the unified schema (`lib/content/types.ts`). Re-run them if archived sources ever change.

## Visual/brand polish — in progress (Clayton, 2026-06-29)

Decided approach: **one overall brand** (logo, header/footer, shared across all 9 courses) + **fully bespoke per-tier visual systems** within each course's content area (not just a palette swap — distinct layouts/components per tier). Five tiers: Y7/8, Y9/10, ATAR (Y11→12), General (Y11→12), Foundations.

**Overall brand — built:**
- `components/brand/Logo.tsx` — icon (mortarboard mark) + "MrGibbs Teach" wordmark, used in `app/layout.tsx` header
- Brand color tokens in `app/globals.css` `:root` — indigo/violet primary (`oklch(0.55 0.21 276)`), warm amber accent — modern edtech tone, applies site-wide via shadcn's existing CSS variables (no per-component changes needed)

**AIT Foundations tier — built first (proof of concept, most distinct requirement: low literacy, one-concept-at-a-time):**
- Dedicated theme scoped via a `theme-foundations` class toggled on `<html>` only while on Foundations routes (`components/course/foundations/FoundationsThemeRoot.tsx`) — sets `font-size: 125%` on root so every rem-based Tailwind utility (text + spacing) scales up app-wide-but-scoped, instead of forking every component's classes
- Font: Atkinson Hyperlegible (dyslexia/low-vision-friendly) via `components/course/foundations/font.ts`, applied with a `.font-foundations` utility class
- Cream/navy/teal high-contrast palette, large `1.25rem` radius, defined as overrides under `:root.theme-foundations` in `globals.css`
- `components/course/foundations/FoundationsOverview.tsx` — replaces generic `CourseOverview` for this course only: icon-heavy drill-down (units → topics → lessons), one screen visible at a time, big tap targets. Icons matched to topic/unit title keywords via `unitIcon.tsx` (e.g. spreadsheets → Sheet icon, social collaboration → Users icon)
- `components/course/foundations/FoundationsLessonView.tsx` — replaces the shared lesson page for this course only: groups lesson blocks into screens (splits on h1/h2 headings), paginated with big Back/Next buttons + progress dots, reusing the existing `BlockRenderer` for block content
- Wired: `app/courses/ait-foundations/layout.tsx` (theme+font for the overview route) and a slug check in `app/courses/[slug]/lesson/[lessonId]/page.tsx` (theme+font for the lesson route, since all courses share that one dynamic route)
- Verified via `npm run build` (passes) + curl/grep of server-rendered HTML confirming the Foundations theme renders only on `ait-foundations` routes and not elsewhere — **not yet visually checked in an actual browser** (no chromium-cli/Playwright in this sandbox); do a manual look before considering this tier done

**Not yet built:** Y7/8, Y9/10, ATAR, and General each still need their own bespoke visual treatment (see design direction below for the intended tone of each). ATAR and General currently still render through the generic `CourseOverview`/`BlockRenderer` path with the new brand colors only — no bespoke layout yet.

## Design direction (Clayton, 2026-06-19)

Each course should feel distinctly different — not one visual template stretched across all 9:

- **Y7/Y8 Digital Technologies** — similar feel to each other (intro-level)
- **Y9 Digital Innovations / Y10 Digital Enterprise** — similar feel to each other, distinct from Y7/8 (electives)
- **AIT ATAR (Y11→Y12 pathway)** — serious tone, exam-prep focused from day one of Y11, building toward the Y12 WACE exam
- **AIT General** — practical/hands-on, designed for student independence — minimal teacher involvement needed day-to-day
- **AIT Foundations** — rarely-selected, for students with extremely low literacy. Needs to be extremely simple/loud, near one-piece-of-information-at-a-time, very different UI from the other 8 courses

This should inform any visual/UX pass — apply per-course treatment, not a uniform style.

## Auth, teacher portal & progress tracking — built (2026-07-23 to 2026-07-31)

The portal work originally deferred below (see old architecture notes) has since shipped:

- **Teacher + student auth**, class-based content access (`3fc8fb4`, `f78e910`)
- **Topic-level access control** using compound `unitId:topicId` keys (not whole-course) — fixed a bug where two units sharing a bare topic ID (`impacts-of-technology`, `application-skills`, `project-management`) unlocked together; bare-ID fallback kept for pre-fix data (`107c734`)
- **Student lesson progress tracking end-to-end** — Redis-backed (`@upstash/redis`), `LessonCompleteButton` component, green-dot/hollow-ring indicators on course overviews and Foundations, teacher class view shows a progress bar + "X / Y lessons complete" per student (`c4e5415`)
- **Teacher tooling**: class creation, student roster management, 🎲 fun-passcode generator (color+animal+number) for onboarding (`29f5ec0`)
- **Nav**: persistent "My Course" (students) / "Dashboard" (teachers) header links; "next lesson" navigation now traverses across topic/unit boundaries and skips coming-soon units
- Storage backend moved to `@upstash/redis` after earlier KV reliability issues (env var naming, dynamic-require bugs, missing `force-dynamic`)

## Active plan (2026-09-20)

Plan file: `C:\Users\clayt\.claude\plans\federated-tumbling-meteor.md`. Phases: 0 shared foundations → 1 split Foundations into Y11/Y12 → 2 Foundations Edpuzzle/Brilliant shell → 3 General mastery tree + polish → 4 ATAR live layer (Redis polling) + code practice. Y7/8 deferred. Y12 ATAR has no content yet (placeholder).

**Phase 0 progress:** new block types in `lib/content/types.ts` (`checkpointVideo`, `interactiveDiagram`, topic `skillId`/`prerequisites`, lesson `mode`); pure logic + Vitest tests in `lib/logic/` (`npm test`). Shared components in `components/course/shared/` (`CheckpointVideoPlayer`, `DiagramRunner`, `MasteryTree`, `BucketSort`/`OrderSteps`) and Redis mastery helpers in `lib/db.ts` built — **not yet wired into any page or visually checked in a browser**. Phase 0 complete; next is Phase 1 (Foundations split).

## Deliberately not done yet

- **No visual/brand polish beyond Foundations** — Y7/8, Y9/10, ATAR, and General still render through the generic `CourseOverview` layout with brand colours only, no bespoke per-tier design yet.
- **Foundations theme still not manually browser-checked** — verified via build + server-rendered HTML only (see note above); do a real visual pass before calling it done.
- **Some Foundations interactive activity types render as static summaries**, not interactive widgets: drag-and-drop, hotspot, sort-buckets. (Matching, multiple-choice, fill-blank, ordering all render properly as static content.)
- **The 6 placeholder courses have zero content** — Years 7–10 and Year 12 General/ATAR never had prior material to migrate; this is genuinely new content that needs to be written.
- **AIT Foundations not yet split into Year 11 / Year 12** — still one course showing all 4 units together.

## Next steps (priority order, per Clayton)

1. **Visual/brand polish, per-course** — apply the distinct design direction above to each remaining tier. Y7/8 is the suggested next tier (largest cohort, can reuse the Foundations scoped-theme pattern).
2. **Split AIT Foundations into Year 11 and Year 12** — currently a single course showing all 4 units together. Split into two separate courses (Year 11 Foundations = Units 1–2, Year 12 Foundations = Units 3–4), each with its own card on the home page, matching the pattern of General and ATAR.
3. **Write new content for placeholder courses** — Years 7–10 and Year 12 ATAR have no curriculum content yet; this is authoring work, not migration
4. **Interactive activities** — upgrade the static drag-and-drop/hotspot/sort-bucket summaries into real interactive components

## How to resume

Read this file, then check `git log` in `mrgibbs-teach` to confirm nothing's changed since the last entry below.

| Date | What happened |
|------|---------------|
| 2026-06-18 | Site scaffolded, 9 courses placeholder, pushed to GitHub, deployed to Vercel |
| 2026-06-18 | Content migrated for Foundations/General/ATAR (first pass); placeholder courses greyed out on home page |
| 2026-06-19 | Closed remaining content gaps: General Unit 1, ATAR practice exam, ATAR glossary |
| 2026-06-19 | Captured design direction (each course should feel distinct) and future portal architecture (per-student, per-topic content release) — both deferred/recorded, not built |
| 2026-07-23 | Shipped teacher/student auth, topic-level access control, and end-to-end student progress tracking (Redis-backed) |
| 2026-07-31 | Added passcode generator, Foundations completion dots, cross-topic next-lesson navigation |
| 2026-08-28 | Reconciled this file with actual shipped state; removed stray `weekly-review.html` and unused duplicate `components/assets/` (agent photos already live in `public/agents/`) |
