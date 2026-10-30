// Rebuilds Year 12 AIT General, Unit 3 "Impacts of Technology" (5 lessons) as interactive card lessons.
// Keeps: syllabus points, key terms, extended-answer questions (same ids), task callouts.
// Run: node scripts/rebuild-y12-general-impacts-u3.mjs
import fs from "node:fs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const topic = course.units.find((u) => u.id === "unit3").topics.find((t) => t.id === "impacts-of-technology-u3");

const find = (lesson, pred) => lesson.blocks.find(pred);
const findAll = (lesson, pred) => lesson.blocks.filter(pred);
const extended = (l) => findAll(l, (b) => b.type === "quizQuestion" && b.question.questionType === "extended");
const keyTerms = (l) => find(l, (b) => b.type === "keyTerms");
const taskCallout = (l) => l.blocks[l.blocks.length - 1];
const hook = (l) => l.blocks[0];

const h = (text, level = 2) => ({ type: "heading", text, level });
const mcq = (id, text, options, correctIndex, explanation) => ({
  type: "quizQuestion",
  question: { id, questionType: "mcq", text, options, correctIndex, explanation },
});
const tf = (id, text, correctAnswer, explanation) => ({
  type: "quizQuestion",
  question: { id, questionType: "true_false", text, correctAnswer, explanation },
});
const criteria = (items) => ({
  type: "infoCards",
  title: "By the end of this lesson you can",
  columns: 1,
  cards: items.map((t, i) => ({ icon: ["🎯", "🧭", "✅"][i] ?? "🎯", heading: t, text: "", tone: "blue" })),
});
const testTip = (question, weak, weakWhy, strong, strongWhy) => ({
  type: "infoCards",
  title: "Test tip: what earns the marks",
  intro: question,
  columns: 2,
  cards: [
    { icon: "⚠️", heading: `Earns 0 or 1 mark: ${weak}`, text: weakWhy, tone: "red" },
    { icon: "⭐", heading: "Earns full marks", text: `${strong} ${strongWhy}`.trim(), tone: "green" },
  ],
});
const scenario = (title, text) => ({
  type: "infoCards", columns: 1,
  cards: [{ icon: "📂", heading: `Scenario: ${title}`, text: `${text} Answer the questions below using this scenario.`, tone: "amber" }],
});
const reducedMotion = "@media (prefers-reduced-motion: reduce){*{animation:none!important}}";

// ---------- animated figures ----------
const footprintSvg = `<svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.fp-r{fill:none;stroke:#2563eb;stroke-width:3;transform-origin:120px 165px;animation:fp-grow 4.5s ease-out infinite;opacity:0}
.fp-r2{animation-delay:1.5s}.fp-r3{animation-delay:3s}
@keyframes fp-grow{0%{transform:scale(.2);opacity:.9}100%{transform:scale(5.2);opacity:0}}
.fp-t{font-size:15px;fill:#0f172a;font-weight:600}.fp-s{font-size:13px;fill:#475569}
.fp-b{animation:fp-pop 9s infinite;opacity:.25}.fp-b2{animation-delay:2.2s}.fp-b3{animation-delay:4.4s}.fp-b4{animation-delay:6.6s}
@keyframes fp-pop{0%,8%{opacity:.25}14%,30%{opacity:1}40%,100%{opacity:.25}}
${reducedMotion}
</style>
<circle class="fp-r" cx="120" cy="165" r="30"/><circle class="fp-r fp-r2" cx="120" cy="165" r="30"/><circle class="fp-r fp-r3" cx="120" cy="165" r="30"/>
<circle cx="120" cy="165" r="38" fill="#2563eb"/><text x="120" y="160" text-anchor="middle" fill="#fff" font-size="26">📱</text><text x="120" y="182" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">You post</text>
<g class="fp-b"><rect x="260" y="30" width="350" height="56" rx="14" fill="#dbeafe"/><text x="278" y="55" class="fp-t">1. Friends see it</text><text x="278" y="74" class="fp-s">Followers and the group chat, within minutes</text></g>
<g class="fp-b fp-b2"><rect x="260" y="100" width="350" height="56" rx="14" fill="#e0e7ff"/><text x="278" y="125" class="fp-t">2. Others copy it</text><text x="278" y="144" class="fp-s">Screenshots, reshares and downloads you never see</text></g>
<g class="fp-b fp-b3"><rect x="260" y="170" width="350" height="56" rx="14" fill="#ede9fe"/><text x="278" y="195" class="fp-t">3. Strangers find it</text><text x="278" y="214" class="fp-s">Search engines and people who are not your friends</text></g>
<g class="fp-b fp-b4"><rect x="260" y="240" width="350" height="56" rx="14" fill="#fce7f3"/><text x="278" y="265" class="fp-t">4. It lasts for years</text><text x="278" y="284" class="fp-s">A future employer or university can still find it</text></g>
</svg>`;

const responseFlowSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.cb-box{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}
.cb-lit{animation:cb-glow 8s infinite;fill:#f1f5f9}.cb-l2{animation-delay:2s}.cb-l3{animation-delay:4s}.cb-l4{animation-delay:6s}
@keyframes cb-glow{0%,22%{fill:#bbf7d0}25%,100%{fill:#f1f5f9}}
.cb-n{font-size:22px;font-weight:800;fill:#15803d}.cb-t{font-size:14.5px;font-weight:700;fill:#0f172a}.cb-s{font-size:12px;fill:#475569}
.cb-a{stroke:#94a3b8;stroke-width:3;fill:none}
${reducedMotion}
</style>
<g><rect class="cb-box cb-lit" x="8" y="30" width="150" height="130" rx="16"/><text x="24" y="62" class="cb-n">1</text><text x="24" y="88" class="cb-t">Do not reply</text><text x="24" y="108" class="cb-s">A reaction feeds</text><text x="24" y="124" class="cb-s">the bully</text></g>
<g><rect class="cb-box cb-lit cb-l2" x="182" y="30" width="150" height="130" rx="16"/><text x="198" y="62" class="cb-n">2</text><text x="198" y="88" class="cb-t">Keep evidence</text><text x="198" y="108" class="cb-s">Screenshots with</text><text x="198" y="124" class="cb-s">date and username</text></g>
<g><rect class="cb-box cb-lit cb-l3" x="356" y="30" width="150" height="130" rx="16"/><text x="372" y="62" class="cb-n">3</text><text x="372" y="88" class="cb-t">Block and report</text><text x="372" y="108" class="cb-s">Use the platform's</text><text x="372" y="124" class="cb-s">report tool</text></g>
<g><rect class="cb-box cb-lit cb-l4" x="530" y="30" width="142" height="130" rx="16"/><text x="546" y="62" class="cb-n">4</text><text x="546" y="88" class="cb-t">Get help</text><text x="546" y="108" class="cb-s">Trusted adult, then</text><text x="546" y="124" class="cb-s">eSafety if no action</text></g>
<path class="cb-a" d="M158 95h24M332 95h24M506 95h24"/>
</svg>`;

const newsRaceSvg = `<svg viewBox="0 0 680 250" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.nr-l{stroke:#cbd5e1;stroke-width:6;stroke-linecap:round}
.nr-t{font-size:14px;font-weight:700;fill:#0f172a}.nr-s{font-size:12px;fill:#475569}
.nr-slow{animation:nr-run 14s linear infinite}.nr-fast{animation:nr-run 2.2s linear infinite}
@keyframes nr-run{0%{transform:translateX(0)}100%{transform:translateX(480px)}}
${reducedMotion}
</style>
<text x="16" y="28" class="nr-t">1995: a storm hits Bunbury</text>
<line class="nr-l" x1="100" y1="70" x2="580" y2="70"/>
<text x="100" y="100" class="nr-s">Journalist</text><text x="230" y="100" class="nr-s">Editor checks</text><text x="360" y="100" class="nr-s">Printed</text><text x="490" y="100" class="nr-s">Doorstep next morning</text>
<g class="nr-slow"><circle cx="100" cy="70" r="12" fill="#64748b"/></g>
<text x="16" y="150" class="nr-t">Today: the same storm</text>
<line class="nr-l" x1="100" y1="190" x2="580" y2="190"/>
<text x="100" y="220" class="nr-s">Resident films it</text><text x="320" y="220" class="nr-s">Posts it</text><text x="450" y="220" class="nr-s">Everyone sees it in minutes</text>
<g class="nr-fast"><circle cx="100" cy="190" r="12" fill="#2563eb"/></g>
</svg>`;

const copyrightFlowSvg = `<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
<style>
.cf-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}.cf-t{font-size:14px;font-weight:700;fill:#0f172a}.cf-s{font-size:12px;fill:#475569}
.cf-a{stroke:#94a3b8;stroke-width:3;fill:none}
.cf-p{animation:cf-pulse 7s infinite;fill:#f1f5f9}.cf-p2{animation-delay:1.7s}.cf-p3{animation-delay:3.4s}.cf-p4{animation-delay:5.1s}
@keyframes cf-pulse{0%,20%{fill:#fde68a}24%,100%{fill:#f1f5f9}}
${reducedMotion}
</style>
<rect class="cf-b cf-p" x="8" y="20" width="150" height="100" rx="14"/><text x="20" y="48" class="cf-t">1. Is it a work</text><text x="20" y="66" class="cf-t">someone created?</text><text x="20" y="90" class="cf-s">Photo, song, text, code.</text><text x="20" y="106" class="cf-s">Protected automatically.</text>
<rect class="cf-b cf-p cf-p2" x="188" y="20" width="150" height="100" rx="14"/><text x="200" y="48" class="cf-t">2. Do you have</text><text x="200" y="66" class="cf-t">permission?</text><text x="200" y="90" class="cf-s">Owner's yes or a licence</text><text x="200" y="106" class="cf-s">like Creative Commons.</text>
<rect class="cf-b cf-p cf-p3" x="368" y="20" width="150" height="100" rx="14"/><text x="380" y="48" class="cf-t">3. Is an exception</text><text x="380" y="66" class="cf-t">met?</text><text x="380" y="90" class="cf-s">Fair dealing purpose or</text><text x="380" y="106" class="cf-s">limited private use.</text>
<rect class="cf-b cf-p cf-p4" x="548" y="20" width="124" height="100" rx="14"/><text x="560" y="48" class="cf-t">4. Still credit</text><text x="560" y="66" class="cf-t">the creator</text><text x="560" y="90" class="cf-s">Moral rights apply</text><text x="560" y="106" class="cf-s">either way.</text>
<path class="cf-a" d="M158 70h30M338 70h30M518 70h30"/>
<rect x="8" y="150" width="664" height="64" rx="14" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
<text x="24" y="177" class="cf-t">If steps 2 and 3 both fail, using the work is infringement.</text>
<text x="24" y="197" class="cf-s">Selling it, posting it publicly or claiming it as yours almost never fits an exception.</text>
</svg>`;

const apaSvg = `<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace,Menlo,monospace">
<style>
.ap-w{font-size:13px;fill:#0f172a}
.ap-a{animation:ap-hi 10s infinite;opacity:.2}.ap-b{animation-delay:2s}.ap-c{animation-delay:4s}.ap-d{animation-delay:6s}.ap-e{animation-delay:8s}
@keyframes ap-hi{0%,16%{opacity:.85}20%,100%{opacity:.2}}
.ap-l{font-family:system-ui,sans-serif;font-size:12.5px;font-weight:700}
${reducedMotion}
</style>
<rect class="ap-a" x="14" y="48" width="84" height="30" rx="6" fill="#2563eb"/>
<rect class="ap-a ap-b" x="104" y="48" width="68" height="30" rx="6" fill="#16a34a"/>
<rect class="ap-a ap-c" x="178" y="48" width="154" height="30" rx="6" fill="#d97706"/>
<rect class="ap-a ap-d" x="338" y="48" width="84" height="30" rx="6" fill="#9333ea"/>
<rect class="ap-a ap-e" x="428" y="48" width="238" height="30" rx="6" fill="#dc2626"/>
<text class="ap-w" x="20" y="68">Smith, J.</text><text class="ap-w" x="110" y="68">(2026).</text><text class="ap-w" x="184" y="68">Phones in schools.</text><text class="ap-w" x="344" y="68">ABC News.</text><text class="ap-w" x="434" y="68">https://www.abc.net.au/...</text>
<text class="ap-l" x="20" y="108" fill="#2563eb">1 Author</text><text class="ap-l" x="110" y="128" fill="#16a34a">2 Year</text><text class="ap-l" x="184" y="108" fill="#d97706">3 Title</text><text class="ap-l" x="344" y="128" fill="#9333ea">4 Source</text><text class="ap-l" x="434" y="108" fill="#dc2626">5 URL</text>
<text class="ap-l" x="20" y="170" fill="#475569" style="font-family:system-ui,sans-serif">Same five parts, same order, same punctuation, every time.</text>
</svg>`;

// =================== LESSON 1 ===================
const L1 = topic.lessons[0];
const L1_ext = extended(L1);
L1.estimatedMinutes = 45;
L1.blocks = [
  hook(L1),
  criteria(["Define digital citizenship.", "Describe responsible behaviours when using social networking.", "Explain the consequences of irresponsible use for the user and others."]),
  { type: "videoSlot", title: "What is your digital footprint?", minutes: 3,
    brief: "A short, school-appropriate clip showing how one public post is seen, copied and found later. Suggested source: an eSafety Commissioner education video on digital footprints, or a short teacher-filmed screen recording.",
    watchFor: ["Who can see a public post", "What happens when someone screenshots it", "Why deleting does not remove every copy"] },
  h("The big idea"),
  keyTerms(L1),
  { type: "svgFigure", title: "How far one post travels", alt: "Four steps showing a post spreading from friends, to copies, to strangers, to lasting for years.",
    svg: footprintSvg, caption: "Each ring is another group who can see, copy or keep your post." },
  h("Flip and test yourself"),
  { type: "flipCards", title: "Four terms, four answers", instruction: "Read the front, answer out loud, then flip.",
    cards: [
      { tag: "Define", front: "What is digital citizenship?", back: "Using digital technologies safely, responsibly and respectfully, and understanding your rights and responsibilities online." },
      { tag: "Define", front: "What is a digital footprint?", back: "The permanent record of everything you post, share, like and search online, including what others post about you." },
      { tag: "Apply", front: "Why is posting a friend's photo without asking irresponsible?", back: "The friend did not agree to it joining their digital footprint, and the photo can be copied even if you later delete it." },
      { tag: "Apply", front: "Who must take 'reasonable steps' to stop under-16s having accounts (from 10 December 2025)?", back: "The age-restricted social media platforms. The obligation and penalties apply to the platforms, not to the young person or their parents." },
    ] },
  h("Responsible or risky?"),
  { type: "sorter", title: "Sort Jordan's choices", instruction: "Jordan (17) is posting about a party. Is each choice responsible or risky?",
    categories: ["Responsible", "Risky"],
    items: [
      { text: "Posts a group photo without asking anyone first.", category: 1, why: "Others did not give permission, and the photo stays in their digital footprint." },
      { text: "Checks his privacy settings before posting.", category: 0, why: "Only approved followers see the post, which limits the audience." },
      { text: "Tags the party's location while it is happening.", category: 1, why: "Strangers can see where a group of young people is right now." },
      { text: "Deletes a friend's rude comment and messages them privately.", category: 0, why: "It stops the harm spreading and deals with it privately." },
      { text: "Reshares a shocking story without checking if it is true.", category: 1, why: "Unchecked information can spread false claims and hurt real people." },
      { text: "Credits the photographer when he shares a photo they took.", category: 0, why: "Crediting others is part of respectful, responsible sharing." },
    ] },
  mcq("impacts-of-technology-u3-1-digital-citizenship-mcq1", "Jordan wants to post a group photo but has not asked the other people. What is the most responsible first step?",
    ["Ask the people in the photo before posting it.", "Post it now and remove it if someone complains.", "Tag everyone so they find out after it is posted."], 0,
    "Ask permission first. Other people should have a say in what is added to their digital footprint."),
  { type: "infoCards", title: "Responsible social networking", columns: 2, cards: [
      { icon: "✅", heading: "Do", text: "Pause and think about the audience. Ask before sharing someone's photo. Check privacy settings. Verify information before sharing. Report harmful content.", tone: "green" },
      { icon: "🚫", heading: "Avoid", text: "Posting your school, phone number or live location publicly. Accepting requests from people you do not know. Posting while angry. Sharing someone's work without credit or using their account.", tone: "red" },
  ] },
  h("Try the case"),
  { type: "branchingScenario", title: "Elara's case file: the public TikTok", intro: "Elara's Year 10 student has a public account showing her school uniform and a local park. Make the calls that reduce her risk.",
    steps: [
      { situation: "Her profile photo shows her school uniform with the crest clearly visible.", prompt: "What is the best first change?",
        choices: [
          { text: "Swap to a photo with no uniform or crest, and remove the school from her bio.", correct: true, feedback: "Removing identifying details makes it harder for strangers to work out who she is and where she is during the day." },
          { text: "Leave it, because the account is already popular.", correct: false, feedback: "Popularity does not reduce the risk. It means more strangers can see the identifying details." },
          { text: "Add a filter over the crest.", correct: false, feedback: "Filters are easy to avoid and the uniform can still be recognised." },
        ] },
      { situation: "Her videos are often filmed at the same local park, and she posts them as she films.", prompt: "What should she change?",
        choices: [
          { text: "Turn off location tags and post after she has left the park.", correct: true, feedback: "Delaying posts and removing location tags stops strangers learning where she is right now." },
          { text: "Keep tagging the park so friends can join her.", correct: false, feedback: "A live location tells strangers exactly where to find her." },
          { text: "Only tag the park in her Stories, not the main feed.", correct: false, feedback: "Stories are still visible to a public audience, so the risk stays." },
        ] },
      { situation: "A stranger comments asking which school she goes to.", prompt: "What is the most responsible response?",
        choices: [
          { text: "Do not reply, block the account and report it.", correct: true, feedback: "Not engaging, blocking and reporting protects her and helps the platform act." },
          { text: "Reply with the school name because he seems friendly.", correct: false, feedback: "Giving personal information to a stranger is exactly the risk digital citizenship warns about." },
          { text: "Delete the comment and say nothing.", correct: false, feedback: "Deleting alone does not stop the stranger or warn the platform." },
        ] },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's reminder", text: "Your digital footprint includes what other people post about you, too. Ask before sharing a photo, and remember that deleting a post cannot guarantee every copy disappears." },
  testTip("Explain one consequence of posting an inappropriate photo online. (2 marks)", "\"You could get in trouble.\"", "Too general. It does not say how or why.",
    "\"The photo becomes part of your digital footprint and can be copied or screenshotted, so it may be seen by a future employer even after you delete it.\"", "A consequence, plus how it happens."),
  { type: "callout", variant: "sandbox", heading: "Your turn", text: "In your notes, define digital citizenship and plan two realistic changes for the student in the opening case. Explain how each change reduces risk." },
  h("Assessment practice"),
  ...L1_ext,
  h("Test-ready recap"),
  { type: "infoCards", columns: 1, cards: [
      { icon: "📝", heading: "Define it", text: "Digital citizenship is using technology safely, responsibly and respectfully, while understanding online rights and responsibilities.", tone: "blue" },
      { icon: "🔧", heading: "Be specific", text: "Give actions such as asking permission or removing identifying details, then explain how each one reduces risk.", tone: "purple" },
      { icon: "🎯", heading: "Aim for", text: "At least 5/6 on the practice questions. If you miss it, review the key terms and the Do/Avoid cards, then try again.", tone: "green" },
  ] },
  taskCallout(L1),
];

// =================== LESSON 2 ===================
const L2 = topic.lessons[1];
const L2_ext = extended(L2);
L2.estimatedMinutes = 45;
L2.blocks = [
  hook(L2),
  criteria(["Identify forms of cyberbullying.", "Describe strategies to manage or limit cyberbullying.", "Explain positive and negative impacts of digital technologies on work-life balance."]),
  { type: "videoSlot", title: "Cyberbullying: what to do next", minutes: 4,
    brief: "A short clip showing a student taking the four response steps: do not reply, keep evidence, block and report, get help. Suggested source: an eSafety Commissioner video on dealing with cyberbullying.",
    watchFor: ["What evidence the student keeps", "Where the report button is", "When to go to eSafety"] },
  h("Four forms, four mechanisms"),
  keyTerms(L2),
  { type: "infoCards", title: "Name the mechanism, not just 'bullying'", columns: 2, cards: [
      { icon: "📨", heading: "Harassment", text: "Repeated offensive or threatening messages.", tone: "red" },
      { icon: "🚪", heading: "Exclusion", text: "Deliberately leaving someone out of a group or chat.", tone: "amber" },
      { icon: "🎭", heading: "Impersonation", text: "Pretending to be someone else to damage their reputation.", tone: "purple" },
      { icon: "🔓", heading: "Outing", text: "Sharing private information or images without permission.", tone: "blue" },
  ] },
  { type: "sorter", title: "Which form is it?", instruction: "Read each situation and tap the form of cyberbullying.",
    categories: ["Harassment", "Exclusion", "Impersonation", "Outing"],
    items: [
      { text: "A student gets 30 abusive messages in a night from different accounts.", category: 0, why: "Repeated unwanted, offensive contact is harassment." },
      { text: "Everyone in the class is added to a new group chat except one person, on purpose.", category: 1, why: "Deliberately leaving someone out is exclusion." },
      { text: "Someone makes a fake account with a classmate's photo and posts insults as them.", category: 2, why: "Pretending to be the victim to damage their reputation is impersonation." },
      { text: "A private screenshot of someone's personal message is shared with the whole year group.", category: 3, why: "Sharing private information without consent is outing." },
      { text: "A gamer is sent threats every time he streams.", category: 0, why: "Repeated threatening messages are harassment." },
    ] },
  h("What to do about it"),
  { type: "svgFigure", title: "The four-step response", alt: "Four steps in order: do not reply, keep evidence, block and report, get help.", svg: responseFlowSvg,
    caption: "A student is getting abusive comments on every stream. The steps light up in order." },
  { type: "sequence", title: "Put the response in order", instruction: "Tap the four steps in the order a student should take them.",
    items: ["Do not respond to the bully.", "Collect evidence with screenshots showing date and username.", "Block the accounts and report them to the platform.", "Tell a trusted adult, and report to eSafety if the platform does not act within 48 hours."],
    explanation: "Evidence comes before blocking, because blocking or deletion can remove what you need to prove it." },
  mcq("impacts-of-technology-u3-2-cyberbullying-and-work-life-balance-mcq1", "Someone sets up a fake profile using a classmate's photo and posts insults as her. Which form is this?",
    ["Impersonation", "Exclusion", "Outing", "Harassment"], 0, "Pretending to be someone else online to damage their reputation is impersonation."),
  h("Work-life balance: both sides"),
  { type: "sorter", title: "Positive or negative?", instruction: "Sort each impact of digital technology on work-life balance.",
    categories: ["Positive impact", "Negative impact"],
    items: [
      { text: "Working from home saves two hours of travel a day.", category: 0, why: "Saved travel time can go to family, rest or study." },
      { text: "Work emails arrive at 10 pm and staff feel they must reply.", category: 1, why: "It makes people always contactable and cuts into rest and family time." },
      { text: "Flexible hours let a parent work around school pick-up.", category: 0, why: "Technology allows work to fit around family commitments." },
      { text: "Scrolling on a phone in bed replaces sleep.", category: 1, why: "Screen time displaces sleep and exercise." },
      { text: "Video calls keep a worker in touch with family while away.", category: 0, why: "Staying connected is a positive impact on personal life." },
      { text: "Mostly online contact leaves a worker feeling isolated.", category: 1, why: "Less face-to-face contact can lead to isolation." },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's rule", text: "Each form of cyberbullying has a distinct mechanism: harassment is repeated unwanted contact, exclusion is deliberately leaving someone out, impersonation is pretending to be them, outing is exposing private information. Name the mechanism, or the strategy you recommend will not fit the problem." },
  testTip("Explain one negative impact of mobile devices on work-life balance. (2 marks)", "\"Phones are addictive.\"", "Not linked to work-life balance.",
    "\"Work emails arrive on the phone at night, so staff feel they must reply, which cuts into family time and rest.\"", "A named impact tied to work-life balance."),
  h("Apply it: read the scenario"),
  scenario("The supermarket group chat", "A Year 11 student works part-time at a supermarket. The manager messages shifts in a group chat, often late at night. Two co-workers have started posting jokes about her in the chat."),
  h("Assessment practice"),
  ...L2_ext,
  h("Test-ready recap"),
  { type: "infoCards", columns: 1, cards: [
      { icon: "🏷️", heading: "Name the form first", text: "Harassment, exclusion, impersonation or outing, then choose a strategy that fits.", tone: "blue" },
      { icon: "⚖️", heading: "Link to work-life balance", text: "Name the actual impact, such as lost sleep or missed family time, not just 'it is bad'.", tone: "purple" },
      { icon: "🎯", heading: "Aim for", text: "At least 4/5 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ] },
  taskCallout(L2),
];

// =================== LESSON 3 ===================
const L3 = topic.lessons[2];
const L3_ext = extended(L3);
const L3_match = find(L3, (b) => b.type === "interactiveDiagram");
L3.estimatedMinutes = 45;
L3.blocks = [
  hook(L3),
  criteria(["Define social networking.", "Compare traditional and social publication of information.", "Explain the role of mobile devices in this change."]),
  { type: "videoSlot", title: "How news changed: print to phone", minutes: 4,
    brief: "A short explainer comparing how a news story travels through a newsroom with how a social post spreads. Suggested source: an ABC Education or similar media-literacy clip, or a teacher-filmed example using a local story.",
    watchFor: ["Who checks the story before it is published", "How fast it reaches an audience", "Where the audience sees it first"] },
  h("The big idea"),
  keyTerms(L3),
  { type: "svgFigure", title: "A storm hits Bunbury: 1995 vs today", alt: "Two lanes. In 1995 a story moves slowly from journalist to editor to print to doorstep. Today a resident's post reaches everyone in minutes.",
    svg: newsRaceSvg, caption: "Same event. Watch how long each route takes." },
  { type: "infoCards", title: "What we gained and lost", columns: 2, cards: [
      { icon: "⚡", heading: "Gain", text: "Information spreads instantly and anyone can report what they see.", tone: "green" },
      { icon: "⚠️", heading: "Loss", text: "Posts are not checked before sharing, so false information and old videos spread too.", tone: "red" },
  ] },
  h("Traditional vs social"),
  find(L3, (b) => b.type === "table"),
  L3_match,
  { type: "flipCards", title: "Check your comparison", instruction: "Try the answer before you flip.",
    cards: [
      { tag: "Speed", front: "Which is faster to publish: newspaper or social network? Why?", back: "Social networking. Anyone can post instantly from a phone, while a newspaper is edited and printed on a schedule." },
      { tag: "Checking", front: "Why is a newspaper story usually more reliable?", back: "Editors check it before it is published. Social posts are often shared with no checking." },
      { tag: "Mobile", front: "How do mobile devices change how people receive news?", back: "Push notifications and feeds deliver news instantly wherever people are, without buying a paper or waiting for the 6 pm bulletin." },
      { tag: "Distribution", front: "What is the real shift in distribution?", back: "Distribution used to be controlled by publishers. Now anyone with a phone is a distributor." },
    ] },
  { type: "sorter", title: "Traditional or social?", instruction: "Which type of publication does each statement describe?",
    categories: ["Traditional publication", "Social networking"],
    items: [
      { text: "An editor checks facts before the story goes out.", category: 0, why: "Editing and checking before publishing is a feature of traditional publication." },
      { text: "A resident posts a video of the storm within minutes.", category: 1, why: "User-created content posted instantly is social networking." },
      { text: "Readers pay for a subscription or a printed paper.", category: 0, why: "Traditional publishers charge the audience." },
      { text: "The audience comments, shares and creates content.", category: 1, why: "On social networks the audience takes part, not just receives." },
      { text: "News arrives on a schedule, such as the morning paper.", category: 0, why: "Traditional publication follows a schedule." },
      { text: "Free to use and paid for by advertising.", category: 1, why: "Social platforms are free for the audience and funded by ads." },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's point", text: "The real shift is not that social media is faster. Distribution used to be controlled by the publisher, and now anyone with a phone is a distributor. That one change explains speed, reach and the loss of editorial gatekeeping." },
  testTip("Compare how news is published on social networks and in newspapers. (4 marks)", "\"Social media is faster.\"", "Only one side and one feature.",
    "\"Newspapers are checked by editors before printing, so they are more reliable but slower; social networks let anyone post instantly from a phone, so news is faster but may be false.\"", "Both sides, with a linking word."),
  h("Apply it: read the scenario"),
  scenario("The newspaper that went online", "A regional newspaper has closed its printed edition and now publishes only on its website and Facebook page."),
  h("Assessment practice"),
  ...L3_ext,
  h("Test-ready recap"),
  { type: "infoCards", columns: 1, cards: [
      { icon: "🔁", heading: "Compare means both sides", text: "Name a feature for traditional and for social networking, and join them with a linking word like 'whereas'.", tone: "blue" },
      { icon: "📱", heading: "Mobile devices", text: "Name the actual change, such as push notifications delivering news anywhere.", tone: "purple" },
      { icon: "🎯", heading: "Aim for", text: "At least 4/5 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ] },
  taskCallout(L3),
];

// =================== LESSON 4 ===================
const L4 = topic.lessons[3];
const L4_ext = extended(L4);
L4.estimatedMinutes = 50;
L4.blocks = [
  hook(L4),
  criteria(["State the purpose of the Copyright Act 1968.", "Describe fair dealing, private use and moral rights.", "Apply the Act to a scenario."]),
  { type: "videoSlot", title: "Copyright in 3 minutes", minutes: 3,
    brief: "A short Australian explainer on what copyright protects, what fair dealing allows and what moral rights mean. Suggested source: Australian Copyright Council or Smartcopying material for schools.",
    watchFor: ["What counts as a protected work", "The listed fair dealing purposes", "What moral rights are"] },
  h("The big idea"),
  keyTerms(L4),
  { type: "svgFigure", title: "Can I use this work?", alt: "A four-step check: is it a created work, do you have permission, is an exception met, and always credit the creator.",
    svg: copyrightFlowSvg, caption: "Work through the steps in order. Each box lights up as you go." },
  { type: "infoCards", title: "Fair dealing: the five purposes", intro: "Using a reasonable portion without permission is only allowed for these.", columns: 3, cards: [
      { icon: "📚", heading: "Research or study", text: "A short clip in a marked class assignment.", tone: "blue" },
      { icon: "📝", heading: "Criticism or review", text: "Quoting a scene to review a film.", tone: "purple" },
      { icon: "🎭", heading: "Parody or satire", text: "A sketch that mocks a song.", tone: "amber" },
      { icon: "📰", heading: "Reporting news", text: "Showing a clip in a news report.", tone: "green" },
      { icon: "⚖️", heading: "Professional advice", text: "A lawyer copying a case to advise a client.", tone: "slate" },
  ] },
  h("Allowed or not?"),
  { type: "sorter", title: "Four uses of a song", instruction: "A song by an Australian artist is used in four ways. Tap the outcome for each.",
    categories: ["Fair dealing", "Private use", "Needs permission", "Infringes"],
    items: [
      { text: "Using 20 seconds in a class video marked by your teacher.", category: 0, why: "Research or study, a reasonable portion, kept for assessment." },
      { text: "Copying a song you bought onto your own phone.", category: 1, why: "Limited copying for your own use is private use." },
      { text: "Uploading that class video to a public YouTube channel.", category: 2, why: "It is no longer for study, so it needs permission or a licence." },
      { text: "Remixing the song and posting it with your name as the creator.", category: 3, why: "It infringes copyright and the artist's moral right of attribution." },
    ] },
  { type: "flipCards", title: "Myth or fact?", instruction: "Decide if the claim is true, then flip to check.",
    cards: [
      { tag: "Myth", front: "\"It is on the internet, so it is free.\"", back: "Online works are still protected by copyright." },
      { tag: "Myth", front: "\"If I credit the creator, I can use it.\"", back: "Credit is required but it is not permission." },
      { tag: "Myth", front: "\"Under 10 seconds is always fine.\"", back: "There is no safe number of seconds. It depends on purpose and portion." },
      { tag: "Myth", front: "\"I changed it a bit, so it is mine.\"", back: "A changed work can still infringe copyright." },
    ] },
  tf("impacts-of-technology-u3-4-copyright-act-1968-tf1", "Copyright protection is automatic, so a creator does not need to register their work.", true,
    "Protection under the Copyright Act 1968 applies automatically when an original work is created."),
  mcq("impacts-of-technology-u3-4-copyright-act-1968-mcq1", "Which moral right is the right to be named as the creator?",
    ["Attribution", "Integrity", "False attribution", "Private use"], 0, "Attribution is the right to be named as creator. Integrity protects the work from harmful treatment, and false attribution stops someone else being named."),
  { type: "callout", variant: "senior-wisdom", heading: "Elara's warning", text: "Private use is much narrower than people think. It does not mean 'I did not make money' or 'I only showed my friends'. Most student infringements fail because they assumed private use covered far more than it does." },
  testTip("Explain whether fair dealing applies to a clip used in a school assignment. (2 marks)", "\"Yes, because it is only a small part.\"", "Size alone does not decide it.",
    "\"Yes. The clip is a reasonable portion used for research or study, so fair dealing applies while it is only used for assessment.\"", "Names the purpose, the portion and the limit."),
  h("Apply it: read the scenario"),
  scenario("The fundraiser T-shirt", "A student designs a T-shirt for a school fundraiser using a cartoon character copied from a website. The shirts are sold to parents."),
  h("Assessment practice"),
  ...L4_ext,
  h("Test-ready recap"),
  { type: "infoCards", columns: 1, cards: [
      { icon: "🛡️", heading: "Copyright is automatic", text: "No registration needed. Fair dealing is only for the five listed purposes.", tone: "blue" },
      { icon: "🪪", heading: "Moral rights are separate", text: "Attribution, false attribution and integrity. Do not mix them up with ownership.", tone: "purple" },
      { icon: "🎯", heading: "Aim for", text: "At least 4/5 on the practice questions. If not, reread the key terms and myths.", tone: "green" },
  ] },
  taskCallout(L4),
];

// =================== LESSON 5 ===================
const L5 = topic.lessons[4];
const L5_ext = extended(L5);
L5.estimatedMinutes = 45;
L5.blocks = [
  hook(L5),
  criteria(["Explain why IP owners must be acknowledged.", "Write a reference in one consistent technique (APA 7).", "Acknowledge images, music and video in a digital product."]),
  { type: "videoSlot", title: "APA 7 referencing in 3 minutes", minutes: 3,
    brief: "A short walk-through building one website reference and one image reference in APA 7. Suggested source: a university library APA 7 guide video, or a teacher-filmed screen recording.",
    watchFor: ["The order of the five parts", "Where the full stops and brackets go", "How a photograph reference differs from a website one"] },
  h("The big idea"),
  keyTerms(L5),
  { type: "svgFigure", title: "Anatomy of an APA 7 reference", alt: "A reference split into five coloured parts: author, year, title, source, URL.",
    svg: apaSvg, caption: "Each part lights up in turn. The order and punctuation never change." },
  { type: "sequence", title: "Build the reference", instruction: "Tap the five parts in APA 7 order.",
    items: ["Author: Smith, J.", "Year: (2026).", "Title: Phones in schools.", "Source: ABC News.", "URL: https://www.abc.net.au/news/..."],
    explanation: "Author, year, title, source, URL. A URL on its own is never a reference." },
  { type: "infoCards", title: "The same parts for each type of source", columns: 1, cards: [
      { icon: "🌐", heading: "Website", text: "Author. (Year). Title of page. Site name. URL", tone: "blue" },
      { icon: "🖼️", heading: "Image", text: "Creator. (Year). Title of image [Photograph]. Site. URL", tone: "purple" },
      { icon: "🎵", heading: "Music", text: "Artist. (Year). Title of track [Song]. Source. URL", tone: "amber" },
      { icon: "🎬", heading: "Video", text: "Creator. (Year, Month Day). Title of video [Video]. YouTube. URL", tone: "red" },
  ] },
  mcq("impacts-of-technology-u3-5-referencing-and-acknowledging-ip-mcq1", "Which of these is a correct APA 7 style reference?",
    ["Smith, J. (2026). Phones in schools. ABC News. https://www.abc.net.au/news/...", "https://www.abc.net.au/news/...", "ABC News, Phones in schools, by Smith, 2026", "Phones in schools (ABC)"], 0,
    "It has author, year, title, source and URL in the right order with the right punctuation."),
  h("Acknowledging in digital products"),
  { type: "infoCards", title: "Where to credit", columns: 2, cards: [
      { icon: "🎥", heading: "Video", text: "End credits.", tone: "red" },
      { icon: "🌐", heading: "Website", text: "A caption under each image, or a Credits page.", tone: "blue" },
      { icon: "📽️", heading: "Presentation", text: "A caption on the slide and a reference list.", tone: "purple" },
      { icon: "🎙️", heading: "Podcast", text: "Read it out and list it in the show notes.", tone: "amber" },
  ] },
  { type: "flipCards", title: "Creative Commons", instruction: "Tap each to see what you must do.",
    cards: [
      { tag: "CC BY", front: "What does CC BY require?", back: "You must credit the creator." },
      { tag: "NC", front: "What does NC mean?", back: "No commercial use. You cannot use it to make money." },
      { tag: "Check", front: "What must you do before using a free image or track?", back: "Check its licence. Free to download does not mean free of conditions." },
      { tag: "Acknowledge or reference?", front: "What is the difference?", back: "Acknowledgement can be a simple credit line. Referencing follows an exact technique like APA 7. If the question names the technique, use that format." },
    ] },
  { type: "callout", variant: "senior-wisdom", heading: "Elara's rule", text: "Acknowledgement and referencing are not interchangeable terms in a marking key. If the question names the technique, you must use that exact format." },
  testTip("Write a reference for the source. (2 marks)", "\"https://www.abc.net.au/news/...\"", "No author, date or title. Earns 0.",
    "\"Smith, J. (2026). Phones in schools. ABC News. https://www.abc.net.au/news/...\"", "Author, year, title, site, URL."),
  h("Apply it: read the scenario"),
  scenario("The student video", "A student's video uses a photo by Maya Lee called \"Busselton Jetty at dawn\" from Unsplash (2024) and a music track \"Morning Tide\" by Coastline Audio (2023) from Pixabay."),
  h("Assessment practice"),
  ...L5_ext,
  h("Test-ready recap"),
  { type: "infoCards", columns: 1, cards: [
      { icon: "🔢", heading: "Five parts, one order", text: "Author, year, title, source, URL, with consistent punctuation.", tone: "blue" },
      { icon: "🎼", heading: "Acknowledge every type", text: "Images, music and video each need credit in the right place for the product.", tone: "purple" },
      { icon: "🎯", heading: "Aim for", text: "At least 3/4 on the practice questions. If not, reread the key terms and test tip.", tone: "green" },
  ] },
  taskCallout(L5),
];

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log("Rebuilt", topic.lessons.map((l) => `${l.id}: ${l.blocks.length} blocks`).join("\n"));
