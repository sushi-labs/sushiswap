import { Button, SkeletonText } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { formatUSD } from 'sushi'
import type { Token } from '~stellar/_common/lib/types/token.type'
import {
  useCrossChainTradeQuote,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export function CrossChainSwapTokenRate() {
  const [invert, setInvert] = useState(false)
  const {
    state: { token0, token1 },
    isToken0Loading,
    isToken1Loading,
  } = useDerivedStateCrossChainSwap()

  const { data: quote, isLoading: isQuoteLoading } = useCrossChainTradeQuote()

  const price = useMemo(() => {
    if (
      !quote?.quote?.amountIn ||
      !quote?.quote?.amountOut ||
      !token0 ||
      !token1
    )
      return '0.00'

    const amountInRaw = Number.parseFloat(quote.quote.amountIn)
    const amountOutRaw = Number.parseFloat(quote.quote.amountOut)

    if (amountInRaw === 0) return '0.00'

    const token0Decimals = (token0 as Token).decimals
    const token1Decimals = token1.decimals

    const amountInHuman = amountInRaw / 10 ** token0Decimals
    const amountOutHuman = amountOutRaw / 10 ** token1Decimals

    const rate = amountOutHuman / amountInHuman

    const displayRate = invert ? 1 / rate : rate

    if (displayRate < 0.000001) {
      return displayRate.toExponential(4)
    }
    if (displayRate < 1) {
      return displayRate.toFixed(6)
    }
    if (displayRate < 1000) {
      return displayRate.toFixed(4)
    }
    return displayRate.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }, [invert, quote, token0, token1])

  const token0FiatPrice = useMemo(() => {
    if (!quote?.quote?.amountInUsd) return 0
    return Number.parseFloat(quote.quote.amountInUsd)
  }, [quote])

  const token1FiatPrice = useMemo(() => {
    if (!quote?.quote?.amountOutUsd) return 0
    return Number.parseFloat(quote.quote.amountOutUsd)
  }, [quote])

  if (isToken0Loading || isToken1Loading || isQuoteLoading) {
    return <SkeletonText fontSize="sm" className="!w-[100px]" />
  }

  const token0Symbol = (token0 as Token)?.code
  const token1Symbol = token1?.symbol

  return (
    <Button
      className="!text-xs !font-medium !gap-0.5 !px-0 hover:!bg-transparent focus:!bg-transparent"
      variant="ghost"
      size="xs"
      onClick={() => setInvert((prev) => !prev)}
    >
      1 {invert ? token1Symbol : token0Symbol} = {price}{' '}
      {invert ? token0Symbol : token1Symbol}
      <span className="text-gray-600 dark:text-slate-500 !font-normal">
        ({formatUSD(invert ? token1FiatPrice : token0FiatPrice)})
      </span>
    </Button>
  )
}
