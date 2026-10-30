// Rebuilds Y12 AIT General Unit 4 "Managing Data" (8 lessons). Safe to re-run.
import fs from "node:fs";
import { h, mcq, video, assemble, flip, sorter, seq, branch, fig, fileSizeLab, stepsSvg, twoPanelSvg, standardRecap } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const topic = course.units.find((u) => u.id === "unit4").topics.find((t) => t.id === "managing-data");
const [L1, L2, L3, L4, L5, L6, L7, L8] = topic.lessons;
const build = (l, mins, parts) => { l.estimatedMinutes = mins; l.blocks = assemble(l, parts); };

build(L1, 45, ["hook", "criteria",
  video("One photo, three destinations", 4, "A short screen recording exporting one 24 MB photo for print, for a website and for email, showing the size and pixel dimensions each time. Suggested source: a teacher-filmed demo in Photopea or Canva.", ["Pixel dimensions against file size", "Why print needs more resolution", "How fast pages load with small files"]),
  h("The big idea"), "keyTerms",
  fig("Print or online?", "Two panels comparing print settings with online settings.", twoPanelSvg({ t: "Print", fill: "#fef3c7", lines: ["About 300 ppi at printed size", "CMYK colour", "Large files are fine"] }, { t: "Online", fill: "#dbeafe", lines: ["Sized in pixels for the screen", "RGB colour", "Small files so pages load fast"] }, "same photo, two jobs"), "Optimise the photo for where it will be used."),
  fileSizeLab({ title: "File size lab: the real estate photo", width: 6000, height: 4000, useCase: "website listing" }),
  sorter("Print or online?", "Which environment does each setting belong to?", ["Print", "Online"], [
    { text: "300 ppi at the printed size.", category: 0, why: "Print needs high resolution." },
    { text: "Resized to 1600 pixels wide.", category: 1, why: "Online images are sized in pixels for the screen." },
    { text: "CMYK colour mode.", category: 0, why: "Print uses CMYK inks." },
    { text: "About 300 KB so it loads quickly on a phone.", category: 1, why: "Small files keep pages fast." },
    { text: "A large file is fine.", category: 0, why: "Print files are large because they hold more detail." },
    { text: "RGB colour mode.", category: 1, why: "Screens display RGB." },
  ]),
  branch("The 18 MB team photo", "A school uses the same 18 MB photo of its sports team on its website home page and in a printed yearbook.", [
    { situation: "The home page is slow to load.", prompt: "What is the best explanation?", choices: [
      { text: "The 18 MB file is far larger than a screen needs, so it takes a long time to download, especially on phones.", correct: true, feedback: "It links the file size to the loading time." },
      { text: "The photo is the wrong colour.", correct: false, feedback: "Colour does not cause slow loading." },
      { text: "Websites cannot show photos.", correct: false, feedback: "They can, if the file is optimised." } ] },
    { situation: "The school optimises the photo for both uses.", prompt: "Which plan is best?", choices: [
      { text: "Website: resize to a screen size in RGB as a small JPEG. Yearbook: keep about 300 ppi at the printed size in CMYK.", correct: true, feedback: "Each use gets its own settings." },
      { text: "Use the same 18 MB file for both.", correct: false, feedback: "That is the problem, not the fix." },
      { text: "Shrink the yearbook photo to 300 KB.", correct: false, feedback: "It would print blurry." } ] } ]),
  "tasks", "mentor",
  flip("Check your understanding", [
    { tag: "Define", front: "What is file optimisation?", back: "Adjusting a file's size, resolution, format and colour so it suits where it will be used, with the smallest size that still looks good." },
    { tag: "Compare", front: "How does optimising for print differ from online?", back: "Print needs about 300 ppi and CMYK so files are large. Online needs small RGB files sized in pixels so pages load quickly." } ]),
  "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Match the setting to the use", "Print: about 300 ppi, CMYK. Online: small, RGB, sized in pixels."], ["Explain the effect", "Large file means slow loading."], "At least 4/6 on the practice questions. If not, reread the key terms and test tip."),
  "last"]);

