import sushiswapArtifact from '@sushiswap/sushiswap/artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import sushiswapExports from '@sushiswap/sushiswap/exports.json'
import { useContract, useSigner } from 'wagmi'

export const getSushiSwapKlimaRouterContractConfig = (chainId: number | undefined) => ({
  addressOrName: '0x85B5cc3ec95AE5D0b02E7c17e53F97C4B02a78e4',
  contractInterface:
    sushiswapExports[chainId as unknown as keyof Omit<typeof sushiswapExports, '31337'>]?.[0]?.contracts
      ?.UniswapV2Router02?.abi ?? sushiswapArtifact.abi,
})

// TODO CELO NOT FOUND?
export const getSushiSwapRouterContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    sushiswapExports[chainId as unknown as keyof Omit<typeof sushiswapExports, '31337'>]?.[0]?.contracts
      ?.UniswapV2Router02?.address ?? '',
  contractInterface:
    sushiswapExports[chainId as unknown as keyof Omit<typeof sushiswapExports, '31337'>]?.[0]?.contracts
      ?.UniswapV2Router02?.abi ?? [],
})

export function useSushiSwapRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getSushiSwapRouterContractConfig(chainId),
    signerOrProvider,
  })
}
