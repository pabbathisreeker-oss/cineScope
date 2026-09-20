# CineScope 🎬

A modern React 19 + TypeScript + Vite movie discovery web application powered by Vercel Serverless Functions and TMDB API.

---

## 🔒 Serverless Backend Proxy (`/api/movies/*`)

### Why the Proxy Exists
TMDB (`api.themoviedb.org`) is intermittently affected by ISP-level DNS blocking for users in India. To guarantee uninterrupted access and ensure client-side requests never fail due to network/DNS blocks, **CineScope routes all TMDB requests through a Vercel Serverless Function backend proxy** (`api/movies/*`).

### Security & Token Privacy
- The `TMDB_READ_ACCESS_TOKEN` is kept **strictly server-side** in process environment variables.
- It is **never exposed** to client-side JavaScript bundles (no `VITE_` prefix).
- Endpoints return edge-cached JSON responses (`Cache-Control: stale-while-revalidate`) and return HTTP 502 status codes on upstream failures without leaking API keys.

---

## ⚙️ Environment & Deployment Setup

### Local Development
To test the serverless API proxy locally:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your `TMDB_READ_ACCESS_TOKEN` in `.env`:
   ```env
   TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
   ```
3. Run local dev server:
   ```bash
   npm run dev
   ```
   *(Starts the Vite dev server with integrated serverless API function execution. Alternatively, run `npx vercel dev` or `npm run vercel-dev` to use the Vercel CLI local serverless environment. If TMDB is unreachable or the token is missing, CineScope automatically and gracefully falls back to local zero-config mock data!)*



### Production Deployment (Vercel)
When deploying to Vercel:
1. Navigate to your project settings in the **Vercel Dashboard**.
2. Go to **Settings > Environment Variables**.
3. Add `TMDB_READ_ACCESS_TOKEN` with your TMDB Bearer token value.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion
- **Backend / Edge**: Vercel Serverless Functions (`@vercel/node`), Axios
- **State & Data**: TanStack React Query v5, Zustand v5
