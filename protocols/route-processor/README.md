# Universal RouterProcessor Proof of Concept

## Liquidity sources support

    - Sushiswap
    - Uniswap
    - Quickswap
    - Trident

## Install

```sh
pnpm i
```

## Test

```sh
pnpm exec turbo run test --filter=@sushiswap/route-processor
```

## Test Result Example:

```sh
  RouteProcessor
1. POLYGON RouteProcessor deployment ...
2. User creation ...
3. Deposit user's 1000000 MATIC to WMATIC
4. Approve user's WMATIC to the route processor ...
5. Fetch pools' data ...
    RPC calls were done total: 432, failed: 0
    Sushiswap: 30 pools were found
    UniswapV2: 0 pools were found
    Quickswap: 26 pools were found
    Trident: 142 pools were found
6. Create Route ...
    Input: 1000000 Wrapped Matic
    1. Wrapped Matic 37% -> [Sushiswap 0.3%] -> SushiToken
    2. Wrapped Matic 1% -> [Sushiswap 0.3%] -> USD Coin
    3. Wrapped Matic 15% -> [Sushiswap 0.3%] -> Wrapped Ether
    4. Wrapped Matic 1% -> [Quickswap 0.3%] -> SushiToken
    5. Wrapped Matic 13% -> [Quickswap 0.3%] -> USD Coin
    6. Wrapped Matic 1% -> [Quickswap 0.3%] -> Dai Stablecoin
    7. Wrapped Matic 20% -> [Quickswap 0.3%] -> Wrapped Ether
    8. Wrapped Matic 4% -> [Quickswap 0.3%] -> Tether USD
    9. Wrapped Matic 8% -> [BentoBridge] -> Bento Wrapped Matic
    10. Bento Wrapped Matic 87% -> [Trident 0.3%] -> Bento SushiToken
    11. Bento Wrapped Matic 13% -> [Trident 0.05%] -> Bento SushiToken
    12. Tether USD 25% -> [Sushiswap 0.3%] -> SushiToken
    13. Tether USD 75% -> [Quickswap 0.3%] -> Wrapped Ether
    14. USD Coin 29% -> [Sushiswap 0.3%] -> SushiToken
    15. USD Coin 14% -> [Sushiswap 0.3%] -> Wrapped Ether
    16. USD Coin 7% -> [Quickswap 0.3%] -> Wrapped Bitcoin
    17. USD Coin 0% -> [Quickswap 0.3%] -> Dai Stablecoin
    18. USD Coin 50% -> [Quickswap 0.3%] -> Wrapped Ether
    19. Dai Stablecoin 100% -> [Quickswap 0.3%] -> Wrapped Ether
    20. Wrapped Bitcoin 100% -> [Sushiswap 0.3%] -> SushiToken
    21. Wrapped Ether 96% -> [Sushiswap 0.3%] -> SushiToken
    22. Wrapped Ether 4% -> [BentoBridge] -> Bento Wrapped Ether
    23. Bento Wrapped Ether 51% -> [Trident 0.05%] -> Bento SushiToken
    24. Bento Wrapped Ether 49% -> [Trident 0.3%] -> Bento SushiToken
    25. Bento SushiToken 100% -> [BentoBridge] -> SushiToken
    Output: 37446.14 SushiToken
7. Create route processor code ...
8. Call route processor ...
9. Fetching user's output balance ...
    expected amountOut: 37446144762274125971456
    real amountOut:     37483903599967352559433
    slippage: 0.1%
    gas use: 1455389
```
