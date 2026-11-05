'use client'

import { Button, Label, Message, TextField } from '@sushiswap/ui'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { getCowErrorMessage } from 'src/lib/swap/cow/errors'
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
    marketPrice,
    quote,
    belowMarket,
    setPrice,
    useMarket,
    invertPrice,
  } = pricing

  const [base, quoteToken] = inverted ? [token1, token0] : [token0, token1]

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="cow-limit-price">
        Limit price ({quoteToken?.symbol} per {base?.symbol})
      </Label>
      <TextField
        id="cow-limit-price"
        type="number"
        variant="outline"
        inputMode="decimal"
        value={price}
        onValueChange={setPrice}
        placeholder="0.0"
        className="text-lg"
      />
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!marketPrice || quote.isError}
          onClick={useMarket}
        >
          Use market price
        </Button>
        <Button variant="ghost" size="sm" onClick={invertPrice}>
          Invert price
        </Button>
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
          Your limit is below the current market price and may fill immediately.
        </Message>
      )}
    </div>
  )
}
