import { getPoolContractClient } from './client'

/**
 * Check if a pool is initialized by checking its sqrt price
 * @param address - The pool contract address
 * @returns true if pool is initialized, false otherwise
 * @throws Error if there's an RPC/network error (not a "pool not initialized" error)
 */
export async function isPoolInitialized(address: string): Promise<boolean> {
  try {
    const poolContractClient = getPoolContractClient({
      contractId: address,
    })

    const isInitializedResult = await poolContractClient.is_initialized({
      timeoutInSeconds: 30,
      fee: 100,
    })

    return isInitializedResult.result
  } catch (error) {
    const errorString = String(error)

    // Only return false for actual "not initialized" contract errors
    // These are the specific error codes/messages from the contract
    if (
      errorString.includes('Error(Contract, #40)') ||
      errorString.includes('PoolNotInitialized')
    ) {
      return false
    }

    // For any other error (RPC timeout, network error, etc.), rethrow
    // This allows React Query to retry and show proper error state
    console.error('Error checking pool initialization:', error)
    throw new Error(
      `Failed to check pool initialization: ${error instanceof Error ? error.message : errorString}`,
    )
  }
}

/**
 * Initialize a pool
 * @param poolAddress - The pool contract address
 * @param sqrtPriceX96 - Initial sqrt price in X96 format
 * @param publicKey - Public key of the signer
 * @returns Result of the initialization transaction
 */
export async function initializePool(
  poolAddress: string,
  sqrtPriceX96: bigint,
  publicKey: string,
) {
  const poolClient = getPoolContractClient({
    contractId: poolAddress,
    publicKey,
  })

  // Initialize only requires sqrt_price_x96 - slot is computed internally by the contract
  return await poolClient.initialize({
    sqrt_price_x96: sqrtPriceX96,
  })
}
