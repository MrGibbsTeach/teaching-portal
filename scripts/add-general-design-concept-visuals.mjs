// Add lesson-specific visual worked examples to the Year 11 and Year 12
// AIT General Design Concepts sections. Existing photos, diagrams and copy stay
// intact; this script only inserts the missing applied visual examples.
import { readFileSync, writeFileSync } from "node:fs";

const frame = (label, content, caption) => `<figure style="margin:1.25rem 0;padding:1rem;border:1px solid #dbe4f0;border-radius:16px;background:linear-gradient(135deg,#f8fafc,#eef2ff);overflow:hidden"><svg viewBox="0 0 760 400" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto"><title>${label}</title>${content}</svg><figcaption style="margin-top:.75rem;color:#475569;font-size:.95rem;line-height:1.55">${caption}</figcaption></figure>`;

const visuals = {
  "elements-of-design": {
    title: "Visual walkthrough: texture and three-dimensional form",
    html: frame(
      "Side-by-side examples showing texture and three-dimensional form",
      `<rect x="25" y="32" width="345" height="330" rx="22" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><rect x="390" y="32" width="345" height="330" rx="22" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><rect x="25" y="32" width="345" height="54" rx="22" fill="#fef3c7"/><rect x="390" y="32" width="345" height="54" rx="22" fill="#e0e7ff"/><text x="48" y="67" fill="#92400e" font-family="Arial" font-size="20" font-weight="700">TEXTURE</text><text x="413" y="67" fill="#3730a3" font-family="Arial" font-size="20" font-weight="700">3D FORM</text><rect x="61" y="116" width="273" height="151" rx="15" fill="#a16207"/><g stroke="#713f12" stroke-width="4" opacity=".7" fill="none"><path d="M70 145q45-28 90 0t90 0 80 2M65 177q47-24 93 2t93-1 77 3M68 215q43-19 89 2t90-1 80 0M69 245q50-24 96 1t87-1 76 1"/><path d="M93 120v141M151 120v146M234 120v143M296 120v142" stroke-width="1.5" opacity=".45"/></g><text x="197" y="294" text-anchor="middle" fill="#475569" font-family="Arial" font-size="14">Grain suggests a material you can almost feel</text><ellipse cx="562" cy="225" rx="82" ry="25" fill="#3730a3" opacity=".18"/><path d="M488 153a74 74 0 0 1 148 0v56a74 74 0 0 1-148 0z" fill="#818cf8"/><ellipse cx="562" cy="153" rx="74" ry="25" fill="#c7d2fe"/><path d="M491 154a71 22 0 0 0 142 0" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M505 185q56 25 114 0M506 213q55 25 112 0" fill="none" stroke="#4f46e5" stroke-width="3"/><text x="562" y="294" text-anchor="middle" fill="#475569" font-family="Arial" font-size="14">Light, shadow and perspective show volume</text><text x="197" y="335" text-anchor="middle" fill="#92400e" font-family="Arial" font-size="12" font-weight="700">PATTERN + SURFACE DETAIL</text><text x="562" y="335" text-anchor="middle" fill="#3730a3" font-family="Arial" font-size="12" font-weight="700">HEIGHT + DEPTH + SHADOW</text>`,
      "Texture is the surface quality a design suggests, such as wood grain. Three-dimensional form shows volume through height, depth, light and shadow. In a digital interface, both can be created with visual effects even when the screen itself is flat."
    ),
  },
  "compositional-rules": {
    title: "Visual walkthrough: placing a focal point",
    html: frame(
      "Website banner showing a surfer placed on a rule-of-thirds grid",
      `<rect x="20" y="20" width="720" height="360" rx="24" fill="#0f172a"/><rect x="40" y="40" width="680" height="320" rx="18" fill="#0e7490"/><path d="M50 250 Q160 210 275 252 T500 246 T710 250 V350 H50Z" fill="#155e75"/><path d="M50 285 Q180 245 300 287 T540 280 T710 285 V350 H50Z" fill="#67e8f9"/><circle cx="560" cy="115" r="45" fill="#fbbf24"/><path d="M240 245l55-15 38 14-58 8z" fill="#f97316"/><circle cx="280" cy="238" r="8" fill="#fff7ed"/><g stroke="#f8fafc" stroke-width="2" stroke-dasharray="8 7" opacity=".85"><path d="M266 40v320M493 40v320M40 147h680M40 253h680"/></g><g fill="#f8fafc" font-family="Arial,sans-serif"><text x="72" y="85" font-size="17" font-weight="700">MARGARET RIVER SURF</text><text x="72" y="116" font-size="13" opacity=".86">Find your next wave</text><rect x="72" y="142" width="132" height="38" rx="19" fill="#fbbf24"/><text x="96" y="166" fill="#1e293b" font-size="13" font-weight="700">VIEW CONDITIONS</text><text x="510" y="323" font-size="13">Focal point sits near a grid intersection</text></g>`,
      "The 3 × 3 guide makes the off-centre surfer and sun deliberate focal points. The headline and button stay grouped on the left, with clear alignment and breathing room."
    ),
  },
  "analysing-and-applying-design": {
    title: "Visual walkthrough: analyse a product screen",
    html: frame(
      "Annotated event website screen with four numbered analysis points",
      `<rect x="18" y="18" width="724" height="364" rx="24" fill="#e2e8f0"/><rect x="38" y="38" width="684" height="324" rx="16" fill="#fff"/><rect x="38" y="38" width="684" height="42" rx="16" fill="#1e293b"/><circle cx="60" cy="59" r="6" fill="#fb7185"/><circle cx="80" cy="59" r="6" fill="#fbbf24"/><circle cx="100" cy="59" r="6" fill="#34d399"/><rect x="178" y="50" width="375" height="18" rx="9" fill="#475569"/><rect x="58" y="98" width="402" height="235" rx="12" fill="#1d4ed8"/><circle cx="355" cy="153" r="48" fill="#fbbf24"/><path d="M90 264 Q160 206 230 258 T410 240V320H90Z" fill="#38bdf8"/><text x="82" y="139" fill="#fff" font-family="Arial" font-size="13" font-weight="700">BUNBURY WINTER FESTIVAL</text><text x="480" y="122" fill="#0f172a" font-family="Arial" font-size="19" font-weight="700">This weekend</text><text x="480" y="151" fill="#475569" font-family="Arial" font-size="13">Music, food and family events</text><text x="480" y="174" fill="#475569" font-family="Arial" font-size="13">along the foreshore.</text><rect x="480" y="197" width="190" height="42" rx="10" fill="#f97316"/><text x="519" y="223" fill="#fff" font-family="Arial" font-size="14" font-weight="700">PLAN YOUR VISIT</text><text x="480" y="271" fill="#334155" font-family="Arial" font-size="12">Saturday · 10 am–8 pm</text><text x="480" y="294" fill="#334155" font-family="Arial" font-size="12">Free entry · accessible venue</text><g font-family="Arial" font-weight="700" text-anchor="middle"><g><circle cx="438" cy="111" r="17" fill="#7c3aed"/><text x="438" y="117" fill="#fff" font-size="14">1</text></g><g><circle cx="656" cy="195" r="17" fill="#ea580c"/><text x="656" y="201" fill="#fff" font-size="14">2</text></g><g><circle cx="635" cy="264" r="17" fill="#0891b2"/><text x="635" y="270" fill="#fff" font-size="14">3</text></g><g><circle cx="76" cy="310" r="17" fill="#16a34a"/><text x="76" y="316" fill="#fff" font-size="14">4</text></g></g>`,
      "Use the numbered markers to practise the four moves: notice what stands out, name the element, explain its effect for the audience, then suggest an improvement tied to the purpose."
    ),
  },
  "design-concepts-quiz": {
    title: "Quick visual map: from design choice to user effect",
    html: frame(
      "Four connected stages: elements, principles, composition and audience effect",
      `<g font-family="Arial,sans-serif"><rect x="30" y="55" width="155" height="225" rx="20" fill="#fff" stroke="#c7d2fe" stroke-width="3"/><rect x="215" y="55" width="155" height="225" rx="20" fill="#fff" stroke="#a5f3fc" stroke-width="3"/><rect x="400" y="55" width="155" height="225" rx="20" fill="#fff" stroke="#fde68a" stroke-width="3"/><rect x="585" y="55" width="145" height="225" rx="20" fill="#fff" stroke="#bbf7d0" stroke-width="3"/><g text-anchor="middle"><circle cx="108" cy="112" r="37" fill="#4f46e5"/><text x="108" y="120" fill="#fff" font-size="24" font-weight="700">1</text><text x="108" y="178" fill="#1e293b" font-size="19" font-weight="700">ELEMENT</text><text x="108" y="211" fill="#475569" font-size="14">Colour, shape,</text><text x="108" y="232" fill="#475569" font-size="14">line, space</text><circle cx="293" cy="112" r="37" fill="#0891b2"/><text x="293" y="120" fill="#fff" font-size="24" font-weight="700">2</text><text x="293" y="178" fill="#1e293b" font-size="19" font-weight="700">PRINCIPLE</text><text x="293" y="211" fill="#475569" font-size="14">Emphasis, unity,</text><text x="293" y="232" fill="#475569" font-size="14">balance</text><circle cx="478" cy="112" r="37" fill="#d97706"/><text x="478" y="120" fill="#fff" font-size="24" font-weight="700">3</text><text x="478" y="178" fill="#1e293b" font-size="19" font-weight="700">LAYOUT</text><text x="478" y="211" fill="#475569" font-size="14">Type, grid,</text><text x="478" y="232" fill="#475569" font-size="14">composition</text><circle cx="657" cy="112" r="37" fill="#16a34a"/><text x="657" y="120" fill="#fff" font-size="24" font-weight="700">4</text><text x="657" y="178" fill="#1e293b" font-size="19" font-weight="700">EFFECT</text><text x="657" y="211" fill="#475569" font-size="14">Clear, accessible,</text><text x="657" y="232" fill="#475569" font-size="14">fit for purpose</text></g><g stroke="#64748b" stroke-width="4" fill="none"><path d="M188 168h20"/><path d="M373 168h20"/><path d="M558 168h20"/></g><g fill="#64748b"><path d="m204 160 10 8-10 8z"/><path d="m389 160 10 8-10 8z"/><path d="m574 160 10 8-10 8z"/></g><text x="380" y="338" text-anchor="middle" fill="#334155" font-size="17" font-weight="700">Explain the link: “The designer used ___ to create ___, so the user can ___.”</text></g>`,
      "Use this chain to structure a short answer: identify the choice, connect it to the principle or layout, then state what it does for the intended user."
    ),
  },
  "design-concepts-1-elements-of-design": {
    title: "Visual worked example: the streaming home screen",
    html: frame(
      "Streaming service interface annotated to show line, shape, space, texture and colour",
      `<rect x="20" y="20" width="720" height="360" rx="25" fill="#111827"/><rect x="48" y="44" width="664" height="45" rx="12" fill="#1f2937"/><circle cx="74" cy="66" r="12" fill="#f43f5e"/><text x="97" y="72" fill="#f8fafc" font-family="Arial" font-size="17" font-weight="700">STREAM</text><text x="210" y="71" fill="#e2e8f0" font-family="Arial" font-size="13">Home　Series　Films</text><rect x="570" y="55" width="118" height="22" rx="11" fill="#374151"/><text x="591" y="71" fill="#cbd5e1" font-family="Arial" font-size="11">⌕ Search</text><rect x="48" y="108" width="664" height="142" rx="18" fill="#312e81"/><circle cx="600" cy="158" r="50" fill="#a78bfa" opacity=".5"/><path d="M430 250 Q510 142 580 240 T710 230V250Z" fill="#4f46e5"/><text x="73" y="155" fill="#fff" font-family="Arial" font-size="12" font-weight="700">FEATURED</text><text x="73" y="192" fill="#fff" font-family="Arial" font-size="29" font-weight="700">Into the Blue</text><rect x="73" y="207" width="114" height="29" rx="14" fill="#f43f5e"/><text x="103" y="226" fill="#fff" font-family="Arial" font-size="12" font-weight="700">▶ PLAY</text><text x="52" y="278" fill="#fff" font-family="Arial" font-size="15" font-weight="700">Continue watching</text><g><rect x="52" y="294" width="142" height="65" rx="10" fill="#0e7490"/><rect x="208" y="294" width="142" height="65" rx="10" fill="#7c2d12"/><rect x="364" y="294" width="142" height="65" rx="10" fill="#14532d"/><rect x="520" y="294" width="142" height="65" rx="10" fill="#6b21a8"/><path d="M52 347h142M208 347h142M364 347h142M520 347h142" stroke="#fff" stroke-width="5" opacity=".35"/></g><g font-family="Arial" font-size="12" font-weight="700"><rect x="515" y="107" width="178" height="24" rx="12" fill="#fff"/><text x="526" y="124" fill="#312e81">SPACE: clear gaps between rows</text><rect x="50" y="362" width="208" height="22" rx="11" fill="#fff"/><text x="60" y="377" fill="#0f172a">SHAPE: rounded play button and cards</text></g>`,
      "The screen shows the five elements together: dividing lines, rounded shapes, open space, image-like texture and a limited colour palette. Look at how each choice helps the viewer scan and select a title."
    ),
  },
  "design-concepts-2-principles-of-design": {
    title: "Visual worked example: concert poster hierarchy",
    html: frame(
      "Concert poster with a clear title, focal point, date and grouped details",
      `<rect x="190" y="18" width="380" height="364" rx="18" fill="#18102f"/><path d="M192 244 Q280 115 380 236 T568 212V380H192Z" fill="#7c3aed"/><circle cx="380" cy="204" r="86" fill="#f97316"/><circle cx="380" cy="204" r="55" fill="#fbbf24"/><path d="M323 210q58-80 114 0M325 225q55 42 110 0" stroke="#fff7ed" stroke-width="5" fill="none"/><text x="380" y="67" text-anchor="middle" fill="#67e8f9" font-family="Arial" font-size="13" font-weight="700" letter-spacing="4">LIVE AT THE FORESHORE</text><text x="380" y="111" text-anchor="middle" fill="#fff" font-family="Arial" font-size="31" font-weight="900">SOUND</text><text x="380" y="146" text-anchor="middle" fill="#fff" font-family="Arial" font-size="31" font-weight="900">WAVES</text><text x="380" y="323" text-anchor="middle" fill="#fff" font-family="Arial" font-size="19" font-weight="700">SAT 14 NOV · 6 PM</text><text x="380" y="351" text-anchor="middle" fill="#ddd6fe" font-family="Arial" font-size="13">Bunbury · Tickets from $25</text><g font-family="Arial,sans-serif" font-size="13" font-weight="700"><rect x="25" y="62" width="142" height="47" rx="14" fill="#fff"/><text x="43" y="91" fill="#6d28d9">1  DOMINANCE</text><rect x="590" y="111" width="145" height="47" rx="14" fill="#fff"/><text x="609" y="140" fill="#c2410c">2  EMPHASIS</text><rect x="25" y="280" width="142" height="47" rx="14" fill="#fff"/><text x="43" y="309" fill="#0e7490">3  CONTRAST</text><rect x="590" y="292" width="145" height="47" rx="14" fill="#fff"/><text x="610" y="321" fill="#334155">4  UNITY</text><g stroke="#fff" stroke-width="2" stroke-dasharray="5 5"><path d="M167 86 264 83"/><path d="M590 135 466 175"/><path d="M167 303 262 282"/><path d="M590 315 494 340"/></g></g>`,
      "The largest words establish dominance. The bright central illustration creates emphasis, strong light-dark and warm-cool differences provide contrast, and the repeated colours tie the poster together as a unified design."
    ),
  },
  "design-concepts-3-elements-and-principles-relationship": {
    title: "Visual worked example: link the choice to its effect",
    html: frame(
      "Weather app screen showing colour, shape and space creating emphasis and unity",
      `<rect x="20" y="18" width="720" height="364" rx="25" fill="#dbeafe"/><rect x="190" y="28" width="380" height="344" rx="28" fill="#fff" stroke="#94a3b8" stroke-width="5"/><text x="220" y="70" fill="#0f172a" font-family="Arial" font-size="18" font-weight="700">BUNBURY WEATHER</text><circle cx="470" cy="127" r="37" fill="#fbbf24"/><path d="M447 126q5-24 25-16 16-29 37 0 21-2 19 22h-76" fill="#fff"/><text x="220" y="155" fill="#0f172a" font-family="Arial" font-size="50" font-weight="700">22°</text><text x="224" y="181" fill="#64748b" font-family="Arial" font-size="14">Partly cloudy</text><rect x="220" y="204" width="320" height="54" rx="15" fill="#2563eb"/><text x="244" y="238" fill="#fff" font-family="Arial" font-size="15" font-weight="700">TODAY 　High 24°　Low 16°</text><g><rect x="220" y="277" width="92" height="62" rx="13" fill="#eff6ff"/><rect x="326" y="277" width="92" height="62" rx="13" fill="#eff6ff"/><rect x="432" y="277" width="108" height="62" rx="13" fill="#eff6ff"/><text x="239" y="301" fill="#334155" font-family="Arial" font-size="12">TUE</text><text x="239" y="326" fill="#1d4ed8" font-family="Arial" font-size="16" font-weight="700">21°</text><text x="345" y="301" fill="#334155" font-family="Arial" font-size="12">WED</text><text x="345" y="326" fill="#1d4ed8" font-family="Arial" font-size="16" font-weight="700">23°</text><text x="451" y="301" fill="#334155" font-family="Arial" font-size="12">THU</text><text x="451" y="326" fill="#1d4ed8" font-family="Arial" font-size="16" font-weight="700">22°</text></g><g font-family="Arial" font-size="12" font-weight="700"><rect x="28" y="105" width="142" height="44" rx="13" fill="#fff"/><text x="43" y="132" fill="#1d4ed8">COLOUR → emphasis</text><path d="M170 127h38" stroke="#1d4ed8" stroke-width="3"/><rect x="584" y="244" width="150" height="44" rx="13" fill="#fff"/><text x="598" y="271" fill="#0f766e">REPEATED SHAPES</text><path d="M584 266h-35" stroke="#0f766e" stroke-width="3"/></g>`,
      "Blue colour and a large temperature are elements used to create emphasis. Repeated rounded forecast cards create unity. In an explanation, name both the element and the principle, then connect them with the effect."
    ),
  },
  "design-concepts-4-typography": {
    title: "Visual worked example: readable bus departures",
    html: frame(
      "Bus departure display comparing clear typography with a hard-to-read version",
      `<rect x="24" y="32" width="344" height="332" rx="22" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="392" y="32" width="344" height="332" rx="22" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="24" y="32" width="344" height="58" rx="22" fill="#0f766e"/><rect x="392" y="32" width="344" height="58" rx="22" fill="#64748b"/><text x="48" y="69" fill="#fff" font-family="Arial" font-size="18" font-weight="700">CLEAR DISPLAY</text><text x="416" y="69" fill="#fff" font-family="Arial" font-size="18" font-weight="700">HARD TO READ</text><g font-family="Arial,sans-serif"><text x="48" y="131" fill="#0f172a" font-size="21" font-weight="700">Bunbury Station</text><text x="48" y="160" fill="#475569" font-size="14">Next departures</text><text x="48" y="211" fill="#0f172a" font-size="17" font-weight="700">7:42　 Australind</text><text x="48" y="242" fill="#334155" font-size="15">Platform 2　 On time</text><text x="48" y="294" fill="#0f172a" font-size="17" font-weight="700">8:05　 Perth Express</text><text x="48" y="325" fill="#334155" font-size="15">Platform 1　 3 min</text><text x="416" y="131" fill="#94a3b8" font-size="12" font-style="italic">BUNBURY STATION NEXT DEPARTURES</text><text x="416" y="211" fill="#cbd5e1" font-size="15" font-weight="400">7:42 Australind PLATFORM TWO</text><text x="416" y="242" fill="#cbd5e1" font-size="13" font-style="italic">ON TIME</text><text x="416" y="294" fill="#cbd5e1" font-size="14" font-weight="400">8:05 Perth Express PLAT. 1</text><text x="416" y="325" fill="#cbd5e1" font-size="12" font-style="italic">3 MINUTES</text></g><rect x="52" y="100" width="196" height="25" rx="12" fill="#ccfbf1"/><text x="65" y="118" fill="#115e59" font-family="Arial" font-size="12" font-weight="700">SIZE + WEIGHT = HIERARCHY</text><rect x="420" y="100" width="255" height="25" rx="12" fill="#f1f5f9"/><text x="432" y="118" fill="#475569" font-family="Arial" font-size="12" font-weight="700">LOW CONTRAST · MIXED STYLES</text>`,
      "The left example gives the station name and departure times a clear hierarchy, uses consistent sans-serif text and strong contrast, and leaves enough spacing to scan quickly. The right version makes the same information harder to find."
    ),
  },
  "design-concepts-5-compositional-rules": {
    title: "Visual worked example: repair the banner composition",
    html: frame(
      "Before and after surf banner comparing a centred layout with a rule-of-thirds composition",
      `<g font-family="Arial,sans-serif"><rect x="18" y="42" width="350" height="315" rx="20" fill="#fff"/><rect x="392" y="42" width="350" height="315" rx="20" fill="#fff"/><rect x="18" y="42" width="350" height="48" rx="20" fill="#fee2e2"/><rect x="392" y="42" width="350" height="48" rx="20" fill="#dcfce7"/><text x="40" y="73" fill="#991b1b" font-size="16" font-weight="700">BEFORE · everything centred</text><text x="414" y="73" fill="#166534" font-size="16" font-weight="700">AFTER · thirds + alignment</text><rect x="35" y="105" width="316" height="230" rx="12" fill="#0e7490"/><rect x="409" y="105" width="316" height="230" rx="12" fill="#0e7490"/><path d="M38 270Q100 210 165 270T350 260v72H38ZM412 270Q475 210 540 270T724 260v72H412Z" fill="#67e8f9"/><circle cx="286" cy="150" r="27" fill="#fbbf24"/><circle cx="603" cy="150" r="27" fill="#fbbf24"/><g stroke="#fff" stroke-width="1.5" stroke-dasharray="6 5" opacity=".8"><path d="M514 105v230M620 105v230M409 182h316M409 258h316"/></g><text x="192" y="193" fill="#fff" font-size="22" font-weight="700">SURF THE SOUTH</text><rect x="118" y="213" width="150" height="31" rx="15" fill="#f97316"/><text x="143" y="234" fill="#fff" font-size="13" font-weight="700">BOOK A LESSON</text><text x="430" y="175" fill="#fff" font-size="22" font-weight="700">SURF THE SOUTH</text><text x="431" y="204" fill="#ecfeff" font-size="13">Small groups · local coaches</text><rect x="431" y="218" width="130" height="31" rx="15" fill="#f97316"/><text x="452" y="239" fill="#fff" font-size="13" font-weight="700">BOOK A LESSON</text><text x="410" y="324" fill="#fff" font-size="11">Subject at an intersection · content aligned to a left column</text></g>`,
      "The first banner stacks every item in the centre. In the revised version, the grid places the sun and surf focal point off-centre, while the title, supporting line and button share a clean left edge."
    ),
  },
  "design-concepts-6-analysing-existing-products": {
    title: "Visual worked example: inspect the pizza order screen",
    html: frame(
      "Pizza ordering app screen annotated with scan order, contrast, grouping and space",
      `<rect x="20" y="20" width="720" height="360" rx="24" fill="#fff"/><rect x="42" y="42" width="676" height="48" rx="14" fill="#7f1d1d"/><text x="66" y="73" fill="#fff" font-family="Arial" font-size="19" font-weight="700">PIZZA PLACE</text><text x="570" y="72" fill="#fff" font-family="Arial" font-size="14">Menu　 Help</text><rect x="52" y="111" width="288" height="220" rx="18" fill="#ffedd5"/><circle cx="196" cy="217" r="83" fill="#d97706"/><circle cx="196" cy="217" r="68" fill="#fde68a"/><g fill="#dc2626"><circle cx="169" cy="196" r="8"/><circle cx="218" cy="186" r="8"/><circle cx="226" cy="235" r="8"/><circle cx="176" cy="245" r="8"/></g><g fill="#166534"><ellipse cx="195" cy="180" rx="6" ry="3"/><ellipse cx="157" cy="224" rx="6" ry="3"/><ellipse cx="210" cy="255" rx="6" ry="3"/></g><text x="370" y="142" fill="#0f172a" font-family="Arial" font-size="25" font-weight="700">Classic Margherita</text><text x="370" y="173" fill="#64748b" font-family="Arial" font-size="14">Tomato · mozzarella · basil</text><text x="370" y="216" fill="#0f172a" font-family="Arial" font-size="22" font-weight="700">$18.50</text><rect x="370" y="237" width="190" height="48" rx="13" fill="#dc2626"/><text x="406" y="267" fill="#fff" font-family="Arial" font-size="16" font-weight="700">ADD TO ORDER</text><text x="370" y="315" fill="#475569" font-family="Arial" font-size="13">★★★★★　 4.8 · 126 reviews</text><g font-family="Arial" font-weight="700" text-anchor="middle"><circle cx="345" cy="130" r="16" fill="#7c3aed"/><text x="345" y="136" fill="#fff" font-size="13">1</text><circle cx="570" cy="230" r="16" fill="#dc2626"/><text x="570" y="236" fill="#fff" font-size="13">2</text><circle cx="693" cy="309" r="16" fill="#0891b2"/><text x="693" y="315" fill="#fff" font-size="13">3</text></g>`,
      "Start at marker 1: the product name and image dominate. Marker 2 uses a contrasting action button. Marker 3 groups the rating below the purchase details. Describe what you can see before explaining its effect."
    ),
  },
  "design-concepts-7-modifying-and-annotating-designs": {
    title: "Visual worked example: redesign and annotate a flyer",
    html: frame(
      "Before and after dog-walking flyer with numbered design annotations",
      `<g font-family="Arial,sans-serif"><rect x="18" y="38" width="350" height="322" rx="20" fill="#fff"/><rect x="392" y="38" width="350" height="322" rx="20" fill="#fff"/><rect x="18" y="38" width="350" height="48" rx="20" fill="#fee2e2"/><rect x="392" y="38" width="350" height="48" rx="20" fill="#dcfce7"/><text x="40" y="69" fill="#991b1b" font-size="16" font-weight="700">BEFORE · details compete</text><text x="414" y="69" fill="#166534" font-size="16" font-weight="700">AFTER · clear for the client</text><rect x="38" y="101" width="310" height="239" rx="12" fill="#f1f5f9"/><text x="193" y="143" text-anchor="middle" fill="#7c3aed" font-size="27" font-weight="900">DOG WALKING!</text><text x="193" y="172" text-anchor="middle" fill="#0f172a" font-size="13">BEST WALKS EVER!!!</text><circle cx="193" cy="232" r="35" fill="#fbbf24"/><path d="M169 226q-8-30 9-23l13 13 13-13q18-7 9 23l-7 20h-30z" fill="#92400e"/><text x="193" y="300" text-anchor="middle" fill="#7c3aed" font-size="12">CALL 0412 345 678 · OPEN NOW</text><rect x="412" y="101" width="310" height="239" rx="12" fill="#ecfeff"/><rect x="412" y="101" width="310" height="53" rx="12" fill="#0f766e"/><text x="434" y="136" fill="#fff" font-size="22" font-weight="900">HAPPY PAWS</text><circle cx="664" cy="129" r="24" fill="#fbbf24"/><path d="M648 126q-5-19 7-14l9 8 9-8q12-5 7 14l-5 12h-21z" fill="#92400e"/><text x="434" y="190" fill="#0f172a" font-size="22" font-weight="700">Local dog walks</text><text x="434" y="215" fill="#475569" font-size="13">Friendly, reliable care in Bunbury</text><rect x="434" y="234" width="170" height="39" rx="18" fill="#f97316"/><text x="458" y="259" fill="#fff" font-size="14" font-weight="700">CALL 0412 345 678</text><text x="434" y="300" fill="#334155" font-size="12">Weekdays · First walk $10</text><g font-family="Arial" font-size="12" font-weight="700"><circle cx="659" cy="183" r="14" fill="#7c3aed"/><text x="655" y="187" fill="#fff">1</text><circle cx="608" cy="230" r="14" fill="#ea580c"/><text x="604" y="234" fill="#fff">2</text><circle cx="682" cy="296" r="14" fill="#0891b2"/><text x="678" y="300" fill="#fff">3</text></g></g>`,
      "The revised flyer gives the business name the strongest position, makes the phone number a high-contrast action, and groups service details below. A complete annotation names the change, the design choice, and how it meets the brief."
    ),
  },
};

