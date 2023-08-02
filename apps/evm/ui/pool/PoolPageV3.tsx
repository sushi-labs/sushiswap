'use client'

import { RadioGroup } from '@headlessui/react'
import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { useTokenAmountDollarValues } from 'lib/hooks'
import React, { FC, useMemo, useState } from 'react'

import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { StatisticsCharts } from './StatisticsChart'

enum Granularity {
  Day,
  Week,
}

const PoolPageV3: FC<{ params: { id: string } }> = ({ params }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool params={params} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ params: { id: string } }> = ({ params }) => {
  const [chainId, address] = params.id.split('%3A') as [SushiSwapV3ChainId, string]
  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address })
  const { data: pool } = useConcentratedLiquidityPool({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const { data: reserves, isLoading: isReservesLoading } = useConcentratedLiquidityPoolReserves({ pool, chainId })
  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })
  const incentiveAmounts = useMemo(() => poolStats?.incentives.map((el) => el.reward), [poolStats?.incentives])
  const fiatValuesIncentives = useTokenAmountDollarValues({ chainId, amounts: incentiveAmounts })

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-10">
      <StatisticsCharts address={address} chainId={chainId} />
      <div className="flex flex-col gap-6">
        <List className="!pt-0">
          <div className="flex items-center justify-between">
            <List.Label>Pool Liquidity</List.Label>
            <List.Label>{formatUSD(fiatValues[0] + fiatValues[1])}</List.Label>
          </div>
          <List.Control>
            {!isReservesLoading && reserves ? (
              <List.KeyValue flex title={`${reserves[0].currency.symbol}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Currency.Icon currency={reserves[0].currency} width={18} height={18} />
                    {reserves[0].toSignificant(4)} {reserves[0].currency.symbol}{' '}
                    <span className="text-gray-600 dark:text-slate-400">({formatUSD(fiatValues[0])})</span>
                  </div>
                </div>
              </List.KeyValue>
            ) : (
              <List.KeyValue skeleton />
            )}
            {!isReservesLoading && reserves ? (
              <List.KeyValue flex title={`${reserves[1].currency.symbol}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Currency.Icon currency={reserves[1].currency} width={18} height={18} />
                    {reserves[1].toSignificant(4)} {reserves[1].currency.symbol}{' '}
                    <span className="text-gray-600 dark:text-slate-400">({formatUSD(fiatValues[1])})</span>
                  </div>
                </div>
              </List.KeyValue>
            ) : (
              <List.KeyValue skeleton />
            )}
          </List.Control>
        </List>
        <List className="!pt-0">
          <div className="flex items-center justify-between">
            <List.Label>Rewards</List.Label>
            <List.Label>per day</List.Label>
          </div>
          <List.Control>
            {poolStats && poolStats.incentives.length > 0 ? (
              poolStats.incentives.map((el) => (
                <List.KeyValue key={el.id} flex title={`${el.reward.currency.symbol}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={el.reward.currency} width={18} height={18} />
                      {el.reward.toSignificant(4)} {el.reward.currency.symbol}{' '}
                      <span className="text-gray-600 dark:text-slate-400">
                        ({formatUSD(fiatValuesIncentives.reduce((a, b) => a + b, 0))})
                      </span>
                    </div>
                  </div>
                </List.KeyValue>
              ))
            ) : (
              <div className="flex items-center justify-center p-6 text-xs font-normal text-center text-gray-500 dark:text-slate-500">
                This pool only emits fee rewards.
              </div>
            )}
          </List.Control>
        </List>
        <List className="!pt-0 !gap-2">
          <div className="flex">
            <RadioGroup value={granularity} onChange={setGranularity} className="flex gap-2">
              <RadioGroup.Option
                value={Granularity.Day}
                as={Toggle}
                size="xs"
                pressed={granularity === Granularity.Day}
              >
                1D
              </RadioGroup.Option>
              <RadioGroup.Option
                value={Granularity.Week}
                as={Toggle}
                pressed={granularity === Granularity.Week}
                size="xs"
              >
                1W
              </RadioGroup.Option>
            </RadioGroup>
          </div>
          <List.Control>
            {poolStats ? (
              <List.KeyValue flex title="Volume">
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
              </List.KeyValue>
            ) : (
              <List.KeyValue skeleton />
            )}
            {poolStats ? (
              <List.KeyValue flex title="Fees">
                <span className="flex items-center gap-2">
                  {formatUSD(granularity === Granularity.Day ? poolStats.fees1d : poolStats.fees1w)}
                </span>
              </List.KeyValue>
            ) : (
              <List.KeyValue skeleton />
            )}
          </List.Control>
        </List>
      </div>
    </div>
  )
}

export { PoolPageV3 }
