import { Burn } from '@sushiswap/graph-client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { BurnTxnHashCell } from './BurnTxnHashCell'
import { BurnTxnBlockCell } from './BurnTxnBlockCell'
import { BurnSenderCell } from './BurnSenderCell'
import { BurnToCell } from './BurnToCell'
import { BurnAmount0Cell } from './BurnAmount0Cell'
import { BurnAmount1Cell } from './BurnAmount1Cell'
import { BurnAmountUSDCell } from './BurnAmountUSDCell'
import { BurnTxnAgeCell } from './BurnTxnAgeCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const TXN_HASH_COLUMN: ColumnDef<Burn, unknown> = {
  id: 'txnHash',
	header: 'Txn Hash',
	cell: (props) => <BurnTxnHashCell row={props.row.original} />,
	size: 200,
	meta: {
		skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse"/>
	},
}

export const TXN_BLOCK_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'txnBlock',
  header: 'Block',
  cell: (props) => <BurnTxnBlockCell row={props.row.original} />,
  size: 90,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const BURN_SENDER_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'sender',
  header: 'Sender',
  cell: (props) => <BurnSenderCell row={props.row.original} />,
  size: 90,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const BURN_TO_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'to',
  header: 'To',
  cell: (props) => <BurnToCell row={props.row.original} />,
  size: 90,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT0_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'amount0',
  header: 'Token0',
  cell: (props) => <BurnAmount0Cell row={props.row.original} />,
  size: 100,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT1_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'amount1',
  header: 'Token1',
  cell: (props) => <BurnAmount1Cell row={props.row.original} />,
  size: 100,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNTUSD_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'amountUSD',
  header: 'USD',
  cell: (props) => <BurnAmountUSDCell row={props.row.original} />,
  size: 80,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TXN_AGE_COLUMN: ColumnDef<Burn, unknown> = {
	id: 'txnAge',
  header: 'Age',
  cell: (props) => <BurnTxnAgeCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}