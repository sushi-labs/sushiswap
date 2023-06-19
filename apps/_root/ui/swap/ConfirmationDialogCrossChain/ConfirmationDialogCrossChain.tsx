import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AppType } from '@sushiswap/ui/types'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useTransaction,
} from '@sushiswap/wagmi'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { createErrorToast, createInfoToast, createToast } from '@sushiswap/ui/future/components/toast'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { Button } from '@sushiswap/ui/future/components/button'
import { Divider, failedState, finishedState, GetStateComponent, pendingState, StepState } from './StepStates'
import { ConfirmationDialogContent } from './ConfirmationDialogContent'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useTrade } from '../../../lib/swap/useTrade'
import { nanoid } from 'nanoid'
import { useLayerZeroScanLink } from '../../../lib/swap/useLayerZeroScanLink'
import { SushiXSwapChainId } from '@sushiswap/sushixswap'
import { useApproved, useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { Chain } from '@sushiswap/chain'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS } from '@sushiswap/stargate'
import { log } from 'next-axiom'
import { useBalanceWeb3Refetch } from '@sushiswap/wagmi/future/hooks'
import { APPROVE_XSWAP_TAG } from '../widget/SwapButtonCrossChain'

interface ConfirmationDialogCrossChainProps {
  children({
    onClick,
    isWritePending,
  }: {
    error: Error | null
    onClick(): void
    isError: boolean
    isWritePending: boolean
    isLoading: boolean
    isConfirming: boolean
  }): ReactNode
}

export const ConfirmationDialogCrossChain: FC<ConfirmationDialogCrossChainProps> = ({ children }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { appType, review, network0, token0, token1, network1, tradeId } = useSwapState()
  const { setReview, setTradeId } = useSwapActions()
  const [open, setOpen] = useState(false)
  const { data: trade } = useTrade({ crossChain: true })
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

  const { config, isError, error } = usePrepareContractWrite({
    ...getSushiXSwapContractConfig(network0 as SushiXSwapChainId),
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled:
      Boolean(trade?.writeArgs) &&
      Boolean(review) &&
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
      setReview(false)

      data
        .wait()
        .then((receipt) => {
          if (receipt.status === 1) {
            log.info('cross chain swap success (source)', {
              trade,
            })
          } else {
            log.info('cross chain swap failed (source)', {
              trade,
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
            trade,
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
        trade,
        error,
      })
      createErrorToast(error.message, false)
    },
  })

  const onComplete = useCallback(() => {
    setOpen(false)

    // Reset after half a second because of dialog close animation
    setTimeout(() => {
      setStepStates({
        source: StepState.NotStarted,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })
    }, 500)
  }, [])

  const onClick = useCallback(() => {
    if (pendingState(stepStates)) {
      setOpen(true)
    } else if (review) {
      setOpen(true)
      setStepStates({
        source: StepState.Sign,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      const promise = writeAsync?.()
      if (promise) {
        promise
          .then(() => {
            setStepStates({
              source: StepState.Pending,
              bridge: StepState.NotStarted,
              dest: StepState.NotStarted,
            })
            setOpen(true)
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
  }, [onComplete, review, setReview, stepStates, writeAsync])

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
          pending: `Swapping ${dstCurrencyA?.symbol} to ${trade?.amountOut?.toSignificant(6)} ${
            trade?.amountOut?.currency.symbol
          }`,
          completed: `Swap ${dstCurrencyA?.symbol} to ${trade?.amountOut?.toSignificant(6)} ${
            trade?.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to swap ${
            dstCurrencyA?.symbol
          } to ${trade?.amountOut?.toSignificant(6)} ${trade?.amountOut?.currency.symbol}`,
        },
        timestamp: new Date().getTime(),
        groupTimestamp: groupTs.current,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt])

  return (
    <>
      {children({
        onClick,
        isWritePending,
        isLoading: !writeAsync,
        error,
        isError,
        isConfirming: stepStates.source === StepState.Sign,
      })}
      <Dialog
        open={open}
        unmount={false}
        onClose={() => (failedState(stepStates) || finishedState(stepStates) ? setOpen(false) : {})}
      >
        <Dialog.Content>
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="h-1" />
            <div className="py-5">
              <div className="relative flex gap-3">
                <GetStateComponent index={1} state={stepStates.source} />
                <Divider />
                <GetStateComponent index={2} state={stepStates.bridge} />
                <Divider />
                <GetStateComponent index={3} state={stepStates.dest} />
              </div>
            </div>
            <div className="flex flex-col items-center mb-4">
              <ConfirmationDialogContent
                dialogState={stepStates}
                lzUrl={lzData?.link}
                txHash={data?.hash}
                dstTxHash={lzData?.dstTxHash}
              />
            </div>
            <Button fullWidth color="blue" variant="outlined" size="xl" onClick={() => setOpen(false)}>
              {failedState(stepStates) ? 'Try again' : finishedState(stepStates) ? 'Make another swap' : 'Close'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
