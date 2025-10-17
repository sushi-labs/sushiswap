import { Address, TransactionBuilder } from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE } from '../constants'
import {
  SorobanClient,
  getFactoryContractClient,
  getPoolContractClient,
} from './client'
import { DEFAULT_TIMEOUT, ZERO_ADDRESS } from './constants'
import { CONTRACT_ADDRESSES } from './contract-addresses'
import { getBaseTokens } from './token-helpers'
import { submitTransaction, waitForTransaction } from './transaction-helpers'

/**
 * Create a new pool with the specified tokens and fee tier
 * @param tokenA - Address of the first token
 * @param tokenB - Address of the second token
 * @param fee - Fee tier (e.g., 3000 for 0.3%, 10000 for 1%)
 * @param sourceAccount - User's Stellar address
 * @param signTransaction - Function to sign the transaction
 * @returns The address of the created pool and transaction hash
 */
export async function createPool({
  tokenA,
  tokenB,
  fee,
  sourceAccount,
  signTransaction,
}: {
  tokenA: string
  tokenB: string
  fee: number
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{ poolAddress: string; txHash: string }> {
  try {
    console.log('🏭 Creating pool:', { tokenA, tokenB, fee })

    // Validate inputs
    if (!tokenA || !tokenB) {
      throw new Error('Token addresses cannot be empty')
    }
    if (tokenA === tokenB) {
      throw new Error('Cannot create pool with the same token')
    }
    if (!fee || fee <= 0) {
      throw new Error('Fee must be greater than 0')
    }

    // Order tokens (smaller address first) - EXACTLY like the factory expects
    const [token0, token1] =
      tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
    console.log('🏭 Ordered tokens:', { token0, token1 })

    // Check if pool already exists
    const existingPool = await getPoolTransactionBuilder({
      tokenA: token0,
      tokenB: token1,
      fee,
    })

    if (existingPool) {
      throw new Error(`Pool already exists at address: ${existingPool}`)
    }

    // First, let's try to simulate the transaction to see what happens
    const factoryContractClient = getFactoryContractClient({
      contractId: CONTRACT_ADDRESSES.FACTORY,
      publicKey: sourceAccount,
    })
    console.log('📤 Simulating transaction to calculate resources...')
    console.log('🏭 Factory address:', factoryContractClient.options.contractId)
    console.log('🏭 Token0 address:', token0)
    console.log('🏭 Token1 address:', token1)
    console.log('🏭 Fee:', fee)
    const assembledTransaction = await factoryContractClient
      .create_pool(
        {
          token_a: token0,
          token_b: token1,
          fee: fee,
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100000,
        },
      )
      .catch((simError) => {
        console.error('❌ Simulation error:', simError)
        throw new Error(
          `Simulation failed: ${simError instanceof Error ? simError.message : String(simError)}`,
        )
      })

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    console.log('🔏 Waiting for wallet signature...')

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)

    console.log('📨 Submitting transaction to network...')

    // Submit the transaction

    const result = await submitTransaction(signedXdr)

    console.log(`Transaction submitted: ${result.hash}`)
    console.log('⏳ Waiting for confirmation...')

    // Wait for confirmation
    const txResult = await waitForTransaction(result.hash)

    if (txResult.status === 'SUCCESS') {
      console.log('✅ Transaction confirmed!')

      // Extract pool address from result
      const poolAddress = Address.fromScVal(txResult.returnValue).toString()

      console.log('🎉 Pool created:', poolAddress)

      // Initialize the pool with 1:1 price (tick 0)
      console.log('🎨 Initializing pool with 1:1 price...')
      try {
        await initializePool({
          poolAddress,
          sqrtPriceX96: encodePriceSqrt(1, 1),
          sourceAccount,
          signTransaction,
        })
        console.log('✅ Pool initialized')
      } catch (initError) {
        console.error('⚠️ Pool initialization failed:', initError)
        // Continue anyway - pool might already be initialized
      }

      return {
        poolAddress,
        txHash: result.hash,
      }
    } else {
      console.error('Transaction failed:', txResult)
      throw new Error(`Transaction failed: ${JSON.stringify(txResult)}`)
    }
  } catch (error) {
    console.error('❌ Error creating pool:', error)
    throw error
  }
}

/**
 * Encode price as sqrt(price) * 2^96 for pool initialization
 * Uses integer arithmetic to match Rust implementation precision
 * @param amount1 - Amount of token1 (as bigint, string, or number)
 * @param amount0 - Amount of token0 (as bigint, string, or number)
 * @returns sqrt(amount1/amount0) * 2^96 as bigint
 */
function encodePriceSqrt(
  amount1: bigint | string | number,
  amount0: bigint | string | number,
): bigint {
  const amount1Big = typeof amount1 === 'bigint' ? amount1 : BigInt(amount1)
  const amount0Big = typeof amount0 === 'bigint' ? amount0 : BigInt(amount0)

  // For 1:1 ratio, return exact value from deployment guide
  if (amount1Big === amount0Big) {
    return 79228162514264337593543950336n // 2^96 = exact 1:1 ratio
  }

  // Scale amounts to avoid precision loss
  const scaledAmount1 = amount1Big * BigInt(1e18)
  const scaledAmount0 = amount0Big * BigInt(1e18)

  // Calculate ratio as integer: (amount1 * 2^192) / amount0
  const Q192 = BigInt(2) ** BigInt(192)
  const ratio = (scaledAmount1 * Q192) / scaledAmount0

  // Integer square root using Newton's method (similar to Rust implementation)
  return integerSqrt(ratio)
}

/**
 * Integer square root using Newton's method
 * Equivalent to the u256_sqrt function in Rust
 */
function integerSqrt(x: bigint): bigint {
  if (x <= 1n) {
    return x
  }

  let z = (x + 1n) / 2n
  let y = x

  while (z < y) {
    y = z
    z = (x / z + z) / 2n
  }

  return y
}

/**
 * Check if a pool is initialized, and initialize it if needed
 * @param poolAddress - The pool contract address
 * @param sourceAccount - The account initializing the pool
 * @param signTransaction - Function to sign the transaction
 */
export async function initializePoolIfNeeded({
  poolAddress,
  sourceAccount,
  signTransaction,
}: {
  poolAddress: string
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<void> {
  try {
    // Check if pool is initialized by calling slot0 and checking sqrt_price_x96
    try {
      const poolContractClient = getPoolContractClient({
        contractId: poolAddress,
      })
      const slot0Result = await poolContractClient.slot0({
        timeoutInSeconds: 30,
        fee: 100000,
      })

      const sqrtPriceX96 = slot0Result.result.sqrt_price_x96
      console.log(`🔍 Pool sqrt_price_x96: ${sqrtPriceX96.toString()}`)

      if (sqrtPriceX96 === 0n) {
        console.log('🎨 Pool has sqrt_price_x96 = 0, initializing now...')
        await initializePool({
          poolAddress,
          sqrtPriceX96: encodePriceSqrt(1, 1),
          sourceAccount,
          signTransaction,
        })
        console.log('✅ Pool initialized with sqrt price')
        return
      } else {
        console.log('✅ Pool is already initialized')
        return
      }
    } catch (error) {
      // Check for specific initialization error codes
      if (
        String(error).includes('Error(Contract, #40)') ||
        String(error).includes('PoolNotInitialized')
      ) {
        console.log(
          '🎨 Pool not initialized (contract error), initializing now...',
        )
        await initializePool({
          poolAddress,
          sqrtPriceX96: encodePriceSqrt(1, 1),
          sourceAccount,
          signTransaction,
        })
        console.log('✅ Pool initialized')
        return
      }
      throw error
    }
  } catch (error) {
    console.error('Error checking pool initialization:', error)
    // Continue anyway - addLiquidity will fail if not initialized
  }
}

/**
 * Initialize a pool with an initial sqrt price
 * @param poolAddress - The pool contract address
 * @param sqrtPriceX96 - Initial sqrt price * 2^96
 * @param sourceAccount - The account initializing the pool
 * @param signTransaction - Function to sign the transaction
 */
async function initializePool({
  poolAddress,
  sqrtPriceX96,
  sourceAccount,
  signTransaction,
}: {
  poolAddress: string
  sqrtPriceX96: bigint
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<void> {
  try {
    const poolContractClient = getPoolContractClient({
      contractId: poolAddress,
      publicKey: sourceAccount,
    })
    const assembledTransaction = await poolContractClient.initialize(
      {
        sqrt_price_x96: sqrtPriceX96,
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100000,
      },
    )

    // Prepare and sign
    const signedXdr = await signTransaction(assembledTransaction.toXDR())

    // Submit
    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    const submitResult = await SorobanClient.sendTransaction(signedTx)

    // Wait for confirmation
    if (submitResult.status === 'PENDING') {
      await waitForTransaction(submitResult.hash)
    }

    console.log('✅ Pool initialized with sqrt price:', sqrtPriceX96.toString())
  } catch (error) {
    console.error('❌ Error initializing pool:', error)
    throw error
  }
}

/**
 * Get the address of an existing pool
 * @param tokenA - Address of the first token
 * @param tokenB - Address of the second token
 * @param fee - Fee tier
 * @returns The pool address if it exists, null otherwise
 */
export async function getPool({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: string
  tokenB: string
  fee: number
}): Promise<string | null> {
  // Use the transaction builder approach which is already implemented
  return await getPoolTransactionBuilder({ tokenA, tokenB, fee })
}

/**
 * Get pool using direct SDK approach with Contract method
 * @param tokenA - Address of the first token
 * @param tokenB - Address of the second token
 * @param fee - Fee tier
 * @returns The pool address if it exists, null otherwise
 */
export async function getPoolDirectSDK({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: string
  tokenB: string
  fee: number
}): Promise<string | null> {
  try {
    console.log('Direct SDK approach - checking pool:', tokenA, tokenB, fee)

    // Create contract instance using direct SDK approach
    const factoryContractClient = getFactoryContractClient({
      contractId: CONTRACT_ADDRESSES.FACTORY,
    })
    const assembledTransaction = await factoryContractClient.get_pool({
      token_a: tokenA,
      token_b: tokenB,
      fee: fee,
    })
    const result = assembledTransaction.result

    console.log('Direct SDK result:', result)

    // Handle the result - it should be an Option<string>
    // where Option<T> is defined as T | undefined
    return result ?? null
  } catch (error) {
    console.error('Direct SDK getPool error:', error)
    return null
  }
}

/**
 * Get pool using transaction builder and simulation approach
 * This matches how the router's get_pool_address() function works
 * @param tokenA - Address of the first token
 * @param tokenB - Address of the second token
 * @param fee - Fee tier
 * @param userAddress - User address for account simulation
 * @returns The pool address if it exists, null otherwise
 */
export async function getPoolTransactionBuilder({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: string
  tokenB: string
  fee: number
}): Promise<string | null> {
  try {
    // Order tokens (smaller address first) - EXACTLY like the router does
    const [token0, token1] =
      tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]

    // Get account for transaction building
    const factoryContractClient = getFactoryContractClient({
      contractId: CONTRACT_ADDRESSES.FACTORY,
    })
    const assembledTransaction = await factoryContractClient.get_pool(
      {
        token_a: token0,
        token_b: token1,
        fee: fee,
      },
      {
        timeoutInSeconds: 30,
        fee: 100000,
      },
    )
    const result = assembledTransaction.result

    if (result === undefined || result === ZERO_ADDRESS) {
      return null
    }
    return result
  } catch (error) {
    console.error('Transaction Builder getPool error:', error)
    return null
  }
}

/**
 * Get all pools by querying factory's get_pool for each token pair + fee combination
 * Uses prepopulated token list since factory has no "list all pools" method
 */
export async function getPoolsForBaseTokenPairs(): Promise<string[]> {
  const tokens = getBaseTokens()
  const feeTiers = getFees()

  console.log('🔍 Querying factory for pools using token combinations:')
  console.log(
    '  Tokens:',
    tokens.map((t) => `${t.code}(${t.contract})`),
  )
  console.log('  Fee tiers:', feeTiers)

  // Generate all possible pool queries (tokenA, tokenB, fee)
  const queries: Array<{
    tokenA: string
    tokenB: string
    tokenACode: string
    tokenBCode: string
    fee: number
  }> = []

  // Generate all unique token pairs
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      const tokenA = tokens[i]
      const tokenB = tokens[j]

      // Check each fee tier for this pair
      for (const fee of feeTiers) {
        queries.push({
          tokenA: tokenA.contract,
          tokenB: tokenB.contract,
          tokenACode: tokenA.code,
          tokenBCode: tokenB.code,
          fee,
        })
      }
    }
  }

  console.log(
    `🔍 Querying factory.get_pool() for ${queries.length} combinations (in parallel)...`,
  )

  // Log all token pair queries for debugging
  console.log('Token pairs being queried:')
  queries.forEach((query, index) => {
    console.log(
      `  ${index + 1}. ${query.tokenACode}/${query.tokenBCode} (fee: ${query.fee})`,
    )
    console.log(`     tokenA: ${query.tokenA}`)
    console.log(`     tokenB: ${query.tokenB}`)
  })

  // Query factory.get_pool(tokenA, tokenB, fee) for all combinations in parallel
  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const pool = await getPoolTransactionBuilder({
        tokenA: query.tokenA,
        tokenB: query.tokenB,
        fee: query.fee,
      })

      // Validate pool address format
      if (pool && pool.length === 56 && pool.startsWith('C')) {
        return pool
      }
      return null
    }),
  )

  // Collect pools that exist
  const pools = results
    .filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === 'fulfilled' && result.value !== null,
    )
    .map((result) => result.value)

  console.log(`✅ Found ${pools.length} pools from factory`)
  if (pools.length > 0) {
    console.log('  Pool addresses:', pools)
  }
  return pools
}

