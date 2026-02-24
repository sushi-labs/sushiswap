# AGENTS.md

## Scope
- Applies to everything under `apps/web/`.
- Inherits `/AGENTS.md`.
- This file is the source of truth for conflicting rules within `apps/web/`.

## Web App Defaults
- Treat this as a Next.js app with React + TypeScript conventions.
- Keep route-level concerns inside `src/app` boundaries.
- Avoid introducing duplicate domain logic that already exists in shared
  workspace packages.

## Web Validation
- Type check web app changes: `pnpm --filter web check`
- Run unit tests when relevant: `pnpm --filter web test:unit`
- Run e2e tests for user flow changes: `pnpm --filter web test`
- Run repository formatting/linting before handoff: `pnpm format`, `pnpm lint`

## Project Structure
- Keep page-specific code colocated with said page.
- Use the `lib` folder for app-wide code, reusable code.

## Type Usage
- Do not re-import types already defined globally in the `apps/web/src/types/global.d.ts` file.
