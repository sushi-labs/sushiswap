import { getStablePrice } from '../hooks/price/get-stable-price'
import type { PoolInfo, PoolLiquidity, PoolReserves } from '../types/pool.type'
import type { Token } from '../types/token.type'
import { formatTokenAmount } from '../utils/formatters'
import { type OracleHints, fetchOracleHints } from '../utils/slot-hint-helpers'
import { TICK_SPACINGS } from '../utils/ticks'
import { getPoolContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'
import { discoverAllPools } from './dex-factory-helpers'
import { isPoolInitialized } from './pool-initialization'
import {
  getTokenBalance,
  getTokenByCode,
  getTokenByContract,
} from './token-helpers'

export interface PoolBasicInfo {
  address: string
  tokenA: Token
  tokenB: Token
  fee: number
}

export interface PoolConfig {
  token0: { address: string; code: string }
  token1: { address: string; code: string }
  fee: number
  description?: string
}

/**
 * Query pool contract directly for its configuration
 */
export async function getPoolInfoFromContract(
  address: string,
): Promise<PoolConfig | null> {
  try {
    const poolContractClient = getPoolContractClient({
      contractId: address,
      // No publicKey needed for read-only pool info queries
    })

    // Query pool for token addresses and fee
    const [token0Address, token1Address, fee] = await Promise.all([
      poolContractClient
        .token0({
          timeoutInSeconds: 30,
          fee: 100,
        })
        .then((tx: { result: string }) => tx.result),
      poolContractClient
        .token1({
          timeoutInSeconds: 30,
          fee: 100,
        })
        .then((tx: { result: string }) => tx.result),
      poolContractClient
        .fee({
          timeoutInSeconds: 30,
          fee: 100,
        })
        .then((tx: { result: number }) => tx.result),
    ])

    // Get token codes from token list
    const token0FromList = getTokenByContract(token0Address)
    const token1FromList = getTokenByContract(token1Address)

    if (!token0FromList || !token1FromList) {
      console.warn(
        `Tokens not found in token list, using contract addresses as codes`,
      )
      return {
        token0: { address: token0Address, code: token0Address.slice(0, 8) },
        token1: { address: token1Address, code: token1Address.slice(0, 8) },
        fee,
        description: `${token0Address.slice(0, 8)}-${token1Address.slice(0, 8)} (${fee / 10000}% fee)`,
      }
    }

    return {
      token0: { address: token0Address, code: token0FromList.code },
      token1: { address: token1Address, code: token1FromList.code },
      fee,
      description: `${token0FromList.code}-${token1FromList.code} (${fee / 10000}% fee)`,
    }
  } catch (error) {
    console.error('Failed to query pool contract:', error)
    return null
  }
}
/**
 * Get all available pools with real-time data
 * Queries factory.get_pool() for all token pair + fee tier combinations
 * (Factory has no "list all pools" method, so we query each combination)
 * @returns Array of pool information with actual liquidity and reserves
 */
export async function getAllPools(): Promise<PoolInfo[]> {
  try {
    const poolAddresses = await discoverAllPools()

    if (poolAddresses.length === 0) {
      console.warn('⚠️ No pools found from factory')
      return []
    }

    // Fetch detailed info for each pool in parallel
    const poolPromises = poolAddresses.map(async (address) => {
      try {
        // First check if the pool is initialized
        const initialized = await isPoolInitialized(address)
        if (!initialized) {
          console.log(`⚠️ Skipping uninitialized pool: ${address}`)
          return null
        }

        // Then get pool info
        return await getPoolInfo(address)
      } catch (error) {
        console.error(`Error fetching pool ${address}:`, error)
        return null
      }
    })

    const results = await Promise.all(poolPromises)
    const validPools = results.filter((pool) => pool !== null)

    console.log(
      `✅ Successfully loaded ${validPools.length}/${poolAddresses.length} pools (${poolAddresses.length - validPools.length} empty/uninitialized pools skipped)`,
    )
    return validPools
  } catch (error) {
    console.error('❌ Error in getAllPools:', error)
    return []
  }
}

/**
 * Get comprehensive pool information with all data populated
 * @param address - The pool contract address
 * @returns Complete pool information with all fields populated
 */
export async function getPoolInfo(address: string): Promise<PoolInfo | null> {
  try {
    const config = await getPoolInfoFromContract(address)

    if (!config) {
      console.warn(
        `⚠️ Could not fetch pool configuration for: ${address} - Skipping`,
      )
      return null
    }

    let token0 = getTokenByCode(config.token0.code)
    let token1 = getTokenByCode(config.token1.code)

    // If tokens don't exist in base tokens, create them dynamically from the config
    if (!token0) {
      console.warn(
        `Token ${config.token0.code} not found in base tokens, creating dynamically`,
      )
      token0 = {
        code: config.token0.code,
        name: config.token0.code,
        contract: config.token0.address,
        decimals: 7,
        issuer: '',
        org: 'unknown',
      }
    }

    if (!token1) {
      console.warn(
        `Token ${config.token1.code} not found in base tokens, creating dynamically`,
      )
      token1 = {
        code: config.token1.code,
        name: config.token1.code,
        contract: config.token1.address,
        decimals: 7,
        issuer: '',
        org: 'unknown',
      }
    }

    // Fetch liquidity and reserves (both may be null for empty pools)
    const [liquidity, reserves] = await Promise.all([
      fetchPoolLiquidity(address).catch(() => null),
      fetchPoolReserves(address).catch(() => null),
    ])

    // Skip pools with no liquidity (empty/inactive pools)
    if (!liquidity || !reserves) {
      return null
    }

    // Calculate TVL (Total Value Locked)
    const token0Price = await getStablePrice(token0).catch(() => '0')
    const token1Price = await getStablePrice(token1).catch(() => '0')

    const tvl = (
      (Number(reserves.token0.amount) / 10 ** token0.decimals) *
        Number(token0Price) +
      (Number(reserves.token1.amount) / 10 ** token1.decimals) *
        Number(token1Price)
    ).toFixed(2)

    return {
      name: `${token0.code}/${token1.code}`,
      address: address,
      token0,
      token1,
      fee: config.fee,
      tickSpacing: TICK_SPACINGS[config.fee] || 60,
      liquidity,
      reserves,
      tvl,
    }
  } catch (error) {
    // Pools with no liquidity or missing data are expected
    console.warn(`⚠️ Skipping pool ${address} (likely empty or inactive)`, error)
    return null
  }
}

export async function fetchPoolLiquidity(
  poolAddress: string,
): Promise<PoolLiquidity | null> {
  try {
    const poolContractClient = getPoolContractClient({
      contractId: poolAddress,
    })
    const { result } = await poolContractClient.liquidity({
      timeoutInSeconds: DEFAULT_TIMEOUT,
      fee: 100,
    })
    return {
      amount: result.toString(),
      formatted: formatTokenAmount(result, 7, 2),
    }
  } catch (error) {
    console.error('Error fetching pool liquidity:', error)
    return null
  }
}

/**
 * Fetch pool reserves using token-helpers
 * @param address - The pool contract address
 * @returns Object with token reserves (raw and formatted)
 */
export async function fetchPoolReserves(
  address: string,
): Promise<PoolReserves | null> {
  try {
    const config = await getPoolInfoFromContract(address)

    if (!config) {
      throw new Error(`No configuration found for pool: ${address}`)
    }

    const token0 = getTokenByCode(config.token0.code)
    const token1 = getTokenByCode(config.token1.code)

    if (!token0 || !token1) {
      throw new Error(`Token configuration not found for pool: ${address}`)
    }

    // Fetch token balances using token-helpers
    // Get the balance of the pool address for each token
    const [balance0, balance1] = await Promise.all([
      getTokenBalance(address, token0.contract),
      getTokenBalance(address, token1.contract),
    ])

    // Format the reserves
    const token0ReserveFormatted = formatTokenAmount(
      balance0,
      token0.decimals,
      2,
    )
    const token1ReserveFormatted = formatTokenAmount(
      balance1,
      token1.decimals,
      2,
    )

    return {
      token0: {
        code: token0.code,
        amount: balance0.toString(),
        formatted: token0ReserveFormatted,
      },
      token1: {
        code: token1.code,
        amount: balance1.toString(),
        formatted: token1ReserveFormatted,
      },
    }
  } catch (error) {
    console.error('Error fetching pool reserves:', error)
    return null
  }
}

/**
 * This gets the balances for each token in a given pool for a given connected address
 * @param address - The pool contract Address
 * @param connectedAddress - The address of the connected wallet
 * @returns The balances for each token in the pool for the connected address
 */
export async function getPoolBalances(
  address: string,
  connectedAddress: string,
): Promise<PoolReserves | null> {
  const config = await getPoolInfoFromContract(address)

  if (!config) {
    throw new Error(`No configuration found for pool: ${address}`)
  }

  const token0 = getTokenByCode(config.token0.code)
  const token1 = getTokenByCode(config.token1.code)

  if (!token0 || !token1) {
    throw new Error(`Token configuration not found for pool: ${address}`)
  }

  const [balance0, balance1] = await Promise.all([
    getTokenBalance(connectedAddress, token0.contract),
    getTokenBalance(connectedAddress, token1.contract),
  ])

  return {
    token0: {
      code: token0.code,
      amount: balance0.toString(),
      formatted: formatTokenAmount(balance0, token0.decimals, 2),
    },
    token1: {
      code: token1.code,
      amount: balance1.toString(),
      formatted: formatTokenAmount(balance1, token1.decimals, 2),
    },
  }
}

/**
 * Calculate price from sqrt price
 * @param sqrtPriceX96 - Square root price in X96 format
 * @returns Price as a number
 */
export function calculatePriceFromSqrtPrice(sqrtPriceX96: bigint): number {
  const price = Number(sqrtPriceX96) / 2 ** 96
  return price * price
}
/**
 * Calculate tick from price
 * @param price - Price as a number
 * @returns Tick value
 */
export function calculateTickFromPrice(price: number): number {
  return Math.floor(Math.log(price) / Math.log(1.0001))
}

/**
 * Calculate price from tick
 * @param tick - Tick value
 * @returns Price as a number
 */
export function calculatePriceFromTick(tick: number): number {
  return 1.0001 ** tick
}

/**
 * Get current sqrt price from pool (exactly like stellar-auth-test)
 * @param poolAddress - The pool contract address
 * @returns Current sqrt price as BigInt
 */
export async function getCurrentSqrtPrice(
  poolAddress: string,
): Promise<bigint> {
  try {
    const poolContractClient = getPoolContractClient({
      contractId: poolAddress,
    })
    const { result: slot0Map } = await poolContractClient.slot0({
      timeoutInSeconds: 30,
      fee: 100,
    })

    // Handle field name confusion: the contract returns sqrt_price_x96 in the fee_protocol field
    let sqrtPriceX96: bigint | undefined

    if (
      slot0Map.sqrt_price_x96 &&
      typeof slot0Map.sqrt_price_x96 === 'bigint' &&
      Number(slot0Map.sqrt_price_x96) !== 0
    ) {
      sqrtPriceX96 = BigInt(slot0Map.sqrt_price_x96)
      console.log(
        'Fetched sqrt price from slot0 (correct field):',
        sqrtPriceX96.toString(),
      )
    } else if (
      slot0Map.sqrt_price_x96 &&
      Number(slot0Map.sqrt_price_x96) !== 0
    ) {
      sqrtPriceX96 = BigInt(slot0Map.sqrt_price_x96)
    }

    if (sqrtPriceX96) {
      return sqrtPriceX96
    }

    // Fallback: if sqrt_price_x96 parsing failed, use tick to calculate it
    if (slot0Map.tick !== undefined) {
      return tickToSqrtPrice(slot0Map.tick)
    }
  } catch (error) {
    console.error('Failed to fetch sqrt price from pool:', error)
    console.error(
      'Error details:',
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : '',
    )
  }
  throw new Error(
    'Could not fetch current price from pool. Please make sure a pool is selected.',
  )
}

/**
 * Convert tick to sqrt price
 * @param tick - The tick value
 * @returns Sqrt price as BigInt
 */
export function tickToSqrtPrice(tick: number): bigint {
  const sqrtPrice = Math.sqrt(1.0001 ** tick)
  return BigInt(Math.floor(sqrtPrice * 2 ** 96))
}

export function calculateActiveLiquidity({
  scaledAmount0,
  scaledAmount1,
  currentSqrtPriceX96,
  sqrtPriceLowerX96,
  sqrtPriceUpperX96,
}: {
  scaledAmount0: bigint
  scaledAmount1: bigint
  currentSqrtPriceX96: bigint
  sqrtPriceLowerX96: bigint
  sqrtPriceUpperX96: bigint
}): bigint {
  if (
    currentSqrtPriceX96 < sqrtPriceLowerX96 ||
    currentSqrtPriceX96 >= sqrtPriceUpperX96
  ) {
    // Outside range - no active liquidity
    return 0n
  } else {
    const liquidity0 = calculateLiquidityFromAmount0(
      scaledAmount0,
      currentSqrtPriceX96,
      sqrtPriceLowerX96,
      sqrtPriceUpperX96,
    )
    const liquidity1 = calculateLiquidityFromAmount1(
      scaledAmount1,
      currentSqrtPriceX96,
      sqrtPriceLowerX96,
      sqrtPriceUpperX96,
    )
    // Within range - return the lesser of the two liquidities
    return liquidity0 < liquidity1 ? liquidity0 : liquidity1
  }
}

/**
 * Calculate liquidity from token0 amount (exactly like stellar-auth-test)
 * Note: The contract rounds UP when calculating amounts, which can increase the amount by ~1-2 units per division
 * We need to account for this by reducing our liquidity request slightly
 */
export function calculateLiquidityFromAmount0(
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
    const denominator = (sqrtPriceUpperX96 - sqrtPriceLowerX96) << BigInt(96)
    // Reduce liquidity by ~0.2% to account for rounding up (empirical adjustment)
    const liquidity = numerator / denominator
    const adjustedLiquidity = (liquidity * BigInt(998)) / BigInt(1000) // Reduce by 0.2%
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
    const denominator = (sqrtPriceUpperX96 - currentSqrtPriceX96) << BigInt(96)
    const liquidity = numerator / denominator
    return liquidity
  }
}

