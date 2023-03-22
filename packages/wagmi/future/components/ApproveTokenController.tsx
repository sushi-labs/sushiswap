import React, { FC, ReactNode } from 'react'
import { ApprovalState, useERC20ApproveCallback } from '../../hooks'
import { Amount, Currency } from '@sushiswap/currency'

interface ApproveTokenController {
  amount: Amount<Currency> | undefined
  contract: string | undefined
  children({ approvalState, onApprove }: { approvalState: ApprovalState; onApprove(): void }): ReactNode
}

export const ApproveTokenController: FC<ApproveTokenController> = ({ amount, contract, children }) => {
  const [approvalState, onApprove] = useERC20ApproveCallback(Boolean(!!amount && !!contract), amount, contract)

  return <>{children({ approvalState, onApprove })}</>
}
