import {
  Account,
  Address,
  Contract,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import { SorobanClient } from './client'
import { SIMULATION_ACCOUNT, ZERO_ADDRESS } from './constants'
import { CONTRACT_ADDRESSES } from './contract-addresses'
import { handleResult } from './handle-result'
import { getBaseTokens } from './token-helpers'

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

    const factory = new Contract(CONTRACT_ADDRESSES.FACTORY)

    // Load account from Horizon
    const Horizon = await import('@stellar/stellar-sdk').then((m) => m.Horizon)
    const horizon = new Horizon.Server('https://horizon-testnet.stellar.org')
    const account = await horizon.loadAccount(sourceAccount)

    // Build transaction with properly ordered tokens
    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        factory.call(
          'create_pool',
          Address.fromString(token0).toScVal(),
          Address.fromString(token1).toScVal(),
          xdr.ScVal.scvU32(fee),
        ),
      )
      .setTimeout(180)
      .build()

    console.log('📤 Simulating transaction to calculate resources...')
    console.log('🏭 Factory address:', CONTRACT_ADDRESSES.FACTORY)
    console.log('🏭 Token0 address:', token0)
    console.log('🏭 Token1 address:', token1)
    console.log('🏭 Fee:', fee)

    // Prepare transaction with Soroban server
    const StellarSdk = await import('@stellar/stellar-sdk')
    const sorobanServer = new StellarSdk.rpc.Server(RPC_URL)

    // First, let's try to simulate the transaction to see what happens
    try {
      const simulationResult =
        await sorobanServer.simulateTransaction(transaction)
      console.log(
        '🔍 Simulation result:',
        JSON.stringify(simulationResult, null, 2),
      )

      if ('error' in simulationResult) {
        console.error('❌ Simulation failed:', simulationResult.error)
        throw new Error(
          `Simulation failed: ${JSON.stringify(simulationResult.error)}`,
        )
      }
    } catch (simError) {
      console.error('❌ Simulation error:', simError)
      throw new Error(
        `Simulation failed: ${simError instanceof Error ? simError.message : String(simError)}`,
      )
    }

    let prepared
    try {
      prepared = await sorobanServer.prepareTransaction(transaction)
      console.log('✅ Transaction prepared')
    } catch (error) {
      console.error('❌ prepareTransaction failed:', error)
      throw error
    }

    // Convert to XDR for signing
    const transactionXdr = prepared.toXDR()

    console.log('🔏 Waiting for wallet signature...')

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)

    console.log('📨 Submitting transaction to network...')

    // Submit the transaction
    const submitTransaction = await import('./transaction-helpers').then(
      (m) => m.submitTransaction,
    )
    const waitForTransaction = await import('./transaction-helpers').then(
      (m) => m.waitForTransaction,
    )

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
 * @param amount1 - Amount of token1
 * @param amount0 - Amount of token0  
 * @returns sqrt(amount1/amount0) * 2^96 as bigint
 */
