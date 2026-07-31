# DAX — Digital Assets Exchange

**Buy and sell game accounts with confidence.**

DAX is a modern marketplace for trading digital game accounts across Valorant, CS:GO, Steam, League of Legends, and Overwatch. Browse listings with rich skin and weapon filters, manage your own inventory, and discover trusted sellers in the community — all in a fast, Valorant-inspired web experience.

> **Notice:** This repository is public for viewing purposes only. Do not use, copy, modify, or deploy this code without explicit permission from the author. See [License](#license).

---

## Features

| Area | What you get |
|------|----------------|
| **Dashboard** | Infinite-scroll account feed with search and advanced filters (game, weapon, skin type, combinations) |
| **Marketplace** | Browse listed accounts with game-type filters and live marketplace stats |
| **My Listings** | Manage accounts you sell, with status tracking (listed, pending, sold) |
| **Community** | Discover sellers, view ratings, and browse a seller's full catalog |
| **Account Details** | Deep-dive into skins, rank, spend, verification status, and pricing |
| **Auth** | Login and sign-up flows (mock client by default; Supabase-ready) |

---

## Tech Stack

- **Frontend** — React 18, TypeScript, Vite, React Router 6, TanStack Query
- **UI** — Tailwind CSS 3, Radix UI, Lucide icons, shadcn/ui-style components
- **Backend** — Express 5 (integrated with Vite in development)
- **Validation** — Zod
- **Auth (planned)** — Supabase (`@supabase/supabase-js`)
- **Testing** — Vitest
- **Package manager** — [pnpm](https://pnpm.io/) (recommended)

---

## Prerequisites

- **Node.js** 18 or later
- **pnpm** 10+ (or npm as a fallback)

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd DAX-App
pnpm install
```

### 2. Environment variables

Create a `.env` file in the project root (or copy from the existing template):

```env
# Optional — echoed by GET /api/ping
PING_MESSAGE="ping pong"

# Optional — Builder.io integration
VITE_PUBLIC_BUILDER_KEY=your_builder_key

# Supabase (uncomment in client/lib/supabaseClient.ts when ready)
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key
```

> **Note:** Authentication currently uses a mock Supabase client so you can explore the UI without backend setup. Uncomment the real client in `client/lib/supabaseClient.ts` once your Supabase project is configured.

### 3. Run the development server

```bash
pnpm dev
```

Open **[http://localhost:8080](http://localhost:8080)** — the Vite dev server serves the React app and mounts the Express API on the same port.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (client + Express API on port **8080**) |
| `pnpm build` | Production build (client + server) |
| `pnpm start` | Run the production server from `dist/server/` |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run Vitest tests |
| `pnpm format.fix` | Format code with Prettier |

---

## Project Structure

```
DAX-App/
├── client/                 # React SPA
│   ├── pages/              # Route-level views
│   ├── components/         # UI and feature components
│   ├── lib/                # Auth, Supabase client, utilities
│   ├── hooks/              # Custom React hooks
│   └── global.css          # Theme tokens and global styles
├── server/                 # Express API
│   ├── index.ts            # Server setup and route registration
│   └── routes/             # API handlers
├── shared/                 # Types shared by client and server
│   ├── types.ts            # GameAccount, User, Skin, etc.
│   ├── csgo.ts             # CS:GO-specific helpers
│   └── valorant.ts         # Valorant-specific helpers
├── netlify/                # Netlify serverless functions
└── public/                 # Static assets
```

### Path aliases

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `client/*` |
| `@shared/*` | `shared/*` |

---

## Routes

| Path | Page |
|------|------|
| `/` · `/dashboard` | Dashboard — main account feed |
| `/marketplace` | Marketplace — browse listed accounts |
| `/my-listings` | Seller inventory management |
| `/community` | Seller discovery |
| `/community/:userId` | Individual seller listings |
| `/account/:id` | Account detail view |
| `/profile` · `/account` | User profile and account settings |
| `/settings` | App settings |
| `/login` · `/sign-up` | Authentication |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ping` | Health check — returns `{ message }` from `PING_MESSAGE` |
| `GET` | `/api/demo` | Demo endpoint |

---

## Supported Games

Accounts can be listed under any of these types:

- Valorant
- CS:GO
- Steam
- League of Legends
- Overwatch

Advanced filters adapt by game — for example, Valorant weapon skins (Vandal, Phantom, Operator, …) and CS:GO loadout filters (AK-47, AWP, Karambit, …).

---

## Production & Deployment

### Standard Node deployment

```bash
pnpm build
pnpm start
```

### Netlify

The repo includes `netlify.toml` for SPA hosting with serverless API functions. Build command: `npm run build:client`, publish directory: `dist/spa`.

---

## Development Notes

- **Sample data** — Listings and users come from `client/data/sampleData.ts` for local development.
- **Mock auth** — `getCurrentUser()` in `client/lib/auth.ts` returns a fixed demo user; wire up real auth when Supabase is enabled.
- **Single-port dev** — Vite middleware mounts Express during `pnpm dev`; no separate API port needed.

---

## License

Copyright © Shahood. All rights reserved.

This code is made publicly **viewable** for portfolio/demonstration purposes only. No license is granted to use, copy, modify, merge, publish, distribute, sublicense, deploy, or sell copies of this software, in whole or in part, without explicit prior written permission from the author.

If you'd like to use this project or any part of it, please reach out first to request permission.
