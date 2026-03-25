# MerklePic

Decentralized image hosting dApp built on **Shelby Protocol + Aptos blockchain**. Fully client-side — no backend required. Your wallet address is your identity.

Upload images → Shelby blob storage → Aptos on-chain ownership. Every image is Merkle-verified, tamper-proof, and permanently shareable.

## Tech Stack

- **TanStack Start** — Vite + React 19 fullstack framework with file-based routing
- **Aptos Blockchain** — On-chain image ownership and metadata via wallet transactions
- **Shelby Protocol** — Decentralized blob storage with Merkle tree verification
- **Tailwind CSS v4** — Utility-first styling with OKLCh color system
- **shadcn/ui** — Shared component library (Radix UI primitives)
- **Biome** — Linting + formatting (replaces ESLint/Prettier)
- **Turborepo** — Monorepo build orchestration
- **Bun** — Package manager and runtime

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in a browser with an Aptos wallet extension (e.g. Petra) installed.

## Monorepo Structure

```
merklepic/
├── apps/
│   └── web/             # Main dApp (TanStack Start, port 3001)
├── packages/
│   ├── ui/              # Shared shadcn/ui components and theme
│   ├── env/             # Type-safe env validation (@t3-oss/env-core)
│   └── config/          # Shared TypeScript base config
```

## Available Scripts

All commands run from **repo root** (never cd into workspace dirs):

```bash
bun run dev          # Start all workspaces in dev mode
bun run dev:web      # Start web app only
bun run build        # Build all workspaces
bun run check-types  # TypeScript type checking
bun run check        # Biome format + lint + auto-fix
```

### Adding Dependencies

```bash
bun add <pkg>                          # Root
bun add --filter @merklepic/web <pkg>  # Specific workspace
```

Use `catalog:` in workspace `package.json` to reference shared versions from root catalog.

## UI Customization

Shared components live in `packages/ui`:

- **Theme & colors**: `packages/ui/src/styles/globals.css`
- **Components**: `packages/ui/src/components/*`
- **Config**: `packages/ui/components.json`

Add shared primitives:

```bash
npx shadcn@latest add accordion dialog popover -c packages/ui
```

Import in app code:

```tsx
import { Button } from "@merklepic/ui/components/button";
```

## Architecture

```
User → Wallet Extension → File Upload → Shelby Blob Registration → Aptos On-chain Tx
```

- **No server database** — Shelby handles storage, Aptos handles ownership/metadata
- **TanStack Query** manages async state and blob polling
- **Wallet address = user identity** — no separate auth system

## Documentation

- Product spec: `docs/MerklePic_PRD.md`
- AI context: `CLAUDE.md`
