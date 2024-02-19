'use client'

import { Pool } from '@sushiswap/client'
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
import React, { FC } from 'react'
import { usePoolGraphData, useTokenAmountDollarValues } from 'src/lib/hooks'
import { ChainId } from 'sushi/chain'
import { formatUSD } from 'sushi/format'

interface PoolCompositionProps {
  pool: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
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
        <CardDescription>{formatUSD(data?.liquidityUSD ?? 0)}</CardDescription>
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
