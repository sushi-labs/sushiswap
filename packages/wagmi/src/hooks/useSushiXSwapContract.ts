import { isSushiXSwapChainId, sushiXSwapAbi, sushiXSwapAddress, SushiXSwapChainId } from '@sushiswap/sushixswap'
import { useMemo } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getSushiXSwapContractConfig = (chainId: SushiXSwapChainId) => ({
  chainId,
  address: sushiXSwapAddress[chainId],
  abi: sushiXSwapAbi[chainId],
})

export function useSushiXSwapContract(chainId: SushiXSwapChainId | undefined) {
  const publicClient = usePublicClient({ chainId })
  const walletClient = useWalletClient({ chainId })

  return useMemo(() => {
    if (!chainId || !isSushiXSwapChainId(chainId)) return null

    return getContract({ ...getSushiXSwapContractConfig(chainId), walletClient: walletClient ?? publicClient })
  }, [chainId, publicClient, walletClient])
}

export type SushiXSwap = NonNullable<ReturnType<typeof useSushiXSwapContract>>
