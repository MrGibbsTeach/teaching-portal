# Weekly Project Review — 19 June 2026

---

## 1. MrGibbs Teach (`mrgibbs-teach`)

**What happened this past week**

This project was essentially built from scratch this week. The entire Next.js app was scaffolded and populated June 17–19: all 9 course pages, the lesson viewer, shared components (cards, badges, buttons, BlockRenderer, CourseOverview), content type definitions, and three transform scripts to migrate lesson content from archived projects. The transform-general and transform-atar scripts ran today (June 19), generating or updating the Year 11 General and ATAR JSON content files. The build ran successfully today as well.

**What's coming up**

The README identifies clear gaps: Years 7–10 and Year 12 content is currently placeholder-only (no prior content exists to migrate). Three items from the archived projects haven't been ported yet: the ATAR glossary (`src/data/glossary.js`), the Unit 1 practice exam page, and the General course's "coming soon" Unit 1 content. Auth, teacher portal, and progress-tracking are also explicitly deferred.

**Recommendations**

- The six placeholder courses (Years 7–10, Year 12) need content decisions: will you author them from scratch, generate them via the curriculum_mie pipeline, or defer? Clarifying this would unblock the biggest remaining gap.
- Port the ATAR glossary and practice exam from the archive — these are finite, known tasks with the source files already available.
- The site appears to have no deployment config yet (no Vercel/Netlify config, `.env.local.example` but no live `.env.local`). Setting up a preview deployment would make it easy to review on real devices.

---

## 2. Curriculum MIE (`curriculum_mie`)

**What happened this past week**

Highly active week. Thumbnails were generated for all 8 Year 7 AI & Data Literacy units (June 15–16). The TPT Playwright publisher (`publish_tpt.py`) and Gumroad hybrid publisher (`publish_gumroad.py`) were both built and tested (June 17). Unit 1 is live on TPT at $29.99. However, both publishing automations hit blockers: TPT's bot detection blocked automated login (account was temporarily locked and recovered), and Gumroad's 10-product/day creation limit was hit during testing, halting Gumroad publishing for the day.

**What's coming up**

Per `PROGRESS.md`, the immediate priority is testing the Gumroad hybrid approach (API create → navigate to edit URL → Playwright uploads files and thumbnail). Once that passes, run `--all` to publish all 8 units. For TPT, the plan is semi-manual: script fills the form, you log in and submit. TES is not yet started. The webapp (FastAPI + Next.js studio UI) is in progress but not the immediate focus.

**Recommendations**

- Start the session with the Gumroad test run as documented: `python publish_gumroad.py --unit year7_ai_data_unit1`. The PROGRESS.md has exact debugging steps if the "Computer files" button isn't found.
- Units 3–8 are batch-generated but not individually reviewed for quality — worth spot-checking at least one before mass-publishing.
- The untracked work (publishing scripts, webapp, PROGRESS.md, `.env.example`) should be committed — noted in PROGRESS.md but not yet done.
- Revenue is $0 across all platforms. Getting Units 2–8 live on TPT and Gumroad is the only thing that changes that.

---

## 3. Gibbs Dashboard (`Gibbs Dashboard`)

**What happened this past week**

The most active project this week. Session 3 completed a major visual refresh of `dashboard.html` (new palette, fonts, toast notifications, tab animations) and added a Bills tab and Purchases register. The `scan_folders.py` script was built and ran on June 18, walking the folder structure and producing `scan_report.txt`. A wave of documents was added to the folder: Clayton's June 2026 payslip, Spintel internet bill, Belong phone bill, QBE car insurance docs (new), AAMI home insurance documents, life insurance certificates, and a full set of Clayton's super statements from BT/Mercer.

**What's coming up**

Per `UPDATES.md`, the next coding priorities are: setting up the folder scanner as a weekly scheduled Cowork task, Growatt solar integration (`sync_growatt.py`), verifying the Properties tab with live Buxfer data, and mobile layout testing. On the data side, Clayton still needs to manually enter home/life/health/travel insurance policies, loan details (interest rates, repayments, IO end dates), property purchase prices and dates, and confirm Sam's super balance. The Coles Mastercard Buxfer connection is awaiting a support response.

**Recommendations**

- The super statements for Clayton were added this week — the scan script should be run to extract the balance from those PDFs and populate the Assets sheet. This is a direct, high-value use of the scanner that's ready to go now.
- Setting up the weekly Sunday auto-scan as a Cowork scheduled task is high leverage: once configured it runs without any manual effort.
- The data entry backlog (insurance policies, loan details, property purchase prices) is the biggest gap between what the dashboard can show and what it currently shows. A 30-minute manual data entry session would dramatically improve dashboard usefulness.

---

## ⭐ Top Priority This Week

**curriculum_mie**: Run the Gumroad test publish for Unit 1 and, if it passes, publish all 8 units — it's the only action that generates revenue from work that's already done.
