# Sushi Monorepo

Sushi 2.0 🍣

## Getting Started

https://pnpm.io/installation

### Install

`pnpm install`

### Dev

`pnpm exec turbo run dev --filter=swap`

### Build

`pnpn run build`

#### Single Repository

`pnpm exec turbo run build --filter=api/app/package/protocol`

### Test

`pnpn run test`

#### Single Repository

`pnpm exec turbo run test --filter=api/app/package/protocol`

### Clean

`pnpn run clean`

#### Single Repository

`pnpm exec turbo run clean --filter=api/app/package/protocol`

## APIs

- `path-finder`
- `token-list`
- `token-price`

### Creating a new API

`git checkout -b feature/example-api`

## Apps

- `_root`
- `analytics`
- `blog`
- `furo`
- `kashi`
- `miso`
- `swap`

### Creating a new app

`git checkout -b feature/example-app`

<!-- `pnpm exec @sushiswap/cli create-app example-app` -->

## Packages

- `@sushiswap/chain`
- `@sushiswap/cli`
- `@sushiswap/currency`
- `@sushiswap/exchange`
- `@sushiswap/format`
- `@sushiswap/graph-client`
- `@sushiswap/hooks`
- `@sushiswap/math`
- `@sushiswap/eslint-config`
- `@sushiswap/hardhat-config`
- `@sushiswap/prettier-config`
- `@sushiswap/typescript-config`
- `@sushiswap/redux-logs`
- `@sushiswap/redux-token-lists`
- `@sushiswap/stargate`
- `@sushiswap/tines`
- `@sushiswap/token-lists`
- `@sushiswap/ui`
- `@sushiswap/wagmi`

### Creating a new package

`git checkout -b feature/example-package`

## Protocols

- `@sushiswap/bentobox`
- `@sushiswap/furo`
- `@sushiswap/kashi`
- `@sushiswap/miso`
- `@sushiswap/sushiswap`
- `@sushiswap/sushixswap`

### Creating a new protocol

`git checkout -b feature/example-protocol`

## Disclaimer

_These smart contracts and code are being provided as is. No guarantee, representation or warranty is being made, express or implied, as to the safety or correctness of the user interface or the smart contracts and code. There can be no assurance they will work as intended, and users may experience delays, failures, errors, omissions or loss of transmitted information. In addition, using these smart contracts and code should be conducted in accordance with applicable law. Nothing in this repo should be construed as investment advice or legal advice for any particular facts or circumstances and is not meant to replace competent counsel. It is strongly advised for you to contact a reputable attorney in your jurisdiction for any questions or concerns with respect thereto. SushiSwap is not liable for any use of the foregoing and users should proceed with caution and use at their own risk._
