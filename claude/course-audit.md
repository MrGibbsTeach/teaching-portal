# Course Audit (21 Oct 2026)

Read-only audit of the teaching-portal code and course content, done so the next course improvement session can start building straight away. Nothing was changed. Limits: this is a code and content audit. The lessons were not viewed rendered in a browser, so layout, spacing, mobile behaviour and visual polish still need a screenshot pass (first step below). Numbers come from `lib/content/data/*.json` on 21 Oct 2026 and will drift as content changes.

## The owner's verdict

Lessons are static, boring and too similar: a little content, approve, move on. The audit confirms this is built into the structure, not just the writing.

## Findings

### 1. Two lesson formats, both passive

- **Foundations** (`components/course/foundations/FoundationsLessonView.tsx`): one block per screen, with Back and Next, a segmented progress bar and a gate. Several block types need an "I understand" tap before Next unlocks (`ConfirmGate` in `FoundationsCardCheck.tsx`). That tap is the "approve, move on" loop. It confirms a click, not learning.
- **General and ATAR** (`GeneralLessonView.tsx`): one long scrolling page of blocks, then a "Mark as complete" button (`LessonCompleteButton.tsx`) the student presses themselves, and an "Up next" link. Completion is self-declared and not tied to doing anything.
- Both are one layout with a different skin. There is no hook, no variety in pacing, no visible reward and no "what you can do now" ending.

### 2. Content is mostly reading

Median per lesson, by course (blocks that are reading, quiz questions, interactive or task blocks):

| Course | Lessons | Median blocks | Median reading | Median quiz | Median words | Lessons with no interactive or task block | Lessons with no quiz |
|---|---|---|---|---|---|---|---|
| Foundations (Y11 and Y12 share one file) | 68 | 13 | 8 | 4 | 466 | 1 | 0 |
| Y11 General | 61 | 14 | 11 | 3 | 1153 | 32 | 4 |
| Y12 General | 56 | 23 | 21 | 2 | 807 | 33 | 0 |
| Y11 ATAR | 80 | 5 | 4 | 0 | 372 | 71 | 46 |
| Y12 ATAR | 67 | 12 | 11 | 2 | 494 | 62 | 24 |

- Foundations is the most interactive course (activities in 75 blocks across 68 lessons) because of the card format.
- General is walls of callouts, headings and tables: Y12 General has a median of 21 reading blocks per lesson and over 1,100 words in some Y11 lessons.
- ATAR has many lessons with no quiz and almost nothing interactive. Some ATAR "lessons" are exam sections (for example Y11 "Section 4 Scenario", about 2,100 words), which are exam papers presented as reading, not lessons.
- Only 56 to 64 lessons per course have no video block at all, and the 3D animations are in 12 lessons (the rest of the course has none).

### 3. Block types exist that are barely used

`lib/content/types.ts` already supports `interactiveDiagram`, `codeExercise`, `formulaBuilder`, `scenarioChallenge`, `spotTheThreat`, `codePreview`, `checkpointVideo` and hotspot activities, and `DiagramRunner`, `MasteryTree` and `CheckpointVideoPlayer` exist. Counts show spotTheThreat 2, checkpointVideo 6 and animation3d 1 in Foundations. The tools to make lessons active are mostly built. The content is not using them. Rank 1 can reuse these rather than build new.

### 4. Quiz feedback is partly good

- Multiple choice and true/false give instant right or wrong plus an explanation (`GeneralQuizBlock.tsx`, `FoundationsCardCheck.tsx`). This part of backlog rank 3 already exists.
- Short answer and extended questions are only "reveal the answer" buttons. There is no self-marking, no rubric, no "how close was I". This is the gap for ATAR and General, where most marks are written answers.

### 5. What is recorded per student

- Per student: lesson completion (self-pressed button) and skill scores from practice blocks (`recordSkillScore`, `MasteryTree`).
- Per class only: quiz answers are counted as class-level stats per question (`recordQuizStats`), so the teacher sees "hardest quiz questions" on `/teacher/insights` but cannot see which student got what.
- So backlog rank 2 (per-student results) is a real build: store each student's answers, not just class counters. Student data and privacy rules in the strategy risks apply before collecting more.

### 6. Navigation and orientation

- A course page lists lessons with a tick or dot (`CourseOverview.tsx`). No overall percentage, no "continue where you left off", no recommended next step, no streak or milestone.
- Lessons show a back link, breadcrumb and an estimated time and counts. No in-lesson section outline on General and ATAR.
- Mentors (`AgentCard`) give a voice to General topics. A good idea to keep and extend.

### 7. Things to keep

- The interactive 3D animations (now in 12 lessons) are the strongest feature.
- Foundations card format suits its audience, but the confirm gate should become a small action (answer, drag, choose) instead.
- Mentor voice, task blocks and hotspot activities.

## Recommended lesson flow (hypothesis, validate with the owner)

Every lesson: hook (30 to 60 seconds, a question, scenario or animation), one short idea, a try-it action, a check with instant feedback, a visible win, and a clear next step. Cap reading at a few short blocks between actions. Replace "I understand" and "Mark as complete" with earned completion (finish the checks).

## Where to start (in order)

1. Screenshot pass: run the app, capture one Foundations lesson and one ATAR lesson at laptop and 390px mobile width. Note spacing, hierarchy, navigation and mobile problems the code audit cannot show. Add them to this file. (`npm run build` fails in the cloud sandbox on Google Fonts, so use `npm run dev` or a Vercel preview.)
2. Propose 2 or 3 lesson templates to the owner (see `claude/feature-backlog.md`, "How to run rank 1"), using the reference sites.
3. Build one template on one lesson per tier: a Foundations lesson, a General lesson and an ATAR lesson. Convert existing reading blocks into the unused interactive block types where they fit.
4. Replace self-declared completion with earned completion.
5. Then per-student answer storage, short answer self-marking, progress dashboards, rewards. Order is in `claude/feature-backlog.md`.

## Quick wins that need no redesign

- Break the longest lessons (over about 800 words) into shorter ones or add an action every few blocks. Candidates: Y11 General "Components of a Wireless Network" (about 1,700 words), "Personal Digital Project Task" (about 1,600), Y12 ATAR "Glossary" (about 2,900, make it a searchable page or flashcards instead).
- Add quiz questions to the ATAR lessons that have none.
- Add a "continue where you left off" link and a percent complete to each course page.
