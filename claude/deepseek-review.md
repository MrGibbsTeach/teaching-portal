# DeepSeek review: Spec the Computer

Reviewed 6 Nov 2026 on branch `deepseek-trial`. Main file: `public/interactives/spec-computer.html`. New check: `scripts/check-spec-computer.mjs`.

**Verdict:** the eight rules work, and all three scenarios are solvable. I fixed one factual data error and one misleading power message. The power estimate, the balance rule and a few prices need a decision, not a patch.

## Handover gap

The two docs named in the brief, `claude/spec-computer-interactive.md` and `claude/hardware-parts-research.md`, are not in the repo. `CURRENT_STATE.md` says they are Project copies "not yet in the repo's `claude/` folder", and the repo's `claude/project-handover.md` has seven open questions, not nine. I could not read the doc that defines Q9 or its thresholds. This review is against the implemented page and the Q9 list in the brief. Sync those two docs before the next review.

## Confirmed issues

1. **B550M-A Pro SATA count was wrong. Fixed.** The data said 6 SATA ports; MSI's spec is 4 SATA and 1 M.2 ([Newegg listing](https://www.newegg.ca/msi-b550m-a-pro-micro-atx-amd-motherboard-amd-b550-am4/p/N82E16813144577)). It did not affect feasibility because the tool allows only two drives, but the spec line and the rule message were wrong. Changed to 4.
2. **The power message was misleading. Fixed.** The warning said "below 130% headroom" when it meant below 130% of estimated draw. The fail message said "needs 110%+" while 110% is only a warning and the scenario need asks for 30% spare. Changed to "needs at least 110% of draw" and "under 30% headroom".
3. **RTX 5060 Ti 16GB and RTX 5070 prices are inverted against the real market.** The tool has the 5060 Ti at $1,099 and the 5070 at $999. Live Australian lows on 6 Nov 2026 are about $899 for the [5060 Ti 16GB](https://buywisely.com.au/au/product/msi-geforce-rtx-5060-ti-inspire-2x-oc-16gb-gddr7) and about $1,166 for the [RTX 5070 12GB](https://buywisely.com.au/au/product/msi-nvidia-geforce-rtx-5070-12g-ventus-3x-oc-boost-2542-mhz-cuda-6144-units-12gb-gddr7-hdmi-x-1). In the tool the 5060 Ti is slower (index 62 v 78), $100 dearer, and only 4 GB richer, so it is strictly dominated. It is in no reference build, but a student can pick it in the surf brief and waste money. Not fixed because it is price data, not a one-line bug.
4. **The power estimate uses nominal TDP, not peak power.** The rule adds CPU TDP + GPU TDP + 75 W. The Ultra 7 265K is 125 W nominal but 250 W max turbo, the i5-12400F is 65 W nominal but 117 W max turbo, and the 9700X is 65 W nominal but 88 W PPT. A 265K + RTX 5070 Ti build is estimated at 500 W; a CX550 is exactly 110% and only a warning, while real peak draw is roughly 625 W. The tool can call a PSU adequate when it is undersized. Not fixed: it needs a peak-power field or a different threshold, which is a design decision.
5. **The "balanced" rule is one-way and compares two different index scales.** CPU index 100 is a 9700X; GPU index 100 is a 5070 Ti. The rule subtracts them and warns only when the GPU is more than 30 points ahead. A 9700X + RTX 3050 scores -78 and passes, so a badly GPU-starved build is called balanced. If the intent is a CPU bottleneck warning, rename it. If it is balance, check both directions. Not fixed.
6. **The interactive can be completed with no justification.** `say('done')` fires when the Review tab opens, as soon as the build is complete and has no red rules. All five justification boxes can be empty. If justification is the assessed part, the done signal should wait for the minimum length on all five. Not fixed because the missing doc may define "done" as build complete.

## Likely issues

- **No CPU cooler in the build or the budget.** The page says "assume a suitable cooler is included", but the 9700X, 5700X, Ultra 5 245K and Ultra 7 265K do not ship with one. The surf reference ($2,686) omits a cooler. It is still under budget, but the total is not a real build cost.
- **Rule 6's failure message always blames M.2 slots.** It can only fail on NVMe count today, because every board has at least four SATA ports and the tool allows two drives. If a board with fewer SATA ports is added, the message will be wrong.
- **The "~" estimate flag is inconsistent.** Some prices are marked as estimates, many are not, but all are "indicative". The RTX 5070's $999 is unmarked and is not a current exact price. Either mark every price "~" or say the list is indicative.
- **Changing parts does not clear the justification text.** A student can write about the RTX 5070, switch to the RX 9060 XT, and the old text remains. It is saved per scenario, not per build.
- **A stale saved part ID counts as filled.** `ready()` checks `!!B[k]`, not whether the ID still resolves. If the catalogue changes, an old localStorage build can look complete.
- **One CPU index hides workload differences.** The three briefs are office, video editing and gaming. One blended index is a reasonable teaching simplification, but it makes the 9700X v 265K comparison closer than it is for gaming and further apart than it is for exports.

## Things I could not verify

- The doc's exact wording for Q9 and the eight rules, because the two named docs are not in the repo.
- Whether 110% and 130% are the doc's intended thresholds or an implementation choice.
- The CPU and GPU indices against a fixed benchmark. The ordering looks sensible, but the numbers are not traceable to a source.
- Whether school laptops can run the Three.js view. It falls back to the part picker when WebGL is missing, but I only ran it under jsdom.
- Real retail prices at the moment a student uses it. Prices move; the tool should date-stamp them or mark them all as estimates.

## Q9, item by item

- **PSU thresholds:** 130% (30% spare) is sensible as the "good" line. 110% is too lenient as the "minimum" because the draw is understated. The code's boundaries are consistent, but the labels were not; the wording is now fixed.
- **CPU and graphics speed indices:** the relative order looks plausible, for example 9700X 100, 265K 128, RTX 5070 78, 5070 Ti 100. The weakness is that they are different scales and rule 8 compares them directly.
- **M.2 and SATA counts:** the B550M-A Pro was the only error I found. The B760M H (2 M.2, 4 SATA), B760I (2, 4), B550M Pro-VDH (2, 4), B650M (2, 4) and B650E-E (3, 4) match their published specs.
- **Prices:** the 5060 Ti/5070 inversion is the clear error. The P310 1TB at $249 is close to the live low of about $255, and the i5-12400F at $209 is close to about $189. The Ultra 7 265K at $499 is high against a live low of about $370. All prices are volatile.

## Feasibility check

`node scripts/check-spec-computer.mjs` reads the page's own data, scenarios and `rulesFor()`, so it cannot drift. It requires all seven slots, the budget, every client need and no red rule.

| Scenario | Working builds | Cheapest | Reference |
|---|---|---|---|
| Bunbury Bakehouse | 118 | $828 | $862, valid |
| South Coast Surf Films | 376 | $2,027 | $2,686, valid |
| Bunbury Esports Club | 19 | $2,037 | $2,041, valid |

All three are feasible. The esports brief is genuinely tight: 19 builds, all on the same i5-12400F, B760I, RTX 5070 and SG13 platform, with only RAM, storage and PSU varying. The script exits 0 and also checks six rule boundaries, including the 110% warning boundary.

## Changes made

- `public/interactives/spec-computer.html`: B550M-A Pro SATA 6 -> 4.
- `public/interactives/spec-computer.html`: power fail/warn message wording.
- `scripts/check-spec-computer.mjs`: new feasibility and boundary check.
- `claude/deepseek-review.md`: this file.

`npm test` passes (140 tests) and `npx tsc --noEmit` passes. The feasibility script exits 0. I did not run a production build or a real browser; neither is needed for a static HTML change and a standalone script, but the page was smoke-tested under jsdom.

## How long this should take

A focused review like this is about 45 to 60 minutes: read the page and data (15), test the rules and brute-force (15), verify the handful of prices and specs (15), write up and commit (10). The missing docs added time and uncertainty; with them in the repo it would be closer to 45 minutes. A real browser pass with three builds and a phone check would add another 20 to 30 minutes.

## Honest notes

The page was unusually easy to review: the data, rules and scenarios sit in one file, and the exposed `__spec` object made testing straightforward. That was the easy part.
The hard part was the handover, not the code: the two docs the brief names are not in the repo, and the repo handover still says seven open questions, so I spent time proving they were absent.
The price and TDP issues are the kind of thing a code review cannot settle alone. They need a decision about whether this is a teaching simplification or a buying guide.
