# EnergyTech Level 3 Elementary (A2) Practice Portal

Created by: Badawy Rabie – EFL Instructor at EnergyTech, 2026

## What is included
- Colourful responsive landing page.
- Student Name / ID / Group fields.
- Units 1–14.
- 50 Grammar questions per unit, shuffled.
- 50 Vocabulary questions per unit, shuffled.
- 20 Reading questions per unit.
- Listening tasks in audio order using the uploaded script-question structure.
- Speaking in three parts: interview, long turn/card, extended questions.
- Writing tasks using the uploaded Level 3 writing specifications.
- Local progress report and teacher dashboard.
- Google Sheets connection from the beginning through Apps Script.

## How to use locally
Open `index.html` in a browser.

## How to host on GitHub Pages
Upload all files and folders to a GitHub repository, then enable GitHub Pages from repository settings.

## Google Sheets setup
1. Create a Google Sheet.
2. Open Extensions > Apps Script.
3. Paste the code from `google-sheets-apps-script.gs`.
4. Deploy as a Web App.
5. Copy the deployment URL.
6. Open `app.js` and paste it here:
   `const APPS_SCRIPT_URL = "YOUR_URL_HERE";`

## Important design decision
Listening questions are not shuffled because audio answers appear in order. Grammar and vocabulary questions are shuffled, and options are randomized.


READING FIX: All reading questions are now direct passage-content questions only. No reading-strategy, level, suitability, scanning, gist, or generic topic questions are included.
