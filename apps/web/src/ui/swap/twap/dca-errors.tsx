import { Collapsible } from '@sushiswap/ui'
import { useTwapTradeErrors } from './derivedstate-twap-provider'

export const DCAErrors = () => {
  const { minTradeSizeError, minFillDelayError, maxFillDelayError } =
    useTwapTradeErrors()
  // {minTradeSizeError
  //       ? 'Inadequate Trade Size'
  //       : minFillDelayError
  //         ? 'Trade Interval Below Limit'
  //         : maxFillDelayError
  //           ? 'Trade Interval Exceeds Limit'
  //           : ''}
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
      <div className="rounded-xl bg-red/10 text-red font-medium text-sm flex items-center p-4 h-[50px]">
        {errorMessage}
      </div>
    </Collapsible>
  )
}
