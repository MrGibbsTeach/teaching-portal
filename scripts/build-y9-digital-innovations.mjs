// Builds lib/content/data/year-9-digital-innovations.json (the Year 9 Digital Innovations skeleton).
// Source of truth for the plan: claude/y9-digital-innovations.md. Run: node scripts/build-y9-digital-innovations.mjs
// This is a mock-up skeleton: titles, short summaries and placeholder video and task blocks only.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "content", "data", "year-9-digital-innovations.json");

const DRAFT = {
  type: "callout",
  heading: "Draft lesson",
  text: "This lesson is an outline for review. The video, tasks and check questions are still to be added.",
};

function lesson(id, title, summary, bullets, extra = []) {
  return {
    id,
    title,
    estimatedMinutes: 60,
    blocks: [
      { type: "paragraph", text: summary },
      { type: "list", style: "bullet", items: bullets },
      ...extra,
      DRAFT,
    ],
  };
}

// opts.youtubeId: chosen video (owner-supplied). opts.check: our own "check your work" note shown after the task.
const gdevelop = (id, title, chapter, summary, bullets, taskSteps, opts = {}) =>
  lesson(id, title, summary, bullets, [
    {
      type: "videoSlot",
      title: `GDevelop Essentials: ${chapter}`,
      ...(opts.youtubeId ? { youtubeId: opts.youtubeId } : {}),
      brief: `Embed the GDevelop Essentials course video for ${chapter}. Choose and vet the video, then paste its YouTube ID.`,
      videoSource: opts.youtubeId
        ? "GDevelop Essentials Course, editor.gdevelop.io, Learn tab. Video link supplied by the owner (6 Nov 2026)."
        : "GDevelop Essentials Course, editor.gdevelop.io, Learn tab. Chapter list is provisional until the owner confirms which chapters to use.",
      minutes: 10,
      watchFor: ["The names of the panels and tools used", "How the video completes the task you will repeat"],
    },
    ...(opts.downloadHtml ? [{ type: "richText", heading: "Get the project files", html: opts.downloadHtml }] : []),
    {
      type: "task",
      title: `Complete the ${chapter} template tasks`,
      software: "GDevelop",
      intro: opts.intro ?? "Open the chapter template from the course page, work through the tasks, then check your work against the answer.",
      steps: taskSteps,
    },
    ...(opts.check ? [{ type: "callout", heading: "Check your work", text: opts.check }] : []),
  ]);

