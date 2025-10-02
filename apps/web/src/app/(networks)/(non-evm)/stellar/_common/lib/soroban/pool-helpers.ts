import { Operation, TransactionBuilder } from '@stellar/stellar-sdk'
import { Client } from '@sushiswap/stellar/pools/hypea-xlm'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import type { PoolInfo, PoolLiquidity, PoolReserves } from '../types/pool.type'
import type { Token } from '../types/token.type'
import { formatTokenAmount } from '../utils/formatters'
import { SorobanClient } from './client'
import { DEFAULT_TIMEOUT, SIMULATION_ACCOUNT } from './constants'
import { CONTRACT_ADDRESSES, getPoolConfig } from './contract-addresses'
import { handleResult } from './handle-result'
import { getTokenBalance } from './token-helpers'

export interface PoolBasicInfo {
  address: string
  tokenA: Token
  tokenB: Token
  fee: number
}

/**
 * Get all available pools with real-time data
 * @returns Array of pool information with actual liquidity and reserves
 */
export async function getAllPools(): Promise<PoolInfo[]> {
  // const pools = await getPoolsForBaseTokenPairs()
  const pools = Object.values(CONTRACT_ADDRESSES.POOLS)
  const poolPromises = pools.map((address) => {
    return getPoolInfo(address)
  })

  return (await Promise.all(poolPromises)).filter((pool) => pool !== null)
}

/**
 * Create a pool client for a specific pool address
 * @param address - The pool contract address
 * @returns A pool client instance
 */
function createPoolClient(address: string): Client {
  return new Client({
    contractId: address,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  })
}

/**
 * Get comprehensive pool information with all data populated
 * @param address - The pool contract address
 * @returns Complete pool information with all fields populated
 */
export async function getPoolInfo(address: string): Promise<PoolInfo | null> {
  const { token0, token1 } = getPoolConfig(address)
  if (!token0 || !token1) {
    throw new Error(`No configuration found for pool: ${address}`)
  }

  try {
    // Fetch liquidity and reserves
    const [liquidity, reserves] = await Promise.all([
      fetchPoolLiquidity(address),
      fetchPoolReserves(address),
    ])

    console.log('liquidity and reserves', { liquidity, reserves })

    if (!liquidity) {
      throw new Error(`No liquidity found for pool: ${address}`)
    }
    if (!reserves) {
      throw new Error(`No reserves found for pool: ${address}`)
    }

    // Calculate TVL (Total Value Locked)
    // TODO: actually calculate it using real USD values
    let tvl = 0
    const isXLM = (code: string) => code === 'XLM'

    if (isXLM(token0.code) || isXLM(token1.code)) {
      // If one token is XLM, use XLM as the base price
      const xlmPrice = 0.12 // Approximate XLM price in USD
      const otherTokenPrice = 0.05 // Approximate price for HYPEa/HYPEb tokens

      if (isXLM(token0.code)) {
        tvl =
          Number(reserves.token0.amount) * xlmPrice +
          Number(reserves.token1.amount) * otherTokenPrice
      } else {
        tvl =
          Number(reserves.token0.amount) * otherTokenPrice +
          Number(reserves.token1.amount) * xlmPrice
      }
    } else {
      // For non-XLM pairs, use a lower estimated value
      const estimatedTokenPrice = 0.05 // Placeholder price in USD
      tvl =
        (Number(reserves.token0.amount) + Number(reserves.token1.amount)) *
        estimatedTokenPrice
    }

    return {
      name: `${token0.code}/${token1.code}`,
      address: address,
      token0,
      token1,
      fee: getPoolConfig(address).fee,
      tickSpacing: 60, // TODO: This should be the tick spacing
      liquidity,
      reserves,
      tvl: tvl,
    }
  } catch (error) {
    console.error(`Failed to fetch data for pool ${address}:`, error)
    return null
  }
}

