import { ChainId } from '@sushiswap/chain'
import {
  getSushiSwapKlimaRouterContractConfig,
  getSushiSwapRouterContractConfig,
  getTridentRouterContractConfig,
} from '@sushiswap/wagmi'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { getContract } from 'wagmi/actions'

import { AMM_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from '../../config'

export function useRouters(
  chainId: number | undefined
): [Contract | undefined, Contract | undefined, Contract | undefined] {
  const { data: signerOrProvider } = useSigner()
  return useMemo(() => {
    return [
      chainId && signerOrProvider && AMM_ENABLED_NETWORKS.includes(chainId)
        ? getContract({
            ...getSushiSwapRouterContractConfig(chainId),
            signerOrProvider,
          })
        : undefined,
      chainId && signerOrProvider && TRIDENT_ENABLED_NETWORKS.includes(chainId)
        ? getContract({
            ...getTridentRouterContractConfig(chainId),
            signerOrProvider,
          })
        : undefined,
      chainId && signerOrProvider && chainId === ChainId.POLYGON
        ? getContract({
            ...getSushiSwapKlimaRouterContractConfig(chainId),
            signerOrProvider,
          })
        : undefined,
    ]
  }, [chainId, signerOrProvider])
}
