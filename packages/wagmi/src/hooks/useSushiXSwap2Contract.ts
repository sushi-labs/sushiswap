'use client'

import { sushiXSwap2Abi } from '@sushiswap/abi'
import {
  SUSHIXSWAP_2_ADDRESS,
  SushiXSwap2ChainId,
  isSushiXSwap2ChainId,
} from '@sushiswap/sushixswap-sdk'
import { useMemo } from 'react'
import { WalletClient } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getSushiXSwap2ContractConfig = (chainId: SushiXSwap2ChainId) => ({
  chainId,
  address: SUSHIXSWAP_2_ADDRESS[chainId],
  abi: sushiXSwap2Abi,
})

export function useSushiXSwap2Contract(
  chainId: SushiXSwap2ChainId | undefined,
) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || !isSushiXSwap2ChainId(chainId)) return null

    return getContract({
      ...getSushiXSwap2ContractConfig(chainId),
      walletClient: (walletClient as WalletClient) ?? publicClient,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiXSwapV2 = NonNullable<
  ReturnType<typeof useSushiXSwap2Contract>
>
