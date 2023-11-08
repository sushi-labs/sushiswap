import { Dialog as HeadlessDialog } from '@headlessui/react/dist/components/dialog/dialog'
import React, { FC } from 'react'
import { ModalPanel } from './ModalPanel'
import { ModalType, useModal } from './ModalProvider'
import { ExtractProps } from '@sushiswap/ui'
export type ModalReviewProps = Omit<
  ExtractProps<typeof HeadlessDialog>,
  'open' | 'onClose'
> & {
  tag: string
  afterLeave?(): void
  children: ({
    close,
    confirm,
  }: { close: () => void; confirm: () => void }) => React.ReactNode
  variant?: 'transparent' | 'opaque'
}

export const ModalReview: FC<ModalReviewProps> = (props) => {
  const { confirm } = useModal(props.tag, ModalType.Review)

  return (
    <ModalPanel {...props} modalType={ModalType.Review}>
      {({ close }) => props.children({ close, confirm })}
    </ModalPanel>
  )
}
