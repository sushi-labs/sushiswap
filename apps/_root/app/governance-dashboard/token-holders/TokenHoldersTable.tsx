'use client'

import { ExternalLinkIcon } from '@heroicons/react/outline'
import { shortenAddress } from '@sushiswap/format'
import { GenericTable, Link } from '@sushiswap/ui'
import { createColumnHelper, getCoreRowModel, SortDirection, useReactTable } from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'

import { FilterButton } from '../components/FilterButton'
import { formatNumber } from '../lib'

type TokenHolder = {
  id: string
  rank: number
  name: string
  quantity: number
  ownership: number
  value: number
}

const columnHelper = createColumnHelper<TokenHolder>()
const TOKEN_HOLDER_FILTERS = [1, 1_000, 10_000, 100_000]

export function TokenHoldersTable({ users }: { users: TokenHolder[] }) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  function sortColumn(direction: false | SortDirection) {
    params.set('orderDirection', direction === 'desc' ? 'asc' : 'desc')

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  function filterBalance(balance: number) {
    params.set('balanceFilter', balance.toString())

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  // TODO: remove sortable here and add asc/desc sorting buttons
  const [columns] = useState([
    columnHelper.accessor('rank', {
      header: 'Rank',
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
      size: 50,
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <Link.External
          href={`https://etherscan.io/address/${info.getValue()}`}
          endIcon={<ExternalLinkIcon className="h-5 w-5" />}
          className="gap-2 font-bold"
        >
          {shortenAddress(info.getValue())}
        </Link.External>
      ),
      minSize: 200,
      enableSorting: false,
    }),
    columnHelper.accessor('quantity', {
      header: (h) => <div onClick={() => sortColumn(h.column.getIsSorted())}>Quantity</div>,
      cell: (info) => (
        <span className="text-slate-300">
          {info.getValue().toLocaleString('EN', {
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    }),
    columnHelper.accessor('ownership', {
      header: (h) => <div onClick={() => sortColumn(h.column.getIsSorted())}>Ownership</div>,
      cell: (info) => (
        <span className="text-slate-300">
          {info.getValue().toLocaleString('EN', {
            maximumFractionDigits: 2,
            style: 'percent',
          })}
        </span>
      ),
    }),
    columnHelper.accessor('value', {
      header: (h) => <div onClick={() => sortColumn(h.column.getIsSorted())}>Value</div>,
      cell: (info) =>
        info.getValue().toLocaleString('EN', {
          maximumFractionDigits: 0,
          style: 'currency',
          currency: 'USD',
        }),
    }),
  ])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-8">
      <h2 className="pl-1 text-2xl font-bold text-slate-200">All Holders</h2>
      <div className="space-y-6">
        <div className="flex gap-2">
          {TOKEN_HOLDER_FILTERS.map((filter) => (
            <FilterButton
              onClick={() => filterBalance(filter)}
              isActive={Number(params.get('balanceFilter')) === filter}
              key={filter}
            >{`>=${formatNumber(filter)} $SUSHI`}</FilterButton>
          ))}
        </div>

        <GenericTable<TokenHolder>
          loading={isPending}
          table={table}
          placeholder=""
          pageSize={Math.max(users.length, 5)}
        />
      </div>
    </div>
  )
}
