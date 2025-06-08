KodeKloud License Dashboard

This project is a React + Vite frontend built to display KodeKloud license usage across programs and users, with interactive filters, charts, and export features.

✨ Features

Displays license usage for 40 seats

Filters by active/inactive users

Sorts by Name, Program, or Video Hours Watched

Search by Name

Upload new JSON reports manually

Export filtered data to Excel

Four charts: Top 5 users by lessons completed overall and per program

Highlighting of users with no activity or no accepted license

🎓 Data Structure

The app expects a JSON file placed at:

public/data/kodekloud_data.json

Each user record must contain:

Name

Email

Lessons Completed

Video Hours Watched

Labs Completed

Program

License Accepted ("✓" or "X")

Status (e.g. "No activity or progress")

⚖️ Backend Script (Python)

Use the generate_report.py script to generate both the Excel report and the kodekloud_data.json file.

Run it like:

python generate_report.py KodeKloud2025Admin.xlsx activity_leaderboard.xlsx

It will output:

kodekloud_report.xlsx

kodekloud_data.json

🚀 Deploy to Azure Static Web Apps

1. Choose Azure Static Web Apps

Ideal for Vite/React sites

Built-in GitHub Actions CI/CD

2. Steps:

Go to Azure Portal > Static Web Apps > Create

Link your GitHub repo: luisalvarezepam/KodeKloudEPAM

Choose Build Preset: Vite

App location: /, Output location: dist

Deploy

3. Make sure this is in vite.config.js

export default defineConfig({
  base: './',
  plugins: [react()],
});

📁 Folder Structure

/public
  /data/kodekloud_data.json
  favicon.ico
/src
  App.jsx
  KodeKloudDashboard.jsx
  index.css
/vite.config.js

📅 Author

Luis AlvarezEmail: luis_alvarez1@epam.com

❤️ License

MIT

