# Chrono

> Registra, planifica y visualiza actividades repetitivas.

Chrono es una aplicación **mobile-first** diseñada para hacer seguimiento de actividades recurrentes como mantenimientos, inspecciones y cambios periódicos. Almacena el historial de registros, predice la próxima ocurrencia y te alerta cuando un intervalo ha vencido, todo sin salir del navegador y sin enviar datos a ningún servidor externo.

---

## ✨ Características principales

- 📋 **Registro de actividades** – Crea actividades con intervalos basados en fechas.
- 📅 **Timeline** – Vista cronológica de todos los eventos registrados.
- 🌐 **Internacionalización** – Soporte para español e inglés (es-CO por defecto).

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com) |
| Formularios | react-hook-form + Zod |
| Almacenamiento | IndexedDB via [idb](https://github.com/jakearchibald/idb) |
| Autenticación | [NextAuth v5](https://authjs.dev) (Google OAuth) |
| i18n | [next-intl](https://next-intl-docs.vercel.app) |
| Linting | ESLint 9 + Prettier |
| Despliegue | [Vercel](https://vercel.com) |

---

## 🚀 Primeros pasos

### Prerequisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/SirCodr/chrono.git
cd chrono

# 2. Instala las dependencias
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`. Las siguientes variables son requeridas:

| Variable | Descripción |
|---|---|
| `AUTH_SECRET` | Clave secreta utilizada por NextAuth para firmar tokens de sesión. Genera una con `npx auth secret`. |
| `GOOGLE_CLIENT_ID` | Client ID de tu aplicación OAuth 2.0 en [Google Cloud Console](https://console.cloud.google.com). |
| `GOOGLE_CLIENT_SECRET` | Client Secret de tu aplicación OAuth 2.0 en [Google Cloud Console](https://console.cloud.google.com). |

> **Nunca expongas estos valores en el código fuente ni los subas al repositorio.**

---

## 📁 Estructura del proyecto

```
chrono/
├── src/
│   ├── app/                  # Rutas de Next.js (App Router)
│   │   ├── actions/          # Server Actions
│   │   ├── api/              # API Routes (NextAuth, etc.)
│   │   ├── timeline/         # Página de timeline
│   │   └── import/           # Página de importación de datos
│   ├── components/           # Componentes compartidos
│   │   └── ui/               # Componentes genéricos (Button, Dialog, etc.)
│   ├── modules/              # Módulos por funcionalidad
│   │   └── timeline/         # Componentes y lógica del timeline
│   ├── hooks/                # Custom hooks (useActivity, useRecord, etc.)
│   ├── lib/                  # Utilidades, schemas Zod y configuración de idb
│   ├── types/                # Tipos e interfaces TypeScript
│   ├── i18n/                 # Configuración de next-intl
│   └── auth.ts               # Configuración de NextAuth
├── messages/                 # Archivos de traducción (es / en)
├── public/                   # Activos estáticos
├── .env.example              # Plantilla de variables de entorno
└── next.config.ts
```

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con Turbopack |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor en modo producción |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

---

## 🚢 Despliegue

El proyecto está configurado para desplegarse en **Vercel**. Solo conecta tu repositorio de GitHub, define las variables de entorno en el panel de Vercel y el despliegue se realiza automáticamente en cada push a la rama `main`.

---
