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
npm run deploy     # deploy the Cloudflare Worker and assets
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
- The Cloudflare Worker serves the built assets from `dist/` and preserves the
  headers and discovery resources emitted from `public/`.
- The Worker deployment uses the repository root, `npm run build` as its build
  command, and `dist` as its asset directory. The Worker entry point is
  `worker/index.js`, which handles `/api/contact`, `/api/jobs`, and the
  authenticated `/api/ga4/*` endpoints.
- The GA4 Insights report requires server-side Google OAuth credentials. In Google Cloud,
  enable the Google Analytics Data API and Admin API, configure a Web
  application OAuth client, and add
  `https://YOUR_DOMAIN/api/ga4/callback` as an authorized redirect URI.
  Grant the OAuth client the
  `https://www.googleapis.com/auth/analytics.readonly` scope and add authorized
  test users if the consent screen is in testing mode.
- Configure these Cloudflare Worker secrets (never put them in the Vite client
  or commit them): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
  `GA4_SESSION_SECRET`, and `GA4_REDIRECT_URI`. Set `GA4_REDIRECT_URI` to the
  exact callback URI registered with Google. Generate a random value of at
  least 32 bytes for `GA4_SESSION_SECRET`; for example, run
  `openssl rand -hex 32` locally. Add values to Cloudflare with
  `npx wrangler secret put SECRET_NAME`.
- The report reads aggregate metrics from the selected GA4 property. It does
  not currently use an AI service. It covers the last seven complete days and
  compares them with the preceding seven days.
  Google tokens are stored in an encrypted, HTTP-only cookie and can be revoked
  with the page's Disconnect action. Run the Worker locally with configured
  local secrets to exercise the API and OAuth callback.
- GA4 OAuth and reporting require the app and `/api/ga4/*` routes to be served
  from the same Cloudflare Worker origin. A static-only Pages deployment does
  not run these API routes. After configuring the Worker secrets, deploy the
  Worker and bundled assets with `npm run deploy`.
