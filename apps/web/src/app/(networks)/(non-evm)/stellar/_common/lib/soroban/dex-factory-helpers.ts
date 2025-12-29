import { Address } from '@stellar/stellar-sdk'
import ms from 'ms'
import { FEE_TIERS } from '../utils/ticks'
import { getFactoryContractClient } from './client'
import { DEFAULT_TIMEOUT, isAddressLower } from './constants'
import { contractAddresses } from './contracts'
import { isPoolInitialized } from './pool-initialization'
import { submitTransaction, waitForTransaction } from './transaction-helpers'

/**
 * Create a new pool with the specified tokens and fee tier initialized to a given sqrt price
 * @param tokenA - Address of the first token
 * @param tokenB - Address of the second token
 * @param fee - Fee tier (e.g., 3000 for 0.3%, 10000 for 1%)
 * @param sqrtPriceX96 - Initial sqrt price in Q64.96 format for pool initialization
 * @param sourceAccount - User's Stellar address
 * @param signTransaction - Function to sign the transaction
 * @returns The address of the created and initialized pool and (if no initialized pool already existed) transaction hash.
 */
export async function createAndInitializePool({
  tokenA,
  tokenB,
  fee,
  sqrtPriceX96,
  sourceAccount,
  signTransaction,
}: {
  tokenA: string
  tokenB: string
  fee: number
  sqrtPriceX96: bigint
  sourceAccount: string
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{ poolAddress: string; txHash?: string }> {
  try {
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
    if (sqrtPriceX96 <= 0n) {
      throw new Error('Initial sqrt price must be greater than 0')
    }

    // Order tokens by decoded bytes - EXACTLY like the factory expects
    // Note: Must compare decoded bytes, not base32 strings (base32 doesn't preserve byte ordering)
    const [token0, token1] = isAddressLower(tokenA, tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]

    // Check if pool already exists
    const existingPool = await getPoolDirectSDK({
      tokenA: token0,
      tokenB: token1,
      fee,
    })

    if (existingPool) {
      const initialized = await isPoolInitialized(existingPool)
      if (initialized) {
        return {
          poolAddress: existingPool,
        }
      }
    }

    // First, let's try to simulate the transaction to see what happens
    const factoryContractClient = getFactoryContractClient({
      contractId: contractAddresses.FACTORY,
      publicKey: sourceAccount,
    })

    const assembledTransaction = await factoryContractClient
      .create_and_initialize_pool(
        {
          token_a: token0,
          token_b: token1,
          fee: fee,
          sqrt_price_x96: sqrtPriceX96,
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100000,
        },
      )
      .catch((simError: unknown) => {
        console.error('Simulation error:', simError)
        throw new Error(
          `Simulation failed: ${simError instanceof Error ? simError.message : String(simError)}`,
        )
      })

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)

    // Submit the transaction

    const submitResult = await submitTransaction(signedXdr)

    // Wait for confirmation
    const txResult = await waitForTransaction(submitResult.hash, ms('1m'), 2)

    if (txResult.status === 'SUCCESS' && txResult.returnValue !== undefined) {
      // Extract pool address from result
      const poolAddress = Address.fromScVal(txResult.returnValue).toString()

      return {
        poolAddress,
        txHash: submitResult.hash,
      }
    } else {
      console.error('Transaction failed:', txResult)
      throw new Error(`Transaction failed: ${JSON.stringify(txResult)}`)
    }
  } catch (error) {
    console.error('Error creating and initializing pool:', error)
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
export function encodePriceSqrt(
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
    // Order tokens by decoded bytes - EXACTLY like the router and getPoolTransactionBuilder does
    // Note: Must compare decoded bytes, not base32 strings (base32 doesn't preserve byte ordering)
    const [token0, token1] = isAddressLower(tokenA, tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]

    // Create contract instance using direct SDK approach
    const factoryContractClient = getFactoryContractClient({
      contractId: contractAddresses.FACTORY,
      // No publicKey needed for read-only factory queries
    })
    const assembledTransaction = await factoryContractClient.get_pool({
      token_a: token0,
      token_b: token1,
      fee: fee,
    })
    const result = assembledTransaction.result

    // Handle the result - it should be an Option<string>
    // where Option<T> is defined as T | undefined
    return result ?? null
  } catch (error) {
    console.warn('Direct SDK getPool error:', error)
    return null
  }
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
    const poolAddress = await getPoolDirectSDK({ tokenA, tokenB, fee })
    return poolAddress !== null
  } catch {
    return false
  }
}

export function getFees(): number[] {
  return FEE_TIERS.map((tier) => tier.value)
}
