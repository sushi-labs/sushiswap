# Web

## Getting started

For basic setup instructions, please refer to [the repo's README](../../README.md).

## RPC proxy

Browser RPC requests use `POST /api/rpc/<drpc-network>` (for example, `/api/rpc/ethereum`, `/api/rpc/solana`, or `/api/rpc/stellar`). BotID Basic verifies every request. Successful individual `eth_blockNumber` results are cached per network for one second in [Vercel Runtime Cache](https://vercel.com/docs/caching/runtime-cache), shared across serverless instances within each region, with hard expiry and no in-flight deduplication. Cache hits preserve the caller's JSON-RPC ID; all other requests, including batches, are forwarded unchanged to DRPC. Cache failures fall back to DRPC. Method restrictions and CU limits are configured on DRPC. Server clients call DRPC directly.

## Testing

### Configure the environment
Copy `apps/web/.env.test` to `apps/web/.env.test.local` and paste your DRPC key at the end of the `ANVIL_FORK_URL` variable.

### Running the test
From the root of this repository, run `pnpm test-evm-app`
