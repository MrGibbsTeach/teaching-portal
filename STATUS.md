# Status

Living tracker for where MrGibbs Teach is at. Update this whenever a session wraps up so the next one (you or Claude) can pick up cold.

**Live site:** https://teaching-portal-eta.vercel.app/ (auto-redeploys on every push to `main`)
**Repo:** https://github.com/MrGibbsTeach/teaching-portal (private)
**Archived source projects:** `D:\OneDrive\Personal\Work\archive\` (`11-ait-general-course`, `11-ait-atar-course`, `ait-foundations-course`) — untouched, kept for reference only
**Curriculum reference docs:** `course-reference/<course-slug>/` (one folder per course) — curriculum documents, marking guides, past exams. Gitignored (local only, not on GitHub) — check here for source material when working on a specific course. See `course-reference/README.md`.

## Done

- Site scaffolded: Next.js (TypeScript, App Router) + Tailwind + shadcn/ui + Supabase client
- All 10 courses exist as routes; metadata in `lib/courses.ts` (grew from 9 to 10 when AIT Foundations split into separate Year 11 and Year 12 courses, 2026-09-20 — see below)
- Home page groups courses into Years 7–10 / AIT Foundations / Year 11 & 12 Applied IT
- Placeholder courses (Y7/Y8 Digital Technologies, Y9 Digital Innovations, Y10 Digital Enterprise, Y12 Applied IT General, Y12 Applied IT ATAR) render greyed out with a "Coming soon" badge and aren't clickable — no real content exists for these yet
- **Content migration complete** for the 3 courses that had prior content:
  - AIT Foundations — all 4 units populated (71 lessons: Computer Foundations, Applications in Practice, Applied Digital Skills, Online Ethics & Multimedia); only 6 videos so far
  - Year 11 and Year 12 Applied IT General — 2 units each (10 topics per year), full lesson content, quizzes, tasks; Apprenticeship Framework topics deployed
  - Year 11 Applied IT ATAR — both units (10 modules), lessons + quiz + practice questions + exam practice, plus a "Unit 1 Practice Exam" topic (full 100-mark mock exam) and a "Glossary" section
  - Migration was done programmatically via `scripts/transform-{general,atar,foundations}.mjs` — these read the archived projects' source files directly and convert to the unified schema (`lib/content/types.ts`). Re-run them if archived sources ever change.
- **Year 12 Applied IT ATAR — content built 2026-09-27, committed and shipped 2026-10-10.** `status: "active"` in `lib/courses.ts`; `lib/content/data/year-12-applied-it-atar.json` — Unit 3 "Evolving Digital Technologies" and Unit 4 "Digital Technologies Within a Global Society" (official SCASA titles), 10 topics (Design Concepts, Hardware, Impacts of Technology ×2, Application Skills ×2, Project Management ×2, Managing Data, Networks), 62 lessons, 892 blocks. Source: Clayton's own Word-doc lesson notes at `D:\OneDrive - Catholic Education Western Australia\General - Digital Technologies Master [8165]\AIT\Year 12\Content backup\*.docx` (not the old archived-project format), converted via a one-off unzip+regex XML text extractor (kept only in the session scratchpad, not committed — the docx source has no reusable transform script the way General/ATAR-Y11/Foundations do). Content — objectives, success criteria, tables, WACE-style questions and marking keys — was preserved verbatim from Clayton's docs, not rewritten. Verified: `npm run build`, `npm test` (59 tests) both pass, and every one of the 892 blocks was server-rendered in isolation with no errors. **Not yet visually checked in a browser** (course pages sit behind teacher/student login, not spot-checked past the render-isolation test). Also fixed while doing this: Checkpoint 2 (ATAR lessons had no "Next lesson" link) — see CHECKPOINTS.md.
- **Year 12 Applied IT General — content overhauled 2026-09-27, committed and shipped 2026-10-10.** All 10 existing topics (same ids/titles as before — `lib/logic/general-tree.ts` prerequisites untouched) had their `lessons` array fully replaced: 56 lessons, 1064 blocks, from a fresh 2027 lesson-deck set at `...\Year 12\Assessment Tasks 2027 GENERAL\12 AIT General Content\Term {1,2,3} (Unit ...)\*.pptx` (one .pptx per lesson, named `T{term}W{week}_L{lesson}_{Title}.pptx`). Unlike the ATAR docx source, these 56 decks all follow one exact 9-slide template (verified across every file before writing the converter) — title/context, objective+criteria, key-terms table, worked example, synthesis, test tip, practice questions (always exactly 2), marking key, self-check+next-step — so the conversion is a **deterministic script**, `scripts/transform-y12-general-2027.mjs` (committed, re-runnable if Clayton drops a refreshed deck set), not LLM-driven per-file authoring. Each lesson's topic was assigned from the deck's own "Unit N | content area" breadcrumb text (authoritative, not guessed). One flagged exception: `T1W6_L3_Audio_Software_Features` labels itself "Unit 4" in-deck but sits in the Term 1 (Unit 3) folder next to its Unit-3 Application Skills siblings — filed under `application-skills-u3`, worth Clayton double-checking. Verified the same way as ATAR: `npm run build`, `npm test`, and all 1064 blocks server-rendered in isolation with no errors — not yet visually browser-checked. **Caveat:** lesson ids changed (new deck-derived ids replace the old ones), so any real student's previously-tracked lesson-completion progress for this course won't match the new ids and will appear reset — check whether any class has been using this course for real before treating that as a non-issue.
- **Year 12 General: mentor voice restored + 19 hands-on tasks added (2026-10-10).** The 2027 deck migration above carried over zero mentor-voice callouts despite `lib/agents.ts` mapping every Y12 topic to a mentor (Checkpoint 1's complaint, in its purest form — AgentCard showing a profile with nothing underneath in that voice). `scripts/add-y12-general-mentor-voice.mjs` + `y12-general-mentor-voice-data.mjs` added four callouts per lesson (ticket, senior-wisdom, pr-review, sandbox), each tied to that lesson's own worked-example scenario, each mentor using a label scheme suited to their own profession (Leo: creative brief/design review; Sparky: job ticket/callback check; Elara: case file/case review; Rory and Sloane keep ticket/PR-review, since they already run a sprint studio and a data audit respectively) rather than one dev skeleton over everyone — answers Checkpoint 1's open question 1. Nothing existing was edited; blocks went 1066 → 1290. Then `scripts/add-y12-general-tasks.mjs` + `y12-general-tasks-data.mjs` added 19 real hands-on `task` blocks (the course had zero, versus 19 in Y11 General) at the same density Y11 concentrates its own — Application Skills, Project Management, plus Managing Data (Y12's version is itself hands-on). Both idempotent, both build+test+lint clean. Not yet visually browser-checked.
- **Foundations hotspot activities restored (2026-10-10).** The migration had discarded the original SVGs and hotspot coordinates, leaving two Y11 activities as text-only placeholders. `scripts/transform-foundations.mjs` now preserves those source fields, and the Foundations lesson view renders the two activities with numbered targets, progress feedback, and keyboard/touch controls. The current course JSON was updated only for those two blocks because rerunning the legacy transform would also overwrite later content changes. Browser-checked at desktop and 390px mobile width: all targets stay inside their diagrams, keyboard activation works, and solving each activity enables the next lesson card. `npm test` (76 passed), `npm run build` passed, and lint reports no errors.
- **Mobile header spacing improved (2026-10-10).** Hide the teacher/student identity label below the `sm` breakpoint and tighten header gaps on narrow screens. Browser-checked at 390px: the logo and navigation no longer overlap, and the page has no horizontal overflow.
- **Year 12 ATAR: practice exam + glossary added (2026-10-10).** Both were the flagged gap below ("No practice exam or glossary yet for Y12"). `scripts/build-y12-atar-glossary.mjs` compiles every key term already in the Y12 ATAR content into a 129-term, 7-group A-Z glossary (same grouping Y11 uses) — nothing invented, duplicate terms keep the longer definition. `scripts/build-y12-atar-practice-exam.mjs` + `y12-atar-practice-exam-data.mjs` built a 100-mark, 2h30 mock exam in Y11's four-section shape (MCQ / Short Answer / Extended business scenario / Scenario), added to Unit 4 — but unlike Y11's exam (Unit 1 only), this one spans both Y12 units, matching the real end-of-year WACE exam. Every fact tested is drawn from what the course's own lessons teach. Section totals are computed from the question data, not hardcoded, so they can't drift the way Y11's exam did (labelled 100 marks, sections actually sum to 144). Both idempotent, both build+test+lint clean. Not yet visually browser-checked.

## Visual/brand polish — in progress (Clayton, 2026-06-29)

Decided approach: **one overall brand** (logo, header/footer, shared across all courses) + **fully bespoke per-tier visual systems** within each course's content area (not just a palette swap — distinct layouts/components per tier). Five tiers: Y7/8, Y9/10, ATAR (Y11→12), General (Y11→12), Foundations.

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

**Phase 0 progress:** new block types in `lib/content/types.ts` (`checkpointVideo`, `interactiveDiagram`, topic `skillId`/`prerequisites`, lesson `mode`); pure logic + Vitest tests in `lib/logic/` (`npm test`). Shared components in `components/course/shared/` (`CheckpointVideoPlayer`, `DiagramRunner`, `MasteryTree`, `BucketSort`/`OrderSteps`) and Redis mastery helpers in `lib/db.ts` built — **not yet wired into any page or visually checked in a browser**. Phase 0 complete. **Phase 1 (Foundations split) done** — old classes migrate on read (all-Y12 topics → Y12, mixed → Y11), so a class that spanned both years now only sees Y11 and needs re-pointing by the teacher; **Phase 2 shell wired** — `FoundationsCardCheck` now renders `checkpointVideo`, `interactiveDiagram` and sort-into-buckets (9 existing bucket activities are now interactive). **Video checkpoints (2026-09-20):** the 6 Foundations videos are now `checkpointVideo` blocks (`scripts/add-foundation-checkpoints.mjs`) with **end-of-video** questions and anti-skip (no mid-video timestamps — transcripts could not be fetched and nobody has timed the videos). **Three videos do not match their lessons** — c11_4_l1 (Email), c11_4_l3 (Privacy), c12_5_l1 (Social media) use general "how the internet works" videos — so they only get one basic-internet question; consider replacing them. No lesson uses `interactiveDiagram` yet. Not yet checked in a browser.

## Site-wide design overhaul (Clayton, 2026-09-25)

Ran a full critical design review and redesign to fix the site reading as generic/AI-generated (Geist font, default shadcn purple, everything wrapped in a rounded/bordered card, round-robin pastel colour-coding, badge/pill overuse, emoji-as-iconography, six inconsistent corner radii). Plan and diagnosis: `C:\Users\clayt\.claude\plans\logical-questing-codd.md`.

**What changed:** new typeface pair (Fraunces serif for display headings + Public Sans for body/UI, replacing Geist), a single restrained palette (warm paper background, ink foreground, one quiet teal `--primary` used only for emphasis/links — not tinted box fills), one collapsed radius scale (was 6 inconsistent values), and lesson/course content restyled to be typeset (headings, rules, whitespace) rather than boxed into cards. Touched: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `components/ui/{card,badge}.tsx`, `components/brand/Logo.tsx`, `components/course/{CourseOverview,BlockRenderer,GeneralLessonView,GeneralQuizBlock,AgentCard,CoursePlaceholder,LessonCompleteButton}.tsx`, all of `components/course/foundations/*`, `app/not-found.tsx`, `app/login/*`. This was done against the pre-Phase-1/2/3 codebase and then merged forward onto everything above (Foundations Y11/Y12 split, checkpoint videos, interactive diagrams, code exercises, live sessions) — the merge resolved cleanly except for three files (`STATUS.md`, `app/page.tsx`, `components/course/BlockRenderer.tsx`), all reconciled by hand; `interactiveDiagram`'s wrapper was flattened to match the new shape language while resolving. Verified via `npm run build` + `npm run lint` (clean) and a server-rendered fetch of the home/login pages; **not yet checked in an actual browser** — no browser tool was available in that session, so do a real visual pass (desktop/tablet/mobile) before calling this done, and specifically re-check the newer surfaces (live sessions, code exercises, mastery tree, checkpoint videos) since the design pass never saw them rendered.

**Tension with the 2026-06-19 design direction below — resolved 2026-09-25, see below.**

## Five-tier design system (Clayton, 2026-09-25)

Resolved the tension above: **one master system, five tier identities** — matching the original 2026-06-19 grouping (Y7–8 / Y9–10 electives / Foundations / General / ATAR), reconfirmed directly by Clayton this session.

**Mechanism:** `Course.tier` (new field on every course in `lib/courses.ts`) drives a `theme-{tier}` class that tints only `--primary`/`--ring`/`--accent`/`--accent-foreground` in `app/globals.css` — background, radius and type stay constant across all tiers, which is what reads as "one site" rather than five. Applied by the new `TierTheme` component (`components/course/shared/TierTheme.tsx`, modelled on the existing `FoundationsThemeRoot`) on `<html>` for a course/lesson page, or scoped locally per `<section>` on the home page so all five can preview at once. Palette: brand teal (site chrome, unchanged) · Y7–8 warm amber · Y9–10 plum · Foundations teal (unchanged, already accessibility-tested) · General terracotta · ATAR ink-indigo.

**Also fixed:** the previous session's design pass never touched the components that only existed after the merge — `GeneralCoursePage`, `MasteryTree`, `LessonShell`'s feedback button, `CheckpointVideoPlayer`, `CodeExercise`, `DiagramRunner`, `InteractiveActivities` (BucketSort/OrderSteps), `LiveStudent`, `LiveTeacher`, the teacher insights/class pages, and the generic (ATAR) lesson branch. All brought onto the master system: literal `emerald-*`/`red-*` correct/incorrect colours → `--primary`/`--destructive` tokens, emoji-as-icon (🔒✅❌😕🛠️😓💬 etc.) dropped, `rounded-xl`/`rounded-2xl`/`border-2` card-boxing flattened to the one shape language (MasteryTree's topic nodes and DiagramRunner's status frame kept `border-2` deliberately — legitimate bounded/stateful UI, not decorative).

**New:** `ATARCoursePage.tsx` (ATAR had no bespoke overview before — it called the generic `CourseOverview` directly with no tier wrapper). Also found and fixed a real bug while wiring this up: the home page's "Years 7–10" was a *single* heading/group spanning both the y7-8 and y9-10 tiers, so the y9-10 accent never actually applied — split into two proper groups ("Years 7–8" / "Years 9–10 — Electives") in `lib/courses.ts`.

**Verified:** `npx tsc --noEmit` clean, `npm run lint` clean (same 5 pre-existing warnings as before, no new ones), `npm test` — 59 passed, and a server-rendered fetch of the home page confirms all four non-Foundations tier classes render. `npm run build` itself failed both times on an unrelated Windows/OneDrive `EPERM` unlinking the same `.next/static` file — a sync-lock conflict with the already-running dev server, not a code issue; re-run it from a clean `.next` (or with OneDrive sync paused) to confirm before trusting it fully. **Still not manually checked in a real browser** — same caveat as the design overhaul above, now doubly true since this pass touched even more surfaces (live sessions, code exercises, mastery tree) sight-unseen.

## Deliberately not done yet

- **Y7–8 and Y9–10 have no lesson-level content** to actually theme yet — both tiers are still `CoursePlaceholder` only (confirmed via `lib/courses.ts`). The tier accent and theme wiring are in place and will apply automatically the moment real content exists; genuinely blocked on content, not a design decision.
- **Foundations theme still not manually browser-checked** — verified via build + server-rendered HTML only (see note above); do a real visual pass before calling it done.
- **Teacher portal pages (`app/teacher/*`) got only the token cascade**, not a dedicated rewrite — lower priority as an internal-only surface, but still shows the old spacing/structure patterns.
- **Foundations interaction status:** matching, multiple-choice, fill-blank, ordering, and category sorting are interactive; the two migrated hotspot cards are now interactive too. Category sorting uses tap-to-place controls rather than pointer drag gestures, which also works on touch screens and keyboards.
- **Years 7–10 (4 courses) still have zero content** — never had prior material to migrate; this is genuinely new content that needs to be written. (Year 12 General and Year 12 ATAR are no longer in this list — both shipped, see above; all 6 of the originally-placeholder Y11/Y12 courses now have real content.)
- (Done 2026-09-20) AIT Foundations is now split into `year-11-ait-foundations` (units 1–2) and `year-12-ait-foundations` (units 3–4); `ait-foundations.json` remains the single authoring source and is split in `lib/content/index.ts`. Legacy `ait-foundations` URLs and old classes are redirected/migrated.

## Next steps (priority order, per Clayton)

Stale as of 2026-10-10 — items 2 and 3 below are now done (Foundations split 2026-09-20; Y12 General and Y12 ATAR content both shipped). Current priority is `CURRENT_STATE.md`'s "Next step" list; keeping this numbered list only as the last record of Clayton's own ordering before this session's work, for comparison.

1. **Visual/brand polish, per-course** — apply the distinct design direction above to each remaining tier. Y7/8 is the suggested next tier (largest cohort, can reuse the Foundations scoped-theme pattern). **Still open.**
2. ~~Split AIT Foundations into Year 11 and Year 12~~ — done 2026-09-20.
3. ~~Write new content for placeholder courses~~ — Y12 General and Y12 ATAR done; Years 7–10 still open, folded into the point above.
4. **Interactive activities** — upgrade the static drag-and-drop/hotspot/sort-bucket summaries into real interactive components. **Still open.**

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

## General audit (2026-09-20, `node scripts/audit-general.mjs`)

All 20 General topics (Y11 + Y12) have lessons and quizzes; nothing is empty or thin. Gaps are in interactivity and media:
- **No interactive block at all:** Y11 design-concepts, hardware, and all 5 working-with-others topics; Y12 unit3 hardware and unit4 networks.
- **No task:** hardware (both years), impacts-of-technology (both), managing-data (Y11), networks (both).
- **No video:** 14 of 20 topics.
**Done:** General overviews (Y11 + Y12) now render a per-unit `MasteryTree` (`components/course/GeneralCoursePage.tsx`; prerequisite rules in `lib/logic/general-tree.ts` — application-skills needs the first two topics, project-management needs application-skills; teachers see everything unlocked; students only see topics their class unlocked). Verified server-rendered as teacher only; student view not browser-checked.
Next for Phase 3: add diagram/video nodes to the topics above (hardware, networks, managing-data first).

**General diagrams (2026-09-20):** `scripts/add-general-diagrams.mjs` added 6 `interactiveDiagram` blocks to topics that had no interactive block — Y11: input/output devices (match), hardware troubleshooting, network troubleshooting, network security (toggle checklists); Y12: maintenance checklist, network topologies (match). Wrong state shows red, right shows green (no text popups). Still no interactive block in Y11 design-concepts and the other working-with-others topics (managing-data, impacts, application-skills, project-management), and Y12 hardware topic other than maintenance. Not yet checked in a browser (server render verified only).

**ATAR HTML/CSS editor (2026-09-20):** new `codeExercise` block (`components/course/shared/CodeExercise.tsx`): HTML + CSS panes, live preview in a sandboxed iframe (no scripts), "Check my work" autograder (`lib/logic/code-exercise.ts`: exists/count/text/attr/style checks against the rendered DOM), credits mastery via `app/actions/mastery.ts`. Two graded exercises added to Y11 ATAR `application-skills-5-web-authoring-online-collaboration` (`scripts/add-atar-code-exercises.mjs`); unit tests confirm starters fail and reference solutions pass (jsdom). Not yet checked in a real browser — in particular style checks read computed longhands (e.g. `border-top-left-radius`), which jsdom can't fully confirm. Still to build for ATAR: Nearpod-style live sessions (Redis polling) and the ATAR revision tree.

**ATAR/any-course live sessions (2026-09-20):** Nearpod-style teacher-paced sessions, Redis polling every 2s (no new services). Teacher: class page → "Start or resume live session" (`/teacher/classes/[id]/live`) — pick any lesson, each block is a slide; Previous/Next, "Show answer to students", live response bars + per-student heatmap chips, "All slides" jump list, End session. Students: header "Live session" link → `/courses/[slug]/live` follows the teacher's slide; question slides are answered live (answer hidden from the payload until revealed); code-exercise slides (HTML/CSS editor) report their score to the teacher's heatmap. Code: `lib/logic/live.ts`, `app/actions/live.ts`, `app/api/live/route.ts` (checks session itself — the proxy does not guard `/api`), `components/live/`. Storage keys `mg_live:{classId}` and `mg_live_resp:{classId}:{sessionStart}:{slide}` expire after 6h; responses are scoped per session. Covered by an integration test (`app/actions/live.test.ts`), **not yet tried with real students/browsers**. Diagram slides are not redacted (they check answers client-side).
**Not built:** ATAR mastery-tree revision layer (Khan-style) and seeding it from live results; Y12 ATAR content; Y7/8.
**Security:** the public `/api/debug-kv` route was deleted (2026-09-20). Student passcodes are still stored in plain text in Redis — use only the generated fun passcodes.

## Open item — Year 12 Foundations videos (2026-10-10, awaiting Clayton's pick)

7 of the 9 Y12 Foundations topics have no `checkpointVideo`, and the one in Online Ethics (`c12_5_l1`, "Social Media Tools") uses a generic "how the internet works" video that doesn't actually match the lesson (noted 2026-09-20, never fixed). Deliberately **not sourced unilaterally** — picking a specific YouTube video for a live, login-gated site, for the course's lowest-literacy cohort, isn't something to guess at from search snippets alone; it needs an actual watch. WebSearch surfaced real candidate links but could not confirm duration, pacing or content accuracy — only titles and upload age. Shortlist, ranked by confidence, for Clayton to skim (~30s each) and confirm/reject:

| Topic → lesson | Candidate | Confidence |
|---|---|---|
| Word Processing → *Formatting a Document* (`c12_2_l1`) | [Microsoft Word Tutorial - Basic Formatting](https://www.youtube.com/watch?v=2RI4pKt7j8Q) | Good title match |
| Website Development → *What is a Website?* (`e12_4_l1`) | [What is a website?](https://www.youtube.com/watch?v=Fe9jMMYmxKk) | Good title match |
| Project Management → *The Design Process* (`c12_4_l1`) | [Basics of Project Management ...in 4 minutes](https://www.youtube.com/watch?v=AOmS_UrnBD0) | Good — shortest found |
| Spreadsheets → *Quick Recap: Spreadsheet Basics* (`c12_6_l1`) | [How to Use Excel for Beginners in 10 Minutes](https://www.youtube.com/watch?v=Ai0MV7twEBE) | Good — shortest found |
| Sound Editing → *What Sound Editing Software Does* (`e12_1_l1`) | [Audacity Tutorial for Beginners in 9 Minutes](https://www.youtube.com/watch?v=C_mHOHv28Ic) | Good — matches the free software the course would use |
| Online Ethics → *Social Media Tools* (`c12_5_l1`, **replaces the current mismatched video**) | [Social Media in Plain English](https://www.youtube.com/watch?v=MpIOClX1jPE) | Good — Common Craft plain-English style, closest fit to this audience |
| Presentation Software → *Presentation Features* (`c12_3_l1`) | — none found short enough (everything run was 20+ min) | Weak — needs Clayton's own channel pick |
| Video Editing → *What Video Editing Software Can Do* (`e12_2_l1`) | — several candidates, couldn't confirm which is actually shortest | Weak — needs Clayton's own channel pick |

Once Clayton confirms any of these (or supplies alternatives), wiring them in is fast: convert to a `checkpointVideo` block with an end-of-video question, the same pattern `scripts/add-foundation-checkpoints.mjs` already used for the existing 6 Y11/Y12 Foundations videos.

## Checkpoints (2026-09-20)

Recorded review notes and feedback that are **not yet implemented** live in `CHECKPOINTS.md`: (1) General course mentors/"professionals" review — the voice is fenced into four callouts, the card is generic, and 4 of 6 Y11 Design lessons lost their mentor voice; (2) Y11/Y12 ATAR lessons have no "Next" link after completing. More feedback is being collected there.

**Feedback + quiz tracking (2026-09-20):** every lesson (General, Foundations, ATAR) has a floating "Something wrong?" button (category chips + optional note) saved to Redis (`mg_feedback`); General and Foundations quiz answers (mcq / true-false, first pick) are counted per class (`mg_qstats:{classId}`, keyed by a hash of the question text so reordering lessons does not scramble results; right/wrong is decided on the server). Teacher page: `/teacher/insights` (nav "Insights") lists notes with "Mark as done" and the hardest questions with the most common wrong answer, filterable by class. Not counted: teachers previewing, ATAR quizzes (they show answers, no answering), video-checkpoint questions. Integration-tested; not yet tried by real students.

## 3D animations in lessons (2026-10-19, branch `add-3d-animations`)

- New block type `animation3d` (`lib/content/types.ts`, rendered by `components/course/shared/Animation3D.tsx`): an iframe of a self-contained Three.js animation in `public/animations/`, an "Open full screen" link, a lesson-specific caption, and "Pause and check" questions (one per stage, answers behind a reveal). Foundations shows it as a card with the usual confirm gate.
- Three animations, each a single HTML file with Three.js bundled inline (works offline, no CDN): `inside-the-computer.html` (input, storage, memory, processing, output with real parts), `packet-journey.html` (packets, switch, router, internet routers, Wi-Fi, reassembly, ACK), `binary-lights.html` (bit, byte, number, ASCII letter, RGB pixel). Each has stage buttons, pause, and a speed control (default half speed). `?embed=1` hides the title card and compacts the controls for the lesson frame.
- Placed by `node scripts/add-3d-animations.mjs` (idempotent) in 12 lessons: Y11 Foundations `c11_1_l2`; Y11 General `cpu-and-memory`, `components-of-a-wireless-network`, `common-file-formats`; Y11 ATAR `hardware-1-computer-systems-the-cpu`, `networks-2-network-hardware`, `application-skills-1-image-editing`; Y12 General `hardware-1-cpu-and-memory`, `networks-1-networking-concepts`, `application-skills-u3-2-graphic-and-audio-file-formats`; Y12 ATAR `hardware-2-1-components-of-a-computer`, `networks-7-2-tcp-ip`. Questions are pitched per tier (Foundations, General, ATAR).
- The animation sources and build live outside this repo; the register of built and planned animations is the Project doc `3d-animation-register.md`. Y7 and Y8 courses are still placeholders, so the Y7 placements for Binary Lights wait until those courses have content.
- Verified: `npm test` (76 passed), `npm run lint` (0 errors), `tsc --noEmit` clean, lesson pages screenshotted in Chromium at desktop and 390px. `npm run build` could not run in the cloud sandbox because Google Fonts is blocked there; Vercel's preview build is the build check.

## Pre-student infrastructure (2026-10-10)

**Done (commit `0c3791f`, domain changes made live via the Vercel API in this session):**
- **Keep-alive** — `pingDatabase()` in `lib/db.ts`, called by `/api/keep-alive`, run daily at 03:00 by the cron in `vercel.json`. Set a `CRON_SECRET` env var in Vercel to close the route to anyone else (the route enforces `Authorization: Bearer $CRON_SECRET` whenever that var exists; without it the route still works and leaks nothing beyond whether the DB is reachable).
- **Polling** — the flat 2 s interval is gone. `components/live/useLivePoll.ts` makes **no request at all while the tab is hidden**, waits 15 s while no session is running and 5 s while one is, and catches up the instant the tab is shown. Used by both `LiveStudent` and `LiveTeacher`. That takes a 30-student double period from roughly 200k commands/hour to a small fraction of it, inside the 500k/month free tier.
- **Export** — teacher-only `/api/export` returns CSV; "Download backup (CSV)" on the teacher dashboard (all classes) and on each class page (that class). Pure logic in `lib/logic/export.ts`, 17 tests. Includes passcodes so a backup is actually restorable, quotes every field, defuses leading `=`/`+`/`-`/`@` so a roster cannot execute when opened in Excel, and sends a BOM so names read correctly.
- **Domain — fully live (2026-10-10).** `mrgibbsteach.com` and `www.mrgibbsteach.com` (308 → apex) are added to the Vercel project, ownership-verified, and Clayton added the A (`@` → `76.76.21.21`) and CNAME (`www` → `cname.vercel-dns.com`) records in Cloudflare, both set to **DNS only** (proxy off, required for Vercel to issue the certificate). Confirmed via `get_domain_config`: `misconfigured: false`. Students log in at `mrgibbsteach.com/login/student`.

**Why the domain matters more than it looks:** the project has `ssoProtection` set to `all_except_custom_domains`, so every `*.vercel.app` URL is behind Vercel's own login. Students genuinely cannot use `teaching-portal-eta.vercel.app` — the custom domain is the only route in for them, not a cosmetic upgrade. That setting is correct as-is: it keeps the preview URLs private and the custom domain public.

**Before real students (still to do):**
- Separate Redis database for Preview deployments and a `staging` branch, so testing does not mix with student data.
- Check the site loads from a student device on the school network; check the school's policy on student data.
- Open checkpoints in `CHECKPOINTS.md` (General mentors review) plus feedback still to come from the other courses.
- Nothing is browser-checked yet — see the repeated notes above.

**(Done 2026-09-27) Year 12 AIT ATAR built and shipped** — see the "Content migration complete" section above for what's in it. `course-reference/year-12-applied-it-atar/` is still empty (the syllabus text came via chat, not a dropped file) — worth adding the actual SCASA syllabus PDF there if Clayton wants it for future reference. No practice exam or glossary yet for Y12 (Y11 has both) — could be added later the same way Y11's were.

**2026-09-25 — sitewide design overhaul:** new type/colour/shape system replacing the default Geist/shadcn-purple look; lesson content restyled to be typeset rather than boxed into cards throughout. See "Site-wide design overhaul" above for detail. Merged onto everything in this section (Foundations split, checkpoints, diagrams, code exercises, live sessions, insights) — build + lint clean, not yet browser-checked, so treat all the "not yet checked in a browser" notes above as still open.

**2026-09-25 — five-tier design system:** resolved the tension above the same day — one master system, five tier accents (Y7–8/Y9–10/Foundations/General/ATAR), plus brought every merged-in component (MasteryTree, live sessions, code exercises, checkpoints, teacher insights) onto the master system for the first time. New `ATARCoursePage`; `Course.tier` field; split the home page's "Years 7–10" group in two so Y9–10 actually gets its own accent. See "Five-tier design system" above for detail.
