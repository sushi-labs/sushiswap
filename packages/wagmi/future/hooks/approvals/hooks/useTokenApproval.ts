import { Amount, Type } from '@sushiswap/currency'
import {
  Address,
  erc20ABI,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  UserRejectedRequestError,
} from 'wagmi'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from 'ethers'
import { useTokenAllowance } from './useTokenAllowance'
import { useCallback, useMemo, useState } from 'react'
import { SendTransactionResult } from 'wagmi/actions'
import { createErrorToast, createToast } from '@sushiswap/ui/future/components/toast'

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
    args: [
      spender as Address,
      approveMax ? MaxUint256 : amount ? BigNumber.from(amount.quotient.toString()) : BigNumber.from(0),
    ],
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
          promise: data.wait(),
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
      data
        .wait()
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
