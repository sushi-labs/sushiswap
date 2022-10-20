# Safe Gateway TypeScript SDK

[![npm](https://img.shields.io/npm/v/@gnosis.pm/safe-react-gateway-sdk?label=%40gnosis.pm%2Fsafe-react-gateway-sdk)](https://www.npmjs.com/package/@gnosis.pm/safe-react-gateway-sdk)

A TypeScript SDK for the [Safe Client Gateway](https://github.com/safe-global/safe-client-gateway)

📖 [API reference](https://safe-global.github.io/safe-react-gateway-sdk/modules.html#getBalances)

## Usage policy

NB: Safe Client Gateway isn't meant for public use.
Please _do not_ use this SDK if you're building, e.g., a Safe App.

## Using the SDK

Install:

```shell
yarn add @gnosis.pm/safe-react-gateway-sdk
```

Import:

```ts
import { getChainsConfig, type ChainListResponse } from '@gnosis.pm/safe-react-gateway-sdk'
```

Use:

```ts
const chains = await getChainsConfig()
```

The SDK needs no initialization unless you want to override the base URL, which defaults to https://safe-client.gnosis.io.
You can set an alternative base URL like so:

```ts
import { setBaseUrl } from '@gnosis.pm/safe-react-gateway-sdk'

// Switch the SDK to dev mode
setBaseUrl('https://safe-client.staging.gnosisdev.com')
```

The full SDK reference can be found [here](https://safe-global.github.io/safe-react-gateway-sdk/modules.html#getBalances).

## Adding an endpoint

Endpoint types are defined in `src/types/gateway.ts`.

Each endpoint consists of:

- a function defined in `src/index.ts` (e.g. `getBalances`)
- a path definition (e.g. `'/chains/{chainId}/safes/{address}/balances/{currency}/'`)
- operation definition (e.g. `safes_balances_list`)
- response definition

To add a new endpoint, follow the pattern set by the existing endpoints.

## Eslint & prettier

This command will run before every commit:

```shell
yarn eslint:fix
```

## Tests

To run the unit and e2e tests locally:

```shell
yarn test
```

N.B.: the e2e tests make actual API calls on staging.

## Gateway API docs

The TypeScript types in this SDK are based on [Rust types](https://safe-global.github.io/safe-client-gateway/docs/routes/index.html) from the Gateway API.
