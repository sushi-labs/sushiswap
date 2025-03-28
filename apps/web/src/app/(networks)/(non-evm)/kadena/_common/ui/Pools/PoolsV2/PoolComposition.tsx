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
import Image from 'next/image'
import { type FC, type ReactNode, forwardRef, useMemo } from 'react'
import { Amount, Token, type Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

interface PoolCompositionProps {
  pool: V2Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const amounts = useMemo(() => {
    const token0 = new Token({
      chainId: pool.chainId,
      address: pool.token0.address,
      decimals: pool.token0.decimals,
      symbol: pool.token0.symbol,
      name: pool.token0.name,
      logoUrl:
        'https://kdswapassets.blob.core.windows.net/public/tokens/K%20Logo%20Dark%20Blue%20Backround.png',
    })

    const token1 = new Token({
      chainId: pool.chainId,
      address: pool.token1.address,
      decimals: pool.token1.decimals,
      symbol: pool.token1.symbol,
      name: pool.token1.name,
      logoUrl:
        'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_48/d_unknown.png/tokens/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg',
    })
    return [
      Amount.fromRawAmount(token0, pool.reserve0),
      Amount.fromRawAmount(token1, pool.reserve1),
    ]
  }, [pool])

  // const fiatValues = useTokenAmountDollarValues({
  //   chainId: pool.chainId,
  //   amounts,
  // })
  const fiatValues = [2.34, 1.2]

  const isLoading = fiatValues.length !== amounts.length

  const [reserve0USD, reserve1USD, reserveUSD] = useMemo(() => {
    if (isLoading) return [0, 0, 0]
    return [fiatValues[0], fiatValues[1], fiatValues[0] + fiatValues[1]]
  }, [isLoading])

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
            amount={amounts[0].toSignificant(6)}
            currency={{
              logoUrl: amounts[0].currency.logoUrl ?? '',
              symbol: amounts[0].currency.symbol ?? '',
            }}
            fiatValue={formatUSD(reserve0USD)}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            currency={{
              logoUrl: amounts[1].currency.logoUrl ?? '',
              symbol: amounts[1].currency.symbol ?? '',
            }}
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
          <span className="flex justify-end w-full text-sm font-medium text-right text-gray-900 truncate dark:text-slate-50">
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
  currency: {
    symbol: string
    logoUrl: string
  }
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
    if (isLoading) {
      return <CardItem ref={ref} skeleton />
    }

    if (amount) {
      return (
        <CardItem
          title={
            <div className="font-medium flex items-center gap-2 text-muted-foreground">
              <span className="relative flex w-[18px] h-[18px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src={currency.logoUrl}
                  alt=""
                  layout="fill"
                  objectFit="contain"
                />
              </span>
              {currency.symbol}
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
