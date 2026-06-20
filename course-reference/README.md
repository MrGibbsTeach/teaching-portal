# Course Reference

Working reference material for building out each course — curriculum documents, marking guides, past exams, and similar. **Not part of the public site.** Nothing under this folder is imported by any page or component, and Next.js never serves arbitrary top-level folders (only `app/` routes and `public/` static assets) — so this is safe from accidental publication.

The actual documents are gitignored (see root `.gitignore`) — they stay local on this machine, not pushed to GitHub. Curriculum docs and past exams can be large and some may carry copyright restrictions on redistribution, so there's no reason to put them in a repo. Only the folder structure itself (via `.gitkeep` files) is tracked, so the layout survives a fresh clone.

One folder per course, matching the slugs in `lib/courses.ts`:

```
course-reference/
  <course-slug>/
    curriculum/                  — the official curriculum document(s) for this course
    exams-and-marking-guides/    — past exams, marking keys, sample answers
```

Drop new versions in as curriculum updates land (e.g. Y7/8 Digital Technologies already has its current curriculum; Y11/12 AIT is overdue for an update and a new version should go straight in here when released). Older versions can just sit alongside or get removed — there's no versioning convention enforced, use your judgement per course.

When asked to work on a specific course's content, check the corresponding folder here first for source material to work from.
