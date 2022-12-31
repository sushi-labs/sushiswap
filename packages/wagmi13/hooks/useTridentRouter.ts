import tridentExports from '@sushiswap/trident/exports/all.json'
import { Address, useContract, useSigner } from 'wagmi'

// TODO: exports should be in protocol folder
export const getTridentRouterContractConfig = (chainId: number | undefined) => ({
  address: (tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts
    .TridentRouter?.address ?? '') as Address,
  abi:
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
