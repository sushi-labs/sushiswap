'use client'

import {
  type RecentSwap,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { DataTable, SkeletonBox } from '@sushiswap/ui'
import { Card } from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useState } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { useDerivedStateSimpleSwap } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { useAccount } from 'wagmi'
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
    (_token0?.isNative ? 'NATIVE' : _token0?.wrapped?.address)
  const token1Address =
    searchParams.get('token1') ||
    (_token1?.isNative ? 'NATIVE' : _token1?.wrapped?.address)

  const [showInUsd, setShowInUsd] = useState(true)

  const { address } = useAccount()

  const { data: _recentSwaps, isLoading } = useRecentSwaps({
    walletAddress: address,
    chainIds: chainIds.filter((chainId) => isTokenListV2ChainId(chainId)),
  })

  const recentSwaps = useMemo(() => {
    if (!_recentSwaps) return []
    if (showCurrentPairOnly && token0Address && token1Address) {
      return _recentSwaps.filter((swap) => {
        const { tokenIn, tokenOut } = swap
        const tokenInAddress =
          tokenIn.address === NativeAddress ? 'NATIVE' : tokenIn.address
        const tokenOutAddress =
          tokenOut.address === NativeAddress ? 'NATIVE' : tokenOut.address
        return (
          (tokenInAddress.toLowerCase() === token0Address.toLowerCase() &&
            tokenOutAddress.toLowerCase() === token1Address.toLowerCase()) ||
          (tokenInAddress.toLowerCase() === token1Address.toLowerCase() &&
            tokenOutAddress.toLowerCase() === token0Address.toLowerCase())
        )
      })
    }
    return _recentSwaps
  }, [_recentSwaps, showCurrentPairOnly, token0Address, token1Address])

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
      <Card className="hidden overflow-hidden !border-none bg-slate-50 dark:bg-slate-800 md:block">
        <DataTable
          columns={COLUMNS}
          data={rowData}
          loading={isLoading}
          className="border-none [&_td]:h-[92px]"
          pagination={true}
          state={{
            pagination: paginationState,
          }}
          onPaginationChange={setPaginationState}
        />
      </Card>

      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 md:hidden">
        {isLoading ? (
          <SkeletonBox className="w-full h-52" />
        ) : !rowData?.length ? (
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
