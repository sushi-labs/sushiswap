# Sushi Monorepo

Sushi 2.0 🍣

## Getting Started

https://pnpm.io/installation

### Install

pnpm install

### Execute

pnp exec

### Dev

pnpn run dev

### Beast Mode

Runs dev for all apps and composes under localhost:3000

pnpm exec turbo run dev --filter=...{./apps/\*}

#### Single Repository

pnpm exec turbo run dev --filter=api/app/package/protocol

### Build

pnpn run build

#### Single Repository

pnpm exec turbo run build --filter=api/app/package/protocol

### Test

pnpn run test

#### Single Repository

pnpm exec turbo run test --filter=api/app/package/protocol

### Test

pnpn run clean

#### Single Repository

pnpm exec turbo run clear --filter=api/app/package/protocol

## APIs

- `token-list`

### Creating a new API

`git checkout -b feature/example-api`

## Apps

- `_root`
- `analytics`
- `blog`
- `docs`
- `furo`
- `kashi`
- `miso`

### Creating a new app

`git checkout -b feature/example-app`

`pnpm exec @sushiswap/cli create-app example-app`

## Packages

- `chain`
- `config`
- `math`
- `multicall`
- `tsconfig`
- `ui`

### Creating a new package

`git checkout -b feature/example-package`

## Protocols

- `furo`
- `miso`

### Creating a new protocol

`git checkout -b feature/example-protocol`

## Disclaimer

_These smart contracts and code are being provided as is. No guarantee, representation or warranty is being made, express or implied, as to the safety or correctness of the user interface or the smart contracts and code. There can be no assurance they will work as intended, and users may experience delays, failures, errors, omissions or loss of transmitted information. In addition, using these smart contracts and code should be conducted in accordance with applicable law. Nothing in this repo should be construed as investment advice or legal advice for any particular facts or circumstances and is not meant to replace competent counsel. It is strongly advised for you to contact a reputable attorney in your jurisdiction for any questions or concerns with respect thereto. SushiSwap is not liable for any use of the foregoing and users should proceed with caution and use at their own risk._
