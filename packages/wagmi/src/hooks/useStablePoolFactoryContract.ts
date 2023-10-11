'use client'

import { tridentStablePoolFactoryAbi } from 'sushi/abi'
import {
  TRIDENT_STABLE_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from '@sushiswap/trident-sdk'
import { Address, usePublicClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (TRIDENT_STABLE_POOL_FACTORY_ADDRESS?.[chainId as TridentChainId] ??
    '') as Address,
  abi: tridentStablePoolFactoryAbi,
})

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getStablePoolFactoryContract(chainId),
    walletClient: usePublicClient({ chainId }),
  })
}
