import { simulateTransaction } from './simulateTransaction';

/**
 * Gets a pair from the kdswap-exchange module
 * @param firstToken The first token in the pair
 * @param secondToken The second token in the pair
 * @param chainId The chain ID (defaults to '1')
 * @param signers Array of signers with public keys (defaults to a single signer)
 * @param gasLimit The gas limit for the transaction (defaults to 3000)
 * @param gasPrice The gas price for the transaction (defaults to 1e-8)
 * @returns Promise with simulation results
 */
export async function getPair(
  firstToken: string,
  secondToken: string,
  chainId = '1',
  signers = [
    {
      pubKey:
        'dc5dd2bd89ec8ba9d18da66ed17c83800c15c8b70b26f235cc289c8ff15ba7f6',
    },
  ],
  gasLimit = 3000,
  gasPrice = 1e-8,
) {
  try {
    // Create the Pact code with variables
    const code = `(kdlaunch.kdswap-exchange.get-pair ${firstToken} ${secondToken})`

    // Call the simulateTransaction function with the code
    const result = await simulateTransaction({
      code,
      data: {},
      gasLimit,
      gasPrice,
      chainId,
      signers,
    })

    return result
  } catch (error) {
    console.error('Error getting pair:', error)
    throw error
  }
}
