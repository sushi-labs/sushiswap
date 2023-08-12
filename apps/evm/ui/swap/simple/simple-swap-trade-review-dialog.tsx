'use client'

import { routeProcessor2Abi } from '@sushiswap/abi'
import { Chain } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import {
  isRouteProcessor3ChainId,
  isRouteProcessorChainId,
  routeProcessor3Address,
  routeProcessorAddress,
} from '@sushiswap/route-processor'
import { Bridge, LiquidityProviders } from '@sushiswap/router'
import {
  classNames,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { List } from '@sushiswap/ui/components/list/List'
import { SkeletonBox, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { useBalanceWeb3Refetch } from '@sushiswap/wagmi/future/hooks'
import { useApproved } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useSimpleSwapTrade } from 'lib/swap/useSimpleSwapTrade'
import { log } from 'next-axiom'
import React, { FC, ReactNode, useCallback } from 'react'

import { warningSeverity, warningSeverityClassName } from '../../../lib/swap/warningSeverity'
import { TradeRoute } from '../trade/TradeRoute'
import { useDerivedStateSimpleSwap } from './derivedstate-simpleswap-provider'

export const SimpleSwapTradeReviewDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    state: { token0, token1, chainId, swapAmount, recipient },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap()

  const { approved } = useApproved('swap')
  const [slippageTolerance] = useSlippageTolerance()
  const { data: trade, isFetching } = useSimpleSwapTrade()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const refetchBalances = useBalanceWeb3Refetch()

  const isWrap = token0?.isNative && token1?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isUnwrap = token1?.isNative && token0?.wrapped.address === Native.onChain(chainId).wrapped.address
  const isSwap = !isWrap && !isUnwrap

  const { config, isError, error } = usePrepareContractWrite({
    chainId: chainId,
    address: isRouteProcessor3ChainId(chainId)
      ? routeProcessor3Address[chainId]
      : isRouteProcessorChainId(chainId)
      ? routeProcessorAddress[chainId]
      : undefined,
    abi: routeProcessor2Abi,
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled: Boolean(
      trade?.writeArgs &&
        (isRouteProcessorChainId(chainId) || isRouteProcessor3ChainId(chainId)) &&
        approved &&
        trade?.route?.status !== 'NoWay' &&
        chain?.id === chainId
    ),
    overrides: trade?.overrides,
    onError: (error) => {
      const message = error.message.toLowerCase()
      if (message.includes('user rejected') || message.includes('user cancelled')) {
        return
      }

      log.error('Swap prepare error', {
        route: trade?.route,
        slippageTolerance,
        error,
      })
    },
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !chainId || !data) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'swap',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `${isWrap ? 'Wrapping' : isUnwrap ? 'Unwrapping' : 'Swapping'} ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade.amountOut?.toSignificant(6)} ${
            trade.amountOut?.currency.symbol
          }`,
          completed: `${isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'} ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade.amountOut?.toSignificant(6)} ${
            trade.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to ${isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'} ${
            trade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [trade, chainId, address, isWrap, isUnwrap]
  )

  const {
    writeAsync,
    isLoading: isWritePending,
    data,
  } = useContractWrite({
    ...config,
    ...(config.request && { request: { ...config.request, gasLimit: config.request.gasLimit.mul(120).div(100) } }),
    onSuccess: async (data) => {
      setSwapAmount('')

      data
        .wait()
        .then((receipt) => {
          // log.info('swap receipt', {
          //   receipt,
          // })
          if (receipt.status === 1) {
            if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                  leg.poolName.startsWith(LiquidityProviders.Trident) ||
                  leg.poolName.startsWith(Bridge.BentoBox)
              )
            ) {
              log.info('internal route', {
                chainId: chainId,
                txHash: data.hash,
                exporerLink: Chain.txUrl(chainId, data.hash),
                route: trade?.route,
              })
            } else if (
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    leg.poolName.startsWith(Bridge.BentoBox))
              ) &&
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    !leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.info('mix route', {
                chainId: chainId,
                txHash: data.hash,
                exporerLink: Chain.txUrl(chainId, data.hash),
                route: trade?.route,
              })
            } else if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) &&
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) &&
                    !leg.poolName.startsWith(LiquidityProviders.Trident) &&
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.info('external route', {
                chainId: chainId,
                txHash: data.hash,
                exporerLink: Chain.txUrl(chainId, data.hash),
                route: trade?.route,
              })
            } else {
              log.info('unknown', {
                chainId: chainId,
                txHash: data.hash,
                exporerLink: Chain.txUrl(chainId, data.hash),
                route: trade?.route,
                args: trade?.writeArgs,
              })
            }
          } else {
            if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                  leg.poolName.startsWith(LiquidityProviders.Trident) ||
                  leg.poolName.startsWith(Bridge.BentoBox)
              )
            ) {
              log.error('internal route', {
                chainId: chainId,
                txHash: data.hash,
                route: trade?.route,
              })
            } else if (
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    leg.poolName.startsWith(Bridge.BentoBox))
              ) &&
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    !leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.error('mix route', {
                chainId: chainId,
                txHash: data.hash,
                route: trade?.route,
              })
            } else if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) &&
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) &&
                    !leg.poolName.startsWith(LiquidityProviders.Trident) &&
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.error('external route', {
                chainId: chainId,
                txHash: data.hash,
                route: trade?.route,
              })
            } else {
              log.error('unknown', {
                chainId: chainId,
                txHash: data.hash,
                route: trade?.route,
                args: trade?.writeArgs,
              })
            }
          }
        })
        .finally(async () => {
          await refetchBalances()
        })
    },
    onSettled,
    onError: (error) => {
      if (error.message.startsWith('user rejected transaction')) return
      log.error('Swap error', {
        route: trade?.route,
        args: trade?.writeArgs,
        error,
      })
      createErrorToast(error.message, false)
    },
  })

  const { status } = useWaitForTransaction({ chainId: chainId, hash: data?.hash })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Buy {trade?.amountOut?.toSignificant(6)} {token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'} {swapAmount?.toSignificant(6)} {token0?.symbol}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {warningSeverity(trade?.priceImpact) >= 3 && (
                  <div className="px-4 py-3 mt-4 rounded-xl bg-red/20">
                    <span className="text-sm font-medium text-red-600">
                      High price impact. You will lose a significant portion of your funds in this trade due to price
                      impact.
                    </span>
                  </div>
                )}
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Network">{Chain.from(chainId).name}</List.KeyValue>
                    {isSwap && (
                      <List.KeyValue
                        title="Price impact"
                        subtitle="The impact your trade has on the market price of this pool."
                      >
                        <span
                          className={classNames(
                            warningSeverityClassName(warningSeverity(trade?.priceImpact)),
                            'text-right'
                          )}
                        >
                          {isFetching ? (
                            <SkeletonBox className="h-4 py-0.5 w-[60px] rounded-md" />
                          ) : (
                            `${
                              trade?.priceImpact?.lessThan(ZERO)
                                ? '+'
                                : trade?.priceImpact?.greaterThan(ZERO)
                                ? '-'
                                : ''
                            }${Math.abs(Number(trade?.priceImpact?.toFixed(2)))}%` ?? '-'
                          )}
                        </span>
                      </List.KeyValue>
                    )}
                    {isSwap && (
                      <List.KeyValue
                        title={`Min. received after slippage (${
                          slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance
                        }%)`}
                        subtitle="The minimum amount you are guaranteed to receive."
                      >
                        {isFetching ? (
                          <SkeletonText align="right" fontSize="sm" className="w-1/2" />
                        ) : (
                          `${trade?.minAmountOut?.toSignificant(6)} ${token1?.symbol}`
                        )}
                      </List.KeyValue>
                    )}
                    <List.KeyValue title="Network fee">
                      {isFetching ? (
                        <SkeletonText align="right" fontSize="sm" className="w-1/3" />
                      ) : (
                        `~$${trade?.gasSpent ?? '0.00'}`
                      )}
                    </List.KeyValue>
                    {isSwap && (
                      <List.KeyValue title="Route">
                        {isFetching ? (
                          <SkeletonText align="right" fontSize="sm" className="w-1/3" />
                        ) : (
                          <TradeRoute trade={trade}>
                            <Button size="sm" variant="link">
                              Show route
                            </Button>
                          </TradeRoute>
                        )}
                      </List.KeyValue>
                    )}
                  </List.Control>
                </List>
                {recipient && (
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <Button variant="link" size="sm" asChild>
                          <a
                            target="_blank"
                            href={Chain.fromChainId(chainId)?.getAccountUrl(recipient) ?? '#'}
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
                  <Button
                    fullWidth
                    size="xl"
                    loading={!writeAsync && !isError}
                    onClick={() => writeAsync?.().then(() => confirm())}
                    disabled={isWritePending || Boolean(!writeAsync && swapAmount?.greaterThan(ZERO)) || isError}
                    color={isError ? 'red' : warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
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
                  {error ? (
                    <div className="scroll bg-red/10 text-red-700 p-2 px-3 rounded-lg break-all">{error?.message}</div>
                  ) : null}
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
        txHash={data?.hash}
        successMessage={`You ${isWrap ? 'wrapped' : isUnwrap ? 'unwrapped' : 'sold'} ${trade?.amountIn?.toSignificant(
          6
        )} ${token0?.symbol} ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade?.amountOut?.toSignificant(6)} ${
          token1?.symbol
        }`}
      />
    </DialogProvider>
  )
}
