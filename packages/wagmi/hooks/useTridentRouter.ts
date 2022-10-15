import tridentExports from '@sushiswap/trident/exports/all.json'
import { useContract, useSigner } from 'wagmi'

// TODO: exports should be in protocol folder
export const getTridentRouterContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts.TridentRouter
      ?.address ?? '',
  contractInterface:
    tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts.TridentRouter
      ?.abi ?? [],
})

export function useTridentRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getTridentRouterContractConfig(chainId),
    signerOrProvider,
  })
}
