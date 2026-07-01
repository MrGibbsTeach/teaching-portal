// Rebuilds the Elements and Principles of Design grid blocks in Y11 + Y12 General
// with purpose-built inline SVG demonstrations showing each concept IN USE.
// Run: node scripts/rebuild-design-visual-demos.mjs
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));

// ── Inline SVG demos (each is a self-contained visual demonstration) ──────────

const SVG = {
  line: `<svg viewBox="0 0 360 140" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="24" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">LINE IN ACTION</text>
  <!-- Horizontal = calm -->
  <line x1="20" y1="55" x2="100" y2="55" stroke="#3b82f6" stroke-width="3"/>
  <text x="20" y="72" font-family="Arial" font-size="10" fill="#64748b">Horizontal = calm</text>
  <!-- Diagonal = energy -->
  <line x1="140" y1="75" x2="220" y2="35" stroke="#ef4444" stroke-width="3"/>
  <text x="138" y="88" font-family="Arial" font-size="10" fill="#64748b">Diagonal = energy</text>
  <!-- Curved = flow -->
  <path d="M 250 70 Q 285 20 320 70" stroke="#10b981" stroke-width="3" fill="none"/>
  <text x="250" y="88" font-family="Arial" font-size="10" fill="#64748b">Curved = flow</text>
  <!-- Weight demo -->
  <line x1="20" y1="110" x2="100" y2="110" stroke="#1e293b" stroke-width="1"/>
  <line x1="140" y1="110" x2="220" y2="110" stroke="#1e293b" stroke-width="4"/>
  <line x1="250" y1="110" x2="320" y2="110" stroke="#1e293b" stroke-width="10"/>
  <text x="20" y="128" font-family="Arial" font-size="9" fill="#94a3b8">thin</text>
  <text x="148" y="128" font-family="Arial" font-size="9" fill="#94a3b8">medium</text>
  <text x="258" y="128" font-family="Arial" font-size="9" fill="#94a3b8">bold</text>
</svg>`,

  shape: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="22" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">SHAPE IN ACTION</text>
  <text x="16" y="38" font-family="Arial" font-size="10" fill="#94a3b8">Geometric = structured, trustworthy</text>
  <rect x="20" y="50" width="50" height="50" rx="2" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="115" cy="75" r="26" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="190,50 215,100 165,100" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <text x="28" y="115" font-family="Arial" font-size="9" fill="#64748b">square</text>
  <text x="101" y="115" font-family="Arial" font-size="9" fill="#64748b">circle</text>
  <text x="167" y="115" font-family="Arial" font-size="9" fill="#64748b">triangle</text>
  <text x="240" y="38" font-family="Arial" font-size="10" fill="#94a3b8">Organic = natural, friendly</text>
  <path d="M 255 60 C 265 40, 295 40, 310 60 C 330 80, 320 110, 295 110 C 270 115, 245 95, 255 60 Z" fill="#bbf7d0" stroke="#10b981" stroke-width="2"/>
  <text x="262" y="132" font-family="Arial" font-size="9" fill="#64748b">organic blob</text>
</svg>`,

  space: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">SPACE IN ACTION</text>
  <!-- Cramped -->
  <rect x="16" y="30" width="155" height="110" rx="4" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
  <text x="24" y="45" font-family="Arial" font-size="9" fill="#dc2626" font-weight="700">NO BREATHING ROOM</text>
  <rect x="22" y="50" width="140" height="12" rx="2" fill="#fca5a5"/>
  <rect x="22" y="64" width="140" height="8" rx="2" fill="#fca5a5" opacity=".6"/>
  <rect x="22" y="74" width="140" height="8" rx="2" fill="#fca5a5" opacity=".6"/>
  <rect x="22" y="84" width="140" height="8" rx="2" fill="#fca5a5" opacity=".6"/>
  <rect x="22" y="94" width="140" height="8" rx="2" fill="#fca5a5" opacity=".6"/>
  <rect x="22" y="104" width="140" height="8" rx="2" fill="#fca5a5" opacity=".6"/>
  <rect x="22" y="114" width="140" height="8" rx="2" fill="#fca5a5" opacity=".6"/>
  <rect x="22" y="124" width="140" height="8" rx="2" fill="#fca5a5" opacity=".5"/>
  <!-- Good space -->
  <rect x="185" y="30" width="158" height="110" rx="4" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
  <text x="193" y="45" font-family="Arial" font-size="9" fill="#16a34a" font-weight="700">WHITE SPACE = PREMIUM</text>
  <rect x="193" y="55" width="142" height="12" rx="2" fill="#86efac"/>
  <rect x="193" y="78" width="100" height="8" rx="2" fill="#86efac" opacity=".6"/>
  <rect x="193" y="90" width="120" height="8" rx="2" fill="#86efac" opacity=".6"/>
  <rect x="220" y="112" width="88" height="18" rx="9" fill="#16a34a"/>
  <text x="241" y="125" font-family="Arial" font-size="9" fill="white" font-weight="700">CTA button</text>
</svg>`,

  colour: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">COLOUR PROPERTIES</text>
  <text x="16" y="36" font-family="Arial" font-size="10" fill="#94a3b8">HUE — the colour family</text>
  <rect x="16" y="42" width="28" height="20" fill="#ef4444"/><rect x="48" y="42" width="28" height="20" fill="#f97316"/>
  <rect x="80" y="42" width="28" height="20" fill="#eab308"/><rect x="112" y="42" width="28" height="20" fill="#22c55e"/>
  <rect x="144" y="42" width="28" height="20" fill="#3b82f6"/><rect x="176" y="42" width="28" height="20" fill="#8b5cf6"/>
  <rect x="208" y="42" width="28" height="20" fill="#ec4899"/><rect x="240" y="42" width="28" height="20" fill="#6b7280"/>
  <text x="16" y="80" font-family="Arial" font-size="10" fill="#94a3b8">SATURATION — vivid → muted</text>
  <rect x="16" y="86" width="40" height="16" fill="#ef4444"/><rect x="60" y="86" width="40" height="16" fill="#f87171"/>
  <rect x="104" y="86" width="40" height="16" fill="#fca5a5"/><rect x="148" y="86" width="40" height="16" fill="#fee2e2"/>
  <rect x="192" y="86" width="40" height="16" fill="#f9fafb"/><text x="238" y="98" font-family="Arial" font-size="9" fill="#94a3b8">grey</text>
  <text x="16" y="118" font-family="Arial" font-size="10" fill="#94a3b8">TONE — light → dark</text>
  <rect x="16" y="124" width="35" height="16" fill="#fee2e2"/><rect x="55" y="124" width="35" height="16" fill="#fca5a5"/>
  <rect x="94" y="124" width="35" height="16" fill="#f87171"/><rect x="133" y="124" width="35" height="16" fill="#ef4444"/>
  <rect x="172" y="124" width="35" height="16" fill="#b91c1c"/><rect x="211" y="124" width="35" height="16" fill="#7f1d1d"/>
  <text x="254" y="136" font-family="Arial" font-size="9" fill="#94a3b8">←tint        shade→</text>
</svg>`,

  tone: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">TONE IN ACTION — why greyscale test matters</text>
  <text x="16" y="36" font-family="Arial" font-size="9" fill="#94a3b8">Greyscale test: if contrast disappears in black & white, your design has a tone problem</text>
  <!-- Full colour version -->
  <rect x="16" y="44" width="155" height="90" rx="6" fill="#1e40af"/>
  <text x="94" y="68" font-family="Arial" font-size="11" fill="white" font-weight="700" text-anchor="middle">FULL COLOUR</text>
  <rect x="36" y="76" width="115" height="14" rx="3" fill="#93c5fd" opacity=".5"/>
  <rect x="48" y="96" width="91" height="22" rx="11" fill="#fbbf24"/>
  <text x="94" y="111" font-family="Arial" font-size="10" fill="#1e293b" font-weight="700" text-anchor="middle">CTA Button</text>
  <!-- Greyscale version -->
  <rect x="189" y="44" width="155" height="90" rx="6" fill="#374151"/>
  <text x="267" y="68" font-family="Arial" font-size="11" fill="#f3f4f6" font-weight="700" text-anchor="middle">GREYSCALE TEST</text>
  <rect x="209" y="76" width="115" height="14" rx="3" fill="#9ca3af" opacity=".5"/>
  <rect x="221" y="96" width="91" height="22" rx="11" fill="#d1d5db"/>
  <text x="267" y="111" font-family="Arial" font-size="10" fill="#374151" font-weight="700" text-anchor="middle">Still visible? ✓</text>
</svg>`,

  balance: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">BALANCE IN ACTION</text>
  <!-- Symmetrical -->
  <rect x="16" y="28" width="155" height="112" rx="4" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="94" y="44" font-family="Arial" font-size="9" fill="#64748b" text-anchor="middle" font-weight="700">SYMMETRICAL</text>
  <rect x="36" y="52" width="50" height="50" rx="4" fill="#bfdbfe"/>
  <rect x="120" y="52" width="50" height="50" rx="4" fill="#bfdbfe"/>
  <rect x="64" y="112" width="42" height="20" rx="10" fill="#3b82f6"/>
  <text x="85" y="126" font-family="Arial" font-size="9" fill="white" text-anchor="middle">CTA</text>
  <!-- Asymmetrical -->
  <rect x="189" y="28" width="155" height="112" rx="4" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="267" y="44" font-family="Arial" font-size="9" fill="#64748b" text-anchor="middle" font-weight="700">ASYMMETRICAL</text>
  <rect x="199" y="52" width="80" height="70" rx="4" fill="#bfdbfe"/>
  <rect x="293" y="52" width="36" height="30" rx="4" fill="#fde68a"/>
  <rect x="293" y="88" width="36" height="14" rx="3" fill="#fde68a" opacity=".6"/>
  <rect x="293" y="108" width="36" height="14" rx="3" fill="#fde68a" opacity=".4"/>
  <text x="199" y="142" font-family="Arial" font-size="9" fill="#94a3b8">large image + small elements = balance</text>
</svg>`,

  emphasis: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">EMPHASIS IN ACTION</text>
  <!-- No emphasis -->
  <rect x="16" y="28" width="155" height="112" rx="4" fill="white" stroke="#e2e8f0"/>
  <text x="94" y="44" font-family="Arial" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="700">❌ NO EMPHASIS</text>
  <rect x="26" y="52" width="135" height="12" rx="2" fill="#e2e8f0"/>
  <rect x="26" y="68" width="135" height="12" rx="2" fill="#e2e8f0"/>
  <rect x="26" y="84" width="135" height="12" rx="2" fill="#e2e8f0"/>
  <rect x="26" y="100" width="135" height="12" rx="2" fill="#e2e8f0"/>
  <rect x="26" y="116" width="135" height="12" rx="2" fill="#e2e8f0"/>
  <!-- Clear emphasis -->
  <rect x="189" y="28" width="155" height="112" rx="4" fill="white" stroke="#e2e8f0"/>
  <text x="267" y="44" font-family="Arial" font-size="9" fill="#16a34a" text-anchor="middle" font-weight="700">✓ CLEAR EMPHASIS</text>
  <text x="267" y="68" font-family="Arial" font-size="18" fill="#1e293b" text-anchor="middle" font-weight="900">Big Heading</text>
  <rect x="209" y="76" width="116" height="8" rx="2" fill="#e2e8f0" opacity=".7"/>
  <rect x="209" y="88" width="90" height="8" rx="2" fill="#e2e8f0" opacity=".5"/>
  <rect x="229" y="104" width="76" height="26" rx="13" fill="#ef4444"/>
  <text x="267" y="121" font-family="Arial" font-size="10" fill="white" text-anchor="middle" font-weight="700">BUY NOW</text>
</svg>`,

  contrast: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">CONTRAST IN ACTION</text>
  <!-- Low contrast -->
  <rect x="16" y="28" width="155" height="112" rx="4" fill="#f1f5f9"/>
  <text x="94" y="50" font-family="Arial" font-size="14" fill="#94a3b8" text-anchor="middle" font-weight="700">Website Title</text>
  <text x="94" y="66" font-family="Arial" font-size="9" fill="#cbd5e1" text-anchor="middle">body text that is hard to read</text>
  <rect x="60" y="80" width="68" height="20" rx="10" fill="#e2e8f0"/>
  <text x="94" y="94" font-family="Arial" font-size="9" fill="#94a3b8" text-anchor="middle">Button</text>
  <text x="94" y="130" font-family="Arial" font-size="9" fill="#ef4444" text-anchor="middle">❌ FAILS accessibility (WCAG)</text>
  <!-- High contrast -->
  <rect x="189" y="28" width="155" height="112" rx="4" fill="#0f172a"/>
  <text x="267" y="50" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="700">Website Title</text>
  <text x="267" y="66" font-family="Arial" font-size="9" fill="#cbd5e1" text-anchor="middle">body text — clearly legible</text>
  <rect x="233" y="80" width="68" height="20" rx="10" fill="#f59e0b"/>
  <text x="267" y="94" font-family="Arial" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="700">Button</text>
  <text x="267" y="130" font-family="Arial" font-size="9" fill="#16a34a" text-anchor="middle">✓ PASSES accessibility (WCAG AA)</text>
</svg>`,

  proportion: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">PROPORTION IN ACTION</text>
  <!-- Wrong proportion -->
  <rect x="16" y="28" width="155" height="112" rx="4" fill="white" stroke="#fca5a5" stroke-width="2"/>
  <text x="94" y="44" font-family="Arial" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="700">❌ BAD PROPORTION</text>
  <text x="94" y="62" font-family="Arial" font-size="9" fill="#1e293b" text-anchor="middle" font-weight="700">Heading (9px)</text>
  <text x="94" y="88" font-family="Arial" font-size="18" fill="#1e293b" text-anchor="middle">Body text (18px)</text>
  <rect x="40" y="102" width="112" height="10" rx="5" fill="#fca5a5"/>
  <text x="96" y="112" font-family="Arial" font-size="6" fill="white" text-anchor="middle">BUTTON (6px)</text>
  <!-- Good proportion -->
  <rect x="189" y="28" width="155" height="112" rx="4" fill="white" stroke="#86efac" stroke-width="2"/>
  <text x="267" y="44" font-family="Arial" font-size="9" fill="#16a34a" text-anchor="middle" font-weight="700">✓ CORRECT PROPORTION</text>
  <text x="267" y="66" font-family="Arial" font-size="18" fill="#1e293b" text-anchor="middle" font-weight="700">H1 Heading (32px)</text>
  <text x="267" y="84" font-family="Arial" font-size="11" fill="#64748b" text-anchor="middle">Body text (16px)</text>
  <rect x="220" y="100" width="94" height="24" rx="12" fill="#16a34a"/>
  <text x="267" y="116" font-family="Arial" font-size="11" fill="white" text-anchor="middle" font-weight="700">CTA (16px)</text>
</svg>`,

  unity: `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;border-radius:8px;background:#f8fafc">
  <text x="16" y="20" font-family="Arial" font-size="11" fill="#64748b" font-weight="700">UNITY IN ACTION</text>
  <!-- No unity -->
  <rect x="16" y="28" width="155" height="112" rx="4" fill="white" stroke="#fca5a5" stroke-width="2"/>
  <text x="94" y="44" font-family="Arial" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="700">❌ NO UNITY</text>
  <text x="94" y="62" font-family="Arial" font-size="12" fill="#ef4444" text-anchor="middle" font-weight="900">Comic Sans Heading</text>
  <rect x="26" y="68" width="58" height="16" rx="8" fill="#8b5cf6"/>
  <rect x="96" y="68" width="75" height="16" rx="2" fill="#f59e0b"/>
  <text x="94" y="104" font-family="Arial" font-size="8" fill="#64748b" text-anchor="middle">Three completely different</text>
  <text x="94" y="116" font-family="Arial" font-size="8" fill="#64748b" text-anchor="middle">fonts, colours, styles</text>
  <!-- Unity -->
  <rect x="189" y="28" width="155" height="112" rx="4" fill="white" stroke="#86efac" stroke-width="2"/>
  <text x="267" y="44" font-family="Arial" font-size="9" fill="#16a34a" text-anchor="middle" font-weight="700">✓ UNIFIED DESIGN SYSTEM</text>
  <text x="267" y="62" font-family="Arial" font-size="12" fill="#0f172a" text-anchor="middle" font-weight="700">Inter Bold Heading</text>
  <rect x="210" y="68" width="58" height="16" rx="8" fill="#3b82f6"/>
  <rect x="280" y="68" width="55" height="16" rx="8" fill="#3b82f6" opacity=".6"/>
  <text x="267" y="104" font-family="Arial" font-size="8" fill="#64748b" text-anchor="middle">One font · One colour</text>
  <text x="267" y="116" font-family="Arial" font-size="8" fill="#64748b" text-anchor="middle">Consistent corner radius</text>
</svg>`,
};

