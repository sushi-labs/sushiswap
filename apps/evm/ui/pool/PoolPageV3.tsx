import { RadioGroup } from '@headlessui/react'
import { Bars3BottomLeftIcon, ChartBarIcon, FunnelIcon } from '@heroicons/react/24/solid'
import { ArrowLeftIcon } from '@heroicons/react-v1/outline'
import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { SplashController } from '@sushiswap/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'
import { IconButton } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { isSushiSwapV3ChainId, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { isAddress } from 'ethers/lib/utils'
import { unwrapToken } from 'lib/functions'
import { useTokenAmountDollarValues } from 'lib/hooks'
import { useSearchParams } from 'next/navigation'
import React, { FC, useMemo, useState } from 'react'
import { z } from 'zod'

import Page from '../../app/pool/position/[id]/page'
import { ContentBlock } from './AddPage/ContentBlock'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { ConcentratedLiquidityWidget } from './ConcentratedLiquidityWidget'
import { PoolHeader } from './future/PoolHeader'
import { SelectPricesWidget } from './NewPositionSection'
import { PoolTransactionsV3 } from './PoolSection'
import { PoolChartV3 } from './PoolSection/PoolChart/PoolChartV3'
import { PoolsFiltersProvider } from './PoolsFiltersProvider'
import { ConcentratedPositionsTable } from './PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'

enum Granularity {
  Day,
  Week,
}

const PoolPageV3: FC<{ id: string; positionId?: string }> = ({ id, positionId }) => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Pool id={id} positionId={positionId} />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  id: z
    .string()
    .refine((val) => val.includes('%3A'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split('%3A')
      return [+chainId, poolId] as [SushiSwapV3ChainId, string]
    })
    .refine(([chainId]) => isSushiSwapV3ChainId(chainId), {
      message: 'ChainId not supported.',
    })
    .refine(([, poolId]) => isAddress(poolId), {
      message: 'PoolId not supported.',
    }),
  activeTab: z.nullable(z.string()),
})

enum SelectedTab {
  Manage,
  Analytics,
  Transactions,
}

const Pool: FC<{ id: string; positionId?: string }> = ({ id, positionId: _positionId }) => {
  const { address } = useAccount()
  const searchParams = useSearchParams()!

  const {
    id: [chainId, poolAddress],
  } = queryParamsSchema.parse({ id, activeTab: searchParams.get('activeTab') })

  const [invertTokens, setInvertTokens] = useState(false)
  const [positionId, setPositionId] = useState<number | undefined>(Number(_positionId))
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.Manage)

  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address: poolAddress })
  const { data: pool, isLoading } = useConcentratedLiquidityPool({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const { data: reserves, isLoading: isReservesLoading } = useConcentratedLiquidityPoolReserves({ pool, chainId })
  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })
  const incentiveAmounts = useMemo(() => poolStats?.incentives.map((el) => el.reward), [poolStats?.incentives])
  const fiatValuesIncentives = useTokenAmountDollarValues({ chainId, amounts: incentiveAmounts })

  const [_token0, _token1] = useMemo(() => {
    const tokens = [
      poolStats?.token0 ? unwrapToken(poolStats.token0) : undefined,
      poolStats?.token1 ? unwrapToken(poolStats.token1) : undefined,
    ]

    return invertTokens ? tokens.reverse() : tokens
  }, [invertTokens, poolStats?.token0, poolStats?.token1])

  return (
    <>
      <div className="flex flex-col gap-2">
        <PoolHeader
          title="Pool "
          isLoading={isLoading}
          chainId={chainId}
          pool={pool}
          apy={{ rewards: poolStats?.incentiveApr, fees: poolStats?.feeApr1d }}
        />
        <RadioGroup value={tab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
          <RadioGroup.Option
            value={SelectedTab.Manage}
            as={Button}
            icon={FunnelIcon}
            variant={tab === SelectedTab.Manage ? 'secondary' : 'ghost'}
          >
            Manage
          </RadioGroup.Option>
          <RadioGroup.Option
            value={SelectedTab.Analytics}
            as={Button}
            icon={ChartBarIcon}
            variant={tab === SelectedTab.Analytics ? 'secondary' : 'ghost'}
          >
            Analytics
          </RadioGroup.Option>
          <RadioGroup.Option
            value={SelectedTab.Transactions}
            as={Button}
            icon={Bars3BottomLeftIcon}
            variant={tab === SelectedTab.Transactions ? 'secondary' : 'ghost'}
          >
            Transactions
          </RadioGroup.Option>
        </RadioGroup>
      </div>
      <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-6 h-px" />
      <div className={tab === SelectedTab.Manage ? 'block' : 'hidden'}>
        {positionId ? (
          <>
            <div className="flex items-center gap-4">
              <IconButton size="sm" icon={ArrowLeftIcon} onClick={() => setPositionId(undefined)} name="Back" />
              <span className="text-sm font-medium text-secondary-foreground">Go back to overview</span>
            </div>
            <Page params={{ id: `${chainId}%3A${positionId}` }} />
          </>
        ) : (
          <>
            <Tabs className="w-full" defaultValue="add">
              <TabsList className="!flex">
                <TabsTrigger value="add" className="flex flex-1">
                  My positions
                </TabsTrigger>
                <TabsTrigger value="remove" className="flex flex-1">
                  New position
                </TabsTrigger>
              </TabsList>
              <TabsContent value="add" className="mt-6">
                <PoolsFiltersProvider>
                  <ConcentratedPositionsTable
                    poolId={poolAddress}
                    onRowClick={(row) => setPositionId(Number(row.original.tokenId.toString()))}
                  />
                </PoolsFiltersProvider>
              </TabsContent>
              <TabsContent value="remove" className="mt-6">
                <div className="grid gap-10 lg:grid-cols-2">
                  <div className="flex">
                    <SelectPricesWidget
                      chainId={chainId}
                      token0={_token0}
                      token1={_token1}
                      feeAmount={poolStats?.feeAmount}
                      tokenId={undefined}
                      switchTokens={() => setInvertTokens((prev) => !prev)}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <ContentBlock
                      title={
                        <>
                          How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to
                          provide?
                        </>
                      }
                    >
                      <ConcentratedLiquidityWidget
                        chainId={chainId}
                        account={address}
                        token0={_token0}
                        token1={_token1}
                        feeAmount={poolStats?.feeAmount}
                        tokensLoading={false}
                        existingPosition={undefined}
                        tokenId={undefined}
                        successLink={`/pools/${chainId}:${poolAddress}?activeTab=myPositions`}
                      />
                    </ContentBlock>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <div className={tab === SelectedTab.Analytics ? 'block' : 'hidden'}>
        <PoolChartV3 address={poolAddress} chainId={chainId} />
        <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-6 h-px" />
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  poolStats.incentives.map((el, i) => (
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
              </List.Control>
            </List>
          </div>
        </div>
      </div>
      <div className={tab === SelectedTab.Transactions ? 'block' : 'hidden'}>
        <PoolTransactionsV3 pool={pool} poolId={poolAddress} />
      </div>
    </>
  )
}

export { PoolPageV3 }
