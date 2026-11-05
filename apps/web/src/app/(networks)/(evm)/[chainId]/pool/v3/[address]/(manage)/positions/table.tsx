'use client'

import { type RawV3Pool, hydrateV3Pool } from '@sushiswap/graph-client/data-api'
import { useMemo, useState } from 'react'
import { ConcentratedPositionsTable } from '~evm/[chainId]/pool/_ui/concentrated-positions-table/concentrated-positions-table'
import { HideClosedSwitch } from '~evm/[chainId]/pool/_ui/hide-closed-switch'

export function ManageV3PoolPositionsTable({
  pool: rawPool,
}: {
  pool: RawV3Pool
}) {
  const pool = useMemo(() => hydrateV3Pool(rawPool), [rawPool])
  const [hideClosed, setHideClosed] = useState(true)

  return (
    <ConcentratedPositionsTable
      chainId={pool.chainId}
      poolAddress={pool.address}
      hideNewSmartPositionButton={!pool.hasEnabledSteerVault}
      hideClosedPositions={hideClosed}
      actions={
        <HideClosedSwitch
          checked={hideClosed}
          onCheckedChange={setHideClosed}
        />
      }
    />
  )
}
