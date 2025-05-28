import { Loader } from '@sushiswap/ui'
import { DataTable } from '@sushiswap/ui'
import { Card } from '@sushiswap/ui'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import {
  BUY_COLUMN,
  CHAIN_COLUMN,
  DATE_COLUMN,
  PRICE_USD_COLUMN,
  SELL_COLUMN,
  TX_HASH_COLUMN,
  VALUE_PNL_COLUMN,
} from './market-history-columns'

export interface MarketTrade {
  id: string
  buyToken: ReturnType<typeof Native.onChain>
  buyAmount: number
  sellToken: ReturnType<typeof Native.onChain>
  sellAmount: number
  chainFrom: number
  chainTo: number
  valueUsd: number
  pnlPercent: number
  priceUsd: number
  txHash: string
  timestamp: number
}

const MOCK_DATA: MarketTrade[] = [
  {
    id: '1',
    buyToken: Native.onChain(1),
    buyAmount: 0.5,
    sellToken: Native.onChain(5),
    sellAmount: 850,
    chainFrom: 1,
    chainTo: 56,
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
    sellToken: Native.onChain(5),
    sellAmount: 850,
    chainFrom: 1,
    chainTo: 56,
    valueUsd: 850,
    pnlPercent: -10.9 / 850,
    priceUsd: 1900,
    txHash: '0x855f13a0d9e3cbe1c0e3255f50Fe',
    timestamp: 1736122860000,
  },
]

const COLUMNS = [
  BUY_COLUMN,
  SELL_COLUMN,
  CHAIN_COLUMN,
  VALUE_PNL_COLUMN,
  PRICE_USD_COLUMN,
  TX_HASH_COLUMN,
  DATE_COLUMN,
]

export const MarketTable = () => {
  const data = MOCK_DATA

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
      <Card className="overflow-hidden border-none bg-slate-50 dark:bg-slate-800">
        <DataTable
          columns={COLUMNS}
          data={data}
          loading={false}
          className="border-none"
          pagination
        />
      </Card>
    </InfiniteScroll>
  )
}
