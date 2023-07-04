import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { IconButton } from '../iconbutton'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
  className?: string
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose, className }) => {
  return (
    <div className={classNames(className, 'flex items-center justify-between pb-2')}>
      {onBack && <IconButton size="sm" icon={ChevronLeftIcon} onClick={onBack} name="Back" />}
      <h3 className="font-medium flex justify-center text-xl font-medium leading-6 text-gray-900 dark:text-slate-100">
        {title}
      </h3>

      {onClose && <IconButton size="sm" icon={XMarkIcon} onClick={onClose} name="Close" />}
    </div>
  )
}

export default DialogHeader
