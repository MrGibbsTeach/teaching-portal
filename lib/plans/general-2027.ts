// Term-by-term teaching plans for the 2027 AIT General courses (see claude/general-2027-term-plan.md).
// Week numbers are school week numbers. Dates and assessment points are indicative and will change:
// edit this file, not the lessons (assessment tasks and dates never live inside lessons).
// Lesson refs are exact lesson ids, or an id prefix (e.g. "design-concepts-1" matches "design-concepts-1-elements-of-design").
import type { TermPlan } from "./types";

export const PLANS: Record<string, TermPlan> = {
  "year-11-applied-it-general": [
    {
      "term": 1,
      "week": 1,
      "monday": "2027-01-25",
      "days": 0,
      "topic": "Introduction only",
      "body": "No Year 11 students this week. Year 11 start Mon 1 Feb. The outline's Week 1 content moves into Week 2.",
      "events": [
        {
          "kind": "info",
          "text": "Task 1 introduced in Week 2"
        }
      ],
      "notes": [
        {
          "text": "Week numbers are school week numbers, so Year 11 start in Week 2.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 1,
      "week": 2,
      "monday": "2027-02-01",
      "days": 5,
      "topic": "Course start: everything happens here",
      "body": "Course introduction; elements of design; principles of design; typography; identify elements and principles in an existing digital product",
      "events": [],
      "notes": [],
      "lessons": [
        "elements-of-design",
        "principles-of-design",
        "typography"
      ]
    },
    {
      "term": 1,
      "week": 3,
      "monday": "2027-02-08",
      "days": 5,
      "topic": "U1 Design concepts; Project management",
      "body": "Compositional rules; apply elements and principles to page layouts; considerations for a digital product",
      "events": [
        {
          "kind": "cp",
          "text": "Task 1 CP1: client brief, need, purpose, audience, medium"
        }
      ],
      "notes": [
        {
          "text": "Ash Wednesday Wed 10 Feb.",
          "soft": true
        }
      ],
      "lessons": [
        "compositional-rules",
        "analysing-and-applying-design",
        "planning-a-digital-solution"
      ]
    },
    {
      "term": 1,
      "week": 4,
      "monday": "2027-02-15",
      "days": 5,
      "topic": "U2 Project management",
      "body": "Design process, schedule of tasks, time management, storyboards, wireframe and grid",
      "events": [],
      "notes": [],
      "lessons": [
        "the-design-process",
        "time-management-skills",
        "representing-a-design"
      ]
    },
    {
      "term": 1,
      "week": 5,
      "monday": "2027-02-22",
      "days": 5,
      "topic": "U1 Impacts of technology",
      "body": "WHS for a personal work area; personal information; digital citizenship; disposal and recycling",
      "events": [
        {
          "kind": "cp",
          "text": "Task 1 CP2: timeline, style guide, thumbnails"
        }
      ],
      "notes": [
        {
          "text": "OLNA runs 24 Feb to 12 Mar for some students. Flagged, not planned around.",
          "soft": true
        }
      ],
      "lessons": [
        "work-health-and-safety-in-the-digital-workplace",
        "privacy-and-personal-information",
        "digital-citizenship-and-online-conduct",
        "e-waste-and-environmental-responsibility"
      ]
    },
    {
      "term": 1,
      "week": 6,
      "monday": "2027-03-01",
      "days": 4,
      "topic": "U1 Impacts of technology",
      "body": "Digital vs traditional media; information and images online; impact of change on values, productivity, lifestyle",
      "events": [],
      "notes": [
        {
          "text": "Labour Day Mon 1 Mar. Tue 2 Mar runs a Monday timetable.",
          "soft": true
        }
      ],
      "lessons": [
        "digital-vs-traditional-communication"
      ]
    },
    {
      "term": 1,
      "week": 7,
      "monday": "2027-03-08",
      "days": 5,
      "topic": "U2 Application skills; U1 Project management",
      "body": "Image manipulation software; criteria and methods for evaluating a digital product",
      "events": [
        {
          "kind": "cp",
          "text": "Task 1 CP3: wireframe and grid, storyboard, evaluation criteria"
        }
      ],
      "notes": [
        {
          "text": "OLNA concludes Fri 12 Mar.",
          "soft": true
        }
      ],
      "lessons": [
        "image-manipulation-software",
        "evaluating-a-digital-solution"
      ]
    },
    {
      "term": 1,
      "week": 8,
      "monday": "2027-03-15",
      "days": 5,
      "topic": "U1 Revision",
      "body": "Consolidation of Impacts of technology (Unit 1)",
      "events": [
        {
          "kind": "due",
          "text": "Task 1 due: Design Plan (Campaign) 15%"
        }
      ],
      "notes": [
        {
          "text": "Year 11 Geography and EES Swan River excursions Wed 17 Mar (TBC). Only matters if your class is going. Universities Tour Wed 17 Mar, 8:35 to 9:20.",
          "soft": true
        }
      ],
      "lessons": [
        "impacts-of-technology-quiz"
      ]
    },
    {
      "term": 1,
      "week": 9,
      "monday": "2027-03-22",
      "days": 4,
      "topic": "U1 Impacts; Application skills",
      "body": "Production of the campaign begins: logo and poster drafts",
      "events": [
        {
          "kind": "test",
          "text": "Task 2: Impacts Test 10%"
        },
        {
          "kind": "info",
          "text": "Task 3 introduced"
        }
      ],
      "notes": [
        {
          "text": "Easter Liturgy Thu 25 Mar. Good Friday Fri 26 Mar. Heavy week by choice.",
          "soft": true
        }
      ],
      "lessons": [
        "image-manipulation-software"
      ]
    },
    {
      "term": 1,
      "week": 10,
      "monday": "2027-03-29",
      "days": 3,
      "topic": "Buffer week",
      "body": "No new content and no assessment. Catch-up and project support.",
      "events": [],
      "notes": [
        {
          "text": "Easter Monday and Tuesday are holidays. Wed 31 Mar runs a Monday timetable. Athletics Carnival Fri 2 Apr. Use this and Week 11 for anything that slips from Term 1.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 1,
      "week": 11,
      "monday": "2027-04-05",
      "days": 5,
      "topic": "Not in the outline",
      "body": "The calendar has an 11th week before the break. Not in the outline, so it is spare room for Term 1 overflow.",
      "events": [],
      "notes": [],
      "lessons": []
    },
    {
      "term": 2,
      "week": 1,
      "monday": "2027-04-26",
      "days": 4,
      "topic": "U1 Application skills; U2 Managing data",
      "body": "Spreadsheets for personal budgets; common file formats; save data in different file types",
      "events": [
        {
          "kind": "cp",
          "text": "Task 3 CP1: logo, poster drafts"
        }
      ],
      "notes": [
        {
          "text": "Anzac Day Mon 26 Apr. Thu 29 Apr runs a Monday timetable.",
          "soft": true
        }
      ],
      "lessons": [
        "spreadsheet-features",
        "spreadsheet-practical-task",
        "common-file-formats"
      ]
    },
    {
      "term": 2,
      "week": 2,
      "monday": "2027-05-03",
      "days": 5,
      "topic": "U2 Application skills; Managing data",
      "body": "Audio software; personal data organisation and version control; copyright acknowledgement",
      "events": [
        {
          "kind": "cp",
          "text": "Task 3 CP2: social tiles, audio promo, spreadsheet"
        }
      ],
      "notes": [],
      "lessons": [
        "audio-software-features",
        "file-and-folder-organisation",
        "version-control-for-data-files",
        "copyright-and-intellectual-property"
      ]
    },
    {
      "term": 2,
      "week": 3,
      "monday": "2027-05-10",
      "days": 5,
      "topic": "U1 Hardware",
      "body": "Computer systems; CPU; memory; input and output devices",
      "events": [
        {
          "kind": "due",
          "text": "Task 3 due: Production (Campaign) 20%"
        }
      ],
      "notes": [
        {
          "text": "Inter-House Cross Country Thu 13 May.",
          "soft": true
        }
      ],
      "lessons": [
        "types-of-computer-systems",
        "cpu-and-memory"
      ]
    },
    {
      "term": 2,
      "week": 4,
      "monday": "2027-05-17",
      "days": 4,
      "topic": "U1 Hardware",
      "body": "Peripheral devices; troubleshooting a faulty monitor, no power, printer not working",
      "events": [],
      "notes": [
        {
          "text": "Staff PD Day Fri 21 May.",
          "soft": true
        }
      ],
      "lessons": [
        "input-output-and-peripheral-devices",
        "troubleshooting-hardware-and-software"
      ]
    },
    {
      "term": 2,
      "week": 5,
      "monday": "2027-05-24",
      "days": 5,
      "topic": "U1 Application skills",
      "body": "Word processing features; document layout; design strategy",
      "events": [],
      "notes": [],
      "lessons": [
        "word-processing-features",
        "word-processing-practical-task",
        "document-design-and-layout"
      ]
    },
    {
      "term": 2,
      "week": 6,
      "monday": "2027-05-31",
      "days": 5,
      "topic": "U1 Revision",
      "body": "Consolidation of Hardware, Application skills and Design concepts",
      "events": [
        {
          "kind": "test",
          "text": "Task 4: Scenario Task (Unit 1) 5%"
        }
      ],
      "notes": [],
      "lessons": [
        "hardware-quiz",
        "application-skills-quiz",
        "design-concepts-quiz"
      ]
    },
    {
      "term": 2,
      "week": 7,
      "monday": "2027-06-07",
      "days": 2,
      "topic": "U1 Application skills",
      "body": "Email and webmail; collaborative software tools",
      "events": [],
      "notes": [
        {
          "text": "Western Australia Day Mon 7 Jun.",
          "soft": true
        },
        {
          "text": "Year 11 exams start Thu 10 Jun. General students are not at school during exams, so only Tue and Wed run.",
          "soft": false
        }
      ],
      "lessons": [
        "email-and-webmail",
        "collaborative-software-tools"
      ]
    },
    {
      "term": 2,
      "week": 8,
      "monday": "2027-06-14",
      "days": 0,
      "topic": "No Year 11 students (exams)",
      "body": "Year 11 exams run Mon 14 to Fri 18 Jun. The outline's Managing data content (sources, Boolean search, data vs information) needs a new home.",
      "events": [],
      "notes": [
        {
          "text": "Managing data is first assessed in Task 7 (Term 3 Wk 8), so it could move to Term 3 Wk 1.",
          "soft": false
        }
      ],
      "lessons": [
        "data-vs-information",
        "accuracy-and-reliability-of-sources",
        "search-engines-and-boolean-operators"
      ]
    },
    {
      "term": 2,
      "week": 9,
      "monday": "2027-06-21",
      "days": 5,
      "topic": "U2 Networks",
      "body": "Personal wireless network components; hardware selection; connect and check connectivity",
      "events": [],
      "notes": [],
      "lessons": [
        "components-of-a-wireless-network",
        "selecting-hardware-for-a-network",
        "connecting-and-troubleshooting-networks"
      ]
    },
    {
      "term": 2,
      "week": 10,
      "monday": "2027-06-28",
      "days": 4,
      "topic": "Catch-up only",
      "body": "Country Week. Nothing is planned. Use it for any students who are there.",
      "events": [],
      "notes": [
        {
          "text": "Staff PD Mon 28 Jun, then Country Week to Fri 2 Jul.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 3,
      "week": 1,
      "monday": "2027-07-19",
      "days": 5,
      "topic": "U2 Application skills",
      "body": "Review of Unit 1; overview of Unit 2; presentation software",
      "events": [
        {
          "kind": "info",
          "text": "Task 6 introduced"
        }
      ],
      "notes": [],
      "lessons": [
        "presentation-software-features",
        "presentation-software-create-and-present"
      ]
    },
    {
      "term": 3,
      "week": 2,
      "monday": "2027-07-26",
      "days": 5,
      "topic": "U2 Project management",
      "body": "Design process for a client brief; user requirements; schedule of tasks; time management; resources",
      "events": [
        {
          "kind": "cp",
          "text": "Task 6 CP1: user requirements, plan of action"
        }
      ],
      "notes": [
        {
          "text": "Interschool E-Sports Tournament Thu 29 Jul. No effect on classes.",
          "soft": true
        }
      ],
      "lessons": [
        "the-design-process",
        "time-management-skills"
      ]
    },
    {
      "term": 3,
      "week": 3,
      "monday": "2027-08-02",
      "days": 5,
      "topic": "U2 Project management; Application skills",
      "body": "Wireframe and grid; annotated storyboard; apply elements and principles to user requirements",
      "events": [
        {
          "kind": "cp",
          "text": "Task 6 CP2: wireframes and grid, storyboard"
        }
      ],
      "notes": [],
      "lessons": [
        "representing-a-design",
        "applying-design-elements-and-principles",
        "planning-an-interactive-project"
      ]
    },
    {
      "term": 3,
      "week": 4,
      "monday": "2027-08-09",
      "days": 5,
      "topic": "U2 Networks; Impacts of technology",
      "body": "Network security (firewall, virus protection); computer crime",
      "events": [
        {
          "kind": "due",
          "text": "Task 6 due: Design Plan (House Page) 15%"
        }
      ],
      "notes": [
        {
          "text": "Feast Day Fri 13 Aug.",
          "soft": true
        }
      ],
      "lessons": [
        "network-security",
        "types-of-computer-crime"
      ]
    },
    {
      "term": 3,
      "week": 5,
      "monday": "2027-08-16",
      "days": 5,
      "topic": "U2 Impacts of technology",
      "body": "Regulations for personal ICT use; Copyright Act fair dealing; Spam Act 2003; cyber bullying",
      "events": [
        {
          "kind": "info",
          "text": "Task 8 introduced"
        }
      ],
      "notes": [],
      "lessons": [
        "the-spam-act-2003",
        "digital-citizenship-and-cyberbullying",
        "copyright-and-intellectual-property"
      ]
    },
    {
      "term": 3,
      "week": 6,
      "monday": "2027-08-23",
      "days": 5,
      "topic": "U2 Application skills",
      "body": "Online database tools; troubleshooting software and online training",
      "events": [
        {
          "kind": "cp",
          "text": "Task 8 CP1: crest sting animation draft"
        }
      ],
      "notes": [],
      "lessons": [
        "online-database-tools",
        "software-troubleshooting"
      ]
    },
    {
      "term": 3,
      "week": 7,
      "monday": "2027-08-30",
      "days": 5,
      "topic": "U2 Impacts; Application skills",
      "body": "Impact of digital technology on health and communication; troubleshooting during production; word processing",
      "events": [],
      "notes": [],
      "lessons": [
        "health-impacts-of-technology"
      ]
    },
    {
      "term": 3,
      "week": 8,
      "monday": "2027-09-06",
      "days": 5,
      "topic": "U2 Revision",
      "body": "Consolidation of Managing data and Networks",
      "events": [
        {
          "kind": "test",
          "text": "Task 7: Data and Networks Test 10%"
        }
      ],
      "notes": [],
      "lessons": [
        "managing-data-review-quiz",
        "networks-review-quiz"
      ]
    },
    {
      "term": 3,
      "week": 9,
      "monday": "2027-09-13",
      "days": 5,
      "topic": "U2 Application skills; Project management",
      "body": "Production: interactive project with hyperlinks; audio editing; image manipulation; version control",
      "events": [
        {
          "kind": "cp",
          "text": "Task 8 CP2: house page draft with hyperlinks"
        }
      ],
      "notes": [],
      "lessons": []
    },
    {
      "term": 3,
      "week": 10,
      "monday": "2027-09-20",
      "days": 5,
      "topic": "Buffer week",
      "body": "No new content and no assessment. Catch-up and project support.",
      "events": [],
      "notes": [],
      "lessons": []
    },
    {
      "term": 4,
      "week": 1,
      "monday": "2027-10-11",
      "days": 5,
      "topic": "U2 Application skills; Project management",
      "body": "Production: animated crest sting with edited audio; interactive house page; file formats; version control",
      "events": [
        {
          "kind": "cp",
          "text": "Task 8 CP3: full draft"
        }
      ],
      "notes": [],
      "lessons": []
    },
    {
      "term": 4,
      "week": 2,
      "monday": "2027-10-18",
      "days": 5,
      "topic": "U2 Project management",
      "body": "Test solutions; modify and adapt; present for user evaluation",
      "events": [],
      "notes": [],
      "lessons": []
    },
    {
      "term": 4,
      "week": 3,
      "monday": "2027-10-25",
      "days": 5,
      "topic": "U2 Project management",
      "body": "Evaluate the product against the client requirements",
      "events": [
        {
          "kind": "due",
          "text": "Task 8 due: Production (House Page) 20%"
        }
      ],
      "notes": [],
      "lessons": [
        "evaluating-a-digital-solution-unit-2"
      ]
    },
    {
      "term": 4,
      "week": 4,
      "monday": "2027-11-01",
      "days": 3,
      "topic": "U1 and U2 Revision",
      "body": "Design concepts (elements and principles, wireframe and annotated page design); Project management",
      "events": [],
      "notes": [
        {
          "text": "Staff PD Thu 4 Nov and Staff Retreat Fri 5 Nov, so three days only.",
          "soft": true
        }
      ],
      "lessons": [
        "project-management-review-quiz",
        "applying-design-elements-and-principles"
      ]
    },
    {
      "term": 4,
      "week": 5,
      "monday": "2027-11-08",
      "days": 5,
      "topic": "U2 Revision",
      "body": "Networks and Impacts of technology (computer crime, Spam Act, copyright, cyber bullying, health, communication)",
      "events": [
        {
          "kind": "test",
          "text": "Task 9: Scenario Task (Unit 2) 5%"
        }
      ],
      "notes": [],
      "lessons": [
        "impacts-of-technology-review-quiz",
        "application-skills-review-quiz",
        "networks-review-quiz"
      ]
    },
    {
      "term": 4,
      "week": 6,
      "monday": "2027-11-15",
      "days": 4,
      "topic": "Buffer week",
      "body": "Feedback on Tasks 8 and 9; catch-up on outstanding tasks.",
      "events": [],
      "notes": [
        {
          "text": "Year 11 exams start Fri 19 Nov. General students are away from then.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 4,
      "week": 7,
      "monday": "2027-11-22",
      "days": 0,
      "topic": "No Year 11 students (exams)",
      "body": "Year 11 exams run to Fri 26 Nov.",
      "events": [],
      "notes": [],
      "lessons": []
    },
    {
      "term": 4,
      "week": 8,
      "monday": "2027-11-29",
      "days": 5,
      "topic": "Buffer week",
      "body": "Catch-up. No new content and no assessment.",
      "events": [],
      "notes": [],
      "lessons": []
    },
    {
      "term": 4,
      "week": 9,
      "monday": "2027-12-06",
      "days": 5,
      "topic": "Buffer week",
      "body": "Catch-up. No new content and no assessment.",
      "events": [],
      "notes": [
        {
          "text": "Final Assembly and College Mass Fri 10 Dec.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 4,
      "week": 10,
      "monday": "2027-12-13",
      "days": 0,
      "topic": "No students",
      "body": "Staff PD Days 13 to 16 Dec, Catholic Day Fri 17 Dec.",
      "events": [],
      "notes": [],
      "lessons": []
    }
  ],
  "year-12-applied-it-general": [
    {
      "term": 1,
      "week": 1,
      "monday": "2027-01-25",
      "days": 1,
      "topic": "Introduction only",
      "body": "Outlines issued and the class link given out. The outline's Week 1 content moves into Week 2.",
      "events": [
        {
          "kind": "info",
          "text": "Task 1 introduced if time allows"
        }
      ],
      "notes": [
        {
          "text": "Year 12 start Fri 29 Jan. Mon to Thu are Staff PD and Australia Day, so this week may not happen.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 1,
      "week": 2,
      "monday": "2027-02-01",
      "days": 5,
      "topic": "Course start: everything happens here",
      "body": "Project management considerations and design process; digital citizenship; elements and principles of design; cyberbullying; work-life balance",
      "events": [
        {
          "kind": "cp",
          "text": "Task 1 CP1: Gantt, considerations, brief"
        }
      ],
      "notes": [],
      "lessons": [
        "project-management-u3-1",
        "project-management-u3-2",
        "impacts-of-technology-u3-1",
        "impacts-of-technology-u3-2",
        "design-concepts-1",
        "design-concepts-2",
        "design-concepts-3"
      ]
    },
    {
      "term": 1,
      "week": 3,
      "monday": "2027-02-08",
      "days": 5,
      "topic": "U3 Design concepts; Impacts of technology",
      "body": "Typography; compositional rules; social networking and publication",
      "events": [
        {
          "kind": "cp",
          "text": "Task 1 CP2: research, audience, criteria"
        }
      ],
      "notes": [],
      "lessons": [
        "design-concepts-4",
        "design-concepts-5",
        "impacts-of-technology-u3-3"
      ]
    },
    {
      "term": 1,
      "week": 4,
      "monday": "2027-02-15",
      "days": 5,
      "topic": "U3 Project management",
      "body": "Representing a design plan (sketches, storyboards, thumbnails); criteria to evaluate digital products",
      "events": [
        {
          "kind": "cp",
          "text": "Task 1 CP3: storyboard, shot list, script"
        }
      ],
      "notes": [],
      "lessons": [
        "project-management-u3-3",
        "project-management-u3-4"
      ]
    },
    {
      "term": 1,
      "week": 5,
      "monday": "2027-02-22",
      "days": 5,
      "topic": "U3 Impacts of technology",
      "body": "Copyright Act 1968; acknowledging the IP owner; referencing",
      "events": [
        {
          "kind": "due",
          "text": "Task 1 due: Design Book (Video) 10%"
        }
      ],
      "notes": [
        {
          "text": "OLNA runs 24 Feb to 12 Mar for some students. Flagged, not planned around.",
          "soft": true
        }
      ],
      "lessons": [
        "impacts-of-technology-u3-4",
        "impacts-of-technology-u3-5"
      ]
    },
    {
      "term": 1,
      "week": 6,
      "monday": "2027-03-01",
      "days": 4,
      "topic": "U3 + U4 Application skills",
      "body": "Data organisation; graphic and audio file formats; audio software",
      "events": [
        {
          "kind": "cp",
          "text": "Task 2 CP1: folder set up, rough cut started"
        }
      ],
      "notes": [
        {
          "text": "Labour Day Mon 1 Mar. Tue 2 Mar runs a Monday timetable. OLNA continues.",
          "soft": true
        }
      ],
      "lessons": [
        "application-skills-u3-1",
        "application-skills-u3-2",
        "application-skills-u3-3"
      ]
    },
    {
      "term": 1,
      "week": 7,
      "monday": "2027-03-08",
      "days": 5,
      "topic": "U3 Hardware",
      "body": "CPU; memory and storage; peripherals; computer systems; operating systems",
      "events": [
        {
          "kind": "cp",
          "text": "Task 2 CP2: rough cut complete"
        }
      ],
      "notes": [
        {
          "text": "OLNA concludes Fri 12 Mar.",
          "soft": true
        }
      ],
      "lessons": [
        "hardware-1",
        "hardware-2",
        "hardware-3"
      ]
    },
    {
      "term": 1,
      "week": 8,
      "monday": "2027-03-15",
      "days": 5,
      "topic": "U3 Hardware",
      "body": "Software compatibility; hardware purchase; minimum requirements; maintenance; solving simple problems",
      "events": [
        {
          "kind": "test",
          "text": "Task 3: Short Answer Test (Unit 3) 10%"
        },
        {
          "kind": "cp",
          "text": "Task 2 CP3: fine cut"
        }
      ],
      "notes": [
        {
          "text": "Heavy week by choice: test and Task 2 CP3 together. Sea Kayak Camp does not affect your classes. Universities Tour Wed 17 Mar, 8:35 to 9:20.",
          "soft": true
        }
      ],
      "lessons": [
        "hardware-4",
        "hardware-5"
      ]
    },
    {
      "term": 1,
      "week": 9,
      "monday": "2027-03-22",
      "days": 4,
      "topic": "U3 Application skills",
      "body": "Software management (installation, updates); software licences",
      "events": [
        {
          "kind": "due",
          "text": "Task 2 due: Production (Video) 15%"
        }
      ],
      "notes": [
        {
          "text": "Easter Liturgy Thu 25 Mar. Good Friday Fri 26 Mar.",
          "soft": true
        }
      ],
      "lessons": [
        "application-skills-u3-4",
        "application-skills-u3-5"
      ]
    },
    {
      "term": 1,
      "week": 10,
      "monday": "2027-03-29",
      "days": 3,
      "topic": "Buffer week",
      "body": "No new content and no assessment. Catch-up and project support.",
      "events": [],
      "notes": [
        {
          "text": "Easter Monday and Tuesday are holidays. Wed 31 Mar runs a Monday timetable. Athletics Carnival Fri 2 Apr. Use this and Week 11 for anything that slips from Term 1.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 1,
      "week": 11,
      "monday": "2027-04-05",
      "days": 5,
      "topic": "Not in the outline",
      "body": "The calendar has an 11th week before the break. Not in the outline, so it is spare room for Term 1 overflow.",
      "events": [],
      "notes": [],
      "lessons": []
    },
    {
      "term": 2,
      "week": 1,
      "monday": "2027-04-26",
      "days": 4,
      "topic": "U3 Application skills",
      "body": "Spreadsheet composition, layout and design; sort and filter data (practical)",
      "events": [],
      "notes": [
        {
          "text": "Anzac Day Mon 26 Apr. Thu 29 Apr runs a Monday timetable.",
          "soft": true
        }
      ],
      "lessons": [
        "application-skills-u3-6",
        "application-skills-u3-7"
      ]
    },
    {
      "term": 2,
      "week": 2,
      "monday": "2027-05-03",
      "days": 5,
      "topic": "U3 Design concepts",
      "body": "Identify elements and principles in existing products; modify products; detailed annotations for design briefs",
      "events": [],
      "notes": [],
      "lessons": [
        "design-concepts-6",
        "design-concepts-7"
      ]
    },
    {
      "term": 2,
      "week": 3,
      "monday": "2027-05-10",
      "days": 5,
      "topic": "EST preparation (teacher-led)",
      "body": "Unit 3 review against the Authority's EST content; timed stimulus-based practice",
      "events": [],
      "notes": [
        {
          "text": "Inter-House Cross Country Thu 13 May.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 2,
      "week": 4,
      "monday": "2027-05-17",
      "days": 4,
      "topic": "EST preparation (teacher-led)",
      "body": "Unit 3 review; command words; annotated design practice",
      "events": [
        {
          "kind": "test",
          "text": "Task 4: Extended Answer Test (Unit 3) 5%"
        }
      ],
      "notes": [
        {
          "text": "Staff PD Day Fri 21 May.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 2,
      "week": 5,
      "monday": "2027-05-24",
      "days": 0,
      "topic": "No Year 12 students (exams)",
      "body": "Year 12 exams run from Mon 24 May. The outline's EST prep for this week (Task 4 feedback, targeted practice) needs a new slot.",
      "events": [],
      "notes": [
        {
          "text": "General students are not at school during exams.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 2,
      "week": 6,
      "monday": "2027-05-31",
      "days": 1,
      "topic": "Externally set task",
      "body": "Unit 3 content nominated by the Authority",
      "events": [
        {
          "kind": "info",
          "text": "Task 5: Externally Set Task 15%, date TBC"
        }
      ],
      "notes": [
        {
          "text": "Date not set. SCSA picks it inside a Term 2 window, so keep this week loose. Exams finish Tue 1 Jun and the Retreat is Thu and Fri 3 to 4 Jun, which leaves only Wed 2 Jun.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 2,
      "week": 7,
      "monday": "2027-06-07",
      "days": 4,
      "topic": "U4 Project management",
      "body": "Plan of action; time management; resource requirements",
      "events": [
        {
          "kind": "cp",
          "text": "Task 6 CP1: plan of action, booking, shared folder"
        }
      ],
      "notes": [
        {
          "text": "Western Australia Day Mon 7 Jun.",
          "soft": true
        }
      ],
      "lessons": [
        "project-management-u4-1",
        "project-management-u4-2",
        "project-management-u4-3"
      ]
    },
    {
      "term": 2,
      "week": 8,
      "monday": "2027-06-14",
      "days": 5,
      "topic": "U4 Application skills",
      "body": "Online collaboration; web authoring; navigation map",
      "events": [
        {
          "kind": "cp",
          "text": "Task 6 CP2: notes, audience, criteria"
        }
      ],
      "notes": [],
      "lessons": [
        "application-skills-u4-1",
        "application-skills-u4-2",
        "application-skills-u4-3"
      ]
    },
    {
      "term": 2,
      "week": 9,
      "monday": "2027-06-21",
      "days": 5,
      "topic": "U4 Application skills",
      "body": "Responsive design; animation software",
      "events": [
        {
          "kind": "cp",
          "text": "Task 6 CP3: navigation map, thumbnails, wireframes"
        }
      ],
      "notes": [],
      "lessons": [
        "application-skills-u4-4",
        "application-skills-u4-5"
      ]
    },
    {
      "term": 2,
      "week": 10,
      "monday": "2027-06-28",
      "days": 4,
      "topic": "Catch-up only",
      "body": "Country Week. Nothing is planned. Use it for any students who are there.",
      "events": [],
      "notes": [
        {
          "text": "Staff PD Mon 28 Jun, then Country Week to Fri 2 Jul.",
          "soft": true
        }
      ],
      "lessons": []
    },
    {
      "term": 3,
      "week": 1,
      "monday": "2027-07-19",
      "days": 5,
      "topic": "U4 Managing data",
      "body": "File optimisation; compression (lossy, lossless); cropping and resampling",
      "events": [
        {
          "kind": "cp",
          "text": "Task 6 CP4: full draft"
        }
      ],
      "notes": [],
      "lessons": [
        "managing-data-1",
        "managing-data-2",
        "managing-data-3"
      ]
    },
    {
      "term": 3,
      "week": 2,
      "monday": "2027-07-26",
      "days": 5,
      "topic": "U4 Managing data",
      "body": "Online data management; version control; cloud computing",
      "events": [
        {
          "kind": "due",
          "text": "Task 6 due: Design Book (Interactive PDF) 10%"
        }
      ],
      "notes": [
        {
          "text": "Interschool E-Sports Tournament Thu 29 Jul. No effect on classes. Task 6 can be due this week.",
          "soft": true
        }
      ],
      "lessons": [
        "managing-data-4",
        "managing-data-5",
        "managing-data-6"
      ]
    },
    {
      "term": 3,
      "week": 3,
      "monday": "2027-08-02",
      "days": 5,
      "topic": "U4 Managing data",
      "body": "System utility tools (clean-up, defrag, anti-virus, spam filter)",
      "events": [
        {
          "kind": "cp",
          "text": "Task 7 CP1: master page, swatches, images optimised"
        }
      ],
      "notes": [],
      "lessons": [
        "managing-data-7",
        "managing-data-8"
      ]
    },
    {
      "term": 3,
      "week": 4,
      "monday": "2027-08-09",
      "days": 5,
      "topic": "U4 Impacts of technology",
      "body": "Privacy Act 1988; identity theft; safe disposal of data",
      "events": [
        {
          "kind": "cp",
          "text": "Task 7 CP2: pages in progress, survey built"
        }
      ],
      "notes": [
        {
          "text": "Feast Day Fri 13 Aug.",
          "soft": true
        }
      ],
      "lessons": [
        "impacts-of-technology-u4-1",
        "impacts-of-technology-u4-2"
      ]
    },
    {
      "term": 3,
      "week": 5,
      "monday": "2027-08-16",
      "days": 5,
      "topic": "U4 Impacts; Project management",
      "body": "Digital divide; e-commerce; dependency on electronic communication; evaluation",
      "events": [
        {
          "kind": "cp",
          "text": "Task 7 CP3: user testing, client feedback"
        }
      ],
      "notes": [],
      "lessons": [
        "impacts-of-technology-u4-3",
        "impacts-of-technology-u4-4",
        "impacts-of-technology-u4-5",
        "project-management-u4-4"
      ]
    },
    {
      "term": 3,
      "week": 6,
      "monday": "2027-08-23",
      "days": 5,
      "topic": "U4 Networks",
      "body": "Networks: purpose, advantages and disadvantages; transmission media and rates",
      "events": [
        {
          "kind": "due",
          "text": "Task 7 due: Production (Interactive PDF) 15%"
        }
      ],
      "notes": [],
      "lessons": [
        "networks-1",
        "networks-2",
        "networks-3"
      ]
    },
    {
      "term": 3,
      "week": 7,
      "monday": "2027-08-30",
      "days": 5,
      "topic": "U4 Networks",
      "body": "Network components; LAN topologies",
      "events": [
        {
          "kind": "test",
          "text": "Task 8: Short Answer Test (Unit 4) 10%"
        }
      ],
      "notes": [],
      "lessons": [
        "networks-4",
        "networks-5"
      ]
    },
    {
      "term": 3,
      "week": 8,
      "monday": "2027-09-06",
      "days": 5,
      "topic": "U4 Networks",
      "body": "Design a home LAN; extended answer practice",
      "events": [],
      "notes": [],
      "lessons": [
        "networks-6"
      ]
    },
    {
      "term": 3,
      "week": 9,
      "monday": "2027-09-13",
      "days": 5,
      "topic": "Assessment",
      "body": "Units 3 and 4 revision",
      "events": [
        {
          "kind": "test",
          "text": "Task 9: Extended Answer Test (Units 3 and 4) 10%"
        }
      ],
      "notes": [],
      "lessons": []
    },
    {
      "term": 3,
      "week": 10,
      "monday": "2027-09-20",
      "days": 5,
      "topic": "Buffer week",
      "body": "No new content. Catch-up; results finalised.",
      "events": [],
      "notes": [
        {
          "text": "Year 12 last day Fri 24 Sep. ATAR students return 13 to 15 Oct, so General work must be finished before then. Term 4 has no General Year 12 class time.",
          "soft": true
        }
      ],
      "lessons": []
    }
  ]
};
