'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import {
  DialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { UseTradeReturn } from 'src/lib/hooks/react-query'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  ROUTE_PROCESSOR_5_ADDRESS,
  isRouteProcessor5ChainId,
} from 'sushi/config'
import { Native } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import { APPROVE_TAG_SWAP } from '../../../lib/constants'
import { usePersistedSlippageError } from '../../../lib/hooks'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTrade,
} from './derivedstate-simple-swap-provider'
import { SimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog'
import { useIsSwapMaintenance } from './use-is-swap-maintenance'

interface PartialRouteCheckerProps {
  children: React.ReactNode
  trade?: UseTradeReturn
}

const PartialRouteChecker: FC<PartialRouteCheckerProps> = ({
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

const _SimpleSwapTradeButton: FC<SimpleSwapTradeButtonProps> = ({
  error,
  isSuccess,
}) => {
  const { data: maintenance } = useIsSwapMaintenance()
  const { isSlippageError } = usePersistedSlippageError({ isSuccess, error })
  const { data: trade } = useSimpleSwapTrade()
  const [checked, setChecked] = useState(false)

  const {
    state: { swapAmount, swapAmountString, chainId, token0, token1 },
  } = useDerivedStateSimpleSwap()

  const isWrap =
    token0?.isNative &&
    token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isUnwrap =
    token1?.isNative &&
    token0?.wrapped.address === Native.onChain(chainId).wrapped.address

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(trade?.priceImpact)
    return priceImpactSeverity > 3
  }, [trade?.priceImpact])

  // Reset
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [showPriceImpactWarning, checked])

  return (
    <>
      <div>
        <Checker.Guard
          guardWhen={maintenance}
          guardText="Maintenance in progress"
        >
          <PartialRouteChecker trade={trade}>
            <Checker.Connect>
              <Checker.Network chainId={chainId}>
                <Checker.Amounts chainId={chainId} amount={swapAmount}>
                  <Checker.ApproveERC20
                    id="approve-erc20"
                    amount={swapAmount}
                    contract={
                      isRouteProcessor5ChainId(chainId)
                        ? ROUTE_PROCESSOR_5_ADDRESS[chainId]
                        : undefined
                    }
                  >
                    <Checker.Success tag={APPROVE_TAG_SWAP}>
                      <DialogTrigger asChild>
                        <Button
                          size="xl"
                          disabled={Boolean(
                            isSlippageError ||
                              error ||
                              !trade?.amountOut?.greaterThan(ZERO) ||
                              trade?.route?.status === 'NoWay' ||
                              +swapAmountString === 0 ||
                              (!checked && showPriceImpactWarning),
                          )}
                          color={showPriceImpactWarning ? 'red' : 'blue'}
                          fullWidth
                          testId="swap"
                        >
                          {!checked && showPriceImpactWarning
                            ? 'Price impact too high'
                            : trade?.route?.status === 'NoWay'
                              ? 'No trade found'
                              : isWrap
                                ? 'Wrap'
                                : isUnwrap
                                  ? 'Unwrap'
                                  : 'Swap'}
                        </Button>
                      </DialogTrigger>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </PartialRouteChecker>
        </Checker.Guard>
      </div>
      {showPriceImpactWarning && (
        <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
          <input
            id="expert-checkbox"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label
            htmlFor="expert-checkbox"
            className="ml-2 font-medium text-red-600"
          >
            Price impact is too high. You will lose a big portion of your funds
            in this trade. Please tick the box if you would like to continue.
          </label>
        </div>
      )}
    </>
  )
}
