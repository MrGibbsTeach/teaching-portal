# Spec the Computer Interactive: Decisions and Status

Demo built 2 Nov 2026, switched to real parts the same day. Not in the portal yet (owner asked for a demo only, repo untouched). Demo (private artifact): https://claude.ai/artifact/3Yj38UUpeJwUSJY3f6FQkY. Source is one self-contained page, `index.html`, honouring `?tier=general|atar`. Parts, specs and prices: `claude/hardware-parts-research.md`.

## What it is

A PC-part-picker style task. The student gets a client brief and budget, picks eight parts, compatibility rules flag bad picks, then they justify each choice and review against the brief. Serves General (hardware purchase) and ATAR (selecting hardware) from one tool (standing rule 7).

Syllabus fit: General hardware unit (compatibility and hardware purchase, hardware-4 in the 2027 lesson map, Y12 T1 Wk 8). ATAR components of a computer and specifications.

## Structure (four tabs)

1. **Brief.** Three clients: Bunbury Bakehouse (office PC, $1,000, easier), South Coast Surf Films (4K Premiere Pro editing, $3,000, medium), Bunbury Esports Club (gaming PC for a 30 cm deep shelf, $2,200, tight; only the SilverStone SG13 fits, which forces an ITX board and a GPU of 266 mm or less).
2. **Build.** Eight slots (CPU, board, RAM, graphics incl. "none", two drives, PSU, case), live budget bar, 3D view, eight compatibility rules.
3. **Justify.** Five boxes (CPU, RAM, graphics, storage, budget and trade-offs) with sentence frames, word-based guide pills, and an example answer revealed only after the student writes their own. Locked until every required slot is filled and no rule is red.
4. **Review.** Needs met, spec sheet, optional comparison with a reference build, copy-to-clipboard spec sheet for the Teams hand-in.

## Rules

Socket match, memory type, board fits case, GPU length fits case, display output (no GPU needs CPU graphics), drive connections (M.2 and SATA counts), PSU size (error below 110% of estimated draw, warning below 130%; draw = CPU TDP + GPU power + 75 W), CPU and GPU balance (warning only when the GPU index is more than 30 above the CPU index). Each rule has plain wording for General and terse technical wording for ATAR.

## General vs ATAR (toggle inside the tool)

- General: needs show numeric targets; fit hints on by default; plain-English rule explanations with a fix; star ratings; three-part justification checks.
- ATAR: targets hidden behind a peek; fit hints off by default; terse technical rule messages with no fix; $/GB, MB/s, TDP, chipset and speed index shown; justification also checks for a compared option and a named trade-off, and needs more characters.

## Decisions

- **Real parts only (owner, 2 Nov 2026).** Exams use real parts and fictional sockets would teach the wrong vocabulary. Real names, sockets (AM4, AM5, LGA1700, LGA1851), chipsets and memory types. Prices are indicative AUD for November 2026 and marked "~" when estimated. Standing rule 7's "original designs only" is about design assets, not product names on a spec sheet.
- Speed indices are rough teacher-set figures, not benchmark results.
- 2026 memory and SSD prices are inflated, which is why budgets are higher than a 2025 build would need and why DDR4 versus DDR5 is a real trade-off.
- The 3D-01 parts were rebuilt in the Toybox Teardown style (Three.js r128, tap to select with dimming, labels toggle, explode, drag to orbit) rather than copied, because the old artifact was not readable. Parts are drawn to scale, so a too-long GPU or too-big board visibly pokes through the case and glows red.
- Student text stays in the browser (localStorage where allowed, in memory otherwise).
- Justification checks are word-based hints, never marks.
- **Bakery feasibility fix (owner, 2 Nov 2026).** The owner could not find a build that met every bakery need under $950. Brute force confirmed it was real: only 28 builds worked, all variations on one (Core i3-12100 plus the LGA1700 DDR4 board), because "no graphics card" forces a CPU with built-in graphics and the only cheap one was the i3. Fixed by adding the Ryzen 5 5600G (AM4, built-in graphics, ~$229) and raising the budget to $1,000. Now 118 working builds across two platforms. Always brute-force a scenario's feasibility after changing the catalogue, budgets or needs.

## Feasibility (working builds that pass every rule, every need and the budget)

Bakery 118 (cheapest $828). Surf Films 376 (cheapest $2,027). Esports 19 (cheapest $2,037), intentionally tight: one ITX board, one case, one GPU class. Loosen the esports brief if students find it frustrating.

## Verified

Headless browser: all three reference builds pass every need and rule ($862, $2,686 and $2,041); a deliberately bad build trips six rules; Justify lock; both tiers; copy fallback; no phone overflow. Not checked: inside the sandboxed portal iframe, real WebGL on a school ASUS laptop, Y11 vs Y12 wording split, accuracy of estimated prices and of the cheaper boards' M.2 and SATA counts.

## Not built yet

- Portal wiring (placement script, height and done messages), register row.
- Flyover tour and Name It quiz (style standard); monitor and peripherals slots; CPU cooler; PSU connectors and length; RAM slot counts.
- More scenarios (network hardware purchase, a server with backup), and General EST-style wording once the owner supplies it.
- Owner to confirm: scenario themes, the 110% and 130% PSU thresholds, the speed indices, and whether the example answers match how the course teaches justification.
