import { Token } from '@sushiswap/graph-client'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { ChainCell } from '../Common'
import { TokenLiquidityCell, TokenNameCell, TokenPriceCell, TokenVolumeCell } from './Cells'
import { ICON_SIZE } from './constants'

export const NETWORK_COLUMN: ColumnDef<Token, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <ChainCell row={props.row.original} ICON_SIZE={ICON_SIZE} />,
  size: 30,
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const NAME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const LIQUIDITY_COLUMN: ColumnDef<Token, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => <TokenLiquidityCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const PRICE_COLUMN: ColumnDef<Token, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => <TokenPriceCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'volume',
  header: 'Volume',
  cell: (props) => <TokenVolumeCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
