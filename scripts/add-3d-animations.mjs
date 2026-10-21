// Adds the 3D animations (public/animations/*.html) to the lessons they support.
// Each placement inserts one `animation3d` block before a named block in the lesson,
// with a lesson-specific lead-in and pause-and-check questions pitched to the course.
// Safe to re-run: a lesson that already has the animation is skipped.
//
//   node scripts/add-3d-animations.mjs
import fs from "node:fs";
import path from "node:path";

const DATA = path.join(process.cwd(), "lib/content/data");

const PC = "/animations/inside-the-computer.html";
const NET = "/animations/packet-journey.html";
const BIN = "/animations/binary-lights.html";

/* ---------------- Question sets ---------------- */

const pcFoundations = [
  { stage: "Input", question: "What does the keyboard do?", answer: "It sends information into the computer. That makes it an input device." },
  { stage: "Storage", question: "Where are your files kept when the computer is turned off?", answer: "In storage, like the SSD or the hard drive (HDD)." },
  { stage: "Memory", question: "What happens to what is in RAM when you turn the computer off?", answer: "It is wiped. RAM only remembers things while the power is on." },
  { stage: "Processing", question: "Which part is the brain of the computer?", answer: "The CPU, also called the processor." },
  { stage: "Output", question: "Name the two output devices you can see.", answer: "The monitor and the speakers." },
];

const pcCore = [
  { stage: "Input", question: "Name the two input devices shown, and one more input device that is not shown.", answer: "Keyboard and mouse. Others include a microphone, webcam, touchscreen, scanner or game controller." },
  { stage: "Storage", question: "Why do the SSD's packets reach the RAM before the HDD's?", answer: "An SSD stores data on flash memory chips with no moving parts. An HDD has to spin a disk and move a read arm to find the data, so it is much slower." },
  { stage: "Memory", question: "What happens to the data in RAM when the computer is switched off?", answer: "It is lost. RAM is volatile, so it only holds data while it has power. That is why work has to be saved to storage." },
  { stage: "Processing", question: "Why do packets keep moving back and forth between the CPU and the RAM?", answer: "The CPU fetches instructions and data from RAM, processes them, then writes the results back to RAM." },
  { stage: "Output", question: "Which component turns the result into a picture? Name the two output devices shown.", answer: "The graphics card (GPU) makes the picture. The output devices are the monitor and the speakers." },
];

const pcAtar = [
  pcCore[0],
  { stage: "Storage", question: "Explain why the SSD's packets arrive first, using the term access time.", answer: "An SSD uses flash memory with no moving parts, so its access time is almost instant. An HDD must spin the platter and move the read/write head to the right track, which adds delay and lowers read speed." },
  { stage: "Memory", question: "Programs are copied from storage into RAM before they run. Why not run them straight from storage?", answer: "RAM is far faster than storage, so the CPU can fetch instructions quickly. Running from storage would leave the CPU waiting. The trade-off is that RAM is volatile and more expensive per GB." },
  { stage: "Processing", question: "Describe what the CPU is doing with each packet it fetches from RAM.", answer: "It runs the fetch-decode-execute cycle: fetch the instruction from memory, decode it in the control unit, execute it in the ALU, then store the result back in RAM (or a register)." },
  pcCore[4],
  { stage: "Exam link", question: "A user says their computer is slow when several programs are open. Using this animation, which component would you upgrade first and why?", answer: "RAM. When RAM is full, data has to be swapped out to storage, which is much slower. More RAM keeps more programs in fast memory. A strong answer links the specification (for example 8 GB to 16 GB) to what the user notices." },
];

const netCore = [
  { stage: "Split", question: "Why is the message split into packets instead of being sent in one piece?", answer: "Small packets share the network fairly, can take different routes, and if one is lost only that packet has to be sent again." },
  { stage: "Switch", question: "What is the job of the switch?", answer: "It connects the devices inside one local network (LAN) and sends each packet to the right device." },
  { stage: "Router", question: "What does the router do that the switch does not?", answer: "It connects different networks, such as the school network and the internet. It reads each packet's destination address to decide where to send it." },
  { stage: "Internet", question: "Why do the packets arrive in the order 3, 1, 4, 2?", answer: "Each packet can take a different route. Some routes are shorter or less busy, so the packets arrive out of order." },
  { stage: "Reassemble", question: "How does Sam's laptop rebuild the message in the right order?", answer: "Every packet is numbered, so the laptop puts them back in number order." },
  { stage: "Reply", question: "What happens if one packet never arrives?", answer: "Sam's laptop never confirms it, so your laptop sends that packet again." },
];

