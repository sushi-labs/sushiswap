import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { PositionWithPool } from '../../../../../types'

import { PoolAPRCell, PoolChainCell, PoolNameCell, PoolVolume1dCell } from '../../SharedCells'
import { PairValueCell } from './PoolValueCell'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ICON_SIZE } from '../../PoolsTable/Cells/columns'
import { PoolNameCellV3 } from '../../SharedCells/PoolNameCellV3'
import { ConcentratedLiquidityPosition, ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future/hooks'
import { PriceRangeCell } from './PriceRangeCell'
import { PositionSizeCell } from './PositionSizeCell'
import { UnclaimedCell } from './UnclaimedCell'
import { ChainId } from '@sushiswap/chain'

type TData = PositionWithPool

export const NETWORK_COLUMN: ColumnDef<TData, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PoolChainCell row={props.row.original as typeof props.row.original & { chainId: ChainId }} />,
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
  accessorFn: (row) => row.pool.totalApr1d,
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

export const NAME_COLUMN_V3: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCellV3 row={props.row.original} ctx={props} />,
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

export const PRICE_RANGE_COLUMN: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => <PriceRangeCell row={props.row.original} ctx={props} />,
  size: 160,
  maxSize: 160,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const POSITION_SIZE_CELL: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'positionSize',
  accessorFn: (row) => row.position.positionUSD,
  header: 'Position Size',
  cell: (props) => <PositionSizeCell row={props.row.original} ctx={props} />,
  size: 60,
  maxSize: 60,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const POSITION_UNCLAIMED_CELL: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'unclaimed',
  accessorFn: (row) => row.position.unclaimedUSD,
  header: 'Unclaimed',
  cell: (props) => <UnclaimedCell row={props.row.original} ctx={props} />,
  size: 60,
  maxSize: 60,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
