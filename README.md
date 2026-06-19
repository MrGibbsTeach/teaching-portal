# MrGibbs Teach

Unified teaching site for Digital Technologies / Applied Information Technology, Years 7–12. Next.js (TypeScript, App Router) + Tailwind CSS + shadcn/ui + Supabase.

This consolidates three previously separate projects, archived for reference at `D:\OneDrive\Personal\Work\archive\`:

- `11-ait-general-course` — Year 11 Applied IT, General (Next.js LMS: auth, teacher portal, DB-backed lessons)
- `11-ait-atar-course` — Year 11 Applied IT, ATAR (Vite + React + Supabase)
- `ait-foundations-course` — AIT Foundations, Year 11 & 12 (single-file static app)

The real lesson content from all three has been migrated into this site's unified content format (`lib/content/types.ts`, `lib/content/data/*.json`). The `scripts/transform-*.mjs` scripts perform that migration programmatically by reading the archived source files directly — re-run them if the archived content ever changes upstream. The six remaining courses (Years 7–10, and Year 12 General/ATAR) have no prior content and are placeholder-only.

As of the latest migration pass, all known real content from the three archived projects has been ported, including: ATAR's glossary (now a "Glossary" section on the ATAR course page) and Unit 1 practice exam (`src/data/unit1PracticeExam.js`, now a "Unit 1 Practice Exam" topic with MCQ/short-answer/extended/scenario sections), and the General course's previously "coming soon" Unit 1 — Personal Communication (`db/seed-unit1.ts`), now fully available alongside Unit 2.

Not carried over: auth, teacher portal, and progress-tracking from the old General course — this site is currently read-only published content. Interactive activity types from the Foundations course (drag-and-drop, hotspot, sort-buckets) are rendered as static summaries rather than full interactive widgets.

## Course list

- Years 7–10: Digital Technologies (7, 8), Digital Innovations (9), Digital Enterprise (10)
- AIT Foundations (Year 11 & 12)
- Applied IT General — Year 11, Year 12
- Applied IT ATAR — Year 11, Year 12

Course metadata lives in `lib/courses.ts`.

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL/anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
