import type { OracleHints } from '@sushiswap/stellar-contract-binding-pool'
import ms from 'ms'
import type { StellarContractAddress } from 'sushi/stellar'
import { getPoolContractClient } from '../soroban/client'

export type PoolOracleHints = {
  pool: string
  hints: OracleHints
}

/**
 * Fetch oracle hints from pool with retry logic
 * @param poolAddress - The pool contract address
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Oracle hints containing slot and checkpoint
 */
export async function fetchOracleHints(
  poolAddress: StellarContractAddress,
  maxRetries = 2,
): Promise<PoolOracleHints> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const poolClient = getPoolContractClient({
        contractId: poolAddress,
      })

      const { result }: { result: Partial<OracleHints> } =
        await poolClient.get_oracle_hints({
          timeoutInSeconds: 30,
          fee: 100,
        })

      // Check for legacy pools which is missing an entry
      // in the result tuple (checkpoint_min)
      // This would cause the binding to incorrectly parse the hints with one of
      // the properties being undefined
      if (
        result.checkpoint === undefined ||
        result.slot === undefined ||
        result.checkpoint_min === undefined
      ) {
        throw new Error('Operation not allowed on legacy pool')
      }

      return {
        pool: poolAddress,
        hints: {
          slot: BigInt(result.slot),
          checkpoint: result.checkpoint,
          checkpoint_min: result.checkpoint_min,
        },
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        // Wait 1 second before retry (minute boundary may have just passed)
        await new Promise((resolve) => setTimeout(resolve, ms('1s')))
      }
    }
  }

  throw new Error(
    `Failed to fetch oracle hints after ${maxRetries + 1} attempts: ${lastError?.message}`,
  )
}

/**
 * Check if an error is an "ObservationTooOld" error (Error #62)
 * Only matches the specific contract error to avoid false positives
 * @param error - The error to check
 * @returns true if this is an ObservationTooOld error
 */
export function isObservationTooOldError(error: unknown): boolean {
  if (!error) return false

  const errorString = String(error)

  // Match exact contract error name (most common format)
  if (errorString.includes('ObservationTooOld')) {
    return true
  }

  // Match error code format from Stellar SDK
  if (errorString.includes('Error(Contract, #62)')) {
    return true
  }

  // Log unmatched errors for investigation and refinement
  if (
    errorString.toLowerCase().includes('oracle') ||
    errorString.toLowerCase().includes('slot')
  ) {
    console.debug(
      '[Oracle Hints] Unmatched potential oracle error:',
      errorString,
    )
  }

  return false
}

/**
 * Execute a pool operation with automatic oracle hint retry on failures
 * @param poolAddresses - The pool contract addresses to fetch hints for
 * @param operation - Function that performs the pool operation with oracle hints received in the same order as the poolAddresses param
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Result of the operation
 */
export async function executeWithOracleHints<T>(
  poolAddresses: StellarContractAddress[],
  operation: (hints: PoolOracleHints[]) => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Fetch fresh oracle hints
      const poolHints = await Promise.all(
        poolAddresses.map(async (address) => {
          return await fetchOracleHints(address, 1)
        }),
      )

      // Execute the operation with the hints
      return await operation(poolHints)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Only retry if it's an oracle/footprint error
      if (isObservationTooOldError(error) && attempt < maxRetries) {
        // Wait 1 second before retry (minute boundary may have just passed)
        await new Promise((resolve) => setTimeout(resolve, ms('1s')))
        continue
      }

      // If not an oracle error or we've exhausted retries, throw
      throw lastError
    }
  }

  throw new Error(
    `Operation failed after ${maxRetries + 1} attempts: ${lastError?.message}`,
  )
}