function insertAfterWorkedExample(lesson, visual) {
  if (lesson.blocks.some((block) => block.heading === visual.title)) return false;
  const headingIndex = lesson.blocks.findIndex(
    (block) => block.type === "heading" && /worked example/i.test(block.text || block.heading || "")
  );
  if (headingIndex < 0) throw new Error(`Worked-example heading missing in ${lesson.id}`);
  const followingText = lesson.blocks.findIndex(
    (block, index) => index > headingIndex && ["richText", "paragraph"].includes(block.type)
  );
  const at = followingText < 0 ? headingIndex + 1 : followingText + 1;
  lesson.blocks.splice(at, 0, { type: "richText", heading: visual.title, html: visual.html });
  return true;
}

function insertAfterFirstList(lesson, visual) {
  if (lesson.blocks.some((block) => block.heading === visual.title)) return false;
  const at = lesson.blocks.findIndex((block) => block.type === "list");
  if (at < 0) throw new Error(`Analysis steps missing in ${lesson.id}`);
  lesson.blocks.splice(at + 1, 0, { type: "richText", heading: visual.title, html: visual.html });
  return true;
}

function insertAfterExistingGrid(lesson, visual) {
  if (lesson.blocks.some((block) => block.heading === visual.title)) return false;
  const at = lesson.blocks.findIndex((block) => block.type === "grid");
  if (at < 0) throw new Error(`Visual grid missing in ${lesson.id}`);
  lesson.blocks.splice(at + 1, 0, { type: "richText", heading: visual.title, html: visual.html });
  return true;
}

