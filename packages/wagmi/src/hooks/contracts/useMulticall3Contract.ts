'use client'

import { PublicWagmiConfig, publicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { multicall3Abi } from 'sushi/abi'
import { Address, getContract } from 'viem'
import { usePublicClient } from 'wagmi'

type Multicall3ChainId = (typeof publicWagmiConfig)['chains'][number]['id']

export const getMulticall3ContractConfig = (
  chainId: Multicall3ChainId | undefined,
) => ({
  address: (publicWagmiConfig.chains.find((chain) => chain?.id === chainId)
    ?.contracts?.multicall3?.address || '') as Address,
  abi: multicall3Abi,
})

export function useMulticall3Contract(chainId: Multicall3ChainId | undefined) {
  const client = usePublicClient<PublicWagmiConfig>({ chainId })

  return useMemo(() => {
    if (!client || !chainId) return null

    getContract({
      ...(getMulticall3ContractConfig(chainId) as any),
      client,
    })
  }, [client, chainId])
}
