import React, { FC, useState } from 'react'
import { SWRConfig } from 'swr'
import { Layout, PoolsFiltersProvider, SelectPricesWidget } from '../../../components'
import Link from 'next/link'
import { ArrowLeftIcon, ChartBarIcon, PencilIcon, PlusIcon, UserCircleIcon, UserIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { ChainId } from '@sushiswap/chain'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { useConcentratedLiquidityPool, useConcentratedLiquidityPoolReserves } from '@sushiswap/wagmi/future/hooks'
import { classNames } from '@sushiswap/ui'
import { Native, SUSHI } from '@sushiswap/currency'
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
})

enum SelectedTab {
  Analytics,
  NewPosition,
  ManagePosition,
}

const Pool: FC = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.Analytics)

  const {
    poolId: [chainId, poolId],
  } = queryParamsSchema.parse(query)
  //
  // const { data: tokenIds } = useConcentratedLiquidityPositions({
  //   account: address,
  //   // TODO all supported chainIds
  //   chainIds: [ChainId.ARBITRUM],
  //   select: (data) => {
  //     if (!data) return data
  //     const _data = [...data]
  //     return _data.filter((el) => el.chainId === chainId && el.address === poolId)
  //   },
  // })

  const token0 = Native.onChain(ChainId.ARBITRUM)
  const token1 = SUSHI[ChainId.ARBITRUM]
  const feeAmount = 3000

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
            apy={{ rewards: 12.54, fees: 10.27 }}
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
              <List className="pt-0">
                <List.Control>
                  {pool ? (
                    <List.KeyValue flex title="Fees (1d)">
                      <span className="flex items-center gap-2">
                        {formatUSD(3432)}
                        <span className="text-green">(+3.5%)</span>
                      </span>
                    </List.KeyValue>
                  ) : (
                    <List.KeyValue skeleton />
                  )}
                  {pool ? (
                    <List.KeyValue flex title="Transactions (1d)">
                      <span className="flex items-center gap-2">
                        {formatUSD(341334)}
                        <span className="text-red">(-2.5%)</span>
                      </span>
                    </List.KeyValue>
                  ) : (
                    <List.KeyValue skeleton />
                  )}
                  {pool ? (
                    <List.KeyValue flex title="Volume (1d)">
                      <span className="flex items-center gap-2">
                        {formatUSD(135134)}
                        <span className="text-green">(+5.5%)</span>
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
