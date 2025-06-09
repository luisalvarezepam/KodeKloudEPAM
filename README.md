
# KodeKloud License Dashboard

This project provides an automated reporting and visualization tool for monitoring KodeKloud license usage within EPAM. It is composed of a Python backend for data transformation and an interactive React-based frontend deployed via Azure Static Web Apps.

---

## 🌐 Live URL

> **Dashboard:** [https://delightful-water-0ae8bed0f.6.azurestaticapps.net](https://delightful-water-0ae8bed0f.6.azurestaticapps.net)

---

## 🧠 Features

- 🔄 Azure Function to generate reports from XLSX files stored in Azure Blob Storage.
- 📊 React frontend with dark mode, charts, filters, search, and Excel export.
- ☁️ JSON report automatically uploaded and versioned in Azure Blob.
- 🔐 GitHub Actions CI/CD pipeline for automated deployment.

---

## 📁 Project Structure

```
KodeKloudEPAM/
├── backend/
│   ├── GenerateReport/
│   │   ├── __init__.py
│   │   ├── generate_report.py
│   │   ├── function.json
│   │   └── ...
│   ├── requirements.txt
│   └── local.settings.json
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── public/
│   ├── dist/
│   └── src/
│
├── .github/workflows/
│   └── azure-static-web-apps-delightful-water-0ae8bed0f.yml
│
├── README.md
└── NEXT_STEPS.md
```

---

## 🔧 Architecture Diagram

![Architecture](https://strepamkkeast2.blob.core.windows.net/kodekloud-inputs/ChatGPT%20Image%20Jun%209%2C%202025%2C%2004_07_45%20PM.png?sp=r&st=2025-06-09T22:12:36Z&se=2026-02-28T06:12:36Z&sv=2024-11-04&sr=b&sig=mkboJ5dHDhJvxFOWvyrpd1xPZ5p6xJ8iiC6jjYx%2FP2g%3D)

> **Diagram Highlights:**
> - Excel files stored in Azure Blob Storage (kodekloud-inputs container)
> - Azure Function `GenerateReport` processes and uploads JSON
> - Frontend app fetches JSON directly from Blob Storage with SAS Token
> - GitHub Actions automate build and deployment

---

## 🚀 Deployment Overview

### Azure Resources Used
- Azure Blob Storage: for input XLSX and output JSON files
- Azure Function App: for processing data and uploading JSON
- Azure Static Web App: for hosting the frontend

### GitHub Actions Flow
1. On `main` push or manual trigger
2. Python dependencies installed
3. Azure Function can optionally be triggered to generate the report
4. Frontend built with Vite and deployed to Azure Static Web Apps

---

## 🔐 Secrets Required
| Secret Name | Purpose |
|-------------|---------|
| `AZURE_STORAGE_CONNECTION_STRING` | Access to Azure Blob Storage |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_WATER_0AE8BED0F` | Deploy Static Web App |
| `GH_PAT` | Push updated JSON to repo |

---

## 📌 Next Steps (See `NEXT_STEPS.md`)
- 🔁 Schedule Azure Function via Logic App or Timer Trigger
- 📥 Add email notifications with summary report
- 🗃️ Add PostgreSQL for historical data tracking
- 📈 Enhance dashboard with user trends and time-based graphs

---

## 🧪 Local Development
```bash
# Backend (Azure Function)
cd backend
func start

# Frontend
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Author
Luis Alvarez (luis_alvarez1@epam.com)
