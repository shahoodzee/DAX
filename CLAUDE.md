# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Repo rules (read first)

- **Never commit directly to `main`.** If you're on `main` and changes get made and finalized, check out a new branch for those changes before pushing — then push/publish that branch, not `main`.
- **This repo is public for viewing only.** Do not reuse, redistribute, or repurpose this code outside this project without the owner's explicit permission (see `README.md` License section).

## Project overview

DAX — a marketplace for trading digital game accounts across Valorant, CS:GO, Steam, League of Legends, and Overwatch. React SPA frontend with an integrated Express API.

## Commands

```bash
pnpm dev          # Start dev server — client + Express API on port 8080 (single port)
pnpm build        # Production build (build:client + build:server)
pnpm start        # Run production server from dist/server/
pnpm typecheck    # tsc
pnpm test         # vitest --run
pnpm format.fix   # prettier --write .
```

There is no `lint` script.

## Architecture

- `client/` — React 18 SPA (React Router 6, TanStack Query)
  - `pages/` — route components
  - `components/` — feature components; `components/ui/` — shadcn/ui primitives
  - `data/` — mock `sampleData.ts` (current source of listings/users — most pages read from here, not live API calls)
  - `hooks/`, `lib/` — `lib/auth.ts` (`getCurrentUser()` returns a fixed mock user), `lib/supabaseClient.ts` (currently a **mock** client; real Supabase wiring is commented out)
  - `global.css` — theme tokens and global styles
- `server/` — Express 5, `index.ts` entry, `routes/` (currently just `demo.ts`)
- `shared/` — types/helpers used by both client and server (`types.ts`, `csgo.ts`, `valorant.ts`)
- `netlify/functions/` — serverless wrapper for Netlify deploys

Path aliases: `@/*` → `client/*`, `@shared/*` → `shared/*`.

Dev runs on a single port — Vite middleware mounts the Express app during `pnpm dev`.

## Conventions

- `tsconfig.json` has `strict`, `noImplicitAny`, and `strictNullChecks` all **disabled** — don't assume strict-mode guarantees hold.
- Functional components with typed props interfaces; local state via hooks — no global state library in use.
- Styling: Tailwind CSS 3 utility classes plus a custom "valorant" theme palette (`valorant-cyan`, `valorant-gold`, `valorant-purple`, `valorant-dark`), shadcn/ui primitives, and the `cn()` helper (`clsx` + `tailwind-merge`) in `client/lib/utils.ts` for conditional classes.
- Icons from `lucide-react`.

## Testing

Vitest. Currently only `client/lib/utils.spec.ts` (tests the `cn()` helper). Run with `pnpm test`.

## Deployment

- Standard Node: `pnpm build && pnpm start`
- Netlify: see `netlify.toml` — build command `npm run build:client`, publish directory `dist/spa`

## Note on AGENTS.md

`AGENTS.md` in this repo is leftover generic "Fusion Starter" boilerplate and doesn't reflect DAX's actual identity or conventions. Treat this file (`CLAUDE.md`) as the accurate, DAX-specific source of truth.
