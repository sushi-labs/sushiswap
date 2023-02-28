import { sushiXSwapAddress, sushiXSwapAbi, SushiXSwapChainId } from '@sushiswap/sushixswap/exports'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider, useSigner } from 'wagmi'

export const getSushiXSwapContractConfig = (chainId: SushiXSwapChainId) => ({
  address: sushiXSwapAddress[chainId],
  abi: sushiXSwapAbi[chainId],
})

export function useSushiXSwapContract(chainId: SushiXSwapChainId | undefined) {
  const provider = useProvider({ chainId })
  const { data: signer } = useSigner({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getSushiXSwapContractConfig(chainId), signerOrProvider: signer ?? provider })
  }, [chainId, provider, signer])
}

export type SushiXSwap = NonNullable<ReturnType<typeof useSushiXSwapContract>>
