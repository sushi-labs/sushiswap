'use client'

import { Native, Token } from '@sushiswap/currency'
import { Currency, ProgressBar, ProgressColor } from '@sushiswap/ui'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'

import { formatNumber, TreasuryBalance } from '../lib'

const columnHelper = createColumnHelper<TreasuryBalance>()

const columns = [
  columnHelper.accessor('token', {
    header: 'Token',
    enableSorting: false,
    meta: { className: 'pl-1' },
    cell: (info) => {
      const token = info.getValue()
      const currency = token.isNative ? Native.onChain(token.chainId) : new Token(token)

      return (
        <div className="flex items-center gap-2 pl-0.5 font-medium">
          <Currency.Icon currency={currency} width={24} height={24} />
          {currency.symbol}
        </div>
      )
    },
  }),
  columnHelper.accessor('portfolioShare', {
    header: 'Portfolio Share',

    cell: (info) => <ProgressBar progress={info.getValue()} color={ProgressColor.BLUE} className="w-[100px]" />,
  }),
  columnHelper.accessor('balanceUSD', {
    header: () => <div className="w-full text-right">Value</div>,
    enableSorting: false,
    cell: (info) => <div className="w-full text-right">${formatNumber(info.getValue())}</div>,
  }),
  columnHelper.accessor('balance', {
    header: () => <div className="w-full text-right">Amount</div>,
    enableSorting: false,
    cell: (info) => <div className="w-full text-right">{formatNumber(info.getValue())}</div>,
  }),
  columnHelper.accessor('price', {
    header: () => <div className="w-full text-right">Price</div>,
    enableSorting: false,
    meta: { className: 'pr-3' },
    cell: (info) => (
      <div className="w-full pr-3 text-right">
        {(+info.getValue()).toLocaleString('EN', {
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'USD',
        })}
      </div>
    ),
  }),
]

export function TreasuryBalancesTable({ balances }: { balances: TreasuryBalance[] }) {
  const table = useReactTable({
    data: balances,
    columns,
    initialState: {
      sorting: [{ id: 'portfolioShare', desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="rounded-lg bg-[#1A2031]">
      <div className="h-full w-full border-b border-slate-800 px-5 pt-5 pb-7">
        <h3 className="mt-3 text-xl font-semibold">Treasury Snapshot</h3>
        {/* <ExternalLink
          href={`https://etherscan.io/address/${TREASURY_ADDRESS}`}
          className="group inline-flex text-sm text-slate-400"
          endIcon={
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover:text-white group-focus:text-white group-active:text-white" />
          }
        >
          <span>Wallet Address: {shortenAddress(TREASURY_ADDRESS)}</span>
        </ExternalLink> */}
      </div>
      <GenericTable<TreasuryBalance>
        loading={false}
        loadingOverlay={false}
        table={table}
        placeholder=""
        pageSize={Math.max(balances.length, 3)}
      />
    </div>
  )
}
