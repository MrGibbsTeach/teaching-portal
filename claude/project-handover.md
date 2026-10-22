# Mr Gibbs Teach: Handover and Upcoming Work

This file is the single source of truth for any AI working on this project. Read it fully before doing anything, then read only the other docs your task needs. Update it at the end of every session (see "Keeping this file current").

Last updated: 22 Oct 2026

## Start here (60 second version)

- Goal: an online educational website that students use on their own, that keeps improving, and that can later be sold as a subscription homeschool curriculum for Australian families.
- Current focus (pilot): Y11 and Y12 AIT (ATAR, General, Foundations), this year into early 2027, aligned to WA SCSA. A Y9 or Y10 group may join. Y7, Y8 and the rest are parked.
- Judge every decision by three questions: does it help students learn, can it be reused across courses, does it move toward a sellable product.
- Before building anything, check "Next actions" and "Standing rules" below.
- If a document you need is missing or unreadable, ask the owner for it. Do not guess.

## How to respond to the owner

- Answer first, then detail. Short by default.
- Ask at most one question, and only when a wrong guess would be costly. Otherwise state your assumption and proceed.
- When a choice is open, give 2 or 3 options with a one-line tradeoff each, and recommend one.
- Give frank pushback when something is a weak idea, and say why.
- Do not use em dashes.
- Report outcomes, not effort: say what changed and where it lives.

## Cost rules (keep AI usage and the owner's credit low)

1. Read only what the task needs. Read this file, then open other docs by section. Open the animation register's "Interactive style standard" only when building an animation, and its Built and Planned tables only to place or record one. Never read a whole doc to answer a small question.
2. Do not spawn sub-agents or launch deep research unless the owner asks. Handle multi-part tasks inline.
3. Research once, save it, reuse it. Write findings into a project doc and read that next time instead of fetching the sites again. Review at most 3 to 5 examples per site. Use standard search before extended search.
4. Edit, do not rewrite. Change only the part that changed. Do not regenerate long files or re-send files the owner already has.
5. Draft small first. For anything large (a course, an animation, a site build), produce an outline or one sample and get a yes before building the rest.
6. Estimate before expensive work. If a task needs many files, many tool calls or repeated testing, say so in one line and ask one question before starting.
7. Build only for the pilot (AIT Y11 and Y12) until the owner says otherwise.
8. Verify once. Batch checks into one pass instead of re-testing after every small change.
9. No unrequested extras. Do what was asked, report in a few lines, and stop.
10. Use the lightest capable model for routine work (small edits, formatting, writing check questions). Save the strongest model for strategy and hard builds. The owner chooses the model, so suggest a switch when it would save credit.

## Next actions, in order (recommended, owner to confirm)

The pilot is decided: the owner's own Y11 and Y12 AIT classes (ATAR, General, Foundations), this year into early 2027. Y7 to Y10 and everything else are parked.

1. Ship what is already built: A2, A3, then A1.
2. Audit and complete the AIT Y11 and Y12 lessons (C), and check that lesson progress and check-question results can be seen per student. This is the pilot evidence.
3. The ranked feature backlog is in `claude/feature-backlog.md` (drafted 21 Oct 2026). Get the owner's yes before building any item.
4. Build planned animations (B) only if an AIT Y11 or Y12 lesson needs them, in the priority order shown.
5. Work through the commercial strategy's 90 day plan (`claude/commercial-strategy.md`, section 9).

## What the project is

Mr Gibbs Teach is the owner's personal teaching platform (lessons, assessments, interactive resources). It is the validation ground for a possible separate commercial brand: a subscription homeschool curriculum for Australian families. Nothing is being sold yet. The commercial goal governs build decisions.

- Near-term scope: pilot with the owner's Year 11 and 12 AIT classes (ATAR, General, Foundations), aligned to WA SCSA. Later: WA Digital Technologies Y7 to Y10 for homeschool families, then other curriculums. The platform must be built so new curriculums can be added.
- Delivery model: all courses are student-led (including ATAR), with parental assistance in the younger years. Every lesson page must carry its own check questions, not rely on a teacher saying them.
- All content is made in the owner's own time with personally paid tools.

## Project documents

- `claude/3d-animation-register.md`: animations built and planned, the locked interactive style standard, lesson placements, check questions, and where each is live in the portal. Always read the style standard before building any animation.
- `claude/design-references.md`: design galleries to study before making any customer-facing asset.
- `claude/competitive-advantage.md`: saved research on each competitor (Atomi, Education Perfect, Mathspace, Reading Eggs, Khan Academy, Grok Academy, Code.org and others), where we are better, how it carries beyond Digital Technologies, and the feature backlog seed. Read it instead of re-fetching the sites, and keep all marketing claims consistent with it.
- `claude/feature-backlog.md`: ranked features to adopt, with effort guesses. Owner approves before any build.
- `claude/commercial-strategy.md`: phases and gates, competitor benchmark (Atomi), where we can be better, pricing options, risks, next 90 days. Read it before any commercial decision.

