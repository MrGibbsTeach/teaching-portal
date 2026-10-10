/**
 * Mentor-voice content for Year 12 Applied IT General, keyed by lesson id.
 *
 * Added by scripts/add-y12-general-mentor-voice.mjs as four new callout blocks
 * per lesson (ticket, senior-wisdom, pr-review, sandbox) — nothing existing is
 * edited or removed, so key terms, tables, worked examples, test tips, marking
 * keys and quiz questions are untouched. See CHECKPOINTS.md Checkpoint 1.
 *
 * Each mentor uses a label scheme suited to their own profession rather than
 * one dev-flavoured skeleton stretched over everyone (Checkpoint 1, question 1):
 * Leo (creative studio), Sparky (trade callout), Elara (policy casework),
 * Rory (sprint/delivery — this one does suit dev language, he runs an agile
 * studio), Sloane (data audit — kept identical to her Y11 voice).
 */

export const MENTORS = {
  leo: {
    name: "Leo Thorne",
    org: "Koombana Creative Labs",
    labels: { ticket: "🎨 BRIEF", wisdom: "💡 SENIOR WISDOM · LEO THORNE", pr: "🔍 DESIGN REVIEW · LEO IS CHECKING YOUR WORK", sandbox: "🖌️ STUDIO CHALLENGE" },
  },
  sparky: {
    name: "Jaxen \"Sparky\" Miller",
    org: "Bunbury Hardware Integrators",
    labels: { ticket: "🔧 JOB TICKET", wisdom: "💡 SENIOR WISDOM · SPARKY MILLER", pr: "🧰 CALLBACK CHECK · SPARKY IS REVIEWING THE JOB", sandbox: "🛠️ WORKSHOP CHALLENGE" },
  },
  elara: {
    name: "Dr. Elara Finch",
    org: "Regional Ethics Tech Group",
    labels: { ticket: "📋 CASE FILE", wisdom: "💡 SENIOR WISDOM · DR ELARA FINCH", pr: "📝 CASE REVIEW · ELARA IS SIGNING OFF", sandbox: "⚖️ POLICY CHALLENGE" },
  },
  rory: {
    name: "Rory Quinn",
    org: "Bunbury Tech Launchpad",
    labels: { ticket: "🎟️ TICKET", wisdom: "💡 SENIOR WISDOM · RORY QUINN", pr: "🛑 STANDUP REVIEW · RORY IS CHECKING THE BOARD", sandbox: "🚀 SPRINT CHALLENGE" },
  },
  sloane: {
    name: "Sloane Vane",
    org: "SW Logistical Analytics",
    labels: { ticket: "🎟️ TICKET", wisdom: "💡 SENIOR WISDOM · SLOANE VANE", pr: "🛑 PR REVIEW · SLOANE IS AUDITING YOUR WORK", sandbox: "💻 SANDBOX CHALLENGE" },
  },
};

/** topicId -> mentor key */
export const TOPIC_MENTOR = {
  "design-concepts": "leo",
  hardware: "sparky",
  networks: "sparky",
  "impacts-of-technology-u3": "elara",
  "impacts-of-technology-u4": "elara",
  "managing-data": "sloane",
  "application-skills-u3": "rory",
  "project-management-u3": "rory",
  "application-skills-u4": "rory",
  "project-management-u4": "rory",
};

/**
 * lessonId -> { ticket, wisdom, pr, sandbox }
 * ticket/wisdom/pr/sandbox are the callout `text`. Heading comes from MENTORS.
 */
