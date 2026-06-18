# MrGibbs Teach

Unified teaching site for Digital Technologies / Applied Information Technology, Years 7–12. Next.js (TypeScript, App Router) + Tailwind CSS + shadcn/ui + Supabase.

This consolidates three previously separate projects, archived for reference at `D:\OneDrive\Personal\Work\archive\`:

- `11-ait-general-course` — Year 11 Applied IT, General (Next.js LMS: auth, teacher portal, DB-backed lessons)
- `11-ait-atar-course` — Year 11 Applied IT, ATAR (Vite + React + Supabase)
- `ait-foundations-course` — AIT Foundations, Year 11 & 12 (single-file static app)

The real lesson content from all three has been migrated into this site's unified content format (`lib/content/types.ts`, `lib/content/data/*.json`). The `scripts/transform-*.mjs` scripts perform that migration programmatically by reading the archived source files directly — re-run them if the archived content ever changes upstream. The six remaining courses (Years 7–10, and Year 12 General/ATAR) have no prior content and are placeholder-only.

Not yet ported from the archived projects: ATAR's glossary (`src/data/glossary.js`) and Unit 1 practice exam page (`src/data/unit1PracticeExam.js`), and the General course's "coming soon" Unit 1 content (`db/seed-unit1.ts`). Also not carried over: auth, teacher portal, and progress-tracking — this site is currently read-only published content.

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
