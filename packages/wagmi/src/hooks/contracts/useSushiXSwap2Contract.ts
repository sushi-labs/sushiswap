'use client'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { sushiXSwap2Abi } from 'sushi/abi'
import { SUSHIXSWAP_2_ADDRESS, SushiXSwap2ChainId } from 'sushi/config'
import { getContract } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

export const getSushiXSwap2ContractConfig = (chainId: SushiXSwap2ChainId) => ({
  chainId,
  address: SUSHIXSWAP_2_ADDRESS[chainId],
  abi: sushiXSwap2Abi,
})

export function useSushiXSwap2Contract(
  chainId: SushiXSwap2ChainId | undefined,
) {
  const publicClient = usePublicClient<PublicWagmiConfig>({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || (!publicClient && !walletClient)) return null

    return getContract({
      ...(getSushiXSwap2ContractConfig(chainId) as any),
      client: walletClient || publicClient!,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiXSwapV2 = NonNullable<
  ReturnType<typeof useSushiXSwap2Contract>
>
