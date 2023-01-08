import React, { FC } from 'react'
import { ApproveTokenController } from '../../components'
import { Button, ButtonProps } from '@sushiswap/ui13/components/button'
import { Amount, Type } from '@sushiswap/currency'
import { ApprovalState } from '../../hooks'

export interface ApproveERC20Props extends ButtonProps<'button'> {
  id: string
  amount: Amount<Type> | undefined
  contract: string
}

export const ApproveERC20: FC<ApproveERC20Props> = ({
  id,
  amount,
  contract,
  children,
  className,
  variant,
  fullWidth,
  as,
  size,
}) => {
  return (
    <ApproveTokenController amount={amount} contract={contract}>
      {({ approvalState, onApprove }) => {
        if (approvalState === ApprovalState.APPROVED) {
          return <>{children}</>
        }

        return (
          <Button
            as={as}
            loading={[ApprovalState.LOADING, ApprovalState.PENDING].includes(approvalState)}
            testdata-id={id}
            variant={variant}
            size={size}
            className={className}
            fullWidth={fullWidth}
            onClick={onApprove}
          >
            Approve {amount?.currency.symbol}
          </Button>
        )
      }}
    </ApproveTokenController>
  )
}
