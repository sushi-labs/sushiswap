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
