import { Token } from '@sushiswap/graph-client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { ChainCell } from './SharedCells/ChainCell'
import { PoolAPRCell } from './PoolCells/PoolAPRCell'
import { PoolFees1wCell } from './PoolCells/PoolFees1wCell'
import { PoolFees1dCell } from './PoolCells/PoolFees1dCell'
import { PoolNameCell } from './PoolCells/PoolNameCell'
import { PoolTVLCell } from './PoolCells/PoolTVLCell'
import { PoolVolume1wCell } from './PoolCells/PoolVolume1wCell'
import { PoolVolume1dCell } from './PoolCells/PoolVolume1dCell'
import { TokenLiquidityCell } from './TokenCells/TokenLiquidityCell'
import { TokenNameCell } from './TokenCells/TokenNameCell'
import { TokenPriceCell } from './TokenCells/TokenPriceCell'
import { TokenVolumeCell } from './TokenCells/TokenVolumeCell'
import { Pool } from '@sushiswap/client'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'

export const ICON_SIZE = 20
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original} />,
  size: 30,
  meta: {
    skeleton: <Skeleton.Circle radius={26} />,
  },
}

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
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

export const APR_COLUMN: ColumnDef<Pool, unknown> = {
  header: 'APR',
  id: 'totalApr',
  accessorFn: (row) => row.totalApr,
  cell: (props) => <PoolAPRCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const TOKEN_CHAIN_COLUMN: ColumnDef<Token, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original} />,
  size: 30,
  meta: {
    skeleton: <Skeleton.Circle radius={26} />,
  },
}

export const TOKEN_NAME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const TOKEN_LIQUIDITY_COLUMN: ColumnDef<Token, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => <TokenLiquidityCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const TOKEN_PRICE_COLUMN: ColumnDef<Token, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => <TokenPriceCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const TOKEN_VOLUME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'volume',
  header: 'Volume',
  cell: (props) => <TokenVolumeCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
