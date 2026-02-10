# Stellar Swap Routing

Graph-based swap routing system for finding optimal paths between tokens on Stellar.

## Overview

This routing system uses a **graph search algorithm** (DFS with backtracking) to find the best swap route between two tokens. It's similar to the Aptos implementation but adapted for Stellar's concentrated liquidity (Uniswap V3 style) pools.

## How It Works

### 1. **Build Pool Graph** (`use-pool-graph.ts`)

The system starts by building a graph of available liquidity pools:

- **Vertices**: Each pool is represented as a vertex containing:
  - Token pair information
  - Reserves (approximated from liquidity and price)
  - Fee tier
  - Pool address
  - Current sqrt price and tick

- **Edges**: Connections between tokens that have a pool

```typescript
// Example graph structure:
// XLM ←→ HYPE (0.3% fee pool)
// XLM ←→ SUSHI (0.3% fee pool)
// SUSHI ←→ HYPE (0.3% fee pool)

tokenGraph = {
  "XLM": ["HYPE", "SUSHI"],
  "HYPE": ["XLM", "SUSHI"],
  "SUSHI": ["XLM", "HYPE"]
}
```

### 2. **Find All Routes** (`get-best-route.ts`)

Using **Depth-First Search (DFS)** with backtracking, the system:

1. Starts at the input token
2. Explores all adjacent tokens (connected via pools)
3. Recursively searches until reaching the output token
4. Tracks visited tokens to avoid cycles
5. Limits search depth to prevent excessive computation

```typescript
// Example route search:
// Input: SUSHI → STELLA
// Direct route: No pool exists
// Multi-hop routes found:
//   1. SUSHI → XLM → STELLA (2 hops)
//   2. SUSHI → HYPE → XLM → STELLA (3 hops)
```

### 3. **Calculate Output Amounts** (`compute-exact-output.ts`)

For each route found, calculate the output amount by:

1. Starting with the input amount
2. For each hop in the route:
   - Apply fee deduction
   - Calculate output using constant product formula (simplified V3)
   - Use output as input for next hop

```typescript
// Example calculation for SUSHI → XLM → STELLA:
// Step 1: SUSHI (100) → XLM
//   - Apply 0.3% fee: 100 * 0.997 = 99.7
//   - Calculate output: (99.7 * xlm_reserve) / (sushi_reserve + 99.7)
//   - Result: 50 XLM
//
// Step 2: XLM (50) → STELLA
//   - Apply 0.3% fee: 50 * 0.997 = 49.85
//   - Calculate output: (49.85 * stella_reserve) / (xlm_reserve + 49.85)
//   - Result: 48 STELLA
```

### 4. **Calculate Price Impact** (`compute-price-impact.ts`)

Price impact measures how much the swap affects the pool price:

```typescript
// Price Impact = (expected_output - actual_output) / expected_output * 100
// 
// Where:
// - expected_output = input * mid_price (price without slippage)
// - actual_output = calculated output (with slippage)
```

### 5. **Select Best Route**

After calculating all possible routes, the system selects the one with:
- **Highest output amount** (primary criteria)
- **Lowest price impact** (secondary, if outputs are similar)

## Usage

### In React Components

```typescript
import { useBestRoute } from '~stellar/swap/lib/hooks'

function SwapComponent() {
  const { route, isLoading } = useBestRoute({
    tokenIn: sushiToken,
    tokenOut: stellaToken,
    amountIn: BigInt('100000000'), // 10 SUSHI (7 decimals)
  })

  if (isLoading) return <div>Finding best route...</div>

  if (!route) return <div>No route found</div>

  return (
    <div>
      <div>Path: {route.tokens.map(t => t.code).join(' → ')}</div>
      <div>Output: {route.amountOut.toString()}</div>
      <div>Price Impact: {route.priceImpact.toFixed(2)}%</div>
      <div>Fees: {route.fees.map(f => `${f / 10000}%`).join(', ')}</div>
    </div>
  )
}
```

### Programmatically

```typescript
import { getBestRoute } from '~stellar/swap/lib/swap-get-route'

// First, build the pool graph
const { vertices, tokenGraph } = await buildPoolGraph()

// Then find the best route
const route = getBestRoute({
  amountIn: BigInt('100000000'),
  vertices,
  tokenGraph,
  tokenIn: sushiToken,
  tokenOut: stellaToken,
  maxHops: 3, // Allow up to 3 hops
})

if (route) {
  console.log('Best route:', route.route.join(' → '))
  console.log('Output:', route.amountOut.toString())
}
```

## Performance Considerations

### Graph Size Limitation

For performance, the graph builder only queries a **subset of known tokens**:

```typescript
const knownTokens = [
  XLM, HYPE, SUSHI, STELLA, HYPED, HYPEE
]
```

This limits the number of pools queried to: `n * (n-1) / 2 * fee_tiers`

Example: 6 tokens × 3 fee tiers = ~45 pool queries

### Route Search Depth

The search is limited to **3 hops maximum** (4 tokens in path):
- 1 hop: Direct swap (e.g., SUSHI → XLM)
- 2 hops: One intermediate (e.g., SUSHI → HYPE → XLM)
- 3 hops: Two intermediates (e.g., SUSHI → HYPE → STELLA → XLM)

This prevents exponential growth in computation time while still finding most optimal routes.

### Caching

- **Pool graph**: Cached for 5 minutes
- **Routes**: Cached for 10 seconds
- Both use React Query for automatic cache management

## Differences from Uniswap V3

This implementation uses **simplified reserve calculations** for routing:

```typescript
// Simplified (used here):
reserve = liquidity / sqrt_price

// Actual V3:
// - Liquidity is distributed across tick ranges
// - Need to iterate through ticks during swap
// - More complex sqrt price math
```

This simplification is acceptable because:
1. **Routing only needs relative comparisons** between paths
2. Actual swap execution uses the router contract with proper V3 math
3. Performance is prioritized over precision for route finding

## File Structure

```
swap-get-route/
├── types.ts                    # Type definitions
├── compute-amount-with-fee.ts  # Fee deduction logic
├── compute-exact-output.ts     # Output calculation
├── compute-price-impact.ts     # Price impact calculation
├── get-best-route.ts           # Main routing algorithm
├── use-pool-graph.ts           # Pool graph builder
├── index.ts                    # Public exports
└── README.md                   # This file
```

## Future Improvements

1. **Dynamic Pool Discovery**: Query all pools from factory instead of hardcoded list
2. **Liquidity Filtering**: Only include pools with sufficient liquidity
3. **Gas Optimization**: Consider gas costs in route selection
4. **Split Routes**: Support splitting orders across multiple paths
5. **Real-time Updates**: Subscribe to pool state changes for live routing

## References

- [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
- [Aptos Routing Implementation](https://github.com/sushi-labs/sushiswap/blob/master/apps/web/src/app/(networks)/(non-evm)/aptos/swap/lib/swap-get-route/)
- [Graph Algorithms: DFS](https://en.wikipedia.org/wiki/Depth-first_search)