function insertAfterScenario(lesson, visual) {
  if (lesson.blocks.some((block) => block.heading === visual.title)) return false;
  const at = lesson.blocks.findIndex((block) => block.type === "callout");
  if (at < 0) throw new Error(`Scenario callout missing in ${lesson.id}`);
  lesson.blocks.splice(at + 1, 0, { type: "richText", heading: visual.title, html: visual.html });
  return true;
}

function insertAfterToneExample(lesson, visual) {
  if (lesson.blocks.some((block) => block.heading === visual.title)) return false;
  const at = lesson.blocks.findIndex(
    (block) => block.type === "richText" && /Tone/i.test(block.heading || "")
  );
  if (at < 0) throw new Error(`Tone example missing in ${lesson.id}`);
  lesson.blocks.splice(at + 1, 0, { type: "richText", heading: visual.title, html: visual.html });
  return true;
}

const targets = {
  "year-11-applied-it-general.json": {
    "elements-of-design": insertAfterToneExample,
    "compositional-rules": insertAfterExistingGrid,
    "analysing-and-applying-design": insertAfterFirstList,
    "design-concepts-quiz": insertAfterScenario,
  },
  "year-12-applied-it-general.json": {
    "design-concepts-1-elements-of-design": insertAfterWorkedExample,
    "design-concepts-2-principles-of-design": insertAfterWorkedExample,
    "design-concepts-3-elements-and-principles-relationship": insertAfterWorkedExample,
    "design-concepts-4-typography": insertAfterWorkedExample,
    "design-concepts-5-compositional-rules": insertAfterWorkedExample,
    "design-concepts-6-analysing-existing-products": insertAfterWorkedExample,
    "design-concepts-7-modifying-and-annotating-designs": insertAfterWorkedExample,
  },
};

let added = 0;
for (const [fileName, lessonTargets] of Object.entries(targets)) {
  const file = `lib/content/data/${fileName}`;
  const raw = readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  const lessons = data.units.flatMap((unit) => unit.topics).flatMap((topic) => topic.lessons);
  for (const [lessonId, insert] of Object.entries(lessonTargets)) {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson) throw new Error(`Lesson not found: ${lessonId}`);
    const visual = visuals[lessonId] || visuals[lesson.title === "Compositional Rules" ? "compositional-rules" : lessonId];
    if (!visual) throw new Error(`Visual definition not found: ${lessonId}`);
    added += Number(insert(lesson, visual));
  }
  const indent = raw.replace(/\r\n/g, "\n").startsWith('{\n "') ? 1 : 2;
  writeFileSync(file, JSON.stringify(data, null, indent) + "\n");
}

console.log(`Added ${added} visual worked example(s).`);
