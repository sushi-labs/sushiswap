# Pool job

## Usage

### Pools

First time seed, set `FIRST_TIME_SEED` to true to speed things up. Otherwise ignore the env

```bash
FIRST_TIME_SEED=true pnpm ts-node --esm --swc ./src/pools.ts
```

### Incentives

```bash
pnpm ts-node --esm --swc ./src/incentives.ts 
```

### Volume

```bash
pnpm ts-node --esm --swc ./src/volume.ts 
```

```
http://localhost:8080/?target=incentives
```