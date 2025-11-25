import {
  getOracleErrorMessage,
  isOracleFootprintError,
} from '../utils/error-helpers'
import {
  type SlotHints,
  executeWithSlotHintRetry,
} from '../utils/slot-hint-helpers'

/**
 * Execute a transaction with automatic retry on oracle footprint errors
 * This is a transaction-specific wrapper around executeWithSlotHintRetry
 *
 * @param poolAddress - The pool contract address
 * @param operation - Function that builds and submits the transaction with slot hints
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Result of the transaction
 */
export async function executeTransactionWithRetry<T>(
  poolAddress: string,
  operation: (hints: SlotHints) => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  try {
    return await executeWithSlotHintRetry(poolAddress, operation, maxRetries)
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
 * @param operations - Array of functions that build and submit transactions with slot hints
 * @param maxRetries - Maximum number of retry attempts per transaction (default: 2)
 * @returns Array of results from each transaction
 */
export async function executeTransactionsSequentially<T>(
  poolAddress: string,
  operations: Array<(hints: SlotHints) => Promise<T>>,
  maxRetries = 2,
): Promise<T[]> {
  const results: T[] = []

  for (const operation of operations) {
    const result = await executeTransactionWithRetry(
      poolAddress,
      operation,
      maxRetries,
    )
    results.push(result)
  }

  return results
}
