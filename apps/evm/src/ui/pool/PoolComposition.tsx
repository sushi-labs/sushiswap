'use client'

import { Pool } from '@sushiswap/client'
import { SkeletonText } from '@sushiswap/ui'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui'
import React, { FC, useMemo } from 'react'
import { usePoolGraphData, useTokenAmountDollarValues } from 'src/lib/hooks'
import { SushiSwapV2ChainId } from 'sushi/config'
import { formatUSD } from 'sushi/format'

interface PoolCompositionProps {
  pool: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const { data, isLoading: isPoolLoading } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: pool.chainId as SushiSwapV2ChainId,
  })

  const amounts = [data?.reserve0, data?.reserve1]

  const fiatValues = useTokenAmountDollarValues({
    chainId: pool.chainId,
    amounts,
  })

  const isLoading = isPoolLoading || fiatValues.length !== amounts.length

  const [reserve0USD, reserve1USD, reserveUSD] = useMemo(() => {
    if (isLoading) return [0, 0, 0]
    return [fiatValues[0], fiatValues[1], fiatValues[0] + fiatValues[1]]
  }, [fiatValues, isLoading])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>
          {isLoading ? <SkeletonText /> : <>{formatUSD(reserveUSD)}</>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={data?.reserve0}
            fiatValue={formatUSD(reserve0USD)}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={data?.reserve1}
            fiatValue={formatUSD(reserve1USD)}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
