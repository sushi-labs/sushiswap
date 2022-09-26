import { UserWithFarm } from '@sushiswap/graph-client/.graphclient'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'
import { PairNameCell } from './PairNameCell'
import { PairValueCell } from './PairValueCell'
import { PairVolume24hCell } from './PairVolume24hCell'

type TData = UserWithFarm

export const NETWORK_COLUMN: ColumnDef<TData, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PairChainCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}

export const NAME_COLUMN: ColumnDef<TData, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
  meta: {
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
  },
}

export const APR_COLUMN: ColumnDef<TData, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.pair.apr,
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 150,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VALUE_COLUMN: ColumnDef<TData, unknown> = {
  id: 'value',
  header: 'Value',
  accessorFn: (row) => row.valueUSD,
  cell: (props) => <PairValueCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<TData, unknown> = {
  id: 'volume',
  header: 'Volume (24h)',
  cell: (props) => <PairVolume24hCell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
