# Web

## Getting started

For basic setup instructions, please refer to [the repo's README](../../README.md).

## RPC proxy

Browser RPC requests use `POST /api/rpc/<drpc-network>` (for example, `/api/rpc/ethereum`, `/api/rpc/solana`, or `/api/rpc/stellar`). BotID Basic verifies each request before its unchanged body is forwarded to DRPC. Method restrictions and CU limits are configured on DRPC. Server clients call DRPC directly.

## Testing

### Configure the environment
Copy `apps/web/.env.test` to `apps/web/.env.test.local` and paste your DRPC key at the end of the `ANVIL_FORK_URL` variable.

### Running the test
From the root of this repository, run `pnpm test-evm-app`
