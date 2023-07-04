import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { PoolAPRCell, PoolChainCell, PoolNameCell, PoolVolume1dCell } from '../../SharedCells'
import { PoolVolume1hCell } from '../../SharedCells/PoolVolume1hCell'
import { PoolVolume1mCell } from '../../SharedCells/PoolVolume1mCell'
import { PoolVolume1wCell } from '../../SharedCells/PoolVolume1wCell'
import { PoolFees1dCell } from './PoolFees1dCell'
import { PoolTVLCell } from './PoolTVLCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PoolChainCell row={props.row.original as typeof props.row.original & { chainId: ChainId }} />,
  size: 50,
  meta: {
    skeleton: <SkeletonCircle radius={ICON_SIZE} />,
  },
}

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
  size: 280,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={ICON_SIZE} />
          <SkeletonCircle radius={ICON_SIZE} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
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
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const APR_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'totalApr1d',
  header: () => (
    <div className="flex items-center gap-1">
      APR
      <Explainer>The APRs displayed for the liquidity pools are algorithmic and subject to change.</Explainer>
    </div>
  ),
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => <PoolAPRCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_1H_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1h',
  header: 'Volume (1h)',
  accessorFn: (row) => row.volume1h,
  cell: (props) => <PoolVolume1hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volume1d,
  cell: (props) => <PoolVolume1dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_7D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1w',
  header: 'Volume (1w)',
  accessorFn: (row) => row.volume1w,
  cell: (props) => <PoolVolume1wCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_1M_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1m',
  header: 'Volume (1m)',
  accessorFn: (row) => row.volume1m,
  cell: (props) => <PoolVolume1mCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
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
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
