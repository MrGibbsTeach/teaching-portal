// Rebuilds Year 12 AIT General, Unit 4 "Impacts of Technology" (5 lessons) as interactive card lessons.
// Keeps syllabus points, key terms, extended questions (same ids), and the existing match activity.
// Run: node scripts/rebuild-y12-general-impacts-u4.mjs
import fs from "node:fs";
import { h, criteria, testTip, scenario, recap, video, reducedMotion, pick, extended, keyTerms, hook, last } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const topic = course.units.find((u) => u.id === "unit4").topics.find((t) => t.id === "impacts-of-technology-u4");
const [L1, L2, L3, L4, L5] = topic.lessons;
const nextCallout = (l) => last(l); // keeps each lesson's existing "Up next" / task callout

// ---------- figures ----------
const lifecycleSvg = `<svg viewBox="0 0 680 170" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.lc-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;animation:lc-g 10s infinite}.lc-2{animation-delay:2s}.lc-3{animation-delay:4s}.lc-4{animation-delay:6s}.lc-5{animation-delay:8s}
@keyframes lc-g{0%,18%{fill:#bfdbfe}22%,100%{fill:#f1f5f9}}
.lc-n{font-size:20px;font-weight:800;fill:#1d4ed8}.lc-t{font-size:14px;font-weight:700;fill:#0f172a}.lc-s{font-size:11.5px;fill:#475569}.lc-a{stroke:#94a3b8;stroke-width:3;fill:none}
${reducedMotion}
</style>
<rect class="lc-b" x="6" y="25" width="124" height="120" rx="14"/><text x="20" y="55" class="lc-n">1</text><text x="20" y="78" class="lc-t">Collect</text><text x="20" y="98" class="lc-s">Only what is needed.</text><text x="20" y="113" class="lc-s">Say why.</text>
<rect class="lc-b lc-2" x="142" y="25" width="124" height="120" rx="14"/><text x="156" y="55" class="lc-n">2</text><text x="156" y="78" class="lc-t">Use</text><text x="156" y="98" class="lc-s">For the stated</text><text x="156" y="113" class="lc-s">purpose.</text>
<rect class="lc-b lc-3" x="278" y="25" width="124" height="120" rx="14"/><text x="292" y="55" class="lc-n">3</text><text x="292" y="78" class="lc-t">Store</text><text x="292" y="98" class="lc-s">Keep it secure.</text>
<rect class="lc-b lc-4" x="414" y="25" width="124" height="120" rx="14"/><text x="428" y="55" class="lc-n">4</text><text x="428" y="78" class="lc-t">Access</text><text x="428" y="98" class="lc-s">Let people see</text><text x="428" y="113" class="lc-s">and correct it.</text>
<rect class="lc-b lc-5" x="550" y="25" width="124" height="120" rx="14"/><text x="564" y="55" class="lc-n">5</text><text x="564" y="78" class="lc-t">Dispose</text><text x="564" y="98" class="lc-s">Destroy it when</text><text x="564" y="113" class="lc-s">no longer needed.</text>
<path class="lc-a" d="M130 85h12M266 85h12M402 85h12M538 85h12"/>
</svg>`;

const theftSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.it-b{fill:#f8fafc;stroke:#cbd5e1;stroke-width:2}.it-t{font-size:14px;font-weight:700;fill:#0f172a}.it-s{font-size:12px;fill:#475569}
.it-d{fill:#dc2626;animation:it-run 6s linear infinite}
@keyframes it-run{0%{transform:translateX(0);opacity:0}8%{opacity:1}92%{opacity:1}100%{transform:translateX(470px);opacity:0}}
.it-l{stroke:#fca5a5;stroke-width:4;stroke-dasharray:8 6}
${reducedMotion}
</style>
<line class="it-l" x1="160" y1="95" x2="265" y2="95"/><line class="it-l" x1="415" y1="95" x2="520" y2="95"/>
<circle class="it-d" cx="165" cy="95" r="8"/>
<rect class="it-b" x="10" y="40" width="150" height="110" rx="14"/><text x="24" y="70" class="it-t">Company</text><text x="24" y="90" class="it-s">holds names, dates of</text><text x="24" y="106" class="it-s">birth, addresses and</text><text x="24" y="122" class="it-s">licence numbers</text>
<rect class="it-b" x="265" y="40" width="150" height="110" rx="14"/><text x="279" y="70" class="it-t">Data breach</text><text x="279" y="90" class="it-s">Hackers copy the</text><text x="279" y="106" class="it-s">database or a stolen</text><text x="279" y="122" class="it-s">old drive is recovered</text>
<rect class="it-b" x="520" y="40" width="150" height="110" rx="14"/><text x="534" y="70" class="it-t">Identity theft</text><text x="534" y="90" class="it-s">Fake accounts, loans</text><text x="534" y="106" class="it-s">and purchases in the</text><text x="534" y="122" class="it-s">victim's name</text>
</svg>`;

const divideSvg = `<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.dd-t{font-size:14px;font-weight:700;fill:#0f172a}.dd-s{font-size:12px;fill:#475569}
.dd-w{stroke:#2563eb;stroke-width:3;stroke-dasharray:6 6;fill:none;animation:dd-dash 2s linear infinite}
@keyframes dd-dash{to{stroke-dashoffset:-24}}
.dd-x{animation:dd-blink 3s infinite}
@keyframes dd-blink{0%,45%{opacity:1}55%,100%{opacity:.2}}
${reducedMotion}
</style>
<rect x="10" y="20" width="270" height="180" rx="16" fill="#dcfce7"/><text x="26" y="48" class="dd-t">Connected and confident</text>
<text x="26" y="76" class="dd-s">Reliable, affordable internet</text><text x="26" y="96" class="dd-s">A suitable device</text><text x="26" y="116" class="dd-s">The skills to use services</text><text x="26" y="136" class="dd-s">Services that work for them</text>
<rect x="400" y="20" width="270" height="180" rx="16" fill="#fee2e2"/><text x="416" y="48" class="dd-t">Left behind</text>
<text x="416" y="76" class="dd-s">Slow or no connection</text><text x="416" y="96" class="dd-s">A shared phone, little data</text><text x="416" y="116" class="dd-s">Not confident with apps</text><text x="416" y="136" class="dd-s">Services online only</text>
<path class="dd-w" d="M285 110 Q 340 40 395 110"/>
<g class="dd-x"><text x="340" y="180" text-anchor="middle" class="dd-t" fill="#b91c1c">The gap</text></g>
</svg>`;

const clockSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.ec-t{font-size:13px;font-weight:700;fill:#0f172a}.ec-s{font-size:11.5px;fill:#475569}
.ec-o{animation:ec-pop 8s infinite;opacity:0}.ec-o2{animation-delay:1.6s}.ec-o3{animation-delay:3.2s}.ec-o4{animation-delay:4.8s}.ec-o5{animation-delay:6.4s}
@keyframes ec-pop{0%{opacity:0;transform:translateY(8px)}6%,30%{opacity:1;transform:translateY(0)}38%,100%{opacity:0}}
${reducedMotion}
</style>
<text x="10" y="22" class="ec-t">One day at the Bunbury surf shop</text>
<rect x="10" y="60" width="660" height="34" rx="8" fill="#e2e8f0"/>
<rect x="257" y="60" width="220" height="34" rx="8" fill="#86efac"/><text x="367" y="82" text-anchor="middle" class="ec-t">Shop open 9am to 5pm</text>
<text x="10" y="116" class="ec-s">12am</text><text x="165" y="116" class="ec-s">6am</text><text x="330" y="116" class="ec-s">12pm</text><text x="495" y="116" class="ec-s">6pm</text><text x="640" y="116" class="ec-s">12am</text>
<g class="ec-o"><circle cx="65" cy="77" r="9" fill="#2563eb"/><text x="48" y="150" class="ec-s">2am order</text></g>
<g class="ec-o ec-o2"><circle cx="92" cy="77" r="9" fill="#2563eb"/><text x="72" y="170" class="ec-s">3am message</text></g>
<g class="ec-o ec-o3"><circle cx="532" cy="77" r="9" fill="#2563eb"/><text x="512" y="150" class="ec-s">7pm order</text></g>
<g class="ec-o ec-o4"><circle cx="615" cy="77" r="9" fill="#2563eb"/><text x="580" y="170" class="ec-s">10pm message</text></g>
<g class="ec-o ec-o5"><circle cx="147" cy="77" r="9" fill="#2563eb"/><text x="125" y="150" class="ec-s">5am order</text></g>
</svg>`;

const outageSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.ou-b{fill:#dcfce7;stroke:#86efac;stroke-width:2;animation:ou-off 8s infinite}.ou-2{animation-delay:.4s}.ou-3{animation-delay:.8s}
@keyframes ou-off{0%,30%{fill:#dcfce7;stroke:#86efac}40%,85%{fill:#e2e8f0;stroke:#94a3b8}95%,100%{fill:#dcfce7;stroke:#86efac}}
.ou-t{font-size:14px;font-weight:700;fill:#0f172a}.ou-s{font-size:12px;fill:#475569}
.ou-w{animation:ou-wifi 8s infinite;font-size:13px;font-weight:700;fill:#b91c1c;opacity:0}
@keyframes ou-wifi{0%,32%{opacity:0}40%,85%{opacity:1}95%,100%{opacity:0}}
${reducedMotion}
</style>
<text x="10" y="22" class="ou-t">The school's internet goes down for a day</text>
<rect class="ou-b" x="10" y="40" width="205" height="120" rx="14"/><text x="24" y="70" class="ou-t">Learning</text><text x="24" y="90" class="ou-s">Lessons and assessments</text><text x="24" y="106" class="ou-s">are all online</text>
<rect class="ou-b ou-2" x="237" y="40" width="205" height="120" rx="14"/><text x="251" y="70" class="ou-t">Communication</text><text x="251" y="90" class="ou-s">Cannot email parents,</text><text x="251" y="106" class="ou-s">phone tree instead</text>
<rect class="ou-b ou-3" x="464" y="40" width="205" height="120" rx="14"/><text x="478" y="70" class="ou-t">Admin</text><text x="478" y="90" class="ou-s">Attendance and canteen</text><text x="478" y="106" class="ou-s">orders go back to paper</text>
<text x="340" y="182" text-anchor="middle" class="ou-w">NO CONNECTION</text>
</svg>`;

// =================== LESSON 1: Privacy Act ===================
L1.estimatedMinutes = 45;
L1.blocks = [
  hook(L1),
  criteria(["State the role of the Privacy Act 1988.", "Describe rules for collecting and using personal information.", "Describe a person's right to access their information."]),
  video("The Privacy Act in plain English", 4, "A short explainer on what personal information is and the basic rules for collecting, using and accessing it. Suggested source: the Office of the Australian Information Commissioner (OAIC) education material, or a teacher-filmed screen recording.", ["What counts as personal information", "The 'only collect what you need' rule", "How a person asks to see their information"]),
  h("The big idea"),
  keyTerms(L1),
  { type: "svgFigure", title: "The life of personal information", alt: "Five steps in order: collect, use, store, access, dispose.", svg: lifecycleSvg, caption: "Each step lights up in order. The Privacy Act has rules at every stage." },
  { type: "sequence", title: "Put the life cycle in order", instruction: "Tap the five stages in order, starting with the first.",
    items: ["Collect only what is needed, and say why.", "Use it for the stated purpose.", "Store it securely.", "Let people access and correct it.", "Dispose of it when it is no longer needed."],
    explanation: "Collect, use, store, access, dispose. The rules apply at every stage, not just when data is first collected." },
  h("Gym app: OK or not OK?"),
  { type: "sorter", title: "Sort the gym chain's actions", instruction: "A national gym chain handles its members' details. Is each action OK or not OK under the Privacy Act?",
    categories: ["OK", "Not OK"],
    items: [
      { text: "Collecting name, email, payment details and an emergency contact to run the membership.", category: 0, why: "Each item is needed to run the membership." },
      { text: "Asking new members for their religion and income.", category: 1, why: "Not needed for a gym membership, so it should not be collected." },
      { text: "Sending class reminders to members who signed up.", category: 0, why: "It uses the information for the purpose it was collected for." },
      { text: "Selling member emails to a supplement company without consent.", category: 1, why: "It uses the information for a different purpose without agreement." },
      { text: "Letting a member see a copy of her data and correct her old address.", category: 0, why: "People have a right to access and correct information held about them." },
    ] },
  { type: "flipCards", title: "Four ideas to lock in", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Law", front: "What does the Privacy Act 1988 do?", back: "It regulates how government agencies and most organisations handle personal information, through the Australian Privacy Principles." },
      { tag: "Collection", front: "What is the collection rule?", back: "Only collect information that is needed, and tell people why it is collected and how it will be used." },
      { tag: "Use", front: "When can information be used for a different purpose?", back: "Only if the person agrees or the law allows it." },
      { tag: "Access", front: "What is the access right?", back: "People can ask to see the personal information held about them and ask for incorrect details to be corrected." },
    ] },
  h("Try the case"),
  { type: "branchingScenario", title: "The concert ticket seller", intro: "A large online ticket seller's signup form asks for name, email, phone, date of birth and the buyer's school. Rule on it.",
    steps: [
      { situation: "The form asks for the buyer's school name to sell a concert ticket.", prompt: "Should the seller collect it?",
        choices: [
          { text: "No. It is not needed to sell a ticket, so only necessary information should be collected.", correct: true, feedback: "Collection must be necessary for the purpose. A ticket sale does not need a school name." },
          { text: "Yes, because the customer is free to leave it blank.", correct: false, feedback: "Making it optional does not fix over-collection. The test is whether it is necessary." },
          { text: "Yes, because more data is always useful.", correct: false, feedback: "Collecting more than needed is exactly what the Act discourages." },
        ] },
      { situation: "A customer emails asking what the seller holds about her and says her phone number is out of date.", prompt: "What should the seller do?",
        choices: [
          { text: "Let her see her information and correct the phone number.", correct: true, feedback: "People have the right to access their information and have incorrect details corrected." },
          { text: "Refuse, because the data belongs to the company.", correct: false, feedback: "The person has a right to access personal information about them." },
          { text: "Delete her whole account without telling her.", correct: false, feedback: "That does not answer her request to see or correct her information." },
        ] },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's test", text: "For every collection question ask: is this piece of personal information actually necessary for what it is being used for? A gym app needs your name and payment details. It very rarely needs your school. If it is not necessary, collecting it is the problem, even if the person consented." },
  testTip("Describe one requirement of the Privacy Act 1988 when collecting information. (2 marks)", "\"They need a good reason.\"", "Too vague, with no link to the Act's rules.",
    "\"The organisation must only collect information it needs, and must tell the person why it is collected and how it will be used.\"", "A specific rule, stated fully."),
  scenario("Online ticket seller", "A large online ticket seller asks for name, email, phone, date of birth and the name of the buyer's school when selling concert tickets."),
  h("Assessment practice"),
  ...extended(L1),
  h("Test-ready recap"),
  recap([
    { icon: "⚖️", heading: "Use the necessity test", text: "Explain collection against 'is it needed?', not just yes or no.", tone: "blue" },
    { icon: "🔑", heading: "Name the access right", text: "People can see the information held about them and have errors corrected.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 3/4 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  nextCallout(L1),
];

// =================== LESSON 2: Identity theft ===================
const L2_match = pick(L2, (b) => b.type === "interactiveDiagram");
L2.estimatedMinutes = 45;
L2.blocks = [
  hook(L2),
  criteria(["Describe how identity theft can occur.", "Explain the organisation's responsibility to protect and dispose of data.", "Describe safe disposal methods."]),
  video("From data breach to identity theft", 4, "A short clip showing how stolen details are used to open accounts in someone else's name, and what safe disposal of old devices looks like. Suggested source: the Scamwatch or IDCARE education material, or a teacher-filmed screen recording.", ["Which details are most useful to a thief", "Why deleted files can still be recovered", "What a data-wipe or shredding service does"]),
  h("The big idea"),
  keyTerms(L2),
  { type: "svgFigure", title: "How a breach becomes identity theft", alt: "Data held by a company is stolen in a breach and then used to commit identity theft.", svg: theftSvg, caption: "The red dot is the stolen data travelling from the company to the thief." },
  { type: "infoCards", columns: 2, cards: [
    { icon: "🎣", heading: "How it happens", text: "Data breach at a company. Phishing emails and fake websites. Oversharing online (birthday, address, pet names). Stolen mail or recovered old drives.", tone: "red" },
    { icon: "🛡️", heading: "Reduce the risk", text: "Share only what is needed. Strong, unique passwords and two-step verification. Check bank statements. Securely dispose of old devices and documents.", tone: "green" },
  ] },
  h("Safe disposal: the clinic case"),
  { type: "sorter", title: "Safe or unsafe disposal?", instruction: "A medical clinic is getting rid of five old computers and paper records. Is each method safe or unsafe?",
    categories: ["Safe", "Unsafe"],
    items: [
      { text: "Deleting the files and putting the computers in a skip.", category: 1, why: "Deleted files can be recovered with free tools." },
      { text: "Using data-wiping software that overwrites the whole drive.", category: 0, why: "Overwriting the whole drive means the old records cannot be recovered." },
      { text: "Removing the drives and having a certified service shred them.", category: 0, why: "Physical destruction makes the data unrecoverable." },
      { text: "Putting printed patient records in the recycling bin.", category: 1, why: "Paper records must be shredded, not recycled whole." },
      { text: "Emptying the recycle bin on every computer before donating them.", category: 1, why: "Emptying the recycle bin does not erase the data from the drive." },
    ] },
  L2_match,
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What is a notifiable data breach?", back: "A breach likely to cause serious harm. The organisation must tell the affected people and the regulator." },
      { tag: "Explain", front: "Why is 'delete' not safe disposal?", back: "Deleted files can be recovered. Safe disposal means wiping by overwriting the whole drive, or destroying it." },
      { tag: "Apply", front: "Name two ways to reduce your own identity theft risk.", back: "Any two of: share only what is needed, use strong unique passwords with two-step verification, check bank statements, dispose of old devices and documents securely." },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's distinction", text: "A data breach only becomes notifiable under the Act when it is likely to cause serious harm. Not every leak triggers the same obligations. Knowing that distinction separates a business that overreacts to every incident from one that correctly escalates the serious ones." },
  testTip("Describe one method of safe disposal. (2 marks)", "\"Delete the files and empty the recycle bin.\"", "The data can still be recovered. Earns 0.",
    "\"Use data-wiping software to overwrite the entire drive several times, so the old records cannot be recovered.\"", "A named method and why it works."),
  scenario("Retail chain breach", "A retail chain's customer database, including names, addresses, dates of birth and driver's licence numbers, was stolen by hackers."),
  h("Assessment practice"),
  ...extended(L2),
  h("Test-ready recap"),
  recap([
    { icon: "🕵️", heading: "Link data to a real misuse", text: "Say what a thief does with it, such as opening a credit card or loan in the victim's name.", tone: "blue" },
    { icon: "🧹", heading: "Delete is not disposal", text: "Name wiping or destruction, and say why the data cannot then be recovered.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  nextCallout(L2),
];

// =================== LESSON 3: Digital divide ===================
L3.estimatedMinutes = 45;
L3.blocks = [
  hook(L3),
  criteria(["Explain the concept of the digital divide.", "Describe issues: availability of digital resources, dependency on electronic communication, use of digital technologies, availability of web-based applications.", "Explain the effect on a person or group."]),
  video("What is the digital divide?", 4, "A short clip with real examples of people who are left out when services move online, including rural and older Australians. Suggested source: material from the Australian Digital Inclusion Index, or a teacher-filmed example.", ["Who is on each side of the divide", "Which services have moved online", "Why a connection alone does not fix it"]),
  h("The big idea"),
  keyTerms(L3),
  { type: "svgFigure", title: "The gap", alt: "Two sides: people who are connected and confident, and people who are left behind, with a dashed gap between them.", svg: divideSvg, caption: "The divide is about skills, devices and services as well as a connection." },
  h("Who is on the wrong side?"),
  { type: "sorter", title: "Which issue is it?", instruction: "Each situation shows one barrier. Tap the issue it best matches.",
    categories: ["Availability of digital resources", "Use of digital technologies", "Availability of web-based applications", "Dependency on electronic communication"],
    items: [
      { text: "A farmer 60 km from town has slow satellite internet, so video calls and uploads often fail.", category: 0, why: "A reliable, affordable connection is a digital resource he does not have." },
      { text: "An 82-year-old has a phone but not the skills to use myGov or online banking.", category: 1, why: "The barrier is skills and confidence in using the technology." },
      { text: "A family on a low income shares one phone with limited data between three school children.", category: 0, why: "Not enough devices or data is an availability of resources issue." },
      { text: "A bank closes its only town branch and tells customers to use its app.", category: 3, why: "A service moving online-only disadvantages people without access." },
      { text: "A government form will not load properly on an older phone with a weak signal.", category: 2, why: "The web-based service does not work on the person's device and connection." },
    ] },
  { type: "infoCards", title: "Why it matters now", intro: "Services that now mainly run online:", columns: 2, cards: [
    { icon: "🏦", heading: "Everyday services", text: "Banking and bill payment. Government services such as myGov and Centrelink. Health appointments by telehealth.", tone: "blue" },
    { icon: "🎓", heading: "Study and work", text: "School work and reports. Job applications.", tone: "purple" },
    { icon: "⚠️", heading: "Effects of being left out", text: "Missed information and deadlines. Higher costs such as paper bills and travel. Falling behind at school or work.", tone: "red" },
    { icon: "🤝", heading: "Social effects", text: "Social isolation. Relying on others for private matters.", tone: "amber" },
  ] },
  { type: "branchingScenario", title: "The branch that closed", intro: "A bank closes its only branch in a small country town and tells customers to use its app. Pick the strongest explanation each time.",
    steps: [
      { situation: "Older residents mostly have basic phones and have never used banking apps.", prompt: "Which answer best explains the effect on them?",
        choices: [
          { text: "They struggle.", correct: false, feedback: "Too vague. It does not say which group or what happens to them." },
          { text: "Without app skills they must travel to another town to bank, which costs time and money.", correct: true, feedback: "It names the group, the barrier and the effect." },
          { text: "They should just learn to use the app.", correct: false, feedback: "That is advice, not an effect, and it ignores the barrier." },
        ] },
      { situation: "Some farms on the edge of town have slow satellite internet.", prompt: "Which answer best explains the effect on them?",
        choices: [
          { text: "Slow satellite internet means the app and uploads often fail, so they must drive to a branch in another town, losing a day of work.", correct: true, feedback: "It links the specific barrier to a specific consequence." },
          { text: "They have bad internet.", correct: false, feedback: "It states the issue but not the effect." },
          { text: "Internet is cheap now so it is fine.", correct: false, feedback: "Not true for rural users, and it avoids the question." },
        ] },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's warning", text: "People conflate 'has internet access' with 'digital divide solved'. Someone can have a connection and still be excluded if they lack the skills, the right device or the confidence to use a service. The divide is about capability as much as access." },
  testTip("Explain how the digital divide affects the farmer. (3 marks)", "\"He has bad internet.\"", "States the issue but not the effect.",
    "\"Slow satellite internet means he cannot reliably use telehealth or upload records to government sites, so he must drive to town, losing a day of work.\"", "Issue, then a specific effect."),
  scenario("The closed bank branch", "A bank closes its only branch in a small country town and tells customers to use its app."),
  h("Assessment practice"),
  ...extended(L3),
  h("Test-ready recap"),
  recap([
    { icon: "📏", heading: "Define the gap", text: "People with access and skills versus people without.", tone: "blue" },
    { icon: "👥", heading: "Name the group", text: "Say which people and why, such as older residents without app skills or rural residents without a reliable connection.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  nextCallout(L3),
];

// =================== LESSON 4: E-commerce ===================
L4.estimatedMinutes = 45;
L4.blocks = [
  hook(L4),
  criteria(["Explain the concept of electronic commerce.", "Describe implications of improved digital communications.", "Explain positive and negative implications of 24/7 communication."]),
  video("E-commerce and 24/7 trading", 4, "A short clip following a small business that goes online: the extra sales, the after-hours messages and the new costs. Suggested source: a small-business case study clip or a teacher-filmed interview with a local owner.", ["What the business gained", "What it now has to manage", "How customers' expectations changed"]),
  h("The big idea"),
  keyTerms(L4),
  { type: "svgFigure", title: "One day at the surf shop", alt: "A 24-hour timeline. The shop is open 9am to 5pm but online orders and messages arrive at night.", svg: clockSvg, caption: "The shop is open for eight hours. Customers are online for all twenty-four." },
  h("Every benefit has a cost"),
  { type: "sorter", title: "Positive or negative?", instruction: "Sort each implication of 24/7 online trading for a small business.",
    categories: ["Positive", "Negative"],
    items: [
      { text: "Orders arrive at 2 am while the shop is closed.", category: 0, why: "More sales at any hour." },
      { text: "Customers message on Instagram at night and expect quick replies.", category: 1, why: "It creates pressure to reply out of hours, adding workload or cost." },
      { text: "The shop sells wetsuits to customers across Australia, not only locals.", category: 0, why: "A wider reach means more potential customers." },
      { text: "The owner finds it hard to switch off from the business.", category: 1, why: "Round-the-clock contact blurs work and personal time." },
      { text: "The shop now competes with global online stores on price.", category: 1, why: "Customers can compare prices easily, which squeezes margins." },
      { text: "Chatbots can answer common questions at any hour.", category: 0, why: "It helps meet 24/7 expectations without extra staff, though it has a set-up cost." },
    ] },
  { type: "infoCards", title: "Implications for customers", columns: 2, cards: [
    { icon: "✅", heading: "Positive", text: "Shop any time, from anywhere. Compare prices easily.", tone: "green" },
    { icon: "⚠️", heading: "Negative", text: "Cannot see or try products first. Risk of scams and data theft.", tone: "red" },
  ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What is e-commerce?", back: "Buying and selling goods and services over the internet." },
      { tag: "Define", front: "What does 24/7 communication mean?", back: "Customers can shop, message and expect replies at any time of day, every day." },
      { tag: "Explain", front: "Give one positive and one negative of 24/7 trading for a small business.", back: "Positive: more sales outside normal hours. Negative: customers expect replies at night, adding workload or cost." },
      { tag: "Careful", front: "What is the most common mistake in a 'positive and negative' answer?", back: "Giving two positives dressed up differently. One answer must be a real negative." },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's double edge", text: "24/7 availability grows sales outside normal hours, and it also creates an expectation of round-the-clock responsiveness that small operators struggle to meet. Always give both sides." },
  testTip("Describe one implication of 24/7 communication for a small business. (2 marks)", "\"It is always open.\"", "That is the feature, not the consequence.",
    "\"Customers expect replies at night, so the owner must answer messages after hours or pay for a chatbot, adding workload or cost.\"", "A consequence for the business."),
  scenario("The online bakery", "A family-owned bakery starts taking online orders for birthday cakes through its website."),
  h("Assessment practice"),
  ...extended(L4),
  h("Test-ready recap"),
  recap([
    { icon: "🛒", heading: "Define it cleanly", text: "E-commerce is buying and selling goods and services over the internet.", tone: "blue" },
    { icon: "↔️", heading: "Give both sides", text: "One genuine positive and one genuine negative, each linked to the business in the question.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  nextCallout(L4),
];

// =================== LESSON 5: Dependency ===================
L5.estimatedMinutes = 45;
L5.blocks = [
  hook(L5),
  criteria(["Describe the requirement for personal development of technology skills.", "Describe the responsibility for maintaining privacy when using technology.", "Explain an issue for a person or organisation."]),
  video("When the technology stops", 4, "A short clip showing what a workplace or school does when its systems go down, and what skills people need to keep up with new tools. Suggested source: a news report on a major outage, or a teacher-filmed scenario.", ["What stopped working first", "What fall-back plans existed", "Which skills people were missing"]),
  h("The big idea"),
  keyTerms(L5),
  { type: "svgFigure", title: "A day without the internet", alt: "Three areas of a school, learning, communication and admin, go dark when the internet goes down.", svg: outageSvg, caption: "Watch the three areas drop out, then come back." },
  h("Two key issues"),
  { type: "sorter", title: "Which key issue is it?", instruction: "Sort each point under the issue it belongs to.",
    categories: ["Technology skills", "Maintaining privacy"],
    items: [
      { text: "Jobs need new software skills every few years.", category: 0, why: "People must keep developing their technology skills." },
      { text: "Screenshots can be shared without permission.", category: 1, why: "Users are responsible for what they share and how they protect information." },
      { text: "Older workers may need retraining.", category: 0, why: "Retraining is part of developing technology skills." },
      { text: "Photos can carry location data.", category: 1, why: "Users must manage what private information they reveal." },
      { text: "Services assume users can use apps.", category: 0, why: "Skills are needed to take part in services." },
      { text: "Video calls can show private spaces.", category: 1, why: "Users must choose a suitable private space for a call." },
    ] },
  { type: "branchingScenario", title: "The medical centre app", intro: "A medical centre moves appointments, reminders and test results to an app, and staff mostly talk to patients by video call.",
    steps: [
      { situation: "A patient has to log in to see her test results.", prompt: "Which is the strongest privacy responsibility for her?",
        choices: [
          { text: "Use a strong password and do not share her login details.", correct: true, feedback: "Protecting her own login is her responsibility, since it controls access to her results." },
          { text: "Let a friend log in for her so it is easier.", correct: false, feedback: "Sharing login details gives others access to private health information." },
          { text: "Write the password on the back of her phone.", correct: false, feedback: "That makes it easy for someone else to find and use." },
        ] },
      { situation: "She has a video appointment while at a busy cafe.", prompt: "What should she do?",
        choices: [
          { text: "Take the call somewhere private so others cannot see or hear it.", correct: true, feedback: "Video calls can show and expose private details, so choosing a private space is her responsibility." },
          { text: "Take it at the cafe table and speak louder.", correct: false, feedback: "Other people could overhear private health details." },
          { text: "Screenshot the doctor's screen to post to a group.", correct: false, feedback: "Sharing a screenshot without permission breaches the doctor's and her own privacy." },
        ] },
    ] },
  { type: "flipCards", title: "Check your understanding", instruction: "Answer first, then flip.",
    cards: [
      { tag: "Define", front: "What is dependency on electronic and visual communication?", back: "Relying on tools such as email, messaging and video calls so much that work and daily life cannot happen without them." },
      { tag: "Explain", front: "Why must people keep developing technology skills?", back: "New tools keep arriving, and without the skills people cannot take part in work, study and services, or need retraining." },
      { tag: "Apply", front: "What lesson did the school outage teach?", back: "Keep offline backups and a plan for outages." },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's view", text: "Dependency is not automatically a flaw to criticise. It is a fact to manage. The useful answer is not 'people should not rely on technology', it is naming the specific skill gap or responsibility that the outage exposed, and what closes it." },
  testTip("Explain one issue of society's dependency on electronic communication. (3 marks)", "\"People use phones too much.\"", "Not linked to an issue in the syllabus.",
    "\"Workers need to keep learning new tools, such as a new booking system, so staff without training are left behind or need retraining, which costs the business time.\"", "A named issue with a consequence."),
  scenario("The medical centre", "A medical centre moves all appointments, reminders and test results to an app. Staff now talk to patients mainly by video call."),
  h("Assessment practice"),
  ...extended(L5),
  h("Test-ready recap"),
  recap([
    { icon: "🧠", heading: "Name the skill", text: "Say which skill staff or patients need, not just 'get better with tech'.", tone: "blue" },
    { icon: "🔒", heading: "Name the duty", text: "State a specific privacy responsibility and why it falls on the user.", tone: "purple" },
    { icon: "🎯", heading: "Aim for", text: "At least 4/5 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ]),
  nextCallout(L5),
];

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(topic.lessons.map((l) => `${l.id}: ${l.blocks.length} blocks`).join("\n"));
