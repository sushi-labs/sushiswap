'use client'

import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import {
  Button,
  FormattedNumber,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import React, { useMemo, useState } from 'react'
import { Amount, Price, formatUSD } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useTokenAmountDollarValues } from '../../../lib/hooks'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const TwapHeader = () => {
  const [invert, setInvert] = useState(false)
  const {
    state: { chainId, token0, token1 },
    isLoading,
  } = useDerivedStateTwap()

  const amounts = useMemo(() => {
    return token0 && token1
      ? [Amount.fromHuman(token0, '1'), Amount.fromHuman(token1, '1')]
      : []
  }, [token0, token1])

  const [token0FiatPrice, token1FiatPrice] = useTokenAmountDollarValues({
    chainId,
    amounts,
  })

  const { data: prices, isLoading: isPricesLoading } = usePrices({ chainId })

  const price = useMemo(() => {
    if (!token0 || !token1) return '0.00'

    const token0PriceFraction = prices?.getFraction(token0.wrap().address)
    const token0Price = token0PriceFraction
      ? Amount.fromHuman(token0, '1').mul(token0PriceFraction)
      : undefined

    const token1PriceFraction = prices?.getFraction(token1.wrap().address)
    const token1Price = token1PriceFraction
      ? Amount.fromHuman(token1, '1').mul(token1PriceFraction)
      : undefined

    let price
    if (token0Price?.amount && token1Price?.amount) {
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
      {isLoading || isPricesLoading || !token0 || !token1 ? (
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
            =
            <FormattedNumber number={price} />{' '}
            {invert ? token1.symbol : token0.symbol}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? token1FiatPrice : token0FiatPrice)})
            </span>
          </span>
        </Button>
      )}
    </div>
  )
}
