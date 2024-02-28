import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

import { type PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { TridentChainId } from 'sushi/config'
import { getTridentStablePoolFactoryContract } from '../actions'

export function useStablePoolFactoryContract(
  chainId: TridentChainId | undefined,
) {
  const client = usePublicClient<PublicWagmiConfig>() as any

  return useMemo(() => {
    if (!chainId) return null

    return getContract({
      ...getTridentStablePoolFactoryContract(chainId),
      client,
    })
  }, [client, chainId])
}
