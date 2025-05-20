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
import { fillDelayText, getTimeDurationMs } from 'src/lib/swap/twap'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { EvmChain } from 'sushi/chain'
import { formatUSD, shortenAddress } from 'sushi/format'
import { ZERO } from 'sushi/math'
import { UserRejectedRequestError } from 'viem'
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
  type UseTwapTradeReturn,
  useDerivedStateTwap,
  useTwapTrade,
} from './derivedstate-twap-provider'

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
      deadline,
    },
    mutate: { setSwapAmount },
  } = useDerivedStateTwap()

  const [acceptDisclaimer, setAcceptDisclaimer] = useState(true)

  const { approved } = useApproved(APPROVE_TAG_SWAP)
  const { address } = useAccount()
  const tradeRef = useRef<UseTwapTradeReturn>(null)
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const { data: trade } = useTwapTrade()

  const { data: estGas, isError: isEstGasError } = useEstimateGas({
    ...trade?.tx,
    query: {
      enabled: Boolean(approved && trade?.tx?.data),
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
            pending: `Placing ${trade.isLimitOrder ? 'limit' : 'DCA'} order`,
            completed: `Placed ${trade.isLimitOrder ? 'limit' : 'DCA'} order`,
            failed: `Something went wrong when placing ${trade.isLimitOrder ? 'limit' : 'DCA'} order`,
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
    if (!sendTransactionAsync || !trade?.tx || !estGas) return undefined

    return async (confirm: () => void) => {
      await sendTransactionAsync({
        ...trade?.tx,
        gas: (estGas * 6n) / 5n,
      })
      confirm()
    }
  }, [sendTransactionAsync, trade?.tx, estGas])

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
                    `Every ${fillDelayText(trade.fillDelay)} over ${trade.chunks} order
                ${(trade.chunks ?? 0 > 1) ? 's' : ''}`
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
                          {trade?.amountInPerChunk ? (
                            <span>
                              <FormattedNumber
                                number={trade.amountInPerChunk.toExact()}
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
                              getTimeDurationMs(trade.fillDelay),
                              { roundingMethod: 'floor' },
                            )
                          ) : (
                            <SkeletonText />
                          )}
                        </List.KeyValue>
                        <List.KeyValue title="Start Date">
                          {format(Date.now(), "MMMM d, yyyy 'at' h:mm a")}
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
        successMessage={`Your ${tradeRef.current?.isLimitOrder ? 'limit' : 'DCA'} order was placed`}
      />
    </DialogProvider>
  )
}
