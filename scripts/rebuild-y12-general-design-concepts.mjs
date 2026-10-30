// Upgrades Y12 AIT General Unit 3 "Design Concepts" (7 lessons) in place: keeps every curated visual and photo,
// adds a video slot and tap interactives, and turns the test tip into cards. Safe to re-run (skips done lessons).
import fs from "node:fs";
import { h, video, flip, sorter, seq, branch, harvest } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const topic = course.units.find((u) => u.id === "unit3").topics.find((t) => t.id === "design-concepts");
const [L1, L2, L3, L4, L5, L6, L7] = topic.lessons;

function upgrade(l, vid, interactives) {
  if (l.blocks.some((b) => b.type === "videoSlot")) return; // already done
  const hv = harvest(l);
  l.estimatedMinutes = 45;
  // 1. test tip richText -> cards
  if (hv.testTip) {
    const i = l.blocks.findIndex((b) => b.type === "richText" && /Earns full marks/.test(b.html ?? ""));
    if (i >= 0) l.blocks[i] = hv.testTip;
  }
  // 2. video slot straight after the success criteria list
  const li = l.blocks.findIndex((b) => b.type === "list");
  l.blocks.splice(li + 1, 0, vid);
  // 3. interactives before the Test tip heading
  const ti = l.blocks.findIndex((b) => b.type === "heading" && /^Test tip/.test(b.text));
  l.blocks.splice(ti >= 0 ? ti : l.blocks.length, 0, h("Try it yourself"), ...interactives);
}

upgrade(L1, video("Spotting the five elements", 4, "A short clip pausing on a streaming app screen and naming where line, shape, space, texture and colour are used. Suggested source: a teacher-filmed annotated screen recording of a real app.", ["Where each element appears", "Why naming is not enough: describe how it is used", "How colour is used sparingly"]), [
  sorter("Which element is it?", "Tap the element each example shows.", ["Line", "Shape", "Space", "Texture", "Colour"], [
    { text: "A divider under a heading.", category: 0, why: "A mark joining two points." },
    { text: "Round buttons on an app.", category: 1, why: "A 2D area with a boundary." },
    { text: "Margins around text.", category: 2, why: "The area around and between items." },
    { text: "A paper-grain background.", category: 3, why: "How a surface looks like it would feel." },
    { text: "The brand colour on every button.", category: 4, why: "Hue used to link items." },
    { text: "Wide gaps between the drinks and food sections on a menu board.", category: 2, why: "Space between items." },
    { text: "A chalkboard-look background.", category: 3, why: "A rough, chalky texture." } ]),
  flip("Name or describe?", [
    { tag: "1 mark", front: "\"The app uses colour.\" Why does this earn only 1 mark?", back: "It names the element only. It does not say how it is used." },
    { tag: "2 marks", front: "How do you turn it into a 2-mark answer?", back: "Describe how it is used: red is used only on the logo and the play button, so these stand out from the dark background." } ])]);

upgrade(L2, video("Spotting the four principles", 4, "A short clip analysing a concert poster for balance, emphasis, dominance and unity. Suggested source: a teacher-filmed annotated walk-through of a real poster.", ["What the eye sees first", "How grouping creates unity", "How balance can be asymmetrical"]), [
  sorter("Which principle is it?", "Tap the principle each example shows.", ["Balance", "Emphasis", "Dominance", "Unity"], [
    { text: "A large hero image that is seen first.", category: 2, why: "One item is clearly most important." },
    { text: "A bright button on a grey page.", category: 1, why: "Contrast makes one item stand out." },
    { text: "The same font on every page.", category: 3, why: "Repetition makes parts belong together." },
    { text: "A centred title page, mirrored left and right.", category: 0, why: "Symmetrical balance." },
    { text: "Contact details grouped together.", category: 3, why: "Proximity creates unity." },
    { text: "A large photo on the left balanced by a column of text on the right.", category: 0, why: "Asymmetrical balance." } ]),
  sorter("Which technique?", "Each principle is created with techniques. Tap the technique.", ["Contrast", "Proportion", "Proximity", "Repetition"], [
    { text: "A difference in colour, size, shape or tone.", category: 0, why: "Contrast, used for emphasis." },
    { text: "The size of one item compared to another.", category: 1, why: "Proportion, used for emphasis." },
    { text: "Grouping related items close together.", category: 2, why: "Proximity, used for unity." },
    { text: "A small team logo repeated in each corner.", category: 3, why: "Repetition, used for unity." } ])]);

