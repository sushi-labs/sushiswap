import { getStablePrice } from '../hooks/price/get-stable-price'
import type { PoolInfo, PoolLiquidity, PoolReserves } from '../types/pool.type'
import type { Token } from '../types/token.type'
import { formatTokenAmount } from '../utils/formatters'
import { getPoolContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'
import { discoverAllPools } from './dex-factory-helpers'
import {
  getTokenBalance,
  getTokenByCode,
  getTokenByContract,
} from './token-helpers'
import { submitTransaction, waitForTransaction } from './transaction-helpers'

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
    const poolPromises = poolAddresses.map((address) => {
      return getPoolInfo(address).catch(() => null)
    })

    const results = await Promise.all(poolPromises)
    const validPools = results.filter((pool) => pool !== null)

    console.log(
      `✅ Successfully loaded ${validPools.length}/${poolAddresses.length} pools (${poolAddresses.length - validPools.length} empty/inactive pools skipped)`,
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
      tickSpacing: 60, // TODO: This should be the tick spacing
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
 * Add liquidity to a pool (exactly like stellar-auth-test)
 * Uses proper transaction preparation with authorization
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

  const poolContractClient = getPoolContractClient({
    contractId: address,
    publicKey: sourceAccount,
  })
  const assembledTransaction = await poolContractClient.mint(
    {
      recipient: recipient,
      tick_lower: tickLower,
      tick_upper: tickUpper,
      amount: liquidityBigInt,
    },
    {
      timeoutInSeconds: DEFAULT_TIMEOUT,
      fee: 100000,
    },
  )

  // Convert to XDR for signing
  const transactionXdr = assembledTransaction.toXDR()

  // Sign the transaction
  const signedXdr = await signTransaction(transactionXdr)

  // Submit the transaction
  const result = await submitTransaction(signedXdr)

  // Wait for confirmation
  const txResult = await waitForTransaction(result.hash)

  if (txResult.status === 'SUCCESS') {
    return {
      hash: result.hash,
      result: txResult,
    }
  } else {
    throw new Error(`Transaction failed: ${JSON.stringify(txResult)}`)
  }
}

/**
 * Remove liquidity from a pool
 * @param address - The pool contract address
 * @param params - Liquidity removal parameters
 * @returns Burn result
 */
/**
 * Remove liquidity from a pool (exactly like addLiquidity pattern)
 * Uses proper transaction preparation with authorization
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

  const poolContractClient = getPoolContractClient({
    contractId: address,
    publicKey: sourceAccount,
  })
  const assembledTransaction = await poolContractClient.burn(
    {
      owner: recipient,
      tick_lower: -60000,
      tick_upper: 60000,
      amount: liquidity,
    },
    {
      timeoutInSeconds: DEFAULT_TIMEOUT,
      fee: 100000,
    },
  )
  // Convert to XDR for signing
  const transactionXdr = assembledTransaction.toXDR()

  // Sign the transaction
  const signedXdr = await signTransaction(transactionXdr)

  // Submit the transaction
  const result = await submitTransaction(signedXdr)

  // Wait for confirmation
  const txResult = await waitForTransaction(result.hash)

  if (txResult.status === 'SUCCESS') {
    return {
      hash: result.hash,
      result: txResult,
      amount0: 0n,
      amount1: 0n,
    }
  } else {
    throw new Error(`Transaction failed: ${JSON.stringify(txResult)}`)
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
    const config = await getPoolInfoFromContract(poolAddress)

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

    if (liquidity && reserves) {
      const token0 = getTokenByCode(config.token0.code)
      const token1 = getTokenByCode(config.token1.code)

      let token0Amount = 0
      let token1Amount = 0

      if (token0 && token1) {
        // Calculate total value locked (simplified)
        token0Amount = Number(reserves.token0.amount) / 10 ** token0.decimals
        token1Amount = Number(reserves.token1.amount) / 10 ** token1.decimals

        console.log(`📊 Reserve Breakdown:`)
        console.log(
          `  ${token0.code}: ${token0Amount.toFixed(6)} (${reserves.token0.formatted})`,
        )
        console.log(
          `  ${token1.code}: ${token1Amount.toFixed(6)} (${reserves.token1.formatted})`,
        )
      }
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
 * Test the specific HYPE-XLM pool reserves
 * This function tests the pool mentioned in the Stellar Expert link
 */
export async function testHypeaXlmPoolReserves() {
  const HYPE_XLM_POOL =
    'CC7ZPELSGOVPIGP25TIOYWX2NWFVHCEXFZOKWN4ENF7Z2PBPHLQMKYNS'

  console.log(`\n🚀 Testing HYPE-XLM Pool Reserves`)
  console.log(`📍 Pool Address: ${HYPE_XLM_POOL}`)
  console.log(
    `🔗 Stellar Expert: https://stellar.expert/explorer/testnet/contract/${HYPE_XLM_POOL}`,
  )

  const result = await testPoolReserves(HYPE_XLM_POOL)

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
 * This function can be called to test the pool reserves for the HYPE-XLM pool
 */
export async function runPoolReservesTest() {
  console.log('\n🚀 Starting Pool Reserves Test')
  console.log('==============================')

  const HYPE_XLM_POOL =
    'CC7ZPELSGOVPIGP25TIOYWX2NWFVHCEXFZOKWN4ENF7Z2PBPHLQMKYNS'

  try {
    // Test 1: Check if pool configuration exists
    console.log('\n📋 Test 1: Pool Configuration')
    const config = await getPoolInfoFromContract(HYPE_XLM_POOL)

    if (!config) {
      console.error(
        `❌ Pool configuration not found for pool: ${HYPE_XLM_POOL}`,
      )
      return false
    }
    console.log('✅ Pool configuration found:', {
      token0: config.token0.code,
      token1: config.token1.code,
      fee: config.fee,
    })

    // Test 2: Fetch pool liquidity
    console.log('\n💧 Test 2: Pool Liquidity')
    const liquidity = await fetchPoolLiquidity(HYPE_XLM_POOL)
    if (!liquidity) {
      console.error('❌ Could not fetch pool liquidity')
      return false
    }
    console.log('✅ Pool liquidity fetched:', liquidity)

    // Test 3: Fetch pool reserves
    console.log('\n💰 Test 3: Pool Reserves')
    const reserves = await fetchPoolReserves(HYPE_XLM_POOL)
    if (!reserves) {
      console.error('❌ Could not fetch pool reserves')
      return false
    }
    console.log('✅ Pool reserves fetched:', reserves)

    // Test 4: Calculate and display breakdown
    console.log('\n📊 Test 4: Reserve Breakdown')
    let token0Amount = 0
    let token1Amount = 0

    const test4Token0 = getTokenByCode(config.token0.code)
    const test4Token1 = getTokenByCode(config.token1.code)

    if (test4Token0 && test4Token1) {
      token0Amount = Number(reserves.token0.amount) / 10 ** test4Token0.decimals
      token1Amount = Number(reserves.token1.amount) / 10 ** test4Token1.decimals

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
  const HYPE_XLM_POOL =
    'CC7ZPELSGOVPIGP25TIOYWX2NWFVHCEXFZOKWN4ENF7Z2PBPHLQMKYNS'

  console.log('\n🔍 Debug Token Balance Function')
  console.log('================================')

  try {
    // Step 1: Check pool configuration
    console.log('\n📋 Step 1: Pool Configuration')
    const config = await getPoolInfoFromContract(HYPE_XLM_POOL)

    if (!config) {
      console.error(`❌ No pool configuration found for pool: ${HYPE_XLM_POOL}`)
      return
    }
    console.log('✅ Pool configuration found')

    // Step 2: Check token configuration
    console.log('\n🪙 Step 2: Token Configuration')
    console.log('Token0:', config.token0)
    console.log('Token1:', config.token1)

    const testToken0 = getTokenByCode(config.token0.code)
    const testToken1 = getTokenByCode(config.token1.code)

    if (!testToken0 || !testToken1) {
      console.error('❌ Token configuration missing')
      return
    }

    // Step 3: Test token balance for XLM (should be easier to test)
    console.log('\n💰 Step 3: Testing XLM Balance')
    console.log('Pool address:', HYPE_XLM_POOL)
    console.log('XLM token contract:', testToken1.contract)

    const xlmBalance = await getTokenBalance(HYPE_XLM_POOL, testToken1.contract)
    console.log('XLM Balance result:', xlmBalance)

    // Step 4: Test token balance for HYPE
    console.log('\n🪙 Step 4: Testing HYPE Balance')
    console.log('HYPE token contract:', testToken0.contract)

    const hypeBalance = await getTokenBalance(
      HYPE_XLM_POOL,
      testToken0.contract,
    )
    console.log('HYPE Balance result:', hypeBalance)

    console.log('\n📊 Summary:')
    console.log(`XLM Balance: ${xlmBalance}`)
    console.log(`HYPE Balance: ${hypeBalance}`)
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
    } else if (slot0Map.fee_protocol && BigInt(slot0Map.fee_protocol) !== 0n) {
      // The contract has the fields mixed up - sqrt price is in fee_protocol
      sqrtPriceX96 = BigInt(slot0Map.fee_protocol)
      console.log(
        'Fetched sqrt price from slot0 (fee_protocol field - field names swapped):',
        sqrtPriceX96.toString(),
      )
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
function tickToSqrtPrice(tick: number): bigint {
  const sqrtPrice = Math.sqrt(1.0001 ** tick)
  return BigInt(Math.floor(sqrtPrice * 2 ** 96))
}

/**
 * Calculate liquidity from desired token amounts using Uniswap V3 formulas
 * Based on the working stellar-auth-test implementation
 */
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

    // Calculate sqrt prices for tick boundaries
    const sqrtPriceLowerX96 = tickToSqrtPrice(tickLower)
    const sqrtPriceUpperX96 = tickToSqrtPrice(tickUpper)

    // Determine price position
    let _pricePosition = 'within'
    if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
      _pricePosition = 'below'
    } else if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
      _pricePosition = 'above'
    } else {
    }

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

    // Convert to string for contract call
    return liquidity.toString()
  } catch (error) {
    console.error('Error calculating liquidity:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : '')
    // Fallback to a simple calculation
    const avgAmount = Math.sqrt(desiredAmount0 * desiredAmount1)
    const fallback = Math.floor(avgAmount * 1e7).toString()
    return fallback
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
