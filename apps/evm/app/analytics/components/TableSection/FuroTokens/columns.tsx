import { formatNumber, formatUSD } from '@sushiswap/format'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { TokenNameCell } from './Cells'
import { FuroToken } from './useFuroTokens'

export const NAME_COLUMN: ColumnDef<FuroToken, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell token={props.row.original.token} />,
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
  meta: {
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
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
