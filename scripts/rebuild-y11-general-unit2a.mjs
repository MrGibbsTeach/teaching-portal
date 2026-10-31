// Upgrades Y11 AIT General Unit 2 "Working with Others": Managing Data and Networks, in place. Safe to re-run.
import fs from "node:fs";
import { S, F, B, V, seq, fileSizeLab, upgradeInPlace } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-11-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const unit = course.units.find((u) => u.id === "working-with-others");
const lessons = {};
for (const t of unit.topics) for (const l of t.lessons) lessons[`${t.id}/${l.id}`] = l;
const up = (key, vid, blocks) => { const l = lessons[key]; if (!l) throw new Error("missing " + key); upgradeInPlace(l, { video: vid, blocks }); };

// ---------- Managing Data ----------
up("managing-data/data-vs-information", V("From raw data to information", 4, "A short clip turning an unlabelled spreadsheet column into information by adding headers, units and context. Suggested source: a teacher-filmed screen recording.", ["What a number means without context", "How headers and units add meaning", "Primary against secondary data"]), [
  S("Data or information?", "Data is raw facts. Information is data with context.", ["Data", "Information"], [
    ["47", 0, "A raw number with no meaning."], ["Delivery 47 took 12.4 hours on 2025-07-01.", 1, "Context makes it meaningful."], ["0, 1, 1, 0, 1", 0, "Raw symbols."], ["A chart of weekly delays with a title and units.", 1, "Processed and organised."], ["12.4", 0, "A number with no units."]]),
  S("Quantitative or qualitative?", "Which type of data is each?", ["Quantitative (numbers)", "Qualitative (descriptive)"], [
    ["Delay in minutes.", 0, "A measurable number."], ["A driver's comment that the route felt unsafe.", 1, "Descriptive opinion."], ["Weight of a parcel in kg.", 0, "Numeric."], ["Customer feedback written in their own words.", 1, "Descriptive."]]),
  F("Check yourself", [["Define", "What is primary data?", "Data you collect yourself for your own purpose, for example a survey you run."], ["Define", "What is secondary data?", "Data collected by someone else, such as an ABS report."]])]);
up("managing-data/accuracy-and-reliability-of-sources", V("Is this source trustworthy?", 4, "A short clip applying the CRAAP test to three sources of freight statistics. Suggested source: a teacher-filmed example.", ["Which red flags to look for", "Why an author and sources matter", "How bias shows up"]), [
  S("Which CRAAP criterion?", "Tap the criterion each red flag breaks.", ["Currency", "Relevance", "Authority", "Accuracy", "Purpose"], [
    ["Statistics published three years ago.", 0, "Out of date."], ["The data does not answer your question.", 1, "Not relevant."], ["No author and no credentials listed.", 2, "No authority."], ["No sources are cited for the claims.", 3, "Cannot be checked for accuracy."], ["Written to sell a product.", 4, "The purpose may bias it."]]),
  F("Check yourself", [["Define", "What is bias?", "A tendency to present data in a way that favours one view."], ["Compare", "Reliability or validity?", "Reliability is consistent trustworthiness over time. Validity is whether it measures what it claims to measure."]])]);
up("managing-data/search-engines-and-boolean-operators", V("Searching with Boolean operators", 4, "A short clip building precise searches with AND, OR, NOT, quotation marks and site:. Suggested source: a teacher-filmed screen recording.", ["How AND narrows a search", "How quotation marks find an exact phrase", "How site: limits results"]), [
  S("Which operator?", "Tap the operator each search uses.", ["AND", "OR", "NOT or minus", "Quotation marks", "site:"], [
    ["rail AND freight", 0, "Both words must appear."], ["freight OR cargo", 1, "Either word can appear."], ["freight NOT air", 2, "Excludes results with air."], ["\"rail freight\"", 3, "The exact phrase."], ["site:gov.au freight delays", 4, "Only results from that domain."]]),
  F("Check yourself", [["Explain", "Why use Boolean operators?", "They return fewer, more relevant results, so you find useful information faster."]])]);
