'use client'

import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon'
import { InterfaceModalName, Trace } from '@sushiswap/telemetry'
import {
  Button,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  FormattedNumber,
  List,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { format } from 'date-fns'
import React, { FC, ReactNode, useMemo, useState } from 'react'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import { Chain } from 'sushi/chain'
import { formatUSD, shortenAddress } from 'sushi/format'
import { AmountPanel } from '../amount-panel'
import { SimpleSwapErrorMessage } from '../simple/simple-swap-error-message'
import { useDerivedStateTwap, useTwapTrade } from './derivedstate-twap-provider'
import { TwapTradeTxDialog } from './twap-trade-tx-dialog'

export const TwapTradeReviewDialog: FC<{
  children: ReactNode
}> = ({ children }) => {
  const {
    state: {
      token0,
      token1,
      chainId,
      swapAmount,
      recipient,
      limitPrice,
      marketPrice,
      token1Price,
    },
    // mutate: { setSwapAmount },
  } = useDerivedStateTwap()

  const [acceptDisclaimer, setAcceptDisclaimer] = useState(true)

  // const { approved } = useApproved(APPROVE_TAG_SWAP)
  // const [slippagePercent] = useSlippageTolerance()
  const trade = useTwapTrade()
  // const isFetching = false
  // const { address, chain } = useAccount()
  // const tradeRef = useRef<UseTradeReturn | null>(null)
  // const client = usePublicClient()

  // const { refetchChain: refetchBalances } = useRefetchBalances()

  // const isWrap =
  //   token0?.isNative &&
  //   token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  // const isUnwrap =
  //   token1?.isNative &&
  //   token0?.wrapped.address === Native.onChain(chainId).wrapped.address
  // const isSwap = !isWrap && !isUnwrap

  // const args = usePrepareTwapOrderArgs(trade)

  const deadline = useMemo(
    () =>
      trade
        ? TwapSDK.onNetwork(chainId).orderDeadline(
            new Date().getTime(),
            trade.duration,
          )
        : undefined,
    [trade, chainId],
  )

  // console.log('args', args)

  // const {
  //   data: simulation,
  //   isError,
  //   error,
  //   isFetching: isPrepareFetching,
  //   isSuccess: isPrepareSuccess,
  // } = useSimulateContract({
  //   abi: TwapAbi,
  //   address: TwapSDK.onNetwork(chainId).config.twapAddress as Address,
  //   functionName: 'ask',
  //   args,
  //   query: {
  //     enabled: Boolean(
  //       approved && chain?.id === chainId && token1?.chainId === chainId,
  //     ),
  //   },
  // })

  // useEffect(() => {
  //   if (!error) return

  //   console.error('swap prepare error', error)
  //   const message = error.message.toLowerCase()
  //   if (
  //     message.includes('user rejected') ||
  //     message.includes('user cancelled')
  //   ) {
  //     return
  //   }

  //   sendAnalyticsEvent(SwapEventName.SWAP_ESTIMATE_GAS_CALL_FAILED, {
  //     slippageTolerance: slippagePercent.toPercentageString(),
  //     error: error.message,
  //   })
  // }, [error, slippagePercent])

  // const trace = useTrace()

  // const onSwapSuccess = useCallback(
  //   async (hash: SendTransactionReturnType) => {
  //     if (!trade || !chainId) return

  //     try {
  //       const ts = new Date().getTime()
  //       const promise = client.waitForTransactionReceipt({
  //         hash,
  //       })

  //       sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
  //         ...trace,
  //         txHash: hash,
  //         chainId: chainId,
  //         token0: tradeRef?.current?.amountIn?.currency?.isToken
  //           ? tradeRef?.current?.amountIn?.currency?.address
  //           : NativeAddress,
  //         token1: tradeRef?.current?.amountOut?.currency?.isToken
  //           ? tradeRef?.current?.amountOut?.currency?.address
  //           : NativeAddress,
  //         amountIn: tradeRef?.current?.amountIn?.quotient,
  //         amountOut: tradeRef?.current?.amountOut?.quotient,
  //         amountOutMin: tradeRef?.current?.minAmountOut?.quotient,
  //       })

  //       // void createToast({
  //       //   account: address,
  //       //   type: 'swap',
  //       //   chainId: chainId,
  //       //   txHash: hash,
  //       //   promise,
  //       //   summary: {
  //       //     pending: `${
  //       //       isWrap ? 'Wrapping' : isUnwrap ? 'Unwrapping' : 'Swapping'
  //       //     } ${trade.amountIn?.toSignificant(6)} ${
  //       //       trade.amountIn?.currency.symbol
  //       //     } ${
  //       //       isWrap ? 'to' : isUnwrap ? 'to' : 'for'
  //       //     } ${trade.amountOut?.toSignificant(6)} ${
  //       //       trade.amountOut?.currency.symbol
  //       //     }`,
  //       //     completed: `${
  //       //       isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'
  //       //     } ${trade.amountIn?.toSignificant(6)} ${
  //       //       trade.amountIn?.currency.symbol
  //       //     } ${
  //       //       isWrap ? 'to' : isUnwrap ? 'to' : 'for'
  //       //     } ${trade.amountOut?.toSignificant(6)} ${
  //       //       trade.amountOut?.currency.symbol
  //       //     }`,
  //       //     failed: `Something went wrong when trying to ${
  //       //       isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'
  //       //     } ${trade.amountIn?.currency.symbol} ${
  //       //       isWrap ? 'to' : isUnwrap ? 'to' : 'for'
  //       //     } ${trade.amountOut?.currency.symbol}`,
  //       //   },
  //       //   timestamp: ts,
  //       //   groupTimestamp: ts,
  //       // })

  //       const receipt = await promise
  //       {
  //         const trade = tradeRef.current
  //         if (receipt.status === 'success') {
  //           sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_COMPLETED, {
  //             txHash: hash,
  //             from: receipt.from,
  //             chain_id: chainId,
  //             tx: stringify(trade?.tx),
  //           })
  //         } else {
  //           sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_FAILED, {
  //             txHash: hash,
  //             from: receipt.from,
  //             chain_id: chainId,
  //             token_from: trade?.amountIn?.currency.isToken
  //               ? trade?.amountIn?.currency.address
  //               : NativeAddress,
  //             token_to: trade?.amountOut?.currency.isToken
  //               ? trade?.amountOut?.currency.address
  //               : NativeAddress,
  //             tx: stringify(trade?.tx),
  //           })
  //         }
  //       }
  //     } finally {
  //       setSwapAmount('')
  //       refetchBalances(chainId)
  //     }
  //   },
  //   [
  //     setSwapAmount,
  //     trade,
  //     chainId,
  //     client,
  //     address,
  //     isWrap,
  //     isUnwrap,
  //     refetchBalances,
  //     trace,
  //   ],
  // )

  // const onSwapError = useCallback(
  //   (e: Error) => {
  //     if (e.cause instanceof UserRejectedRequestError) {
  //       return
  //     }

  //     sendAnalyticsEvent(SwapEventName.SWAP_ERROR, {
  //       token_from: trade?.amountIn?.currency.isToken
  //         ? trade?.amountIn?.currency.address
  //         : NativeAddress,
  //       token_to: trade?.amountOut?.currency.isToken
  //         ? trade?.amountOut?.currency.address
  //         : NativeAddress,
  //       tx: stringify(trade?.tx),
  //       error: e instanceof Error ? e.message : undefined,
  //     })
  //     createErrorToast(e.message, false)
  //   },
  //   [trade?.amountIn?.currency, trade?.amountOut?.currency, trade?.tx],
  // )

  // const onSwapError = () => null

  // const {
  //   sendTransactionAsync,
  //   isPending: isWritePending,
  //   data,
  // } = useSendTransaction({
  //   mutation: {
  //     onMutate: () => {
  //       // Set reference of current trade
  //       if (tradeRef && trade) {
  //         // tradeRef.current = trade
  //       }
  //     },
  //     onSuccess: onSwapSuccess,
  //     onError: onSwapError,
  //   },
  // })

  // const write = useMemo(() => {
  //   if (!sendTransactionAsync || !simulation) return undefined

  //   return async (confirm: () => void) => {
  //     await sendTransactionAsync(simulation)
  //     confirm()
  //   }
  // }, [simulation, sendTransactionAsync])

  // const { status } = useWaitForTransactionReceipt({
  //   chainId: chainId,
  //   hash: data,
  // })

  return (
    <Trace modal={InterfaceModalName.CONFIRM_SWAP}>
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              {children}
              <DialogContent>
                <DialogHeader className="pb-7">
                  <DialogTitle className="!text-xl py-1.5">
                    {/* Buy {trade?.amountOut?.toSignificant(6)} {token1?.symbol} */}
                    Review order
                  </DialogTitle>
                  {/* <DialogDescription>
                    {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'}{' '}
                    {swapAmount?.toSignificant(6)} {token0?.symbol}
                  </DialogDescription> */}
                </DialogHeader>
                <AmountPanel amount={swapAmount} label={'From'} />
                <div className="left-0 right-0 lg:mt-[-26px] lg:mb-[-26px] flex items-center justify-center">
                  <button
                    type="button"
                    className="hover:shadow-sm transition-border z-10 group bg-background p-2 border border-accent transition-all rounded-full cursor-pointer"
                  >
                    <div className="transition-transform rotate-0 group-hover:rotate-180">
                      <ArrowDownIcon
                        strokeWidth={3}
                        className="w-4 h-4 lg:w-3 lg:h-3 text-blue"
                      />
                    </div>
                  </button>
                </div>
                <AmountPanel amount={trade?.amountOut} label={'To'} />
                <div className="flex flex-col gap-2">
                  <List className="!pt-0 !gap-2">
                    <List.KeyValue
                      className="!py-0"
                      title={
                        <span className="text-muted-foreground">
                          Limit price
                        </span>
                      }
                    >
                      {token0 &&
                      marketPrice &&
                      limitPrice &&
                      token1 &&
                      token1Price ? (
                        <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
                          1 {token0.symbol} =
                          <FormattedNumber number={limitPrice.toFixed(4)} />{' '}
                          {token1.symbol}{' '}
                          <span className="text-muted-foreground">
                            ({formatUSD(token1Price.toFixed(2))})
                          </span>
                        </span>
                      ) : null}
                    </List.KeyValue>
                    <List.KeyValue
                      className="!py-0"
                      title={
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-muted-foreground border-b border-muted-foreground border-dotted">
                              Expiry
                            </TooltipTrigger>
                            <TooltipContent className="w-64">
                              This is the date and time marking the end of the
                              period which you have selected for your order to
                              be executed.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                    >
                      {deadline
                        ? format(deadline, "MMMM d, yyyy 'at' h:mm a")
                        : null}
                    </List.KeyValue>
                    <List.KeyValue
                      className="!py-0"
                      title={
                        <span className="text-muted-foreground">Recipient</span>
                      }
                    >
                      {recipient ? (
                        <Button variant="link" size="sm" asChild>
                          <a
                            target="_blank"
                            href={
                              Chain.fromChainId(chainId)?.getAccountUrl(
                                recipient,
                              ) ?? '#'
                            }
                            rel="noreferrer"
                          >
                            {shortenAddress(recipient)}
                          </a>
                        </Button>
                      ) : null}
                    </List.KeyValue>
                    <List.KeyValue
                      className="!py-0"
                      title={
                        <span className="text-muted-foreground">
                          Fee (0.25%)
                        </span>
                      }
                    >
                      {trade?.fee ? `${trade.fee}` : undefined}
                    </List.KeyValue>
                    <List.KeyValue
                      className="!py-0"
                      title={
                        <span className="text-muted-foreground">
                          Accept{' '}
                          <a
                            href="https://www.orbs.com/dtwap-dlimit-disclaimer/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-b border-muted-foreground"
                          >
                            Disclaimer
                          </a>
                        </span>
                      }
                    >
                      <Switch
                        checked={acceptDisclaimer}
                        onCheckedChange={setAcceptDisclaimer}
                      />
                    </List.KeyValue>
                  </List>
                </div>
                <DialogFooter>
                  <div className="flex flex-col gap-4 w-full">
                    <TwapTradeTxDialog>
                      <DialogTrigger>
                        <Button
                          fullWidth
                          size="xl"
                          onClick={confirm}
                          // loading={!write && !isError}
                          // onClick={() => write?.(confirm)}
                          // disabled={Boolean(
                          //   !!error ||
                          //     isWritePending ||
                          //     Boolean(
                          //       !sendTransactionAsync &&
                          //         swapAmount?.greaterThan(ZERO),
                          //     ) ||
                          //     isError,
                          // )}
                          // color={
                          //   isError
                          //     ? 'red'
                          //     : warningSeverity(trade?.priceImpact) >= 3
                          //       ? 'red'
                          //       : 'blue'
                          // }
                          testId="confirm-swap"
                        >
                          Confirm
                        </Button>
                      </DialogTrigger>
                    </TwapTradeTxDialog>
                  </div>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
      </DialogProvider>
    </Trace>
  )
}
