import { Loader } from '@sushiswap/ui'
import { DataTable } from '@sushiswap/ui'
import { Card } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
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
  buyToken: ReturnType<typeof Native.onChain>
  buyAmount: number
  sellToken: ReturnType<typeof Native.onChain>
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

export const MOCK_DATA: MarketTrade[] = [
  {
    id: '1',
    buyToken: Native.onChain(1),
    buyAmount: 0.5,
    sellToken: Native.onChain(43114),
    sellAmount: 850,
    chainFrom: {
      id: 1,
      name: 'Ethereum',
    },
    chainTo: {
      id: 43114,
      name: 'Avalanche',
    },
    valueUsd: 850,
    pnlPercent: 190.8 / 850,
    priceUsd: 1900,
    txHash: '0x855f13a0d9e3cbe1c0e3255f50Fe',
    timestamp: 1736122860000,
  },
  {
    id: '2',
    buyToken: Native.onChain(1),
    buyAmount: 0.5,
    sellToken: Native.onChain(43114),
    sellAmount: 850,
    chainFrom: {
      id: 1,
      name: 'Ethereum',
    },
    chainTo: {
      id: 43114,
      name: 'Avalanche',
    },
    valueUsd: 850,
    pnlPercent: -10.9 / 850,
    priceUsd: 1900,
    txHash: '0x855f13a0d9e3cbe1c0e3255f50Fe',
    timestamp: 1736122860000,
  },
]

export const MarketTable = () => {
  const data = MOCK_DATA
  const [showInUsd, setShowInUsd] = useState(true)

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

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {}}
      hasMore={false}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card className="hidden overflow-hidden border-none bg-slate-50 dark:bg-slate-800 md:block">
        <DataTable
          columns={COLUMNS}
          data={data}
          loading={false}
          className="border-none"
          pagination
        />
      </Card>

      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="pb-6 border-b last:border-b-0 last:pb-0">
            <MobileCard row={row} columns={COLUMNS} />
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  )
}
