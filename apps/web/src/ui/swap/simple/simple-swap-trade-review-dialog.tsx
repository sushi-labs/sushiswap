'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceModalName,
  SwapEventName,
  Trace,
  TraceEvent,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import {
  Button,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
  List,
  SkeletonBox,
  SkeletonText,
  classNames,
  useDialog,
} from '@sushiswap/ui'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import type { UseTradeReturn } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { gasMargin } from 'sushi'
import { ChainId, EvmChain } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import {
  type Hex,
  type SendTransactionReturnType,
  UserRejectedRequestError,
  stringify,
} from 'viem'
import {
  useAccount,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { APPROVE_TAG_SWAP, NativeAddress } from '../../../lib/constants'
import {
  warningSeverity,
  warningSeverityClassName,
} from '../../../lib/swap/warningSeverity'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTrade,
} from './derivedstate-simple-swap-context'
import { SimpleSwapErrorMessage } from './simple-swap-error-message'

export const SimpleSwapTradeReviewDialog: FC<{
  children({
    error,
    isSuccess,
  }: { error: Error | null; isSuccess: boolean }): ReactNode
}> = ({ children }) => {
  return (
    <DialogProvider>
      <_SimpleSwapTradeReviewDialog>{children}</_SimpleSwapTradeReviewDialog>
    </DialogProvider>
  )
}