export async function fetchPoolLiquidity(
  poolAddress: string,
): Promise<PoolLiquidity | null> {
  try {
    const liqTx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: poolAddress,
          function: 'liquidity',
          args: [],
        }),
      )
      .setTimeout(DEFAULT_TIMEOUT)
      .build()

    // Simulate and parse results
    const result = await SorobanClient.simulateTransaction(liqTx)
    if ('result' in result && result.result) {
      const simResult = result.result as any

      // The retval contains the ScVal data directly
      if (simResult.retval) {
        // Check if it's a u128 ScVal
        if (
          simResult.retval._switch?.name === 'scvU128' &&
          simResult.retval._arm === 'u128'
        ) {
          const liquidity = simResult.retval._value._attributes.lo._value
          const liquidityFormatted = (
            Number.parseInt(liquidity) / 10000000
          ).toFixed(2)

          return { amount: liquidity, formatted: liquidityFormatted }
        }
      }
    }
    return null
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
    const { token0, token1 } = getPoolConfig(address)
    if (!token0 || !token1) {
      throw new Error(`No configuration found for pool: ${address}`)
    }

    // Fetch token balances using token-helpers
    const [balance0, balance1] = await Promise.all([
      getTokenBalance(address, token0.contract),
      getTokenBalance(address, token1.contract),
    ])

    console.log({ balance0, balance1 })

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
 * Add liquidity to a pool
 * @param address - The pool contract address
 * @param params - Liquidity parameters
 * @returns Mint result
 */
export async function addLiquidity({
  address,
  recipient,
  tickLower,
  tickUpper,
  amount,
}: {
  address: string
  recipient: string
  tickLower: number
  tickUpper: number
  amount: bigint
}): Promise<{
  tokenId: bigint
  liquidity: bigint
  amount0: bigint
  amount1: bigint
}> {
  const client = createPoolClient(address)

  const mintResponse = await client.mint({
    recipient,
    tick_lower: tickLower,
    tick_upper: tickUpper,
    amount: amount,
  })

  const mintResult = handleResult(mintResponse.result as any) as [
    bigint,
    bigint,
  ]

  return {
    tokenId: 0n, // This would need to be tracked separately
    liquidity: amount,
    amount0: mintResult[0],
    amount1: mintResult[1],
  }
}

/**
 * Remove liquidity from a pool
 * @param address - The pool contract address
 * @param params - Liquidity removal parameters
 * @returns Burn result
 */
export async function removeLiquidity({
  address,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenId,
  liquidity,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  amount0Min,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  amount1Min,
  recipient,
}: {
  address: string
  tokenId: bigint
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
}): Promise<{
  amount0: bigint
  amount1: bigint
}> {
  const client = createPoolClient(address)

  // For now, we'll use a simplified approach
  // TODO(drew): In practice, you'd need to determine the tick range from the tokenId
  // Using tokenId to determine tick range (simplified)
  const tickLower = -887272 // Minimum tick
  const tickUpper = 887272 // Maximum tick

  // TODO(drew): Log tokenId for debugging (in a real implementation, you'd use this to look up position data)
  console.log(`Removing liquidity for tokenId: ${tokenId}`)

  // TODO(drew): Validate minimum amounts (in a real implementation)
  if (amount0Min < 0n || amount1Min < 0n) {
    throw new Error('Minimum amounts must be non-negative')
  }

  const burnResponse = await client.burn({
    owner: recipient,
    tick_lower: tickLower,
    tick_upper: tickUpper,
    amount: liquidity,
  })

  const burnResult = handleResult(burnResponse.result as any) as [
    bigint,
    bigint,
  ]

  return {
    amount0: burnResult[0],
    amount1: burnResult[1],
  }
}

/**
 * Collect fees from a position
 * @param address - The pool contract address
 * @param params - Fee collection parameters
 * @returns Collect result
 */
export async function collectFees({
  address,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenId,
  amount0Max,
  amount1Max,
  recipient,
}: {
  address: string
  tokenId: bigint
  amount0Max: bigint
  amount1Max: bigint
  recipient: string
}): Promise<{
  amount0: bigint
  amount1: bigint
}> {
  const client = createPoolClient(address)

  // For now, we'll use a simplified approach
  // In practice, you'd need to determine the tick range from the tokenId
  // Using tokenId to determine tick range (simplified)
  const tickLower = -887272 // Minimum tick
  const tickUpper = 887272 // Maximum tick

  // TODO(drew): Log tokenId for debugging (in a real implementation, you'd use this to look up position data)
  console.log(`Collecting fees for tokenId: ${tokenId}`)

  // TODO(drew): Validate maximum amounts (in a real implementation)
  if (amount0Max < 0n || amount1Max < 0n) {
    throw new Error('Maximum amounts must be non-negative')
  }

  const collectResponse = await client.collect({
    recipient,
    tick_lower: tickLower,
    tick_upper: tickUpper,
    amount0_requested: amount0Max,
    amount1_requested: amount1Max,
  })

  const collectResult = handleResult(collectResponse.result as any) as [
    bigint,
    bigint,
  ]

  return {
    amount0: collectResult[0],
    amount1: collectResult[1],
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
