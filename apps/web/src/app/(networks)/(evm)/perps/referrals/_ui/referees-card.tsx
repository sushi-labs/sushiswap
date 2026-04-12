'use client'

import type { PerpsSushiReferredUser } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  DataTableVirtual,
  SkeletonBox,
  useBreakpoint,
} from '@sushiswap/ui'
import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useSushiReferredUsers } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUSD, shortenAddress } from 'sushi'

const REFEREE_COLUMNS = [
  {
    id: 'referee',
    header: 'Referee',
    accessorFn: (row: PerpsSushiReferredUser) => row.refereeAddress,
    sortingFn: 'alphanumeric',
    cell: (props: { row: { original: PerpsSushiReferredUser } }) => {
      return (
        <span className="font-medium lg:whitespace-nowrap">
          {shortenAddress(props.row.original.refereeAddress)}
        </span>
      )
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
        <span className="font-medium lg:whitespace-nowrap">
          {formatDateTime(props.row.original.linkedAt)}
        </span>
      )
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
        <span className="font-medium lg:whitespace-nowrap">
          {formatDateLabel(props.row.original.lastEarnedAt)}
        </span>
      )
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
        <span className="font-medium lg:whitespace-nowrap">
          {formatUSD(props.row.original.lifetimeEarnedFees)}
        </span>
      )
    },
  },
] as ColumnDef<PerpsSushiReferredUser, unknown>[]

export function RefereesCard() {
  const address = useAccount('evm')
  const { isLg } = useBreakpoint('lg')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lifetimeRewards', desc: true },
  ])

  const referredUsers = useSushiReferredUsers({ address })
  const referees = useMemo(
    () => referredUsers.data?.pages.flat() ?? [],
    [referredUsers.data],
  )

  const tableState: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: referees.length,
      },
    }
  }, [referees.length, sorting])

  return (
    <Card className="border-transparent !bg-[#18223B] p-2 !rounded-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Referees</h2>
          <p className="text-sm text-slate-400">
            Wallets linked to your Sushi referral code and their lifetime
            rewards.
          </p>
        </div>
        {referredUsers.hasNextPage ? (
          <Button
            variant="secondary"
            onClick={() => referredUsers.fetchNextPage()}
            loading={referredUsers.isFetchingNextPage}
          >
            Load More
          </Button>
        ) : null}
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-md lg:block">
        {isLg ? (
          <DataTableVirtual
            state={tableState}
            loading={referredUsers.isLoading}
            columns={REFEREE_COLUMNS}
            data={referees}
            onSortingChange={setSorting as OnChangeFn<SortingState>}
            thClassName="!h-8"
            hideScrollbar={true}
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2 lg:hidden">
        {referredUsers.isLoading ? (
          <SkeletonBox className="h-24 w-full" />
        ) : referees.length > 0 ? (
          referees.map((user) => (
            <div
              key={`${user.refereeAddress}-${user.linkedAt}`}
              className="rounded-md bg-[#0D1421] p-3"
            >
              <div className="font-medium">
                {shortenAddress(user.refereeAddress)}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Linked {formatDateTime(user.linkedAt)}
              </div>
              <div className="text-sm text-slate-400">
                Last earned {formatDateLabel(user.lastEarnedAt)}
              </div>
              <div className="mt-2 text-sm font-medium text-white">
                Lifetime rewards: {formatUSD(user.lifetimeEarnedFees)}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-slate-400">
            No referees yet.
          </div>
        )}
      </div>
    </Card>
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
