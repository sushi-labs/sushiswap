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
      <div className="flex flex-col gap-1 justify-center">
        <Dialog.Title as="h3" className="dialog-title">
          {onBack && (
            <ArrowLeftIcon onClick={onBack} width={24} height={24} className="cursor-pointer text-high-emphesis" />
          )}
          {title}
        </Dialog.Title>
      </div>
      {onClose && (
        <div className="flex items-center justify-center w-6 h-6 cursor-pointer" onClick={onClose}>
          <XIcon width={24} height={24} className="text-high-emphesis" />
        </div>
      )}
    </div>
  )
}

export default DialogHeader