// ── Rebuilt lesson blocks ──────────────────────────────────────────────────────

const ELEMENTS_LESSON_BLOCKS = [
  { type: "paragraph", text: "Every visual design is built from seven fundamental building blocks — the elements of design. Before you touch Figma or Canva, you need to recognise these in the wild and understand what each one communicates." },
  { type: "richText", heading: "Line — guides the eye", html: SVG.line + "<p style='margin-top:10px;font-size:14px;color:#475569'>Line is the most basic design element but one of the most expressive. The direction, weight, and style of a line communicate mood before the viewer reads a single word.</p>" },
  { type: "richText", heading: "Shape — carries personality", html: SVG.shape + "<p style='margin-top:10px;font-size:14px;color:#475569'>Banks use squares and rectangles (stability). Tech startups use circles (approachability). Organic brands use irregular blobs (natural). Shape is a brand decision.</p>" },
  { type: "richText", heading: "Space — the power of empty", html: SVG.space + "<p style='margin-top:10px;font-size:14px;color:#475569'>White space is not wasted space — it's a premium signal. Apple built a $3 trillion brand on generous negative space. Cramped = cheap. Spacious = luxurious.</p>" },
  { type: "richText", heading: "Colour — the fastest signal", html: SVG.colour + "<p style='margin-top:10px;font-size:14px;color:#475569'>Every colour has three independent properties. Changing one changes meaning. High saturation = vivid energy. Low saturation = muted sophistication. Low tone contrast = accessibility failure.</p>" },
  { type: "richText", heading: "Tone — the greyscale test", html: SVG.tone + "<p style='margin-top:10px;font-size:14px;color:#475569'>Tone is lightness vs darkness, independent of colour. Run every design through a greyscale filter before launch. If your button disappears in greyscale, it fails for users with colour blindness.</p>" },
  { type: "table", headers: ["Element", "What it communicates", "Designer's tool"], rows: [
    ["Line", "Direction, movement, emotion, structure", "Borders, dividers, arrows, underlines"],
    ["Shape", "Brand personality, content grouping", "Cards, buttons, icons, illustrations"],
    ["Space", "Quality, breathing room, focus", "Padding, margins, negative space"],
    ["Texture", "Depth, material feel, authenticity", "Background overlays, grain, patterns"],
    ["Colour", "Emotion, brand identity, hierarchy", "Palettes, gradients, accessibility"],
    ["3D Form", "Depth, realism, weight", "Shadows, gradients, perspective"],
    ["Tone", "Contrast, readability, accessibility", "Light/dark modes, greyscale test"],
  ]},
  { type: "quizQuestion", question: { questionType: "mcq", text: "A health brand uses light grey text on a white background. Which element of design is failing, and why?", options: ["Colour — the hue is wrong for healthcare", "Shape — the layout is too geometric", "Tone — insufficient contrast between light grey and white", "Space — there is not enough padding"], correctIndex: 2, explanation: "Tone — the lightness/darkness contrast between light grey and white is too low. This fails WCAG accessibility standards (minimum 4.5:1 contrast ratio for normal text). The hue (grey) may be fine, but the tone difference is too small to read reliably." }},
  { type: "quizQuestion", question: { questionType: "true_false", text: "White space in a design is wasted space that should always be filled with content.", correctAnswer: false, explanation: "False. White space (negative space) is a deliberate design decision. It reduces visual clutter, improves readability, and signals premium quality. Apple, Google, and every major tech brand uses generous white space intentionally." }},
];

