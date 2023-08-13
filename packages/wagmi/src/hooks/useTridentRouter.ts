import { TridentRouterChainId, tridentRouterExports } from '@sushiswap/trident-sdk'
import { useMemo } from 'react'
import { WalletClient } from 'viem'
import { Address, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

// TODO: exports should be in protocol folder
export const getTridentRouterContractConfig = (chainId: number | undefined) => ({
  address: (tridentRouterExports[chainId as TridentRouterChainId]?.address ?? '') as Address,
  abi: tridentRouterExports[chainId as TridentRouterChainId]?.abi ?? [],
})

export function useTridentRouterContract(chainId: number | undefined) {
  const { data: walletClient } = useWalletClient()

  return useMemo(
    () =>
      getContract({
        ...getTridentRouterContractConfig(chainId),
        walletClient: walletClient as WalletClient,
      }),
    [walletClient, chainId]
  )
}
