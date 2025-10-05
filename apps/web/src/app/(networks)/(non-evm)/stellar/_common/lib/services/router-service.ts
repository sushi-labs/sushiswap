import type { Token } from '../types/token.type';
import type { PoolBasicInfo } from '../soroban/pool-helpers';
import { QuoteService, type SwapQuote } from './quote-service';

/**
 * Swap route information
 */
export interface SwapRoute {
  path: Token[];
  pools: PoolBasicInfo[];
  fees: number[];
  amountIn: bigint;
  amountOut: bigint;
  priceImpact: number;
  routeType: 'direct' | 'multihop';
}

/**
 * Service for smart routing and finding optimal swap paths
 */
export class RouterService {
  private quoteService: QuoteService;
  private poolCache: Map<string, PoolBasicInfo> = new Map();
  private lastCacheUpdate: number = 0;
  private readonly CACHE_DURATION = 60000; // 1 minute

  constructor(quoteService: QuoteService) {
    this.quoteService = quoteService;
  }

  /**
   * Find the best route between two tokens
   */
  async findBestRoute(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: bigint
  ): Promise<SwapRoute | null> {
    console.log(`Finding best route for ${tokenIn.code} → ${tokenOut.code}`);

    // Step 1: Find all available pools
    const availablePools = await this.findAllPools(tokenIn, tokenOut);

    // Step 2: Get quotes from each pool
    const quotes = await this.getQuotesFromPools(availablePools, amountIn);

    // Step 3: Find multi-hop routes if direct pools don't exist
    if (quotes.length === 0) {
      console.log('No direct pool, checking multi-hop routes...');
      const multiHopQuotes = await this.findMultiHopRoutes(tokenIn, tokenOut, amountIn);
      quotes.push(...multiHopQuotes);
    }

    // Step 4: Return best quote
    const bestQuote = this.selectBestQuote(quotes);
    if (!bestQuote) {
      return null;
    }

    return {
      path: bestQuote.route,
      pools: bestQuote.pools || [],
      fees: bestQuote.fees,
      amountIn: amountIn,
      amountOut: bestQuote.amountOut,
      priceImpact: bestQuote.priceImpact,
      routeType: bestQuote.routeType
    };
  }

  /**
   * Find all pools between two tokens (checking all fee tiers)
   */
  private async findAllPools(tokenA: Token, tokenB: Token): Promise<PoolBasicInfo[]> {
    return await this.quoteService.findPoolsBetween(tokenA, tokenB);
  }

  /**
   * Get quotes from all available pools
   */
  private async getQuotesFromPools(pools: PoolBasicInfo[], amountIn: bigint): Promise<SwapQuote[]> {
    const quotes: SwapQuote[] = [];

    for (const pool of pools) {
      try {
        const quote = await this.quoteService.getQuoteExactInputSingle({
          tokenIn: pool.tokenA.contract,
          tokenOut: pool.tokenB.contract,
          fee: pool.fee,
          amountIn: amountIn
        });

        quotes.push({
          amountOut: quote.amountOut,
          path: [pool.tokenA, pool.tokenB],
          fees: [pool.fee],
          priceImpact: quote.priceImpact,
          routeType: 'direct'
        });
      } catch (e) {
        console.error(`Failed to get quote from pool ${pool.address}`);
      }
    }

    return quotes;
  }

  /**
   * Find multi-hop routes through intermediate tokens
   */
  private async findMultiHopRoutes(
    tokenIn: Token, 
    tokenOut: Token, 
    amountIn: bigint
  ): Promise<SwapQuote[]> {
    const quotes: SwapQuote[] = [];

    // Common intermediate tokens (usually native token or stablecoins)
    const INTERMEDIATE_TOKENS: Token[] = [
      { 
        code: 'XLM',
        issuer: 'native',
        contract: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
        name: 'Stellar Lumens',
        org: 'Stellar Development Foundation',
        decimals: 7
      },
      // Could add USDC, etc.
    ];

    for (const intermediate of INTERMEDIATE_TOKENS) {
      // Skip if intermediate is same as input/output
      if (intermediate.contract === tokenIn.contract ||
          intermediate.contract === tokenOut.contract) {
        continue;
      }

      // Find pools for first hop (tokenIn → intermediate)
      const firstHopPools = await this.findAllPools(tokenIn, intermediate);

      // Find pools for second hop (intermediate → tokenOut)
      const secondHopPools = await this.findAllPools(intermediate, tokenOut);

      // Try all combinations
      for (const pool1 of firstHopPools) {
        for (const pool2 of secondHopPools) {
          try {
            // Get quote for multi-hop
            const quote = await this.getMultiHopQuote(
              [pool1, pool2],
              amountIn
            );

            quotes.push({
              amountOut: quote.amountOut,
              path: [tokenIn, intermediate, tokenOut],
              fees: [pool1.fee, pool2.fee],
              priceImpact: quote.priceImpact,
              routeType: 'multihop'
            });
          } catch (e) {
            // Quote failed
          }
        }
      }
    }

    return quotes;
  }

  /**
   * Get quote for multi-hop swap
   */
  private async getMultiHopQuote(
    pools: PoolBasicInfo[], 
    amountIn: bigint
  ): Promise<SwapQuote> {
    const path = pools.flatMap(pool => [pool.tokenA.contract, pool.tokenB.contract]);
    const fees = pools.map(pool => pool.fee);

    const quote = await this.quoteService.getQuoteExactInput({
      path: path,
      fees: fees,
      amountIn: amountIn
    });

    return quote;
  }

  /**
   * Select best quote based on output amount
   */
  private selectBestQuote(quotes: SwapQuote[]): SwapQuote | null {
    if (quotes.length === 0) {
      return null;
    }

    // Sort by output amount (highest first)
    quotes.sort((a, b) => Number(b.amountOut - a.amountOut));

    const best = quotes[0];

    // Log why this quote was selected
    console.log(`Best route: ${best.routeType}`);
    console.log(`Output: ${best.amountOut}`);
    if (best.fees) {
      console.log(`Fees: ${best.fees.map(f => `${f/10000}%`).join(' + ')}`);
    }

    return best;
  }

  /**
   * Calculate price impact for a swap
   */
  private calculatePriceImpact(
    amountIn: bigint,
    amountOut: bigint,
    poolReserves: { reserveIn: bigint; reserveOut: bigint }
  ): number {
    // Simplified price impact calculation
    // In production, you'd use proper AMM math
    const currentPrice = Number(poolReserves.reserveOut) / Number(poolReserves.reserveIn);
    const executionPrice = Number(amountOut) / Number(amountIn);
    const priceImpact = Math.abs(currentPrice - executionPrice) / currentPrice;
    
    return priceImpact;
  }

  /**
   * Format route for user display
   */
  formatRouteForUser(route: SwapRoute): string {
    if (route.path.length === 2) {
      return `${route.path[0].code} → ${route.path[1].code}`;
    } else {
      return route.path.map(t => t.code).join(' → ');
    }
  }

  /**
   * Calculate minimum amount out with slippage protection
   */
  calculateAmountOutMinimum(amountOut: bigint, slippage: number = 0.005): bigint {
    const slippageMultiplier = BigInt(Math.floor((1 - slippage) * 1000000));
    return (amountOut * slippageMultiplier) / BigInt(1000000);
  }
}
