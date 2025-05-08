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
    state: { token0, token1, marketPrice, limitPrice },
    mutate: { switchTokens, setLimitPrice },
    isToken0Loading,
    isLoading,
  } = useDerivedStateTwap()

  const token0PriceQuote = useMemo(() => {
    if (!limitPrice) return undefined

    const oneUnitOfBaseCurrency = Amount.fromRawAmount(
      limitPrice.baseCurrency,
      parseUnits('1', limitPrice.baseCurrency.decimals),
    )

    return limitPrice.quote(oneUnitOfBaseCurrency)
  }, [limitPrice])

  const ADJUSTED_PRICES = useMemo(() => {
    if (!marketPrice) return undefined

    const getAdjustedPrice = (priceAdjustmentPercentage: number) => {
      if (priceAdjustmentPercentage === 0) return marketPrice

      const oneUnitOfBaseCurrency = Amount.fromRawAmount(
        marketPrice.baseCurrency,
        parseUnits('1', marketPrice.baseCurrency.decimals),
      )

      return new Price({
        baseAmount: oneUnitOfBaseCurrency,
        quoteAmount: Amount.fromRawAmount(
          marketPrice.quoteCurrency,
          (marketPrice.quote(oneUnitOfBaseCurrency).quotient *
            BigInt(100 + priceAdjustmentPercentage)) /
            100n,
        ),
      })
    }

    return PRICE_OPTIONS.map(({ value }) => getAdjustedPrice(value))
  }, [marketPrice])

  const [customInput, setCustomInput] = useState<string | undefined>(undefined)
  const [priceOptionIndex, _setPriceOptionIndex] = useState<number>(0)

  const setPriceOptionIndex = useCallback((priceOptionIndex: number) => {
    setCustomInput(undefined)
    _setPriceOptionIndex(priceOptionIndex)
  }, [])

  const percentDiff = useMemo(() => {
    if (!marketPrice || !limitPrice) return undefined

    const oneUnit = Amount.fromRawAmount(
      marketPrice.baseCurrency,
      parseUnits('1', marketPrice.baseCurrency.decimals),
    )
    const marketAmount = marketPrice.quote(oneUnit).quotient
    const limitAmount = limitPrice.quote(oneUnit).quotient

    const diff = (limitAmount * 10_000n) / marketAmount - 10_000n
    return Number(diff) / 100
  }, [marketPrice, limitPrice])

  useEffect(() => {
    if (!ADJUSTED_PRICES?.length) return
    if (priceOptionIndex === 0 && typeof customInput !== 'undefined') return
    setLimitPrice(ADJUSTED_PRICES[priceOptionIndex])
  }, [ADJUSTED_PRICES, priceOptionIndex, setLimitPrice, customInput])

  const onInputChange = useCallback(
    (value: string) => {
      setCustomInput(value)
      _setPriceOptionIndex(0)
      if (!marketPrice || value === '') return

      const oneUnit = Amount.fromRawAmount(
        marketPrice.baseCurrency,
        parseUnits('1', marketPrice.baseCurrency.decimals),
      )
      const inputAmount = parseUnits(value, marketPrice.quoteCurrency.decimals)

      const customPrice = new Price({
        baseAmount: oneUnit,
        quoteAmount: Amount.fromRawAmount(
          marketPrice.quoteCurrency,
          BigInt(inputAmount.toString()),
        ),
      })

      setLimitPrice(customPrice)
    },
    [marketPrice, setLimitPrice],
  )

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
          {token0 ? (
            <>
              <Currency.Icon currency={token0} width={16} height={16} />
              <span className="font-medium">{token0.name}</span>
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
          onClick={switchTokens}
          name={'Switch tokens'}
          className="!min-h-[30px] !h-[30px] !min-w-[30px] !w-[30px] px-2"
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
              value={
                typeof customInput !== 'undefined'
                  ? customInput
                  : (token0PriceQuote?.toSignificant() ?? '')
              }
              maxDecimals={token1?.decimals}
              data-state={isLoading ? 'inactive' : 'active'}
              className={classNames('p-0 py-1 !text-3xl font-medium')}
            />
          </div>
          {token1 ? (
            <div className="flex items-center gap-1">
              <Currency.Icon
                disableLink
                currency={token1}
                width={20}
                height={20}
              />
              <span className="font-medium">{token1.symbol}</span>
            </div>
          ) : null}
        </div>

        <RadioGroup
          value={priceOptionIndex}
          className="gap-2 flex flex-wrap py-1"
        >
          {PRICE_OPTIONS.map((option, i) => (
            <Radio value={option.value} key={option.value}>
              <Toggle
                disabled={isLoading}
                variant="outline"
                className="whitespace-nowrap !rounded-[50px] !px-4 !h-7 relative"
                onClick={() => setPriceOptionIndex(i)}
                pressed={priceOptionIndex === i}
              >
                {i === 0 &&
                typeof customInput !== 'undefined' &&
                customInput !== '' &&
                percentDiff !== undefined ? (
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
