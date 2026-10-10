/**
 * Content for the Year 12 Applied IT ATAR practice exam, consumed by
 * scripts/build-y12-atar-practice-exam.mjs.
 *
 * Unlike Year 11's Unit 1 Practice Exam (which only covers Unit 1), this one
 * spans both Year 12 units — Unit 3 "Evolving Digital Technologies" and
 * Unit 4 "Digital Technologies Within a Global Society" — because the real
 * WACE exam at the end of Year 12 examines both. Every fact referenced
 * (definitions, standards, protocols) is drawn from what the course's own
 * lessons already teach (lib/content/data/year-12-applied-it-atar.json) —
 * nothing here is invented content the student wasn't taught.
 *
 * Mark total is deliberately exact: 10 + 30 + 30 + 30 = 100, over the four
 * sections, matching the stated "100 marks". (Year 11's practice exam states
 * 100 marks but its sections actually total 144 — not repeated here.)
 */

export const SECTION_1_MCQ = [
  {
    id: 1,
    text: "Which of the following is a principle of design rather than an element of design?",
    options: ["Texture", "Line", "Unity", "Colour"],
    correctIndex: 2,
    explanation:
      "Unity is a principle (a rule for arranging elements, achieved through proximity and repetition). Texture, line and colour are all elements — the building blocks themselves, not the rules for arranging them.",
  },
  {
    id: 2,
    text: "A laptop loses everything stored in RAM the moment it loses power, but keeps everything on its SSD. This is because RAM is:",
    options: ["Non-volatile", "Volatile", "Read-only", "Secondary storage"],
    correctIndex: 1,
    explanation:
      "Volatile memory loses its contents when power is removed — this is RAM. Non-volatile memory and storage (like an SSD) keeps its contents without power.",
  },
  {
    id: 3,
    text: "A photographer's work is automatically protected in Australia the moment it is taken, with no registration required, for their lifetime plus 70 years. Which form of intellectual property protection is this?",
    options: ["Patent", "Trade mark", "Copyright", "Registered design"],
    correctIndex: 2,
    explanation:
      "Copyright under the Copyright Act 1968 protects the original expression of an idea automatically once it is recorded — no registration needed, lasting the creator's life plus 70 years. Patents, trade marks and registered designs all require formal registration.",
  },
  {
    id: 4,
    text: "A regional business lets staff attend meetings from home using live video calls. This is an example of which form of collaboration?",
    options: [
      "Asynchronous collaboration",
      "Synchronous collaboration",
      "Outsourced collaboration",
      "Content management",
    ],
    correctIndex: 1,
    explanation:
      "Synchronous collaboration is real-time communication with immediate responses — live video meetings and voice calls. Asynchronous collaboration (email, discussion boards) has a time delay between responses.",
  },
  {
    id: 5,
    text: "A small business chooses Google Workspace over buying licensed desktop software, specifically so the team always has the latest version without installing anything. Which advantage of online software does this describe?",
    options: ["Limited customisation", "Possible downtime", "Automatic updates", "Subscription fees"],
    correctIndex: 2,
    explanation:
      "Automatic updates means online software updates itself, so users always have the latest features and security fixes without manually installing anything, and don't have to wait to install software upfront.",
  },
  {
    id: 6,
    text: "A UX designer organises a website so related content is grouped together and the most important content appears first. This is best described as:",
    options: ["User interface (UI)", "Accessibility", "Logical and hierarchical structure", "Usability testing"],
    correctIndex: 2,
    explanation:
      "Logical and hierarchical structure means related content is grouped together, with the most important content first — part of how a digital product's structure is organised so users can find information and move through it easily.",
  },
  {
    id: 7,
    text: "A business lets customers submit support requests through a web page, and the responses are stored centrally for the support team to review. The web page is best described as:",
    options: ["A content management system", "An online form", "A data warehouse", "An audit trail"],
    correctIndex: 1,
    explanation:
      "An online form is a web-based document that collects structured data from users and stores the responses in a central location for analysis — exactly this use case. A CMS is for publishing content, not collecting it.",
  },
  {
    id: 8,
    text: "Which protocol encrypts the data travelling between a browser and a web server, and uses a digital certificate to verify the server's identity?",
    options: ["HTTP", "HTTPS", "TCP/IP", "NIC"],
    correctIndex: 1,
    explanation:
      "HTTPS is HTTP sent over an encrypted SSL/TLS connection — it encrypts the data in transit and uses a digital certificate to verify the server's identity. HTTP alone does not encrypt anything.",
  },
  {
    id: 9,
    text: "A streaming platform's recommendation engine personalises content for each user and runs partly on blockchain-based ownership of digital assets. This reflects a shift toward:",
    options: ["Web 1.0", "Web 2.0", "Web 3.0", "A content management system"],
    correctIndex: 2,
    explanation:
      "Web 3.0 is the intelligent, decentralised web — AI personalises content, and blockchain lets users own their data and digital assets. Web 2.0 is the earlier read-write social web (users create and share content, but without this AI/blockchain layer).",
  },
  {
    id: 10,
    text: "A company contracts an external provider to manage its data backups and sets a written agreement specifying the provider's required uptime and what happens if it isn't met. This written agreement is a:",
    options: [
      "Service level agreement (SLA)",
      "Code of conduct",
      "Disaster recovery plan",
      "Audit trail",
    ],
    correctIndex: 0,
    explanation:
      "A service level agreement (SLA) is a written agreement between a provider and a client setting out the services to be delivered, the standard each must meet, and the consequence if that standard isn't met.",
  },
];

