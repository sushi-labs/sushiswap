import {
  getPoolContractClient,
  getRouterContractClient,
} from '../soroban/client'
import { DEFAULT_TIMEOUT } from '../soroban/constants'
import {
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from '../soroban/contract-addresses'
import { getFees, getPool } from '../soroban/dex-factory-helpers'
import type { PoolBasicInfo } from '../soroban/pool-helpers'
import type { Token } from '../types/token.type'

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
  private networkPassphrase: string
  private sorobanRpcUrl: string
  private routerAddress: string

  constructor() {
    this.networkPassphrase = NETWORK_CONFIG.PASSPHRASE
    this.sorobanRpcUrl = NETWORK_CONFIG.SOROBAN_URL
    this.routerAddress = CONTRACT_ADDRESSES.ROUTER
  }

  /**
   * Simulate transaction via direct RPC call
   */
  private async simulateViaRawRPC(txXdr: string): Promise<any> {
    const rpcRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'simulateTransaction',
      params: {
        transaction: txXdr,
      },
    }

    const response = await fetch(this.sorobanRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rpcRequest),
    })

    const result = await response.json()

    if (result.error) {
      throw new Error(result.error.message || 'RPC simulation failed')
    }

    return result.result
  }

  /**
   * Get quote for single-hop swap using pool state
   */
  async getQuoteExactInputSingle(
    params: QuoteExactInputSingleParams,
  ): Promise<SwapQuote | null> {
    try {
      // Get pool info to calculate quote from current state
      const poolInfo = await getPool({
        tokenA: params.tokenIn,
        tokenB: params.tokenOut,
        fee: params.fee,
      })

      if (!poolInfo) {
        // Pool not found - return null to indicate no quote available
        return null
      }

      // Use pool client directly (no more dynamic import needed)
      const poolClient = getPoolContractClient({
        contractId: poolInfo,
      })

      // Get pool slot0 for current price
      const { result: slot0 } = await poolClient.slot0()

      // Get liquidity
      const { result: liquidity } = await poolClient.liquidity()

      // Calculate output amount using UniswapV3 math
      // This is a simplified calculation - in production you'd want exact math
      const sqrtPriceX96 = BigInt(
        slot0.sqrt_price_x96 || slot0.fee_protocol || 0,
      )

      if (sqrtPriceX96 === 0n || BigInt(liquidity) === 0n) {
        // Pool has no liquidity - return null to indicate no quote available
        return null
      }

      // Simple estimation: apply fee and use current price
      // For more accurate quotes, implement full UniswapV3 swap math
      const feeMultiplier = BigInt(1000000 - params.fee)
      const amountInAfterFee = (params.amountIn * feeMultiplier) / 1000000n

      // Use pool price to estimate output
      // Note: This is simplified - real implementation should use tick math
      const estimatedOutput = amountInAfterFee

      return {
        amountOut: estimatedOutput,
        path: [params.tokenIn, params.tokenOut],
        fees: [params.fee],
        priceImpact: 0,
        routeType: 'direct',
      }
    } catch (_error) {
      // Fallback: simple fee-based estimation
      const feeMultiplier = (1000000 - params.fee) / 1000000
      const estimatedOutput = BigInt(
        Math.floor(Number(params.amountIn) * feeMultiplier),
      )

      return {
        amountOut: estimatedOutput,
        path: [params.tokenIn, params.tokenOut],
        fees: [params.fee],
        priceImpact: 0,
        routeType: 'direct',
      }
    }
  }

  /**
   * Get quote for multi-hop swap
   */
  async getQuoteExactInput(params: QuoteExactInputParams): Promise<SwapQuote> {
    try {
      const routerContractClient = getRouterContractClient({
        contractId: CONTRACT_ADDRESSES.ROUTER,
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
    }

    // Fallback: estimate with fees
    let estimatedOutput = BigInt(params.amountIn.toString())
    for (const fee of params.fees) {
      const feeMultiplier = (1000000 - fee) / 1000000
      estimatedOutput = BigInt(
        Math.floor(Number(estimatedOutput) * feeMultiplier),
      )
    }

    return {
      amountOut: estimatedOutput,
      path: params.path,
      fees: params.fees,
      priceImpact: 0,
      routeType: 'multihop',
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
    for (const fee of getFees()) {
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

  /**
   * Convert SCVal map to object (like demo app)
   */
  private scMapToObject(scVal: any): any {
    if (!scVal || typeof scVal.map !== 'function') {
      return {}
    }
    const entries = scVal.map()
    const result: any = {}
    entries.forEach((entry: any) => {
      const keyVal = entry.key()
      let key = 'unknown'
      if (keyVal && typeof keyVal.sym === 'function') {
        key = this.scSymbolToString(keyVal.sym())
      }
      result[key] = entry.val()
    })
    return result
  }

  /**
   * Convert SC symbol to string (like demo app)
   */
  private scSymbolToString(symbol: any): string {
    if (!symbol) return ''
    const raw = symbol.toString()
    const match = raw.match(/Symbol\((.*)\)/)
    return match ? match[1] : raw
  }

  /**
   * Convert ScVal to i128 (like demo app)
   */
  private scValToI128(scVal: any): bigint {
    if (!scVal || typeof scVal.i128 !== 'function') {
      return 0n
    }
    const parts = scVal.i128()
    const hi = BigInt(parts.hi().toString())
    const lo = BigInt(parts.lo().toString())
    return (hi << 64n) + lo
  }
}
