import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { PositionWithPool } from '../../../../../types'

import { PoolAPRCell, PoolChainCell, PoolNameCell, PoolVolume1dCell } from '../../SharedCells'
import { PairValueCell } from './PoolValueCell'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ICON_SIZE } from '../../PoolsTable/Cells/columns'

type TData = PositionWithPool

export const NETWORK_COLUMN: ColumnDef<TData, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PoolChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <Skeleton.Circle radius={ICON_SIZE} />,
  },
}

export const NAME_COLUMN: ColumnDef<TData, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original.pool} />,
  size: 160,
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

export const APR_COLUMN: ColumnDef<TData, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.pool.totalApr,
  cell: (props) => <PoolAPRCell row={props.row.original.pool} />,
  size: 150,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VALUE_COLUMN: ColumnDef<TData, unknown> = {
  id: 'value',
  header: 'Value',
  accessorFn: (row) => (Number(row.balance) / Number(row.pool.totalSupply)) * Number(row.pool.liquidityUSD),
  cell: (props) => <PairValueCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<TData, unknown> = {
  id: 'volume',
  header: 'Volume (24h)',
  cell: (props) => <PoolVolume1dCell row={props.row.original.pool} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
