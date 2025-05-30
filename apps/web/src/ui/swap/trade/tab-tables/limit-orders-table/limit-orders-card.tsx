'use client'

import { Card, Loader } from '@sushiswap/ui'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { MobileCard } from '../history-tables/mobile-card/mobile-card' // ⬅️  your reusable card
import {
  LIMIT_ORDER_COLUMNS,
  LIMIT_ORDER_MOCK_DATA,
} from './limit-orders-table'

export const LimitOrdersMobile = () => {
  const data = LIMIT_ORDER_MOCK_DATA

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
      <Card className="p-5 space-y-6 border-none bg-slate-50 dark:bg-slate-800">
        {data.map((row) => (
          <div key={row.id} className="pb-6 border-b last:border-b-0 last:pb-0">
            <MobileCard row={row} columns={LIMIT_ORDER_COLUMNS} />
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  )
}
