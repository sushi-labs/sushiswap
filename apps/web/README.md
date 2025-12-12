# Web

## Getting started

For basic setup instructions, please refer to [the repo's README](../../README.md).

## Testing

### Configure the environment
Copy `apps/web/.env.test` to `apps/web/.env.test.local` and paste your DRPC key at the end of the `ANVIL_FORK_URL` variable.

### Running the test
From the root of this repository, run `pnpm test-evm-app`