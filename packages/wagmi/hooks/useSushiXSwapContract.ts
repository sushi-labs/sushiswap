import { sushiXSwapAbi } from '@sushiswap/abi'
import sushiXSwapExports from '@sushiswap/sushixswap/exports.json'
import { Address, useContract, useProvider, useSigner } from 'wagmi'

export type SushiXSwapChainId = keyof Omit<typeof sushiXSwapExports, '31337'>

export const getSushiXSwapContractConfig = (chainId: number | undefined) =>
  ({
    address: (chainId
      ? sushiXSwapExports[chainId.toString() as SushiXSwapChainId]?.[0]?.contracts?.SushiXSwap?.address
      : '') as Address,
    abi: sushiXSwapAbi,
  } as const)

export function useSushiXSwapContract(chainId: number | undefined): ReturnType<typeof useContract> {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider,
  } as const)
}

export function useSushiXSwapContractWithProvider(chainId: number | undefined): ReturnType<typeof useContract> {
  const provider = useProvider({ chainId: Number(chainId) })
  return useContract({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider: provider,
  } as const)
}
