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
ANVIL_FORK_URL=<URL> pnpm exec turbo run anvil --filter=swap --force
```

In a new terminal, run

```
NODE_ENV=test pnpm exec turbo run build --filter=swap --force
```

follwed by:

```
NODE_ENV=test NEXT_PUBLIC_PLAYWRIGHT_ENABLED=true pnpm exec turbo run start --filter=swap --force
```

#### Run test

Open a third terminal, run:

```
cd apps/swap
CHAIN_ID=137 NODE_ENV=test PLAYWRIGHT_URL=http://localhost:3000/swap pnpm test:e2e
```

Run a test a single test on a certain line, with one browser

```
CHAIN_ID=137 NODE_ENV=test PLAYWRIGHT_URL=http://localhost:3000/swap pnpm test:e2e -- index:37 --project=chromium --workers=1
```
