# Tripura – Webseite hosten

## Option 1: Vercel (empfohlen, kostenlos)

1. **Projekt bei GitHub hochladen** (falls noch nicht geschehen):
   - Auf [github.com](https://github.com) einloggen
   - Neues Repository erstellen (z. B. `tripura`)
   - Im Projektordner im Terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/tripura.git
   git push -u origin main
   ```

2. **Bei Vercel deployen**:
   - Auf [vercel.com](https://vercel.com) gehen und mit GitHub anmelden
   - „Add New“ → „Project“
   - Repository `tripura` auswählen
   - **Build Command:** `npm run build` (steht schon drin)
   - **Output Directory:** leer lassen (Next.js Standard)
   - „Deploy“ klicken

3. **Fertig.** Du bekommst eine URL wie `tripura-xxx.vercel.app`. Updates: Einfach `git push` auf `main`, dann baut Vercel automatisch neu.

---

## Option 2: Netlify

1. Auf [netlify.com](https://netlify.com) anmelden (z. B. mit GitHub).
2. „Add new site“ → „Import an existing project“ → GitHub → Repository wählen.
3. Einstellungen:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` ❌ – bei Next.js braucht Netlify das **Next.js Runtime**:
   - Stattdessen: „Site configuration“ → „Build & deploy“ → „Plugins“: **Next.js**-Plugin installieren, oder „Publish directory“ auf `.next` lassen und **Build command:** `npm run build && npx next export` nur wenn du statischen Export nutzt.
   
   Für Next.js 14 mit App Router am besten **Vercel** nutzen oder Netlify mit [@netlify/plugin-nextjs](https://www.npmjs.com/package/@netlify/plugin-nextjs).

---

## Option 3: Eigener Server (Node)

```bash
npm run build
npm run start
```

Dann läuft die App z. B. auf Port 3000. Mit Nginx oder einem Prozess-Manager (PM2) davor kannst du sie mit einer Domain verbinden und per HTTPS hosten.

---

## Wichtige Hinweise

- **Umgebungsvariablen:** Falls du z. B. Google Maps API Keys nutzt, in Vercel/Netlify unter „Settings“ → „Environment Variables“ eintragen (z. B. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).
- **.env.local** wird nicht ins Repo gepusht – alle nötigen Werte in der Hosting-Plattform setzen.
