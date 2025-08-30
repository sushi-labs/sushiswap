# Sushi Monorepo

Sushi 2.0 🍣

This repository contains code for the main Sushi interface hosted on [sushi.com](https://sushi.com).

## Getting Started

https://pnpm.io/installation

### Install
`pnpm install`

### Configure the environment
Copy `apps/web/.env.sample` to `apps/web/.env` and fill in non-optional variables. You can skip the Tron and Portal variables if you aren't working on those parts of the app.

### Dev
`pnpm exec turbo run dev --filter=web`

### Build
`pnpm exec turbo run build --filter=web`

### Clean (for getting the repo into a clean state)
`pnpm run clean`

## Disclaimer

_This code is being provided as is. No guarantee, representation or warranty is being made, express or implied, as to the safety or correctness of the user interface or the smart contracts and code. There can be no assurance it will work as intended, and users may experience delays, failures, errors, omissions or loss of transmitted information. In addition, using this code should be conducted in accordance with applicable law. Nothing in this repo should be construed as investment advice or legal advice for any particular facts or circumstances and is not meant to replace competent counsel. It is strongly advised for you to contact a reputable attorney in your jurisdiction for any questions or concerns with respect thereto. SushiSwap is not liable for any use of the foregoing and users should proceed with caution and use at their own risk._

_Any stated APY (the 'Rate') is purely informational based on publicly available blockchain data, and is a forward-looking projection based on our good faith belief of how to reasonably project results over the relevant period, but such belief is subject to numerous assumptions, risks and uncertainties (including smart contract security risks and third-party actions) which could result in a materially different (lower or higher) token-denominated Rates. The Rate is not a promise, guarantee or undertaking on the part of any person or group of persons, but depends entirely on the results of operation of smart contracts and other autonomous systems (including third-party systems) and how third parties interact with those systems after the time of your deposit or other interactions. Even if the Rate is achieved as projected, you may still suffer a financial loss in fiat-denominated terms if the fiat-denominated value of the relevant tokens (your deposit and any tokens allocated or distributed to you pursuant to the Rate) declines during the deposit period._
