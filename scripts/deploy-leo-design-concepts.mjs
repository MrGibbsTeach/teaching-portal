// Leo Thorne (Creative Director @ Koombana Creative Labs) takes the lead.
// Rebuilds Design Concepts lessons for Y11 General using the Apprenticeship Framework.
// Run: node scripts/deploy-leo-design-concepts.mjs
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));

const TICKET = (heading, text) => ({ type: "callout", variant: "ticket", heading, text });
const SANDBOX = (heading, text) => ({ type: "callout", variant: "sandbox", heading, text });
const PR = (heading, text) => ({ type: "callout", variant: "pr-review", heading, text });
const WISDOM = (heading, text) => ({ type: "callout", variant: "senior-wisdom", heading, text });

const ELEMENTS_GRID = {
  type: "grid", title: "The Seven Elements of Design",
  items: [
    { icon: "📏", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Orient_IV_%28_%29_-_Bridget_Riley_%281931%29_%2844210674930%29.jpg/500px-Orient_IV_%28_%29_-_Bridget_Riley_%281931%29_%2844210674930%29.jpg", label: "Line", description: "Path between two points. Straight = stability. Diagonal = energy. Curved = flow. We use line to guide the user's eye toward the CTA." },
    { icon: "⬡", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Composition%2C_1921_-_Piet_Mondrian%2C_MET_DT4479.jpg/500px-Composition%2C_1921_-_Piet_Mondrian%2C_MET_DT4479.jpg", label: "Shape", description: "2D bounded areas. Geometric = structured, trustworthy (banks, gov). Organic = natural, friendly (health, lifestyle). Shape carries brand personality." },
    { icon: "🔲", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Facevase.png/500px-Facevase.png", label: "Space", description: "Positive = content. Negative = breathing room. White space is NOT wasted space — it's a power move. Apple built an empire on it." },
    { icon: "🪨", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Weathered_wood_grain_texture_macro_closeup_detail.jpg/500px-Weathered_wood_grain_texture_macro_closeup_detail.jpg", label: "Texture", description: "Visual surface quality. On screen it's always implied — subtle noise overlays, grain, or pattern. Adds depth without real weight." },
    { icon: "🎨", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Color_star-en_%28tertiary_names%29.svg/500px-Color_star-en_%28tertiary_names%29.svg.png", label: "Colour", description: "Hue (the colour). Saturation (vivid → muted). Tone (light → dark). Colour is the fastest emotional signal in any design system." },
    { icon: "🎲", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Platonic_solids.jpg/500px-Platonic_solids.jpg", label: "3D Form", description: "The illusion of volume in 2D space. Shadows, gradients, and perspective create depth. iOS went from fake-3D to flat and back. Know why." },
    { icon: "🌗", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Ansel-adams-monolith-the-face-of-half-dome_-_edit1.jpg/500px-Ansel-adams-monolith-the-face-of-half-dome_-_edit1.jpg", label: "Tone", description: "Lightness vs darkness — independent of colour. A greyscale version of your design should still communicate hierarchy. If not, the design fails." },
  ],
};

const lessons = [
  {
    id: "elements-of-design",
    title: "Elements of Design",
    estimatedMinutes: 20,
    blocks: [
      TICKET("🎟️ TICKET #0042 · KOOMBANA CREATIVE LABS", "Status: 🔴 URGENT | Sprint 3 | Assigned to: New Intern\n\nA Bunbury real estate agency just rejected our design proposal. Client feedback: 'It looks random — no visual logic.' Leo needs you to audit their existing brochure, identify which design elements are misused or missing, and have your analysis ready before the 2pm client call."),
      { type: "video", youtubeId: "YqQx75OPRa0", title: "Beginning Graphic Design: Fundamentals", caption: "GCFLearnFree — Leo's recommended pre-read before touching any client brief." },
      { type: "paragraph", text: "Every design — website, poster, app, brochure — is built from seven fundamental building blocks. Leo calls them the 'ingredients'. Know these cold, or you'll ship something that looks like a word salad." },
      ELEMENTS_GRID,
      { type: "callout", variant: "key", heading: "⚡ Leo's Rule", text: "Elements are the WHAT. Principles are the HOW. You can't apply a principle without elements to work with. Master elements first — they're your vocabulary." },
      SANDBOX("💻 SANDBOX CHALLENGE · AUDIT THE REJECTED BROCHURE", "The real estate client's brochure has five design problems. For each item below, identify which element of design is being misused and what it should be instead.\n\n1. The heading font is the same size as the body text.\n2. A diagonal slash background is used on a 'trust and stability' investment page.\n3. Text is crammed edge-to-edge with no breathing room.\n4. A photo of a house uses a rough, scratchy texture overlay on a luxury listing.\n5. The 'Call us now' button is the same colour as the background.\n\nWrite your audit. One sentence per item: element misused → what to fix."),
      PR("🛑 PR REVIEW · LEO IS PUSHING BACK", "Leo's reviewing your audit. He's not satisfied yet. Answer his questions before this gets merged:\n\nQ1: 'You flagged the button colour as a colour problem. But which specific property of colour is the issue — hue, saturation, or tone?'\nQ2: 'You said the heading needs to be bigger. What element of design are you actually adjusting when you change text size?'\nQ3: 'The scratch texture on the luxury listing — a student said it's a texture issue. But couldn't it also be read as a tone issue? Defend your choice.'"),
      { type: "quizQuestion", question: { questionType: "mcq", text: "Leo's Q1: The 'Call us now' button blends into the background. Which colour property is the problem?", options: ["Hue — the colour family is wrong", "Saturation — the colour is too muted", "Tone — there is not enough lightness/darkness contrast", "All three are equally at fault"], correctIndex: 2, explanation: "Tone (lightness vs darkness) is the issue. Even if button and background are different hues, if their tones are too similar they'll blend together. This is why greyscale testing of designs matters — if contrast disappears in greyscale, your button is invisible to many users." }},
      { type: "quizQuestion", question: { questionType: "mcq", text: "Leo's Q2: Making the heading text larger is adjusting which element of design?", options: ["Colour — you're changing the visual weight", "Space — larger text takes up more room", "Form — you're adding 3D depth", "Tone — size controls contrast"], correctIndex: 1, explanation: "Adjusting size changes how much space an element occupies and therefore its visual weight. Space (both the element itself and the negative space around it) is the design element being manipulated when you change type size." }},
      { type: "quizQuestion", question: { questionType: "true_false", text: "A design that looks strong in full colour will always work in greyscale too.", correctAnswer: false, explanation: "False — and this is Leo's favourite test. If your design relies solely on hue for contrast (e.g. red text on green background) it collapses in greyscale. Strong designs work in greyscale because they use tonal contrast as the foundation, then layer colour on top." }},
      WISDOM("💡 SENIOR WISDOM · LEO THORNE, KOOMBANA CREATIVE LABS", "Every bad design makes the same mistake: too many competing focal points, and no designer brave enough to remove one. The most powerful thing you can do in any layout is delete an element. Restraint is a skill. Your job is to build beautiful, accessible interfaces — not to impress yourself with how much you know. Build for the user, cut for clarity, ship with confidence."),
    ],
  },
  {
    id: "principles-of-design",
    title: "Principles of Design",
    estimatedMinutes: 20,
    blocks: [
      TICKET("🎟️ TICKET #0051 · KOOMBANA CREATIVE LABS", "Status: 🟡 HIGH | Sprint 3 | Assigned to: New Intern\n\nSame real estate client. Second round. They've now seen your element audit and they want a redesign mockup. But before you open Figma, Leo needs you to define the design principles this layout must follow. Without a principles brief, you're guessing. We don't guess here."),
      { type: "paragraph", text: "If elements are ingredients, principles are the recipe. You can have great ingredients and still make inedible food if you don't know the recipe. Same deal here." },
      { type: "grid", title: "The Six Principles of Design", items: [
        { icon: "⚖️", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_03.jpg/500px-Cat_03.jpg", label: "Balance", description: "Even distribution of visual weight. Symmetrical = formal, stable. Asymmetrical = dynamic, modern. Know which one matches the client's brand." },
        { icon: "🔦", label: "Emphasis", description: "One dominant focal point. Everything else is secondary. If everything is important, nothing is. In UI: your CTA button is the hero. Make it obvious." },
        { icon: "👑", label: "Dominance", description: "The single element that catches the eye first. Usually the largest, most saturated, or most isolated. Clients often want everything dominant — your job is to say no." },
        { icon: "🔗", label: "Unity", description: "Everything looks like it belongs in the same family. Consistent typeface, colour palette, corner radius, icon style. A brand guide enforces unity at scale." },
        { icon: "📐", label: "Proportion", description: "Size relationships between elements. Heading 3× the body text. Hero image filling 60% of the viewport. Numbers matter. Eyeballing it is for students." },
        { icon: "🌗", label: "Contrast", description: "The tension between opposites. Large vs small. Dark vs light. Bold vs thin. Contrast creates interest, hierarchy, and accessibility. Low contrast = inaccessible." },
      ]},
      SANDBOX("💻 SANDBOX CHALLENGE · PRINCIPLES BRIEF", "You're writing the principles brief before the Figma mockup begins. For each of the 6 principles, write ONE design decision for the real estate client's homepage. Be specific.\n\nExample: 'Balance — Asymmetrical layout: large hero image left (60%), contact form right (40%)'\n\nComplete the brief:\n- Emphasis: ___\n- Dominance: ___\n- Unity: ___\n- Proportion: ___\n- Contrast: ___\n- Balance: ___"),
      { type: "callout", heading: "🏭 Cross-Talk from Rory Quinn @ Bunbury Tech Launchpad", text: "Rory here. 'Leo's principles brief is the design equivalent of my sprint specification. If you don't write it before you build, you'll rebuild twice. Document first, build second — every time.'" },
      PR("🛑 PR REVIEW · LEO IS IN THE REVIEW THREAD", "Leo dropped comments on your brief. Respond to each:\n\nComment 1: 'You wrote \"make the heading big\" for Emphasis. That's vague. What specific proportion increase creates emphasis without destroying the rest of the hierarchy?'\nComment 2: 'You said \"use consistent colours\" for Unity. What THREE elements does unity ACTUALLY control beyond colour?'\nComment 3: 'You used high contrast for the body text but identical background colours for the nav and footer. Is this consistent with your contrast principle? Why or why not?'"),
      { type: "quizQuestion", question: { questionType: "mcq", text: "A logo uses the same typeface, corner radius on buttons, and amber colour palette everywhere across the website, app, and print materials. Which principle is this?", options: ["Emphasis", "Contrast", "Unity", "Proportion"], correctIndex: 2, explanation: "Unity — consistent visual language across all touchpoints. This is what a brand design system enforces at scale. When Leo says 'it looks like it belongs together', he's talking about unity." }},
      { type: "quizQuestion", question: { questionType: "mcq", text: "A landing page has a headline, three columns of text, two images, a video, and six buttons, all the same visual weight. Which principle is being violated most severely?", options: ["Balance — the layout is uneven", "Emphasis — there is no single focal point", "Texture — the page lacks surface variation", "Proportion — the columns are wrong size"], correctIndex: 1, explanation: "Emphasis — when everything is the same visual weight, nothing stands out. The page has no hierarchy, so the user doesn't know where to look or what to do first. Leo's rule: one hero, one message, one CTA per screen." }},
      { type: "quizQuestion", question: { questionType: "short_answer", text: "A student's poster design has a bright red 'BUY NOW' button that stands out clearly. However, the body text uses light grey on white. Identify which principle each of these decisions relates to, and evaluate whether each decision is effective.", marks: 4, explanation: "Strong answer: The red button demonstrates Emphasis (creating a clear focal point) and Contrast (high colour contrast against the design). The light grey body text violates Contrast and Accessibility — text must meet WCAG AA contrast ratio minimum. The button decision is effective; the text decision is a design failure that makes content unreadable for users with low vision." }},
      WISDOM("💡 SENIOR WISDOM · LEO THORNE, KOOMBANA CREATIVE LABS", "I've reviewed 400+ student projects in 12 years. The difference between the top 10% and everyone else is not talent — it's restraint. They used ONE font. ONE primary colour. ONE dominant element per screen. The grads who ship great products understand that principles aren't rules to follow — they're tools to communicate intent. Use them deliberately, or the user will feel the chaos even if they can't name it."),
    ],
  },
  {
    id: "typography",
    title: "Typography",
    estimatedMinutes: 20,
    blocks: [
      TICKET("🎟️ TICKET #0058 · KOOMBANA CREATIVE LABS", "Status: 🟡 HIGH | Sprint 4 | Assigned to: New Intern\n\nA local Bunbury brewery wants a rebrand. The founder sent Leo a mood board with 14 different fonts. 'I want it to feel handcrafted but also professional.' Leo needs you to cut this to 2 fonts, define the typographic system, and brief the founder in plain language why the other 12 were cut."),
      { type: "video", youtubeId: "sByzHoiYFX0", title: "Beginning Graphic Design: Typography", caption: "GCFLearnFree — Leo's go-to primer before any typography brief." },
      { type: "paragraph", text: "Typography is the design element that most non-designers abuse and most senior designers obsess over. Bad font choices communicate distrust, chaos, or inaccessibility before the user reads a single word." },
      { type: "grid", title: "Typeface Categories", items: [
        { icon: "✒️", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Garamond_Roman_Sample.svg/500px-Garamond_Roman_Sample.svg.png", label: "Serif", description: "Small strokes at letter ends (Georgia, Times). Traditional, trustworthy, editorial. Law firms, newspapers, finance. Excellent for print body text." },
        { icon: "🔡", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Helvetica_Neue_typeface_sizes.jpg/500px-Helvetica_Neue_typeface_sizes.jpg", label: "Sans-serif", description: "No strokes — clean and modern (Roboto, Inter, Helvetica). Dominant in tech and UI. Every major OS default UI font is sans-serif. Your default choice for screens." },
        { icon: "✍️", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Pacifico_font_specimen.png/500px-Pacifico_font_specimen.png", label: "Script / Handwritten", description: "Mimics handwriting (Pacifico, Dancing Script). Warm, personal, artisanal. The brewery mood board is full of these. Used ONLY for headings, max one per design." },
        { icon: "🔠", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Futura_Specimen.svg/500px-Futura_Specimen.svg.png", label: "Display / Decorative", description: "Eye-catching, highly stylised (Impact, Bebas Neue). Loud and specific. Perfect for event posters. Never for body text. Never more than one per project." },
      ]},
      { type: "table", headers: ["Property", "What it controls", "Example"], rows: [
        ["Typeface", "The font family / personality", "Inter, Georgia, Pacifico"],
        ["Weight", "Thin → Regular → Bold → Black", "100 (thin) → 400 (regular) → 700 (bold) → 900 (black)"],
        ["Size", "Hierarchy between text levels", "H1: 48px / H2: 32px / Body: 16px / Caption: 12px"],
        ["Alignment", "Left, centre, right, justified", "Body text = left. Centred = signage/headings only. Justified = almost never for digital."],
        ["Leading", "Line height (space between lines)", "1.4–1.6× font size for readable body text. Tight = posters. Loose = long-form reading."],
        ["Kerning / Tracking", "Space between specific/all letters", "Tracking expanded on ALL CAPS for logo treatment. Kerning fixed for specific awkward pairs."],
      ]},
      SANDBOX("💻 SANDBOX CHALLENGE · THE BREWERY BRIEF", "The founder's 14 fonts have been narrowed to 4 finalists:\n1. Playfair Display (serif) — 'elegant, premium'\n2. Pacifico (script) — 'handcrafted, warm'\n3. Inter (sans-serif) — 'clean, digital'\n4. Bebas Neue (display) — 'bold, industrial'\n\nYour job: Pick exactly 2. Write your type system:\n- Heading font: ___  (Why? One sentence)\n- Body font: ___  (Why? One sentence)\n- Fonts you cut and why: ___\n\nBonus: Leo will ask what font pairing rule makes your system work. Have the answer ready."),
      PR("🛑 PR REVIEW · LEO IS CHECKING YOUR PAIRING", "Leo reviewed your selection. Comments in the thread:\n\nComment 1: 'You chose a script font for the heading. Tell me one rule you must follow about using script fonts for accessibility.'\nComment 2: 'Your body font is 16px. A developer on your team wants to compress it to 12px to fit more content. Give them three reasons why this is wrong.'\nComment 3: 'The founder wants the menu items in ALL CAPS. You've added spacing between the letters. What typography property did you adjust, and why does it help?'"),
      { type: "quizQuestion", question: { questionType: "mcq", text: "A graduate designer uses a script font at 10px for a website's body text. What are the TWO most critical problems?", options: ["Brand inconsistency and wrong colour", "Readability at small sizes and inaccessibility for users with dyslexia", "It's too expensive to license and slow to load", "Wrong alignment and no contrast"], correctIndex: 1, explanation: "Script fonts have inconsistent stroke widths that become illegible below ~24px. They're also one of the hardest typefaces for dyslexic users to read. These are functional failures, not just aesthetic preferences — they make your interface inaccessible." }},
      { type: "quizQuestion", question: { questionType: "true_false", text: "Using more than two typeface families in a single design system makes it feel more professional and varied.", correctAnswer: false, explanation: "False — the professional rule is two typeface families maximum. Additional fonts create visual noise and brand inconsistency. Inter + Playfair Display. That's it. Variety within a system comes from weight, size, and colour — not from adding more fonts." }},
      WISDOM("💡 SENIOR WISDOM · LEO THORNE, KOOMBANA CREATIVE LABS", "In ten years I've never once heard a user say 'I love this site because it has seven different fonts.' I have heard 'this feels chaotic and I don't trust it.' Typography is 95% of design because text is 95% of the internet. Two fonts, clear hierarchy, generous leading, left-aligned body text. That's not a limitation — that's professional discipline. The craft is in the details, not the variety."),
    ],
  },
  {
    id: "colour-theory",
    title: "Colour Theory",
    estimatedMinutes: 20,
    blocks: [
      TICKET("🎟️ TICKET #0063 · KOOMBANA CREATIVE LABS", "Status: 🟡 HIGH | Sprint 4 | Assigned to: New Intern\n\nA Busselton health clinic wants a new website. They've provided a brand brief: 'We want to feel warm, approachable, and trustworthy.' Their current site is bright red with black text. Leo needs a colour system: primary palette, accessible contrast ratios, and a one-paragraph rationale for the colour choices you can present to the client's board."),
      { type: "video", youtubeId: "AvgCkHrcj90", title: "Colour Theory for Beginners", caption: "A practical guide to the colour wheel, harmonies, and professional colour decisions." },
      { type: "paragraph", text: "Colour communicates emotion before the user reads a single word. A healthcare brand in bright red signals emergency, danger, and urgency — not warmth and trust. Leo always says: 'Pick colour like you pick words. Every choice has a consequence.'" },
      { type: "grid", title: "The Three Properties of Every Colour", items: [
        { icon: "🎨", label: "Hue", description: "The colour family itself — red, blue, teal, amber. This is what people mean when they say 'the colour'. It carries the primary emotional association." },
        { icon: "💧", label: "Saturation", description: "Vivid to muted. 100% saturation = neon sign. 0% = grey. Desaturated colours feel sophisticated, calm, professional. Oversaturated = medical emergency." },
        { icon: "☀️", label: "Tone / Value", description: "Light to dark. Tint = hue + white. Shade = hue + black. Tone determines your contrast ratios and accessibility compliance. This is the property designers ignore and accessibility fails on." },
      ]},
      { type: "table", headers: ["Colour", "Psychological Association", "Brand Use Cases"], rows: [
        ["Blue (cool)", "Trust, calm, professionalism, technology", "Banks (ANZ, Westpac), social media (Facebook, LinkedIn), healthcare, government"],
        ["Green", "Nature, health, growth, financial success", "Environmental brands, wellness apps, Medibank, investment platforms"],
        ["Red", "Urgency, energy, danger, passion", "Sale/discount banners, emergency services, Coca-Cola, fast food (McDonald's)"],
        ["Amber/Yellow", "Optimism, warmth, caution", "Taxis, roadwork signs, children's education, energy brands"],
        ["Purple", "Creativity, luxury, wisdom", "Cadbury, Hallmark, tech AI products (Claude, Gemini), premium brands"],
        ["White + space", "Clarity, simplicity, cleanliness, premium", "Apple, medical brands, luxury fashion, minimalist tech products"],
      ]},
      { type: "richText", heading: "Colour Harmonies", html: "<p>A colour harmony is a pre-tested combination that works because of its position on the colour wheel.</p><ul><li><strong>Complementary</strong> (opposites — blue + orange): Maximum contrast, visually striking. Use for CTAs against backgrounds. Handle carefully or it vibrates.</li><li><strong>Analogous</strong> (neighbours — blue, blue-green, teal): Calm, cohesive, and safe. The go-to for branded interfaces and dashboards.</li><li><strong>Triadic</strong> (3 evenly spaced — red, yellow, blue): Vibrant and balanced. Needs one dominant, one secondary, one accent. Tricky to execute.</li><li><strong>Monochromatic</strong> (one hue, multiple tones): Sophisticated and unified. Google's Material Design frequently uses this.</li></ul>" },
      { type: "callout", heading: "🏭 Cross-Talk from Sparky Miller @ Bunbury Hardware Integrators", text: "Sparky here: 'Leo's colour system is clean, but someone tell him his hero image is 4MB uncompressed. We're bottlenecking on mobile. File size is part of the design decision, mate — beauty means nothing if the page doesn't load.'" },
      SANDBOX("💻 SANDBOX CHALLENGE · COLOUR SYSTEM FOR THE HEALTH CLINIC", "Build a 3-colour system for the Busselton health clinic. Use the table above as your guide.\n\n1. PRIMARY colour (the main brand colour): Colour family? Why does it match 'trustworthy and approachable'?\n2. SECONDARY colour (used for highlights and accents): Must harmonise with primary. Which harmony type are you using?\n3. NEUTRAL (backgrounds, body text): Contrast ratio must pass WCAG AA (4.5:1 for normal text).\n\nBonus: Write the one-paragraph rationale for the board. Leo will read it aloud in the client meeting."),
      { type: "quizQuestion", question: { questionType: "mcq", text: "The clinic's current red (#FF0000) text on white background has a contrast ratio of 4.0:1. What is the problem?", options: ["The red hue is psychologically wrong for health", "It fails WCAG AA accessibility standard (minimum 4.5:1 for normal text)", "Red and white are complementary colours and clash", "The saturation is too high for print"], correctIndex: 1, explanation: "WCAG AA requires a minimum 4.5:1 contrast ratio for normal text. 4.0:1 fails this standard, making the text inaccessible for users with low vision or colour blindness. Accessibility is a legal requirement for websites in Australia under the Disability Discrimination Act." }},
      WISDOM("💡 SENIOR WISDOM · LEO THORNE, KOOMBANA CREATIVE LABS", "I was handed a beautiful rebrand once — perfect palette, gorgeous typography. Client loved it. Then our accessibility audit returned 11 contrast failures. We rebuilt the entire colour system in 48 hours. Lesson: run the contrast checker before you present, not after. Accessibility is not an add-on — it's baked into the brief from day one. Beautiful and accessible are not opposites. The best designers make them the same thing."),
    ],
  },
  {
    id: "compositional-rules",
    title: "Compositional Rules",
    estimatedMinutes: 15,
    blocks: [
      TICKET("🎟️ TICKET #0071 · KOOMBANA CREATIVE LABS", "Status: 🟢 STANDARD | Sprint 5 | Assigned to: New Intern\n\nA Margaret River photography studio wants you to select 3 hero images from a set of 10 they've provided for their new homepage. Leo needs you to apply compositional evaluation criteria, score each image, and give the studio a written rationale for the three you selected."),
      { type: "grid", title: "Three Compositional Rules Every Designer Uses", items: [
        { icon: "⊞", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/FingerRuleOfThirds.jpg/500px-FingerRuleOfThirds.jpg", label: "Rule of Thirds", description: "Divide canvas into 3×3. Place focal point at an intersection — not dead centre. Off-centre subjects feel natural, dynamic, and intentional. The most-used rule in photography and web design." },
        { icon: "⬜", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Gridded_Page_Spread.svg/500px-Gridded_Page_Spread.svg.png", label: "Grid & Alignment", description: "All elements align to invisible grid lines. In CSS this is Grid and Flexbox. In Figma it's auto-layout. Consistent alignment = professional. Random placement = student project." },
        { icon: "🌀", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Fibonacci_spiral_34.svg/500px-Fibonacci_spiral_34.svg.png", label: "Golden Ratio", description: "1:1.618 — found in nature, architecture, and logo design. Governs ideal proportions for layout sections, font-size scales (e.g. 16/26/42px follows the ratio), and image cropping." },
      ]},
      SANDBOX("💻 SANDBOX CHALLENGE · IMAGE SCORING RUBRIC", "Create a scoring rubric for the photography studio. Score each compositional rule out of 5. Then define:\n\n1. What does a 5/5 'Rule of Thirds' image look like? (One sentence)\n2. What does a 1/5 'Rule of Thirds' image look like? (One sentence)\n3. An image scores 5/5 on composition but the subject is slightly blurry. Does it still qualify as a hero image? Why or why not?\n4. The studio insists on using an image where the subject is dead centre. Make the design case for why this is wrong — then describe ONE situation where a centred composition is actually intentional and correct."),
      PR("🛑 PR REVIEW · LEO IS CHECKING YOUR RATIONALE", "Leo reviewed your image selections. His comments:\n\nComment 1: 'You selected Image 7 which has the horizon dead centre. You said it was balanced. But which compositional rule does this violate, and how does it affect the user's emotional response?'\nComment 2: 'Image 3 follows rule of thirds perfectly but the grid alignment on the website would put text over the subject's face. How do you solve this while preserving the compositional rule?'"),
      { type: "quizQuestion", question: { questionType: "mcq", text: "A photographer places the horizon line exactly in the middle of every landscape photo. Which compositional rule are they ignoring?", options: ["Golden ratio", "Grid and alignment", "Rule of thirds", "Colour harmony"], correctIndex: 2, explanation: "Rule of thirds — placing the horizon at the top or bottom third creates a more dynamic, intentional image. Dead-centre horizon creates tension and feels static. The rule of thirds is the first compositional rule taught to every photography and design student for this exact reason." }},
      WISDOM("💡 SENIOR WISDOM · LEO THORNE, KOOMBANA CREATIVE LABS", "Rules are guidelines. Break them deliberately, not by accident. I've seen centred compositions become iconic logos. I've seen 'incorrect' grids create masterpiece album covers. The difference is intent and mastery. Learn the rules until they're instinct. Then — and only then — break them on purpose, and be ready to defend every decision in the client meeting."),
    ],
  },
  {
    id: "layout-and-design",
    title: "Layout & Design",
    estimatedMinutes: 20,
    blocks: [
      TICKET("🎟️ TICKET #0079 · KOOMBANA CREATIVE LABS", "Status: 🟡 HIGH | Sprint 5 | Assigned to: New Intern\n\nFinal ticket for this sprint. The real estate client wants a full-page homepage layout delivered in Figma by Friday. Leo needs you to produce a layout brief: grid system, spacing scale, visual hierarchy, and responsive breakpoints. This is the blueprint the developers will build from. Get it wrong here, and the build is wrong everywhere."),
      { type: "video", youtubeId: "a5KYlHNKQB8", title: "Beginning Graphic Design: Layout & Composition", caption: "GCFLearnFree — how professional designers structure layouts before opening Figma." },
      { type: "table", headers: ["Layout Decision", "Why it matters", "Professional standard"], rows: [
        ["Grid system", "Forces alignment and consistency", "12-column grid at 1200px desktop. 4-column at 768px tablet. 1-column at 375px mobile."],
        ["Spacing scale", "Creates visual rhythm and hierarchy", "8px base unit. Scale: 4/8/16/24/32/48/64/96px. Never use arbitrary numbers."],
        ["Visual hierarchy", "Tells users what to read/do first", "Max 3 levels: H1 (hero) → H2 (section) → Body. Each level is visually distinct."],
        ["White space", "Prevents clutter, signals premium quality", "Padding inside cards ≥ 24px. Section gaps ≥ 64px. Never fill every pixel."],
        ["Alignment", "Creates order and professionalism", "Every element snaps to a grid line. Zero random positioning."],
        ["Responsive breakpoints", "Ensures design works on all devices", "Mobile-first: 375px → 768px → 1200px. Design the mobile version first."],
      ]},
      { type: "callout", heading: "🏭 Cross-Talk from Rory Quinn @ Bunbury Tech Launchpad", text: "Rory here: 'This layout brief IS the sprint spec for the dev team. If Leo sends a vague Figma with no spacing annotations and no breakpoint notes, I lose 4 hours of developer time to guesswork. Document the decisions. Every. Single. One.'" },
      SANDBOX("💻 SANDBOX CHALLENGE · THE LAYOUT BRIEF", "Write the layout brief for the real estate homepage. Complete each field:\n\n1. Grid system: ___columns at desktop / ___columns at mobile\n2. Spacing base unit: ___ px. Why this number?\n3. Hero section: What goes here? Where does the CTA sit?\n4. Visual hierarchy plan: H1 text: ___ / H2: ___ / Body: ___px\n5. Mobile-first rule: List 2 elements that will COLLAPSE or STACK on mobile that are side-by-side on desktop.\n6. One non-negotiable white space rule for this project: ___"),
      { type: "quizQuestion", question: { questionType: "mcq", text: "A developer asks Leo why the spacing values in the design file are 8, 16, 24, 32, 48 — not 10, 15, 20, 25. What is Leo's answer?", options: ["These are Leo's personal preference with no formal basis", "An 8px base unit creates a consistent mathematical scale that aligns to most device pixel grids", "10px spacing causes rendering issues in Chrome specifically", "48px gaps are mandatory under WCAG accessibility standards"], correctIndex: 1, explanation: "An 8px base unit creates a consistent spacing scale that aligns to most device pixel grids (most screens use multiples of 8px). This prevents sub-pixel rendering issues and creates visual rhythm. It's a professional standard used by Google Material Design, Apple HIG, and most major design systems." }},
      { type: "quizQuestion", question: { questionType: "short_answer", text: "Leo sends a Figma file to the development team. It has no grid annotations, no spacing values, and no breakpoint specifications. Using Rory Quinn's standards from Bunbury Tech Launchpad, explain the specific problems this creates for the developer and estimate the time cost.", marks: 4, explanation: "Strong answer: Without grid annotations, developers cannot determine column widths or gutters and will guess, creating inconsistent layouts. Without spacing values, every gap requires measurement from the Figma file, adding ~2–4 hours of work. Without breakpoints, developers don't know when or how the layout collapses for mobile, potentially requiring a complete mobile rebuild. Total estimated cost: 4–8 hours of rework that should have been documented in 30 minutes of design specification work." }},
      WISDOM("💡 SENIOR WISDOM · LEO THORNE, KOOMBANA CREATIVE LABS", "The Figma file you hand to a developer is a contract. Every missing annotation is a broken clause. I've rebuilt entire projects because a junior designer thought 'they'll figure it out.' They won't — or they will, but it'll cost the client $3,000 in billable hours for something that should have taken an afternoon. Document your spacing. Name your layers. Annotate your components. That's what separates a professional designer from someone who uses Canva."),
    ],
  },
];

// Apply to Y11 General
const data = JSON.parse(readFileSync(join(root, "lib/content/data/year-11-applied-it-general.json"), "utf8"));
let updated = 0;
for (const unit of data.units) {
  const topic = unit.topics.find(t => t.id === "design-concepts");
  if (!topic) continue;
  topic.lessons = topic.lessons.map(l => {
    const newLesson = lessons.find(nl => nl.id === l.id);
    if (newLesson) { updated++; return newLesson; }
    return l;
  });
}
writeFileSync(join(root, "lib/content/data/year-11-applied-it-general.json"), JSON.stringify(data, null, 1), "utf8");
console.log(`✓ Leo Thorne deployed: ${updated} Design Concepts lessons overhauled in Y11 General.`);
console.log("All agents online. Awaiting next module deployment directive.");
