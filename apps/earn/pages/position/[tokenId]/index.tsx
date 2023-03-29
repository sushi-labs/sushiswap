import React, { FC, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { Layout } from '../../../components'
import Link from 'next/link'
import { ArrowLeftIcon, ChartBarIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { ChainId } from '@sushiswap/chain'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import {
  useConcentratedLiquidityPool,
  useConcentratedLiquidityPositionsFromTokenId,
  useConcentratedPositionInfo,
} from '@sushiswap/wagmi/future/hooks'
import { useToken } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'
import { tryParseAmount } from '@sushiswap/currency'
import { useTokenAmountDollarValues } from '../../../lib/hooks'
import { formatUSD } from '@sushiswap/format'
import { getPriceOrderingFromPositionForUI } from '../../../lib/functions'
import { ConcentratedLiquidityWidget } from '../../../components/ConcentratedLiquidityWidget'
import { useAccount } from 'wagmi'
import { ConcentratedLiquidityProvider } from '../../../components/ConcentratedLiquidityProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { RadioGroup } from '@headlessui/react'

const PositionPage = () => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Position />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  tokenId: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, tokenId] = val.split(':')
      return [+chainId, +tokenId] as [ChainId, number]
    }),
})

enum SelectedTab {
  Analytics,
  DecreaseLiq,
  IncreaseLiq,
}

