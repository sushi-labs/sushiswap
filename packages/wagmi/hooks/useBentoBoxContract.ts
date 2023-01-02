import { getBentoBoxContractConfig } from '@sushiswap/wagmi-config'
import { Contract } from 'ethers'
import { useContract, useProvider } from 'wagmi'

export function useBentoBoxContract(chainId: number | undefined): Contract | null {
  return useContract({
    ...getBentoBoxContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
