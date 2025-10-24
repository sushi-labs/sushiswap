import {
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { Bound } from 'src/lib/constants'
import { formatTickPrice } from 'src/lib/functions'
import { type Price, formatNumber, formatPercent } from 'sushi'
import type { EvmCurrency, EvmToken } from 'sushi/evm'

export const MinMaxPrices = ({
  token0,
  token1,
  token0Price,
  token1Price,
  priceLower,
  priceUpper,
  tickAtLimit,
  invert,
  fullRange,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  token0Price: Price<EvmToken, EvmToken> | undefined
  token1Price: Price<EvmToken, EvmToken> | undefined
  priceLower: Price<EvmToken, EvmToken> | undefined
  priceUpper: Price<EvmToken, EvmToken> | undefined
  tickAtLimit: {
    LOWER: boolean | undefined
    UPPER: boolean | undefined
  }
  invert: boolean
  fullRange: boolean
}) => {
  return (
    <div className="flex gap-2 justify-between">
      <div className="flex bg-[#F4F5F6] dark:bg-[#1E293B] flex-col gap-1 p-5 rounded-lg w-full">
        <div className="px-2 py-1 text-xs font-medium rounded-full text-pink bg-pink/10 w-fit">
          Min Price
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="dark:text-pink-100 text-[#374151] uppercase font-medium">
            {fullRange
              ? 0
              : formatNumber(
                  formatTickPrice({
                    price: priceLower,
                    atLimit: tickAtLimit,
                    direction: Bound.LOWER,
                  }) ?? '0',
                )}{' '}
            {invert ? token1.symbol : token0.symbol}
          </p>
          <PercentageHoverCard
            type="min"
            symbol={invert ? token0.symbol : token1.symbol}
            percentage={
              priceLower && token0Price && token1Price
                ? formatPercent(
                    priceLower
                      .sub(invert ? token0Price : token1Price)
                      .div(invert ? token0Price : token1Price)
                      .toSignificant(4),
                  )
                : '+0.000%'
            }
          />
        </div>
      </div>
      <div className="flex bg-[#F4F5F6] dark:bg-[#1E293B] flex-col gap-1 p-5 rounded-lg w-full">
        <div className="px-2 py-1 text-xs font-medium rounded-full text-blue-550 bg-blue-550/10 w-fit">
          Max Price
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="dark:text-pink-100 text-[#374151] uppercase font-medium">
            {fullRange
              ? '∞'
              : formatNumber(
                  formatTickPrice({
                    price: priceUpper,
                    atLimit: tickAtLimit,
                    direction: Bound.UPPER,
                  }) ?? '0',
                )}{' '}
            {invert ? token1.symbol : token0.symbol}
          </p>
          <PercentageHoverCard
            type="max"
            symbol={invert ? token1.symbol : token0.symbol}
            percentage={
              token1Price && token0Price
                ? formatPercent(
                    priceUpper
                      ?.sub(invert ? token0Price : token1Price)
                      .div(invert ? token0Price : token1Price)
                      .toSignificant(4),
                  )
                : '+0.000%'
            }
          />
        </div>
      </div>
    </div>
  )
}

const PercentageHoverCard = ({
  type,
  symbol,
  percentage,
}: {
  type: 'min' | 'max'
  symbol: string
  percentage: string
}) => {
  return (
    <HoverCard closeDelay={0} openDelay={0}>
      <HoverCardTrigger asChild>
        <span className="pt-0.5 underline text-slate-700 text-sm dark:text-pink-200">
          ({percentage})
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        align={type === 'min' ? 'start' : 'end'}
        className="!p-0 max-w-[320px]"
      >
        <CardHeader>
          <CardTitle>{type === 'min' ? 'Min.' : 'Max'} Price</CardTitle>
          <CardDescription>
            If the current price moves {type === 'min' ? 'down' : 'up'}{' '}
            {percentage} from the current price, your position will be 100%{' '}
            {symbol}
          </CardDescription>
        </CardHeader>
      </HoverCardContent>
    </HoverCard>
  )
}
