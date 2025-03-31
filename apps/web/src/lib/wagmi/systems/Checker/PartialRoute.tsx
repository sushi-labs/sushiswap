'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  type ButtonProps,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import type { FC } from 'react'
import type { UseTradeReturn } from 'src/lib/hooks/react-query'

type PartialRouteProps = ButtonProps & {
  trade: Pick<UseTradeReturn, 'route' | 'amountIn'> | undefined
  setSwapAmount: (swapAmount: string) => void
}

const PartialRoute: FC<PartialRouteProps> = ({
  trade,
  setSwapAmount,
  fullWidth = true,
  size = 'xl',
  children,
  ...props
}) => {
  return trade?.route?.status === 'Partial' ? (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        id="partial-route-checker"
        disabled={true}
        fullWidth={fullWidth}
        size={size}
        {...props}
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

export { type PartialRouteProps, PartialRoute }
