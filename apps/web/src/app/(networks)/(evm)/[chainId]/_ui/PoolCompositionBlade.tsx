'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  Switch,
  classNames,
} from '@sushiswap/ui'
import { CardItem } from '@sushiswap/ui'
import { USDIcon } from '@sushiswap/ui/icons/USD'
import { type FC, useMemo } from 'react'
import { getPoolAssets } from 'src/lib/pool/blade/utils'
import { Amount, formatUSD } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { Wrapper } from '../[trade]/_ui/swap/trade/wrapper'

interface PoolCompositionBladeProps {
  pool: BladePool
  showStableTypes: boolean
  setShowStableTypes: (value: boolean) => void
}

export const PoolCompositionBlade: FC<PoolCompositionBladeProps> = ({
  pool,
  showStableTypes,
  setShowStableTypes,
}) => {
  // const amounts = useMemo(() => {
  //   const stables = STABLES[pool?.chainId] ?? []

  //   const parsed = pool?.tokens.map((t: BladePool['tokens'][number]) => {
  //     const token = new EvmToken({
  //       chainId: pool?.chainId,
  //       address: t?.token.address as EvmAddress,
  //       decimals: t?.token.decimals,
  //       symbol: t?.token.symbol,
  //       name: t?.token.name,
  //     })

  //     return {
  //       token,
  //       amount: new Amount(
  //         token,
  //         BigInt(Math.floor(t?.liquidityUSD * 10 ** t?.token.decimals)),
  //       ),
  //       fiatValue: t?.liquidityUSD,
  //     }
  //   })

  //   if (showStableTypes) {
  //     return parsed
  //   }

  //   const stablesOnly = parsed?.filter(({ token }) =>
  //     stables.some((s) => s.isSame(token)),
  //   )

  //   const groupedUSD = stablesOnly?.reduce(
  //     (acc, curr) => acc + curr.fiatValue,
  //     0,
  //   )

  //   const nonStable = parsed?.find(
  //     ({ token }) => !stables.some((s) => s.isSame(token)),
  //   )

  //   return [
  //     {
  //       isUSDGroup: true as const,
  //       amount: groupedUSD?.toFixed(2),
  //       fiatValue: groupedUSD,
  //     },
  //     ...(nonStable ? [nonStable] : []),
  //   ]
  // }, [pool, showStableTypes])

  const assets = useMemo(() => {
    return getPoolAssets(pool, { showStableTypes }).filter(
      (asset) => asset.targetWeight > 0,
    )
  }, [pool, showStableTypes])

  const { data: prices, isLoading: isPricesLoading } = usePrices({
    chainId: pool?.chainId,
  })

  const tvl = useMemo(() => {
    return pool?.tokens?.reduce((acc, t) => acc + t?.liquidityUSD, 0)
  }, [pool])

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex !flex-row justify-between items-center lg:!items-start lg:!flex-col gap-2">
        <CardTitle className="text-slate-900 dark:lg:!text-slate-500 dark:!text-slate-100">
          TVL
        </CardTitle>

        <CardDescription className="!mt-0 font-bold lg:font-medium text-sm  lg:!text-2xl flex items-center">
          {formatUSD(tvl)}{' '}
          <span
            className={classNames(
              'text-sm lg:text-base font-medium',
              pool?.liquidityUSDChange1d > 0 ? 'text-green' : 'text-red',
            )}
          >
            ({pool?.liquidityUSDChange1d.toFixed(2)}%)
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          <div className="hidden justify-between items-center lg:flex">
            <span className="text-base text-gray-500 lg:flex-row dark:text-slate-500">
              Show stablecoin types
            </span>
            <Switch
              checked={showStableTypes}
              onCheckedChange={setShowStableTypes}
            />
          </div>

          {assets.map((asset) => {
            if ('stablecoin' in asset) {
              return (
                <USDGroupedAmountItem
                  key="usd-group"
                  amount={asset.liquidityUSD.toString()}
                  fiatValue={asset.liquidityUSD}
                />
              )
            }

            return (
              <CardCurrencyAmountItem
                isLoading={isPricesLoading}
                key={asset.token.id}
                amount={Amount.tryFromHuman(
                  asset.token,
                  asset.liquidityUSD /
                    Number(prices?.get?.(asset.token.wrap().address)),
                )}
                fiatValue={formatUSD(asset.liquidityUSD)}
                amountClassName="!font-medium"
              />
            )
          })}
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}

interface USDGroupedAmountItemProps {
  amount: string
  fiatValue: number
}

export const USDGroupedAmountItem: FC<USDGroupedAmountItemProps> = ({
  amount,
  fiatValue,
}) => {
  return (
    <CardItem
      title={
        <div className="flex gap-2 items-center font-medium text-slate-900 dark:text-slate-50">
          <USDIcon className="w-[18px] h-[18px]" /> USD
        </div>
      }
    >
      <span className="flex gap-1 font-semibold">
        {amount}{' '}
        <span className="font-normal text-muted-foreground">
          {formatUSD(fiatValue)}
        </span>
      </span>
    </CardItem>
  )
}
