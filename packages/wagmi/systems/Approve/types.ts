import { ButtonProps } from '@sushiswap/ui'
import { ReactElement } from 'react'

import { ApprovalState } from '../../hooks'

export type ApprovalButtonRenderProp = {
  onApprove(): void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps<'button'>, 'onClick'> {
  setState?(state: ApprovalState | undefined): void
  render?: (renderProps: T) => ReactElement
}
