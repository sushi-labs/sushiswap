import tridentExports from '@sushiswap/trident/exports/all.json'
import { useContract, useProvider } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  addressOrName:
    // @ts-ignore
    tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts?.StablePoolFactory
      ?.address ?? '',

  contractInterface:
    // @ts-ignore
    tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts?.StablePoolFactory
      ?.abi ?? [],
})

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return useContract({
    ...getStablePoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
