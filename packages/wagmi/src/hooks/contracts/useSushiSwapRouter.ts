'use client'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { uniswapV2RouterAbi } from 'sushi/abi'
import { SUSHISWAP_V2_ROUTER_ADDRESS, SushiSwapV2ChainId } from 'sushi/config'
import { getContract } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

export const getSushiSwapRouterContractConfig = (
  chainId: SushiSwapV2ChainId,
) => ({
  address: SUSHISWAP_V2_ROUTER_ADDRESS[chainId],
  abi: uniswapV2RouterAbi,
})

export function useSushiSwapRouterContract(
  chainId: SushiSwapV2ChainId | undefined,
) {
  const publicClient = usePublicClient<PublicWagmiConfig>({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || (!publicClient && !walletClient)) return null

    return getContract({
      ...(getSushiSwapRouterContractConfig(chainId) as any),
      client: walletClient || publicClient!,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiSwapRouter = NonNullable<
  ReturnType<typeof useSushiSwapRouterContract>
>