/**
 * Discover all pools by querying factory.get_pool() for each token pair combination
 * Note: Factory has no "list all pools" method, so we query each combination explicitly
 * @returns Array of pool addresses that exist
 */
export async function discoverAllPools(): Promise<string[]> {
  console.log('🔍 Discovering pools via factory.get_pool() queries...')

  // Query factory for all token pair + fee tier combinations
  const pools = await getPoolsForBaseTokenPairs()

  console.log(`🏭 Discovery complete: ${pools.length} pools found`)
  if (pools.length > 0) {
    console.log('  Pool addresses:', pools)
  }

  return pools
}

/**
 * Check if a pool exists for the given token pair and fee
 * @param tokenA - Address of the first token
 * @param tokenB - Address of the second token
 * @param fee - Fee tier
 * @returns True if pool exists, false otherwise
 */
export async function poolExists({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: string
  tokenB: string
  fee: number
}): Promise<boolean> {
  try {
    const poolAddress = await getPool({ tokenA, tokenB, fee })
    return poolAddress !== null
  } catch {
    return false
  }
}

/**
 * Get all available fee tiers and their tick spacings
 * @returns Object mapping fee amounts to tick spacings
 */
export function getFeeTiers(): Record<number, number> {
  // TODO(drew): This would need to be implemented based on the contract's storage
  // For now, return common fee tiers
  return {
    100: 1, // 0.01%
    500: 10, // 0.05%
    3000: 60, // 0.3%
    10000: 200, // 1%
  }
}

