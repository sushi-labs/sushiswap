'use client'
import type { LeaderboardEntry } from '@sushiswap/graph-client/leaderboard'
import { Card, CardHeader, CardTitle, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLeaderboard } from 'src/lib/hooks/react-query/leaderboard'
import {
  POINTS_COLUMN,
  RANK_COLUMN,
  USER_COLUMN,
  VOLUME_COLUMN,
  getClassNameForRow,
} from './leaderboard-columns'

const COLUMNS = [
  RANK_COLUMN,
  USER_COLUMN,
  POINTS_COLUMN,
  VOLUME_COLUMN,
] as ColumnDef<LeaderboardEntry, unknown>[]

export const LeaderboardTable = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'points', desc: true },
  ])
  const {
    data: leaderboardData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useLeaderboard({
    page: 1,
    pageSize: 50,
    enabled: true,
  })

  const [data] = useMemo(() => {
    return [leaderboardData?.pages.flatMap((page) => page.entries) ?? []]
  }, [leaderboardData])

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
      hasMore={hasNextPage}
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
