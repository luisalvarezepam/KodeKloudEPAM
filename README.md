
# KodeKloud License Report Dashboard

![Architecture Diagram](docs/architecture-diagram.png)

This project implements an automated solution to generate visual reports from Excel files containing KodeKloud license information.

## 📌 Main Functionality

- Reads `KodeKloudAdmin.xlsx` and `activity_leaderboard.xlsx` files from Azure Blob Storage.
- Processes them using Python and Pandas to merge, clean, and analyze the data.
- Generates a JSON file with the enriched data.
- Automatically deploys the portal to Azure Static Web Apps.

## ⚙️ Architecture

1. **Azure Blob Storage**: Stores the source Excel files.
2. **GitHub Actions**: Runs a pipeline that:
   - Downloads files from Blob Storage.
   - Runs the `generate_report.py` script to create the JSON.
   - Commits and pushes the new JSON to `public/data/kodekloud_data.json`.
   - Automatically deploys to Azure Static Web Apps.
3. **React Frontend (Vite)**: Displays the JSON data in a responsive and filterable dashboard.

## 📁 Repository Structure

```
KodeKloudEPAM/
├── backend/                     # Azure Function and Python script
│   └── generate_report.py
├── public/
│   └── data/
│       └── kodekloud_data.json  # Automatically generated file
├── src/                         # React frontend
│   └── KodeKloudDashboard.jsx
├── .github/workflows/
│   ├── generate-report.yml      # Generates and updates the JSON
│   └── azure-static-web-apps-*.yml # Deploys the site
├── README.md
└── docs/
    └── architecture-diagram.png
```

## 🚀 How the Pipeline Works

1. You can manually trigger it from the **Actions** tab.
2. The `generate-report.yml` workflow:
   - Installs Python dependencies.
   - Generates the JSON from the files in Azure Blob.
   - Commits and pushes the JSON to the repository.
3. The `azure-static-web-apps-*.yml` workflow:
   - Detects the change in `main`.
   - Builds the frontend and deploys it to Azure.

## 🖥️ Access

The portal is available at: [https://delightful-water-0ae8bed0f.6.azurestaticapps.net](https://delightful-water-0ae8bed0f.6.azurestaticapps.net)

## 🧾 Credits

Developed by Luis Alvarez – EPAM Systems.
