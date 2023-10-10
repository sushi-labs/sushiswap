'use client'

import { furoStreamAbi } from 'sushi/abi'
import { FURO_STREAM_ADDRESS, FuroChainId } from '@sushiswap/furo-sdk'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroStreamContractConfig = (chainId: FuroChainId) => ({
  address: FURO_STREAM_ADDRESS[chainId],
  abi: furoStreamAbi,
})

export function useFuroStreamContract(chainId: FuroChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getFuroStreamContractConfig(chainId), publicClient })
}

export type FuroStream = NonNullable<ReturnType<typeof useFuroStreamContract>>
