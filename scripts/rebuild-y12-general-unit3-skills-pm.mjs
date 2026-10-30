// Rebuilds Y12 AIT General Unit 3 "Application Skills" (7) and "Project Management" (4). Safe to re-run.
import fs from "node:fs";
import { h, video, assemble, flip, sorter, seq, branch, fig, fileSizeLab, stepsSvg, twoPanelSvg, standardRecap, reducedMotion } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const unit = course.units.find((u) => u.id === "unit3");
const [A1, A2, A3, A4, A5, A6, A7] = unit.topics.find((t) => t.id === "application-skills-u3").lessons;
const [P1, P2, P3, P4] = unit.topics.find((t) => t.id === "project-management-u3").lessons;
const build = (l, mins, parts) => { l.estimatedMinutes = mins; l.blocks = assemble(l, parts); };
const table = (l, i = 0) => l.blocks.filter((b) => b.type === "table")[i];
const R = standardRecap;

const treeSvg = `<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif"><style>.tr-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2}.tr-t{font-size:12.5px;font-weight:700;fill:#0f172a}.tr-l{stroke:#94a3b8;stroke-width:2.5;fill:none}.tr-h{stroke:#2563eb;stroke-width:4;fill:none;stroke-dasharray:8 6;animation:tr-d 1.8s linear infinite}@keyframes tr-d{to{stroke-dashoffset:-28}}${reducedMotion}</style>
<rect class="tr-b" x="8" y="14" width="80" height="34" rx="9"/><text x="48" y="36" text-anchor="middle" class="tr-t">2027</text>
<rect class="tr-b" x="130" y="14" width="90" height="34" rx="9"/><text x="175" y="36" text-anchor="middle" class="tr-t">Clients</text>
<rect class="tr-b" x="262" y="14" width="140" height="34" rx="9" fill="#dbeafe"/><text x="332" y="36" text-anchor="middle" class="tr-t">Smith_Wedding</text>
<path class="tr-l" d="M88 31h42M220 31h42"/>
<path class="tr-l" d="M332 48v30M120 78h424M120 78v30M232 78v30M344 78v30M456 78v30M568 78v30"/>
<path class="tr-h" d="M332 48v30M120 78h424M456 78v30"/>
<rect class="tr-b" x="70" y="108" width="100" height="34" rx="9"/><text x="120" y="130" text-anchor="middle" class="tr-t">Footage</text>
<rect class="tr-b" x="182" y="108" width="100" height="34" rx="9"/><text x="232" y="130" text-anchor="middle" class="tr-t">Audio</text>
<rect class="tr-b" x="294" y="108" width="100" height="34" rx="9"/><text x="344" y="130" text-anchor="middle" class="tr-t">Graphics</text>
<rect class="tr-b" x="406" y="108" width="100" height="34" rx="9" fill="#dcfce7"/><text x="456" y="130" text-anchor="middle" class="tr-t">Exports</text>
<rect class="tr-b" x="518" y="108" width="100" height="34" rx="9"/><text x="568" y="130" text-anchor="middle" class="tr-t">Project</text>
<text x="20" y="190" class="tr-t">Smith_Ceremony_Cam1_001.mp4</text><text x="20" y="212" class="tr-t">Smith_Final_v02.mp4</text></svg>`;

