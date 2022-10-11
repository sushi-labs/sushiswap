import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { Amount, Currency } from '@sushiswap/currency'
import { NotificationData } from '@sushiswap/ui'
import { BigNumber, Contract } from 'ethers'
import { useCallback, useMemo } from 'react'
import {
  erc20ABI,
  useAccount,
  useContract,
  useDeprecatedSendTransaction,
  useNetwork,
  UserRejectedRequestError,
  useSigner,
} from 'wagmi'

import { useERC20Allowance } from './useERC20Allowance'

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useERC20ApproveCallback(
  watch: boolean,
  amountToApprove?: Amount<Currency>,
  spender?: string,
  onSuccess?: (data: NotificationData) => void
): [ApprovalState, () => Promise<void>] {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { sendTransactionAsync, isLoading: isWritePending } = useDeprecatedSendTransaction()

  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useERC20Allowance(watch, token, address ?? undefined, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    if (isWritePending) return ApprovalState.PENDING

    // We might not have enough data to know whether we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, isWritePending, spender])

  const tokenContract = useContract<Contract>({
    addressOrName: token?.address ?? AddressZero,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

  const approve = useCallback(async (): Promise<void> => {
    if (!chain?.id) {
      console.error('Not connected')
      return
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // General fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    try {
      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: tokenContract?.address,
          data: tokenContract.interface.encodeFunctionData('approve', [
            spender,
            useExact ? amountToApprove.quotient.toString() : MaxUint256,
          ]),
          gasLimit: calculateGasMargin(estimatedGas),
        },
      })

      if (onSuccess) {
        const ts = new Date().getTime()
        onSuccess({
          type: 'approval',
          chainId: chain?.id,
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
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        console.error(e)
      }
    }
  }, [
    chain?.id,
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    sendTransactionAsync,
    address,
    onSuccess,
  ])

  return [approvalState, approve]
}