/**
 * Calculate liquidity from token1 amount
 */
export function calculateLiquidityFromAmount1(
  scaledAmount1: bigint,
  currentSqrtPriceX96: bigint,
  sqrtPriceLowerX96: bigint,
  sqrtPriceUpperX96: bigint,
): bigint {
  if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
    // Below range: only token0 needed, return 0
    return BigInt(0)
  } else if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
    // Above range: only token1 needed
    // amount1 = liquidity * (sqrtUpper - sqrtLower) / 2^96
    // liquidity = (amount1 * 2^96) / (sqrtUpper - sqrtLower)
    const numerator = scaledAmount1 << BigInt(96)
    const denominator = sqrtPriceUpperX96 - sqrtPriceLowerX96
    const liquidity = numerator / denominator
    // Reduce by ~0.2% to account for rounding up
    const adjustedLiquidity = (liquidity * BigInt(998)) / BigInt(1000)
    return adjustedLiquidity
  } else {
    // Within range
    // amount1 = liquidity * (sqrtPrice - sqrtLower) / 2^96
    // liquidity = (amount1 * 2^96) / (sqrtPrice - sqrtLower)
    const numerator = scaledAmount1 << BigInt(96)
    const denominator = currentSqrtPriceX96 - sqrtPriceLowerX96
    const liquidity = numerator / denominator
    return liquidity
  }
}

