// Generate the self-hosted illustrations used by General Design Concepts grids.
// The diagrams are deliberately local SVGs so lesson visuals do not depend on
// third-party image hosts or hotlink limits.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ink = "#172554";
const blue = "#4f46e5";
const teal = "#0891b2";
const gold = "#f59e0b";
const pale = "#e0e7ff";
const svg = (title, body, bg = "#f8fafc") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" role="img" aria-label="${title}"><title>${title}</title><rect width="500" height="300" rx="22" fill="${bg}"/>${body}</svg>\n`;
const label = (x, y, text, color = ink, size = 15) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}" font-weight="700">${text}</text>`;
const balanceWorkedExample = `<svg viewBox="0 0 760 310" role="img" aria-label="Symmetrical and asymmetrical balance in two digital layouts" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;border-radius:12px;background:#f8fafc"><title>Symmetrical and asymmetrical balance in two digital layouts</title><text x="32" y="38" fill="#475569" font-family="Arial,sans-serif" font-size="20" font-weight="700">BALANCE: WHERE THE VISUAL WEIGHT SITS</text><rect x="28" y="55" width="342" height="226" rx="16" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="390" y="55" width="342" height="226" rx="16" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><text x="199" y="88" text-anchor="middle" fill="#334155" font-family="Arial,sans-serif" font-size="17" font-weight="700">SYMMETRICAL</text><text x="561" y="88" text-anchor="middle" fill="#334155" font-family="Arial,sans-serif" font-size="17" font-weight="700">ASYMMETRICAL</text><rect x="78" y="108" width="92" height="80" rx="10" fill="#bfdbfe"/><rect x="228" y="108" width="92" height="80" rx="10" fill="#bfdbfe"/><rect x="151" y="204" width="96" height="34" rx="17" fill="#3b82f6"/><text x="199" y="226" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="13" font-weight="700">ACTION</text><rect x="420" y="108" width="146" height="116" rx="10" fill="#bfdbfe"/><rect x="588" y="108" width="95" height="38" rx="9" fill="#fbbf24"/><rect x="588" y="157" width="95" height="29" rx="8" fill="#fde68a"/><rect x="588" y="196" width="95" height="29" rx="8" fill="#fef3c7"/><text x="199" y="262" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="13">Matching weight on each side</text><text x="561" y="262" text-anchor="middle" fill="#64748b" font-family="Arial,sans-serif" font-size="13">Different sizes, balanced as a group</text></svg><p style='margin-top:10px;font-size:14px;color:#475569'>Symmetrical balance mirrors the visual weight on both sides. Asymmetrical balance uses different elements whose combined visual weight still feels steady.</p>`;

