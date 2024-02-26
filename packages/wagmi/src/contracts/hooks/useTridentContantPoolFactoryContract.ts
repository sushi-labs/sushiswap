import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { type PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { getTridentConstantPoolFactoryContract } from '../actions'

export function useTridentConstantPoolFactoryContract(
  chainId: number | undefined,
) {
  const publicClient = usePublicClient<PublicWagmiConfig>()

  return getContract({
    ...getTridentConstantPoolFactoryContract(chainId),
    client: publicClient,
  })
}
