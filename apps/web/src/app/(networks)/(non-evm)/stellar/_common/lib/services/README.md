# Stellar DEX Services

This directory contains the core services for interacting with SushiSwap on the Stellar network. These services provide a clean, type-safe interface for swap operations, liquidity management, and smart routing.

## Services Overview

### SushiStellarService

The main service class that provides a unified interface for all DEX operations.

```typescript
import { createSushiStellarService } from "./sushi-stellar-service";

const service = createSushiStellarService();

// Add liquidity
await service.addLiquidity("USER_ADDRESS", {
  poolAddress: "POOL_ADDRESS",
  token0Amount: "100",
  token1Amount: "50",
  tickLower: -60000,
  tickUpper: 60000,
});

// Swap with automatic routing
await service.swapWithRouting(
  "USER_ADDRESS",
  tokenIn,
  tokenOut,
  BigInt(1000000000), // 100 tokens
  0.005 // 0.5% slippage
);
```

### SwapService

Handles direct swap and liquidity operations.

**Key Methods:**

- `addLiquidity()` - Add liquidity to a pool
- `swapExactInputSingle()` - Execute single-hop swap
- `swapExactInput()` - Execute multi-hop swap

### QuoteService

Provides quote functionality for swaps.

**Key Methods:**

- `getQuoteExactInputSingle()` - Get single-hop quote
- `getQuoteExactInput()` - Get multi-hop quote
- `findPoolsBetween()` - Find available pools between tokens

### RouterService

Handles smart routing and path finding.

**Key Methods:**

- `findBestRoute()` - Find optimal swap route
- `formatRouteForUser()` - Format route for display
- `calculateAmountOutMinimum()` - Calculate slippage protection

## React Hooks

The services are wrapped in React Query hooks for easy integration with React components:

### useAddLiquidity

```typescript
import { useAddLiquidity } from "../hooks/swap";

const addLiquidityMutation = useAddLiquidity();

await addLiquidityMutation.mutateAsync({
  userAddress: "USER_ADDRESS",
  poolAddress: "POOL_ADDRESS",
  token0Amount: "100",
  token1Amount: "50",
  tickLower: -60000,
  tickUpper: 60000,
});
```

### useSwapWithRouting

```typescript
import { useSwapWithRouting } from "../hooks/swap";

const swapMutation = useSwapWithRouting();

await swapMutation.mutateAsync({
  userAddress: "USER_ADDRESS",
  tokenIn: XLM_TOKEN,
  tokenOut: HYPEA_TOKEN,
  amountIn: BigInt(1000000000),
  slippage: 0.005,
});
```

### useGetQuote

```typescript
import { useGetQuote } from "../hooks/swap";

const { data: quote, isLoading } = useGetQuote({
  tokenIn: XLM_TOKEN,
  tokenOut: HYPEA_TOKEN,
  amountIn: BigInt(1000000000),
});
```

### usePoolsBetween

```typescript
import { usePoolsBetween } from "../hooks/swap";

const { data: pools } = usePoolsBetween({
  tokenA: XLM_TOKEN,
  tokenB: HYPEA_TOKEN,
});
```

## Types

### Token

```typescript
interface Token {
  code: string;
  issuer: string;
  contract: string;
  name: string;
  org: string;
  domain?: string;
  icon?: string;
  decimals: number;
}
```

### AddLiquidityParams

```typescript
interface AddLiquidityParams {
  poolAddress: string;
  token0Amount: string;
  token1Amount: string;
  tickLower: number;
  tickUpper: number;
  recipient?: string;
  deadline?: number;
}
```

### SwapQuote

```typescript
interface SwapQuote {
  amountOut: bigint;
  path: string[];
  fees: number[];
  priceImpact: number;
  routeType: "direct" | "multihop";
}
```

## Usage Examples

### Complete Swap Flow

```typescript
import { useGetQuote, useSwapWithRouting } from "../hooks/swap";

function SwapComponent() {
  const [tokenIn, setTokenIn] = useState(XLM_TOKEN);
  const [tokenOut, setTokenOut] = useState(HYPEA_TOKEN);
  const [amountIn, setAmountIn] = useState(BigInt(1000000000));

  // Get quote
  const { data: quote, isLoading } = useGetQuote({
    tokenIn,
    tokenOut,
    amountIn,
  });

  // Execute swap
  const swapMutation = useSwapWithRouting();

  const handleSwap = async () => {
    if (!quote) return;

    try {
      const result = await swapMutation.mutateAsync({
        userAddress: "USER_ADDRESS",
        tokenIn,
        tokenOut,
        amountIn,
        slippage: 0.005,
      });

      console.log("Swap successful:", result);
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  return (
    <div>
      {isLoading && <p>Getting quote...</p>}
      {quote && (
        <div>
          <p>Amount out: {quote.amountOut}</p>
          <p>Route: {quote.path.map((t) => t.code).join(" → ")}</p>
          <button onClick={handleSwap}>
            {swapMutation.isPending ? "Swapping..." : "Swap"}
          </button>
        </div>
      )}
    </div>
  );
}
```

### Add Liquidity Flow

```typescript
import { useAddLiquidity, usePoolsBetween } from "../hooks/swap";

function AddLiquidityComponent() {
  const [tokenA, setTokenA] = useState(XLM_TOKEN);
  const [tokenB, setTokenB] = useState(HYPEA_TOKEN);

  // Get available pools
  const { data: pools } = usePoolsBetween({
    tokenA,
    tokenB,
  });

  // Add liquidity
  const addLiquidityMutation = useAddLiquidity();

  const handleAddLiquidity = async () => {
    if (!pools?.[0]) return;

    try {
      await addLiquidityMutation.mutateAsync({
        userAddress: "USER_ADDRESS",
        poolAddress: pools[0].address,
        token0Amount: "100",
        token1Amount: "50",
        tickLower: -60000,
        tickUpper: 60000,
      });
    } catch (error) {
      console.error("Add liquidity failed:", error);
    }
  };

  return (
    <div>
      {pools && pools.length > 0 && (
        <button onClick={handleAddLiquidity}>
          {addLiquidityMutation.isPending ? "Adding..." : "Add Liquidity"}
        </button>
      )}
    </div>
  );
}
```

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  const result = await service.swapWithRouting(
    userAddress,
    tokenIn,
    tokenOut,
    amountIn
  );
  console.log("Swap successful:", result);
} catch (error) {
  if (error.message.includes("InsufficientLiquidity")) {
    console.error("Not enough liquidity in pool");
  } else if (error.message.includes("DeadlineExpired")) {
    console.error("Transaction deadline expired");
  } else {
    console.error("Swap failed:", error.message);
  }
}
```

## Configuration

The services use the existing Stellar configuration from `../soroban/constants`:

- `NETWORK_PASSPHRASE` - Stellar network passphrase
- `RPC_URL` - Soroban RPC endpoint
- `HORIZON_URL` - Horizon API endpoint

## Architecture

The services follow a modular architecture:

- **Services**: Core business logic for DEX operations
- **Hooks**: React Query wrappers for React integration
- **Types**: TypeScript interfaces and types
- **Utils**: Helper functions (in separate utils directory)

This design allows for easy testing, maintenance, and extension of functionality while maintaining consistency with the existing codebase patterns.
