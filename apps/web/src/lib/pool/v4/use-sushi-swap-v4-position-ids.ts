'use client'

import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { useConfig } from 'wagmi'
import type { SushiSwapV4ChainId } from './config'
import { getSushiSwapV4PositionIds } from './get-sushi-swap-v4-position-ids'
import type { SushiSwapV4Deployment } from './types'

export function useSushiSwapV4PositionIds({
  account,
  chainId,
  deployment,
}: {
  account: EvmAddress | undefined
  chainId: SushiSwapV4ChainId
  deployment: SushiSwapV4Deployment | undefined
}) {
  const config = useConfig()

  return useQuery({
    queryKey: [
      'sushiswap-v4-position-ids',
      { account, chainId, positionManager: deployment?.clPositionManager },
    ],
    queryFn: async () => {
      if (!account || !deployment) return []

      return getSushiSwapV4PositionIds({
        account,
        chainId,
        config,
        deployment,
      })
    },
    enabled: Boolean(account && deployment),
    staleTime: 30_000,
  })
}
