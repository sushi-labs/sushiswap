import { Signature } from '@ethersproject/bytes'
import { Token } from '@sushiswap/currency'
import { Button } from '@sushiswap/ui'
import { ApprovalButtonRenderProp, ApproveButton } from 'components/Approve/types'
import { ApprovalState, useBentoBoxApproveCallback } from 'hooks'
import { FC, memo, useEffect } from 'react'

interface RenderPropPayload extends ApprovalButtonRenderProp {
  signature: Signature | undefined
}

export interface BentoApproveButton extends ApproveButton<RenderPropPayload> {
  onSignature(sig?: Signature): void
  watch?: boolean
  token?: Token
  address?: string
}

export const BentoApproveButton: FC<BentoApproveButton> = memo(
  ({ watch = true, token, address, render, setState, disabled, onSignature, ...props }) => {
    const [approvalState, signature, onApprove] = useBentoBoxApproveCallback(watch, address)

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
  },
)
