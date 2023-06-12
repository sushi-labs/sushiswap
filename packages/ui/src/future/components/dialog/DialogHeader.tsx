import { XMarkIcon } from '@heroicons/react/20/solid'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { IconButton } from '../IconButton'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
  className?: string
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose, className }) => {
  return (
    <div className={classNames(className, 'flex items-center justify-between py-2')}>
      {onBack && (
        <IconButton
          icon={ChevronLeftIcon}
          iconProps={{
            width: 24,
            height: 24,
            className: 'hover:text-slate-50 dark:text-slate-100 text-gray-400 hover:text-gray-900',
          }}
          className="flex items-center justify-center w-6 h-6 gap-2 cursor-pointer"
          onClick={onBack}
        />
      )}

      <h3 className="font-medium flex justify-center text-xl font-medium leading-6 text-gray-900 dark:text-slate-100">
        {title}
      </h3>

      {onClose && (
        <IconButton
          icon={XMarkIcon}
          iconProps={{
            width: 24,
            height: 24,
            className: 'hover:text-slate-50 dark:text-slate-100 text-gray-600 hover:text-gray-900',
          }}
          className="cursor-pointer"
          onClick={onClose}
        />
      )}
    </div>
  )
}

export default DialogHeader
