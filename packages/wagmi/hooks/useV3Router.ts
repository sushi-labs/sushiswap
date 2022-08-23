import TRIDENT from '@sushiswap/trident/exports/all.json'
import { useContract, useSigner } from 'wagmi'

export const getV3RouterContractConfig = (chainId: number | undefined) => ({
  // @ts-ignore
  addressOrName: TRIDENT[chainId]?.[0]?.contracts.TridentRouter.address,
  // @ts-ignore
  contractInterface: TRIDENT[chainId]?.[0]?.contracts.TridentRouter.abi,
})

export function useV3RouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getV3RouterContractConfig(chainId),
    signerOrProvider,
  })
}
