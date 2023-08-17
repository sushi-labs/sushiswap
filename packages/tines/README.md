# Tines

Sushiswap multirouter

## Current features:

    - Supports Trident pools and Uniswap-style ConstantProduct pools
    - Supports Stargate bridging
    - Takes gas prices into account
    - Makes both Exact In and Exact Out multiroutes
    - Routes in the multiroute can be split or merged at arbitrary points
    - Has internal pricing calculation

## Basics

The main idea of multirouting in Tines is:

    1. split input Tokens for several streams (up to 100 in the current implementation)
    2. make single route of each stream one by one using Dijkstra algorithm. Each stream changes pools' states on its way and this change should be taken into account during the next streams route
    3. merge all single routes back into one multiroute

Pros:

    - Single routing is much easier than multirouting
    - Almost all features can be supported:
        - Any kind of pools
        - Bridges
        - Metapools
        - Multitoken pools
        - Limit orders

Cons:

    - Routing many single routes is potentially resource consuming

How optimal is this approach

    Pretty much. Potentially, it finds the optimal multiroute, but with several caveats:

        - Transaction price = gas price. It is the most difficult part for optimization. It is difficult to predict when it starts to be profitable to use another pool in parallel with one that is already being used by multiroute. The absolute optimal decision for this task is almost impossible, as it is difficult to predict the gas consumption of a swap. Different pools with different tokens feed different quantities of gas in different conditions. So, Tines solves this task only approximately, and this is the first source of inoptimality. But rather a low one
        - Finite quantity of route streams. Tests show that using 100 streams makes multirouting about 0.01%-0.05% close to the optimal one, so it is a very good tradeoff between result optimality and time of processing
        - Pools imbalancing. Prices in pools that Tines uses for routing can be imbalanced. That means that there is an arbitrage opportunity. Real optimal multirouting MUST (by definition) use this opportunity, because it makes output higher. But Tines ignores such opportunities because:
            1. Really large imbalances are resolved by arbitrage bots, a regular user is unlikely to catch them
            2. Making full use of big imbalances necessitates the use of circular routes that are not supported by neigher on-chain routes (aka route processors).
            3. Small imbalances are edges with negative weights from the point of view of Dijkstra algorithm that is used by Tines for single routing. This algorithm doesn't find the optimal path in graphs that have edges with negative weights. So, such imbalances can be found and used in route occasionally, Tines doesn't guarantee finding and using all of them

## Interface

Each pool for Tines is presented by an instance that extends RPool

```
class RPool {
  // Calculates pool's output having input amount
  // amountIn - input amount
  // direction - direction of swap. true for Token 0 to Token 1, false otherwise
  // Returns {out: output amount, gasSpent: gas consumption estimation for the swap}
  // Must throw if the rest of output liquidity is lesser than minLiquidity
  abstract calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number }

  // Calculates pool's input having output amount
  // amountOut - output amount
  // direction - direction of swap. true for Token 0 to Token 1, false otherwise
  // Returns {inp: input amount, gasSpent: gas consumption estimation for the swap}
  // Must return Number.POSITIVE_INFINITY if amountOut is more than the pool can return
  abstract calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number }

  // Returns current price in the pool without taking fee into account
  // direction = true - price(Token0)/price(Token1),
  // direction = false - price(Token1)/price(Token0)
  abstract calcCurrentPriceWithoutFee(direction: boolean): number
}
```

Tines interface:

```

// Creates multiroute with amountIn input tokens
function findMultiRouteExactIn(
  from: RToken,                                 // input token
  to: RToken,                                   // output token
  amountIn: bigint | number,                    // amount of input tokens
  pools: RPool[],                               // List of pools that could be used in the multiroute
  baseTokenOrNetworks: RToken | NetworkInfo[],  // If RToken, then the main token of the network, used for gas prices
                                                // For example, WETH for Ethereum.
                                                // If NetworkInfo[], then info about all used networks.
                                                // Used for making multiroutes between several networks using bridges
  gasPrice?: number,                            // If baseTokenOrNetworks is RToken, then gasPrice - price of gas,
                                                // in baseTokens. Otherwise undefined
  streams?: number | number[]                   // Number of streams. Usually shuld be ignored.
                                                // Default value is calculated, up to 100
): MultiRoute

// The same as findMultiRouteExactIn, just creates multiroute that returns exact amountOut output tokens
function findMultiRouteExactOut(
  from: RToken,
  to: RToken,
  amountOut: bigint | number,
  pools: RPool[],
  baseTokenOrNetworks: RToken | NetworkInfo[],
  gasPrice?: number,
  streams?: number | number[]
): MultiRoute

// The same as findMultiRouteExactIn, just creates single route
function findSingleRouteExactIn(
  from: RToken,
  to: RToken,
  amountIn: bigint | number,
  pools: RPool[],
  baseTokenOrNetworks: RToken | NetworkInfo[],
  gasPrice?: number
): MultiRoute

// The same as findMultiRouteExactOut, just creates single route
function findSingleRouteExactOut(
  from: RToken,
  to: RToken,
  amountOut: bigint | number,
  pools: RPool[],
  baseTokenOrNetworks: RToken | NetworkInfo[],
  gasPrice?: number
): MultiRoute

// Calculates all token prices to baseToken, judging by pools' balances
function calcTokenPrices(pools: RPool[], baseToken: RToken): Map<RToken, number>

```

## Further improvements

    - To add route postprocessing: legs rebalancing, low-liquidity legs removing
