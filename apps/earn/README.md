## Earn

Earn application.

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
ANVIL_FORK_URL=<URL> ANVIL_BLOCK_NUMBER=<BLOCK_NUMBER> pnpm exec turbo run anvil --filter=earn --force
```

In a new terminal, run

```
NEXT_PUBLIC_TEST=true  pnpm exec turbo run build --filter=earn --force
```

followed by:

```
NEXT_PUBLIC_TEST=true pnpm exec turbo run start --filter=earn --force
```

Open a third terminal, run:
```
ANVIL_FORK_URL=<URL> ANVIL_BLOCK_NUMBER=<BLOCK_NUMBER> NEXT_PUBLIC_TEST=true CHAIN_ID=137 PLAYWRIGHT_URL=http://localhost:3000/earn pnpm test-earn-app
```


#### E2E test development

It's faster to run it through dev instead of using a production build, instead
```
NEXT_PUBLIC_TEST=true  pnpm exec turbo run dev --filter=earn --force
```

```
cd apps/earn
NEXT_PUBLIC_TEST=true CHAIN_ID=137 PLAYWRIGHT_URL=http://localhost:3004/earn NODE_ENV=test npx playwright test
```