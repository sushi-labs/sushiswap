import React, { FC, useMemo, useState } from 'react'
import { SWRConfig } from 'swr'
import { Layout, PoolsFiltersProvider, SelectPricesWidget } from '../../../components'
import Link from 'next/link'
import { ArrowLeftIcon, ChartBarIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { ChainId } from '@sushiswap/chain'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { classNames } from '@sushiswap/ui'
import { Token } from '@sushiswap/currency'
import { ConcentratedLiquidityWidget } from '../../../components/ConcentratedLiquidityWidget'
import { ConcentratedLiquidityProvider } from '../../../components/ConcentratedLiquidityProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { RadioGroup } from '@headlessui/react'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { CogIcon } from '@heroicons/react/outline'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { PoolHeader } from '../../../components/future/PoolHeader'
import { ConcentratedPositionsTable } from '../../../components/PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'
import { ContentBlock } from '../../../components/AddPage/ContentBlock'
import { useAccount } from '@sushiswap/wagmi'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { useTokenAmountDollarValues } from '../../../lib/hooks'
import { formatUSD } from '@sushiswap/format'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'

enum Granularity {
  Day,
  Week,
}

const PoolPage = () => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Pool />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  poolId: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split(':')
      return [+chainId, poolId] as [ChainId, string]
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

  const {
    poolId: [chainId, poolId],
    activeTab,
  } = queryParamsSchema.parse(query)

  const [tab, setTab] = useState<SelectedTab>(
    activeTab === 'new'
      ? SelectedTab.NewPosition
      : activeTab === 'myPositions'
      ? SelectedTab.ManagePosition
      : SelectedTab.Analytics
  )

  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ poolAddress: poolId })
  const [token0, token1, feeAmount] = useMemo(() => {
    if (!poolStats) return [undefined, undefined, undefined]
    return [
      new Token({
        chainId: poolStats.chainId,
        address: poolStats.token0.address,
        decimals: poolStats.token0.decimals,
        name: poolStats.token0.name,
        symbol: poolStats.token0.symbol,
      }),
      new Token({
        chainId: poolStats.chainId,
        address: poolStats.token1.address,
        decimals: poolStats.token1.decimals,
        name: poolStats.token1.name,
        symbol: poolStats.token1.symbol,
      }),
      poolStats.swapFee * 10000,
    ]
  }, [poolStats])

  const { data: pool, isLoading } = useConcentratedLiquidityPool({
    chainId,
    token0,
    token1,
    feeAmount,
  })

  const { data: reserves, isLoading: isReservesLoading } = useConcentratedLiquidityPoolReserves({ pool })
  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })

  return (
    <SWRConfig>
      <Layout>
        <div className="flex flex-col gap-2">
          <Link className="group flex gap-4 items-center mb-2" href="/" shallow={true}>
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
            apy={{ rewards: poolStats?.incentiveApr, fees: poolStats?.feeApr }}
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
                    storageKey: 'removeLiquidity',
                    defaultValue: '0.5',
                    title: 'Remove Liquidity Slippage',
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
          <div className="grid md:grid-cols-[auto_404px] gap-10">
            <div className="w-full h-full">
              <Skeleton.Box className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-6">
              <List className="pt-0 !gap-1">
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
                    <List.KeyValue flex title="Fees">
                      <span className="flex items-center gap-2">
                        {formatUSD(granularity === Granularity.Day ? poolStats.fees1d : poolStats.fees1w)}
                        <span className="text-green">(+0.00%)</span>
                      </span>
                    </List.KeyValue>
                  ) : (
                    <List.KeyValue skeleton />
                  )}
                  {poolStats ? (
                    <List.KeyValue flex title="Volume">
                      <span className="flex items-center gap-2">
                        {formatUSD(granularity === Granularity.Week ? poolStats.volume1d : poolStats.volume1w)}
                        <span className="text-green">(+0.00%)</span>
                      </span>
                    </List.KeyValue>
                  ) : (
                    <List.KeyValue skeleton />
                  )}
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
                  {reserves ? (
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
                    <div className="p-6 flex font-normal justify-center items-center text-xs text-center text-gray-500 dark:text-slate-500">
                      This pool only emits fee rewards.
                    </div>
                  )}
                </List.Control>
              </List>
            </div>
          </div>
        </div>
        <div className={tab === SelectedTab.NewPosition ? 'block' : 'hidden'}>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex">
              <SelectPricesWidget
                chainId={chainId}
                token0={token0}
                token1={token1}
                feeAmount={feeAmount}
                tokenId={undefined}
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
                  token0={token0}
                  token1={token1}
                  feeAmount={feeAmount}
                  tokensLoading={false}
                  existingPosition={undefined}
                  tokenId={undefined}
                />
              </ContentBlock>
            </div>
          </div>
        </div>
        <div className={classNames('', tab === SelectedTab.ManagePosition ? 'block' : 'hidden')}>
          <PoolsFiltersProvider>
            <ConcentratedPositionsTable variant="minimal" />
          </PoolsFiltersProvider>
        </div>
      </Layout>
    </SWRConfig>
  )
}

export default PoolPage
