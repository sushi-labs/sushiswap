import { ChainId } from '@sushiswap/chain'
import TRIDENT from '@sushiswap/trident/exports/all.json'
import { useContract, useProvider } from 'wagmi'

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  // @ts-ignore
  addressOrName: TRIDENT[chainId]?.[0]?.contracts.ConstantProductPoolFactory.address,
  // @ts-ignore
  contractInterface: TRIDENT[chainId]?.[0]?.contracts.ConstantProductPoolFactory.abi,
})

export function useConstantProductPoolFactoryContract(chainId: ChainId) {
  return useContract({
    ...getConstantProductPoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
