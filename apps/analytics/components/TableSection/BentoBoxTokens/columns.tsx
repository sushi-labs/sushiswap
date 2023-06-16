import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { ChainCell, StringCell } from '../Common/Cells'
import { TokenNameCell } from './Cells'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { BentoBoxToken } from './useBentoBoxTokens'
import { formatNumber, formatUSD } from '@sushiswap/format'
import { ICON_SIZE } from './constants'

export const NETWORK_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original.token} ICON_SIZE={ICON_SIZE} />,
  size: 30,
  meta: {
    skeleton: <Skeleton.Circle radius={26} />,
  },
}

export const NAME_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell token={props.row.original.token} />,
  size: 160,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => {
    const liquidity = formatNumber(props.row.original.liquidity)
    return <StringCell string={liquidity === 'NaN' ? '0' : liquidity} />
  },
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const LIQUIDITY_USD_COLUMN: ColumnDef<BentoBoxToken, unknown> = {
  id: 'liquidityUSD',
  header: 'Liquidity (USD)',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => {
    const liquidityUSD = formatUSD(props.row.original.liquidityUSD)
    return <StringCell string={liquidityUSD} />
  },
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
