import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Button } from '@sushiswap/ui'
import { FC, memo, useEffect } from 'react'

import { ApprovalState, useBentoBoxApproveCallback } from '../../hooks'
import { ApprovalButtonRenderProp, ApproveButton } from './types'

interface RenderPropPayload extends ApprovalButtonRenderProp {
  signature: Signature | undefined
}

export interface BentoApproveButton extends ApproveButton<RenderPropPayload> {
  onSignature(sig?: Signature): void
  watch?: boolean
  address?: string
}

export const BentoApproveButton: FC<BentoApproveButton> = memo(
  ({ watch = true, address: masterContract, render, setState, disabled, onSignature, ...props }) => {
    const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({ watch, masterContract })

    useEffect(() => {
      onSignature(signature)
    }, [onSignature, signature])

    useEffect(() => {
      if (!setState) return

      setState(approvalState)
    }, [approvalState, setState])

    if (approvalState === ApprovalState.APPROVED || masterContract === AddressZero) return null
    if (render) return render({ approvalState, signature, onApprove })

    return (
      <Button type="button" {...props} disabled={disabled || !!signature} onClick={onApprove}>
        Approve Bentobox
      </Button>
    )
  }
)
