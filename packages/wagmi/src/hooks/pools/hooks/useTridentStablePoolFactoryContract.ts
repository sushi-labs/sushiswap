'use client'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { TridentChainId } from 'sushi/config'
import { PublicClient, getContract } from 'viem'
import { usePublicClient } from 'wagmi'
import { getTridentStablePoolFactoryContract } from '../../../contracts'

export function useTridentStablePoolFactoryContract(
  chainId: TridentChainId | undefined,
) {
  const client = usePublicClient<PublicWagmiConfig>({ chainId }) as PublicClient

  return useMemo(() => {
    if (!chainId) return null

    return getContract({
      ...getTridentStablePoolFactoryContract(chainId),
      client,
    })
  }, [chainId, client])
}
