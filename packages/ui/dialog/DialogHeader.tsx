import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { Typography } from '..'
import { IconButton } from '../iconbutton'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
  className?: string
  border?: boolean
  children?: ReactNode | Array<ReactNode>
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose, border = true, className, children }) => {
  return (
    <div
      className={classNames(
        className,
        border ? 'border-b border-slate-200/5' : '',
        'grid grid-cols-[40px_auto_40px] items-center absolute top-0 left-0 right-0 px-3 h-12'
      )}
    >
      {onBack ? (
        <IconButton className="flex items-center justify-center w-6 h-6 gap-2 cursor-pointer" onClick={onBack}>
          <ChevronLeftIcon width={24} height={24} className="cursor-pointer text-slate-100 hover:text-slate-50" />
        </IconButton>
      ) : (
        <div />
      )}

      <Typography weight={500} as="h3" className="flex justify-center text-lg font-medium leading-6 text-slate-100">
        {title}
      </Typography>

      <div className="flex justify-end">
        {children ? (
          children
        ) : onClose ? (
          <IconButton className="cursor-pointer" onClick={onClose}>
            <XMarkIcon width={24} height={24} className="hover:text-slate-50 text-slate-100" />
          </IconButton>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

export default DialogHeader
