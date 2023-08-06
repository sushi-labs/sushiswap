import { RadioGroup } from '@headlessui/react'
import { ArrowDownIcon, SwitchHorizontalIcon } from '@heroicons/react-v1/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { Amount, Price, tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { Fraction, Percent, ZERO } from '@sushiswap/math'
import { classNames, Currency, Dots, List } from '@sushiswap/ui'
import { DialogConfirm, DialogProvider } from '@sushiswap/ui'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import {
  FeeAmount,
  Position,
  priceToClosestTick,
  SushiSwapV3ChainId,
  SushiSwapV3Pool,
  TickMath,
} from '@sushiswap/v3-sdk'
import {
  Address,
  getMasterChefContractConfig,
  useAccount,
  useMasterChefWithdraw,
  useSushiSwapV2Pool,
  useTotalSupply,
} from '@sushiswap/wagmi'
import { useWaitForTransaction } from '@sushiswap/wagmi'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { useV3Migrate, V3MigrateContractConfig } from '@sushiswap/wagmi/future/hooks/migrate/hooks/useV3Migrate'
import { V3MigrateChainId } from '@sushiswap/wagmi/future/hooks/migrate/types'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_MIGRATE, APPROVE_TAG_UNSTAKE, Bound, Field } from 'lib/constants'
import { unwrapToken } from 'lib/functions'
import { useGraphPool, useTokenAmountDollarValues } from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import React, { FC, useMemo, useState } from 'react'

import { useConcentratedDerivedMintInfo } from '../ConcentratedLiquidityProvider'
import { SelectPricesWidget } from '../NewPositionSection'
import { SelectFeeConcentratedWidget } from '../NewPositionSection/SelectFeeConcentratedWidget'
import { usePoolPosition } from '../PoolPositionProvider'
import { usePoolPositionRewards } from '../PoolPositionRewardsProvider'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'

export const MODAL_MIGRATE_ID = 'migrate-modal'

enum PositionView {
  Staked = 'Staked',
  Unstaked = 'Unstaked',
}

