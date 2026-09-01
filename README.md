# Attriato — Vite + React SPA

A single-page rebuild of [attriato.com](https://attriato.com), crawled and
reconstructed as a client-routed React app (Home, Services, About, Contact,
Search Jobs, Privacy Policy) built with Vite.

## Design

- **Palette:** ink navy `#0F1B2D`, paper `#EEF0EA`, signal green `#3EB489`,
  slate `#5C6670`, amber `#E0973A`.
- **Type:** Fraunces (display) + Inter (body) + JetBrains Mono (data/labels).

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## Notes

- Routing uses `HashRouter` (URLs like `/#/services`) so the build deploys
  as static files anywhere (Netlify, Vercel, GitHub Pages, S3) with zero
  server rewrite config. Switch to `BrowserRouter` in `src/main.jsx` if your
  host supports SPA fallback routing.
- Images are referenced directly from `attriato.com`'s existing WordPress
  media library (`wp-content/uploads/...`). Swap in your own hosted assets
  or drop files into `public/` and update the `src` paths for a fully
  self-contained build.
- The `/search-jobs` page uses a static snapshot of listings captured at
  crawl time — the live site pulls these dynamically from Adzuna.
