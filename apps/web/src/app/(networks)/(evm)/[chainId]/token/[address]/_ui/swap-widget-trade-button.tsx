'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import type React from 'react'
import { type FC, useMemo } from 'react'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { ZERO, getChainById } from 'sushi'
import { EvmNative, getEvmChainById } from 'sushi/evm'
import { useWrapUnwrapTrade } from '~evm/[chainId]/(trade)/swap/_ui/common'
import { useIsSwapMaintenance } from '~evm/[chainId]/(trade)/swap/_ui/use-is-swap-maintenance'
import {
  useDerivedStateSwapWidget,
  useSwapWidgetTradeQuote,
} from './derivedstate-swap-widget-provider'

interface PartialRouteCheckerProps {
  children: React.ReactNode
  trade?: UseEvmTradeReturn | UseSvmTradeReturn
}

const PartialRouteChecker: FC<PartialRouteCheckerProps> = ({
  children,
  trade,
}) => {
  const {
    mutate: { setSwapAmount },
  } = useDerivedStateSwapWidget()

  return trade?.status === 'Partial' ? (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        size="xl"
        fullWidth
        onClick={() =>
          trade.amountIn && setSwapAmount(trade.amountIn?.toString())
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

export const SwapWidgetTradeButton = () => {
  const { data: maintenance } = useIsSwapMaintenance()
  const { data: quote, error } = useSwapWidgetTradeQuote()

  const {
    state: { swapAmountString, chainId, token0, token1 },
  } = useDerivedStateSwapWidget()

  const { isUnwrap, isWrap } = useWrapUnwrapTrade(token0, token1)

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(quote?.priceImpact)
    return priceImpactSeverity > 3
  }, [quote?.priceImpact])

  const url = useMemo(() => {
    const base = `/${getChainById(chainId).key}/swap`
    const params = new URLSearchParams()

    if (token0) {
      params.set('token0', token0.type === 'native' ? 'NATIVE' : token0.address)
    }
    if (token1) {
      params.set('token1', token1.type === 'native' ? 'NATIVE' : token1.address)
    }
    if (swapAmountString) {
      params.set('swapAmount', swapAmountString)
    }

    return `${base}?${params.toString()}`
  }, [chainId, token0, token1, swapAmountString])

  return (
    <Checker.Guard guardWhen={maintenance} guardText="Maintenance in progress">
      <PartialRouteChecker trade={quote}>
        <Link href={url}>
          <Button
            size="xl"
            disabled={Boolean(
              error ||
                !quote?.amountOut?.gt(ZERO) ||
                quote?.status === 'NoWay' ||
                +swapAmountString === 0 ||
                showPriceImpactWarning,
            )}
            color={showPriceImpactWarning ? 'red' : 'blue'}
            fullWidth
            testId="swap"
          >
            {showPriceImpactWarning
              ? 'Price impact too high'
              : quote?.status === 'NoWay'
                ? 'No trade found'
                : isWrap
                  ? 'Wrap'
                  : isUnwrap
                    ? 'Unwrap'
                    : 'Swap'}
          </Button>
        </Link>
      </PartialRouteChecker>
    </Checker.Guard>
  )
}