export const SECTION_2_SHORT_ANSWER = {
  intro:
    "<p>Answer each question in the space provided. Marks are shown in brackets.</p>",
  questions: [
    {
      id: "11",
      text:
        "A mobile phone manufacturer's newest model has a foldable screen, is 20% thinner than last year's model, and ships with a significantly more power-efficient processor.\n\n(a) Define the term development trend. (1 mark)\n\n(b) Identify two development trends evident in this phone. (2 marks)",
      marks: 3,
      explanation:
        "**(a)** A development trend is a direction in which the features of devices are changing over time. (1 mark)\n\n**(b)** Any two of: thinner/smaller form factor, foldable/flexible displays, more power-efficient processors. (1 mark each, 2 marks)",
    },
    {
      id: "12",
      text:
        "A design agency wants to register their new logo as a trade mark, and separately wants their invention of a novel folding mechanism protected.\n\n(a) Name the two forms of intellectual property protection they need. (2 marks)\n\n(b) Explain the purpose of the Paris Convention priority period for a business also planning to expand into the United States. (2 marks)",
      marks: 4,
      explanation:
        "**(a)** Trade mark (for the logo) and patent (for the invention/mechanism). (1 mark each, 2 marks)\n\n**(b)** After applying in Australia, the business has a priority period (6 months for trade marks, 12 months for patents) to apply in other member countries such as the US. Those later applications are treated as if filed on the original Australian date, so no one else can register it first in the meantime — it does not grant protection overseas, it only holds the business's place in the queue. (2 marks)",
    },
    {
      id: "13",
      text:
        "A regional council introduces virtual meetings so staff in isolated towns can attend head-office discussions without travelling.\n\n(a) Identify one advantage of virtual collaboration for this council, other than cost savings. (1 mark)\n\n(b) Identify one disadvantage of virtual collaboration the council should plan for. (1 mark)",
      marks: 2,
      explanation:
        "**(a)** Any one of: opportunities for isolated communities to engage in meaningful work without travel, workforce inclusion for parents, convenient communication across time zones, increased productivity. (1 mark)\n\n**(b)** Any one of: misinterpretation/communication barriers (no body language or tone), security risks, internet dependence, technology reliance, training needs, social isolation, the digital divide excluding some staff. (1 mark)",
    },
    {
      id: "14",
      text:
        "A retailer is deciding between storing all of its sales data in one central data warehouse, or giving its marketing team a smaller data mart of just their own data.\n\n(a) Describe the difference between a data warehouse and a data mart. (2 marks)\n\n(b) Explain the purpose of data mining on data held in the warehouse. (2 marks)",
      marks: 4,
      explanation:
        "**(a)** A data warehouse is a large, centralised database storing historical and current data from multiple sources across the whole organisation, typically updated in batches rather than real time. A data mart is a smaller, more focused version used by a single department (e.g. marketing), containing only the data relevant to that group, making it faster and easier to query. (2 marks)\n\n**(b)** Data mining analyses the large amount of data stored in the warehouse to discover hidden patterns, trends and relationships, which the retailer can use to make predictions and better business decisions. (2 marks)",
    },
    {
      id: "15",
      text:
        "A small business's website needs to work correctly whether a customer visits on Chrome, Safari or an older version of Edge.\n\n(a) Name the concept being described. (1 mark)\n\n(b) Describe one method the business could use to confirm this before launch. (2 marks)",
      marks: 3,
      explanation:
        "**(a)** Browser compatibility — the website looking and working correctly in different web browsers, on different devices and screen sizes. (1 mark)\n\n**(b)** Testing the site in each major browser (and on a range of devices/screen sizes) before launch, checking layout, functionality and any broken features in each. (2 marks for a method that actually tests across browsers, not just one check)",
    },
    {
      id: "16",
      text:
        "A home network has a modem, a router, a switch and three devices connected with Ethernet cable, plus two devices connected over Wi-Fi.\n\n(a) Describe the separate roles of the modem and the router in this network. (2 marks)\n\n(b) Explain why the two wireless devices need a wireless NIC specifically, rather than any NIC. (2 marks)\n\n(c) Explain the purpose of a firewall in this network, including where it typically sits. (2 marks)",
      marks: 6,
      explanation:
        "**(a)** The modem connects the home network to the internet service provider (ISP). The router connects the devices on the home network together and shares that one internet connection between them — they are not the same device, even though they're sometimes combined into one unit. (2 marks)\n\n**(b)** Every device needs a network interface card (NIC) to connect to a network at all, but a NIC built for a wired connection cannot communicate wirelessly — a device connecting over Wi-Fi specifically needs a wireless NIC to send and receive the radio signal. (2 marks)\n\n**(c)** A firewall monitors incoming and outgoing network traffic and allows or blocks each data packet based on a set of security rules, sitting between the router/modem and the rest of the network (the switch) to create a barrier between the trusted home network and the untrusted internet. (2 marks)",
    },
    {
      id: "17",
      text:
        "An online education platform lets students repeat a module as many times as they like and shows an instant score after every quiz.\n\n(a) Name the two features of online learning tools being described. (2 marks)\n\n(b) Identify this delivery model, in which the platform is hosted and maintained entirely by the provider with nothing installed locally. (1 mark)",
      marks: 3,
      explanation:
        "**(a)** Self-paced learning (control over pace, repeat content) and feedback (immediate feedback such as self-marking quizzes). (1 mark each, 2 marks)\n\n**(b)** Software as a Service (SaaS) — software hosted on cloud servers and accessed through a browser, with no installation required. (1 mark)",
    },
    {
      id: "18",
      text:
        "A government department is reviewing whether to outsource the management of its citizen records database to an external provider rather than continuing to manage it in-house.\n\n(a) Define outsourcing data management. (1 mark)\n\n(b) Describe one advantage and one disadvantage of outsourcing this compared to keeping it in-house. (2 marks)\n\n(c) Explain why the department would need a service level agreement (SLA) as part of this arrangement. (2 marks)",
      marks: 5,
      explanation:
        "**(a)** Outsourcing data management is contracting an external provider to store, back up, secure, maintain or process an organisation's data, instead of doing it in-house with its own staff and equipment. (1 mark)\n\n**(b)** Advantage: access to specialist expertise and infrastructure without the department building and staffing it itself. Disadvantage: reduced direct control over sensitive citizen data, and dependence on the provider's reliability. (1 mark each, 2 marks — any reasonable, justified pair)\n\n**(c)** An SLA sets out exactly what service the provider must deliver, the standard it must meet (e.g. uptime, response time, security requirements) and what happens if that standard is not met — essential for a department handling sensitive citizen data, so accountability is written down rather than assumed. (2 marks)",
    },
  ],
};