export const MigrateTab: FC<{ pool: Pool }> = withCheckerRoot(({ pool }) => {
  const { address } = useAccount()
  const [positionView, setPositionView] = useState(PositionView.Staked)
  const [feeAmount, setFeeAmount] = useState<FeeAmount>(FeeAmount.LOWEST)
  const { approved } = useApproved(APPROVE_TAG_UNSTAKE)
  const [invertPrice, setInvertPrice] = useState(false)
  const [invertTokens, setInvertTokens] = useState(false)
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const {
    data: { token0: _token0, token1: _token1, liquidityToken },
  } = useGraphPool(pool)

  const {
    value0: _value0,
    value1: _value1,
    underlying0: _underlying0,
    underlying1: _underlying1,
    isLoading,
    balance,
  } = usePoolPosition()

  const [token0, token1, value0, value1, underlying0, underlying1] = useMemo(
    () =>
      invertTokens
        ? [_token1, _token0, _value1, _value0, _underlying1, _underlying0]
        : [_token0, _token1, _value0, _value1, _underlying0, _underlying1],
    [invertTokens, _token0, _token1, _value0, _value1, _underlying0, _underlying1]
  )

  const { data: pair } = useSushiSwapV2Pool(pool.chainId as SushiSwapV2ChainId, token0, token1)
  const totalSupply = useTotalSupply(liquidityToken)

  // Harvest & Withdraw
  const {
    value0: stakedValue0,
    value1: stakedValue1,
    balance: stakedBalance,
    underlying0: stakedUnderlying0,
    underlying1: stakedUnderlying1,
    isLoading: isStakedLoading,
  } = usePoolPositionStaked()
  const { pendingRewards, rewardTokens, values, isLoading: isRewardsLoading } = usePoolPositionRewards()
  const { sendTransaction, isLoading: isWritePending } = useMasterChefWithdraw({
    chainId: pool.chainId,
    amount: stakedBalance,
    pid: pool.incentives?.[0]?.pid,
    chef: pool.incentives?.[0]?.chefType,
    enabled: Boolean(
      approved && stakedBalance?.greaterThan(ZERO) && pool.incentives?.[0]?.pid && pool.incentives?.[0]?.chefType
    ),
  })

  // this is just getLiquidityValue with the fee off, but for the passed pair
  const token0Value = useMemo(
    () =>
      token0 && pair?.[1] && totalSupply && balance
        ? Amount.fromRawAmount(
            token0?.wrapped,
            (balance[FundSource.WALLET].quotient *
              (token0.wrapped.equals(pair[1].token0) ? pair[1].reserve0.quotient : pair[1].reserve1.quotient)) /
              totalSupply.quotient
          )
        : undefined,
    [token0, pair, totalSupply, balance]
  )

  const token1Value = useMemo(
    () =>
      token1 && pair?.[1]?.reserve1 && totalSupply && balance
        ? Amount.fromRawAmount(
            token1?.wrapped,
            (balance[FundSource.WALLET].quotient *
              (token1.wrapped.equals(pair[1].token1) ? pair[1].reserve1.quotient : pair[1].reserve0.quotient)) /
              totalSupply.quotient
          )
        : undefined,
    [token1, pair, totalSupply, balance]
  )

  const {
    ticks,
    invalidRange,
    pool: v3Pool,
    parsedAmounts,
    pricesAtTicks,
    ticksAtLimit,
    price,
    noLiquidity,
    outOfRange,
  } = useConcentratedDerivedMintInfo({
    chainId: pool.chainId as SushiSwapV3ChainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition: undefined,
  })

  const v3Address =
    token0 && token1 && feeAmount ? SushiSwapV3Pool.getAddress(token0.wrapped, token1.wrapped, feeAmount) : undefined
  const v3SpotPrice = useMemo(() => (v3Pool ? v3Pool?.token0Price : undefined), [v3Pool])
  const v2SpotPrice = useMemo(
    () =>
      _token0 && _token1 && pair?.[1]?.reserve0 && pair?.[1]?.reserve1
        ? new Price(_token0.wrapped, _token1.wrapped, pair[1].reserve0.quotient, pair[1].reserve1.quotient)
        : undefined,
    [_token0, _token1, pair]
  )

  let priceDifferenceFraction: Fraction | undefined =
    v2SpotPrice && v3SpotPrice ? v3SpotPrice.divide(v2SpotPrice).subtract(1).multiply(100) : undefined
  if (priceDifferenceFraction?.lessThan(ZERO)) {
    priceDifferenceFraction = priceDifferenceFraction.multiply(-1)
  }

  const largePriceDifference = priceDifferenceFraction && !priceDifferenceFraction?.lessThan(2n)

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  // the v3 tick is either the pool's tickCurrent, or the tick closest to the v2 spot price
  const tick = v3Pool?.tickCurrent ?? (v2SpotPrice ? priceToClosestTick(v2SpotPrice) : undefined)
  // the price is either the current v3 price, or the price at the tick
  const sqrtPrice = v3Pool?.sqrtRatioX96 ?? (tick ? TickMath.getSqrtRatioAtTick(tick) : undefined)

  const position = useMemo(
    () =>
      typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      !invalidRange &&
      token0 &&
      token1 &&
      token0Value &&
      token1Value &&
      sqrtPrice &&
      tick
        ? Position.fromAmounts({
            pool: v3Pool ?? new SushiSwapV3Pool(token0.wrapped, token1.wrapped, feeAmount, sqrtPrice, 0, tick, []),
            tickLower,
            tickUpper,
            amount0: token0.wrapped.sortsBefore(token1.wrapped) ? token0Value.quotient : token1Value.quotient,
            amount1: token0.wrapped.sortsBefore(token1.wrapped) ? token1Value.quotient : token0Value.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : undefined,
    [feeAmount, invalidRange, sqrtPrice, tick, tickLower, tickUpper, token0, token0Value, token1, token1Value, v3Pool]
  )

  const { amount0: v3Amount0Min, amount1: v3Amount1Min } = useMemo(
    () => (position ? position.mintAmountsWithSlippage(slippagePercent) : { amount0: undefined, amount1: undefined }),
    [position, slippagePercent]
  )

  const [positionAmount0, positionAmount1] = useMemo(
    () => (invertTokens ? [position?.amount1, position?.amount0] : [position?.amount0, position?.amount1]),
    [invertTokens, position?.amount0, position?.amount1]
  )

  const refund0 = useMemo(
    () =>
      positionAmount0 &&
      token0 &&
      token0Value &&
      Amount.fromRawAmount(token0, token0Value.quotient - positionAmount0.quotient),
    [positionAmount0, token0, token0Value]
  )

  const refund1 = useMemo(
    () =>
      positionAmount1 &&
      token1 &&
      token1Value &&
      Amount.fromRawAmount(token1, token1Value.quotient - positionAmount1.quotient),
    [positionAmount1, token1, token1Value]
  )

  const [v3FiatValue0, v3FiatValue1, refund0FiatValue, refund1FiatValue] = useTokenAmountDollarValues({
    chainId: pool.chainId as SushiSwapV3ChainId,
    amounts: [positionAmount0, positionAmount1, refund0, refund1],
  })

  const { [Field.CURRENCY_A]: input0, [Field.CURRENCY_B]: input1 } = parsedAmounts
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const isSorted = token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
  const leftPrice = useMemo(() => (isSorted ? priceLower : priceUpper?.invert()), [isSorted, priceLower, priceUpper])
  const rightPrice = useMemo(() => (isSorted ? priceUpper : priceLower?.invert()), [isSorted, priceLower, priceUpper])
  const midPrice = useMemo(() => (isSorted ? price : price?.invert()), [isSorted, price])
  const isFullRange = Boolean(ticksAtLimit[Bound.LOWER] && ticksAtLimit[Bound.UPPER])

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId: pool.chainId, amounts: fiatAmounts })

  const { approved: approvedMigrate } = useApproved(APPROVE_TAG_MIGRATE)
  const { data: deadline } = useTransactionDeadline({ chainId: pool.chainId as ChainId })

  const {
    writeAsync,
    isLoading: isMigrateLoading,
    isError,
    data,
  } = useV3Migrate({
    account: address,
    args: {
      pair: pool.address as Address,
      liquidityToMigrate: balance?.[FundSource.WALLET],
      percentageToMigrate: 100,
      token0: _token0?.wrapped,
      token1: _token1?.wrapped,
      fee: feeAmount,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0Min: v3Amount0Min,
      amount1Min: v3Amount1Min,
      recipient: address,
      deadline,
      refundAsETH: true,
      sqrtPrice,
      noLiquidity,
    },
    chainId: pool.chainId as V3MigrateChainId,
    enabled: approvedMigrate,
  })

  const { status } = useWaitForTransaction({ chainId: pool.chainId as SushiSwapV3ChainId, hash: data?.hash })

  return (
    <DialogProvider>
      <div className="flex gap-6 col-span-2">
        {v2SpotPrice && (
          <div className="flex flex-col col-span-2 gap-2">
            <List.Label className="!px-0">V2 Price</List.Label>
            {token0 && token1 && pool ? (
              <div
                onClick={() => setInvertPrice((prev) => !prev)}
                role="button"
                className="flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
              >
                <SwitchHorizontalIcon width={16} height={16} />
                <div className="flex items-baseline gap-1.5">
                  1 {invertPrice ? _token1.symbol : _token0.symbol} ={' '}
                  {invertPrice
                    ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${_token0.symbol}`
                    : `${v2SpotPrice?.toSignificant(6)} ${_token1.symbol}`}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
        {v3SpotPrice && (
          <div className="flex flex-col col-span-2 gap-2">
            <List.Label className="!px-0">V3 Price</List.Label>
            {token0 && token1 && pool ? (
              <div
                onClick={() => setInvertPrice((prev) => !prev)}
                role="button"
                className="flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
              >
                <SwitchHorizontalIcon width={16} height={16} />
                <div className="flex items-baseline gap-1.5">
                  1 {invertPrice ? _token1.symbol : _token0.symbol} ={' '}
                  {invertPrice
                    ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${_token0.symbol}`
                    : `${v3SpotPrice?.toSignificant(6)} ${_token1.symbol}`}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6 sm:order-2">
        <List className="!pt-10">
          <div className="flex justify-end">
            {stakedBalance?.greaterThan(ZERO) && (
              <List.Label>
                <RadioGroup value={positionView} onChange={setPositionView} className="flex gap-3">
                  <RadioGroup.Option value={PositionView.Staked}>
                    {({ checked }) => (
                      <button type="button" className={classNames(checked ? 'text-blue' : '', 'font-semibold text-xs')}>
                        Staked
                      </button>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value={PositionView.Unstaked}>
                    {({ checked }) => (
                      <button type="button" className={classNames(checked ? 'text-blue' : '', 'font-semibold text-xs')}>
                        Unstaked
                      </button>
                    )}
                  </RadioGroup.Option>
                </RadioGroup>
              </List.Label>
            )}
          </div>
          <List.Control>
            <List.KeyValue flex title={<span className="text-base font-semibold">Position Value</span>}>
              <span className="text-base font-semibold">
                {formatUSD(
                  positionView === PositionView.Staked && stakedBalance?.greaterThan(ZERO)
                    ? stakedValue0 + stakedValue1
                    : value0 + value1
                )}
              </span>
            </List.KeyValue>
            {isLoading || isStakedLoading ? (
              <List.KeyValue skeleton />
            ) : token0 ? (
              <>
                <List.KeyValue flex title={`${token0.symbol}`} className="!items-start">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={unwrapToken(token0)} width={18} height={18} />
                      {(positionView === PositionView.Staked && stakedBalance?.greaterThan(ZERO)
                        ? stakedUnderlying0
                        : underlying0
                      )?.toSignificant(6)}{' '}
                      {unwrapToken(token0).symbol}
                    </div>
                    <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                      {formatUSD(
                        positionView === PositionView.Staked && stakedBalance?.greaterThan(ZERO) ? stakedValue0 : value0
                      )}
                    </span>
                  </div>
                </List.KeyValue>
              </>
            ) : (
              <></>
            )}
            {isLoading || isStakedLoading ? (
              <List.KeyValue skeleton />
            ) : token1 ? (
              <List.KeyValue flex title={`${token1.symbol}`} className="!items-start">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <Currency.Icon currency={unwrapToken(token1)} width={18} height={18} />
                    {(positionView === PositionView.Staked && stakedBalance?.greaterThan(ZERO)
                      ? stakedUnderlying1
                      : underlying1
                    )?.toSignificant(6)}{' '}
                    {unwrapToken(token1).symbol}
                  </div>
                  <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                    {formatUSD(
                      positionView === PositionView.Staked && stakedBalance?.greaterThan(ZERO) ? stakedValue1 : value1
                    )}
                  </span>
                </div>
              </List.KeyValue>
            ) : (
              <></>
            )}
          </List.Control>
        </List>
        {stakedBalance?.greaterThan(ZERO) && (
          <>
            <List>
              <div className="flex justify-between">
                <List.Label>Rewards</List.Label>
                <List.Label>{formatUSD(values.reduce((sum, value) => sum + value, 0))}</List.Label>
              </div>
              <List.Control>
                {isRewardsLoading ? (
                  <>
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                  </>
                ) : (
                  pendingRewards?.map((reward, i) => (
                    <List.KeyValue
                      key={reward?.currency.id}
                      flex
                      title={`${unwrapToken(rewardTokens[i]).symbol}`}
                      className="!items-start"
                    >
                      <div className="flex items-center gap-0.5">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={unwrapToken(rewardTokens[i])} width={18} height={18} />
                          {reward?.toSignificant(6)} {unwrapToken(rewardTokens[i]).symbol}
                          <span className="text-gray-600 dark:text-slate-400">({formatUSD(values[i])})</span>
                        </div>
                      </div>
                    </List.KeyValue>
                  ))
                )}
              </List.Control>
            </List>
            <div className="p-6 font-medium bg-blue/10 text-blue rounded-xl">
              You have staked liquidity balance. Please unstake and claim your rewards before migrating.
            </div>
            <Checker.Connect fullWidth>
              <Checker.Network fullWidth chainId={pool.chainId}>
                <Checker.ApproveERC20
                  fullWidth
                  id="approve-token0"
                  amount={stakedBalance}
                  contract={getMasterChefContractConfig(pool.chainId, pool.incentives[0].chefType)?.address}
                  enabled={Boolean(getMasterChefContractConfig(pool.chainId, pool.incentives[0].chefType)?.address)}
                >
                  <Checker.Success tag={APPROVE_TAG_UNSTAKE}>
                    <Button
                      size="xl"
                      onClick={() => sendTransaction?.()}
                      disabled={!approved || isWritePending}
                      testId="unstake-liquidity"
                    >
                      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Unstake & Claim Rewards'}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.Network>
            </Checker.Connect>
          </>
        )}

        {(token0Value?.greaterThan(ZERO) || token1Value?.greaterThan(ZERO)) && position && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-center w-full">
              <ArrowDownIcon width={20} height={20} />
            </div>
            <List>
              <List.Control>
                <List.KeyValue flex title={<span className="text-base font-semibold">Migration</span>}>
                  <span className="text-base font-semibold">{formatUSD(v3FiatValue0 + v3FiatValue1)}</span>
                </List.KeyValue>
                {positionAmount0 && (
                  <List.KeyValue flex title={`${positionAmount0.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(positionAmount0.currency)} width={18} height={18} />
                        {positionAmount0.toSignificant(6)} {unwrapToken(positionAmount0.currency).symbol}
                      </div>
                      <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                        {formatUSD(v3FiatValue0)}
                      </span>
                    </div>
                  </List.KeyValue>
                )}
                {positionAmount1 && (
                  <List.KeyValue flex title={`${positionAmount1.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(positionAmount1.currency)} width={18} height={18} />
                        {positionAmount1.toSignificant(6)} {unwrapToken(positionAmount1.currency).symbol}
                      </div>
                      <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                        {formatUSD(v3FiatValue1)}
                      </span>
                    </div>
                  </List.KeyValue>
                )}
                <div className="p-4">
                  <div className="h-0.5 w-full bg-gray-100 dark:bg-slate-200/5" />
                </div>
                <List.KeyValue flex title={<span className="text-base font-semibold">Refund</span>}>
                  <span className="text-base font-semibold">{formatUSD(refund0FiatValue + refund1FiatValue)}</span>
                </List.KeyValue>
                {token0Value && (
                  <List.KeyValue flex title={`${token0Value.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(token0Value.currency)} width={18} height={18} />
                        {refund0?.toSignificant(6) ?? '0.00'} {unwrapToken(token0Value.currency).symbol}
                      </div>
                      <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                        {formatUSD(refund0FiatValue)}
                      </span>
                    </div>
                  </List.KeyValue>
                )}
                {token1Value && (
                  <List.KeyValue flex title={`${token1Value.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(token1Value.currency)} width={18} height={18} />
                        {refund1?.toSignificant(6) ?? '0.00'} {unwrapToken(token1Value.currency).symbol}
                      </div>
                      <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                        {formatUSD(refund1FiatValue)}
                      </span>
                    </div>
                  </List.KeyValue>
                )}
              </List.Control>
            </List>
          </div>
        )}
      </div>
      <div
        className={classNames(
          stakedBalance?.greaterThan(ZERO) ? 'opacity-40 pointer-events-none' : '',
          'flex flex-col order-3 gap-[64px] pb-40 sm:order-1'
        )}
      >
        <SelectFeeConcentratedWidget
          setFeeAmount={setFeeAmount}
          feeAmount={feeAmount}
          token0={token0}
          token1={token1}
        />
        <div className="flex flex-col gap-6">
          <SelectPricesWidget
            chainId={pool.chainId as SushiSwapV3ChainId}
            token0={token0}
            token1={token1}
            feeAmount={feeAmount}
            tokenId={undefined}
            showStartPrice={false}
            switchTokens={() => setInvertTokens((prev) => !prev)}
          >
            {outOfRange && (
              <div className="p-6 font-medium bg-yellow/10 text-yellow rounded-xl">
                Your position will not earn fees or be used in trades until the market price moves into your range.
              </div>
            )}
            {invalidRange && (
              <div className="p-6 font-medium bg-yellow/10 text-yellow rounded-xl">
                Invalid range selected. The minimum price must be lower than the maximum price.
              </div>
            )}
            {largePriceDifference && (
              <div className="p-6 font-medium bg-yellow/10 text-yellow rounded-xl">
                You should only deposit liquidity into SushiSwap V3 at a price you believe is correct. <br />
                If the price seems incorrect, you can either make a swap to move the price or wait for someone else to
                do so.
              </div>
            )}
          </SelectPricesWidget>
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={pool.chainId}>
              <Checker.Guard guardWhen={!balance?.[FundSource.WALLET].greaterThan(ZERO)} guardText="Not enough balance">
                <Checker.Guard
                  guardWhen={Boolean(!position || positionAmount0?.equalTo(ZERO) || positionAmount1?.equalTo(ZERO))}
                  guardText="Enter valid range"
                >
                  <Checker.ApproveERC20
                    fullWidth
                    id="approve-token0"
                    amount={balance?.[FundSource.WALLET] ?? undefined}
                    contract={V3MigrateContractConfig(pool.chainId as V3MigrateChainId).address}
                    enabled={Boolean(V3MigrateContractConfig(pool.chainId as V3MigrateChainId).address)}
                  >
                    <Checker.Success tag={APPROVE_TAG_MIGRATE}>
                      <DialogReview>
                        {({ confirm }) => (
                          <>
                            <DialogTrigger asChild>
                              <Button fullWidth size="xl" testId="swap">
                                Incentivize pool
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Migrate Liquidity</DialogTitle>
                                <DialogDescription>
                                  {token0?.symbol}/{token1?.symbol} • SushiSwap V3 • {feeAmount / 10000}%
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col gap-4">
                                <List className="!pt-0">
                                  <List.Control>
                                    <List.KeyValue flex title="Network">
                                      {Chain.from(pool.chainId).name}
                                    </List.KeyValue>
                                    {feeAmount && (
                                      <List.KeyValue title="Fee Tier">{`${+feeAmount / 10000}%`}</List.KeyValue>
                                    )}
                                  </List.Control>
                                </List>
                                <List className="!pt-0">
                                  <List.Control>
                                    <List.KeyValue
                                      flex
                                      title={'Minimum Price'}
                                      subtitle={`Your position will be 100% composed of ${input0?.currency.symbol} at this price`}
                                    >
                                      <div className="flex flex-col gap-1">
                                        {isFullRange ? '0' : leftPrice?.toSignificant(6)} {token1?.symbol}
                                      </div>
                                    </List.KeyValue>
                                    <List.KeyValue
                                      flex
                                      title={noLiquidity ? 'Starting Price' : 'Market Price'}
                                      subtitle={
                                        noLiquidity
                                          ? 'Starting price as determined by you'
                                          : 'Current price as determined by the ratio of the pool'
                                      }
                                    >
                                      <div className="flex flex-col gap-1">
                                        {midPrice?.toSignificant(6)} {token1?.symbol}
                                        <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                                          ${fiatAmountsAsNumber[0].toFixed(2)}
                                        </span>
                                      </div>
                                    </List.KeyValue>
                                    <List.KeyValue
                                      flex
                                      title="Maximum Price"
                                      subtitle={`Your position will be 100% composed of ${token1?.symbol} at this price`}
                                    >
                                      <div className="flex flex-col gap-1">
                                        {isFullRange ? '∞' : rightPrice?.toSignificant(6)} {token1?.symbol}
                                      </div>
                                    </List.KeyValue>{' '}
                                  </List.Control>
                                </List>
                                <List className="!pt-0">
                                  <List.Control>
                                    {positionAmount0 && (
                                      <List.KeyValue
                                        flex
                                        title={'Migration'}
                                        subtitle="The value of your position after migration"
                                        className="!items-start"
                                      >
                                        <div className="flex flex-col gap-0.5">
                                          <div className="flex items-center gap-2">
                                            <Currency.Icon
                                              currency={unwrapToken(positionAmount0.currency)}
                                              width={18}
                                              height={18}
                                            />
                                            {positionAmount0.toSignificant(6)}{' '}
                                            {unwrapToken(positionAmount0.currency).symbol}
                                          </div>
                                          <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                                            {formatUSD(v3FiatValue0)}
                                          </span>
                                        </div>
                                      </List.KeyValue>
                                    )}
                                    {positionAmount1 && (
                                      <List.KeyValue flex title={''} className="!items-start">
                                        <div className="flex flex-col gap-0.5">
                                          <div className="flex items-center gap-2">
                                            <Currency.Icon
                                              currency={unwrapToken(positionAmount1.currency)}
                                              width={18}
                                              height={18}
                                            />
                                            {positionAmount1.toSignificant(6)}{' '}
                                            {unwrapToken(positionAmount1.currency).symbol}
                                          </div>
                                          <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                                            {formatUSD(v3FiatValue1)}
                                          </span>
                                        </div>
                                      </List.KeyValue>
                                    )}
                                    <div className="p-4">
                                      <div className="h-0.5 w-full bg-gray-100 dark:bg-slate-200/5" />
                                    </div>
                                    {token0Value && (
                                      <List.KeyValue
                                        flex
                                        title={'Refund'}
                                        subtitle="The refund you receive after migration"
                                        className="!items-start"
                                      >
                                        <div className="flex flex-col gap-0.5">
                                          <div className="flex items-center gap-2">
                                            <Currency.Icon
                                              currency={unwrapToken(token0Value.currency)}
                                              width={18}
                                              height={18}
                                            />
                                            {refund0?.toSignificant(6) ?? '0.00'}{' '}
                                            {unwrapToken(token0Value.currency).symbol}
                                          </div>
                                          <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                                            {formatUSD(refund0FiatValue)}
                                          </span>
                                        </div>
                                      </List.KeyValue>
                                    )}
                                    {token1Value && (
                                      <List.KeyValue flex title={''} className="!items-start">
                                        <div className="flex flex-col gap-0.5">
                                          <div className="flex items-center gap-2">
                                            <Currency.Icon
                                              currency={unwrapToken(token1Value.currency)}
                                              width={18}
                                              height={18}
                                            />
                                            {refund1?.toSignificant(6) ?? '0.00'}{' '}
                                            {unwrapToken(token1Value.currency).symbol}
                                          </div>
                                          <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                                            {formatUSD(refund1FiatValue)}
                                          </span>
                                        </div>
                                      </List.KeyValue>
                                    )}
                                  </List.Control>
                                </List>
                              </div>
                              <DialogFooter>
                                <Button
                                  fullWidth
                                  size="xl"
                                  loading={isLoading && !isError}
                                  onClick={() => writeAsync?.().then(() => confirm())}
                                  disabled={isMigrateLoading || isError}
                                  color={isError ? 'red' : 'blue'}
                                  testId="unstake-liquidity"
                                >
                                  {isError ? (
                                    'Shoot! Something went wrong :('
                                  ) : isMigrateLoading ? (
                                    <Dots>Confirm Migrate</Dots>
                                  ) : (
                                    'Confirm Migrate'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </>
                        )}
                      </DialogReview>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Guard>
              </Checker.Guard>
            </Checker.Network>
          </Checker.Connect>
        </div>
      </div>
      {pool && token0 && token1 ? (
        <DialogConfirm
          chainId={pool.chainId as SushiSwapV3ChainId}
          status={status}
          testId="migrate-confirmation-modal"
          successMessage={`Successfully migrated your ${token0.symbol}/${token1.symbol} position`}
          buttonText="Go to pool"
          buttonLink={`/pools/${pool.chainId}:${v3Address}?activeTab=myPositions`}
          txHash={data?.hash}
        />
      ) : null}
    </DialogProvider>
  )
})
