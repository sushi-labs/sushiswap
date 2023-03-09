import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { CreateVestingFormSchemaType } from '../../../CreateForm'
import { ActionsCell } from './ActionsCell'
import { CurrencyCell } from './CurrencyCell'
import { FundSourceCell } from './FundSourceCell'
import { RecipientCell } from './RecipientCell'
import { ScheduleCell } from './ScheduleCell'
import { StartDateCell } from './StartDateCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const CURRENCY_COLUMN: ColumnDef<CreateVestingFormSchemaType, unknown> = {
  id: 'currency',
  header: 'Currency*',
  cell: (props) => (
    <CurrencyCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 150,
  minSize: 150,
}

export const FUND_SOURCE_COLUMN: ColumnDef<CreateVestingFormSchemaType, unknown> = {
  id: 'fundSource',
  header: 'Source*',
  cell: (props) => (
    <FundSourceCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 120,
  minSize: 120,
}

export const RECIPIENT_COLUMN: ColumnDef<CreateVestingFormSchemaType, unknown> = {
  id: 'recipient',
  header: 'Recipient*',
  cell: (props) => (
    <RecipientCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 150,
  minSize: 150,
}

export const START_DATE_COLUMN: ColumnDef<CreateVestingFormSchemaType, unknown> = {
  id: 'startDate',
  header: 'Starts*',
  cell: (props) => (
    <StartDateCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 150,
  minSize: 150,
}

export const SCHEDULE_COLUMN: ColumnDef<CreateVestingFormSchemaType, unknown> = {
  id: 'schedule',
  header: 'Schedule*',
  cell: (props) => (
    <ScheduleCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 150,
  minSize: 150,
}

export const ACTIONS_COLUMN: ColumnDef<CreateVestingFormSchemaType, unknown> = {
  id: 'actions',
  header: '',
  cell: (props) => (
    <ActionsCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 120,
  minSize: 120,
  meta: {
    className: 'justify-end',
  },
}
