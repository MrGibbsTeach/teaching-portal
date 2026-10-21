# 3D Animation Register

Running list of Three.js animations for Mr Gibbs Teach: what is built, what is planned, and exactly where each one goes in a lesson. Update this whenever we build one.

Course names and topics below are my best mapping from what I know of your classes. Check them against your scope and sequence before locking lesson slots.

## Lesson slots

- **Hook:** first 2 minutes, no talking. Students predict what is happening.
- **Explain:** pause at each stage, ask the check question, then resume.
- **Check:** pause before a stage and ask students to predict what comes next.
- **Revise:** loop it on screen while students retrieve what they remember.
- **Stimulus:** use the scene as the scenario for a short-answer or assessment question.

Because Mr Gibbs Teach is student-led, every animation needs its check questions written into the lesson page, not only said by a teacher.

## Interactive style standard (locked 19 Oct 2026, revised 20 Oct 2026)

Decided after building and reviewing five styles of 3D-01: an interactive computer teardown (Toybox Teardown) became the template for every animation going forward, replacing the older passive-loop look of 3D-00 to 3D-04. Reference build: https://claude.ai/artifact/QNWxQEfQajwNh5Fq7PiZpK.

**Every animation must be interactive, not a passive loop.** Required, in some form:
- **Tap to select:** tapping a part dims everything else, highlights it, and opens an info card (what it is, its category, what it connects to, what happens without it, "jump to" links to related parts where relevant).
- **A "Name it" style quiz:** a short self-test built into the scene (random target highlighted, multiple-choice buttons, confetti on a correct answer), not a separate page. Keep the quiz pool to the parts worth naming - drop anything the student would find trivial or beside the point (e.g. Packet Journey's quiz excludes the two laptops; it only asks about the switch, router, internet, packets and reply).
- **A Flyover / guided-tour button:** one button that runs the scene hands-off - camera sweeps to an establishing shot, performs whatever the scene's version of "exploded"/"activated"/"worked example" is, then visits each interactive element in turn with a close framed shot and its label/info surfaced, then returns. Stoppable mid-run by clicking again or dragging. This is the "narrated" option for Hook and Revise use, sitting alongside the hands-on tap/explore mode for Explain and Check. Keep every framing loose enough that nothing reads as "too close" or clipped, pace holds long enough to actually read, and give any payoff moment (a reply arriving, a result appearing) its own deliberate beat rather than snapping straight to it.
- **Assembled vs exploded (or an equivalent before/after/worked-example state) only where the content calls for it** - not a fixed requirement for every animation; judge per scene. A journey/sequence scene (like Packet Journey) can use its own natural progress bar instead of assembled/exploded, with the Flyover scripted to ride that same progress bar stage by stage. A concept made of discrete worked examples (like Binary Lights' Bit/Byte/Number/Letter/Pixel) can use preset buttons instead - each one sets the scene to a worked example, but the student can still freely interact afterwards (e.g. flip any switch) rather than the preset locking the scene.
- Drag-to-orbit camera, a labels on/off toggle, and (where relevant) a couple of fixed viewpoint buttons (e.g. face-on/angled) round out the controls.
- Where a part of the real thing is genuinely interactive (a switch that flips, a dial that turns), let the student actually operate it rather than only select it - the info card and the hands-on manipulation are not a substitute for each other, use both.
- **Cap how many individual floating name-pills show at once - a cluster of more than roughly 10-12 small, visually similar, closely spaced parts (e.g. 24 switches across three channels) must not each get a persistent on-screen label pill, even though each is still fully identifiable by tapping it.** The automatic collision-avoidance label layout cascades into an unreadable pile well before the raycasting/info-card/quiz system (which has no such limit) becomes a problem. Fix: give the cluster one or a few group-level labels instead (e.g. one label per console/row rather than one per switch), and keep full identification on tap. Check every build's default labels-on establishing shot specifically for this before calling it done, not just the close-up per-stage shots - a layout that reads fine per-stage can still cascade into a pile once every part's label is on screen at once in the default view.
- **Two genuinely different ideas do not share one scene well, even in separate zones.** First try: Binary Lights' single-byte lesson and an RGB-mixing lesson were built as two zones of one scene, each with its own back panel and camera framing. The user's reaction: "turned into a huge mess... animation isn't right." The zones fixed the worst of the clutter but the deeper problem was structural - two different concepts fighting for one default camera, one label budget and one mental frame read as cluttered even once each zone was individually clean. The fix was to split them into two separate animations, each free to use its own camera, layout and even its own visual idiom. **Default to a new animation, not a new zone, whenever a planned addition is a genuinely different idea rather than a deeper dive into the same one** (Binary Lights' Bit/Byte/Number/Letter/Pixel progression is one idea at increasing depth, so those stay one scene; "now show RGB channels mixing on a screen" is a different idea, so it became Colour Mixing, 3D-06). A shared scene still works well for stages of one sequence (Packet Journey's six stages, Binary Lights' five presets) - the distinction is depth-within-one-idea versus a second idea bolted on.
- **When the content genuinely differs from the rest of the set, break the established visual language on purpose rather than forcing a visual match.** Colour Mixing does not look like a row of switches on a panel (Binary Lights' template) - it is three light consoles around a stage whose coloured light pools physically overlap and blend on the floor, because that is what actually demonstrates additive colour mixing. The required interactive elements (tap-to-select, Name It, Flyover, orbit, labels, live switches) still apply; the visual metaphor does not have to.
- **When a scene uses true-physics colours (e.g. showing what red light plus green light actually looks like mixed), use real saturated RGB primaries for the thing being physically mixed (lamps, light pools, glowing parts), not the softened/branded tones used elsewhere in the set.** A muted "brand red" and "brand green" do not visually add up to yellow, which defeats a colour-mixing demonstration. Keep the softened palette for everything that is just UI chrome (card backgrounds, buttons); keep legible lighter tints for on-screen text drawn over dark canvases, separate from the saturated colour used for the actual light/glow.

**Build process that worked (and a real bug worth flagging):**
1. Build with a shared `core.js` helper file (buildParts/orbit/project/shuffle/hexCss patterns) inlined into a single-file HTML artifact. Chamfered-box (`rbox`), material (`M`) and mesh-add (`BX`/`CY`/`A`) helpers are copied into each scene file rather than shared yet - worth promoting into `core.js` once a few more scenes confirm the same shape is wanted everywhere.
2. **The `reg(id, g, la)` helper used in the first few builds always does `scene.add(g)` - fine for a flat scene, but a silent bug the moment a part is meant to live inside a positioned/rotated parent group** (e.g. Colour Mixing's three consoles, each its own rotated root). Calling `root.add(part)` and then `reg(id, part, la)` re-parents `part` straight onto the scene, discarding the root's position and rotation - every part snaps back to its raw local coordinates near the origin, and parts from different parents land on top of each other. This single bug produced "everything stacked in the middle of the stage" on the first build of Colour Mixing and looked exactly like the earlier label-clutter problem, so don't assume clutter is always a labelling issue - check actual world positions (`object.getWorldPosition()`) when parts that should be spread out all land near the same spot. Fixed by giving `reg` an optional `parent` argument (`reg(id, g, la, parent)`, defaulting to `scene`) that is the single place the object gets added, and never calling `.add()` on it anywhere else.
3. Verify with `node --check` on the extracted script, then a Node smoke test (stub DOM/WebGL, run a few frames) before ever showing it - catches syntax and runtime errors cheaply.
4. **Visually QA with a real headless browser (Playwright) before calling it done** - screenshot the default labels-on establishing shot specifically (see the label-pill cap and reg/parent notes above - both of this round's real bugs showed up there first), every stage/preset, the info card on a representative part, the quiz, and (for anything with camera automation like Flyover) several mid-run frames, ideally picked by polling actual scene state rather than guessing wall-clock timestamps (headless rendering in this environment throttles requestAnimationFrame unpredictably, so a fixed-timestamp screenshot can land on the wrong moment even when the logic is correct - poll `o.r`/`o.th`/the selected id/the progress value until the state you want is actually true, then shoot). Bugs this process has caught so far: camera clipping through geometry, wrong zoom distances, a laptop lid hinge that rotated into the floor, a default camera framed too tight to see the whole scene, a flat white emissive wash desaturating a canvas-texture screen's true colour (fixed by using `emissiveMap` instead of a flat `emissive` colour on top of a `map`, with the base `color` set to black so the unlit layer doesn't fight the glow), a device body colour blending into the backdrop, a cluster of many small parts each keeping its own floating label and cascading into an unreadable stack, and the `reg`/parent bug above.
5. Expect at least one review-and-fix round after the user actually uses it, not just after the first screenshots - framing that looks fine in a still can still feel "too close" or "too fast" in motion, and only playing with the finished interactive reveals that. Be ready for that round to call for a structural rebuild, not just a tweak, if the underlying idea was the problem rather than the execution - don't over-invest in polishing a layout the user has already called "a mess" twice.
6. For a scene that spans a wide area (like a device-to-device journey, a row of switches, or several objects arranged around a stage), check the default establishing camera actually frames the whole thing with some margin - a radius tuned tight enough to just barely fit will crop as soon as something moves. Compute the needed distance from the scene's real half-width and the camera's horizontal FOV (not just vertical) rather than guessing. For objects spread out in both x and z (not just side by side), a narrow near-horizontal default camera angle will make near and far objects visually overlap through perspective compression even when they are well separated in 3D - an elevated, more top-down default angle (lower `ph`) reads much more clearly for that kind of layout (see Colour Mixing's three-consoles-around-a-stage default view).

## Built

Style reference: Toybox Teardown, an interactive rebuild of 3D-01 in the new standard style above, is live at https://claude.ai/artifact/QNWxQEfQajwNh5Fq7PiZpK with tap-to-select, a Name It quiz, assembled/exploded, and a Flyover tour. Packet Journey (3D-02) and Binary Lights (3D-03) have also now been rebuilt in this style - see their rows below. Colour Mixing (3D-06) is a new build, not a rebuild of an existing animation. None of the four is yet swapped in as the portal's live link for its slot - decide once more of the set is rebuilt.

| ID | Animation | Courses | Where it goes | Link |
|---|---|---|---|---|
| 3D-00 | The Computer Canteen (analogy: input, memory, storage, processing, output) | Y7 DT | Optional first pass before the real parts. Hook, then Explain. | https://claude.ai/artifact/ERvXX7S76qNjzreLZAjV7h |
| 3D-01 | Inside the Computer (real parts: keyboard, mouse, SSD, HDD, RAM, CPU, GPU, monitor, speakers) | Y7 DT, Y8 DT, AIT Y11 (computer systems), AIT General, AIT Foundations | See placement below. | https://claude.ai/artifact/UajGsUqDtZPV7xH2ioN5o4 (portal link - interactive rebuild at https://claude.ai/artifact/QNWxQEfQajwNh5Fq7PiZpK not yet swapped in) |
| 3D-02 | Packet Journey (Alex's laptop, switch, modem/router, internet mesh, numbered packets 1-4 crossing out of order, Sam's laptop reassembling them in order, acknowledgement reply) | Y7 DT, Y8 DT, AIT Y11 and Y12 (networks), AIT General | See placement below. | https://claude.ai/artifact/KLF5hbxi7qgeTpxxcWNsDi (portal link - interactive rebuild at https://claude.ai/artifact/RJ3AqXMtcAFQa8hZ31hRNt not yet swapped in) |
| 3D-03 | Binary Lights (8 switches with place values 128 to 1 and their own bulbs, a live decimal/binary readout, a keyboard that shows the matching ASCII letter, a monitor that shows that letter or a solid pixel colour) | Y7 DT (data representation), Y8 DT revisit, AIT Foundations | See placement below. | https://claude.ai/artifact/99L1NutWhYprt6h6aho768 (portal link - interactive rebuild at https://claude.ai/artifact/MKfTqh9DLjiZfAzscx8r5a not yet swapped in) |
| 3D-04 | Fetch, Decode, Execute (inside the CPU: Control Unit, ALU, PC, CIR, ACC, MAR, MDR, clock; RAM; address, data and control buses; runs LOAD 4, ADD 5, STORE 6) | AIT Y11 and Y12 (General and ATAR) | In the course, see below. | https://claude.ai/artifact/P4PS21NnsarZUAkodiYQuc |
| 3D-06 | Colour Mixing (three light consoles - Red, Green, Blue - arranged around a stage, each its own byte of 8 switches with a live decimal/binary readout and a glowing lamp; their coloured light pools physically overlap on the stage floor using real additive blending, and a centre readout shows the live decimal RGB triple, hex code and colour swatch) | Y7 DT, Y8 DT (pixels and colour, follows on from Binary Lights) | See placement below. | https://claude.ai/artifact/6u9BbVjeefpRu9wSCYdR4k |

### 3D-01 placement and check questions

- **Y7 DT, digital systems, lesson 1:** Hook (run once, no sound), then Explain with a pause at each stage.
- **Y8 DT, revisit:** Revise. Loop it and have students label the parts from memory.
- **AIT Y11, computer systems:** Explain, then Stimulus (explain why a file opens faster from an SSD than an HDD).
- **AIT General and Foundations:** Explain at the start of the hardware unit. Revise before the unit test.

Check questions, one per stage:

1. Input: name two input devices not shown here.
2. Storage: why does the SSD packet arrive before the HDD packet?
3. Memory: what happens to the data in RAM when the power goes off?
4. Processing: what is the CPU doing with the packets going to and from RAM?
5. Output: which part turns the result into a picture, and which part makes the sound?

### 3D-02 placement and check questions

- **Y7 DT, networks, lesson 1:** Hook. Pause on Split and ask why a message would be cut into pieces. Then Explain through all six stages.
- **Y8 DT, networks revisit:** Check. Pause at the end of Router and ask students to predict whether the packets will arrive in order.
- **AIT Y11 and Y12, network hardware and protocols:** Explain. Students name each device and its job (switch inside a network, router between networks). Stimulus: "Explain how a message still arrives correctly if its packets take different routes."
- **AIT General:** Explain at the start of the networks unit. Revise by playing it muted while students write the six stages in order.

Check questions, one per stage:

1. Split: what three things does every packet carry?
2. Switch: what is the difference between the job of a switch and the job of a router?
3. Router: what does the router read on each packet to decide where it goes?
4. Internet: why do packets 1 to 4 arrive in the order 3, 1, 4, 2?
5. Reassemble: how does Sam's laptop know the right order?
6. Reply: what happens if one packet never arrives?

AIT extension notes: the packet header stands in for IP addressing, and the numbering and reply show what TCP does. Pair it with a traceroute activity.

In the rebuilt interactive version, these six stages are a single progress control (Sent to Delivered) rather than separate buttons: students can scrub it by hand for Explain/Check, or press Flyover for a scripted run through all six with the camera settling on each device, ending with a slow, deliberate beat on the acknowledgement actually arriving back (not snapped past). Tapping Alex's laptop, the switch, the modem/router, the internet mesh, Sam's laptop, or any individual packet opens the same info-card detail used for the check questions above. The quiz draws only on the switch, modem/router, internet and the packets/reply - not the two laptops, which are not worth a "name it" question.

### 3D-03 placement and check questions

- **Y7 DT, data representation, lesson 1:** Hook. Play the Bit and Byte stages only, then pause and ask what the switches are doing. Explain through all five stages.
- **Y7 DT, lesson 2 (converting binary):** Check. Pause on Byte at random counts and have students call out the decimal value before the readout shows it. Pause Number before the third switch flips and ask for the total.
- **Y7 DT, text and images lesson:** Explain using Letter and Pixel. Follow with an ASCII decoding task, then move straight into Colour Mixing (3D-06) for the RGB side of pixels.
- **Y8 DT revisit and AIT Foundations:** Revise. Play it muted while students write the binary for 13, 65 and 26.

Check questions, one per stage:

1. Bit: what two values can one bit have?
2. Byte: how many bits are in a byte, and what is the biggest value one byte can hold?
3. Number: which switches would be on to show 6?
4. Letter: the code for B is 66. What is 66 in binary?
5. Pixel: how many bytes does one pixel need, and what colour is 255, 0, 0?

In the rebuilt interactive version, each of the five stages is a preset button that sets the 8 switches to a worked example (Bit flips just the 1s switch on and off; Byte sets all 8 on for 255; Number sets 6; Letter sets 66 and shows "B" on the keyboard and monitor; Pixel sets 255 again and switches the monitor to a solid colour swatch), but every switch stays live afterwards so students can flip any of the 8 themselves and watch the readout, the keyboard's letter and the monitor all update immediately - this is what makes check question 3 ("which switches would be on to show 6") directly testable rather than just askable. The quiz covers the 8 switches, the readout, the keyboard and the monitor.

### 3D-06 placement and check questions

- **Y7 DT, text and images lesson, straight after Binary Lights' Pixel stage:** Explain. Each console is the same byte idea as Binary Lights, just one per colour channel - start on the Red console alone, then Green, then Blue, pointing out the stage lights up and its decimal number climbs exactly like Binary Lights' readout. Then press the Yellow and White stage buttons and ask students to predict the colour before it appears.
- **Y7/Y8 DT, colour mixing follow-up:** Check. Give students a target colour (e.g. "make the stage orange-ish") and have them flip switches on the Red and Green consoles to get close, reading the swatch and hex code as feedback.
- **Y8 DT revisit:** Revise. Play Flyover muted and have students call out which console is lit at each point, then what colour the final white finale shows and why.

Check questions, one per part:

1. Red/Green/Blue console: what three numbers, each 0 to 255, does a computer need to store to describe any colour on screen?
2. Readout: if the Red readout shows 255 and Green and Blue both show 0, what colour is that?
3. Mixing stage: why does the overlap between the Red and Green pools look yellow, not red-and-green-striped?
4. Mixing stage (extension): why is mixing coloured light different from mixing paint - why does mixing all three paints go dark but mixing all three lights goes white?
5. Colour readout: what is the hex code for Red 255, Green 255, Blue 255, and for Red 0, Green 0, Blue 0?

The quiz pool covers all 24 individual switches (by console and place value, e.g. "Green 32s switch"), the three channel readouts, the mixing stage and the colour readout. With labels on, the 24 switches share one label per console ("Red console"/"Green console"/"Blue console") rather than 24 individual pills - tapping any individual switch still shows its full name, place value and current state in the info card. Flyover visits each console in turn (lighting only that one, so its effect on the stage is isolated and legible) then pulls back to an overhead shot and runs Red, Green, Red+Green (yellow) and all three (white) as a finale before returning to the start.

## In the course (Mr Gibbs Teach portal)

The first three went live on 19 Oct 2026. Fetch, Decode, Execute is on preview branch `add-fde-animation` until approved. Colour Mixing (3D-06) is built but not yet placed in the portal. Each lesson shows the animation in a frame, a lead-in tied to the lesson, and "Pause and check" questions with answers behind a reveal, pitched to the course tier.

| Course | Lesson | Animation | Where in the lesson |
|---|---|---|---|
| Y11 Foundations | Computer Types and Hardware Devices | Inside the Computer | After the storage card, before the "Inside Your Computer" video |
| Y11 General | CPU and Memory | Inside the Computer | After the client brief and video, before "The CPU" |
| Y11 General | Components of a Wireless Network | Packet Journey | After "What Is a Network?", before "The Core Network Components" |
| Y11 General | Common File Formats | Binary Lights | After the intro, before the key terms |
| Y11 ATAR | Computer Systems & the CPU | Inside the Computer | After the Input, Process, Store, Output callout |
| Y11 ATAR | Network Hardware | Packet Journey | After the intro, before the hardware devices grid |
| Y11 ATAR | Image Editing | Binary Lights | After raster vs vector, before raster formats |
| Y12 General | CPU and Memory | Inside the Computer | Before the worked example |
| Y12 General | Networking Concepts | Packet Journey | Before the worked example |
| Y12 General | Graphic and Audio File Formats | Binary Lights | Before the worked example |
| Y12 ATAR | Components of a Computer | Inside the Computer | After the intro video, before components and specifications |
| Y12 ATAR | TCP/IP | Packet Journey | After the intro video, before "Roles of TCP and IP" |
| Y11 ATAR | Computer Systems & the CPU | Fetch, Decode, Execute | In the CPU section, before the "How a CPU Works" video |
| Y11 General | CPU and Memory | Fetch, Decode, Execute | After the paragraph on the cycle, before the CPU spec table |
| Y12 General | CPU and Memory | Fetch, Decode, Execute | Before the "I grade the CPU question on function" test tip |
| Y12 ATAR | Components of a Computer | Fetch, Decode, Execute | After the key terms, before the marking callout |

Year 7 and 8 placements are on hold until those courses have content in the portal (they are still placeholders).

## Planned

Priority is reuse across courses, then fit with the Y7/8 and Y11/12 build.

| ID | Animation | Courses | Slot | Priority |
|---|---|---|---|---|
| 3D-05 | Memory and storage speed pyramid: cache, RAM, SSD, HDD | AIT Y11 and Y12 | Explain, Revise | Medium |
| 3D-07 | Sorting and searching as moving blocks (bubble sort, binary search) | Y7 DT, Y8 DT (algorithms) | Explain, Check | Medium - a candidate for a large count of small similar parts, so apply the label-pill cap from the style standard early rather than discovering it late |
| 3D-08 | Loops and selection: a robot on a grid following code | Y7 DT, Y8 DT (programming) | Hook, Check | Medium |
| 3D-09 | Relational tables joined by keys (links to your VLOOKUP and HLOOKUP lessons) | AIT Y11 and Y12 (databases) | Explain, Stimulus | Medium |
| 3D-10 | Web request: browser, DNS lookup, server, page returned (reuses the 3D-02 network scene and its switch/modem-router/internet parts) | AIT Y11 and Y12, Y8 DT | Explain | Medium |
| 3D-11 | Firewall and encryption: what a packet looks like with and without protection (reuses 3D-02's packet part) | AIT Y11 and Y12 (security) | Explain, Stimulus | Medium |
| 3D-12 | Backup strategies (3-2-1 rule) using the storage parts from 3D-01 | AIT Y11 and Y12, AIT General | Explain, Revise | Low |
| 3D-13 | Build the PC: drag the real parts into place | Y7 DT, AIT General, AIT Foundations | Check, Revise | Medium - largely covered by Toybox Teardown's tap-to-select and explode already; revisit scope once more of the set is rebuilt |
| 3D-14 | Game loop: input, update, draw, repeated 60 times a second | Y9 Game Making and E Sports | Hook, Explain | Low |
| 3D-15 | Ping and lag: packets between a player and a game server (reuses 3D-02) | Y9 Game Making and E Sports | Hook | Low |

## How to add to this register

When we build a new one, add its row under Built with the link, the course and topic, the lesson slot, and its check questions. Move it out of Planned.
