
# How to support a new type of Sushi liquidity provider

## Architecture

- Extractor - server, extracts pools information from the blockchain and keeps it up to date
- Tines - Sushi route algorithm. Takes pools, input token, output token, input amount and creates
  an optimal multipath route 
- Router - server
    - processes router requests from users (SwapAPI). Launches Tines for this. 
    - processes token info requests from users
    - processes prices requests from users
    - requests pools and tokens updates from Extractor
    - calculates token prices (plan to replace it to Extractor)
- Route Processor (1,2,3,4, ...) - smart contract, processes onchain routes created by Router
- LiquidityProvider - class for on-client extracting pools info. Is used in case of server fail. Not obligatory

## New liquidity source support

Attention: 80% of the work is work with tests!

### Tines

If the liquidity provider has pools of unknown type for Tines, then To implement this type of pool in Tines
- extends RPool
- Main functions to implement for 2-token pools are: calcOutByIn, calcInByOut, calcCurrentPriceWithoutFee,
  calcOutByInReal (see RPool source for details). All functions should be implemented to work as fast as possible. It's better to use as less bigint math in them as possible. 
- TEST 1: to check that for random pools and swaps calcOutByIn and calcInByOut return opposite values.
  Typical precision should be lesser than 1e-9, in the most bad edge cases lesser than 1e-4
- TEST 2: to check that for random pools and swaps calcOutByIn and calcOutByInReal return close values.
  Precision should be lesser than 1e-9 or lesser than 10 for small values
- TEST 3: to check that for random pools calcCurrentPriceWithoutFee returns value close to 
  amountIn/amountOut for some small amountIn in function calcOutByIn. Precision 1e-3

### Extractor

Write an Extractor for the liquidity provider
- Examples: UniV2Extractor, UniV3Extractor
- Has a cache of known pools, downloads them all at startup
- Listens logs and updates pool states according to them. It is better to spare RPC calls and use only logs info
  for this. Examples: UniV2Extractor, UniV3Extractor
- TEST 4: Launch Extractor in fork. For random pools and random amountIn check that calcOutByIn and 
  calcOutByInReal return the same value as real pool output. Precision should be lesser than 1e-9, 
  in the most bad edge cases lesser than 1e-4. Check that gas consumption is close to returned by calcOutByIn
- TEST 5: Launch Extractor in fork. For random pools check that calcCurrentPriceWithoutFee 
  returns value close to amountIn/amountOut for some small amountIn for real pool. Precision 1e-3
- TEST 6: Launch Extractor1 in blockNumber1 fork. Update pools logs for blocks blockNumber2-blockNumber1.
  Launch Extractor2 in blockNumber2 fork. Check that Extractor1 and Extractor2 return the same pools

### Route Processor

If the liquidity provider has pools of unknown type for RP, then to support new pool type in RP

### After new liquidity provider is integrated in our code

FINAL COMPLEX TEST 7: Launch Extractor in fork. For random tokenIn, tokenOut, amountIn
make route with SwapAPI and simulate it using RP. Check that output is close to expected by Tines.
Routes should use new liquidity provider pools 