const PRINCIPLES_LESSON_BLOCKS = [
  { type: "paragraph", text: "If elements are the ingredients, principles are the recipe. Knowing what's in the dish doesn't mean you can cook it. Principles tell you HOW to combine elements so the result works for the user." },
  { type: "richText", heading: "Balance — distribute visual weight", html: SVG.balance + "<p style='margin-top:10px;font-size:14px;color:#475569'>Symmetrical balance = formal, corporate, safe. Asymmetrical balance = dynamic, modern, editorial. Neither is better — know which one matches the client's brand.</p>" },
  { type: "richText", heading: "Emphasis + Dominance — one hero per screen", html: SVG.emphasis + "<p style='margin-top:10px;font-size:14px;color:#475569'>If everything is important, nothing is. Every screen needs ONE dominant element that catches the eye first. Your CTA is the hero. Make it obvious — then make everything else step back.</p>" },
  { type: "richText", heading: "Contrast — make differences clear", html: SVG.contrast + "<p style='margin-top:10px;font-size:14px;color:#475569'>Contrast isn't just visual preference — it's an accessibility requirement. WCAG AA requires 4.5:1 contrast ratio for normal text. Failing this means your site is legally inaccessible to users with vision impairment.</p>" },
  { type: "richText", heading: "Unity — one visual language", html: SVG.unity + "<p style='margin-top:10px;font-size:14px;color:#475569'>Unity is what a brand design system enforces. One font family. One colour palette. Consistent corner radius on all buttons and cards. When every element belongs to the same visual family, the design feels intentional.</p>" },
  { type: "richText", heading: "Proportion — size communicates importance", html: SVG.proportion + "<p style='margin-top:10px;font-size:14px;color:#475569'>Size relationships communicate hierarchy instantly. H1 > H2 > body > caption. A heading the same size as body text has no proportion — so it has no hierarchy. Eyeballing it is for students. Use a type scale.</p>" },
  { type: "callout", heading: "🏭 Leo's Diagnostic Framework", text: "Before any critique, run through every principle in order: Is there ONE dominant focal point? Is the layout balanced? Does contrast meet WCAG? Is the visual language unified? Are proportions communicating hierarchy? Missing any one of these is why designs feel 'off' even when people can't say why." },
  { type: "quizQuestion", question: { questionType: "mcq", text: "A student's landing page has a headline, hero image, 4 columns of body text, 3 CTA buttons, and 2 banner images — all the same visual weight. Which principle is most critically missing?", options: ["Unity — the visual language is inconsistent", "Emphasis — there is no single dominant focal point", "Texture — the page lacks visual surface variety", "Balance — the columns are uneven"], correctIndex: 1, explanation: "Emphasis — when every element has the same visual weight, there's no focal point, no hierarchy, and no clear action for the user. The eye doesn't know where to go. Leo's rule: one hero, one message, one primary CTA per screen." }},
  { type: "quizQuestion", question: { questionType: "short_answer", text: "Look at two website screenshots: Site A uses black text on white (#000 on #FFF). Site B uses light grey text on white (#D1D5DB on #FFFFFF). Both use the same font size. Explain which site has a contrast problem, identify which design principle is violated, and state the accessibility standard it fails.", marks: 3, explanation: "Site B has the contrast problem. Principle violated: Contrast (and tone). #D1D5DB on #FFFFFF has a contrast ratio of approximately 1.6:1 — far below the WCAG AA minimum of 4.5:1 for normal body text. This makes the content inaccessible to users with low vision or colour blindness. Site A's #000 on #FFF achieves 21:1 — perfect contrast." }},
];

// ── Apply to both Y11 and Y12 ─────────────────────────────────────────────────

function patchDesignLessons(filename, elementLessonId, principlesLessonId) {
  const data = JSON.parse(readFileSync(join(root, "lib/content/data", filename), "utf8"));
  let patched = 0;
  for (const unit of data.units) {
    const topic = unit.topics.find(t => t.id === "design-concepts");
    if (!topic) continue;
    topic.lessons = topic.lessons.map(l => {
      if (l.id === elementLessonId) { patched++; return { ...l, blocks: ELEMENTS_LESSON_BLOCKS }; }
      if (l.id === principlesLessonId) { patched++; return { ...l, blocks: PRINCIPLES_LESSON_BLOCKS }; }
      return l;
    });
  }
  writeFileSync(join(root, "lib/content/data", filename), JSON.stringify(data, null, 1), "utf8");
  console.log(`✓ ${filename}: ${patched} lessons rebuilt with inline SVG visual demos`);
}

patchDesignLessons("year-11-applied-it-general.json", "elements-of-design", "principles-of-design");
patchDesignLessons("year-12-applied-it-general.json", "elements-of-design-y12", "principles-of-design-y12");
console.log("Done.");
