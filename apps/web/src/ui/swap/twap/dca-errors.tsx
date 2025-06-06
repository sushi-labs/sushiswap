import { Collapsible } from '@sushiswap/ui'
import { useTwapTradeErrors } from './derivedstate-twap-provider'
import { ErrorMessage } from './error-message'

export const DCAErrors = () => {
  const { minTradeSizeError, minFillDelayError, maxFillDelayError } =
    useTwapTradeErrors()

  const errorMessage = minTradeSizeError
    ? 'Inadequate Trade Size'
    : minFillDelayError
      ? 'Trade Interval Below Limit'
      : maxFillDelayError
        ? 'Trade Interval Exceeds Limit'
        : ''
  if (!errorMessage) return null

  return (
    <Collapsible open={true} className="w-full">
      <ErrorMessage title={errorMessage} detail={''} />
    </Collapsible>
  )
}
