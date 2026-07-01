export interface Agent {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  studyPathway: string;
  love: string;
  hardPart: string;
  photo: string;
  accentColor: string;
  topics: string[];
}

export const AGENTS: Agent[] = [
  {
    id: "leo",
    name: "Leo Thorne",
    title: "Creative Director",
    company: "Koombana Creative Labs",
    bio: "A visionary designer who believes that digital accessibility is the foundation of great architecture. Leo focuses on crafting intuitive user experiences that turn complex data into beautiful, functional interfaces.",
    studyPathway: "Bachelor of Design or Creative Media (UX/UI focus). Alternatively, a TAFE Diploma of Graphic Design provides the practical software skills needed to start in junior roles.",
    love: "There is nothing more exhilarating than watching a user intuitively grasp a complex system because the interface finally speaks their language.",
    hardPart: "The trap is falling in love with your own pixels. If you can't kill your darlings when the user data proves you wrong, you're not designing for the client — you're designing for your ego.",
    photo: "/agents/leo-thorne.png",
    accentColor: "amber",
    topics: ["design-concepts", "design-concepts-y12"],
  },
  {
    id: "sloane",
    name: "Sloane Vane",
    title: "Head of Data Integrity",
    company: "SW Logistical Analytics",
    bio: "A meticulous data strategist with an uncompromising standard for accuracy. Sloane ensures that every byte of information is normalised, secure, and ready for critical decision-making.",
    studyPathway: "Bachelor of Science (Computer Science) or IT with a major in Data Science/Business Information Systems. A TAFE Diploma of IT (Database Design and Development) offers a direct route into entry-level administration.",
    love: "I love the silence of a perfectly normalised database. It is the feeling of absolute order in a chaotic, messy digital world.",
    hardPart: "The burden is that you are the only one who notices when a single character is out of place, and you have to be the one to halt the entire production line to fix it.",
    photo: "/agents/sloane-vane.png",
    accentColor: "blue",
    topics: ["managing-data"],
  },
  {
    id: "sparky",
    name: "Jaxen \"Sparky\" Miller",
    title: "Senior Systems Engineer",
    company: "Bunbury Hardware Integrators",
    bio: "A high-energy engineer who treats the physical infrastructure of the internet with professional reverence. Jaxen specialises in building robust, resilient networks capable of handling industrial-scale traffic.",
    studyPathway: "Bachelor of Engineering (Computer/Telecommunications) or IT (Cyber Security and Networking). TAFE's Diploma of IT (Networking) provides hands-on technical skills for infrastructure management.",
    love: "It's about the heartbeat of the network. Knowing that when I secure a rack and optimise the flow, I'm the reason the business stays online.",
    hardPart: "Your best work is invisible. Nobody calls to thank you when the network is running perfectly, but they will call you at 3:00 AM when the fibre link drops.",
    photo: "/agents/sparky-miller.png",
    accentColor: "green",
    topics: ["hardware", "networks"],
  },
  {
    id: "elara",
    name: "Dr. Elara Finch",
    title: "Digital Policy & Innovation Director",
    company: "Regional Ethics Tech Group",
    bio: "A strategic thinker who navigates the complex intersection of human rights and emerging technology. Elara leads the charge in ensuring every product is built with ethics, privacy, and social responsibility at its core.",
    studyPathway: "A multidisciplinary degree (e.g., IT/Law or IT/Philosophy) followed by postgraduate research. A TAFE Diploma in Business or Project Management provides the foundational administrative structure.",
    love: "I thrive on the challenge of protecting human dignity. Making sure that as we innovate, we aren't leaving our ethics or our privacy behind.",
    hardPart: "You will often be the 'roadblock' in the room. It is mentally exhausting to constantly explain why moving fast shouldn't come at the cost of being right.",
    photo: "/agents/elara-finch.png",
    accentColor: "violet",
    topics: ["impacts-of-technology", "impacts-of-technology-u3", "impacts-of-technology-u4"],
  },
  {
    id: "rory",
    name: "Rory Quinn",
    title: "Lead Project Delivery Manager",
    company: "Bunbury Tech Launchpad",
    bio: "A high-performance coordinator who thrives on turning ambitious concepts into shippable reality. Rory masters the art of the sprint, balancing team morale with strict adherence to project scope and deadlines.",
    studyPathway: "Bachelor of Business (Project Management) or IT (Agile Development). TAFE's Diploma of Project Management provides practical application of project lifecycles.",
    love: "The best part of the job is the ship date — that moment when a fragmented team's hard work finally aligns and hits the market as a cohesive product.",
    hardPart: "The struggle is the middle of the sprint. You have to be the buffer between the team's burnout and the client's shifting demands, all while keeping the schedule from slipping.",
    photo: "/agents/rory-quinn.png",
    accentColor: "orange",
    topics: ["application-skills", "project-management", "application-skills-u3", "project-management-u3", "application-skills-u4", "project-management-u4"],
  },
];

export function getAgentForTopic(topicId: string): Agent | null {
  return AGENTS.find(a => a.topics.some(t => topicId.startsWith(t))) ?? null;
}
