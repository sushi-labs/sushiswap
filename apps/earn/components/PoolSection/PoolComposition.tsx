import { formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { Currency } from '@sushiswap/ui'
import React, { FC } from 'react'
import { List } from '@sushiswap/ui/future/components/list/List'

import { usePoolGraphData, useTokenAmountDollarValues } from '../../lib/hooks'
import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { usePrices } from '@sushiswap/react-query'

interface PoolCompositionProps {
  pool: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })
  const { data, isLoading } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: pool.chainId as ChainId,
  })
  const fiatValues = useTokenAmountDollarValues({ chainId: pool.chainId, amounts: [data?.reserve0, data?.reserve1] })

  return (
    <List>
      <div className="flex items-center justify-between">
        <List.Label>Pool Liquidity</List.Label>
        <List.Label>
          {formatUSD(
            (data?.liquidityNative ?? 0) * Number(prices?.[Native.onChain(pool.chainId).wrapped.address]?.toFixed(10))
          )}
        </List.Label>
      </div>
      <List.Control>
        {data ? (
          <List.KeyValue flex title={`${data.reserve0.currency.symbol}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Currency.Icon currency={data.reserve0.currency} width={18} height={18} />
                {data.reserve0.toSignificant(4)} {data.reserve0.currency.symbol}{' '}
                <span className="text-gray-600 dark:text-slate-400">({formatUSD(fiatValues?.[0] || 0)})</span>
              </div>
            </div>
          </List.KeyValue>
        ) : isLoading ? (
          <List.KeyValue skeleton />
        ) : (
          <></>
        )}
        {data ? (
          <List.KeyValue flex title={`${data.reserve1.currency.symbol}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Currency.Icon currency={data.reserve1.currency} width={18} height={18} />
                {data.reserve1.toSignificant(4)} {data.reserve1.currency.symbol}{' '}
                <span className="text-gray-600 dark:text-slate-400">({formatUSD(fiatValues?.[1] || 0)})</span>
              </div>
            </div>
          </List.KeyValue>
        ) : isLoading ? (
          <List.KeyValue skeleton />
        ) : (
          <></>
        )}
      </List.Control>
    </List>
  )
}
