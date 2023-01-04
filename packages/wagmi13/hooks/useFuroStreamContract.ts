import { furoStreamAbi } from '@sushiswap/abi'
import furoExports from '@sushiswap/furo/exports'
import { Address, useContract, useProvider } from 'wagmi'

export const getFuroStreamContractConfig = (chainId: number | undefined) => ({
  address: (furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroStream
    ?.address ?? '') as Address,
  abi: furoStreamAbi,
})

export function useFuroStreamContract(chainId: number | undefined) {
  return useContract({
    ...getFuroStreamContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