/**
 * Calculate token amounts from liquidity (exactly like stellar-auth-test)
 * IMPORTANT: Must match contract's exact calculation with TWO separate divisions
 */
export function calculateAmountsFromLiquidity(
  liquidity: bigint,
  currentSqrtPriceX96: bigint,
  sqrtPriceLowerX96: bigint,
  sqrtPriceUpperX96: bigint,
): { amount0: bigint; amount1: bigint } {
  let amount0 = BigInt(0)
  let amount1 = BigInt(0)

  if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
    // Below range: only token0
    // Contract: product = (L << 96) * (upper - lower) / upper, then amount0 = product / lower
    const product =
      ((liquidity << BigInt(96)) * (sqrtPriceUpperX96 - sqrtPriceLowerX96)) /
      sqrtPriceUpperX96
    amount0 = product / sqrtPriceLowerX96
  } else if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
    // Above range: only token1
    // amount1 = liquidity * (sqrtUpper - sqrtLower) / 2^96
    amount1 =
      (liquidity * (sqrtPriceUpperX96 - sqrtPriceLowerX96)) /
      (BigInt(1) << BigInt(96))
  } else {
    // Within range: both tokens
    // Contract for amount0: product = (L << 96) * (upper - current) / upper, then amount0 = product / current
    const product =
      ((liquidity << BigInt(96)) * (sqrtPriceUpperX96 - currentSqrtPriceX96)) /
      sqrtPriceUpperX96
    amount0 = product / currentSqrtPriceX96
    // amount1 = liquidity * (sqrtPrice - sqrtLower) / 2^96
    amount1 =
      (liquidity * (currentSqrtPriceX96 - sqrtPriceLowerX96)) /
      (BigInt(1) << BigInt(96))
  }

  return { amount0, amount1 }
}

/**
 * Get oracle hints from pool
 * Required before any pool write operation (mint, burn, swap)
 * @param poolAddress - The pool contract address
 * @returns Object with slot and checkpoint hints
 */
export async function getOracleHints(
  poolAddress: string,
): Promise<OracleHints> {
  return await fetchOracleHints(poolAddress)
}
