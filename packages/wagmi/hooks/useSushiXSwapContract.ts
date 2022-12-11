import sushiXSwapExports from '@sushiswap/sushixswap/exports.json'
import { SushiXSwap } from '@sushiswap/sushixswap/typechain'
import { Address, useContract, useProvider, useSigner } from 'wagmi'

export const getSushiXSwapContractConfig = (chainId: number | undefined) =>
  ({
    address: (sushiXSwapExports[chainId?.toString() as keyof Omit<typeof sushiXSwapExports, '31337'>]?.[0]?.contracts
      ?.SushiXSwap?.address ?? '') as Address,
    abi:
      sushiXSwapExports[chainId?.toString() as keyof Omit<typeof sushiXSwapExports, '31337'>]?.[0]?.contracts
        ?.SushiXSwap?.abi ?? [],
  } as const)

export function useSushiXSwapContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider,
  }) as SushiXSwap
}

export function useSushiXSwapContractWithProvider(chainId: number | undefined) {
  const provider = useProvider({ chainId })
  return useContract({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider: provider,
  }) as SushiXSwap
}
