# MrGibbs Teach

Teaching site for Digital Technologies / Applied Information Technology, Years 7–12 — WA WACE Foundations/General/ATAR plus the Years 7–10 Digital Technologies strand. Next.js (TypeScript, App Router) + Tailwind CSS + shadcn/ui, with teacher/student auth, class-based content access, lesson progress tracking and Nearpod-style live sessions, all backed by Redis (Upstash).

**Read [CURRENT_STATE.md](./CURRENT_STATE.md) first** — live URLs and what's true right now. [STATUS.md](./STATUS.md) has the full history and architecture notes; [CHECKPOINTS.md](./CHECKPOINTS.md) has recorded feedback not yet acted on. Keep this README to the stable, slow-changing basics (what the project is, how to run it) — day-to-day state lives in those three files, not here.

This originally consolidated three separate projects (archived at `D:\OneDrive\Personal\Work\archive\`: `11-ait-general-course`, `11-ait-atar-course`, `ait-foundations-course`) into one unified content format (`lib/content/types.ts`, `lib/content/data/*.json`). `scripts/transform-*.mjs` performed that migration programmatically; re-run them if an archived source ever changes. Since then the site has grown well past a read-only port of that content — see `CURRENT_STATE.md`/`STATUS.md` for what's shipped.

## Course list

| Years | Status |
|---|---|
| 7–10 (Digital Technologies / Innovations / Enterprise) | Placeholder — no content yet |
| 11 & 12 AIT Foundations | Active |
| 11 & 12 Applied IT General | Active |
| 11 & 12 Applied IT ATAR | Active |

10 courses total, 6 active. Metadata lives in `lib/courses.ts`.

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Required env vars (see `lib/db.ts`, `lib/session.ts`):

- `KV_REST_API_URL` / `KV_REST_API_TOKEN` **or** `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — the Upstash Redis database (classes, progress, live sessions, feedback, keep-alive). Without these set, reads/writes fall back to an in-memory stub that doesn't persist.
- `SESSION_SECRET` — signs the teacher/student session cookie.
- `TEACHER_PASSWORD` — the shared teacher login password.
- `CRON_SECRET` *(optional)* — if set, required by `/api/keep-alive` as `Authorization: Bearer $CRON_SECRET`.

`@supabase/supabase-js` is still a `package.json` dependency and `lib/supabase.ts` still exists, but nothing in the app imports it — the project moved to Redis as its storage backend (see STATUS.md) and this is unused leftover from the original scaffold, not a second backend in active use.

## Tests

```bash
npm test   # vitest — pure logic (lib/logic/*, app/actions/*)
npm run lint
npm run build
```
