import { AddressZero } from '@ethersproject/constants'
import { ApprovalState } from 'types/approval-state'
import { Amount, Token } from '@sushiswap/currency'
import { BigNumber, Contract } from 'ethers'
import { MAX_UINT256 } from '@sushiswap/math'
import { useCallback, useMemo } from 'react'
import { erc20ABI, useAccount, useContract, useSigner, useWaitForTransaction } from 'wagmi'
import { useTokenAllowance } from './useTokenAllowance'

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: Amount<Token>,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const [{ data: account }] = useAccount()
  const [{ data: signer }, getSigner] = useSigner()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useTokenAllowance(token, account?.address ?? undefined, spender)
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, spender])

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
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MAX_UINT256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    const tx = await tokenContract.approve(spender, useExact ? amountToApprove.quotient.toString() : MAX_UINT256, {
      gasLimit: calculateGasMargin(estimatedGas),
    })

    const waitForApproval = await wait({ confirmations: 1, hash: tx.hash })
    if (waitForApproval.data && !waitForApproval.error) {
      console.log('Successfully approved token') // TODO: should probably refactor and update the state to PENDING?
    } else {
      console.log(waitForApproval)
    }
  }, [approvalState, token, tokenContract, amountToApprove, spender, wait])

  return [approvalState, approve]
}
