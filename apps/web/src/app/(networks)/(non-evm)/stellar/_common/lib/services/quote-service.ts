import { addMinutes } from 'date-fns'
import {
  DEFAULT_TIMEOUT,
  getSqrtPriceLimitForSwap,
} from '~stellar/_common/lib/soroban/constants'
import {
  getFees,
  getPoolDirectSDK,
} from '~stellar/_common/lib/soroban/dex-factory-helpers'
import type { PoolBasicInfo } from '~stellar/_common/lib/soroban/pool-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { contractAddresses } from '../soroban'
import { getRouterContractClient } from '../soroban/client'

/**
 * Quote parameters for single-hop swap
 */
export interface QuoteExactInputSingleParams {
  tokenIn: string
  tokenOut: string
  fee: number
  amountIn: bigint
  sqrtPriceLimitX96?: bigint
}

/**
 * Quote parameters for multi-hop swap
 */
export interface QuoteExactInputParams {
  path: string[]
  fees: number[]
  amountIn: bigint
}

/**
 * Swap quote result
 */
export interface SwapQuote {
  amountOut: bigint
  path: string[]
  fees: number[]
  priceImpact: number
  routeType: 'direct' | 'multihop'
}

/**
 * Service for getting swap quotes on Stellar
 */
export class QuoteService {
  /**
   * Get quote for single-hop swap using pool state
   */
  async getQuoteExactInputSingle(
    params: QuoteExactInputSingleParams,
  ): Promise<SwapQuote | null> {
    try {
      const routerContractClient = getRouterContractClient({
        contractId: contractAddresses.ROUTER,
        // No publicKey needed for read-only quote queries
      })

      // Calculate the correct sqrt price limit based on swap direction
      // In pools: token0 < token1 (ordered by decoded bytes, not string comparison)
      // - zeroForOne (token0 -> token1): price decreases, use MIN_SQRT_RATIO + 1
      // - oneForZero (token1 -> token0): price increases, use MAX_SQRT_RATIO - 1
      const sqrtPriceLimit =
        params.sqrtPriceLimitX96 ??
        getSqrtPriceLimitForSwap(params.tokenIn, params.tokenOut)

      const { result } = await routerContractClient.quote_exact_input_single(
        {
          params: {
            token_in: params.tokenIn,
            token_out: params.tokenOut,
            fee: params.fee,
            sqrt_price_limit_x96: sqrtPriceLimit,
            amount_in: params.amountIn,
            // Unused by the contract function implementation, but required
            amount_out_minimum: 0n,
            deadline: BigInt(
              Math.floor(addMinutes(new Date(), 10).valueOf() / 1000),
            ),
            sender: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', // Zero address for quote
            recipient:
              'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', // Zero address for quote
          },
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100,
        },
      )

      if (result.isErr()) {
        throw new Error(
          `Single-hop quote simulation failed: ${result.unwrapErr().message}`,
        )
      }

      return {
        amountOut: result.unwrap().amount,
        path: [params.tokenIn, params.tokenOut],
        fees: [params.fee],
        priceImpact: 0, // Calculate based on pool reserves
        routeType: 'direct',
      }
    } catch (error) {
      console.error('Direct quote simulation failed:', error)
      return null
    }
  }

  /**
   * Get quote for multi-hop swap
   */
  async getQuoteExactInput(
    params: QuoteExactInputParams,
  ): Promise<SwapQuote | null> {
    try {
      const routerContractClient = getRouterContractClient({
        contractId: contractAddresses.ROUTER,
        // No publicKey needed for read-only quote queries
      })
      const { result } = await routerContractClient.quote_exact_input(
        {
          params: {
            path: params.path,
            fees: params.fees,
            amount_in: params.amountIn,
            // Unused by the contract function implementation, but required
            amount_out_minimum: 0n,
            deadline: BigInt(
              Math.floor(addMinutes(new Date(), 5).valueOf() / 1000),
            ),
            sender: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', // Zero address for quote
            recipient:
              'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', // Zero address for quote
          },
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100,
        },
      )

      if (result.isErr()) {
        throw new Error(
          `Multi-hop quote simulation failed: ${result.unwrapErr().message}`,
        )
      }

      return {
        amountOut: result.unwrap().amount,
        path: params.path,
        fees: params.fees,
        priceImpact: 0, // Calculate based on pool reserves
        routeType: 'multihop',
      }
    } catch (error) {
      console.error('Multi-hop quote simulation failed:', error)
      return null
    }
  }

  /**
   * Find all available pools between two tokens
   */
  async findPoolsBetween(
    tokenA: Token,
    tokenB: Token,
  ): Promise<PoolBasicInfo[]> {
    const pools: PoolBasicInfo[] = []
    const feeTiers = getFees()

    // Check each common fee tier
    for (const fee of feeTiers) {
      try {
        const pool = await getPoolDirectSDK({
          tokenA: tokenA.contract,
          tokenB: tokenB.contract,
          fee,
        })
        if (pool) {
          pools.push({
            address: pool,
            tokenA: tokenA,
            tokenB: tokenB,
            fee: fee,
          })
        }
      } catch (_e) {
        // No pool with this fee tier
      }
    }

    return pools
  }
}
