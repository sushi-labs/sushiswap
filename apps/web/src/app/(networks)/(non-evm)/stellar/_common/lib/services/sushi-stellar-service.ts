import { getPoolInfoFromContract } from '../soroban/pool-helpers'
import {
  decreaseLiquidity,
  increaseLiquidity,
  mintPosition,
} from '../soroban/position-manager-helpers'
import type { Token } from '../types/token.type'
import { type CollectParams, positionService } from './position-service'
import { QuoteService, type SwapQuote } from './quote-service'
import { RouterService, type SwapRoute } from './router-service'
import {
  type AddLiquidityParams,
  type SwapExactInputParams,
  type SwapExactInputSingleParams,
  SwapService,
} from './swap-service'

/**
 * Main service for SushiSwap operations on Stellar
 * This is the primary interface for interacting with the DEX
 */
export class SushiStellarService {
  private swapService: SwapService
  private quoteService: QuoteService
  private routerService: RouterService

  constructor() {
    this.swapService = new SwapService()
    this.quoteService = new QuoteService()
    this.routerService = new RouterService(this.quoteService)
  }

  /**
   * Add liquidity using Position Manager
   * Automatically increases liquidity on existing position or creates new one
   */
  async addLiquidity(
    userAddress: string,
    params: AddLiquidityParams,
    signTransaction: (xdr: string) => Promise<string>,
    signAuthEntry: (entryPreimageXdr: string) => Promise<string>,
  ): Promise<{ txHash: string; tokenId: number; liquidity: bigint }> {
    // Convert string amounts to bigint
    const amount0 = BigInt(
      Math.floor(
        Number.parseFloat(params.token0Amount) * 10 ** params.token0Decimals,
      ),
    )
    const amount1 = BigInt(
      Math.floor(
        Number.parseFloat(params.token1Amount) * 10 ** params.token1Decimals,
      ),
    )

    const deadline = BigInt(
      params.deadline || Math.floor(Date.now() / 1000) + 300,
    )

    // Always fetch pool info from contract (no more dynamic import needed)
    const poolConfig = await getPoolInfoFromContract(params.poolAddress)
    if (!poolConfig) {
      throw new Error('Pool config not found')
    }

    // Check if user has existing position for this pool with same tick range

    // Fetch user positions
    const positions = await positionService.getUserPositionsWithFees({
      userAddress,
    })

    // Find position with matching pool tokens, tick range, AND fee tier
    const existingPosition = positions.find((pos) => {
      const tokensMatch =
        (pos.token0 === poolConfig.token0.address &&
          pos.token1 === poolConfig.token1.address) ||
        (pos.token0 === poolConfig.token1.address &&
          pos.token1 === poolConfig.token0.address)

      const ticksMatch =
        pos.tickLower === params.tickLower && pos.tickUpper === params.tickUpper

      const feeMatches = pos.fee === poolConfig.fee

      return tokensMatch && ticksMatch && feeMatches
    })

    if (existingPosition) {
      // Increase liquidity on existing position - NO try/catch here!
      const result = await increaseLiquidity({
        tokenId: existingPosition.tokenId,
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: BigInt(0), // TODO: Add slippage protection
        amount1Min: BigInt(0),
        deadline,
        operator: userAddress,
        sourceAccount: userAddress,
        signTransaction,
        signAuthEntry,
      })

      return {
        txHash: result.hash,
        tokenId: existingPosition.tokenId,
        liquidity: result.liquidity,
      }
    } else {
    }

    // No existing position found - mint new one
    const result = await mintPosition({
      poolAddress: params.poolAddress,
      recipient: params.recipient || userAddress,
      tickLower: params.tickLower,
      tickUpper: params.tickUpper,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: BigInt(0), // TODO: Add slippage protection
      amount1Min: BigInt(0),
      deadline,
      sourceAccount: userAddress,
      signTransaction,
      signAuthEntry,
    })

    return {
      txHash: result.hash,
      tokenId: result.tokenId,
      liquidity: result.liquidity,
    }
  }

  /**
   * Execute a single-hop swap
   */
  async swapExactInputSingle(
    userAddress: string,
    params: SwapExactInputSingleParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    return await this.swapService.swapExactInputSingle(
      userAddress,
      params,
      signTransaction,
    )
  }

  /**
   * Execute a multi-hop swap
   */
  async swapExactInput(
    userAddress: string,
    params: SwapExactInputParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    return await this.swapService.swapExactInput(
      userAddress,
      params,
      signTransaction,
    )
  }

  /**
   * Get quote for single-hop swap
   */
  async getQuoteExactInputSingle(params: {
    tokenIn: string
    tokenOut: string
    fee: number
    amountIn: bigint
    sqrtPriceLimitX96?: bigint
  }): Promise<SwapQuote | null> {
    return await this.quoteService.getQuoteExactInputSingle(params)
  }

  /**
   * Get quote for multi-hop swap
   */
  async getQuoteExactInput(params: {
    path: string[]
    fees: number[]
    amountIn: bigint
  }): Promise<SwapQuote> {
    const quote = await this.quoteService.getQuoteExactInput(params)
    if (!quote) {
      throw new Error('Failed to get quote for multi-hop swap')
    }
    return quote
  }