const Position: FC = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.Analytics)

  const {
    tokenId: [chainId, tokenId],
  } = queryParamsSchema.parse(query)

  const { data: positionDetails } = useConcentratedLiquidityPositionsFromTokenId({
    chainId,
    tokenId,
  })

  const { data: token0, isLoading: token0Loading } = useToken({ chainId, address: positionDetails?.token0 })
  const { data: token1, isLoading: token1Loading } = useToken({ chainId, address: positionDetails?.token1 })
  const { data: pool } = useConcentratedLiquidityPool({
    chainId,
    token0,
    token1,
    feeAmount: positionDetails?.fee,
  })

  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })
  const { priceLower, priceUpper } = getPriceOrderingFromPositionForUI(position)

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!pool || !token0 || !pool.priceOf(token0) || !priceLower || !priceUpper) return [0, 0]
    const min = +priceLower?.toFixed(4)
    const cur = +pool.priceOf(token0)?.toFixed(4)
    const max = +priceUpper?.toFixed(4)

    return [((min - cur) / cur) * 100, ((max - cur) / cur) * 100]
  }, [pool, priceLower, priceUpper, token0])

  return (
    <SWRConfig>
      <Layout>
        <div className="flex flex-col gap-2">
          <Link href="/" shallow={true}>
            <ArrowLeftIcon width={24} className="dark:text-slate-50 text-gray-900" />
          </Link>
          <h1 className="text-3xl font-semibold mt-2 text-gray-900 dark:text-slate-50">Increase Position</h1>
          <h1 className="text-xl font-medium text-gray-600 dark:text-slate-400">
            You{"'"}re adding more liquidity to an existing position
          </h1>
          <RadioGroup value={tab} onChange={setTab} className="flex gap-2 mt-3">
            <RadioGroup.Option
              value={SelectedTab.Analytics}
              as={Button}
              startIcon={<ChartBarIcon width={18} height={18} />}
              variant={tab === SelectedTab.Analytics ? 'outlined' : 'empty'}
              color={tab === SelectedTab.Analytics ? 'blue' : 'default'}
            >
              Analytics
            </RadioGroup.Option>
            <RadioGroup.Option
              value={SelectedTab.IncreaseLiq}
              as={Button}
              startIcon={<PlusIcon width={18} height={18} />}
              variant={tab === SelectedTab.IncreaseLiq ? 'outlined' : 'empty'}
              color={tab === SelectedTab.IncreaseLiq ? 'blue' : 'default'}
            >
              Increase Liquidity
            </RadioGroup.Option>{' '}
            <RadioGroup.Option
              value={SelectedTab.DecreaseLiq}
              as={Button}
              startIcon={<MinusIcon width={18} height={18} />}
              variant={tab === SelectedTab.DecreaseLiq ? 'outlined' : 'empty'}
              color={tab === SelectedTab.DecreaseLiq ? 'blue' : 'default'}
            >
              Decrease Liquidity
            </RadioGroup.Option>
          </RadioGroup>
        </div>
        <div className="h-0.5 w-full bg-gray-900/5 dark:bg-slate-200/5 my-10" />
        <div className="flex gap-6 h-[52px]">
          {pool ? (
            <div className="flex min-w-[44px]">
              <Badge
                className="border-2 border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
                position="bottom-right"
                badgeContent={<NetworkIcon chainId={chainId} width={24} height={24} />}
              >
                <Currency.IconList iconWidth={48} iconHeight={48}>
                  <Currency.Icon currency={pool?.token0} />
                  <Currency.Icon currency={pool?.token1} />
                </Currency.IconList>
              </Badge>
            </div>
          ) : (
            <div className="inline-flex">
              <Skeleton.Circle radius={48} />
              <Skeleton.Circle radius={48} style={{ marginLeft: -48 / 3 }} />
            </div>
          )}

          <div className="flex flex-col flex-grow">
            {pool ? (
              <>
                <h1 className="text-xl text-gray-900 dark:text-slate-50 font-semibold">
                  {pool.token0.symbol}/{pool.token1.symbol}
                </h1>
                <p className="font-medium text-gray-700 dark:text-slate-400">Concentrated • {pool.fee / 10000}%</p>
              </>
            ) : (
              <>
                <Skeleton.Text fontSize="text-xl" className="w-full" />
                <Skeleton.Text fontSize="text-base" className="w-full" />
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-[404px_auto] gap-10">
          <div className="flex flex-col gap-4">
            <List>
              <List.Label>Deposits</List.Label>
              <List.Control>
                {position?.amount0 ? (
                  <List.KeyValue title={`${position?.amount0.currency.symbol}`}>
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={position.amount0.currency} width={18} height={18} />
                      {position.amount0.toSignificant(6)} {position.amount0.currency.symbol}
                    </div>
                  </List.KeyValue>
                ) : (
                  <List.KeyValue skeleton />
                )}
                {position?.amount1 ? (
                  <List.KeyValue title={`${position?.amount1.currency.symbol}`}>
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={position.amount1.currency} width={18} height={18} />
                      {position.amount1.toSignificant(6)} {position.amount1.currency.symbol}
                    </div>
                  </List.KeyValue>
                ) : (
                  <List.KeyValue skeleton />
                )}
              </List.Control>
            </List>
            <List>
              <List.Label>Price Range</List.Label>
              <List.Control className="flex flex-col gap-3 p-4">
                <div className="p-4 inline-flex flex-col gap-2 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                  <div className="flex">
                    <div className="px-2 py-1 flex items-center gap-1 rounded-full bg-yellow/10">
                      <div className="w-3 h-3 bg-yellow rounded-full" />
                      <span className="text-xs text-yellow-900 dark:text-yellow font-medium">Inactive</span>
                    </div>
                  </div>
                  {pool ? (
                    <span className="text-sm text-gray-600 dark:text-slate-200 px-1">
                      <b>{pool.token0Price.toSignificant(6)}</b> {pool.token0.symbol} per {pool.token1.symbol} (
                      {formatUSD(fiatAmountsAsNumber[0])})
                    </span>
                  ) : (
                    <Skeleton.Text fontSize="text-sm" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 flex flex-col gap-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                    <div className="flex">
                      <div className="px-2 py-1 font-medium text-xs gap-1 rounded-full bg-blue/10 text-blue">
                        Min Price
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {priceLower && pool ? (
                        <span className="font-medium">
                          {priceLower?.toSignificant(4)} {pool.token1.symbol}
                        </span>
                      ) : (
                        <Skeleton.Text />
                      )}
                      {priceUpper && pool ? (
                        <span className="text-sm text-gray-500">
                          {formatUSD(fiatAmountsAsNumber[0] * (1 + minPriceDiff / 100))} ({minPriceDiff.toFixed(2)}%)
                        </span>
                      ) : (
                        <Skeleton.Text />
                      )}
                    </div>
                  </div>
                  <div className="p-4 inline-flex flex-col gap-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                    <div className="flex">
                      <div className="px-2 py-1 flex items-center font-medium text-xs gap-1 rounded-full bg-pink/10 text-pink">
                        Min Price
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {priceUpper && pool ? (
                        <span className="font-medium">
                          {priceUpper?.toSignificant(4)} {pool.token1.symbol}
                        </span>
                      ) : (
                        <Skeleton.Text />
                      )}
                      {priceUpper && pool ? (
                        <span className="text-sm text-gray-500">
                          {formatUSD(fiatAmountsAsNumber[0] * (1 + maxPriceDiff / 100))} ({maxPriceDiff.toFixed(2)}%)
                        </span>
                      ) : (
                        <Skeleton.Text />
                      )}
                    </div>
                  </div>
                </div>
              </List.Control>
            </List>
          </div>
          <div className="flex flex-col gap-10 w-full mt-10">
            <div className={tab === SelectedTab.Analytics ? 'block' : 'hidden'}>
              <h1 className="text-5xl">Analytics Here</h1>
            </div>
            <div className={tab === SelectedTab.IncreaseLiq ? 'block' : 'hidden'}>
              <ConcentratedLiquidityWidget
                chainId={chainId}
                account={address}
                token0={token0}
                token1={token1}
                feeAmount={positionDetails?.fee}
                tokensLoading={token0Loading || token1Loading}
                existingPosition={position}
                tokenId={tokenId}
              />
            </div>
            <div className={tab === SelectedTab.DecreaseLiq ? 'block' : 'hidden'}>
              <h1 className="text-5xl">Decrease liq here</h1>
            </div>
          </div>
        </div>
      </Layout>
    </SWRConfig>
  )
}

export default PositionPage
