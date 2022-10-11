import sushiXSwapExports from '@sushiswap/sushixswap/exports.json'
import { SushiXSwap } from '@sushiswap/sushixswap/typechain'
import { useContract, useProvider, useSigner } from 'wagmi'

export const getSushiXSwapContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    sushiXSwapExports[chainId?.toString() as keyof Omit<typeof sushiXSwapExports, '31337'>]?.[0]?.contracts?.SushiXSwap
      ?.address ?? '',
  contractInterface:
    sushiXSwapExports[chainId?.toString() as keyof Omit<typeof sushiXSwapExports, '31337'>]?.[0]?.contracts?.SushiXSwap
      ?.abi ?? [],
})

export function useSushiXSwapContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract<SushiXSwap>({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider,
  })
}

export function useSushiXSwapContractWithProvider(chainId: number | undefined) {
  const provider = useProvider({ chainId })
  return useContract<SushiXSwap>({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider: provider,
  })
}