export const SECTION_3_EXTENDED = {
  scenarioHtml:
    "<p><strong>Southwest Freight Connect</strong> is a Bunbury-based logistics company that tracks deliveries for several regional retailers. Their current system is a single in-office server that staff log into directly, with no formal backup schedule and no written record of who accesses or changes delivery records.</p><p>After a near-miss where a staff laptop was lost with sensitive client data on it, the company director, Marcus, has asked you — as the business's digital technologies consultant — to review and improve their data management and network security before they take on two new major clients.</p>",
  tableHeading: "Current setup (as reported by staff)",
  table: {
    headers: ["Component", "Current state"],
    rows: [
      ["Data storage", "One on-site server; all delivery and client records stored in a single folder"],
      ["Backups", "None scheduled — staff \"sometimes\" copy files to a USB drive"],
      ["Network", "A single router shared by the office and the warehouse Wi-Fi, no separate firewall device"],
      ["Access", "Every staff account can view and edit every client's records"],
      ["Records of changes", "None — no log of who edited or deleted a record"],
    ],
  },
  questions: [
    {
      id: "Q19",
      text:
        "Explain the difference between a backup and an archive, and recommend which one Southwest Freight Connect needs most urgently given their current setup. Justify your answer. (6 marks)",
      marks: 6,
      explanation:
        "**Backup** — a copy of current data stored separately so it can be restored if the original is lost, damaged or corrupted. **Archive** — the long-term storage of data no longer in regular use, moved off the live system and kept for future reference or legal requirements. (3 marks: 1–2 for each definition, correctly distinguished)\n\n**Recommendation:** a proper backup schedule is the more urgent need — the company has no reliable copy of its *current, in-use* records at all (an ad-hoc USB copy is not a backup strategy), so a single server failure or ransomware incident would mean total data loss. Archiving is about managing old, inactive data — a lower priority than protecting data currently in daily use. (3 marks for a justified recommendation tied to the actual risk described)",
    },
    {
      id: "Q20",
      text:
        "Southwest Freight Connect has no audit trail and every staff account can edit every record.\n\n(a) Explain what an audit trail is and how it would have helped investigate the lost laptop incident. (3 marks)\n\n(b) Recommend a change to staff access that would reduce the risk of a similar incident, and justify it. (3 marks)",
      marks: 6,
      explanation:
        "**(a)** An audit trail is a record that logs user activity related to data access and changes, used to support data integrity, accountability and security monitoring. With an audit trail, the company could see exactly which records the lost laptop's account had accessed or downloaded, scoping the actual exposure instead of having to assume the worst about every client's data. (3 marks)\n\n**(b)** Restrict access so each staff member can only view and edit the records relevant to their own role or assigned clients, rather than every account having full access to every client's data (the principle of least privilege). This limits how much data is exposed if any single account or device is compromised. (3 marks for a specific, justified access change)",
    },
    {
      id: "Q21",
      text:
        "Marcus wants a diagram-ready network design with a firewall separating the office network from the internet, and the warehouse Wi-Fi kept on a separate network from the office.\n\n(a) Name four hardware components (other than cabling) this design would need, and state the purpose of each. (8 marks)\n\n(b) Explain why placing the firewall as described is better security practice than Southwest Freight Connect's current single shared router. (4 marks)",
      marks: 12,
      explanation:
        "**(a)** Any four of: **Modem** — connects the business to its ISP. **Router** — connects the office network (and/or the separate warehouse network) to the internet and to each other. **Firewall** — monitors and filters traffic between the internal network and the internet, blocking unauthorised access. **Switch** — connects multiple wired devices within the office network. **Wireless Access Point (WAP)** — lets wireless devices (including the warehouse Wi-Fi) connect to the network. **NIC** — required in every device to connect to the network at all. (2 marks each for component + correct purpose, up to 8 marks)\n\n**(b)** A dedicated firewall actively inspects and filters traffic against a set of security rules, creating a real barrier between the trusted internal network and the untrusted internet. Southwest Freight Connect's current single shared router likely has only basic, default filtering and puts the office and warehouse traffic on the same unsegmented network, meaning a compromised device in the warehouse has direct access to office systems and client records — a properly firewalled, segmented design limits exactly that kind of lateral exposure. (4 marks)",
    },
    {
      id: "Q22",
      text:
        "Marcus is also considering outsourcing the company's entire data management — storage, backups and security monitoring — to an external provider instead of building this in-house.\n\nCompare outsourcing with building the in-house solution described in your previous answers, and recommend one, with justification, for a business of Southwest Freight Connect's size. (6 marks)",
      marks: 6,
      explanation:
        "**Outsourcing data management** means contracting an external provider to store, back up, secure, maintain or process the company's data instead of doing it in-house. Advantages for a smaller business: access to specialist security expertise and infrastructure (proper backups, monitoring, audit trails) without hiring specialist IT staff; a service level agreement (SLA) makes the provider's obligations and accountability explicit. Disadvantages: ongoing cost, dependence on the provider's reliability, and less direct control over sensitive client data. (4 marks for a two-sided comparison)\n\n**Recommendation:** for a business of this size — no dedicated IT staff, and the near-miss already shows internal practices aren't being followed consistently — outsourcing to a provider under a clear SLA is the more realistic way to get proper backups, access controls and audit logging quickly, rather than relying on the company to build and maintain all of this itself. (2 marks for a justified, size-appropriate recommendation)",
    },
  ],
};

