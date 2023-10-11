'use client'

import { Message } from '@sushiswap/ui'

import { useIsXswapMaintenance } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapMaintenanceMessage = () => {
  const isMaintenance = useIsXswapMaintenance()
  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        Cross-chain swaps are currently undergoing maintenance. Please check
        back later.
      </Message>
    )
  return <></>
}
