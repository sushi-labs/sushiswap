import React from 'react'

import { Pair } from '../../.graphclient'
import { NetworkCell } from './NetworkCell'
import { PairAPRCell } from './PairAPRCell'
import { PairFees7dCell } from './PairFees7dCell'
import { PairFees24hCell } from './PairFees24hCell'
import { PairNameCell } from './PairNameCell'
import { PairTVLCell } from './PairTVLCell'
import { PairVolume7dCell } from './PairVolume7dCell'
import { PairVolume24hCell } from './PairVolume24hCell'
import { ExtendedColumnDef } from './types'

export const ICON_SIZE = 20
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  id: 'network',
  header: '',
  cell: (props) => <NetworkCell row={props.row.original} />,
  size: 30,
  skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
}

export const NAME_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
  skeleton: (
    <div className="flex items-center w-full gap-2">
      <div className="flex items-center">
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
      </div>
      <div className="flex flex-col w-full">
        <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />
      </div>
    </div>
  ),
}

export const TVL_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'TVL',
  id: 'liquidityUSD',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => <PairTVLCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const VOLUME_24_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'Volume (24h)',
  id: 'volume24h',
  // accessorFn: (row) => row.volume24h,
  cell: (props) => <PairVolume24hCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const VOLUME_7_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'Volume (7d)',
  id: 'volume7d',
  // accessorFn: (row) => row.volume7d,
  cell: (props) => <PairVolume7dCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const FEES_24_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'Fees (24h)',
  id: 'fees24h',
  // accessorFn: (row) => row.fees24h,
  cell: (props) => <PairFees24hCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const FEES_7_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'Fees (7d)',
  id: 'fees7d',
  // accessorFn: (row) => row.fees7d,
  cell: (props) => <PairFees7dCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const APR_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'APR',
  id: 'apr',
  accessorFn: (row) => row.apr,
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}
