# KodeKloud License Dashboard

This project is a **React + Vite** frontend built to display KodeKloud license usage across programs and users, with interactive filters, charts, and export features.

---

## ✨ Features

- Displays license usage for 40 seats
- Filters by active/inactive users
- Sorts by Name, Program, or Video Hours Watched
- Search by Name
- Upload new JSON reports manually
- Export filtered data to Excel
- Four charts: Top 5 users by lessons completed overall and per program
- Highlighting of users with no activity or no accepted license

---

## 🎓 Data Structure

The app expects a JSON file placed at:

```
public/data/kodekloud_data.json
```

Each user record must contain:

- `Name`
- `Email`
- `Lessons Completed`
- `Video Hours Watched`
- `Labs Completed`
- `Program`
- `License Accepted` ("✓" or "X")
- `Status` (e.g. "No activity or progress")

---

## ⚖️ Backend Script (Python)

Use the `generate_report.py` script to generate both the Excel report and the `kodekloud_data.json` file.

### Run it like:

```bash
python generate_report.py KodeKloud2025Admin.xlsx activity_leaderboard.xlsx
```

It will output:

- `kodekloud_report.xlsx`
- `kodekloud_data.json`

---

## 🚀 Deploy to Azure Static Web Apps

### 1. Choose Azure Static Web Apps

- Ideal for Vite/React sites
- Built-in GitHub Actions CI/CD

### 2. Steps:

1. Go to Azure Portal > **Static Web Apps** > Create
2. Link your GitHub repo: `luisalvarezepam/KodeKloudEPAM`
3. Choose Build Preset: **Vite**
4. App location: `/`, Output location: `dist`
5. Deploy

### 3. GitHub Actions Workflow

Place this YAML file in your repo at `.github/workflows/azure-static-webapps-deploy.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"
```

### 4. Make sure this is in `vite.config.js`

```js
export default defineConfig({
  base: './',
  plugins: [react()],
});
```

---

## 📁 Folder Structure

```
/public
  /data/kodekloud_data.json
  favicon.ico
/src
  App.jsx
  KodeKloudDashboard.jsx
  index.css
/vite.config.js
```

---

## 📅 Author

**Luis Alvarez**  
Email: `luis_alvarez1@epam.com`

---

## ❤️ License

MIT