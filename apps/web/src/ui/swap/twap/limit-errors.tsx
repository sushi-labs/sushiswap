import { Collapsible } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  useDerivedStateTwap,
  useTwapTradeErrors,
} from './derivedstate-twap-provider'
import { ErrorMessage } from './error-message'
export const LimitErrors = () => {
  const { minTradeSizeError, minFillDelayError, maxFillDelayError } =
    useTwapTradeErrors()
  const {
    state: { token0, token1, percentDiff, isLimitPriceInverted },
  } = useDerivedStateTwap()

  const errorMessages = useMemo(() => {
    const messages: { title: string; detail?: string }[] = []
    if (typeof percentDiff !== 'undefined' && percentDiff < 0) {
      messages.push({
        title: `Selling ${!isLimitPriceInverted ? token0?.symbol : token1?.symbol} below market price`,
        detail: `Your limit price is ${percentDiff.toFixed(
          2,
        )}% lower than market. Adjust you limit price to proceed.`,
      })
    }
    if (minTradeSizeError) {
      messages.push({ title: 'Inadequate Trade Size' })
    }
    if (minFillDelayError) {
      messages.push({ title: 'Trade Interval Below Limit' })
    }
    if (maxFillDelayError) {
      messages.push({ title: 'Trade Interval Exceeds Limit' })
    }
    return messages
  }, [
    percentDiff,
    isLimitPriceInverted,
    token0,
    token1,
    minTradeSizeError,
    minFillDelayError,
    maxFillDelayError,
  ])

  if (!errorMessages?.length) return null

  return (
    <Collapsible open={true} className="w-full flex flex-col gap-2">
      {errorMessages.map(({ title, detail }, index) => (
        <ErrorMessage key={index} title={title} detail={detail} />
      ))}
    </Collapsible>
  )
}
