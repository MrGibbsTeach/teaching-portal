// Rebuilds Y12 AIT General Unit 4 "Application Skills" (5) and "Project Management" (4). Safe to re-run.
import fs from "node:fs";
import { h, video, assemble, flip, sorter, seq, branch, fig, stepsSvg, twoPanelSvg, standardRecap, reducedMotion } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const unit = course.units.find((u) => u.id === "unit4");
const [A1, A2, A3, A4, A5] = unit.topics.find((t) => t.id === "application-skills-u4").lessons;
const [P1, P2, P3, P4] = unit.topics.find((t) => t.id === "project-management-u4").lessons;
const build = (l, mins, parts) => { l.estimatedMinutes = mins; l.blocks = assemble(l, parts); };
const table = (l, i = 0) => l.blocks.filter((b) => b.type === "table")[i];
const recapOf = (a, b, c) => standardRecap(a, b, c);

const mapSvg = `<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif"><style>.nm-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}.nm-t{font-size:13px;font-weight:700;fill:#0f172a}.nm-l{stroke:#94a3b8;stroke-width:3;fill:none}.nm-h{stroke:#2563eb;stroke-width:4;fill:none;stroke-dasharray:8 6;animation:nm-d 1.8s linear infinite}@keyframes nm-d{to{stroke-dashoffset:-28}}.nm-s{font-size:11px;fill:#475569}${reducedMotion}</style>
<path class="nm-l" d="M340 62 L140 120 M340 62 L340 120 M340 62 L540 120"/><path class="nm-h" d="M340 62 L140 120 L140 178"/>
<rect class="nm-b" x="270" y="20" width="140" height="42" rx="12" fill="#dbeafe"/><text x="340" y="46" text-anchor="middle" class="nm-t">Level 1: Home</text>
<rect class="nm-b" x="70" y="120" width="140" height="42" rx="12"/><text x="140" y="146" text-anchor="middle" class="nm-t">Campsites</text>
<rect class="nm-b" x="270" y="120" width="140" height="42" rx="12"/><text x="340" y="146" text-anchor="middle" class="nm-t">Bookings</text>
<rect class="nm-b" x="470" y="120" width="140" height="42" rx="12"/><text x="540" y="146" text-anchor="middle" class="nm-t">Help</text>
<rect class="nm-b" x="70" y="178" width="140" height="42" rx="12"/><text x="140" y="204" text-anchor="middle" class="nm-t">Campsite page</text>
<text x="226" y="205" class="nm-s">Book now links to Bookings</text></svg>`;
const ganttSvg = `<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif"><style>.gn-t{font-size:12.5px;font-weight:700;fill:#0f172a}.gn-s{font-size:11px;fill:#475569}.gn-b{transform-box:view-box;animation:gn-g 8s ease-out infinite}.gn-2{animation-delay:.6s}.gn-3{animation-delay:1.2s}.gn-4{animation-delay:1.8s}@keyframes gn-g{0%{transform:scaleX(.02)}25%,90%{transform:scaleX(1)}100%{transform:scaleX(.02)}}${reducedMotion}</style>
<text x="170" y="22" class="gn-s">Week 1</text><text x="290" y="22" class="gn-s">Week 2</text><text x="410" y="22" class="gn-s">Week 3</text><text x="530" y="22" class="gn-s">Week 4</text>
<line x1="165" y1="30" x2="165" y2="205" stroke="#e2e8f0"/><line x1="285" y1="30" x2="285" y2="205" stroke="#e2e8f0"/><line x1="405" y1="30" x2="405" y2="205" stroke="#e2e8f0"/><line x1="525" y1="30" x2="525" y2="205" stroke="#e2e8f0"/>
<text x="8" y="58" class="gn-t">Research</text><rect class="gn-b" style="transform-origin:165px 0" x="165" y="42" width="110" height="24" rx="6" fill="#2563eb"/>
<text x="8" y="98" class="gn-t">Script and plan</text><rect class="gn-b gn-2" style="transform-origin:245px 0" x="245" y="82" width="140" height="24" rx="6" fill="#16a34a"/>
<text x="8" y="138" class="gn-t">Filming</text><rect class="gn-b gn-3" style="transform-origin:345px 0" x="345" y="122" width="140" height="24" rx="6" fill="#d97706"/>
<text x="8" y="178" class="gn-t">Editing</text><rect class="gn-b gn-4" style="transform-origin:445px 0" x="445" y="162" width="100" height="24" rx="6" fill="#9333ea"/>
<rect x="555" y="30" width="110" height="175" rx="8" fill="#fef9c3" opacity=".7"/><text x="610" y="118" text-anchor="middle" class="gn-t">Buffer time</text></svg>`;