const _SimpleSwapTradeReviewDialog: FC<{
  children({
    error,
    isSuccess,
  }: { error: Error | null; isSuccess: boolean }): ReactNode
}> = ({ children }) => {
  const {
    state: { token0, token1, chainId, swapAmount, recipient },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap()

  const { approved } = useApproved(APPROVE_TAG_SWAP)
  const [slippagePercent] = useSlippageTolerance()

  const { address } = useAccount()
  const tradeRef = useRef<UseTradeReturn | null>(null)
  const client = usePublicClient()

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const {
    data: trade,
    isFetching: isSwapQueryFetching,
    isSuccess: isSwapQuerySuccess,
    isError: isSwapQueryError,
    error: swapQueryError,
  } = useSimpleSwapTrade(
    Boolean(approved && address && (confirmDialogOpen || reviewDialogOpen)),
  )

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const isWrap =
    token0?.isNative &&
    token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isUnwrap =
    token1?.isNative &&
    token0?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isSwap = !isWrap && !isUnwrap

  const trace = useTrace()

  const onSwapSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
      if (!trade || !chainId) return

      try {
        const ts = new Date().getTime()
        const promise = client.waitForTransactionReceipt({
          hash,
        })

        sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
          ...trace,
          txHash: hash,
          chainId: chainId,
          token0: tradeRef?.current?.amountIn?.currency?.isToken
            ? tradeRef?.current?.amountIn?.currency?.address
            : NativeAddress,
          token1: tradeRef?.current?.amountOut?.currency?.isToken
            ? tradeRef?.current?.amountOut?.currency?.address
            : NativeAddress,
          amountIn: tradeRef?.current?.amountIn?.quotient,
          amountOut: tradeRef?.current?.amountOut?.quotient,
          amountOutMin: tradeRef?.current?.minAmountOut?.quotient,
        })

        void createToast({
          account: address,
          type: 'swap',
          chainId: chainId,
          txHash: hash,
          promise,
          summary: {
            pending: `${
              isWrap ? 'Wrapping' : isUnwrap ? 'Unwrapping' : 'Swapping'
            } ${trade.amountIn?.toSignificant(6)} ${
              trade.amountIn?.currency.symbol
            } ${
              isWrap ? 'to' : isUnwrap ? 'to' : 'for'
            } ${trade.amountOut?.toSignificant(6)} ${
              trade.amountOut?.currency.symbol
            }`,
            completed: `${
              isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'
            } ${trade.amountIn?.toSignificant(6)} ${
              trade.amountIn?.currency.symbol
            } ${
              isWrap ? 'to' : isUnwrap ? 'to' : 'for'
            } ${trade.amountOut?.toSignificant(6)} ${
              trade.amountOut?.currency.symbol
            }`,
            failed: `Something went wrong when trying to ${
              isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'
            } ${trade.amountIn?.currency.symbol} ${
              isWrap ? 'to' : isUnwrap ? 'to' : 'for'
            } ${trade.amountOut?.currency.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })

        const receipt = await promise
        {
          const trade = tradeRef.current
          if (receipt.status === 'success') {
            sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_COMPLETED, {
              txHash: hash,
              from: receipt.from,
              chain_id: chainId,
              tx: stringify(trade?.tx),
            })
          } else {
            sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_FAILED, {
              txHash: hash,
              from: receipt.from,
              chain_id: chainId,
              token_from: trade?.amountIn?.currency.isToken
                ? trade?.amountIn?.currency.address
                : NativeAddress,
              token_to: trade?.amountOut?.currency.isToken
                ? trade?.amountOut?.currency.address
                : NativeAddress,
              tx: stringify(trade?.tx),
            })
          }
        }
      } finally {
        setSwapAmount('')
        refetchBalances(chainId)
      }
    },
    [
      setSwapAmount,
      trade,
      chainId,
      client,
      address,
      isWrap,
      isUnwrap,
      refetchBalances,
      trace,
    ],
  )

  const onSwapError = useCallback(
    (e: Error) => {
      if (e.cause instanceof UserRejectedRequestError) {
        return
      }

      sendAnalyticsEvent(SwapEventName.SWAP_ERROR, {
        token_from: trade?.amountIn?.currency.isToken
          ? trade?.amountIn?.currency.address
          : NativeAddress,
        token_to: trade?.amountOut?.currency.isToken
          ? trade?.amountOut?.currency.address
          : NativeAddress,
        tx: stringify(trade?.tx),
        error: e instanceof Error ? e.message : undefined,
      })
      createErrorToast(e.message, false)
    },
    [trade?.amountIn?.currency, trade?.amountOut?.currency, trade?.tx],
  )

  const {
    sendTransactionAsync,
    isPending: isWritePending,
    data,
  } = useSendTransaction({
    mutation: {
      onMutate: () => {
        // Set reference of current trade
        if (tradeRef && trade) {
          tradeRef.current = trade
        }
      },
      onSuccess: onSwapSuccess,
      onError: onSwapError,
    },
  })

  const write = useMemo(() => {
    if (!trade?.tx || address !== trade.tx.from) return undefined

    const { to, gas, data, value } = trade.tx

    return async (confirm: () => void) => {
      await sendTransactionAsync({
        to,
        data,
        value,
        gas: gas ? gasMargin(BigInt(gas)) : undefined,
      })
      confirm()
    }
  }, [address, trade?.tx, sendTransactionAsync])

  const { status } = useWaitForTransactionReceipt({
    chainId: chainId,
    hash: data,
  })

  const { showPriceImpactWarning, priceImpactSeverity } = useMemo(() => {
    const priceImpactSeverity = warningSeverity(trade?.priceImpact)
    return {
      showPriceImpactWarning: priceImpactSeverity > 3,
      priceImpactSeverity,
    }
  }, [trade?.priceImpact])

  return (
    <Trace modal={InterfaceModalName.CONFIRM_SWAP}>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="flex flex-col">
              <SimpleSwapErrorMessage
                error={swapQueryError}
                isSuccess={isSwapQuerySuccess}
                isLoading={isSwapQueryFetching}
              />
              <div className="mt-4">
                {children({
                  error: swapQueryError,
                  isSuccess: isSwapQuerySuccess,
                })}
              </div>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Buy {trade?.amountOut?.toSignificant(6)} {token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'}{' '}
                  {swapAmount?.toSignificant(6)} {token0?.symbol}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {showPriceImpactWarning && (
                  <div className="px-4 py-3 mt-4 rounded-xl bg-red/20">
                    <span className="text-sm font-medium text-red-600">
                      High price impact. You will lose a significant portion of
                      your funds in this trade due to price impact.
                    </span>
                  </div>
                )}
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Network">
                      {EvmChain.from(chainId)?.name}
                    </List.KeyValue>
                    {isSwap && (
                      <List.KeyValue
                        title="Price impact"
                        subtitle="The impact your trade has on the market price of this pool."
                      >
                        <span
                          className={classNames(
                            warningSeverityClassName(priceImpactSeverity),
                            'text-right',
                          )}
                        >
                          {isSwapQueryFetching ? (
                            <SkeletonBox className="h-4 py-0.5 w-[60px] rounded-md" />
                          ) : trade ? (
                            `${
                              trade.priceImpact?.lessThan(ZERO)
                                ? '+'
                                : trade.priceImpact?.greaterThan(ZERO)
                                  ? '-'
                                  : ''
                            }${Math.abs(
                              Number(trade.priceImpact?.toFixed(2)),
                            )}%`
                          ) : (
                            '-'
                          )}
                        </span>
                      </List.KeyValue>
                    )}
                    {isSwap && trade?.tokenTax && (
                      <List.KeyValue
                        title="Token tax"
                        subtitle="
                        Certain tokens incur a fee upon purchase or sale. Sushiswap does not collect any of these fees."
                      >
                        <span className="text-right text-yellow">
                          {trade.tokenTax.toPercentageString()}
                        </span>
                      </List.KeyValue>
                    )}
                    {isSwap && (
                      <>
                        <List.KeyValue
                          title={`Max. received`}
                          subtitle="The maximum amount you are guaranteed to receive."
                        >
                          {isSwapQueryFetching ? (
                            <SkeletonText
                              align="right"
                              fontSize="sm"
                              className="w-1/2"
                            />
                          ) : trade?.amountOut ? (
                            `${trade?.amountOut?.toSignificant(6)} ${
                              token1?.symbol
                            }`
                          ) : (
                            '-'
                          )}
                        </List.KeyValue>
                        <List.KeyValue
                          title={`Min. received after slippage (${slippagePercent.toPercentageString()})`}
                          subtitle="The minimum amount you are guaranteed to receive."
                        >
                          {isSwapQueryFetching ? (
                            <SkeletonText
                              align="right"
                              fontSize="sm"
                              className="w-1/2"
                            />
                          ) : trade?.minAmountOut ? (
                            `${trade?.minAmountOut?.toSignificant(6)} ${
                              token1?.symbol
                            }`
                          ) : (
                            '-'
                          )}
                        </List.KeyValue>
                      </>
                    )}
                    <List.KeyValue title="Network fee">
                      {chainId === ChainId.SKALE_EUROPA ? (
                        'FREE'
                      ) : isSwapQueryFetching ||
                        !trade?.gasSpent ||
                        trade.gasSpent === '0' ? (
                        <SkeletonText
                          align="right"
                          fontSize="sm"
                          className="w-1/3"
                        />
                      ) : (
                        `${trade.gasSpent} ${Native.onChain(chainId).symbol}`
                      )}
                    </List.KeyValue>
                  </List.Control>
                </List>
                {recipient && (
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <Button variant="link" size="sm" asChild>
                          <a
                            target="_blank"
                            href={
                              EvmChain.fromChainId(chainId)?.getAccountUrl(
                                recipient,
                              ) ?? '#'
                            }
                            rel="noreferrer"
                          >
                            {shortenAddress(recipient)}
                          </a>
                        </Button>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              </div>
              <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
                  <TraceEvent
                    events={[BrowserEvent.onClick]}
                    element={InterfaceElementName.CONFIRM_SWAP_BUTTON}
                    name={SwapEventName.SWAP_SUBMITTED_BUTTON_CLICKED}
                    properties={{
                      token_from: trade?.amountIn?.currency.isToken
                        ? trade?.amountIn?.currency.address
                        : NativeAddress,
                      token_to: trade?.amountOut?.currency.isToken
                        ? trade?.amountOut?.currency.address
                        : NativeAddress,
                      ...trace,
                    }}
                  >
                    <Button
                      fullWidth
                      size="xl"
                      loading={!write && !isSwapQueryError}
                      onClick={() => write?.(confirm)}
                      disabled={Boolean(
                        !!swapQueryError ||
                          isWritePending ||
                          Boolean(
                            !sendTransactionAsync &&
                              swapAmount?.greaterThan(ZERO),
                          ) ||
                          isSwapQueryError,
                      )}
                      color={
                        isSwapQueryError || showPriceImpactWarning
                          ? 'red'
                          : 'blue'
                      }
                      testId="confirm-swap"
                    >
                      {isSwapQueryError
                        ? 'Shoot! Something went wrong :('
                        : isWrap
                          ? 'Wrap'
                          : isUnwrap
                            ? 'Unwrap'
                            : `Swap ${token0?.symbol} for ${token1?.symbol}`}
                    </Button>
                  </TraceEvent>
                </div>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="make-another-swap"
        buttonText="Make another swap"
        txHash={data}
        successMessage={`You ${
          isWrap ? 'wrapped' : isUnwrap ? 'unwrapped' : 'sold'
        } ${tradeRef.current?.amountIn?.toSignificant(6)} ${token0?.symbol} ${
          isWrap ? 'to' : isUnwrap ? 'to' : 'for'
        } ${tradeRef.current?.amountOut?.toSignificant(6)} ${token1?.symbol}`}
      />
    </Trace>
  )
}
