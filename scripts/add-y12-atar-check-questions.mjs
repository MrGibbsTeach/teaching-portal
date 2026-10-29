// New per-lesson check questions for the 3 Y12 ATAR topics Clayton confirmed (2026-10-21)
// are thin on check questions: design-concepts-1 (1/5 lessons had any), managing-data-6
// (6/14), application-skills-9 (2/4). These lessons came from Clayton's own source docs
// verbatim with no quiz blocks, unlike the sibling lessons in the same topics that do have
// two "extended" WACE-style questions each. Written in that same house style (marks +
// marking-key explanation, second question a scenario), grounded in each lesson's own
// content. Idempotent: skips lessons that already have a quizQuestion block.
import { readFileSync, writeFileSync } from "node:fs";

const q = (id, text, marks, explanation) => ({
  type: "quizQuestion",
  question: { id, questionType: "extended", text, marks, explanation },
});

const ADD = {
  "design-concepts-1-1-atar-notes-for-elements-and-principles": [
    q(
      "design-concepts-1-1-atar-notes-for-elements-and-principles-q1",
      "Describe the difference between a design element and a design principle.",
      2,
      '2 marks – describes elements as the building blocks of visual design (e.g. line, colour, shape) and principles as the rules used to organise and arrange those elements\n1 mark – states a relevant point, e.g. "elements are things you use, principles are the rules"',
    ),
    q(
      "design-concepts-1-1-atar-notes-for-elements-and-principles-q2",
      "A Year 12 student writes in an exam: \"The designer used emphasis.\" Using the three-part exam format taught in this lesson, explain what else the student needs to add to this answer to gain full marks.",
      3,
      "3 marks – explains that the answer must also identify the elements used to create the emphasis (e.g. colour and shape) and describe the effect this has on the user (e.g. captures attention and leads the eye to a key area)\n2 marks – identifies one of the two missing parts\n1 mark – states that more detail is needed\n\nAnswers could include: the student has only stated the principle; they still need to identify the elements used (e.g. colour and shape) and describe the effect (e.g. captures attention, leads the eye to a key area).",
    ),
  ],
  "design-concepts-1-2-design-elements": [
    q(
      "design-concepts-1-2-design-elements-q1",
      "Describe how the design element of space can be used to direct a viewer's attention on a webpage.",
      2,
      '2 marks – describes how space (positive/negative) is used to avoid clutter and focus the viewer\'s attention on a specific item, e.g. using white space around a key image\n1 mark – states a relevant point, e.g. "space stops the page looking too busy"',
    ),
    q(
      "design-concepts-1-2-design-elements-q2",
      "A café wants its new website to feel calm and cohesive, using only shades of green throughout. Identify the type of colour scheme this is, and explain one advantage of using it.",
      3,
      "3 marks – identifies a monochromatic colour scheme and explains an advantage linked to the café, e.g. it reduces visual clutter and allows other elements like the menu or photos to stand out, creating a calm, unified look that suits a relaxed café brand\n2 marks – identifies the scheme and states an advantage\n1 mark – identifies the scheme only",
    ),
  ],
  "design-concepts-1-3-design-principles": [
    q(
      "design-concepts-1-3-design-principles-q1",
      "Explain the difference between contrast and proportion as ways of creating emphasis in a design.",
      2,
      "2 marks – explains contrast as the use of different or opposing colours/tones to make an element stand out, and proportion as the relative size of an element, where larger elements appear more important\n1 mark – describes one of the two correctly",
    ),
    q(
      "design-concepts-1-3-design-principles-q2",
      "A website's \"Buy Now\" button is the same size and colour as the surrounding text. Using the design principles from this lesson, explain two changes that would create stronger emphasis on the button.",
      3,
      "3 marks – explains two valid changes linked to the principles taught, e.g. increasing the button's proportion (making it larger than the surrounding text) and using a contrasting colour (e.g. an opposite colour on the colour wheel) so it stands out against the background\n2 marks – explains one change in detail, or states two changes\n1 mark – states one relevant change",
    ),
  ],
  "design-concepts-1-4-logical-and-hierarchical-organisation-of-content": [
    q(
      "design-concepts-1-4-logical-and-hierarchical-organisation-of-content-q1",
      "Explain why a business's logo and contact details are usually placed in the upper quartile of a webpage rather than the lower quartile.",
      2,
      '2 marks – explains that the upper quartile is what most users see first, without scrolling, so content directly linked to the website\'s purpose (brand recognition, contact) should go there\n1 mark – states a relevant point, e.g. "so people see it straight away"',
    ),
    q(
      "design-concepts-1-4-logical-and-hierarchical-organisation-of-content-q2",
      "An online bakery's homepage currently places its Privacy Policy and copyright notice at the very top of the page, above its product photos and \"Order Now\" button. Explain why this is poor use of hierarchical organisation, and where this content should be placed instead.",
      3,
      "3 marks – explains that the Privacy Policy/copyright are essential but not related to the business's purpose of generating sales, so placing them above the product photos and CTA pushes the most sales-relevant content further down the page where fewer users will see it; identifies that they belong in the lower quartile/footer instead\n2 marks – explains the problem or identifies the correct placement, not both\n1 mark – states a relevant point",
    ),
  ],
  "managing-data-6-1-purpose-of-the-world-wide-web-consortium-w3c": [
    q(
      "managing-data-6-1-purpose-of-the-world-wide-web-consortium-w3c-q1",
      "Describe the purpose of the World Wide Web Consortium (W3C).",
      2,
      '2 marks – describes W3C as the main international standards body for the web, developing open, consensus-based standards (e.g. HTML, CSS) so the web stays open and accessible across devices and platforms\n1 mark – states a relevant point, e.g. "it sets the rules for websites"',
    ),
    q(
      "managing-data-6-1-purpose-of-the-world-wide-web-consortium-w3c-q2",
      "A small business builds its new website using non-standard HTML that only displays correctly in one browser. Explain why following W3C standards would have avoided this problem.",
      3,
      "3 marks – explains that W3C standards ensure consistent syntax and rules so pages render reliably across different browsers and devices, and following them would mean the website displays and functions the same way for every visitor, regardless of the browser they use\n2 marks – describes the general idea without the browser-specific link\n1 mark – states a relevant point",
    ),
  ],
  "managing-data-6-3-purpose-of-the-web-design-and-applications-standard": [
    q(
      "managing-data-6-3-purpose-of-the-web-design-and-applications-standard-q1",
      "Describe the purpose of the accessibility area of the Web Design and Applications standard.",
      2,
      "2 marks – describes it as following WCAG guidelines to make content usable by people with disabilities, e.g. supporting screen readers and keyboard navigation, ensuring equal access to information\n1 mark – states a relevant point",
    ),
    q(
      "managing-data-6-3-purpose-of-the-web-design-and-applications-standard-q2",
      "An online shoe store's website has no alt text on its product images, no captions on its demonstration videos, and does not resize for mobile phones. For each issue, identify which area of the Web Design and Applications standard it fails to meet.",
      3,
      "1 mark per issue correctly matched to its standard area:\n- Missing alt text → Accessibility\n- Missing captions → Audio and Video\n- Does not resize for mobile → Mobile Web",
    ),
  ],
  "managing-data-6-4-user-generated-content": [
    q(
      "managing-data-6-4-user-generated-content-q1",
      "Describe one advantage and one disadvantage of a business relying on user generated content (UGC) for its website.",
      2,
      "2 marks – describes one valid advantage (e.g. free content, keeps users engaged) and one valid disadvantage (e.g. lack of reliability, risk of online defamation)\n1 mark – describes only an advantage or only a disadvantage",
    ),
    q(
      "managing-data-6-4-user-generated-content-q2",
      "Referring to the Electrodry case study, explain why businesses should not post fake customer testimonials, even though user generated content is normally seen as free and reliable feedback.",
      3,
      "3 marks – explains that fake testimonials undermine the reliability that makes UGC valuable, and are a legal liability (Electrodry was ordered to pay $215,000 in penalties for posting and requesting fake testimonials), so the short-term benefit of appearing more popular is outweighed by legal and reputational risk\n2 marks – describes the legal consequence without linking it to UGC's reliability\n1 mark – states a relevant point",
    ),
  ],
  "managing-data-6-7-content-management-systems": [
    q(
      "managing-data-6-7-content-management-systems-q1",
      "Describe the purpose of a Content Management System (CMS).",
      2,
      '2 marks – describes a CMS as software that lets users create, edit, organise and publish content without writing code, used to build and maintain a website\n1 mark – states a relevant point, e.g. "software for building websites"',
    ),
    q(
      "managing-data-6-7-content-management-systems-q2",
      "A sole trader with no coding experience wants an easy way to run an online portfolio with minimal ongoing cost. Recommend a suitable category of CMS from this lesson and justify your choice.",
      3,
      "3 marks – recommends a personal-use CMS (e.g. Carrd or WordPress.com) and justifies it by linking to the scenario: easiest entry point, no coding required, low or no cost, suited to a single user with simple needs\n2 marks – recommends a suitable CMS with a weaker justification\n1 mark – names a relevant CMS only",
    ),
  ],
  "managing-data-6-8-analysing-sources-of-information": [
    q(
      "managing-data-6-8-analysing-sources-of-information-q1",
      "Describe the difference between verifiability and currency when analysing an online source of information.",
      2,
      "2 marks – describes verifiability as whether the information can be supported by credible evidence or sources, and currency as whether the information is recent and relevant to current developments\n1 mark – describes one correctly",
    ),
    q(
      "managing-data-6-8-analysing-sources-of-information-q2",
      "A student uses a blog post from 2015 with no references to support an assignment on current AI technology. Using the three criteria from this lesson, explain two problems with this source.",
      3,
      "3 marks – explains two problems linked to the criteria: the source fails currency, as 2015 information about AI is outdated given how quickly the field has changed; and fails verifiability, as there are no credible references or evidence to support the claims\n2 marks – explains one problem in detail, or states two problems\n1 mark – states one relevant problem",
    ),
  ],
  "managing-data-6-9-data-security-methods": [
    q(
      "managing-data-6-9-data-security-methods-q1",
      "Describe the security role of a firewall.",
      2,
      '2 marks – describes a firewall as software or hardware that monitors and filters incoming and outgoing data based on security rules, acting as a barrier between a trusted internal network and untrusted external sources like the internet\n1 mark – states a relevant point, e.g. "blocks unwanted traffic"',
    ),
    q(
      "managing-data-6-9-data-security-methods-q2",
      "An online retailer wants customers to trust that their credit card details are safe when checking out, and wants to be sure that files sent to its finance team have not been altered in transit. For each requirement, name and describe one data security method from this lesson that addresses it.",
      4,
      "4 marks (2 per method, 1 if only named):\n- Encryption: converts the credit card data into a coded format that only the intended recipient can decrypt, protecting confidentiality during the transaction\n- Digital signature: verifies that the finance file has not been changed since it was signed and confirms the sender's identity",
    ),
  ],
  "managing-data-6-10-security-techniques-for-managing-data-disaster-recovery-and-audit-trails": [
    q(
      "managing-data-6-10-security-techniques-for-managing-data-disaster-recovery-and-audit-trails-q1",
      "Describe the purpose of a disaster recovery plan (DRP).",
      2,
      "2 marks – describes a DRP as a formal, written strategy outlining the procedures to restore critical ICT systems and data after a disruptive event, minimising downtime and ensuring business continuity\n1 mark – states a relevant point",
    ),
    q(
      "managing-data-6-10-security-techniques-for-managing-data-disaster-recovery-and-audit-trails-q2",
      "A hospital discovers that a patient's medical record was accessed and changed by someone without the correct permission. Explain how an audit trail would help the hospital investigate this incident.",
      3,
      "3 marks – explains that the audit trail logs the time and date the record was accessed, the identity of the user who accessed it, and the specific action taken (e.g. modifying the file), allowing the hospital to identify who made the unauthorised change and when, supporting the investigation\n2 marks – describes what an audit trail records without linking it to the investigation\n1 mark – states a relevant point",
    ),
  ],
  "managing-data-6-13-online-data-storage-methods": [
    q(
      "managing-data-6-13-online-data-storage-methods-q1",
      "Describe the difference between a database and a data warehouse.",
      2,
      "2 marks – describes a database as being used for day-to-day transactions (OLTP, e.g. logging in, making purchases) and a data warehouse as being used for analysing historical and current data to spot trends (OLAP), not for daily transactions\n1 mark – describes one correctly",
    ),
    q(
      "managing-data-6-13-online-data-storage-methods-q2",
      "A large supermarket chain's marketing team wants to analyse five years of sales data to spot seasonal buying trends, without slowing down the tills that process customer purchases every day. Explain why a data warehouse, rather than the supermarket's transactional database, is the appropriate tool for this task.",
      3,
      "3 marks – explains that the transactional database is optimised for fast, simple day-to-day queries like processing purchases at the tills, and running complex trend analysis on it could slow those transactions down; a data warehouse stores historical and current data separately and is built for complex analytical queries (OLAP), so the marketing team can analyse years of sales data without affecting till performance\n2 marks – explains one side of the comparison\n1 mark – states a relevant point",
    ),
  ],
  "application-skills-9-2-digital-communication-for-education-purposes": [
    q(
      "application-skills-9-2-digital-communication-for-education-purposes-q1",
      "Explain the difference between synchronous and asynchronous digital communication in an educational context.",
      2,
      "2 marks – explains synchronous communication as live, real-time interaction (e.g. a Zoom tutorial) and asynchronous as content accessed at any time (e.g. LMS resources, recorded lessons)\n1 mark – describes one correctly",
    ),
    q(
      "application-skills-9-2-digital-communication-for-education-purposes-q2",
      "A school moves all classes online during a short closure. Some students complain they cannot access live lessons because of unreliable internet at home. Using the tools from this lesson, explain how the school could still support these students' learning.",
      3,
      "3 marks – explains that the school could rely more on asynchronous LMS content (e.g. recorded tutorials, readings, assignments posted to Canvas or Google Classroom) that students can access at any time, rather than only synchronous virtual meetings, so students with unreliable internet can catch up when their connection allows, e.g. by watching a recorded lesson later\n2 marks – suggests a relevant asynchronous alternative without full explanation\n1 mark – states a relevant point",
    ),
  ],
  "application-skills-9-3-use-available-functions-of-online-software": [
    q(
      "application-skills-9-3-use-available-functions-of-online-software-q1",
      "Describe the purpose of version history in online collaboration software.",
      2,
      '2 marks – describes version history as tracking changes made to a document over time and allowing users to restore a previous version if needed\n1 mark – states a relevant point, e.g. "lets you undo changes"',
    ),
    q(
      "application-skills-9-3-use-available-functions-of-online-software-q2",
      "A group of students is collaborating on a shared Google Doc for an assignment. One student accidentally deletes a large section of another student's work. Explain how two functions from this lesson could help the group recover from this and avoid it happening again.",
      3,
      "3 marks – explains two functions linked to the scenario: version history allows the group to restore the document to a version before the section was deleted; sharing and permissions could be used to limit some students to commenting or viewing access rather than full editing rights, reducing the risk of accidental changes in future\n2 marks – explains one function in detail, or names two functions without detail\n1 mark – states one relevant function",
    ),
  ],
};

const file = "lib/content/data/year-12-applied-it-atar.json";
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);
const indent = raw.startsWith('{\n "') ? 1 : 2;
let added = 0;
for (const u of data.units) {
  for (const t of u.topics) {
    for (const l of t.lessons) {
      const questions = ADD[l.id];
      if (!questions) continue;
      if (l.blocks.some((b) => b.type === "quizQuestion")) continue;
      l.blocks.push(...questions);
      added += questions.length;
    }
  }
}
writeFileSync(file, JSON.stringify(data, null, indent));
console.log(`Added ${added} question(s).`);
