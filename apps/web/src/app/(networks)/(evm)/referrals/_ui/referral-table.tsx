'use client'
import type { ReferredUser } from '@sushiswap/graph-client/leaderboard'
import { Card, CardHeader, CardTitle, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useReferredInvites } from 'src/lib/hooks/react-query/referral'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'wagmi'
import { POINTS_COLUMN, USER_COLUMN, VOLUME_COLUMN } from './referral-columns'

const COLUMNS = [USER_COLUMN, POINTS_COLUMN, VOLUME_COLUMN] as ColumnDef<
  ReferredUser,
  unknown
>[]

export const ReferralTable = () => {
  const { address } = useAccount()
  const {
    data: leaderboardData,
    isLoading: isLoadingTable,
    fetchNextPage,
    hasNextPage,
  } = useReferredInvites({
    address,
    page: 1,
    pageSize: 25,
    enabled: Boolean(address),
  })

  const data = useMemo(() => {
    if (!leaderboardData) return []
    return leaderboardData.pages.flatMap((page) => page.referredUsers)
  }, [leaderboardData])

  const totalCount = useMemo(() => {
    if (!leaderboardData) return 0
    return leaderboardData.pages[0]?.pageInfo.totalCount || 0
  }, [leaderboardData])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length])

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
      <Card id="referral-table">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Your Invites {totalCount > 0 ? `(${totalCount})` : null}
            </CardTitle>
            {!address ? <ConnectButton size="sm" /> : null}
          </div>
        </CardHeader>
        <DataTable
          state={state}
          loading={isLoadingTable}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}
