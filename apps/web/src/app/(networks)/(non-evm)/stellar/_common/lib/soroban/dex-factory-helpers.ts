import {
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
 * @returns The address of the created pool
 */
export async function createPool({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: string
  tokenB: string
  fee: number
}): Promise<string> {
  try {
    const factory = new Contract(CONTRACT_ADDRESSES.FACTORY)

    // Build transaction
    const tx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        factory.call(
          'create_pool',
          Address.fromString(tokenA).toScVal(),
          Address.fromString(tokenB).toScVal(),
          xdr.ScVal.scvU32(fee),
        ),
      )
      .setTimeout(30)
      .build()

    // Simulate the transaction
    const simResult = await SorobanClient.simulateTransaction(tx)

    if ('result' in simResult && simResult.result) {
      const result = simResult.result as any
      // Parse from retval, not results[0].xdr
      const returnVal = result.retval
      if (returnVal) {
        const poolAddress = Address.fromScVal(
          xdr.ScVal.fromXDR(returnVal, 'base64'),
        )
        return poolAddress.toString()
      }
    }

    throw new Error('Failed to create pool')
  } catch (error) {
    console.error('Error creating pool:', error)
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

    // Check if simulation was successful and has results
    if ('result' in simResult && simResult.result) {
      const result = simResult.result as any
      if (result.results?.[0]) {
        const poolAddress = Address.fromScVal(
          xdr.ScVal.fromXDR(result.results[0].xdr, 'base64'),
        )
        return poolAddress.toString() !== ZERO_ADDRESS
          ? poolAddress.toString()
          : null
      }
    }

    console.log('No results from simulation')
    return null
  } catch (error) {
    console.error('Transaction Builder getPool error:', error)
    return null
  }
}

export async function getPoolsForBaseTokenPairs(): Promise<string[]> {
  const tokens = getBaseTokens()
  const feeTiers = getFees()
  const pools: string[] = []

  // Generate all possible token pair combinations
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      const tokenA = tokens[i]
      const tokenB = tokens[j]
      // Check each fee tier for this token pair
      for (const fee of feeTiers) {
        try {
          const pool = await getPoolTransactionBuilder({
            tokenA: tokenA.contract,
            tokenB: tokenB.contract,
            fee,
          })
          if (pool) pools.push(pool)
        } catch (error) {
          console.debug(
            `Error checking pool for ${tokenA.code}/${tokenB.code} with fee ${fee}:`,
            error,
          )
        }
      }
    }
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
