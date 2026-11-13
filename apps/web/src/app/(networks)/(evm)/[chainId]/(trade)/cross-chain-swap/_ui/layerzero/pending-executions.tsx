'use client'

import { Button } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { getChainById } from 'sushi'
import type { LayerZeroTrackedExecution } from './hooks/use-layerzero-executions'

export function LayerZeroPendingExecutions({
  executions,
  onSelect,
}: {
  executions: LayerZeroTrackedExecution[]
  onSelect(id: string): void
}): ReactNode {
  const pending = executions.filter(
    (item) =>
      (item.txHash || item.submitted) &&
      item.sourceStatus !== 'FAILED' &&
      item.delivery?.status !== 'SUCCESS',
  )

  if (!pending.length) return null

  return (
    <div className="mt-2 flex flex-col gap-1">
      {pending.map((item) => (
        <Button
          key={item.id}
          variant="secondary"
          fullWidth
          onClick={() => onSelect(item.id)}
        >
          Track Swap: {getChainById(item.quote.fromChainId).name} →{' '}
          {getChainById(item.quote.toChainId).name}
        </Button>
      ))}
    </div>
  )
}
