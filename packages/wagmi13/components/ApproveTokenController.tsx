import React from 'react'
import { FC, ReactNode } from 'react'
import { ApprovalState, useERC20ApproveCallback } from '../hooks'
import { Amount, Currency } from '@sushiswap/currency'
import { NotificationData } from '@sushiswap/ui13/components/toast'

interface ApproveTokenController {
  amount: Amount<Currency> | undefined
  contract: string | undefined
  onSuccess?: (data: NotificationData) => void
  children({ approvalState, onApprove }: { approvalState: ApprovalState; onApprove(): void }): ReactNode
}

export const ApproveTokenController: FC<ApproveTokenController> = ({ amount, contract, onSuccess, children }) => {
  const [approvalState, onApprove] = useERC20ApproveCallback(
    Boolean(!!amount && !!contract),
    amount,
    contract,
    onSuccess
  )

  return <>{children({ approvalState, onApprove })}</>
}
