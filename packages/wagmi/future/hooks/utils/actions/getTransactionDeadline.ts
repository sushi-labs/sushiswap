import { chainsL2 } from '@sushiswap/chain'
import { getMulticall3ContractConfig } from '../../../../hooks/useMulticall3Contract'
import { readContract } from '@wagmi/core'

const L2_DEADLINE_FROM_NOW = 60 * 5
const TTL = 30

export const getTransactionDeadline = async (chainId: number) => {
  const currentBlockTimestamp = await readContract({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
  })

  if (currentBlockTimestamp && chainId && Object.keys(chainsL2).includes(chainId.toString())) {
    return currentBlockTimestamp.add(L2_DEADLINE_FROM_NOW)
  }

  if (currentBlockTimestamp) {
    return currentBlockTimestamp.add(TTL * 60)
  }
}
