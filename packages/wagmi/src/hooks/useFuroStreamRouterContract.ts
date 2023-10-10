'use client'

import { furoStreamRouterAbi } from 'sushi/abi'
import { FURO_STREAM_ROUTER_ADDRESS, FuroChainId } from '@sushiswap/furo-sdk'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroStreamRouterContractConfig = (chainId: FuroChainId) => ({
  address: FURO_STREAM_ROUTER_ADDRESS[chainId],
  abi: furoStreamRouterAbi,
})

export function useFuroStreamRouterContract(chainId: FuroChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({
    ...getFuroStreamRouterContractConfig(chainId),
    publicClient,
  })
}

export type FuroStreamRouter = NonNullable<
  ReturnType<typeof useFuroStreamRouterContract>
>
