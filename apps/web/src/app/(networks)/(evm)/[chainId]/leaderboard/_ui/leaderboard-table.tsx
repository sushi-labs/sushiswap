'use client'
import { Card, CardHeader, CardTitle, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'
import {
  POINTS_COLUMN,
  RANK_COLUMN,
  SWAP_COUNT_COLUMN,
  USER_COLUMN,
  VOLUME_COLUMN,
  getClassNameForRow,
} from './leaderboard-columns'

const connectedUser = {
  rank: 27,
  address: '0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0' as `0x${string}`,
  // points: 4520,
  // swapCount: 230,
  // totalVolumeUsd: 345678,
  // totalFeesUsd: 4567,
}

const leaderboardData = Array.from({ length: 50 }).map((_, index) => {
  const privateKey = generatePrivateKey()
  const address = privateKeyToAddress(privateKey)
  return {
    rank: index + 1,
    address: index + 1 === 27 ? connectedUser.address : address,
    points: 10000000 - index * 1000,
    swapCount: 500 - index,
    totalVolumeUsd: 1000000 - index * 5000,
    totalFeesUsd: 10000 - index * 100,
  }
})

export type LeaderboardEntry = (typeof leaderboardData)[number]

const COLUMNS = [
  RANK_COLUMN,
  USER_COLUMN,
  POINTS_COLUMN,
  VOLUME_COLUMN,
  SWAP_COUNT_COLUMN,
] as ColumnDef<LeaderboardEntry, unknown>[]

const isLoading = false
const fetchNextPage = () => {}

export const LeaderboardTable = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'points', desc: true },
  ])

  const data = useMemo(() => leaderboardData, [])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  const rowClassName = useCallback((row: Row<LeaderboardEntry>) => {
    const rank = row.original.rank
    return getClassNameForRow(rank)
  }, [])

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNextPage}
      hasMore={false}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          rowClassName={rowClassName}
          loading={isLoading}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}
