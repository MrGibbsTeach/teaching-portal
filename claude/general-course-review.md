# AIT General Y11 and Y12: Course Review

Written 29 Oct 2026 (Opus review requested by the owner). Scope: Y11 and Y12 AIT General only, the owner's stated priority. Goal set by the owner: "a great 2 year course that is engaging, interactive and helpful, that perfectly complements the SCSA syllabus and is most hands off for the teacher."

Sources: the course JSON on `main` (after PRs #5 to #10), a browser walk-through at school-laptop size (1366 x 768) and phone width, the SCSA Year 11 and Year 12 AIT General syllabuses (for teaching from 2024), `claude/competitive-advantage.md`, `claude/course-audit.md`, the owner's Mr Baker screenshots, and the earlier live review of Atomi, Code.org and Grok recorded in `STATUS.md`. Live fetches of Grok, Code.org and Education Perfect were not possible this session (permission not answered), so those rows rely on saved research and their public help-doc titles.

## 1. Verdict

The content is broad and mostly accurate: 117 lessons, every syllabus content area has lessons, a mentor world (Bunbury Tech Launchpad), check questions on every lesson, marking guidance on written answers, and three 3D animations. That is a real asset and should not be thrown away.

But it is a digital textbook, not a course. Mr Baker, Code.org, Grok and Education Perfect feel better for five reasons, in order of impact:

1. **It is organised like the syllabus, not like a course.** Lessons run content area by content area (all of Design, then all of Hardware, and so on). The syllabus makes the **Project 70% of Y11 and 50% of Y12**, but the portal has only a handful of project lessons. The teacher has to design, schedule and run the projects outside the portal, which is the opposite of hands-off.
2. **Students read, they rarely do.** Y11 median lesson is about 1,400 words; 45 of 61 Y11 lessons and 46 of 56 Y12 lessons have no interactive block other than quiz questions. Y12 has no videos. Y12's 112 extended-answer questions have nowhere to type: the student opens the model answer and presses "Done, continue".
3. **Practice produces no evidence.** 40 "task" steps send students to Word, Excel, Canva, Trello or Google Docs. Nothing comes back to the portal or the teacher. 23 of them name third-party tools (Trello, Google Docs and Sheets, Canva, Photopea, draw.io); Trello, Google and Canva need a student sign-in, which sits badly with the no-identifying-information policy on school devices that are Microsoft 365.
4. **The teacher still drives every lesson.** The class page is one 56 to 61 row list of Release buttons. There is no term plan, no pacing, no assessment calendar. Y11 lessons total about 27 hours of estimated time against 110 class hours in the syllabus; Y12 lessons have no time estimates at all. Nobody can tell what a week looks like.
5. **Quality slips that erode trust.** Examples found in one pass:
   - 31 Y12 lessons open with the raw syllabus dot point shown as a "Notes" step (for example "Network topologies for local area networks (LANs): wired star, wireless, client server, peer-to-peer").
   - 78 auto-generated "visual model" blocks repeat a table as text cards with small type and identical boilerplate ("Treat each card as a separate checkpoint..."). The LAN Topologies lesson has no picture of a network.
   - Off-syllabus content in assessable activities: Y12 LAN Topologies' match activity uses Star, Bus, Ring and Mesh; the syllabus lists wired star, wireless, client-server and peer-to-peer. Y11 network troubleshooting covers OSI, IPv6 and subnets, which Y11 General does not require.
   - The Content and Activities split separates scenarios from their questions (the physio clinic scenario sits on Content step 11, the question that uses it is on the Activities tab).
   - Step names fall back to "Notes" for many steps, so the step list does not tell the student where they are.

## 2. What the syllabus actually asks for

| | Y11 (Units 1 and 2) | Y12 (Units 3 and 4) |
|---|---|---|
| Time | 55 hours per unit, one semester each | 110 hours for the pair |
| Unit focus | U1 Personal communication; U2 Working with others (small business) | U3 Media ICT; U4 Digital technologies in business |
| Assessment | Project 70%, Short answer 20%, Extended answer 10% | Project 50%, Short answer 20%, Extended answer 15%, **Externally Set Task 15%** |
| Key outcome | Apply a design process to a client brief | Same, plus EST: 50 minute written task on **Unit 3 content only**, Term 2. SCSA names the Unit 3 content in Term 3 of the year before. |

Implications for the course design:
- The spine of a General course is **client-brief projects that run the design process**, with theory taught inside them. The current spine is theory, with a few projects attached.
- Y12 needs a **Unit 3 EST preparation track** that peaks in Term 2, using the content SCSA highlights for 2027 (released late September 2026 on the AIT course page and extranet; we do not have it in the repo yet).
- "General" wording rule stays: tests and assessments, never exams.

## 3. What the reference sites do that we do not

Patterns to adopt, not designs to copy.

| Site | Pattern | What it would mean here |
|---|---|---|
| Mr Baker | One lesson is one class session, labelled with term, week and date. A simulation sits at the centre. Check-in, then hand-in. | Each lesson is a 50 to 60 minute session with a clear "today you will make or decide X". Dated by the term plan. |
| Code.org | A lesson is a row of short levels (progress bubbles). Each level is something to do (predict, investigate, modify, make), with "check for understanding" levels. Bubbles fill when work is done. | Replace long reading steps with short do-steps. Progress strip shows done, not just position. |
| Grok | Short notes paired with a problem. Automarked, with solutions after an attempt. Colour-coded progress per student for the teacher. | Every idea is followed straight away by a problem on that idea. Model answers unlock after an attempt. |
| Education Perfect | Instruction, practice, assessment in one cycle. Students type written answers, then self-mark against the model (per their help docs). | Typed answers plus self-marking against the existing marking guidance, for every short and extended answer. |
| Atomi | Short lesson plus quiz; separate revision mode. | A Unit 3 EST revision mode for Y12, and topic test practice for both years. |

## 4. Target shape: a two-year course, not 117 lessons

**Structure.** Four units, each built as about four **missions** of three to four weeks. A mission is one client brief from one mentor (the mentors and Bunbury clients already exist). Each mission:
1. Brief (the mentor's ticket, one screen, with the client's real constraint).
2. Learn and do sessions (3 to 4 lessons per week) that teach only what the brief needs, with theory content areas (design concepts, hardware, impacts, data, networks) woven in where the brief uses them.
3. Build milestones inside the design process the syllabus names (identify need, plan, design, develop, test, evaluate), done in real software the school provides.
4. Hand-in of evidence at each milestone, and a short test at the end of the mission that samples the content covered.

This maps directly onto SCSA's Project, Short answer and Extended answer types, so the course *is* the assessment programme.

**Lesson template (one session, about 50 minutes).**
1. Hook: the mentor ticket, one screen, tied to the mission.
2. Three or four learn-and-do cycles: one idea in 150 words or fewer, then something to do with it straight away (simulation, sort, drag, predict, fix the broken example, spot the problem). Scenario and question on the same screen.
3. Write it: one short or extended answer, typed in the page, then self-marked against the marking guide already in the content.
4. Build: the next project milestone in real software, with a checklist of what "done" looks like.
5. Check-in and hand-in: confidence rating plus evidence (see decision 2).

For General, interleave Content and Activities in one sequence. The tab split suits ATAR revision better than a hands-on General lesson.

**Reusable interactives for General (build once, use many times).** Each maps to a syllabus skill dot point:

| Interactive | Syllabus fit | Lessons it serves |
|---|---|---|
| Design spotter: click the element or principle in a real layout | U1, U3 design concepts (identify elements and principles) | About 12 |
| Layout fixer: drag items to rule of thirds, grid and alignment, see the score | U1, U3 compositional rules, layout and design | About 8 |
| Typography tuner: sliders for typeface, size, spacing, alignment | U1, U3 typography | About 4 |
| Troubleshooter: branching fault simulation (no power, faulty monitor, printer, no sound, frozen screen, projector) | U1 and U3 troubleshooting skills | About 4 |
| Search lab: Boolean query builder against a fake result set | U2 search strategies | About 3 |
| Spreadsheet sandbox: live formulas, functions, sort and filter | U1 spreadsheets, U3 sort filters and spreadsheet design | About 6 |
| File size lab: format, compression, crop and resample with live file size | U2 file formats, U3 file formats, U4 optimisation and compression | About 7 |
| Network builder: drag NIC, router, switch, modem, access point; pick media; check the home LAN works | U2 wireless network, U4 networks and "design a home LAN" | About 10 |
| Web editor: live HTML and CSS with checks (the `codeExercise` block already exists and is unused in General) | U4 web authoring, responsive design, navigation maps | About 4 |
| Planner: build a timeline or Gantt for the current mission | U2, U4 time management and plan of action | About 6 |

Plus the existing 3D animations, which are the strongest thing in the course.

**Hands-off for the teacher.**
- A **term planner** per class: the two-year sequence laid out by term and week (from the school's real term dates), with "release this week" in one click, or automatic release by date.
- An **assessment calendar** built from the SCSA assessment outline requirements: which project milestones, tests and extended answers fall in which week, with the marking keys attached.
- **Evidence without new accounts:** milestone hand-ins through the school's own Microsoft 365 (Teams assignment or a pre-filled Form link), not third-party sign-ups.
- Every lesson works with no teacher talk: the hook, the doing, the check and the model answer are all in the page.

## 5. Recommended plan

| Phase | What | Effort | When |
|---|---|---|---|
| 0. Fix trust | Remove off-syllabus activity content; replace the 31 raw dot-point steps; delete or redo the boilerplate visual models (a real diagram or nothing); label every step by what the student does; keep scenarios with their questions | S to M | Now |
| 0. Write and self-mark | A typed answer box on every short and extended answer, then a self-mark against the existing marking guidance before the model answer shows. Kept in the browser only (no student data). | S to M | Now. Biggest single learning gain for the least build. |
| 1. One mission, built properly | Build one full mission to the template above (about 12 sessions) as the sample. Get the owner's yes before any more. | L | This term, for testing with the current class |
| 2. Term planner and assessment calendar | Class plan by term and week, one-click or dated release, assessment calendar with marking keys | M | Before Term 1 2027 |
| 3. Interactives | Build the reusable interactives in the order the 2027 calendar needs them | M each | Just ahead of teaching |
| 4. Roll out | Convert the remaining missions about three weeks ahead of when they are taught, not all at once | L, ongoing | Through 2027 |
| 5. EST track | Unit 3 EST revision mode for Y12 using the 2027 highlighted content | M | Before Term 2 2027 |

**Recommended first mission: Y12 Unit 3, Design Concepts brief (Leo Thorne).** Reasons: the 2027 Y12 class starts Unit 3 in Term 1 and sits the EST on Unit 3 in Term 2, so it is the most time-critical; design concepts appear in all four units' skill lists; and the design spotter, layout fixer and typography tuner it needs are reused by Y11 Unit 1 straight after.

Cost honesty: rebuilding all of General to this standard is several weeks of work spread across 2027. Done just in time, mission by mission, it never has to be finished before it is useful.

## 6. Decisions the owner needs to make

1. **Structure:** rebuild General around missions and a term plan (recommended), or keep the current topic order and only upgrade lessons in place (cheaper, but keeps the textbook feel and leaves projects outside the portal).
2. **Evidence route:** Teams assignments, a pre-filled Microsoft Form at each milestone, or no hand-in through the portal.
3. **Inputs only the owner has:** the school's 2027 term dates, the 2027 AIT General EST Unit 3 content, the school's assessment outline for General if one exists, and which software students actually have on their laptops (Microsoft 365, Canva for Education, Audacity, a browser image editor).
4. **First mission:** confirm Y12 Unit 3 Design Concepts, or name another.
