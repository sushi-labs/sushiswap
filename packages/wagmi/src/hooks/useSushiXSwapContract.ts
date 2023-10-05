'use client'

import { sushiXSwapAbi } from 'sushi/abi'
import { isSushiXSwapChainId, SUSHIXSWAP_ADDRESS, SushiXSwapChainId } from '@sushiswap/sushixswap-sdk'
import { useMemo } from 'react'
import { WalletClient } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getSushiXSwapContractConfig = (chainId: SushiXSwapChainId) => ({
  chainId,
  address: SUSHIXSWAP_ADDRESS[chainId],
  abi: sushiXSwapAbi,
})

export function useSushiXSwapContract(chainId: SushiXSwapChainId | undefined) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || !isSushiXSwapChainId(chainId)) return null

    return getContract({
      ...getSushiXSwapContractConfig(chainId),
      walletClient: (walletClient as WalletClient) ?? publicClient,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiXSwap = NonNullable<ReturnType<typeof useSushiXSwapContract>>
