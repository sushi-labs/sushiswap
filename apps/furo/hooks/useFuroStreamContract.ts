import { AddressZero } from '@ethersproject/constants'
import furoExports from '@sushiswap/furo/exports.json'
import { FuroStream } from '@sushiswap/furo/typechain'
import { Contract } from 'ethers'
import { useContract, useProvider } from 'wagmi'
export function useFuroStreamContract(chainId?: number): Contract | null {
  return useContract<FuroStream>({
    addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroStream.address : AddressZero,
    contractInterface: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroStream.abi : undefined,
    signerOrProvider: useProvider({ chainId }),
  })
}
