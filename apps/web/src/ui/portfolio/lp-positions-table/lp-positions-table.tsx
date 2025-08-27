import { Card, DataTable } from '@sushiswap/ui'
import type { SortingState, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { SUSHI, USDC } from 'sushi/currency'
import {
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
} from '../../pool/columns-v2'
import {
  APR_COLUMN,
  POSITION_SIZE_COLUMN,
  POSITION_UNCOLLECTED_COLUMN,
  PRICE_RANGE_COLUMN,
  REWARDS_COLUMN,
} from './columns'
import { LPPositionsTableHeader } from './lp-positions-table-header'
import { Trending } from './trending'

const columns: any[] = [
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
  POSITION_SIZE_COLUMN,
  POSITION_UNCOLLECTED_COLUMN,
  REWARDS_COLUMN,
  APR_COLUMN,
  PRICE_RANGE_COLUMN,
]

const data: any[] = [
  {
    chainId: 1,
    name: 'Sushi / USDC',
    token0Address: SUSHI[1].address,
    token0: SUSHI[1],
    token1Address: USDC[1].address,
    token1: USDC[1],
    protocol: 'SUSHISWAP_V2',
    swapFee: 0.0003,
    position: {
      positionUSD: 12345.67,
      token0Size: 89.01,
      token1Size: 2345.67,
      unclaimedUSD: 0,
    },
    rewards: [],
    totalRewardsUSD: 0,
    apr: 109,
  },
  {
    chainId: 42161,
    name: 'Sushi / USDC',
    token0Address: SUSHI[42161].address,
    token0: SUSHI[42161],
    token1Address: USDC[42161].address,
    token1: USDC[42161],
    protocol: 'SUSHISWAP_V3',
    swapFee: 0.001,
    position: {
      positionUSD: 23456.78,
      token0Size: 123.45,
      token1Size: 6789.01,
      unclaimedUSD: 23.45,
      unclaimedToken0: 1.23,
      unclaimedToken1: 34.56,
    },
    rewards: [
      {
        token: SUSHI[1],
        amount: 11.7,
      },
    ],
    totalRewardsUSD: 20,
    apr: 109,
  },
]

export const LPPositionsTable = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'size', desc: true },
  ])
  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [sorting])

  return (
    // <InfiniteScroll
    //   dataLength={data.length}
    //   next={fetchNextPage}
    //   hasMore={data.length < (count ?? 0)}
    //   loader={
    //     <div className="flex justify-center w-full py-4">
    //       <Loader size={16} />
    //     </div>
    //   }
    // >
    <Card className="overflow-hidden dark:!bg-slate-800 !bg-slate-50">
      <Trending />
      <LPPositionsTableHeader />
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={false}
        // linkFormatter={(row) =>
        //   `/${ChainKey[row.chainId]}/pool/${
        //     row.protocol === SushiSwapProtocol.SUSHISWAP_V2 ? 'v2' : 'v3'
        //   }/${row.address}`
        // }

        columns={columns}
        data={data}
        className="border-t-0"
      />
    </Card>
    // </InfiniteScroll>
  )
}