export function getFees(): number[] {
  return Object.keys(getFeeTiers()).map(Number)
}

/**
 * Debug function to test pool creation parameters
 */
export async function debugCreatePoolParams(
  tokenA: string,
  tokenB: string,
  fee: number,
) {
  console.log('\n🔍 Debug Create Pool Parameters')
  console.log('================================')

  console.log('Input parameters:')
  console.log('  tokenA:', tokenA)
  console.log('  tokenB:', tokenB)
  console.log('  fee:', fee)

  // Check token ordering
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  console.log('\nOrdered tokens:')
  console.log('  token0 (first):', token0)
  console.log('  token1 (second):', token1)
  console.log('  token0 < token1:', token0 < token1)

  // Check if pool already exists
  try {
    const existingPool = await getPoolTransactionBuilder({
      tokenA: token0,
      tokenB: token1,
      fee,
    })

    if (existingPool) {
      console.log('❌ Pool already exists at:', existingPool)
    } else {
      console.log('✅ No existing pool found, can create new one')
    }
  } catch (error) {
    console.log(
      '✅ No existing pool found (error expected):',
      error instanceof Error ? error.message : String(error),
    )
  }

  // Test factory contract simulation
  try {
    const factoryContractClient = getFactoryContractClient({
      contractId: CONTRACT_ADDRESSES.FACTORY,
    })
    const assembledTransaction = await factoryContractClient.create_pool(
      {
        token_a: token0,
        token_b: token1,
        fee: fee,
      },
      {
        timeoutInSeconds: 30,
        fee: 100000,
      },
    )

    console.log('\n🏭 Factory simulation result:')
    console.log(JSON.stringify(assembledTransaction.result, null, 2))
  } catch (error) {
    console.error('\n❌ Factory simulation failed:', error)
  }
}

/**
 * Validate that a fee tier is supported
 * @param fee - Fee amount to validate
 * @returns True if fee is supported, false otherwise
 */
export function isFeeTierSupported(fee: number): boolean {
  const feeTiers = getFeeTiers()
  return fee in feeTiers
}

/**
 * Get the tick spacing for a given fee tier
 * @param fee - Fee amount
 * @returns The tick spacing for the fee tier
 */
export function getTickSpacingForFee(fee: number): number {
  const feeTiers = getFeeTiers()
  return feeTiers[fee] || 0
}
