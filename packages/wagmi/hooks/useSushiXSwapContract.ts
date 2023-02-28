import { sushiXSwapAddress, sushiXSwapAbi, SushiXSwapChainId } from '@sushiswap/sushixswap/exports'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getSushiXSwapContractConfig = (chainId: SushiXSwapChainId) => ({
  address: sushiXSwapAddress[chainId],
  abi: sushiXSwapAbi[chainId],
})

export function useSushiXSwapContract(chainId: SushiXSwapChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getSushiXSwapContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}

export type SushiXSwap = NonNullable<ReturnType<typeof useSushiXSwapContract>>
