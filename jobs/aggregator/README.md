# Aggregator job

## Usage

build and run from repo root dir

```sh

pnpm exec turbo run db:generate --filter=database
pnpm exec turbo run db:push --filter=database

pnpm exec turbo run build --filter=sushi
pnpm exec turbo run start --only --filter=sushi
```

There are currently 5 different seed scripts:

- `Protocol` - Pool and token discovery.
- `Reserves` - does web3 calls to fetch reserves for whitelisted pools.
- `Price` - Fetches all the whitelisted pools, uses tines for price discovery.
- `liquidity` - Updates liquidityUSD on pools where they contain at least one approved token which has been priced.
- `Whitelist Pools` - Looks through all the pools if they contains two approved tokens and flag the pools as whitelisted.

Start a script by hitting an endpoint, see [server.ts](src/server.ts)
Example: `https://localhost:8080/protocol?name=SushiSwap`

## Endpoints

- `http://localhost:8080/protocol?name=SushiSwap`

- `http://localhost:8080/protocol?name=ApeSwap&version=V2`
- `http://localhost:8080/protocol?name=Dfyn&version=V2`
- `http://localhost:8080/protocol?name=Elk&version=V2`
- `http://localhost:8080/protocol?name=HoneySwap&version=V2`
- `http://localhost:8080/protocol?name=JetSwap&version=V2`
- `http://localhost:8080/protocol?name=NetSwap&version=V2`
- `http://localhost:8080/protocol?name=PancakeSwap&version=V2`
- `http://localhost:8080/protocol?name=QuickSwap&version=V2`
- `http://localhost:8080/protocol?name=TraderJoe&version=V2`
- `http://localhost:8080/protocol?name=SpiritSwap&version=V2`
- `http://localhost:8080/protocol?name=SpookySwap&version=V2`
- `http://localhost:8080/protocol?name=UbeSwap&version=V2`
- `http://localhost:8080/protocol?name=Uniswap&version=V2`


- `http://localhost:8080/whitelist-pools`
- `http://localhost:8080/price`
- `http://localhost:8080/reserves`

## CI/CD

### Deployment

Update or add cronjobs, see [setup-schedulers.ts](src/setup-schedulers.ts) and [.env.example]

```sh
pnpm run setup
```

## Add a protocol

- Create a seed script in src/seed
- Add the protocol to the [config](src/config.ts)
  - create a new `ProtocolName` and add it to `PROTOCOL_JOBS` (This will create the cronjob next time the `setup` command is run)
- Update the `/protocol` endpoint
- Build and deploy, then run `pnpm run setup` for the cronjob to appear
