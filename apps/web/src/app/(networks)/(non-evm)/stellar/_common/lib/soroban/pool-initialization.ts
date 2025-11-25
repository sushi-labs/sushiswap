import { getPoolContractClient } from './client'

/**
 * Check if a pool is initialized by checking its sqrt price
 * @param address - The pool contract address
 * @returns true if pool is initialized, false otherwise
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
    // If there's an error (like PoolNotInitialized), the pool is not initialized
    if (
      String(error).includes('Error(Contract, #40)') ||
      String(error).includes('PoolNotInitialized')
    ) {
      return false
    }
    console.error('Error checking pool initialization:', error)
    return false
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
