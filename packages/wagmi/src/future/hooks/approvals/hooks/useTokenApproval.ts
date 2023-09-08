'use client'

import { Amount, Type } from '@sushiswap/currency'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback, useMemo, useState } from 'react'
import { maxUint256, UserRejectedRequestError } from 'viem'
import { Address, erc20ABI, useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { useTokenAllowance } from './useTokenAllowance'

export enum ApprovalState {
  LOADING = 'LOADING',
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

interface UseTokenApprovalParams {
  spender: Address | undefined
  amount: Amount<Type> | undefined
  approveMax?: boolean
  enabled?: boolean
}

const usdtApproveAbi = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const useTokenApproval = ({
  amount,
  spender,
  enabled = true,
  approveMax,
}: UseTokenApprovalParams): [ApprovalState, ReturnType<typeof useContractWrite>] => {
  const { address } = useAccount()
  const [pending, setPending] = useState(false)
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch,
  } = useTokenAllowance({
    token: amount?.currency?.wrapped,
    owner: address,
    spender,
    chainId: amount?.currency.chainId,
    enabled: Boolean(amount?.currency?.isToken && enabled),
  })

  const { config } = usePrepareContractWrite({
    chainId: amount?.currency.chainId,
    abi: erc20ABI,
    address: amount?.currency?.wrapped?.address as Address,
    functionName: 'approve',
    args: [spender as Address, approveMax ? maxUint256 : amount ? amount.quotient : 0n],
    enabled: Boolean(amount && spender && address && allowance && enabled && !isAllowanceLoading),
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, e: Error | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          createErrorToast(e.message, true)
        }
      }

      if (data && amount) {
        setPending(true)

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'approval',
          chainId: amount.currency.chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Approving ${amount.currency.symbol}`,
            completed: `Successfully approved ${amount.currency.symbol}`,
            failed: `Something went wrong approving ${amount.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [address, amount]
  )

  const execute = useContractWrite({
    ...config,
    onSettled,
    onSuccess: (data) => {
      waitForTransaction({ hash: data.hash })
        .then(() => {
          refetch().then(() => {
            setPending(false)
          })
        })
        .catch(() => setPending(false))
    },
  })

  return useMemo(() => {
    let state = ApprovalState.UNKNOWN
    if (amount?.currency.isNative) state = ApprovalState.APPROVED
    else if (allowance && amount && allowance.greaterThan(amount)) state = ApprovalState.APPROVED
    else if (allowance && amount && allowance.equalTo(amount)) state = ApprovalState.APPROVED
    else if (pending) state = ApprovalState.PENDING
    else if (isAllowanceLoading) state = ApprovalState.LOADING
    else if (allowance && amount && allowance.lessThan(amount)) state = ApprovalState.NOT_APPROVED

    return [state, execute]
  }, [allowance, amount, execute, isAllowanceLoading, pending])
}
