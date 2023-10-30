import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { getTridentConstantPoolFactoryContract } from '../actions'

export function useTridentConstantPoolFactoryContract(
  chainId: number | undefined,
) {
  const publicClient = usePublicClient()

  return getContract({
    ...getTridentConstantPoolFactoryContract(chainId),
    publicClient,
  })
}
