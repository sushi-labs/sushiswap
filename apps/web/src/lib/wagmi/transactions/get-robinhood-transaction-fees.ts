import { EvmChainId } from 'sushi/evm'
import type { FeeValuesEIP1559, PublicClient } from 'viem'
import { robinhood } from 'viem/chains'

type RobinhoodTransactionFees = FeeValuesEIP1559 & {
  type: 'eip1559'
  gasPrice: undefined
}

// Call immediately before sending, outside the quote/query cache. The cap
// allows the base fee to double while the user signs without increasing the tip.
export async function getRobinhoodTransactionFees(
  chainId: EvmChainId | undefined,
  client: Pick<PublicClient, 'chain' | 'estimateFeesPerGas'> | undefined,
): Promise<RobinhoodTransactionFees | undefined> {
  if (chainId !== EvmChainId.ROBINHOOD) return undefined
  if (client?.chain?.id !== chainId) {
    throw new Error('Robinhood fee estimation requires a Robinhood RPC client')
  }

  const fees = await client.estimateFeesPerGas({
    chain: { ...robinhood, fees: { baseFeeMultiplier: 2 } },
    type: 'eip1559',
  })

  return {
    ...fees,
    type: 'eip1559',
    // Override any legacy gas price retained in a cross-chain provider quote.
    gasPrice: undefined,
  }
}
