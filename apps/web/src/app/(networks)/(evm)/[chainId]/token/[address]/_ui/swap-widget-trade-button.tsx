'use client'

import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
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

export const SwapWidgetTradeButton = () => {
  const router = useRouter()
  const { data: maintenance } = useIsSwapMaintenance()
  const { data: quote, error } = useSwapWidgetTradeQuote()

  const {
    state: { swapAmountString, chainId, token0, token1 },
    mutate: { setSwapAmount },
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
      <Checker.PartialRoute
        trade={quote}
        setSwapAmount={setSwapAmount}
        onAccepted={() => router.push(url)}
      >
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
      </Checker.PartialRoute>
    </Checker.Guard>
  )
}
