# Status

Living tracker for where MrGibbs Teach is at. Update this whenever a session wraps up so the next one (you or Claude) can pick up cold.

**Live site:** https://teaching-portal-eta.vercel.app/ (auto-redeploys on every push to `main`)
**Repo:** https://github.com/MrGibbsTeach/teaching-portal (private)
**Archived source projects:** `D:\OneDrive\Personal\Work\archive\` (`11-ait-general-course`, `11-ait-atar-course`, `ait-foundations-course`) — untouched, kept for reference only

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

## Deliberately not done yet

- **No auth, teacher portal, or progress-tracking** — the old General course had all three (NextAuth, teacher dashboard, student progress DB); none of it was carried over. Site is currently read-only published content. Supabase client is wired (`lib/supabase.ts`) but nothing uses it yet.
- **Some Foundations interactive activity types render as static summaries**, not interactive widgets: drag-and-drop, hotspot, sort-buckets. (Matching, multiple-choice, fill-blank, ordering all render properly as static content.)
- **No visual/brand polish** — pages are functional shadcn/ui defaults, no custom theme, logo, or styling pass yet.
- **The 6 placeholder courses have zero content** — Years 7–10 and Year 12 General/ATAR never had prior material to migrate; this is genuinely new content that needs to be written.

## Next options (pick one when resuming)

1. **Visual/brand polish** — custom theme, logo, nicer lesson page layout, maybe a proper header nav instead of just a title link
2. **Auth + progress tracking** — wire up Supabase auth, a simple per-student progress model, maybe a teacher view (the old General course's `db/schema.sql` is a reasonable reference for the data model, but doesn't need to be copied wholesale)
3. **Write new content for placeholder courses** — Years 7–10 and Year 12 General/ATAR have no curriculum content yet; this is authoring work, not migration
4. **Interactive activities** — upgrade the static drag-and-drop/hotspot/sort-bucket summaries into real interactive components

## How to resume

Read this file, then check `git log` in `mrgibbs-teach` to confirm nothing's changed since the last entry below.

| Date | What happened |
|------|---------------|
| 2026-06-18 | Site scaffolded, 9 courses placeholder, pushed to GitHub, deployed to Vercel |
| 2026-06-18 | Content migrated for Foundations/General/ATAR (first pass); placeholder courses greyed out on home page |
| 2026-06-19 | Closed remaining content gaps: General Unit 1, ATAR practice exam, ATAR glossary |
