import { ChainId } from '@sushiswap/chain'
import { SUSHISWAP_V2_ROUTER_ADDRESS, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { uniswapV2RouterAbi } from "@sushiswap/abi"
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider, useSigner } from 'wagmi'

export const getSushiSwapKlimaRouterContractConfig = (chainId: typeof ChainId.POLYGON) => ({
  address: '0x85B5cc3ec95AE5D0b02E7c17e53F97C4B02a78e4',
  abi: uniswapV2RouterAbi,
})

export const getSushiSwapRouterContractConfig = (chainId: SushiSwapV2ChainId) => ({
  address: SUSHISWAP_V2_ROUTER_ADDRESS[chainId],
  abi: uniswapV2RouterAbi,
})

export function useSushiSwapRouterContract(chainId: SushiSwapV2ChainId | undefined) {
  const provider = useProvider({ chainId })
  const { data: signer } = useSigner({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getSushiSwapRouterContractConfig(chainId), signerOrProvider: signer ?? provider })
  }, [chainId, provider, signer])
}

export type SushiSwapRouter = NonNullable<ReturnType<typeof useSushiSwapRouterContract>>
