'use client'

import { uniswapV2RouterAbi } from 'sushi/abi'
import { ChainId } from '@sushiswap/chain'
import { SUSHISWAP_V2_ROUTER_ADDRESS, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { useMemo } from 'react'
import { WalletClient } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getSushiSwapKlimaRouterContractConfig = (chainId: typeof ChainId.POLYGON) => ({
  address: '0x85B5cc3ec95AE5D0b02E7c17e53F97C4B02a78e4',
  abi: uniswapV2RouterAbi,
})

export const getSushiSwapRouterContractConfig = (chainId: SushiSwapV2ChainId) => ({
  address: SUSHISWAP_V2_ROUTER_ADDRESS[chainId],
  abi: uniswapV2RouterAbi,
})

export function useSushiSwapRouterContract(chainId: SushiSwapV2ChainId | undefined) {
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

export type SushiSwapRouter = NonNullable<ReturnType<typeof useSushiSwapRouterContract>>
