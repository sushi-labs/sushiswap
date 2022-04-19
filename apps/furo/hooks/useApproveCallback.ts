import { calculateGasMargin } from 'app/functions/trade'
import { Amount, Token } from 'currency'
import { MAX_UINT256 } from 'math'
import { useCallback, useMemo } from 'react'
import { erc20ABI, useAccount, useContract, useWaitForTransaction } from 'wagmi'
import { useTokenAllowance } from './useTokenAllowance'


export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: Amount<Token>,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const [{ data: account }] = useAccount()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useTokenAllowance(token, account.address ?? undefined, spender)
  const [_, wait] = useWaitForTransaction({
    skip: true,
  });

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, spender])

  const tokenContract = useContract({
    addressOrName: token?.address,
    contractInterface: erc20ABI,
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

    const { hash } = tokenContract.approve(spender, useExact ? amountToApprove.quotient.toString() : MAX_UINT256, {
      gasLimit: calculateGasMargin(estimatedGas),
    })
    const waitForApproval = await wait({ confirmations: 1, hash });
    console.log({waitForApproval})

  }, [approvalState, token, tokenContract, amountToApprove, spender, wait])

  return [approvalState, approve]
}
