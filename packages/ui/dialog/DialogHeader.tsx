import { Dialog } from '@headlessui/react'
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import React, { FC, ReactNode } from 'react'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose }) => {
  return (
    <div className="flex items-start justify-between">
      {onBack && (
        <ArrowLeftIcon
          onClick={onBack}
          width={24}
          height={24}
          className="cursor-pointer text-secondary hover:text-high-emphesis"
        />
      )}
      <Dialog.Title as="h3" className="flex gap-4 text-lg font-bold leading-6 text-high-emphesis">
        {title}
      </Dialog.Title>
      {onClose && (
        <div aria-hidden="true" className="flex items-center justify-center w-6 h-6 cursor-pointer" onClick={onClose}>
          <XIcon width={24} height={24} className="text-secondary hover:text-high-emphesis" />
        </div>
      )}
    </div>
  )
}

export default DialogHeader
