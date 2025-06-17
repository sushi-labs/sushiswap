'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/20/solid'
import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import {
  Currency,
  IconButton,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  TextField,
  Toggle,
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

export const LimitPriceInput = () => {
  const {
    state: {
      token0,
      token1,
      marketPrice,
      limitPrice,
      isLimitPriceInverted,
      limitPriceString,
    },
    mutate: { setIsLimitPriceInverted, setLimitPrice },
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

  const percentDiff = useMemo(() => {
    if (!marketPrice || !limitPrice || typeof priceOptionIndex !== 'undefined')
      return undefined

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
    return Number(diff) / 100
  }, [priceOptionIndex, marketPrice, limitPrice, isLimitPriceInverted])

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

  return (
    <div
      className={classNames(
        // error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'relative overflow-hidden border border-accent bg-white dark:bg-slate-800 rounded-xl',
      )}
    >
      <div className="flex justify-between items-center border-b border-accent p-3">
        <div className="flex items-center gap-2 whitespace-nowrap text-xs">
          <span className="font-medium">When 1</span>
          {_token0 ? (
            <>
              <Currency.Icon currency={_token0} width={16} height={16} />
              <span className="font-medium">{_token0.name}</span>
            </>
          ) : (
            <>
              <SkeletonCircle radius={16} />
              <span className="w-8">
                <SkeletonText fontSize="xs" />
              </span>
            </>
          )}
          <span className="text-muted-foreground">is worth</span>
        </div>
        <IconButton
          icon={ArrowsUpDownIcon}
          onClick={onInvert}
          name={'Invert'}
          className="!min-h-[30px] !h-[30px] !min-w-[30px] !w-[30px] px-2 transition-transform rotate-0 hover:rotate-180"
        />
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
          </div>
          {_token1 ? (
            <div className="flex items-center gap-1">
              <Currency.Icon
                disableLink
                currency={_token1}
                width={20}
                height={20}
              />
              <span className="font-medium">{_token1.symbol}</span>
            </div>
          ) : null}
        </div>

        <RadioGroup
          value={priceOptionIndex ?? 0}
          className="gap-2 flex flex-wrap py-1"
        >
          {PRICE_OPTIONS.map((option, i) => (
            <Radio value={option.value} key={option.value}>
              <Toggle
                disabled={isLoading}
                variant="outline"
                className="whitespace-nowrap !rounded-[50px] !px-4 !h-7 relative"
                onClick={() => setPriceOptionIndex(i)}
                pressed={
                  i === priceOptionIndex ||
                  (i === 0 &&
                    typeof priceOptionIndex === 'undefined' &&
                    +limitPriceString !== 0)
                }
              >
                {i === 0 && typeof percentDiff !== 'undefined' ? (
                  <>
                    {`${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(2)}%`}
                    <div className="pl-1">
                      <XCircleIcon height={14} width={14} />
                    </div>
                  </>
                ) : (
                  option.label
                )}
              </Toggle>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
