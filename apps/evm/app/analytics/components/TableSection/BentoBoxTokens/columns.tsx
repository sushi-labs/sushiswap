import { formatNumber, formatUSD } from '@sushiswap/format'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { TokenNameCell } from './Cells'
import { BentoBoxToken } from './useBentoBoxTokens'

export const NAME_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell token={props.row.original.token} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => {
    return formatNumber(props.row.original.liquidity)
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const LIQUIDITY_USD_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
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
