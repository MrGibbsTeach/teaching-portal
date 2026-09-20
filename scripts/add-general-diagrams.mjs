// Adds interactiveDiagram blocks to General hardware/networks lessons (the topics the
// audit found had no interactive block). Idempotent: skips lessons that already have one.
import { readFileSync, writeFileSync } from "node:fs";

const toggles = (defs) => ({ toggles: defs.map(([id, label]) => ({ id, label })) });
const goalOf = (defs) => Object.fromEntries(defs.map(([id, , want]) => [id, want]));

function checklist(title, instruction, defs, explanation) {
  return { type: "interactiveDiagram", title, instruction, kind: "toggle-state", config: toggles(defs), goalState: goalOf(defs), explanation };
}
function matcher(title, instruction, pairs, explanation) {
  return {
    type: "interactiveDiagram", title, instruction, kind: "connect",
    config: { left: pairs.map((p) => p[0]), right: [...new Set(pairs.map((p) => p[1]))] },
    goalState: { links: pairs },
    explanation,
  };
}

const ADD = {
  "year-11-applied-it-general": {
    "input-output-and-peripheral-devices": matcher(
      "Sort the devices",
      "Tap a device on the left, then tap what kind of device it is.",
      [["Keyboard", "Input"], ["Webcam", "Input"], ["Monitor", "Output"], ["Speakers", "Output"], ["Printer", "Output"], ["Touchscreen", "Input and output"]],
      "A touchscreen is both: you touch it to send information in, and it shows information back.",
    ),
    "troubleshooting-hardware-and-software": checklist(
      "Fix the computer that will not start",
      "The computer shows a black screen. Switch each setting to the right position until it works.",
      [["power", "Power cable plugged in", true], ["socket", "Wall socket switched on", true], ["video", "Monitor cable connected to the computer", true], ["sleep", "Computer asleep", false]],
      "Always check the simple things first: power, cables, then settings.",
    ),
    "connecting-and-troubleshooting-networks": checklist(
      "Fix the office Wi-Fi",
      "A laptop cannot get online. Switch each setting to the right position until it connects.",
      [["router", "Router switched on", true], ["modem", "Cable from router to modem connected", true], ["wifi", "Wi-Fi turned on (laptop)", true], ["airplane", "Airplane mode", false], ["password", "Correct Wi-Fi password entered", true]],
      "Work through the network one step at a time: power, cables, laptop settings, then the password.",
    ),
    "network-security": checklist(
      "Secure the home network",
      "Set up the router so the network is safe.",
      [["password", "Default router password changed", true], ["encryption", "WPA2 or WPA3 encryption on", true], ["firewall", "Firewall turned on", true], ["updates", "Router firmware kept up to date", true], ["shared", "Wi-Fi password shared publicly", false]],
      "Strong passwords, encryption, a firewall and updates all help keep intruders out.",
    ),
  },
  "year-12-applied-it-general": {
    "maintenance-and-troubleshooting": checklist(
      "Maintenance checklist",
      "Turn on the good habits and turn off the risky ones.",
      [["updates", "Install system updates", true], ["scan", "Run regular antivirus scans", true], ["backup", "Back up important files", true], ["attachments", "Open every email attachment", false]],
      "Regular updates, scans and backups keep a computer healthy and your files safe.",
    ),
    "network-topologies": matcher(
      "Match the topology",
      "Tap a topology on the left, then tap how it is laid out.",
      [
        ["Star", "All devices connect to a central switch"],
        ["Bus", "All devices share one main cable"],
        ["Ring", "Each device connects to two neighbours in a loop"],
        ["Mesh", "Devices connect to many other devices"],
      ],
      "The layout of a network is called its topology.",
    ),
  },
};

let added = 0;
for (const [slug, byLesson] of Object.entries(ADD)) {
  const file = `lib/content/data/${slug}.json`;
  const data = JSON.parse(readFileSync(file, "utf8"));
  const raw = readFileSync(file, "utf8");
  const indent = raw.startsWith('{\n "') ? 1 : 2;
  for (const u of data.units) for (const t of u.topics) for (const l of t.lessons) {
    const diagram = byLesson[l.id];
    if (!diagram || l.blocks.some((b) => b.type === "interactiveDiagram")) continue;
    const at = l.blocks.findIndex((b) => b.type === "quizQuestion");
    l.blocks.splice(at === -1 ? l.blocks.length : at, 0, diagram);
    added++;
  }
  writeFileSync(file, JSON.stringify(data, null, indent));
}
console.log(`Added ${added} diagram(s).`);
