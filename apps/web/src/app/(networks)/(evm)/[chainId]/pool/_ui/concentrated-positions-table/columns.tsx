import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { formatUSD } from 'sushi'
import { getEvmCurrencyAddress, unwrapEvmToken } from 'sushi/evm'
import { PositionNameCell } from '../position-name-cell'
import { PriceRangeCell } from './price-range-cell'

export const PRICE_RANGE_COLUMN: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => <PriceRangeCell {...props.row} />,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const NAME_COLUMN_V3: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'name',
  header: 'Name',
  cell: ({ row: { original } }) => (
    <PositionNameCell
      chainId={original.chainId}
      currency0={getEvmCurrencyAddress(unwrapEvmToken(original.pool.token0))}
      currency1={getEvmCurrencyAddress(unwrapEvmToken(original.pool.token1))}
      version="V3"
      fee={original.fee}
    />
  ),
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const POSITION_SIZE_CELL: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'positionSize',
  accessorFn: (row) => +row.position.positionUSD,
  header: 'Position Size',
  cell: (props) => formatUSD(props.row.original.position.positionUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const POSITION_UNCLAIMED_CELL: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'unclaimed',
  accessorFn: (row) => +row.position.unclaimedUSD,
  header: 'Unclaimed fees',
  cell: (props) => formatUSD(props.row.original.position.unclaimedUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
