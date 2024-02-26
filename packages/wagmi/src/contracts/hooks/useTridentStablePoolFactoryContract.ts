import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { type PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { getTridentStablePoolFactoryContract } from '../actions'

export function useStablePoolFactoryContract(chainId: number | undefined) {
  const publicClient = usePublicClient<PublicWagmiConfig>()

  return getContract({
    ...getTridentStablePoolFactoryContract(chainId),
    client: publicClient,
  })
}
