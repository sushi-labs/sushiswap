'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { type ReactNode, forwardRef } from 'react'
import { formatUSD } from 'sushi/format'
import { useKdaPrice } from '~kadena/_common/lib/hooks/use-kda-price'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { Icon } from '../../General/Icon'
import { usePoolState } from '../pool-provider'

export const PoolComposition = () => {
  const { token0, token1, reserve0, reserve1 } = usePoolState()
  const { data: priceData, isLoading: isLoadingPrice } = useKdaPrice()
  const token0Price =
    token0?.tokenAddress === 'coin' ? priceData?.priceUsd || 0 : 0
  const token1Price =
    token1?.tokenAddress === 'coin' ? priceData?.priceUsd || 0 : 0

  const reserve0USD = Number(reserve0) * Number(token0Price)
  const reserve1USD = Number(reserve1) * Number(token1Price)
  const reserveUSD = reserve0USD + reserve1USD

  const isLoading = isLoadingPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>
          {isLoading ? <SkeletonText /> : <>{formatUSD(reserveUSD)}</>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={reserve0}
            currency={token0}
            fiatValue={formatUSD(reserve0USD)}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={reserve1}
            currency={token1}
            fiatValue={formatUSD(reserve1USD)}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}

type CardItemProps =
  | (Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
      title: ReactNode
      subtitle?: string
      children?: ReactNode
      skeleton?: never
      flex?: boolean
      className?: string
    })
  | {
      title?: never
      subtitle?: boolean
      children?: never
      skeleton?: boolean
      flex?: boolean
      className?: string
    }

const CardItem = forwardRef<HTMLDivElement, CardItemProps>(
  ({ skeleton, flex, subtitle, title, children, className, ...props }, ref) => {
    if (skeleton) {
      return (
        <div ref={ref} className="grid grid-cols-2 gap-2" {...props}>
          <div className="flex flex-col gap-0.5">
            <SkeletonText fontSize="sm" />
            {subtitle && <SkeletonText fontSize="xs" />}
          </div>
          <div className="flex justify-end">
            <SkeletonText fontSize="sm" />
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={`${flex ? 'flex justify-between items-center' : 'grid grid-cols-2'} gap-2`}
        {...props}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className="flex justify-end">
          <span className="flex justify-end w-full text-sm font-medium text-right text-gray-900 dark:text-slate-50">
            {children}
          </span>
        </div>
      </div>
    )
  },
)
CardItem.displayName = 'CardItem'

interface CardCurrencyAmountItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  amount?: number
  currency?: KadenaToken
  fiatValue?: string
  unwrap?: boolean
}

export const CardCurrencyAmountItem = forwardRef<
  HTMLDivElement,
  CardCurrencyAmountItemProps
>(
  (
    { unwrap = true, isLoading, amount, currency, fiatValue, ...props },
    ref,
  ) => {
    if (isLoading || !currency) {
      return <CardItem ref={ref} skeleton />
    }

    if (amount) {
      return (
        <CardItem
          title={
            <div className="flex items-center gap-2 font-medium text-muted-foreground">
              <Icon currency={currency} height={18} width={18} fontSize={9} />
              {currency.tokenSymbol}
            </div>
          }
          ref={ref}
          {...props}
        >
          <span className="flex gap-1 font-semibold">
            {amount}{' '}
            <span className="font-normal text-gray-400 dark:text-slate-600">
              {fiatValue}
            </span>
          </span>
        </CardItem>
      )
    }

    return null
  },
)
CardCurrencyAmountItem.displayName = 'CardCurrencyAmountItem'
