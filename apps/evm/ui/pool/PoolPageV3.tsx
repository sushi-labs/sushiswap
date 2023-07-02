import { RadioGroup } from '@headlessui/react'
import { CogIcon } from '@heroicons/react-v1/outline'
import { ArrowLeftIcon, ChartBarIcon, PlusIcon, UserCircleIcon } from '@heroicons/react-v1/solid'
import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { List } from '@sushiswap/ui/components/list/List'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { SplashController } from '@sushiswap/ui/components/SplashController'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { isSushiSwapV3ChainId, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { isAddress } from 'ethers/lib/utils'
import { unwrapToken } from 'lib/functions'
import { useTokenAmountDollarValues } from 'lib/hooks'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { FC, useMemo, useState } from 'react'
import { z } from 'zod'

import { ContentBlock } from './AddPage/ContentBlock'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { ConcentratedLiquidityWidget } from './ConcentratedLiquidityWidget'
import { PoolHeader } from './future/PoolHeader'
import { Layout } from './Layout'
import { SelectPricesWidget } from './NewPositionSection'
import { PoolTransactionsV3 } from './PoolSection'
import { PoolChartV3 } from './PoolSection/PoolChart/PoolChartV3'
import { PoolsFiltersProvider } from './PoolsFiltersProvider'
import { ConcentratedPositionsTable } from './PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'

enum Granularity {
  Day,
  Week,
}

const PoolPageV3: FC<{ id: string }> = ({ id }) => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Pool id={id} />
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
  Analytics,
  NewPosition,
  ManagePosition,
}

const Pool: FC<{ id: string }> = ({ id }) => {
  const { address } = useAccount()

  const searchParams = useSearchParams()!

  const {
    id: [chainId, poolAddress],
    activeTab,
  } = queryParamsSchema.parse({ id, activeTab: searchParams.get('activeTab') })

  const [invertTokens, setInvertTokens] = useState(false)
  const [tab, setTab] = useState<SelectedTab>(
    activeTab === 'new'
      ? SelectedTab.NewPosition
      : activeTab === 'myPositions'
      ? SelectedTab.ManagePosition
      : SelectedTab.Analytics
  )

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
    <Layout>
      <div className="flex flex-col gap-2">
        <Link
          className="flex items-center gap-4 mb-2 group"
          href={'/pool'}
          shallow={true}
        >
          <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
            Go back to pools list
          </span>
        </Link>
        <PoolHeader
          title="Pool "
          isLoading={isLoading}
          chainId={chainId}
          pool={pool}
          apy={{ rewards: poolStats?.incentiveApr, fees: poolStats?.feeApr1d }}
        />
        <RadioGroup value={tab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
          <RadioGroup.Option
            value={SelectedTab.Analytics}
            as={Button}
            icon={ChartBarIcon}
            variant="secondary"
            color={tab === SelectedTab.Analytics ? 'blue' : 'default'}
          >
            Statistics
          </RadioGroup.Option>
          <RadioGroup.Option
            value={SelectedTab.NewPosition}
            as={Button}
            icon={PlusIcon}
            variant="secondary"
            color={tab === SelectedTab.NewPosition ? 'blue' : 'default'}
          >
            New position
          </RadioGroup.Option>{' '}
          <RadioGroup.Option
            value={SelectedTab.ManagePosition}
            as={Button}
            icon={UserCircleIcon}
            variant="secondary"
            color={tab === SelectedTab.ManagePosition ? 'blue' : 'default'}
          >
            My Positions
          </RadioGroup.Option>
          <div>
            <SettingsOverlay
              options={{
                slippageTolerance: {
                  storageKey: 'addLiquidity',
                  defaultValue: '0.5',
                  title: 'Add Liquidity Slippage',
                },
              }}
              modules={[SettingsModule.SlippageTolerance]}
            >
              {({ setOpen }) => (
                <Button variant="secondary" onClick={() => setOpen(true)}>
                  <CogIcon width={24} height={24} />
                </Button>
              )}
            </SettingsOverlay>
          </div>
        </RadioGroup>
      </div>
      <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
      <div className={tab === SelectedTab.Analytics ? 'block' : 'hidden'}>
        <div>
          <div className="grid md:grid-cols-[auto_404px] gap-10">
            <PoolChartV3 address={poolAddress} chainId={chainId} />
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
                          (
                          {poolStats[granularity === Granularity.Week ? 'volumeChange1w' : 'volumeChange1d'].toFixed(2)}
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
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
        <PoolTransactionsV3 pool={pool} poolId={poolAddress} />
      </div>
      <div className={tab === SelectedTab.NewPosition ? 'block' : 'hidden'}>
        <div className="grid gap-10 md:grid-cols-2">
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
                  How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to provide?
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
      </div>
      <div className={classNames('', tab === SelectedTab.ManagePosition ? 'block' : 'hidden')}>
        <PoolsFiltersProvider>
          <ConcentratedPositionsTable variant="minimal" poolId={poolAddress} />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export { PoolPageV3 }
