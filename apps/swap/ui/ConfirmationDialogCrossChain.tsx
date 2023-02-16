import { FC, ReactNode, useCallback, useState } from 'react'
import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { AppType } from '@sushiswap/ui/types'
import { useAccount, useContractWrite, usePrepareContractWrite, UserRejectedRequestError } from 'wagmi'
import { useTrade } from '../lib/useTrade'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { useBalances, useCreateNotification } from '@sushiswap/react-query'
import { SendTransactionResult } from 'wagmi/actions'
import { createToast, NotificationData } from '@sushiswap/ui/future/components/toast'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { BarLoader } from '@sushiswap/ui/future/components/BarLoader'
import { Loader } from '@sushiswap/ui/future/components/Loader'
import { CheckMarkIcon } from '@sushiswap/ui/future/components/icons/CheckmarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/future/components/icons/FailedMarkIcon'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { Button } from '@sushiswap/ui/future/components/button'

interface ConfirmationDialogCrossChainProps {
  children({
    onClick,
    isWritePending,
  }: {
    onClick(): void
    isWritePending: boolean
    isLoading: boolean
    isConfirming: boolean
  }): ReactNode
}

enum ConfirmationDialogState {
  Undefined,
  Pending,
  Success,
  Failed,
  Sign,
}

export const ConfirmationDialogCrossChain: FC<ConfirmationDialogCrossChainProps> = ({ children }) => {
  const { address } = useAccount()
  const { appType, review, network0, token0, token1 } = useSwapState()
  const { setReview, setBentoboxSignature } = useSwapActions()
  const [open, setOpen] = useState(false)
  const { data: trade } = useTrade({ crossChain: true })
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)
  const { refetch: refetchNetwork0Balances } = useBalances({ account: address, chainId: network0 })
  const { refetch: refetchNetwork1Balances } = useBalances({ account: address, chainId: network0 })
  const { mutate: storeNotification } = useCreateNotification({ account: address })

  const { config } = usePrepareContractWrite({
    chainId: network0,
    address: getSushiXSwapContractConfig(network0).address,
    abi: getSushiXSwapContractConfig(network0).abi,
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled: Boolean(trade?.writeArgs) && appType === AppType.xSwap,
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

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      setReview(false)

      data
        .wait()
        .then(() => setDialogState(ConfirmationDialogState.Success))
        .catch(() => setDialogState(ConfirmationDialogState.Failed))
        .finally(() => {
          Promise.all([refetchNetwork0Balances(), refetchNetwork1Balances()])
          setBentoboxSignature(undefined)
        })
    },
    onSettled,
  })

  const onComplete = useCallback(() => {
    setOpen(false)

    // Reset after half a second because of dialog close animation
    setTimeout(() => {
      setDialogState(ConfirmationDialogState.Undefined)
    }, 500)
  }, [])

  const onClick = useCallback(() => {
    if (dialogState === ConfirmationDialogState.Pending) {
      setOpen(true)
    } else if (review) {
      const promise = writeAsync?.()
      if (promise) {
        promise
          .then(() => {
            setDialogState(ConfirmationDialogState.Pending)
            setOpen(true)
          })
          .catch((e: unknown) => {
            if (e instanceof UserRejectedRequestError) onComplete()
            else setDialogState(ConfirmationDialogState.Failed)
          })
      }
    } else {
      setReview(true)
    }
  }, [dialogState, onComplete, review, setReview, writeAsync])

  return (
    <>
      {children({
        onClick,
        isWritePending,
        isLoading: !writeAsync,
        isConfirming: false,
      })}
      <Dialog open={open} unmount={false} onClose={() => setOpen(false)}>
        <Dialog.Content>
          <div className="flex flex-col gap-5 items-center justify-center">
            {[ConfirmationDialogState.Failed, ConfirmationDialogState.Success].includes(dialogState) ? (
              <BarLoader transitionDuration={4000} onComplete={onComplete} />
            ) : (
              <div className="h-1" />
            )}
            <div className="py-5">
              {dialogState === ConfirmationDialogState.Pending || isWritePending ? (
                <Loader size={100} strokeWidth={1} className="!text-blue" />
              ) : dialogState === ConfirmationDialogState.Success ? (
                <CheckMarkIcon width={100} height={100} />
              ) : (
                <FailedMarkIcon width={100} height={100} />
              )}
            </div>
            <div className="flex flex-col items-center">
              {dialogState === ConfirmationDialogState.Sign ? (
                <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
                  Please sign order with your wallet.
                </h1>
              ) : dialogState === ConfirmationDialogState.Pending ? (
                <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
                  Waiting for your{' '}
                  <span className="text-blue hover:underline cursor-pointer">
                    <Dots>transaction</Dots>
                  </span>{' '}
                  to be confirmed on the blockchain.
                </h1>
              ) : dialogState === ConfirmationDialogState.Success ? (
                <h1 className="flex flex-wrap justify-center gap-1 font-semibold text-lg items-center">
                  You sold
                  <span className="text-red px-0.5">
                    {trade?.amountIn?.toSignificant(6)} {token0.symbol}
                  </span>{' '}
                  for
                  <span className="text-blue px-0.5">
                    {trade?.amountOut?.toSignificant(6)} {token1.symbol}.
                  </span>
                </h1>
              ) : (
                <h1 className="flex flex-wrap justify-center gap-1 font-semibold text-lg items-center">
                  <span className="text-red">Oops!</span> Your{' '}
                  <span className="text-blue hover:underline cursor-pointer">transaction</span> failed
                </h1>
              )}
            </div>
            <Button fullWidth color="blue" variant="outlined" size="xl" onClick={() => setOpen(false)}>
              {dialogState === ConfirmationDialogState.Success
                ? 'Make another swap'
                : dialogState === ConfirmationDialogState.Failed
                ? 'Try again'
                : 'Close'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
