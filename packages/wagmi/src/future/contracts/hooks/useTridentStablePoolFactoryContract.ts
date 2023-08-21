import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { getStablePoolFactoryContract } from '../../../hooks'

export function useStablePoolFactoryContract(chainId: number | undefined) {
  const publicClient = usePublicClient()

  return getContract({
    ...getStablePoolFactoryContract(chainId),
    publicClient,
  })
}
