import type { StellarContractAddress } from 'sushi/stellar'
import {
  getOracleErrorMessage,
  isOracleFootprintError,
} from '../utils/error-helpers'
import {
  type PoolOracleHints,
  executeWithOracleHints,
} from '../utils/slot-hint-helpers'

/**
 * Execute a transaction with automatic retry on oracle footprint errors
 * This is a transaction-specific wrapper around executeWithOracleHints
 *
 * @param poolAddress - The pool contract address
 * @param operation - Function that builds and submits the transaction with oracle hints
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Result of the transaction
 */
export async function executeTransactionWithRetry<T>(
  poolAddresses: StellarContractAddress[],
  operation: (hints: PoolOracleHints[]) => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  try {
    return await executeWithOracleHints(poolAddresses, operation, maxRetries)
  } catch (error) {
    // Enhance error message if it's an oracle error
    if (isOracleFootprintError(error)) {
      const message = getOracleErrorMessage(error)
      throw new Error(message)
    }
    throw error
  }
}

/**
 * Execute multiple transactions in sequence with retry support
 * If any transaction fails with an oracle error, all subsequent transactions will use fresh hints
 *
 * @param poolAddress - The pool contract address
 * @param operations - Array of functions that build and submit transactions with oracle hints
 * @param maxRetries - Maximum number of retry attempts per transaction (default: 2)
 * @returns Array of results from each transaction
 */
export async function executeTransactionsSequentially<T>(
  poolAddresses: StellarContractAddress[],
  operations: Array<(hints: PoolOracleHints[]) => Promise<T>>,
  maxRetries = 2,
): Promise<T[]> {
  const results: T[] = []

  for (const operation of operations) {
    const result = await executeTransactionWithRetry(
      poolAddresses,
      operation,
      maxRetries,
    )
    results.push(result)
  }

  return results
}
