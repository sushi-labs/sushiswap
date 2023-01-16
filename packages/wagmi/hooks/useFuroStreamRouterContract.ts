import furoExports from '@sushiswap/furo/exports'
import { Address, useContract, useProvider } from 'wagmi'

export const getFuroStreamRouterContractConfig = (chainId: number | undefined) => ({
  // @ts-ignore
  // @ts-ignore
  address: (furoExports[chainId as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroStreamRouter
    ?.address || '') as Address,
  abi:
    // @ts-ignore
    furoExports[
      chainId as unknown as keyof Omit<typeof furoExports, '31337'>
      // @ts-ignore
    ]?.[0]?.contracts?.FuroStreamRouter?.abi ?? [],
})

export function useFuroStreamRouterContract(chainId: number | undefined) {
  return useContract({
    ...getFuroStreamRouterContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}

export type FuroStreamRouter = NonNullable<ReturnType<typeof useFuroStreamRouterContract>>
