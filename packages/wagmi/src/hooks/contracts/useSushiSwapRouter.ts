'use client'

import { useMemo } from 'react'
import { uniswapV2RouterAbi } from 'sushi/abi'
import { SUSHISWAP_V2_ROUTER_ADDRESS, SushiSwapV2ChainId } from 'sushi/config'
import { WalletClient } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getSushiSwapRouterContractConfig = (
  chainId: SushiSwapV2ChainId,
) => ({
  address: SUSHISWAP_V2_ROUTER_ADDRESS[chainId],
  abi: uniswapV2RouterAbi,
})

export function useSushiSwapRouterContract(
  chainId: SushiSwapV2ChainId | undefined,
) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({
      ...getSushiSwapRouterContractConfig(chainId),
      walletClient: (walletClient as WalletClient) ?? publicClient,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiSwapRouter = NonNullable<
  ReturnType<typeof useSushiSwapRouterContract>
>
