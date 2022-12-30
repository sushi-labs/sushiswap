import tridentExports from '@sushiswap/trident/exports/all.json'
import { useContract, useProvider } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address:
    // @ts-ignore
    tridentExports[
      chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>
      // @ts-ignore
    ]?.[0]?.contracts?.StablePoolFactory?.address ?? '',

  abi:
    // @ts-ignore
    tridentExports[
      chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>
      // @ts-ignore
    ]?.[0]?.contracts?.StablePoolFactory?.abi ?? [],
})

export function useStablePoolFactoryContract(chainId: number | undefined): ReturnType<typeof useContract> {
  return useContract({
    ...getStablePoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