upgrade(L3, video("Linking an element to a principle", 4, "A short clip building a full answer from a screenshot: element, how it is used, principle and effect on the viewer. Suggested source: a teacher-filmed whiteboard demo.", ["The four parts of the answer pattern", "How a choice creates an effect", "Why element and principle are different"]), [
  sorter("Which principle does it create?", "Each choice is an element used a certain way. Tap the principle it creates.", ["Unity", "Emphasis", "Dominance", "Balance"], [
    { text: "Colour: the same brand colour on every heading.", category: 0, why: "Repetition creates unity." },
    { text: "Space: wide gaps between sections, tight gaps within a section.", category: 0, why: "Proximity creates unity." },
    { text: "Shape: one circle among many rectangles.", category: 1, why: "Contrast creates emphasis." },
    { text: "Line: lines lead from the edge towards the product photo.", category: 2, why: "The photo dominates." },
    { text: "Space: equal space on both sides of a centred logo.", category: 3, why: "Symmetrical balance." } ]),
  seq("Build the answer", "Tap the four parts of the answer pattern in order.", ["ELEMENT: what is being used, e.g. colour.", "HOW it is used: the button is bright green and the rest of the page is neutral.", "Creates a PRINCIPLE: contrast creates emphasis.", "EFFECT on the viewer: the shopper notices the button first."], "Element, how, principle, effect."),
  branch("The green button", "An online shop has a green Add to cart button on a white page.", [
    { situation: "Which full answer scores best?", prompt: "Pick the strongest.", choices: [
      { text: "The bright green button contrasts with the neutral page, creating emphasis so the shopper notices it first.", correct: true, feedback: "Element, how, principle and effect." },
      { text: "The page uses colour.", correct: false, feedback: "Names the element only." },
      { text: "The button is green and looks nice.", correct: false, feedback: "No principle and no effect." } ] } ])]);

upgrade(L4, video("Typography that works", 4, "A short clip comparing a clear and a hard-to-read bus departure screen on typeface, size, alignment, format and spacing. Suggested source: a teacher-filmed side-by-side comparison.", ["How size creates hierarchy", "Why sans serif suits screens", "What makes text readable at a distance"]), [
  sorter("Which part of typography?", "Tap the part each example shows.", ["Typeface", "Size", "Alignment", "Format", "Spacing"], [
    { text: "Arial for screen text.", category: 0, why: "The design of the letters." },
    { text: "Heading 32 pt, body 12 pt.", category: 1, why: "How big the text is." },
    { text: "Body text left-aligned.", category: 2, why: "How text lines up." },
    { text: "Bold for key terms.", category: 3, why: "A style applied to text." },
    { text: "Extra line spacing for readability.", category: 4, why: "Space between lines (leading)." } ]),
  sorter("Do or avoid?", "Which typography choices are good practice?", ["Do", "Avoid"], [
    { text: "Use one typeface for headings and one for body text.", category: 0, why: "Consistent and clear." },
    { text: "Use more than two typefaces.", category: 1, why: "Looks cluttered." },
    { text: "Long passages in capitals.", category: 1, why: "Hard to read." },
    { text: "Left-align body text.", category: 0, why: "Easier to read." },
    { text: "Script fonts for small text.", category: 1, why: "Hard to read at small sizes." },
    { text: "Keep strong text and background contrast.", category: 0, why: "Readable." } ]),
  branch("The retirement village newsletter", "A retirement village is designing a printed newsletter for residents, many of whom have poor eyesight.", [
    { situation: "Which two typography choices suit the residents?", prompt: "Pick the best answer.", choices: [
      { text: "A larger body size (for example 14 pt or more) and strong contrast between dark text and a plain light background, so the text is easier to read.", correct: true, feedback: "Two choices, each with a reason tied to poor eyesight." },
      { text: "A small script font to look elegant.", correct: false, feedback: "Hard for poor eyesight." },
      { text: "Tight line spacing to fit more in.", correct: false, feedback: "Makes lines merge." } ] },
    { situation: "Why may justified alignment be a poor choice?", prompt: "Pick the best answer.", choices: [
      { text: "Justified text creates uneven gaps between words, which makes lines harder to follow for readers with poor eyesight.", correct: true, feedback: "The effect on these readers." },
      { text: "It is illegal.", correct: false, feedback: "Not true." },
      { text: "It uses more ink.", correct: false, feedback: "Not the reason." } ] } ])]);

