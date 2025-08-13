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
import { type FC, useMemo, useState } from 'react'
import { STABLES } from 'sushi/config'
import { Amount, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { Wrapper } from '../swap/trade/wrapper'

interface PoolCompositionBladeProps {
  pool: BladePool
  showStablesOnly: boolean
  setShowStablesOnly: (value: boolean) => void
}

type TokenEntry = {
  token: Token
  amount: Amount<Token>
  fiatValue: number
}

export const PoolCompositionBlade: FC<PoolCompositionBladeProps> = ({
  pool,
  showStablesOnly,
  setShowStablesOnly,
}) => {
  const amounts = useMemo(() => {
    const stables = STABLES[pool.chainId] ?? []

    const parsed = pool.tokens.map((t: BladePool['tokens'][0]) => {
      const token = new Token({
        chainId: pool.chainId,
        address: t.address,
        decimals: t.decimals,
        symbol: t.symbol,
        name: t.name,
      })

      return {
        token,
        amount: Amount.fromRawAmount(
          token,
          BigInt(Math.floor(t.liquidityUSD * 10 ** t.decimals)),
        ),
        fiatValue: t.liquidityUSD,
      }
    })

    if (showStablesOnly) {
      return parsed
    }

    const stablesOnly = parsed.filter(({ token }) =>
      stables.some((s) => s.equals(token)),
    )

    const groupedUSD = stablesOnly.reduce(
      (acc, curr) => acc + curr.fiatValue,
      0,
    )

    const nonStable = parsed.find(
      ({ token }) => !stables.some((s) => s.equals(token)),
    )

    return [
      {
        isUSDGroup: true as const,
        amount: groupedUSD.toFixed(2),
        fiatValue: groupedUSD,
      },
      ...(nonStable ? [nonStable] : []),
    ]
  }, [pool, showStablesOnly])

  const tvl = useMemo(() => {
    return pool.tokens.reduce((acc, t) => acc + t.liquidityUSD, 0)
  }, [pool])

  return (
    <Wrapper enableBorder className="!p-3 flex flex-col gap-5">
      <CardHeader className="!p-0 flex !flex-row justify-between items-center lg:flex-col gap-1">
        <CardTitle className="text-slate-900 dark:lg:!text-slate-500 dark:!text-slate-100">
          TVL
        </CardTitle>

        <CardDescription className="!mt-0 font-bold lg:font-medium text-sm  lg:!text-2xl flex items-center">
          {formatUSD(tvl)}{' '}
          <span
            className={classNames(
              'text-sm lg:text-base font-medium',
              pool?.liquidityUSD1dChange > 0 ? 'text-green' : 'text-red',
            )}
          >
            ({pool?.liquidityUSD1dChange.toFixed(2)}%)
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
              checked={showStablesOnly}
              onCheckedChange={setShowStablesOnly}
            />
          </div>

          {amounts.map((entry) => {
            if ('isUSDGroup' in entry && entry.isUSDGroup) {
              return (
                <USDGroupedAmountItem
                  key="usd-group"
                  amount={entry.amount}
                  fiatValue={entry.fiatValue}
                />
              )
            }

            const tokenEntry = entry as TokenEntry
            return (
              <CardCurrencyAmountItem
                key={`${tokenEntry.token.chainId}:${tokenEntry.token.address}`}
                isLoading={false}
                amount={tokenEntry.amount}
                fiatValue={formatUSD(tokenEntry.fiatValue)}
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
