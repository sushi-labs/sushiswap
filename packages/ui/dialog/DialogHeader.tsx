import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { Typography } from '..'
import { IconButton } from '../iconbutton'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
  className?: string
  children?: ReactNode | Array<ReactNode>
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose, className, children }) => {
  return (
    <div className={classNames(className, 'flex items-start justify-between')}>
      <div aria-hidden="true" className={classNames(onBack ? 'cursor-pointer' : '', 'flex gap-2 items-center')}>
        {onBack && (
          <IconButton onClick={onBack} className="rounded-full flex items-center justify-center cursor-pointer">
            <ChevronLeftIcon width={24} height={24} className="cursor-pointer text-slate-100 hover:text-slate-50" />
          </IconButton>
        )}
        <Typography weight={700} as="h3" className="flex gap-4 text-lg font-bold leading-6 text-slate-100">
          {title}
        </Typography>
      </div>
      <div className="flex gap-3 items-center">
        {children}
        {onClose ? (
          <IconButton className="flex items-center justify-center cursor-pointer" onClick={onClose}>
            <XIcon width={24} height={24} className="hover:text-slate-50 text-slate-100" />
          </IconButton>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

export default DialogHeader
