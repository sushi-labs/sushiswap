'use client'

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
  Button,
  CardContent,
  CardGroup,
  Currency,
  DialogFooter,
  Dots,
  List,
  Switch,
  classNames,
} from '@sushiswap/ui'
import { type FC, useCallback, useMemo, useRef, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { Amount, Percent } from 'sushi'
import {
  type EvmAddress,
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
import type { Hex, SendTransactionReturnType } from 'viem'
import {
  useCall,
  useConnection,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface ConcentratedLiquidityRemoveWidget {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  account: EvmAddress | undefined
  chainId: SushiSwapV3ChainId
  positionDetails: ConcentratedLiquidityPosition | undefined
  position: Position | undefined
  onChange?(val: string): void
  onPositionDecreased?(): void
}

export const ConcentratedLiquidityRemoveWidget: FC<
  ConcentratedLiquidityRemoveWidget
> = ({
  token0,
  token1,
  account,
  onChange,
  onPositionDecreased,
  chainId,
  position,
  positionDetails,
}) => {
  const { chain } = useConnection()
  const client = usePublicClient({ chainId })
  const removalForm = useRef<HTMLDivElement>(null)
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
    async (hash: SendTransactionReturnType) => {
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

      const receipt = waitForSuccessfulReceipt(client, hash).finally(() =>
        refetchBalances(chainId),
      )

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

      try {
        await receipt
      } catch (error) {
        logger.error(error, {
          location: 'ConcentratedLiquidityRemoveWidget',
          action: 'waitForReceipt',
        })
        return
      }

      if (removalForm.current) onPositionDecreased?.()
    },
    [
      refetchBalances,
      client,
      position,
      account,
      chainId,
      trace,
      onPositionDecreased,
    ],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'ConcentratedLiquidityRemoveWidget',
      action: 'mutationError',
    })
    createErrorToast(e.message, true)
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
      liquidityPercentage.mul(position.liquidity).quotient > 0n &&
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

  const {
    isError: isSimulationError,
    isLoading: isSimulating,
    isSuccess: isSimulated,
  } = useCall({
    ...prepare,
    account,
    chainId,
    query: {
      enabled: Boolean(
        prepare && value === debouncedValue && chainId === chain?.id,
      ),
    },
  })

  const { mutate: sendTransaction, isPending: isWritePending } =
    useSendTransaction({
      mutation: {
        onSuccess,
        onError,
      },
    })

  const simulatedRemoval =
    value === debouncedValue && isSimulated ? prepare : undefined

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
    <div
      ref={removalForm}
      className={classNames(
        'flex flex-col gap-4',
        positionClosed && 'opacity-40 pointer-events-none',
      )}
    >
      <CardContent className="!p-0">
        <CardGroup>
          <div className="p-3 pb-2 space-y-2 overflow-hidden bg-secondary rounded-2xl border border-accent">
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="py-1 text-3xl">{value}%</h1>
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
              </div>
            </div>
            <div className="px-1 pt-2 pb-3">
              <input
                value={value}
                onChange={(e) => _onChange(e.target.value)}
                type="range"
                min="1"
                max="100"
                className="w-full h-1 rounded-lg appearance-none cursor-pointer range-lg bg-muted"
              />
            </div>
          </div>
        </CardGroup>
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
      </CardContent>
      <DialogFooter>
        <Checker.StockTokenRegion token0={token0} token1={token1}>
          <Checker.Guard
            guardWhen={positionClosed}
            guardText="Position already closed"
          >
            <Checker.Connect fullWidth>
              <Checker.Network fullWidth chainId={chainId}>
                <Button
                  fullWidth
                  size="xl"
                  loading={isWritePending || isSimulating}
                  disabled={!simulatedRemoval}
                  onClick={() => {
                    if (simulatedRemoval) sendTransaction(simulatedRemoval)
                  }}
                  testId="confirm-remove-liquidity"
                  type="button"
                >
                  {isWritePending ? (
                    <Dots>Confirm Remove</Dots>
                  ) : +value === 0 ? (
                    'Enter Amount'
                  ) : isSimulationError ? (
                    'Shoot! Something went wrong :('
                  ) : (
                    'Remove Liquidity'
                  )}
                </Button>
              </Checker.Network>
            </Checker.Connect>
          </Checker.Guard>
        </Checker.StockTokenRegion>
      </DialogFooter>
    </div>
  )
}
