import type { TTLStorageKey } from '@sushiswap/hooks'
import { Button, type ButtonProps, classNames } from '@sushiswap/ui'
import React, { useEffect, useState, type FC } from 'react'
import { PERMIT2_ADDRESS, type Permit2ChainId } from 'src/lib/permit2/config'
import { usePermit2Approve } from 'src/lib/permit2/usePermit2Approve'
import { usePermit2Single } from 'src/lib/permit2/usePermit2Single'
import type { Amount, Type } from 'sushi/currency'
import type { Address } from 'viem/accounts'
import { useAccount, useBytecode } from 'wagmi'
import { ApprovalState } from '../../hooks/approvals/hooks/useTokenApproval'
import { ApproveERC20 } from './ApproveERC20'
import { useApprovedActions } from './Provider'

enum ApprovalType {
  Signature = 'signature',
  Transaction = 'Transaction',
}

interface ApproveERC20Permit2Props extends ButtonProps {
  id: string
  chainId: Permit2ChainId
  amount: Amount<Type> | undefined
  contract: Address | undefined
  enabled?: boolean
  ttlStorageKey: TTLStorageKey
  tag: string
}

const ApproveERC20Permit2: FC<ApproveERC20Permit2Props> = ({
  chainId,
  ttlStorageKey,
  ...props
}) => {
  return (
    <ApproveERC20 {...props} contract={PERMIT2_ADDRESS[chainId]}>
      <_ApproveERC20Permit2
        ttlStorageKey={ttlStorageKey}
        chainId={chainId}
        {...props}
      />
    </ApproveERC20>
  )
}

const _ApproveERC20Permit2: FC<ApproveERC20Permit2Props> = ({
  id,
  chainId,
  amount,
  contract,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  ttlStorageKey,
  tag,
  ...props
}) => {
  const [approvalType, setApprovalType] = useState(ApprovalType.Signature)

  const { address } = useAccount()

  const { data: bytecode } = useBytecode({
    address,
    query: {
      refetchInterval: Number.POSITIVE_INFINITY,
    },
  })

  useEffect(() => {
    if (bytecode) setApprovalType(ApprovalType.Transaction)
  }, [bytecode])

  const { setSignature } = useApprovedActions(tag)

  const [approvalState, { write: onApprove }] = usePermit2Approve({
    chainId,
    amount,
    spender: contract,
    enabled: enabled,
  })

  useEffect(() => {
    // reset signature when approved via tx
    if (approvalState === ApprovalState.APPROVED) setSignature(undefined)
  }, [approvalState, setSignature])

  const [permitState, { write: onPermit }] = usePermit2Single({
    chainId,
    amount,
    spender: contract,
    enabled: enabled && approvalType === ApprovalType.Signature,
    tag,
  })

  const state =
    approvalType === ApprovalType.Signature ? permitState : approvalState

  if (state === ApprovalState.APPROVED || !enabled) {
    return <>{children}</>
  }

  const loading = [
    ApprovalState.UNKNOWN,
    ApprovalState.LOADING,
    ApprovalState.PENDING,
  ].includes(state)

  const disabled =
    state !== ApprovalState.NOT_APPROVED || (!onPermit && !onApprove)

  return (
    <Button
      disabled={disabled}
      className={classNames(className, 'group relative')}
      loading={loading}
      onClick={() =>
        approvalType === ApprovalType.Signature ? onPermit?.() : onApprove?.()
      }
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      Permit {amount?.currency.symbol}
    </Button>
  )
}

export { ApproveERC20Permit2, type ApproveERC20Permit2Props }
