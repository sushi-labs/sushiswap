import TRIDENT from '@sushiswap/trident/exports/all.json'
import { useContract, useSigner } from 'wagmi'

// TODO TRIDENT export should be in protocol folder
export const getTridentRouterContractConfig = (chainId: number | undefined) => ({
  // @ts-ignore
  addressOrName: TRIDENT[chainId]?.[0]?.contracts.TridentRouter.address,
  // @ts-ignore
  contractInterface: TRIDENT[chainId]?.[0]?.contracts.TridentRouter.abi,
})

export function useTridentRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getTridentRouterContractConfig(chainId),
    signerOrProvider,
  })
}
