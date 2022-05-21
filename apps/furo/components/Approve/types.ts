import { ApprovalState } from 'hooks'
import { ReactElement } from 'react'

export type ApprovalButtonRenderProp = {
  onApprove(): void
  approvalState: ApprovalState
}

export type ApproveButton<T> = {
  setState?(state: ApprovalState): void
  render?: (renderProps: T) => ReactElement
}
