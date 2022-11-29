import { Swap } from '.graphclient'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { SwapTxnHashCell } from './SwapTxnHashCell'
import { SwapTxnBlockCell } from './SwapTxnBlockCell'
import { SwapSenderCell } from './SwapSenderCell'
import { SwapToCell } from './SwapToCell'
import { SwapAmountInCell } from './SwapAmountInCell'
import { SwapAmountOutCell } from './SwapAmountOutCell'
import { SwapTxnAgeCell } from './SwapTxnAgeCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const TXN_HASH_COLUMN: ColumnDef<Swap, unknown> = {
  id: 'txnHash',
	header: 'Txn Hash',
	cell: (props) => <SwapTxnHashCell row={props.row.original} />,
	size: 260,
	meta: {
		skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse"/>
	},
}

export const TXN_BLOCK_COLUMN: ColumnDef<Swap, unknown> = {
	id: 'txnBlock',
  header: 'Block',
  cell: (props) => <SwapTxnBlockCell row={props.row.original} />,
  size: 90,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const SWAP_SENDER_COLUMN: ColumnDef<Swap, unknown> = {
	id: 'sender',
  header: 'Sender',
  cell: (props) => <SwapSenderCell row={props.row.original} />,
  size: 120,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const SWAP_TO_COLUMN: ColumnDef<Swap, unknown> = {
	id: 'to',
  header: 'To',
  cell: (props) => <SwapToCell row={props.row.original} />,
  size: 120,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT_IN_COLUMN: ColumnDef<Swap, unknown> = {
	id: 'amountIn',
  header: 'Amount In',
  cell: (props) => <SwapAmountInCell row={props.row.original} />,
  size: 110,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT_OUT_COLUMN: ColumnDef<Swap, unknown> = {
	id: 'amountOut',
  header: 'Amount Out',
  cell: (props) => <SwapAmountOutCell row={props.row.original} />,
  size: 110,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TXN_AGE_COLUMN: ColumnDef<Swap, unknown> = {
	id: 'txnAge',
  header: 'Age',
  cell: (props) => <SwapTxnAgeCell row={props.row.original} />,
  size: 150,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}