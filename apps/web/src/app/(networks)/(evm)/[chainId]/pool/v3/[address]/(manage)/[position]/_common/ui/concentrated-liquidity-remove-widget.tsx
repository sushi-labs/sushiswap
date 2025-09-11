'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  SlippageToleranceStorageKey,
  TTLStorageKey,
  useDebounce,
} from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardFooter,
  CardGroup,
  CardLabel,
  Currency,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  Dots,
  IconButton,
  List,
  SettingsModule,
  SettingsOverlay,
  Switch,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC, useCallback, useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import {
  getDefaultTTL,
  useTransactionDeadline,
} from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount, Percent, ZERO } from 'sushi'
import {
  type EvmCurrency,
  EvmNative,
  NonfungiblePositionManager,
  type Position,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
  getEvmChainById,
  isSushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import {
  type Hex,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  useCall,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface ConcentratedLiquidityRemoveWidget {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  account: string | undefined
  chainId: SushiSwapV3ChainId
  positionDetails: ConcentratedLiquidityPosition | undefined
  position: Position | undefined
  onChange?(val: string): void
}

export const ConcentratedLiquidityRemoveWidget: FC<
  ConcentratedLiquidityRemoveWidget
> = ({
  token0,
  token1,
  account,
  onChange,
  chainId,
  position,
  positionDetails,
}) => {
  const { chain } = useAccount()
  const client = usePublicClient()
  const [value, setValue] = useState<string>('0')
  const [receiveWrapped, setReceiveWrapped] = useState(false)
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.RemoveLiquidity,
  )
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.RemoveLiquidity,
    chainId,
  })
  const debouncedValue = useDebounce(value, 300)

  const _onChange = useCallback(
    (val: string) => {
      setValue(val)
      if (onChange) {
        onChange(val)
      }
    },
    [onChange],
  )

  const trace = useTrace()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      setValue('0')

      if (!position) return

      sendAnalyticsEvent(LiquidityEventName.REMOVE_LIQUIDITY_SUBMITTED, {
        chain_id: chainId,
        txHash: hash,
        address: account,
        source: LiquiditySource.V3,
        label: [
          position.amount0.currency.symbol,
          position.amount1.currency.symbol,
        ].join('/'),
        ...trace,
      })

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'burn',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Removing liquidity from the ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} pair`,
          completed: `Successfully removed liquidity from the ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} pair`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [refetchBalances, client, position, account, chainId, trace],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e.message, true)
    }
  }, [])

  const [expectedToken0, expectedToken1] = useMemo(() => {
    const expectedToken0 =
      !token0 || receiveWrapped ? token0?.wrap() : unwrapEvmToken(token0)
    const expectedToken1 =
      !token1 || receiveWrapped ? token1?.wrap() : unwrapEvmToken(token1)
    return [expectedToken0, expectedToken1]
  }, [token0, token1, receiveWrapped])

  const [feeValue0, feeValue1] = useMemo(() => {
    if (positionDetails && expectedToken0 && expectedToken1) {
      const feeValue0 = positionDetails.fees
        ? new Amount(expectedToken0, positionDetails.fees[0])
        : undefined
      const feeValue1 = positionDetails.fees
        ? new Amount(expectedToken1, positionDetails.fees[1])
        : undefined

      return [feeValue0, feeValue1]
    }

    return [undefined, undefined]
  }, [positionDetails, expectedToken0, expectedToken1])

  const nativeToken = useMemo(() => EvmNative.fromChainId(chainId), [chainId])

  const positionHasNativeToken = useMemo(() => {
    if (!nativeToken || !token0 || !token1) return false
    return (
      token0.type === 'native' ||
      token1.type === 'native' ||
      token0.address === nativeToken?.wrap().address ||
      token1.address === nativeToken?.wrap().address
    )
  }, [token0, token1, nativeToken])

  const prepare = useMemo(() => {
    const liquidityPercentage = new Percent({
      numerator: debouncedValue,
      denominator: 100,
    })
    const discountedAmount0 = position
      ? liquidityPercentage.mul(position.amount0.amount).quotient
      : undefined
    const discountedAmount1 = position
      ? liquidityPercentage.mul(position.amount1.amount).quotient
      : undefined

    const liquidityValue0 =
      expectedToken0 && typeof discountedAmount0 === 'bigint'
        ? new Amount(expectedToken0, discountedAmount0)
        : undefined
    const liquidityValue1 =
      expectedToken1 && typeof discountedAmount1 === 'bigint'
        ? new Amount(expectedToken1, discountedAmount1)
        : undefined

    if (
      expectedToken0 &&
      expectedToken1 &&
      position &&
      account &&
      positionDetails &&
      deadline &&
      liquidityValue0 &&
      liquidityValue1 &&
      liquidityPercentage.gt(ZERO) &&
      isSushiSwapV3ChainId(chainId)
    ) {
      const { calldata, value: _value } =
        NonfungiblePositionManager.removeCallParameters(position, {
          tokenId: positionDetails.tokenId.toString(),
          liquidityPercentage,
          slippageTolerance,
          deadline: deadline.toString(),
          collectOptions: {
            expectedCurrencyOwed0:
              feeValue0 ?? new Amount(liquidityValue0.currency, 0),
            expectedCurrencyOwed1:
              feeValue1 ?? new Amount(liquidityValue1.currency, 0),
            recipient: account,
          },
        })

      console.debug({
        tokenId: positionDetails.tokenId.toString(),
        liquidityPercentage,
        slippageTolerance,
        deadline: deadline.toString(),
        collectOptions: {
          expectedCurrencyOwed0:
            feeValue0 ?? new Amount(liquidityValue0.currency, 0),
          expectedCurrencyOwed1:
            feeValue1 ?? new Amount(liquidityValue1.currency, 0),
          recipient: account,
        },
      })

      return {
        to: SUSHISWAP_V3_POSITION_MANAGER[chainId],
        data: calldata as Hex,
        value: BigInt(_value),
      }
    }
  }, [
    account,
    chainId,
    deadline,
    feeValue0,
    feeValue1,
    position,
    positionDetails,
    slippageTolerance,
    debouncedValue,
    expectedToken0,
    expectedToken1,
  ])

  const { isError: isSimulationError } = useCall({
    ...prepare,
    chainId,
    query: {
      enabled: +value > 0 && chainId === chain?.id,
    },
  })

  const {
    sendTransactionAsync,
    isPending: isWritePending,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const send = useMemo(() => {
    if (!prepare || isSimulationError) return undefined

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync(prepare)

        confirm()
      } catch {}
    }
  }, [isSimulationError, prepare, sendTransactionAsync])

  const { status } = useWaitForTransactionReceipt({
    chainId: chainId,
    hash: hash,
  })

  const positionClosed = !position || position.liquidity === 0n

  const positionPlusFees = useMemo(() => {
    return [
      position?.amount0
        .add(
          new Amount(
            position.amount0.currency,
            feeValue0 ? feeValue0.amount.toString() : '0',
          ),
        )
        .mul(value)
        .div(100n),
      position?.amount1
        .add(
          new Amount(
            position.amount1.currency,
            feeValue1 ? feeValue1.amount.toString() : '0',
          ),
        )
        .mul(value)
        .div(100n),
    ]
  }, [feeValue0, feeValue1, position, value])

  const fiatAmountsAsNumber = useTokenAmountDollarValues({
    chainId,
    amounts: positionPlusFees,
  })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div
              className={classNames(
                positionClosed && 'opacity-40 pointer-events-none',
              )}
            >
              <CardContent>
                <CardGroup>
                  <div className="p-3 pb-2 space-y-2 overflow-hidden bg-white rounded-xl dark:bg-secondary border border-accent">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">
                          {value}%
                        </h1>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={value === '25' ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => _onChange('25')}
                          testId="liquidity-25"
                        >
                          25%
                        </Button>
                        <Button
                          variant={value === '50' ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => _onChange('50')}
                          testId="liquidity-50"
                        >
                          50%
                        </Button>
                        <Button
                          variant={value === '75' ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => _onChange('75')}
                          testId="liquidity-75"
                        >
                          75%
                        </Button>
                        <Button
                          variant={value === '100' ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => _onChange('100')}
                          testId="liquidity-max"
                        >
                          Max
                        </Button>
                        <SettingsOverlay
                          options={{
                            slippageTolerance: {
                              storageKey:
                                SlippageToleranceStorageKey.RemoveLiquidity,
                              title: 'Remove Liquidity Slippage',
                            },
                            transactionDeadline: {
                              storageKey: TTLStorageKey.RemoveLiquidity,
                              defaultValue: getDefaultTTL(chainId).toString(),
                            },
                          }}
                          modules={[
                            SettingsModule.SlippageTolerance,
                            SettingsModule.TransactionDeadline,
                          ]}
                        >
                          <IconButton
                            size="sm"
                            name="Settings"
                            icon={Cog6ToothIcon}
                            variant="secondary"
                            className="!rounded-xl"
                          />
                        </SettingsOverlay>
                      </div>
                    </div>
                    <div className="px-1 pt-2 pb-3">
                      <input
                        value={value}
                        onChange={(e) => _onChange(e.target.value)}
                        type="range"
                        min="1"
                        max="100"
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </CardGroup>
                <Card variant="outline" className="space-y-6 p-6">
                  <CardGroup>
                    <CardLabel>{"You'll"} receive</CardLabel>
                    <CardCurrencyAmountItem
                      amount={position?.amount0.mul(value).div(100)}
                    />
                    <CardCurrencyAmountItem
                      amount={position?.amount1.mul(value).div(100)}
                    />
                  </CardGroup>
                  <CardGroup>
                    <CardLabel>{"You'll"} receive collected fees</CardLabel>
                    <CardCurrencyAmountItem
                      amount={feeValue0?.mul(value).div(100)}
                    />
                    <CardCurrencyAmountItem
                      amount={feeValue1?.mul(value).div(100)}
                    />
                  </CardGroup>
                </Card>
              </CardContent>
              <CardFooter>
                <Checker.Guard
                  guardWhen={positionClosed}
                  guardText="Position already closed"
                >
                  <Checker.Connect fullWidth>
                    <Checker.Network fullWidth chainId={chainId}>
                      <DialogTrigger asChild>
                        <Button
                          fullWidth
                          size="xl"
                          disabled={+value === 0}
                          testId="remove-or-add-liquidity"
                        >
                          {+value === 0 ? 'Enter Amount' : 'Remove'}
                        </Button>
                      </DialogTrigger>
                    </Checker.Network>
                  </Checker.Connect>
                </Checker.Guard>
              </CardFooter>
            </div>
            <DialogContent>
              <div className="flex justify-between">
                <DialogHeader>
                  <DialogTitle>
                    {token0?.symbol}/{token1?.symbol}
                  </DialogTitle>
                  <DialogDescription>Remove Liquidity</DialogDescription>
                </DialogHeader>
                <SettingsOverlay
                  options={{
                    slippageTolerance: {
                      storageKey: SlippageToleranceStorageKey.RemoveLiquidity,
                      title: 'Remove Liquidity Slippage',
                    },
                    transactionDeadline: {
                      storageKey: TTLStorageKey.RemoveLiquidity,
                      defaultValue: getDefaultTTL(chainId).toString(),
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
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue flex title="Network">
                      {getEvmChainById(chainId).name}
                    </List.KeyValue>
                    <List.KeyValue flex title="Slippage">
                      {slippageTolerance?.toPercentString()}
                    </List.KeyValue>
                  </List.Control>
                </List>
                <List className="!pt-0">
                  <List.Control>
                    {position?.amount0 && (
                      <List.KeyValue flex title={`${expectedToken0?.symbol}`}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Currency.Icon
                              currency={position?.amount0.currency}
                              width={18}
                              height={18}
                            />
                            {position?.amount0
                              .add(
                                new Amount(
                                  position.amount0.currency,
                                  feeValue0 ? feeValue0.amount.toString() : '0',
                                ),
                              )
                              .mul(value)
                              .div(100)
                              ?.toSignificant(6)}{' '}
                            {expectedToken0?.symbol}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            ${fiatAmountsAsNumber[0].toFixed(2)}
                          </span>
                        </div>
                      </List.KeyValue>
                    )}
                    {position?.amount1 && (
                      <List.KeyValue flex title={`${expectedToken1?.symbol}`}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Currency.Icon
                              currency={position?.amount1.currency}
                              width={18}
                              height={18}
                            />
                            {position?.amount1
                              .add(
                                new Amount(
                                  position.amount1.currency,
                                  feeValue1 ? feeValue1.amount.toString() : '0',
                                ),
                              )
                              .mul(value)
                              .div(100)
                              ?.toSignificant(6)}{' '}
                            {expectedToken1?.symbol}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            ${fiatAmountsAsNumber[1].toFixed(2)}
                          </span>
                        </div>
                      </List.KeyValue>
                    )}
                  </List.Control>
                </List>
                {positionHasNativeToken ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {`Receive ${nativeToken.wrap().symbol} instead of ${nativeToken.symbol}`}
                    </span>
                    <Switch
                      checked={receiveWrapped}
                      onCheckedChange={setReceiveWrapped}
                    />
                  </div>
                ) : null}
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  loading={!send || isWritePending}
                  onClick={() => send?.(confirm)}
                  disabled={isSimulationError}
                  testId="confirm-remove-liquidity"
                  type="button"
                >
                  {isSimulationError ? (
                    'Shoot! Something went wrong :('
                  ) : isWritePending ? (
                    <Dots>Confirm Remove</Dots>
                  ) : (
                    'Remove Liquidity'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="make-another-swap"
        buttonText="Close"
        txHash={hash}
        successMessage={`You successfully removed liquidity from your ${position?.amount0.currency.symbol}/${position?.amount1.currency.symbol} position`}
      />
    </DialogProvider>
  )
}
