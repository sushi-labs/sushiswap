import { furoVestingAbi } from '@sushiswap/abi'
import furoExports from '@sushiswap/furo/exports.json'
import { Address, useContract, useProvider } from 'wagmi'

export const getFuroVestingContractConfig = (chainId: number | undefined) => ({
  address: (furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroVesting
    ?.address ?? '') as Address,
  abi: furoVestingAbi,
})

export function useFuroVestingContract(chainId: number | undefined): ReturnType<typeof useContract> {
  return useContract({
    ...getFuroVestingContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
