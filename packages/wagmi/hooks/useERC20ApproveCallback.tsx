import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { Chain } from '@sushiswap/chain'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { Amount, Currency } from '@sushiswap/currency'
import { createToast, Dots } from '@sushiswap/ui'
import { BigNumber, Contract } from 'ethers'
import { useCallback, useMemo } from 'react'
import { erc20ABI, useAccount, useContract, useSendTransaction, useSigner } from 'wagmi'

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
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

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

    createToast({
      txHash: data.hash,
      href: Chain.from(amountToApprove.currency.chainId).getTxUrl(data.hash),
      promise: data.wait(),
      summary: {
        pending: <Dots>Approving {amountToApprove.currency.symbol}</Dots>,
        completed: `Successfully approved ${amountToApprove.currency.symbol}`,
        failed: `Something went wrong approving ${amountToApprove.currency.symbol}`,
      },
    })
  }, [approvalState, token, tokenContract, amountToApprove, spender, sendTransactionAsync, address])

  return [approvalState, approve]
}
