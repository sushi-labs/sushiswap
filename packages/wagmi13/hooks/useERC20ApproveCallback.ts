import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { ErrorCode } from '@ethersproject/logger'
import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Currency } from '@sushiswap/currency'
import { calculateGasMargin } from '@sushiswap/gas'
import { createErrorToast, NotificationData } from '@sushiswap/ui13/components/toast'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Address,
  erc20ABI,
  useAccount,
  useContract,
  usePrepareSendTransaction,
  UserRejectedRequestError,
  useSendTransaction,
  useSigner,
} from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useERC20Allowance } from './useERC20Allowance'

export enum ApprovalState {
  LOADING = 'LOADING',
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useERC20ApproveCallback(
  watch: boolean,
  amountToApprove: Amount<Currency> | undefined,
  spender: string | undefined,
  onSuccess?: (data: NotificationData) => void
): [ApprovalState, () => void] {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, e: Error | null) => {
      // TODO: ignore until wagmi workaround on ethers error
      // @ts-ignore
      if (e?.code === ErrorCode.ACTION_REJECTED) {
        createErrorToast(e?.message, true)
      }

      if (data && onSuccess && amountToApprove) {
        const ts = new Date().getTime()
        onSuccess({
          type: 'approval',
          chainId: amountToApprove.currency.chainId,
          txHash: data.hash,
          promise: data.wait(),
          summary: {
            pending: `Approving ${amountToApprove.currency.symbol}`,
            completed: `Successfully approved ${amountToApprove.currency.symbol}`,
            failed: `Something went wrong approving ${amountToApprove.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [amountToApprove, onSuccess]
  )

  const [request, setRequest] = useState<TransactionRequest & { to: string }>()
  const { config } = usePrepareSendTransaction({
    chainId: amountToApprove?.currency.chainId,
    request,
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
  })

  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const { data: currentAllowance, isLoading } = useERC20Allowance(watch, token, address ?? undefined, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (isLoading) return ApprovalState.LOADING
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    if (isWritePending) return ApprovalState.PENDING

    // We might not have enough data to know whether we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, isLoading, isWritePending, spender])

  const tokenContract = useContract({
    address: token?.address ?? AddressZero,
    abi: erc20ABI,
    signerOrProvider: signer,
  })

  const prepare = useCallback(async (): Promise<void> => {
    try {
      if (
        !amountToApprove?.currency.chainId ||
        approvalState !== ApprovalState.NOT_APPROVED ||
        !token ||
        !tokenContract ||
        !amountToApprove ||
        !spender
      ) {
        return
      }

      let useExact = false
      const estimatedGas = await tokenContract.estimateGas.approve(spender as Address, MaxUint256).catch(() => {
        // General fallback for tokens who restrict approval amounts
        useExact = true
        return tokenContract.estimateGas.approve(
          spender as Address,
          BigNumber.from(amountToApprove.quotient.toString())
        )
      })

      setRequest({
        from: address,
        to: tokenContract?.address,
        data: tokenContract.interface.encodeFunctionData('approve', [
          spender,
          useExact ? amountToApprove.quotient.toString() : MaxUint256,
        ]),
        gasLimit: calculateGasMargin(estimatedGas),
      })
    } catch (e: unknown) {
      if (e instanceof UserRejectedRequestError) return
      console.error(e)
    }
  }, [amountToApprove, approvalState, token, tokenContract, spender, address])

  // Prepare transaction
  useEffect(() => {
    void prepare()
  }, [prepare])

  return useMemo(() => [approvalState, () => sendTransaction?.()], [approvalState, sendTransaction])
}
