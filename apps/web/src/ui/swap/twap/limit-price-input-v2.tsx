'use client'

import { Button, SkeletonBox, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Amount, Price } from 'sushi/currency'
import { parseUnits } from 'viem/utils'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

// const PRICE_OPTIONS = [
// 	{
// 		label: "Market",
// 		value: 0,
// 	},
// 	{
// 		label: "+1%",
// 		value: 1,
// 	},
// 	{
// 		label: "+5%",
// 		value: 5,
// 	},
// 	{
// 		label: "+10%",
// 		value: 10,
// 	},
// ];

export const LimitPriceInputV2 = () => {
  const {
    state: {
      token0,
      percentDiff,
      token1,
      marketPrice,
      limitPrice,
      isLimitPriceInverted,
      token0PriceUSD,
      token1PriceUSD,
    },
    mutate: { setIsLimitPriceInverted, setLimitPrice, setPercentDiff },
    isToken0Loading,
    isLoading,
  } = useDerivedStateTwap()

  const [priceOptionIndex, setPriceOptionIndex] = useState<number | undefined>(
    0,
  )
  const [marketPriceLimitString, setMarketPriceLimitString] =
    useState<string>('')
  const [marketUsdAmount, setMarketUsdAmount] = useState<string>('')

  useEffect(() => {
    // reset priceOptionIndex && isLimitPriceInverted on token change
    if (token0 && token1) {
      setPriceOptionIndex(0)
      setIsLimitPriceInverted(false)
    }
  }, [token0, token1, setIsLimitPriceInverted])

  useEffect(() => {
    // update limitPrice based on selected price option & current market price
    if (
      typeof priceOptionIndex === 'undefined' ||
      !marketPrice ||
      !token1PriceUSD ||
      !token0PriceUSD
    ) {
      return
    }
    setLimitPrice(
      (isLimitPriceInverted
        ? marketPrice.invert()
        : marketPrice
      ).toSignificant(),
    )
    setMarketPriceLimitString(
      (isLimitPriceInverted
        ? marketPrice.invert()
        : marketPrice
      ).toSignificant(),
    )
    setMarketUsdAmount(
      (isLimitPriceInverted ? token0PriceUSD : token1PriceUSD).toSignificant(6),
    )
  }, [
    marketPrice,
    priceOptionIndex,
    isLimitPriceInverted,
    setLimitPrice,
    token0PriceUSD,
    token1PriceUSD,
  ])

  const { marketAmount, limitAmount } = useMemo(() => {
    if (!marketPrice || !limitPrice)
      return { marketAmount: 0n, limitAmount: 0n }
    const oneUnitOfBaseCurrency = Amount.fromRawAmount(
      marketPrice.baseCurrency,
      parseUnits('1', marketPrice.baseCurrency.decimals),
    )
    const marketAmount = marketPrice.quote(oneUnitOfBaseCurrency).quotient
    const limitAmount = limitPrice.quote(oneUnitOfBaseCurrency).quotient
    return { marketAmount, limitAmount }
  }, [marketPrice, limitPrice])

  const [from, to] = isLimitPriceInverted
    ? [marketAmount, limitAmount]
    : [limitAmount, marketAmount]

  useEffect(() => {
    if (
      !marketPrice ||
      !limitPrice ||
      typeof priceOptionIndex !== 'undefined'
    ) {
      setPercentDiff(undefined)
      return
    }

    const diff = (to * 10_000n) / from - 10_000n
    const value = Number(diff) / 100
    setPercentDiff(value)
  }, [priceOptionIndex, marketPrice, limitPrice, setPercentDiff, from, to])

  const onInputChange = useCallback(
    (value: string) => {
      if (!token0PriceUSD || !token1PriceUSD || !marketPrice) return
      setPriceOptionIndex(undefined)
      setMarketUsdAmount(value)
      const currentPrice = (
        isLimitPriceInverted ? token0PriceUSD : token1PriceUSD
      ).toSignificant(10)
      const priceDiffReg =
        Number.parseInt(
          (
            ((Number.parseFloat(value) - Number.parseFloat(currentPrice)) /
              Number.parseFloat(currentPrice)) *
            10_000_000
          ).toFixed(0),
        ) || 1
      const priceDiffInverse =
        Number.parseInt(
          (
            ((Number.parseFloat(currentPrice) - Number.parseFloat(value)) /
              Number.parseFloat(value)) *
            10_000_000
          ).toFixed(0),
        ) || 1

      const priceDiff = !isLimitPriceInverted ? priceDiffInverse : priceDiffReg

      const oneUnitOfBaseCurrency = Amount.fromRawAmount(
        marketPrice.baseCurrency,
        parseUnits('1', marketPrice.baseCurrency.decimals),
      )

      const limitPrice = new Price({
        baseAmount: oneUnitOfBaseCurrency,
        quoteAmount: Amount.fromRawAmount(
          marketPrice.quoteCurrency,
          (marketPrice.quote(oneUnitOfBaseCurrency).quotient *
            BigInt(10_000_000 + priceDiff)) /
            10_000_000n,
        ),
      })

      setLimitPrice(
        (isLimitPriceInverted
          ? limitPrice.invert()
          : limitPrice
        ).toSignificant(),
      )
    },
    [
      setLimitPrice,
      isLimitPriceInverted,
      marketPrice,
      token0PriceUSD,
      token1PriceUSD,
    ],
  )

  const [_token0, _token1] = isLimitPriceInverted
    ? [token1, token0]
    : [token0, token1]

  return (
    <div
      className={classNames(
        'relative overflow-hidden flex pt-3 pb-2 px-3 flex-col gap-4 border border-white/10 dark:border-black/10 bg-gray-100 dark:bg-slate-900 rounded-xl',
      )}
    >
      <div className="text-muted-foreground text-xs">Price</div>

      <div className="flex items-center justify-between gap-2">
        <div
          data-state={isLoading ? 'inactive' : 'active'}
          className="data-[state=inactive]:hidden data-[state=active]:flex gap-2 items-center w-fit"
        >
          <div className="flex items-center w-fit">
            <p className="dark:text-slate-50 mr-0.5 text-3xl font-medium text-gray-900">
              $
            </p>
            <TextField
              type="number"
              variant="naked"
              onValueChange={onInputChange}
              value={marketUsdAmount}
              maxDecimals={_token1?.decimals}
              data-state={isLoading ? 'inactive' : 'active'}
              className={'p-0 py-1 !text-3xl font-medium max-w-[260px]'}
            />
          </div>
          {typeof percentDiff !== 'undefined' ? (
            <div
              className={classNames(
                'w-full text-sm font-medium',
                percentDiff > 0 ? 'text-slate-450' : 'text-red',
              )}
            >
              {`(${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(2)}%)`}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between">
        <div className="text-sm font-medium text-muted-foreground">
          {marketPriceLimitString} {_token1?.symbol} per {_token0?.symbol}
        </div>
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
          data-state={isLoading ? 'active' : 'inactive'}
          className="data-[state=inactive]:flex data-[state=active]:hidden items-center gap-1"
        >
          <Button
            onClick={() => {
              setPriceOptionIndex(0)
              if (isLimitPriceInverted) return
              setIsLimitPriceInverted(!isLimitPriceInverted)
            }}
            size="xs"
            className={classNames(
              '!px-2 !rounded-xl',
              isLimitPriceInverted
                ? 'dark:border-skyblue border-blue border'
                : '',
            )}
            variant={isLimitPriceInverted ? 'tertiary' : 'secondary'}
          >
            {token0?.symbol}
          </Button>
          <Button
            onClick={() => {
              setPriceOptionIndex(0)
              if (!isLimitPriceInverted) return
              setIsLimitPriceInverted(!isLimitPriceInverted)
            }}
            size="xs"
            className={classNames(
              '!px-2 !rounded-xl',
              isLimitPriceInverted
                ? ''
                : 'dark:border-skyblue border-blue border',
            )}
            variant={isLimitPriceInverted ? 'secondary' : 'tertiary'}
          >
            {token1?.symbol}
          </Button>
        </div>
      </div>
    </div>
  )
}
