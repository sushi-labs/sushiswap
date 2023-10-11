'use client'

import { furoVestingRouterAbi } from 'sushi/abi'
import { FURO_VESTING_ROUTER_ADDRESS, FuroChainId } from '@sushiswap/furo-sdk'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroVestingRouterContractConfig = (chainId: FuroChainId) => ({
  address: FURO_VESTING_ROUTER_ADDRESS[chainId],
  abi: furoVestingRouterAbi,
})

export function useFuroVestingRouterContract(chainId: FuroChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({
    ...getFuroVestingRouterContractConfig(chainId),
    publicClient,
  })
}

export type FuroVestingRouter = NonNullable<
  ReturnType<typeof useFuroVestingRouterContract>
>