  /**
   * Find the best route between two tokens
   */
  async findBestRoute(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: bigint,
  ): Promise<SwapRoute | null> {
    return await this.routerService.findBestRoute(tokenIn, tokenOut, amountIn)
  }

  /**
   * Execute swap with automatic routing
   */
  async swapWithRouting(
    userAddress: string,
    tokenIn: Token,
    tokenOut: Token,
    amountIn: bigint,
    signTransaction: (xdr: string) => Promise<string>,
    slippage = 0.005,
  ): Promise<{ txHash: string; amountOut: bigint; route: SwapRoute }> {
    // Find best route
    const route = await this.findBestRoute(tokenIn, tokenOut, amountIn)
    if (!route) {
      throw new Error('No route found between tokens')
    }

    // Calculate minimum amount out with slippage protection
    const amountOutMinimum = this.routerService.calculateAmountOutMinimum(
      route.amountOut,
      slippage,
    )

    const deadline = Math.floor(Date.now() / 1000) + 300 // 5 minutes

    let result: { txHash: string; amountOut: bigint }

    if (route.routeType === 'direct') {
      // Single-hop swap
      result = await this.swapExactInputSingle(
        userAddress,
        {
          tokenIn: route.path[0].contract,
          tokenOut: route.path[1].contract,
          fee: route.fees[0],
          recipient: userAddress,
          deadline,
          amountIn,
          amountOutMinimum,
        },
        signTransaction,
      )
    } else {
      // Multi-hop swap
      result = await this.swapExactInput(
        userAddress,
        {
          path: route.path.map((token) => token.contract),
          fees: route.fees,
          recipient: userAddress,
          deadline,
          amountIn,
          amountOutMinimum,
        },
        signTransaction,
      )
    }

    return {
      ...result,
      route,
    }
  }

  /**
   * Get all available pools between two tokens
   */
  async getPoolsBetween(tokenA: Token, tokenB: Token) {
    return await this.quoteService.findPoolsBetween(tokenA, tokenB)
  }

  /**
   * Format route for display
   */
  formatRoute(route: SwapRoute): string {
    return this.routerService.formatRouteForUser(route)
  }

  // Position Management Methods

  /**
   * Get all positions owned by a user
   */
  async getUserPositions(userAddress: string) {
    return await positionService.getUserPositionsWithFees({ userAddress })
  }

  /**
   * Get a specific position by token ID
   */
  async getPosition(tokenId: number) {
    return await positionService.getPosition(tokenId)
  }

  /**
   * Increase liquidity in an existing position
   */
  async increaseLiquidity(
    userAddress: string,
    params: {
      tokenId: number
      token0Amount: string
      token1Amount: string
      token0Decimals: number
      token1Decimals: number
      deadline?: number
    },
    signTransaction: (xdr: string) => Promise<string>,
    signAuthEntry: (entryPreimageXdr: string) => Promise<string>,
  ) {
    const amount0 = BigInt(
      Math.floor(
        Number.parseFloat(params.token0Amount) * 10 ** params.token0Decimals,
      ),
    )
    const amount1 = BigInt(
      Math.floor(
        Number.parseFloat(params.token1Amount) * 10 ** params.token1Decimals,
      ),
    )

    return await increaseLiquidity({
      tokenId: params.tokenId,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: BigInt(0), // TODO: Add slippage protection
      amount1Min: BigInt(0),
      deadline: BigInt(params.deadline || Math.floor(Date.now() / 1000) + 300),
      operator: userAddress,
      sourceAccount: userAddress,
      signTransaction,
      signAuthEntry,
    })
  }

  /**
   * Decrease liquidity from an existing position
   */
  async decreaseLiquidity(
    userAddress: string,
    params: {
      tokenId: number
      liquidity: bigint
      deadline?: number
    },
    signTransaction: (xdr: string) => Promise<string>,
    signAuthEntry: (entryPreimageXdr: string) => Promise<string>,
  ) {
    return await decreaseLiquidity({
      tokenId: params.tokenId,
      liquidity: params.liquidity,
      amount0Min: BigInt(0), // TODO: Add slippage protection
      amount1Min: BigInt(0),
      deadline: BigInt(params.deadline || Math.floor(Date.now() / 1000) + 300),
      operator: userAddress,
      sourceAccount: userAddress,
      signTransaction,
      signAuthEntry,
    })
  }

  /**
   * Collect fees from a position
   */
  async collectFees(
    params: CollectParams,
    signTransaction: (xdr: string) => Promise<string>,
    signAuthEntry: (entryPreimageXdr: string) => Promise<string>,
  ) {
    return await positionService.collectFees(
      params,
      signTransaction,
      signAuthEntry,
    )
  }

  /**
   * Get uncollected fees for a position
   */
  async getUncollectedFees(tokenId: number) {
    return await positionService.getUncollectedFees(tokenId)
  }
}

/**
 * Create a SushiStellarService instance
 */
export function createSushiStellarService(): SushiStellarService {
  return new SushiStellarService()
}
