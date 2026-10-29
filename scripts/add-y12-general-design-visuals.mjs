// Y12 General's Design Concepts topic taught every element and principle as pure
// text (a table), with zero photos — unlike Y11 ATAR's design-concepts-1-elements-of-design,
// which pairs each element with a real photo via a `grid` block. Clayton flagged this gap
// directly (2026-10-21): "they need a visual cue to what they're seeing... yet none are
// provided in the general course." Adds the same `grid` treatment to the two lessons that
// introduce the vocabulary (elements, then principles) — the relationship lesson that
// follows re-uses the same five/four terms, so doesn't need its own grid.
//
// Images are the same 5 Wikimedia Commons photos Y11 ATAR already uses for the elements
// that overlap (General doesn't teach 3D Form or Tone as separate elements, so those two
// ATAR grid items are left out). The 4 principle photos are new picks, each chosen because
// it demonstrates that specific principle, not just generic "nice" art — every URL below
// was checked with curl before being written in (200 image/jpeg or image/png).
import { readFileSync, writeFileSync } from "node:fs";

const elementsGrid = {
  type: "grid",
  title: "The Five Elements of Design",
  items: [
    {
      icon: "📏",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Orient_IV_%28_%29_-_Bridget_Riley_%281931%29_%2844210674930%29.jpg/500px-Orient_IV_%28_%29_-_Bridget_Riley_%281931%29_%2844210674930%29.jpg",
      label: "Line",
      description: "A mark joining two points — straight, curved, thick or thin. Used to divide, direct the eye, or create a border.",
    },
    {
      icon: "⬡",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Composition%2C_1921_-_Piet_Mondrian%2C_MET_DT4479.jpg/500px-Composition%2C_1921_-_Piet_Mondrian%2C_MET_DT4479.jpg",
      label: "Shape",
      description: "A 2D area with a boundary — geometric (circles, squares) or organic (natural forms).",
    },
    {
      icon: "🔲",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Facevase.png/500px-Facevase.png",
      label: "Space",
      description: "The area around and between items. White (negative) space, like the gap around these two faces, gives a design room to breathe.",
    },
    {
      icon: "🪨",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Weathered_wood_grain_texture_macro_closeup_detail.jpg/500px-Weathered_wood_grain_texture_macro_closeup_detail.jpg",
      label: "Texture",
      description: "How a surface looks like it would feel — rough, smooth or grainy.",
    },
    {
      icon: "🎨",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Color_star-en_%28tertiary_names%29.svg/500px-Color_star-en_%28tertiary_names%29.svg.png",
      label: "Colour",
      description: "Hue, value and saturation used to set mood, draw attention and link items.",
    },
  ],
};

const principlesGrid = {
  type: "grid",
  title: "The Four Principles of Design",
  items: [
    {
      icon: "⚖️",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Taj_Mahal_in_March_2004.jpg/500px-Taj_Mahal_in_March_2004.jpg",
      label: "Balance",
      description: "How visual weight is spread across a design — symmetrical or asymmetrical. The Taj Mahal's perfectly mirrored facade is a classic example of symmetrical balance.",
    },
    {
      icon: "🎯",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Caravaggio_-_Canestra_di_frutta.jpg/500px-Caravaggio_-_Canestra_di_frutta.jpg",
      label: "Emphasis",
      description: "Making one item stand out as the focal point, through contrast and proportion. This basket is lit against a plain background, so it's the only thing the eye can land on.",
    },
    {
      icon: "🌊",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/500px-The_Great_Wave_off_Kanagawa.jpg",
      label: "Dominance",
      description: "One item is clearly the most important and is seen first. Hokusai's wave towers over the boats and even Mount Fuji — there's no doubt what you look at first.",
    },
    {
      icon: "🏛️",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Parthenon_from_west.jpg/500px-Parthenon_from_west.jpg",
      label: "Unity",
      description: "All parts look like they belong together, through proximity and repetition. The Parthenon's columns repeat at equal spacing, so the whole row reads as one structure.",
    },
  ],
};

const ADD = {
  "design-concepts-1-elements-of-design": elementsGrid,
  "design-concepts-2-principles-of-design": principlesGrid,
};

const file = "lib/content/data/year-12-applied-it-general.json";
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);
const indent = raw.replace(/\r\n/g, "\n").startsWith('{\n "') ? 1 : 2;

let added = 0;
for (const u of data.units) {
  for (const t of u.topics) {
    for (const l of t.lessons) {
      const grid = ADD[l.id];
      if (!grid) continue;
      if (l.blocks.some((b) => b.type === "grid")) continue;
      // Straight after the "Key terms" table, before the worked example.
      const at = l.blocks.findIndex((b) => b.type === "table");
      l.blocks.splice(at === -1 ? 0 : at + 1, 0, grid);
      added++;
    }
  }
}
writeFileSync(file, JSON.stringify(data, null, indent) + "\n");
console.log(`Added ${added} grid(s).`);
