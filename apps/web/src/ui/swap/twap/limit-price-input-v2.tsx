'use client'

import {
  Currency,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Amount, Price } from 'sushi/currency'
import { parseUnits } from 'viem/utils'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

const PRICE_OPTIONS = [
  {
    label: 'Market',
    value: 0,
  },
  {
    label: '+1%',
    value: 1,
  },
  {
    label: '+5%',
    value: 5,
  },
  {
    label: '+10%',
    value: 10,
  },
]

export const LimitPriceInputV2 = () => {
  const {
    state: {
      token0,
      percentDiff,
      token1,
      marketPrice,
      limitPrice,
      isLimitPriceInverted,
      limitPriceString,
    },
    mutate: { setIsLimitPriceInverted, setLimitPrice, setPercentDiff },
    isToken0Loading,
    isLoading,
  } = useDerivedStateTwap()

  const [priceOptionIndex, setPriceOptionIndex] = useState<number | undefined>(
    0,
  )

  useEffect(() => {
    // reset priceOptionIndex && isLimitPriceInverted on token change
    if (token0 && token1) {
      setPriceOptionIndex(0)
      setIsLimitPriceInverted(false)
    }
  }, [token0, token1, setIsLimitPriceInverted])

  useEffect(() => {
    // update limitPrice based on selected price option & current market price
    if (typeof priceOptionIndex === 'undefined' || !marketPrice) {
      return
    }

    if (priceOptionIndex === 0) {
      setLimitPrice(
        (isLimitPriceInverted
          ? marketPrice.invert()
          : marketPrice
        ).toSignificant(),
      )
    } else {
      const priceAdjustmentPercentage = PRICE_OPTIONS[priceOptionIndex].value

      const oneUnitOfBaseCurrency = Amount.fromRawAmount(
        marketPrice.baseCurrency,
        parseUnits('1', marketPrice.baseCurrency.decimals),
      )

      const limitPrice = new Price({
        baseAmount: oneUnitOfBaseCurrency,
        quoteAmount: Amount.fromRawAmount(
          marketPrice.quoteCurrency,
          (marketPrice.quote(oneUnitOfBaseCurrency).quotient *
            BigInt(100 + priceAdjustmentPercentage)) /
            100n,
        ),
      })

      setLimitPrice(
        (isLimitPriceInverted
          ? limitPrice.invert()
          : limitPrice
        ).toSignificant(),
      )
    }
  }, [marketPrice, priceOptionIndex, isLimitPriceInverted, setLimitPrice])

  useEffect(() => {
    if (
      !marketPrice ||
      !limitPrice ||
      typeof priceOptionIndex !== 'undefined'
    ) {
      setPercentDiff(undefined)
      return
    }

    const oneUnitOfBaseCurrency = Amount.fromRawAmount(
      marketPrice.baseCurrency,
      parseUnits('1', marketPrice.baseCurrency.decimals),
    )
    const marketAmount = marketPrice.quote(oneUnitOfBaseCurrency).quotient
    const limitAmount = limitPrice.quote(oneUnitOfBaseCurrency).quotient

    const [from, to] = isLimitPriceInverted
      ? [marketAmount, limitAmount]
      : [limitAmount, marketAmount]

    const diff = (from * 10_000n) / to - 10_000n
    const value = Number(diff) / 100
    setPercentDiff(value)
  }, [
    priceOptionIndex,
    marketPrice,
    limitPrice,
    isLimitPriceInverted,
    setPercentDiff,
  ])

  const onInputChange = useCallback(
    (value: string) => {
      setPriceOptionIndex(undefined)
      setLimitPrice(value)
    },
    [setLimitPrice],
  )

  const onInvert = useCallback(() => {
    setPriceOptionIndex(0)
    setIsLimitPriceInverted((inverted) => !inverted)
  }, [setIsLimitPriceInverted])

  const [_token0, _token1] = isLimitPriceInverted
    ? [token1, token0]
    : [token0, token1]

  const handlePriceOptionChange = useCallback(() => {
    if (typeof percentDiff !== 'undefined') {
      setPriceOptionIndex(0)
      return
    }
    const currentIndex = priceOptionIndex ?? 0
    setPriceOptionIndex((currentIndex + 1) % PRICE_OPTIONS.length)
  }, [priceOptionIndex, percentDiff])

  return (
    <div
      className={classNames(
        'relative overflow-hidden flex flex-col gap-2 border border-accent bg-gray-100 dark:bg-slate-900 rounded-xl',
      )}
    >
      <div className="flex justify-between items-center py-3 px-5">
        <button
          type="button"
          onClick={onInvert}
          onKeyDown={onInvert}
          className="flex items-center gap-2 whitespace-nowrap text-xs"
        >
          <span className="text-muted-foreground">Price</span>
          {_token0 ? (
            <>
              <Currency.Icon currency={_token0} width={16} height={16} />
              <span className="font-medium text-slate-900 dark:text-slate-50">
                {_token0.name}
              </span>
            </>
          ) : (
            <>
              <SkeletonCircle radius={16} />
              <span className="w-8">
                <SkeletonText fontSize="xs" />
              </span>
            </>
          )}
        </button>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2">
        <div className="flex items-center gap-4">
          <div
            data-state={isLoading ? 'active' : 'inactive'}
            className={classNames(
              'data-[state=inactive]:hidden data-[state=active]:flex',
              'gap-4 items-center justify-between flex-grow h-[40px]',
            )}
          >
            <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
            {isToken0Loading ? (
              <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
            ) : null}
          </div>
          <div
            data-state={isLoading ? 'inactive' : 'active'}
            className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
          >
            <TextField
              type="number"
              variant="naked"
              onValueChange={onInputChange}
              value={limitPriceString}
              maxDecimals={_token1?.decimals}
              data-state={isLoading ? 'inactive' : 'active'}
              className={'p-0 py-1 !text-3xl font-medium'}
            />
            {typeof percentDiff !== 'undefined' ? (
              <span
                className={classNames(
                  'ml-2 text-sm font-medium',
                  percentDiff > 0 ? 'text-slate-450' : 'text-red',
                )}
              >
                {`(${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(2)}%)`}
              </span>
            ) : null}
          </div>
          {_token1 ? (
            <div className="flex items-center gap-2 font-medium">
              <button
                type="button"
                className="text-blue dark:text-skyblue text-sm px-2 flex items-center"
                onClick={handlePriceOptionChange}
                onKeyDown={handlePriceOptionChange}
              >
                {PRICE_OPTIONS[priceOptionIndex ?? 0].label}
              </button>
              <div className="flex items-center gap-1">
                <Currency.Icon
                  disableLink
                  currency={_token1}
                  width={20}
                  height={20}
                />
                <span>{_token1.symbol}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
