'use client'

import { useMemo } from 'react'
import { ChefType } from 'sushi'
import { ChainId } from 'sushi/chain'
import {
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MINICHEF_ADDRESS,
} from 'sushi/config'
import { Address } from 'viem'

export const _getMasterChefContractConfig = (
  chainId: keyof typeof MASTERCHEF_ADDRESS,
) =>
  ({
    chainId,
    address: MASTERCHEF_ADDRESS[chainId] as Address,
  }) as const

export const getMasterChefContractV2Config = (
  chainId: keyof typeof MASTERCHEF_V2_ADDRESS,
) =>
  ({
    chainId,
    address: MASTERCHEF_V2_ADDRESS[chainId] as Address,
  }) as const

export const getMiniChefContractConfig = (
  chainId: keyof typeof MINICHEF_ADDRESS,
) => {
  return {
    chainId,
    address: MINICHEF_ADDRESS[chainId] as Address,
  } as const
}

export const getMasterChefContractConfig = (
  chainId: ChainId,
  chef: Omit<ChefType, 'Merkl'>,
) => {
  if (chef === ChefType.MasterChefV1)
    return _getMasterChefContractConfig(
      chainId as keyof typeof MASTERCHEF_ADDRESS,
    )
  if (chef === ChefType.MasterChefV2)
    return getMasterChefContractV2Config(
      chainId as keyof typeof MASTERCHEF_V2_ADDRESS,
    )
  if (chef === ChefType.MiniChef)
    return getMiniChefContractConfig(chainId as keyof typeof MINICHEF_ADDRESS)

  throw new Error('Invalid chef type')
}

export function useMasterChefContract(
  chainId: ChainId | undefined,
  chef: Omit<ChefType, 'Merkl'>,
) {
  return useMemo(() => {
    if (!chainId) return null

    return getMasterChefContractConfig(chainId, chef)
  }, [chainId, chef])
}
