# Academigo (Frontend)
Vite + React + HeroUI (v2) app.

## Prerequisites
- Node.js 18+ (or 20 LTS) and npm
- VS Code (recommended)
- Optional: pnpm or yarn

Verify Node and npm:
```powershell
node -v
npm -v
```

## Quick Start (Windows, PowerShell)
1) Install dependencies
```powershell
cd c:\Users\varma\OneDrive\Desktop\Academigo\academigo
npm install
```

2) Run the dev server
```powershell
npm run dev
```
- App will be available at http://localhost:5173 (or the URL shown in the terminal)

3) Build for production
```powershell
npm run build
```

4) Preview the production build (optional)
```powershell
npm run preview
```

## Environment variables (optional)
If the app needs a backend/API, create a .env.local file in this folder:
```bash
VITE_API_BASE_URL=http://localhost:8000
```
- Access in code via import.meta.env.VITE_API_BASE_URL

## Using pnpm (optional)
If you use pnpm, add this to .npmrc to hoist HeroUI correctly:
```bash
public-hoist-pattern[]=*@heroui/*
```
Then reinstall:
```powershell
pnpm install
```

## Troubleshooting
- Port in use: run dev on another port
```powershell
npm run dev -- --port 5174
```
- Dependency issues: delete node_modules and lockfile, then reinstall
```powershell
rimraf node_modules
del package-lock.json
npm install
```
- Node version: ensure Node 18+ (or 20 LTS)

## Tech Stack
- Vite, React, TypeScript
- HeroUI, Tailwind CSS, Tailwind Variants
- Framer Motion

## License
MIT
