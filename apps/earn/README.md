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
NODE_ENV=test NEXT_PUBLIC_PLAYWRIGHT_ENABLED=true  pnpm exec turbo run build --filter=earn --force
```

followed by:

```
NODE_ENV=test NEXT_PUBLIC_PLAYWRIGHT_ENABLED=true pnpm exec turbo run start --filter=earn --force
```

#### Run test

Open a third terminal, run:

```
NEXT_PUBLIC_PLAYWRIGHT_ENABLED=true CHAIN_ID=1 PLAYWRIGHT_URL=http://localhost:3000/earn pnpm test-earn-app
```
