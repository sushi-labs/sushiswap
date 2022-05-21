import { ButtonProps } from '@sushiswap/ui'
import { ApprovalState } from 'hooks'
import { ReactElement } from 'react'

export type ApprovalButtonRenderProp = {
  onApprove(): void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps, 'onClick'> {
  setState?(state: ApprovalState): void
  render?: (renderProps: T) => ReactElement
}