up("managing-data/common-file-formats", V("Choosing a file format", 4, "A short clip comparing CSV, JSON, PDF and DOCX files, and JPEG and PNG images. Suggested source: a teacher-filmed screen recording.", ["Which formats hold structured data", "Which compression loses quality", "Why a screenshot of a spreadsheet is not data"]), [
  S("Which format?", "Tap the best format for each purpose.", ["CSV", "JSON", "PDF", "DOCX"], [
    ["Rows and columns of delivery records for analysis.", 0, "Simple tabular data."], ["Structured data passed between apps and systems.", 1, "Machine-readable structure."], ["A final report that must look the same on every device.", 2, "Fixed layout."], ["A report the team still needs to edit.", 3, "Editable document."]]),
  fileSizeLab({ title: "File size lab: JPEG against PNG", width: 4000, height: 3000, useCase: "email attachment" }),
  F("Check yourself", [["Define", "What is lossy compression?", "Reduces file size by discarding some data, for example JPEG."], ["Define", "What is lossless compression?", "Reduces size without losing any data, for example PNG or ZIP."]])]);
up("managing-data/file-and-folder-organisation", V("Naming and storing files", 4, "A short clip building a file naming convention and a client folder structure. Suggested source: a teacher-filmed screen recording in File Explorer.", ["The parts of a good file name", "Where files should be stored", "Why 'final_v3_USE THIS ONE' is a problem"]), [
  S("Which part of the file name?", "SWL_Report_v03_20250620_DRAFT.docx: tap the element each part is.", ["Client or project code", "Document type", "Version number", "Date (YYYYMMDD)", "Status"], [
    ["SWL", 0, "Identifies the client."], ["Report", 1, "Says what kind of document."], ["v03", 2, "The version number."], ["20250620", 3, "The date, which sorts in order."], ["DRAFT", 4, "The status."]]),
  S("Which storage type?", "Tap the storage each risk belongs to.", ["Local (internal)", "External", "Cloud"], [
    ["Lost if the laptop fails or is stolen.", 0, "Only one copy."], ["Easy to lose or damage and must be carried.", 1, "Physical device."], ["Needs internet access and a trusted provider.", 2, "Depends on the connection and provider."]])]);
up("managing-data/version-control-for-data-files", V("Versions and rollback", 4, "A short clip versioning a live data file, recording changes and rolling back a bad edit. Suggested source: a teacher-filmed screen recording.", ["How version numbers show the size of a change", "What revision history records", "How a rollback works"]), [
  S("Overwrite or version control?", "Which is each action?", ["Overwrite (risky)", "Version control (safe)"], [
    ["Saving an untested edit over the approved v1.0 file.", 0, "The original is lost."], ["Saving as v1.1 with a change note.", 1, "The previous version is kept."], ["Reverting to v1.0 after an edit breaks the client's system.", 1, "A rollback."], ["Having no record of who changed the file.", 0, "No revision history."]]),
  F("Check yourself", [["Define", "What is a rollback?", "Reverting a file to a previous version, essential when a change introduces an error."], ["Define", "What is revision history?", "A log of all changes, including who made them and when."]])]);

// ---------- Networks ----------
up("networks/components-of-a-wireless-network", V("Planning wireless coverage", 4, "A short clip choosing access point positions for a concrete block building and comparing 2.4 GHz with 5 GHz. Suggested source: a teacher-filmed floor-plan walk-through.", ["Which device does what", "Why concrete walls weaken Wi-Fi", "When 2.4 GHz beats 5 GHz"]), [
  S("Modem, router or access point?", "Tap the device.", ["Modem", "Router", "Wireless access point"], [
    ["Connects the premises to the internet through the ISP.", 0, "Converts the ISP signal."], ["Directs traffic between the local network and the internet and assigns IP addresses.", 1, "The router."], ["Broadcasts a Wi-Fi signal.", 2, "The wireless access point."]]),
  S("2.4 GHz or 5 GHz?", "Which band does each describe?", ["2.4 GHz", "5 GHz"], [
    ["Longer range and better through walls.", 0, "Lower frequency travels further."], ["Faster speeds over a shorter range.", 1, "Higher frequency carries more data."], ["More crowded with other devices.", 0, "Many devices use 2.4 GHz."], ["Better for a video call close to the access point.", 1, "Faster."]]),
  S("Which type of network?", "Tap the network type.", ["PAN", "LAN", "WLAN", "MAN", "WAN"], [
    ["Bluetooth earbuds connected to your phone.", 0, "Around one person."], ["Wired computers in one office.", 1, "One building."], ["Wi-Fi covering a clubhouse.", 2, "A wireless LAN."], ["A network across a city.", 3, "Metropolitan area."], ["The internet.", 4, "A very wide area."]])]);
