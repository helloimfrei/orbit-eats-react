# Orbit Eats Delivery Traffic (TypeScript)

There is a ton of intergalactic traffic—get past the traffic as quickly as possible to make sure you arrive at your destination on time.

Simple Space-Invaders-like game written in TypeScript (HTML5 canvas). Built with Vite so it’s easy to run locally and deploy as static files.

## Run locally

```bash
npm install
npm run dev
```

Then open the dev URL shown in the terminal (typically `http://localhost:5173/`).

## Build for a website

```bash
npm run build
```

Your embeddable static files will be in `dist/`.

## Embed options

### Option A (recommended): iframe embed

1. Deploy the `dist/` folder to your site (any static hosting).
2. Embed it:

```html
<iframe
  src="/path/to/orbiteats-invaders/index.html"
  width="980"
  height="700"
  style="border:0; border-radius:14px; overflow:hidden;"
  loading="lazy"
  allow="fullscreen"
></iframe>
```

### Option B: direct script include (advanced)

Vite outputs hashed asset filenames, so the simplest “drop-in” is to serve `dist/` as-is (so `index.html` can reference `assets/index-*.js` and `assets/index-*.css`).
