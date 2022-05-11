import { Dialog } from '@headlessui/react'
import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline'
import React, { FC, ReactNode } from 'react'
import classNames from 'classnames'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose }) => {
  return (
    <div className="flex items-start justify-between">
      <div
        aria-hidden="true"
        className={classNames(onBack ? 'cursor-pointer' : '', 'flex gap-4 items-center')}
        {...(onBack && { onClick: onBack })}
      >
        {onBack && (
          <ChevronLeftIcon width={18} height={18} className="cursor-pointer text-high-emphesis hover:text-blue-500" />
        )}
        <Dialog.Title as="h3" className="flex gap-4 text-lg font-bold leading-6 text-high-emphesis">
          {title}
        </Dialog.Title>
      </div>
      {onClose ? (
        <div aria-hidden="true" className="flex items-center justify-center w-6 h-6 cursor-pointer" onClick={onClose}>
          <XIcon width={24} height={24} className="text-high-emphesis hover:text-white" />
        </div>
      ) : (
        <span />
      )}
    </div>
  )
}

export default DialogHeader
