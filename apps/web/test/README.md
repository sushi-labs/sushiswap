# Web E2E tests

The PR suite uses a production test build, a mock wallet, a Polygon fork pinned
to block **71015789**, and recorded HTTP responses. Transactions execute on Anvil;
successful receipts and changes in balances/positions are asserted independently
of UI notifications. External application-data requests fail unless mocked.

## Run locally

Install dependencies with `pnpm install` and Chromium with
`pnpm --filter web exec playwright install chromium`. Foundry's **Anvil 1.8.1** must
be on `PATH`, matching the pinned E2E CI toolchain. Startup rejects other versions.
Validate toolchain upgrades explicitly before changing the pin.
Configure these environment variables (or use the existing
`apps/web/.env.test.local` with the root `pnpm test-web-app` command):

- `ANVIL_FORK_URL`: a Polygon archive RPC URL; never commit this credential.
- `NEXT_PUBLIC_APP_ENV=test` and `NEXT_PUBLIC_CHAIN_ID=137` at build and run time.
- `ANVIL_BLOCK_NUMBER=71015789` if explicitly set; other blocks fail validation.
- `EDGE_CONFIG` and `NEXT_PUBLIC_SUSHI_DATA_API_HOST`: the existing test app configuration.
- `PORT`: optional app port, defaults to 3000.
- `E2E_WORKERS`: defaults to 2; set to 1 to diagnose resource contention.
- `ANVIL_PORT`: optional proxy port, defaults to 8545. Set the matching
  `NEXT_PUBLIC_ANVIL_PORT` **before rebuilding** when changing this port.

```sh
pnpm exec turbo run build --filter web
pnpm --filter web test
pnpm --filter web test --workers=2 --retries=0
pnpm --filter web test --grep 'Wrap and unwrap'
pnpm --filter web test:harness
```

The harness needs neither an app build nor archive RPC access. It verifies fork
isolation, browser/server RPC forwarding, snapshot restoration, worker replacement
on retry, strict recordings, and rejection of reverted receipts. Its retry probe
intentionally fails once in a subprocess; the outer harness asserts this outcome.
Use a different `ANVIL_PORT` if running it alongside the app suite.

## Fixture ownership

Import `test` from `test/fixtures`, not directly from Playwright or Next, for fork
tests. The worker fixture owns a numeric proxy endpoint based on `workerIndex`,
a typed Viem client, and a deployed token. Replacement workers get new endpoints.
Each test takes a fresh snapshot; browser teardown precedes restoration. Never
share mutable chain state across tests or manually route RPC around the fixture.
Blocks advance by one second per mined block, independent of wall time, so pending
gas estimates and actual execution use the same timestamp for V3 oracle writes.

Register HTTP scenarios through `mocks.add` and deliberate RPC failures through
`mocks.addRpc`. The single dispatcher gives RPC precedence over HTTP handlers;
do not register additional `next.onFetch` callbacks. Static assets use Next's
normal routing. Analytics requests are suppressed. Token list balances come from
the test's fork; unrelated launchpad/merkl data is explicitly empty.

The mock wallet explicitly calls `eth_estimateGas` before gasless
`eth_sendTransaction` requests and sends that exact gas limit. This models the
estimation against the pending block normally performed by an injected wallet.
Anvil's implicit gas-filling path estimates against the latest block, which
underestimates these V3 transactions in 1.8.1. Explicit gas
limits and signed transactions pass through unchanged. Estimation errors are
returned to the wallet without submitting a transaction; scenario RPC mocks also
apply to these estimates.

Pool add/remove tests seed positions via RPC. Lifecycle tests still create pools
through the UI. Position IDs come from mint receipts, never a table row index.

## CI and diagnostics

- PRs run the fork suite and infrastructure harness. Simulated Privy integration
  runs only when Privy source/tests, its shared test configuration, or this workflow
  change. This includes Privy providers/hooks outside the `privy` directory.
- Manual runs always include simulated Privy integration.
- Manual runs also run real Privy EVM/SVM login/reconnect
  in a separate job. This uses the existing GitHub test-account secrets.
- Fork builds, test execution, and Privy dev-server startup appear as separate
  CI phases. E2E execution is not Turbo-cached; app builds remain cacheable.
- GitHub Actions restores the Turbo build cache across commits, even when Turbo
  remote caching is unavailable. Turbo still validates source/dependency/env
  hashes before reusing outputs. Successful builds are saved before tests run,
  so a later test failure does not discard the build cache.
- Each suite writes `test-results/<suite>/artifacts`, `html`, and `results.json`.
  Reports include durations, retry attempts, skipped tests, and named transaction
  steps. Failed tests retain their initial trace and screenshot; the `network`
  attachment lists mocked/unhandled application requests without URL credentials.
  Reverted transaction assertions also attach the receipt, transaction gas limit,
  and Anvil call trace so an out-of-gas failure can be distinguished from a contract
  validation failure.
- CI uploads fork/harness evidence before running Privy, and uploads each suite
  even on failure. When selected, simulated Privy still runs after fork failures.

To inspect a report: `pnpm --filter web exec playwright show-report test-results/fork/html`.

## Parallelism benchmark

Build once, then run `pnpm --filter web test:benchmark`. It alternates one and two
workers across ten repetitions each, disables retries, restarts the app for each
run, and preserves every report under `test-results/benchmark`. The summary
reports wall-time medians and failed-run counts. Compare cold builds separately
using the CI build step; these medians include server/worker startup, not builds.

The initial two-worker benchmark (Anvil 1.5.1, before explicit wallet gas
estimation) passed ten retry-free local runs per configuration on 2026-09-07:
all **360 test executions passed**, with median
wall time **89.0 seconds for one worker** and **52.0 seconds for two** (42% lower).
These measurements exclude the build and cover the 18-test fork suite.

The workflow's manual `benchmark` input runs the same comparison on CI hardware.
Verify the improvement there; do not extrapolate workstation timings directly to
CI. Future worker increases require passing isolation, improved median time, and
repeated runs without new failures. Sharding and extra runners are deferred until
browser execution dominates the remaining PR duration.

## Recordings and coverage

Swap files contain tokens and exact input amounts. Their chain manifest records
the fork block, sender, and API version. The loader validates the manifest and
requires matching tokens/amount/sender before returning executable calldata.
Intermediate quote requests can return `NoWay`; unknown executable swaps fail.

`pnpm --filter web generate-swaps 137` fetches all responses before replacing that
chain's recordings and writes its manifest. Other chains' files are preserved.
Update the pinned block and CI configuration together, then run every transaction
test. Never substitute a successful recording for a mismatched request.

Keep arithmetic, parsing, and state-machine permutations in Vitest. Browser
coverage prioritizes settlement, approval/rejection, mined failure, insufficient
balance, unavailable quotes, max/wrap, and independent V2/V3 liquidity flows.
Follow-up coverage from the architectural review includes changing quotes/accounts
during review, controlled cross-chain lifecycle tests, Solana execution, mobile,
and a production-mode CSP/wallet-discovery smoke suite. The legacy cross-chain
file remains excluded until converted to controlled service fixtures.
