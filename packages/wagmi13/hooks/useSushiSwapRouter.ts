import { ChainId } from '@sushiswap/chain'
import sushiswapExports from '@sushiswap/sushiswap/exports'
import { useContract, useSigner } from 'wagmi'

type Exports = typeof sushiswapExports

export const getSushiSwapKlimaRouterContractConfig = (chainId: typeof ChainId.POLYGON) => ({
  address: '0x85B5cc3ec95AE5D0b02E7c17e53F97C4B02a78e4',
  abi: sushiswapExports[chainId?.toString() as keyof Exports]?.[0]?.contracts?.UniswapV2Router02?.abi ?? [],
})

// TODO CELO NOT FOUND?
export const getSushiSwapRouterContractConfig = (chainId: number | undefined) => ({
  address: sushiswapExports[chainId?.toString() as keyof Exports]?.[0]?.contracts?.UniswapV2Router02?.address ?? '',
  abi: sushiswapExports[chainId?.toString() as keyof Exports]?.[0]?.contracts?.UniswapV2Router02?.abi ?? [],
})

export function useSushiSwapRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getSushiSwapRouterContractConfig(chainId),
    signerOrProvider,
  })
}
