'use client'

import { tridentRouterAbi } from 'sushi/abi'
import { TRIDENT_ROUTER_ADDRESS, TridentChainId } from '@sushiswap/trident-sdk'
import { useMemo } from 'react'
import { WalletClient } from 'viem'
import { Address, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getTridentRouterContractConfig = (
  chainId: number | undefined,
) => ({
  address: (TRIDENT_ROUTER_ADDRESS[chainId as TridentChainId] ?? '') as Address,
  abi: tridentRouterAbi,
})

export function useTridentRouterContract(chainId: number | undefined) {
  const { data: walletClient } = useWalletClient()

  return useMemo(
    () =>
      getContract({
        ...getTridentRouterContractConfig(chainId),
        walletClient: walletClient as WalletClient,
      }),
    [walletClient, chainId],
  )
}
