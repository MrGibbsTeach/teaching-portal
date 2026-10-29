# Feature Backlog (ranked by importance, approved by the owner)

Updated 21 Oct 2026. The owner approved all of this to be built now, not parked. Order is importance for the pilot (Y11 and Y12 AIT, to early 2027) and for a product people will pay for. Effort is a rough guess (S under a day, M a few days, L a week or more), unverified until someone reads the code. Competitor sources are in `claude/competitive-advantage.md`.

## The owner's verdict on the current courses

"Very similar, a little bit of content, approve it, move on. Boring, static, not intuitive, not interesting, not engaging." This is the main problem. Fix it before adding smaller features. Judge every feature by one test: does it make a student do or discover something, instead of read and tick?

## Ranked list

| Rank | Feature | What it means | Effort | Source |
|---|---|---|---|---|
| 1 | **Course experience redesign (engagement, UX and UI)** | Replace the read, approve, next pattern with a lesson flow that has variety and a reason to continue: a hook, an interactive moment, a try-it task, a check, a visible win. Cover layout, typography, motion, navigation, pacing and mobile. Keep it student-led and teacher-free. | L, in stages | All competitors, `claude/design-references.md` |
| 2 | Per-student progress and check-question results, visible to the teacher | Pilot evidence and a selling point. Check what the portal already records first. | M | Atomi, Education Perfect, Khan |
| 3 | Instant feedback on check questions | Answer, then model answer and a short note straight away. Replaces tick-to-approve. | S | Mathspace, Education Perfect, Atomi |
| 4 | Rewards, streaks and milestones | Visible progress, completion badges, small wins. Supports rank 1. Keep it tasteful for Y11 and Y12. | S to M | Reading Eggs, Grok, Code.org |
| 5 | Interactive animations across the whole course | Roll out the interactive 3D standard to every lesson that has a system or process. Rebuild Fetch, Decode, Execute and The Computer Canteen. See `claude/3d-animation-register.md`. | M each | Own advantage |
| 6 | Revision and exam practice mode for Y11 and Y12 | Mixed questions by topic, timed practice, using existing check questions and the ATAR practice exam. | M | Atomi |
| 7 | Individualised next steps after a check | "Revisit these two lessons" based on results. Needs rank 2 data. | M | Education Perfect |
| 8 | Problem-based tasks with auto-marking | Pair each concept with a challenge that marks itself. Link to Grok Academy for coding rather than rebuild it. | L | Grok |
| 9 | Parent view of progress | Progress record for home-education parents. | M | Atomi, Reading Eggs |

## How to run rank 1

1. Audit two current lessons (one Foundations, one ATAR). List what is static, repetitive or unclear. Show the owner screenshots.
2. Study the education reference sites and design galleries (`claude/design-references.md`) for lesson flow, navigation and progress patterns. State which ones you used.
3. Propose 2 or 3 lesson templates with a one-line tradeoff each and a recommendation. The owner picks.
4. Build the chosen template once on one lesson. Get the owner's view before applying it course-wide. Reuse the same template across courses (see the build rules in `claude/commercial-strategy.md`).
5. Roll out by course in pilot order: Y11 and Y12 ATAR, General, Foundations.

Cost rule: audit and propose first, build one lesson, then scale. Do not redesign every lesson speculatively.