upgrade(L5, video("Composition: thirds, grids and alignment", 4, "A short clip fixing a centred banner photo using the rule of thirds, a grid and alignment. Suggested source: a teacher-filmed screen recording in Canva or Photopea.", ["Where the thirds lines sit", "How a grid sets columns and margins", "What alignment adds"]), [
  sorter("Which rule?", "Tap the rule each description fits.", ["Rule of thirds", "Grid", "Alignment", "Focal point"], [
    { text: "Divide the frame into a 3 x 3 grid and place key items on the lines or crossings.", category: 0, why: "The rule of thirds." },
    { text: "Invisible columns and rows used to place content consistently.", category: 1, why: "A grid." },
    { text: "Lining up the edges or centres of items so they look connected.", category: 2, why: "Alignment." },
    { text: "The first place the eye goes.", category: 3, why: "The focal point." } ]),
  seq("Lay out a page in four steps", "Tap the steps in order.", ["Set a grid: choose columns and margins first.", "Place the focal point on a thirds line.", "Align everything: snap text and images to the grid lines.", "Check the space: keep equal gaps between items of the same type."], "Grid, focal point, align, check the space."),
  branch("The school play post", "A student's Instagram post for a school play has the title, date, photo and ticket link all centred and stacked down the middle, with different gaps between each.", [
    { situation: "How could a grid and alignment improve it?", prompt: "Pick the best answer.", choices: [
      { text: "A grid would give every item the same margins and column edges, and aligning the text to one edge would make the post look organised and connected, with equal gaps between items.", correct: true, feedback: "Grid and alignment, each with an effect." },
      { text: "Add more items.", correct: false, feedback: "Makes it more cluttered." },
      { text: "Use bigger text everywhere.", correct: false, feedback: "Not a grid or alignment fix." } ] } ])]);

upgrade(L6, video("Analysing a product in four moves", 4, "A short clip analysing a pizza ordering screen: scan, name, explain, judge. Suggested source: a teacher-filmed annotated screen recording.", ["What the eye sees first, second, third", "How to name the element and the principle", "How to give a strength, a weakness and a fix"]), [
  seq("Analyse in four moves", "Tap the four moves in order.", ["Scan: what do you see first, second, third?", "Name: which elements and principles cause that order?", "Explain: element + how + principle + effect.", "Judge: one strength, one weakness, one fix."], "Scan, name, explain, judge."),
  sorter("Which command term?", "Tap the level each answer is written at.", ["Identify", "Describe", "Explain", "Evaluate"], [
    { text: "The element is colour.", category: 0, why: "Names the element only." },
    { text: "Red is used only on the Order now button.", category: 1, why: "Says how it is used." },
    { text: "The red button contrasts with the white background, creating emphasis so the user sees it first.", category: 2, why: "Element, how, principle and effect." },
    { text: "The prices are too small and pale, so make them bold and darker.", category: 3, why: "A judgement with a reason and an improvement." } ]),
  branch("The council event website", "A council event website home page has a full-width photo of fireworks, the event name in large white text over the photo, and four equal buttons below: Map, Food, Parking, Tickets.", [
    { situation: "Explain a relationship between one element and unity.", prompt: "Pick the best answer.", choices: [
      { text: "Shape: four equal buttons of the same size repeat across the page, creating unity so the visitor sees them as one set of options.", correct: true, feedback: "Element, how, principle and effect, tied to the page." },
      { text: "The page has buttons.", correct: false, feedback: "Names only." },
      { text: "The fireworks are pretty.", correct: false, feedback: "No element, principle or effect." } ] } ])]);

upgrade(L7, video("Modify and annotate", 4, "A short clip redesigning a cluttered flyer to meet a brief and annotating the changes. Suggested source: a teacher-filmed screen recording using the dog-walking flyer.", ["What the brief requires", "How each change is annotated", "Where the annotation sits next to the part"]), [
  sorter("Weak or strong annotation?", "Strong annotations name the choice, the design term and the reason.", ["Weak", "Strong"], [
    { text: "Nice colours", category: 0, why: "No term and no reason." },
    { text: "Phone number in bold orange, contrasting with the navy background, so it is the second focal point.", category: 1, why: "Names the choice, the term and the effect." },
    { text: "Logo", category: 0, why: "A label only." },
    { text: "Services grouped in one box (proximity) with matching paw icons (repetition).", category: 1, why: "Names the terms and the effect of unity." },
    { text: "Big title", category: 0, why: "No reason." },
    { text: "One sans serif typeface; heading 36 pt, body 14 pt, left-aligned for easy reading.", category: 1, why: "Typography choices with a reason." } ]),
  flip("The annotation formula", [
    { tag: "Formula", front: "What are the three parts of a detailed annotation?", back: "WHAT you did + DESIGN TERM + WHY or EFFECT." },
    { tag: "Check", front: "Why does a design with no annotations score low?", back: "The marker cannot see your reasoning, so even good choices earn no marks." } ]),
  branch("The bakery post", "A bakery's draft Instagram post has the logo in the centre, the opening hours in tiny text at the bottom, and five different fonts. The owner wants people to notice the new Saturday hours.", [
    { situation: "Which two modifications best meet the owner's need?", prompt: "Pick the best answer.", choices: [
      { text: "Make the Saturday hours large and bold in a contrasting colour so they are the focal point, and reduce the five fonts to one or two so the post looks unified.", correct: true, feedback: "Two changes tied to the brief." },
      { text: "Make the logo bigger.", correct: false, feedback: "Does not help the hours stand out." },
      { text: "Add two more fonts.", correct: false, feedback: "Makes it worse." } ] } ])]);

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(topic.lessons.map((l) => `${l.id}: ${l.blocks.length} blocks`).join("\n"));
