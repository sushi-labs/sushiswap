'use client'

import { furoVestingAbi } from 'sushi/abi'
import { FURO_VESTING_ADDRESS, FuroChainId } from '@sushiswap/furo-sdk'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroVestingContractConfig = (chainId: FuroChainId) => ({
  address: FURO_VESTING_ADDRESS[chainId],
  abi: furoVestingAbi,
})

export function useFuroVestingContract(chainId: FuroChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getFuroVestingContractConfig(chainId), publicClient })
}

export type FuroVesting = NonNullable<ReturnType<typeof useFuroVestingContract>>