export const SECTION_4_SCENARIO = {
  scenarioHtml:
    "<p><strong>Capel Community Garden</strong> is a not-for-profit group that wants a website and a companion mobile app so members can book garden plots, log working-bee hours, and read seasonal growing tips. The committee — mostly volunteers aged 40–70, with members ranging from confident computer users to people who rarely use a smartphone — has hired you to plan the user experience before any visual design begins.</p><p>The committee has said the website and app must work well for everyone, including a committee member who is visually impaired and uses a screen reader.</p>",
  requirementsHeading: "What the committee has asked for",
  requirements: [
    "A home page that immediately shows upcoming working bees and any urgent notices",
    "A simple way to book a garden plot without needing an account for casual visitors just browsing",
    "Members should log their working-bee hours after every session",
    "All content must be usable by a committee member who relies on a screen reader",
  ],
  questions: [
    {
      id: "Q23",
      text:
        "Explain the difference between usability and user experience (UX) for this website, giving one example of each specific to Capel Community Garden's volunteers. (4 marks)",
      marks: 4,
      explanation:
        "**Usability** is how easily, efficiently and accurately users can complete tasks with the product — e.g. whether a volunteer with limited computer confidence can book a plot in a few clicks without getting lost. **User experience (UX)** is the user's overall experience and feelings when using the product — whether it feels welcoming and satisfying to use, not just technically completable, e.g. whether an older volunteer feels confident and unintimidated using the site rather than just barely able to struggle through it. (2 marks each for a correctly distinguished, example-grounded definition)",
    },
    {
      id: "Q24",
      text:
        "The committee member who uses a screen reader is an accessibility requirement, not just a usability one.\n\n(a) Define accessibility in the context of this project. (2 marks)\n\n(b) Describe two specific accessibility considerations this site should follow to support a screen reader user. (4 marks)",
      marks: 6,
      explanation:
        "**(a)** Accessibility is designing a digital product so it can be used by everyone, including people with vision, hearing, physical or cognitive disability. (2 marks)\n\n**(b)** Any two of: meaningful alt text on every image so a screen reader can describe it; a logical heading structure (h1/h2/h3) so a screen reader user can navigate by heading; sufficient colour contrast and not relying on colour alone to convey meaning; labelled form fields (e.g. the plot booking form) so a screen reader announces what each field is for; keyboard-navigable menus and buttons for anyone not using a mouse. (2 marks each for a specific, correctly justified consideration, up to 4 marks)",
    },
    {
      id: "Q25",
      text:
        "Design a logical and hierarchical structure for the Capel Community Garden website's main navigation, based on the committee's requirements.\n\n(a) List the main navigation sections (menu items) you would include, in the order they should appear. (4 marks)\n\n(b) Justify why this structure puts the most important content first, referring to the committee's stated priorities. (4 marks)",
      marks: 8,
      explanation:
        "**(a)** A reasonable structure, e.g.: Home — Book a Plot — Working Bees — Growing Tips — Log Hours (members) — About/Contact. (4 marks: 1 per sensible, correctly ordered section reflecting the brief, up to 4)\n\n**(b)** Logical and hierarchical structure means grouping related content together with the most important content first. Home leads because the committee specifically asked for upcoming working bees and urgent notices to be immediately visible. Book a Plot sits early because casual visitors need to reach it without an account, matching the no-account requirement. Log Hours can sit lower/behind a member area since it's a task for existing members after a session, not a first-visit priority. (4 marks for justification tied specifically to the committee's stated requirements)",
    },
    {
      id: "Q26",
      text:
        "The committee is unsure whether booking a plot and logging working-bee hours should be two separate features or combined into one. Using the concepts of usability and user interface (UI), recommend an approach and justify it. (6 marks)",
      marks: 6,
      explanation:
        "**User interface (UI)** is the parts of the product the user sees and interacts with — layout, buttons, menus, icons — the look and feel. A strong answer recommends keeping plot booking and hour-logging as two separate, clearly labelled actions/screens rather than one combined form, because they happen at different times for different purposes (booking happens once in advance; logging hours happens repeatedly, immediately after each working bee) — combining them into one UI would force a volunteer to navigate past booking information every time they just want to log hours, harming usability (how efficiently the task is completed) even if it technically reduces the number of pages. Either recommendation can score full marks if it correctly applies both usability and UI concepts and is justified against the actual two tasks described, rather than asserted without reasoning. (6 marks: 2 for correct UI/usability application each, 2 for a justified recommendation)",
    },
    {
      id: "Q27",
      text:
        "Once the website is built, the committee wants to know if it actually worked for their volunteers. Describe two tools or methods you would use to evaluate the website's effectiveness against the committee's original requirements. (6 marks)",
      marks: 6,
      explanation:
        "Any two reasonable evaluation methods, each explained, e.g.: a user survey asking volunteers (including the screen-reader user specifically) to rate how easily they completed key tasks like booking a plot; direct observation of a small group of volunteers across the age range attempting the tasks live, noting where they got stuck; checking actual usage data (e.g. how many bookings or hour-logs were completed in the first month) against the requirement that casual visitors could book without an account; accessibility testing with an actual screen reader to confirm the considerations from Q24 work in practice, not just in theory. (3 marks each for a specific method tied back to the committee's stated requirements, up to 6 marks)",
    },
  ],
};