function encodePriceSqrt(amount1: number, amount0: number): bigint {
  const ratio = amount1 / amount0
  const sqrtRatio = Math.sqrt(ratio)
  // Multiply by 2^96
  const Q96 = BigInt(2) ** BigInt(96)
  return BigInt(Math.floor(sqrtRatio * Number(Q96)))
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
    // Check if pool is initialized by calling slot0
    const pool = new Contract(poolAddress)
    const simulationAccount = new Account(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      '0',
    )
    
    const tx = new TransactionBuilder(simulationAccount, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(pool.call('slot0'))
      .setTimeout(30)
      .build()

    const StellarSdk = await import('@stellar/stellar-sdk')
    const sorobanServer = new StellarSdk.rpc.Server(RPC_URL)
    const simResult = await sorobanServer.simulateTransaction(tx)

    // If simulation succeeds, pool is initialized
    if ('result' in simResult && simResult.result) {
      console.log('✅ Pool is already initialized')
      return
    }

    // Check if error is PoolNotInitialized (error 40)
    if ('error' in simResult && simResult.error) {
      const errorStr = String(simResult.error)
      if (errorStr.includes('Error(Contract, #40)') || errorStr.includes('PoolNotInitialized')) {
        console.log('🎨 Pool not initialized, initializing now...')
        await initializePool({
          poolAddress,
          sqrtPriceX96: encodePriceSqrt(1, 1),
          sourceAccount,
          signTransaction,
        })
        console.log('✅ Pool initialized')
        return
      }
    }

    // Unknown error, log and continue
    console.warn('⚠️ Could not determine pool initialization status:', simResult)
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
    const pool = new Contract(poolAddress)

    // Load account
    const Horizon = await import('@stellar/stellar-sdk').then((m) => m.Horizon)
    const horizon = new Horizon.Server('https://horizon-testnet.stellar.org')
    const account = await horizon.loadAccount(sourceAccount)

    // Convert bigint to U256 ScVal
    const StellarSdk = await import('@stellar/stellar-sdk')
    
    // Convert bigint to U256 using nativeToScVal
    const u256Val = StellarSdk.nativeToScVal(sqrtPriceX96, {type: 'u256'})

    // Build initialize transaction
    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(pool.call('initialize', u256Val))
      .setTimeout(180)
      .build()

    // Prepare and sign
    const sorobanServer = new StellarSdk.rpc.Server(RPC_URL)
    const prepared = await sorobanServer.prepareTransaction(transaction)
    const signedXdr = await signTransaction(prepared.toXDR())

    // Submit
    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    const submitResult = await sorobanServer.sendTransaction(signedTx)

    // Wait for confirmation
    if (submitResult.status === 'PENDING') {
      const waitForTransaction = await import('./transaction-helpers').then(
        (m) => m.waitForTransaction,
      )
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
    const contract = new Contract(CONTRACT_ADDRESSES.FACTORY)

    // Call get_pool method directly
    const result = await contract.call(
      'get_pool',
      Address.fromString(tokenA).toScVal(),
      Address.fromString(tokenB).toScVal(),
      xdr.ScVal.scvU32(fee),
    )

    console.log('Direct SDK result:', result)

    // Handle the result - it should be an Option<string>
    if (result && typeof result === 'object' && 'Some' in result) {
      return result.Some as string
    } else if (result && typeof result === 'string') {
      return result
    }

    return null
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
    const factory = new Contract(CONTRACT_ADDRESSES.FACTORY)

    // Build transaction
    const tx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        factory.call(
          'get_pool',
          Address.fromString(token0).toScVal(),
          Address.fromString(token1).toScVal(),
          xdr.ScVal.scvU32(fee),
        ),
      )
      .setTimeout(30)
      .build()

    // Simulate the transaction
    const simResult = await SorobanClient.simulateTransaction(tx)

    // Check if simulation was successful and has retval
    if ('result' in simResult && simResult.result) {
      const result = simResult.result as any
      
      // The return value is in result.retval (not result.results)
      if (result.retval) {
        try {
          // Factory returns Address for existing pools, or Void for non-existent
          const poolAddress = Address.fromScVal(result.retval)
          const addressStr = poolAddress.toString()
          
          // Only log if pool exists (not zero address)
          if (addressStr !== ZERO_ADDRESS) {
            console.log(`✅ Found pool: ${token0.slice(0, 8)}.../${token1.slice(0, 8)}... (fee: ${fee}) → ${addressStr}`)
          }
          
          return addressStr !== ZERO_ADDRESS ? addressStr : null
        } catch (parseError) {
          // Factory returned Void (pool doesn't exist)
          return null
        }
      }
    }

    // Check for errors in simulation
    if ('error' in simResult) {
      console.error(`Factory query error for ${token0.slice(0, 8)}/${token1.slice(0, 8)} (${fee}):`, simResult.error)
    }

    return null
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
 * Enable a fee amount and tick spacing combination
 * @param fee - Fee amount
 * @param tickSpacing - Tick spacing
 */
export async function enableFeeAmount({
  fee,
  tickSpacing,
}: {
  fee: number
  tickSpacing: number
}): Promise<void> {
  try {
    const factory = new Contract(CONTRACT_ADDRESSES.FACTORY)

    // Build transaction
    const tx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        factory.call(
          'e_fee_amt',
          xdr.ScVal.scvU32(fee),
          xdr.ScVal.scvI32(tickSpacing),
        ),
      )
      .setTimeout(30)
      .build()

    // Simulate the transaction
    const simResult = await SorobanClient.simulateTransaction(tx)

    if (!('result' in simResult) || !simResult.result) {
      throw new Error('Failed to enable fee amount')
    }
  } catch (error) {
    console.error('Error enabling fee amount:', error)
    throw error
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
    const factory = new Contract(CONTRACT_ADDRESSES.FACTORY)
    const simulationAccount = new Account(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      '0',
    )

    const testTx = new TransactionBuilder(simulationAccount, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        factory.call(
          'create_pool',
          Address.fromString(token0).toScVal(),
          Address.fromString(token1).toScVal(),
          xdr.ScVal.scvU32(fee),
        ),
      )
      .setTimeout(30)
      .build()

    const { SorobanClient } = await import('./client')
    const simResult = await SorobanClient.simulateTransaction(testTx)

    console.log('\n🏭 Factory simulation result:')
    console.log(JSON.stringify(simResult, null, 2))
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
