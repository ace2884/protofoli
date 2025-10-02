# Protofoli — Interactive 3D Portfolio

This repository contains a small interactive 3D portfolio website (HTML/CSS/JS) that includes Three.js-based background effects, GSAP animations, and mobile optimizations.

This README explains how to run the site locally and includes a small PowerShell helper to start/stop a local Python HTTP server.

---

## Quick Start (recommended)

1. Clone this repository to your local machine (if you haven't already):

```bash
git clone https://github.com/ace2884/protofoli.git
cd protofoli
```

2. Start the local server with the provided PowerShell helper (Windows PowerShell):

```powershell
# start server (runs python -m http.server 5500)
.\start-server.ps1 start

# stop server
.\start-server.ps1 stop

# check status
.\start-server.ps1 status
```

3. Open your browser and visit:

```http
http://localhost:5500
```

---

## Alternative: Start server manually (Python)

If you prefer not to use the PowerShell helper, you can run the Python HTTP server directly (Python 3 required):

```powershell
# run from the repository folder
python -m http.server 5500
```

Then open `http://localhost:5500` in your browser.

---

## Notes about Live Server and Virtual Workspaces

- The VS Code Live Server extension is convenient but may be disabled inside virtual workspaces (like remote or virtual FS). If Live Server is disabled in your environment, clone the repository locally and use the PowerShell helper or the Python command above.
- If Live Server is enabled, you can open `index.html` in VS Code and choose "Open with Live Server".

---

## Troubleshooting

- If the page is blank or the 3D effects don't appear, check the browser console (F12) for errors — missing CDN scripts or blocked network requests will show there.
- If the PowerShell script doesn't start due to execution policy, run (as admin) once:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

or run the script bypassing execution policy:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1 start
```

---

## Files of interest

- `index.html` — main page
- `style.css` — styles and animations
- `script.js` — navigation and interaction logic
- `3d-effects.js` — Three.js scene and particles
- `mobile-optimizations.js` — touch gestures and mobile features

---

If you want, I can also add an npm-based dev script (`package.json`) or a small batch file for Windows. Tell me which you'd prefer.