export const LESSON_VOICE = {
  // ───────────────────────── Design Concepts (Leo, Koombana Creative Labs) ─────────────────────────
  "design-concepts-1-elements-of-design": {
    ticket: "A streaming service wants their new home screen critiqued before it ships. The client keeps saying it 'feels off' but can't tell me why. That's the job today — before you can fix a design, you have to be able to name exactly what's in it: line, shape, colour, texture, space, form. Pin those down and you can finally talk about what's actually wrong.",
    wisdom: "Clients almost never complain in the language of design elements — they say 'busy' or 'boring' or 'cheap-looking'. Your job is to translate that into 'too much colour contrast' or 'not enough negative space'. Learn the vocabulary and you can diagnose a screen in thirty seconds instead of guessing.",
    pr: "I mark these the same way every time: name the element, then prove you saw it in the actual image, not in general. 'They used colour' earns nothing. 'They used a bright orange CTA button against a dark background to pull the eye straight to it' earns the mark.",
    sandbox: "Before I show you how I'd answer it, go find the menu board question yourself. Name three elements and, for two of them, say exactly where you see them doing work on the screen.",
  },
  "design-concepts-2-principles-of-design": {
    ticket: "A concert poster landed on my desk with a note from the client: 'make the date pop more.' That's a principles problem, not an elements one — the elements were already fine. Today's about contrast, balance, emphasis, movement, unity, proportion: the rules for how elements are arranged, not what they are.",
    wisdom: "Elements and principles get mixed up constantly in exam answers. Quick test I give juniors: if you can point at one thing on the page and name it, it's an element (a colour, a shape). If you're describing a relationship between things — size against size, light against dark — it's a principle. Say that test to yourself before you write the answer.",
    pr: "The marker wants to see you connect the principle to the actual visual effect it causes. 'Emphasis' alone is a definition. 'Emphasis, because the designer made the date the largest text on the page so it's the first thing read' is an answer that scores.",
    sandbox: "Try the poster questions cold first. Match each example to its principle, then write the emphasis answer for the date — convince me it's emphasis, not just big text.",
  },
  "design-concepts-3-elements-and-principles-relationship": {
    ticket: "This is the one that trips up every junior designer I've trained: explaining how an element and a principle work together, not just naming them separately. Markers want the relationship spelled out — the answer pattern is non-negotiable, so we're drilling it until it's automatic.",
    wisdom: "I make every junior memorise the pattern: name the element, name the principle, then one sentence on the effect that happens when they combine. Skip the effect and you've described two things sitting next to each other, not a relationship — and that's where marks get lost.",
    pr: "I read these looking for the word 'because' or 'which creates'. If your sentence just lists the element and the principle with no causal link between them, I send it back. Show me the effect, every time.",
    sandbox: "Have a go at both relationship questions — dominance and unity — before you check the pattern. Write them as one flowing sentence, not three separate fragments.",
  },
  "design-concepts-4-typography": {
    ticket: "A bus timetable app came in with white-on-pale-grey text and a client wondering why residents were complaining. Typography choices aren't decoration — on something people read standing at a bus stop in the rain, the wrong font or alignment makes the product unusable, not just unattractive.",
    wisdom: "Justified text looks 'tidy' to a client's eye and I still have to talk them out of it on anything short — it creates ugly, uneven gaps in narrow columns, which is exactly the opposite of what they wanted. If a client pushes back, show them the gaps in their own copy.",
    pr: "Don't just name the typography choice — tie it to the audience. 'Larger font' is thin. 'A larger font size because residents reading the timetable outdoors, often at a distance or in bright sun, need it legible without squinting' is what I'd sign off.",
    sandbox: "Work through the residential audience question and the justified-alignment one before you look at how I'd frame it. Say who's reading and why that changes your choice.",
  },
  "design-concepts-5-compositional-rules": {
    ticket: "A photo for a website banner came in dead centre, flat, nothing drawing the eye anywhere. The fix wasn't a different photo — it was the rule of thirds, a grid, and real alignment. Compositional rules are what turn a snapshot into a banner someone actually looks at.",
    wisdom: "Rule of thirds isn't 'put things slightly off-centre' — it's specific: divide the frame into a 3×3 grid and place the subject or focal point on one of those intersection lines. Vague answers lose marks here because the rule itself is precise.",
    pr: "I want the rule of thirds defined properly first, then applied to the actual photo — don't skip straight to 'move it left'. Tell me which line or intersection, and why that placement is stronger than centred.",
    sandbox: "Define the rule of thirds yourself, then explain how a grid and alignment would fix the post, before you check my version.",
  },
  "design-concepts-6-analysing-existing-products": {
    ticket: "I had to walk a junior through a pizza delivery app screen this week because they kept writing 'the design is good' — zero marks, every time. Identify, describe, explain, evaluate are four different command words with four different standards, and mixing them up is the single most common way students lose marks on this course.",
    wisdom: "Identify names it. Describe adds detail about how it's used. Explain adds the effect or reason — the 'why it works'. Evaluate makes a judgement with justification. If the question says 'explain' and you only describe, you've capped your own mark before the marker even reads it.",
    pr: "Check your own command word before you write a single sentence. I've sent back more exam answers for ignoring the command word than for getting the content wrong — the content was often right, just pitched at the wrong level.",
    sandbox: "Try the pizza app questions — one 'identify and describe', one 'explain the relationship' — and check which command word you actually answered to.",
  },
  "design-concepts-7-modifying-and-annotating-designs": {
    ticket: "A flyer redesign needs two things from you by Friday: the actual modifications, and annotations explaining them to the client who can't read a mockup without commentary. This is the skill that turns 'I changed it' into something a client — or a marker — can follow and agree with.",
    wisdom: "A detailed annotation always has three parts: what you changed, which element or principle it uses, and why it serves the design brief. Drop any one of the three and the annotation reads like a caption, not a justification — and captions don't earn marks.",
    pr: "I'm checking every annotation against the brief, not just against good taste. A modification can look great and still score nothing if you never connect it back to what the client actually asked for.",
    sandbox: "Describe your two modifications to the post and write one full annotation using the formula, before you see how I'd write it.",
  },

  // ───────────────────────── Hardware & OS / Networks (Sparky, Bunbury Hardware Integrators) ─────────────────────────
  "hardware-1-cpu-and-memory": {
    ticket: "Call-out today: a client's laptop 'just feels slow' opening video files. Before I send a tech out, I want you to be able to explain what's actually happening inside the box — CPU, primary memory, secondary storage, volatile vs non-volatile — because half of 'it's slow' complaints are really 'you need more RAM', not a dying CPU.",
    wisdom: "Volatile is the word that trips people up every year. It just means 'loses its contents when the power goes' — that's RAM. Secondary storage (your SSD or hard drive) keeps everything with the power off. If a student can't tell me which one is volatile, they can't yet explain why unsaved work disappears in a blackout.",
    pr: "I grade the CPU question on function, not just the acronym — what does it actually do, in your own words, not 'it's the brain'. And for the storage comparison, I want capacity and speed both mentioned, not just one.",
    sandbox: "Describe the CPU's purpose and compare the two laptops' storage yourself first — then check what I'd flag as missing.",
  },
  "hardware-2-peripherals-and-computer-systems": {
    ticket: "A physiotherapy clinic wants their whole setup reviewed — barcode scanners, printers, the lot — and they need every device sorted correctly as input, output or storage before I can even start on the network side. Get the classification wrong and the rest of the job plan is wrong too.",
    wisdom: "The trick with tricky devices like touchscreens or multifunction printers: ask what direction the data is actually moving for the function you're thinking of. A touchscreen displays (output) and senses touch (input) — same device, two jobs. Don't force it into one box.",
    pr: "Classification questions look easy and get rushed. I send back any answer that mislabels a scanner or a server — a server in a library isn't an input or output device at all, it's a different category of machine, and conflating them tells me the concept isn't solid yet.",
    sandbox: "Classify every device in the clinic list yourself — input, output or storage — and write the server's purpose in the library, before you check mine.",
  },
  "hardware-3-operating-systems": {
    ticket: "A client's asking why their old software won't run and whether Linux would save them money. That's an operating-system question dressed up as a hardware complaint — purposes of an OS, open source versus proprietary — and I need a straight answer, not a sales pitch for whichever OS I personally like.",
    wisdom: "Don't just say Linux is 'free' and proprietary is 'not free' — that's the shallow half of the answer. Free also usually means community-supported, which is an advantage for a hobbyist and a real disadvantage for a business that needs guaranteed support when something breaks at 2pm on a Tuesday.",
    pr: "For the Linux advantage/disadvantage question, I want one of each paired to this specific client, not generic textbook lines. A disadvantage that doesn't apply to their situation doesn't earn the mark even if it's true in general.",
    sandbox: "Describe two purposes of an OS, then give one real advantage and one real disadvantage of Linux for this business, before you check my version.",
  },
  "hardware-4-software-compatibility-and-hardware-purchase": {
    ticket: "A practice wants new computers but is worried their current software won't run on them — or that their current software won't run on anything modern at all. Before I quote the job, I check minimum requirements both directions: can new hardware run their old software, and can an old machine run anything current.",
    wisdom: "Everyone checks 'will the new software run on the old machine' and forgets the other direction — will the old, specialised software still run on new hardware and a new OS. I've seen a clinic nearly buy new PCs that couldn't run their decade-old, business-critical records software. Always check both ways.",
    pr: "I'm looking for you to actually name a compatibility issue specific to this practice's setup, not recite the general definition of compatibility. And for the purchase considerations, cost alone is never a full answer — what else matters to them?",
    sandbox: "Describe the practice's likely compatibility issue and two things they should consider before buying, then compare it to what I'd flag.",
  },
  "hardware-5-maintenance-and-troubleshooting": {
    ticket: "3am call-out: a server shut itself down twice this week and the client lost power mid-task with no warning. This is exactly the job a UPS and proper environmental control exist to prevent — today's about recognising the fix before the client has to call me at 3am again.",
    wisdom: "A UPS doesn't keep the power on forever — it buys you minutes to save your work and shut down safely, or bridges a short outage. If an answer claims a UPS 'stops the computer losing power', that's not quite it; it manages the loss, it doesn't eliminate it.",
    pr: "For the blackout question I want the UPS's actual function explained, not just 'it would have helped'. And the server shutting down on hot days is a temperature problem — if your answer doesn't mention heat or cooling, you've missed what's actually being tested.",
    sandbox: "Explain how a UPS would have helped during the blackout, and describe two strategies to stop the server overheating, before checking mine.",
  },
  "networks-1-networking-concepts": {
    ticket: "A client's setting up a home office and asking why they'd bother networking two computers at all. Before you can design anything, you need the basics solid: what a network actually is, LAN versus WAN, and what 'shared resources' really buys someone.",
    wisdom: "When a client asks 'why network it', the honest answer is almost always one of: sharing a printer, sharing files, or sharing an internet connection. If your explanation doesn't land on one of those practical benefits, it's too abstract to convince anyone to pay for the job.",
    pr: "I want the office's actual networking purpose named, not a textbook definition of 'network'. And for advantage/disadvantage, a disadvantage like 'cost' needs to be specific to this setup, not a throwaway line.",
    sandbox: "Explain the purpose of networking the office and give one real advantage and one real disadvantage, before you check my answer.",
  },
  "networks-2-transmission-media": {
    ticket: "A client wants their shed connected to the house network and is asking whether wifi will just reach. Depends entirely on the medium — optic fibre, twisted pair, wireless — and each one has a job it's genuinely good at and a job it'll fail at. I've seen too many wireless-only sheds with constant dropouts.",
    wisdom: "Distance and obstacles are the two things that kill wireless every time, and clients never think about either until it's already failed. For anything outdoors or through brick, I default to recommending a wired run even when it's a harder sell upfront — it saves me a callback.",
    pr: "A recommendation without a reason tied to distance, obstacles or cost isn't a recommendation, it's a guess that happened to be right. Justify the medium against this specific shed-to-house distance, not media in general.",
    sandbox: "Recommend a medium for the shed and compare wired versus wireless for the devices inside the house, before you check mine.",
  },
  "networks-3-transmission-rates": {
    ticket: "A client on a 100/20 plan keeps asking why their evening live stream keeps freezing when their speed test says 100. Transmission rate, upload versus download, and bandwidth explain exactly why a fast-looking plan can still choke — and it's rarely the plan's fault alone.",
    wisdom: "Download and upload rates are almost never the same number, and a live stream depends on upload — the number everyone forgets to check. 100/20 means 100 down, 20 up; if you're uploading video, that 20 is your real ceiling, not the headline 100.",
    pr: "Explain transmission rate properly first — units, what's being measured — before you diagnose the freezing. And for 'why does it freeze in the evening', I want congestion or shared bandwidth mentioned, not just 'the internet is slow'.",
    sandbox: "Explain transmission rate and then work out why the evening stream keeps freezing, before you check how I'd answer it.",
  },
  "networks-4-network-components": {
    ticket: "A client asked me, completely seriously, whether their router and their modem were the same box with two names. They're not, and knowing the difference — modem, router, switch, NIC, server — is the difference between diagnosing a fault in five minutes or an hour.",
    wisdom: "Modem connects you to your ISP; router connects your devices to each other and shares that one internet connection. Mix those up in an answer and the marker reads it as not understanding either device, even if the rest of your answer is fine.",
    pr: "I want the router and modem's roles separated clearly in your answer, not blended into one description. And for 'why does every computer need a NIC' — name what a NIC actually does, don't just say 'to connect to the network'.",
    sandbox: "Describe the router's and modem's purpose in sending that photo, and explain why every computer needs a NIC, before you check mine.",
  },
  "networks-5-lan-topologies": {
    ticket: "Two jobs on my desk this week, same question: wired star or peer-to-peer, client-server or not. The right topology depends entirely on the client's situation — a physio clinic's needs aren't a home network's needs — and that's exactly what the exam wants you to justify, not just define.",
    wisdom: "Client-server costs more upfront (you need an actual server) but centralises control and backups — worth it the moment multiple people need shared, managed access to the same data. Peer-to-peer is cheap and simple but falls apart past a handful of devices. Match the answer to the scale of the business, every time.",
    pr: "'Justify' means pick a side and defend it against the client's actual situation. An answer that just describes both options with no recommendation hasn't answered the question, no matter how accurate the description is.",
    sandbox: "Describe a wired star topology, then justify client-server or peer-to-peer for the clinic, before you check my call.",
  },
  "networks-6-designing-a-home-lan": {
    ticket: "The Nguyen family wants their whole house networked and I've got one shot to get the router placement and wiring right before the drywall goes back up. This is the practical end of everything we've covered — floor plan, wireless coverage, and where a wired connection genuinely beats wireless.",
    wisdom: "I always put the router as close to centre-of-house as the internet entry point allows, not wherever's convenient to hide the box — coverage dies in corners. And anything that needs a rock-solid, uninterrupted connection — a home office desktop doing video calls — gets a wired run even in an otherwise wireless house.",
    pr: "Annotate the plan like you're handing it to a client who's never seen a floor plan before — placement has to be justified by coverage, not just marked with a dot. And the wired-office-desktop answer needs a reason, not just 'it's better'.",
    sandbox: "Place the router and one other device on the Nguyen floor plan and justify a wired connection for the home office desktop, before you check my layout.",
  },

  // ───────────────────────── Impacts of Technology — Unit 3 (Elara, Regional Ethics Tech Group) ─────────────────────────
  "impacts-of-technology-u3-1-digital-citizenship": {
    ticket: "A school's referred a student case to me: under the minimum social media age, oversharing, the usual. Before I write a single recommendation I need the terms locked down properly — digital citizenship, digital footprint, social networking, the actual minimum age — because sloppy definitions sink a case review fast.",
    wisdom: "Digital footprint is bigger than 'what you post' — it includes what others post about you, what's logged by services, even what you deleted but was already indexed somewhere. I correct this misunderstanding in almost every case file I review.",
    pr: "Don't just define digital citizenship — the question asks for it, so give the definition cleanly, then move straight to the two behaviour changes. Vague 'be safer online' answers don't survive my sign-off; name specific, concrete changes.",
    sandbox: "Define digital citizenship and describe two changes this student could realistically make, before you check how I'd write the case note.",
  },
  "impacts-of-technology-u3-2-cyberbullying-and-work-life-balance": {
    ticket: "Two unrelated cases on my desk that both come back to the same syllabus point: naming the exact form of cyberbullying — harassment, exclusion, impersonation, outing — and separately, a work group chat that's eaten someone's evenings. Precision matters in both; 'bullying' isn't specific enough for a case file.",
    wisdom: "Each form of cyberbullying has a distinct mechanism: harassment is repeated unwanted contact, exclusion is deliberately leaving someone out, impersonation is pretending to be them, outing is exposing private information without consent. Name the mechanism, not just the umbrella term, or the strategy you recommend won't actually fit the problem.",
    pr: "I want the specific form identified before any strategy — a strategy for exclusion doesn't help someone being impersonated. And the work-life balance answer needs an actual impact named — lost sleep, missed family time — not just 'it's bad for her'.",
    sandbox: "Identify the form of cyberbullying and one strategy, then explain the group chat's impact on her work-life balance, before you check my notes.",
  },
  "impacts-of-technology-u3-3-social-networking-impact": {
    ticket: "A storm hit Bunbury and the local paper broke the story on social media before their own website updated. That's not a one-off — it's the whole shift from traditional publication to user-created, instantly distributed content, and it's exactly what reshaped how this industry works.",
    wisdom: "The real shift isn't 'social media is faster' — it's that distribution used to be controlled by the publisher and now anyone with a phone is a distributor. That single change explains almost every follow-on impact: speed, reach, and the loss of editorial gatekeeping.",
    pr: "I want the reason tied to distribution or user-created content specifically, not a generic 'because social media is popular'. And for the mobile devices question, name the actual impact on how people receive news, don't just restate that phones exist.",
    sandbox: "Explain why the newspaper changed its approach, and one impact of mobile devices on how people receive local news, before you check mine.",
  },
  "impacts-of-technology-u3-4-copyright-act-1968": {
    ticket: "A student's in hot water for using copyrighted material and swears they thought 'private use' covered it. Half my case files are exactly this misunderstanding — the Copyright Act 1968, fair dealing, private use and moral rights don't mean what people assume they mean.",
    wisdom: "Private use is a much narrower exception than people think — it does not mean 'I didn't make money from it' or 'I only showed my friends'. Most student infringements fail because they assumed private use covered far more than it legally does.",
    pr: "Explain why this specific use infringes, don't just say 'copyright was broken'. And moral rights are a separate concept from copyright ownership — attribution and integrity of the work — so don't conflate the two in your answer.",
    sandbox: "Explain why the student has infringed copyright and describe the cartoonist's moral rights, before you check my case note.",
  },
  "impacts-of-technology-u3-5-referencing-and-acknowledging-ip": {
    ticket: "Every case file I close ends the same way — an intellectual property acknowledgement that has to be done properly or the whole report is worthless. APA 7, in-text citations, acknowledgement versus full referencing: get the technique right, because 'I mentioned where it came from' isn't the same as a correct citation.",
    wisdom: "Acknowledgement and referencing are not interchangeable terms in a marking key. Acknowledgement can be informal — a credit line. Referencing follows a specific technique, like APA 7, with exact formatting. If the question names the technique, you must use that exact format.",
    pr: "I check APA 7 references character by character — author, year, title, source, in that specific order and punctuation. A reference with the right information in the wrong format still loses marks.",
    sandbox: "Write the APA 7 reference for the photograph and describe how the student should acknowledge the music, before you check my version.",
  },

  // ───────────────────────── Impacts of Technology — Unit 4 (Elara, Regional Ethics Tech Group) ─────────────────────────
  "impacts-of-technology-u4-1-privacy-act-collection-use-access": {
    ticket: "A ticket seller wants to collect a buyer's school as part of signup and asked me if that's even allowed. Under the Privacy Act 1988 — collection, use, access — the answer is almost never a flat yes or no, it's 'only if it's necessary for the purpose', and most businesses over-collect without realising it.",
    wisdom: "The test I apply to every collection question: is this piece of personal information actually necessary for what they're using it for? A gym app needs your name and payment details. It very rarely needs your school. If it's not necessary, collecting it is the problem, even if the person consented.",
    pr: "Don't just say 'yes' or 'no' to whether they should collect it — explain it against the necessity test. And for the access right, name it specifically: customers have a right to access their own personal information, which most businesses have to honour on request.",
    sandbox: "Decide whether the ticket seller should collect the school, and describe the customer's access right, before you check my ruling.",
  },
  "impacts-of-technology-u4-2-identity-theft-and-safe-disposal": {
    ticket: "A clinic is replacing its computers and asked me whether they can just put the old ones out for e-waste collection. The answer involves identity theft risk, what counts as a notifiable data breach, and safe disposal — and getting this wrong isn't just an IT mistake, it's a legal one.",
    wisdom: "A data breach only becomes 'notifiable' under the Act when it's likely to cause serious harm — not every leak triggers the same obligations. Knowing that distinction is what separates a business that overreacts to every incident from one that correctly escalates the serious ones.",
    pr: "I want stolen data connected to a real, specific identity theft use, not a vague 'they could use it for bad things'. And the retailer's Privacy Act responsibilities need to be named specifically, not summarised as 'they should be careful'.",
    sandbox: "Describe how the stolen data could enable identity theft and two of the retailer's Privacy Act responsibilities, before you check my case file.",
  },
  "impacts-of-technology-u4-3-digital-divide": {
    ticket: "A council report crossed my desk arguing a new online-only service would 'improve access for everyone' — it wouldn't, and naming exactly who ends up on the wrong side of the digital divide is the whole point of this case. Availability of resources, ability to use them, and dependency on electronic communication are three separate barriers, not one.",
    wisdom: "People conflate 'has internet access' with 'digital divide solved' — but someone can have a connection and still be excluded if they lack the skills, the right device, or the confidence to use a service. The divide is about capability as much as access.",
    pr: "I want the concept defined properly, then the specific groups named for this change — not 'some people will struggle', but which people and why. Elderly residents without a device is a different answer to rural residents with no reliable connection.",
    sandbox: "Explain the digital divide and how this change affects two different groups, before you check my report.",
  },
  "impacts-of-technology-u4-4-electronic-commerce": {
    ticket: "A Bunbury surf shop went online this year and the owner's thrilled about 24/7 sales — and surprised by the 2am customer emails expecting instant replies. E-commerce, improved digital communication, round-the-clock trading: every benefit comes with a matched cost, and the exam wants both.",
    wisdom: "24/7 availability is the classic double-edged sword in this topic — it genuinely does grow sales outside normal hours, and it genuinely does create an expectation of round-the-clock responsiveness that small operators struggle to meet. Always give both sides unprompted.",
    pr: "Define e-commerce cleanly first. Then for the 24/7 question, I want one real positive and one real negative — not two positives dressed differently, which is the mistake I see most often.",
    sandbox: "Explain e-commerce, then describe one positive and one negative of 24/7 online trading for the surf shop, before you check my notes.",
  },
  "impacts-of-technology-u4-5-dependency-on-communication": {
    ticket: "A school's systems went down for a day and it exposed exactly how dependent the staff and even the patients at the attached clinic had become on electronic communication. This case is about naming that dependency honestly, and the responsibilities that come with relying on it — including privacy.",
    wisdom: "Dependency isn't automatically a flaw to criticise — it's a fact to manage. The useful answer isn't 'people shouldn't rely on technology so much', it's identifying the specific skill gap or responsibility that the outage exposed, and what closes that gap.",
    pr: "Name the actual skill staff and patients need to develop, not a generic 'get better with tech'. And the privacy responsibility question wants a specific duty — what they're responsible for maintaining, and why it's on them, not just the provider.",
    sandbox: "Explain why staff and patients need better technology skills, and one privacy responsibility patients have, before you check my case summary.",
  },

  // ───────────────────────── Managing Data (Sloane, SW Logistical Analytics) ─────────────────────────
  "managing-data-1-file-optimisation": {
    ticket: "A real estate agent's 24 MB house photo is killing their website's load time, and the same file needs to go to print, online and email — three completely different jobs from one source image. File optimisation isn't one setting, it's choosing the right resolution, colour mode and format for where the file actually ends up.",
    wisdom: "Nobody ever gets marked down for knowing print needs 300 ppi — they get marked down for not explaining why online doesn't. Say it out loud: screens display pixels, not printed dots, so 'resolution' for online is about pixel dimensions fitting the screen, not ppi at all.",
    pr: "'To make it better' earns nothing from me, same as it earns nothing in the exam. I want file size, load time and the specific audience (mobile data, slow connections) all connected in one sentence before I sign off on an optimisation answer.",
    sandbox: "Explain why the school's photo slows the website, then compare how it should be optimised for the website versus the yearbook, before you check my version.",
  },
  "managing-data-2-compression": {
    ticket: "Two files, two very different compression needs crossed my desk this week — and picking the wrong type for the wrong job either wrecks the quality or barely shrinks the file. Compression isn't a single technique; justifying lossy versus lossless for a specific use is exactly what gets tested.",
    wisdom: "My rule of thumb: if the file needs to be restored byte-for-byte identical — a document, a database export — it's lossless, no exceptions. If it's a photo or audio where a human eye or ear won't notice the difference, lossy buys you a much smaller file for free.",
    pr: "State the purpose of compression cleanly first. Then for each use, I want the type named and justified against what that specific use actually needs — quality-critical or size-critical — not just 'lossy is smaller'.",
    sandbox: "State compression's purpose, then justify a type for each of the two uses, before you check my call.",
  },
  "managing-data-3-cropping-and-resampling": {
    ticket: "A website photo needs cropping to fit a banner, and a PDF is bloated because nobody resampled the images inside it before export. Cropping and resampling get confused constantly — one changes what's in the frame, the other changes how much data describes it.",
    wisdom: "Cropping removes part of the image — the pixel dimensions and framing both change. Resampling reduces the number of pixels describing the same framing — the content stays, the detail shrinks. Confuse the two in an answer and I know immediately the concept isn't understood, just the word.",
    pr: "Describe cropping's specific effect on this photo, not the definition in isolation. And for resampling reducing the PDF's size — I want 'fewer pixels, smaller file' explained, not just asserted.",
    sandbox: "Describe how cropping could be used on the photo, then explain how resampling reduces the PDF's size, before you check my notes.",
  },
  "managing-data-4-online-data-management": {
    ticket: "A netball club's shared files are a mess — someone's working copy got overwritten, nobody can find last season's roster. Shared folders, permissions, sync, search and tags — this is the unglamorous admin work that determines whether a volunteer-run club's data survives contact with real life.",
    wisdom: "Most 'someone deleted my file' disasters are actually a permissions failure, not malice — give everyone full edit access to everything and eventually someone will overwrite or delete work they didn't mean to touch. Tiered permissions aren't bureaucracy, they're damage control.",
    pr: "I want two concrete strategies for this club — not a general list of good practice, strategies that fit a small volunteer team specifically. And the permissions answer needs to explain how restricting access would have actually stopped this specific deletion.",
    sandbox: "Describe two strategies to fix the club's online data mess, and how permissions could have prevented the deleted work, before you check my recommendations.",
  },
  "managing-data-5-version-control": {
    ticket: "A club newsletter went through six 'final' versions and nobody can find which one actually got sent. Version control — numbering, history, a master copy, checking files out — exists entirely to prevent this exact chaos, and it's cheap insurance most small teams skip until it bites them.",
    wisdom: "A file literally named 'final_FINAL_v2_useThisOne.docx' is the single clearest sign version control has already failed. If your naming convention needs an adjective to tell people which one's current, the system is broken, not the file.",
    pr: "Define version control precisely — it's not just 'saving different copies', it's a deliberate system. Then for this student's strategies, I want something that would have actually prevented the newsletter confusion, not generic advice.",
    sandbox: "Define document version control, then describe two strategies the student should use, before you check my fix.",
  },
  "managing-data-6-cloud-computing": {
    ticket: "A mobile hairdresser wants to ditch the laptop she drags between appointments and run everything from her phone instead. Cloud computing's real sell for someone like her isn't the buzzword — it's that her bookings and client notes follow her, with trade-offs she needs to understand before she commits.",
    wisdom: "I always make clients name one real advantage and one real disadvantage before signing off on a cloud move — not just the sales pitch. Access-anywhere is genuinely powerful for a mobile worker; losing it the moment her connection drops is the cost nobody mentions upfront.",
    pr: "Explain the concept properly — remote storage and processing accessed over the internet — before you weigh advantage against disadvantage. A one-sided answer, all upside or all downside, isn't the full picture and won't get full marks.",
    sandbox: "Explain cloud computing, then give one real advantage and one real disadvantage for this accounting firm, before you check my assessment.",
  },
  "managing-data-7-maintenance-utilities": {
    ticket: "A family laptop's crawling and everyone assumes it needs replacing. Nine times out of ten it just needs the maintenance it's never had — disk clean-up, clearing the internet cache, checking temporary files — before anyone spends money on new hardware.",
    wisdom: "Defragmentation is the classic trap question — it's essential on an old spinning hard drive and actively unnecessary, even mildly harmful, on an SSD, which have no moving parts to benefit from it. If a laptop has an SSD, say so and explain why defrag doesn't apply.",
    pr: "Name two specific utility tools and what each actually fixes for this laptop, not a generic list of 'things that help'. And if it's an SSD, don't recommend defrag — explain why it's not needed, that's the actual mark.",
    sandbox: "Describe how two utility tools could help this laptop, and explain why defragmentation isn't needed on her machine, before you check my diagnosis.",
  },
  "managing-data-8-security-utilities": {
    ticket: "A suspicious email just hit a family's inbox and something's already behaving strangely on their laptop. Malware, virus, spyware, anti-virus, spam filters — identifying exactly what kind of threat you're dealing with changes what protection actually stops it.",
    wisdom: "A virus and spyware aren't the same threat even though people lump them together — a virus spreads and disrupts, spyware quietly watches and steals information without the user noticing anything's wrong at all. Misname the malware type and your recommended fix won't match the actual problem.",
    pr: "Identify the specific type of malware involved, don't just say 'a virus' by default — read the clues. And for protecting the family going forward, I want two distinct, concrete protections, not one idea restated twice.",
    sandbox: "Identify the likely malware type and a strategy for it, then describe two ways to protect the laptop going forward, before you check my ruling.",
  },

  // ───────────────────────── Application Skills — Unit 3 (Rory, Bunbury Tech Launchpad) ─────────────────────────
  "application-skills-u3-1-data-organisation": {
    ticket: "Onboarded a wedding videographer this sprint and their files are a flat folder of 4,000 clips named IMG_0001 through IMG_3999. Before we can deliver anything on schedule, we need a folder structure and naming convention that a tired editor at 11pm can still navigate without guessing.",
    wisdom: "I judge a naming convention by one test: can someone who's never seen this project find the right file in under ten seconds, just from the name? If the answer's no, the convention has failed regardless of how 'organised' it looks.",
    pr: "I want a folder structure proposal that actually fits a videographer's workflow — by client, by date, by shoot type — not a generic 'Documents/Photos/Videos' template. And for the naming convention benefits, give me two that matter to a real deadline-driven business, not two restatements of 'it's tidier'.",
    sandbox: "Sketch a folder structure for the agency and list two real benefits of a consistent naming convention, before you check my sprint plan.",
  },
  "application-skills-u3-2-graphic-and-audio-file-formats": {
    ticket: "A food truck client needs a logo that scales from a tiny Instagram icon to a 3-metre van wrap, plus a podcast episode ready for upload. Picking the right graphic and audio formats upfront saves us from re-exporting everything twice when the client asks for 'just one more size'.",
    wisdom: "Vector for the logo, every time, when it has to scale — it's maths, not pixels, so a van wrap and a favicon come from the exact same file with zero quality loss. Raster locks you into the resolution you exported at, and someone always asks for it bigger later.",
    pr: "Compare vector and raster on what actually matters for this client — scalability for the logo — not a generic textbook comparison. And the audio format pick needs to suit an upload platform's requirements, not just 'it's a common format'.",
    sandbox: "Compare vector and raster graphics for the logo, and pick a suitable audio format for the podcast upload, before you check my recommendation.",
  },
  "application-skills-u3-3-audio-software-features": {
    ticket: "A client recorded a voiceover with background hum, uneven volume and an awkward pause in the middle — standard first-draft audio. Before it goes anywhere near a client deliverable, it needs real editing, and then it needs exporting in a format that actually survives being sent.",
    wisdom: "Clients almost never flag 'the file won't open' as an editing problem, but it usually is one — sending a huge, uncompressed master file instead of exporting or converting it for delivery is the single most common reason a finished job gets stuck in someone's inbox.",
    pr: "Name two specific editing features she'd actually use — not 'she edited it', name the tools (noise reduction, normalising volume, trimming). And explain exporting or converting as a real step with a reason, not an afterthought.",
    sandbox: "Describe two editing features she should use, and explain why she must export or convert before sending, before you check my notes.",
  },
  "application-skills-u3-4-software-management": {
    ticket: "A school wants a new piece of software rolled out across the lab and I need the checklist done before anyone touches install. Installation, updates, patches, administrator rights — skip one check and you're the one fixing it at 7am before first period.",
    wisdom: "Ignoring updates isn't a convenience trade-off, it's a security decision whether people realise it or not — most patches exist specifically to close a vulnerability that's already being exploited somewhere. 'I'll do it later' on an update is a risk decision, say it plainly.",
    pr: "Name two concrete things she should check before installing — compatibility, admin rights, licensing — not a vague 'be careful'. And the Windows updates risk question wants a specific consequence, not just 'it could be bad'.",
    sandbox: "Describe two things to check before installing the new software, and one risk of ignoring updates, before you check my checklist.",
  },
  "application-skills-u3-5-software-licences": {
    ticket: "A community group's choosing between two software options on a shoestring budget and asked me to lay out exactly what proprietary actually costs them versus what it buys them. Licensing decisions aren't about which one is 'free' — they're about what each option actually commits the group to.",
    wisdom: "Proprietary software usually buys guaranteed support and regular updates for a price; the free or open alternative buys flexibility and zero licence cost but often means the group is on their own when something breaks. Neither is automatically the right call — it depends on whether this group has anyone technical enough to self-support.",
    pr: "Define proprietary software precisely first. Then the comparison for this school needs both options weighed against their actual situation — budget, technical skill available — not a generic pros-and-cons list.",
    sandbox: "Define proprietary software, then compare the two options for this school's situation, before you check my recommendation.",
  },
  "application-skills-u3-6-spreadsheet-design": {
    ticket: "A sports club's membership spreadsheet has prices stored as text in some rows and numbers in others — their totals formula is broken and nobody can see why. Spreadsheet design isn't decoration, it's the difference between a sheet that calculates correctly and one that silently gives wrong answers.",
    wisdom: "A heading row, one data type per column, and a consistent number format aren't style preferences — they're what makes formulas and sorting actually work. Mixed text and numbers in one 'price' column is the single most common reason a club treasurer's totals don't add up.",
    pr: "Explain why consistent number formatting matters for this exact problem — calculations silently breaking — not formatting in general. And give two other layout improvements that would genuinely help this specific sheet, not a generic spreadsheet checklist.",
    sandbox: "Explain why the prices need one consistent format, and describe two other improvements, before you check my fix.",
  },
  "application-skills-u3-7-sort-filters": {
    ticket: "Same membership sheet, new request: the club wants beginners under 18 pulled out for a new program, fast, without touching the master list. That's a filter job, not a sort job — and knowing which tool solves which problem is exactly what separates a ten-second fix from a messy manual search.",
    wisdom: "Sort rearranges everything permanently (until you sort again); filter temporarily hides rows that don't match, leaving the underlying data untouched. If the club needs to find a subgroup without disturbing the master list for everyone else, filter is always the right tool, not sort.",
    pr: "Describe a multi-level sort as an actual layered rule — sort by this, then by that — not just 'sort the data'. And the filter answer needs the specific condition that pulls beginners under 18, named precisely.",
    sandbox: "Describe how a multi-level sort could organise the data, and how filters could find beginners under 18, before you check my approach.",
  },

  // ───────────────────────── Project Management — Unit 3 (Rory, Bunbury Tech Launchpad) ─────────────────────────
  "project-management-u3-1-project-management-considerations": {
    ticket: "Bunbury Surf Club wants a Nippers sign-up reel and the deadline's tight — before I let anyone touch a camera, we run through the four project management considerations. Skip this step and the first thing that gets sacrificed under pressure is quality, every single time.",
    wisdom: "The four considerations fight each other by design — more time or more budget buys better quality, but real projects rarely get more of either. Naming the trade-off honestly up front is worth more than pretending you can max out all four at once.",
    pr: "Outline all four considerations for this reel specifically, not a generic list. And for the 10-second ad add-on, I want you to say which consideration gets squeezed when scope increases but the deadline doesn't move.",
    sandbox: "Outline the four considerations for the Nippers reel, then work out what happens to them when the manager adds a 10-second ad, before you check my call.",
  },
  "project-management-u3-2-design-process-components": {
    ticket: "Bunbury Library's school holiday program needs a promo video and I need the target audience nailed down before anyone writes a single design criterion — because criteria written for the wrong audience get the whole project redone.",
    wisdom: "Design criteria that aren't testable are useless to a project manager — 'make it fun' can't be checked off at the end. 'Under 90 seconds, features at least three activities, suitable for ages 6 to 12' can actually be verified against the finished product.",
    pr: "Describe two real characteristics of this specific audience — age, what motivates holiday program sign-ups — not generic audience traits. And I want three design criteria that are genuinely measurable, not three vague wishes.",
    sandbox: "Describe two audience characteristics and write three design criteria for the video, before you check my brief.",
  },
  "project-management-u3-3-representing-the-design": {
    ticket: "An animated safety message needs planning before a single frame gets drawn — thumbnails, storyboards, proper annotation — because representing a design on paper first is what catches the expensive mistakes before they're expensive.",
    wisdom: "Thumbnails exist to let you fail fast and cheap — a bad sequence idea costs ten seconds to scrap on paper and hours to scrap once it's animated. Any team that skips straight to production because 'we know what we want' ends up redoing more work than they saved.",
    pr: "Describe thumbnails' actual role in this project — planning the sequence before production — not just 'they're sketches'. And the annotations need to be specific to an animated piece — timing, transitions — not generic design notes.",
    sandbox: "Describe how thumbnails could be used here, and two annotations you'd include on an animation storyboard, before you check my plan.",
  },
  "project-management-u3-4-evaluating-digital-products": {
    ticket: "The school canteen ordering page shipped and now it needs evaluating — properly, against criteria, with actual evidence, not just 'yeah it's fine'. Evaluation is the step every rushed project skips, and it's exactly the step that tells you whether to do it the same way next time.",
    wisdom: "Self-reflection without evidence is just an opinion with extra steps. 'I think it worked well' earns nothing from a marker or a client — a screenshot of actual usage, a user comment, a measured outcome is what turns an opinion into an evaluation.",
    pr: "Name two real methods for gathering evidence on this page — a user survey, usage data, direct observation — not 'I would ask people'. And I want two more design criteria that are genuinely testable against the finished product, matching the standard from earlier in this topic.",
    sandbox: "Describe two methods for gathering evidence, and write two more testable design criteria, before you check my evaluation.",
  },

  // ───────────────────────── Application Skills — Unit 4 (Rory, Bunbury Tech Launchpad) ─────────────────────────
  "application-skills-u4-1-online-collaboration": {
    ticket: "Three students planning the Year 12 formal are scattered across different towns and need to actually get work done together, not just message about it. Choosing the right collaboration tools — and being honest about the real downside — is the difference between a project that moves and one stuck in a group chat forever.",
    wisdom: "The disadvantage question is the one everyone skips, because collaboration tools feel like an unqualified good. They're not — version confusion, unequal contribution, or someone's patchy wifi dropping them from a call are all real costs, and naming one honestly is worth more than pretending collaboration has no downside.",
    pr: "Describe two distinct types of collaboration this group could actually use — not two tools that do the same job. And the disadvantage needs to be a genuine cost of collaborating remotely, not a generic complaint about technology.",
    sandbox: "Describe two types of online collaboration for the group, and one real disadvantage, before you check my plan.",
  },
  "application-skills-u4-2-web-authoring-features": {
    ticket: "A small club website needs a colour scheme change and what should've been a five-minute job turned into editing forty separate pages — because nobody used a .css file. Hyperlinks, templates, .htm versus .css — knowing what each piece is actually for would have saved this entire sprint.",
    wisdom: "A .css file is the single highest-leverage thing in basic web authoring — one file controls the look of every page that links to it. Any site that doesn't use one is signing up for exactly the pain this club just went through, and it's completely avoidable.",
    pr: "Describe two distinct hyperlink types the club site could actually use — internal, external, email, download — not two examples of the same type. And explain the .css benefit against this exact colour-change problem, not css in the abstract.",
    sandbox: "Describe two hyperlink types for the club website, and how a .css file would have made the colour change easier, before you check my fix.",
  },
  "application-skills-u4-3-navigation-maps": {
    ticket: "A camping app needs its navigation planned before a single screen gets built — hierarchical, linear, or networked structure, and the choice has to match how people actually use a camping app, not just what looks tidy on paper.",
    wisdom: "Linear structures suit a fixed sequence a user has to follow — a checkout flow, a tutorial. Hierarchical suits browsing categories, which is exactly what a camping app needs: parks, then sites, then details. Pick the structure the user's actual task demands, not the one that's easiest to diagram.",
    pr: "Identify the structure and justify it against how people actually browse camping sites, not against structure in the abstract. And the navigation map features need to be concrete — what's actually shown on each level — not a vague description.",
    sandbox: "Identify the structure that suits the camping app and describe two features your navigation map would need, before you check my map.",
  },
  "application-skills-u4-4-responsive-design": {
    ticket: "A news site looks perfect on a desktop and falls apart on a phone — overlapping text, a menu that eats half the screen. Responsive design — fluid grids, flexible images, breakpoints, the hamburger menu — exists purely to stop exactly this from happening, and it's non-negotiable on any public-facing site in 2026.",
    wisdom: "A breakpoint isn't a fixed rule you memorise once — it's wherever the current layout actually starts to break for a given screen width, and that's different for every design. Test on the real device, don't guess the number from a textbook.",
    pr: "Explain the concept properly — layout adapting to screen size — before diagnosing this specific site's problems. And I want two concrete responsive fixes for this exact news site, not a generic list of responsive techniques.",
    sandbox: "Explain responsive design, then describe two fixes for the news site on a small screen, before you check my audit.",
  },
  "application-skills-u4-5-animation-software-features": {
    ticket: "A bouncing ball animation and a logo that needs to move — frames, keyframes, tweening, buttons. Simple-sounding brief, but 'simple' animation is where most students lose marks explaining the mechanics instead of just describing what they saw happen.",
    wisdom: "A tween isn't magic — it's the software calculating every frame between two keyframes you set manually. If you can't explain that a tween needs a start keyframe and an end keyframe to interpolate between, you don't yet understand why it works, you've just used the button.",
    pr: "Describe the tween specifically for the logo movement — what moves, between which two states — not just 'a tween was used'. And the button question wants its purpose and its states (up, over, down) both covered, not just 'it's clickable'.",
    sandbox: "Describe how a tween could create the logo movement, and a button's purpose and states, before you check my breakdown.",
  },

  // ───────────────────────── Project Management — Unit 4 (Rory, Bunbury Tech Launchpad) ─────────────────────────
  "project-management-u4-1-plan-of-action": {
    ticket: "A band wants a website and handed me a vague list of 'things to do' with no order and no dates — not a plan, just a wish list. A real plan of action needs every task, every milestone, every dependency laid out, or the project drifts the moment anything gets busy.",
    wisdom: "Dependencies are what separate a task list from a plan. If 'build the gallery page' depends on 'collect band photos' finishing first, and you don't mark that dependency, someone will start the gallery with no photos and waste the sprint. Always ask what has to happen before this.",
    pr: "I want all four parts in every row — task, time, who's responsible, and dependency — not three out of four. And the three tasks you write need a real time estimate each, not 'soon' or 'later'.",
    sandbox: "Identify the four parts of each plan row, then write three ordered tasks with time and dependency, before you check my plan.",
  },
  "project-management-u4-2-time-management-strategies": {
    ticket: "A project's running late and the team's panicking instead of triaging. Prioritising, milestones, a Gantt chart, buffer time, time blocking — this is the rescue kit, and knowing which tool actually fixes a late project versus which one just looks organised matters right now.",
    wisdom: "Buffer time isn't slack for being lazy — it's the only thing standing between 'one task runs long' and 'the whole project misses its deadline'. A plan with zero buffer is a plan that was already late the moment anything went even slightly wrong.",
    pr: "Describe two strategies that would actually rescue this specific late project, not two generic time management tips. And explain why buffer time matters here specifically — what it protects against — not 'it's good practice'.",
    sandbox: "Describe two time management strategies for the late project, and why buffer time should be included, before you check my rescue plan.",
  },
  "project-management-u4-3-resources": {
    ticket: "A school podcast needs resourcing properly before anyone records a word — hardware, software, people, and someone has to actually manage all three or the project stalls waiting on a microphone nobody booked.",
    wisdom: "People are the resource everyone forgets to plan for — hardware and software get listed, but who's editing, who's hosting, who's actually available this week rarely gets the same scrutiny, and it's usually the people resource that causes the delay.",
    pr: "Identify one hardware, one software and one people resource specifically for this podcast, not a generic production checklist. And describe how two of those resources would actually be managed — booked, scheduled, assigned — not just listed.",
    sandbox: "Identify one hardware, one software and one people resource, then describe how two could be managed, before you check my resourcing plan.",
  },
  "project-management-u4-4-evaluation": {
    ticket: "A community garden newsletter's done and now it needs evaluating properly — product, process, a user survey, client feedback — before anyone can honestly say whether it worked, or just assume it did because it got finished.",
    wisdom: "Product evaluation and process evaluation answer different questions — did the final newsletter actually meet the brief, versus did the way the team worked actually go smoothly. A project can nail one and fail the other, and a good evaluation checks both separately.",
    pr: "Name two real tools for gathering evaluation evidence — a survey, direct feedback — not 'I would ask people how it went'. And the recommendation for next time needs to be specific and actionable, not 'do better next time'.",
    sandbox: "Describe two tools for gathering evaluation evidence, then recommend one change to the plan of action for next time, before you check my review.",
  },
};