const illustrations = {
  "type-serif.svg": svg("Serif letter specimen", `<text x="250" y="178" text-anchor="middle" fill="#243b53" font-family="Georgia,serif" font-size="132">Aa</text><path d="M112 204h276" stroke="#94a3b8" stroke-width="2"/><path d="M165 199v12m164-12v12" stroke="${gold}" stroke-width="3"/>${label(148,244,"SERIF STROKES", "#64748b",13)}`),
  "type-sans-serif.svg": svg("Sans-serif letter specimen", `<text x="250" y="178" text-anchor="middle" fill="${blue}" font-family="Arial,Helvetica,sans-serif" font-size="132" font-weight="500">Aa</text><path d="M110 204h280" stroke="#94a3b8" stroke-width="2"/>${label(156,244,"CLEAN LETTERFORMS", "#64748b",13)}`),
  "type-script.svg": svg("Script typeface specimen", `<text x="250" y="173" text-anchor="middle" fill="#7c3aed" font-family="cursive" font-size="72" font-style="italic">Moonlit</text><path d="M102 194q65 18 130 0t130 0" fill="none" stroke="${gold}" stroke-width="3"/>${label(150,244,"USE FOR A SHORT ACCENT", "#64748b",13)}`),
  "type-display.svg": svg("Display typeface specimen", `<text x="250" y="157" text-anchor="middle" fill="#c2410c" font-family="Impact,Arial Narrow,sans-serif" font-size="74" font-weight="900" letter-spacing="1">FESTIVAL</text><rect x="70" y="183" width="360" height="14" rx="7" fill="#fed7aa"/><rect x="70" y="183" width="242" height="14" rx="7" fill="#f97316"/>${label(154,244,"LOUD · BRIEF · DISTINCTIVE", "#64748b",13)}`),
  "composition-thirds.svg": svg("Rule of thirds composition", `<rect x="28" y="30" width="444" height="238" rx="14" fill="#0e7490"/><path d="M30 197q80-78 150 0t140-3 152-2v43H30z" fill="#67e8f9"/><path d="M30 223q85-45 170 0t150-1 122-4v25H30z" fill="#155e75"/><circle cx="323" cy="104" r="37" fill="${gold}"/><g stroke="#fff" stroke-width="2" stroke-dasharray="7 6" opacity=".9"><path d="M176 30v238m148-238v238M28 109h444M28 189h444"/></g><circle cx="324" cy="109" r="8" fill="#fff"/>${label(37,288,"FOCAL POINT NEAR AN INTERSECTION", "#475569",12)}`),
  "composition-grid.svg": svg("Grid and alignment layout", `<rect x="42" y="28" width="416" height="238" rx="12" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><rect x="63" y="46" width="374" height="35" rx="7" fill="${blue}"/><rect x="63" y="97" width="236" height="96" rx="8" fill="#bae6fd"/><rect x="314" y="97" width="123" height="42" rx="8" fill="#fde68a"/><rect x="314" y="151" width="123" height="42" rx="8" fill="#ddd6fe"/><rect x="63" y="207" width="374" height="39" rx="8" fill="#dcfce7"/><g stroke="#f97316" stroke-width="2" stroke-dasharray="5 5"><path d="M63 36v220m94-220v220m94-220v220m94-220v220m92-220v220"/></g>${label(150,288,"REPEATED EDGES CREATE ORDER", "#475569",12)}`),
  "composition-golden-ratio.svg": svg("Golden ratio proportion diagram", `<rect x="52" y="38" width="396" height="222" fill="#fff" stroke="#334155" stroke-width="3"/><path d="M297 38v222M52 176h245M207 176v84M207 112h90M261 112v64M261 139h36" fill="none" stroke="${blue}" stroke-width="3"/><path d="M297 38a138 138 0 0 1 138 138M207 176a90 90 0 0 1 90 84M261 112a58 58 0 0 1 36 64M261 139a26 26 0 0 1 26 26" fill="none" stroke="${gold}" stroke-width="5"/><text x="250" y="288" text-anchor="middle" fill="#475569" font-family="Arial,sans-serif" font-size="13" font-weight="700">PROPORTIONS REPEAT AT ABOUT 1 : 1.618</text>`),
  "element-line.svg": svg("Line element examples", `<path d="M62 88h370" stroke="${blue}" stroke-width="5"/><path d="M62 147q90-80 180 0t190 0" fill="none" stroke="${teal}" stroke-width="6"/><path d="M62 218h370" stroke="${gold}" stroke-width="5" stroke-dasharray="13 10"/><path d="m420 76 18 12-18 12" fill="none" stroke="${blue}" stroke-width="4"/>${label(63,270,"DIVIDE   ·   GUIDE   ·   CONNECT", "#475569",13)}`),
  "element-shape.svg": svg("Shape element examples", `<rect x="57" y="76" width="102" height="102" rx="8" fill="${blue}"/><circle cx="248" cy="127" r="55" fill="${teal}"/><path d="M365 75 429 180H301Z" fill="${gold}"/><path d="M83 224q-12-29 19-36 16-26 42-8 28 1 20 30 11 25-25 31-34 12-56-17z" fill="#c4b5fd"/>${label(76,270,"GEOMETRIC AND ORGANIC", "#475569",13)}`),
  "element-space.svg": svg("Positive and negative space", `<rect x="37" y="40" width="426" height="208" rx="16" fill="#e0f2fe"/><circle cx="154" cy="144" r="54" fill="${blue}"/><rect x="291" y="90" width="108" height="108" rx="24" fill="${teal}"/><path d="M209 83v122" stroke="${gold}" stroke-width="3" stroke-dasharray="7 6"/>${label(87,276,"OBJECTS ARE POSITIVE SPACE", "#475569",12)}${label(280,276,"GAPS ARE NEGATIVE SPACE", "#475569",12)}`),
  "element-texture.svg": svg("Texture element surface patterns", `<rect x="36" y="36" width="206" height="218" rx="16" fill="#b45309"/><g fill="none" stroke="#78350f" stroke-width="4" opacity=".8"><path d="M43 73q38-30 78 0t112 0M40 112q48-28 95 0t101 0M42 151q35-22 82 0t113 0M40 192q50-34 100 0t101 0M42 231q36-25 80 0t112 0"/><path d="M80 42v204m71-204v204m48-204v204" stroke-width="1.5"/></g><rect x="265" y="36" width="199" height="218" rx="16" fill="#dbeafe"/><g fill="none" stroke="#60a5fa" stroke-width="3"><path d="M265 83h199M265 128h199M265 173h199M265 218h199M302 36v218M348 36v218M394 36v218M440 36v218"/></g>${label(88,282,"ROUGH GRAIN", "#78350f",12)}${label(308,282,"SMOOTH GRID", "#1d4ed8",12)}`),
  "element-colour.svg": svg("Colour element hue and palette", `<circle cx="148" cy="146" r="94" fill="#ef4444"/><path d="M148 52a94 94 0 0 1 81 47l-81 47z" fill="#f59e0b"/><path d="M229 99a94 94 0 0 1 0 94l-81-47z" fill="#eab308"/><path d="M229 193a94 94 0 0 1-81 47v-94z" fill="#22c55e"/><path d="M148 240a94 94 0 0 1-81-47l81-47z" fill="#0ea5e9"/><path d="M67 193a94 94 0 0 1 0-94l81 47z" fill="#6366f1"/><path d="M67 99a94 94 0 0 1 81-47v94z" fill="#d946ef"/><circle cx="148" cy="146" r="35" fill="#fff"/><rect x="287" y="68" width="54" height="144" rx="12" fill="#312e81"/><rect x="350" y="68" width="54" height="144" rx="12" fill="#6366f1"/><rect x="413" y="68" width="54" height="144" rx="12" fill="#c7d2fe"/>${label(292,247,"HUE  ·  VALUE  ·  SATURATION", "#475569",12)}`),
  "principle-balance.svg": svg("Symmetrical visual balance", `<path d="M250 60v174M205 86h90M223 86l-48 48m100-48 48 48" stroke="#475569" stroke-width="6" fill="none"/><path d="M151 135h48l-24 54zM301 135h48l-24 54z" fill="${blue}"/><rect x="191" y="230" width="118" height="18" rx="9" fill="${gold}"/>${label(128,282,"SIMILAR VISUAL WEIGHT ON EACH SIDE", "#475569",12)}`),
  "principle-emphasis-dominance.svg": svg("Emphasis and dominance focal point", `<rect x="38" y="42" width="424" height="214" rx="18" fill="#1e1b4b"/><circle cx="250" cy="145" r="72" fill="#312e81"/><circle cx="250" cy="145" r="48" fill="${gold}"/><path d="m250 106 12 26 29 4-21 20 5 29-25-14-25 14 5-29-21-20 29-4z" fill="#fff7ed"/><circle cx="96" cy="96" r="14" fill="#4338ca"/><circle cx="405" cy="210" r="10" fill="#4338ca"/>${label(165,282,"ONE CLEAR FOCAL POINT", "#475569",13)}`),
  "principle-emphasis.svg": svg("Emphasis through colour and contrast", `<rect x="35" y="36" width="430" height="220" rx="18" fill="#1e293b"/><rect x="68" y="72" width="138" height="46" rx="10" fill="#334155"/><rect x="68" y="133" width="210" height="16" rx="8" fill="#475569"/><rect x="68" y="161" width="168" height="16" rx="8" fill="#475569"/><rect x="310" y="162" width="115" height="52" rx="26" fill="#fb923c"/><text x="367" y="194" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="700">BOOK</text>${label(117,282,"THE BUTTON STANDS OUT", "#475569",13)}`),
  "principle-dominance.svg": svg("Dominance through relative size", `<path d="M35 224Q103 113 181 206t146-24 138 4v49H35z" fill="#0891b2"/><path d="M35 240q100-45 196 0t234-4v20H35z" fill="#155e75"/><path d="M88 175q80-161 161 0z" fill="${blue}"/><path d="M260 215l22-30 22 30zM330 218l18-22 18 22z" fill="#f59e0b"/><circle cx="120" cy="75" r="25" fill="#fde68a"/>${label(92,282,"LARGEST FORM IS SEEN FIRST", "#475569",13)}`),
  "principle-contrast.svg": svg("Contrast between light and dark", `<rect x="40" y="42" width="420" height="215" rx="16" fill="#0f172a"/><rect x="67" y="72" width="180" height="150" rx="12" fill="#f8fafc"/><rect x="263" y="72" width="170" height="58" rx="12" fill="#f97316"/><rect x="263" y="145" width="170" height="77" rx="12" fill="#334155"/><text x="157" y="135" text-anchor="middle" fill="#0f172a" font-family="Arial,sans-serif" font-size="17" font-weight="700">CLEAR TEXT</text><text x="348" y="108" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">ACTION</text>${label(127,282,"LIGHT · DARK · WARM · COOL", "#475569",13)}`),
  "principle-unity.svg": svg("Unity through repeated components", `<rect x="40" y="42" width="420" height="215" rx="16" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><rect x="64" y="73" width="85" height="44" rx="12" fill="${blue}"/><rect x="164" y="73" width="85" height="44" rx="12" fill="${blue}"/><rect x="264" y="73" width="85" height="44" rx="12" fill="${blue}"/><rect x="364" y="73" width="72" height="44" rx="12" fill="${blue}"/><g fill="#dbeafe"><rect x="64" y="139" width="85" height="86" rx="10"/><rect x="164" y="139" width="85" height="86" rx="10"/><rect x="264" y="139" width="85" height="86" rx="10"/><rect x="364" y="139" width="72" height="86" rx="10"/></g><g fill="${teal}"><circle cx="106" cy="163" r="13"/><circle cx="206" cy="163" r="13"/><circle cx="306" cy="163" r="13"/><circle cx="400" cy="163" r="13"/></g>${label(147,282,"REPEAT COLOUR · SHAPE · SPACING", "#475569",12)}`),
  "principle-proportion.svg": svg("Proportion through scale", `<rect x="42" y="58" width="126" height="170" rx="15" fill="#c7d2fe"/><rect x="187" y="97" width="126" height="131" rx="15" fill="#818cf8"/><rect x="332" y="144" width="126" height="84" rx="15" fill="${blue}"/><circle cx="105" cy="115" r="26" fill="#fff"/><circle cx="250" cy="141" r="20" fill="#fff"/><circle cx="395" cy="170" r="13" fill="#fff"/>${label(64,267,"PRIMARY", "#475569",12)}${label(215,267,"SECONDARY", "#475569",12)}${label(364,267,"DETAIL", "#475569",12)}`),
};

