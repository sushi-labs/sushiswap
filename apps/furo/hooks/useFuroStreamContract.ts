import { AddressZero } from '@ethersproject/constants'
import furoExports from '@sushiswap/furo/exports.json'
import { useContract, useProvider } from 'wagmi'

export function useFuroStreamContract(chainId: number | undefined) {
  return useContract({
    addressOrName:
      furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.address ?? AddressZero,
    contractInterface:
      furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.abi ?? [],
    signerOrProvider: useProvider({ chainId }),
  })
}
