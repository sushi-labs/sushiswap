'use client'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { Switch } from '@sushiswap/ui'
import { useState } from 'react'
import { ConcentratedPositionsTable } from 'src/ui/pool/ConcentratedPositionsTable'

export function ManageV3PoolPositionsTable({
  pool,
}: {
  pool: V3Pool
}) {
  const [hideClosed, setHideClosed] = useState(true)
  return (
    <ConcentratedPositionsTable
      chainId={pool.chainId}
      poolAddress={pool.address}
      hideNewSmartPositionButton={!pool.hasEnabledSteerVault}
      hideClosedPositions={hideClosed}
      actions={
        <div className="flex gap-3 items-center whitespace-nowrap">
          <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
            Hide closed
          </span>
          <Switch
            checked={hideClosed}
            onCheckedChange={() => setHideClosed((prev) => !prev)}
          />
        </div>
      }
    />
  )
}
