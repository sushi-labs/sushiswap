'use client'

import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  DialogConfirm,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  FormattedNumber,
  List,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { format } from 'date-fns'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { EvmChain } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { formatUSD, shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import type { Address } from 'sushi/types'
import { UserRejectedRequestError } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSendTransaction,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { AmountPanel } from '../amount-panel'
import {
  useDerivedStateTwap,
  usePrepareTwapOrderArgs,
  useTwapTrade,
} from './derivedstate-twap-provider'

const askAbiShard = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'exchange',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'exchange',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'srcBidAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dstMinAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint32',
            name: 'deadline',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'bidDelay',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'fillDelay',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        indexed: false,
        internalType: 'struct OrderLib.Ask',
        name: 'ask',
        type: 'tuple',
      },
    ],
    name: 'OrderCreated',
    type: 'event',
  },
] as const

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
      token1PriceUSD,
    },
    mutate: { setSwapAmount },
  } = useDerivedStateTwap()

  const [acceptDisclaimer, setAcceptDisclaimer] = useState(true)

  const { approved } = useApproved(APPROVE_TAG_SWAP)
  const trade = useTwapTrade()
  const { address, chain } = useAccount()
  const tradeRef = useRef<typeof trade>(null)
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const isWrap =
    token0?.isNative &&
    token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isUnwrap =
    token1?.isNative &&
    token0?.wrapped.address === Native.onChain(chainId).wrapped.address

  const args = usePrepareTwapOrderArgs(trade)

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

  const {
    data: simulation,
    isError,
    error,
    // isFetching: isPrepareFetching,
    // isSuccess: isPrepareSuccess,
  } = useSimulateContract({
    abi: askAbiShard,
    address: TwapSDK.onNetwork(chainId).config.twapAddress as Address,
    functionName: 'ask',
    args,
    query: {
      enabled: Boolean(
        approved && chain?.id === chainId && token1?.chainId === chainId,
      ),
    },
  })

  const onSwapSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
      if (!trade || !chainId) return

      try {
        const ts = new Date().getTime()
        const promise = client.waitForTransactionReceipt({
          hash,
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
    ],
  )

  const onSwapError = useCallback((e: Error) => {
    if (e.cause instanceof UserRejectedRequestError) {
      return
    }

    createErrorToast(e.message, false)
  }, [])

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
    if (!sendTransactionAsync || !simulation) return undefined

    return async (confirm: () => void) => {
      await sendTransactionAsync(simulation)
      confirm()
    }
  }, [simulation, sendTransactionAsync])

  const { status } = useWaitForTransactionReceipt({
    chainId: chainId,
    hash: data,
  })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <div className="flex flex-col gap-8 overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="!text-xl py-1.5">
                    Review order
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 relative">
                  <AmountPanel amount={swapAmount} label={'From'} />
                  <div className="absolute inset-1/2 flex items-center justify-center bg-transparent">
                    <div className="z-10 bg-background p-2 border border-accent rounded-full">
                      <ArrowDownIcon
                        strokeWidth={3}
                        className="w-4 h-4 lg:w-3 lg:h-3 text-blue"
                      />
                    </div>
                  </div>
                  <AmountPanel amount={trade?.amountOut} label={'To'} />
                </div>
                <List className="!pt-0 !gap-2">
                  <List.KeyValue
                    className="!py-0"
                    title={
                      <span className="text-muted-foreground">Limit price</span>
                    }
                  >
                    {token0 &&
                    marketPrice &&
                    limitPrice &&
                    token1 &&
                    token1PriceUSD ? (
                      <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
                        1 {token0.symbol} =
                        <FormattedNumber number={limitPrice.toFixed(4)} />{' '}
                        {token1.symbol}{' '}
                        <span className="text-muted-foreground">
                          ({formatUSD(token1PriceUSD.toFixed(6))})
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
                            period which you have selected for your order to be
                            executed.
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
                            EvmChain.fromChainId(chainId)?.getAccountUrl(
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
                      <span className="text-muted-foreground">Fee (0.25%)</span>
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
                <DialogFooter>
                  <Checker.Connect>
                    <Checker.Network chainId={chainId}>
                      {/* <Checker.Amounts chainId={chainId} amount={swapAmount}>
                <Checker.ApproveERC20
                  id="approve-erc20"
                  amount={swapAmount}
                  contract={simulation?.request?.address}
                > */}
                      <Checker.Success tag={APPROVE_TAG_SWAP}>
                        <Button
                          fullWidth
                          size="xl"
                          loading={!write && !isError}
                          onClick={() => write?.(confirm)}
                          disabled={Boolean(
                            !!error ||
                              isWritePending ||
                              Boolean(
                                !sendTransactionAsync &&
                                  swapAmount?.greaterThan(ZERO),
                              ) ||
                              isError,
                          )}
                          // color={
                          //   isError
                          //     ? 'red'
                          //     : warningSeverity(trade?.priceImpact) >= 3
                          //       ? 'red'
                          //       : 'blue'
                          // }
                          testId="confirm-swap"
                        >
                          {isError
                            ? 'Shoot! Something went wrong :('
                            : isWrap
                              ? 'Wrap'
                              : isUnwrap
                                ? 'Unwrap'
                                : `Swap ${token0?.symbol} for ${token1?.symbol}`}
                        </Button>
                      </Checker.Success>
                      {/* </Checker.ApproveERC20> */}
                      {/* </Checker.Amounts> */}
                    </Checker.Network>
                  </Checker.Connect>
                </DialogFooter>
              </div>
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
        successMessage={`You ${isWrap ? 'wrapped' : isUnwrap ? 'unwrapped' : 'sold'} $tradeRef.current?.amountIn?.toSignificant(6)$token0?.symbol$isWrap ? 'to' : isUnwrap ? 'to' : 'for'$tradeRef.current?.amountOut?.toSignificant(6)$token1?.symbol`}
      />
    </DialogProvider>
  )
}
