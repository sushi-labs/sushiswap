import { ButtonProps } from '@sushiswap/ui'
import { ReactElement } from 'react'

import { ApprovalState } from '../../useApproveCallback'

export type ApprovalButtonRenderProp = {
  onApprove(): void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps, 'onClick'> {
  setState?(state: ApprovalState): void
  render?: (renderProps: T) => ReactElement
}
