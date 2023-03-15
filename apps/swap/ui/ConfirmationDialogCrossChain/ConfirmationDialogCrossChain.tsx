import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { AppType } from '@sushiswap/ui/types'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, UserRejectedRequestError } from 'wagmi'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { useBalances, useCreateNotification } from '@sushiswap/react-query'
import { SendTransactionResult } from 'wagmi/actions'
import { createToast, NotificationData } from '@sushiswap/ui/future/components/toast'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { BarLoader } from '@sushiswap/ui/future/components/BarLoader'
import { Button } from '@sushiswap/ui/future/components/button'
import { Divider, failedState, finishedState, GetStateComponent, pendingState, StepState } from './StepStates'
import { ConfirmationDialogContent } from './ConfirmationDialogContent'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useTrade } from '../../lib/useTrade'
import { nanoid } from 'nanoid'
import { useLayerZeroScanLink } from '../../lib/useLayerZeroScanLink'
import { SushiXSwapChainId } from '@sushiswap/sushixswap'
import { createErrorToast } from '@sushiswap/ui'
import { swapErrorToUserReadableMessage } from '../../lib/swapErrorToUserReadableMessage'

interface ConfirmationDialogCrossChainProps {
  enabled?: boolean
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

export const ConfirmationDialogCrossChain: FC<ConfirmationDialogCrossChainProps> = ({ children, enabled = false }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { appType, review, network0, network1, tradeId } = useSwapState()
  const { setReview, setBentoboxSignature, setTradeId } = useSwapActions()
  const [open, setOpen] = useState(false)
  const { data: trade } = useTrade({ crossChain: true })

  const [stepStates, setStepStates] = useState<{ source: StepState; bridge: StepState; dest: StepState }>({
    source: StepState.Success,
    bridge: StepState.Success,
    dest: StepState.Success,
  })

  // const { refetch: refetchNetwork0Balances } = useBalances({ account: address, chainId: network0 })
  // const { refetch: refetchNetwork1Balances } = useBalances({ account: address, chainId: network0 })
  const { mutate: storeNotification } = useCreateNotification({ account: address })
  const { config, isError, error } = usePrepareContractWrite({
    ...getSushiXSwapContractConfig(network0 as SushiXSwapChainId),
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled: Boolean(trade?.writeArgs) && appType === AppType.xSwap && chain?.id === network0 && enabled,
    overrides: trade?.overrides,
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !network0 || !data) return

      const ts = new Date().getTime()
      const notificationData: NotificationData = {
        type: 'swap',
        chainId: network0,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Swapping ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } to ${trade.amountOut?.toSignificant(6)} ${trade.amountOut?.currency.symbol}`,
          completed: `Swap ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } to ${trade.amountOut?.toSignificant(6)} ${trade.amountOut?.currency.symbol}`,
          failed: `Something went wrong when trying to swap ${trade.amountIn?.currency.symbol} to ${trade.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      }

      storeNotification(createToast(notificationData))
    },
    [trade, network0, storeNotification]
  )

  const {
    writeAsync,
    isLoading: isWritePending,
    data,
  } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      setReview(false)

      data
        .wait()
        .then(() => {
          setStepStates({
            source: StepState.Success,
            bridge: StepState.Pending,
            dest: StepState.NotStarted,
          })
        })
        .catch(() => {
          setStepStates({
            source: StepState.Failed,
            bridge: StepState.NotStarted,
            dest: StepState.NotStarted,
          })
        })
        .finally(() => {
          // void Promise.all([refetchNetwork0Balances(), refetchNetwork1Balances()])
          setBentoboxSignature(undefined)
          setTradeId(nanoid())
        })
    },
    onSettled,
    onError: (data) => createErrorToast(swapErrorToUserReadableMessage(data), false),
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
          <div className="flex flex-col gap-5 items-center justify-center">
            <div className="h-1" />
            <div className="py-5">
              <div className="flex gap-3 relative">
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