build(L2, 45, ["hook", "criteria",
  video("Lossy or lossless?", 4, "A short clip comparing a photo saved as high and low quality JPEG and as PNG, then zipping a folder to show nothing is lost. Suggested source: a teacher-filmed screen recording.", ["What is thrown away in lossy compression", "Why logos and text suit lossless", "How much smaller each option is"]),
  h("The big idea"), L2.blocks.find((b) => b.type === "table"),
  fig("Lossy vs lossless", "Two panels comparing lossy compression, which discards data, with lossless, which keeps every bit.", twoPanelSvg({ t: "Lossy (JPEG, MP3)", fill: "#fee2e2", lines: ["Throws some data away", "Much smaller files", "Cannot be restored"] }, { t: "Lossless (PNG, ZIP)", fill: "#dcfce7", lines: ["Keeps every bit", "Larger files", "Exactly restored"] }, "size against quality"), "The trade-off is file size against exactness."),
  fileSizeLab({ title: "File size lab: JPEG against PNG", width: 4000, height: 3000, useCase: "email attachment" }),
  sorter("Which compression fits?", "A designer is sending four files. Tap the best type.", ["Lossy", "Lossless"], [
    { text: "Holiday photos for Instagram.", category: 0, why: "Quality loss is not noticed on a phone, and files stay small." },
    { text: "The client's logo with text.", category: 1, why: "Sharp edges and text stay crisp." },
    { text: "A folder of contracts.", category: 1, why: "Every character must be exactly the same." },
    { text: "Music for streaming.", category: 0, why: "Small files stream smoothly." },
    { text: "12 songs sent to a record label for mastering.", category: 1, why: "Mastering needs full quality, so nothing can be discarded." },
    { text: "12 songs as a free fan download.", category: 0, why: "Smaller files download faster and quality loss is acceptable." } ]),
  branch("The band's two uses", "A band is sending 12 songs to a record label for mastering, and 12 songs to fans as a free download.", [
    { situation: "The label will master the tracks.", prompt: "Which compression should the band use?", choices: [
      { text: "Lossless, because mastering needs every detail of the original recording.", correct: true, feedback: "It names the type and justifies it with the use." },
      { text: "Lossy, because it is smaller.", correct: false, feedback: "Size is not the priority when the label needs full quality." },
      { text: "No compression is possible.", correct: false, feedback: "Lossless compression keeps quality." } ] },
    { situation: "The fans download the songs.", prompt: "Which compression should they use?", choices: [
      { text: "Lossy, because smaller files download faster and the quality loss is acceptable for listening.", correct: true, feedback: "It justifies lossy with the use." },
      { text: "Lossless, because it is always better.", correct: false, feedback: "Not always. Large files slow the download." },
      { text: "Neither.", correct: false, feedback: "Compression helps both uses." } ] } ]),
  "interactive", "tasks", "mentor",
  "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Know the purpose", "Compression reduces file size so files store and send faster."], ["Justify the type", "Lossless when exactness matters, lossy when small size matters more."], "At least 4/5 on the practice questions. If not, reread the table and test tip."),
  "last"]);

