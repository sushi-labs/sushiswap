import { getSushiSwapRouterContractConfig, getTridentRouterContractConfig } from '@sushiswap/wagmi'
import { AMM_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from 'config'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { getContract } from 'wagmi/actions'

export function useRouters(chainId: number): [Contract | undefined, Contract | undefined] {
  const { data: signerOrProvider } = useSigner()
  return useMemo(() => {
    return [
      AMM_ENABLED_NETWORKS.includes(chainId)
        ? getContract({
            ...getSushiSwapRouterContractConfig(chainId),
            signerOrProvider,
          })
        : undefined,
      TRIDENT_ENABLED_NETWORKS.includes(chainId)
        ? getContract({
            ...getTridentRouterContractConfig(chainId),
            signerOrProvider,
          })
        : undefined,
    ]
  }, [chainId, signerOrProvider])
}