## Where these docs live and tool notes

- The docs are plain markdown in a `claude/` folder. They live in the Claude project's knowledge and, once a repo exists, in the repo's `claude/` folder. The same relative paths are used everywhere, so references in these docs work in every tool (Claude, ChatGPT, Claude Code, Codex).
- Source of truth: the repo copy once it exists, otherwise the Claude project copy. Other copies are read copies. After a session that changes docs, tell the owner exactly which files changed so they can sync the other copies.
- If your tool can write files, edit the docs directly (edit, do not rewrite). If it cannot, output the exact text to add and the file it belongs in.
- If your tool has no web access, say so and ask the owner to paste the page or a screenshot. Do not invent site details.
- If a doc you need is missing in your tool, ask the owner for it. Do not guess.

## Standing rules

1. **3D animations** follow the interactive style standard in the register. Do not use the older passive-loop look.
2. **Customer-facing assets** (landing page, pricing page, email, deck, social post, ad, navigation, link preview image): open `claude/design-references.md`, fetch the matching site live, study 3 to 5 current examples, borrow patterns never designs, and tell the owner which sites and patterns informed the work. This does not apply to the 3D animations.
3. **Record every build.** When an animation is built, add its row to the register under Built with the link, courses, lesson slot and check questions, and move it out of Planned.
4. **Verify before showing.** For animations: syntax check, a smoke test, then a real headless browser check of the default labels-on shot, every stage, the info card, the quiz and Flyover. Expect at least one review round after the owner uses it.
5. **Learn from other education sites.** Mr Gibbs Teach is an online educational website, so its lesson pages, practice, progress tracking and student experience should take the best features of established education platforms (see "Educational reference sites" below). Before designing or changing a learning feature, fetch the relevant sites live, study how they do it, adopt the proven pattern and adapt it to our student-led, WA SCSA-aligned model. Never copy their content, branding or code. Tell the owner which sites and features informed the work.

## Definition of done

- **Animation:** meets the style standard in the register, passes the rule 4 checks, has its row in the register (link, courses, lesson slot, check questions), and is placed in at least one portal lesson.
- **Lesson page:** lead-in tied to the lesson, the content, an animation or practice where it helps, and "Pause and check" questions with answers behind a reveal, pitched to the course tier. It must work with no teacher present.
- **Any change:** this file is updated if the plan changed.

## Decision log

- 18 Oct 2026: all courses are student-led (including ATAR), with parental assistance in the younger years.
- 19 to 20 Oct 2026: interactive style standard locked for all 3D animations and passive loops retired. Binary Lights and colour mixing were split into two animations (3D-03 and 3D-06) because two ideas in one scene read as clutter.
- 21 Oct 2026: design reference sites and educational reference sites adopted as standing references (rules 2 and 5).
- 21 Oct 2026: pilot is the owner's own AIT Y11 and Y12 classes (ATAR, General, Foundations), this year into early 2027, possibly plus a Y9 or Y10 group. Everything else parked.
- 21 Oct 2026: commercial strategy written (`claude/commercial-strategy.md`). Strategy is to win a niche (interactive, WA-specific, project-based AIT), not to out-scale Atomi.
- 21 Oct 2026: competitive advantage analysis written (`claude/competitive-advantage.md`). Positioning: interactive hands-on learning, complete student-led course, WA SCSA depth, evidence from real classes. Not competing on breadth, free content, adaptive drill or early reading.
- 21 Oct 2026: cost rules added. The animation register is not split for now; read it by section instead.
- 21 Oct 2026: closed Y12 General's remaining no-interactive-diagram gap (8 topics), merged that work with the 3D-animation/PR#1+#2 work pushed from another session, and pushed to `main`. Found and then corrected an overstated ATAR check-question gap claim (open question 6); the real, smaller Y12 ATAR gap (3 topics) was fixed with the owner's go-ahead, plus one AIT Foundations lesson missing a hands-on activity. Item C's coverage pass is now complete across all 4 pilot tracks.
- 21 Oct 2026: built per-student quiz-results tracking (open question 7) — a real gap in item 2's own requirement, not content. Teachers can now see each student's own right/wrong answers, not just the class aggregate.

## Educational reference sites

Use these when designing the learning experience itself (lessons, practice, assessment, progress, navigation within a course). Rule 2 and `claude/design-references.md` cover marketing and visual assets. These cover how students learn on the site.

