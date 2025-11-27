import { getTokenContractClient } from './client'
import { contractAddresses } from './contracts'

/**
 * Get the XLM balance of an address
 * @param address The address to get the balance of
 * @returns The balance of the address
 */
export const getXlmBalance = async (address: string): Promise<bigint> => {
  try {
    console.log('🔍 Fetching XLM balance for:', address)
    console.log('📝 XLM Contract Address:', contractAddresses.TOKENS.XLM)

    const xlmContractClient = getTokenContractClient({
      contractId: contractAddresses.TOKENS.XLM,
      // No publicKey needed for read-only balance queries
    })

    console.log('📤 Simulating balance query transaction...')

    // Simulate the transaction
    const assembledTransaction = await xlmContractClient.balance(
      {
        id: address,
      },
      {
        timeoutInSeconds: 30,
        fee: 100,
      },
    )
    const simResult = assembledTransaction.result

    console.log('📥 Simulation result:', simResult)

    return simResult
  } catch (error) {
    console.error('❌ Error getting XLM balance:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      })
    }
    return 0n
  }
}
