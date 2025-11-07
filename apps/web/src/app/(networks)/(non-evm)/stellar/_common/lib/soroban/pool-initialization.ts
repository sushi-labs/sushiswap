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

    const slot0Result = await poolContractClient.slot0({
      timeoutInSeconds: 30,
      fee: 100,
    })

    const sqrtPriceX96 = slot0Result.result.sqrt_price_x96

    // Pool is initialized if sqrt_price_x96 is not 0
    return sqrtPriceX96 !== 0n && sqrtPriceX96 !== undefined
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
