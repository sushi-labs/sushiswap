import React, { FC, ReactNode, useEffect } from 'react'
import { ApprovalState, useBentoBoxApproveCallback, useERC20ApproveCallback } from '../../hooks'
import { Amount, Currency } from '@sushiswap/currency'
import { NotificationData } from '@sushiswap/ui/future/components/toast'
import { Signature } from '@ethersproject/bytes'
import { ChainId } from '@sushiswap/chain'
import { Address } from 'wagmi'

interface ApproveBentoboxController {
  chainId: ChainId
  contract: Address
  enabled?: boolean
  onSuccess?: (data: NotificationData) => void
  onSignature?: (data: Signature) => void

  children({
    approvalState,
    onApprove,
  }: {
    approvalState: ApprovalState
    onApprove(): void
    signature: Signature | undefined
  }): ReactNode
}

export const ApproveBentoboxController: FC<ApproveBentoboxController> = ({
  chainId,
  contract,
  onSuccess,
  enabled = true,
  children,
  onSignature,
}) => {
  const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({
    chainId,
    masterContract: contract,
    enabled: enabled && Boolean(!!contract && !!chainId),
    onSuccess,
    onSignature,
  })

  return <>{children({ approvalState, onApprove, signature })}</>
}
