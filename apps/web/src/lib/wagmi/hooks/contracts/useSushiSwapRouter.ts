'use client'

import { useMemo } from 'react'
import {
  SUSHISWAP_V2_ROUTER_ADDRESS,
  type SushiSwapV2ChainId,
  sushiSwapV2RouterAbi,
} from 'sushi/evm'
import { type PublicClient, getContract } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

export function useSushiSwapRouterContract(
  chainId: SushiSwapV2ChainId | undefined,
) {
  const publicClient = usePublicClient({
    chainId,
  }) as PublicClient
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || (!publicClient && !walletClient)) return null

    return getContract({
      address: SUSHISWAP_V2_ROUTER_ADDRESS[chainId],
      abi: sushiSwapV2RouterAbi,
      client: walletClient || publicClient!,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiSwapRouter = NonNullable<
  ReturnType<typeof useSushiSwapRouterContract>
>
