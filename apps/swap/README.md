## Swap

Swap application.


### Testing

#### Install

If you are on WSL, you might need to run 
```
npx playwright install
npx playwright install-deps
```

#### How to run

You need to run three terminal sessions:

Start Anvil in terminal session
```
ANVIL_FORK_URL=<URL> pnpm exec turbo run anvil --filter=swap
```

In a new terminal, run
``` 
NODE_ENV=test pnpm exec turbo run build --filter=swap
```

follwed by:
```
NODE_ENV=test NEXT_PUBLIC_PLAYWRIGHT_ENABLED=true pnpm exec turbo run start --filter=swap --force
```

Open a third terminal, run:
```
cd apps/swap
NODE_ENV=test PLAYWRIGHT_URL=http://localhost:3000/swap pnpm test:e2e
```