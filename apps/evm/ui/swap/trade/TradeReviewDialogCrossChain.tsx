'use client'

import { Chain, chainName } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS } from '@sushiswap/stargate'
import { SushiXSwapChainId } from '@sushiswap/sushixswap'
import {
  DialogClose,
  DialogContent,
  DialogCustom,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogType,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { List } from '@sushiswap/ui/components/list/List'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { createErrorToast, createInfoToast, createToast } from '@sushiswap/ui/components/toast'
import { AppType } from '@sushiswap/ui/types'
import {
  getSushiXSwapContractConfig,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { useBalanceWeb3Refetch } from '@sushiswap/wagmi/future/hooks'
import { useApproved, useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { nanoid } from 'nanoid'
import { log } from 'next-axiom'
import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { UseCrossChainTradeReturn } from '../../../lib/swap/useCrossChainTrade/types'
import { useLayerZeroScanLink } from '../../../lib/swap/useLayerZeroScanLink'
import { useTrade } from '../../../lib/swap/useTrade'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { ConfirmationDialogContent } from '../ConfirmationDialogCrossChain/ConfirmationDialogContent'
import {
  Divider,
  failedState,
  finishedState,
  GetStateComponent,
  pendingState,
  StepState,
} from '../ConfirmationDialogCrossChain/StepStates'
import { APPROVE_XSWAP_TAG } from '../widget/SwapButtonCrossChain'
import { useSwapActions, useSwapState } from './TradeProvider'

export const TradeReviewDialogCrossChain: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippageTolerance] = useSlippageTolerance()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { recipient, appType, review, amount, network0, token0, token1, value, network1, tradeId } = useSwapState()
  const { setReview, setTradeId, setValue } = useSwapActions()
  const { data: trade, isFetching } = useTrade({ crossChain: true, enabled: review })
  const { setSignature } = useSignature(APPROVE_XSWAP_TAG)
  const { approved } = useApproved(APPROVE_XSWAP_TAG)
  const groupTs = useRef<number>()
  const refetchBalances = useBalanceWeb3Refetch()

  const [stepStates, setStepStates] = useState<{ source: StepState; bridge: StepState; dest: StepState }>({
    source: StepState.Success,
    bridge: StepState.Success,
    dest: StepState.Success,
  })

  const srcBridgeToken =
    token0?.isToken && isStargateBridgeToken(token0) ? token0 : STARGATE_BRIDGE_TOKENS[network0]?.[0]
  const dstBridgeToken =
    token1?.isToken && isStargateBridgeToken(token1) ? token1 : STARGATE_BRIDGE_TOKENS[network1]?.[0]
  const crossChainSwap = !isStargateBridgeToken(token0) && !isStargateBridgeToken(token1)
  const swapTransfer = !isStargateBridgeToken(token0) && isStargateBridgeToken(token1)
  const transferSwap = isStargateBridgeToken(token0) && !isStargateBridgeToken(token1)
  const srcCurrencyB = crossChainSwap || swapTransfer ? srcBridgeToken : token1
  const dstCurrencyA = crossChainSwap || transferSwap ? dstBridgeToken : undefined
  const tradeRef = useRef<UseCrossChainTradeReturn | null>(null)

  const { config, isError } = usePrepareContractWrite({
    ...getSushiXSwapContractConfig(network0 as SushiXSwapChainId),
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled:
      Boolean(trade?.writeArgs) &&
      appType === AppType.xSwap &&
      chain?.id === network0 &&
      approved &&
      trade?.route?.status !== 'NoWay',
    overrides: trade?.overrides,
    onError: (error) => {
      if (error.message.startsWith('user rejected transaction')) return
      log.error('Cross Chain Swap prepare error', {
        trade,
        error,
      })
    },
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !network0 || !data) return

      groupTs.current = new Date().getTime()
      void createToast({
        account: address,
        type: 'swap',
        chainId: network0,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Swapping ${trade.amountIn?.toSignificant(6)} ${trade.amountIn?.currency.symbol} to bridge token ${
            srcCurrencyB?.symbol
          }`,
          completed: `Swap ${trade.amountIn?.toSignificant(6)} ${trade.amountIn?.currency.symbol} to bridge token ${
            srcCurrencyB?.symbol
          }`,
          failed: `Something went wrong when trying to swap ${trade.amountIn?.currency.symbol} to bridge token`,
        },
        timestamp: groupTs.current,
        groupTimestamp: groupTs.current,
      })
    },
    [trade, network0, srcCurrencyB?.symbol, address]
  )

  const {
    writeAsync,
    isLoading: isWritePending,
    data,
  } = useContractWrite({
    ...config,
    onSuccess: async (data) => {
      if (tradeRef && trade) {
        tradeRef.current = trade
      }

      setReview(false)

      // Clear input fields
      setValue('')

      data
        .wait()
        .then((receipt) => {
          if (receipt.status === 1) {
            log.info('cross chain swap success (source)', {
              trade: tradeRef?.current,
            })
          } else {
            log.info('cross chain swap failed (source)', {
              trade: tradeRef?.current,
            })

            setStepStates({
              source: StepState.Failed,
              bridge: StepState.NotStarted,
              dest: StepState.NotStarted,
            })
          }

          setStepStates({
            source: StepState.Success,
            bridge: StepState.Pending,
            dest: StepState.NotStarted,
          })
        })
        .catch(() => {
          log.info('cross chain swap error (source)', {
            trade: tradeRef?.current,
          })
          setStepStates({
            source: StepState.Failed,
            bridge: StepState.NotStarted,
            dest: StepState.NotStarted,
          })
        })
        .finally(async () => {
          await refetchBalances()
          setSignature(undefined)
          setTradeId(nanoid())
        })
    },
    onSettled,
    onError: (error) => {
      if (error.message.startsWith('user rejected transaction')) return
      log.error('Cross Chain Swap error', {
        trade: tradeRef?.current,
        error,
      })
      createErrorToast(error.message, false)
    },
  })

  const onComplete = useCallback(() => {
    setReview(false)

    // Reset after half a second because of dialog close animation
    setTimeout(() => {
      setStepStates({
        source: StepState.NotStarted,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })
    }, 500)
  }, [setReview])

  const onClick = useCallback(
    (confirm: () => void) => {
      if (pendingState(stepStates)) {
        setReview(true)
      } else if (review) {
        setStepStates({
          source: StepState.Sign,
          bridge: StepState.NotStarted,
          dest: StepState.NotStarted,
        })

        const promise = writeAsync?.()
        if (promise) {
          promise
            .then(() => {
              confirm()
              setStepStates({
                source: StepState.Pending,
                bridge: StepState.NotStarted,
                dest: StepState.NotStarted,
              })
            })
            .catch((e: unknown) => {
              if (e instanceof UserRejectedRequestError) onComplete()
              else {
                setStepStates({
                  source: StepState.Failed,
                  bridge: StepState.NotStarted,
                  dest: StepState.NotStarted,
                })
              }
            })
        }
      } else {
        setReview(true)
      }
    },
    [onComplete, review, setReview, stepStates, writeAsync]
  )

  const { data: lzData } = useLayerZeroScanLink({ tradeId, network1, network0, txHash: data?.hash })
  const { data: receipt } = useTransaction({
    chainId: network1,
    hash: lzData?.dstTxHash as `0x${string}` | undefined,
  })

  useEffect(() => {
    if (lzData?.status === 'DELIVERED') {
      setStepStates({
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.Success,
      })
    }
    if (lzData?.status === 'FAILED') {
      setStepStates((prev) => ({
        ...prev,
        dest: StepState.PartialSuccess,
      }))
    }
  }, [lzData?.status])

  useEffect(() => {
    if (lzData?.link && groupTs.current && stepStates.source === StepState.Success) {
      void createInfoToast({
        account: address,
        type: 'stargate',
        chainId: network0,
        txHash: '0x',
        href: lzData.link,
        summary: `Bridging ${srcCurrencyB?.symbol} from ${Chain.from(network0).name} to ${Chain.from(network1).name}`,
        timestamp: new Date().getTime(),
        groupTimestamp: groupTs.current,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lzData?.link])

  useEffect(() => {
    if (receipt && groupTs.current) {
      void createToast({
        account: address,
        type: 'swap',
        chainId: network1,
        txHash: receipt.hash as `0x${string}`,
        promise: receipt.wait(),
        summary: {
          pending: `Swapping ${dstCurrencyA?.symbol} to ${tradeRef?.current?.amountOut?.toSignificant(6)} ${
            tradeRef?.current?.amountOut?.currency.symbol
          }`,
          completed: `Swap ${dstCurrencyA?.symbol} to ${tradeRef?.current?.amountOut?.toSignificant(6)} ${
            tradeRef?.current?.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to swap ${
            dstCurrencyA?.symbol
          } to ${tradeRef?.current?.amountOut?.toSignificant(6)} ${tradeRef?.current?.amountOut?.currency.symbol}`,
        },
        timestamp: new Date().getTime(),
        groupTimestamp: groupTs.current,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt])

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isFetching ? (
                    <SkeletonText fontSize="xs" className="w-2/3" />
                  ) : (
                    `Receive ${trade?.amountOut?.toSignificant(6)} ${token1?.symbol}`
                  )}
                </DialogTitle>
                <DialogDescription>
                  Swap {amount?.toSignificant(6)} {token0?.symbol}{' '}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List>
                  <List.Control>
                    <List.KeyValue title="Network">
                      <div className="justify-end w-full gap-1 truncate whitespace-nowrap">
                        {chainName?.[network0]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
                        <br />
                        <span className="text-gray-400 dark:text-slate-500">to</span>{' '}
                        {chainName?.[network1]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
                      </div>
                    </List.KeyValue>
                    <List.KeyValue
                      title="Price impact"
                      subtitle="The impact your trade has on the market price of this pool."
                    >
                      {isFetching ? (
                        <SkeletonText align="right" fontSize="sm" className="w-1/5" />
                      ) : (
                        `${
                          trade?.priceImpact?.lessThan(ZERO) ? '+' : trade?.priceImpact?.greaterThan(ZERO) ? '-' : ''
                        }${Math.abs(Number(trade?.priceImpact?.toFixed(2)))}%`
                      )}
                    </List.KeyValue>
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
                  </List.Control>
                </List>
                {recipient && (
                  <List className="!pt-2">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <a
                          target="_blank"
                          href={Chain.accountUrl(network0, recipient) ?? '#'}
                          className="flex items-center gap-2 cursor-pointer text-blue"
                          rel="noreferrer"
                        >
                          {shortenAddress(recipient)}
                        </a>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  loading={!writeAsync && !isError}
                  onClick={() => onClick(confirm)}
                  disabled={isWritePending || Boolean(!writeAsync && +value > 0) || isError}
                  color={isError ? 'red' : warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
                >
                  {isError ? (
                    'Shoot! Something went wrong :('
                  ) : isWritePending ? (
                    <Dots>Confirm Swap</Dots>
                  ) : (
                    `Swap ${token0?.symbol} for ${token1?.symbol}`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogCustom dialogType={DialogType.Confirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cross-chain swap</DialogTitle>
            <DialogDescription asChild>
              <div>
                <ConfirmationDialogContent
                  dialogState={stepStates}
                  lzUrl={lzData?.link}
                  txHash={data?.hash}
                  dstTxHash={lzData?.dstTxHash}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="py-5">
              <div className="relative flex gap-3">
                <GetStateComponent index={1} state={stepStates.source} />
                <Divider />
                <GetStateComponent index={2} state={stepStates.bridge} />
                <Divider />
                <GetStateComponent index={3} state={stepStates.dest} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="xl" fullWidth>
                {failedState(stepStates) ? 'Try again' : finishedState(stepStates) ? 'Make another swap' : 'Close'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogCustom>
    </DialogProvider>
  )
}
