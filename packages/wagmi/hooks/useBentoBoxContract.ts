import { Contract } from 'ethers'
import { useContract, useProvider } from 'wagmi'
import { getBentoBoxContractConfig } from '@sushiswap/wagmi-config'

export function useBentoBoxContract(chainId: number | undefined): Contract | null {
  return useContract({
    ...getBentoBoxContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
