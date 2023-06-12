import { Token } from '@sushiswap/graph-client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { ChainCell } from '../Common/Cells'
import { TokenLiquidityCell, TokenNameCell, TokenPriceCell, TokenVolumeCell } from './Cells'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ICON_SIZE } from './constants'

export const NETWORK_COLUMN: ColumnDef<Token, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original} ICON_SIZE={ICON_SIZE} />,
  size: 30,
  meta: {
    skeleton: <Skeleton.Circle radius={26} />,
  },
}

export const NAME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<Token, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => <TokenLiquidityCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const PRICE_COLUMN: ColumnDef<Token, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => <TokenPriceCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'volume',
  header: 'Volume',
  cell: (props) => <TokenVolumeCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
