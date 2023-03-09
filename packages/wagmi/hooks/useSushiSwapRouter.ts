import { ChainId } from '@sushiswap/chain'
import { uniswapV2Router02Abi, uniswapV2Router02Address, UniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider, useSigner } from 'wagmi'

export const getSushiSwapKlimaRouterContractConfig = (chainId: typeof ChainId.POLYGON) => ({
  address: '0x85B5cc3ec95AE5D0b02E7c17e53F97C4B02a78e4',
  abi: uniswapV2Router02Abi[chainId],
})

export const getSushiSwapRouterContractConfig = (chainId: UniswapV2Router02ChainId) => ({
  address: uniswapV2Router02Address[chainId],
  abi: uniswapV2Router02Abi[chainId],
})

export function useSushiSwapRouterContract(chainId: UniswapV2Router02ChainId | undefined) {
  const provider = useProvider({ chainId })
  const { data: signer } = useSigner({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getSushiSwapRouterContractConfig(chainId), signerOrProvider: signer ?? provider })
  }, [chainId, provider, signer])
}

export type SushiSwapRouter = NonNullable<ReturnType<typeof useSushiSwapRouterContract>>
