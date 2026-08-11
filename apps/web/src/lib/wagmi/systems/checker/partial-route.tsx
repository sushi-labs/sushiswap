'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  type ButtonProps,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { useEffect, useState } from 'react'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'

type PartialRouteProps = ButtonProps & {
  trade:
    | Pick<UseEvmTradeReturn | UseSvmTradeReturn, 'status' | 'amountIn'>
    | undefined
  setSwapAmount: (swapAmount: string) => void
  canContinue?: boolean
  onAccepted: () => void
}

function PartialRoute({
  trade,
  setSwapAmount,
  canContinue = true,
  onAccepted,
  fullWidth = true,
  size = 'xl',
  children,
  ...props
}: PartialRouteProps) {
  const [acceptedAmount, setAcceptedAmount] = useState<string>()

  useEffect(() => {
    if (!acceptedAmount || !trade) return

    const amountIn = trade.amountIn?.toString()

    if (trade.status === 'Partial') {
      if (amountIn !== acceptedAmount) setAcceptedAmount(undefined)
      return
    }

    if (
      trade.status === 'Success' &&
      amountIn === acceptedAmount &&
      canContinue
    ) {
      setAcceptedAmount(undefined)
      onAccepted()
      return
    }

    if (trade.status !== 'Success' || amountIn !== acceptedAmount) {
      setAcceptedAmount(undefined)
    }
  }, [acceptedAmount, canContinue, onAccepted, trade])

  return trade?.status === 'Partial' ? (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        id="partial-route-checker"
        fullWidth={fullWidth}
        size={size}
        {...props}
        onClick={() => {
          if (!trade.amountIn) return

          const amountIn = trade.amountIn.toString()
          setAcceptedAmount(amountIn)
          setSwapAmount(amountIn)
        }}
      >
        Accept New Input and Swap
        <HoverCardTrigger>
          <QuestionMarkCircleIcon width={16} height={16} />
        </HoverCardTrigger>
      </Button>
      <HoverCardContent className="max-w-[320px] text-xs">
        {`The route for the full input amount cannot be made so we've adjusted
        the input to the maximum amount that can be completed.`}
      </HoverCardContent>
    </HoverCard>
  ) : (
    <>{children}</>
  )
}

export { type PartialRouteProps, PartialRoute }
