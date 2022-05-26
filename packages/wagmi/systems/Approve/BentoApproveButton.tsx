import { Signature } from '@ethersproject/bytes'
import { Currency } from '@sushiswap/currency'
import { Button } from '@sushiswap/ui'
import { FC, memo, useEffect } from 'react'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { useBentoBoxApproveCallback } from '../../hooks/useBentoBoxApproveCallback'
import { ApprovalButtonRenderProp, ApproveButton } from './types'

interface RenderPropPayload extends ApprovalButtonRenderProp {
  signature: Signature | undefined
}

export interface BentoApproveButton extends ApproveButton<RenderPropPayload> {
  onSignature(sig?: Signature): void
  watch?: boolean
  token?: Currency
  address?: string
}

export const BentoApproveButton: FC<BentoApproveButton> = memo(
  ({ watch = true, token, address: masterContract, render, setState, disabled, onSignature, ...props }) => {
    const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({ watch, masterContract })

    useEffect(() => {
      onSignature(signature)
    }, [onSignature, signature])

    useEffect(() => {
      if (!setState) return

      setState(approvalState)
    }, [approvalState, setState])

    if (!token || approvalState === ApprovalState.APPROVED) return null
    if (render) return render({ approvalState, signature, onApprove })

    return (
      <Button type="button" {...props} disabled={disabled || !!signature} onClick={onApprove}>
        Approve Bentobox
      </Button>
    )
  }
)
