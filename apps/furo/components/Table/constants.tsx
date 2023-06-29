import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Stream, Vesting } from '../../lib'
import { AmountCell } from './AmountCell'
import { EndDateCell } from './EndDateCell'
import { FromCell } from './FromCell'
import { NetworkCell } from './NetworkCell'
import { StartDateCell } from './StartDateCell'
import { StatusCell } from './StatusCell'
import { StreamedCell } from './StreamedCell'
import { FuroTableType } from './StreamTable'
import { TypeCell } from './TypeCell'

export const NETWORK_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'network',
  header: 'Token',
  cell: (props) => <NetworkCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const STREAMED_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'streamedPercentage',
  header: 'Streamed',
  cell: (props) => <StreamedCell row={props.row.original} />,
  size: 170,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const AMOUNT_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'amount',
  header: 'Amount',
  cell: (props) => <AmountCell row={props.row.original} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const FROM_COLUMN = (tableType: FuroTableType): ColumnDef<Stream | Vesting, unknown> => ({
  id: 'from',
  header: 'From',
  cell: (props) => <FromCell row={props.row.original} tableType={tableType} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    className: 'justify-end',
  },
})

export const START_DATE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'startDate',
  header: 'Start Date',
  cell: (props) => <StartDateCell row={props.row.original} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    className: 'justify-end',
  },
}

export const END_DATE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'endDate',
  header: 'End Date',
  cell: (props) => <EndDateCell row={props.row.original} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    className: 'justify-end',
  },
}

export const STATUS_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'status',
  header: 'Status',
  cell: (props) => <StatusCell row={props.row.original} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TYPE_COLUMN: ColumnDef<Stream | Vesting, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => <TypeCell row={props.row.original} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    className: 'justify-end',
  },
}
