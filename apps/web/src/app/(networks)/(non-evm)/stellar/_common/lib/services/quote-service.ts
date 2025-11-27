import { DEFAULT_TIMEOUT } from '~stellar/_common/lib/soroban/constants'
import {
  getFees,
  getPool,
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
      const { result } = await routerContractClient.quote_exact_input_single(
        {
          params: {
            token_in: params.tokenIn,
            token_out: params.tokenOut,
            fee: params.fee,
            sqrt_price_limit_x96:
              params.sqrtPriceLimitX96 ?? BigInt(2) ** 128n - 1n, // max u128
            amount_in: params.amountIn,
            // Unused by the contract function implementation, but required
            amount_out_minimum: 0n,
            deadline: BigInt(Math.floor(Date.now() / 1000) + 600), // 10 minutes
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
            deadline: BigInt(Math.floor(Date.now() / 1000) + 600), // 10 minutes
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

    // Check each common fee tier
    for (const fee of await getFees()) {
      try {
        const pool = await getPool({
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
