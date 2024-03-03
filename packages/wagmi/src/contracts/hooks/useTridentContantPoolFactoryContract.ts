import { PublicClient, getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { type PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { TridentChainId } from 'sushi/config'
import { getTridentConstantPoolFactoryContract } from '../actions'

export function useTridentConstantPoolFactoryContract(
  chainId: TridentChainId | null,
) {
  const client = usePublicClient<PublicWagmiConfig>() as PublicClient

  return useMemo(() => {
    if (!chainId) return null

    return getContract({
      ...getTridentConstantPoolFactoryContract(chainId),
      client,
    })
  }, [client, chainId])
}
