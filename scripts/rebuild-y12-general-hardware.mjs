// Rebuilds Year 12 AIT General, Unit 3 "Hardware & Operating Systems" (5 lessons) as interactive card lessons.
// Keeps key terms, tables, animations, extended questions (same ids) and the maintenance toggle activity. Safe to re-run.
// Run: node scripts/rebuild-y12-general-hardware.mjs
import fs from "node:fs";
import { h, mcq, criteria, testTip, scenario, recap, video, reducedMotion, pick, extended, keyTerms, hook, last } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const topic = course.units.find((u) => u.id === "unit3").topics.find((t) => t.id === "hardware");
const [L1, L2, L3, L4, L5] = topic.lessons;
const sparky = (heading, text) => ({ type: "callout", variant: "senior-wisdom", heading, text });
const all = (l, type) => l.blocks.filter((b) => b.type === type);

const memorySvg = `<svg viewBox="0 0 680 170" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.mm-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;animation:mm-g 9s infinite}.mm-2{animation-delay:3s}.mm-3{animation-delay:6s}
@keyframes mm-g{0%,28%{fill:#bfdbfe}32%,100%{fill:#f1f5f9}}
.mm-t{font-size:14px;font-weight:700;fill:#0f172a}.mm-s{font-size:11.5px;fill:#475569}.mm-a{stroke:#94a3b8;stroke-width:3}
.mm-p{fill:#2563eb;animation:mm-m 9s linear infinite}@keyframes mm-m{0%{transform:translateX(0)}100%{transform:translateX(480px)}}
${reducedMotion}
</style>
<line class="mm-a" x1="170" y1="85" x2="238" y2="85"/><line class="mm-a" x1="418" y1="85" x2="486" y2="85"/>
<rect class="mm-b" x="10" y="35" width="160" height="100" rx="14"/><text x="24" y="66" class="mm-t">Secondary storage</text><text x="24" y="86" class="mm-s">SSD or HDD. The file</text><text x="24" y="102" class="mm-s">lives here, powered off.</text>
<rect class="mm-b mm-2" x="248" y="35" width="160" height="100" rx="14"/><text x="262" y="66" class="mm-t">Primary memory</text><text x="262" y="86" class="mm-s">RAM. Holds what is in</text><text x="262" y="102" class="mm-s">use now. Volatile.</text>
<rect class="mm-b mm-3" x="496" y="35" width="174" height="100" rx="14"/><text x="510" y="66" class="mm-t">CPU</text><text x="510" y="86" class="mm-s">Processes the instructions</text><text x="510" y="102" class="mm-s">and plays the video.</text>
<circle class="mm-p" cx="40" cy="152" r="7"/>
</svg>`;
const peripheralsSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.pp-t{font-size:13.5px;font-weight:700;fill:#0f172a}.pp-s{font-size:11.5px;fill:#475569}.pp-n{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}
.pp-i{stroke:#2563eb;stroke-width:4;stroke-dasharray:8 6;animation:pp-r 1.6s linear infinite}.pp-o{stroke:#16a34a;stroke-width:4;stroke-dasharray:8 6;animation:pp-r 1.6s linear infinite}
@keyframes pp-r{to{stroke-dashoffset:-28}}
${reducedMotion}
</style>
<rect class="pp-n" x="10" y="20" width="190" height="60" rx="12" fill="#dbeafe"/><text x="24" y="46" class="pp-t">Input devices</text><text x="24" y="64" class="pp-s">keyboard, scanner, webcam</text>
<rect class="pp-n" x="480" y="20" width="190" height="60" rx="12" fill="#dcfce7"/><text x="494" y="46" class="pp-t">Output devices</text><text x="494" y="64" class="pp-s">monitor, printer, speakers</text>
<rect class="pp-n" x="245" y="55" width="190" height="80" rx="14"/><text x="340" y="92" text-anchor="middle" class="pp-t">Computer</text><text x="340" y="112" text-anchor="middle" class="pp-s">processes the data</text>
<rect class="pp-n" x="245" y="150" width="190" height="34" rx="10" fill="#fef3c7"/><text x="340" y="172" text-anchor="middle" class="pp-t">Storage: external SSD, USB</text>
<line class="pp-i" x1="200" y1="50" x2="245" y2="85"/><line class="pp-o" x1="435" y1="85" x2="480" y2="50"/>
</svg>`;
const osSvg = `<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.os-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;animation:os-g 8s infinite}.os-2{animation-delay:2s}.os-3{animation-delay:4s}.os-4{animation-delay:6s}
@keyframes os-g{0%,22%{fill:#fde68a}26%,100%{fill:#f1f5f9}}
.os-t{font-size:14px;font-weight:700;fill:#0f172a}.os-s{font-size:12px;fill:#475569}
${reducedMotion}
</style>
<rect class="os-b" x="120" y="10" width="440" height="40" rx="10"/><text x="340" y="36" text-anchor="middle" class="os-t">You: the user interface</text>
<rect class="os-b os-2" x="120" y="56" width="440" height="40" rx="10"/><text x="340" y="82" text-anchor="middle" class="os-t">Applications: browser, Word, games</text>
<rect class="os-b os-3" x="120" y="102" width="440" height="40" rx="10" stroke="#d97706"/><text x="340" y="128" text-anchor="middle" class="os-t">Operating system: memory, CPU, files, drivers, security</text>
<rect class="os-b os-4" x="120" y="148" width="440" height="40" rx="10"/><text x="340" y="174" text-anchor="middle" class="os-t">Hardware: CPU, RAM, storage, peripherals</text>
<text x="10" y="132" class="os-s">the OS sits</text><text x="10" y="148" class="os-s">in the middle</text>
</svg>`;
const compatSvg = `<svg viewBox="0 0 680 170" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.cp-n{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}.cp-t{font-size:13.5px;font-weight:700;fill:#0f172a}.cp-s{font-size:11.5px;fill:#475569}
.cp-a{animation:cp-b 6s infinite}.cp-a2{animation-delay:3s}
@keyframes cp-b{0%,40%{opacity:1}50%,100%{opacity:.25}}
${reducedMotion}
</style>
<rect class="cp-n" x="10" y="30" width="190" height="100" rx="14"/><text x="24" y="60" class="cp-t">Old software</text><text x="24" y="80" class="cp-s">made for Windows 7</text>
<rect class="cp-n" x="480" y="30" width="190" height="100" rx="14"/><text x="494" y="60" class="cp-t">New hardware</text><text x="494" y="80" class="cp-s">Windows 11 computers</text>
<g class="cp-a"><path d="M200 62h280" stroke="#dc2626" stroke-width="4" fill="none"/><text x="340" y="52" text-anchor="middle" class="cp-s">will it install and run?</text></g>
<g class="cp-a cp-a2"><path d="M480 108h-280" stroke="#2563eb" stroke-width="4" fill="none"/><text x="340" y="132" text-anchor="middle" class="cp-s">and new software on old machines?</text></g>
<text x="340" y="160" text-anchor="middle" class="cp-t">Always check compatibility both ways.</text>
</svg>`;
const upsSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.up-t{font-size:13.5px;font-weight:700;fill:#0f172a}.up-s{font-size:12px;fill:#475569}
.up-m{fill:#16a34a;animation:up-m 8s infinite}@keyframes up-m{0%,30%{fill:#16a34a}35%,100%{fill:#e2e8f0}}
.up-u{fill:#2563eb;transform-origin:150px 0;transform-box:view-box;animation:up-u 8s infinite}
@keyframes up-u{0%,30%{transform:scaleX(0);opacity:.2}35%{transform:scaleX(1);opacity:1}80%{transform:scaleX(.25);opacity:1}100%{transform:scaleX(0);opacity:.2}}
.up-w{opacity:0;animation:up-w 8s infinite}@keyframes up-w{0%,32%{opacity:0}38%,78%{opacity:1}85%,100%{opacity:0}}
${reducedMotion}
</style>
<text x="10" y="24" class="up-t">A blackout hits the accounting firm's server room</text>
<text x="10" y="64" class="up-s">Mains power</text><rect x="150" y="48" width="500" height="22" rx="11" fill="#e2e8f0"/><rect class="up-m" x="150" y="48" width="260" height="22" rx="11"/>
<text x="10" y="114" class="up-s">UPS battery</text><rect x="150" y="98" width="500" height="22" rx="11" fill="#e2e8f0"/><rect class="up-u" x="150" y="98" width="500" height="22" rx="11"/>
<g class="up-w"><text x="150" y="154" class="up-t" fill="#1d4ed8">Battery takes over: time to save work and shut down safely.</text></g>
</svg>`;

// =================== LESSON 1: CPU and memory ===================
L1.estimatedMinutes = 45;
L1.blocks = [
  hook(L1),
  criteria(["Describe the purpose of the CPU.", "Compare primary and secondary storage.", "Explain how CPU and RAM specifications affect performance."]),
  video("What is inside a laptop?", 4, "A short clip opening up a laptop to show the CPU, RAM and SSD, with a note on what each one does. Suggested source: a teacher-filmed teardown of a spare laptop or a short hardware explainer.", ["Which chip is the CPU", "Where the RAM and SSD sit", "Why a laptop with little RAM feels slow"]),
  h("The big idea"),
  keyTerms(L1),
  { type: "svgFigure", title: "Opening a video file", alt: "A file moves from secondary storage into RAM and then to the CPU.", svg: memorySvg, caption: "Each stage lights up in turn: the file sits in storage, loads into RAM, and the CPU processes it." },
  ...all(L1, "animation3d"),
  { type: "sequence", title: "Put the video playback in order", instruction: "Tap what happens when you double-click a saved video.",
    items: ["The file is stored on the SSD.", "The file and the video player are loaded into RAM.", "The CPU processes the instructions to decode and play the video.", "Power off: RAM is cleared, but the file is still on the SSD."],
    explanation: "Storage holds the file, RAM holds what is in use, the CPU processes it. RAM is volatile; the SSD is not." },
  h("RAM or storage?"),
  { type: "sorter", title: "Primary or secondary?", instruction: "Which type of memory does each statement describe?",
    categories: ["Primary memory (RAM)", "Secondary storage (SSD, HDD)"],
    items: [
      { text: "Loses its contents when the power goes off.", category: 0, why: "Volatile memory is RAM." },
      { text: "Keeps your files with the power off.", category: 1, why: "Non-volatile storage keeps data without power." },
      { text: "Holds the data being used right now, so the CPU can reach it fast.", category: 0, why: "Primary memory is the CPU's working space." },
      { text: "Typically 256 GB to several TB.", category: 1, why: "Secondary storage is much larger than RAM." },
      { text: "Very fast but high cost per GB.", category: 0, why: "RAM is much faster and costs more per GB." },
      { text: "Where a saved video file lives long term.", category: 1, why: "Files are stored long term on secondary storage." },
    ] },
  L1.blocks.find((b) => b.type === "table"),
  { type: "branchingScenario", title: "Two laptops", intro: "Laptop A: 4-core 2.4 GHz CPU, 16 GB RAM, 256 GB SSD. Laptop B: 2-core 1.6 GHz CPU, 8 GB RAM, 1 TB HDD. A student needs one for school.",
    steps: [
      { situation: "She edits short videos for a media project.", prompt: "Which statement best explains which laptop suits her?",
        choices: [
          { text: "Laptop A: video editing loads large clips into RAM, and 16 GB with a faster 4-core CPU copes better than 8 GB.", correct: true, feedback: "It links RAM and CPU specs to the task." },
          { text: "Laptop B, because it stores more videos.", correct: false, feedback: "That is secondary storage, not what makes editing smooth." },
          { text: "Laptop A, because it is newer.", correct: false, feedback: "Age is not a specification. Name the specs and the effect." },
        ] },
      { situation: "She compares the storage of the two laptops.", prompt: "Which comparison earns the marks?",
        choices: [
          { text: "B holds four times more (1 TB against 256 GB), but A's SSD is faster and more durable than B's HDD.", correct: true, feedback: "It compares capacity and speed or durability, as the marker wants." },
          { text: "B has more storage.", correct: false, feedback: "Only one feature, and no comparison of speed." },
          { text: "They both store files.", correct: false, feedback: "A comparison needs differences, not a shared feature." },
        ] },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What does the CPU do?", back: "It processes instructions and performs calculations. Speed is measured in GHz and more cores means more tasks at once." },
      { tag: "Define", front: "What does volatile mean?", back: "Loses its data when the power is turned off, like RAM." },
      { tag: "Explain", front: "Why might 8 GB of RAM be slow for video editing?", back: "Large clips fill the RAM quickly, so the computer falls back on slower storage and lags." },
    ] },
  sparky("Sparky's warning", "Volatile is the word that trips people up every year. It just means 'loses its contents when the power goes', which is RAM. If a student cannot tell me which one is volatile, they cannot yet explain why unsaved work disappears in a blackout."),
  testTip("Explain why a laptop with 8 GB of RAM may be slow for video editing. (2 marks)", "\"It cannot store many videos.\"", "That is secondary storage, not RAM.",
    "\"Video editing loads large clips into RAM; with only 8 GB it fills quickly, so the computer uses slower storage instead and lags.\"", "RAM, the task and the effect."),
  scenario("Choosing a laptop", "A student compares two laptops for school. Laptop A: 4-core 2.4 GHz CPU, 16 GB RAM, 256 GB SSD. Laptop B: 2-core 1.6 GHz CPU, 8 GB RAM, 1 TB HDD."),
  h("Assessment practice"),
  ...extended(L1),
  h("Test-ready recap"),
  recap([
    { icon: "🧠", heading: "Function, not 'the brain'", text: "The CPU processes instructions and performs calculations.", tone: "blue" },
    { icon: "💾", heading: "Compare on capacity and speed", text: "Name both, for both types of storage.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L1),
];

// =================== LESSON 2: Peripherals and systems ===================
L2.estimatedMinutes = 45;
const L2_tables = all(L2, "table");
L2.blocks = [
  hook(L2),
  criteria(["Classify peripherals as input, output or storage.", "Describe desktop systems, mobile devices and servers.", "Select a system type for a user's needs."]),
  video("Inputs, outputs and systems", 3, "A short clip sorting everyday devices into input, output and storage, then showing a desktop, a tablet and a server room. Suggested source: a teacher-filmed walk around the school, or a short computer-systems explainer.", ["Which direction the data moves", "Why a touchscreen is both input and output", "What a server does for many users"]),
  h("The big idea"),
  L2_tables[0],
  { type: "svgFigure", title: "Which way does the data go?", alt: "Input devices send data into the computer, output devices present it, and storage devices hold it.", svg: peripheralsSvg, caption: "Ask which direction the data is moving for the function you are thinking of." },
  h("Input, output or storage?"),
  { type: "sorter", title: "Classify the clinic's devices", instruction: "A physiotherapy clinic lists its devices. Tap the right category.",
    categories: ["Input", "Output", "Storage"],
    items: [
      { text: "Barcode scanner", category: 0, why: "It sends data into the computer." },
      { text: "Receipt printer", category: 1, why: "It presents data from the computer on paper." },
      { text: "External hard drive", category: 2, why: "It saves data outside the computer." },
      { text: "Webcam", category: 0, why: "It captures video and sends it in." },
      { text: "Projector", category: 1, why: "It presents data from the computer on a screen." },
      { text: "USB flash drive", category: 2, why: "It stores data away from the computer." },
    ] },
  L2_tables[1],
  h("Which system fits?"),
  { type: "sorter", title: "Match the person to the system", instruction: "Which type of computer system suits each user?",
    categories: ["Desktop", "Mobile device", "Server"],
    items: [
      { text: "Receptionist who uses a large screen for bookings all day at a fixed desk.", category: 0, why: "A fixed desktop with a large screen suits all-day desk work." },
      { text: "Physio who visits patients and takes notes on the move.", category: 1, why: "A light, battery-powered tablet suits work away from a desk." },
      { text: "Clinic records that every staff computer must reach.", category: 2, why: "A server stores files centrally for many users over a network." },
      { text: "Library catalogue that many staff and students search at once.", category: 2, why: "A server provides a service to many users." },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Tricky", front: "A touchscreen is input or output?", back: "Both. It displays (output) and senses touch (input). Do not force it into one box." },
      { tag: "Compare", front: "What is a server and who uses it?", back: "A machine that provides services to many users over a network, such as storing shared files." },
      { tag: "Justify", front: "Why a tablet for the visiting physio?", back: "It is light and battery-powered, so she can carry it to homes and record notes during appointments." },
    ] },
  sparky("Sparky's tip", "Ask what direction the data is actually moving for the function you are thinking of. A touchscreen displays (output) and senses touch (input): same device, two jobs."),
  testTip("Justify a mobile device for the visiting physio. (3 marks)", "\"Tablets are good.\"", "No link to the user.",
    "\"A tablet is light and battery-powered, so the physio can carry it to homes and record notes during appointments.\"", "Features tied to the user."),
  scenario("The school library", "A school library is upgrading its equipment."),
  h("Assessment practice"),
  ...extended(L2),
  h("Test-ready recap"),
  recap([
    { icon: "↔️", heading: "Think about direction", text: "Input sends data in, output presents it, storage keeps it.", tone: "blue" },
    { icon: "🖥️", heading: "A server is a system, not a peripheral", text: "It provides services to many users over a network.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 4/5 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L2),
];

// =================== LESSON 3: Operating systems ===================
L3.estimatedMinutes = 45;
L3.blocks = [
  hook(L3),
  criteria(["Describe the purpose of an operating system.", "Identify the device types each OS is used on.", "Compare two operating systems."]),
  video("What does an operating system do?", 4, "A short clip showing an OS managing files, running apps, handling a plugged-in printer and installing an update. Suggested source: a teacher-filmed screen recording on a school laptop.", ["The jobs an OS does behind the scenes", "How a driver lets a printer work", "Why updates matter"]),
  h("The big idea"),
  keyTerms(L3),
  { type: "svgFigure", title: "Where the OS sits", alt: "Four layers from top to bottom: user interface, applications, operating system and hardware.", svg: osSvg, caption: "The operating system sits between the applications and the hardware." },
  h("Which OS?"),
  { type: "sorter", title: "Match the OS to its use", instruction: "Which operating system does each description fit best?",
    categories: ["Windows", "macOS", "iOS", "Android", "Linux"],
    items: [
      { text: "A school laptop running the widest range of business and school software.", category: 0, why: "Windows runs the widest range of software." },
      { text: "A graphic design studio's iMac that works closely with other Apple devices.", category: 1, why: "macOS runs on Apple computers and is common in creative industries." },
      { text: "An iPhone, with apps only from the App Store.", category: 2, why: "iOS is only on Apple mobile devices." },
      { text: "A Samsung phone and a smart TV made by different brands.", category: 3, why: "Android is used by many manufacturers." },
      { text: "A free, stable web server that is highly customisable.", category: 4, why: "Linux is open source and common on servers." },
    ] },
  pick(L3, (b) => b.type === "table"),
  { type: "sorter", title: "Open source or proprietary?", instruction: "Sort each feature.",
    categories: ["Open source", "Proprietary"],
    items: [
      { text: "Source code can be viewed and changed.", category: 0, why: "That is the definition of open source." },
      { text: "Owned by a company, with closed source code.", category: 1, why: "That is what proprietary means." },
      { text: "Linux, and the core of Android.", category: 0, why: "Both are open source." },
      { text: "Windows, macOS and iOS.", category: 1, why: "All three are owned by a company." },
    ] },
  { type: "branchingScenario", title: "Windows or Linux?", intro: "A small business is choosing between Windows laptops and Linux laptops for its five staff.",
    steps: [
      { situation: "The owner asks for one real advantage of Linux for the business.", prompt: "Which answer is strongest?",
        choices: [
          { text: "It is free, so the business saves licence fees on five laptops.", correct: true, feedback: "A real advantage linked to the business." },
          { text: "Linux is cool.", correct: false, feedback: "Not an advantage, and not linked to the business." },
          { text: "Linux has no advantages.", correct: false, feedback: "It does: it is free and customisable." },
        ] },
      { situation: "The owner asks for one real disadvantage.", prompt: "Which answer is strongest?",
        choices: [
          { text: "Support is mostly from the community, so there is no guaranteed help when something breaks during the working day.", correct: true, feedback: "A disadvantage that applies to a business needing reliable support." },
          { text: "It costs a lot.", correct: false, feedback: "Linux is generally free, so this is wrong." },
          { text: "It cannot run any software.", correct: false, feedback: "It runs a lot of software, though some business programs are Windows-only." },
        ] },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Purposes", front: "Name two purposes of an OS.", back: "Any two of: manage memory and the CPU, manage files and storage, control peripherals via drivers, provide a user interface, run applications, provide security." },
      { tag: "Careful", front: "Why is 'Windows and Android' a wrong answer to 'purposes of an OS'?", back: "Those are types of OS, not purposes." },
    ] },
  sparky("Sparky's warning", "Do not just say Linux is free and proprietary is not. Free also usually means community-supported, which is an advantage for a hobbyist and a real disadvantage for a business that needs guaranteed support."),
  testTip("Describe two purposes of an operating system. (4 marks)", "\"Windows and Android.\"", "These are types, not purposes.",
    "\"It manages files, so users can save, open and organise them in folders. It controls peripherals through drivers, so a printer works when plugged in.\"", "Two purposes, each with how it helps."),
  scenario("The five-laptop business", "A small business is choosing between Windows laptops and Linux laptops for its five staff."),
  h("Assessment practice"),
  ...extended(L3),
  h("Test-ready recap"),
  recap([
    { icon: "🧩", heading: "Purposes, not types", text: "Describe what an OS does, such as managing files or controlling peripherals through drivers.", tone: "blue" },
    { icon: "⚖️", heading: "Pair the advantage and disadvantage to the client", text: "Free but community-supported is the classic Linux pair.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 6/8 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L3),
];

// =================== LESSON 4: Compatibility and purchase ===================
L4.estimatedMinutes = 45;
L4.blocks = [
  hook(L4),
  criteria(["Describe compatibility issues with older and newer software.", "Compare hardware specifications against minimum requirements.", "Explain purchase considerations for a user."]),
  video("Will it run?", 4, "A short clip checking a game's minimum requirements against a laptop's specifications, then a clinic's old software on a new computer. Suggested source: a teacher-filmed screen recording using a real requirements page and the System Information window.", ["Where to find a computer's specs", "How to read minimum requirements", "What fails first when specs fall short"]),
  h("The big idea"),
  keyTerms(L4),
  { type: "svgFigure", title: "Check both ways", alt: "Old software on new hardware and new software on old hardware both need checking for compatibility.", svg: compatSvg, caption: "Both arrows pulse in turn: old software on new hardware, and the other way round." },
  h("Does it meet the minimum?"),
  { type: "sorter", title: "Game versus laptop", instruction: "The game needs 16 GB RAM, 60 GB free storage, a dedicated graphics card and Windows 10 64-bit or later. Her laptop has 8 GB RAM, 200 GB free, integrated graphics and Windows 11 64-bit. Does each specification meet the requirement?",
    categories: ["Meets it", "Does not meet it"],
    items: [
      { text: "RAM: 8 GB against 16 GB required.", category: 1, why: "8 GB is below the 16 GB minimum." },
      { text: "Storage: 200 GB free against 60 GB required.", category: 0, why: "200 GB is well above 60 GB." },
      { text: "Graphics: integrated against a dedicated card required.", category: 1, why: "Integrated graphics does not meet a dedicated card requirement." },
      { text: "Operating system: Windows 11 64-bit against Windows 10 64-bit or later.", category: 0, why: "Windows 11 is later than Windows 10." },
    ] },
  { type: "sequence", title: "The purchase decision", instruction: "Tap the four steps for choosing new computers in order.",
    items: ["User needs: what will they do, where and how often?", "Software: list it and its minimum requirements.", "Specifications: choose above the minimum, with room to grow.", "Cost: compare options within the budget."],
    explanation: "Needs first, then software, then specs, then cost. Cost alone is never a full answer." },
  { type: "branchingScenario", title: "The dental practice", intro: "A dental practice still uses booking software made for Windows 7. It is buying new Windows 11 computers for $1200 each.",
    steps: [
      { situation: "The practice manager asks what could go wrong.", prompt: "Which compatibility issue is specific to this practice?",
        choices: [
          { text: "The old Windows 7 booking software may not install or may crash on Windows 11, and it no longer receives security updates.", correct: true, feedback: "It names the issue for this setup, in both directions." },
          { text: "Computers are sometimes incompatible.", correct: false, feedback: "A general statement, not specific to the practice." },
          { text: "Nothing. New computers run everything.", correct: false, feedback: "Old software may not run on a new OS." },
        ] },
      { situation: "She asks what to consider before choosing the new computers.", prompt: "Which answer is strongest?",
        choices: [
          { text: "Check the booking software's minimum requirements against the specifications, and match them to what staff do, not just the cost.", correct: true, feedback: "Specifications, user needs and cost all matter." },
          { text: "Buy the cheapest.", correct: false, feedback: "Cost alone is never a full answer." },
          { text: "Buy the newest model.", correct: false, feedback: "Newest does not guarantee it runs the practice's software." },
        ] },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What are minimum requirements?", back: "The lowest specifications (CPU, RAM, storage, OS, graphics) the software needs to run." },
      { tag: "Explain", front: "What goes wrong when new software meets older hardware?", back: "It may not install, or may run slowly, because the hardware is below the minimum requirements." },
      { tag: "Explain", front: "What goes wrong when old software meets a new OS?", back: "It may not install or may crash, and it no longer receives security updates." },
    ] },
  sparky("Sparky's warning", "Everyone checks whether the new software will run on the old machine and forgets the other direction: will the old, specialised software still run on new hardware and a new OS. Always check both ways."),
  testTip("Identify which specifications do not meet the requirements. (2 marks)", "\"It is too slow.\"", "Does not name a specification.",
    "\"RAM (8 GB is below the required 16 GB) and graphics (integrated, but a dedicated card is required).\"", "The specification and the gap."),
  scenario("The dental practice", "A dental practice still uses booking software made for Windows 7. It is buying new Windows 11 computers for $1200 each."),
  h("Assessment practice"),
  ...extended(L4),
  h("Test-ready recap"),
  recap([
    { icon: "↔️", heading: "Both directions", text: "Old software on new hardware, and new software on old hardware.", tone: "blue" },
    { icon: "📋", heading: "Name the specification", text: "Say which spec fails and by how much.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L4),
];

// =================== LESSON 5: Maintenance and troubleshooting ===================
const L5_toggle = pick(L5, (b) => b.type === "interactiveDiagram");
L5.estimatedMinutes = 45;
L5.blocks = [
  hook(L5),
  criteria(["Explain the purpose of a UPS and temperature control.", "Describe steps to solve no sound, frozen devices and projector problems.", "Apply a logical troubleshooting order."]),
  video("Fixing it before the call-out", 4, "A short clip fixing the three common faults (no sound, a frozen screen, a projector with no picture) and showing a UPS in a server cabinet. Suggested source: a teacher-filmed demonstration using a school classroom setup.", ["The order the checks are made in", "What a UPS does in a blackout", "Why the server room needs cooling"]),
  h("The big idea"),
  keyTerms(L5),
  { type: "svgFigure", title: "A blackout with a UPS", alt: "Mains power drops out and the UPS battery takes over, giving time to save and shut down.", svg: upsSvg, caption: "The UPS does not keep the power on forever. It buys time to shut down safely." },
  { type: "infoCards", title: "Why both matter", columns: 2, cards: [
    { icon: "🔋", heading: "UPS", text: "Server stays on during a short blackout. Time to save work and shut down safely. Stops data loss and file damage. Protects against surges.", tone: "blue" },
    { icon: "🌡️", heading: "Temperature control", text: "Servers produce a lot of heat. Overheating slows or shuts down the CPU and shortens component life. Keep vents clear of dust.", tone: "amber" },
  ] },
  h("Fix it in order"),
  { type: "sequence", title: "A logical troubleshooting order", instruction: "Tap the four steps in order.",
    items: ["Describe the problem and when it happens.", "Check the simplest causes first, such as cables, volume and power.", "Try one fix at a time and test after each.", "Restart, then escalate if it is still not fixed."],
    explanation: "Simplest first, one change at a time, and test as you go." },
  { type: "sorter", title: "Which fault does this fix?", instruction: "Tap the problem each step helps solve.",
    categories: ["No sound", "Frozen screen or device", "No display on projector"],
    items: [
      { text: "Click the speaker icon and check the output is the laptop speakers, not a disconnected Bluetooth headset.", category: 0, why: "Checking the output device is a no-sound fix." },
      { text: "Open Task Manager (Ctrl+Shift+Esc) and end the frozen app.", category: 1, why: "Ending the frozen application is a frozen-device fix." },
      { text: "Press Windows+P and choose Duplicate.", category: 2, why: "It sends the laptop's display to the projector." },
      { text: "Check the cable is secure at both ends and the projector's input is selected.", category: 2, why: "Cable and input selection are the first projector checks." },
      { text: "Check wireless mouse batteries, then restart.", category: 1, why: "A dead wireless mouse can look like a frozen device." },
      { text: "Check mute and volume, then restart the app.", category: 0, why: "Mute and volume are the first no-sound checks." },
    ] },
  L5_toggle,
  { type: "branchingScenario", title: "The accounting firm's server", intro: "A small accounting firm keeps its server in a storeroom with no windows. Last summer the server shut down twice on hot days, and a blackout corrupted a file.",
    steps: [
      { situation: "The partner asks how a UPS would have helped in the blackout.", prompt: "Which explanation is strongest?",
        choices: [
          { text: "The UPS battery keeps the server running for a few minutes, giving time to save files and shut down safely, so the file would not have been corrupted.", correct: true, feedback: "It explains the function, not just 'it would have helped'." },
          { text: "A UPS stops the server ever losing power.", correct: false, feedback: "It manages the loss, it does not eliminate it. The battery only lasts minutes." },
          { text: "It would have helped.", correct: false, feedback: "No explanation of what the UPS actually does." },
        ] },
      { situation: "The server keeps shutting down on hot days.", prompt: "Which strategies address the cause?",
        choices: [
          { text: "Add air-conditioning or ventilation to the storeroom, and keep the server's vents clear of dust.", correct: true, feedback: "Both strategies address heat, which is the cause." },
          { text: "Buy a bigger monitor.", correct: false, feedback: "Unrelated to overheating." },
          { text: "Move the server somewhere with no power outlets.", correct: false, feedback: "It would not run, and does not address heat." },
        ] },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What is a UPS?", back: "A battery unit that keeps equipment running during a power failure long enough to save work and shut down safely. It also protects against surges." },
      { tag: "Explain", front: "Why does a server shut down on a hot day?", back: "Heat damages components and causes shutdowns. Cooling and ventilation prevent it." },
    ] },
  sparky("Sparky's warning", "A UPS does not keep the power on forever. It buys you minutes to save your work and shut down safely, or bridges a short outage. If an answer says a UPS 'stops the computer losing power', that is not quite it."),
  testTip("Describe one step to fix a laptop with no sound. (2 marks)", "\"Fix the settings.\"", "Which settings?",
    "\"Click the speaker icon and check the output is set to the laptop speakers, not a disconnected Bluetooth headset.\"", "A specific step."),
  scenario("The accounting firm", "A small accounting firm keeps its server in a storeroom with no windows. Last summer the server shut down twice on hot days, and a blackout corrupted a file."),
  h("Assessment practice"),
  ...extended(L5),
  h("Test-ready recap"),
  recap([
    { icon: "🔋", heading: "Explain the UPS properly", text: "Battery gives time to save and shut down safely. It manages the power loss, it does not remove it.", tone: "blue" },
    { icon: "🌡️", heading: "Mention heat and cooling", text: "Hot-day shutdowns are a temperature problem.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L5),
];

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(topic.lessons.map((l) => `${l.id}: ${l.blocks.length} blocks`).join("\n"));
