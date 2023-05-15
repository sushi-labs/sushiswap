import { List } from '@sushiswap/ui/future/components/list/List'
import { Fraction, JSBI, Percent, ZERO } from '@sushiswap/math'
import { RadioGroup } from '@headlessui/react'
import { classNames, Dots } from '@sushiswap/ui'
import { formatUSD } from '@sushiswap/format'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { unwrapToken } from '../../lib/functions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { getMasterChefContractConfig, useMasterChefWithdraw } from '@sushiswap/wagmi'
import { APPROVE_TAG_MIGRATE, APPROVE_TAG_UNSTAKE, Bound } from '../../lib/constants'
import { Button } from '@sushiswap/ui/future/components/button'
import { SelectFeeConcentratedWidget } from '../NewPositionSection/SelectFeeConcentratedWidget'
import { SelectPricesWidget } from '../NewPositionSection'
import { FeeAmount, Position, priceToClosestTick, TickMath, V3ChainId } from '@sushiswap/v3-sdk'
import React, { FC, useMemo, useState } from 'react'
import { useGraphPool, useTokenAmountDollarValues } from '../../lib/hooks'
import { Pool } from '@sushiswap/client'
import { Pool as V3Pool } from '@sushiswap/v3-sdk'
import { usePoolPosition } from '../PoolPositionProvider'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { usePoolPositionRewards } from '../PoolPositionRewardsProvider'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useV3Migrate, V3MigrateContractConfig } from '@sushiswap/wagmi/future/hooks/migrate/hooks/useV3Migrate'
import { Address, useAccount } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { Amount, Price } from '@sushiswap/currency'
import { useConcentratedDerivedMintInfo } from '../ConcentratedLiquidityProvider'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { FundSource } from '@sushiswap/hooks'

enum PositionView {
  staked,
  unstaked,
}

