# Working in this repo as a non-Claude agent

One page. Read this after `AGENTS.md`, `CURRENT_STATE.md` and `claude/project-handover.md`.
The owner moves between Claude Code, Codex and DeepSeek; these files, not memory, are the
shared truth. If this file and `project-handover.md` disagree about a rule, the owner wins,
then `project-handover.md`.

## Start of every session

1. `git checkout main` then `git pull`.
2. Check `claude/` has `project-handover.md`, `spec-computer-interactive.md` and
   `hardware-parts-research.md`.
3. If a doc is missing, look for an open PR or a branch that has it. If the PR only adds
   or changes files under `claude/`, merge it and pull again. If it touches anything else,
   do not merge: tell the owner which PR and why you held back.
4. Read `claude/project-handover.md` in full, then only the docs the task needs.
5. Switch to your branch and rebase on `main`.

## Branches

- One branch per agent or per attempt: `deepseek-trial`, `codex-<topic>`. Never work
  directly on `main`, and never force-push a branch someone else may be reading.
- Rebase your branch on `main` at the start, not mid-session.
- The owner's current rule (since 31 Oct 2026) is no PR ceremony: merge to `main` yourself
  once the branch is green, then report it. `main` must never be left broken. If the owner
  says otherwise for a task, follow that instead.

## What you may change alone

- Small bug fixes with a test that would have caught them.
- Content corrections backed by a source (a wrong spec number, a broken link, a typo).
- Tests, scripts, and the docs under `claude/` that record what you did.
- Refactors that do not change behaviour or student-facing wording.

## What needs the owner first

- Rules and thresholds (power headroom, balance, done conditions), pricing or price data,
  and product names where the revision is ambiguous.
- Design direction, layout, and anything student-facing in tone: instructions, feedback
  wording, rewards, assessment language.
- Deleting content, changing course structure, or touching student data, auth or
  production settings.

## Before you report: self-check

1. `npm test` — all green, including any new test.
2. `npx tsc --noEmit` — clean.
3. `npm run validate:content` if you touched lesson content.
4. The interactive's own checker if you touched an interactive: for Spec the Computer,
   `node scripts/check-spec-computer.mjs`. It must exit 0 and its build counts must still
   be 118 / 376 / 19 unless a data change explains the difference.
5. A quick browser or jsdom smoke of the changed screen, at phone width too if it is UI.
6. `git diff --stat`, then read your own diff. No stray files, no debug output, no
   accidental rewrites of long files.

## Before you call something a bug

Check the example against the rule's actual thresholds and against what the doc says the
rule is meant to do. State the numbers in the report ("draw 500 W, PSU 550 W = 110%, which
is a warning, so nothing is silently passed"). A one-way check is not automatically a bug
if the doc says one-way.

## Live facts, prices and specs

Give the source URL and the date you saw it, or write "unverified". Prices in this project
are the owner's own estimates marked "~"; do not present them as live retail prices. Never
invent a spec to fill a table.

## Judgement calls

Leave them to the owner. List each one with a one-line tradeoff and a recommendation. Do
not silently tune a rule, a price or a student-facing sentence.

## End-of-session report (use this shape)

```
## What changed
<one line per area, with the file path>

## claude/ docs changed
<every file, because the owner syncs these into a Claude Project by hand>

## Couldn't verify
<what, and why>

## Decisions needed
<one line tradeoff + recommendation each>
```
