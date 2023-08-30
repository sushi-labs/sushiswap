import { sushiXSwapV2Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { WalletClient, getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'

export const sushiXSwapV2Address = {
  [ChainId.ARBITRUM]: '0xec4a1bf5738841456054bd720bedf18be2e3f8f0',
  [ChainId.OPTIMISM]: '0xd9d93d4daa6656b13dbc1997a0c543ac86ff2690',
  [ChainId.POLYGON]: '0xc45a496bcc9ba69ffb45303f7515739c3f6ff921',
  [ChainId.BSC]: '0xdd9c6c40171ea2dfc31ed00b0a58be2c8a3c7971',
  [ChainId.ETHEREUM]: '0xd294d0d26ef0ff2087a35616b7aada083c53640f',
  [ChainId.AVALANCHE]: '0xfec47ce995b4f3c0e42ef4d477150313a4d22211',
} as const

export type SushiXSwapV2ChainId = keyof typeof sushiXSwapV2Address

export const isSushiXSwapV2ChainId = (chainId: number) => chainId in sushiXSwapV2Address

export const getSushiXSwapV2ContractConfig = (chainId: SushiXSwapV2ChainId) => ({
  chainId,
  address: sushiXSwapV2Address[chainId],
  abi: sushiXSwapV2Abi,
})

export function useSushiXSwapV2Contract(chainId: SushiXSwapV2ChainId | undefined) {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || !isSushiXSwapV2ChainId(chainId)) return null

    return getContract({
      ...getSushiXSwapV2ContractConfig(chainId),
      walletClient: (walletClient as WalletClient) ?? publicClient,
    })
  }, [chainId, publicClient, walletClient])
}

export type SushiXSwapV2 = NonNullable<ReturnType<typeof useSushiXSwapV2Contract>>
