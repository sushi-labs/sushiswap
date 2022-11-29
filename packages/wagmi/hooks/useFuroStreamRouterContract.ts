import furoExports from '@sushiswap/furo/exports.json'
import { FuroStreamRouter } from '@sushiswap/furo/typechain'
import { Address, useContract, useProvider } from 'wagmi'

export const getFuroStreamRouterContractConfig = (chainId: number | undefined) => ({
  // @ts-ignore
  address: (furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroStreamRouter
    ?.address ?? '') as Address,
  abi:
    // @ts-ignore
    furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroStreamRouter?.abi ??
    [],
})

export function useFuroStreamRouterContract(chainId: number | undefined): FuroStreamRouter | null {
  return useContract({
    ...getFuroStreamRouterContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  }) as FuroStreamRouter
}
