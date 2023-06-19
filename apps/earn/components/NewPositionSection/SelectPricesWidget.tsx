import { MinusIcon, PlusIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { classNames, Collapsible } from '@sushiswap/ui'
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

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
import { useAccount } from '@sushiswap/wagmi'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { Button } from '@sushiswap/ui/future/components/button'
import { useIsMounted } from '@sushiswap/hooks'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useConcentratedLiquidityPositionsFromTokenId } from '@sushiswap/wagmi/future/hooks'
import { FeeAmount, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

interface SelectPricesWidget {
  chainId: SushiSwapV3ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
  switchTokens?(): void
  tokenId: string | undefined
  children?: ReactNode
  showStartPrice?: boolean
}

export const SelectPricesWidget: FC<SelectPricesWidget> = ({
  chainId,
  token0,
  token1,
  feeAmount,
  switchTokens,
  tokenId,
  children,
  showStartPrice = true,
}) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const [invert, setInvert] = useState(false)
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

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })

  return (
    <ContentBlock
      disabled={!token0 || !token1}
      title={
        <>
          Between which <span className="text-gray-900 dark:text-white">prices</span> do you want to provide liquidity?
        </>
      }
    >
      <Collapsible open={Boolean(noLiquidity)}>
        <div className="p-6 font-medium bg-blue/10 text-blue rounded-xl">
          This pool must be initialized before you can add liquidity.{' '}
          {showStartPrice
            ? 'To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. '
            : ''}
          Gas fees will be higher than usual due to the initialization transaction.
        </div>
      </Collapsible>
      {children && children}
      <div className="bg-white dark:bg-white/[0.02] rounded-xl flex flex-col gap-4 p-4">
        {isMounted && showStartPrice && (
          <div className="flex flex-col gap-3">
            {noLiquidity && (
              <div className="relative flex items-center w-full gap-3 pb-2">
                <Input.Text
                  hideCloseButton={true}
                  className="!bg-gray-100 dark:!bg-slate-800 !w-full pr-[120px]"
                  label="Start price"
                  value={startPriceTypedValue}
                  onChange={onStartPriceInput}
                  id="start-price-input"
                  caption="Your pool needs a starting price somewhere between the min. and max. price"
                />
                <div className="absolute top-0 flex items-center right-4 bottom-7">
                  <div className="text-xs font-medium text-gray-500 whitespace-nowrap dark:text-slate-400">
                    {token1?.symbol} per {token0?.symbol}
                  </div>
                </div>
              </div>
            )}
            {!noLiquidity && (
              <>
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
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex justify-end lg:hidden">
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
            {switchTokens ? (
              <div className="flex gap-2 rounded-xl bg-gray-100 dark:bg-white/[0.02] p-1">
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
            ) : (
              <div />
            )}
            {!noLiquidity && (
              <Button size="xs" variant="empty" color="blue" onClick={getSetFullRange}>
                Full Range
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <PriceBlock
              id={'min-price'}
              token0={token0}
              token1={token1}
              label="Min Price"
              value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
              onUserInput={onLeftRangeInput}
              decrement={isSorted ? getDecrementLower : getIncrementUpper}
              increment={isSorted ? getIncrementLower : getDecrementUpper}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
            />
            <PriceBlock
              id={'max-price'}
              token0={token0}
              token1={token1}
              label="Max Price"
              value={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
              onUserInput={onRightRangeInput}
              decrement={isSorted ? getDecrementUpper : getIncrementLower}
              increment={isSorted ? getIncrementUpper : getDecrementLower}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
            />
          </div>
        </div>
      </div>
    </ContentBlock>
  )
}

interface PriceBlockProps {
  id?: string
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
}

export const PriceBlock: FC<PriceBlockProps> = ({
  id,
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
}) => {
  const isMounted = useIsMounted()
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

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
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <div
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      className={classNames(
        active ? 'ring-2 ring-blue' : '',
        'flex flex-col gap-2 w-full bg-gray-100 dark:bg-white/[0.04] rounded-lg p-3'
      )}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Input.Numeric
            variant="unstyled"
            testdata-id={`${id}-input`}
            value={localValue}
            onUserInput={setLocalValue}
            disabled={locked}
            className={classNames(DEFAULT_INPUT_UNSTYLED, 'without-ring !text-3xl !px-0 !pt-1 !pb-2 shadow-none')}
            tabIndex={0}
          />
          {isMounted && (
            <p className="text-sm font-medium text-gray-500 dark:text-slate-500">
              {token1?.symbol} per {token0?.symbol}
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
