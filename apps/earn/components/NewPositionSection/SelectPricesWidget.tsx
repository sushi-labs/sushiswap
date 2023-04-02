import { MinusIcon, PlusIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Bound } from '../../lib/constants'
import { ContentBlock } from '../AddPage/ContentBlock'
import LiquidityChartRangeInput from '../LiquidityChartRangeInput'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
  useRangeHopCallbacks,
} from '../ConcentratedLiquidityProvider'
import { DEFAULT_INPUT_UNSTYLED, Input } from '@sushiswap/ui/future/components/input'
import { useConcentratedLiquidityURLState } from '../ConcentratedLiquidityURLStateProvider'
import { useAccount } from '@sushiswap/wagmi'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { Button } from '@sushiswap/ui/future/components/button'
import { useIsMounted } from '@sushiswap/hooks'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import {
  useConcentratedLiquidityPositionsFromTokenId,
  useConcentratedPositionInfo,
} from '@sushiswap/wagmi/future/hooks'

enum ChartType {
  Liquidity = 'Liquidity',
  Price = 'Price',
}

enum Range {
  Unset = 'Unset',
  Full = 'Full Range',
  Double = 'x ÷ 2',
  Twenty = 'x ÷ 1.2',
  One = 'x ÷ 1.01',
}

export const SelectPricesWidget: FC = ({}) => {
  const { address } = useAccount()
  const [invert, setInvert] = useState(false)
  const { chainId, token0, token1, feeAmount, switchTokens, tokenId } = useConcentratedLiquidityURLState()
  const { price, invertPrice, pricesAtTicks, ticks, ticksAtLimit, pool, noLiquidity, isLoading } =
    useConcentratedDerivedMintInfo({
      chainId,
      account: address,
      token0,
      token1,
      baseToken: token0,
      feeAmount,
      existingPosition: undefined,
    })

  const { onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useConcentratedMintActionHandlers()
  const { startPriceTypedValue } = useConcentratedMintState()
  const { data: existingPosition, isLoading: positionLoading } = useConcentratedLiquidityPositionsFromTokenId({
    chainId,
    tokenId,
  })
  const hasExistingPosition = !!existingPosition && !positionLoading

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(token0, token1, feeAmount, tickLower, tickUpper, pool)

  const isSorted = token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
  const leftPrice = useMemo(() => (isSorted ? priceLower : priceUpper?.invert()), [isSorted, priceLower, priceUpper])
  const rightPrice = useMemo(() => (isSorted ? priceUpper : priceLower?.invert()), [isSorted, priceLower, priceUpper])

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!pool || !token0 || !token1 || !pool.priceOf(token0.wrapped) || !leftPrice || !rightPrice) return [0, 0]
    const min = +leftPrice?.toFixed(4)
    const cur = +pool.priceOf(token0.wrapped)?.toFixed(4)
    const max = +rightPrice?.toFixed(4)

    return [((min - cur) / cur) * 100, ((max - cur) / cur) * 100]
  }, [leftPrice, pool, rightPrice, token0, token1])

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })

  return (
    <ContentBlock
      title={
        <>
          Between which <span className="text-gray-900 dark:text-white">prices</span> do you want to provide liquidity?
        </>
      }
    >
      <div>
        <div className="flex flex-col gap-3">
          <div className="flex lg:hidden justify-end">
            {isLoading || !pool || !token0 || !token1 ? (
              <Skeleton.Text fontSize="text-xs" />
            ) : (
              <div
                onClick={() => setInvert((prev) => !prev)}
                role="button"
                className="text-xs flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
              >
                <SwitchHorizontalIcon width={16} height={16} />
                <div className="flex items-baseline gap-1.5">
                  {invert ? token1.symbol : token0.symbol} ={' '}
                  {pool.priceOf(invert ? token1.wrapped : token0.wrapped)?.toSignificant(4)}{' '}
                  {invert ? token0.symbol : token1.symbol}
                  <span className="text-xs font-normal">${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          {noLiquidity ? (
            <div className="pb-2">
              <Input.Text
                label="Start price"
                value={startPriceTypedValue}
                onChange={onStartPriceInput}
                id="start-price-input"
                caption="Your pool needs a starting price somewhere between the min. and max. price"
              />
            </div>
          ) : (
            <LiquidityChartRangeInput
              chainId={chainId}
              currencyA={token0}
              currencyB={token1}
              feeAmount={feeAmount}
              ticksAtLimit={ticksAtLimit}
              price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}
              priceLower={priceLower}
              priceUpper={priceUpper}
              onLeftRangeInput={onLeftRangeInput}
              onRightRangeInput={onRightRangeInput}
              interactive={!hasExistingPosition}
            />
          )}
        </div>
        <div className="flex flex-col gap-3 pt-4">
          {/*<RadioGroup value={range} onChange={setRange} className="flex gap-2">*/}
          {/*  {Object.keys(Range)*/}
          {/*    .slice(1)*/}
          {/*    .map((val) => {*/}
          {/*      return (*/}
          {/*        <RadioGroup.Option*/}
          {/*          key={val}*/}
          {/*          className={({ checked }) =>*/}
          {/*            classNames(*/}
          {/*              checked ? 'ring-2 ring-blue bg-white dark:bg-white/[0.08]' : '',*/}
          {/*              'cursor-pointer rounded-full px-3 bg-white dark:bg-white/[0.04] hover:bg-white/[0.08] text-xs py-1.5 font-semibold w-full whitespace-nowrap flex justify-center'*/}
          {/*            )*/}
          {/*          }*/}
          {/*          value={val}*/}
          {/*        >*/}
          {/*          {Object.values(Range)[Object.keys(Range).indexOf(val)]}*/}
          {/*        </RadioGroup.Option>*/}
          {/*      )*/}
          {/*    })}*/}
          {/*</RadioGroup>*/}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 rounded-xl bg-white dark:bg-white/[0.02] p-1">
              <Button
                onClick={switchTokens}
                variant={isSorted ? 'outlined' : 'empty'}
                color={isSorted ? 'blue' : 'default'}
                size="xs"
              >
                {isSorted ? token0?.symbol : token1?.symbol}
              </Button>
              <Button
                onClick={switchTokens}
                variant={isSorted ? 'empty' : 'outlined'}
                color={isSorted ? 'default' : 'blue'}
                size="xs"
              >
                {isSorted ? token1?.symbol : token0?.symbol}
              </Button>
            </div>
            {!noLiquidity && (
              <Button size="xs" variant="empty" color="blue" onClick={getSetFullRange}>
                Full Range
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <PriceBlock
              token0={token0}
              token1={token1}
              label="Min Price"
              value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
              onUserInput={onLeftRangeInput}
              decrement={isSorted ? getDecrementLower : getIncrementUpper}
              increment={isSorted ? getIncrementLower : getDecrementUpper}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
              priceDiff={minPriceDiff}
              priceFiat={fiatAmountsAsNumber[0]}
              fullRange={Boolean(ticksAtLimit[Bound.LOWER] && ticksAtLimit[Bound.UPPER])}
            />
            <PriceBlock
              token0={token0}
              token1={token1}
              label="Max Price"
              value={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
              onUserInput={onRightRangeInput}
              decrement={isSorted ? getDecrementUpper : getIncrementLower}
              increment={isSorted ? getIncrementUpper : getDecrementLower}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
              priceDiff={maxPriceDiff}
              priceFiat={fiatAmountsAsNumber[0]}
              fullRange={Boolean(ticksAtLimit[Bound.LOWER] && ticksAtLimit[Bound.UPPER])}
            />
          </div>
        </div>
      </div>
    </ContentBlock>
  )
}

interface PriceBlockProps {
  token0: Type | undefined
  token1: Type | undefined
  label: string
  value: string
  decrement(): string
  increment(): string
  onUserInput(val: string): void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  locked?: boolean
  priceDiff: number
  priceFiat: number
  fullRange: boolean
}

export const PriceBlock: FC<PriceBlockProps> = ({
  locked,
  onUserInput,
  decrement,
  increment,
  decrementDisabled,
  incrementDisabled,
  token0,
  token1,
  label,
  value,
  priceDiff,
  priceFiat,
  fullRange,
}) => {
  const isMounted = useIsMounted()
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <div
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      className={classNames(
        active ? 'ring-2 ring-blue' : '',
        'flex flex-col gap-2 w-full bg-white dark:bg-white/[0.04] rounded-lg p-3'
      )}
    >
      <p className="font-medium text-sm text-gray-600 dark:text-slate-400 text-slate-600">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Input.Numeric
            value={localValue}
            onUserInput={setLocalValue}
            disabled={locked}
            className={classNames(DEFAULT_INPUT_UNSTYLED, 'without-ring !text-3xl !px-0 !pt-1 !pb-2 shadow-none')}
            tabIndex={0}
          />
          {!fullRange && isMounted && (
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {token0?.symbol} = ${(priceFiat * (1 + priceDiff / 100)).toFixed(2)} ({priceDiff.toFixed(2)}%)
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            disabled={incrementDisabled}
            onClick={handleIncrement}
            className={classNames(
              incrementDisabled ? 'opacity-40' : 'hover:bg-gray-300 dark:hover:bg-slate-600',
              'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full'
            )}
            tabIndex={-1}
          >
            <PlusIcon width={12} height={12} />
          </button>
          <button
            disabled={decrementDisabled}
            onClick={handleDecrement}
            className={classNames(
              decrementDisabled ? 'opacity-40' : 'hover:bg-gray-300 dark:hover:bg-slate-600',
              'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full'
            )}
            tabIndex={-1}
          >
            <MinusIcon width={12} height={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
