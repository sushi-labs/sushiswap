import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Type } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import { Dots } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { useSendTransaction } from '@sushiswap/wagmi'
import { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount, UserRejectedRequestError } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { AddSectionReviewModal } from './AddSectionReviewModal'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { NonfungiblePositionManager } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityURLState } from '../ConcentratedLiquidityURLStateProvider'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { useV3NFTPositionManagerContract } from '@sushiswap/wagmi/hooks/useNFTPositionManagerContract'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { useConcentratedDerivedMintInfo } from '../../lib/hooks/useConcentratedDerivedMintInfo'
import {
  ConfirmationDialog as UIConfirmationDialog,
  ConfirmationDialogState,
} from '@sushiswap/ui/dialog/ConfirmationDialog'

interface AddSectionConfirmModalConcentratedProps
  extends Pick<ReturnType<typeof useConcentratedDerivedMintInfo>, 'noLiquidity' | 'position'> {
  closeReview(): void
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

export const AddSectionConfirmModalConcentrated: FC<AddSectionConfirmModalConcentratedProps> = ({
  children,
  noLiquidity,
  position,
  closeReview,
}) => {
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)
  const [open, setOpen] = useState(false)
  const { token0, token1, chainId, tokenId } = useConcentratedLiquidityURLState()
  const { address } = useAccount()

  const { data: deadline } = useTransactionDeadline({ chainId })
  const positionManager = useV3NFTPositionManagerContract(chainId)
  const [slippageTolerance] = useSlippageTolerance()

  // TODO
  const hasExistingPosition = false

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !token0 || !token1) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [token0, token1, address, chainId]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!chainId || !address || !positionManager || !token0 || !token1) return

      if (position && deadline) {
        const useNative = token0.isNative ? token0 : token1.isNative ? token1 : undefined
        const { calldata, value } =
          hasExistingPosition && tokenId
            ? NonfungiblePositionManager.addCallParameters(position, {
                tokenId,
                slippageTolerance: slippagePercent,
                deadline: deadline.toString(),
                useNative,
              })
            : NonfungiblePositionManager.addCallParameters(position, {
                slippageTolerance: slippagePercent,
                recipient: address,
                deadline: deadline.toString(),
                useNative,
                createPool: noLiquidity,
              })

        setRequest({
          to: positionManager.address,
          data: calldata,
          value,
        })
      }
    },
    [
      address,
      chainId,
      deadline,
      hasExistingPosition,
      noLiquidity,
      position,
      positionManager,
      slippagePercent,
      token0,
      token1,
      tokenId,
    ]
  )

  const onComplete = useCallback(() => {
    setOpen(false)

    // Reset after half a second because of dialog close animation
    setTimeout(() => {
      setDialogState(ConfirmationDialogState.Undefined)
    }, 500)
  }, [])

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data,
  } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: (data) => {
      closeReview()

      data.wait().then((receipt) => {
        if (receipt.status === 1) {
          setDialogState(ConfirmationDialogState.Success)
        } else {
          setDialogState(ConfirmationDialogState.Failed)
        }
      })
    },
  })

  const onClick = useCallback(() => {
    if (dialogState === ConfirmationDialogState.Pending) {
      setOpen(true)
    } else if (!open) {
      const promise = sendTransactionAsync?.()
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
      setOpen(true)
    }
  }, [dialogState, onComplete, open, sendTransactionAsync])

  return (
    <>
      {children({
        onClick,
        // TODO
        isError: false,
        error: null,
        isWritePending,
        isLoading: !sendTransactionAsync,
        isConfirming: dialogState === ConfirmationDialogState.Pending,
      })}
      <UIConfirmationDialog
        chainId={chainId}
        txHash={data?.hash}
        open={open}
        setOpen={() => setOpen(false)}
        state={dialogState}
        isWritePending={isWritePending}
        onComplete={onComplete}
        successMessage={
          <h1 className="flex flex-wrap items-center justify-center text-center gap-1 text-lg font-semibold">
            You successfully added liquidity to the {token0?.symbol}/{token1?.symbol} pair
          </h1>
        }
        buttonSuccessMessage="Close"
      />
    </>
  )
}