export const MigrateTab: FC<{ pool: Pool }> = withCheckerRoot(({ pool }) => {
  const { address } = useAccount()
  const [positionView, setPositionView] = useState(PositionView.staked)
  const [feeAmount, setFeeAmount] = useState<FeeAmount>(FeeAmount.LOWEST)
  const { approved: approvedMigrate } = useApproved(APPROVE_TAG_MIGRATE)
  const { approved } = useApproved(APPROVE_TAG_UNSTAKE)

  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const {
    data: { token0, token1, reserve0, reserve1, totalSupply },
  } = useGraphPool(pool)
  const { data: deadline } = useTransactionDeadline({ chainId: pool.chainId as ChainId })
  const { value0, value1, underlying0, underlying1, isLoading, balance } = usePoolPosition()
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
      token0 && reserve0 && totalSupply && balance
        ? Amount.fromRawAmount(
            token0?.wrapped,
            JSBI.divide(JSBI.multiply(balance[FundSource.WALLET].quotient, reserve0.quotient), totalSupply.quotient)
          )
        : undefined,
    [token0, reserve0, totalSupply, balance]
  )

  const token1Value = useMemo(
    () =>
      token1 && reserve1 && totalSupply && balance
        ? Amount.fromRawAmount(
            token1?.wrapped,
            JSBI.divide(JSBI.multiply(balance[FundSource.WALLET].quotient, reserve1.quotient), totalSupply.quotient)
          )
        : undefined,
    [token1, reserve1, totalSupply, balance]
  )

  const {
    ticks,
    invalidRange,
    pool: v3Pool,
  } = useConcentratedDerivedMintInfo({
    chainId: pool.chainId as V3ChainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition: undefined,
  })

  const v3SpotPrice = useMemo(() => (v3Pool ? v3Pool?.token0Price : undefined), [v3Pool])
  const v2SpotPrice = useMemo(
    () =>
      token0 && token1 && reserve0 && reserve1
        ? new Price(token0.wrapped, token1.wrapped, reserve0.quotient, reserve1.quotient)
        : undefined,
    [token0, token1, reserve0, reserve1]
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
            amount0: token0Value.quotient,
            amount1: token1Value.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : undefined,
    [feeAmount, invalidRange, sqrtPrice, tick, tickLower, tickUpper, token0, token0Value, token1, token1Value, v3Pool]
  )

  const { amount0: v3Amount0Min, amount1: v3Amount1Min } = useMemo(
    () => (position ? position.mintAmountsWithSlippage(slippagePercent) : { amount0: undefined, amount1: undefined }),
    [position, slippagePercent]
  )

  const refund0 = useMemo(
    () =>
      position &&
      token0 &&
      token0Value &&
      Amount.fromRawAmount(token0, JSBI.subtract(token0Value.quotient, position.amount0.quotient)),
    [token0Value, position, token0]
  )

  const refund1 = useMemo(
    () =>
      position &&
      token1 &&
      token1Value &&
      Amount.fromRawAmount(token1, JSBI.subtract(token1Value.quotient, position.amount1.quotient)),
    [token1Value, position, token1]
  )

  const { write } = useV3Migrate({
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
    },
    chainId: pool.chainId as V3ChainId,
    enabled: approvedMigrate,
  })

  const [v3FiatValue0, v3FiatValue1, refund0FiatValue, refund1FiatValue] = useTokenAmountDollarValues({
    chainId: pool.chainId as V3ChainId,
    amounts: [position?.amount0, position?.amount1, refund0, refund1],
  })

  return (
    <>
      <div className="flex flex-col gap-6">
        <List>
          <div className="flex justify-between">
            <List.Label>Position Value</List.Label>
            {stakedBalance?.greaterThan(ZERO) ? (
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
            ) : (
              <List.Label>
                {formatUSD(
                  positionView === PositionView.staked && stakedBalance?.greaterThan(ZERO)
                    ? stakedValue0 + stakedValue1
                    : value0 + value1
                )}
              </List.Label>
            )}
          </div>
          <List.Control>
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
                    <List.KeyValue key={i} flex title={`${unwrapToken(rewardTokens[i]).symbol}`}>
                      <div className="flex items-center gap-2">
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

        {(token0Value?.greaterThan(ZERO) || token1Value?.greaterThan(ZERO)) && (
          <div className="flex flex-col gap-2">
            <div className="w-full flex justify-center">
              <ArrowDownIcon width={20} height={20} />
            </div>
            <List>
              <List.Control>
                <List.KeyValue flex title={<span className="font-semibold">Migration</span>}>
                  {formatUSD(v3FiatValue0 + v3FiatValue1)}
                </List.KeyValue>
                {position?.amount0 && (
                  <List.KeyValue flex title={`${position.amount0.currency.symbol}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(position.amount0.currency)} width={18} height={18} />
                        {position.amount0?.toSignificant(6)} {unwrapToken(position.amount0.currency).symbol}
                      </div>
                    </div>
                  </List.KeyValue>
                )}
                {position?.amount1 && (
                  <List.KeyValue flex title={`${position.amount1.currency.symbol}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(position.amount1.currency)} width={18} height={18} />
                        {position.amount1?.toSignificant(6)} {unwrapToken(position.amount1.currency).symbol}
                      </div>
                    </div>
                  </List.KeyValue>
                )}
                <div className="px-4">
                  <div className="my-4 h-px bg-slate-900/5 w-full" />
                </div>
                <List.KeyValue flex title={<span className="font-semibold">Refund</span>}>
                  {formatUSD(refund0FiatValue + refund1FiatValue)}
                </List.KeyValue>
                {token0Value && (
                  <List.KeyValue flex title={`${token0Value.currency.symbol}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(token0Value.currency)} width={18} height={18} />
                        {refund0?.toSignificant(6) ?? '0.00'} {unwrapToken(token0Value.currency).symbol}
                      </div>
                    </div>
                  </List.KeyValue>
                )}
                {token1Value && (
                  <List.KeyValue flex title={`${token1Value.currency.symbol}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Currency.Icon currency={unwrapToken(token1Value.currency)} width={18} height={18} />
                        {refund1?.toSignificant(6) ?? '0.00'} {unwrapToken(token1Value.currency).symbol}
                      </div>
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
          'flex flex-col order-3 gap-[64px] pb-40 sm:order-2'
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
            chainId={pool.chainId as V3ChainId}
            token0={token0}
            token1={token1}
            feeAmount={FeeAmount.HIGH}
            tokenId={undefined}
          />
          <Checker.Connect size="xl" fullWidth>
            <Checker.Network size="xl" fullWidth chainId={pool.chainId}>
              <Checker.ApproveERC20
                size="xl"
                fullWidth
                id="approve-token0"
                amount={balance?.[FundSource.WALLET] ?? undefined}
                contract={V3MigrateContractConfig(pool.chainId as V3ChainId).address}
                enabled={Boolean(V3MigrateContractConfig(pool.chainId as V3ChainId).address)}
              >
                <Checker.Success tag={APPROVE_TAG_MIGRATE}>
                  <Button
                    onClick={() => write?.()}
                    fullWidth
                    size="xl"
                    variant="filled"
                    disabled={isWritePending}
                    testId="unstake-liquidity"
                  >
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Migrate'}
                  </Button>
                </Checker.Success>
              </Checker.ApproveERC20>
            </Checker.Network>
          </Checker.Connect>
        </div>
      </div>
    </>
  )
})
