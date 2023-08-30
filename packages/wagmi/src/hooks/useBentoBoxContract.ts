'use client'

import { bentoBoxV1Abi } from '@sushiswap/abi'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getBentoBoxContractConfig = (chainId: BentoBoxChainId) => ({
  address: BENTOBOX_ADDRESS[chainId],
  abi: bentoBoxV1Abi,
})

export function useBentoBoxContract(chainId: BentoBoxChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getBentoBoxContractConfig(chainId), publicClient })
}
export type BentoBox = NonNullable<ReturnType<typeof useBentoBoxContract>>
