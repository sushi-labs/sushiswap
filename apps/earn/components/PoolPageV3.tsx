import React, { FC, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ChartBarIcon, ChartPieIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { RadioGroup } from '@headlessui/react'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { CogIcon } from '@heroicons/react/outline'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { useAccount } from '@sushiswap/wagmi'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { isSushiSwapV3ChainId, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { isAddress } from 'ethers/lib/utils'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { usePoolGraphData, useTokenAmountDollarValues } from '../lib/hooks'
import { usePreviousRoute } from './HistoryProvider'
import { unwrapToken } from '../lib/functions'
import { Layout } from './Layout'
import { PoolHeader } from './future/PoolHeader'
import { SelectPricesWidget } from './NewPositionSection'
import { ContentBlock } from './AddPage/ContentBlock'
import { ConcentratedLiquidityWidget } from './ConcentratedLiquidityWidget'
import { PoolsFiltersProvider } from './PoolsFiltersProvider'
import { ConcentratedPositionsTable } from './PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'
import { PoolTransactionsV3 } from './PoolSection'
import { PoolDepthWidget } from './PoolSection/V3/PoolDepthWidget'
import { PoolChartV3 } from './PoolSection/PoolChart/PoolChartV3'

enum Granularity {
  Day,
  Week,
}

const PoolPageV3 = () => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Pool />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  id: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split(':')
      return [+chainId, poolId] as [SushiSwapV3ChainId, string]
    })
    .refine(([chainId]) => isSushiSwapV3ChainId(chainId), {
      message: 'ChainId not supported.',
    })
    .refine(([, poolId]) => isAddress(poolId), {
      message: 'PoolId not supported.',
    }),
  activeTab: z.string().optional(),
})

enum SelectedTab {
  Analytics,
  NewPosition,
  ManagePosition,
}

const Pool: FC = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const { path, basePath } = usePreviousRoute()

  const {
    id: [chainId, poolAddress],
    activeTab,
  } = queryParamsSchema.parse(query)

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

  const [_token0, _token1] = useMemo(
    () => {
      const tokens = [
        poolStats?.token0 ? unwrapToken(poolStats.token0) : undefined,
        poolStats?.token1 ? unwrapToken(poolStats.token1) : undefined,
      ]

      return invertTokens ? tokens.reverse() : tokens
    },
    [invertTokens, poolStats?.token0, poolStats?.token1]
  )

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <Link
          className="flex items-center gap-4 mb-2 group"
          href={{
            pathname: '/',
            ...(basePath === '/pools' && path?.includes('categories') && { query: path.replace('/?&', '') }),
          }}
          shallow={true}
        >
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
          />
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
            startIcon={<ChartBarIcon width={18} height={18} />}
            variant="outlined"
            color={tab === SelectedTab.Analytics ? 'blue' : 'default'}
          >
            Statistics
          </RadioGroup.Option>
          <RadioGroup.Option
            value={SelectedTab.NewPosition}
            as={Button}
            startIcon={<PlusIcon width={18} height={18} />}
            variant="outlined"
            color={tab === SelectedTab.NewPosition ? 'blue' : 'default'}
          >
            New position
          </RadioGroup.Option>{' '}
          <RadioGroup.Option
            value={SelectedTab.ManagePosition}
            as={Button}
            startIcon={<UserCircleIcon width={18} height={18} />}
            variant="outlined"
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
                <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
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
              <List className="!pt-0 !gap-1">
                <List.Label className="flex justify-end">
                  <RadioGroup value={granularity} onChange={setGranularity} className="flex">
                    <RadioGroup.Option
                      value={Granularity.Day}
                      as={Button}
                      size="xs"
                      color={granularity === Granularity.Day ? 'blue' : 'default'}
                      variant="empty"
                      className="!h-[24px] font-bold"
                    >
                      1D
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      value={Granularity.Week}
                      as={Button}
                      color={granularity === Granularity.Week ? 'blue' : 'default'}
                      size="xs"
                      variant="empty"
                      className="!h-[24px] font-bold"
                    >
                      1W
                    </RadioGroup.Option>
                  </RadioGroup>
                </List.Label>
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
