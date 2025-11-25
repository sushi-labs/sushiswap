import { getPoolContractClient } from '../soroban/client'

/**
 * Oracle hints for pool operations
 * Contains both slot and checkpoint hints for deterministic storage access
 */
export interface OracleHints {
  slot: bigint
  checkpoint: number
}

/**
 * Fetch oracle hints from pool with retry logic
 * @param poolAddress - The pool contract address
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Oracle hints containing slot and checkpoint
 */
export async function fetchOracleHints(
  poolAddress: string,
  maxRetries = 2,
): Promise<OracleHints> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const poolClient = getPoolContractClient({
        contractId: poolAddress,
      })

      const { result } = await poolClient.get_oracle_hints({
        timeoutInSeconds: 30,
        fee: 100,
      })

      return {
        slot: BigInt(result.slot),
        checkpoint: result.checkpoint,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        // Wait 1 second before retry (minute boundary may have just passed)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(
          `Retrying oracle hints fetch (attempt ${attempt + 2}/${maxRetries + 1})...`,
        )
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
 * @param poolAddress - The pool contract address
 * @param operation - Function that performs the pool operation with oracle hints
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Result of the operation
 */
export async function executeWithOracleHints<T>(
  poolAddress: string,
  operation: (hints: OracleHints) => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Fetch fresh oracle hints
      const hints = await fetchOracleHints(poolAddress, 1)

      // Execute the operation with the hints
      return await operation(hints)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Only retry if it's an oracle/footprint error
      if (isObservationTooOldError(error) && attempt < maxRetries) {
        console.log(
          `Oracle footprint error detected, retrying with fresh hints (attempt ${attempt + 2}/${maxRetries + 1})...`,
        )
        // Wait 1 second before retry (minute boundary may have just passed)
        await new Promise((resolve) => setTimeout(resolve, 1000))
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
