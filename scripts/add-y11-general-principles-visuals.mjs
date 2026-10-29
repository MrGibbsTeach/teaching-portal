// Add a visual reference grid to the Year 11 General Principles of Design lesson.
// This pilot mirrors the photo-led reference grids already used in the Y12 General
// and Y11 ATAR Design Concepts lessons.
import { readFileSync, writeFileSync } from "node:fs";

const grid = {
  type: "grid",
  title: "Five Principles in Real Designs",
  items: [
    {
      icon: "⚖️",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Taj_Mahal%2C_Agra%2C_India.jpg/500px-Taj_Mahal%2C_Agra%2C_India.jpg",
      label: "Balance",
      description: "The two sides mirror each other, giving the building a calm, stable feel.",
    },
    {
      icon: "🎯",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Caravaggio_-_Canestra_di_frutta.jpg/500px-Caravaggio_-_Canestra_di_frutta.jpg",
      label: "Emphasis and dominance",
      description: "The basket is the focal point because it is brightly lit against a dark background.",
    },
    {
      icon: "◐",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rembrandt_Harmensz._van_Rijn_-_Nachtwacht_-_Google_Art_Project.jpg/500px-Rembrandt_Harmensz._van_Rijn_-_Nachtwacht_-_Google_Art_Project.jpg",
      label: "Contrast",
      description: "Light and dark areas, large and small shapes, and blue against white make the forms easy to distinguish.",
    },
    {
      icon: "🏛️",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Parthenon_from_west.jpg/500px-Parthenon_from_west.jpg",
      label: "Unity",
      description: "Repeated columns, materials and proportions make the parts feel like one structure.",
    },
    {
      icon: "📐",
      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/500px-The_Great_Wave_off_Kanagawa.jpg",
      label: "Proportion",
      description: "The enormous wave dwarfs the boats and Mount Fuji, using relative size to communicate scale and importance.",
    },
  ],
};

const file = "lib/content/data/year-11-applied-it-general.json";
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);
const lesson = data.units.flatMap((u) => u.topics).flatMap((t) => t.lessons)
  .find((l) => l.id === "principles-of-design");
if (!lesson) throw new Error("Year 11 General Principles of Design lesson not found");
if (lesson.blocks.some((b) => b.type === "grid" && b.title === grid.title)) {
  console.log("Principles visual grid already present.");
  process.exit(0);
}
const lastTeachingBlock = lesson.blocks.findIndex((b) => b.type === "callout");
lesson.blocks.splice(lastTeachingBlock < 0 ? 1 : lastTeachingBlock, 0, grid);
const indent = raw.replace(/\r\n/g, "\n").startsWith('{\n "') ? 1 : 2;
writeFileSync(file, JSON.stringify(data, null, indent) + "\n");
console.log("Added one visual grid to Year 11 General Principles of Design.");
