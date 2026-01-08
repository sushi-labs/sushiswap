'use client'
import type { LeaderboardEntry } from '@sushiswap/graph-client/leaderboard'
import { Card, CardHeader, CardTitle, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLeaderboard } from 'src/lib/hooks/react-query/leaderboard'
import { useUserStats } from 'src/lib/hooks/react-query/leaderboard/use-user-stats'
import { useAccount } from 'wagmi'
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
  const { address } = useAccount()
  const { data: userStats, isLoading: isLoadingUserStats } = useUserStats({
    address,
    enabled: Boolean(address),
  })

  const {
    data: leaderboardData,
    isLoading: isLoadingTable,
    fetchNextPage,
    hasNextPage,
  } = useLeaderboard({
    page: 1,
    pageSize: 50,
    enabled: true,
  })
  const isLoading = isLoadingTable || isLoadingUserStats

  const data = useMemo(() => {
    const _leaderboardData =
      leaderboardData?.pages.flatMap((page) => page.entries) ?? []
    const stats = userStats?.stats?.[0]
    if (!stats || stats.rank <= 10) {
      return _leaderboardData
    }
    return [
      {
        address: stats.address,
        points: stats.points,
        rank: stats.rank,
        volumeUsd: stats.volumeUsd,
      },
      ..._leaderboardData,
    ]
  }, [leaderboardData, userStats])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length])

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
      <Card id="leaderboard-table">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <DataTable
          state={state}
          rowClassName={rowClassName}
          loading={isLoading}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}
