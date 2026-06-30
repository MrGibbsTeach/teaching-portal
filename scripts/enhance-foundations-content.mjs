// Enhances ait-foundations.json with:
//  - Hook callout on first lesson of each topic
//  - Video search callout in middle of each lesson
//  - True/false questions interspersed (2 per lesson)
//  - Celebration wrap-up callout at end of each lesson
// Run with: node scripts/enhance-foundations-content.mjs

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataFile = join(root, "lib/content/data/ait-foundations.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

// Per-topic hook callouts (shown at START of first lesson only)
const TOPIC_HOOKS = {
  c11_1: "Have you ever wondered what goes on INSIDE your computer when you switch it on? 🖥️ By the end of this topic you'll know exactly what every part does — and how to keep yourself healthy using one.",
  c11_2: "Have you ever sent an important document and then spotted a spelling mistake? 😬 Word processing software has tools to stop that happening. Let's learn them.",
  c11_3: "Have you ever sat through a boring presentation and thought 'I could do better'? 🎤 By the end of this topic, you will be able to.",
  c11_4: "Have you ever received a weird email asking you to click a link or enter your password? 🚨 That's a phishing attack. This topic teaches you how to spot them — and stay safe online.",
  c11_5: "Ever started a big project and not known where to begin? 📋 This topic gives you a step-by-step design process that keeps you organised from start to finish.",
  c11_6: "Did you know businesses use spreadsheets to track millions of numbers automatically? 📊 By the end of this topic, you'll be able to build one yourself.",
  c11_7: "What tools do you use to talk to people online? 💬 This topic covers blogs, forums, social media, and e-commerce — and the smart ways to use them.",
  e11_2: "Have you ever made a poster, a birthday card, or a flyer? 🎨 Desktop publishing software makes professional-looking designs easy. Let's explore it.",
  e11_4: "What makes a photo go from boring to brilliant? 📸 This topic teaches you the secrets of composition and editing that professional photographers use.",
  c12_1: "Year 12 — let's go deeper. How do businesses protect their computers from viruses and hackers? 🔒 This topic covers real threats and how to stop them.",
  c12_2: "Did you know 'data' and 'information' are actually different things? 🤯 This topic also shows you advanced formatting, backup strategies, and how to never lose your files.",
  c12_3: "How do great designers make slides that keep an audience watching? 🎨 This topic adds new Year 12 design principles — unity, proportion, and contrast — to your toolkit.",
  c12_4: "How do big companies manage teams working on the same project? 👥 This topic covers team roles, collaboration strategies, and the full design process.",
  e12_4: "Have you ever wondered how websites get built? 🌐 By the end of this topic, you'll understand website design from layout to publishing.",
  c12_5: "What would happen to your job chances if you posted something embarrassing online right now? 😬 This topic is about your digital reputation — and how to protect it.",
  c12_6: "Can a spreadsheet formula save you hours of work? Yes — and in Year 12 we add percentage formulas, more chart types, and design for a real audience. ⚡",
  e12_1: "Did you know every song, podcast and movie you've ever heard has been edited? 🎙️ This topic teaches you how to create and edit audio files like a pro.",
  e12_2: "Want to make your own mini movie? 🎬 This topic walks you through video editing — cuts, transitions, titles, and creating for an audience.",
};

// Per-topic YouTube search suggestions (shown once per lesson in middle)
const TOPIC_VIDEO_SEARCHES = {
  c11_1: "how computers work for beginners",
  c11_2: "word processing tips beginners",
  c11_3: "how to make a good presentation students",
  c11_4: "how to stay safe online teenagers",
  c11_5: "design process steps explained",
  c11_6: "spreadsheets for beginners tutorial",
  c11_7: "how social media works explained simply",
  e11_2: "desktop publishing tutorial beginners",
  e11_4: "photography composition tips beginners",
  c12_1: "how antivirus and firewalls work simply",
  c12_2: "file management tips students",
  c12_3: "elements and principles of design explained",
  c12_4: "how to work in a team effectively",
  e12_4: "how websites are built for beginners",
  c12_5: "digital footprint and online reputation teens",
  c12_6: "spreadsheet charts and formulas tutorial",
  e12_1: "sound editing tutorial beginners",
  e12_2: "video editing tutorial beginners",
};

// True/false question bank per topic (2 per topic, cycled across lessons)
const TOPIC_TF_QUESTIONS = {
  c11_1: [
    { text: "A keyboard is an INPUT device. ⌨️", correctAnswer: true, explanation: "A keyboard sends information INTO the computer, so it is an input device." },
    { text: "Software is the physical parts of a computer you can touch. 🖱️", correctAnswer: false, explanation: "Software is programs and apps — things you can't touch. Hardware is the physical parts you can touch." },
  ],
  c11_2: [
    { text: "Spell check will always catch every mistake in your document. ✏️", correctAnswer: false, explanation: "Spell check misses correctly-spelled words used in the wrong way, like 'their' instead of 'there'." },
    { text: "Saving a file with a new version number (like v2) is good version control. 📂", correctAnswer: true, explanation: "Version numbers let you track changes and go back to an earlier version if needed." },
  ],
  c11_3: [
    { text: "Too many animations in a presentation make it look MORE professional. ✨", correctAnswer: false, explanation: "Too many animations are distracting. Presentations should be clear and easy to follow." },
    { text: "You should always think about your TARGET AUDIENCE when making a presentation. 👥", correctAnswer: true, explanation: "Different audiences need different language, visuals, and levels of detail." },
  ],
  c11_4: [
    { text: "It is safe to share your home address in a public online forum. 🏠", correctAnswer: false, explanation: "Never share your home address, school, or location details publicly online — this puts you at risk." },
    { text: "A phishing email often pretends to be from a trusted organisation like a bank. 🎣", correctAnswer: true, explanation: "Phishing emails look real but are designed to trick you into giving away personal details or passwords." },
  ],
  c11_5: [
    { text: "The PRODUCE stage is the very FIRST step in the design process. 🏗️", correctAnswer: false, explanation: "Investigate & Plan comes first. You always research and plan before you start producing." },
    { text: "Self-evaluation means you check your own work to see if it meets the brief. ✅", correctAnswer: true, explanation: "Self-evaluation is when YOU review your own work against the original goals." },
  ],
  c11_6: [
    { text: "Cell B3 means column 3, row B. 📊", correctAnswer: false, explanation: "Cell addresses are COLUMN then ROW. B3 means column B, row 3." },
    { text: "The SUM function adds up a range of numbers in a spreadsheet. ➕", correctAnswer: true, explanation: "=SUM(B2:B6) adds up all the numbers from cell B2 to B6." },
  ],
  c11_7: [
    { text: "E-commerce means buying and selling things using the internet. 🛒", correctAnswer: true, explanation: "E-commerce (electronic commerce) covers all buying, selling, and banking done online." },
    { text: "A blog is a website where groups discuss topics by posting replies to each other. 💬", correctAnswer: false, explanation: "That describes a FORUM. A blog is a personal website with regular written posts, usually by one author." },
  ],
  e11_2: [
    { text: "A text frame and an image frame are the same thing in desktop publishing. 📄", correctAnswer: false, explanation: "A text frame holds written text; an image frame holds photos or graphics. They are different frames." },
    { text: "Desktop publishing software lets you create brochures, calendars, and cards. 🗓️", correctAnswer: true, explanation: "Desktop publishing is designed for creating professional layouts like brochures, flyers, and cards." },
  ],
  e11_4: [
    { text: "A higher resolution photo always has SMALLER file size. 📷", correctAnswer: false, explanation: "Higher resolution means MORE detail, which means a LARGER file size." },
    { text: "The rule of thirds means placing your subject off-centre to create a more interesting photo. 📐", correctAnswer: true, explanation: "The rule of thirds divides the image into a 3×3 grid. Placing subjects at the intersections makes photos more dynamic." },
  ],
  c12_1: [
    { text: "An antivirus program detects and removes software threats from your computer. 🦠", correctAnswer: true, explanation: "Antivirus software scans your computer for viruses, malware, and other threats and removes them." },
    { text: "You can safely leave a computer in direct sunlight to keep it warm. ☀️", correctAnswer: false, explanation: "Heat damages computer components. Computers need ventilation and should not be left in direct sunlight." },
  ],
  c12_2: [
    { text: "A local backup is stored on a device in a different physical location to the original. 💾", correctAnswer: false, explanation: "A local backup is stored nearby (on an external drive or USB). A REMOTE backup is stored in a different location, like the cloud." },
    { text: "The thesaurus tool in word processing software suggests alternative words with similar meanings. 📖", correctAnswer: true, explanation: "The thesaurus helps you find synonyms — different words that mean the same thing — to improve your writing." },
  ],
  c12_3: [
    { text: "UNITY in design means every element on the slide looks like it belongs together. 🎨", correctAnswer: true, explanation: "Unity means the design feels consistent — same fonts, colours, and style used throughout so everything connects." },
    { text: "EMPHASIS means making everything on the slide the same size so nothing stands out. 📐", correctAnswer: false, explanation: "Emphasis means making the MOST important thing stand out — through size, colour, or contrast. Not everything the same." },
  ],
  c12_4: [
    { text: "The MEDIA COORDINATOR in a project team is responsible for researching information. 🔍", correctAnswer: false, explanation: "The RESEARCHER collects information. The MEDIA COORDINATOR manages photos, videos, and other media files." },
    { text: "Setting group work protocols at the start of a project helps a team work more efficiently. 📋", correctAnswer: true, explanation: "Clear agreements about how the team will communicate, share files, and divide work prevent confusion later." },
  ],
  e12_4: [
    { text: "A WYSIWYG web editor shows you what the page will look like as you build it. 👀", correctAnswer: true, explanation: "WYSIWYG stands for 'What You See Is What You Get' — the editor shows a live preview as you add content." },
    { text: "Every page on a website should have a different navigation menu to keep things interesting. 🗺️", correctAnswer: false, explanation: "Navigation should be CONSISTENT across all pages so users always know how to find their way around." },
  ],
  c12_5: [
    { text: "Once you delete a post on social media, it is completely gone forever. 🗑️", correctAnswer: false, explanation: "Once something is posted online, it can be copied, screenshotted, or cached. You may not be able to remove it completely." },
    { text: "Inappropriate online behaviour can damage your employment chances. 💼", correctAnswer: true, explanation: "Employers often check social media. Negative or inappropriate posts can stop you getting a job — even years later." },
  ],
  c12_6: [
    { text: "A PIE chart is the best choice for showing how values change over time. 🥧", correctAnswer: false, explanation: "A LINE chart is best for showing change over time. Pie charts show how parts make up a whole (percentages)." },
    { text: "The formula =A2/B2*100 calculates A2 as a percentage of B2. 💯", correctAnswer: true, explanation: "Dividing one number by another and multiplying by 100 gives you the percentage. This is the standard percentage formula." },
  ],
  e12_1: [
    { text: "MP3 files are generally LARGER in file size than WAV files. 🎵", correctAnswer: false, explanation: "MP3 is a COMPRESSED format — it has smaller file sizes than WAV, which is uncompressed and has higher quality." },
    { text: "Sound editing software lets you combine two or more audio clips into one file. 🎧", correctAnswer: true, explanation: "Combining audio clips is a core sound editing skill — used in music, podcasts, and film soundtracks." },
  ],
  e12_2: [
    { text: "A project file in video editing contains all the final exported video data ready to share. 🎬", correctAnswer: false, explanation: "A project file is the EDITABLE file used in the editing software. An EXPORTED file is the finished video you share." },
    { text: "Aspect ratio 16:9 is the standard widescreen format used for most videos and presentations. 📺", correctAnswer: true, explanation: "16:9 is the standard widescreen ratio used on TVs, computers, YouTube, and most video content." },
  ],
};

function makeHookCallout(topicId) {
  const text = TOPIC_HOOKS[topicId] || "Let's get started with this topic! 🚀";
  return {
    type: "callout",
    variant: "hook",
    heading: "Think about it… 🤔",
    text,
  };
}

function makeVideoCallout(topicId, lessonTitle) {
  const search = TOPIC_VIDEO_SEARCHES[topicId] || lessonTitle.toLowerCase();
  return {
    type: "callout",
    variant: "video",
    heading: "🎬 Watch & Learn",
    text: `Open YouTube and search: "${search}" — watch a short video to see this in real life before moving on.`,
  };
}

function makeEndCallout(lessonTitle) {
  const celebrations = ["🎉", "⭐", "🏆", "🌟", "✅", "👏", "🎊"];
  const emoji = celebrations[Math.floor(Math.random() * celebrations.length)];
  return {
    type: "callout",
    variant: "success",
    heading: `Well done! ${emoji}`,
    text: `You've completed "${lessonTitle}". Tap 'Next' to keep going, or come back anytime to review.`,
  };
}

function makeTrueFalse(question) {
  return {
    type: "quizQuestion",
    question: {
      questionType: "true_false",
      text: question.text,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    },
  };
}

let totalAdded = 0;

for (const unit of data.units) {
  for (const topic of unit.topics) {
    const tfBank = TOPIC_TF_QUESTIONS[topic.id] || [];
    let tfIndex = 0;

    for (let li = 0; li < topic.lessons.length; li++) {
      const lesson = topic.lessons[li];
      const isFirstLesson = li === 0;
      const newBlocks = [...lesson.blocks];

      // 1. Hook callout at very start of first lesson only
      if (isFirstLesson) {
        newBlocks.unshift(makeHookCallout(topic.id));
        totalAdded++;
      }

      // 2. Insert a true/false question after block index 3 (if we have one)
      if (tfBank.length > 0) {
        const tf = tfBank[tfIndex % tfBank.length];
        tfIndex++;
        const insertAt = Math.min(4, Math.floor(newBlocks.length / 2));
        newBlocks.splice(insertAt, 0, makeTrueFalse(tf));
        totalAdded++;
      }

      // 3. Video search callout roughly 2/3 through the blocks
      const videoAt = Math.min(Math.floor(newBlocks.length * 0.65), newBlocks.length - 2);
      newBlocks.splice(videoAt, 0, makeVideoCallout(topic.id, lesson.title));
      totalAdded++;

      // 4. End-of-lesson celebration callout
      newBlocks.push(makeEndCallout(lesson.title));
      totalAdded++;

      lesson.blocks = newBlocks;
    }
  }
}

writeFileSync(dataFile, JSON.stringify(data, null, 1), "utf8");
const totalBlocks = data.units.flatMap(u => u.topics).flatMap(t => t.lessons).reduce((a, l) => a + l.blocks.length, 0);
console.log(`Added ${totalAdded} blocks. Total now: ${totalBlocks} blocks across ${data.units.flatMap(u=>u.topics).flatMap(t=>t.lessons).length} lessons.`);