const netAtar = [
  { stage: "Split", question: "What does each packet's header contain, and what is the rest of the packet called?", answer: "The header holds the source and destination IP addresses, a sequence number and error-checking data. The rest is the payload, the piece of the message." },
  { stage: "Switch", question: "How does a switch decide which port to send data out of?", answer: "It reads the destination MAC address and looks it up in its MAC address table, so data only goes to the device it is meant for (unlike a hub, which sends it to every port)." },
  { stage: "Router", question: "What does the router read, and how does it choose where to send each packet next?", answer: "It reads the destination IP address and checks its routing table to choose the next hop towards that network." },
  { stage: "Internet", question: "Which protocol gets each packet to the right address, and why can packets arrive out of order?", answer: "IP. It routes every packet independently, so packets can take different paths with different delays." },
  { stage: "Reassemble", question: "Which protocol puts the packets back in order, and what does it use to do it?", answer: "TCP, using the sequence number in each packet's header." },
  { stage: "Reply", question: "What is the green packet called, and how does it make TCP reliable?", answer: "An acknowledgement (ACK). If the sender gets no ACK for a packet within a set time, it retransmits that packet, so no data is lost." },
];

const binCore = [
  { stage: "Bit", question: "What two values can one bit hold?", answer: "0 (off) or 1 (on)." },
  { stage: "Byte", question: "How many bits are in a byte, and what is the biggest number one byte can store?", answer: "8 bits. The biggest is 11111111, which is 255." },
  { stage: "Number", question: "Which switches would be on to show 6?", answer: "The 4 and the 2, so 00000110." },
  { stage: "Letter", question: "The code for B is 66. Write 66 in binary.", answer: "01000010 (64 + 2)." },
  { stage: "Pixel", question: "How many bytes does one pixel need, and what colour is 255, 0, 0?", answer: "3 bytes, one each for red, green and blue. 255, 0, 0 is pure red." },
];
const binFileLink = {
  stage: "Link it",
  question: "A photo is 4000 × 3000 pixels. Roughly how many bytes is it before compression?",
  answer: "12 million pixels × 3 bytes = 36 million bytes, about 36 MB. That is why formats like JPEG and PNG compress images.",
};

/* ---------------- Placements ---------------- */

const block = (src, title, caption, pauseQuestions) => ({ type: "animation3d", src, title, caption, pauseQuestions });
const PC_T = "Inside the Computer";
const NET_T = "Packet Journey";
const BIN_T = "Binary Lights";
const heading = (text) => (b) => b.type === "heading" && b.text === text;
const headingStarts = (text) => (b) => b.type === "heading" && b.text.startsWith(text);
const titled = (type, title) => (b) => b.type === type && b.title === title;

const PLACEMENTS = [
  // Year 11 AIT Foundations (authored in ait-foundations.json)
  { file: "ait-foundations.json", lesson: "c11_1_l2", before: titled("checkpointVideo", "Inside Your Computer"),
    block: block(PC, PC_T, "See all of these parts working together. Watch where the orange data goes.", pcFoundations) },

  // Year 11 AIT General
  { file: "year-11-applied-it-general.json", lesson: "cpu-and-memory", before: heading("The CPU: Engine of the Machine"),
    block: block(PC, PC_T, "Watch the RAM and the SSD closely. They are the two parts that decide how fast the video editor's exports run.", pcCore) },
  { file: "year-11-applied-it-general.json", lesson: "components-of-a-wireless-network", before: heading("The Core Network Components"),
    block: block(NET, NET_T, "Before you plan the surf club's network, watch how one message travels through a switch, a router, the internet and Wi-Fi.", netCore) },
  { file: "year-11-applied-it-general.json", lesson: "common-file-formats", before: (b) => b.type === "keyTerms",
    block: block(BIN, BIN_T, "Every file format is a way of arranging bits and bytes. Watch how numbers, letters and colours are stored.", [...binCore, binFileLink]) },

  // Year 11 AIT ATAR
  { file: "year-11-applied-it-atar.json", lesson: "hardware-1-computer-systems-the-cpu", before: titled("video", "How does Computer Hardware Work?"),
    block: block(PC, PC_T, "This is the Input, Process, Store, Output cycle with real components. Tap a part to meet it, slide to Exploded, or press Flyover for a guided tour.", pcAtar) },
  { file: "year-11-applied-it-atar.json", lesson: "networks-2-network-hardware", before: titled("grid", "Network Hardware Devices"),
    block: block(NET, NET_T, "Watch the job each device does: the switch inside the network, the router between networks, and Wi-Fi at the end.", netAtar) },
  { file: "year-11-applied-it-atar.json", lesson: "application-skills-1-image-editing", before: titled("grid", "Raster Image Formats"),
    block: block(BIN, BIN_T, "A raster image is a grid of pixels, and every pixel is stored as bytes. The last stage shows how.", [...binCore, binFileLink]) },

  // Year 12 AIT General
  { file: "year-12-applied-it-general.json", lesson: "hardware-1-cpu-and-memory", before: headingStarts("Worked example"),
    block: block(PC, PC_T, "Before the worked example, watch a file move from storage into RAM and through the CPU.", pcCore) },
  { file: "year-12-applied-it-general.json", lesson: "networks-1-networking-concepts", before: headingStarts("Worked example"),
    block: block(NET, NET_T, "See a network in action before you work through the home network example.", netCore) },
  { file: "year-12-applied-it-general.json", lesson: "application-skills-u3-2-graphic-and-audio-file-formats", before: headingStarts("Worked example"),
    block: block(BIN, BIN_T, "Raster graphics are grids of pixels stored as bytes. The last stage of this animation shows exactly that.", [...binCore, binFileLink]) },

  // Year 12 AIT ATAR
  { file: "year-12-applied-it-atar.json", lesson: "hardware-2-1-components-of-a-computer", before: heading("Components, specifications and usability"),
    block: block(PC, PC_T, "Watch each component do its job. Exam answers need to link a component's specification to what the user experiences.", pcAtar) },
  { file: "year-12-applied-it-atar.json", lesson: "networks-7-2-tcp-ip", before: heading("Roles of TCP and IP"),
    block: block(NET, NET_T, "This is TCP/IP working end to end. IP gets each packet to the right address. TCP numbers the packets, puts them back in order and confirms they arrived.", netAtar) },
];

