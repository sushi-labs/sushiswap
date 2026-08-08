# EVM frontend agentic harness

This directory implements the same-chain EVM correctness harness described in
`implementation-plan.md`. It is opt-in for mutating runs: unit tests need no credentials, while
Playwright scenarios require an isolated Anvil fork or Tenderly Virtual Environment.

## What is implemented

- Seven typed chain projects and a 65-token runtime-preflight corpus.
- One fork per Playwright worker through a shared `ForkController` interface, with Anvil and
  Tenderly backends, snapshots, reverts, funding hooks, impersonation, mining, and mutation logs.
- Separate deterministic RPC fault proxies for browser traffic and local simulation traffic.
- A production Swap API proxy that forwards with `simulate=false`, verifies sender prerequisites,
  traces the exact calldata on the browser fork, and returns narrow failure classifications.
- Simulation-versus-execution comparison with receipt, logs, gas, input/output deltas, and minimum
  output checks. Execution still runs on a disposable branch after a rejected simulation.
- Receipt-status assertions, an explicit approval lifecycle, resolved token manifests, pairwise
  scenario generation, synthetic token contracts, pool/position event derivation, and versioned,
  redacted finding artifacts.
- Runtime token behavior screening through the GoPlus Token Security API, normalized to buy/sell
  restrictions, tax rates, transfer controls, cooldowns, and owner-modifiable trading behavior.
- Playwright planner/generator/healer definitions plus scout, reproducer, minimizer, and triage
  boundaries. Agents may repair harness/test defects but cannot silently edit product behavior,
  skip failures, weaken assertions, or add unconditional retries.

Cross-chain flows and production signing are intentionally unavailable. The harness is for product
correctness and reliability testing, not security assessment or vulnerability scanning.

## Commands

From `apps/web`:

```sh
pnpm test:agentic:unit
pnpm exec tsc -p test/agentic/tsconfig.json
pnpm test:agentic
```

Compile the synthetic token fixtures from the repository root:

```sh
forge build --root apps/web/test/agentic/contracts
```

Live scenarios are skipped unless `AGENTIC_RUN_MUTATING=true`.

## Fork configuration

For Anvil, set `AGENTIC_FORK_BACKEND=anvil` and either a shared `AGENTIC_FORK_URL` or one endpoint
per chain such as `AGENTIC_FORK_URL_1` and `AGENTIC_FORK_URL_8453`. `AGENTIC_FORK_BLOCK_NUMBER` is
optional and should be used only for permanent regression fixtures; exploratory runs default to the
current block.

For Tenderly, set:

```text
AGENTIC_FORK_BACKEND=tenderly
TENDERLY_ACCESS_KEY=...
TENDERLY_ACCOUNT_SLUG=...
TENDERLY_PROJECT_SLUG=...
```

The controller creates a single-network environment with distinct public/admin RPC endpoints and
deletes it after the worker uploads artifacts. Admin endpoints and credentials are never attached.

Optional controls:

```text
AGENTIC_SEED=1
AGENTIC_BROWSER_RPC_FAULTS=[...fault rules...]
AGENTIC_SIMULATION_RPC_FAULTS=[...fault rules...]
AGENTIC_PRODUCTION_API_BASE_URL=https://api.sushi.com
AGENTIC_GOPLUS_ACCESS_TOKEN=...
AGENTIC_GOPLUS_BASE_URL=https://api.gopluslabs.io
AGENTIC_GOPLUS_TIMEOUT_MS=10000
```

Each fault rule has `id`, `kind`, `activateOn`, `duration`, an optional `methods` filter, and bounded
options. The seed, activation count, and rule id make jitter and corruption replayable.

## Token behavior screening

Corpus preflight uses GoPlus's documented
[`/api/v1/token_security/{chain_id}` endpoint](https://docs.gopluslabs.io/reference/tokensecurityusingget_1).
All seven harness chains are supported, including Robinhood Chain (`4663`). The access token is
optional and is sent only in the `Authorization` header. It is never placed in a URL, resolved
manifest, or finding artifact.

The adapter runtime-validates the response and retains only normalized behavior signals:

- honeypot/cannot-buy/cannot-sell-all results;
- buy, sell, and ordinary-transfer tax in basis points;
- pause, blacklist, whitelist, cooldown, and anti-whale capabilities;
- owner-modifiable tax, per-address tax, anti-whale, and balance controls.

A honeypot, a blocked buy/full-balance sell, or a 100% tax quarantines a verified token. A provider
timeout, unsupported/invalid response, or change from the seeded behavior is explicit in the
manifest and downgrades the token to discovery-only; it does not abort the rest of preflight.
Dormant administrative capabilities are recorded for scenario selection but are not treated as an
active transfer restriction without fork-local evidence.

Construct live adapters with `createCorpusPreflightAdapters({ fund, quote, transfer })`; it installs
the environment-configured GoPlus scanner by default. Unit tests and recorded regressions can pass
an injected `screen` function to avoid networking. The scanner and preflight API are Node harness
boundaries and are never bundled into the frontend.

## Safe execution contract

- Use only the deterministic Anvil test accounts or dedicated Tenderly test accounts.
- Never point browser RPC configuration at an admin endpoint.
- Never use production private keys or real funds.
- Fund and approve before interpreting a routed simulation; failed prerequisites are harness errors.
- Assert `receipt.status`, then reread allowance/balances before opening a gate or reporting success.
- Keep production Swap API responses and calldata in artifacts, but redact credentials and private
  RPC access.
