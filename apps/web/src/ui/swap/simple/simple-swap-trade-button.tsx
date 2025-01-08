'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { FC } from 'react'
import { UseTradeReturn } from 'src/lib/hooks/react-query'
import { zeroAddress, zeroHash } from 'viem'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'
import { SimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog'

interface PartialRouteCheckerProps {
  children: React.ReactNode
  trade?: UseTradeReturn
}

const _PartialRouteChecker: FC<PartialRouteCheckerProps> = ({
  children,
  trade,
}) => {
  const {
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap()

  return trade?.route?.status === 'Partial' ? (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        size="xl"
        fullWidth
        onClick={() =>
          trade.amountIn && setSwapAmount(trade.amountIn?.toExact())
        }
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

export const SimpleSwapTradeButton: FC = () => {
  return (
    <SimpleSwapTradeReviewDialog>
      {({ error, isSuccess }) => (
        <_SimpleSwapTradeButton error={error} isSuccess={isSuccess} />
      )}
    </SimpleSwapTradeReviewDialog>
  )
}

interface SimpleSwapTradeButtonProps {
  error: Error | null
  isSuccess: boolean
}

const _SimpleSwapTradeButton: FC<SimpleSwapTradeButtonProps> = () => {
  return (
    <Button
      size="xl"
      color={'blue'}
      fullWidth
      testId="swap"
      onClick={() =>
        sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
          txHash: zeroHash,
          chainId: 1,
          token0: zeroAddress,
          token1: zeroAddress,
          amountIn: 0,
          amountOut: 0,
          amountOutMin: 0,
        })
      }
    >
      Send Event
    </Button>
  )
}
