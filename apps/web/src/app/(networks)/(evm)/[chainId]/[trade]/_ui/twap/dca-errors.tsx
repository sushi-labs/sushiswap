import { Collapsible, Message } from '@sushiswap/ui'
import { useMemo } from 'react'
import { getNetworkName } from 'src/lib/network'
import { formatUSD } from 'sushi'
import {
  useDerivedStateTwap,
  useTwapTradeErrors,
} from './derivedstate-twap-provider'

export const DCAErrors = () => {
  const {
    minTradeSizeError,
    minFillDelayError,
    maxFillDelayError,
    chainMismatchError,
    minTradeSizeAmount,
  } = useTwapTradeErrors()
  const {
    state: { chainId, swapAmountString },
  } = useDerivedStateTwap()

  const errorMessages = useMemo(() => {
    const messages: { title: string; detail?: string }[] = []
    if (minTradeSizeError && swapAmountString) {
      messages.push({
        title: 'Inadequate Trade Size',
        detail: `Minimum trade amount on ${getNetworkName(chainId)} is ${formatUSD(minTradeSizeAmount)}`,
      })
    }
    if (minFillDelayError) {
      messages.push({ title: 'Trade Interval Below Limit' })
    }
    if (maxFillDelayError) {
      messages.push({ title: 'Trade Interval Exceeds Limit' })
    }
    if (chainMismatchError) {
      messages.push({
        title: 'Chain Mismatch',
        detail: 'Tokens must be on the same chain to trade.',
      })
    }
    return messages
  }, [
    minTradeSizeError,
    minFillDelayError,
    maxFillDelayError,
    chainMismatchError,
    minTradeSizeAmount,
    chainId,
    swapAmountString,
  ])

  if (!errorMessages?.length) return null

  return (
    <Collapsible open={true} className="w-full flex flex-col gap-2">
      {errorMessages.map(({ title, detail }, index) => (
        <Message
          key={index}
          className="rounded-xl !bg-[#DE58521A] !text-[#DE5852] text-sm flex flex-col gap-1 items-start !p-4 min-h-[50px]"
          variant="destructive"
        >
          <div className="font-medium">{title}</div>
          {detail ? <div>{detail}</div> : null}
        </Message>
      ))}
    </Collapsible>
  )
}
