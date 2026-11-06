# Hardware parts research: Spec the Computer

Last checked: 6 Nov 2026. This is the research behind the part list in
`public/interactives/spec-computer.html`. Prices in the tool are indicative AUD for
November 2026 and many are marked "~" as estimates; they are not live retail prices.

**Why this file exists:** the interactive teaches compatibility, so the spec numbers
(socket, memory type, M.2 and SATA counts, card and case lengths) have to be right.
The page hard-codes them. If a manufacturer changes a board revision, update both this
file and the page.

**Method:** each motherboard was checked against the manufacturer's own specification
page on 6 Nov 2026. Gigabyte and MSI block automated readers directly, so those pages
were read through the Wayback Machine snapshot or a text-rendering proxy of the same
manufacturer URL; the snapshot dates are recorded below. ASUS pages were read live.

## Motherboards: M.2 and SATA counts

"OK" means the count in the tool matches the manufacturer's page.

| Part in tool | Model | Socket | Memory | M.2 | SATA | Price | Source (manufacturer) | Checked | Result |
|---|---|---|---|---|---|---|---|---|---|
| b760mh | Gigabyte B760M H DDR4 | LGA1700 | DDR4 | 2 | 4 | ~$146 | [GIGABYTE spec](https://www.gigabyte.com/Motherboard/B760M-H-DDR4-rev-10/sp) | 6 Nov 2026 | OK |
| b760mgx | Gigabyte B760M Gaming X WiFi6E | LGA1700 | DDR5 | 2 | 4 | $195 | [GIGABYTE spec, GEN5 revision](https://www.gigabyte.com/Motherboard/B760M-GAMING-X-WIFI6E-GEN5/sp) | 6 Nov 2026 | OK, but see note 1 |
| b760i | Gigabyte B760I Aorus Pro DDR4 | LGA1700 | DDR4 | 2 | 4 | ~$319 | [GIGABYTE spec](https://www.gigabyte.com/Motherboard/B760I-AORUS-PRO-DDR4-rev-10/sp) | 6 Nov 2026 | OK |
| b550a | MSI B550M-A Pro | AM4 | DDR4 | 1 | 4 | ~$103 | [MSI spec](https://www.msi.com/Motherboard/B550M-A-PRO/Specification) (snapshot 1 Mar 2026) | 6 Nov 2026 | OK (was 6 SATA; fixed 6 Nov 2026) |
| b550m | MSI B550M Pro-VDH WiFi | AM4 | DDR4 | 2 | 4 | $187 | [MSI spec](https://www.msi.com/Motherboard/B550M-PRO-VDH-WIFI/Specification) (snapshot 12 Dec 2025) | 6 Nov 2026 | OK |
| b650m | MSI B650M Gaming Plus WiFi | AM5 | DDR5 | 2 | 4 | ~$199 | [MSI spec](https://www.msi.com/Motherboard/B650M-GAMING-PLUS-WIFI/Specification) (snapshot 17 Dec 2025) | 6 Nov 2026 | OK |
| b650e | ASUS TUF Gaming B650E-E WiFi | AM5 | DDR5 | 3 | 4 | $290 | [ASUS tech specs](https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b650e-e-wifi/techspec/) | 6 Nov 2026 | OK |
| b860m | ASUS Prime B860M-A WiFi-CSM | LGA1851 | DDR5 | 2 | 4 | $297 | [ASUS tech specs](https://www.asus.com/au/motherboards-components/motherboards/prime/prime-b860m-a-wifi-csm/techspec/) | 6 Nov 2026 | OK |

Notes:

1. The tool calls this board "B760M Gaming X WiFi6E"; GIGABYTE's current page is the
   "B760M GAMING X WIFI6E GEN5" revision. The storage count is unchanged (2 M.2, 4 SATA)
   and the memory is DDR5 either way, so the rule behaviour is unaffected. Rename the row
   to match the page, or keep the short name, is an owner call.
2. Every board in the catalogue has at least four SATA ports, and the tool allows only
   two drives, so the SATA rule can never be the one that fails. Rule 6's failure message
   still says "not enough M.2 slots" only; that stays true while this table is unchanged.

## CPUs

The tool stores one blended performance index (Ryzen 7 9700X = 100), not benchmark
results. Core counts, sockets, TDP and integrated graphics are the facts to check.

| Part in tool | Model | Socket | Cores / threads | TDP in tool | Built-in graphics | Price | Notes |
|---|---|---|---|---|---|---|---|
| i312100 | Intel Core i3-12100 | LGA1700 | 4 / 8 | 60 W | Yes | ~$159 | Nominal TDP; turbo higher |
| i512400f | Intel Core i5-12400F | LGA1700 | 6 / 12 | 65 W | No | $209 | Needs a graphics card |
| r55600g | AMD Ryzen 5 5600G | AM4 | 6 / 12 | 65 W | Yes | ~$229 | Added to this table 6 Nov 2026; already in the page. 6 cores, built-in Vega graphics, AM4 |
| r55600 | AMD Ryzen 5 5600 | AM4 | 6 / 12 | 65 W | No | ~$199 | Needs a graphics card |
| r75700x | AMD Ryzen 7 5700X | AM4 | 8 / 16 | 65 W | No | ~$299 | Needs a graphics card |
| r57600 | AMD Ryzen 5 7600 | AM5 | 6 / 12 | 65 W | Yes | ~$289 | |
| r79700x | AMD Ryzen 7 9700X | AM5 | 8 / 16 | 65 W | Yes | $549 | Index reference point |
| u5245k | Intel Core Ultra 5 245K | LGA1851 | 14 / 14 | 125 W | Yes | $329 | |
| u7265k | Intel Core Ultra 7 265K | LGA1851 | 20 / 20 | 125 W | Yes | ~$499 | Index 128 |

The 5600G price is an estimate ("~$229"), in line with the AM4 5600 at ~$199. It is the
cheapest way to get six cores plus built-in graphics in this catalogue, which makes it
the natural alternative to the i3-12100 in the Bakehouse brief.

## Graphics cards

| Part in tool | Model | VRAM | TDP in tool | Length | Speed index | Price | Note |
|---|---|---|---|---|---|---|---|
| rtx3050 | NVIDIA GeForce RTX 3050 6GB | 6 GB | 70 W | 189 mm | 22 | $344 | 2-fan |
| rx9060xt | AMD Radeon RX 9060 XT 16GB | 16 GB | 160 W | 200 mm | 60 | $729 | Compact 2-fan |
| rtx5060ti | NVIDIA GeForce RTX 5060 Ti 16GB | 16 GB | 180 W | 229 mm | 62 | $1,099 | 2-fan |
| rtx5070 | NVIDIA GeForce RTX 5070 12GB | 12 GB | 250 W | 249 mm | 78 | $999 | 2-fan |
| rx9070xt | AMD Radeon RX 9070 XT 16GB | 16 GB | 304 W | 320 mm | 95 | $1,249 | 3-fan |
| rtx5070ti | NVIDIA GeForce RTX 5070 Ti 16GB | 16 GB | 300 W | 304 mm | 100 | ~$1,599 | Index reference point |

Known issue, not fixed and left for the owner: the 5060 Ti is priced above the 5070
while being slower and only 4 GB richer, so it is dominated. Live Australian lows on
6 Nov 2026 were about $899 for the 5060 Ti 16GB and about $1,166 for the 5070, which
inverts the tool's prices. Prices move; decide whether this is a teaching list (keep the
numbers approximate) or a buying guide (refresh every term).

## What is not verified

- The CPU and graphics indices are a teaching simplification, not a benchmark. Relative
  order looks sensible; absolute values are not traceable to a source.
- TDP figures are nominal, not peak. Real turbo and transient draw is higher, so the
  power estimate is deliberately conservative in the student's favour. Changing that is
  a rule decision, not a data fix.
- RAM, SSD, PSU and case prices were not re-checked this session; only the motherboard
  spec counts and the 5600G row were in scope.
