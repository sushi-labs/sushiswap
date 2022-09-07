import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Pair, Token } from '../../.graphclient'
import { NetworkCell } from './NetworkCell'
import { PairAPRCell } from './PairAPRCell'
import { PairFees7dCell } from './PairFees7dCell'
import { PairFees24hCell } from './PairFees24hCell'
import { PairNameCell } from './PairNameCell'
import { PairTVLCell } from './PairTVLCell'
import { PairVolume7dCell } from './PairVolume7dCell'
import { PairVolume24hCell } from './PairVolume24hCell'
import { TokenChainCell } from './TokenChainCell'
import { TokenLiquidityCell } from './TokenLiquidityCell'
import { TokenNameCell } from './TokenNameCell'
import { TokenPriceCell } from './TokenPriceCell'
import { TokenVolumeCell } from './TokenVolumeCell'

export const ICON_SIZE = 20
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pair, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <NetworkCell row={props.row.original} />,
  size: 30,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const NAME_COLUMN: ColumnDef<Pair, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TVL_COLUMN: ColumnDef<Pair, unknown> = {
  header: 'TVL',
  id: 'liquidityUSD',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => <PairTVLCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_24_COLUMN: ColumnDef<Pair, unknown> = {
  header: 'Volume (24h)',
  id: 'volume24h',
  // accessorFn: (row) => row.volume24h,
  cell: (props) => <PairVolume24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_7_COLUMN: ColumnDef<Pair, unknown> = {
  header: 'Volume (7d)',
  id: 'volume7d',
  // accessorFn: (row) => row.volume7d,
  cell: (props) => <PairVolume7dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FEES_24_COLUMN: ColumnDef<Pair, unknown> = {
  header: 'Fees (24h)',
  id: 'fees24h',
  // accessorFn: (row) => row.fees24h,
  cell: (props) => <PairFees24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const FEES_7_COLUMN: ColumnDef<Pair, unknown> = {
  header: 'Fees (7d)',
  id: 'fees7d',
  // accessorFn: (row) => row.fees7d,
  cell: (props) => <PairFees7dCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const APR_COLUMN: ColumnDef<Pair, unknown> = {
  header: 'APR',
  id: 'apr',
  accessorFn: (row) => row.apr,
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TOKEN_CHAIN_COLUMN: ColumnDef<Token, unknown> = {
  id: 'network',
  header: 'Chain',
  cell: (props) => <TokenChainCell row={props.row.original} />,
  size: 30,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const TOKEN_NAME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'tokenName',
  header: 'Name',
  cell: (props) => <TokenNameCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TOKEN_LIQUIDITY_COLUMN: ColumnDef<Token, unknown> = {
  id: 'liquidity',
  header: 'Liquidity',
  cell: (props) => <TokenLiquidityCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TOKEN_PRICE_COLUMN: ColumnDef<Token, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => <TokenPriceCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TOKEN_VOLUME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'volume',
  header: 'Volume',
  cell: (props) => <TokenVolumeCell row={props.row.original} />,
  size: 160,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
