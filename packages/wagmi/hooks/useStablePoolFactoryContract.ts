import { AddressZero } from '@ethersproject/constants'
import TRIDENT from '@sushiswap/trident/exports/all.json'
import { useContract, useProvider } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  // @ts-ignore
  addressOrName: TRIDENT[chainId]?.[0]?.contracts?.StablePoolFactory?.address ?? AddressZero,
  // @ts-ignore
  contractInterface: TRIDENT[chainId]?.[0]?.contracts?.StablePoolFactory?.abi ?? [],
})

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return useContract({
    ...getStablePoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
