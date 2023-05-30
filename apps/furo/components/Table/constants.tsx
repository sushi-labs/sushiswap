import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Stream, Vesting } from '../../lib'
import { AmountCell } from './AmountCell'
import { FromCell } from './FromCell'
import { StartDateCell } from './StartDateCell'
import { StatusCell } from './StatusCell'
import { StreamedCell } from './StreamedCell'
import { FuroTableType } from './StreamTable'
import { TypeCell } from './TypeCell'

export const STREAMED_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'streamedPercentage',
  header: 'Streamed',
  cell: (props) => <StreamedCell row={props.row.original} />,
  size: 170,
  meta: {
    skeleton: <Skeleton.Box className="w-full h-5 bg-slate-700" />,
  },
}

export const AMOUNT_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'amount',
  header: 'Amount',
  cell: (props) => <AmountCell row={props.row.original} />,
  meta: {
    skeleton: <Skeleton.Box className="w-full h-5 bg-slate-700" />,
    className: 'justify-end',
  },
}

export const FROM_COLUMN = (tableType: FuroTableType): ColumnDef<Stream | Vesting, unknown> => ({
  id: 'from',
  header: 'From',
  cell: (props) => <FromCell row={props.row.original} tableType={tableType} />,
  meta: {
    skeleton: <Skeleton.Box className="w-full h-5 bg-slate-700" />,
    className: 'justify-end',
  },
})

export const START_DATE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'startDate',
  header: 'Start Date',
  cell: (props) => <StartDateCell row={props.row.original} />,
  meta: {
    skeleton: <Skeleton.Box className="w-full h-5 bg-slate-700" />,
    className: 'justify-end',
  },
}

export const STATUS_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'status',
  header: 'Status',
  cell: (props) => <StatusCell row={props.row.original} />,
  meta: {
    skeleton: <Skeleton.Box className="w-full h-5 bg-slate-700" />,
  },
}

export const TYPE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => <TypeCell row={props.row.original} />,
  meta: {
    skeleton: <Skeleton.Box className="w-full h-5 bg-slate-700" />,
  },
}
