// Upgrades Design Concepts topic in Y11 and Y12 General courses to use the
// same photo-rich grid + video + keyTerms approach from the ATAR course.
// Run with: node scripts/upgrade-general-design-concepts.mjs
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// ─── Shared rich blocks ──────────────────────────────────────────────────────

const ELEMENTS_GRID = {
  type: "grid",
  title: "The Seven Elements of Design",
  items: [
    { icon: "📏", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Orient_IV_%28_%29_-_Bridget_Riley_%281931%29_%2844210674930%29.jpg/500px-Orient_IV_%28_%29_-_Bridget_Riley_%281931%29_%2844210674930%29.jpg", label: "Line", description: "A path between two points — straight, curved, thick, thin, solid or dashed. Lines guide the eye, divide space, and create structure and movement." },
    { icon: "⬡", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Composition%2C_1921_-_Piet_Mondrian%2C_MET_DT4479.jpg/500px-Composition%2C_1921_-_Piet_Mondrian%2C_MET_DT4479.jpg", label: "Shape", description: "A 2D area defined by a boundary. Geometric shapes (circles, squares, triangles) feel structured and ordered. Organic shapes feel fluid and dynamic." },
    { icon: "🔲", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Facevase.png/500px-Facevase.png", label: "Space", description: "Positive space is the subject; negative space is the empty area around it. White space improves readability and draws focus to key elements." },
    { icon: "🪨", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Weathered_wood_grain_texture_macro_closeup_detail.jpg/500px-Weathered_wood_grain_texture_macro_closeup_detail.jpg", label: "Texture", description: "The visual or tactile quality of a surface — rough, smooth, grainy, soft. In digital design, texture is implied through pattern and visual technique." },
    { icon: "🎨", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Color_star-en_%28tertiary_names%29.svg/500px-Color_star-en_%28tertiary_names%29.svg.png", label: "Colour", description: "Defined by hue (the colour family), saturation (intensity), and tone (lightness/darkness). Colour evokes emotion and establishes brand identity." },
    { icon: "🎲", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Platonic_solids.jpg/500px-Platonic_solids.jpg", label: "3D Form", description: "Three-dimensional shapes — sphere, cube, cylinder, cone. Form adds depth and realism, creating the illusion of volume in 2D designs." },
    { icon: "🌗", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Ansel-adams-monolith-the-face-of-half-dome_-_edit1.jpg/500px-Ansel-adams-monolith-the-face-of-half-dome_-_edit1.jpg", label: "Tone", description: "The degree of lightness or darkness — distinct from colour. A black-and-white photo still has tone. Tone creates contrast, depth, and mood." },
  ],
};

const PRINCIPLES_GRID = {
  type: "grid",
  title: "The Principles of Design",
  items: [
    { icon: "⚖️", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_03.jpg/500px-Cat_03.jpg", label: "Balance", description: "The even distribution of visual weight. Symmetrical balance mirrors elements on each side. Asymmetrical balance uses different elements that still feel equally weighted." },
    { icon: "🔦", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/500px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg", label: "Emphasis", description: "Making the most important element stand out through size, colour, contrast, or position. Every strong design has a clear focal point." },
    { icon: "👑", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Camponotus_flavomarginatus_ant.jpg/500px-Camponotus_flavomarginatus_ant.jpg", label: "Dominance", description: "The element that stands out most and catches attention first. Usually the largest, most colourful, or most isolated element in a design." },
    { icon: "🔗", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lego_Color_Bricks.jpg/500px-Lego_Color_Bricks.jpg", label: "Unity", description: "All elements look like they belong together — consistent fonts, colours, and style. Unity creates a cohesive, professional feel across a design." },
    { icon: "📐", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Khoury_College_New_Graphic.svg/500px-Khoury_College_New_Graphic.svg.png", label: "Proportion", description: "The size relationship between elements. Large elements feel more important; small elements feel secondary. Correct proportion creates visual harmony." },
    { icon: "🎼", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenRatio_Parthenon.jpg/500px-GoldenRatio_Parthenon.jpg", label: "Contrast", description: "The difference between opposing elements — light/dark, large/small, rough/smooth, bold/thin. Contrast creates visual interest and makes key information stand out." },
  ],
};

const COLOUR_GRID = {
  type: "grid",
  title: "The Three Properties of Colour",
  items: [
    { icon: "🎨", label: "Hue", description: "The colour itself — red, blue, yellow, green. The position on the colour wheel." },
    { icon: "💧", label: "Saturation", description: "The intensity or vibrancy of a colour. High saturation = vivid. Low saturation = muted/grey." },
    { icon: "☀️", label: "Tone / Value", description: "The lightness or darkness of a colour. Tint = adding white. Shade = adding black." },
  ],
};

const TYPOGRAPHY_GRID = {
  type: "grid",
  title: "Typeface Categories",
  items: [
    { icon: "✒️", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Garamond_Roman_Sample.svg/500px-Garamond_Roman_Sample.svg.png", label: "Serif", description: "Small strokes at the ends of letters (Times New Roman, Georgia). Feel traditional, trustworthy, and editorial. Best for print body text." },
    { icon: "🔡", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Helvetica_Neue_typeface_sizes.jpg/500px-Helvetica_Neue_typeface_sizes.jpg", label: "Sans-serif", description: "No strokes — clean and modern (Helvetica, Arial, Roboto). Highly legible on screens. Used for websites, apps, and headings." },
    { icon: "✍️", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Pacifico_font_specimen.png/500px-Pacifico_font_specimen.png", label: "Script / Handwritten", description: "Mimic handwriting (Pacifico, Dancing Script). Convey creativity, warmth, and personality. Use sparingly — headings only." },
    { icon: "🔠", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Futura_Specimen.svg/500px-Futura_Specimen.svg.png", label: "Display / Decorative", description: "Eye-catching, highly stylised (Impact, Futura). Best for logos, posters, and headlines. Never use for body text." },
  ],
};

const COMPOSITION_GRID = {
  type: "grid",
  title: "Three Compositional Rules",
  items: [
    { icon: "⊞", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/FingerRuleOfThirds.jpg/500px-FingerRuleOfThirds.jpg", label: "Rule of Thirds", description: "Divide the canvas into a 3×3 grid. Place key subjects or focal points at the four intersections — not dead centre. Creates natural, dynamic compositions." },
    { icon: "⬜", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Gridded_Page_Spread.svg/500px-Gridded_Page_Spread.svg.png", label: "Grid & Alignment", description: "Align elements to invisible grid lines. Consistent alignment creates order, professionalism, and makes pages easier to scan." },
    { icon: "🌀", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Fibonacci_spiral_34.svg/500px-Fibonacci_spiral_34.svg.png", label: "Golden Ratio", description: "A natural proportion (1:1.618) found throughout nature and architecture. Designers use it to proportion layouts, font sizes, and spacing for inherent visual harmony." },
  ],
};

const ELEMENTS_CALLOUT = {
  type: "callout",
  variant: "key",
  heading: "Elements vs Principles",
  text: "The elements of design are the WHAT — the raw materials (line, shape, colour, space, texture, form, tone). The principles of design are the HOW — the rules for combining those materials effectively. You need both to analyse or create strong designs.",
};

// ─── Rebuilt lessons ─────────────────────────────────────────────────────────

const LESSONS_Y11 = {
  "elements-of-design": {
    title: "Elements of Design",
    estimatedMinutes: 20,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A design agency has hired you as a junior designer. Your first task: audit a client's flyer and identify every design element used. Ready?" },
      { type: "callout", variant: "hook", heading: "💼 Career Connection: Graphic & UI Designer", text: "Graphic designers, UI/UX designers, and web developers use these design principles every day. Roles like UX Designer and Brand Manager start with exactly this knowledge. Top tools: Figma, Canva, Adobe Creative Suite." },
      { type: "paragraph", text: "Every visual design — from a website to a printed poster — is built from the same seven fundamental building blocks called the elements of design. Understanding these elements is the first step to analysing and creating effective digital media." },
      { type: "video", youtubeId: "YqQx75OPRa0", title: "Beginning Graphic Design: Fundamentals", caption: "GCFLearnFree — a visual intro to the fundamental elements all designers use." },
      ELEMENTS_GRID,
      ELEMENTS_CALLOUT,
      { type: "keyTerms", items: [
        { term: "Element of design", definition: "One of the seven fundamental building blocks of visual design: line, shape, space, texture, colour, form, and tone." },
        { term: "Negative space", definition: "The empty area around or between subjects in a composition — also called white space. Used strategically to improve readability and draw focus." },
        { term: "Organic shape", definition: "A freeform, irregular shape that appears natural rather than geometric — like leaves, clouds, or hand-drawn forms." },
      ]},
      { type: "quizQuestion", question: { questionType: "mcq", text: "Which element of design refers to the empty area around the main subject?", options: ["Texture", "Tone", "Space", "Line"], correctIndex: 2, explanation: "Space — specifically negative space — is the empty area around or between elements. Designers use it deliberately to reduce clutter and draw focus to key content." }},
      { type: "quizQuestion", question: { questionType: "mcq", text: "A designer uses diagonal lines across a poster background. What do diagonal lines typically communicate?", options: ["Calm and stability", "Energy and movement", "Structure and order", "Depth and volume"], correctIndex: 1, explanation: "Diagonal lines create a sense of energy and movement. Horizontal lines convey calm; vertical lines suggest strength and structure." }},
      { type: "quizQuestion", question: { questionType: "true_false", text: "Texture in digital design is always physical and tactile.", correctAnswer: false, explanation: "In digital design, texture is always implied (visual texture) — created through patterns, overlays, and surface effects rather than something you can physically touch." }},
    ],
  },
  "principles-of-design": {
    title: "Principles of Design",
    estimatedMinutes: 20,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A client's website looks 'busy and hard to read' — your job is to diagnose which design principles are missing and propose fixes." },
      { type: "paragraph", text: "The principles of design describe how designers combine the elements to create effective, intentional compositions. Where elements are the raw materials, principles are the rules for using them." },
      { type: "video", youtubeId: "yNDgFK2Jj1E", title: "Understanding Visual Design Principles", caption: "Google UX Design Certificate — how design principles apply in professional product design." },
      PRINCIPLES_GRID,
      { type: "callout", heading: "🏭 Industry Tip", text: "When evaluating any design, work through each principle systematically: Where is the emphasis? Is the layout balanced? Do all elements look unified? This framework is used in professional design critiques." },
      { type: "keyTerms", items: [
        { term: "Balance", definition: "The even distribution of visual weight across a composition. Can be symmetrical or asymmetrical." },
        { term: "Emphasis", definition: "Making the most important element stand out — through size, colour, contrast, or position." },
        { term: "Dominance", definition: "The single element that draws the eye first and establishes the visual hierarchy." },
        { term: "Unity", definition: "A sense that all elements belong together — consistent fonts, colours, and style create a cohesive design." },
      ]},
      { type: "quizQuestion", question: { questionType: "mcq", text: "A logo uses the same typeface and colour palette across all its marketing materials. Which principle does this demonstrate?", options: ["Balance", "Contrast", "Unity", "Dominance"], correctIndex: 2, explanation: "Unity means all elements look like they belong together. Consistent use of the same typeface and colour palette across all materials creates a cohesive brand identity." }},
      { type: "quizQuestion", question: { questionType: "mcq", text: "A designer makes the 'Buy Now' button large and bright orange on a white page. Which two principles are at work?", options: ["Balance and unity", "Emphasis and contrast", "Dominance and texture", "Proportion and tone"], correctIndex: 1, explanation: "Making the button large and bright creates emphasis (it stands out as the most important element) and contrast (the bright orange against white creates visual difference)." }},
    ],
  },
  "typography": {
    title: "Typography",
    estimatedMinutes: 20,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A startup wants a new brand identity. You've been asked to select fonts that match their values — professional but approachable. What do you choose and why?" },
      { type: "paragraph", text: "Typography is the art of arranging type. Poor font choices make great content hard to read. The right font choices make content feel professional, appropriate, and aligned with its audience." },
      { type: "video", youtubeId: "sByzHoiYFX0", title: "Beginning Graphic Design: Typography", caption: "GCFLearnFree — a clear guide to typefaces, spacing, and professional typography." },
      TYPOGRAPHY_GRID,
      { type: "richText", heading: "Typographic Spacing", html: "<p>Three spacing concepts control how readable and professional your type looks:</p><ul><li><strong>Kerning</strong> — the space between two specific letters (adjusted to fix awkward gaps)</li><li><strong>Tracking</strong> — the uniform spacing between all letters across a word or line</li><li><strong>Leading</strong> — the space between lines of text (line height). Tight leading = dense; loose leading = airy and readable</li></ul>" },
      { type: "comparison", title: "Typeface: Serif vs Sans-serif", items: [
        { label: "Serif (Times, Georgia)", points: ["Small strokes at letter ends", "Traditional, trustworthy feel", "Best for print body text", "Good for long documents and books"] },
        { label: "Sans-serif (Arial, Roboto)", points: ["No strokes — clean and modern", "Highly legible on screens", "Used for websites and apps", "Most UI and digital design uses sans-serif"] },
      ]},
      { type: "callout", heading: "🏭 Industry Tip", text: "The golden rule: limit yourself to two font families per design — one for headings, one for body text. Choose typefaces that contrast with each other but complement each other's mood. Never use decorative fonts for body text." },
      { type: "quizQuestion", question: { questionType: "mcq", text: "Which typeface category is most appropriate for a law firm's website body text?", options: ["Display/decorative", "Script/handwritten", "Serif or sans-serif", "Comic Sans"], correctIndex: 2, explanation: "Law firms need to project professionalism and trust. Serif typefaces (traditional, authoritative) or clean sans-serif fonts are appropriate. Display and script fonts are too informal for body text." }},
      { type: "quizQuestion", question: { questionType: "true_false", text: "You should use as many different fonts as possible to make a design more interesting.", correctAnswer: false, explanation: "Too many fonts create visual chaos and look unprofessional. The rule is to use a maximum of two font families per design — one for headings, one for body text." }},
    ],
  },
  "colour-theory": {
    title: "Colour Theory",
    estimatedMinutes: 20,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A health app wants to use red as its primary colour. Should they? Consider the psychological and accessibility implications." },
      { type: "paragraph", text: "Colour is one of the most powerful tools in a designer's toolkit. It communicates emotion before a viewer reads a single word, and it can make or break a design's effectiveness." },
      { type: "video", youtubeId: "AvgCkHrcj90", title: "Colour Theory for Beginners", caption: "A practical guide to the colour wheel, harmonies, and how to use colour professionally." },
      COLOUR_GRID,
      { type: "richText", heading: "The Colour Wheel & Harmonies", html: "<p>The colour wheel organises hues into primary (red/yellow/blue), secondary (orange/green/purple), and tertiary colours. <strong>Colour harmonies</strong> are combinations that work well together:</p><ul><li><strong>Complementary</strong> — opposites on the wheel (red + green). High contrast, visually striking.</li><li><strong>Analogous</strong> — colours next to each other (blue, blue-green, green). Calm and cohesive.</li><li><strong>Triadic</strong> — three colours evenly spaced (red, yellow, blue). Vibrant and balanced.</li></ul>" },
      { type: "table", headers: ["Colour", "Emotion / Association", "Common Use"], rows: [
        ["Red", "Urgency, energy, danger, passion", "Sale banners, warnings, food brands (McDonald's, Coca-Cola)"],
        ["Blue", "Trust, calm, professionalism, technology", "Banks, social media (Facebook, Twitter), healthcare"],
        ["Green", "Nature, health, growth, money", "Environmental brands, wellness apps, financial services"],
        ["Yellow", "Optimism, warmth, caution", "Taxis, warning signs, children's products"],
        ["Black", "Luxury, sophistication, power", "High-end fashion, premium technology brands"],
        ["White", "Cleanliness, simplicity, space", "Minimalist design, medical, Apple products"],
      ]},
      { type: "callout", heading: "🏭 Industry Tip", text: "Digital designs use RGB colour mode (red, green, blue light — what screens display). Print designs use CMYK (cyan, magenta, yellow, black — printing inks). Always design in the right colour mode for your output medium." },
      { type: "quizQuestion", question: { questionType: "mcq", text: "A healthcare brand wants to communicate trust and calm. Which colour palette is most appropriate?", options: ["Red and orange", "Blue and white", "Black and gold", "Purple and yellow"], correctIndex: 1, explanation: "Blue communicates trust, calm, and professionalism — which is why it's the dominant colour in healthcare and banking. White adds cleanliness and clarity. Red and orange communicate urgency and energy, which are less appropriate." }},
      { type: "quizQuestion", question: { questionType: "true_false", text: "Complementary colours are colours that appear next to each other on the colour wheel.", correctAnswer: false, explanation: "Complementary colours are OPPOSITES on the colour wheel (e.g. red and green, blue and orange). Colours next to each other are called analogous colours." }},
    ],
  },
  "compositional-rules": {
    title: "Compositional Rules",
    estimatedMinutes: 20,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A photographer sends you 10 photos and asks which ones will work best for their new website header. How do you evaluate them using compositional rules?" },
      { type: "paragraph", text: "Composition is how you arrange elements within a design space. Strong composition guides the viewer's eye and makes designs feel intentional and professional — even when viewers can't explain why." },
      COMPOSITION_GRID,
      { type: "richText", heading: "Applying the Rules", html: "<p><strong>Rule of Thirds:</strong> Mentally divide your canvas into a 3×3 grid. Place your focal point at one of the four intersections — not dead centre. Off-centre subjects feel more dynamic and natural.</p><p><strong>Grid & Alignment:</strong> Align all elements to invisible grid lines. Consistent alignment creates structure and makes pages easier to scan. In web design, CSS Grid and Flexbox enforce these rules automatically.</p><p><strong>Golden Ratio:</strong> The proportion 1:1.618 appears throughout nature (shells, flowers, human faces). Using it to proportion layouts, font sizes, and element spacing creates inherent visual harmony.</p>" },
      { type: "callout", heading: "🏭 Industry Tip", text: "Rules are guidelines, not laws. Expert designers break these rules intentionally to create surprise or draw attention. But you need to understand the rules before you can break them effectively — and you need to be able to explain why you broke them." },
      { type: "quizQuestion", question: { questionType: "mcq", text: "According to the rule of thirds, where should a photographer position their main subject?", options: ["Dead centre of the frame", "At one of the four grid intersections", "In the top-left corner", "At the bottom edge"], correctIndex: 1, explanation: "The rule of thirds places the main subject at one of the four intersections created by dividing the frame into a 3×3 grid. This creates a more dynamic, natural composition than placing the subject dead centre." }},
    ],
  },
  "layout-and-design": {
    title: "Layout and Design",
    estimatedMinutes: 20,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "Your manager asks you to redesign an internal HR form to improve usability. Apply what you know about layout and design to make it clear, professional, and easy to complete." },
      { type: "paragraph", text: "Layout is how you arrange all elements — text, images, white space, buttons, icons — within a defined space. A strong layout makes content easy to scan, understand, and use." },
      { type: "video", youtubeId: "a5KYlHNKQB8", title: "Beginning Graphic Design: Layout & Composition", caption: "GCFLearnFree — how professional designers structure layouts for maximum readability and visual impact." },
      { type: "table", headers: ["Layout Consideration", "Why it matters", "How to apply it"], rows: [
        ["Alignment", "Creates visual order and professional finish", "Align all text and elements to a consistent grid — avoid random positioning"],
        ["White space", "Prevents visual clutter and improves readability", "Leave breathing room around important elements — don't fill every space"],
        ["Typography hierarchy", "Guides reader through content in priority order", "Use distinct sizes/weights for H1 > H2 > body text — 3 levels maximum"],
        ["Visual hierarchy", "Communicates what is most important", "Most important element = largest/most prominent; secondary info = smaller"],
        ["Consistency", "Builds trust and professionalism", "Same font, colour, and spacing rules applied throughout"],
      ]},
      { type: "callout", heading: "🏭 Industry Tip", text: "Professional designers test their layouts at three scales: mobile (320–480px), tablet (768px), and desktop (1200px+). A layout that looks great on desktop can be unusable on mobile. Always design responsively." },
      { type: "quizQuestion", question: { questionType: "mcq", text: "A document uses 6 different font sizes and 3 different alignments throughout. What design principle is being violated?", options: ["Emphasis", "Consistency and unity", "Contrast", "The rule of thirds"], correctIndex: 1, explanation: "Consistency and unity require that the same design rules are applied throughout a document. Using too many font sizes and alignments creates visual chaos and looks unprofessional." }},
      { type: "quizQuestion", question: { questionType: "short_answer", text: "A student submits a flyer with the heading in large bold text, the body text much smaller, and the call-to-action button slightly larger than body text but smaller than the heading. Explain how this demonstrates visual hierarchy.", marks: 4, explanation: "Strong answer: The design uses size and weight to communicate importance — the large bold heading captures attention first, the smaller body text provides detail, and the medium-sized button draws the eye as the action step. This creates a clear reading path: heading → information → action. Each element's size signals its relative importance to the viewer." }},
    ],
  },
};

// Y12 General has slightly different lesson IDs and goes deeper
const LESSONS_Y12 = {
  "elements-of-design-y12": {
    title: "Elements of Design",
    estimatedMinutes: 25,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A design agency has hired you as a junior designer. Your first task: audit a client's flyer and identify every design element used, then write a brief design critique." },
      { type: "paragraph", text: "Every visual design is built from seven fundamental building blocks — the elements of design. In Year 12, you'll learn to not just identify these elements, but explain how they work together and modify existing designs using them." },
      { type: "video", youtubeId: "YqQx75OPRa0", title: "Beginning Graphic Design: Fundamentals", caption: "GCFLearnFree — a visual intro to the fundamental design elements." },
      ELEMENTS_GRID,
      ELEMENTS_CALLOUT,
      { type: "keyTerms", items: [
        { term: "Element of design", definition: "One of seven fundamental building blocks of visual design: line, shape, space, texture, colour, form, and tone." },
        { term: "Visual texture", definition: "The implied surface quality in 2D digital design — roughness, smoothness, or grain created through patterns rather than actual physical texture." },
        { term: "Negative space", definition: "The empty area around or between subjects. Skilled designers use negative space deliberately to create focus and improve readability." },
      ]},
      { type: "quizQuestion", question: { questionType: "mcq", text: "A graphic designer uses diagonal lines across a poster background. What effect do diagonal lines typically create?", options: ["Calm and stability", "Energy and movement", "Structure and order", "Depth and volume"], correctIndex: 1, explanation: "Diagonal lines create energy and movement. Horizontal lines convey calm and stability; vertical lines suggest strength." }},
      { type: "quizQuestion", question: { questionType: "short_answer", text: "Explain how a designer could use the element of SPACE to improve the readability of a busy infographic.", marks: 3, explanation: "A strong answer: The designer should increase negative space (white space) around key elements to reduce visual clutter, create breathing room between sections, and draw the eye to the most important information. Grouping related elements and separating unrelated ones using space also improves scan-ability." }},
    ],
  },
  "principles-of-design-y12": {
    title: "Principles of Design",
    estimatedMinutes: 25,
    blocks: [
      { type: "callout", variant: "hook", heading: "🌐 Real World Scenario", text: "A client's website looks 'cluttered and overwhelming'. Using design principles as your framework, write a professional critique with specific recommendations." },
      { type: "paragraph", text: "The principles of design describe how to combine design elements effectively. Year 12 goes deeper: you need to understand the relationship between elements and principles, and be able to apply and annotate them in your own designs." },
      { type: "video", youtubeId: "yNDgFK2Jj1E", title: "Understanding Visual Design Principles", caption: "Google UX Design Certificate — how design principles apply in professional product design." },
      PRINCIPLES_GRID,
      { type: "richText", heading: "The Relationship Between Elements and Principles", html: "<p>Elements and principles are interdependent — you cannot apply a principle without using elements to do so:</p><ul><li><strong>Emphasis</strong> is created through <em>colour contrast</em>, <em>size</em> (form/shape), or <em>space</em> (isolation)</li><li><strong>Balance</strong> is achieved by distributing <em>colour</em>, <em>shape</em>, and <em>tone</em> across the composition</li><li><strong>Unity</strong> comes from consistent use of <em>colour</em>, <em>line</em> style, and <em>typography</em></li><li><strong>Contrast</strong> exploits differences in <em>tone</em>, <em>colour</em>, or <em>scale</em></li></ul><p>When annotating your designs, always name both the element and the principle it serves.</p>" },
      { type: "callout", heading: "🏭 Industry Tip", text: "Professional designers use a design critique framework: identify the target audience, list the design elements present, evaluate which principles are working or missing, and give specific recommendations. Practice this framework on every design you analyse." },
      { type: "quizQuestion", question: { questionType: "mcq", text: "A designer places a small logo in the bottom-right corner of a page and a large hero image at the top. The page still feels visually balanced. What type of balance is this?", options: ["Symmetrical balance", "Radial balance", "Asymmetrical balance", "No balance is present"], correctIndex: 2, explanation: "Asymmetrical balance places different-sized elements in positions that create visual equilibrium without mirroring. The large image's visual weight is counterbalanced by colour, placement, and other elements." }},
      { type: "quizQuestion", question: { questionType: "short_answer", text: "A student is designing a poster for a school event. The poster has five equally-sized elements with the same font weight and colour. Identify which principles are missing and explain how to fix this.", marks: 4, explanation: "Missing principles: Emphasis/dominance (no single element draws the eye), contrast (elements don't differentiate in weight or colour), and visual hierarchy (nothing indicates priority). Fix: Make the event title significantly larger and bolder (emphasis/dominance), use colour contrast to highlight the date and call-to-action, and vary font weights to create hierarchy between heading, supporting details, and contact information." }},
    ],
  },
};

// ─── Apply updates ────────────────────────────────────────────────────────────

function patchTopic(filename, topicId, newLessons) {
  const data = JSON.parse(readFileSync(join(root, "lib/content/data", filename), "utf8"));
  let patched = 0;
  for (const u of data.units) {
    const topic = u.topics.find(t => t.id === topicId);
    if (!topic) continue;
    topic.lessons = topic.lessons.map(l => {
      if (newLessons[l.id]) {
        patched++;
        return { id: l.id, ...newLessons[l.id] };
      }
      return l;
    });
  }
  writeFileSync(join(root, "lib/content/data", filename), JSON.stringify(data, null, 1), "utf8");
  console.log(`  ✓ ${filename}: ${patched} lessons updated in ${topicId}`);
}

console.log("Upgrading Y11 General design-concepts...");
patchTopic("year-11-applied-it-general.json", "design-concepts", LESSONS_Y11);

console.log("Upgrading Y12 General design-concepts...");
patchTopic("year-12-applied-it-general.json", "design-concepts", LESSONS_Y12);

console.log("\nDone.");
