// interactiveDiagram blocks for the 8 Year 12 General topics the audit flags as
// having none (design-concepts, both impacts-of-technology, both application-skills,
// both project-management, managing-data — networks and hardware already have one).
// Idempotent: skips lessons that already have an interactiveDiagram. Every pair here
// is drawn directly from a table or keyTerms block already in that lesson, not invented.
import { readFileSync, writeFileSync } from "node:fs";

const matcher = (title, instruction, pairs, explanation) => ({
  type: "interactiveDiagram",
  title,
  instruction,
  kind: "connect",
  config: { left: pairs.map((p) => p[0]), right: [...new Set(pairs.map((p) => p[1]))] },
  goalState: { links: pairs },
  explanation,
});

const ADD = {
  "year-12-applied-it-general": {
    "design-concepts-1-elements-of-design": matcher(
      "Match the element to an example",
      "Tap an element of design on the left, then tap an example of it in use.",
      [
        ["Line", "Divider under a heading"],
        ["Shape", "Round buttons on an app"],
        ["Space", "Margins around text"],
        ["Texture", "Paper-grain background"],
        ["Colour", "Brand colour on all buttons"],
      ],
      "Each element of design shows up in a real product in its own characteristic way.",
    ),
    "impacts-of-technology-u3-3-social-networking-impact": matcher(
      "Match the feature to social networking",
      "Tap a feature on the left, then tap how social networking handles it.",
      [
        ["Speed", "Instant"],
        ["Who publishes", "Anyone with a phone"],
        ["Checking", "Often not checked"],
        ["Cost to audience", "Free, paid for by advertising"],
        ["Audience role", "Comments, shares and creates"],
      ],
      "Social networking changed news from something you receive to something anyone can publish, instantly and unchecked.",
    ),
    "application-skills-u3-2-graphic-and-audio-file-formats": matcher(
      "Match the format to what it's best for",
      "Tap a file format on the left, then tap what it's best used for.",
      [
        ["JPEG", "Photographs"],
        ["PNG", "Logos, screenshots, transparency"],
        ["GIF", "Simple animations"],
        ["SVG", "Logos and icons"],
        ["MP3", "Sharing and streaming"],
        ["WAV", "Editing and high quality"],
      ],
      "Every format trades off quality, file size and features differently — that's why you choose the format to fit the job.",
    ),
    "project-management-u3-2-design-process-components": matcher(
      "Match the term to an example",
      "Tap a design-process term on the left, then tap an example of it.",
      [
        ["Product purpose", "Inform parents about a school camp"],
        ["Design criteria", "Camp date appears on every page"],
        ["Target audience characteristics", "Parents aged 35 to 55, reading on phones"],
        ["Presentation medium", "Email newsletter, poster, video, website"],
      ],
      "A clear brief ties each of these together: who it's for, what it must do, and how it reaches them.",
    ),
    "managing-data-2-compression": matcher(
      "Match the feature to lossy compression",
      "Tap a feature on the left, then tap what's true of it under lossy compression.",
      [
        ["Data removed?", "Yes, permanently"],
        ["File size", "Much smaller"],
        ["Quality", "Can drop, especially if saved repeatedly"],
        ["Use when", "Small size matters more than perfect quality"],
      ],
      "Lossy compression trades some quality away permanently in exchange for a much smaller file.",
    ),
    "impacts-of-technology-u4-2-identity-theft-and-safe-disposal": matcher(
      "Match the term to its definition",
      "Tap a term on the left, then tap its definition.",
      [
        ["Identity theft", "Using someone's personal information to pretend to be them, e.g. to open accounts, take loans or make purchases."],
        ["Data breach", "Personal information is lost or accessed without permission, e.g. through hacking."],
        ["Notifiable data breach", "Under the Privacy Act, organisations must tell affected people and the regulator when a breach is likely to cause serious harm."],
        ["Safe disposal", "Destroying or de-identifying personal information when it is no longer needed, so it cannot be recovered."],
      ],
      "Identity theft and data breaches are related but distinct — knowing which obligation applies starts with naming the right term.",
    ),
    "application-skills-u4-2-web-authoring-features": matcher(
      "Match the term to its definition",
      "Tap a web-authoring term on the left, then tap its definition.",
      [
        ["Hyperlink", "Clickable text or image that goes to another page, part of a page, file or email address."],
        ["Graphics", "Images, logos and icons on a web page, usually JPEG, PNG or SVG, optimised for fast loading."],
        ["Template", "A pre-designed layout reused on every page for consistency."],
        [".htm / .html file", "HyperText Markup Language: holds the content and structure of a page (headings, text, links, images)."],
        [".css file", "Cascading Style Sheet: controls how pages look (colours, fonts, layout). One CSS file can style every page."],
      ],
      "HTML holds what a page is; CSS holds what it looks like — every other web-authoring feature builds on that split.",
    ),
    "project-management-u4-3-resources": matcher(
      "Match the resource type to its definition",
      "Tap a resource type on the left, then tap its definition.",
      [
        ["Hardware", "Physical equipment, e.g. laptop, camera, microphone."],
        ["Software", "Programs and licences, e.g. InDesign, Canva."],
        ["People", "Who is involved: designer, client, testers, talent."],
        ["Managing resources", "Booking, tracking and backing up resources so they are available when needed."],
      ],
      "A project plan that only lists hardware and software misses the resource that's hardest to replace: the people.",
    ),
  },
};

let added = 0;
for (const [slug, byLesson] of Object.entries(ADD)) {
  const file = `lib/content/data/${slug}.json`;
  const raw = readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  const indent = raw.startsWith('{\n "') ? 1 : 2;
  for (const u of data.units) {
    for (const t of u.topics) {
      for (const l of t.lessons) {
        const diagram = byLesson[l.id];
        if (!diagram) continue;
        if (l.blocks.some((b) => b.type === "interactiveDiagram")) continue;
        const at = l.blocks.findIndex((b) => b.type === "quizQuestion");
        l.blocks.splice(at === -1 ? l.blocks.length : at, 0, diagram);
        added++;
      }
    }
  }
  writeFileSync(file, JSON.stringify(data, null, indent));
}
console.log(`Added ${added} diagram(s).`);