const course = {
  slug: "year-9-digital-innovations",
  title: "Digital Innovations",
  units: [
    {
      id: "y9-gdevelop",
      title: "GDevelop Training",
      subtitle: "Get started making games",
      status: "available",
      topics: [
        {
          id: "y9-gd-meet",
          title: "Meet GDevelop",
          description: "a first look at the engine",
          lessons: [
            lesson(
              "y9_gd_1",
              "Welcome and set-up",
              "Get to know the course, see what past student games look like, and get GDevelop ready to use.",
              ["Find out how the semester works", "Sign in to GDevelop", "Open the editor for the first time"],
            ),
            gdevelop(
              "y9_gd_2",
              "Explore the engine",
              "Chapter 1",
              "Learn your way around the GDevelop editor: the scene, the properties panel, the instance list, layers and image smoothing. You will fix a small soul-collecting game that has a few problems.",
              ["Change an object using only the Properties panel", "Unlock and resize an object with the Instances list", "Add a UI layer so the health bar stays on screen", "Turn off image smoothing so pixel art looks sharp"],
              [
                "Manipulate an object with the Properties panel: using only the Properties panel, make the large Ghost match the size, angle and position of the transparent LockedGhost. Remember that the angle is 0 when the object faces right, and a smaller Y value moves an object up.",
                "Unlock an object with the Instance list panel: the Background is locked. Unlock it in the Instances list and resize it to fill the whole game window (the black outline). You can lock it again afterwards.",
                "Add a UI layer with the Layers panel: preview the game and move the Ghost down. Then create a new layer, move the ResourceBar onto it, and preview again to see the bar stay at the bottom of the screen. Layers higher in the list appear on top.",
                "Change smoothing settings in the Resources tab: preview the Ghost's idle animation and spot the blurry second frame. Turn off 'Smooth the image' for that resource. To fix it for the whole game, set the project's scale mode from Linear to Nearest in Game properties.",
              ],
              {
                youtubeId: "OsPTdjhqur8",
                downloadHtml: '<p><a href="/api/downloads/gdevelop-chapter-1"><strong>Download the Chapter 1 project (zip)</strong></a></p><ol><li>Save the zip, then right-click it and choose Extract All.</li><li>Open the GDevelop app on your computer.</li><li>Choose Open a project and pick <code>lesson_1_game.json</code> from the extracted folder.</li></ol><p>You do not need a GDevelop account. Keep the <code>assets</code> folder next to the project file.</p>',
                intro: "Watch the video, then open the project you just downloaded in GDevelop and do the four tasks. Use the check notes at the end to see if you got them right.",
                check: "1) The Ghost should end up at X 640, Y 385, width 88, height 60, angle 0, matching the transparent LockedGhost. 2) The Background should fill the black game-window outline. 3) After adding a layer called UI and moving the ResourceBar onto it, the bar stays on screen when the Ghost moves. 4) With 'Smooth the image' off (and scale mode Nearest in Game properties), the idle frames look sharp. Linear smoothing suits high-resolution art; Nearest suits pixel art.",
              },
            ),
            gdevelop(
              "y9_gd_3",
              "Build a scene",
              "Chapter 2",
              "Create objects, place them in a scene and set up a simple level.",
              ["Create and edit objects", "Place and arrange instances", "Build a basic scene"],
              ["Add objects to the scene", "Arrange them to build a level", "Run a preview of your scene"],
            ),
          ],
        },
        {
          id: "y9-gd-react",
          title: "Make it move and react",
          description: "behaviors and game logic",
          lessons: [
            gdevelop(
              "y9_gd_4",
              "Use behaviors",
              "Chapter 3",
              "Give objects abilities such as movement using behaviors.",
              ["Add a behavior to an object", "Change its settings", "Test how it moves in a preview"],
              ["Add a behavior to an object", "Adjust its settings", "Preview the result"],
            ),
            gdevelop(
              "y9_gd_5",
              "Game logic with events",
              "Chapter 4",
              "Make things happen in your game using events: conditions and actions.",
              ["Read an event as 'when this happens, do that'", "Build a simple event", "Fix an event that does not work"],
              ["Create an event with a condition and an action", "Test it in a preview", "Fix the template's broken event"],
            ),
            lesson(
              "y9_gd_6",
              "Taster challenge: change a template",
              "Show what you have learned by changing a ready-made game so it plays differently.",
              ["Choose three changes to make", "Make them in GDevelop", "Explain what you changed and why"],
            ),
          ],
        },
      ],
    },
    {
      id: "y9-game-project",
      title: "Video Game Project",
      subtitle: "Learn a top-down RPG, then make your own game for the STEM Video Game Challenge",
      status: "available",
      topics: [
        {
          id: "y9-rpg",
          title: "Top-down RPG tutorial",
          description: "build one small, finished game",
          lessons: [
            lesson("y9_rpg_1", "Plan the slice and set up", "See the finished game you will build and set up your project.", ["Play the finished example", "Set up the project", "List the features you will build"]),
            lesson("y9_rpg_2", "Tilemap: build the world", "Build the map of your game from tiles.", ["Create a tilemap", "Paint a simple map", "Mark where the player can and cannot walk"]),
            lesson("y9_rpg_3", "Player movement", "Make the player move around the map from above.", ["Add top-down movement", "Set up the controls", "Test the speed"]),
            lesson("y9_rpg_4", "Walls and camera", "Stop the player walking through walls and make the camera follow.", ["Add collisions", "Follow the player with the camera", "Fix anything that sticks"]),
            lesson("y9_rpg_5", "Items and variables", "Collect items and keep track of them.", ["Add collectable items", "Count them with a variable", "Show the count on screen"]),
            lesson("y9_rpg_6", "Characters and dialogue", "Add a character the player can talk to.", ["Add a non-player character", "Show a message when the player is near", "Make the dialogue change"]),
            lesson("y9_rpg_7", "Hazards and health", "Add something dangerous and a health bar.", ["Add a hazard", "Track health with a variable", "Handle running out of health"]),
            lesson("y9_rpg_8", "Win, lose and polish", "Finish the game with a goal, ending screens, sound and a cleaner look.", ["Add a win condition", "Add win and lose scenes", "Add sound and tidy the screen"]),
          ],
        },
        {
          id: "y9-vgc-plan",
          title: "Plan your game",
          description: "STEM Video Game Challenge: planning",
          lessons: [
            lesson("y9_vgc_1", "The challenge and how it is marked", "Meet the Australian STEM Video Game Challenge and the rubric your project is marked against.", ["Read the challenge theme", "Read the Game Design Document sections", "Form your team (up to four)"]),
            lesson("y9_vgc_2", "Theme and brainstorm", "Come up with game ideas that link to this year's theme.", ["Explore the theme", "Brainstorm ideas as a team", "Pick one idea and say why"]),
            lesson("y9_vgc_3", "Team plan and timeline", "Decide who does what, in what order, and by when.", ["Choose team roles", "Build a timeline", "Write the Planning section of your Game Design Document"]),
          ],
        },
        {
          id: "y9-vgc-design",
          title: "Design your game",
          description: "STEM Video Game Challenge: designing",
          lessons: [
            lesson("y9_vgc_4", "Game overview and storyboard", "Describe your game, its characters and its world.", ["Name your game and explain the title", "Describe characters and environments", "Draw a storyboard"]),
            lesson("y9_vgc_5", "Gameplay and mechanics", "Decide the goal, the controls and the point of view.", ["State the goal of the game", "List the controls", "Plan how the game gets harder"]),
            lesson("y9_vgc_6", "Visual design", "Plan the look of your game and make your own art.", ["Choose a visual style", "Link it to the theme", "Start your original art"]),
            lesson("y9_vgc_7", "Audio design", "Plan the sound of your game and make your own audio.", ["Choose a sound style", "Link it to the theme", "Start your original audio"]),
          ],
        },
        {
          id: "y9-vgc-build",
          title: "Build your game",
          description: "STEM Video Game Challenge: prototyping (runs over several lessons)",
          lessons: [
            lesson("y9_vgc_8", "Prototype sprint", "Build the first playable version of your game. This repeats over several lessons.", ["Build the core mechanic first", "Test it as you go", "Record what you built in your work plan"]),
            lesson("y9_vgc_9", "Original art and audio sprint", "Replace placeholder art and sound with your own.", ["Create original characters and backgrounds", "Create original sound effects and music", "Put them in the game"]),
            lesson("y9_vgc_10", "Prototype checkpoint", "Show your playable prototype and the Design section of your Game Design Document.", ["Demonstrate your prototype", "Hand in the Design section", "Plan what is left"]),
          ],
        },
        {
          id: "y9-vgc-test",
          title: "Test and finish",
          description: "STEM Video Game Challenge: reflecting",
          lessons: [
            lesson("y9_vgc_11", "Alpha testing", "Test your own game against the judging criteria and fix what you find.", ["Test against the criteria", "List the bugs", "Fix the most important ones"]),
            lesson("y9_vgc_12", "Beta testing", "Have another team play your game and give feedback.", ["Test another team's game", "Collect feedback on yours", "Decide what to change"]),
            lesson("y9_vgc_13", "Finish: Game Design Document and screen recording", "Complete your document and record your gameplay.", ["Finish every section of the Game Design Document", "Record a short gameplay video", "Check the submission requirements"]),
          ],
        },
        {
          id: "y9-assessment",
          title: "Assessment and showcase",
          description: "how the project is marked, and sharing your game",
          lessons: [
            {
              id: "y9_asm_1",
              title: "How your project is marked",
              estimatedMinutes: 20,
              blocks: [
                { type: "paragraph", text: "You make one game with your team. It is marked in stages, so you get feedback along the way. The stages follow the Australian STEM Video Game Challenge rubrics." },
                {
                  type: "table",
                  headers: ["Stage", "When", "What is marked", "Weight"],
                  rows: [
                    ["1. Plan", "End of planning", "Game Design Document: Planning section and team plan", "15%"],
                    ["2. Design and prototype", "Prototype checkpoint", "Game Design Document: Designing section and a playable prototype", "25%"],
                    ["3. Final game", "End of build", "The game: functionality, gameplay, visual and audio, technical, engagement, theme", "30%"],
                    ["4. Test and reflect", "End of testing", "Game Design Document: Reflecting section, testing evidence, screen recording", "20%"],
                    ["5. VR reflection", "End of the VR rotation", "A short review, evaluation and demonstration", "10%"],
                  ],
                },
                { type: "callout", heading: "Draft weights", text: "These stages and weights are a draft for the teacher to confirm. Each team member's mark is adjusted for their individual contribution." },
              ],
            },
            lesson("y9_asm_2", "Showcase day and reflection", "Play each other's games, share your VR creations and reflect on the semester.", ["Play and rate games", "Share a VR creation", "Write a final reflection"]),
          ],
        },
      ],
    },
    {
      id: "y9-vr",
      title: "VR Interactive",
      subtitle: "Meta Quest 3S rotation: play, view, experience, create",
      status: "available",
      topics: [
        {
          id: "y9-vr-start",
          title: "Before you start",
          description: "safety and your VR passport",
          lessons: [
            lesson("y9_vr_1", "Safety, set-up and your VR passport", "Learn how to use the headset safely and how the rotation works. You will keep a passport of your turns.", ["Play space, comfort and time limits", "Your role as headset user and as spotter", "How the roster works"]),
          ],
        },
        {
          id: "y9-vr-stations",
          title: "Stations",
          description: "your four headset turns",
          lessons: [
            lesson("y9_vr_2", "Play", "Try free VR games and note your first impressions.", ["Play a free game for one turn", "Note comfort, controls and fun", "Rate it against the criteria"]),
            lesson("y9_vr_3", "View", "Explore immersive video and places.", ["Watch and explore for one turn", "Note what feels real and what does not", "Compare with the game you played"]),
            lesson("y9_vr_4", "Experience", "Try a free learning or exploration experience.", ["Use the experience for one turn", "Note what you learned", "Compare it with the games"]),
            lesson("y9_vr_5", "Create", "Make something simple using a free VR creation app (to be chosen and confirmed).", ["Watch the how-to card before your turn", "Make a simple object or scene", "Save a picture or recording to show later"]),
          ],
        },
        {
          id: "y9-vr-review",
          title: "Review and share",
          description: "review, demonstrate, evaluate",
          lessons: [
            lesson("y9_vr_6", "Write your review", "Write a structured review of two VR experiences.", ["Use the review criteria", "Compare two experiences", "Give evidence for your ratings"]),
            lesson("y9_vr_7", "Demonstrate", "Show a classmate what you made in VR and get feedback.", ["Show your creation", "Get feedback on a checklist", "Note what you would change"]),
            lesson("y9_vr_8", "Evaluate", "Reflect on what VR is good for and what it is not. This is the VR assessment.", ["Evaluate VR as a tool", "Use your passport as evidence", "Hand in your reflection"]),
          ],
        },
      ],
    },
  ],
};

writeFileSync(out, JSON.stringify(course, null, 2) + "\n");
const lessons = course.units.flatMap((u) => u.topics.flatMap((t) => t.lessons));
console.log(`Wrote ${out}: ${course.units.length} units, ${lessons.length} lessons`);
