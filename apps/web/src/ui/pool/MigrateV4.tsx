'use client'

import { SwitchHorizontalIcon } from '@heroicons/react-v1/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import type { V2Pool, V3Pool } from '@sushiswap/graph-client/data-api'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  Currency,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  Dots,
  IconButton,
  List,
  Message,
  Separator,
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC, useMemo, useState } from 'react'
import { APPROVE_TAG_MIGRATE, Bound, Field } from 'src/lib/constants'
import { isSushiSwapV2Pool } from 'src/lib/functions'
import { getTokensFromPool, useTokenAmountDollarValues } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import {
  type HookData,
  type SushiSwapV4ChainId,
  SushiSwapV4Pool,
  SushiSwapV4Position,
  getPoolKey,
} from 'src/lib/pool/v4'
import {
  V3MigrateContractConfig,
  useV3Migrate,
} from 'src/lib/wagmi/hooks/migrate/hooks/useV3Migrate'
import { useV4Migrate } from 'src/lib/wagmi/hooks/migrate/hooks/useV4Migrate'
import type {
  V3MigrateChainId,
  V4MigrateChainId,
} from 'src/lib/wagmi/hooks/migrate/types'
import { useSushiSwapV2Pool } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import type { ConcentratedLiquidityPositionV3 } from 'src/lib/wagmi/hooks/positions/types'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import {
  getDefaultTTL,
  useTransactionDeadline,
} from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/Provider'
import { ChainKey, EvmChain } from 'sushi/chain'
import { type SushiSwapV2ChainId, SushiSwapV3FeeAmount } from 'sushi/config'
import { Amount, Price, tryParseAmount, unwrapToken } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { type Fraction, ZERO } from 'sushi/math'
import { TickMath, priceToClosestTick } from 'sushi/pool/sushiswap-v3'
import { SushiSwapProtocol } from 'sushi/types'
import { type Address, zeroAddress, zeroHash } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useConcentratedDerivedMintInfoV4 } from './ConcentratedLiquidityProviderV4'
import type { FeeData } from './ConcentratedLiquidityURLStateProviderV4'
import { usePoolPosition } from './PoolPositionProvider'
import { SelectFeeConcentratedWidgetV4 } from './SelectFeeConcentratedWidgetV4'
import { SelectPricesWidgetV4 } from './SelectPricesWidgetV4'

interface MigrateV2PositionParams {
  pool: V2Pool
}

interface MigrateV3PositionParams {
  pool: V3Pool
  position: ConcentratedLiquidityPositionV3 | undefined
}

