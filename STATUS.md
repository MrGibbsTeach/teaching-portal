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

## Design direction (Clayton, 2026-06-19)

Each course should feel distinctly different — not one visual template stretched across all 9:

- **Y7/Y8 Digital Technologies** — similar feel to each other (intro-level)
- **Y9 Digital Innovations / Y10 Digital Enterprise** — similar feel to each other, distinct from Y7/8 (electives)
- **AIT ATAR (Y11→Y12 pathway)** — serious tone, exam-prep focused from day one of Y11, building toward the Y12 WACE exam
- **AIT General** — practical/hands-on, designed for student independence — minimal teacher involvement needed day-to-day
- **AIT Foundations** — rarely-selected, for students with extremely low literacy. Needs to be extremely simple/loud, near one-piece-of-information-at-a-time, very different UI from the other 8 courses

This should inform any visual/UX pass — apply per-course treatment, not a uniform style.

## Planned future architecture — teacher/student portal (NOT being built yet)

Explicitly deferred until the 9 courses are visually polished. When the time comes:

- Teacher portal for onboarding students: student names + access codes
- Teacher controls content release **per student**, granularly — not whole-course access by default. E.g. a Y11 ATAR student might start with access to just the Hardware topic, or even one part of it, with the teacher progressively releasing more as they go
- This is a deliberate sequencing call — don't start auth/portal work until explicitly asked, even though it's the natural next big feature after visual polish

## Deliberately not done yet

- **No auth, teacher portal, or progress-tracking** — the old General course had all three (NextAuth, teacher dashboard, student progress DB); none of it was carried over. Site is currently read-only published content. Supabase client is wired (`lib/supabase.ts`) but nothing uses it yet.
- **Some Foundations interactive activity types render as static summaries**, not interactive widgets: drag-and-drop, hotspot, sort-buckets. (Matching, multiple-choice, fill-blank, ordering all render properly as static content.)
- **No visual/brand polish** — pages are functional shadcn/ui defaults, no custom theme, logo, or styling pass yet.
- **The 6 placeholder courses have zero content** — Years 7–10 and Year 12 General/ATAR never had prior material to migrate; this is genuinely new content that needs to be written.

## Next steps (priority order, per Clayton)

1. **Visual/brand polish, per-course** — apply the distinct design direction above to each course. This is the current priority.
2. **Design the teacher/student portal** (talk through design before building — see architecture notes above). Don't start building until explicitly asked.
3. **Write new content for placeholder courses** — Years 7–10 and Year 12 General/ATAR have no curriculum content yet; this is authoring work, not migration
4. **Interactive activities** — upgrade the static drag-and-drop/hotspot/sort-bucket summaries into real interactive components

## How to resume

Read this file, then check `git log` in `mrgibbs-teach` to confirm nothing's changed since the last entry below.

| Date | What happened |
|------|---------------|
| 2026-06-18 | Site scaffolded, 9 courses placeholder, pushed to GitHub, deployed to Vercel |
| 2026-06-18 | Content migrated for Foundations/General/ATAR (first pass); placeholder courses greyed out on home page |
| 2026-06-19 | Closed remaining content gaps: General Unit 1, ATAR practice exam, ATAR glossary |
| 2026-06-19 | Captured design direction (each course should feel distinct) and future portal architecture (per-student, per-topic content release) — both deferred/recorded, not built |
