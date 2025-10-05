import { SwapService, type AddLiquidityParams, type SwapExactInputSingleParams, type SwapExactInputParams } from './swap-service';
import { QuoteService, type SwapQuote } from './quote-service';
import { RouterService, type SwapRoute } from './router-service';
import type { Token } from '../types/token.type';

/**
 * Main service for SushiSwap operations on Stellar
 * This is the primary interface for interacting with the DEX
 */
export class SushiStellarService {
  private swapService: SwapService;
  private quoteService: QuoteService;
  private routerService: RouterService;

  constructor() {
    this.swapService = new SwapService();
    this.quoteService = new QuoteService();
    this.routerService = new RouterService(this.quoteService);
  }

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(
    userAddress: string,
    params: AddLiquidityParams
  ): Promise<{ txHash: string; liquidity: bigint }> {
    return await this.swapService.addLiquidity(userAddress, params);
  }

  /**
   * Execute a single-hop swap
   */
  async swapExactInputSingle(
    userAddress: string,
    params: SwapExactInputSingleParams
  ): Promise<{ txHash: string; amountOut: bigint }> {
    return await this.swapService.swapExactInputSingle(userAddress, params);
  }

  /**
   * Execute a multi-hop swap
   */
  async swapExactInput(
    userAddress: string,
    params: SwapExactInputParams
  ): Promise<{ txHash: string; amountOut: bigint }> {
    return await this.swapService.swapExactInput(userAddress, params);
  }

  /**
   * Get quote for single-hop swap
   */
  async getQuoteExactInputSingle(params: {
    tokenIn: string;
    tokenOut: string;
    fee: number;
    amountIn: bigint;
    sqrtPriceLimitX96?: bigint;
  }): Promise<SwapQuote> {
    return await this.quoteService.getQuoteExactInputSingle(params);
  }

  /**
   * Get quote for multi-hop swap
   */
  async getQuoteExactInput(params: {
    path: string[];
    fees: number[];
    amountIn: bigint;
  }): Promise<SwapQuote> {
    return await this.quoteService.getQuoteExactInput(params);
  }

  /**
   * Find the best route between two tokens
   */
  async findBestRoute(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: bigint
  ): Promise<SwapRoute | null> {
    return await this.routerService.findBestRoute(tokenIn, tokenOut, amountIn);
  }

  /**
   * Execute swap with automatic routing
   */
  async swapWithRouting(
    userAddress: string,
    tokenIn: Token,
    tokenOut: Token,
    amountIn: bigint,
    slippage: number = 0.005
  ): Promise<{ txHash: string; amountOut: bigint; route: SwapRoute }> {
    // Find best route
    const route = await this.findBestRoute(tokenIn, tokenOut, amountIn);
    if (!route) {
      throw new Error('No route found between tokens');
    }

    // Calculate minimum amount out with slippage protection
    const amountOutMinimum = this.routerService.calculateAmountOutMinimum(
      route.amountOut, 
      slippage
    );

    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes

    let result: { txHash: string; amountOut: bigint };

    if (route.routeType === 'direct') {
      // Single-hop swap
      result = await this.swapExactInputSingle(userAddress, {
        tokenIn: route.path[0].contract,
        tokenOut: route.path[1].contract,
        fee: route.fees[0],
        recipient: userAddress,
        deadline,
        amountIn,
        amountOutMinimum
      });
    } else {
      // Multi-hop swap
      result = await this.swapExactInput(userAddress, {
        path: route.path.map(token => token.contract),
        fees: route.fees,
        recipient: userAddress,
        deadline,
        amountIn,
        amountOutMinimum
      });
    }

    return {
      ...result,
      route
    };
  }

  /**
   * Get all available pools between two tokens
   */
  async getPoolsBetween(tokenA: Token, tokenB: Token) {
    return await this.quoteService.findPoolsBetween(tokenA, tokenB);
  }

  /**
   * Format route for display
   */
  formatRoute(route: SwapRoute): string {
    return this.routerService.formatRouteForUser(route);
  }
}

/**
 * Create a SushiStellarService instance
 */
export function createSushiStellarService(): SushiStellarService {
  return new SushiStellarService();
}