up("networks/selecting-hardware-for-a-network", V("Specifying network hardware", 4, "A short clip building a bill of materials for a medical centre network. Suggested source: a teacher-filmed example using real product pages.", ["Managed against unmanaged switches", "What PoE powers", "Which devices should be wired"]), [
  S("Wired or wireless?", "Tap the best connection for each device.", ["Wired Ethernet", "Wireless"], [
    ["Reception desktop PCs.", 0, "Reliable and fast."], ["The practice management server.", 0, "Needs a stable connection."], ["Shared printers.", 0, "Fixed devices."], ["Staff laptops.", 1, "They move around."], ["Patients' devices on guest Wi-Fi.", 1, "Mobile, separate from the main network."], ["IP cameras powered over the cable.", 0, "PoE gives power and data over one cable."]]),
  F("Check yourself", [["Compare", "Managed or unmanaged switch: which supports VLANs?", "A managed switch is configurable and supports VLANs, QoS and port monitoring. An unmanaged switch is plug-and-play."], ["Define", "What does PoE do?", "Delivers electrical power through Ethernet cables, for example to access points and cameras."]])]);
up("networks/network-security", V("Securing a network", 4, "A short clip showing a phishing email, a ransomware warning and how to secure a router. Suggested source: an Australian Cyber Security Centre education video or a teacher-filmed demo.", ["The warning signs of phishing", "What ransomware does", "Which router settings matter"]), [
  S("Which threat?", "Tap the threat each describes.", ["Phishing", "Ransomware", "Man-in-the-middle", "Denial of service", "Unauthorised access"], [
    ["A fake IT email that tricks someone into entering a password.", 0, "Social engineering."], ["Files encrypted with a demand for payment.", 1, "Ransomware."], ["An attacker secretly intercepting traffic.", 2, "Sits between two parties."], ["A flood of traffic that overwhelms a service.", 3, "DoS or DDoS."], ["Someone using a stolen login to get in.", 4, "No permission."]]),
  S("Good or poor practice?", "Which Wi-Fi settings are good practice?", ["Good practice", "Poor practice"], [
    ["Use WPA3 or WPA2 encryption.", 0, "Encrypts the traffic."], ["Keep the default router admin password.", 1, "Easy to guess."], ["Keep firmware updated.", 0, "Closes known holes."], ["Separate guest Wi-Fi on its own VLAN.", 0, "Keeps guests off the main network."], ["Leave WPS switched on.", 1, "It is a known weakness."]])]);
up("networks/connecting-and-troubleshooting-networks", V("Diagnosing a network", 4, "A short clip using ping, ipconfig and nslookup to diagnose three faults. Suggested source: a teacher-filmed demo on a school PC.", ["What a 169.254 address means", "Why a name fails but an IP works", "Which command to try first"]), [
  S("Which command?", "Tap the command for each job.", ["ping", "ipconfig", "tracert", "nslookup"], [
    ["Test whether another device can be reached.", 0, "Sends a test message."], ["Show this computer's IP address and settings.", 1, "Displays configuration."], ["Show the route and hops a packet takes.", 2, "Traces the path."], ["Look up the IP address for a domain name.", 3, "DNS lookup."]]),
  S("Likely cause?", "Tap the most likely cause.", ["No DHCP address", "DNS problem", "Router or ISP fault"], [
    ["A laptop has a 169.254.x.x address.", 0, "It could not get an address from DHCP."], ["A desktop cannot reach the file server by name but has internet.", 1, "Name resolution is failing."], ["Seven laptops see each other but not the internet.", 2, "The route out is down."]]),
  seq("Troubleshoot from the bottom up", "Tap the layers in the order you check them.", ["Physical: cables, power and link lights.", "Data link: the Wi-Fi or switch connection.", "Network (IP): address, gateway and ping.", "Transport: ports and connections.", "Application: the program or service itself."], "Start with the simplest, lowest layer and work up.")]);

fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log("done");