mkdirSync("public/design-concepts", { recursive: true });
for (const [name, content] of Object.entries(illustrations)) {
  writeFileSync(`public/design-concepts/${name}`, content);
}

const files = [
  "lib/content/data/year-11-applied-it-general.json",
  "lib/content/data/year-12-applied-it-general.json",
];
const artworkByLessonAndLabel = {
  "principles-of-design": {
    Balance: "principle-balance.svg",
    "Emphasis and dominance": "principle-emphasis-dominance.svg",
    Contrast: "principle-contrast.svg",
    Unity: "principle-unity.svg",
    Proportion: "principle-proportion.svg",
  },
  typography: {
    Serif: "type-serif.svg",
    "Sans-serif": "type-sans-serif.svg",
    "Script / Handwritten": "type-script.svg",
    "Display / Decorative": "type-display.svg",
  },
  "compositional-rules": {
    "Rule of Thirds": "composition-thirds.svg",
    "Grid & Alignment": "composition-grid.svg",
    "Golden Ratio": "composition-golden-ratio.svg",
  },
  "design-concepts-1-elements-of-design": {
    Line: "element-line.svg",
    Shape: "element-shape.svg",
    Space: "element-space.svg",
    Texture: "element-texture.svg",
    Colour: "element-colour.svg",
  },
  "design-concepts-2-principles-of-design": {
    Balance: "principle-balance.svg",
    Emphasis: "principle-emphasis.svg",
    Dominance: "principle-dominance.svg",
    Unity: "principle-unity.svg",
  },
};
let replaced = 0;
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  for (const topic of data.units.flatMap((unit) => unit.topics)) {
    for (const lesson of topic.lessons) {
      const mapping = artworkByLessonAndLabel[lesson.id];
      if (!mapping) continue;
      for (const block of lesson.blocks) {
        if (block.type !== "grid") continue;
        for (const item of block.items) {
          const name = mapping[item.label];
          if (name && item.photo !== `/design-concepts/${name}`) {
            item.photo = `/design-concepts/${name}`;
            replaced++;
          }
        }
      }
    }
  }
  if (file.endsWith("year-11-applied-it-general.json")) {
    const lesson = data.units.flatMap((unit) => unit.topics).flatMap((topic) => topic.lessons)
      .find((item) => item.id === "principles-of-design");
    const balance = lesson?.blocks.find((block) => block.type === "richText" && block.heading?.startsWith("Balance"));
    if (!balance) throw new Error("Year 11 Balance worked example not found");
    balance.html = balanceWorkedExample;
  }
  const indent = raw.replace(/\r\n/g, "\n").startsWith('{\n "') ? 1 : 2;
  writeFileSync(file, JSON.stringify(data, null, indent) + "\n");
}
console.log(`Wrote ${Object.keys(illustrations).length} local illustrations; replaced ${replaced} remote image links.`);
