import { getStablePrice } from '../hooks/price/get-stable-price'
import type { PoolInfo, PoolLiquidity, PoolReserves } from '../types/pool.type'
import type { Token } from '../types/token.type'
import { formatTokenAmount } from '../utils/formatters'
import { type OracleHints, fetchOracleHints } from '../utils/slot-hint-helpers'
import { getPoolLensContractClient } from './client'
import { contractAddresses } from './contracts'
import { discoverAllPools } from './dex-factory-helpers'
import { isPoolInitialized } from './pool-initialization'
import {
  getTokenBalance,
  getTokenByCode,
  getTokenByContract,
  getTokenMetadata,
} from './token-helpers'

export interface PoolBasicInfo {
  address: string
  tokenA: Token
  tokenB: Token
  fee: number
}

export interface ContractPoolData {
  token0: Token
  token1: Token
  fee: number
  description?: string
  reserve0: bigint
  reserve1: bigint
  liquidity: bigint
  sqrtPriceX96: bigint
  tickSpacing: number
  tick: number
}

/**
 * Query pool infor directly from contract
 */
export async function getPoolInfoFromContract(
  address: string,
): Promise<ContractPoolData | null> {
  try {
    const poolLensContractClient = getPoolLensContractClient({
      contractId: contractAddresses.POOL_LENS,
      // No publicKey needed for read-only pool info queries
    })

    // Query pool for token addresses and fee
    const poolResult = (
      await poolLensContractClient.get_pool_data_with_bal({
        pool: address,
      })
    ).result.result

    if (poolResult.tag === 'NotFound') {
      console.warn(`Pool not found at address: ${address}`)
      return null
    }

    const [poolData] = poolResult.values
    const { reserve0, reserve1 } = poolData
    const {
      token0: token0Address,
      token1: token1Address,
      fee,
      liquidity,
      sqrt_price_x96: sqrtPriceX96,
      tick_spacing: tickSpacing,
      tick,
    } = poolData.state

    // Get token codes from token list
    const token0FromList = getTokenByContract(token0Address)
    const token1FromList = getTokenByContract(token1Address)

    // If tokens are not in the static list, fetch metadata from chain
    let token0: Token
    let token1: Token

    if (token0FromList) {
      token0 = token0FromList
    } else {
      // Fetch token metadata from chain
      try {
        const metadata = await getTokenMetadata(token0Address)
        token0 = {
          contract: token0Address,
          code: metadata.symbol || token0Address.slice(0, 8),
          name: metadata.name || metadata.symbol || token0Address.slice(0, 8),
          decimals: metadata.decimals || 7,
          issuer: '',
          org: 'unknown',
          isStable: false,
        }
      } catch (error) {
        console.warn(`Failed to fetch metadata for token ${token0Address}:`, error)
        token0 = {
          contract: token0Address,
          code: token0Address.slice(0, 8),
          name: token0Address.slice(0, 8),
          decimals: 7,
          issuer: '',
          org: 'unknown',
          isStable: false,
        }
      }
    }

    if (token1FromList) {
      token1 = token1FromList
    } else {
      // Fetch token metadata from chain
      try {
        const metadata = await getTokenMetadata(token1Address)
        token1 = {
          contract: token1Address,
          code: metadata.symbol || token1Address.slice(0, 8),
          name: metadata.name || metadata.symbol || token1Address.slice(0, 8),
          decimals: metadata.decimals || 7,
          issuer: '',
          org: 'unknown',
          isStable: false,
        }
      } catch (error) {
        console.warn(`Failed to fetch metadata for token ${token1Address}:`, error)
        token1 = {
          contract: token1Address,
          code: token1Address.slice(0, 8),
          name: token1Address.slice(0, 8),
          decimals: 7,
          issuer: '',
          org: 'unknown',
          isStable: false,
        }
      }
    }

    return {
      token0,
      token1,
      fee,
      description: `${token0.code}-${token1.code} (${fee / 10000}% fee)`,
      reserve0,
      reserve1,
      liquidity,
      sqrtPriceX96,
      tickSpacing,
      tick,
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
 * @deprecated Use useTopPools query instead
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
    const contractPoolInfo = await getPoolInfoFromContract(address)

    if (!contractPoolInfo) {
      console.warn(
        `⚠️ Could not fetch pool configuration for: ${address} - Skipping`,
      )
      return null
    }

    // Skip pools with no liquidity (empty/inactive pools)
    if (
      !contractPoolInfo.liquidity ||
      !contractPoolInfo.reserve0 ||
      !contractPoolInfo.reserve1
    ) {
      return null
    }

    const liquidity: PoolLiquidity = {
      amount: contractPoolInfo.liquidity.toString(),
      formatted: formatTokenAmount(contractPoolInfo.liquidity, 7, 2),
    }

    const reserves: PoolReserves = {
      token0: {
        code: contractPoolInfo.token0.code,
        amount: contractPoolInfo.reserve0.toString(),
        formatted: formatTokenAmount(
          contractPoolInfo.reserve0,
          contractPoolInfo.token0.decimals,
          2,
        ),
      },
      token1: {
        code: contractPoolInfo.token1.code,
        amount: contractPoolInfo.reserve1.toString(),
        formatted: formatTokenAmount(
          contractPoolInfo.reserve1,
          contractPoolInfo.token1.decimals,
          2,
        ),
      },
    }

    return {
      name: `${contractPoolInfo.token0.code}/${contractPoolInfo.token1.code}`,
      address: address,
      token0: contractPoolInfo.token0,
      token1: contractPoolInfo.token1,
      fee: contractPoolInfo.fee,
      tickSpacing: contractPoolInfo.tickSpacing,
      liquidity,
      reserves,
      sqrtPriceX96: contractPoolInfo.sqrtPriceX96,
      tick: contractPoolInfo.tick,
    }
  } catch (error) {
    // Pools with no liquidity or missing data are expected
    console.warn(`⚠️ Skipping pool ${address} (likely empty or inactive)`, error)
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
  const poolLensContractClient = getPoolLensContractClient({
    contractId: contractAddresses.POOL_LENS,
  })
  const poolDataResult = (
    await poolLensContractClient.get_pool_data({
      pool: poolAddress,
    })
  ).result.result

  if (poolDataResult.tag === 'NotFound') {
    throw new Error(`Pool not found at address: ${poolAddress}`)
  }
  const [poolData] = poolDataResult.values
  return poolData.sqrt_price_x96
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

  if (currentSqrtPriceX96 <= sqrtPriceLowerX96) {
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
  if (currentSqrtPriceX96 <= sqrtPriceLowerX96) {
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
