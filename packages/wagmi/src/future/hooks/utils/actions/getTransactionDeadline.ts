import { readContract } from '@wagmi/core'
import { chainsL2 } from 'sushi/chain'

import { getMulticall3ContractConfig } from '../../../../hooks/useMulticall3Contract'

const L2_DEADLINE_FROM_NOW = 60n * 5n
const TTL = 30n

export const getTransactionDeadline = async (chainId: number) => {
  const currentBlockTimestamp = await readContract({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
  })

  if (
    currentBlockTimestamp &&
    chainId &&
    Object.keys(chainsL2).includes(chainId.toString())
  ) {
    return currentBlockTimestamp + L2_DEADLINE_FROM_NOW
  }

  if (currentBlockTimestamp) {
    return currentBlockTimestamp + TTL * 60n
  }
}
