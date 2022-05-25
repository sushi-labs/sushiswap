import { ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/currency'
import { Button } from '@sushiswap/ui'
import { Signature } from 'ethers'
import React, { FC, memo, useEffect } from 'react'

import { ApprovalState } from '../../useApproveCallback'
import { useBentoBoxApproveCallback } from '../../useBentoBoxApproveCallback'
import { ApprovalButtonRenderProp, ApproveButton } from './types'

interface RenderPropPayload extends ApprovalButtonRenderProp {
  signature: Signature | undefined
}

export interface BentoApproveButton extends ApproveButton<RenderPropPayload> {
  chainId?: ChainId
  onSignature(sig?: Signature): void
  watch?: boolean
  token?: Currency
  address?: string
}

export const BentoApproveButton: FC<BentoApproveButton> = memo(
  ({ chainId, watch = true, token, address, render, setState, disabled, onSignature, ...props }) => {
    const [approvalState, signature, onApprove] = useBentoBoxApproveCallback(watch, address, chainId)

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
