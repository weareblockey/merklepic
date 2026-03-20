# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MerklePic — a decentralized image hosting dApp (v3.0 MVP) built on Shelby Protocol + Aptos blockchain. Fully client-side, no backend required. Wallet address = user identity.

## Monorepo Structure

- **`apps/web`** — TanStack Start (Vite + React 19) fullstack dApp, port 3001
- **`packages/ui`** — Shared shadcn/ui component library (Base UI + Tailwind 4, OKLch colors)
- **`packages/env`** — Type-safe env validation via @t3-oss/env-core (VITE_ prefix for client vars)
- **`packages/config`** — Shared TypeScript base config

## Commands

All commands run from **repo root only** (never cd into workspace dirs):

```bash
bun run dev          # Start all workspaces in dev mode (Turborepo)
bun run dev:web      # Start web app only (--filter=@merklepic/web)
bun run build        # Build all workspaces
bun run check-types  # TypeScript type checking across all packages
bun run check        # Biome format + lint + auto-fix (write mode)
```

Adding dependencies:
```bash
bun add <pkg>                          # Root
bun add --filter @merklepic/web <pkg>  # Specific workspace
```

Use `catalog:` in workspace package.json to reference shared versions from root catalog.

## Code Style

- **Biome** (not ESLint/Prettier) — single tool for linting + formatting
- **Tab indentation**, double quotes
- Tailwind class sorting enabled for `clsx`, `cva`, `cn` functions
- TypeScript strict mode with `verbatimModuleSyntax` and `isolatedModules`
- `routeTree.gen.ts` is auto-generated — never edit manually

## Key Patterns

- **Routing**: TanStack Router file-based routing in `apps/web/src/routes/`
- **Components**: shadcn/ui in `packages/ui/src/components/`, export via package.json `exports` map
- **Imports**: `@/*` maps to `apps/web/src/*`, `@merklepic/ui/*` maps to `packages/ui/src/*`
- **Styling**: Tailwind v4 with `@import`/`@source` directives, theme vars in `packages/ui/src/styles/globals.css`
- **Utilities**: `cn()` helper in `packages/ui/src/lib/utils.ts` (clsx + tailwind-merge)
- **Env vars**: Validated through `@merklepic/env` package, client-side vars must use `VITE_` prefix

## Architecture

Client-side only flow: File upload → Shelby blob registration → Aptos on-chain transaction. No server database — Shelby handles storage, Aptos handles ownership/metadata. TanStack Query manages async state.

## PRD

Detailed product spec at `docs/MerklePic_PRD.md` — covers all features, user flows, SDK reference, error matrix, and 5-phase implementation roadmap.
