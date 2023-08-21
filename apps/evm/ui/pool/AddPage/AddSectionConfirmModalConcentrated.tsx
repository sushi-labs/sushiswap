import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import {
  ConfirmationDialog as UIConfirmationDialog,
  ConfirmationDialogState,
} from '@sushiswap/ui/components/dialog/ConfirmationDialog'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { isSushiSwapV3ChainId, NonfungiblePositionManager, Position } from '@sushiswap/v3-sdk'
import { useAccount, useNetwork, usePrepareSendTransaction, useSendTransaction } from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { getV3NonFungiblePositionManagerConractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3NonFungiblePositionManager'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { Hex, UserRejectedRequestError } from 'viem'

import { useConcentratedDerivedMintInfo } from '../ConcentratedLiquidityProvider'

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
  token0: Type | undefined
  token1: Type | undefined
  chainId: ChainId
  tokenId: number | string | undefined
  existingPosition: Position | undefined
  onSuccess(): void
  successLink?: string
}

export const AddSectionConfirmModalConcentrated: FC<AddSectionConfirmModalConcentratedProps> = ({
  token0,
  token1,
  chainId,
  tokenId,
  children,
  noLiquidity,
  position,
  closeReview,
  existingPosition,
  onSuccess,
  successLink,
}) => {
  const { chain } = useNetwork()
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)
  const [open, setOpen] = useState(false)
  const { address } = useAccount()

  const { data: deadline } = useTransactionDeadline({ chainId })
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const hasExistingPosition = !!existingPosition

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (!data || !token0 || !token1) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: noLiquidity
            ? `Creating the ${token0.symbol}/${token1.symbol} liquidity pool`
            : `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: noLiquidity
            ? `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
            : `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: noLiquidity
            ? 'Something went wrong when trying to create the pool'
            : 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [token0, token1, address, chainId, noLiquidity]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!chainId || !address || !token0 || !token1 || !isSushiSwapV3ChainId(chainId)) return {}

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

      return {
        to: getV3NonFungiblePositionManagerConractConfig(chainId).address,
        data: calldata as Hex,
        value: BigInt(value),
      }
    }

    return {}
  }, [address, chainId, deadline, hasExistingPosition, noLiquidity, position, slippagePercent, token0, token1, tokenId])

  const onComplete = useCallback(() => {
    setOpen(false)

    // Reset after half a second because of dialog close animation
    setTimeout(() => {
      setDialogState(ConfirmationDialogState.Undefined)
    }, 500)
  }, [])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: chainId === chain?.id,
  })

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data,
  } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: (data) => {
      closeReview()

      onSuccess()

      waitForTransaction({ hash: data.hash }).then((receipt) => {
        if (receipt.status === 'success') {
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
          <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-semibold text-center">
            You successfully added liquidity to the {token0?.symbol}/{token1?.symbol} pair
          </h1>
        }
        buttonSuccessMessage="View position"
        buttonSuccessLink={successLink}
      />
    </>
  )
}
