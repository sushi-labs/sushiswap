import { Pool } from '@sushiswap/client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { PoolFees1dCell } from './PoolFees1dCell'
import { PoolNameCell, PoolChainCell, PoolAPRCell, PoolVolume1dCell } from '../../SharedCells'
import { PoolTVLCell } from './PoolTVLCell'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Explainer } from '@sushiswap/ui/future/components/Explainer'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PoolChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <Skeleton.Circle radius={ICON_SIZE} />,
  },
}

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
  size: 200,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <Skeleton.Circle radius={ICON_SIZE} />
          <Skeleton.Circle radius={ICON_SIZE} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}

export const TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => <PoolTVLCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const APR_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'totalApr',
  header: () => (
    <div className="flex items-center gap-1">
      APR
      <Explainer hover iconSize={16} placement="bottom">
        The APRs displayed for the liquidity pools are algorithmic and subject to change.
      </Explainer>
    </div>
  ),
  accessorFn: (row) => row.totalApr,
  cell: (props) => <PoolAPRCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volume1d,
  cell: (props) => <PoolVolume1dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const FEES_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'fees1d',
  header: 'Fees (24h)',
  accessorFn: (row) => row.fees1d,
  cell: (props) => <PoolFees1dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
