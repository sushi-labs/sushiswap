'use client'

import type { SushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { type ReactElement, useState } from 'react'
import type { Hex } from 'viem'
import { HideClosedSwitch } from '~evm/[chainId]/pool/_ui/hide-closed-switch'
import { V4PositionsTable } from '~evm/[chainId]/pool/_ui/v4-positions-table/v4-positions-table'

export function V4PoolPositions({
  chainId,
  poolId,
}: {
  chainId: SushiSwapV4ChainId
  poolId: Hex
}): ReactElement {
  const [hideClosed, setHideClosed] = useState(true)

  return (
    <V4PositionsTable
      chainId={chainId}
      poolId={poolId}
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
