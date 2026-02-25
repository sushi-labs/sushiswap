# AGENTS.md

## Purpose
This monorepo contains the Sushi interface and shared packages used across
apps, config, and tooling. Agent changes should prioritize correctness,
safety, and minimal, reviewable diffs.

## Scope
- Applies to the entire repository from this root.
- If a deeper directory adds its own `AGENTS.md`, the deeper file overrides
  this one for that subtree.

## Inheritance Model
- Start with this root file as the default policy.
- Merge in rules from each nested `AGENTS.md` along the path to a file.
- When rules conflict, the closest (deepest) `AGENTS.md` wins.

## Repository Overview
- Package manager: `pnpm` (`pnpm@10.4.1`)
- Task runner: `turbo`
- Formatter/linter: `biome`
- Main workspaces: `apps/*`, `packages/*`, `config/*`
- Main product app: `apps/web`

## Local Setup And Commands
- Install dependencies: `pnpm install`
- Start web dev: `pnpm web`
- Run checks: `pnpm check`
- Run formatter: `pnpm format`
- Run lint: `pnpm lint`
- Run lint with fixes: `pnpm lint:fix`

## Code Style Conventions
- Use the repository formatter before finishing: `pnpm format`.
- Keep changes small and focused; avoid unrelated refactors.
- Prefer generic functions over duplicate code with few differences.

## Naming Conventions
- New file and directory names must use kebab-case.
- Keep names descriptive and consistent with surrounding modules.

## Function Declaration Preference
- Prefer the `function` keyword for named functions.
- Use arrow functions only where they are the natural fit (for example short
  inline callbacks).

## Type Usage
- Use TypeScript-first patterns and explicit types at module boundaries.
- Avoid `any`; use `unknown` plus narrowing when type is not yet known.
- Prefer narrow, composable types and unions over broad catch-all types.
- Add return types for exported functions and complex functions.
- Keep runtime checks for untrusted external data (API, URL params, storage).
- Use address types exported from the `sushi` package instead of the `string` type where relevant, eg. `EvmAddress` from `sushi/evm`.
- When writing generic or multichain functions, make use of the generic `AddressFor`, `CurrencyFor`, `TokenFor` and `TxHashFor` types from the `sushi` package.
- Do not make unnecessary casts.

## Change Rules
- Do not break public APIs without explicit request.
- Preserve existing architecture and package boundaries unless the task requires
  structural changes.

## Validation Before Handoff
- Run formatter: `pnpm format`
- Run lint: `pnpm lint`
- Run relevant tests for touched areas (at minimum targeted package/app tests).
- If broad changes were made, run full test/build checks.

## Security And Safety
- Never commit secrets or private keys.
- Treat wallet, signing, and transaction paths as high-risk.
- Prefer explicit error handling over silent fallbacks in critical flows.
