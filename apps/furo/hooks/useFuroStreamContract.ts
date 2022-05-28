import { AddressZero } from '@ethersproject/constants'
import furoExports from '@sushiswap/furo/exports.json'
import FURO_STREAM_ABI from 'abis/FuroStream.json'
import { useContract, useProvider } from 'wagmi'

export function useFuroStreamContract(chainId: number | undefined) {
  return useContract({
    addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroStream.address : AddressZero,
    contractInterface: FURO_STREAM_ABI,
    signerOrProvider: useProvider({ chainId }),
  })
}
