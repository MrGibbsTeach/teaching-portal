# Checkpoints

Review notes and feedback that are **recorded but not yet acted on**. Add new feedback under the relevant checkpoint (or start a new one), then plan the work from here. Nothing in this file has been implemented.

---

## Checkpoint 1 — General course "professionals" (mentors): review

Recorded 2026-09-20. Trigger: the mentor card on a Y11 General lesson (Leo Thorne, *Principles of Design*) feels like a profile pasted above the content, not a teacher.

### What you want (Clayton, 2026-09-20)
Students should feel they are **always being taught by someone in that profession**. The lesson content must still be **clear, easy to understand, easy to take notes from, and easy to prepare for tests**, but feel more authentic than a profile-and-quote card with a textbook underneath.

### What we originally set out to do (reconstructed)
My saved memory for this project was empty, so this comes from the commit history (1 July 2026 – 22 July 2026), not from recalling the conversation. The commit messages describe:
- **Five mentor personas**, each owning a domain: Leo Thorne (Design), Sloane Vane (Managing Data), Jaxen "Sparky" Miller (Hardware + Networks), Dr Elara Finch (Impacts of Technology), Rory Quinn (App Skills + Project Management). Each has a fictional local company (Bunbury / Koombana area), photo, bio, study pathway, "what I love" and "the hard part".
- **The "Apprenticeship Framework":** students are junior interns shadowing the mentor. Each lesson is built from four styled callouts: **Ticket** (the mission brief), **Sandbox** (the challenge), **PR Review** (Socratic check of your work) and **Senior Wisdom** (a tip from the mentor), with occasional cross-mentor callouts.
- **The AgentCard** (commit `33485e2`): "Students see who is mentoring them before they touch the first ticket." It is shown at the top of every lesson.

So the intent was already "taught by the professional". The framework delivers it inside four callouts; the card and the callouts are what the student sees of the mentor.

### What we have now (measured 2026-09-20)
- **Where the voice lives:** the mentor speaks in the four callouts (the opening ticket in first person, "You're shadowing me on-site today", a tip in the middle, the sandbox task, and the closing PR review). The explanatory content between them (paragraphs, tables, comparisons, key terms) is written in a **neutral textbook voice**. That is the "quote, then content underneath" feeling.
- **The card** is the same generic career profile (bio, study pathway, love and hard-part quotes) repeated on **every** lesson of the topic, unrelated to that lesson. Expanded, it pushes the actual lesson down the page.
- **How much of each topic is voiced:** the agent's name appears in roughly 15–25% of text blocks in most topics (Y12 networks is an outlier at 68%), and first-person language in roughly 10–27%. The ticket, sandbox and PR review callouts are present in almost every lesson of every topic except Design.
- **Design (Leo, Y11) is the weakest and the reason for your screenshot.** On 1 July, Leo's voiced overhaul of all six Y11 Design lessons (`5a7f56e`) was followed the same day by "upgrade Design Concepts to match ATAR richness" (`b242388`) and "show design elements and principles IN USE with SVG demonstrations" (`ecdeaf8`). Those rebuilds replaced the voiced lessons. Today, **4 of the 6 Y11 Design lessons have no mentor-voiced block at all** (*Elements*, *Principles*, *Analysing and applying*, the quiz). Only *Typography* and *Compositional rules* keep the four callouts. Y12 Design keeps most of the framework.
- **Structure of notes and test prep:** no consistent "note-taking" scaffold. Key terms are a block near the end, quizzes come last, and the callouts are long prose. There is no "write this down" box or "test-ready" summary that repeats the same way each lesson.

### Observations and open questions
1. The dev-flavoured framing (tickets, pull requests, sandbox) is applied to Design, Ethics and Data mentors. It may feel forced for an ethics director. Should each mentor use their own profession's kind of work (client brief, audit, incident report) with the same skeleton?
2. The mentor photos are of people who do not exist, presented at first glance as real professionals at real-sounding companies. Do you want a small "fictional mentor based on a real role" note, or real local professionals over time (interview clips, quotes)? That would be the most authentic route.
3. Is the AgentCard's career-pathway content better placed on a one-time "Meet your mentor" page or at the end of a topic, where it acts as career context rather than an opener?
4. Should ATAR and Foundations get mentors too, or is this General-only?

### Improvement options (not started)
- **A. A consistent lesson skeleton in the mentor's voice.** Every lesson: short in-role hook tied to *that* lesson, teaching content written as the mentor explaining it ("here's how I explain it to a new starter"), then the same repeatable pieces each time: **Write this down** (the notes box), **On the job** (a real-world example), **Watch out** (the common mistake), **Test-ready summary**. Keeps it easy to take notes from, and easy to revise.
- **B. Slim the card** to a compact byline (photo, name, role) on every lesson; put the full profile on a "Meet your mentor" page or at the topic's end.
- **C. Restore the voice in Y11 Design first** (four lessons), keeping the new visual demos.
- **D. Continuity within a topic:** one recurring client or project per topic, so the mentor's ticket in lesson 1 is followed up in lesson 4.
- **E. Profession-appropriate framing per mentor** (see question 1).

### Feedback still to add
_(Clayton is reviewing the other courses and will send further feedback. Add it below.)_

-

---

## Checkpoint 2 — Year 11 ATAR (and Year 12 ATAR): no "Next" after completing a lesson

Recorded 2026-09-20 (reported by Clayton with screenshots of *Elements of Design*, Y11 ATAR).

- **Symptom:** after pressing **Completed**, there is no "next lesson" link, so the student has to go back to the course page.
- **Cause (verified in code):** in `app/courses/[slug]/lesson/[lessonId]/page.tsx` the next lesson is always worked out (respecting the class topic-access lock), but only the General and Foundations layouts render it. The generic layout used by ATAR renders the lesson blocks and the complete button and nothing else.
- **Year 12 ATAR:** it uses the same layout, so it will have the same gap once it has content (it is currently a placeholder with no lessons, so this is by inspection, not observed).
- **Likely fix (not started):** render the same "Up next" link as the General lesson view in the ATAR layout, keep the topic-lock behaviour, and consider showing it directly after the Completed button.

### Feedback still to add
-
