'use client'

import type { RecentSwap } from '@sushiswap/graph-client/data-api'
import { DataTable } from '@sushiswap/ui'
import { Card } from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useState } from 'react'

import {
  filterLocalRecentSwapsByAccountAndChainIds,
  useLocalRecentSwaps,
} from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
// import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { useAccount } from 'wagmi'
import { useDerivedStateSimpleSwap } from '../../../../derivedstate-simple-swap-provider'
import { useTradeTablesContext } from '../../trade-tables-context'
import { MobileDataCard } from '../mobile-data-card/mobile-data-card'
import {
  BUY_COLUMN,
  CHAIN_COLUMN,
  DATE_COLUMN,
  SELL_COLUMN,
  TX_HASH_COLUMN,
  VALUE_PNL_COLUMN,
  getPriceUsdColumn,
} from './market-history-columns'

export type MarketTrade = RecentSwap
export const MarketTable = () => {
  const { chainIds, showCurrentPairOnly } = useTradeTablesContext()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const {
    state: { token0: _token0, token1: _token1 },
  } = useDerivedStateSimpleSwap()
  const searchParams = useSearchParams()

  const token0Address =
    searchParams.get('token0') ||
    (_token0?.isNative ? 'NATIVE' : _token0?.wrap()?.address)
  const token1Address =
    searchParams.get('token1') ||
    (_token1?.isNative ? 'NATIVE' : _token1?.wrap()?.address)

  const [showInUsd, setShowInUsd] = useState(true)

  const { address } = useAccount()

  // const { data: _recentSwaps, isLoading } = useRecentSwaps({
  //   walletAddress: address,
  //   chainIds: chainIds.filter((chainId) => isTokenListV2ChainId(chainId)),
  // })

  const { data: _localRecentSwaps } = useLocalRecentSwaps()

  const localRecentSwaps = useMemo(() => {
    if (!_localRecentSwaps || !address) return []
    return filterLocalRecentSwapsByAccountAndChainIds({
      account: address,
      chainIds: chainIds,
      swaps: _localRecentSwaps,
    })
  }, [address, _localRecentSwaps, chainIds])

  const recentSwaps = useMemo(() => {
    if (!localRecentSwaps) return []
    if (showCurrentPairOnly && token0Address && token1Address) {
      return localRecentSwaps.filter((swap) => {
        const { token0, token1 } = swap
        const tokenInAddress =
          token0.type === 'native' ? 'NATIVE' : token0.address
        const tokenOutAddress =
          token1.type === 'native' ? 'NATIVE' : token1.address
        return (
          (tokenInAddress.toLowerCase() === token0Address.toLowerCase() &&
            tokenOutAddress.toLowerCase() === token1Address.toLowerCase()) ||
          (tokenInAddress.toLowerCase() === token1Address.toLowerCase() &&
            tokenOutAddress.toLowerCase() === token0Address.toLowerCase())
        )
      })
    }
    return localRecentSwaps
  }, [localRecentSwaps, showCurrentPairOnly, token0Address, token1Address])

  const priceCol = useMemo(
    () => getPriceUsdColumn(showInUsd, setShowInUsd),
    [showInUsd],
  )

  const COLUMNS = useMemo(
    () => [
      BUY_COLUMN,
      SELL_COLUMN,
      CHAIN_COLUMN,
      VALUE_PNL_COLUMN,
      priceCol,
      TX_HASH_COLUMN,
      DATE_COLUMN,
    ],
    [priceCol],
  )

  const rowData = useMemo(() => {
    if (!recentSwaps) return []

    return recentSwaps
  }, [recentSwaps])

  return (
    <>
      <Card className="hidden overflow-hidden !border-none !shadow-none bg-slate-50 dark:bg-slate-800 lg:block">
        <DataTable
          columns={COLUMNS}
          data={rowData}
          loading={false}
          className="border-none [&_td]:h-[92px]"
          pagination={true}
          state={{
            pagination: paginationState,
          }}
          onPaginationChange={setPaginationState}
        />
      </Card>

      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 lg:hidden">
        {!rowData?.length ? (
          <p className="text-sm italic text-center text-muted-foreground dark:text-pink-200 h-52 flex items-center justify-center">
            No Past Market Orders
          </p>
        ) : (
          rowData?.map((row, idx) => (
            <div
              key={`history-row-${idx}`}
              className="pb-6 border-b last:border-b-0 last:pb-0"
            >
              <MobileDataCard row={row} columns={COLUMNS} />
            </div>
          ))
        )}
      </Card>
    </>
  )
}
