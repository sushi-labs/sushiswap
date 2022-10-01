import { ChainId } from '@sushiswap/chain'
import sushiswapExports from '@sushiswap/sushiswap/exports.json'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { getContract } from 'wagmi/actions'

type Exports = typeof sushiswapExports

export const getSushiSwapKlimaRouterContractConfig = (chainId: typeof ChainId.POLYGON) => ({
  addressOrName: '0x85B5cc3ec95AE5D0b02E7c17e53F97C4B02a78e4',
  contractInterface:
    sushiswapExports[chainId?.toString() as keyof Exports]?.[0]?.contracts?.UniswapV2Router02?.abi ?? [],
})

// TODO CELO NOT FOUND?
export const getSushiSwapRouterContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    sushiswapExports[chainId?.toString() as keyof Exports]?.[0]?.contracts?.UniswapV2Router02?.address ?? '',
  contractInterface:
    sushiswapExports[chainId?.toString() as keyof Exports]?.[0]?.contracts?.UniswapV2Router02?.abi ?? [],
})

export function useSushiSwapRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useMemo(() => {
    if (!chainId || !(chainId in sushiswapExports)) return
    return getContract({
      ...getSushiSwapRouterContractConfig(chainId),
      signerOrProvider,
    })
  }, [chainId, signerOrProvider])
}