build(L3, 45, ["hook", "criteria",
  video("Crop first, then resample", 4, "A short screen recording cropping a photo, downsampling it to its display size and exporting it, with the file size shown at each step. Suggested source: a teacher-filmed demo in Photopea.", ["Pixels before and after each step", "Why you keep the original", "Why upsampling looks blurry"]),
  h("The big idea"), "keyTerms",
  fig("The cafe photo, step by step", "Four steps: keep the original, crop, resample, export.", stepsSvg([{ t: "Keep original", s: "Work on a copy" }, { t: "Crop", s: "Remove what you do not need" }, { t: "Resample", s: "Reduce to display size" }, { t: "Export", s: "Choose format and quality" }]), "A 6000 x 4000 photo ends up about 40 times smaller."),
  seq("Put the workflow in order", "Tap the four steps in order.", ["Keep the original and work on a copy.", "Crop first to remove what you do not need.", "Resample down to the size it will display at.", "Export, choosing the format and quality."], "Crop, then resample, on a copy. Resampling down cannot be undone."),
  fileSizeLab({ title: "File size lab: crop and resample", width: 6000, height: 4000, useCase: "website" }),
  sorter("Cropping or resampling?", "Which operation does each statement describe?", ["Cropping", "Resampling"], [
    { text: "Removes unwanted areas from the edges.", category: 0, why: "That is cropping." },
    { text: "Changes the number of pixels in the image.", category: 1, why: "That is resampling." },
    { text: "Can strengthen the composition, for example moving the subject onto a thirds line.", category: 0, why: "Cropping changes what is in the frame." },
    { text: "Downsampling reduces the pixel dimensions and file size.", category: 1, why: "Fewer pixels mean a smaller file." },
    { text: "Upsampling adds pixels and makes the image blurry, so avoid it.", category: 1, why: "Upsampling cannot add real detail." } ]),
  branch("The 80 MB PDF", "A student places a 5 MB photo of a school building in an interactive PDF, where it only fills a small box 600 pixels wide. The PDF is now 80 MB.", [
    { situation: "She wants to shrink the PDF.", prompt: "Which fix is best?", choices: [
      { text: "Downsample the photo to about 600 pixels wide before placing it, so each copy is a small file.", correct: true, feedback: "Resampling to the display size cuts the size dramatically." },
      { text: "Upsample the photo.", correct: false, feedback: "That makes the file larger and blurrier." },
      { text: "Rename the file.", correct: false, feedback: "Names do not change size." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Crop then resample", "Crop first, then reduce to the display size, always on a copy."], ["Avoid upsampling", "It adds pixels but no detail, so the image looks blurry."], "At least 4/5 on the practice questions."),
  "last"]);

build(L4, 45, ["hook", "criteria",
  video("A tidy shared folder", 3, "A short walk-through of a shared OneDrive folder for a club: subfolders, file names, permissions and an archive. Suggested source: a teacher-filmed screen recording using a school OneDrive.", ["How subfolders are organised", "How permissions are set", "What an archive folder is for"]),
  h("The big idea"), "keyTerms",
  fig("Setting up the club folder", "Four steps: create the structure, name files consistently, set permissions, archive and tidy.", stepsSvg([{ t: "Structure", s: "Shared folder with subfolders" }, { t: "Naming", s: "Consistent file names with dates" }, { t: "Permissions", s: "Least access needed" }, { t: "Housekeeping", s: "Archive old, delete duplicates" }]), "Five committee members share files on OneDrive."),
  sorter("Good or poor practice?", "Four students share a Google Drive folder. Is each habit good or poor?", ["Good practice", "Poor practice"], [
    { text: "Files named doc1, final and final2.", category: 1, why: "Names should describe the content and date." },
    { text: "Fixtures_Round03_2027-05-10.pdf", category: 0, why: "A consistent name with a date sorts in order." },
    { text: "Everyone has edit access to every file.", category: 1, why: "Anyone can delete someone else's work." },
    { text: "The treasurer can edit Finance while coaches only view it.", category: 0, why: "Permissions match what each person needs." },
    { text: "Last season's files moved to an Archive folder.", category: 0, why: "It keeps the live folder tidy." },
    { text: "Leaving access on after a member leaves.", category: 1, why: "Access should be removed when people leave." } ]),
  branch("The deleted work", "Four students share a Google Drive folder. One accidentally deleted another's work.", [
    { situation: "How could permissions have prevented it?", prompt: "Which answer is best?", choices: [
      { text: "Give each student edit access only to their own section and view access to the rest, so they cannot delete each other's work.", correct: true, feedback: "It links permissions to the problem." },
      { text: "Give everyone edit access to everything.", correct: false, feedback: "That caused the problem." },
      { text: "Tell people to be careful.", correct: false, feedback: "A request is not a control." } ] } ]),
  flip("Check your understanding", [
    { tag: "Define", front: "What are permissions?", back: "Who can view, comment or edit a file or folder." },
    { tag: "Explain", front: "What does sync do?", back: "Keeps the same files up to date on the cloud and on each device." },
    { tag: "Apply", front: "Name two ways to share and protect files.", back: "Any two of: share links with the least permission needed, remove access when people leave, turn on two-step verification, check sync before working offline." } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Structure and naming", "Logical folders and consistent file names."], ["Protect with permissions", "Least access needed, removed when people leave."], "At least 5/6 on the practice questions."),
  "last"]);

build(L5, 45, ["hook", "criteria",
  video("Version history in action", 3, "A short clip restoring yesterday's version of a document from version history and showing a v01, v02 naming pattern. Suggested source: a teacher-filmed recording in Word online or Google Docs.", ["Where version history is found", "How a version is restored", "How version numbers are written"]),
  h("The big idea"), "keyTerms",
  fig("Bad against good", "Two panels: emailed copies with confusing names, and one shared master with numbered versions.", twoPanelSvg({ t: "Bad", fill: "#fee2e2", lines: ["report_final.docx", "report_final2.docx", "report_final_REAL.docx", "Emailed copies, different edits"] }, { t: "Good", fill: "#dcfce7", lines: ["Report_v01.docx, Report_v02.docx", "Dates as YYYY-MM-DD", "One shared master with history", "Change note: v03 added budget table"] }, "which is the master?"), "Names and one shared master make the current version obvious."),
  sorter("Bad or good version control?", "Sort each habit.", ["Bad", "Good"], [
    { text: "Emailing yourself Essay, Essay new and Essay latest.", category: 0, why: "You cannot tell which copy has the feedback." },
    { text: "Saving copies as Report_v01 and Report_v02.", category: 1, why: "Version numbers show the order." },
    { text: "Keeping one master copy in a shared folder.", category: 1, why: "Nobody emails attachments around." },
    { text: "Report_final_REAL.docx", category: 0, why: "Names like this say nothing about order." },
    { text: "Restoring yesterday's version from version history.", category: 1, why: "History lets you recover from mistakes." } ]),
  branch("14 copies of an essay", "A student emails her draft essay to herself each night. She now has 14 copies called Essay, Essay new and Essay latest and cannot tell which has her teacher's feedback.", [
    { situation: "She asks how to fix this.", prompt: "Which strategies are best?", choices: [
      { text: "Keep one master copy in a shared folder, number saved versions (v01, v02) and use version history to restore earlier work.", correct: true, feedback: "Numbering and a single master with history solve it." },
      { text: "Email herself more often.", correct: false, feedback: "More copies makes it worse." },
      { text: "Delete all but the newest.", correct: false, feedback: "She cannot tell which is newest or has the feedback." } ] } ]),
  flip("Check your understanding", [
    { tag: "Define", front: "What is document version control?", back: "Managing changes to a document so the current version is clear and earlier versions can be found or restored." },
    { tag: "Define", front: "What is a master copy?", back: "The single, official current version of a document." },
    { tag: "Define", front: "What does check out do?", back: "Locks a file while one person edits it, so others cannot overwrite changes." } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["One master copy", "Never email attachments around."], ["Number and date versions", "v01, v02 and YYYY-MM-DD, with a change note."], "At least 4/6 on the practice questions."),
  "last"]);

build(L6, 45, ["hook", "criteria",
  video("What is the cloud?", 4, "A short clip showing files, bookings and accounting software used from a tablet and a phone with nothing stored locally. Suggested source: a teacher-filmed demonstration with a cloud booking app and OneDrive.", ["What runs on the provider's servers", "What happens with no internet", "How sharing works"]),
  h("The big idea"), L6.blocks.find((b) => b.type === "table"),
  fig("Office server or cloud?", "Two panels comparing an office server with cloud storage.", twoPanelSvg({ t: "Office server", fill: "#fef3c7", lines: ["Bought and maintained by the firm", "Works without the internet", "Backups are the firm's job"] }, { t: "Cloud", fill: "#dbeafe", lines: ["Provider runs the servers", "Needs a reliable internet connection", "Automatic backup by the provider"] }, "where does the data live?"), "The data lives on the provider's servers, reached over the internet."),
  sorter("Advantage or disadvantage?", "Sort each effect of cloud computing.", ["Advantage", "Disadvantage"], [
    { text: "Access from any device, anywhere.", category: 0, why: "Files follow the user." },
    { text: "Needs a reliable internet connection.", category: 1, why: "No signal means no access." },
    { text: "Automatic backup by the provider.", category: 0, why: "A stolen tablet loses nothing." },
    { text: "Ongoing subscription cost.", category: 1, why: "It is a continuing expense." },
    { text: "No expensive servers to buy.", category: 0, why: "The provider supplies the hardware." },
    { text: "Data held by a third party, sometimes overseas.", category: 1, why: "The user has less control over it." },
    { text: "Storage can grow as needed.", category: 0, why: "It scales without new hardware." },
    { text: "A provider outage stops work.", category: 1, why: "The user depends on the provider being up." } ]),
  branch("The accounting firm", "A small accounting firm is deciding whether to replace its office server with cloud storage and cloud accounting software.", [
    { situation: "The partner asks for one real advantage.", prompt: "Which is best?", choices: [
      { text: "Staff can open client files from any device at any site, and the provider backs them up automatically.", correct: true, feedback: "A real advantage linked to the firm." },
      { text: "The cloud is modern.", correct: false, feedback: "Not an advantage and not linked to the firm." },
      { text: "It is always free.", correct: false, feedback: "There is an ongoing subscription." } ] },
    { situation: "She asks for one real disadvantage.", prompt: "Which is best?", choices: [
      { text: "If the internet or the provider goes down, staff cannot reach client files, and the data sits with a third party.", correct: true, feedback: "It links the downside to the firm's work." },
      { text: "The cloud has no disadvantages.", correct: false, feedback: "There are several." },
      { text: "It uses too much power at the office.", correct: false, feedback: "The provider runs the servers, not the firm." } ] } ]),
  flip("Check your understanding", [
    { tag: "Explain", front: "What is cloud computing?", back: "Using storage and software on a provider's servers over the internet instead of on your own equipment." },
    { tag: "Apply", front: "Why did the stolen tablet lose nothing?", back: "The files were synced to the cloud, so she logs in on a new device." } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Define it", "Storage and software on a provider's servers, used over the internet."], ["Give both sides", "A real advantage and a real disadvantage, linked to the business."], "At least 5/6 on the practice questions."),
  "last"]);

build(L7, 45, ["hook", "criteria",
  video("Keeping a computer healthy", 4, "A short clip running Disk Clean-up, clearing the browser cache and checking whether a drive is an HDD or an SSD. Suggested source: a teacher-filmed screen recording on a school laptop.", ["How much space a clean-up frees", "Why the cache can fix a website", "Why SSDs are not defragmented"]),
  h("The big idea"), "keyTerms",
  fig("Why defragmenting depends on the drive", "Two panels: a hard disk drive scatters file parts so defragmenting helps, and an SSD has no moving parts so defragmenting is not needed.", twoPanelSvg({ t: "Hard disk drive (HDD)", fill: "#fef3c7", lines: ["Parts of a file get scattered", "Slower to read", "Defragmentation helps"] }, { t: "Solid state drive (SSD)", fill: "#dcfce7", lines: ["No moving parts", "Fast wherever data sits", "Defragmentation not needed"] }, "check the drive type"), "Match the utility to the problem and the drive."),
  L7.blocks.find((b) => b.type === "table"),
  sorter("Which tool fixes it?", "A 6-year-old desktop with a hard disk drive is slow. Tap the tool.", ["Disk clean-up", "Clear browser cache", "Defragment"], [
    { text: "Only 2 GB free, mostly old update files and temporary files.", category: 0, why: "Disk clean-up removes unneeded files to free space." },
    { text: "A website keeps showing old images.", category: 1, why: "Clearing the cache removes the saved copies." },
    { text: "The HDD is 30% fragmented and files open slowly.", category: 2, why: "Defragmenting rearranges scattered file parts." },
    { text: "The recycle bin and temporary files are using 18 GB.", category: 0, why: "Clean-up removes recycle bin and temporary files." },
    { text: "The browser has not been cleared for two years.", category: 1, why: "Clearing the cache frees space." } ]),
  branch("The 95% full laptop", "A student's laptop has an SSD that is 95% full. Her browser has not been cleared for two years.", [
    { situation: "She asks which two utilities would help.", prompt: "Which pair is best?", choices: [
      { text: "Disk clean-up to remove temporary files and free storage, and clearing the browser cache to free space and remove old saved pages.", correct: true, feedback: "Both target the space problem." },
      { text: "Defragmentation and a spam filter.", correct: false, feedback: "Defragmentation is not for SSDs, and a spam filter is not a maintenance utility here." },
      { text: "Buy a new laptop.", correct: false, feedback: "Not a utility tool." } ] },
    { situation: "She wonders about defragmenting.", prompt: "Why is it not needed on her laptop?", choices: [
      { text: "An SSD has no moving parts, so scattered file parts do not slow it, and defragmenting would add wear.", correct: true, feedback: "It names the drive type and the reason." },
      { text: "Laptops cannot be defragmented.", correct: false, feedback: "Not the reason." },
      { text: "The laptop is too full.", correct: false, feedback: "Fullness is not why." } ] } ]),
  "tasks", "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Name the tool and what it does", "Clean-up frees space, cache clearing frees space, defrag rearranges an HDD."], ["Check the drive", "No defragmentation on an SSD."], "At least 5/6 on the practice questions."),
  "last"]);

build(L8, 45, ["hook", "criteria",
  video("Malware and how to stop it", 4, "A short clip showing a phishing email, the spam filter catching it, and anti-malware quarantining a bad attachment. Suggested source: a teacher-filmed screen recording using a safe demo, or an Australian Cyber Security Centre education video.", ["The warning signs in the email", "What spyware can record", "What quarantine means"]),
  h("The big idea"), "keyTerms",
  fig("A suspicious parcel email", "Four steps: spam filter, if opened spyware, anti-malware scans, user action.", stepsSvg([{ t: "Spam filter", s: "Moves it to Junk" }, { t: "If opened", s: "Spyware records passwords" }, { t: "Anti-malware", s: "Scans and quarantines" }, { t: "User action", s: "Do not click, report, delete" }]), "An email says 'Your parcel is waiting' with a link and an attachment called Invoice.zip."),
  sorter("Tool or habit?", "Sort each protection.", ["Tool", "Habit"], [
    { text: "Anti-malware with real-time scanning.", category: 0, why: "Software that scans and quarantines." },
    { text: "Do not open unexpected attachments.", category: 1, why: "A behaviour users must practise." },
    { text: "A spam filter in the email service.", category: 0, why: "Software that filters suspicious mail." },
    { text: "Hover over links to check the address.", category: 1, why: "A behaviour that spots fake links." },
    { text: "Firewall turned on.", category: 0, why: "A software control." },
    { text: "Use strong, different passwords.", category: 1, why: "A user habit." },
    { text: "Automatic updates.", category: 0, why: "A setting that installs security fixes." },
    { text: "Download software only from official sites.", category: 1, why: "A habit that avoids fake installers." } ]),
  branch("The slow family laptop", "A family laptop has become slow, shows pop-up ads, and a parent's bank password was used by someone else.", [
    { situation: "Which malware is most likely involved?", prompt: "Pick the best answer.", choices: [
      { text: "Spyware: it secretly collects information such as passwords and browsing, which explains the stolen bank password.", correct: true, feedback: "It names the type, what it does and links it to the evidence." },
      { text: "A spam filter.", correct: false, feedback: "That is a protection, not malware." },
      { text: "A firewall.", correct: false, feedback: "That is a protection, not malware." } ] },
    { situation: "How should the family protect the laptop?", prompt: "Pick the best answer.", choices: [
      { text: "Run anti-malware with real-time scanning and turn on automatic updates, and avoid unexpected attachments and unofficial downloads.", correct: true, feedback: "A tool and a habit, both tied to the problem." },
      { text: "Turn the laptop off permanently.", correct: false, feedback: "It does not protect the laptop in use." },
      { text: "Share the password with the whole family.", correct: false, feedback: "That makes it less secure." } ] } ]),
  flip("Check your understanding", [
    { tag: "Define", front: "What is malware?", back: "Any software designed to harm a computer or steal data, including viruses, spyware, ransomware and trojans." },
    { tag: "Compare", front: "How is a virus different from spyware?", back: "A virus attaches to files and spreads when they are opened or shared. Spyware secretly collects information such as passwords." } ]),
  "mentor", "testTip", "scenario", h("Assessment practice"), "extended", h("Test-ready recap"),
  standardRecap(["Name the malware type", "Say what it does, linked to the evidence in the scenario."], ["Pair a tool with a habit", "Software protection plus safe behaviour."], "At least 5/7 on the practice questions."),
  "last"]);

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(topic.lessons.map((l) => `${l.id}: ${l.blocks.length} blocks`).join("\n"));
