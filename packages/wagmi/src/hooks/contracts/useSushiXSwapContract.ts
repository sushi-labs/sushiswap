'use client'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { sushiXSwapAbi } from 'sushi/abi'
import { SUSHIXSWAP_ADDRESS, SushiXSwapChainId } from 'sushi/config'
import { getContract } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

export const getSushiXSwapContractConfig = (chainId: SushiXSwapChainId) => ({
  chainId,
  address: SUSHIXSWAP_ADDRESS[chainId],
  abi: sushiXSwapAbi,
})

export function useSushiXSwapContract(chainId: SushiXSwapChainId | undefined) {
  const publicClient = usePublicClient<PublicWagmiConfig>({ chainId }) as any
  const { data: walletClient } = useWalletClient({ chainId }) as any

  return useMemo(() => {
    if (!chainId || (!publicClient && !walletClient)) return null

    return getContract({
      ...getSushiXSwapContractConfig(chainId),
      client: walletClient || publicClient!,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiXSwap = NonNullable<ReturnType<typeof useSushiXSwapContract>>
