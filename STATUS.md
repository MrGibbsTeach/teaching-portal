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
  - AIT Foundations — Unit 2 "Applications in Practice" (Spreadsheets, Social Collaboration, Desktop Publishing, Digital Photography); Units 1/3/4 still genuinely empty (were empty in the original too)
  - Year 11 Applied IT General — both units (Personal Communication + Working with Others), full lesson content, quizzes, tasks
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

## Site-wide design overhaul (Clayton, 2026-09-25)

Ran a full critical design review and redesign to fix the site reading as generic/AI-generated (Geist font, default shadcn purple, everything wrapped in a rounded/bordered card, round-robin pastel colour-coding, badge/pill overuse, emoji-as-iconography, six inconsistent corner radii). Plan and diagnosis: `C:\Users\clayt\.claude\plans\logical-questing-codd.md`.

**What changed:** new typeface pair (Fraunces serif for display headings + Public Sans for body/UI, replacing Geist), a single restrained palette (warm paper background, ink foreground, one quiet teal `--primary` used only for emphasis/links — not tinted box fills), one collapsed radius scale (was 6 inconsistent values), and lesson/course content restyled to be typeset (headings, rules, whitespace) rather than boxed into cards. Touched: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `components/ui/{card,badge}.tsx`, `components/brand/Logo.tsx`, `components/course/{CourseOverview,BlockRenderer,GeneralLessonView,GeneralQuizBlock,AgentCard,CoursePlaceholder,LessonCompleteButton}.tsx`, all of `components/course/foundations/*`, `app/not-found.tsx`, `app/login/*`. Verified via `npm run build` + `npm run lint` (clean) and a server-rendered fetch of the home/login pages; **not yet checked in an actual browser** — no browser tool was available in that session, so do a real visual pass (desktop/tablet/mobile) before calling this done.

**Tension with the 2026-06-19 design direction below:** that note calls for each course tier to look *visually distinct* (different template per tier). This pass went the other way — one coherent typographic system used consistently everywhere, with tiers told apart by structure/type rather than a different colour identity each — because the presenting problem this time was the opposite one: pages/components looking independently generated rather than part of one product. Foundations keeps its accessibility-driven bespoke layout (large type, high contrast, one-screen-at-a-time), just restyled onto the same token system. Worth resolving explicitly before starting Y7/8 or ATAR-specific visual work: bespoke-per-tier and one-system-throughout pull in different directions.

## Deliberately not done yet

- **Per-tier bespoke visual systems (Y7/8, Y9/10, ATAR, General)** — still on the generic `CourseOverview`/`BlockRenderer` path, now under the new sitewide design system rather than the old shadcn defaults. Whether these should still get fully distinct per-tier treatments (per the 2026-06-19 note above) or stay within the unified system is an open question — see the tension noted above.
- **Foundations theme still not manually browser-checked** — verified via build + server-rendered HTML only (see note above); do a real visual pass before calling it done.
- **Teacher portal pages (`app/teacher/*`) got only the token cascade**, not a dedicated rewrite — lower priority as an internal-only surface, but still shows the old spacing/structure patterns.
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
| 2026-09-25 | Full sitewide design overhaul (new type/colour/shape system, de-carded lesson content, de-emoji'd copy) to fix the "AI-generated" look; build + lint clean, not yet browser-checked |
