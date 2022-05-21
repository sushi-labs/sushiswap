import { Amount, Token } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import { ApprovalButtonRenderProp, ApproveButton } from 'components/Approve/types'
import { ApprovalState, useApproveCallback } from 'hooks'
import { FC, useEffect } from 'react'

interface RenderPropPayload extends ApprovalButtonRenderProp {}

interface TokenApproveButton extends ApproveButton<RenderPropPayload> {
  watch?: boolean
  amount?: Amount<Token>
  address?: string
}

export const TokenApproveButton: FC<TokenApproveButton> = ({ watch = true, amount, address, render, setState }) => {
  const [approvalState, onApprove] = useApproveCallback(watch, amount, address)

  useEffect(() => {
    if (!setState) return

    setState(approvalState)
  }, [approvalState, setState])

  if (!amount || approvalState === ApprovalState.APPROVED) return null
  if (render) return render({ approvalState, onApprove })

  return (
    <Button
      type="button"
      variant="filled"
      color="blue"
      disabled={approvalState === ApprovalState.PENDING}
      onClick={onApprove}
    >
      {approvalState === ApprovalState.PENDING ? (
        <Dots>Approving {amount.currency.symbol}</Dots>
      ) : (
        `Approve ${amount.currency.symbol}`
      )}
    </Button>
  )
}
