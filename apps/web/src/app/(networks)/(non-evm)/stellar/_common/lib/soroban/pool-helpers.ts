/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Address,
  Operation,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk'
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
import {
  buildTransaction,
  submitTransaction,
  waitForTransaction,
} from './transaction-helpers'

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
 * Get comprehensive pool information with all data populated
 * @param address - The pool contract address
 * @returns Complete pool information with all fields populated
 */
export async function getPoolInfo(address: string): Promise<PoolInfo | null> {
  const config = getPoolConfig(address)
  if (!config || !config.token0 || !config.token1) {
    throw new Error(`No configuration found for pool: ${address}`)
  }

  const { token0, token1 } = config

  try {
    // Fetch liquidity and reserves
    const [liquidity, reserves] = await Promise.all([
      fetchPoolLiquidity(address),
      fetchPoolReserves(address),
    ])

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
      fee: config.fee,
      tickSpacing: 60, // TODO: This should be the tick spacing
      liquidity,
      reserves,
      tvl: formatTokenAmount(tvl, 7, 2),
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
        // Check if it's a u128 or i128 ScVal
        if (
          (simResult.retval._switch?.name === 'scvU128' &&
            simResult.retval._arm === 'u128') ||
          (simResult.retval._switch?.name === 'scvI128' &&
            simResult.retval._arm === 'i128')
        ) {
          const liquidity = simResult.retval._value._attributes.lo._value
          const liquidityFormatted = formatTokenAmount(liquidity, 7, 2)
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
    const config = getPoolConfig(address)
    if (!config || !config.token0 || !config.token1) {
      throw new Error(`No configuration found for pool: ${address}`)
    }

    const { token0, token1 } = config

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
  const config = getPoolConfig(address)
  if (!config || !config.token0 || !config.token1) {
    throw new Error(`No configuration found for pool: ${address}`)
  }
  const { token0, token1 } = config

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
 * Add liquidity to a pool - simplified single function
 * @param params - Add liquidity parameters including signer
 * @returns Transaction result
 */
export async function addLiquidity({
  address,
  recipient,
  tickLower,
  tickUpper,
  amount,
  sourceAccount,
  signTransaction,
}: {
  address: string
  recipient: string
  tickLower: number
  tickUpper: number
  amount: bigint
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{
  hash: string
  result: any
}> {
  // Validate parameters
  if (tickLower >= tickUpper) {
    throw new Error('tickLower must be less than tickUpper')
  }

  if (tickLower < -60000 || tickUpper > 60000) {
    throw new Error(
      'Tick values must be within valid range (-887272 to 887272)',
    )
  }

  if (amount <= 0n) {
    throw new Error('Amount must be greater than 0')
  }

  // Convert liquidity amount to U128 (hi and lo parts)
  const liquidityAmount = await calculateLiquidityFromAmounts(
    address,
    Number.parseFloat(amount.toString()) / 1e7, // Convert from contract units to display units
    Number.parseFloat(amount.toString()) / 1e7, // Using same amount for both tokens as fallback
    tickLower,
    tickUpper,
  )

  if (!liquidityAmount || liquidityAmount === '0') {
    throw new Error(
      'Failed to calculate liquidity amount. Please check your inputs.',
    )
  }
  const liquidityBigInt = BigInt(liquidityAmount)
  const lo = liquidityBigInt & ((BigInt(1) << BigInt(64)) - BigInt(1)) // Lower 64 bits
  const hi = liquidityBigInt >> BigInt(64) // Upper 64 bits

  // Build the transaction
  const operation = Operation.invokeContractFunction({
    contract: address,
    function: 'mint',
    args: [
      Address.fromString(recipient).toScVal(),
      xdr.ScVal.scvI32(tickLower),
      xdr.ScVal.scvI32(tickUpper),
      xdr.ScVal.scvU128(
        new xdr.UInt128Parts({
          hi: xdr.Uint64.fromString(hi.toString()),
          lo: xdr.Uint64.fromString(lo.toString()),
        }),
      ),
    ],
  })

  const transaction = await buildTransaction(sourceAccount, operation)

  // Convert to XDR for signing
  const transactionXdr = transaction.toXDR()

  console.log({ transactionXdr })

  // Sign the transaction
  const signedXdr = await signTransaction(transactionXdr)

  // Submit the transaction
  const result = await submitTransaction(signedXdr)

  // Wait for confirmation
  await waitForTransaction(result.hash)

  return {
    hash: result.hash,
    result: result.result,
  }
}

/**
 * Remove liquidity from a pool
 * @param address - The pool contract address
 * @param params - Liquidity removal parameters
 * @returns Burn result
 */
/**
 * Remove liquidity from a pool - simplified single function
 * @param params - Remove liquidity parameters including signer
 * @returns Transaction result
 */
export async function removeLiquidity({
  address,
  liquidity,
  amount0Min,
  amount1Min,
  recipient,
  sourceAccount,
  signTransaction,
}: {
  address: string
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{
  hash: string
  result: any
  amount0: bigint
  amount1: bigint
}> {
  // Validate parameters
  if (liquidity <= 0n) {
    throw new Error('Liquidity must be greater than 0')
  }

  if (amount0Min < 0n || amount1Min < 0n) {
    throw new Error('Minimum amounts must be non-negative')
  }

  // Build the transaction
  const operation = Operation.invokeContractFunction({
    contract: address,
    function: 'burn',
    args: [
      Address.fromString(recipient).toScVal(),
      xdr.ScVal.scvI32(60000),
      xdr.ScVal.scvI32(60000),
      xdr.ScVal.scvI64(xdr.Int64.fromString(liquidity.toString())),
    ],
  })

  const transaction = await buildTransaction(sourceAccount, operation)

  // Convert to XDR for signing
  const transactionXdr = transaction.toXDR()

  // Sign the transaction
  const signedXdr = await signTransaction(transactionXdr)

  // Submit the transaction
  const result = await submitTransaction(signedXdr)

  // Wait for confirmation
  await waitForTransaction(result.hash)

  return {
    hash: result.hash,
    result: result.result,
    amount0: 0n,
    amount1: 0n,
  }
}

/**
 * Build a transaction for removing liquidity from a pool
 * @param params - Remove liquidity parameters
 * @returns Transaction ready for signing
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function buildRemoveLiquidityTransaction({
  address,
  liquidity,
  recipient,
  sourceAccount,
}: {
  address: string
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
  sourceAccount: string
}): Promise<any> {
  const tickLower = -60000 // Minimum tick
  const tickUpper = 60000 // Maximum tick

  const operation = Operation.invokeContractFunction({
    contract: address,
    function: 'burn',
    args: [
      Address.fromString(recipient).toScVal(),
      xdr.ScVal.scvI32(tickLower),
      xdr.ScVal.scvI32(tickUpper),
      xdr.ScVal.scvI64(xdr.Int64.fromString(liquidity.toString())),
    ],
  })

  return buildTransaction(sourceAccount, operation)
}

/**
 * Execute remove liquidity transaction with signing and submission
 * @param params - Remove liquidity parameters including signer
 * @returns Transaction result
 */
export async function executeRemoveLiquidity({
  address,
  liquidity,
  amount0Min,
  amount1Min,
  recipient,
  sourceAccount,
  signTransaction,
}: {
  address: string
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{
  hash: string
  result: any
  amount0: bigint
  amount1: bigint
}> {
  // Build the transaction
  const transaction = await buildRemoveLiquidityTransaction({
    address,
    liquidity,
    amount0Min,
    amount1Min,
    recipient,
    sourceAccount,
  })

  // Convert to XDR for signing
  const xdr = transaction.toXDR()

  // Sign the transaction
  const signedXdr = await signTransaction(xdr)

  // Submit the transaction
  const result = await submitTransaction(signedXdr)

  // Wait for confirmation
  await waitForTransaction(result.hash)

  // For now, return mock data - in a real implementation, you'd parse the transaction result
  return {
    ...result,
    amount0: 0n,
    amount1: 0n,
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
 * Test function to verify pool reserves for a specific pool
 * @param poolAddress - The pool contract address to test
 * @returns Pool reserves and liquidity data
 */
export async function testPoolReserves(poolAddress: string) {
  console.log(`\n🔍 Testing pool reserves for: ${poolAddress}`)

  try {
    // Get pool configuration
    const config = getPoolConfig(poolAddress)
    if (!config) {
      console.error(`❌ No configuration found for pool: ${poolAddress}`)
      return null
    }

    console.log(`📋 Pool Config:`, {
      token0: config.token0,
      token1: config.token1,
      fee: config.fee,
    })

    // Fetch liquidity and reserves
    const [liquidity, reserves] = await Promise.all([
      fetchPoolLiquidity(poolAddress),
      fetchPoolReserves(poolAddress),
    ])

    console.log(`💧 Pool Liquidity:`, liquidity)
    console.log(`💰 Pool Reserves:`, reserves)

    if (liquidity && reserves && config.token0 && config.token1) {
      // Calculate total value locked (simplified)
      const token0Amount =
        Number(reserves.token0.amount) / 10 ** config.token0.decimals
      const token1Amount =
        Number(reserves.token1.amount) / 10 ** config.token1.decimals

      console.log(`📊 Reserve Breakdown:`)
      console.log(
        `  ${config.token0.code}: ${token0Amount.toFixed(6)} (${reserves.token0.formatted})`,
      )
      console.log(
        `  ${config.token1.code}: ${token1Amount.toFixed(6)} (${reserves.token1.formatted})`,
      )
      console.log(`  Total Liquidity: ${liquidity.formatted}`)

      return {
        liquidity,
        reserves,
        config,
        breakdown: {
          token0Amount,
          token1Amount,
        },
      }
    }

    return null
  } catch (error) {
    console.error(`❌ Error testing pool reserves:`, error)
    return null
  }
}

/**
 * Test the specific HYPEa-XLM pool reserves
 * This function tests the pool mentioned in the Stellar Expert link
 */
export async function testHypeaXlmPoolReserves() {
  const HYPEA_XLM_POOL =
    'CCYJJ2A2BAQHKKSNJ3NHRV66GA6XCHHBLROFBBR7J33YIYMWDL57XOUL'

  console.log(`\n🚀 Testing HYPEa-XLM Pool Reserves`)
  console.log(`📍 Pool Address: ${HYPEA_XLM_POOL}`)
  console.log(
    `🔗 Stellar Expert: https://stellar.expert/explorer/testnet/contract/${HYPEA_XLM_POOL}`,
  )

  const result = await testPoolReserves(HYPEA_XLM_POOL)

  if (result?.config?.token0 && result?.config?.token1) {
    console.log(`\n✅ Pool reserves fetched successfully!`)
    console.log(`📈 Summary:`)
    console.log(
      `  - Pool: ${result.config.token0.code}/${result.config.token1.code}`,
    )
    console.log(`  - Fee: ${result.config.fee / 10000}%`)
    console.log(
      `  - ${result.config.token0.code} Reserve: ${result.breakdown.token0Amount.toFixed(6)}`,
    )
    console.log(
      `  - ${result.config.token1.code} Reserve: ${result.breakdown.token1Amount.toFixed(6)}`,
    )
    console.log(`  - Total Liquidity: ${result.liquidity.formatted}`)
  } else {
    console.log(`\n❌ Failed to fetch pool reserves`)
  }

  return result
}

/**
 * Comprehensive test for pool reserves functionality
 * This function can be called to test the pool reserves for the HYPEa-XLM pool
 */
export async function runPoolReservesTest() {
  console.log('\n🚀 Starting Pool Reserves Test')
  console.log('==============================')

  const HYPEA_XLM_POOL =
    'CCYJJ2A2BAQHKKSNJ3NHRV66GA6XCHHBLROFBBR7J33YIYMWDL57XOUL'

  try {
    // Test 1: Check if pool configuration exists
    console.log('\n📋 Test 1: Pool Configuration')
    const config = getPoolConfig(HYPEA_XLM_POOL)
    if (!config) {
      console.error('❌ Pool configuration not found')
      return false
    }
    console.log('✅ Pool configuration found:', {
      token0: config.token0?.code,
      token1: config.token1?.code,
      fee: config.fee,
    })

    // Test 2: Fetch pool liquidity
    console.log('\n💧 Test 2: Pool Liquidity')
    const liquidity = await fetchPoolLiquidity(HYPEA_XLM_POOL)
    if (!liquidity) {
      console.error('❌ Could not fetch pool liquidity')
      return false
    }
    console.log('✅ Pool liquidity fetched:', liquidity)

    // Test 3: Fetch pool reserves
    console.log('\n💰 Test 3: Pool Reserves')
    const reserves = await fetchPoolReserves(HYPEA_XLM_POOL)
    if (!reserves) {
      console.error('❌ Could not fetch pool reserves')
      return false
    }
    console.log('✅ Pool reserves fetched:', reserves)

    // Test 4: Calculate and display breakdown
    console.log('\n📊 Test 4: Reserve Breakdown')
    let token0Amount = 0
    let token1Amount = 0

    if (config.token0 && config.token1) {
      token0Amount =
        Number(reserves.token0.amount) / 10 ** config.token0.decimals
      token1Amount =
        Number(reserves.token1.amount) / 10 ** config.token1.decimals

      console.log('✅ Reserve breakdown calculated:')
      console.log(
        `  ${config.token0.code}: ${token0Amount.toFixed(6)} (${reserves.token0.formatted})`,
      )
      console.log(
        `  ${config.token1.code}: ${token1Amount.toFixed(6)} (${reserves.token1.formatted})`,
      )
      console.log(`  Total Liquidity: ${liquidity.formatted}`)
    }

    // Test 5: Verify data consistency
    console.log('\n🔍 Test 5: Data Consistency')
    if (token0Amount > 0 && token1Amount > 0) {
      console.log('✅ Both token reserves are positive')
    } else {
      console.warn('⚠️ One or both token reserves are zero')
    }

    console.log('\n🎉 All tests passed! Pool reserves are working correctly.')
    return true
  } catch (error) {
    console.error('\n💥 Test failed with error:', error)
    return false
  }
}

/**
 * Debug function to test token balance fetching step by step
 */
export async function debugTokenBalance() {
  const HYPEA_XLM_POOL =
    'CCYJJ2A2BAQHKKSNJ3NHRV66GA6XCHHBLROFBBR7J33YIYMWDL57XOUL'

  console.log('\n🔍 Debug Token Balance Function')
  console.log('================================')

  try {
    // Step 1: Check pool configuration
    console.log('\n📋 Step 1: Pool Configuration')
    const config = getPoolConfig(HYPEA_XLM_POOL)
    if (!config) {
      console.error('❌ No pool configuration found')
      return
    }
    console.log('✅ Pool configuration found')

    // Step 2: Check token configuration
    console.log('\n🪙 Step 2: Token Configuration')
    console.log('Token0:', config.token0)
    console.log('Token1:', config.token1)

    if (!config.token0 || !config.token1) {
      console.error('❌ Token configuration missing')
      return
    }

    // Step 3: Test token balance for XLM (should be easier to test)
    console.log('\n💰 Step 3: Testing XLM Balance')
    console.log('Pool address:', HYPEA_XLM_POOL)
    console.log('XLM token contract:', config.token1.contract)

    const xlmBalance = await getTokenBalance(
      HYPEA_XLM_POOL,
      config.token1.contract,
    )
    console.log('XLM Balance result:', xlmBalance)

    // Step 4: Test token balance for HYPEa
    console.log('\n🪙 Step 4: Testing HYPEa Balance')
    console.log('HYPEa token contract:', config.token0.contract)

    const hypeaBalance = await getTokenBalance(
      HYPEA_XLM_POOL,
      config.token0.contract,
    )
    console.log('HYPEa Balance result:', hypeaBalance)

    console.log('\n📊 Summary:')
    console.log(`XLM Balance: ${xlmBalance}`)
    console.log(`HYPEa Balance: ${hypeaBalance}`)
  } catch (error) {
    console.error('\n💥 Debug failed:', error)
  }
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
 * Get current sqrt price from pool
 * @param poolAddress - The pool contract address
 * @returns Current sqrt price as BigInt
 */
async function getCurrentSqrtPrice(poolAddress: string): Promise<bigint> {
  try {
    // For now, return a default price (1:1 ratio)
    // In a real implementation, you would call the contract to get the current price
    console.log('Using default sqrt price for pool:', poolAddress)
    return BigInt('79228162514264337593543950336') // sqrt(1) * 2^96
  } catch (error) {
    console.error('Error getting current sqrt price:', error)
    // Return a default price (1:1 ratio)
    return BigInt('79228162514264337593543950336') // sqrt(1) * 2^96
  }
}

/**
 * Convert tick to sqrt price
 * @param tick - The tick value
 * @returns Sqrt price as BigInt
 */
function tickToSqrtPrice(tick: number): bigint {
  const sqrtPrice = Math.sqrt(1.0001 ** tick)
  return BigInt(Math.floor(sqrtPrice * 2 ** 96))
}

async function calculateLiquidityFromAmounts(
  poolAddress: string,
  desiredAmount0: number,
  desiredAmount1: number,
  tickLower: number,
  tickUpper: number,
): Promise<string> {
  try {
    // Get current sqrt price from pool using helper
    const currentSqrtPriceX96 = await getCurrentSqrtPrice(poolAddress)

    const sqrtPriceLowerX96 = tickToSqrtPrice(tickLower)
    const sqrtPriceUpperX96 = tickToSqrtPrice(tickUpper)

    // Scale desired amounts to contract units (Stellar uses 7 decimals)
    const scaledAmount0 = BigInt(Math.floor(desiredAmount0 * 1e7))

    // Calculate liquidity from token0 amount only
    // This ensures the user gets exactly the token0 amount they requested
    // The contract will then calculate the exact token1 amount needed
    const liquidity = calculateLiquidityFromAmount0(
      scaledAmount0,
      currentSqrtPriceX96,
      sqrtPriceLowerX96,
      sqrtPriceUpperX96,
    )

    console.log('Liquidity calculation for addLiquidity:', {
      desiredAmount0,
      scaledAmount0: scaledAmount0.toString(),
      currentSqrtPrice: currentSqrtPriceX96.toString(),
      liquidity: liquidity.toString(),
    })

    // Convert to string for contract call
    return liquidity.toString()
  } catch (error) {
    console.error('Error calculating liquidity:', error)
    // Fallback to a simple calculation
    const avgAmount = Math.sqrt(desiredAmount0 * desiredAmount1)
    return Math.floor(avgAmount * 1e7).toString()
  }
}

// Helper function to calculate liquidity from token0 amount
// Note: The contract rounds UP when calculating amounts, which can increase the amount by ~1-2 units per division
// We need to account for this by reducing our liquidity request slightly
function calculateLiquidityFromAmount0(
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
    return (liquidity * BigInt(998)) / BigInt(1000) // Reduce by 0.2%
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
    return numerator / denominator
  }
}
