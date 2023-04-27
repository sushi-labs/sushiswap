import { ButtonProps } from '@sushiswap/ui'
import { ReactElement } from 'react'

import { ApprovalState } from '../../hooks'
import { ApprovalAction } from './Approve'
import { PromiseNotification } from '@sushiswap/dexie'

export type ApprovalButtonRenderProp = {
  onApprove(): void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps<'button'>, 'onClick'> {
  id?: string
  dispatch?(payload: ApprovalAction): void
  index?: number
  render?: (renderProps: T) => ReactElement
  initialized?: boolean
  allApproved?: boolean
  hideIcon?: boolean
  onSuccess?(data: PromiseNotification): void
  enabled?: boolean
}
