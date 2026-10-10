/**
 * Hands-on `task` blocks for Year 12 Applied IT General, keyed by lesson id.
 * Applied by scripts/add-y12-general-tasks.mjs.
 *
 * Y12 General had zero `task` blocks (STATUS.md's audit) despite the course
 * being designed for "practical/hands-on... student independence" (design
 * direction, STATUS.md). Mirrors where Y11 General concentrates its 19 tasks —
 * Application Skills and Project Management, the topics with a genuine
 * single-piece-of-software deliverable — plus Managing Data, since Y12's
 * version of that topic (file optimisation, compression, cropping/resampling,
 * maintenance utilities) is itself hands-on in a way Y11's wasn't. Hardware,
 * Networks and Impacts of Technology stay task-free, matching Y11's own
 * pattern of 0 tasks in those topics (they're assessed by explanation, not by
 * producing a file).
 */
export const LESSON_TASKS = {
  "design-concepts-7-modifying-and-annotating-designs": {
    type: "task",
    title: "Modify and Annotate a Flyer",
    software: "Canva (or any image editor)",
    intro:
      "Use the community event flyer from this lesson (or any flyer you can find online) as your starting point. You're producing two things: the modified version, and a set of detailed annotations a client could follow without seeing your working.",
    steps: [
      "Open the original flyer in Canva and duplicate it before making any changes, so you can show a before/after.",
      "Identify two weaknesses using the command words from this lesson — e.g. 'the heading does not use emphasis' or 'alignment is inconsistent between the date and the venue'.",
      "Make at least three modifications that address those weaknesses — for example, increasing the heading's size and weight for emphasis, aligning all text blocks to a single left margin, or adding negative space around the call-to-action.",
      "Export the modified flyer as a PNG.",
      "In a new document, write one detailed annotation per modification using the formula from this lesson: what you changed, which element or principle it uses, and why it serves the brief.",
      "Place your before and after flyers side by side with your annotations underneath each change, pointing to exactly where on the flyer it applies.",
      "Save your annotation document as firstname-lastname-flyer-annotations.",
    ],
  },

  "application-skills-u3-1-data-organisation": {
    type: "task",
    title: "Build a Real Folder Structure",
    software: "File Explorer or Finder (or your school's cloud drive)",
    intro:
      "Build an actual folder structure for the wedding videographer's agency from this lesson — not a diagram of one, a real set of folders you can navigate.",
    steps: [
      "In your course folder, create a top-level folder named Agency-Files.",
      "Inside it, create one subfolder per client using a consistent naming convention, e.g. 2026-06-ClientSurname (date then surname, so folders sort chronologically).",
      "Inside each client folder, create subfolders for the stages of the job: 01-RawFootage, 02-Edits, 03-FinalDelivery.",
      "Create at least 10 dummy files (empty text files are fine) spread across two client folders, named using a consistent file naming convention you decide on — state the convention in one sentence at the top of your folder.",
      "Rename at least three badly-named files (e.g. IMG_0001.mp4) to follow your convention.",
      "Take a screenshot of the full folder tree, expanded, so the structure is visible.",
      "Write two sentences explaining how this structure and naming convention would help a new editor joining the agency find the right file quickly.",
    ],
  },
  "application-skills-u3-2-graphic-and-audio-file-formats": {
    type: "task",
    title: "Export One Logo, Three Formats",
    software: "Canva, Photoshop or GIMP",
    intro:
      "Using the food truck logo scenario from this lesson, export the same source image in the formats that actually suit each use case, then compare the results.",
    steps: [
      "Create or find a simple logo design (text plus one shape is enough).",
      "Export it as an SVG (or .ai/.eps if your software doesn't support SVG) — this is your scalable master.",
      "Export the same logo as a PNG at 1000px wide, and again at 32px wide (favicon size).",
      "Open both PNG exports and compare how the small one looks — note any blurring or loss of detail.",
      "Resize the SVG (or vector file) to 32px in your software instead, and compare its sharpness to the small PNG.",
      "Record a 15–30 second voice note (any audio app) and export it as both a WAV and an MP3. Compare the file sizes.",
      "Write a short comparison: which format held up better at small size, and which audio format you'd upload to a podcast platform and why.",
    ],
  },
  "application-skills-u3-3-audio-software-features": {
    type: "task",
    title: "Clean Up a Voiceover Recording",
    software: "Audacity (free) or any audio editor",
    intro:
      "Record a rough 30–60 second voiceover with a deliberate flaw — background noise, uneven volume, or an awkward pause — then fix it using real editing features, not just a re-record.",
    steps: [
      "Open Audacity and record yourself reading a short paragraph aloud, including at least one long pause and one moment where your voice gets quieter.",
      "Use the Noise Reduction effect to remove any background hum or hiss.",
      "Use the Normalize or Amplify effect so the volume is consistent throughout.",
      "Select and delete the awkward pause using the Trim/cut tools, then listen back to check the cut is clean.",
      "Add a simple fade-in at the start and fade-out at the end.",
      "Export the finished file as an MP3 (File > Export > Export as MP3) — not the raw project file — so it's actually ready to send.",
      "Write one sentence naming which two editing features made the biggest improvement.",
    ],
  },
  "application-skills-u3-6-spreadsheet-design": {
    type: "task",
    title: "Build the Sports Club Membership Sheet",
    software: "Microsoft Excel or Google Sheets",
    intro:
      "Build a working version of the membership sheet from this lesson, fixing the exact problem described — inconsistent number formats breaking the totals.",
    steps: [
      "Create a new sheet with a heading row: Member Name, Age, Membership Type, Price, Join Date.",
      "Enter 10 rows of sample members. Deliberately enter at least two prices as text (e.g. with a leading space or as '$45' typed into a general-formatted cell) so you can see the problem.",
      "In a new column, write a SUM formula over the Price column and confirm it gives the wrong total (or an error) because of the inconsistent entries.",
      "Fix every cell in the Price column to use the same Currency number format, re-entering any that were stored as text.",
      "Confirm the SUM formula now gives the correct total.",
      "Apply a heading row style (bold, fill colour) and freeze the top row (View > Freeze > 1 row) so it stays visible when scrolling.",
      "Add Conditional Formatting that highlights any membership priced above $50.",
      "Save the file as lastname-membership-sheet.",
    ],
  },

  "application-skills-u4-1-online-collaboration": {
    type: "task",
    title: "Set Up a Real Shared Planning Doc",
    software: "Google Docs or Microsoft 365",
    intro:
      "Set up the kind of shared document the three Year 12 formal planners from this lesson would actually need — then test it with a classmate, not just by yourself.",
    steps: [
      "Create a new document titled Formal Planning — [your name].",
      "Add three headed sections: Budget, Run Sheet, Vendor Contacts.",
      "Share it with a classmate with Editor permission (not just Viewer).",
      "Have your classmate add a comment on one section and make one direct edit elsewhere in the document at the same time as you're editing it.",
      "Check the document's version history (File > Version history) and confirm both sets of changes are visible with timestamps.",
      "Resolve the comment your classmate left.",
      "Write two sentences: one real advantage this showed you, and one real disadvantage (e.g. conflicting edits, needing to agree on structure first).",
    ],
  },
  "application-skills-u4-2-web-authoring-features": {
    type: "task",
    title: "Build a Three-Page Site With a Shared Stylesheet",
    software: "Any text editor (e.g. VS Code) and a browser",
    intro:
      "Build the exact fix the club website in this lesson needed — a shared .css file — so one colour change updates every page at once.",
    steps: [
      "Create three files: index.html, about.html and contact.html, each with a heading and a short paragraph.",
      "Add a navigation menu to each page with internal hyperlinks between all three pages — test that every link works.",
      "Add one external hyperlink (to a real website) and one email hyperlink (mailto:) somewhere on the site.",
      "Create a single styles.css file and link all three HTML pages to it using <link rel=\"stylesheet\">.",
      "In styles.css, set a background colour and a heading colour.",
      "Change the colour values once, in styles.css only, and reload all three pages to confirm every page updated from one edit.",
      "Write one sentence explaining how long this would have taken if each page had its own separate <style> block instead.",
    ],
  },
  "application-skills-u4-4-responsive-design": {
    type: "task",
    title: "Make a Page Actually Responsive",
    software: "Any text editor and a browser",
    intro:
      "Take a simple page and deliberately break it on a small screen first, then fix it with real responsive techniques — not by guessing, by testing.",
    steps: [
      "Build a simple HTML page with a header, a navigation menu with 5 links, and a 3-column layout of content using fixed pixel widths (e.g. three divs each width: 400px).",
      "Open your browser's device toolbar (F12 then the device icon, or Ctrl+Shift+M) and switch to a phone-width view.",
      "Note what breaks — likely horizontal scrolling and overlapping columns.",
      "Fix the columns using a fluid, percentage-based or flexbox/grid layout instead of fixed pixel widths.",
      "Add a CSS media query breakpoint that stacks the columns vertically below 600px width.",
      "Replace the 5-link navigation menu with a hamburger menu (a simple toggle button that shows/hides the links) that appears only below the same breakpoint.",
      "Re-test at phone width and confirm there's no horizontal scrolling and the menu toggles correctly.",
    ],
  },
  "application-skills-u4-5-animation-software-features": {
    type: "task",
    title: "Animate a Bouncing Ball With Tweens",
    software: "Any animation tool with keyframes (e.g. Canva, Adobe Animate, or CSS animation in a browser)",
    intro:
      "Build the exact animation from this lesson's worked example — a ball that bounces — using real keyframes and tweening, not a pre-made GIF.",
    steps: [
      "Create a canvas or frame roughly 400×400px with a simple circle as your ball.",
      "Set a keyframe with the ball at the top of the frame.",
      "Set a second keyframe a short time later with the ball at the bottom of the frame.",
      "Apply a tween between the two keyframes and preview it — confirm the software is calculating the frames in between, not that you drew them.",
      "Add a third keyframe that squashes the ball slightly wider and shorter at the moment it hits the bottom, for a more realistic bounce.",
      "Add a simple button (even just a shape) elsewhere in the frame with at least two states — e.g. a different fill colour for 'up' and 'over'.",
      "Export the animation as a GIF or short video.",
      "Write one sentence identifying the start keyframe and end keyframe your tween used.",
    ],
  },

  "project-management-u3-1-project-management-considerations": {
    type: "task",
    title: "Write a One-Page Plan for the Nippers Reel",
    software: "Any word processor",
    intro:
      "Produce a genuinely usable one-page project plan for the Bunbury Surf Club Nippers sign-up reel from this lesson — the kind you'd actually hand to a client.",
    steps: [
      "Create a one-page document titled Nippers Sign-Up Reel — Project Plan.",
      "Add a table with four rows, one per consideration: Time, Cost, Quality, Scope.",
      "For each consideration, write one specific line for this exact project (e.g. a real deadline date, an estimated budget figure, a quality standard, a scope boundary — what's included and what isn't).",
      "Add a short paragraph: the manager has now asked for a 10-second ad added. State which consideration gets squeezed and by how much (e.g. '2 extra days needed, or quality drops on the original three scenes').",
      "Add one row at the bottom naming the final deliverable and its format (e.g. '60-second MP4, 1080×1920 for Instagram Reels').",
      "Save the file as nippers-reel-plan.",
    ],
  },
  "project-management-u3-3-representing-the-design": {
    type: "task",
    title: "Storyboard the Animated Safety Message",
    software: "Any drawing tool, or pen and paper photographed/scanned",
    intro:
      "Produce real thumbnails and a storyboard for the animated safety message from this lesson, with proper annotations — the planning artefact a client actually reviews before production starts.",
    steps: [
      "Sketch six quick thumbnails (simple boxes with rough shapes, no detail) showing the sequence of the safety message from start to finish.",
      "Choose your strongest three thumbnails and redraw them as full storyboard frames with more detail.",
      "Under each of the three frames, add two annotations: one about timing (how many seconds this frame lasts) and one about the transition into the next frame (cut, fade, wipe).",
      "Add a short written note explaining what changed between your six rough thumbnails and your final three frames, and why.",
      "Photograph or export your storyboard as a single document.",
    ],
  },
  "project-management-u3-4-evaluating-digital-products": {
    type: "task",
    title: "Evaluate a Real Digital Product",
    software: "Any word processor",
    intro:
      "Evaluate an actual website or app you use regularly — like the school canteen ordering page from this lesson — against real criteria and real evidence, not opinion.",
    steps: [
      "Choose a real website or app you use at least weekly.",
      "Write three testable design criteria it should meet (e.g. 'loads in under 3 seconds on mobile data', 'checkout completes in 4 taps or fewer').",
      "Gather actual evidence for each criterion: a timed screen recording, a step count, or a short survey of two other users.",
      "For each criterion, state clearly whether the product met it, using your evidence, not a guess.",
      "Write a one-paragraph self-reflection on how the evidence-gathering changed your opinion of the product compared to your first impression.",
      "Recommend one specific, actionable change based on your evaluation.",
    ],
  },

  "project-management-u4-1-plan-of-action": {
    type: "task",
    title: "Build the Band's Website Plan of Action",
    software: "Microsoft Excel, Google Sheets, or a word processor table",
    intro:
      "Turn the band website brief from this lesson into an actual plan of action with every required part in every row.",
    steps: [
      "Create a table with four columns: Task, Time Estimate, Responsible Person, Dependency.",
      "List at least eight tasks needed to build a simple band website, in a logical order (e.g. 'collect band photos' before 'build the gallery page').",
      "For every task, fill in a realistic time estimate and a responsible person (use fictional names if working alone).",
      "For every task, name its dependency — which earlier task must finish first — or write 'none' if it has no dependency.",
      "Highlight the longest chain of dependent tasks (the critical path) in one colour.",
      "Add one milestone row marking 'Website live' at the end, with its own target date.",
      "Save the file as band-website-plan-of-action.",
    ],
  },
  "project-management-u4-2-time-management-strategies": {
    type: "task",
    title: "Build a Gantt Chart to Rescue a Late Project",
    software: "Microsoft Excel, Google Sheets, or a dedicated Gantt tool",
    intro:
      "Build an actual Gantt chart for the late project from this lesson, with real buffer time included — not just a task list.",
    steps: [
      "List at least six tasks for a simple project of your choice (e.g. producing a short video) down the left column.",
      "Across the top, add column headers for each day or week of the project timeline.",
      "For each task, shade the cells spanning the days it will take, showing tasks that overlap and tasks that depend on earlier ones finishing first.",
      "Add at least one buffer block (a shaded cell explicitly labelled 'Buffer') before the final deadline.",
      "Mark today's date with a vertical line or highlighted column.",
      "Write two sentences: one naming a time management strategy you used building this (prioritising, milestones, time blocking) and one explaining what the buffer protects against.",
    ],
  },
  "project-management-u4-4-evaluation": {
    type: "task",
    title: "Evaluate the Community Garden Newsletter",
    software: "Any word processor, plus a survey tool (e.g. Google Forms) if available",
    intro:
      "Produce both a product evaluation and a process evaluation for the community garden newsletter from this lesson — two different questions, two different kinds of evidence.",
    steps: [
      "Find or create a simple one-page newsletter (any topic is fine if you don't have a real one).",
      "Write three product evaluation criteria (does the finished newsletter meet the brief — e.g. readable font size, all sections present, fits on one page).",
      "Write two process evaluation questions (did the way the team worked go smoothly — e.g. was the deadline met, did everyone contribute).",
      "Create a short 3-question survey (Google Forms or on paper) asking a reader to rate the newsletter against your product criteria.",
      "Collect at least two responses and summarise the feedback in one paragraph.",
      "Recommend one specific, actionable change for next time's newsletter based on the feedback.",
    ],
  },

  "managing-data-1-file-optimisation": {
    type: "task",
    title: "Optimise One Photo, Three Ways",
    software: "Any photo editor (Photoshop, GIMP, Photopea, or your phone's editor)",
    intro:
      "Take the real estate photo scenario from this lesson and actually produce the three optimised versions it needs.",
    steps: [
      "Find or take one photo at least 3000px wide.",
      "Export a print version: resize so the longest edge is sized for a printed A4 page at 300 ppi, and if your software supports it, convert to CMYK.",
      "Export a website version: resize to 1600px wide, save as JPEG, and check the file size is under 500KB.",
      "Export an email version: resize to 1200px wide and check it would fit within a typical 10MB email attachment limit alongside other files.",
      "Open all three exports and compare their file sizes in a table.",
      "Write one sentence explaining why the print version is allowed to be so much larger than the other two.",
    ],
  },
  "managing-data-2-compression": {
    type: "task",
    title: "Compare Lossy and Lossless Compression",
    software: "Any file archiver (7-Zip, WinZip, or your OS's built-in zip) and a photo editor",
    intro:
      "Compress the same content two different ways and see the actual size and quality trade-off, instead of just reading about it.",
    steps: [
      "Take a photo (JPEG) and a text document of similar visual complexity.",
      "Save the photo as a JPEG at two different quality settings (e.g. 90% and 40%) and compare the file sizes and visible quality loss — this is lossy compression.",
      "Zip the text document using your OS's built-in compression and compare the zipped size to the original — this is lossless; unzip it and confirm it's identical to the original, with nothing lost.",
      "Try zipping the already-compressed JPEG and note how little smaller it gets — lossy formats are already compressed, so there's little left to save.",
      "Write a one-paragraph justification: which type of compression you'd use for the two scenarios in this lesson's quiz, and why.",
    ],
  },
  "managing-data-3-cropping-and-resampling": {
    type: "task",
    title: "Crop and Resample a Website Photo",
    software: "Any photo editor",
    intro:
      "Apply cropping and resampling as two separate, distinct operations on the same photo, so the difference between them is obvious in your own result.",
    steps: [
      "Open a photo at least 3000px wide.",
      "Crop it to a 16:9 banner shape, removing unwanted parts of the frame — note the new pixel dimensions after cropping.",
      "Save this cropped version as Version-A.",
      "Starting again from the cropped version, resample it down to 1200px wide without cropping anything further — the framing stays the same, only the pixel count changes.",
      "Save this as Version-B and compare its file size to Version-A.",
      "Zoom in to 200% on both versions and compare sharpness.",
      "Write two sentences explaining, in your own result, what cropping changed versus what resampling changed.",
    ],
  },
  "managing-data-7-maintenance-utilities": {
    type: "task",
    title: "Run a Real Maintenance Check",
    software: "Your own computer's built-in utilities",
    intro:
      "Actually run the maintenance utilities from this lesson on a real computer and report genuine findings — not hypothetical ones.",
    steps: [
      "On Windows, open Disk Cleanup (search for it in the Start menu) or on Mac, open About This Mac > Storage > Manage. Record how much space it reports could be freed.",
      "Check your browser's cache size (in browser settings, under Privacy) and clear it, noting the space freed.",
      "Check your Downloads and Temp folders for old files you no longer need — note how many and their total size.",
      "Check whether your main drive is an SSD or a traditional HDD (Settings > System > Storage > Disk, or About This Mac). Record which it is.",
      "If it's an SSD, do not run defragmentation — instead explain in one sentence why it isn't needed. If it's an HDD, you may run defragmentation and note how long it takes.",
      "Write a short summary of what you found and freed, as if reporting back to the family from this lesson's scenario.",
    ],
  },
};
