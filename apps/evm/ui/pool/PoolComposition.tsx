'use client'

import { Pool } from '@sushiswap/client'
import { usePrices } from '@sushiswap/react-query'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui/components/card'
import { usePoolGraphData, useTokenAmountDollarValues } from 'lib/hooks'
import React, { FC } from 'react'
import { ChainId } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

interface PoolCompositionProps {
  pool: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })
  const { data, isLoading } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: pool.chainId as ChainId,
  })
  const fiatValues = useTokenAmountDollarValues({
    chainId: pool.chainId,
    amounts: [data?.reserve0, data?.reserve1],
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>
          {formatUSD(
            (data?.liquidityNative ?? 0) *
              Number(
                prices?.[Native.onChain(pool.chainId).wrapped.address]?.toFixed(
                  10,
                ),
              ),
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={data?.reserve0}
            fiatValue={formatUSD(fiatValues?.[0] || 0)}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={data?.reserve1}
            fiatValue={formatUSD(fiatValues?.[1] || 0)}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
