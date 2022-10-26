import { ColumnDef } from '@tanstack/react-table'
import { Stream, Vesting } from 'lib'
import React from 'react'

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
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'amount',
  header: 'Amount',
  cell: (props) => <AmountCell row={props.row.original} />,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
    className: 'justify-end',
  },
}

export const FROM_COLUMN = (tableType: FuroTableType): ColumnDef<Stream | Vesting, unknown> => ({
  id: 'from',
  header: 'From',
  cell: (props) => <FromCell row={props.row.original} tableType={tableType} />,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
    className: 'justify-end',
  },
})

export const START_DATE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'startDate',
  header: 'Start Date',
  cell: (props) => <StartDateCell row={props.row.original} />,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
    className: 'justify-end',
  },
}

export const STATUS_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'status',
  header: 'Status',
  cell: (props) => <StatusCell row={props.row.original} />,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TYPE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => <TypeCell row={props.row.original} />,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}
