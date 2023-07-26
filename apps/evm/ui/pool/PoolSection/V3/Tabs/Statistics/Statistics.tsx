import { RadioGroup } from '@headlessui/react'
import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future'
import { useTokenAmountDollarValues } from 'lib/hooks'
import React, { FC, useMemo, useState } from 'react'

import { Charts } from './Charts'
import { Transactions } from './Transactions'

enum Granularity {
  Day = 'Day',
  Week = 'Week',
}

interface StatisticsProps {
  address: string
  chainId: SushiSwapV3ChainId
}

export const Statistics: FC<StatisticsProps> = ({ address, chainId }) => {
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
    <>
      <div>
        <div className="grid md:grid-cols-[auto_404px] gap-10">
          <Charts address={address} chainId={chainId} />
          <div className="flex flex-col gap-6">
            <List className="!pt-0 !gap-2">
              <div className="flex justify-end">
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
                          poolStats[granularity === Granularity.Week ? 'volumeChange1w' : 'volumeChange1d'].toFixed(
                            2
                          ) === '0.00'
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

                {/* {poolStats ? (
          <List.KeyValue flex title="Fees">
            <span className="flex items-center gap-2">
              {formatUSD(granularity === Granularity.Day ? poolStats.fees1d : poolStats.fees1w)}
              <span
                className={
                  change1d === 0
                    ? 'text-gray-600 dark:text-slate-400'
                    : change1d > 0
                    ? 'text-green'
                    : 'text-red'
                }
              >
                (0.00%)
              </span>
            </span>
          </List.KeyValue>
        ) : (
          <List.KeyValue skeleton />
        )}
        {poolStats ? (
          <List.KeyValue flex title="Volume">
            <span className="flex items-center gap-2">
              {formatUSD(granularity === Granularity.Week ? poolStats.volume1w : poolStats.volume1d)}
              <span
                className={
                  change1w === 0
                    ? 'text-gray-600 dark:text-slate-400'
                    : change1d > 0
                    ? 'text-green'
                    : 'text-red'
                }
              >
                (0.00%)
              </span>
            </span>
          </List.KeyValue>
        ) : (
          <List.KeyValue skeleton />
        )} */}
              </List.Control>
            </List>
            <List>
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
            <List>
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
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
      <Transactions pool={pool} poolId={address} />
    </>
  )
}
