import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { getTridentConstantPoolFactoryContract } from '../../../hooks'

export function useTridentConstantPoolFactoryContract(
  chainId: number | undefined,
) {
  const publicClient = usePublicClient()

  return getContract({
    ...getTridentConstantPoolFactoryContract(chainId),
    publicClient,
  })
}
