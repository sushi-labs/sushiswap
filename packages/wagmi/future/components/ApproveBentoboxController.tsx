import { FC, ReactNode } from 'react'
import { ApprovalState, useBentoBoxApproveCallback } from '../../hooks'
import { Signature } from '@ethersproject/bytes'
import { Address } from 'wagmi'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { PromiseNotification } from '@sushiswap/dexie'

interface ApproveBentoboxController {
  chainId: BentoBoxV1ChainId
  contract: Address
  enabled?: boolean
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
  enabled = true,
  children,
  onSignature,
}) => {
  const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({
    chainId,
    masterContract: contract,
    enabled: enabled && Boolean(!!contract && !!chainId),
    onSignature,
  })

  return <>{children({ approvalState, onApprove, signature })}</>
}