| Site | Main focus | URL | Study for |
|---|---|---|---|
| Education Perfect | Curriculum-aligned lessons, assessment and student progress | educationperfect.com | Curriculum alignment, assessment flow, progress views |
| Atomi | Video lessons, interactive learning and senior secondary revision | atomi.com.au | Lesson structure, revision tools, senior secondary (Y11 and Y12) |
| Mathspace | Adaptive mathematics learning and practice | mathspace.co/au | Adaptive practice, instant feedback, step-by-step support |
| Reading Eggs | Early literacy, phonics and reading | readingeggs.com.au | Engagement, rewards and motivation for younger students |
| Khan Academy | Free lessons and practice in maths, science and computing | khanacademy.org | Lesson plus practice flow, mastery tracking, computing content |
| Grok Academy | Coding, Python, computational thinking and digital technologies | groklearning.com | Closest match to our subject: coding and digital technologies lessons |
| Code.org | Computer science, coding, game-based learning and AI education | code.org | Game-based learning, interactive coding activities, AI education |

How to use them:

1. Fetch the site live and review the specific feature. Do not work from memory. If a page is behind a login or paywall, say so and use what is public. Do not try to get around it.
2. Write down what the best examples have in common, and which parts suit student-led delivery (no teacher in the room, parent help in younger years).
3. Propose 2 or 3 options with a one-line tradeoff each, then recommend one.
4. Match to the audience: Y7 and Y8 DT (younger, parent-assisted) look more like Reading Eggs and Code.org. Y11 and Y12 AIT (self-directed, exam focused) look more like Atomi, Education Perfect and Khan Academy. Grok Academy is the closest subject match for both.
5. Keep what makes us different: the interactive 3D animations, WA SCSA alignment, and check questions on every lesson page.

## Upcoming work

### A. In flight: finish and ship

| # | Task | Notes |
|---|---|---|
| A1 | Swap the interactive rebuilds into the portal for 3D-01, 3D-02 and 3D-03 | The portal still links the older passive versions. Rebuild links are in the register. The register says to decide this once more of the set is rebuilt, so confirm with the owner first. |
| A2 | Approve and merge the Fetch, Decode, Execute (3D-04) animation | Sits on preview branch `add-fde-animation` until approved. |
| A3 | Place Colour Mixing (3D-06) in the portal | Built, not yet placed. Placement and check questions are in the register. It follows Binary Lights' Pixel stage in the Y7 text and images lesson. |
| A4 | Decide whether to rebuild 3D-00 (Computer Canteen) and 3D-04 in the interactive style | The standard replaces the older look for 3D-00 to 3D-04, but only 3D-01, 3D-02 and 3D-03 have been rebuilt. Confirm with the owner. |
| A5 | Y7 and Y8 animation placements | On hold until those courses have content in the portal (still placeholders). |

### B. Planned animations

All to be built to the interactive style standard. Priority is reuse across courses, then fit with the Y7/8 and Y11/12 build. Full detail is in the register.

Pilot filter: build only AIT Y11 and Y12 animations for now (3D-05, 3D-09, 3D-10, 3D-11, then 3D-12). Y7, Y8 and Y9 animations (3D-07, 3D-08, 3D-13, 3D-14, 3D-15) are parked.

| ID | Animation | Courses | Priority |
|---|---|---|---|
| 3D-05 | Memory and storage speed pyramid (cache, RAM, SSD, HDD) | AIT Y11, Y12 | Medium |
| 3D-07 | Sorting and searching as moving blocks | Y7, Y8 DT | Medium. Many small similar parts, so apply the label-pill cap from the start. |
| 3D-08 | Loops and selection: robot on a grid following code | Y7, Y8 DT | Medium |
| 3D-09 | Relational tables joined by keys | AIT Y11, Y12 | Medium |
| 3D-10 | Web request: browser, DNS, server, page returned (reuses 3D-02 parts) | AIT Y11, Y12, Y8 DT | Medium |
| 3D-11 | Firewall and encryption: packet with and without protection (reuses 3D-02 packet) | AIT Y11, Y12 | Medium |
| 3D-12 | Backup strategies, the 3-2-1 rule (reuses 3D-01 storage parts) | AIT Y11, Y12, General | Low |
| 3D-13 | Build the PC: drag real parts into place | Y7 DT, AIT General, Foundations | Medium. Largely covered by Toybox Teardown, so revisit scope first. |
| 3D-14 | Game loop: input, update, draw, 60 times a second | Y9 Game Making and E Sports | Low |
| 3D-15 | Ping and lag: packets between player and game server (reuses 3D-02) | Y9 Game Making and E Sports | Low |

For each new animation: write the lesson placement and one check question per stage into the register, and write the "Pause and check" questions into the portal lesson page with answers behind a reveal, pitched to the course tier.

### C. Course content

