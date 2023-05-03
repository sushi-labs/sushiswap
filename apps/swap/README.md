## Swap

Swap application.

### Testing

#### Install

install anvil

```
curl -L https://foundry.paradigm.xyz/ | bash
```

If you are on WSL, you might need to run

```
npx playwright install
npx playwright install-deps
```

#### How to run

#### Prerequisites

You need to run three terminal sessions:

Start Anvil in terminal session

```
ANVIL_FORK_URL=https://eth-mainnet.alchemyapi.io/v2/<ALCHEMY_ID> ANVIL_BLOCK_NUMBER=17180155 pnpm exec turbo run anvil --filter=swap --force
```

In a new terminal, run

```
NEXT_PUBLIC_TEST=true CHAIN_ID=1 PLAYWRIGHT_URL=http://localhost:3000/swap pnpm test-swap-app
```

<!-- #### Run test

Open a third terminal, run:

```
cd apps/swap
CHAIN_ID=137 NODE_ENV=test PLAYWRIGHT_URL=http://localhost:3000/swap pnpm test:e2e
```

Run a test a single test on a certain line, with one browser

```
CHAIN_ID=137 NODE_ENV=test PLAYWRIGHT_URL=http://localhost:3000/swap pnpm test:e2e -- index:37 --project=chromium --workers=1
``` -->
