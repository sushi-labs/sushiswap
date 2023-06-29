import { ModalPanel, ModalPanelProps } from './ModalPanel'
import { ModalProvider, ModalProviderProps } from './ModalProvider'
import { ModalTrigger, ModalTriggerProps } from './ModalTrigger'
import { FC } from 'react'
import { ModalReview, ModalReviewProps } from './ModalReview'
import { ModalConfirm, ModalConfirmProps } from './ModalConfirm'

type Modal = {
  Panel: FC<ModalPanelProps>
  Provider: FC<ModalProviderProps>
  Trigger: FC<ModalTriggerProps>
  Review: FC<ModalReviewProps>
  Confirm: FC<ModalConfirmProps>
}

export const Modal: Modal = {
  Panel: ModalPanel,
  Provider: ModalProvider,
  Trigger: ModalTrigger,
  Review: ModalReview,
  Confirm: ModalConfirm,
}