- Pilot focus: Y11 and Y12 AIT (ATAR, General, Foundations). Audit the existing lessons against the WA SCSA syllabus, complete the gaps, make sure every lesson has check questions, and check that progress and check-question results can be seen per student.
- Y11 and Y12 General Design Concepts received a full visual upgrade on 22 Oct 2026: custom SVG worked examples across the thin visual gaps, with existing grids and diagrams retained. Build passes; still needs a logged-in lesson-page browser look. Details and references are in `STATUS.md`.
- Y7 to Y10 Digital Technologies courses are parked (Y7 and Y8 are still placeholders in the portal). A Y9 or Y10 group may join the pilot.
- Y11 and Y12 AIT (ATAR, General, Foundations) have lessons live with animations placed (see the register's "In the course" table). Further lessons and animation placements follow as animations are built.
- Course names and topics in the register are a best mapping and must be checked against the owner's scope and sequence before locking lesson slots.

### D. Commercial direction

- The pilot is the owner's own AIT Y11 and Y12 classes, this year into early 2027. `claude/commercial-strategy.md` holds the phases, gates, positioning against Atomi, risks and the next 90 days.
- Run a small paid test and prove who pays before building a standalone platform.
- Do not start selling or building a standalone platform without the owner's go-ahead.
- Any pricing page, landing page, email sequence, deck or social post for the commercial brand follows standing rule 2.
- Proposed groundwork for monetization (not approved, owner to decide): a coverage map of each course against WA SCSA; per-student progress and completion tracking; a parent view for the younger years; a free sample lesson per course; basic analytics on lesson completion and check-question results to show what to improve. Benchmark each against the education reference sites first.

### E. Learning-experience benchmarking

- First review of the seven educational reference sites is done (21 Oct 2026) and saved in `claude/competitive-advantage.md`. Do not fetch those sites again for the same questions. Refresh a row only when a decision depends on it and the facts are stale. Khan Academy details are unverified there (its homepage did not render).
- From the review, propose a short backlog of learning features for the portal, ranked by value to students and effort. Check with the owner before building any.
- Likely areas to look at first: progress tracking per student, instant feedback on practice questions, mastery or completion indicators, and revision modes for Y11 and Y12.

## Open questions for the owner

1. (Answered 21 Oct 2026: swap in. Interactive 3D-01, 3D-02 and 3D-03 are in PR #2 on teaching-portal, pending the owner's preview check and merge.)
2. Rebuild 3D-00 and 3D-04 in the interactive style (A4)?
3. Is a Y9 or Y10 group joining the pilot, and which?
4. Has selling the content been cleared with the school and CEWA (IP, secondary work, student data and privacy)? See the strategy risks.
5. Does an earlier Commercial Strategy doc (written 18 Oct 2026, outside this project) still exist? If so, merge it into `claude/commercial-strategy.md`.
6. (21 Oct 2026, resolved) The "41-lesson ATAR gap" reported earlier the same day was overstated — Y11 ATAR's apparent gap was a false positive (every topic deliberately ends in a dedicated quiz/practice/exam lesson covering its content lessons; no fix needed). Y12 ATAR's was real but smaller: 3 topics thin on per-lesson checks (design-concepts-1 1/5, managing-data-6 6/14, application-skills-9 2/4). Owner said yes to all three; `scripts/add-y12-atar-check-questions.mjs` added 2 new WACE-style questions to each of the 14 lessons that had none, matching the marking-key style already used in that course's other lessons. All three topics are now 100% covered. Same pass, AIT Foundations' "Typing Formulas" lesson (c11_6_l2) was the one lesson across all 4 pilot tracks (General, ATAR, Foundations) missing a hands-on `activity` block — `scripts/add-foundations-formula-activity.mjs` added one (match-pairs for the 5 formula symbols it already teaches), same tone as its sibling lessons. That completes item C's check-question/interactive-coverage pass for the whole AIT Y11/Y12 pilot. Not yet browser-checked.
7. (21 Oct 2026, built) Item 2's other half — "check that lesson progress and check-question results can be seen per student" — was only half true: progress was (CSV export), but check-question results were only ever a class-wide aggregate (`lib/db.ts`'s `recordQuizStats` increments one shared counter hash per class, no student attached). Owner said build it. Added `recordStudentQuizStats`/`getStudentQuizStats` (same hash shape, one per student, reusing the existing `mergeStats`/`hardestQuestions` parsing logic unchanged), wired into the existing `recordQuizAnswer` action alongside the class-wide write, a "Quiz results" column on the class management page, and a new per-student results page at `/teacher/classes/[id]/students/[username]`. 79 tests now pass (3 new), build and lint clean. Not browser-checked — same login-gated-route limitation as the animation check above; owner chose to skip that check for now too.

## Keeping this file current

At the end of each session: tick off or remove finished items, add new ones, update "Last updated", log any decision in the Decision log, and make sure the register matches. Keep it a plain list of what is next, not a history.

This file is the source of truth for rules and upcoming work. The owner's saved memory only points here, so change the rules here, not in two places.
