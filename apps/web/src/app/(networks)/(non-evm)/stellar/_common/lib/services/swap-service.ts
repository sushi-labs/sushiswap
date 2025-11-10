import * as StellarSdk from '@stellar/stellar-sdk'
import { DEFAULT_TIMEOUT } from '@stellar/stellar-sdk/contract'
import { getRouterContractClient } from '../soroban/client'
import {
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from '../soroban/contract-addresses'
import { tickToSqrtPrice } from '../soroban/pool-helpers'
import {
  submitViaRawRPC,
  waitForTransaction,
} from '../soroban/rpc-transaction-helpers'
import { extractErrorMessage } from '../utils/error-helpers'

/**
 * Parameters for adding liquidity
 */
export interface AddLiquidityParams {
  poolAddress: string
  token0Amount: string
  token1Amount: string
  tickLower: number
  tickUpper: number
  recipient?: string
  deadline?: number
}

/**
 * Parameters for single-hop swap
 */
export interface SwapExactInputSingleParams {
  tokenIn: string
  tokenOut: string
  fee: number
  recipient: string
  deadline: number
  amountIn: bigint
  amountOutMinimum: bigint
  sqrtPriceLimitX96?: bigint
}

/**
 * Parameters for multi-hop swap
 */
export interface SwapExactInputParams {
  path: string[]
  fees: number[]
  recipient: string
  deadline: number
  amountIn: bigint
  amountOutMinimum: bigint
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
 * Service for executing swaps and liquidity operations on Stellar
 */
export class SwapService {
  private networkPassphrase: string
  private horizonUrl: string
  private sorobanRpcUrl: string

  constructor() {
    this.networkPassphrase = NETWORK_CONFIG.PASSPHRASE
    this.horizonUrl = NETWORK_CONFIG.HORIZON_URL
    this.sorobanRpcUrl = NETWORK_CONFIG.SOROBAN_URL
  }

  /**
   * Execute a single-hop swap (exactly like stellar-auth-test)
   */
  async swapExactInputSingle(
    userAddress: string,
    params: SwapExactInputSingleParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    const routerContractClient = getRouterContractClient({
      contractId: CONTRACT_ADDRESSES.ROUTER,
      publicKey: userAddress,
    })

    const assembledTransaction = await routerContractClient.swap_exact_input(
      {
        params: {
          sender: userAddress,
          path: [params.tokenIn, params.tokenOut],
          fees: [params.fee],
          recipient: params.recipient,
          amount_in: params.amountIn,
          amount_out_minimum: params.amountOutMinimum,
          deadline: BigInt(params.deadline),
        },
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100000,
      },
    )

    // Sign the transaction - use the built transaction
    const unsignedXdr = assembledTransaction.toXDR()
    const signedXdr = await signTransaction(unsignedXdr)

    // Submit the signed XDR directly via raw RPC
    const txHash = await submitViaRawRPC(signedXdr)

    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        txHash,
        amountOut: BigInt(params.amountOutMinimum),
      }
    } else {
      throw new Error(extractErrorMessage(result.error))
    }
  }

  /**
   * Execute a multi-hop swap (exactly like stellar-auth-test)
   */
  async swapExactInput(
    userAddress: string,
    params: SwapExactInputParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    const routerContractClient = getRouterContractClient({
      contractId: CONTRACT_ADDRESSES.ROUTER,
      publicKey: userAddress,
    })
    // Ensure fees are proper u32 numbers (not bigints)
    const feesAsNumbers = params.fees.map((fee) => Number(fee))

    const assembledTransaction = await routerContractClient.swap_exact_input(
      {
        params: {
          sender: userAddress,
          path: params.path,
          fees: feesAsNumbers,
          recipient: params.recipient,
          amount_in: params.amountIn,
          amount_out_minimum: params.amountOutMinimum,
          deadline: BigInt(params.deadline),
        },
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100000,
      },
    )

    // Sign the transaction
    const unsignedXdr = assembledTransaction.toXDR()
    const signedXdr = await signTransaction(unsignedXdr)

    // Submit the signed XDR directly via raw RPC (same as single-hop)
    const txHash = await submitViaRawRPC(signedXdr)
    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        txHash,
        amountOut: BigInt(params.amountOutMinimum),
      }
    } else {
      throw new Error(extractErrorMessage(result.error))
    }
  }

  /**
   * Calculate liquidity amount from token amounts using Uniswap V3 math
   * Based on the working stellar-auth-test implementation
   */
  private async calculateLiquidityFromAmounts(
    poolAddress: string,
    amount0: number,
    amount1: number,
    tickLower: number,
    tickUpper: number,
  ): Promise<string> {
    try {
      // Get current sqrt price from pool using helper
      const currentSqrtPriceX96 = await this.getCurrentSqrtPrice(poolAddress)

      // Calculate sqrt prices for tick boundaries
      const sqrtPriceLowerX96 = tickToSqrtPrice(tickLower)
      const sqrtPriceUpperX96 = tickToSqrtPrice(tickUpper)

      // Scale desired amounts to contract units (Stellar uses 7 decimals)
      const scaledAmount0 = BigInt(Math.floor(amount0 * 1e7))

      // Calculate liquidity from token0 amount only
      // This ensures the user gets exactly the token0 amount they requested
      // The contract will then calculate the exact token1 amount needed
      const liquidity = this.calculateLiquidityFromAmount0(
        scaledAmount0,
        currentSqrtPriceX96,
        sqrtPriceLowerX96,
        sqrtPriceUpperX96,
      )

      // Convert to string for contract call
      return liquidity.toString()
    } catch (_error) {
      // Fallback to a simple calculation
      const avgAmount = Math.sqrt(amount0 * amount1)
      const fallback = Math.floor(avgAmount * 1e7).toString()
      return fallback
    }
  }

  /**
   * Get current sqrt price from pool (exactly like stellar-auth-test)
   */
  private async getCurrentSqrtPrice(poolAddress: string): Promise<bigint> {
    try {
      const simulationAccount = new StellarSdk.Account(
        'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
        '0',
      )
      const getSlot0Op = StellarSdk.Operation.invokeContractFunction({
        contract: poolAddress,
        function: 'slot0',
        args: [],
      })

      const tx = new StellarSdk.TransactionBuilder(simulationAccount, {
        fee: '100',
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(getSlot0Op)
        .setTimeout(30)
        .build()

      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'simulateTransaction',
        params: { transaction: tx.toXDR() },
      }

      const response = await fetch(this.sorobanRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      const result = await response.json()
      if (result.result?.results?.[0]) {
        const slot0Val = StellarSdk.xdr.ScVal.fromXDR(
          result.result.results[0].xdr,
          'base64',
        )
        const slot0Map = this.scMapToObject(slot0Val)

        // Try to get sqrt_price_x96 directly
        if (slot0Map.sqrt_price_x96) {
          const u256Val = slot0Map.sqrt_price_x96
          if (u256Val && typeof u256Val.u256 === 'function') {
            const parts = u256Val.u256()

            // Access _attributes directly (camelCase properties) - exactly like stellar-auth-test
            const attrs = parts._attributes || parts
            const hiHi = BigInt(attrs.hiHi || '0')
            const hiLo = BigInt(attrs.hiLo || '0')
            const loHi = BigInt(attrs.loHi || '0')
            const loLo = BigInt(attrs.loLo || '0')

            const sqrtPrice =
              (hiHi << 192n) | (hiLo << 128n) | (loHi << 64n) | loLo
            return sqrtPrice
          }
        }

        // Fallback: if sqrt_price_x96 parsing failed, use tick to calculate it
        if (slot0Map.tick !== undefined) {
          const tickVal = slot0Map.tick
          const tick =
            typeof tickVal.i32 === 'function' ? tickVal.i32() : Number(tickVal)
          const calculatedSqrtPrice = tickToSqrtPrice(tick)
          return calculatedSqrtPrice
        }
      }
    } catch (_error) {
      // Error fetching sqrt price from pool
    }

    throw new Error(
      'Could not fetch current price from pool. Please make sure a pool is selected.',
    )
  }

  /**
   * Calculate liquidity from token0 amount (exactly like stellar-auth-test)
   * Note: The contract rounds UP when calculating amounts, which can increase the amount by ~1-2 units per division
   * We need to account for this by reducing our liquidity request slightly
   */
  private calculateLiquidityFromAmount0(
    scaledAmount0: bigint,
    currentSqrtPriceX96: bigint,
    sqrtPriceLowerX96: bigint,
    sqrtPriceUpperX96: bigint,
  ): bigint {
    // The contract does two operations with rounding up:
    // 1. product = mul_div_rounding_up(L << 96, price_diff, upper)
    // 2. amount = div_rounding_up(product, lower_or_current)
    // Each rounding up can add up to 1, so total rounding can be ~2
    // But in practice with large numbers, it's proportional to the divisions

    if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
      // Below range
      // Work backwards from: amount0 = ((L << 96) * (upper - lower) / upper) / lower
      // Without rounding: L = (amount0 * lower * upper) / ((upper - lower) * 2^96)
      const numerator = scaledAmount0 * sqrtPriceLowerX96 * sqrtPriceUpperX96
      const denominator = (sqrtPriceUpperX96 - sqrtPriceLowerX96) << 96n
      // Reduce liquidity by ~0.2% to account for rounding up (empirical adjustment)
      const liquidity = numerator / denominator
      const adjustedLiquidity = (liquidity * 998n) / 1000n // Reduce by 0.2%
      return adjustedLiquidity
    } else if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
      // Above range: only token1 needed, return 0
      return BigInt(0)
    } else {
      // Within range
      // Contract does: product = (L << 96) * (upper - current) / upper, then amount0 = product / current
      // Reverse step 2: product = amount0 * current
      // Reverse step 1: L = (product * upper) / ((upper - current) << 96)
      // Combined: L = (amount0 * current * upper) / ((upper - current) << 96)
      const numerator = scaledAmount0 * currentSqrtPriceX96 * sqrtPriceUpperX96
      const denominator = (sqrtPriceUpperX96 - currentSqrtPriceX96) << 96n
      const liquidity = numerator / denominator
      return liquidity
    }
  }

  /**
   * Convert SCVal map to object (exactly like stellar-auth-test)
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
   * Convert SC symbol to string (exactly like stellar-auth-test)
   */
  private scSymbolToString(symbol: any): string {
    if (!symbol) return ''
    const raw = symbol.toString()
    const match = raw.match(/Symbol\((.*)\)/)
    return match ? match[1] : raw
  }

  /**
   * Get pool configuration (exactly like stellar-auth-test)
   */
  private getPoolConfig(poolAddress: string): any {
    if (!poolAddress) {
      return null
    }

    // For now, we'll use a simple mapping based on the pool addresses we know
    // In a real implementation, this would query the pool contract or factory
    const poolConfigs: { [key: string]: any } = {
      CCFVXLUK5MME6ZAGRXW2LN3DOEEVTKHRZXXR543VYPPLHS5GGQXTLSAR: {
        token0: {
          address: 'CCKYIGXKXH7PBIUQ4D54OIB3ZB4QKCJEAG3M7PW3KDKT5RTGMXNK2PUT',
          symbol: 'HYPE',
        },
        token1: {
          address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
          symbol: 'XLM',
        },
        fee: 3000,
        spacing: 60,
        description: '💱 HYPE-XLM Pool (0.3% fee)',
        currentTick: 0,
        liquidity: 100000000000,
      },
      CBER55TGRM6254WNL4BQR3MXEBUCF3B7TDIDCUUWYMUKIDOIWQXYBWBE: {
        token0: {
          address: 'CAGOAU6G6JHAWABEGGUXQXOC4FMFZSY4SDKCVW47FS4ULYHEI5TSGJAT',
          symbol: 'SUSHI',
        },
        token1: {
          address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
          symbol: 'XLM',
        },
        fee: 3000,
        spacing: 60,
        description: '💱 SUSHI-XLM Pool (0.3% fee)',
        currentTick: 0,
        liquidity: 100000000000,
      },
      CAEVOVIMNYOIKLRPU3RFRIQZJAGBCLS272UP5YJXNC7LXJPGRRMMZT3Z: {
        token0: {
          address: 'CA75JDQYO5RQC6H5USNYV3J26MGS476XTYSUDMEONHLEZCKOBSTEWZ5W',
          symbol: 'STELLA',
        },
        token1: {
          address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
          symbol: 'XLM',
        },
        fee: 3000,
        spacing: 60,
        description: '💱 STELLA-XLM Pool (0.3% fee)',
        currentTick: 0,
        liquidity: 100000000000,
      },
      CDTGQEVFKWRCMPL54PUZM4B3BLBFIM7RX5MBZCKSMLYVZDIDDXJE3XWM: {
        token0: {
          address: 'CAGOAU6G6JHAWABEGGUXQXOC4FMFZSY4SDKCVW47FS4ULYHEI5TSGJAT',
          symbol: 'SUSHI',
        },
        token1: {
          address: 'CCKYIGXKXH7PBIUQ4D54OIB3ZB4QKCJEAG3M7PW3KDKT5RTGMXNK2PUT',
          symbol: 'HYPE',
        },
        fee: 3000,
        spacing: 60,
        description: '💱 SUSHI-HYPE Pool (0.3% fee)',
        currentTick: 0,
        liquidity: 100000000000,
      },
    }

    if (poolConfigs[poolAddress]) {
      return poolConfigs[poolAddress]
    }

    // Fallback for unknown pools
    return {
      token0: { address: '', symbol: 'TOKEN0' },
      token1: { address: '', symbol: 'TOKEN1' },
      fee: 3000,
      spacing: 60,
      description: 'Unknown Pool',
    }
  }
}
