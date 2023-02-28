import { FC, ReactNode } from 'react'
import { ApprovalState, useBentoBoxApproveCallback } from '../../hooks'
import { NotificationData } from '@sushiswap/ui/future/components/toast'
import { Signature } from '@ethersproject/bytes'
import { Address } from 'wagmi'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox/exports'

interface ApproveBentoboxController {
  chainId: BentoBoxV1ChainId
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
