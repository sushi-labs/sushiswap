import { Address } from '@stellar/stellar-sdk'
import ms from 'ms'
import type {
  StellarAccountAddress,
  StellarContractAddress,
} from 'sushi/stellar'
import { FEE_TIERS, isFeeTier } from '../utils/ticks'
import { getFactoryContractClient, getFactoryContractId } from './client'
import {
  DEFAULT_TIMEOUT,
  MAX_SQRT_RATIO,
  MIN_SQRT_RATIO,
  isAddressLower,
} from './constants'
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
  tokenA: StellarContractAddress
  tokenB: StellarContractAddress
  fee: number
  sqrtPriceX96: bigint
  sourceAccount: StellarAccountAddress
  signTransaction: (xdr: string) => Promise<string>
}): Promise<{ poolAddress: StellarContractAddress; txHash?: string }> {
  try {
    // Validate inputs
    if (!tokenA || !tokenB) {
      throw new Error('Token addresses cannot be empty')
    }
    if (tokenA === tokenB) {
      throw new Error('Cannot create pool with the same token')
    }
    if (!isFeeTier(fee)) {
      throw new Error('Unsupported pool fee')
    }
    if (sqrtPriceX96 < MIN_SQRT_RATIO || sqrtPriceX96 >= MAX_SQRT_RATIO) {
      throw new Error('Initial price is outside the pool limits')
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
      const poolAddress = Address.fromScVal(
        txResult.returnValue,
      ).toString() as StellarContractAddress

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
  isLegacy = false,
}: {
  tokenA: StellarContractAddress
  tokenB: StellarContractAddress
  fee: number
  isLegacy?: boolean
}): Promise<StellarContractAddress | null> {
  try {
    // Order tokens by decoded bytes - EXACTLY like the router and getPoolTransactionBuilder does
    // Note: Must compare decoded bytes, not base32 strings (base32 doesn't preserve byte ordering)
    const [token0, token1] = isAddressLower(tokenA, tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]

    // Create contract instance using direct SDK approach
    const factoryContractId = getFactoryContractId(isLegacy)
    if (!factoryContractId) {
      throw new Error('Factory contract not found')
    }
    const factoryContractClient = getFactoryContractClient({
      contractId: factoryContractId,
      // No publicKey needed for read-only factory queries
    })
    const assembledTransaction = await factoryContractClient.get_pool({
      token_a: token0,
      token_b: token1,
      fee: fee,
    })
    const result = assembledTransaction.result as
      | StellarContractAddress
      | undefined

    // Handle the result - it should be an Option<string>
    // where Option<T> is defined as T | undefined
    return result ?? null
  } catch (error) {
    console.warn('Direct SDK getPool error:', error)
    throw error
  }
}

export function getFees(): number[] {
  return FEE_TIERS.map((tier) => tier.value)
}
