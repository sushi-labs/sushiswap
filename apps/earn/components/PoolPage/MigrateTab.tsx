import { List } from '@sushiswap/ui/future/components/list/List'
import { Fraction, JSBI, Percent, ZERO } from '@sushiswap/math'
import { RadioGroup } from '@headlessui/react'
import { classNames, Dots } from '@sushiswap/ui'
import { formatUSD } from '@sushiswap/format'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { unwrapToken } from '../../lib/functions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { getMasterChefContractConfig, useMasterChefWithdraw, usePair, useTotalSupply } from '@sushiswap/wagmi'
import { APPROVE_TAG_MIGRATE, APPROVE_TAG_UNSTAKE, Bound, Field } from '../../lib/constants'
import { Button } from '@sushiswap/ui/future/components/button'
import { SelectFeeConcentratedWidget } from '../NewPositionSection/SelectFeeConcentratedWidget'
import { SelectPricesWidget } from '../NewPositionSection'
import {
  FeeAmount,
  Pool as V3Pool,
  Position,
  priceToClosestTick,
  TickMath,
  SushiSwapV3ChainId,
} from '@sushiswap/v3-sdk'
import React, { FC, useMemo, useState } from 'react'
import { useGraphPool, useTokenAmountDollarValues } from '../../lib/hooks'
import { Pool } from '@sushiswap/client'
import { usePoolPosition } from '../PoolPositionProvider'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { usePoolPositionRewards } from '../PoolPositionRewardsProvider'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useV3Migrate, V3MigrateContractConfig } from '@sushiswap/wagmi/future/hooks/migrate/hooks/useV3Migrate'
import { Address, useAccount } from '@sushiswap/wagmi'
import { Amount, Price, tryParseAmount } from '@sushiswap/currency'
import { useConcentratedDerivedMintInfo } from '../ConcentratedLiquidityProvider'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { ArrowDownIcon, ArrowLeftIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { FundSource } from '@sushiswap/hooks'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { Chain, ChainId } from '@sushiswap/chain'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { TxStatusModalContent } from '@sushiswap/wagmi/future/components/TxStatusModal'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { useRouter } from 'next/router'

export const MODAL_MIGRATE_ID = 'migrate-modal'

enum PositionView {
  staked,
  unstaked,
}

export const MigrateTab: FC<{ pool: Pool }> = withCheckerRoot(({ pool }) => {
  const { push } = useRouter()
  const { address } = useAccount()
  const [positionView, setPositionView] = useState(PositionView.staked)
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

  const { data: pair } = usePair(pool.chainId as SushiSwapV2ChainId, token0, token1)
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
            JSBI.divide(
              JSBI.multiply(
                balance[FundSource.WALLET].quotient,
                token0.wrapped.equals(pair[1].token0) ? pair[1].reserve0.quotient : pair[1].reserve1.quotient
              ),
              totalSupply.quotient
            )
          )
        : undefined,
    [token0, pair, totalSupply, balance]
  )

  const token1Value = useMemo(
    () =>
      token1 && pair?.[1]?.reserve1 && totalSupply && balance
        ? Amount.fromRawAmount(
            token1?.wrapped,
            JSBI.divide(
              JSBI.multiply(
                balance[FundSource.WALLET].quotient,
                token1.wrapped.equals(pair[1].token1) ? pair[1].reserve1.quotient : pair[1].reserve0.quotient
              ),
              totalSupply.quotient
            )
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
    token0 && token1 && feeAmount ? V3Pool.getAddress(token0.wrapped, token1.wrapped, feeAmount) : undefined
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

  const largePriceDifference = priceDifferenceFraction && !priceDifferenceFraction?.lessThan(JSBI.BigInt(2))

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
            pool: v3Pool ?? new V3Pool(token0.wrapped, token1.wrapped, feeAmount, sqrtPrice, 0, tick, []),
            tickLower,
            tickUpper,
            amount0: token0.wrapped.sortsBefore(token1.wrapped) ? token0Value.quotient : token1Value.quotient,
            amount1: token0.wrapped.sortsBefore(token1.wrapped) ? token1Value.quotient : token0Value.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : undefined,
    [feeAmount, invalidRange, sqrtPrice, tick, tickLower, tickUpper, token0, token0Value, token1, token1Value, v3Pool]
  )

  const { amount0, amount1 } = useMemo(
    () => (position ? position.mintAmountsWithSlippage(slippagePercent) : { amount0: undefined, amount1: undefined }),
    [position, slippagePercent]
  )

  const [positionAmount0, positionAmount1, v3Amount0Min, v3Amount1Min] = useMemo(
    () =>
      invertTokens
        ? [position?.amount1, position?.amount0, amount1, amount0]
        : [position?.amount0, position?.amount1, amount0, amount1],
    [invertTokens, position?.amount0, position?.amount1, amount0, amount1]
  )

  const refund0 = useMemo(
    () =>
      positionAmount0 &&
      token0 &&
      token0Value &&
      Amount.fromRawAmount(token0, JSBI.subtract(token0Value.quotient, positionAmount0.quotient)),
    [token0Value, position, token0]
  )

  const refund1 = useMemo(
    () =>
      positionAmount1 &&
      token1 &&
      token1Value &&
      Amount.fromRawAmount(token1, JSBI.subtract(token1Value.quotient, positionAmount1.quotient)),
    [token1Value, position, token1]
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

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!midPrice || !token0 || !token1 || !leftPrice || !rightPrice) return [0, 0]
    const min = +leftPrice?.toFixed(4)
    const cur = +midPrice?.toFixed(4)
    const max = +rightPrice?.toFixed(4)

    return [((min - cur) / cur) * 100, ((max - cur) / cur) * 100]
  }, [leftPrice, midPrice, rightPrice, token0, token1])

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
      token0: token0?.wrapped,
      token1: token1?.wrapped,
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
    chainId: pool.chainId as SushiSwapV3ChainId,
    enabled: approvedMigrate,
  })

  return (
    <>
      <div className="flex gap-6 col-span-2">
        {v2SpotPrice && (
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">V2 Price</List.Label>
            {token0 && token1 && pool ? (
              <div
                onClick={() => setInvertPrice((prev) => !prev)}
                role="button"
                className="flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
              >
                <SwitchHorizontalIcon width={16} height={16} />
                <div className="flex items-baseline gap-1.5">
                  1 {invertPrice ? token1.symbol : token0.symbol} ={' '}
                  {invertPrice
                    ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${token0.symbol}`
                    : `${v2SpotPrice?.toSignificant(6)} ${token1.symbol}`}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
        {v3SpotPrice && (
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">V3 Price</List.Label>
            {token0 && token1 && pool ? (
              <div
                onClick={() => setInvertPrice((prev) => !prev)}
                role="button"
                className="flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
              >
                <SwitchHorizontalIcon width={16} height={16} />
                <div className="flex items-baseline gap-1.5">
                  1 {invertPrice ? token1.symbol : token0.symbol} ={' '}
                  {invertPrice
                    ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${token0.symbol}`
                    : `${v3SpotPrice?.toSignificant(6)} ${token1.symbol}`}
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
                  <RadioGroup.Option value={PositionView.staked}>
                    {({ checked }) => (
                      <button className={classNames(checked ? 'text-blue' : '', 'font-semibold text-xs')}>
                        Staked
                      </button>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value={PositionView.unstaked}>
                    {({ checked }) => (
                      <button className={classNames(checked ? 'text-blue' : '', 'font-semibold text-xs')}>
                        Unstaked
                      </button>
                    )}
                  </RadioGroup.Option>
                </RadioGroup>
              </List.Label>
            )}
          </div>
          <List.Control>
            <List.KeyValue flex title={<span className="font-semibold text-base">Position Value</span>}>
              <span className="font-semibold text-base">
                {formatUSD(
                  positionView === PositionView.staked && stakedBalance?.greaterThan(ZERO)
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
                      {(positionView === PositionView.staked && stakedBalance?.greaterThan(ZERO)
                        ? stakedUnderlying0
                        : underlying0
                      )?.toSignificant(6)}{' '}
                      {unwrapToken(token0).symbol}
                    </div>
                    <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                      {formatUSD(
                        positionView === PositionView.staked && stakedBalance?.greaterThan(ZERO) ? stakedValue0 : value0
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
                    {(positionView === PositionView.staked && stakedBalance?.greaterThan(ZERO)
                      ? stakedUnderlying1
                      : underlying1
                    )?.toSignificant(6)}{' '}
                    {unwrapToken(token1).symbol}
                  </div>
                  <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                    {formatUSD(
                      positionView === PositionView.staked && stakedBalance?.greaterThan(ZERO) ? stakedValue1 : value1
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
                      key={i}
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
            <Checker.Connect size="xl" fullWidth>
              <Checker.Network size="xl" fullWidth chainId={pool.chainId}>
                <Checker.ApproveERC20
                  size="xl"
                  fullWidth
                  id="approve-token0"
                  amount={stakedBalance}
                  contract={getMasterChefContractConfig(pool.chainId, pool.incentives[0].chefType)?.address}
                  enabled={Boolean(getMasterChefContractConfig(pool.chainId, pool.incentives[0].chefType)?.address)}
                >
                  <Checker.Success tag={APPROVE_TAG_UNSTAKE}>
                    <Button
                      onClick={() => sendTransaction?.()}
                      fullWidth
                      size="xl"
                      variant="filled"
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
            <div className="w-full flex justify-center">
              <ArrowDownIcon width={20} height={20} />
            </div>
            <List>
              <List.Control>
                <List.KeyValue flex title={<span className="font-semibold text-base">Migration</span>}>
                  <span className="font-semibold text-base">{formatUSD(v3FiatValue0 + v3FiatValue1)}</span>
                </List.KeyValue>
                {positionAmount0 && (
                  <List.KeyValue flex title={`${positionAmount0.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(positionAmount0.currency)} width={18} height={18} />
                        {positionAmount0.toSignificant(6)} {unwrapToken(positionAmount0.currency).symbol}
                      </div>
                      <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
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
                      <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                        {formatUSD(v3FiatValue1)}
                      </span>
                    </div>
                  </List.KeyValue>
                )}
                <div className="p-4">
                  <div className="h-0.5 w-full bg-gray-100 dark:bg-slate-200/5" />
                </div>
                <List.KeyValue flex title={<span className="font-semibold text-base">Refund</span>}>
                  <span className="font-semibold text-base">{formatUSD(refund0FiatValue + refund1FiatValue)}</span>
                </List.KeyValue>
                {token0Value && (
                  <List.KeyValue flex title={`${token0Value.currency.symbol}`} className="!items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(token0Value.currency)} width={18} height={18} />
                        {refund0?.toSignificant(6) ?? '0.00'} {unwrapToken(token0Value.currency).symbol}
                      </div>
                      <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
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
                      <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
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
          <Checker.Connect size="xl" fullWidth>
            <Checker.Network size="xl" fullWidth chainId={pool.chainId}>
              <Checker.Custom
                showGuardIfTrue={!balance?.[FundSource.WALLET].greaterThan(ZERO)}
                guard={
                  <Button size="xl" fullWidth>
                    Not enough balance
                  </Button>
                }
              >
                <Checker.Custom
                  showGuardIfTrue={Boolean(
                    !position || positionAmount0?.equalTo(ZERO) || positionAmount1?.equalTo(ZERO)
                  )}
                  guard={
                    <Button size="xl" fullWidth>
                      Enter valid range
                    </Button>
                  }
                >
                  <Checker.ApproveERC20
                    size="xl"
                    fullWidth
                    id="approve-token0"
                    amount={balance?.[FundSource.WALLET] ?? undefined}
                    contract={V3MigrateContractConfig(pool.chainId as SushiSwapV3ChainId).address}
                    enabled={Boolean(V3MigrateContractConfig(pool.chainId as SushiSwapV3ChainId).address)}
                  >
                    <Checker.Success tag={APPROVE_TAG_MIGRATE}>
                      <Modal.Trigger tag={MODAL_MIGRATE_ID}>
                        {({ open }) => (
                          <Button onClick={open} fullWidth size="xl" variant="filled" testId="unstake-liquidity">
                            Migrate
                          </Button>
                        )}
                      </Modal.Trigger>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Custom>
              </Checker.Custom>
            </Checker.Network>
          </Checker.Connect>
        </div>
      </div>
      <Modal.Review tag={MODAL_MIGRATE_ID} variant="opaque">
        {({ close, confirm }) => (
          <div className="max-w-[504px] mx-auto">
            <button onClick={close} className="p-3 pl-0">
              <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
            </button>
            <div className="flex items-start justify-between gap-4 py-2">
              <div className="flex flex-col flex-grow gap-1">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-50">Migrate Liquidity</h1>
                <h1 className="text-lg font-medium text-gray-600 dark:text-slate-300">
                  {token0?.symbol}/{token1?.symbol} • SushiSwap V3 • {feeAmount / 10000}%
                </h1>
              </div>
              <div>
                {token0 && token1 && (
                  <Currency.IconList iconWidth={56} iconHeight={56}>
                    <Currency.Icon currency={token0} width={56} height={56} />
                    <Currency.Icon currency={token1} width={56} height={56} />
                  </Currency.IconList>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <List>
                <List.Control>
                  <List.KeyValue flex title="Network">
                    {Chain.from(pool.chainId).name}
                  </List.KeyValue>
                  {feeAmount && <List.KeyValue title="Fee Tier">{`${+feeAmount / 10000}%`}</List.KeyValue>}
                </List.Control>
              </List>
              <List>
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
              <List>
                <List.Control>
                  {positionAmount0 && (
                    <List.KeyValue
                      flex
                      title={`Migration`}
                      subtitle="The value of your position after migration"
                      className="!items-start"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={unwrapToken(positionAmount0.currency)} width={18} height={18} />
                          {positionAmount0.toSignificant(6)} {unwrapToken(positionAmount0.currency).symbol}
                        </div>
                        <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                          {formatUSD(v3FiatValue0)}
                        </span>
                      </div>
                    </List.KeyValue>
                  )}
                  {positionAmount1 && (
                    <List.KeyValue flex title={``} className="!items-start">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={unwrapToken(positionAmount1.currency)} width={18} height={18} />
                          {positionAmount1.toSignificant(6)} {unwrapToken(positionAmount1.currency).symbol}
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
                      title={`Refund`}
                      subtitle="The refund you receive after migration"
                      className="!items-start"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={unwrapToken(token0Value.currency)} width={18} height={18} />
                          {refund0?.toSignificant(6) ?? '0.00'} {unwrapToken(token0Value.currency).symbol}
                        </div>
                        <span className="text-gray-600 dark:text-slate-400 text-xs font-normal">
                          {formatUSD(refund0FiatValue)}
                        </span>
                      </div>
                    </List.KeyValue>
                  )}
                  {token1Value && (
                    <List.KeyValue flex title={``} className="!items-start">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Currency.Icon currency={unwrapToken(token1Value.currency)} width={18} height={18} />
                          {refund1?.toSignificant(6) ?? '0.00'} {unwrapToken(token1Value.currency).symbol}
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
            <div className="pt-4">
              <div className="space-y-4">
                <Button
                  fullWidth
                  size="xl"
                  loading={isLoading && !isError}
                  onClick={() => writeAsync?.().then(() => confirm())}
                  disabled={isMigrateLoading || isError}
                  color={isError ? 'red' : 'blue'}
                  testId="confirm-swap"
                >
                  {isError ? (
                    'Shoot! Something went wrong :('
                  ) : isMigrateLoading ? (
                    <Dots>Confirm Migrate</Dots>
                  ) : (
                    `Confirm Migrate`
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal.Review>
      <Modal.Confirm tag={MODAL_MIGRATE_ID} variant="transparent">
        {({ close }) => (
          <TxStatusModalContent
            onComplete={() => push(`/pools/${pool.chainId}:${v3Address}?activeTab=myPositions`)}
            testId="migrate-confirmation-modal"
            tag={MODAL_MIGRATE_ID}
            chainId={pool.chainId as ChainId}
            hash={data?.hash}
            successMessage={`Successfully migrated your ${token0.symbol}/${token1.symbol} position`}
            onClose={close}
            buttonSuccessText="Go to pool"
            buttonSuccessLink={`/pools/${pool.chainId}:${v3Address}?activeTab=myPositions`}
          />
        )}
      </Modal.Confirm>
    </>
  )
})
