'use client'

import ArrowsRightLeftIcon from '@heroicons/react/24/solid/ArrowsRightLeftIcon'
import { Button, Currency, Label, Message, TextField } from '@sushiswap/ui'
import { formatPriceDifference } from 'src/lib/swap/cow/amounts'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { getCowErrorMessage } from 'src/lib/swap/cow/errors'
import { formatUSD } from 'sushi'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import type { CowLimitPricing } from './use-cow-limit-price'

export function CowLimitPriceField({
  pricing,
}: { pricing: CowLimitPricing }): React.JSX.Element {
  const {
    state: { token0, token1 },
  } = useDerivedStateSimpleSwap<CowLimitChainId>()

  const {
    price,
    inverted,
    preset,
    marketPrice,
    marketSource,
    limitPriceUsd,
    quote,
    belowMarket,
    priceDifference,
    setPrice,
    useMarket,
    invertPrice,
  } = pricing

  const [base, quoteToken] = inverted ? [token1, token0] : [token0, token1]
  const displayedMarketPrice = inverted ? marketPrice?.invert() : marketPrice
  const marketUnavailable = !marketPrice
  const usdEstimate = marketSource === 'usd'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label
            htmlFor="cow-limit-price"
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            When{' '}
            {base ? (
              <>
                1{' '}
                <span className="font-semibold text-foreground">
                  {base.symbol}
                </span>{' '}
                is worth
              </>
            ) : (
              'you select a pair'
            )}
          </Label>
          <span
            className="text-sm text-muted-foreground"
            title={
              usdEstimate
                ? 'Estimated from USD prices; enter an amount for a CoW quote'
                : undefined
            }
          >
            Market{usdEstimate ? ' ≈' : ':'}{' '}
            {displayedMarketPrice
              ? displayedMarketPrice.toSignificant(6)
              : quote.isFetching
                ? 'Loading…'
                : '—'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <TextField
            id="cow-limit-price"
            aria-label={`Limit price (${quoteToken?.symbol ?? 'buy token'} per ${base?.symbol ?? 'sell token'})`}
            type="number"
            variant="naked"
            inputMode="decimal"
            value={price}
            onValueChange={setPrice}
            disabled={!base || !quoteToken}
            placeholder="0.0"
            className="p-0 py-1 !text-3xl font-medium"
            wrapperClassName="min-w-0"
          />
          {quoteToken && (
            <div className="flex shrink-0 items-center gap-1.5 font-medium">
              <Currency.Icon
                currency={quoteToken}
                width={20}
                height={20}
                disableLink
              />
              {quoteToken.symbol}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="shrink-0 px-2"
            aria-label="Invert price"
            title="Invert price"
            disabled={!base || !quoteToken}
            onClick={invertPrice}
          >
            <ArrowsRightLeftIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Always rendered so the row keeps its height while typing. */}
          <div className="flex min-h-6 items-center gap-1.5 text-sm text-muted-foreground">
            {limitPriceUsd !== undefined && (
              <span>≈ {formatUSD(limitPriceUsd)}</span>
            )}
            {priceDifference !== undefined && (
              <span
                className={`text-sm font-medium ${belowMarket ? 'text-red' : 'text-green'}`}
              >
                {formatPriceDifference(priceDifference)} vs{' '}
                {usdEstimate ? 'USD prices' : 'market'}
              </span>
            )}
          </div>
          <div
            className="ml-auto flex gap-2"
            role="group"
            aria-label="Price relative to market"
          >
            {([0, 5, 10, 20] as const).map((percentage) => (
              <Button
                key={percentage}
                type="button"
                variant={preset === percentage ? 'default' : 'secondary'}
                size="xs"
                aria-pressed={preset === percentage}
                disabled={marketUnavailable}
                title={
                  percentage
                    ? `Follow the market, ${percentage}% ${inverted ? 'below' : 'above'}`
                    : 'Follow the market price'
                }
                onClick={() => useMarket(percentage)}
              >
                {percentage
                  ? `${inverted ? '−' : '+'}${percentage}%`
                  : 'Market'}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {quote.isError && (
        <Message variant="destructive" size="sm" role="alert">
          {getCowErrorMessage(quote.error)}{' '}
          <Button variant="link" size="xs" onClick={() => void quote.refetch()}>
            Retry
          </Button>
        </Message>
      )}
      {belowMarket && (
        <Message variant="warning" size="sm">
          {usdEstimate
            ? 'This limit is below the USD market estimate and may fill immediately.'
            : 'This limit may fill immediately because the market already offers a better rate.'}
        </Message>
      )}
    </div>
  )
}
