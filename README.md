# Sushi Monorepo

Sushi 2.0 🍣

## Getting Started

https://pnpm.io/installation

### Install

`pnpm install`


### Dev

`pnpm exec turbo run dev --filter=evm`

#### Vercel APIs

These need to be run from their own folder at the moment in development.

`pnpm exec vercel dev`

### Build

`pnpm run build`

#### Single Repository

`pnpm exec turbo run build --filter=api/app/package/protocol`

### Test

`pnpm run test`

#### Single Repository

`pnpm exec turbo run test --filter=api/app/package/protocol`

### Clean

`pnpm run clean`

#### Single Repository

`pnpm exec turbo run clean --filter=api/app/package/protocol`

## APIs

...

### Creating a new API

`git checkout -b feature/example-api`

## Apps

...

### Creating a new app

`git checkout -b feature/example-app`

<!-- `pnpm exec @sushiswap/cli create-app example-app` -->

## Config

...

### Creating a new config

`git checkout -b feature/example-config`

## Packages

...

### Creating a new package

`git checkout -b feature/example-package`

## Protocols

...

### Creating a new protocol

`git checkout -b feature/example-protocol`

## Subgraphs

...

### Creating a new subgraph

`git checkout -b feature/example-subgraph`

## Disclaimer

_These smart contracts and code are being provided as is. No guarantee, representation or warranty is being made, express or implied, as to the safety or correctness of the user interface or the smart contracts and code. There can be no assurance they will work as intended, and users may experience delays, failures, errors, omissions or loss of transmitted information. In addition, using these smart contracts and code should be conducted in accordance with applicable law. Nothing in this repo should be construed as investment advice or legal advice for any particular facts or circumstances and is not meant to replace competent counsel. It is strongly advised for you to contact a reputable attorney in your jurisdiction for any questions or concerns with respect thereto. SushiSwap is not liable for any use of the foregoing and users should proceed with caution and use at their own risk._

_Any stated APY (the 'Rate') is purely informational based on publicly available blockchain data, and is a forward-looking projection based on our good faith belief of how to reasonably project results over the relevant period, but such belief is subject to numerous assumptions, risks and uncertainties (including smart contract security risks and third-party actions) which could result in a materially different (lower or higher) token-denominated Rates. The Rate is not a promise, guarantee or undertaking on the part of any person or group of persons, but depends entirely on the results of operation of smart contracts and other autonomous systems (including third-party systems) and how third parties interact with those systems after the time of your deposit or other interactions. Even if the Rate is achieved as projected, you may still suffer a financial loss in fiat-denominated terms if the fiat-denominated value of the relevant tokens (your deposit and any tokens allocated or distributed to you pursuant to the Rate) declines during the deposit period._
