import { Amount, tryParseAmount, Type } from '@sushiswap/currency'
import { classNames, Collapsible, Dots, NetworkIcon } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Chain, ChainId } from '@sushiswap/chain'
import { AddSectionConfirmModalConcentrated } from './AddSectionConfirmModalConcentrated'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { Bound } from '../../lib/constants'
import { useConcentratedDerivedMintInfo } from '../ConcentratedLiquidityProvider'
import { FeeAmount, Position } from '@sushiswap/v3-sdk'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { Badge } from '@sushiswap/ui/future/components/Badge'

interface AddSectionReviewModalConcentratedProps
  extends Pick<
    ReturnType<typeof useConcentratedDerivedMintInfo>,
    'noLiquidity' | 'position' | 'price' | 'pricesAtTicks' | 'ticksAtLimit'
  > {
  chainId: ChainId
  feeAmount: FeeAmount | undefined
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  existingPosition: Position | undefined
  tokenId: number | string | undefined
  children({ open, setOpen }: { open: boolean; setOpen(open: boolean): void }): ReactNode
  successLink?: string
}

export const AddSectionReviewModalConcentrated: FC<AddSectionReviewModalConcentratedProps> = ({
  chainId,
  feeAmount,
  token0,
  token1,
  input0,
  input1,
  children,
  noLiquidity,
  position,
  existingPosition,
  price,
  pricesAtTicks,
  ticksAtLimit,
  tokenId,
  successLink,
}) => {
  const [open, setOpen] = useState(false)

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const isSorted = token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
  const leftPrice = useMemo(() => (isSorted ? priceLower : priceUpper?.invert()), [isSorted, priceLower, priceUpper])
  const rightPrice = useMemo(() => (isSorted ? priceUpper : priceLower?.invert()), [isSorted, priceLower, priceUpper])
  const midPrice = useMemo(() => (isSorted ? price : price?.invert()), [isSorted, price])
  const isFullRange = Boolean(ticksAtLimit[Bound.LOWER] && ticksAtLimit[Bound.UPPER])

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!midPrice || !token0 || !token1 || !leftPrice || !rightPrice) return [0, 0]
    const min = +leftPrice?.toFixed(4)
    const cur = +midPrice?.toFixed(4)
    const max = +rightPrice?.toFixed(4)

    return [((min - cur) / cur) * 100, ((max - cur) / cur) * 100]
  }, [leftPrice, midPrice, rightPrice, token0, token1])

  const close = useCallback(() => setOpen(false), [])

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })
  const inRange =
    leftPrice && midPrice && rightPrice && leftPrice.lessThan(midPrice) && rightPrice.greaterThan(midPrice)

  const fiatToken0 = fiatAmountsAsNumber[0] * input0?.toExact()
  const fiatToken1 = fiatAmountsAsNumber[1] * input1?.toExact()
  const totalFiat = fiatToken0 + fiatToken1

  return (
    <>
      {children({ open, setOpen })}
      <Dialog open={open} unmount={false} onClose={close} variant="opaque">
        <div className="max-w-[504px] mx-auto">
          <button onClick={close} className="pl-0 p-3">
            <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
          </button>
          <div className="flex justify-between gap-6 items-start py-2">
            <div className="flex flex-col flex-grow gap-1">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-50">
                {noLiquidity ? 'Create liquidity pool' : 'Add liquidity'}
              </h1>
              <h1 className="text-lg font-medium text-gray-600 dark:text-slate-300">
                {token0?.symbol}/{token1?.symbol}
              </h1>
            </div>
            <div>
              {token0 && token1 && (
                <Badge
                  className="border-2 border-slate-900 rounded-full z-[11] !bottom-0 left-[-15%]"
                  position="bottom-left"
                  badgeContent={
                    chainId ? (
                      <NetworkIcon chainId={chainId} width={24} height={24} />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300" />
                    )
                  }
                >
                  <Currency.IconList iconWidth={56} iconHeight={56}>
                    <Currency.Icon currency={token0} />
                    <Currency.Icon currency={token1} />
                  </Currency.IconList>
                </Badge>
              )}
            </div>
          </div>
          {/*{warningSeverity(trade?.priceImpact) >= 3 && (*/}
          {/*  <div className="rounded-xl px-4 py-3 bg-red/20 mt-4">*/}
          {/*    <span className="text-red-600 font-medium text-sm">*/}
          {/*      High price impact. You will lose a significant portion of your funds in this trade due to price impact.*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className="flex flex-col gap-5">
            <List>
              <List.Control>
                <List.KeyValue flex title="Network">
                  {Chain.from(chainId).name}
                </List.KeyValue>
                {feeAmount && <List.KeyValue title="Fee Tier">{`${+feeAmount / 10000}%`}</List.KeyValue>}
              </List.Control>
            </List>
            <List>
              <List.Label className="items-center flex justify-between gap-1 mb-[-4px]">
                Position
                <div
                  className={classNames(
                    !inRange ? 'bg-yellow/10' : 'bg-green/10',
                    'px-2 py-0.5 flex items-center gap-1 rounded-full'
                  )}
                >
                  <div className={classNames(!inRange ? 'bg-yellow' : 'bg-green', 'w-2 h-2 rounded-full')} />
                  {!inRange ? (
                    <span className="text-[10px] font-medium text-yellow-900 dark:text-yellow">Out of Range</span>
                  ) : (
                    <span className="text-[10px] font-medium text-green">In Range</span>
                  )}
                </div>
              </List.Label>
              <List.Control>
                <List.KeyValue
                  title={`Min. Price`}
                  subtitle={`Your position will be 100% composed of ${input0?.currency.symbol} at this price`}
                >
                  <div className="flex flex-col gap-1">
                    {isFullRange ? '0' : leftPrice?.toSignificant(6)} {token1?.symbol}
                    {isFullRange ? (
                      ''
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                        ${(fiatAmountsAsNumber[0] * (1 + +(minPriceDiff || 0) / 100)).toFixed(2)} (
                        {minPriceDiff.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </List.KeyValue>
                <List.KeyValue
                  title={`Max. Price`}
                  subtitle={`Your position will be 100% composed of ${token1?.symbol} at this price`}
                >
                  <div className="flex flex-col gap-1">
                    {isFullRange ? '∞' : rightPrice?.toSignificant(6)} {token1?.symbol}
                    {isFullRange ? (
                      ''
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                        ${(fiatAmountsAsNumber[0] * (1 + +(maxPriceDiff || 0) / 100)).toFixed(2)} (
                        {maxPriceDiff.toFixed(2)}%)
                      </span>
                    )}{' '}
                  </div>
                </List.KeyValue>{' '}
                <List.KeyValue
                  title={noLiquidity ? 'Starting Price' : 'Market Price'}
                  subtitle={
                    noLiquidity
                      ? `Starting price as determined by you`
                      : `Current price as determined by the ratio of the pool`
                  }
                >
                  <div className="flex flex-col gap-1">
                    {midPrice?.toSignificant(6)} {token1?.symbol}
                    <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                      ${fiatAmountsAsNumber[0].toFixed(2)}
                    </span>
                  </div>
                </List.KeyValue>
              </List.Control>
            </List>
            <List>
              <List.Label className="flex justify-between">
                Total Deposits
                <span className="font-semibold">${totalFiat?.toFixed(2)}</span>
              </List.Label>
              <List.Control>
                {input0 && (
                  <List.KeyValue flex title={`${input0?.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={input0.currency} width={18} height={18} />
                        {input0?.toSignificant(6)} {input0?.currency.symbol}
                      </div>
                      <span className="text-xs dark:text-slate-400 text-slate-600">${fiatToken0.toFixed(2)}</span>
                    </div>
                  </List.KeyValue>
                )}
                {input1 && (
                  <List.KeyValue flex title={`${input1?.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={input1.currency} width={18} height={18} />
                        {input1?.toSignificant(6)} {input1?.currency.symbol}
                      </div>
                      <span className="text-xs dark:text-slate-400 text-slate-600">${fiatToken1.toFixed(2)}</span>
                    </div>
                  </List.KeyValue>
                )}
              </List.Control>
            </List>
          </div>
          <div className="pt-6">
            <AddSectionConfirmModalConcentrated
              position={position}
              existingPosition={existingPosition}
              noLiquidity={noLiquidity}
              closeReview={close}
              token0={token0}
              token1={token1}
              chainId={chainId}
              tokenId={tokenId}
              successLink={successLink}
            >
              {({ onClick, isWritePending, isLoading, isError, error, isConfirming }) => (
                <div className="space-y-4">
                  <Button
                    fullWidth
                    size="xl"
                    loading={isLoading && !isError}
                    onClick={onClick}
                    disabled={isWritePending || Boolean(isLoading) || isError}
                    color={isError ? 'red' : 'blue'}
                  >
                    {isError ? (
                      'Shoot! Something went wrong :('
                    ) : isConfirming ? (
                      <Dots>Confirming transaction</Dots>
                    ) : isWritePending ? (
                      <Dots>Confirm Add</Dots>
                    ) : (
                      'Add Liquidity'
                    )}
                  </Button>
                  <Collapsible open={!!error}>
                    <div className="scroll bg-red/20 text-red-700 dark:bg-black/20 p-2 px-3 rounded-lg border border-slate-200/10 text-[10px] break-all max-h-[80px] overflow-y-auto">
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-ignore */}
                      <code>{error ? ('data' in error ? error?.data?.message : error.message) : ''}</code>
                    </div>
                  </Collapsible>
                </div>
              )}
            </AddSectionConfirmModalConcentrated>
          </div>
        </div>
      </Dialog>
    </>
  )
}
