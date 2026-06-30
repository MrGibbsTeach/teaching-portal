// Enhances year-11-applied-it-general.json with career/industry/workforce context.
// Adds: Career Connection callouts, Industry Tip callouts, real-world scenario
// openers at the start of each lesson, and a few extended-answer quiz questions.
// Run with: node scripts/enhance-general-y11.mjs

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataFile = join(root, "lib/content/data/year-11-applied-it-general.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

// Per-lesson scenario hooks (lesson id → hook text)
// Covers the most impactful lessons; others get a generic topic hook.
const LESSON_HOOKS = {
  // Unit 1 – Personal Communication
  "elements-of-design": "A design agency has hired you as a junior designer. Your first task: audit a client's flyer and identify every design element used. Ready?",
  "principles-of-design": "A client's website looks 'busy and hard to read' — your job is to diagnose which design principles are missing and propose fixes.",
  "typography": "A startup wants a new brand identity. You've been asked to select fonts that match their values. What do you choose and why?",
  "colour-theory": "A health app wants to use red as its primary colour. Should they? Consider the psychological and accessibility implications.",
  "compositional-rules": "A photographer sends you 10 photos and asks which ones will work best for their new website header. How do you evaluate them?",
  "layout-and-design": "Your manager asks you to redesign an internal HR form to improve usability. Apply what you know about layout and design.",
  // Hardware
  "computer-systems": "A small business asks for advice on whether to buy desktop PCs, laptops, or a server. Walk them through the decision.",
  "cpu-and-memory": "A video editor's computer is running slowly. Based on what you know about CPU and memory, what upgrades would you recommend?",
  "input-output-devices": "A new office needs to be equipped with the right peripherals for 5 staff. Build a list with justifications.",
  "troubleshooting": "A colleague's computer won't print. Walk through your systematic troubleshooting approach step by step.",
  "storage-and-peripherals": "A photographer needs to store 500GB of RAW image files securely and access them from multiple devices. What solution do you recommend?",
  // Impacts of Technology
  "whs-and-ergonomics": "An employee reports wrist pain after a week of intense computer use. As the IT coordinator, what immediate and long-term actions do you take?",
  "digital-citizenship": "A staff member has posted about a client on social media without realising it breaches company policy. How do you handle it?",
  "privacy-and-information": "A data breach at your company exposed 10,000 customer records. Walk through what happened, what laws apply, and what your next steps are.",
  "technology-disposal": "Your school is upgrading 30 computers. What are the responsible and legally compliant ways to dispose of the old equipment?",
  "digital-vs-traditional": "A marketing manager asks whether to run a print or digital campaign. What factors would you consider to advise them?",
  "online-implications": "A job applicant's old social media posts are discovered during a background check. Discuss the implications for them and the hiring company.",
  // Application Skills
  "word-processing-advanced": "You've been asked to create a professional proposal document for a client. What word processing features will ensure it looks polished?",
  "spreadsheet-basics": "A café owner wants to track weekly revenue and calculate average daily sales. Help them build a spreadsheet from scratch.",
  "spreadsheet-functions": "A school timetabling officer needs to automatically calculate student hours. Which functions solve this problem?",
  "email-and-communication": "You've received an ambiguous work email that could be misinterpreted. How do you respond professionally, and what email practices should you follow?",
  "collaborative-tools": "Your team is working remotely on a group project. Which collaborative software tools would you use and why?",
  "document-design": "A non-profit asks you to redesign their annual report for online and print. How do layout and design considerations change between the two?",
  "application-integration": "A marketing team uses separate tools for email, spreadsheets, and presentations. How can they integrate these to work more efficiently?",
  "software-troubleshooting": "A colleague can't get a piece of software to run. Walk through the troubleshooting strategies you'd use, from manuals to peer support.",
  // Project Management
  "design-brief": "A client has given you a vague brief: 'make a website that looks modern'. How do you clarify requirements before starting?",
  "design-process": "Explain how the design process prevents wasted effort — using an example where skipping a stage caused problems.",
  "time-management": "You're juggling 3 school projects due in the same week. How do you prioritise and schedule to meet all deadlines?",
  "evaluation-methods": "Your team has just finished a project. Design an evaluation strategy using peer, self, and target audience feedback.",
  // Unit 2 – Working with Others
  "data-reliability": "You're researching IT salary data for a report. How do you assess whether the sources you've found are accurate and reliable?",
  "search-strategies": "An HR manager needs to find specific legislation online quickly. Teach them Boolean search operators with a worked example.",
  "file-formats": "A client sends you a design file you can't open. How do you handle incompatible file formats in a professional setting?",
  "file-management": "A freelancer's computer crashes and they lose a month of work. What file management and backup practices should they have had in place?",
  "network-components": "A new café owner wants to offer Wi-Fi to customers. Help them understand the hardware they need.",
  "wireless-networks": "A staff member can't connect to the office Wi-Fi. Walk through how you'd diagnose and fix the connectivity issue.",
  "network-security": "A small business hasn't updated their router password or antivirus in 2 years. What risks does this create and what should they do?",
  // Impacts Unit 2
  "computer-crime": "A company's system was hacked and customer data stolen. What type of computer crime is this, and what laws apply in Australia?",
  "copyright-and-ip": "A student uses an image from Google in their school project without attribution. Is this legal? What should they have done?",
  "cyberbullying": "An employee is being harassed via work email. What laws protect them and what should the employer do?",
  "digital-health": "Research suggests excessive screen time impacts mental health. As an IT professional, how do you balance technology use at work?",
  // Application Skills Unit 2
  "presentation-software": "You need to present a technical proposal to a non-technical board of directors. How does this audience affect your presentation design?",
  "audio-editing": "A podcast team asks for help editing their first episode — removing background noise and cutting filler words. Walk through the process.",
  "image-manipulation": "A product photo needs editing for an online store listing. List the image manipulation steps you'd take.",
  "online-databases": "A researcher needs to find peer-reviewed IT articles fast. How do online databases help, and how do you search them effectively?",
  // Project Management Unit 2
  "design-process-u2": "A client brief asks for 'a social media campaign'. Break this down using the full design process from identify-a-need to evaluate.",
  "storyboards-wireframes": "Why do professional web developers create wireframes before writing any code? What can go wrong if they skip this step?",
  "project-timeline": "A digital project is running 2 weeks behind schedule. What time management strategies help you recover?",
  "evaluation-and-review": "After delivering a website to a client, they request 5 major changes. How do you handle this professionally using your evaluation framework?",
  "portfolio-and-presentation": "You're presenting your digital project to the class. What makes a strong project presentation — structure, delivery, and documentation?",
  "backup-and-version-control": "A developer accidentally deletes a week's worth of code. How does proper backup and version control prevent this disaster?",
};

// Topic-level career connection callouts
const TOPIC_CAREER_CALLOUTS = {
  "design-concepts": {
    heading: "💼 Career Connection: Graphic & UI Designer",
    text: "Graphic designers, UI/UX designers, and web developers use these design principles every day. Roles like UX Designer and Brand Manager start with exactly this knowledge. Top tools: Figma, Canva, Adobe Creative Suite.",
  },
  "hardware": {
    heading: "💼 Career Connection: IT Support & Systems Administrator",
    text: "IT support technicians and systems administrators need deep hardware knowledge to troubleshoot, recommend, and maintain computer systems. CompTIA A+ certification tests these exact concepts.",
  },
  "impacts-of-technology": {
    heading: "💼 Career Connection: IT Policy, Legal & Compliance",
    text: "Every IT role requires understanding of privacy law, copyright, and ethical digital practices. Data Protection Officers and Compliance Analysts specialise in exactly these areas.",
  },
  "application-skills": {
    heading: "💼 Career Connection: Digital Productivity & Administration",
    text: "Proficiency in word processing, spreadsheets, email, and collaboration tools is required for virtually every modern office job — and the ability to train others in these tools is even more valuable.",
  },
  "project-management": {
    heading: "💼 Career Connection: IT Project Manager",
    text: "Project management is one of the most in-demand IT skills. Roles like Junior Project Manager or Business Analyst rely heavily on design process thinking, time management, and client communication.",
  },
  "managing-data": {
    heading: "💼 Career Connection: Data Analyst & Database Administrator",
    text: "Data management skills are foundational for Data Analysts, Database Administrators, and anyone working with business intelligence. Understanding file formats, search strategies, and version control is essential.",
  },
  "networks": {
    heading: "💼 Career Connection: Network Engineer & IT Infrastructure",
    text: "Network Engineers and Systems Administrators design and maintain the networks that businesses run on. Cisco certifications (CCNA) and CompTIA Network+ test these concepts at a professional level.",
  },
};

// Industry tip bank (cycled per lesson)
const INDUSTRY_TIPS = [
  { heading: "🏭 Industry Tip", text: "In the IT industry, documentation matters as much as the technical work itself. Always write clear notes, comments, and reports — they're what clients and colleagues rely on." },
  { heading: "🏭 Industry Tip", text: "Most IT employers rate communication skills as highly as technical skills. Practice explaining complex concepts in simple terms." },
  { heading: "🏭 Industry Tip", text: "Version control is standard practice in professional IT teams. Never overwrite a file without saving the previous version first." },
  { heading: "🏭 Industry Tip", text: "When troubleshooting, always start with the simplest explanation first (cable unplugged? power on?) before assuming a complex problem." },
  { heading: "🏭 Industry Tip", text: "Professional IT workers keep a log of every issue they encounter and how they solved it. This becomes an invaluable personal knowledge base." },
  { heading: "🏭 Industry Tip", text: "Cloud services like Google Workspace, Microsoft 365, and Dropbox are standard in most workplaces. Knowing them well gives you an immediate edge." },
  { heading: "🏭 Industry Tip", text: "Backup your work. The industry rule: 3-2-1 backup — 3 copies, on 2 different media types, with 1 offsite (cloud)." },
  { heading: "🏭 Industry Tip", text: "Security is everyone's job, not just the IT department's. Phishing attacks succeed because employees don't recognise them — understanding these threats makes you a valuable team member." },
];

function makeScenarioHook(lessonId, lessonTitle, topicId) {
  const text = LESSON_HOOKS[lessonId] ||
    `In the real world, this topic comes up constantly in IT roles. As you work through this lesson, think about how it applies to the kind of IT job you'd like to do.`;
  return {
    type: "callout",
    variant: "hook",
    heading: `🌐 Real World Scenario`,
    text,
  };
}

function makeCareerCallout(topicId) {
  const career = TOPIC_CAREER_CALLOUTS[topicId];
  if (!career) return null;
  return { type: "callout", variant: "hook", ...career };
}

function makeIndustryTip(index) {
  const tip = INDUSTRY_TIPS[index % INDUSTRY_TIPS.length];
  return { type: "callout", ...tip };
}

function makeExtendedQuestion(lessonId, lessonTitle) {
  return {
    type: "quizQuestion",
    question: {
      questionType: "extended",
      text: `Reflect on what you've learned in this lesson. Describe how the concepts covered in "${lessonTitle}" could apply in a real IT workplace scenario. Give a specific example.`,
      marks: 4,
      explanation: `A strong answer names a specific role or industry context, connects the lesson content directly to a real task or decision, and shows understanding of why this knowledge matters in practice.`,
    },
  };
}

let totalAdded = 0;
let tipIndex = 0;

for (const unit of data.units) {
  for (const topic of unit.topics) {
    const careerCallout = makeCareerCallout(topic.id);

    for (let li = 0; li < topic.lessons.length; li++) {
      const lesson = topic.lessons[li];

      // 1. Add scenario hook at start of EVERY lesson
      lesson.blocks.unshift(makeScenarioHook(lesson.id, lesson.title, topic.id));
      totalAdded++;

      // 2. Add career callout at start of first lesson only
      if (li === 0 && careerCallout) {
        lesson.blocks.splice(1, 0, careerCallout);
        totalAdded++;
      }

      // 3. Add industry tip roughly 2/3 through the lesson
      const tipAt = Math.min(Math.floor(lesson.blocks.length * 0.65), lesson.blocks.length - 2);
      lesson.blocks.splice(tipAt, 0, makeIndustryTip(tipIndex++));
      totalAdded++;

      // 4. Add extended reflection question at end of last lesson of each topic
      if (li === topic.lessons.length - 1) {
        lesson.blocks.push(makeExtendedQuestion(lesson.id, lesson.title));
        totalAdded++;
      }
    }
  }
}

writeFileSync(dataFile, JSON.stringify(data, null, 1), "utf8");
const totalBlocks = data.units.flatMap(u => u.topics).flatMap(t => t.lessons).reduce((a, l) => a + l.blocks.length, 0);
const totalLessons = data.units.flatMap(u => u.topics).flatMap(t => t.lessons).length;
console.log(`Y11 General enhanced: +${totalAdded} blocks. Total: ${totalBlocks} blocks across ${totalLessons} lessons.`);
