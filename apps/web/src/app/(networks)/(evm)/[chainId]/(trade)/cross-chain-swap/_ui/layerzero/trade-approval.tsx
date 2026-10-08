'use client'

import { Button, Dots } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { type ReactNode, useEffect } from 'react'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { ApproveERC20Multiple } from 'src/lib/wagmi/systems/checker/approve-erc20-multiple'
import { EvmToken } from 'sushi/evm'
import type { LayerZeroSourceNetworkFee } from './hooks/use-layerzero-source-network-fee'
import { useValueTransferApprovals } from './hooks/use-value-transfer-approvals'

export function LayerZeroTradeApproval({
  quote,
  sourceNetworkFee,
  enabled,
  fallback,
  children,
}: {
  quote: ValueTransferTrade | null | undefined
  sourceNetworkFee: LayerZeroSourceNetworkFee
  enabled: boolean
  fallback: ReactNode
  children: ReactNode
}): ReactNode {
  const approvals = useValueTransferApprovals({ quote, enabled })
  if (!quote || !enabled) return fallback
  if (quote.srcChain.chainType !== 'EVM' || !(quote.token0 instanceof EvmToken))
    return children
  if (approvals.isError)
    return (
      <Button fullWidth size="xl" disabled>
        Token approval unavailable
      </Button>
    )
  if (!approvals.data)
    return (
      <Button fullWidth size="xl" disabled>
        <Dots>Checking token approval</Dots>
      </Button>
    )
  return (
    <ApproveERC20Multiple
      id="approve-erc20"
      amounts={approvals.data}
      fullWidth
      size="xl"
    >
      <ApprovedTransfer quote={quote} sourceNetworkFee={sourceNetworkFee}>
        {children}
      </ApprovedTransfer>
    </ApproveERC20Multiple>
  )
}

function ApprovedTransfer({
  quote,
  sourceNetworkFee,
  children,
}: {
  quote: ValueTransferTrade
  sourceNetworkFee: LayerZeroSourceNetworkFee
  children: ReactNode
}): ReactNode {
  const queryClient = useQueryClient()
  useEffect(() => {
    // This mounts only after the ERC20 checker confirms the allowance. Refresh
    // immediately rather than waiting for the pending-approval polling interval.
    void queryClient.invalidateQueries({
      queryKey: ['value-transfer-source-network-fee', quote.quote.id],
    })
  }, [queryClient, quote.quote.id])
  if (
    sourceNetworkFee.status === 'approval-required' ||
    sourceNetworkFee.status === 'loading'
  )
    return (
      <Button fullWidth size="xl" disabled>
        <Dots>Estimating network fee</Dots>
      </Button>
    )
  return children
}
