'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
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
  FormattedNumber,
  List,
  SkeletonText,
  Switch,
} from '@sushiswap/ui'
import { format, formatDistanceStrict } from 'date-fns'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { fillDelayText } from 'src/lib/swap/twap'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { EvmChain } from 'sushi/chain'
import { formatUSD, shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import type { Address } from 'sushi/types'
import { UserRejectedRequestError, encodeFunctionData } from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import {
  useDerivedStateTwap,
  usePrepareTwapOrderArgs,
  useTwapTrade,
} from './derivedstate-twap-provider'

const askAbiShard = [
  {
    inputs: [
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
        internalType: 'struct OrderLib.Ask',
        name: '_ask',
        type: 'tuple',
      },
    ],
    name: 'ask',
    outputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
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
      isLimitOrder,
      token1PriceUSD,
    },
    mutate: { setSwapAmount },
  } = useDerivedStateTwap()

  const [acceptDisclaimer, setAcceptDisclaimer] = useState(true)

  const { approved } = useApproved(APPROVE_TAG_SWAP)
  const trade = useTwapTrade()
  const { address } = useAccount()
  const tradeRef = useRef<typeof trade>(null)
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const { params, error: _prepareTwapOrderArgsError } =
    usePrepareTwapOrderArgs(trade)

  const preparedTransaction = useMemo(() => {
    return {
      chainId,
      to: TwapSDK.onNetwork(chainId).config.twapAddress as Address,
      data: params
        ? encodeFunctionData({
            abi: askAbiShard,
            functionName: 'ask',
            args: [params],
          })
        : undefined,
    }
  }, [chainId, params])

  const [deadline, currentTime] = useMemo(() => {
    const now = new Date().getTime()

    return [
      trade
        ? TwapSDK.onNetwork(chainId).orderDeadline(now, trade.duration)
        : undefined,
      now,
    ]
  }, [trade, chainId])

  const { data: estGas, isError: isEstGasError } = useEstimateGas({
    ...preparedTransaction,
    query: {
      enabled: Boolean(approved && preparedTransaction.data),
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
            pending: `${'Swapping'} ${trade.amountIn?.toSignificant(6)} ${
              trade.amountIn?.currency.symbol
            } ${'for'} ${trade.amountOut?.toSignificant(6)} ${
              trade.amountOut?.currency.symbol
            }`,
            completed: `${'Swap'} ${trade.amountIn?.toSignificant(6)} ${
              trade.amountIn?.currency.symbol
            } ${'for'} ${trade.amountOut?.toSignificant(6)} ${
              trade.amountOut?.currency.symbol
            }`,
            failed: `Something went wrong when trying to ${'swap'} ${trade.amountIn?.currency.symbol} ${'for'} ${trade.amountOut?.currency.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      } finally {
        setSwapAmount('')
        refetchBalances(chainId)
      }
    },
    [setSwapAmount, trade, chainId, client, address, refetchBalances],
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
    if (!sendTransactionAsync || !preparedTransaction || !estGas)
      return undefined

    return async (confirm: () => void) => {
      await sendTransactionAsync({
        ...preparedTransaction,
        gas: (estGas * 6n) / 5n,
      })
      confirm()
    }
  }, [sendTransactionAsync, preparedTransaction, estGas])

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
              <DialogHeader>
                <DialogTitle>
                  Sell {swapAmount?.toSignificant(6)} {token0?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {!trade ? (
                    <SkeletonText />
                  ) : isLimitOrder ? (
                    `Receive at least ${trade.minAmountOut?.toSignificant(6)} ${token1?.symbol}`
                  ) : (
                    `Every ${fillDelayText(trade.fillDelay.value * trade.fillDelay.unit)} over ${trade.chunks} order
                ${trade.chunks > 1 ? 's' : ''}`
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Network">
                      {EvmChain.from(chainId)?.name}
                    </List.KeyValue>
                    {isLimitOrder ? (
                      <>
                        <List.KeyValue title="Limit price">
                          {token0 && limitPrice && token1 && token1PriceUSD ? (
                            <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
                              1 {token0.symbol} =
                              <FormattedNumber number={limitPrice.toFixed(4)} />{' '}
                              {token1.symbol}{' '}
                              <span className="text-muted-foreground">
                                ({formatUSD(token1PriceUSD.toFixed(6))})
                              </span>
                            </span>
                          ) : (
                            <SkeletonText fontSize="sm" />
                          )}
                        </List.KeyValue>
                        <List.KeyValue title="Expiry">
                          {deadline ? (
                            format(deadline, "MMMM d, yyyy 'at' h:mm a")
                          ) : (
                            <SkeletonText fontSize="sm" />
                          )}
                        </List.KeyValue>
                      </>
                    ) : (
                      <>
                        <List.KeyValue title="Sell Total">
                          {trade?.amountIn ? (
                            <span>
                              <FormattedNumber
                                number={trade.amountIn.toExact()}
                              />{' '}
                              {token0?.symbol}
                            </span>
                          ) : (
                            <SkeletonText />
                          )}
                        </List.KeyValue>
                        <List.KeyValue title="Sell per Order">
                          {trade?.amountInChunk ? (
                            <span>
                              <FormattedNumber
                                number={trade.amountInChunk.toExact()}
                              />{' '}
                              {token0?.symbol}
                            </span>
                          ) : (
                            <SkeletonText />
                          )}
                        </List.KeyValue>
                        <List.KeyValue title="Order Interval">
                          {trade?.fillDelay ? (
                            formatDistanceStrict(
                              0,
                              trade.fillDelay.unit * trade.fillDelay.value,
                              { roundingMethod: 'floor' },
                            )
                          ) : (
                            <SkeletonText />
                          )}
                        </List.KeyValue>
                        <List.KeyValue title="Start Date">
                          {currentTime ? (
                            format(currentTime, "MMMM d, yyyy 'at' h:mm a")
                          ) : (
                            <SkeletonText />
                          )}
                        </List.KeyValue>
                        <List.KeyValue title="Est. End Date">
                          {deadline ? (
                            format(deadline, "MMMM d, yyyy 'at' h:mm a")
                          ) : (
                            <SkeletonText />
                          )}
                        </List.KeyValue>
                      </>
                    )}

                    <List.KeyValue title="Recipient">
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
                    {isLimitOrder ? (
                      <List.KeyValue title="Fee (0.25%)">
                        {trade?.fee ? `${trade.fee}` : <SkeletonText />}
                      </List.KeyValue>
                    ) : null}
                  </List.Control>
                  <List.Control>
                    <List.KeyValue
                      title={
                        <span>
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
                  </List.Control>
                </List>
              </div>
              <DialogFooter>
                <Checker.Connect>
                  <Checker.Network chainId={chainId}>
                    <Button
                      fullWidth
                      size="xl"
                      loading={!write && !isEstGasError}
                      onClick={() => write?.(confirm)}
                      disabled={Boolean(
                        isEstGasError ||
                          isWritePending ||
                          Boolean(
                            !sendTransactionAsync &&
                              swapAmount?.greaterThan(ZERO),
                          ),
                      )}
                      color={isEstGasError ? 'red' : 'blue'}
                      testId="confirm-swap"
                    >
                      {isEstGasError
                        ? 'Shoot! Something went wrong :('
                        : 'Place Order'}
                    </Button>
                  </Checker.Network>
                </Checker.Connect>
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
        successMessage={`You sold ${tradeRef.current?.amountIn?.toSignificant(6)} ${token0?.symbol} for ${tradeRef.current?.amountOut?.toSignificant(6)} ${token1?.symbol}`}
      />
    </DialogProvider>
  )
}
