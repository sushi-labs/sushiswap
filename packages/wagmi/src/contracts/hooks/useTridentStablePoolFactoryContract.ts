import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { getTridentStablePoolFactoryContract } from '../actions'

export function useStablePoolFactoryContract(chainId: number | undefined) {
  const publicClient = usePublicClient()

  return getContract({
    ...getTridentStablePoolFactoryContract(chainId),
    publicClient,
  })
}
