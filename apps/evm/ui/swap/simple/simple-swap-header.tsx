'use client'

import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { Price, tryParseAmount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { usePrices } from '@sushiswap/react-query'
import { Button, typographyVariants } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { useTokenAmountDollarValues } from 'lib/hooks'
import React, { useMemo, useState } from 'react'

import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapHeader = () => {
  const [invert, setInvert] = useState(false)
  const {
    state: { chainId, token0, token1 },
    isLoading,
  } = useDerivedStateSimpleSwap()

  const amounts = useMemo(() => {
    return [tryParseAmount('1', token0), tryParseAmount('1', token1)]
  }, [token0, token1])

  const [token0FiatPrice, token1FiatPrice] = useTokenAmountDollarValues({
    chainId,
    amounts,
  })

  const { data: prices } = usePrices({ chainId })

  const price = useMemo(() => {
    if (!token0 || !token1) return '0.00'

    const token0Price = prices?.[token0.wrapped.address]
      ? tryParseAmount('1', token0)?.multiply(prices[token0.wrapped.address])
      : undefined
    const token1Price = prices?.[token1.wrapped.address]
      ? tryParseAmount('1', token1)?.multiply(prices[token1.wrapped.address])
      : undefined

    let price
    if (token0Price && token1Price) {
      price = new Price({
        baseAmount: token0Price,
        quoteAmount: token1Price,
      })
    }

    return price
      ? invert
        ? price.invert().toSignificant(4)
        : price.toSignificant(4)
      : '0.00'
  }, [invert, prices, token0, token1])

  return (
    <div className="flex flex-col items-start gap-2 mb-4 sm:mt-10 mt-2">
      <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
      {isLoading || !token0 || !token1 ? (
        <SkeletonText fontSize="sm" className="w-2/4" />
      ) : (
        <Button
          variant="link"
          size="sm"
          onClick={() => setInvert((invert) => !invert)}
        >
          <ArrowTrendingUpIcon width={16} height={16} />
          <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
            1 {invert ? token0.symbol : token1.symbol}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? token0FiatPrice : token1FiatPrice)})
            </span>{' '}
            = {price} {invert ? token1.symbol : token0.symbol}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? token1FiatPrice : token0FiatPrice)})
            </span>
          </span>
        </Button>
      )}
    </div>
  )
}
