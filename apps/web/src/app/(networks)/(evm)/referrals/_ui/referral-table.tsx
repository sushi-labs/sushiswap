'use client'
import { Card, CardHeader, CardTitle, DataTable, Loader } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTrackingData } from 'src/lib/hooks/react-query/fuul/use-tracking-data'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import type { EvmAddress } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { POINTS_COLUMN, USER_COLUMN, VOLUME_COLUMN } from './referral-columns'

export type ReferralEntry = {
  address: EvmAddress
  points: number
  volume: number
}

const COLUMNS = [USER_COLUMN, POINTS_COLUMN, VOLUME_COLUMN] as ColumnDef<
  ReferralEntry,
  unknown
>[]

const fetchNextPage = () => {}
const hasNextPage = false
const isLoading = false
const leaderboardData: ReferralEntry[] | undefined = [
  {
    address: '0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0',
    points: 1500,
    volume: 25000,
  },
  {
    address: '0x9B6cEd7dc2F47Ae3e30E6162193BD9CE78643A63',
    points: 1200,
    volume: 20000,
  },
  {
    address: '0xe737C8114B09227e492D55Cc000F319BA42Fdf4B',
    points: 1000,
    volume: 15000,
  },
]

export const ReferralTable = () => {
  const { address } = useAccount()
  const {
    data: test,
    // isLoading: isLoadingTable,
    // fetchNextPage,
    // hasNextPage,
  } = useTrackingData({
    address: '0xb64eb68da4bfc230ca3b0dca2d4ce75200f03c9f',
    enabled: true,
  })
  console.log(test)

  const data = useMemo(() => {
    if (!leaderboardData) return []
    return leaderboardData
  }, [])

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
            <CardTitle>Your Invites</CardTitle>
            {!address ? <ConnectButton size="sm" /> : null}
          </div>
        </CardHeader>
        <DataTable
          state={state}
          loading={isLoading}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}
