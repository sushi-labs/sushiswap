# Aggregator


## Usage

### Seed
First time seed, set `FIRST_TIME_SEED` to true, otherwise it will only fetch new pools
```
FIRST_TIME_SEED=true pnpm ts-node --esm --swc ./src/seed/sushiswap/seed.ts
```


### Reserves
NOTE: the current impl. only supports constant product pool
```
CHAIN_ID=1 VERSION=V2 TYPE=CONSTANT_PRODUCT_POOL pnpm ts-node --esm --swc ./src/seed/reserves.ts 
```


### Update token prices
NOTE: the current impl. only supports constant product pool
```
CHAIN_ID=1 VERSION=V2 TYPE=CONSTANT_PRODUCT_POOL BASE=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 PRICE=USD pnpm ts-node --esm --swc ./src/seed/price.ts
```


### Update liquidity
```
CHAIN_ID=1 VERSION=V2 TYPE=CONSTANT_PRODUCT_POOL pnpm ts-node --esm --swc ./src/seed/liquidity.ts
```


### Whitelist pools
This needs to run frequently, it runs through every pool and checks if they contain two approved tokens and sets `isWhitelisted` attribute to `true`
```
pnpm ts-node --esm --swc ./src/playground/update-swap-fee.ts
```