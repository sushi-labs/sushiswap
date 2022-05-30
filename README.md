# Sushi Monorepo

Sushi 2.0 🍣

## Getting Started

https://pnpm.io/installation

### Install

```bash
pnpm install
```

### Execute

```bash
pnpm exec
```

### Dev

```bash
pnpm run dev
```

### Beast Mode

Runs dev for all apps and composes under localhost:3000

```bash
pnpm exec turbo run dev --filter=...{./apps/\*}
```

#### Single Repository

```bash
pnpm exec turbo run dev --scope=api/app/package/protocol
```

### Build

```bash
pnpn run build
```

#### Single Repository

```
pnpm exec turbo run build --scope=api/app/package/protocol
```

### Test

```bash
pnpn run test
```

#### Single Repository

```bash
pnpm exec turbo run test --scope=api/app/package/protocol
```

### Test

```bash
pnpn run clean
```

#### Single Repository

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

`git checkout -b feature/example-packakge`

## Protocols

- `furo`
- `miso`

### Creating a new protocol

`git checkout -b feature/example-protocol`
