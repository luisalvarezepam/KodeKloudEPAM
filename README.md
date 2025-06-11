
# 📊 KodeKloudEPAM Dashboard

Este proyecto despliega un portal interactivo para visualizar el uso de licencias de KodeKloud en equipos internos de EPAM México. La solución está diseñada para ser moderna, segura y fácilmente desplegable usando infraestructura en la nube de Microsoft Azure.

---

## 🧭 Arquitectura General

![Arquitectura](https://strepamkkeast2.blob.core.windows.net/kodekloud-inputs/ChatGPT%20Image%20Jun%2011%2C%202025%2C%2004_08_36%20PM.png?sp=r&st=2025-06-11T22:10:33Z&se=2026-02-28T06:10:33Z&sv=2024-11-04&sr=b&sig=1jtzROWE6z%2FHD5hNJKwOs%2BCAkwF2JJQGC1qqUupORGk%3D)

---

## 📦 Tecnologías utilizadas

- **Frontend**: React + Vite (contenedor Docker)
- **Backend**: Azure Functions en Python (procesamiento de archivos Excel)
- **Autenticación**: Microsoft Entra ID (Azure AD corporativo)
- **Almacenamiento**: Azure Blob Storage (JSON y archivos XLSX)
- **Hosting**: Azure Web App for Containers
- **Contenedores**: Azure Container Registry (ACR)
- **CI/CD**: GitHub Actions

---

## 🚀 Despliegue

### 1. Construcción y publicación del contenedor (React)

```bash
az acr build --registry epamkodekloudacr --image kodekloud-frontend:latest ./frontend
```

### 2. CI/CD con GitHub Actions

Archivo: `.github/workflows/deploy.yml`

- Construye imagen del frontend con `az acr build`
- Publica a ACR
- Despliega a Azure App Service
- Despliega Azure Function con código Python (`backend/`)

---

## 🔐 Autenticación

- Se usa **Microsoft Entra ID corporativo** con App Service Authentication.
- Solo usuarios del tenant `epam.onmicrosoft.com` pueden acceder.
- Los datos del usuario autenticado se obtienen desde `/.auth/me`.
- El botón “Cerrar sesión” redirige a Entra ID usando `post_logout_redirect_uri`.

---

## 🗂 Estructura del Proyecto

```
/
├── .github/workflows/      # CI/CD con GitHub Actions
├── backend/                # Azure Function para procesar archivos
├── frontend/               # Aplicación React + Vite
│   ├── App.jsx
│   ├── KodeKloudDashboard.jsx
│   └── ...
├── Dockerfile              # Contenedor para frontend
└── README.md               # Este archivo
```

---

## 📈 Funcionalidades

- Dashboard interactivo con:
  - Filtros por estado de licencia (activo/inactivo)
  - Búsqueda por nombre
  - Descarga de reporte Excel
  - Estadísticas visuales y gráficas
  - Visualización del usuario autenticado y botón de logout
- Modo oscuro/claro

---

## 🔧 Variables de entorno

Configura lo siguiente en el portal de Azure:

| Variable               | Descripción                                    |
|------------------------|------------------------------------------------|
| `AZURE_CLIENT_ID`      | Client ID de la App Registration               |
| `AZURE_CLIENT_SECRET`  | Secreto generado en Azure AD                   |
| `BLOB_STORAGE_URI`     | URI pública al JSON procesado                 |
| `FUNCTION_URI`         | (Opcional) URI para re-generar datos          |

---

## 🧪 Endpoints internos

- `/.auth/me` – Devuelve los datos del usuario autenticado.
- Azure Function (`backend/`) lee archivos XLSX desde Blob Storage y genera un JSON en el mismo contenedor.

---

## 🧑‍💻 Autor

Luis Alvarez – [luis_alvarez1@epam.com](mailto:luis_alvarez1@epam.com)

---

## 📄 Licencia

Distribución interna EPAM. No redistribuir sin autorización.


## Updated Architecture

![Architecture Diagram](https://strepamkkeast2.blob.core.windows.net/kodekloud-inputs/ChatGPT%20Image%20Jun%2011%2C%202025%2C%2004_17_31%20PM.png?sp=r&st=2025-06-11T22:41:07Z&se=2026-02-28T06:41:07Z&sv=2024-11-04&sr=b&sig=Idl%2FtiH7JbFDdjsfE9gl7QqkuyUywckHvll9vK20JZw%3D)
