'use client'

import type { PerpsSushiReferredUser } from '@sushiswap/graph-client/data-api'
import { DataTableVirtual, Slot } from '@sushiswap/ui'
import type {
  ColumnDef,
  OnChangeFn,
  Row,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useSushiReferredUsers } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUSD, shortenAddress } from 'sushi'
import { PerpsCard } from '~evm/perps/_ui/_common'
import {
  columnBodyMeta,
  tableRowClassName,
} from '~evm/perps/_ui/trade-tables/_common'

const REFEREE_COLUMNS = [
  {
    id: 'referee',
    header: 'Referee',
    accessorFn: (row: PerpsSushiReferredUser) => row.refereeAddress,
    sortingFn: 'alphanumeric',
    cell: (props: { row: { original: PerpsSushiReferredUser } }) => {
      return (
        <span className="font-medium whitespace-nowrap">
          {shortenAddress(props.row.original.refereeAddress)}
        </span>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  },
  {
    id: 'lifetimeRewards',
    header: 'Lifetime Rewards',
    accessorFn: (row: PerpsSushiReferredUser) => row.lifetimeEarnedFees,
    sortingFn: (
      { original: rowA },
      { original: rowB }: { original: PerpsSushiReferredUser },
    ) => {
      return rowA.lifetimeEarnedFees - rowB.lifetimeEarnedFees
    },
    cell: (props: { row: { original: PerpsSushiReferredUser } }) => {
      return (
        <span className="font-medium whitespace-nowrap">
          {formatUSD(props.row.original.lifetimeEarnedFees)}
        </span>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  },
  {
    id: 'lastEarnedAt',
    header: 'Last Earned',
    accessorFn: (row: PerpsSushiReferredUser) => row.lastEarnedAt ?? '',
    sortingFn: (
      { original: rowA },
      { original: rowB }: { original: PerpsSushiReferredUser },
    ) => {
      return (
        new Date(rowA.lastEarnedAt ?? 0).getTime() -
        new Date(rowB.lastEarnedAt ?? 0).getTime()
      )
    },
    cell: (props: { row: { original: PerpsSushiReferredUser } }) => {
      return (
        <span className="font-medium whitespace-nowrap">
          {formatDateLabel(props.row.original.lastEarnedAt)}
        </span>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  },
  {
    id: 'linkedAt',
    header: 'Linked At',
    accessorFn: (row: PerpsSushiReferredUser) => row.linkedAt,
    sortingFn: (
      { original: rowA },
      { original: rowB }: { original: PerpsSushiReferredUser },
    ) => {
      return (
        new Date(rowA.linkedAt).getTime() - new Date(rowB.linkedAt).getTime()
      )
    },
    cell: (props: { row: { original: PerpsSushiReferredUser } }) => {
      return (
        <span className="font-medium whitespace-nowrap">
          {formatDateTime(props.row.original.linkedAt)}
        </span>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  },
] as ColumnDef<PerpsSushiReferredUser, unknown>[]

export function RefereesCard() {
  const address = useAccount('evm')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lifetimeRewards', desc: true },
  ])

  const referredUsers = useSushiReferredUsers({
    address,
  })
  const referees = useMemo(() => referredUsers.data ?? [], [referredUsers.data])

  const tableState: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: referees.length,
      },
    }
  }, [referees.length, sorting])

  const rowRenderer = useCallback(
    (row: Row<PerpsSushiReferredUser>, rowNode: ReactNode) => {
      return (
        <Slot
          key={`${row.original.refereeAddress}-${row.original.linkedAt}-slot`}
        >
          <>
            {rowNode}
            {row?.original?.children?.map((i, idx) => {
              return (
                <tr
                  key={`${i.refereeAddress}-${i.linkedAt}-child-${idx}`}
                  className="text-xs h-[25px]"
                >
                  <td className="relative">
                    <div
                      className="absolute left-[8px] bottom-[8px] border-l border-b rounded-bl-[4px] border-gray-700 w-[10px]"
                      style={{
                        height: idx === 0 ? '15px' : '30px',
                      }}
                    />
                    <span className="font-medium pl-5 whitespace-nowrap">
                      {shortenAddress(i.refereeAddress)}
                    </span>
                  </td>
                  <td className="font-medium pl-2 whitespace-nowrap">
                    {formatUSD(i.lifetimeEarnedFees)}
                  </td>
                  <td className="font-medium pl-2 whitespace-nowrap">
                    {formatDateLabel(i.lastEarnedAt)}
                  </td>
                  <td className="font-medium pl-2 whitespace-nowrap">
                    {formatDateTime(i.linkedAt)}
                  </td>
                </tr>
              )
            })}
          </>
        </Slot>
      )
    },
    [],
  )

  return (
    <PerpsCard className="p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Referees</h2>
          <p className="text-sm text-perps-muted-50">
            Wallets linked to your Sushi referral code and their lifetime
            rewards.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md min-h-[300px]">
        <DataTableVirtual
          state={tableState}
          loading={referredUsers.isLoading}
          columns={REFEREE_COLUMNS}
          data={referees}
          onSortingChange={setSorting as OnChangeFn<SortingState>}
          thClassName="!h-8 pl-0"
          hideScrollbar={true}
          trClassName={`${tableRowClassName} `}
          rowRenderer={rowRenderer}
        />
      </div>
    </PerpsCard>
  )
}

function formatDateTime(value: string) {
  return format(new Date(value), 'MMM d, yyyy HH:mm')
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) {
    return 'Never'
  }

  return format(new Date(value), 'MMM d, yyyy')
}
