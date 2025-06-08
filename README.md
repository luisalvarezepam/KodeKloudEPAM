# KodeKloud License Dashboard

A modern and responsive dashboard built with **React** and **Tailwind CSS v3**, designed to monitor the usage of KodeKloud technology training licenses across different programs. It provides insights into active users, lessons completed, video hours watched, and more.

## 🌟 Features

- 📊 **Dynamic data dashboard** from uploaded JSON
- 📈 Summary Cards with usage metrics
- 🧠 Top 5 users per program by lessons completed (bar charts)
- ✅ Filters: all, active, inactive, and name search
- 📥 Export filtered view to Excel
- 🔁 Upload JSON data manually
- 🌗 Toggle between **Light Mode** and **Dark Mode**
- 📱 Fully responsive interface

## 🚀 Live Site

Hosted on **Azure Static Web Apps**:
👉 [https://delightful-water-0ae8bed0f.6.azurestaticapps.net](https://delightful-water-0ae8bed0f.6.azurestaticapps.net)

## 📦 Project Setup

```bash
# Clone the repository
https://github.com/luisalvarezepam/KodeKloudEPAM.git

# Navigate into the project
cd KodeKloudEPAM

# Install dependencies
npm install

# Start local development
npm run dev
```

## 📁 File Structure

- `src/KodeKloudDashboard.jsx` — Core UI & logic
- `public/data/kodekloud_data.json` — Main data source (can be updated weekly via script)

## 🧪 JSON File Format
The JSON file must contain:
```json
[
  {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Lessons Completed": 5,
    "Video Hours Watched": 4.5,
    "Labs Completed": 2,
    "Program": "XPORT1-MX",
    "License Accepted": "✓",
    "Status": "Active"
  },
  ...
]
```

## ⚙️ Automated Report Generation
Use the accompanying Python script to merge data from two Excel files (`KodeKloud2025Admin.xlsx` and `activity_leaderboard.xlsx`) and generate:
- `kodekloud_data.json`
- `kodekloud_report.xlsx`

```bash
python generate_report.py KodeKloud2025Admin.xlsx activity_leaderboard.xlsx
```

## 🔄 CI/CD with Azure
This project is deployed via Azure Static Web Apps and connected to GitHub:
- Every `push` to `main` branch triggers an automatic deployment.

## ✨ To Do (Next Steps)
- Add backend API to fetch protected JSON
- Add role-based access (Admin/User views)
- Notifications for inactive users

---

📬 For questions or feedback, contact: **Luis Alvarez** – luis_alvarez1@epam.com