/* ---------------- Apply ---------------- */

function findLesson(course, id) {
  for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) if (l.id === id) return l;
  return null;
}

// Detect how each file is formatted so a rewrite keeps the diff to the inserted blocks.
function detectFormat(text) {
  const obj = JSON.parse(text);
  for (const indent of [2, 1]) {
    const out = JSON.stringify(obj, null, indent);
    if (out === text) return { indent, newline: false };
    if (out + "\n" === text) return { indent, newline: true };
  }
  return null; // hand-formatted: insert as text instead
}

const byFile = new Map();
for (const p of PLACEMENTS) {
  if (!byFile.has(p.file)) byFile.set(p.file, []);
  byFile.get(p.file).push(p);
}

let added = 0;
for (const [file, list] of byFile) {
  const full = path.join(DATA, file);
  let text = fs.readFileSync(full, "utf8");
  const fmt = detectFormat(text);
  const course = JSON.parse(text);

  for (const p of list) {
    const lesson = findLesson(course, p.lesson);
    if (!lesson) throw new Error(`${file}: lesson ${p.lesson} not found`);
    if (lesson.blocks.some((b) => b.type === "animation3d" && b.src === p.block.src)) {
      console.log(`skip   ${file} ${p.lesson} (already has ${p.block.title})`);
      continue;
    }
    const at = lesson.blocks.findIndex(p.before);
    if (at < 0) throw new Error(`${file}: anchor block not found in ${p.lesson}`);

    if (fmt) {
      lesson.blocks.splice(at, 0, p.block);
    } else {
      // Text insertion: find the lesson, then the anchor block's opening brace within it.
      const anchor = lesson.blocks[at];
      const lessonPos = text.indexOf(`"id": "${p.lesson}"`);
      const key = anchor.title ? `"title": ${JSON.stringify(anchor.title)}` : `"type": "${anchor.type}"`;
      const keyPos = text.indexOf(key, lessonPos);
      const bracePos = text.lastIndexOf("{", keyPos);
      const lineStart = text.lastIndexOf("\n", bracePos) + 1;
      const indent = text.slice(lineStart, bracePos);
      const unit = indent.includes("\t") ? "\t" : " ";
      const json = JSON.stringify(p.block, null, 1).split("\n").map((l, i) => (i === 0 ? l : indent + l.replace(/^ +/, (m) => unit.repeat(m.length)))).join("\n");
      text = text.slice(0, bracePos) + json + ",\n" + indent + text.slice(bracePos);
      lesson.blocks.splice(at, 0, p.block);
    }
    added++;
    console.log(`added  ${file} ${p.lesson} → ${p.block.title} (before block ${at})`);
  }

  if (fmt) text = JSON.stringify(course, null, fmt.indent) + (fmt.newline ? "\n" : "");
  // Make sure what we wrote parses and matches what we meant to write.
  const check = JSON.parse(text);
  for (const p of list) {
    const l = findLesson(check, p.lesson);
    if (!l.blocks.some((b) => b.type === "animation3d" && b.src === p.block.src)) throw new Error(`${file}: ${p.lesson} missing after write`);
  }
  fs.writeFileSync(full, text);
}
console.log(`\n${added} animation block(s) added.`);
