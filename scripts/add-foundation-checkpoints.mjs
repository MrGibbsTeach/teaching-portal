// Converts selected Foundations `video` blocks into `checkpointVideo` blocks with
// end-of-video questions (student must watch to the end, no skipping, then answer).
// Idempotent: only converts blocks that are still plain `video`.
//
// NOTE: mid-video timestamps are deliberately not used (nobody has watched these videos
// to time them). Three videos (c11_4_l1, c11_4_l3, c12_5_l1) are general "how the internet
// works" videos that do not cover their lesson's topic, so they get one basic-internet
// question only. Consider replacing those videos.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataFile = join(process.cwd(), "lib/content/data/ait-foundations.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

const mcq = (text, options, correctIndex, explanation) => ({
  atSeconds: "end",
  block: { type: "quizQuestion", question: { questionType: "mcq", text, options, correctIndex, explanation } },
});

const CHECKS = {
  c11_1_l1: [
    mcq("The software is… 🧩", ["The mouse and the screen", "The programs that tell the computer what to do", "The power cable"], 1, "Software is the programs. You cannot touch it."),
    mcq("What does a computer do with the information you give it? 🖥️", ["Ignores it", "Works with it and shows a result", "Deletes it"], 1, "Input goes in, the computer works on it, and output comes out."),
  ],
  c11_1_l2: [
    mcq("Which part is the “brain” of the computer? 🧠", ["The CPU", "The mouse", "The speaker"], 0, "The CPU (processor) does the thinking."),
    mcq("Where does a computer save your files? 💾", ["Storage, like a hard drive", "The keyboard", "The screen"], 0, "Storage devices keep your files, even when the power is off."),
  ],
  c11_4_l1: [
    mcq("What does the internet let computers do? 🌐", ["Share information with each other", "Turn themselves off", "Print by themselves"], 0, "The internet connects computers so they can share information."),
  ],
  c11_4_l3: [
    mcq("The internet is many computers… 🌐", ["Connected together", "Locked in one room", "Turned off"], 0, "Computers all over the world are connected to each other."),
  ],
  c12_1_l1: [
    mcq("A printer shows the result on paper. Which hardware job is that? 🖨️", ["Input", "Output", "Storage"], 1, "Output shows the result to the user."),
    mcq("Hardware is… ⚙️", ["The parts you can touch", "The programs inside the computer", "The internet"], 0, "If you can pick it up, it is hardware."),
  ],
  c12_5_l1: [
    mcq("Which program do you use to look at websites? 🌐", ["A web browser", "A calculator", "A printer"], 0, "A web browser (like Chrome or Edge) opens websites."),
  ],
};

let converted = 0;
for (const u of data.units)
  for (const t of u.topics)
    for (const l of t.lessons) {
      const checks = CHECKS[l.id];
      if (!checks) continue;
      l.blocks = l.blocks.map((b) => {
        if (b.type !== "video") return b;
        converted++;
        return { type: "checkpointVideo", youtubeId: b.youtubeId, title: b.title, checkpoints: checks };
      });
    }

writeFileSync(dataFile, JSON.stringify(data, null, 1));
console.log(`Converted ${converted} video block(s).`);
