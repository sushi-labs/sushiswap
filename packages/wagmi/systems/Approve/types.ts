import { ButtonProps } from '@sushiswap/ui'
import { ReactElement } from 'react'

import { ApprovalState } from '../../hooks'
import { ApprovalAction } from './Approve'

export type ApprovalButtonRenderProp = {
  onApprove(): void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps<'button'>, 'onClick'> {
  dispatch?(payload: ApprovalAction): void
  index?: number
  render?: (renderProps: T) => ReactElement
  initialized?: boolean
  allApproved?: boolean
  hideIcon?: boolean
}
