import { TridentRouterChainId, tridentRouterExports } from '@sushiswap/trident-core'
import { Address, useContract, useSigner } from 'wagmi'

// TODO: exports should be in protocol folder
export const getTridentRouterContractConfig = (chainId: number | undefined) => ({
  address: (tridentRouterExports[chainId as TridentRouterChainId]?.address ?? '') as Address,
  abi: tridentRouterExports[chainId as TridentRouterChainId]?.abi ?? [],
})

export function useTridentRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getTridentRouterContractConfig(chainId),
    signerOrProvider,
  })
}
