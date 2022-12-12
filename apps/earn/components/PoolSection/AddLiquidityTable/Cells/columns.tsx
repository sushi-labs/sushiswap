import { Mint } from '@sushiswap/graph-client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { MintTxnHashCell } from './MintTxnHashCell'
import { MintTxnBlockCell } from './MintTxnBlockCell'
import { MintSenderCell } from './MintSenderCell'
import { MintToCell } from './MintToCell'
import { MintAmount0Cell } from './MintAmount0Cell'
import { MintAmount1Cell } from './MintAmount1Cell'
import { MintTxnAgeCell } from './MintTxnAgeCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const TXN_HASH_COLUMN: ColumnDef<Mint, unknown> = {
  id: 'txnHash',
	header: 'Txn Hash',
	cell: (props) => <MintTxnHashCell row={props.row.original} />,
	size: 240,
	meta: {
		skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse"/>
	},
}

export const TXN_BLOCK_COLUMN: ColumnDef<Mint, unknown> = {
	id: 'txnBlock',
  header: 'Block',
  cell: (props) => <MintTxnBlockCell row={props.row.original} />,
  size: 90,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const MINT_SENDER_COLUMN: ColumnDef<Mint, unknown> = {
	id: 'sender',
  header: 'Sender',
  cell: (props) => <MintSenderCell row={props.row.original} />,
  size: 120,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const MINT_TO_COLUMN: ColumnDef<Mint, unknown> = {
	id: 'to',
  header: 'To',
  cell: (props) => <MintToCell row={props.row.original} />,
  size: 120,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT0_COLUMN: ColumnDef<Mint, unknown> = {
	id: 'amount0',
  header: 'Token0',
  cell: (props) => <MintAmount0Cell row={props.row.original} />,
  size: 110,
  meta: {
    className: 'justify-end',
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const AMOUNT1_COLUMN: ColumnDef<Mint, unknown> = {
	id: 'amount1',
  header: 'Token1',
  cell: (props) => <MintAmount1Cell row={props.row.original} />,
  size: 110,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}

export const TXN_AGE_COLUMN: ColumnDef<Mint, unknown> = {
	id: 'txnAge',
  header: 'Age',
  cell: (props) => <MintTxnAgeCell row={props.row.original} />,
  size: 160,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
  },
}