import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { ChainCell } from '../Common/Cells/ChainCell'
import {
  PoolAPRCell,
  PoolFees1wCell,
  PoolFees1dCell,
  PoolFees1mCell,
  PoolNameCell,
  PoolTVLCell,
  PoolVolume1wCell,
  PoolVolume1dCell,
  PoolVolume1mCell,
} from './Cells'
import { Pool } from '@sushiswap/client'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ICON_SIZE } from './constants'

export const NETWORK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original} ICON_SIZE={ICON_SIZE} />,
  size: 30,
  meta: {
    skeleton: <Skeleton.Circle radius={26} />,
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
  header: 'TVL',
  id: 'liquidityUSD',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => <PoolTVLCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Volume (24h)',
  id: 'volume1d',
  accessorFn: (row) => row.volume1d,
  cell: (props) => <PoolVolume1dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VOLUME_7D_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Volume (7d)',
  id: 'volume1w',
  accessorFn: (row) => row.volume1w,
  cell: (props) => <PoolVolume1wCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VOLUME_1M_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Volume (1m)',
  id: 'volume1m',
  accessorFn: (row) => row.volume1m,
  cell: (props) => <PoolVolume1mCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const FEES_1D_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Fees (24h)',
  id: 'fees24h',
  accessorFn: (row) => row.fees1d,
  cell: (props) => <PoolFees1dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const FEES_7D_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Fees (7d)',
  id: 'fees7d',
  accessorFn: (row) => row.fees1w,
  cell: (props) => <PoolFees1wCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const FEES_1M_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'Fees (1m)',
  id: 'fees1d',
  accessorFn: (row) => row.fees1m,
  cell: (props) => <PoolFees1mCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const APR_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'APR',
  id: 'totalApr1d',
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => <PoolAPRCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