// ===== Application skills =====
build(A1, 45, ["hook", "criteria",
  video("Working together online", 4, "A short clip showing three students co-authoring a document, chatting in Teams and leaving comments. Suggested source: a teacher-filmed screen recording using school Microsoft 365.", ["Who is editing at the same time", "Where comments appear", "How version history shows changes"]),
  h("The big idea"), table(A1),
  fig("Advantages and disadvantages", "Two panels comparing advantages and disadvantages of online collaboration.", twoPanelSvg({ t: "Advantages", fill: "#dcfce7", lines: ["Work from anywhere, any time", "Everyone sees the latest version", "Changes are tracked", "Less travel and printing"] }, { t: "Disadvantages", fill: "#fee2e2", lines: ["Needs a reliable internet connection", "Easy to overwrite others' work", "Messages can be misunderstood", "Some members may not contribute"] }, "both sides"), "Give both sides in an answer."),
  sorter("Which type of collaboration?", "A formal committee uses different tools. Tap the type.", ["Shared document", "Chat", "Video call", "Comments"], [
    { text: "A budget sheet everyone edits so there is one current version.", category: 0, why: "Co-authoring a shared document." },
    { text: "Quick questions about the venue in a Teams channel.", category: 1, why: "Instant messaging and chat." },
    { text: "A weekly 15-minute meeting because members are in different classes.", category: 2, why: "Video conferencing." },
    { text: "The teacher suggests changes to the theme proposal without emailing a new file.", category: 3, why: "Comments and version history." } ]),
  branch("The group video", "Three students make a group video. One edits, one writes the script, one finds music. They live in different towns.", [
    { situation: "Which two types of collaboration would suit them?", prompt: "Pick the best answer.", choices: [
      { text: "Video conferencing to plan together, and cloud file sharing so the editor always has the latest script and music.", correct: true, feedback: "Two types, each linked to what they are doing." },
      { text: "Email attachments only.", correct: false, feedback: "That creates many copies and confusion." },
      { text: "No collaboration, they work separately.", correct: false, feedback: "They need to share files and plans." } ] },
    { situation: "What is one disadvantage for the group?", prompt: "Pick the best answer.", choices: [
      { text: "Without version control one student could overwrite another's work, such as the script.", correct: true, feedback: "A real disadvantage linked to the group." },
      { text: "It is too fast.", correct: false, feedback: "Not a disadvantage." },
      { text: "Collaboration is illegal.", correct: false, feedback: "Not true." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Name the type", "Shared document, chat, video call or comments, linked to the task."], ["Include a downside", "Overwriting work or a poor connection, tied to the group."], "At least 4/6 on the practice questions."), "last"]);

const cafeEx = { type: "codeExercise", skillId: "application-skills-u4-web", title: "Practice: style the cafe page", brief: "Edit the CSS so the heading colour is #7c2d12 and every link is #b45309. Then add a third link in the nav that opens an email (a mailto: link). Press Check my work.",
  starterHtml: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Seaside Cafe</title>\n</head>\n<body>\n  <h1>Seaside Cafe</h1>\n  <nav>\n    <a href=\"menu.html\">Menu</a>\n    <a href=\"contact.html\">Contact</a>\n  </nav>\n  <p>Fresh coffee by the beach.</p>\n</body>\n</html>",
  starterCss: "body { font-family: sans-serif; padding: 20px; }\nh1 { color: #1e3a8a; }\na { color: #2563eb; margin-right: 12px; }",
  tests: [
    { type: "style", selector: "h1", property: "color", value: "#7c2d12", description: "The heading (h1) colour is #7c2d12" },
    { type: "style", selector: "a", property: "color", value: "#b45309", description: "The link colour is #b45309" },
    { type: "count", selector: "nav a", min: 3, description: "The nav has at least three links" },
    { type: "attr", selector: "nav a[href^=\"mailto:\"]", name: "href", contains: "mailto:", description: "One link is a mailto: link" } ] };
build(A2, 50, ["hook", "criteria",
  video("HTML and CSS together", 4, "A short clip building a three-page cafe site with one shared stylesheet and changing the brand colour once. Suggested source: a teacher-filmed screen recording in VS Code or a browser editor.", ["What goes in the HTML file", "What goes in the CSS file", "How one change updates every page"]),
  h("The big idea"), "keyTerms",
  fig("HTML or CSS?", "Two panels: HTML holds what is on the page, CSS controls how it looks.", twoPanelSvg({ t: "HTML: what is on the page", fill: "#dbeafe", lines: ["Headings and paragraphs", "Images and alt text", "Hyperlinks", "Lists and tables"] }, { t: "CSS: how it looks", fill: "#fef3c7", lines: ["Brand colour set once", "Consistent fonts and spacing", "Layouts for phones and laptops", "Smaller files, faster loading"] }, "content and style kept separate"), "A .css file styles every page that links to it."),
  sorter("HTML or CSS?", "Which file does each job belong to?", ["HTML", "CSS"], [
    { text: "Adds a heading and a paragraph.", category: 0, why: "Content and structure." },
    { text: "Changes the brand colour on all five pages at once.", category: 1, why: "One stylesheet controls every page." },
    { text: "Adds an image with alt text.", category: 0, why: "Images and alt text are content." },
    { text: "Sets fonts and spacing for unity.", category: 1, why: "Appearance is CSS." },
    { text: "Adds a hyperlink to another page.", category: 0, why: "Links are part of the page content." },
    { text: "Changes the layout for phones.", category: 1, why: "Layout rules are CSS." } ]),
  cafeEx, "interactive",
  branch("The netball club site", "A student builds a five-page website for a netball club. Each page has its colours and fonts set inside the HTML, and the club now wants to change its brand colour.", [
    { situation: "Why is the change slow?", prompt: "How would a .css file have made it easier?", choices: [
      { text: "Colours set once in a shared .css file would update all five pages with a single edit.", correct: true, feedback: "It names the file and the effect." },
      { text: "A .css file makes images bigger.", correct: false, feedback: "Not what it does." },
      { text: "It would not have helped.", correct: false, feedback: "It would have helped a lot." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["HTML is content, CSS is style", "Keep them separate so one change updates every page."], ["Know your hyperlinks", "Page links, email (mailto:) and external links."], "At least 4/6 on the practice questions."), "last"]);

build(A3, 45, ["hook", "criteria",
  video("Drawing a navigation map", 4, "A short clip drawing a navigation map for a camping app on paper: boxes for screens, arrows for links, every link labelled. Suggested source: a teacher-filmed whiteboard demo.", ["Which screens link to which", "What the arrows show", "How to label each link"]),
  h("The big idea"), "keyTerms",
  fig("A camping app map", "A hierarchical map: Home links to Campsites, Bookings and Help; a campsite page links to Bookings.", mapSvg, "Level 1 is Home. Level 2 screens link from Home and a bottom menu. The dashed path shows a user going Home, Campsites, a campsite page."),
  table(A3),
  sorter("Which structure?", "Tap the structure each description fits.", ["Linear", "Hierarchical", "Networked"], [
    { text: "Pages follow one after another in a set order with Next and Back.", category: 0, why: "A fixed order is linear." },
    { text: "Pages branch from a home page into sections, like a family tree.", category: 1, why: "Hierarchical." },
    { text: "Pages link to many other pages, not in a fixed order.", category: 2, why: "Networked." },
    { text: "A slideshow that is only ever viewed from first slide to last.", category: 0, why: "Linear." },
    { text: "A zoo guide where every page links back to the Cover, and Animals links to Map.", category: 1, why: "Everything branches from the Cover, so it is hierarchical." } ]),
  branch("The zoo guide", "A five-page interactive PDF for a local zoo has Cover, Animals, Opening hours, Map and Contact. Every page links back to the Cover. Animals links to Map.", [
    { situation: "Identify the structure and justify it.", prompt: "Pick the best answer.", choices: [
      { text: "Hierarchical: the Cover is the home page with sections branching from it, so visitors can always get back to the start and jump to what they need.", correct: true, feedback: "It names the structure and links it to the guide's use." },
      { text: "Linear, because it has five pages.", correct: false, feedback: "Page count does not make it linear." },
      { text: "It has no structure.", correct: false, feedback: "Every product has one." } ] },
    { situation: "What must your map show?", prompt: "Pick the best answer.", choices: [
      { text: "Every page as a box, the links as lines with arrows for direction, and each link labelled.", correct: true, feedback: "Pages, links and direction, labelled." },
      { text: "Only the cover.", correct: false, feedback: "A map shows every page." },
      { text: "Colours and fonts.", correct: false, feedback: "That is design, not navigation." } ] } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Name the structure", "Linear, hierarchical or networked, and why it suits the product."], ["Show every link", "Boxes for screens, labelled arrows for links."], "At least 4/5 on the practice questions."), "last"]);

build(A4, 45, ["hook", "criteria",
  video("One page, three screens", 4, "A short clip resizing a browser window to show a page change from three columns to one with a hamburger menu. Suggested source: a teacher-filmed screen recording using the browser's responsive mode.", ["When the layout changes", "What stays the same", "How the menu collapses"]),
  h("The big idea"), "keyTerms",
  fig("The same home page on three devices", "Three steps: desktop with three columns, tablet with two, phone with one column and a hamburger menu.", stepsSvg([{ t: "Desktop", s: "Three columns, full menu" }, { t: "Tablet", s: "Two columns, menu visible" }, { t: "Phone", s: "One column, hamburger menu, big buttons" }], { numbered: false }), "Content, colours and fonts stay the same."),
  sorter("Match the term", "Which responsive design term does each description fit?", ["Fluid grid", "Flexible images", "Breakpoint", "Hamburger menu"], [
    { text: "Columns sized in percentages so they stretch or shrink.", category: 0, why: "A fluid grid." },
    { text: "Pictures that scale down to fit the screen width.", category: 1, why: "Flexible images." },
    { text: "The screen width where three columns become one.", category: 2, why: "A breakpoint." },
    { text: "A three-line icon that opens the menu on small screens.", category: 3, why: "A hamburger menu." } ]),
  sorter("Who benefits?", "Is each benefit for users or for the business?", ["Users", "Business"], [
    { text: "No pinching and zooming.", category: 0, why: "A better experience for the user." },
    { text: "One site to maintain, not two.", category: 1, why: "A saving for the business." },
    { text: "Buttons are easy to tap.", category: 0, why: "A user benefit." },
    { text: "Search engines rank mobile-friendly sites higher.", category: 1, why: "A business benefit." } ]),
  branch("The cafe website", "A cafe website shows a wide menu table and small buttons. On a phone, customers have to zoom in and scroll sideways.", [
    { situation: "Which two changes would fix it?", prompt: "Pick the best answer.", choices: [
      { text: "Use a fluid layout so the menu stacks into one column on phones, and make the buttons larger so they are easy to tap.", correct: true, feedback: "Two specific responsive changes tied to the problems." },
      { text: "Make the site wider.", correct: false, feedback: "That makes scrolling worse." },
      { text: "Remove the menu.", correct: false, feedback: "Customers need it." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Define it", "Layout adjusts automatically to the screen size and device."], ["Name specific changes", "One column, hamburger menu, larger buttons, flexible images."], "At least 4/6 on the practice questions."), "last"]);

build(A5, 45, ["hook", "criteria",
  video("Frames, keyframes and tweens", 4, "A short clip animating a ball in two ways, frame by frame and with a motion tween, and adding a Play button. Suggested source: a teacher-filmed screen recording in Animate or a free tool such as Pencil2D.", ["How many frames per second", "What the software fills in", "What a button's states do"]),
  h("The big idea"), "keyTerms",
  fig("A motion tween", "Three steps: set the start keyframe, set the end keyframe, the software fills the frames between.", stepsSvg([{ t: "Start keyframe", s: "Logo off-screen on the left" }, { t: "End keyframe", s: "Logo in the centre, fully visible" }, { t: "Tween", s: "The software makes every frame between" }], { numbered: false }), "The logo slides in and fades in without drawing each frame."),
  table(A5),
  sorter("Frame by frame or tween?", "Which method does each description fit?", ["Frame by frame", "Tween"], [
    { text: "Draw the ball in 24 positions for one second at 24 fps.", category: 0, why: "Every frame is made by hand." },
    { text: "Set start and end keyframes and let the software fill the frames between.", category: 1, why: "That is tweening." },
    { text: "Detailed control, such as squash and stretch, but slow to make.", category: 0, why: "More control, more time." },
    { text: "Changing the ball into a star over 12 frames.", category: 1, why: "A shape tween." } ]),
  seq("Build the title animation", "Tap the steps in a sensible order.", ["Place the logo off-screen at the start keyframe.", "Set the end keyframe with the logo in the centre.", "Add a motion tween between the keyframes.", "Add a fade-in effect, then a Watch now button that appears at the end."], "Keyframes first, then the tween, then the button."),
  branch("The animated title", "A student makes an animated title for a school video: the school logo slides in from the left and fades in, then a Watch now button appears.", [
    { situation: "How could a tween create the logo movement?", prompt: "Pick the best answer.", choices: [
      { text: "Set a start keyframe with the logo off-screen and an end keyframe in the centre, then add a motion tween so the software creates the frames between.", correct: true, feedback: "Keyframes plus tween." },
      { text: "Draw all 48 frames by hand.", correct: false, feedback: "That is frame by frame, not a tween." },
      { text: "Add a button.", correct: false, feedback: "That does not move the logo." } ] },
    { situation: "What is the purpose of the button and its states?", prompt: "Pick the best answer.", choices: [
      { text: "A button responds to the user and triggers an action; its up, over and down states show it reacts when idle, hovered and pressed.", correct: true, feedback: "Purpose and states." },
      { text: "It makes the animation longer.", correct: false, feedback: "Not its purpose." },
      { text: "It sets the frame rate.", correct: false, feedback: "Not its purpose." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Keyframes and tweens", "Set keyframes, let the software tween the frames between."], ["Name the button states", "Up, over and down."], "At least 4/5 on the practice questions."), "last"]);

// ===== Project management =====
build(P1, 45, ["hook", "criteria",
  video("Writing a plan of action", 4, "A short clip building a plan of action table for a band website: tasks, time, resources, who is responsible, due date. Suggested source: a teacher-filmed screen recording in Word or Excel.", ["The columns in a good plan", "How tasks are ordered", "Where milestones fit"]),
  h("The big idea"), "keyTerms", table(P1),
  fig("A four-week plan", "Four weeks of tasks for a band website, ending in publish.", stepsSvg([{ t: "Week 1", s: "Interview band, research, navigation map" }, { t: "Week 2", s: "Wireframes, band approves design (milestone)" }, { t: "Week 3", s: "Build the pages" }, { t: "Week 4", s: "Test, feedback, publish" }]), "Each task has time, resources and a person responsible."),
  sorter("Part of a plan, or not?", "Which of these belong in each row of a plan of action?", ["Belongs in a row", "Does not belong"], [
    { text: "Time allocated, such as 2 hrs.", category: 0, why: "Each task needs a time allocation." },
    { text: "Resources, such as paper or a laptop.", category: 0, why: "Resources are listed per task." },
    { text: "A favourite colour.", category: 1, why: "Not part of a plan of action." },
    { text: "Who is responsible.", category: 0, why: "Every task needs an owner." },
    { text: "Due date.", category: 0, why: "A deadline for each task." },
    { text: "A long description of the band's history.", category: 1, why: "That belongs in research, not the plan." } ]),
  seq("Order the band website tasks", "Tap the tasks in a sensible order.", ["Interview the band.", "Draw wireframes for three pages.", "Band approves the design (milestone).", "Build the pages."], "Approval comes before building, because the build depends on it."),
  branch("The school musical program", "A student has three weeks to design and print a program for the school musical. The drama teacher must approve the design before printing.", [
    { situation: "Which three tasks, in order, belong in her plan?", prompt: "Pick the best answer.", choices: [
      { text: "Design the program (4 hrs, laptop, Canva), teacher approves (milestone), print and check (2 hrs, school printer).", correct: true, feedback: "Ordered, with time and resources, and approval before printing." },
      { text: "Print, design, approve.", correct: false, feedback: "Wrong order." },
      { text: "Design only.", correct: false, feedback: "A plan lists every task." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Every row", "Task, time allocated, resources, who is responsible, due date."], ["Order matters", "Dependencies and milestones decide the order."], "At least 4/5 on the practice questions."), "last"]);

build(P2, 45, ["hook", "criteria",
  video("Rescuing a late project", 4, "A short clip turning a messy to-do list into a Gantt chart with milestones and a buffer. Suggested source: a teacher-filmed screen recording in Excel or a free Gantt tool.", ["How overlaps show on a Gantt chart", "Where the buffer goes", "How time blocking works"]),
  h("The big idea"), "keyTerms",
  fig("A Gantt chart", "Four tasks as bars across four weeks, with buffer time at the end.", ganttSvg, "Bars show each task against time. The yellow zone is buffer time."),
  sorter("Which strategy?", "Which time management strategy does each example show?", ["Prioritising", "Milestones", "Time blocking", "Buffer time"], [
    { text: "Do the logo first, because the business cards depend on it.", category: 0, why: "Most important or urgent first." },
    { text: "Logo sketches by Tuesday, client approval Wednesday.", category: 1, why: "Checkpoints with dates." },
    { text: "Two hours every morning with notifications off.", category: 2, why: "Fixed time slots for a task." },
    { text: "Keep Friday afternoon free for client changes.", category: 3, why: "Extra time for problems." } ]),
  sorter("Time waster or fix?", "Sort each item.", ["Time waster", "Fix"], [
    { text: "Starting with the fun task.", category: 0, why: "Avoids the important work." },
    { text: "Prioritise by dependency and deadline.", category: 1, why: "A fix." },
    { text: "Waiting until the night before.", category: 0, why: "Leaves no room for problems." },
    { text: "Check the brief and get approval early.", category: 1, why: "Avoids redoing work." } ]),
  branch("The late documentary", "Two students are making a five-minute documentary for a local museum in four weeks. They keep running out of class time and have not started editing.", [
    { situation: "Which two strategies would help?", prompt: "Pick the best answer.", choices: [
      { text: "Set milestones with dates (script, filming, editing) and block fixed time for editing, so progress is checked and editing is not left to the end.", correct: true, feedback: "Two strategies linked to the problem." },
      { text: "Work harder.", correct: false, feedback: "Not a strategy." },
      { text: "Ask for more time.", correct: false, feedback: "It does not fix the planning." } ] },
    { situation: "Why include buffer time?", prompt: "Pick the best answer.", choices: [
      { text: "Problems and changes are likely, such as a failed recording, so spare time before the deadline stops one setback making the project late.", correct: true, feedback: "It explains the purpose." },
      { text: "So they can finish early and stop.", correct: false, feedback: "Not the purpose." },
      { text: "It is not needed.", correct: false, feedback: "Plans without buffer break easily." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Name the strategy", "Prioritising, milestones, time blocking or buffer time."], ["Link it to the project", "Say how it fixes this team's problem."], "At least 4/6 on the practice questions."), "last"]);

build(P3, 45, ["hook", "criteria",
  video("Planning your resources", 3, "A short clip listing the hardware, software and people for a podcast, then booking equipment and backing up files. Suggested source: a teacher-filmed example using library equipment booking.", ["The three resource types", "How equipment is booked", "Where files are backed up"]),
  h("The big idea"), "keyTerms",
  fig("Podcast resources", "Three panels: hardware, software and people for a three-episode podcast.", stepsSvg([{ t: "Hardware", s: "Laptop, USB microphone, headphones" }, { t: "Software", s: "Audacity, OneDrive backup" }, { t: "People", s: "Three past students, teacher approval" }, { t: "Managing", s: "Book early, back up after each session" }], { numbered: false }), "A student makes a three-episode podcast interviewing past students."),
  sorter("Which resource type?", "Hardware, software or people?", ["Hardware", "Software", "People"], [
    { text: "USB microphone booked from the library.", category: 0, why: "Physical equipment." },
    { text: "Audacity and a OneDrive backup.", category: 1, why: "Programs and services." },
    { text: "A park ranger who gives feedback.", category: 2, why: "A person involved." },
    { text: "A camera for trail photos.", category: 0, why: "Physical equipment." },
    { text: "InDesign.", category: 1, why: "A program with a licence." } ]),
  sorter("Match the management strategy", "Which strategy deals with each problem?", ["Book early, confirm the day before", "Check licences at the start", "Have a back-up person", "Save to the cloud after every session"], [
    { text: "The booked camera is already taken.", category: 0, why: "Booking early and confirming avoids clashes." },
    { text: "A software licence has expired.", category: 1, why: "Check licences at the start." },
    { text: "An interviewee cancels.", category: 2, why: "A back-up interviewee covers it." },
    { text: "The laptop fails and there is no backup.", category: 3, why: "Cloud backup prevents data loss." } ]),
  "interactive",
  branch("The walking trails guide", "A student is creating an interactive PDF guide to local walking trails. She needs photos of each trail, InDesign, and feedback from a park ranger.", [
    { situation: "Identify one hardware, one software and one people resource.", prompt: "Pick the best answer.", choices: [
      { text: "Hardware: a camera. Software: InDesign. People: the park ranger.", correct: true, feedback: "One of each, from the scenario." },
      { text: "Hardware: the trail. Software: the ranger. People: InDesign.", correct: false, feedback: "The types are mixed up." },
      { text: "Hardware: a camera, and nothing else.", correct: false, feedback: "The question asks for one of each." } ] },
    { situation: "How could two resources be managed?", prompt: "Pick the best answer.", choices: [
      { text: "Book the camera a week ahead and confirm the day before, and ask the ranger for a feedback date at the start.", correct: true, feedback: "Two resources, each with a management strategy." },
      { text: "Hope they are available.", correct: false, feedback: "That is not management." },
      { text: "Buy everything new.", correct: false, feedback: "Not always possible or needed." } ] } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Three resource types", "Hardware, software and people, plus money and materials."], ["Manage them", "Book, track and back up so they are there when needed."], "At least 5/7 on the practice questions."), "last"]);

build(P4, 45, ["hook", "criteria",
  video("Evaluating a finished product", 4, "A short clip reading survey results and client feedback and turning them into a recommendation. Suggested source: a teacher-filmed example using the community garden newsletter.", ["How survey results are read", "How evidence is matched to criteria", "What a recommendation looks like"]),
  h("The big idea"), "keyTerms", table(P4),
  fig("The evaluation cycle", "Four steps: survey, client feedback, self-reflection, then a recommendation.", stepsSvg([{ t: "Survey", s: "12 members, rating scales and open questions" }, { t: "Client feedback", s: "Written comments on the brief" }, { t: "Self-reflection", s: "Check each design criterion" }, { t: "Recommendation", s: "A specific change for next time" }]), "Evidence first, then a specific recommendation."),
  sorter("Product or process evaluation?", "Which kind of evaluation does each finding belong to?", ["Product evaluation", "Process evaluation"], [
    { text: "5 members said the text was too small on phones.", category: 0, why: "It judges the finished product." },
    { text: "Photos took a week longer than planned.", category: 1, why: "It judges how the project was managed." },
    { text: "The working-bee date was missing from page 1.", category: 0, why: "A gap in the finished product." },
    { text: "The plan of action allowed one week for photos but it took two.", category: 1, why: "A planning and time issue." },
    { text: "The layout met the grid criterion.", category: 0, why: "A product criterion." } ]),
  branch("The restaurant menu", "A student built an interactive PDF menu for a restaurant. The plan of action allowed one week for photos, but it took two weeks.", [
    { situation: "Which two tools could gather evidence?", prompt: "Pick the best answer.", choices: [
      { text: "A user survey with rating scales, and written client feedback against the brief.", correct: true, feedback: "Two evidence tools." },
      { text: "A guess.", correct: false, feedback: "Not evidence." },
      { text: "Asking nobody.", correct: false, feedback: "Evaluation needs evidence." } ] },
    { situation: "Recommend one change to the plan of action and justify it.", prompt: "Pick the best answer.", choices: [
      { text: "Allow two weeks for photos and add buffer time, because photos took twice as long as planned and delays stopped the later tasks.", correct: true, feedback: "A specific change justified by the evidence." },
      { text: "Do better next time.", correct: false, feedback: "Not specific." },
      { text: "Skip the photos.", correct: false, feedback: "That would weaken the menu." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  recapOf(["Evidence, then recommendation", "Survey, client feedback and self-reflection support a specific change."], ["Judge product and process", "Did it meet the brief, and was it managed well?"], "At least 5/7 on the practice questions."), "last"]);

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log("done");