// ===== Application skills (Unit 3) =====
build(A1, 45, ["hook", "criteria",
  video("A folder structure that works", 3, "A short clip building a client folder structure and applying a file naming convention to a set of clips. Suggested source: a teacher-filmed screen recording in File Explorer.", ["How folders are nested", "How file names sort", "What a version number does"]),
  h("The big idea"), "keyTerms",
  fig("A wedding videographer's folders", "A folder tree: 2027, Clients, Smith_Wedding, then Footage, Audio, Graphics, Exports and Project.", treeSvg, "Any editor can find a clip in seconds, and old versions are not overwritten."),
  sorter("Do or avoid?", "Which practice belongs in good file naming?", ["Do", "Avoid"], [
    { text: "Start with the project or client name.", category: 0, why: "Groups files by project." },
    { text: "final, final2, final_REAL", category: 1, why: "Says nothing about order." },
    { text: "Use underscores, not spaces.", category: 0, why: "Safer across systems." },
    { text: "Special characters like / \\ : * ? \" |", category: 1, why: "They can break file names." },
    { text: "Dates as YYYY-MM-DD.", category: 0, why: "They sort in order." },
    { text: "Saving everything on the desktop.", category: 1, why: "Nothing is organised or backed up." } ]),
  branch("The real estate agency", "A small real estate agency saves property photos, contracts and floor plans for 50 houses on one shared drive with no folders.", [
    { situation: "Describe a folder structure they could use.", prompt: "Pick the best answer.", choices: [
      { text: "A folder for each property, with subfolders for Photos, Contracts and Floor plans, so everything for a house is together.", correct: true, feedback: "A clear hierarchy matched to the agency." },
      { text: "One big folder called Stuff.", correct: false, feedback: "That is the problem." },
      { text: "Folders named by file type only, mixing all 50 houses.", correct: false, feedback: "Hard to find a single house's files." } ] },
    { situation: "Explain a benefit of a naming convention.", prompt: "Pick the best answer.", choices: [
      { text: "Staff can find a property's files quickly, and version numbers stop old contracts being mistaken for current ones.", correct: true, feedback: "Two benefits linked to the agency." },
      { text: "Files look pretty.", correct: false, feedback: "Not a real benefit." },
      { text: "It uses less storage.", correct: false, feedback: "Naming does not change size." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Logical folders", "Group related files in a hierarchy."], ["Consistent names", "Client or project first, version number, date as YYYY-MM-DD."], "At least 4/6 on the practice questions."), "last"]);

build(A2, 45, ["hook", "criteria",
  video("Choosing a file format", 4, "A short clip exporting a logo as SVG, PNG and JPEG and an audio clip as WAV and MP3, comparing size and quality. Suggested source: a teacher-filmed screen recording.", ["What happens when a raster image is enlarged", "Which formats keep transparency", "Why MP3 is smaller than WAV"]),
  h("The big idea"), table(A2, 0),
  fig("Raster or vector?", "Two panels: raster graphics are made of pixels and blur when enlarged, vector graphics use shapes and stay sharp.", twoPanelSvg({ t: "Raster (JPEG, PNG, GIF)", fill: "#fee2e2", lines: ["Made of pixels", "Blurry when enlarged", "Best for photos"] }, { t: "Vector (SVG)", fill: "#dcfce7", lines: ["Made of shapes and paths", "Sharp at any size", "Best for logos"] }, "scale it up and see"), "Choose by what the file is used for."),
  table(A2, 1),
  fileSizeLab({ title: "File size lab: JPEG against PNG", width: 3000, height: 2000, useCase: "website" }),
  sorter("Which format?", "A food truck needs files for its menu, logo, website and radio ad. Tap the best format.", ["SVG", "JPEG", "PNG", "WAV", "MP3"], [
    { text: "The logo that must print sharply on the truck and on a tiny website icon.", category: 0, why: "Vector, so it stays sharp at any size." },
    { text: "Food photos for the website where small files matter.", category: 1, why: "JPEG gives small photo files." },
    { text: "The logo placed on top of a photo with a transparent background.", category: 2, why: "PNG supports transparency." },
    { text: "The radio ad while it is being edited, at full quality.", category: 3, why: "WAV is uncompressed." },
    { text: "The radio ad file emailed to the station.", category: 4, why: "MP3 is compressed and smaller." } ]),
  "interactive",
  branch("The graduation podcast", "A school is producing a podcast and a website for its Year 12 graduation.", [
    { situation: "Compare vector and raster for the graduation logo.", prompt: "Pick the best answer.", choices: [
      { text: "A vector logo is made of shapes so it stays sharp at any size, while a raster logo is pixels and blurs when enlarged, but raster suits photos.", correct: true, feedback: "Both types, with a difference and a link to use." },
      { text: "They are the same.", correct: false, feedback: "They differ in how they are made and scale." },
      { text: "Raster is always better.", correct: false, feedback: "Not for logos that must scale." } ] },
    { situation: "Pick an audio format to upload the podcast to the website.", prompt: "Pick the best answer.", choices: [
      { text: "MP3, because it is compressed so the file is smaller and loads and downloads faster.", correct: true, feedback: "A format and a reason." },
      { text: "WAV, because it is the biggest.", correct: false, feedback: "Large files slow the website." },
      { text: "SVG.", correct: false, feedback: "That is a graphics format." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Match the format to the use", "SVG for logos, JPEG for photos, PNG for transparency, WAV to edit, MP3 to send."], ["Compare, do not just describe", "Name a difference and link it to the use."], "At least 4/6 on the practice questions."), "last"]);

build(A3, 45, ["hook", "criteria",
  video("Cleaning up a voiceover", 4, "A short clip in Audacity trimming a cough, reducing background hum, normalising volume, adding fades and exporting. Suggested source: a teacher-filmed screen recording.", ["How noise reduction samples the hum", "How fades are added", "Which format is exported and why"]),
  h("The big idea"), table(A3),
  fig("Voiceover workflow", "Four steps: import, edit, check, export.", stepsSvg([{ t: "Import", s: "Open or record the audio" }, { t: "Edit", s: "Trim, cut, fade, levels, noise" }, { t: "Check", s: "Listen with headphones" }, { t: "Export", s: "Format and quality for the purpose" }]), "A voiceover with a cough, a long pause and background hum."),
  seq("Put the workflow in order", "Tap the four steps in order.", ["Import: open or record the audio.", "Edit: trim, cut, fade, adjust levels and reduce noise.", "Check: listen through with headphones.", "Export: choose the format and quality for the purpose."], "Edit before you export, and always listen before you finish."),
  sorter("Which feature fixes it?", "Tap the feature that fixes each problem in the voiceover.", ["Trim and cut", "Noise reduction", "Volume and fades", "Export or convert"], [
    { text: "There is a cough in the middle.", category: 0, why: "Cut it out." },
    { text: "A long pause makes it too long for 30 seconds.", category: 0, why: "Shorten the pause by cutting." },
    { text: "Background hum runs through the whole track.", category: 1, why: "Sample the hum and remove it." },
    { text: "The voice is quiet and starts abruptly.", category: 2, why: "Normalise the volume and add a short fade." },
    { text: "The radio station needs an MP3, not a phone recording.", category: 3, why: "Convert and export to the required format." } ]),
  branch("The 60-second radio ad", "A cafe owner records a 60-second radio ad on her phone. The radio station needs an MP3 file no longer than 30 seconds.", [
    { situation: "Which two editing features should she use?", prompt: "Pick the best answer.", choices: [
      { text: "Trim and cut to shorten it to 30 seconds, and noise reduction to remove background sound from the phone recording.", correct: true, feedback: "Two features, each linked to the problem." },
      { text: "Add more music.", correct: false, feedback: "That does not shorten it." },
      { text: "Nothing, send it as is.", correct: false, feedback: "It is too long." } ] },
    { situation: "Why must she export or convert it first?", prompt: "Pick the best answer.", choices: [
      { text: "The phone saves in a different format, and the station needs an MP3, so she must export or convert it to that format.", correct: true, feedback: "Format mismatch explained." },
      { text: "Exporting makes it louder.", correct: false, feedback: "Not the reason." },
      { text: "It is not necessary.", correct: false, feedback: "The station needs MP3." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Name the feature and the problem it fixes", "Trim, noise reduction, volume and fades."], ["Export for the purpose", "WAV to edit, MP3 to send."], "At least 4/6 on the practice questions."), "last"]);

build(A4, 45, ["hook", "criteria",
  video("Installing software safely", 4, "A short clip checking requirements, downloading from an official site and installing an update. Suggested source: a teacher-filmed screen recording on a school laptop.", ["Where the trusted download is", "How to check minimum requirements", "How updates are installed"]),
  h("The big idea"), "keyTerms",
  fig("Updates: give and risk", "Two panels: what updates give, and the risks of not updating.", twoPanelSvg({ t: "Updates give you", fill: "#dcfce7", lines: ["Security fixes", "Bug fixes, fewer crashes", "New features and compatibility"] }, { t: "Not updating risks", fill: "#fee2e2", lines: ["Malware using old security holes", "Crashes and lost work", "Files that will not open", "No support from the developer"] }, "keep software up to date"), "Updates and patches close known weaknesses."),
  seq("Deploy Audacity to 30 laptops", "Tap the four steps in order.", ["Confirm the laptops meet the minimum requirements.", "Download only from the official site or the school's software centre.", "Check the licence: Audacity is free for schools (open source).", "IT installs it with administrator rights on all 30 laptops at once."], "Check first, download from a trusted source, check the licence, then deploy."),
  sorter("Safe or risky?", "A student finds a free video editor on an unfamiliar website, and her laptop shows 12 pending Windows updates.", ["Safe", "Risky"], [
    { text: "Downloading from the official site.", category: 0, why: "A trusted source." },
    { text: "Installing from a website she has not heard of.", category: 1, why: "It could contain malware." },
    { text: "Checking the minimum requirements first.", category: 0, why: "Avoids software that will not run." },
    { text: "Ignoring 12 pending Windows updates.", category: 1, why: "Security holes stay open." },
    { text: "Checking the licence before installing.", category: 0, why: "Avoids legal problems." } ]),
  branch("The video editor and the updates", "A student finds a free video editor on a website she has not heard of. Her laptop also shows 12 pending Windows updates.", [
    { situation: "Describe two things she should check before installing.", prompt: "Pick the best answer.", choices: [
      { text: "That the download comes from the official site, and that her laptop meets the software's minimum requirements.", correct: true, feedback: "Two checks tied to the scenario." },
      { text: "That the icon looks nice.", correct: false, feedback: "Not a check." },
      { text: "Nothing, free software is safe.", correct: false, feedback: "Free software can carry malware." } ] },
    { situation: "Explain one risk of ignoring the updates.", prompt: "Pick the best answer.", choices: [
      { text: "Malware can use known security holes that the updates would have closed, so the laptop is more at risk.", correct: true, feedback: "A risk with its reason." },
      { text: "The laptop gets faster.", correct: false, feedback: "Not a risk." },
      { text: "Nothing happens.", correct: false, feedback: "Security holes stay open." } ] } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Check before installing", "Official source, requirements and licence."], ["Do not ignore updates", "They close security holes and fix bugs."], "At least 4/6 on the practice questions."), "last"]);

build(A5, 45, ["hook", "criteria",
  video("Free, paid or open?", 4, "A short clip comparing a proprietary, a shareware, a freeware and an open source photo editor on cost and what you can do with them. Suggested source: a teacher-filmed comparison using Photoshop, GIMP and a free trial.", ["Who owns the source code", "Whether copies can be shared", "What the licence allows"]),
  h("The big idea"), table(A5, 0),
  fig("Which licence fits the surf club?", "Four steps: proprietary is too costly, shareware ends after 7 days, freeware is limited, open source fits best.", stepsSvg([{ t: "Proprietary", s: "Best features, paid, not in budget" }, { t: "Shareware", s: "Free trial ends after 7 days" }, { t: "Freeware", s: "Free but limited, cannot be changed" }, { t: "Open source", s: "Free, legal on both laptops, community support" }], { numbered: false, colour: "#bbf7d0" }), "A volunteer surf club needs photo editing software on two old laptops with no budget."),
  table(A5, 1),
  sorter("Which licence?", "Tap the licence type each description fits.", ["Open source", "Proprietary", "Shareware", "Freeware"], [
    { text: "Source code can be viewed and changed, and it is usually free.", category: 0, why: "Open source." },
    { text: "Owned by a company, closed source code, usually paid for.", category: 1, why: "Proprietary." },
    { text: "Free to try, then you must pay after a trial.", category: 2, why: "Shareware." },
    { text: "Free to use but cannot be changed, and features are limited.", category: 3, why: "Freeware." },
    { text: "GIMP.", category: 0, why: "A well-known open source editor." } ]),
  branch("The 800 laptops", "A school is choosing an office suite for 800 student laptops: Microsoft 365 (proprietary, school licence) or LibreOffice (open source).", [
    { situation: "Define proprietary software.", prompt: "Pick the best answer.", choices: [
      { text: "Software owned by a company, with closed source code, that users license rather than change or share freely.", correct: true, feedback: "Ownership and closed code." },
      { text: "Any software that is free.", correct: false, feedback: "That is freeware." },
      { text: "Software anyone can change.", correct: false, feedback: "That is open source." } ] },
    { situation: "Compare the two options for the school.", prompt: "Pick the best answer.", choices: [
      { text: "Microsoft 365 has familiar, fully supported features but a licence cost per user, while LibreOffice is free to install on all 800 laptops but relies on community support.", correct: true, feedback: "Both options compared on cost and support." },
      { text: "They are identical.", correct: false, feedback: "They differ on cost, support and source code." },
      { text: "LibreOffice is always worse.", correct: false, feedback: "It is a free, legitimate option." } ] } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Four licence types", "Open source, proprietary, shareware, freeware."], ["Compare on cost, source code and sharing", "Tie it to the user's budget and needs."], "At least 4/6 on the practice questions."), "last"]);

build(A6, 45, ["hook", "criteria",
  video("From messy to clear", 4, "A short clip redesigning a messy membership sheet: headings, one type per column, currency formats, frozen panes and conditional formatting. Suggested source: a teacher-filmed screen recording in Excel.", ["Why merged cells cause problems", "How a frozen row helps", "How conditional formatting flags data"]),
  h("The big idea"), "keyTerms",
  fig("Before and after", "Two panels: a messy spreadsheet with no headings and typed text numbers, and a redesigned one with headings, formats and conditional formatting.", twoPanelSvg({ t: "Before", fill: "#fee2e2", lines: ["No headings, merged cells", "Fees typed as 'fifty dollars'", "Dates in different styles"] }, { t: "After", fill: "#dcfce7", lines: ["Row 1 headings, bold and frozen", "Fee as currency ($50.00)", "Dates as DD/MM/YYYY", "Unpaid fees highlighted"] }, "readable and sortable"), "A club treasurer redesigns a 200-member sheet."),
  table(A6),
  sorter("Good or poor design?", "Sort each spreadsheet feature.", ["Good design", "Poor design"], [
    { text: "Headings in row 1, data from row 2.", category: 0, why: "A clear layout that can be sorted and filtered." },
    { text: "Prices typed as $2, 2.00 and 'two dollars'.", category: 1, why: "Inconsistent formats cannot be calculated." },
    { text: "Blank rows separating each food type.", category: 1, why: "Blank rows break sorting and filtering." },
    { text: "Merged cells inside the data.", category: 1, why: "Merged cells stop sorting working." },
    { text: "Fee paid shown as currency.", category: 0, why: "A consistent number format." },
    { text: "Conditional formatting turns low stock red.", category: 0, why: "Colour used for meaning." } ]),
  branch("The canteen stock sheet", "A school canteen tracks stock in a spreadsheet. Some prices are typed as $2, some as 2.00 and some as two dollars. Blank rows separate each food type.", [
    { situation: "Why must prices use one number format?", prompt: "Pick the best answer.", choices: [
      { text: "Text like 'two dollars' cannot be added up, sorted or filtered, so one currency format makes the data usable and consistent.", correct: true, feedback: "It explains the effect on calculation and sorting." },
      { text: "It looks tidier only.", correct: false, feedback: "The main reason is functionality." },
      { text: "No reason.", correct: false, feedback: "There is an important one." } ] },
    { situation: "Which two other changes would improve it?", prompt: "Pick the best answer.", choices: [
      { text: "Remove the blank rows and add a bold, frozen heading row, so the data can be sorted and headings stay visible.", correct: true, feedback: "Two layout changes with reasons." },
      { text: "Add more blank rows.", correct: false, feedback: "That makes it worse." },
      { text: "Change the font to a fancy one.", correct: false, feedback: "Not a layout improvement." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["One type per column", "Consistent formats so it can be sorted and calculated."], ["Clear layout", "Headings in row 1, no blank rows or merged cells in the data."], "At least 4/6 on the practice questions."), "last"]);

build(A7, 45, ["hook", "criteria",
  video("Sort and filter", 4, "A short clip sorting a membership list by surname, then by team then surname, and filtering to unpaid fees. Suggested source: a teacher-filmed screen recording in Excel.", ["Ascending and descending", "How a multi-level sort groups data", "Why filtering hides rather than deletes"]),
  h("The big idea"), "keyTerms",
  fig("Three lists from one sheet", "Three tasks: alphabetical list, each team's list, and who has not paid.", stepsSvg([{ t: "Alphabetical", s: "Sort by Surname then First name" }, { t: "By team", s: "Sort by Team then Surname" }, { t: "Not paid", s: "Filter Fee paid = No" }, { t: "Under 12s unpaid", s: "Two filters: Team and Fee paid" }]), "The treasurer needs several lists from the same 200 members."),
  table(A7),
  sorter("Sort or filter?", "Which tool does each task need?", ["Sort", "Multi-level sort", "Filter"], [
    { text: "Rank players from highest to lowest score.", category: 0, why: "A single descending sort." },
    { text: "Show only players in the Under 14 team.", category: 2, why: "A filter on the Team column." },
    { text: "Group by team, then alphabetical within each team.", category: 1, why: "Sort by Team, then by Surname." },
    { text: "Show only scores above 80.", category: 2, why: "A filter condition." },
    { text: "Put names in A to Z order.", category: 0, why: "A single ascending sort." } ]),
  branch("The surf school bookings", "A surf school has a spreadsheet of 500 bookings with columns for Name, Lesson date, Level (Beginner, Intermediate, Advanced) and Paid (Yes/No).", [
    { situation: "Describe a multi-level sort to organise the bookings.", prompt: "Pick the best answer.", choices: [
      { text: "Sort by Lesson date first, then by Level within each date, so each day's bookings are grouped by level.", correct: true, feedback: "Two levels, in order, with the effect." },
      { text: "Delete half the rows.", correct: false, feedback: "Sorting does not delete." },
      { text: "Sort only by Paid.", correct: false, feedback: "That is a single-level sort." } ] },
    { situation: "How could filters find beginners who have not paid, and what is a benefit?", prompt: "Pick the best answer.", choices: [
      { text: "Filter Level = Beginner and Paid = No to show only those rows. The benefit is the data is only hidden, not deleted, so the owner can chase payments and then clear the filter.", correct: true, feedback: "Two filters and a benefit." },
      { text: "Sort by Name.", correct: false, feedback: "Sorting does not select rows." },
      { text: "Delete everyone else.", correct: false, feedback: "Filters hide, they do not delete." } ] } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Sort reorders, filter hides", "Filtering never deletes the data."], ["Name the columns and the order", "Multi-level sort: first column, then the second."], "At least 4/6 on the practice questions."), "last"]);

// ===== Project management (Unit 3) =====
build(P1, 45, ["hook", "criteria",
  video("Scope, time, resources and the brief", 4, "A short clip planning a 30-second reel and showing how changing one consideration affects the others. Suggested source: a teacher-filmed whiteboard walk-through.", ["What is in and out of scope", "What happens when time is cut", "How the brief stays in the middle"]),
  h("The big idea"), table(P1),
  fig("Four considerations", "Scope, time and resources around the client brief.", stepsSvg([{ t: "Scope", s: "What is and is not included" }, { t: "Time", s: "Deadline and stages" }, { t: "Resources", s: "People, equipment, money" }, { t: "Client brief", s: "Every decision must still meet it" }], { numbered: false }), "A surf club wants a 30-second Instagram reel in three weeks, with one phone, a free app and no budget."),
  sorter("Which consideration changes?", "Each change affects one consideration. Which?", ["Scope", "Time", "Resources"], [
    { text: "Cut the reel from 30 seconds to 15 seconds.", category: 0, why: "Less is included." },
    { text: "Sign-up day moves from three weeks away to two.", category: 1, why: "The deadline changed." },
    { text: "No budget, so use free software and your own footage.", category: 2, why: "Fewer resources available." },
    { text: "Add a poster and a website to the project.", category: 0, why: "Bigger scope." },
    { text: "Another volunteer joins to edit.", category: 2, why: "More people." } ]),
  branch("The digital menu board", "The school canteen wants a digital menu board on a TV screen. It must show prices, daily specials and allergy symbols, in two weeks. A Year 12 student designs it in Canva on a school laptop.", [
    { situation: "The manager adds a 10-second animated special each day, but the deadline stays at two weeks.", prompt: "How should the project cope?", choices: [
      { text: "Reduce the scope elsewhere (for example fewer animated specials at first) or add resources such as another designer, because more work in the same time needs a trade-off.", correct: true, feedback: "It names the trade-off between scope, time and resources." },
      { text: "Do it all and work faster.", correct: false, feedback: "Not a plan." },
      { text: "Ignore the new request.", correct: false, feedback: "The client brief must still be met." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Four considerations", "Scope, time, resources and the client brief."], ["They trade off", "Less time means less scope or more resources."], "At least 4/6 on the practice questions."), "last"]);

build(P2, 45, ["hook", "criteria",
  video("Specific design criteria", 4, "A short clip turning vague criteria like 'looks good' into specific, checkable ones for a library workshop poster. Suggested source: a teacher-filmed whiteboard demo.", ["Why vague criteria earn nothing", "What makes a criterion checkable", "How audience and medium shape the criteria"]),
  h("The big idea"), table(P2),
  fig("Library workshop poster", "Four steps: purpose, target audience, presentation medium, design criteria.", stepsSvg([{ t: "Purpose", s: "Inform families and persuade them to book" }, { t: "Audience", s: "Parents 30 to 50 on phones, children 8 to 12" }, { t: "Medium", s: "A square Facebook post" }, { t: "Criteria", s: "Specific and checkable" }]), "Free school holiday workshops for children aged 8 to 12."),
  sorter("Vague or specific?", "Which design criteria are specific and checkable?", ["Vague (earns 0)", "Specific and checkable"], [
    { text: "Looks good.", category: 0, why: "Cannot be checked." },
    { text: "Uses only the three library brand colours.", category: 1, why: "Easily checked." },
    { text: "Is easy to use.", category: 0, why: "No measure." },
    { text: "Readable on a 6-inch phone screen without zooming.", category: 1, why: "A clear test." },
    { text: "Appeals to kids.", category: 0, why: "Too general." },
    { text: "Date and time are in the largest text after the heading.", category: 1, why: "Checkable on the design." } ]),
  "interactive",
  branch("The boxing class video", "A local gym wants a 20-second video advertisement on screens inside the gym, promoting a new beginners' boxing class for adults over 50.", [
    { situation: "Describe two audience characteristics that should affect the design.", prompt: "Pick the best answer.", choices: [
      { text: "Age over 50, so text should be large and clear and the pace calm; and beginners, so footage should look welcoming rather than intense.", correct: true, feedback: "Two characteristics, each with a design effect." },
      { text: "They like boxing.", correct: false, feedback: "Not linked to a design effect." },
      { text: "They are adults.", correct: false, feedback: "Too general and no effect given." } ] },
    { situation: "Write three design criteria.", prompt: "Pick the best set.", choices: [
      { text: "Text is at least 48 pt and readable from 3 m; shows beginners of mixed ages training; the class day and time appear for at least 5 seconds.", correct: true, feedback: "Specific and checkable." },
      { text: "Looks good, is fun, is exciting.", correct: false, feedback: "Vague, earns nothing." },
      { text: "Is a video.", correct: false, feedback: "Not a criterion." } ] } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Purpose, audience, medium, criteria", "Each shapes the design."], ["Criteria must be checkable", "Specific numbers, colours or placements."], "At least 4/7 on the practice questions."), "last"]);

build(P3, 45, ["hook", "criteria",
  video("From thumbnail to storyboard", 4, "A short clip showing thumbnails, a storyboard and an annotated sketch for a 15-second safety animation. Suggested source: a teacher-filmed sketching demo.", ["Why thumbnails come first", "What a storyboard frame contains", "How an annotation differs from a label"]),
  h("The big idea"), table(P3),
  fig("Representing a design", "Four techniques: thumbnails, storyboard, annotated sketch and annotated notes.", stepsSvg([{ t: "Thumbnails", s: "Quick options to choose from" }, { t: "Storyboard", s: "Each scene, text and sound" }, { t: "Annotated sketch", s: "Labels for colour, font and logo" }, { t: "Annotated notes", s: "Feedback and decisions" }]), "A council animation reminds people to swim between the flags."),
  sorter("Which technique?", "Tap the best technique for each job.", ["Thumbnail", "Storyboard", "Annotated sketch", "Annotated notes"], [
    { text: "Four quick sketches of different opening scenes to choose from.", category: 0, why: "Quick ideas to compare." },
    { text: "Eight frames showing each scene, the text on screen and the sound.", category: 1, why: "A sequence of scenes." },
    { text: "A detailed drawing of the final frame with labels for colour, font and logo position.", category: 2, why: "Annotated sketch." },
    { text: "Recording the council's feedback and the changes made.", category: 3, why: "Annotated notes." } ]),
  sorter("Label or annotation?", "A label names something. An annotation gives a reason. Which is which?", ["Label (weak)", "Annotation (strong)"], [
    { text: "Blue", category: 0, why: "Names a colour only." },
    { text: "Blue matches the council brand and creates unity with other council posts.", category: 1, why: "Gives a reason." },
    { text: "Logo here", category: 0, why: "Says where, not why." },
    { text: "Logo top-left, where other council posts put it.", category: 1, why: "Gives a reason." },
    { text: "Big heading", category: 0, why: "No reason." },
    { text: "Heading is 3x the body size so it is dominant.", category: 1, why: "Gives a reason." } ]),
  branch("The bike repair shop", "A student is designing a three-page website for a local bike repair shop.", [
    { situation: "How could thumbnails be used?", prompt: "Pick the best answer.", choices: [
      { text: "Draw several quick home page layouts to compare and choose the strongest before developing it.", correct: true, feedback: "Quick options and a choice." },
      { text: "Build the finished site.", correct: false, feedback: "Thumbnails are early sketches." },
      { text: "Write the code.", correct: false, feedback: "Not a thumbnail use." } ] },
    { situation: "Which two annotations belong on the home page sketch?", prompt: "Pick the best answer.", choices: [
      { text: "The logo is top-left for consistency with other pages, and the booking button is bright orange so it stands out against the dark background.", correct: true, feedback: "Reasons, not labels." },
      { text: "Logo. Button.", correct: false, feedback: "Labels only." },
      { text: "Nice.", correct: false, feedback: "No design information." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Pick the right technique", "Thumbnails for options, storyboard for sequence, annotated sketch for detail."], ["Annotate with reasons", "Explain why, not just what."], "At least 4/6 on the practice questions."), "last"]);

build(P4, 45, ["hook", "criteria",
  video("Evaluating against the criteria", 4, "A short clip checking a menu against its criteria: met, partly met and not met, with evidence and a fix for each. Suggested source: a teacher-filmed example using a student product.", ["How evidence is collected", "How each criterion is judged", "How a fix is proposed"]),
  h("The big idea"), "keyTerms",
  fig("Judging each criterion", "Three outcomes for the menu: met, partly met, not met, each with evidence and a fix.", stepsSvg([{ t: "Met", s: "Loaded in 2 seconds on three phones (tested)" }, { t: "Partly met", s: "Allergy symbols on hot food, not drinks. Fix: add to drinks" }, { t: "Not met", s: "Ordering took 6 taps. Fix: add a Quick order button" }], { numbered: false }), "Criteria: loads in under 3 seconds, allergy symbols on every item, order in 4 taps or fewer."),
  table(P4),
  sorter("Met, partly met or not met?", "Judge each criterion from the evidence.", ["Met", "Partly met", "Not met"], [
    { text: "Menu loaded in 2 seconds on three different phones.", category: 0, why: "Under 3 seconds, tested." },
    { text: "Allergy symbols appear on hot food but not on drinks.", category: 1, why: "Only some items have them." },
    { text: "Ordering took 6 taps in user testing.", category: 2, why: "The criterion was 4 taps or fewer." } ]),
  branch("The music night video", "A student made a 30-second promotional video for the school's music night. One criterion was: the date and venue appear on screen for at least 5 seconds.", [
    { situation: "Describe two methods to gather evidence.", prompt: "Pick the best answer.", choices: [
      { text: "A user survey asking viewers if they could read the date and venue, and a timed playback check that the details stay on screen for 5 seconds.", correct: true, feedback: "Two methods that test the criterion." },
      { text: "Ask nobody.", correct: false, feedback: "Evaluation needs evidence." },
      { text: "Guess.", correct: false, feedback: "Not evidence." } ] },
    { situation: "Write two more criteria.", prompt: "Pick the best set.", choices: [
      { text: "The school logo appears in the first 3 seconds. The music is at a lower volume than the voiceover throughout.", correct: true, feedback: "Specific and checkable." },
      { text: "Looks good. Sounds good.", correct: false, feedback: "Vague." },
      { text: "Is 30 seconds.", correct: false, feedback: "That is a requirement, but only one measure." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  R(["Judge against the criteria", "Met, partly met or not met, with evidence."], ["Propose a fix", "Every gap needs a specific improvement."], "At least 4/6 on the practice questions."), "last"]);

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log("done");
