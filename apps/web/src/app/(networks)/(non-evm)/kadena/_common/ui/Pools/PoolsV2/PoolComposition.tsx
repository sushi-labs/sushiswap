'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
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
import { type FC, type ReactNode, forwardRef, useMemo } from 'react'
import { formatUSD } from 'sushi/format'
import type { PoolByIdResponse } from '~kadena/_common/types/get-pool-by-id'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { Icon } from '../../General/Icon'
import { usePoolState } from '../pool-provider'

interface PoolCompositionProps {
  pool: PoolByIdResponse | undefined
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const { token0, token1 } = usePoolState()

  const token0Price = '.32'
  const token1Price = '.32'
  const reserve0USD = Number(pool?.reserve0) * Number(token0Price)
  const reserve1USD = Number(pool?.reserve1) * Number(token1Price)
  const reserveUSD = reserve0USD + reserve1USD

  const isLoading = !reserve0USD || !reserve1USD || !reserveUSD

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
            amount={pool?.reserve0}
            currency={token0}
            fiatValue={formatUSD(reserve0USD)}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={pool?.reserve1}
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
  amount?: string
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
      console.log('currency', currency)
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