export const MigrateV4: FC<MigrateV2PositionParams | MigrateV3PositionParams> =
  withCheckerRoot((params) => {
    const { pool } = params
    const { address } = useAccount()
    const [feeAmount, setFeeAmount] = useState<number>(
      SushiSwapV3FeeAmount.LOWEST,
    )
    const [hookData, _setHookData] = useState<undefined | HookData>(undefined)
    const [tickSpacing, setTickSpacing] = useState<number>(60)
    const [invertPrice, setInvertPrice] = useState(false)
    const [invertTokens, setInvertTokens] = useState(false)
    const [slippageTolerance] = useSlippageTolerance(
      SlippageToleranceStorageKey.AddLiquidity,
    )

    const setFeeData = ({ feeAmount, tickSpacing }: FeeData) => {
      setFeeAmount(feeAmount)
      setTickSpacing(tickSpacing)
    }

    const {
      token0: _token0,
      token1: _token1,
      liquidityToken,
    } = useMemo(() => {
      if (!pool)
        return {
          token0: undefined,
          token1: undefined,
          liquidityToken: undefined,
        }

      return getTokensFromPool(pool)
    }, [pool])

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
          ? ([
              _token1,
              _token0,
              _value1,
              _value0,
              _underlying1,
              _underlying0,
            ] as const)
          : ([
              _token0,
              _token1,
              _value0,
              _value1,
              _underlying0,
              _underlying1,
            ] as const),
      [
        invertTokens,
        _token0,
        _token1,
        _value0,
        _value1,
        _underlying0,
        _underlying1,
      ],
    )

    const { data: pair } = useSushiSwapV2Pool(
      pool.chainId as SushiSwapV2ChainId,
      token0,
      token1,
    )
    const totalSupply = useTotalSupply(liquidityToken)

    // this is just getLiquidityValue with the fee off, but for the passed pair
    const token0Value = useMemo(
      () =>
        token0 && pair?.[1] && totalSupply && balance
          ? Amount.fromRawAmount(
              token0?.wrapped,
              (balance.quotient *
                (token0.wrapped.equals(pair[1].token0)
                  ? pair[1].reserve0.quotient
                  : pair[1].reserve1.quotient)) /
                totalSupply.quotient,
            )
          : undefined,
      [token0, pair, totalSupply, balance],
    )

    const token1Value = useMemo(
      () =>
        token1 && pair?.[1]?.reserve1 && totalSupply && balance
          ? Amount.fromRawAmount(
              token1?.wrapped,
              (balance.quotient *
                (token1.wrapped.equals(pair[1].token1)
                  ? pair[1].reserve1.quotient
                  : pair[1].reserve0.quotient)) /
                totalSupply.quotient,
            )
          : undefined,
      [token1, pair, totalSupply, balance],
    )

    const poolKey = useMemo(() => {
      return token0 && token1
        ? getPoolKey({
            chainId: pool.chainId as SushiSwapV4ChainId,
            currency0: token0,
            currency1: token1,
            feeAmount,
            tickSpacing,
            hookData,
          })
        : undefined
    }, [pool.chainId, token0, token1, feeAmount, tickSpacing, hookData])

    const {
      ticks,
      invalidRange,
      pool: v4Pool,
      parsedAmounts,
      pricesAtTicks,
      ticksAtLimit,
      price,
      noLiquidity,
      outOfRange,
    } = useConcentratedDerivedMintInfoV4({
      chainId: pool.chainId as SushiSwapV4ChainId,
      account: address,
      currency0: token0,
      currency1: token1,
      baseCurrency: token0,
      poolKey,
      existingPosition: undefined,
    })

    const v4SpotPrice = useMemo(
      () => (v4Pool ? v4Pool?.token0Price : undefined),
      [v4Pool],
    )
    const v2SpotPrice = useMemo(
      () =>
        _token0 && _token1 && pair?.[1]?.reserve0 && pair?.[1]?.reserve1
          ? new Price(
              _token0.wrapped,
              _token1.wrapped,
              pair[1].reserve0.quotient,
              pair[1].reserve1.quotient,
            )
          : undefined,
      [_token0, _token1, pair],
    )

    let priceDifferenceFraction: Fraction | undefined =
      v2SpotPrice && v4SpotPrice
        ? v4SpotPrice.divide(v2SpotPrice).subtract(1).multiply(100)
        : undefined
    if (priceDifferenceFraction?.lessThan(ZERO)) {
      priceDifferenceFraction = priceDifferenceFraction.multiply(-1)
    }

    const largePriceDifference =
      priceDifferenceFraction && !priceDifferenceFraction?.lessThan(2n)

    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

    // the v4 tick is either the pool's tickCurrent, or the tick closest to the v2 spot price
    const tick =
      v4Pool?.tickCurrent ??
      (v2SpotPrice ? priceToClosestTick(v2SpotPrice) : undefined)
    // the price is either the current v4 price, or the price at the tick
    const sqrtPrice =
      v4Pool?.sqrtRatioX96 ??
      (tick ? TickMath.getSqrtRatioAtTick(tick) : undefined)

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
          ? SushiSwapV4Position.fromAmounts({
              pool:
                v4Pool ??
                new SushiSwapV4Pool({
                  currencyA: token0,
                  currencyB: token1,
                  fee: feeAmount,
                  sqrtRatioX96: sqrtPrice,
                  liquidity: 0n,
                  tickCurrent: tick,
                  tickSpacing: tickSpacing,
                  hooks: hookData,
                }),
              tickLower,
              tickUpper,
              amount0: token0.wrapped.sortsBefore(token1.wrapped)
                ? token0Value.quotient
                : token1Value.quotient,
              amount1: token0.wrapped.sortsBefore(token1.wrapped)
                ? token1Value.quotient
                : token0Value.quotient,
              useFullPrecision: true, // we want full precision for the theoretical position
            })
          : undefined,
      [
        feeAmount,
        invalidRange,
        sqrtPrice,
        tick,
        tickLower,
        tickUpper,
        token0,
        token0Value,
        token1,
        token1Value,
        v4Pool,
        tickSpacing,
        hookData,
      ],
    )

    const { amount0: v4Amount0Min, amount1: v4Amount1Min } = useMemo(
      () =>
        position
          ? position.mintAmountsWithSlippage(slippageTolerance)
          : { amount0: undefined, amount1: undefined },
      [position, slippageTolerance],
    )

    const liquidityMin = useMemo(
      () =>
        position
          ? slippageTolerance.multiply(position.liquidity).quotient
          : undefined,
      [position, slippageTolerance],
    )

    const [positionAmount0, positionAmount1] = useMemo(
      () =>
        invertTokens
          ? [position?.amount1, position?.amount0]
          : [position?.amount0, position?.amount1],
      [invertTokens, position?.amount0, position?.amount1],
    )

    const refund0 = useMemo(
      () =>
        positionAmount0 &&
        token0 &&
        token0Value &&
        Amount.fromRawAmount(
          token0,
          token0Value.quotient - positionAmount0.quotient,
        ),
      [positionAmount0, token0, token0Value],
    )

    const refund1 = useMemo(
      () =>
        positionAmount1 &&
        token1 &&
        token1Value &&
        Amount.fromRawAmount(
          token1,
          token1Value.quotient - positionAmount1.quotient,
        ),
      [positionAmount1, token1, token1Value],
    )

    const [v4FiatValue0, v4FiatValue1, refund0FiatValue, refund1FiatValue] =
      useTokenAmountDollarValues({
        chainId: pool.chainId,
        amounts: [positionAmount0, positionAmount1, refund0, refund1],
      })

    const { [Field.CURRENCY_A]: input0, [Field.CURRENCY_B]: _input1 } =
      parsedAmounts
    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
      pricesAtTicks

    const isSorted =
      token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
    const leftPrice = useMemo(
      () => (isSorted ? priceLower : priceUpper?.invert()),
      [isSorted, priceLower, priceUpper],
    )
    const rightPrice = useMemo(
      () => (isSorted ? priceUpper : priceLower?.invert()),
      [isSorted, priceLower, priceUpper],
    )
    const midPrice = useMemo(
      () => (isSorted ? price : price?.invert()),
      [isSorted, price],
    )
    const isFullRange = Boolean(
      ticksAtLimit[Bound.LOWER] && ticksAtLimit[Bound.UPPER],
    )

    const fiatAmounts = useMemo(
      () => [tryParseAmount('1', token0), tryParseAmount('1', token1)],
      [token0, token1],
    )
    const fiatAmountsAsNumber = useTokenAmountDollarValues({
      chainId: pool.chainId,
      amounts: fiatAmounts,
    })

    const { approved: approvedMigrate } = useApproved(APPROVE_TAG_MIGRATE)
    const { data: deadline } = useTransactionDeadline({
      storageKey: TTLStorageKey.AddLiquidity,
      chainId: pool.chainId,
    })

    const {
      write: writeMigrate,
      isError,
      isPending: isMigrateLoading,
      data: hash,
    } = useV4Migrate({
      account: address,
      args: {
        poolKey,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Min: v4Amount0Min,
        amount1Min: v4Amount1Min,
        recipient: address,
        deadline,
        sqrtPrice,
        noLiquidity,
        liquidityMin, // TODO: CHECK
        hookData: zeroHash, // TODO
        ...(pool.protocol === SushiSwapProtocol.SUSHISWAP_V2
          ? {
              protocol: SushiSwapProtocol.SUSHISWAP_V2,
              pair: pool.address,
              liquidityToMigrate: balance,
              percentageToMigrate: 100,
              refundAsETH: true,
            }
          : {
              protocol: SushiSwapProtocol.SUSHISWAP_V3,
              tokenId: (params as MigrateV3PositionParams).position!.tokenId,
              liquidityToMigrate: (params as MigrateV3PositionParams).position!
                .liquidity,
              collectFee: true,
            }),
      },
      chainId: pool.chainId as V4MigrateChainId,
      enabled: Boolean(
        approvedMigrate &&
          (pool.protocol !== SushiSwapProtocol.SUSHISWAP_V3 ||
            (params as MigrateV3PositionParams).position),
      ),
    })

    const { status } = useWaitForTransactionReceipt({
      chainId: pool.chainId,
      hash,
    })

    return (
      <>
        <CardContent className="items-center">
          <div className="flex flex-col gap-6 md:flex-row">
            <CardGroup>
              <CardLabel>V2 Price</CardLabel>
              {token0 && token1 && pool ? (
                <div>
                  <Button
                    icon={SwitchHorizontalIcon}
                    variant="link"
                    size="sm"
                    onClick={() => setInvertPrice((prev) => !prev)}
                  >
                    1 {invertPrice ? _token1!.symbol : _token0!.symbol} ={' '}
                    {invertPrice
                      ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${
                          _token0!.symbol
                        }`
                      : `${v2SpotPrice?.toSignificant(6)} ${_token1!.symbol}`}
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </CardGroup>
            {v4SpotPrice ? (
              <CardGroup>
                <CardLabel>V4 Price</CardLabel>
                {token0 && token1 && pool ? (
                  <div>
                    <Button
                      icon={SwitchHorizontalIcon}
                      variant="link"
                      size="sm"
                      onClick={() => setInvertPrice((prev) => !prev)}
                    >
                      1 {invertPrice ? _token1!.symbol : _token0!.symbol} ={' '}
                      {invertPrice
                        ? `${v4SpotPrice?.invert()?.toSignificant(6)} ${
                            _token0!.symbol
                          }`
                        : `${v4SpotPrice?.toSignificant(6)} ${_token1!.symbol}`}
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </CardGroup>
            ) : null}
          </div>
          <CardGroup className="max-w-[500px]">
            <CardLabel>Position</CardLabel>
            <CardCurrencyAmountItem
              isLoading={isLoading || !underlying0}
              amount={underlying0}
              fiatValue={formatUSD(value0)}
            />
            <CardCurrencyAmountItem
              isLoading={isLoading || !underlying1}
              amount={underlying1}
              fiatValue={formatUSD(value1)}
            />
          </CardGroup>
        </CardContent>
        <div className="pb-4">
          <Separator />
        </div>
        <CardContent className="!pb-0">
          <SelectFeeConcentratedWidgetV4
            chainId={pool.chainId as SushiSwapV4ChainId}
            setFeeAmount={setFeeAmount}
            setTickSpacing={setTickSpacing}
            setFeeData={setFeeData}
            feeAmount={feeAmount}
            tickSpacing={tickSpacing}
            token0={token0}
            token1={token1}
          />
          <Separator />
          <div className="flex flex-col gap-6">
            <SelectPricesWidgetV4
              chainId={pool.chainId as SushiSwapV4ChainId}
              poolKey={poolKey}
              token0={token0}
              token1={token1}
              tokenId={undefined}
              showStartPrice={false}
              switchTokens={() => setInvertTokens((prev) => !prev)}
            >
              {outOfRange ? (
                <Message variant="warning" size="sm">
                  Your position will not earn fees or be used in trades until
                  the market price moves into your range.
                </Message>
              ) : null}
              {invalidRange ? (
                <Message variant="warning" size="sm">
                  Invalid range selected. The minimum price must be lower than
                  the maximum price.
                </Message>
              ) : null}
              {largePriceDifference ? (
                <Message variant="warning" size="sm">
                  You should only deposit liquidity into SushiSwap V4 at a price
                  you believe is correct. <br />
                  If the price seems incorrect, you can either make a swap to
                  move the price or wait for someone else to do so.
                </Message>
              ) : null}
            </SelectPricesWidgetV4>
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-x-10 lg:gap-x-[56px]">
            <div className="col-span-3 md:col-span-1" />
            <div className="col-span-3 space-y-6 md:col-span-2">
              <Separator />
              <Card className="bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle>Migrated value</CardTitle>
                  <CardDescription>
                    Your position after migration will consist of the following
                    tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardGroup>
                    <CardLabel>Tokens</CardLabel>
                    <CardCurrencyAmountItem
                      amount={positionAmount0}
                      fiatValue={formatUSD(v4FiatValue0)}
                    />
                    <CardCurrencyAmountItem
                      amount={positionAmount1}
                      fiatValue={formatUSD(v4FiatValue1)}
                    />
                  </CardGroup>
                </CardContent>
              </Card>
              <Card className="bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle>Refunded tokens</CardTitle>
                  <CardDescription>
                    Sometimes you get a refund as the token ratio on a V4
                    position is not always 50:50
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardGroup>
                    <CardLabel>Tokens</CardLabel>
                    <CardCurrencyAmountItem
                      amount={token0Value}
                      fiatValue={formatUSD(refund0FiatValue)}
                    />
                    <CardCurrencyAmountItem
                      amount={token1Value}
                      fiatValue={formatUSD(refund1FiatValue)}
                    />
                  </CardGroup>
                </CardContent>
              </Card>
              <CardFooter className="!px-0 !pb-0">
                <Checker.Connect fullWidth size="default">
                  <Checker.Network
                    fullWidth
                    size="default"
                    chainId={pool.chainId}
                  >
                    <Checker.Guard
                      size="default"
                      guardWhen={!balance?.greaterThan(ZERO)}
                      guardText="Not enough balance"
                    >
                      <Checker.Guard
                        size="default"
                        guardWhen={Boolean(
                          !position ||
                            positionAmount0?.equalTo(ZERO) ||
                            positionAmount1?.equalTo(ZERO),
                        )}
                        guardText="Enter valid range"
                      >
                        <Checker.ApproveERC20
                          fullWidth
                          size="default"
                          id="approve-migrate"
                          amount={balance ?? undefined}
                          contract={
                            V3MigrateContractConfig(
                              pool.chainId as V3MigrateChainId,
                            ).address
                          }
                          enabled={Boolean(
                            V3MigrateContractConfig(
                              pool.chainId as V3MigrateChainId,
                            ).address,
                          )}
                        >
                          <Checker.Success tag={APPROVE_TAG_MIGRATE}>
                            <DialogReview>
                              {({ confirm }) => (
                                <>
                                  <DialogTrigger asChild>
                                    <Button
                                      fullWidth
                                      size="default"
                                      testId="migrate"
                                    >
                                      Migrate Liquidity
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <div className="flex justify-between">
                                        <DialogTitle>
                                          Migrate Liquidity
                                        </DialogTitle>
                                        <SettingsOverlay
                                          options={{
                                            slippageTolerance: {
                                              storageKey:
                                                SlippageToleranceStorageKey.AddLiquidity,
                                              title: 'Add Liquidity Slippage',
                                            },
                                            transactionDeadline: {
                                              storageKey:
                                                TTLStorageKey.AddLiquidity,
                                              defaultValue: getDefaultTTL(
                                                pool.chainId,
                                              ).toString(),
                                            },
                                          }}
                                          modules={[
                                            SettingsModule.SlippageTolerance,
                                            SettingsModule.TransactionDeadline,
                                          ]}
                                        >
                                          <IconButton
                                            name="Settings"
                                            icon={Cog6ToothIcon}
                                            variant="secondary"
                                            className="mr-12"
                                          />
                                        </SettingsOverlay>
                                      </div>
                                      <DialogDescription>
                                        {token0?.symbol}/{token1?.symbol} •
                                        SushiSwap V4 • {feeAmount / 10000}%
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                      <List className="!pt-0">
                                        <List.Control>
                                          <List.KeyValue flex title="Network">
                                            {EvmChain.from(pool.chainId)?.name}
                                          </List.KeyValue>
                                          {feeAmount && (
                                            <List.KeyValue title="Fee Tier">{`${
                                              +feeAmount / 10000
                                            }%`}</List.KeyValue>
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
                                              {isFullRange
                                                ? '0'
                                                : leftPrice?.toSignificant(
                                                    6,
                                                  )}{' '}
                                              {token1?.symbol}
                                            </div>
                                          </List.KeyValue>
                                          <List.KeyValue
                                            flex
                                            title={
                                              noLiquidity
                                                ? 'Starting Price'
                                                : 'Market Price'
                                            }
                                            subtitle={
                                              noLiquidity
                                                ? 'Starting price as determined by you'
                                                : 'Current price as determined by the ratio of the pool'
                                            }
                                          >
                                            <div className="flex flex-col gap-1">
                                              {midPrice?.toSignificant(6)}{' '}
                                              {token1?.symbol}
                                              <span className="text-xs text-gray-500 dark:text-slate-400">
                                                $
                                                {fiatAmountsAsNumber[0].toFixed(
                                                  2,
                                                )}
                                              </span>
                                            </div>
                                          </List.KeyValue>
                                          <List.KeyValue
                                            flex
                                            title="Maximum Price"
                                            subtitle={`Your position will be 100% composed of ${token1?.symbol} at this price`}
                                          >
                                            <div className="flex flex-col gap-1">
                                              {isFullRange
                                                ? '∞'
                                                : rightPrice?.toSignificant(
                                                    6,
                                                  )}{' '}
                                              {token1?.symbol}
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
                                                    currency={unwrapToken(
                                                      positionAmount0.currency,
                                                    )}
                                                    width={18}
                                                    height={18}
                                                  />
                                                  {positionAmount0.toSignificant(
                                                    6,
                                                  )}{' '}
                                                  {
                                                    unwrapToken(
                                                      positionAmount0.currency,
                                                    ).symbol
                                                  }
                                                </div>
                                                <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                                                  {formatUSD(v4FiatValue0)}
                                                </span>
                                              </div>
                                            </List.KeyValue>
                                          )}
                                          {positionAmount1 && (
                                            <List.KeyValue
                                              flex
                                              title={''}
                                              className="!items-start"
                                            >
                                              <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                  <Currency.Icon
                                                    currency={unwrapToken(
                                                      positionAmount1.currency,
                                                    )}
                                                    width={18}
                                                    height={18}
                                                  />
                                                  {positionAmount1.toSignificant(
                                                    6,
                                                  )}{' '}
                                                  {
                                                    unwrapToken(
                                                      positionAmount1.currency,
                                                    ).symbol
                                                  }
                                                </div>
                                                <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                                                  {formatUSD(v4FiatValue1)}
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
                                                    currency={unwrapToken(
                                                      token0Value.currency,
                                                    )}
                                                    width={18}
                                                    height={18}
                                                  />
                                                  {refund0?.toSignificant(6) ??
                                                    '0.00'}{' '}
                                                  {
                                                    unwrapToken(
                                                      token0Value.currency,
                                                    ).symbol
                                                  }
                                                </div>
                                                <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                                                  {formatUSD(refund0FiatValue)}
                                                </span>
                                              </div>
                                            </List.KeyValue>
                                          )}
                                          {token1Value && (
                                            <List.KeyValue
                                              flex
                                              title={''}
                                              className="!items-start"
                                            >
                                              <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                  <Currency.Icon
                                                    currency={unwrapToken(
                                                      token1Value.currency,
                                                    )}
                                                    width={18}
                                                    height={18}
                                                  />
                                                  {refund1?.toSignificant(6) ??
                                                    '0.00'}{' '}
                                                  {
                                                    unwrapToken(
                                                      token1Value.currency,
                                                    ).symbol
                                                  }
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
                                    <DialogFooter>
                                      <Button
                                        fullWidth
                                        size="xl"
                                        loading={isLoading && !isError}
                                        onClick={() => writeMigrate?.(confirm)}
                                        disabled={isMigrateLoading || isError}
                                        color={isError ? 'red' : 'blue'}
                                        testId="migrate-confirm"
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
              </CardFooter>
            </div>
          </div>
        </CardContent>
        {token0 && token1 ? (
          <DialogConfirm
            chainId={pool.chainId}
            status={status}
            testId="migrate-confirmation-modal"
            successMessage={`Successfully migrated your ${token0.symbol}/${token1.symbol} position`}
            buttonText="Go to positions"
            buttonLink={`/${ChainKey[pool.chainId]}/pool`}
            txHash={hash}
          />
        ) : null}
      </>
    )
  })
