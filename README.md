# MrGibbs Teach

Unified teaching site for Digital Technologies / Applied Information Technology, Years 7–12. Next.js (TypeScript, App Router) + Tailwind CSS + shadcn/ui + Supabase.

This consolidates three previously separate projects, archived for reference at `D:\OneDrive\Personal\Work\archive\`:

- `11-ait-general-course` — Year 11 Applied IT, General (Next.js LMS: auth, teacher portal, DB-backed lessons)
- `11-ait-atar-course` — Year 11 Applied IT, ATAR (Vite + React + Supabase)
- `ait-foundations-course` — AIT Foundations, Year 11 & 12 (single-file static app)

All three contain real authored lesson content (see each project's own files: `db/seed-lessons.ts` / `db/seed-topics-3-5.ts` for General, `src/data/modules.js` / `src/data/unit1PracticeExam.js` for ATAR, the embedded lesson sections in `index.html` for Foundations) that still needs to be ported into this site's content format. That migration is a separate follow-up phase — this repo currently has the site shell and placeholder pages for all 9 courses scaffolded.

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
