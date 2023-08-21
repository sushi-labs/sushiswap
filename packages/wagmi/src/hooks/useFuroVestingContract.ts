import { furoVestingAbi, furoVestingAddress, FuroVestingChainId } from '@sushiswap/furo'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroVestingContractConfig = (chainId: FuroVestingChainId) => ({
  address: furoVestingAddress[chainId],
  abi: furoVestingAbi[chainId],
})

export function useFuroVestingContract(chainId: FuroVestingChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getFuroVestingContractConfig(chainId), publicClient })
}

export type FuroVesting = NonNullable<ReturnType<typeof useFuroVestingContract>>
