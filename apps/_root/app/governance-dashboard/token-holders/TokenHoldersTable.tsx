'use client'

import { ExternalLinkIcon } from '@heroicons/react/outline'
import { shortenAddress } from '@sushiswap/format'
import { ExternalLink } from '@sushiswap/ui/future/components/ExternalLink'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortDirection,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'

import { FilterButton } from '../components/FilterButton'
import { formatNumber } from '../lib'
import { tokenHolderNames } from './tokenHolderNames'

type TokenHolder = {
  id: string
  rank: number
  address: string
  quantity: number
  ownership: number
  value: number
}

const columnHelper = createColumnHelper<TokenHolder>()

const BALANCE_FILTER = {
  key: 'balanceFilter',
  options: [1, 1_000, 10_000, 100_000],
}
const ORDER_DIRECTION_KEY = 'orderDirection'

export function TokenHoldersTable({ users }: { users: TokenHolder[] }) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  function sortColumn(direction: false | SortDirection) {
    params.set(ORDER_DIRECTION_KEY, direction === 'desc' ? 'asc' : 'desc')

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  function filterBalance(balance: number) {
    params.set(BALANCE_FILTER.key, balance.toString())

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  const [columns] = useState([
    columnHelper.accessor('rank', {
      header: 'Rank',
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
      size: 50,
      enableSorting: false,
      meta: { skeleton: <Skeleton.Text /> },
    }),
    columnHelper.accessor('address', {
      header: 'Name',
      cell: (info) => {
        const address = info.getValue()
        return (
          <ExternalLink
            href={`https://etherscan.io/address/${address}`}
            endIcon={<ExternalLinkIcon className="h-5 w-5" />}
            className="gap-2 font-bold"
          >
            {tokenHolderNames[address] ?? shortenAddress(address)}
          </ExternalLink>
        )
      },
      minSize: 240,
      enableSorting: false,
      meta: { skeleton: <Skeleton.Text /> },
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
      meta: { skeleton: <Skeleton.Text /> },
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
      meta: { skeleton: <Skeleton.Text /> },
    }),
    columnHelper.accessor('value', {
      header: (h) => <div onClick={() => sortColumn(h.column.getIsSorted())}>Value</div>,
      cell: (info) =>
        info.getValue().toLocaleString('EN', {
          maximumFractionDigits: 0,
          style: 'currency',
          currency: 'USD',
        }),
      meta: { skeleton: <Skeleton.Text /> },
    }),
  ])

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'quantity', desc: params.get(ORDER_DIRECTION_KEY) !== 'asc' },
  ])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    sortDescFirst: true,
  })

  return (
    <div className="space-y-8">
      <h2 className="pl-1 text-2xl font-bold text-slate-200">All Holders</h2>
      <div className="space-y-6">
        <div className="flex gap-2">
          {BALANCE_FILTER.options.map((filter) => (
            <FilterButton
              onClick={() => filterBalance(filter)}
              isActive={Number(params.get(BALANCE_FILTER.key)) === filter}
              key={filter}
            >{`>=${formatNumber(filter)} $SUSHI`}</FilterButton>
          ))}
        </div>
        <div className="rounded-lg bg-[#1A2031]">
          <GenericTable<TokenHolder>
            loading={isPending}
            table={table}
            placeholder=""
            pageSize={Math.max(users.length, 5)}
          />
        </div>
      </div>
    </div>
  )
}
