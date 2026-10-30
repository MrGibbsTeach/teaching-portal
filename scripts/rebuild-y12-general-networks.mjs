// Rebuilds Year 12 AIT General, Unit 4 "Networks" (6 lessons) as interactive card lessons.
// Keeps syllabus points, key terms, extended questions (same ids), the Packet Journey animation
// and the existing topology match activity. Safe to re-run.
// Run: node scripts/rebuild-y12-general-networks.mjs
import fs from "node:fs";
import { h, mcq, criteria, testTip, scenario, recap, video, reducedMotion, pick, extended, keyTerms, hook, last } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const topic = course.units.find((u) => u.id === "unit4").topics.find((t) => t.id === "networks");
const [L1, L2, L3, L4, L5, L6] = topic.lessons;
const sparky = (heading, text) => ({ type: "callout", variant: "senior-wisdom", heading, text });

// ---------- figures ----------
const sharedSvg = `<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.sh-n{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}.sh-t{font-size:13px;font-weight:700;fill:#0f172a}.sh-s{font-size:11.5px;fill:#475569}
.sh-l{stroke:#93c5fd;stroke-width:3;stroke-dasharray:6 6;animation:sh-d 2s linear infinite}@keyframes sh-d{to{stroke-dashoffset:-24}}
${reducedMotion}
</style>
<line class="sh-l" x1="340" y1="110" x2="110" y2="50"/><line class="sh-l" x1="340" y1="110" x2="110" y2="170"/><line class="sh-l" x1="340" y1="110" x2="570" y2="50"/><line class="sh-l" x1="340" y1="110" x2="570" y2="170"/>
<rect class="sh-n" x="270" y="78" width="140" height="64" rx="14" fill="#dbeafe"/><text x="340" y="106" text-anchor="middle" class="sh-t">Router</text><text x="340" y="124" text-anchor="middle" class="sh-s">one internet connection</text>
<rect class="sh-n" x="10" y="20" width="200" height="60" rx="12"/><text x="24" y="46" class="sh-t">Laptops and phones</text><text x="24" y="64" class="sh-s">share the internet</text>
<rect class="sh-n" x="10" y="140" width="200" height="60" rx="12"/><text x="24" y="166" class="sh-t">Wireless printer</text><text x="24" y="184" class="sh-s">shared hardware</text>
<rect class="sh-n" x="470" y="20" width="200" height="60" rx="12"/><text x="484" y="46" class="sh-t">Shared drive</text><text x="484" y="64" class="sh-s">shared files and backup</text>
<rect class="sh-n" x="470" y="140" width="200" height="60" rx="12"/><text x="484" y="166" class="sh-t">Smart TV and games</text><text x="484" y="184" class="sh-s">communicate and stream</text>
</svg>`;

const mediaSvg = `<svg viewBox="0 0 680 210" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.md-t{font-size:13.5px;font-weight:700;fill:#0f172a}.md-s{font-size:11.5px;fill:#475569}
.md-b{transform-origin:150px 0;animation:md-g 6s ease-out infinite}
.md-f{animation-name:md-g}.md-w{animation-name:md-g}
@keyframes md-g{0%{transform:scaleX(.02)}30%,90%{transform:scaleX(1)}100%{transform:scaleX(.02)}}
.md-bar{transform-origin:150px 0;transform-box:view-box}
${reducedMotion}
</style>
<text x="10" y="26" class="md-t">Optic fibre</text><text x="10" y="42" class="md-s">kilometres, very fast, no interference</text>
<rect x="260" y="14" width="410" height="26" rx="8" fill="#e2e8f0"/><rect class="md-b" style="transform-origin:260px 0;transform-box:view-box" x="260" y="14" width="410" height="26" rx="8" fill="#16a34a"/>
<text x="10" y="106" class="md-t">Wired Ethernet</text><text x="10" y="122" class="md-s">up to about 100 m, fast, low interference</text>
<rect x="260" y="94" width="410" height="26" rx="8" fill="#e2e8f0"/><rect class="md-b" style="transform-origin:260px 0;transform-box:view-box" x="260" y="94" width="130" height="26" rx="8" fill="#2563eb"/>
<text x="10" y="186" class="md-t">Wireless</text><text x="10" y="202" class="md-s">tens of metres, mobile, walls weaken it</text>
<rect x="260" y="174" width="410" height="26" rx="8" fill="#e2e8f0"/><rect class="md-b" style="transform-origin:260px 0;transform-box:view-box" x="260" y="174" width="70" height="26" rx="8" fill="#d97706"/>
</svg>`;

const ratesSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.rt-t{font-size:13.5px;font-weight:700;fill:#0f172a}.rt-s{font-size:12px;fill:#475569}
.rt-d{animation:rt-r 3s linear infinite}.rt-u{animation:rt-r 12s linear infinite}
@keyframes rt-r{0%{transform:translateX(0)}100%{transform:translateX(330px)}}
${reducedMotion}
</style>
<text x="10" y="24" class="rt-t">A 100/20 plan: 100 Mbps down, 20 Mbps up</text>
<rect x="150" y="44" width="400" height="34" rx="17" fill="#dbeafe"/><text x="10" y="66" class="rt-s">Download 100</text>
<g class="rt-d"><circle cx="170" cy="61" r="9" fill="#2563eb"/><circle cx="200" cy="61" r="9" fill="#2563eb"/><circle cx="230" cy="61" r="9" fill="#2563eb"/></g>
<rect x="150" y="108" width="400" height="34" rx="17" fill="#fee2e2"/><text x="10" y="130" class="rt-s">Upload 20</text>
<g class="rt-u"><circle cx="170" cy="125" r="9" fill="#dc2626"/></g>
<text x="150" y="172" class="rt-s">Same pipe length, five times fewer packets per second going up.</text>
</svg>`;

const routeSvg = `<svg viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.rc-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;animation:rc-g 10s infinite}.rc-2{animation-delay:2s}.rc-3{animation-delay:4s}.rc-4{animation-delay:6s}.rc-5{animation-delay:8s}
@keyframes rc-g{0%,18%{fill:#bbf7d0}22%,100%{fill:#f1f5f9}}
.rc-t{font-size:13px;font-weight:700;fill:#0f172a}.rc-s{font-size:11px;fill:#475569}.rc-a{stroke:#94a3b8;stroke-width:3}
${reducedMotion}
</style>
<rect class="rc-b" x="6" y="30" width="118" height="90" rx="14"/><text x="18" y="62" class="rc-t">Laptop</text><text x="18" y="80" class="rc-s">NIC sends</text><text x="18" y="94" class="rc-s">the photo</text>
<rect class="rc-b rc-2" x="142" y="30" width="118" height="90" rx="14"/><text x="154" y="62" class="rc-t">Switch</text><text x="154" y="80" class="rc-s">links wired</text><text x="154" y="94" class="rc-s">devices</text>
<rect class="rc-b rc-3" x="278" y="30" width="118" height="90" rx="14"/><text x="290" y="62" class="rc-t">Router</text><text x="290" y="80" class="rc-s">directs data</text><text x="290" y="94" class="rc-s">in and out</text>
<rect class="rc-b rc-4" x="414" y="30" width="118" height="90" rx="14"/><text x="426" y="62" class="rc-t">Modem</text><text x="426" y="80" class="rc-s">connects to</text><text x="426" y="94" class="rc-s">the provider</text>
<rect class="rc-b rc-5" x="550" y="30" width="124" height="90" rx="14"/><text x="562" y="62" class="rc-t">Internet</text><text x="562" y="80" class="rc-s">social media</text><text x="562" y="94" class="rc-s">servers</text>
<path class="rc-a" d="M124 75h18M260 75h18M396 75h18M532 75h18"/>
</svg>`;

const starSvg = `<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.st-l{stroke:#94a3b8;stroke-width:3}.st-p{fill:#2563eb;animation:st-b 6s infinite}.st-p2{animation-delay:1.5s}.st-p3{animation-delay:3s}.st-p4{animation-delay:4.5s}
@keyframes st-b{0%,10%{opacity:0}15%,30%{opacity:1}40%,100%{opacity:0}}
.st-t{font-size:12.5px;font-weight:700;fill:#0f172a}.st-s{font-size:11.5px;fill:#475569}.st-n{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}
.st-x{stroke:#dc2626;stroke-width:4}
${reducedMotion}
</style>
<line class="st-l" x1="340" y1="115" x2="140" y2="45"/><line class="st-l" x1="340" y1="115" x2="140" y2="185"/><line class="st-l" x1="340" y1="115" x2="540" y2="45"/>
<line class="st-l" x1="340" y1="115" x2="540" y2="185" stroke="#fca5a5" stroke-dasharray="6 6"/><path class="st-x" d="M430 128l22 22M452 128l-22 22"/>
<rect class="st-n" x="280" y="85" width="120" height="60" rx="14" fill="#dbeafe"/><text x="340" y="112" text-anchor="middle" class="st-t">Switch</text><text x="340" y="129" text-anchor="middle" class="st-s">the centre</text>
<rect class="st-n" x="60" y="20" width="160" height="50" rx="12"/><text x="76" y="50" class="st-t">Desktop 1</text>
<rect class="st-n" x="60" y="160" width="160" height="50" rx="12"/><text x="76" y="190" class="st-t">Desktop 2</text>
<rect class="st-n" x="460" y="20" width="160" height="50" rx="12"/><text x="476" y="50" class="st-t">Server</text>
<rect class="st-n" x="460" y="160" width="160" height="50" rx="12" fill="#fee2e2"/><text x="476" y="190" class="st-t">Desktop 3 (cable cut)</text>
<circle class="st-p" cx="240" cy="80" r="7"/><circle class="st-p st-p2" cx="240" cy="150" r="7"/><circle class="st-p st-p3" cx="440" cy="80" r="7"/>
<text x="340" y="222" text-anchor="middle" class="st-s">One cable fails: only that computer is offline. If the switch fails, everyone is.</text>
</svg>`;

const planSvg = `<svg viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>.fp-r{fill:#f8fafc;stroke:#94a3b8;stroke-width:2.5}.fp-l{font-size:12px;font-weight:700;fill:#475569}.fp-k{font-size:13px;font-weight:800;fill:#fff}.fp-c{fill:#2563eb}.fp-h{font-size:13px;font-weight:700;fill:#0f172a}</style>
<text x="10" y="20" class="fp-h">Downstairs</text><text x="400" y="20" class="fp-h">Upstairs</text>
<rect class="fp-r" x="10" y="30" width="170" height="220"/><text x="22" y="52" class="fp-l">Garage (NBN point)</text>
<rect class="fp-r" x="180" y="30" width="190" height="220"/><text x="192" y="52" class="fp-l">Lounge (smart TV)</text>
<rect class="fp-r" x="400" y="30" width="130" height="220"/><text x="412" y="52" class="fp-l">Home office</text>
<rect class="fp-r" x="530" y="30" width="40" height="220"/><text x="534" y="52" class="fp-l" transform="rotate(90 534 52)">Hallway</text>
<rect class="fp-r" x="570" y="30" width="100" height="220"/><text x="582" y="52" class="fp-l">Bedrooms</text>
<circle class="fp-c" cx="60" cy="170" r="14"/><text x="60" y="175" text-anchor="middle" class="fp-k">A</text>
<circle class="fp-c" cx="275" cy="170" r="14"/><text x="275" y="175" text-anchor="middle" class="fp-k">B</text>
<circle class="fp-c" cx="550" cy="170" r="14"/><text x="550" y="175" text-anchor="middle" class="fp-k">C</text>
<circle class="fp-c" cx="465" cy="170" r="14"/><text x="465" y="175" text-anchor="middle" class="fp-k">D</text>
<circle class="fp-c" cx="635" cy="215" r="14"/><text x="635" y="220" text-anchor="middle" class="fp-k">E</text>
</svg>`;

// =================== LESSON 1 ===================
L1.estimatedMinutes = 45;
const L1_anim = pick(L1, (b) => b.type === "animation3d");
L1.blocks = [
  hook(L1),
  criteria(["Explain the concept and purpose of a computer network.", "Describe advantages of networking.", "Describe disadvantages of networking."]),
  video("Why network computers?", 3, "A short clip showing a small office before and after networking: one shared printer, shared files, one internet connection. Suggested source: a teacher-filmed office walk-through or a short IT-basics explainer.", ["What each person shared before and after", "Where data moves between devices", "What can go wrong"]),
  h("The big idea"),
  keyTerms(L1),
  { type: "svgFigure", title: "What a home network shares", alt: "A router in the middle connected to laptops, a printer, a shared drive and a TV.", svg: sharedSvg, caption: "One router, one internet connection, many shared resources." },
  L1_anim,
  h("Advantage or disadvantage?"),
  { type: "sorter", title: "Sort the effects of networking", instruction: "Is each effect an advantage or a disadvantage of networking an office?",
    categories: ["Advantage", "Disadvantage"],
    items: [
      { text: "All staff print to one network printer instead of buying five.", category: 0, why: "Sharing hardware saves money." },
      { text: "Malware on one computer can spread to every device.", category: 1, why: "Connected devices can pass malware between them." },
      { text: "Files move between computers without USB drives.", category: 0, why: "Sharing files over the network saves time." },
      { text: "If the router fails, nobody has internet.", category: 1, why: "One shared connection is a single point of failure." },
      { text: "Everyone shares one internet connection.", category: 0, why: "One connection and bill instead of four." },
      { text: "Setting up and maintaining it costs money and skill.", category: 1, why: "A network needs set-up and ongoing maintenance." },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What is a computer network?", back: "Two or more devices connected so they can share data and resources." },
      { tag: "Compare", front: "LAN or WAN: which is the internet?", back: "WAN. A LAN covers one building or site, while the internet is the largest WAN." },
      { tag: "Explain", front: "Why is 'you can share stuff' a weak answer?", back: "It is too vague. Name what is shared, such as one network printer for all staff." },
    ] },
  { type: "branchingScenario", title: "The real estate office", intro: "A real estate office has four computers, each with its own printer and internet connection. Staff move files between computers on USB drives.",
    steps: [
      { situation: "The owner asks why they should network the computers.", prompt: "Which answer states the purpose best?",
        choices: [
          { text: "A network connects the computers so they can share files, printers and one internet connection.", correct: true, feedback: "It names what is shared, which is the purpose of the network." },
          { text: "Networks are faster.", correct: false, feedback: "Speed is not the purpose, and the answer names nothing shared." },
          { text: "Everyone does it.", correct: false, feedback: "Not a reason, and not linked to the office." },
        ] },
      { situation: "The owner asks about a downside.", prompt: "Which disadvantage is specific to this office?",
        choices: [
          { text: "Security risk: any staff computer with malware could spread it to client files on the others.", correct: true, feedback: "It names a real disadvantage and links it to the office's data." },
          { text: "It costs money.", correct: false, feedback: "A throwaway line. Say what it costs and why it matters here." },
          { text: "There are no disadvantages.", correct: false, feedback: "Every network has risks, such as malware spreading and a failed router." },
        ] },
    ] },
  sparky("Sparky's point", "When a client asks 'why network it', the honest answer is almost always sharing a printer, sharing files or sharing an internet connection. If your explanation does not land on one of those practical benefits, it is too abstract to convince anyone to pay for the job."),
  testTip("Describe one advantage of networking for a small office. (2 marks)", "\"You can share stuff.\"", "Too vague.",
    "\"All staff can print to one network printer, so the office buys one printer instead of five.\"", "A named resource and the effect."),
  scenario("The real estate office", "A real estate office has four computers, each with its own printer and internet connection. Staff move files between computers on USB drives."),
  h("Assessment practice"),
  ...extended(L1),
  h("Test-ready recap"),
  recap([
    { icon: "🔗", heading: "Name what is shared", text: "Files, printers and an internet connection, tied to the office in the question.", tone: "blue" },
    { icon: "⚖️", heading: "Be specific on the downside", text: "Malware spreading or a single router failure, not just 'it costs money'.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L1),
];

// =================== LESSON 2 ===================
const L2_table = pick(L2, (b) => b.type === "table");
L2.estimatedMinutes = 45;
L2.blocks = [
  hook(L2),
  criteria(["Describe optic fibre, wired and wireless media.", "Compare transmission media on speed, distance, interference and mobility.", "Select media for a location in a network."]),
  video("Fibre, Ethernet and Wi-Fi", 4, "A short clip showing each medium in the real world: a fibre run between buildings, an Ethernet patch panel and a wireless access point, with a note on where each fits. Suggested source: a teacher-filmed tour of the school's network room or a short cabling explainer.", ["How each medium carries data", "How far each can reach", "What interferes with wireless"]),
  h("The big idea"),
  keyTerms(L2),
  { type: "svgFigure", title: "How far each medium reaches", alt: "Three bars: optic fibre reaches kilometres, wired Ethernet about 100 metres, wireless tens of metres.", svg: mediaSvg, caption: "Bar length shows typical reach. The bars grow and reset." },
  h("Which medium fits?"),
  { type: "sorter", title: "Match the medium to the place", instruction: "A school uses each medium where it fits best. Tap the best medium.",
    categories: ["Optic fibre", "Wired Ethernet", "Wireless"],
    items: [
      { text: "From the street to the school and between buildings.", category: 0, why: "Long distance and very high speed." },
      { text: "Desktop computers in the library and the servers.", category: 1, why: "Fast, reliable and the devices do not move." },
      { text: "Student laptops moving between classrooms.", category: 2, why: "Students move around, so mobility matters most." },
      { text: "A building 800 m from the main school.", category: 0, why: "800 m is far beyond Ethernet's 100 m limit." },
      { text: "A teacher's tablet in the staff room.", category: 2, why: "A mobile device with no need for a cable." },
    ] },
  L2_table,
  { type: "branchingScenario", title: "The farm shed", intro: "A farm has a house and a machinery shed 400 m apart. The owner wants internet in the shed and on her phone around the house.",
    steps: [
      { situation: "The shed is 400 m from the house.", prompt: "Which medium should connect the shed to the house?",
        choices: [
          { text: "Optic fibre, because 400 m is beyond Ethernet's 100 m limit and fibre is very fast with no interference.", correct: true, feedback: "It picks a medium and justifies it with distance and speed." },
          { text: "Wired Ethernet, because it is cheap.", correct: false, feedback: "Ethernet only reaches about 100 m, so it will not work at 400 m." },
          { text: "Wi-Fi from the house, because it needs no cable.", correct: false, feedback: "Wireless reaches tens of metres, and walls and distance weaken it." },
        ] },
      { situation: "She wants to use her phone around the house.", prompt: "Which medium suits her phone inside the house?",
        choices: [
          { text: "Wireless, because the phone moves around and needs no cable.", correct: true, feedback: "Mobility is wireless's main strength." },
          { text: "Optic fibre to the phone.", correct: false, feedback: "A phone cannot plug into fibre as it moves around." },
          { text: "Wired Ethernet to the phone.", correct: false, feedback: "A cable would stop the phone being mobile." },
        ] },
    ] },
  sparky("Sparky's rule", "Distance and obstacles are the two things that kill wireless every time, and clients never think about either until it has already failed. For anything outdoors or through brick, I default to recommending a wired run, even when it is a harder sell."),
  testTip("Compare wired and wireless media for a home office. (4 marks)", "\"Wireless is easier.\"", "One side, no feature.",
    "\"Wired Ethernet is faster and more reliable for the desktop because walls do not affect it, but wireless lets the laptop move around the house without cables.\"", "Both sides, on named features."),
  scenario("The farm", "A farm has a house and a machinery shed 400 m apart. The owner wants internet in the shed and on her phone around the house."),
  h("Assessment practice"),
  ...extended(L2),
  h("Test-ready recap"),
  recap([
    { icon: "📏", heading: "Justify with distance", text: "Tie the medium to the distance in the scenario: fibre for kilometres, Ethernet to about 100 m.", tone: "blue" },
    { icon: "🔁", heading: "Compare both sides", text: "Two features, both media, each linked to the setting.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/7 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L2),
];

// =================== LESSON 3 ===================
L3.estimatedMinutes = 45;
L3.blocks = [
  hook(L3),
  criteria(["Explain the concept of transmission rate.", "Convert between units: bps, Mbps, Gbps.", "Explain how upload and download rates affect a task."]),
  video("Download vs upload speed", 4, "A short clip running a speed test and then sending a large file to show why upload is usually the slower number. Suggested source: a teacher-filmed screen recording of a speed test, or a short NBN plans explainer.", ["What 100/20 means", "Why upload matters for live streams", "How shared bandwidth slows each device"]),
  h("The big idea"),
  keyTerms(L3),
  { type: "svgFigure", title: "A 100/20 plan", alt: "Two pipes of equal length: download carries many data dots per second, upload carries few.", svg: ratesSvg, caption: "Download moves five times more data per second than upload on this plan." },
  h("Work out a transfer time"),
  { type: "sequence", title: "Put the calculation in order", instruction: "Tap the four steps for working out how long a transfer takes.",
    items: ["Find the size in bytes, e.g. 2 GB = 2000 MB.", "Convert to bits by multiplying by 8: 2000 MB x 8 = 16 000 megabits.", "Divide by the rate: 16 000 / 20 Mbps = 800 s.", "Convert to a sensible unit: 800 s is about 13 minutes."],
    explanation: "Bytes to bits, then divide by the rate. Bits are not bytes, so skipping the x 8 gives an answer eight times too small." },
  mcq("networks-3-transmission-rates-mcq1", "How long does a 500 MB file take to upload at 40 Mbps?",
    ["100 seconds", "12.5 seconds", "20 seconds", "400 seconds"], 0, "500 MB x 8 = 4000 megabits. 4000 / 40 Mbps = 100 seconds."),
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Units", front: "How many Mbps in 1 Gbps? How many bits in a byte?", back: "1 Gbps = 1000 Mbps. 8 bits = 1 byte." },
      { tag: "Explain", front: "What does a 100/20 plan mean?", back: "100 Mbps download and 20 Mbps upload. Upload is usually much slower." },
      { tag: "Explain", front: "Why does the evening stream freeze when the family is online too?", back: "Bandwidth is shared by every device, so less is left for the stream, and upload is already the lower number." },
      { tag: "Apply", front: "Which number limits a live video stream?", back: "The upload rate, because the stream is data leaving your device." },
    ] },
  { type: "branchingScenario", title: "The freezing live stream", intro: "A gamer in Bunbury has a 50/20 Mbps plan. He live-streams every evening while his family streams TV and videos.",
    steps: [
      { situation: "His speed test says 50 Mbps but the stream freezes.", prompt: "Which explanation is strongest?",
        choices: [
          { text: "The connection's bandwidth is shared with the family's streaming, and his stream depends on the 20 Mbps upload rate, which is much lower than the download.", correct: true, feedback: "It names shared bandwidth and the upload ceiling." },
          { text: "The internet is slow.", correct: false, feedback: "Too vague. It does not name a cause." },
          { text: "He needs a faster download plan.", correct: false, feedback: "A live stream depends on upload, so faster download alone would not help." },
        ] },
      { situation: "He wants a solution.", prompt: "Which is the best suggestion?",
        choices: [
          { text: "Move to a plan with a higher upload rate, or stream when the family is not using the connection.", correct: true, feedback: "It targets upload or the shared bandwidth." },
          { text: "Buy a bigger TV.", correct: false, feedback: "Unrelated to the transmission rate." },
          { text: "Restart the game.", correct: false, feedback: "The problem is the connection's capacity, not the game." },
        ] },
    ] },
  sparky("Sparky's warning", "Download and upload rates are almost never the same number, and a live stream depends on upload, the number everyone forgets to check. If you are uploading video, the 20 is your real ceiling, not the headline 100."),
  testTip("Explain how the upload rate affects sending a large video. (2 marks)", "\"It will be slow.\"", "No link to the rate or the task.",
    "\"The upload rate is only 20 Mbps, so a 2 GB video takes about 13 minutes to send; a faster upload rate would reduce this time.\"", "The rate, the task and the effect."),
  scenario("The evening streamer", "A gamer in Bunbury has a 50/20 Mbps plan. He live-streams his games every evening while his family streams TV and videos."),
  h("Assessment practice"),
  ...extended(L3),
  h("Test-ready recap"),
  recap([
    { icon: "🔢", heading: "Bits are not bytes", text: "Multiply bytes by 8, then divide by the rate in Mbps.", tone: "blue" },
    { icon: "⬆️", heading: "Name upload and shared bandwidth", text: "Do not just say 'slow internet'.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L3),
];

// =================== LESSON 4 ===================
L4.estimatedMinutes = 45;
L4.blocks = [
  hook(L4),
  criteria(["Describe the purpose of a modem, router, switch, NIC and server.", "Explain how data moves between the components.", "Identify the components needed for a network."]),
  video("Inside a home network", 4, "A short clip tracing a photo from a laptop to the internet, naming each device it passes through. Suggested source: a teacher-filmed walk-through of the school's network cabinet, or a home-networking explainer.", ["What each box does", "Why a modem and router are different devices", "What a NIC is"]),
  h("The big idea"),
  keyTerms(L4),
  { type: "svgFigure", title: "A photo's journey", alt: "A photo moves from the laptop's NIC through a switch, router and modem to the internet.", svg: routeSvg, caption: "Each device lights up as the photo reaches it." },
  { type: "sequence", title: "Put the route in order", instruction: "Tap the devices in the order the photo passes through them.",
    items: ["Laptop NIC sends the photo.", "Switch links the wired devices in the LAN.", "Router directs the data towards the internet.", "Modem converts it for the provider's line.", "The social media company's servers receive it."],
    explanation: "NIC, switch, router, modem, internet. A small home router often includes the switch and wireless access." },
  h("Which device?"),
  { type: "sorter", title: "Name the device from its job", instruction: "Tap the device that does each job.",
    categories: ["Modem", "Router", "Switch", "NIC", "Server"],
    items: [
      { text: "Converts the provider's signal so the network can reach the internet.", category: 0, why: "That is the modem's job." },
      { text: "Directs data between the LAN and the internet and gives devices addresses.", category: 1, why: "That is the router's job." },
      { text: "Connects wired devices in a LAN and sends data only to the device it is for.", category: 2, why: "That is the switch's job." },
      { text: "Hardware inside a computer that connects it to the network.", category: 3, why: "That is the network interface card." },
      { text: "Stores shared files or runs email for other devices.", category: 4, why: "A server provides services to other devices." },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Compare", front: "What is the difference between a modem and a router?", back: "The modem connects you to your service provider. The router connects your devices to each other and shares that one connection." },
      { tag: "Explain", front: "Why does every computer need a NIC?", back: "It is the hardware that physically connects the computer to the network, wired or wireless. Without it the computer cannot send or receive network data." },
      { tag: "Compare", front: "What is a switch NOT for?", back: "Connecting to the internet. That is the router and modem." },
    ] },
  sparky("Sparky's tip", "Modem connects you to your ISP. Router connects your devices to each other and shares that one internet connection. Mix those up and the marker reads it as not understanding either device, even if the rest of your answer is fine."),
  testTip("Describe the purpose of a switch. (2 marks)", "\"It connects to the internet.\"", "That is the router and modem.",
    "\"A switch connects the wired devices within the LAN and sends data only to the device it is addressed to.\"", "The right job and how it works."),
  scenario("The design studio", "A small design studio has three wired desktop computers, a network printer, a file server and staff laptops that use Wi-Fi."),
  h("Assessment practice"),
  ...extended(L4),
  h("Test-ready recap"),
  recap([
    { icon: "🔌", heading: "Separate router and modem", text: "Never blend their roles into one description.", tone: "blue" },
    { icon: "🧩", heading: "Explain the NIC", text: "It is the hardware that connects a device to the network.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L4),
];

// =================== LESSON 5 ===================
const L5_match = pick(L5, (b) => b.type === "interactiveDiagram");
const L5_table = pick(L5, (b) => b.type === "table");
L5.estimatedMinutes = 45;
L5.blocks = [
  hook(L5),
  criteria(["Describe wired star and wireless topologies.", "Compare client-server and peer-to-peer networks.", "Select a topology for a given situation."]),
  video("Network layouts compared", 4, "A short clip comparing a small peer-to-peer home network with a client-server office, and a wired star with a wireless setup. Suggested source: a teacher-filmed comparison or a networking basics explainer.", ["How devices are connected in a star", "Where files are stored in each model", "Which model suits which business"]),
  h("The big idea"),
  keyTerms(L5),
  { type: "svgFigure", title: "A wired star", alt: "Four computers each connected to a central switch by their own cable, with one cable cut.", svg: starSvg, caption: "Every device has its own cable to the switch. A faulty cable only takes one computer offline." },
  L5_match,
  L5_table,
  h("Which model is it?"),
  { type: "sorter", title: "Client-server or peer-to-peer?", instruction: "Which model does each statement describe?",
    categories: ["Client-server", "Peer-to-peer"],
    items: [
      { text: "A central server stores records and controls who can see what.", category: 0, why: "Central control is a client-server feature." },
      { text: "Devices share files and printers directly with each other.", category: 1, why: "There is no central server in peer-to-peer." },
      { text: "Backed up centrally every night.", category: 0, why: "Central backup is a client-server advantage." },
      { text: "Cheap and simple to set up for a four-person household.", category: 1, why: "Low cost and simple suits homes and very small offices." },
      { text: "Needs more expertise and costs more upfront.", category: 0, why: "A server and an administrator add cost and skill." },
      { text: "Security is set on each device separately.", category: 1, why: "There is no central access control." },
    ] },
  { type: "branchingScenario", title: "The physiotherapy clinic", intro: "A physiotherapy clinic with eight staff stores patient records that must be secure and backed up daily.",
    steps: [
      { situation: "The clinic must choose a network model.", prompt: "Which recommendation is best justified?",
        choices: [
          { text: "Client-server: central security, daily central backup and controlled access to records.", correct: true, feedback: "It picks a side and justifies it with the clinic's needs." },
          { text: "Peer-to-peer, because it is cheaper.", correct: false, feedback: "Cost alone ignores the clinic's security and backup needs." },
          { text: "Either, they are both fine.", correct: false, feedback: "'Justify' means pick a side and defend it." },
        ] },
    ] },
  sparky("Sparky's rule", "Client-server costs more upfront but centralises control and backups, so it is worth it the moment multiple people need shared, managed access to the same data. Peer-to-peer is cheap and simple but falls apart past a handful of devices. Match the answer to the scale of the business."),
  testTip("Justify a peer-to-peer network for the household. (3 marks)", "\"It is good for homes.\"", "No link to this household.",
    "\"With only four people and a few devices, they can share the printer and photos directly without buying a server or needing an administrator, keeping costs low.\"", "Reasons tied to the household."),
  scenario("The physiotherapy clinic", "A physiotherapy clinic with eight staff stores patient records that must be secure and backed up daily."),
  h("Assessment practice"),
  ...extended(L5),
  h("Test-ready recap"),
  recap([
    { icon: "⭐", heading: "Describe the star", text: "Every device has its own cable to a central switch.", tone: "blue" },
    { icon: "✔️", heading: "Justify, do not just describe", text: "Pick a side and defend it with the scenario's needs.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L5),
];

// =================== LESSON 6 ===================
L6.estimatedMinutes = 50;
L6.blocks = [
  hook(L6),
  criteria(["Place network components in suitable locations on a floor plan.", "Label each connection as wired or wireless and name the transmission media.", "Justify design choices using the scenario."]),
  video("Designing a home network", 5, "A short clip walking through a home floor plan: placing the router, deciding what to cable and what to leave wireless, and annotating the plan. Suggested source: a teacher-filmed whiteboard walk-through using the Nguyen floor plan.", ["Where the connection enters the house", "Which devices get a cable", "How coverage is checked room by room"]),
  h("The big idea"),
  keyTerms(L6),
  { type: "sequence", title: "The design checklist", instruction: "Tap the four design steps in order.",
    items: ["Entry point: start at the NBN point and place the modem and router.", "Wired devices: cable fixed, high-use devices, adding a switch if needed.", "Wireless: check every room is covered, adding an access point or mesh unit.", "Annotate: label every device, connection (wired or wireless) and medium."],
    explanation: "Entry point, wired, wireless, annotate. Every placement needs a reason, not just a dot." },
  h("Your turn: plan the house"),
  { type: "placer", title: "Place the devices on the floor plan",
    instruction: "A two-storey home: NBN point in the downstairs garage, home office upstairs with a desktop and printer, bedrooms upstairs with laptops, smart TV in the lounge. Choose the best spot for each device.",
    alt: "Floor plan of a two-storey home. Downstairs: garage with the NBN point (A) and lounge (B). Upstairs: hallway (C), home office (D) and bedrooms (E).",
    planSvg,
    spots: [
      { id: "A", label: "Garage, at the NBN point" },
      { id: "B", label: "Lounge" },
      { id: "C", label: "Upstairs hallway, central to the bedrooms and office" },
      { id: "D", label: "Home office" },
      { id: "E", label: "Far corner bedroom" },
    ],
    devices: [
      { name: "Modem and router", correctSpot: "A", why: "Place them at the NBN point in the garage, where the optic fibre from the street enters the house." },
      { name: "Extra wireless access point (to cover upstairs)", correctSpot: "C", why: "The upstairs hallway is central, so the signal reaches the office and bedrooms through fewer walls and the floor." },
      { name: "Ethernet connection for the home office desktop", correctSpot: "D", why: "A wired run to the desk gives a reliable, fast connection for video calls and large uploads that does not drop upstairs." },
      { name: "Shared network printer", correctSpot: "D", why: "It sits where it is used in the home office, and joins the network wirelessly so every device can print." },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Label", front: "What must every connection on the plan show?", back: "Whether it is wired or wireless, and the medium, such as 'wired (Ethernet)' or 'optic fibre'." },
      { tag: "Justify", front: "Why give the home office desktop a wired connection?", back: "Wired is faster and more reliable, so video calls and uploads do not drop, and signal is not lost through the floor." },
      { tag: "Explain", front: "Why add a wireless access point or mesh unit upstairs?", back: "Walls and distance weaken the signal, so a second unit extends coverage to the far rooms." },
    ] },
  sparky("Sparky's rule", "I put the router as close to the centre of the house as the internet entry point allows, not wherever is convenient to hide the box. Coverage dies in corners. And anything that needs a rock-solid connection, like a home office desktop on video calls, gets a wired run even in an otherwise wireless house."),
  testTip("Complete the home network design on the floor plan. (8 marks)", "Lines drawn with no labels.", "The marker cannot tell wired from wireless, or which box is the router.",
    "Every device named, every connection labelled wired (Ethernet) or wireless, optic fibre shown from the street, and a short reason next to the router and access point.", ""),
  scenario("The two-storey home", "A two-storey home: NBN point in the downstairs garage; home office upstairs with a desktop and printer; teenagers' bedrooms upstairs with laptops; lounge downstairs with a smart TV."),
  h("Assessment practice"),
  ...extended(L6),
  h("Test-ready recap"),
  recap([
    { icon: "📍", heading: "Justify placement", text: "Each device needs a reason tied to coverage or the entry point.", tone: "blue" },
    { icon: "🏷️", heading: "Annotate everything", text: "Label every device, wired or wireless, and the medium.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/7 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  last(L6),
];

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(topic.lessons.map((l) => `${l.id}: ${l.blocks.length} blocks`).join("\n"));
