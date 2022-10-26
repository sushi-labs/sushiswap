import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { CreateStreamBaseSchemaType } from '../../../CreateForm'
import { ActionsCell } from './ActionsCell'
import { AmountCell } from './AmountCell'
import { CurrencyCell } from './CurrencyCell'
import { EndDateCell } from './EndDateCell'
import { FundSourceCell } from './FundSourceCell'
import { RecipientCell } from './RecipientCell'
import { StartDateCell } from './StartDateCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const CURRENCY_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'currency',
  header: 'Currency',
  cell: (props) => (
    <CurrencyCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 50,
}

export const FUND_SOURCE_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'fundSource',
  header: 'Source',
  cell: (props) => (
    <FundSourceCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 50,
}

export const AMOUNT_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'amount',
  header: 'Amount',
  cell: (props) => (
    <AmountCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 50,
}

export const RECIPIENT_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'recipient',
  header: 'Recipient',
  cell: (props) => (
    <RecipientCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 50,
}

export const START_DATE_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'startDate',
  header: 'Starts',
  cell: (props) => (
    <StartDateCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 50,
}

export const END_DATE_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'endDate',
  header: 'Ends',
  cell: (props) => (
    <EndDateCell row={props.row.original} index={props.row.index} chainId={props.table.options.meta?.chainId} />
  ),
  size: 50,
}

export const ACTIONS_COLUMN: ColumnDef<CreateStreamBaseSchemaType, unknown> = {
  id: 'actions',
  header: '',
  cell: (props) => (
    <ActionsCell
      row={props.row.original}
      index={props.row.index}
      chainId={props.table.options.meta?.chainId}
      append={props.table.options.meta?.append}
      remove={props.table.options.meta?.remove}
      setImportErrors={props.table.options.meta?.setImportErrors}
      importErrors={props.table.options.meta?.importErrors}
    />
  ),
  size: 50,
  meta: {
    className: 'justify-end',
  },
}
