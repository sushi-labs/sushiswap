'use client'

import { Loader } from '@sushiswap/ui'
import { DataTable } from '@sushiswap/ui'
import { Card } from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useState } from 'react'
import {
  TempChainIds,
  useRecentSwaps,
} from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { type EvmChainId, EvmChainKey } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { MobileCard } from '../mobile-card/mobile-card'
import {
  BUY_COLUMN,
  CHAIN_COLUMN,
  DATE_COLUMN,
  SELL_COLUMN,
  TX_HASH_COLUMN,
  VALUE_PNL_COLUMN,
  getPriceUsdColumn,
} from './market-history-columns'

export interface MarketTrade {
  id: string
  buyToken: Token
  buyAmount: number
  sellToken: Token
  sellAmount: number
  chainFrom: {
    id: number
    name: string
  }
  chainTo: {
    id: number
    name: string
  }
  valueUsd: number
  pnlPercent: number
  priceUsd: number
  txHash: string
  timestamp: number
}

export const MarketTable = () => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [showInUsd, setShowInUsd] = useState(true)

  const { address } = useAccount()

  const { data: recentSwaps } = useRecentSwaps({
    walletAddress: address,
    chainIds: TempChainIds,
  })

  console.log('recentSwaps', recentSwaps)

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

    return recentSwaps.map((swap, i) => {
      const {
        tokenIn,
        tokenOut,
        amountIn,
        amountInUSD,
        amountOut,
        amountOutUSD,
        totalPnl,
        time,
      } = swap

      const txHash = '-'
      return {
        id: `${txHash}-${i}`,
        buyToken: new Token({
          // @TODO: remove type cast once chainId is typed
          chainId: tokenOut.chainId as EvmChainId,
          address: tokenOut.address,
          decimals: tokenOut.decimals,
          symbol: tokenOut.symbol,
          name: tokenOut.name,
          approved: tokenOut.approved,
        }),
        buyAmount: amountOut,
        sellToken: new Token({
          // @TODO: remove type cast once chainId is typed
          chainId: tokenIn.chainId as EvmChainId,
          address: tokenIn.address,
          decimals: tokenIn.decimals,
          symbol: tokenIn.symbol,
          name: tokenIn.name,
          approved: tokenIn.approved,
        }),
        sellAmount: amountIn,
        chainFrom: {
          // @TODO: remove type cast once chainId is typed
          id: tokenIn.chainId as EvmChainId,
          name: EvmChainKey[tokenIn.chainId as EvmChainId],
        },
        chainTo: {
          // @TODO: remove type cast once chainId is typed
          id: tokenOut.chainId as EvmChainId,
          name: EvmChainKey[tokenOut.chainId as EvmChainId],
        },
        valueUsd: amountOutUSD,
        pnlPercent: amountInUSD ? totalPnl / amountInUSD : 0,
        priceUsd: amountOut ? amountOutUSD / amountOut : 0,
        txHash,
        timestamp: time * 1000,
      }
    })
  }, [recentSwaps])

  const tableState = { sorting: [] }

  return (
    <>
      <Card className="hidden overflow-hidden border-none bg-slate-50 dark:bg-slate-800 md:block">
        <DataTable
          columns={COLUMNS}
          data={rowData}
          loading={false}
          className="border-none [&_td]:h-[92px]"
          pagination={true}
          state={{
            ...tableState,
            ...paginationState,
          }}
          onPaginationChange={setPaginationState}
        />
      </Card>

      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 md:hidden">
        {rowData.map((row) => (
          <div key={row.id} className="pb-6 border-b last:border-b-0 last:pb-0">
            <MobileCard row={row} columns={COLUMNS} />
          </div>
        ))}
      </Card>
    </>
  )
}
