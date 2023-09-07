import { formatNumber, formatUSD } from '@sushiswap/format'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { ChainCell } from '../Common'
import { TokenNameCell } from './Cells'
import { ICON_SIZE } from './constants'
import { FuroToken } from './useFuroTokens'

export const NETWORK_COLUMN: ColumnDef<FuroToken, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original.token} ICON_SIZE={ICON_SIZE} />,
  size: 30,
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const NAME_COLUMN: ColumnDef<FuroToken, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell token={props.row.original.token} />,
  size: 160,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<FuroToken, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => {
    const liquidity = formatNumber(props.row.original.liquidity)
    return liquidity === 'NaN' ? '0' : liquidity
  },
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const LIQUIDITY_USD_COLUMN: ColumnDef<FuroToken, unknown> = {
  id: 'liquidityUSD',
  header: 'Liquidity (USD)',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => {
    return formatUSD(props.row.original.liquidityUSD)
  },
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

// export const PRICE_COLUMN: ColumnDef<FuroToken, unknown> = {
//   id: 'price',
//   header: 'Price',
//   cell: (props) => <TokenPriceCell row={props.row.original} />,
//   size: 160,
//   meta: {
//     className: 'justify-end',
//     skeleton: <SkeletonText fontSize="lg" />,
//   },
// }
