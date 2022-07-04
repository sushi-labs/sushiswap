# Sushi 2.0 Monorepo 🍣

### Requirements
- pnpm via [https://pnpm.io/installation](https://pnpm.io/installation)
    - on the other hand, you can run: ```bash npm install -g pnpm```
- (Recommended) GIT client via [GitHub Desktop](https://desktop.github.com)

### To run it locally

- git clone the repository
```bash
git clone https://github.com/(yourUsername)/sushiswap.git
```

- cd to the folder you git cloned the repository in
```bash
cd (sushiswapRepository) 
```

#### NOTE: if you run into a peer dependencies error, run 
```bash 
pnpm config set auto-install-peers true
```
to have peer dependencies automatcally installed

- install all dependencies for a project
```bash
pnpm install
```

- run the project 
```bash
pnpm run dev
```

your local clone of SushiSwap should be on your free Port i.e http://localhost:XXXX/, where you can make changes


# Beast Mode
Runs dev for all apps and composes under [http://localhost:3000](http://localhost:3000)

```bash
pnpm exec turbo run dev --filter=...{./apps/\*}
```

### Single Repository
```bash
pnpm exec turbo run dev --scope=api/app/package/protocol 
```
### Build
```bash
pnpm run build
```
### Single Repository
```bash
pnpm exec turbo run build --scope=api/app/package/protocol
```
### Test
```bash
pnpm run test
```
### Single Repository
```bash
pnpm exec turbo run test --scope=api/app/package/protocol
```
### Test
```bash
pnpm run clean
```
### Single Repository
```bash
pnpm exec turbo run clear --scope=api/app/package/protocol
```
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
