'use client'

import { getPool } from '@sushiswap/client'
import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { CardLabel } from '@sushiswap/ui'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardItem,
  CardTitle,
} from '@sushiswap/ui/components/card'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { useTokenAmountDollarValues } from 'lib/hooks'
import React, { FC, useMemo, useState } from 'react'

import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { PoolTransactionsV3 } from './PoolTransactionsV3'
import { StatisticsCharts } from './StatisticsChart'

enum Granularity {
  Day,
  Week,
}

const PoolPageV3: FC<{ pool: Awaited<ReturnType<typeof getPool>> }> = ({ pool }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool pool={pool} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ pool: Awaited<ReturnType<typeof getPool>> }> = ({ pool }) => {
  const { id } = pool
  const [_chainId, address] = id.split(':')
  const chainId = +_chainId as SushiSwapV3ChainId
  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address })
  const { data: cPool } = useConcentratedLiquidityPool({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const { data: reserves, isLoading: isReservesLoading } = useConcentratedLiquidityPoolReserves({
    pool: cPool,
    chainId,
  })
  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })
  const incentiveAmounts = useMemo(() => poolStats?.incentives.map((el) => el.reward), [poolStats?.incentives])
  const fiatValuesIncentives = useTokenAmountDollarValues({ chainId, amounts: incentiveAmounts })

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
      <StatisticsCharts address={address} chainId={chainId} />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pool Liquidity</CardTitle>
            <CardDescription>{formatUSD(fiatValues[0] + fiatValues[1])}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardCurrencyAmountItem
              isLoading={isReservesLoading}
              amount={reserves?.[0]}
              fiatValue={formatUSD(fiatValues[0])}
            />
            <CardCurrencyAmountItem
              isLoading={isReservesLoading}
              amount={reserves?.[1]}
              fiatValue={formatUSD(fiatValues[1])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rewards</CardTitle>
            <CardDescription>{formatUSD(fiatValuesIncentives.reduce((a, b) => a + b, 0))} per day</CardDescription>
          </CardHeader>
          <CardContent>
            <CardGroup>
              <CardLabel>Tokens (per day)</CardLabel>
              {poolStats?.incentives.map((el, i) => (
                <CardCurrencyAmountItem key={i} amount={el.reward} fiatValue={formatUSD(fiatValuesIncentives[i])} />
              ))}
            </CardGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col md:flex-row justify-between">
                Details
                <div className="flex items-center gap-1">
                  <Toggle
                    variant="outline"
                    size="xs"
                    pressed={granularity === Granularity.Day}
                    onClick={() => setGranularity(Granularity.Day)}
                  >
                    1D
                  </Toggle>
                  <Toggle
                    variant="outline"
                    size="xs"
                    pressed={granularity === Granularity.Week}
                    onClick={() => setGranularity(Granularity.Week)}
                  >
                    1W
                  </Toggle>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {poolStats ? (
              <CardItem title="Volume">
                <span className="flex items-center gap-2">
                  {formatUSD(granularity === Granularity.Week ? poolStats.volume1w : poolStats.volume1d)}
                  <span
                    className={
                      poolStats[granularity === Granularity.Week ? 'volumeChange1w' : 'volumeChange1d'].toFixed(2) ===
                      '0.00'
                        ? 'text-gray-600 dark:text-slate-400'
                        : poolStats[granularity === Granularity.Week ? 'volumeChange1w' : 'volumeChange1d'] > 0
                        ? 'text-green'
                        : 'text-red'
                    }
                  >
                    ({poolStats[granularity === Granularity.Week ? 'volumeChange1w' : 'volumeChange1d'].toFixed(2)}
                    %)
                  </span>
                </span>
              </CardItem>
            ) : (
              <CardItem skeleton />
            )}
            {poolStats ? (
              <CardItem title="Fees">
                {formatUSD(granularity === Granularity.Day ? poolStats.fees1d : poolStats.fees1w)}
              </CardItem>
            ) : (
              <CardItem skeleton />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 md:col-span-2">
        <PoolTransactionsV3 pool={pool} poolId={pool.address} />
      </div>
    </div>
  )
}

export { PoolPageV3 }
